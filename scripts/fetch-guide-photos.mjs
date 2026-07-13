#!/usr/bin/env node
// Photo acquisition pipeline for the Field Guide PWA. Run from this dir:
//   cd scripts && npm install
//   node fetch-guide-photos.mjs fetch [--only=<file.jpg>] [--force] [--auto] [--source=commons,pexels] [--licenses=pd,cc0,cc-by,cc-by-sa]
//   node fetch-guide-photos.mjs status
//   node fetch-guide-photos.mjs select <file.jpg> <candidateNumber>
//   node fetch-guide-photos.mjs emit-credits
//
// To fill every empty slot in one pass (no human review, top candidate per
// slot): node fetch-guide-photos.mjs fetch --auto  →  npm run images  →
// node fetch-guide-photos.mjs emit-credits. Spot-check the sources it logs.
//
// The flow: `fetch` queries each enabled photo source per entry in
// data/guide-photo-manifest.json and downloads up to 3 candidates per source
// into data/photo-candidates/<file>/ (gitignored; candidates must never land
// in apps/guide/public/, which deploys wholesale). A human (or a multimodal
// model) reviews the candidates, then `select` normalizes the pick with sharp
// (max 1600px wide, q78 mozjpeg, EXIF stripped by re-encode) into
// apps/guide/public/photos/<file> and records author/license/source in
// data/photo-credits.json. `emit-credits` regenerates the PHOTO_CREDITS
// literal in the PWA from that JSON. After selecting, run `npm run images`
// so the new sources get responsive variants.
//
// Sources:
//   commons — Wikimedia Commons, filtered to commercial-use-safe licenses
//     (the --licenses flag applies here only). Encyclopedically identified:
//     a "Taft Point" hit is almost certainly Taft Point.
//   pexels  — Pexels stock API. Needs the PEXELS_API_KEY env var (free key
//     from pexels.com/api; never commit it). All Pexels photos ship under
//     the Pexels license: free commercial use, no attribution required, but
//     we record photographer + photo-page URL in the credits anyway. CAUTION:
//     stock tagging is loose — a landmark query can return a lookalike from
//     another park, so review Pexels candidates against the real spot before
//     selecting.
// Default source order is commons then pexels (pexels only when the key is
// set); override with --source=. Commons results rank first on purpose: for
// a field guide the photo must show the actual spot.
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
const PEXELS_API = 'https://api.pexels.com/v1/search'
const PEXELS_KEY = process.env.PEXELS_API_KEY ?? ''
const CANDIDATES_PER_SLOT = 3 // per source
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
      provider: 'commons',
      title: page.title,
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

async function pexelsSearch(query) {
  const params = new URLSearchParams({
    query,
    orientation: 'landscape',
    per_page: '10',
  })
  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: PEXELS_KEY, 'User-Agent': USER_AGENT },
  })
  if (res.status === 401) throw new Error('Pexels rejected the key (401) — check PEXELS_API_KEY')
  if (res.status === 429) throw new Error('Pexels rate limit hit (429) — wait an hour and rerun')
  if (!res.ok) throw new Error(`Pexels API ${res.status} for "${query}"`)
  const data = await res.json()
  const out = []
  for (const photo of data?.photos ?? []) {
    if ((photo.width ?? 0) < MIN_WIDTH) continue
    if ((photo.width ?? 0) <= (photo.height ?? 0)) continue // landscape only
    if (!photo.src) continue
    out.push({
      provider: 'pexels',
      title: (photo.alt ?? '').trim() || `Pexels photo ${photo.id}`,
      author: photo.photographer || 'Unknown',
      // Pexels license: free commercial use, no attribution required. We
      // still credit photographer + photo page, same as every other source.
      license: 'Pexels License',
      source: photo.url ?? '',
      width: photo.width,
      height: photo.height,
      // large2x is server-side scaled (~1880px wide); the original can be a
      // 6000px+ file we'd only downscale anyway.
      downloadUrl: photo.src.large2x ?? photo.src.original,
    })
  }
  return out
}

