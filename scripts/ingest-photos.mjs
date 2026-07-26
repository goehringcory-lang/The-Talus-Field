#!/usr/bin/env node
// Photo ingest for house photography — the front door for photos shot by the
// owner, as opposed to fetch-guide-photos.mjs, which acquires licensed photos
// from Commons/Pexels. Run from this dir:
//
//   node ingest-photos.mjs            (or: npm --prefix scripts run photos:ingest)
//   node ingest-photos.mjs --dry-run
//   node ingest-photos.mjs --replace  (overwrite an existing target file)
//
// The flow: drop camera files into the gitignored inbox at the repo root,
// sorted by destination, then run one command.
//
//   photo-inbox/editorial/tunnel-view-winter.jpg  ->  img/tunnel-view-winter.jpg
//   photo-inbox/guide/camp-4.jpg                  ->  apps/guide/public/photos/camp-4.jpg
//
// SHOOT JPEG, NOT HEIC. Verified July 2026 against a real HEVC-encoded file:
// sharp's prebuilt libvips omits the HEVC decoder ("Support for this
// compression format has not been built in"), and its heif loader advertises
// only '.avif'. sharp.format.heif.input.file reads true anyway, so that flag
// is NOT a usable capability check. On iPhone: Settings > Camera > Formats >
// "Most Compatible". The ingest detects HEVC and says so rather than failing
// at the write.
//
// For each file it: reads EXIF (logging GPS to a gitignored sidecar before it
// is destroyed), applies EXIF orientation, downscales, re-encodes as mozjpeg
// with ALL metadata stripped, and writes the slug-named result into the target
// folder. Then it runs gen-responsive-images.mjs for the variants, records a
// house-photography credit for guide photos, and prints the reference snippet
// to paste into data.js / stops.ts.
//
// Why each step exists (all of these bit us or would have):
//   - EXIF orientation: gen-responsive-images.mjs does NOT call .rotate(), so a
//     portrait phone photo dropped straight into img/ comes out sideways in
//     every variant. Every photo in the repo today was pre-normalized by
//     fetch-guide-photos.mjs, which is why nothing has hit this yet.
//   - Metadata stripping: img/ and apps/guide/public/photos/ deploy WHOLESALE,
//     originals included. Un-stripped EXIF publishes the camera's GPS fix, so a
//     photo shot at home publishes a home address. sharp drops metadata on
//     re-encode by default; this script never re-enables it.
//   - Downscaling: the widths ladder tops out at 1600. A 25 MB camera original
//     ships 25 MB to no benefit, and git keeps every version of it forever.
//   - Camera-default filenames: the responsive pipeline has no manifest — the
//     browser derives variant URLs by slugifying the filename. IMG_4823.HEIC
//     would become a permanent `img-4823` in stops.ts, so those are skipped
//     with instructions rather than silently accepted.
//   - Collision: /img/* is served `immutable, max-age=2592000`. Reusing a
//     filename means up to 30 days of the old photo, so an existing target is
//     an error unless --replace is passed knowingly.

import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPTS, '..')
const INBOX = path.join(ROOT, 'photo-inbox')
const CREDITS_PATH = path.join(SCRIPTS, 'data/photo-credits.json')
const EXIF_LOG = path.join(SCRIPTS, 'data/photo-exif-log.json')

// Destination per inbox subfolder. `maxWidth` matches what each surface needs:
// the responsive ladder tops out at 1600, so anything past that is generator
// headroom only. The guide number mirrors FINAL_MAX_WIDTH in
// fetch-guide-photos.mjs so house and licensed photos land at the same size.
const TARGETS = {
  editorial: {
    dir: path.join(ROOT, 'img'),
    maxWidth: 2000,
    quality: 82,
    refHint: (file) => `  image: "img/${file}",   // in data.js`,
  },
  guide: {
    dir: path.join(ROOT, 'apps/guide/public/photos'),
    maxWidth: 1600,
    quality: 78,
    credits: true,
    refHint: (file) =>
      `    photos: [{ src: '/photos/${file}', caption: '' }],   // in stops.ts`,
  },
}

// Anything libvips can read and that a camera or phone plausibly produces.
const SOURCE_RE = /\.(jpe?g|heic|heif|png|webp|tiff?|dng)$/i

// Camera/phone default filenames. These carry no meaning and the filename is
// the permanent URL key, so they are skipped rather than ingested.
const CAMERA_NAME_RE = /^(img|dsc|dscn|dscf|pxl|gopr|dji|_mg_|p\d{7}|\d+)[-_]?\d*$/i

// Below this the responsive ladder just repeats the source bytes at every
// width, and og cards have nothing to work with.
const MIN_USEFUL_WIDTH = 1600
const MIN_OG_WIDTH = 1200

