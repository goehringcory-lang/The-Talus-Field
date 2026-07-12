#!/usr/bin/env node
// Photo acquisition pipeline for the Field Guide PWA. Run from this dir:
//   cd scripts && npm install
//   node fetch-guide-photos.mjs fetch [--only=<file.jpg>] [--force] [--licenses=pd,cc0,cc-by,cc-by-sa]
//   node fetch-guide-photos.mjs status
//   node fetch-guide-photos.mjs select <file.jpg> <candidateNumber>
//   node fetch-guide-photos.mjs emit-credits
//
// The flow: `fetch` queries the Wikimedia Commons API per entry in
// data/guide-photo-manifest.json, filters candidates to commercial-use-safe
// licenses, and downloads up to 3 per slot into data/photo-candidates/<file>/
// (gitignored; candidates must never land in apps/guide/public/, which
// deploys wholesale). A human (or a multimodal model) reviews the candidates,
// then `select` normalizes the pick with sharp (max 1600px wide, q78 mozjpeg,
// EXIF stripped by re-encode) into apps/guide/public/photos/<file> and
// records author/license/source in data/photo-credits.json. `emit-credits`
// regenerates the PHOTO_CREDITS literal in the PWA from that JSON. After
// selecting, run `npm run images` so the new sources get responsive variants.
//
// Manifest filenames must already be slug-form (lowercase-hyphen .jpg) so the
// slugify() in apps/guide/src/utils/photo.ts and gen-responsive-images.mjs is
// a no-op on them and derived URLs match the filename exactly.

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPTS, '..')
const MANIFEST_PATH = path.join(SCRIPTS, 'data/guide-photo-manifest.json')
const CREDITS_PATH = path.join(SCRIPTS, 'data/photo-credits.json')
const CANDIDATES_DIR = path.join(SCRIPTS, 'data/photo-candidates')
const PHOTOS_DIR = path.join(ROOT, 'apps/guide/public/photos')
const CREDITS_TS = path.join(ROOT, 'apps/guide/src/content/photoCredits.ts')

// Wikimedia rejects requests with a blank/default UA.
const USER_AGENT =
  'TalusFieldGuide-photos/1.0 (https://thetalusfieldjournal.com; goehring.cory@gmail.com)'

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'
const CANDIDATES_PER_SLOT = 3
const MIN_WIDTH = 1200
const THUMB_WIDTH = 1800 // never the original: Commons originals can be 100 MB TIFFs
const FINAL_MAX_WIDTH = 1600

// License classes, in preference order. Keys match the --licenses flag.
const LICENSE_CLASSES = [
  { key: 'pd', rank: 0, test: (s) => /^public domain$/i.test(s) || /^pd/i.test(s) },
  { key: 'cc0', rank: 0, test: (s) => /^cc0/i.test(s) },
  { key: 'cc-by', rank: 1, test: (s) => /^cc by \d/i.test(s) },
  { key: 'cc-by-sa', rank: 2, test: (s) => /^cc by-sa \d/i.test(s) },
]
const DEFAULT_LICENSES = 'pd,cc0,cc-by,cc-by-sa'

function stripHtml(s) {
  return String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return fallback
  }
}

async function loadManifest() {
  const manifest = await readJson(MANIFEST_PATH, null)
  if (!Array.isArray(manifest)) {
    console.error(`Missing or invalid ${path.relative(ROOT, MANIFEST_PATH)}`)
    process.exit(1)
  }
  return manifest
}

function licenseClass(shortName, enabled) {
  for (const cls of LICENSE_CLASSES) {
    if (!enabled.has(cls.key)) continue
    if (cls.test(shortName)) return cls
  }
  return null
}