// Uniform (query, enabledLicenses) signature; pexels ignores the license set
// because everything there is Pexels-licensed.
const SOURCES = {
  commons: commonsSearch,
  pexels: (query) => pexelsSearch(query),
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`download ${res.status} ${url}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

// Normalize a downloaded candidate into the deployed photos dir and record
// its credit. Shared by `select` (human pick) and `fetch --auto` (top pick).
async function writeSelection(file, srcJpgPath, cand) {
  await mkdir(PHOTOS_DIR, { recursive: true })
  // rotate() honors EXIF orientation before the metadata is dropped by re-encode.
  await sharp(srcJpgPath)
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
  // --auto: don't stop for human review. Pick the top candidate per slot
  // (Commons first, then Pexels — the default source order), normalize it,
  // and record the credit in one pass. Fills every empty slot with one run;
  // the tradeoff is no eyes-on-target check, so spot-check the sources it
  // logs (a Pexels landmark query can return a lookalike from another park).
  const auto = args.includes('--auto')
  const licensesArg =
    args.find((a) => a.startsWith('--licenses='))?.slice(11) ?? DEFAULT_LICENSES
  const enabled = new Set(licensesArg.split(',').map((s) => s.trim()).filter(Boolean))
  const sourcesArg = args.find((a) => a.startsWith('--source='))?.slice(9)
  const sources = sourcesArg
    ? sourcesArg.split(',').map((s) => s.trim()).filter(Boolean)
    : ['commons', ...(PEXELS_KEY ? ['pexels'] : [])]
  for (const source of sources) {
    if (!SOURCES[source]) {
      console.error(`Unknown source "${source}" (available: ${Object.keys(SOURCES).join(', ')})`)
      process.exit(1)
    }
    if (source === 'pexels' && !PEXELS_KEY) {
      console.error('The pexels source needs the PEXELS_API_KEY env var (free key at pexels.com/api).')
      process.exit(1)
    }
  }
  console.log(`Sources: ${sources.join(', ')}${PEXELS_KEY || sourcesArg ? '' : ' (set PEXELS_API_KEY to include pexels)'}`)

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
          provider: 'manual',
          title: entry.file,
          author: entry.author ?? 'Unknown',
          license: entry.license ?? 'Public domain',
          source: entry.source ?? entry.directUrl,
          width: 0,
          height: 0,
          downloadUrl: entry.directUrl,
        },
      ]
    } else {
      // Per source: first query with results wins, capped per source, then
      // sources concatenate (commons first by default — see header).
      for (const source of sources) {
        let found = []
        for (const query of entry.queries ?? []) {
          try {
            found = await SOURCES[source](query, enabled)
          } catch (err) {
            console.error(`! ${entry.file} [${source}]: ${err.message}`)
            found = []
          }
          if (found.length > 0) break
        }
        picked.push(...found.slice(0, CANDIDATES_PER_SLOT))
      }
    }

    if (picked.length === 0) {
      console.log(`✗ ${entry.file}: no acceptable candidate (queries: ${(entry.queries ?? []).join(' | ')})`)
      await rm(dir, { recursive: true, force: true })
      continue
    }

    const kept = []
    for (const [i, cand] of picked.entries()) {
      const n = i + 1
      try {
        await download(cand.downloadUrl, path.join(dir, `${n}.jpg`))
        kept.push({ n, ...cand })
        console.log(`  ↓ ${entry.file} candidate ${n} (${cand.provider}): ${cand.title} [${cand.license}]`)
      } catch (err) {
        console.error(`  ! ${entry.file} candidate ${n}: ${err.message}`)
      }
    }
    if (kept.length === 0) {
      console.log(`✗ ${entry.file}: every candidate download failed`)
      await rm(dir, { recursive: true, force: true })
      continue
    }

    if (auto) {
      const top = kept[0]
      try {
        await writeSelection(entry.file, path.join(dir, `${top.n}.jpg`), top)
        await rm(dir, { recursive: true, force: true })
        fetched++
        console.log(`  ✓ auto-filled ${entry.file} (${top.provider}, ${top.author}): ${top.source || top.title}`)
      } catch (err) {
        console.error(`  ! ${entry.file}: could not normalize top candidate: ${err.message}`)
        await rm(dir, { recursive: true, force: true })
      }
      continue
    }

    await writeFile(path.join(dir, 'meta.json'), JSON.stringify(kept, null, 2))
    fetched++
    console.log(`✓ ${entry.file}: ${kept.length} candidate(s) ready for review`)
  }
  if (auto) {
    console.log(`\n${fetched} slot(s) auto-filled. Next: \`npm run images\` for responsive variants, then \`node fetch-guide-photos.mjs emit-credits\`.`)
    console.log('Spot-check the sources logged above — auto-fill does no eyes-on-target check.')
  } else {
    console.log(`\n${fetched} slot(s) fetched. Review candidates, then: node fetch-guide-photos.mjs select <file> <n>`)
  }
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

  await writeSelection(file, path.join(dir, `${n}.jpg`), cand)
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
    console.log('  fetch --auto            fill every empty slot with its top candidate (no review)')
    console.log('  fetch --source=pexels   restrict to one source (default: commons,pexels)')
    process.exit(cmd ? 1 : 0)
}