const DEFAULT_AUTHOR = 'Cory Goehring'

function slugify(basename) {
  return basename
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return fallback
  }
}

// ---------------------------------------------------------------------------
// Minimal EXIF reader. Hand-rolled rather than pulling exif-reader because we
// need exactly four things (GPS, capture time, make/model) and the tooling's
// dependency list is deliberately short. Returns {} on anything malformed —
// EXIF is a nice-to-have here, never a reason to fail an ingest.
// ---------------------------------------------------------------------------

const TYPE_SIZES = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 }

function readExif(buf) {
  if (!buf || buf.length < 8) return {}
  // sharp hands back the blob starting at the "Exif\0\0" header on JPEG, and
  // at the bare TIFF header on some other containers.
  let tiff = 0
  if (buf.slice(0, 4).toString('latin1') === 'Exif') tiff = 6
  if (buf.length < tiff + 8) return {}

  const order = buf.slice(tiff, tiff + 2).toString('latin1')
  if (order !== 'II' && order !== 'MM') return {}
  const le = order === 'II'
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o))

  if (u16(tiff + 2) !== 42) return {}
  const ifd0 = tiff + u32(tiff + 4)

  function entries(ifdOffset) {
    const out = new Map()
    if (ifdOffset < 0 || ifdOffset + 2 > buf.length) return out
    const count = u16(ifdOffset)
    // A corrupt count can claim thousands of entries; bound the walk.
    if (count > 512) return out
    for (let i = 0; i < count; i++) {
      const e = ifdOffset + 2 + i * 12
      if (e + 12 > buf.length) break
      const tag = u16(e)
      const type = u16(e + 2)
      const n = u32(e + 4)
      const size = (TYPE_SIZES[type] ?? 0) * n
      if (!size) continue
      const at = size <= 4 ? e + 8 : tiff + u32(e + 8)
      if (at < 0 || at + size > buf.length) continue
      out.set(tag, { type, n, at })
    }
    return out
  }

  const ascii = (ent) =>
    buf
      .slice(ent.at, ent.at + ent.n)
      .toString('latin1')
      .replace(/\0.*$/, '')
      .trim()

  const rationals = (ent) => {
    const out = []
    for (let i = 0; i < ent.n; i++) {
      const o = ent.at + i * 8
      const num = u32(o)
      const den = u32(o + 4)
      out.push(den === 0 ? 0 : num / den)
    }
    return out
  }

  const root = entries(ifd0)
  const info = {}

  if (root.has(0x010f)) info.make = ascii(root.get(0x010f))
  if (root.has(0x0110)) info.model = ascii(root.get(0x0110))

  // Both sub-IFD pointers are a single LONG, so `at` points at the value inline.
  const exifPtr = root.get(0x8769)
  if (exifPtr) {
    const sub = entries(tiff + u32(exifPtr.at))
    if (sub.has(0x9003)) info.taken = ascii(sub.get(0x9003))
    else if (sub.has(0x9004)) info.taken = ascii(sub.get(0x9004))
  }

  const gpsPtr = root.get(0x8825)
  if (gpsPtr) {
    const gps = entries(tiff + u32(gpsPtr.at))
    const lat = gps.get(0x0002)
    const lon = gps.get(0x0004)
    if (lat && lon && lat.n === 3 && lon.n === 3) {
      const [ld, lm, ls] = rationals(lat)
      const [od, om, os] = rationals(lon)
      const latRef = gps.has(0x0001) ? ascii(gps.get(0x0001)) : 'N'
      const lonRef = gps.has(0x0003) ? ascii(gps.get(0x0003)) : 'E'
      const latDeg = (ld + lm / 60 + ls / 3600) * (/S/i.test(latRef) ? -1 : 1)
      const lonDeg = (od + om / 60 + os / 3600) * (/W/i.test(lonRef) ? -1 : 1)
      if (Number.isFinite(latDeg) && Number.isFinite(lonDeg)) {
        info.coord = [Number(latDeg.toFixed(6)), Number(lonDeg.toFixed(6))]
      }
    }
    const alt = gps.get(0x0006)
    if (alt && alt.n === 1) {
      const m = rationals(alt)[0]
      if (Number.isFinite(m)) info.altitudeFt = Math.round(m * 3.28084)
    }
  }

  return info
}

// ---------------------------------------------------------------------------