async function commonsSearch(query, enabled) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    iiurlwidth: String(THUMB_WIDTH),
  })
  const res = await fetch(`${COMMONS_API}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  })
  if (!res.ok) throw new Error(`Commons API ${res.status} for "${query}"`)
  const data = await res.json()
  const pages = Object.values(data?.query?.pages ?? {})
  const out = []
  for (const page of pages) {
    const info = page?.imageinfo?.[0]
    if (!info) continue
    const meta = info.extmetadata ?? {}
    const licenseShort = stripHtml(meta.LicenseShortName?.value ?? '')
    const cls = licenseClass(licenseShort, enabled)
    if (!cls) continue
    if (!/jpeg|png/i.test(info.mime ?? '')) continue
    if ((info.width ?? 0) < MIN_WIDTH) continue
    if ((info.width ?? 0) <= (info.height ?? 0)) continue // landscape only
    const author = stripHtml(meta.Artist?.value ?? '')
    // CC licenses legally require attribution; a nameless CC photo is
    // unusable. Public domain tolerates an unknown author.
    if (cls.rank > 0 && !author) continue
    out.push({
      commonsTitle: page.title,
      author: author || 'Unknown (public domain)',
      license: licenseShort,
      licenseRank: cls.rank,
      source: info.descriptionurl ?? '',
      width: info.width,
      height: info.height,
      // thumburl is the server-side scaled JPEG; fall back to the original
      // only if scaling was unavailable.
      downloadUrl: info.thumburl ?? info.url,
      searchIndex: out.length,
    })
  }
  // Preference: PD/CC0 before CC BY before CC BY-SA; API relevance order within a class.
  return out.sort((a, b) => a.licenseRank - b.licenseRank || a.searchIndex - b.searchIndex)
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`download ${res.status} ${url}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

function slotState(entry) {
  if (entry.reuse) return 'reuse'
  if (existsSync(path.join(PHOTOS_DIR, entry.file))) return 'filled'
  if (existsSync(path.join(CANDIDATES_DIR, entry.file, 'meta.json'))) return 'candidates'
  return 'empty'
}

async function cmdFetch(args) {
  const manifest = await loadManifest()
  const only = args.find((a) => a.startsWith('--only='))?.slice(7)
  const force = args.includes('--force')
  const licensesArg =
    args.find((a) => a.startsWith('--licenses='))?.slice(11) ?? DEFAULT_LICENSES
  const enabled = new Set(licensesArg.split(',').map((s) => s.trim()).filter(Boolean))

  let fetched = 0
  for (const entry of manifest) {
    if (only && entry.file !== only) continue
    const state = slotState(entry)
    if (state === 'reuse') continue
    if (state === 'filled' && !force) continue
    if (state === 'candidates' && !force) {
      console.log(`~ ${entry.file}: candidates already downloaded (use --force to redo)`)
      continue
    }

    const dir = path.join(CANDIDATES_DIR, entry.file)
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })

    let picked = []
    if (entry.directUrl) {
      // Hand-picked escape hatch: license metadata must come from the manifest.
      picked = [
        {
          commonsTitle: entry.file,
          author: entry.author ?? 'Unknown',
          license: entry.license ?? 'Public domain',
          source: entry.source ?? entry.directUrl,
          width: 0,
          height: 0,
          downloadUrl: entry.directUrl,
        },
      ]
    } else {
      for (const query of entry.queries ?? []) {
        try {
          picked = await commonsSearch(query, enabled)
        } catch (err) {
          console.error(`! ${entry.file}: ${err.message}`)
          picked = []
        }
        if (picked.length > 0) break
      }
    }

    if (picked.length === 0) {
      console.log(`✗ ${entry.file}: no acceptable candidate (queries: ${(entry.queries ?? []).join(' | ')})`)
      await rm(dir, { recursive: true, force: true })
      continue
    }

    const kept = []
    for (const [i, cand] of picked.slice(0, CANDIDATES_PER_SLOT).entries()) {
      const n = i + 1
      try {
        await download(cand.downloadUrl, path.join(dir, `${n}.jpg`))
        kept.push({ n, ...cand })
        console.log(`  ↓ ${entry.file} candidate ${n}: ${cand.commonsTitle} [${cand.license}]`)
      } catch (err) {
        console.error(`  ! ${entry.file} candidate ${n}: ${err.message}`)
      }
    }
    if (kept.length === 0) {
      console.log(`✗ ${entry.file}: every candidate download failed`)
      await rm(dir, { recursive: true, force: true })
      continue
    }
    await writeFile(path.join(dir, 'meta.json'), JSON.stringify(kept, null, 2))
    fetched++
    console.log(`✓ ${entry.file}: ${kept.length} candidate(s) ready for review`)
  }
  console.log(`\n${fetched} slot(s) fetched. Review candidates, then: node fetch-guide-photos.mjs select <file> <n>`)
}

async function cmdStatus() {
  const manifest = await loadManifest()
  const counts = { filled: 0, candidates: 0, empty: 0, reuse: 0 }
  for (const entry of manifest) {
    const state = slotState(entry)
    counts[state]++
    const mark =
      state === 'filled' ? '✓' : state === 'candidates' ? '~' : state === 'reuse' ? '=' : '✗'
    console.log(`${mark} [tier ${entry.tier}] ${entry.file} (${entry.slot}) — ${state}`)
  }
  console.log(
    `\n${counts.filled} filled · ${counts.candidates} awaiting selection · ${counts.empty} empty · ${counts.reuse} reuse`,
  )
}