async function collect() {
  if (!existsSync(INBOX)) return { jobs: [], loose: [] }
  const jobs = []
  const loose = []
  for (const entry of await readdir(INBOX, { withFileTypes: true })) {
    if (entry.isFile() && SOURCE_RE.test(entry.name)) {
      loose.push(entry.name)
      continue
    }
    if (!entry.isDirectory()) continue
    const target = TARGETS[entry.name]
    if (!target) continue
    const dir = path.join(INBOX, entry.name)
    for (const file of await readdir(dir)) {
      if (!SOURCE_RE.test(file)) continue
      jobs.push({ surface: entry.name, target, src: path.join(dir, file), name: file })
    }
  }
  return { jobs, loose }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const replace = args.includes('--replace')
  const author = args.find((a) => a.startsWith('--author='))?.slice(9) || DEFAULT_AUTHOR

  const { jobs, loose } = await collect()

  if (!existsSync(INBOX)) {
    await mkdir(path.join(INBOX, 'editorial'), { recursive: true })
    await mkdir(path.join(INBOX, 'guide'), { recursive: true })
    console.log(`Created the inbox at ${path.relative(ROOT, INBOX)}/`)
    console.log('  editorial/  -> img/                        (articles, hero images)')
    console.log('  guide/      -> apps/guide/public/photos/   (PWA stops)')
    console.log('\nDrop photos in, name them for their subject, and rerun.')
    return
  }

  if (loose.length) {
    console.log(`! ${loose.length} file(s) sitting loose in photo-inbox/ with no destination:`)
    for (const f of loose) console.log(`    ${f}`)
    console.log('  Move them into photo-inbox/editorial/ or photo-inbox/guide/.\n')
  }

  if (!jobs.length) {
    console.log('Nothing to ingest. Drop photos into photo-inbox/editorial/ or photo-inbox/guide/.')
    process.exit(loose.length ? 1 : 0)
  }

  const done = []
  const skipped = []
  const exifLog = await readJson(EXIF_LOG, {})

  for (const job of jobs) {
    const slug = slugify(job.name)
    const rel = `photo-inbox/${job.surface}/${job.name}`

    if (!slug) {
      skipped.push(`${rel}: filename has no usable characters`)
      continue
    }
    if (CAMERA_NAME_RE.test(slug)) {
      skipped.push(
        `${rel}: camera-default filename. Rename it for its subject (e.g. "camp-4-morning.jpg") — ` +
          `the filename becomes the permanent URL key and the reference in stops.ts/data.js.`,
      )
      continue
    }

    const outName = `${slug}.jpg`
    const outPath = path.join(job.target.dir, outName)
    if (existsSync(outPath) && !replace) {
      skipped.push(
        `${rel}: ${path.relative(ROOT, outPath)} already exists. Pick a new name, or pass --replace ` +
          `knowing /img/* is cached immutable for 30 days and viewers may see the old photo until then.`,
      )
      continue
    }

    let meta
    try {
      meta = await sharp(job.src).metadata()
    } catch (err) {
      const heic = /\.hei[cf]$/i.test(job.name)
      skipped.push(
        heic
          ? `${rel}: could not decode HEIC. This sharp build's libvips omits HEVC decode. ` +
            `Set the iPhone to Settings > Camera > Formats > "Most Compatible" to shoot JPEG, ` +
            `or export as JPEG before dropping it in. (${err.message})`
          : `${rel}: could not read (${err.message})`,
      )
      continue
    }

    // sharp's prebuilt libvips ships libheif WITHOUT the HEVC decoder — its
    // heif loader advertises fileSuffix ['.avif'] and nothing else. The trap
    // is that metadata() still SUCCEEDS on an iPhone HEIC: it parses the
    // container and reports compression 'hevc'. Only the pixel decode fails,
    // with "Support for this compression format has not been built in". Catch
    // it here, or a real iPhone photo dies at the write with a raw stack.
    // AVIF (compression 'av1') goes through the same loader and does work.
    if (meta.format === 'heif' && meta.compression && meta.compression !== 'av1') {
      skipped.push(
        `${rel}: HEIC/${meta.compression.toUpperCase()} cannot be decoded — this sharp build's libvips ` +
          `omits the HEVC decoder. Set the iPhone to Settings > Camera > Formats > "Most Compatible" ` +
          `to shoot JPEG from now on, and export any existing HEICs to JPEG before dropping them in.`,
      )
      continue
    }

    // Orientation is applied by .rotate() below, so post-rotation width is what
    // the ladder actually sees.
    const swaps = (meta.orientation ?? 1) >= 5
    const width = swaps ? meta.height : meta.width
    const height = swaps ? meta.width : meta.height

    const notes = []
    if (width < MIN_OG_WIDTH) {
      notes.push(`only ${width}px wide — too small for a 1200px social card`)
    } else if (width < MIN_USEFUL_WIDTH) {
      notes.push(`only ${width}px wide — the 1600 variant will repeat the source`)
    }
    if (height > width && job.surface === 'guide') {
      notes.push('portrait — guide cards and region headers are laid out landscape')
    }

    const exif = readExif(meta.exif)
    if (exif.coord || exif.taken) {
      // Logged BEFORE the re-encode destroys it, to a gitignored file. This is
      // the only place the capture GPS survives; it never reaches the repo.
      exifLog[`${job.surface}/${outName}`] = {
        ingestedFrom: job.name,
        ...(exif.taken ? { taken: exif.taken } : {}),
        ...(exif.coord ? { coord: exif.coord } : {}),
        ...(exif.altitudeFt != null ? { altitudeFt: exif.altitudeFt } : {}),
        ...(exif.make || exif.model ? { camera: [exif.make, exif.model].filter(Boolean).join(' ') } : {}),
      }
    }

    if (dryRun) {
      done.push({ job, outName, outPath, width, height, notes, exif, bytes: 0, srcBytes: 0 })
      continue
    }

    await mkdir(job.target.dir, { recursive: true })
    try {
      // .rotate() with no argument applies the EXIF orientation. No
      // .keepMetadata()/.withMetadata() call anywhere: sharp strips metadata on
      // re-encode by default, which is exactly what we want.
      await sharp(job.src)
        .rotate()
        .resize({ width: job.target.maxWidth, withoutEnlargement: true })
        .jpeg({ quality: job.target.quality, mozjpeg: true })
        .toFile(outPath)
    } catch (err) {
      // A codec this libvips lacks fails HERE, not at metadata() — one file
      // must not take down a batch, and the operator needs the reason.
      skipped.push(`${rel}: could not decode the image data (${err.message.split('\n')[0]})`)
      continue
    }

    const [srcStat, outStat] = await Promise.all([stat(job.src), stat(outPath)])
    done.push({
      job,
      outName,
      outPath,
      width,
      height,
      notes,
      exif,
      bytes: outStat.size,
      srcBytes: srcStat.size,
    })
  }

  const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`
  console.log(dryRun ? 'DRY RUN — nothing written.\n' : '')
  for (const d of done) {
    const size = d.bytes ? ` (${mb(d.srcBytes)} -> ${mb(d.bytes)})` : ''
    console.log(`  ${dryRun ? 'would write' : 'wrote'} ${path.relative(ROOT, d.outPath)}${size}`)
    if (d.exif.coord) console.log(`      exif gps ${d.exif.coord[0]}, ${d.exif.coord[1]} -> logged locally, stripped from the file`)
    for (const n of d.notes) console.log(`      note: ${n}`)
  }

  if (skipped.length) {
    console.log(`\n${skipped.length} skipped:`)
    for (const s of skipped) console.log(`  ✗ ${s}`)
  }

  if (dryRun || !done.length) {
    if (!done.length) console.log('\nNothing ingested.')
    process.exit(skipped.length ? 1 : 0)
  }

  if (Object.keys(exifLog).length) {
    const sorted = Object.fromEntries(Object.entries(exifLog).sort(([a], [b]) => a.localeCompare(b)))
    await writeFile(EXIF_LOG, JSON.stringify(sorted, null, 2) + '\n')
  }

  // House-photography credits for guide photos. photoCredits.ts keys on the
  // src path exactly as written in stops.ts.
  const guidePhotos = done.filter((d) => d.job.target.credits)
  if (guidePhotos.length) {
    const credits = await readJson(CREDITS_PATH, {})
    for (const d of guidePhotos) {
      credits[`/photos/${d.outName}`] = { author, license: 'All rights reserved', source: '' }
    }
    const sorted = Object.fromEntries(Object.entries(credits).sort(([a], [b]) => a.localeCompare(b)))
    await writeFile(CREDITS_PATH, JSON.stringify(sorted, null, 2) + '\n')
    console.log(`\n✓ ${guidePhotos.length} credit(s) recorded for ${author}`)
  }

  console.log('\nGenerating responsive variants...')
  const images = spawnSync(process.execPath, [path.join(SCRIPTS, 'gen-responsive-images.mjs')], {
    stdio: 'inherit',
  })
  if (images.status !== 0) {
    console.error('! gen-responsive-images.mjs failed — rerun `npm --prefix scripts run images`')
    process.exit(1)
  }

  if (guidePhotos.length) {
    const emit = spawnSync(
      process.execPath,
      [path.join(SCRIPTS, 'fetch-guide-photos.mjs'), 'emit-credits'],
      { stdio: 'inherit' },
    )
    if (emit.status !== 0) {
      console.error('! emit-credits failed — rerun `node fetch-guide-photos.mjs emit-credits`')
      process.exit(1)
    }
  }

  console.log('\nReference these where they belong:\n')
  for (const d of done) console.log(d.job.target.refHint(d.outName))

  console.log('\nThen: delete the originals from photo-inbox/, and commit the new')
  console.log('sources together with their responsive/ variants.')
  process.exit(skipped.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