async function cmdSelect(args) {
  const [file, nRaw] = args
  const n = Number(nRaw)
  if (!file || !Number.isInteger(n)) {
    console.error('usage: node fetch-guide-photos.mjs select <file.jpg> <candidateNumber>')
    process.exit(1)
  }
  const dir = path.join(CANDIDATES_DIR, file)
  const meta = await readJson(path.join(dir, 'meta.json'), null)
  const cand = Array.isArray(meta) ? meta.find((c) => c.n === n) : null
  if (!cand || !existsSync(path.join(dir, `${n}.jpg`))) {
    console.error(`No candidate ${n} for ${file}. Run fetch first, or check status.`)
    process.exit(1)
  }

  await mkdir(PHOTOS_DIR, { recursive: true })
  // rotate() honors EXIF orientation before the metadata is dropped by re-encode.
  await sharp(path.join(dir, `${n}.jpg`))
    .rotate()
    .resize({ width: FINAL_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(PHOTOS_DIR, file))

  const credits = await readJson(CREDITS_PATH, {})
  credits[`/photos/${file}`] = {
    author: cand.author,
    license: cand.license,
    source: cand.source,
  }
  const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(CREDITS_PATH, JSON.stringify(sorted, null, 2) + '\n')
  await rm(dir, { recursive: true, force: true })
  console.log(`✓ ${file} ← candidate ${n} (${cand.author}, ${cand.license})`)
  console.log('Run `npm run images` for responsive variants and `node fetch-guide-photos.mjs emit-credits` when done selecting.')
}

async function cmdEmitCredits() {
  const credits = await readJson(CREDITS_PATH, {})
  const entries = Object.entries(credits).sort(([a], [b]) => a.localeCompare(b))
  const lines = ['export const PHOTO_CREDITS: Record<string, PhotoCredit> = {']
  for (const [src, c] of entries) {
    lines.push(
      `  ${JSON.stringify(src)}: { author: ${JSON.stringify(c.author)}, license: ${JSON.stringify(c.license)}, source: ${JSON.stringify(c.source ?? '')} },`,
    )
  }
  lines.push('}')

  const ts = await readFile(CREDITS_TS, 'utf8')
  const begin = '// BEGIN GENERATED'
  const end = '// END GENERATED'
  const bi = ts.indexOf(begin)
  const ei = ts.indexOf(end)
  if (bi < 0 || ei < 0 || ei < bi) {
    console.error(`GENERATED markers missing in ${path.relative(ROOT, CREDITS_TS)}`)
    process.exit(1)
  }
  const next =
    ts.slice(0, bi + begin.length) + '\n' + lines.join('\n') + '\n' + ts.slice(ei)
  await writeFile(CREDITS_TS, next)
  console.log(`✓ ${entries.length} credit(s) written to ${path.relative(ROOT, CREDITS_TS)}`)
}

async function cmdVerify() {
  // Every manifest slot filled (or reuse), and every final file has its
  // smallest responsive variant. Non-zero exit on gaps, for use in checks.
  const manifest = await loadManifest()
  let missing = 0
  for (const entry of manifest) {
    const state = slotState(entry)
    if (state === 'reuse') continue
    if (state !== 'filled') {
      console.error(`✗ ${entry.file}: ${state}`)
      missing++
      continue
    }
    const slug = entry.file.replace(/\.[^.]+$/, '')
    if (!existsSync(path.join(PHOTOS_DIR, 'responsive', `${slug}-400.jpg`))) {
      console.error(`✗ ${entry.file}: missing responsive variants (run npm run images)`)
      missing++
    }
  }
  if (missing === 0) console.log(`✓ all ${manifest.length} slots resolved`)
  process.exit(missing === 0 ? 0 : 1)
}

const [cmd, ...args] = process.argv.slice(2)
switch (cmd) {
  case 'fetch':
    await cmdFetch(args)
    break
  case 'status':
    await cmdStatus()
    break
  case 'select':
    await cmdSelect(args)
    break
  case 'emit-credits':
    await cmdEmitCredits()
    break
  case 'verify':
    await cmdVerify()
    break
  default:
    console.log('usage: node fetch-guide-photos.mjs <fetch|status|select|emit-credits|verify> [args]')
    process.exit(cmd ? 1 : 0)
}
