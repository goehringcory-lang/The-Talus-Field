// Generates the PWA icon set and in-app brand assets from the Talus Field
// mark at the repo root (img/talus-field-mark.png), the same illustration the
// editorial masthead uses. Run manually after changing the mark:
//
//   node scripts/generate-icons.mjs
//
// Outputs use versioned (.v2) and /brand/ paths on purpose: the service
// worker's runtime cache is unversioned and skips URLs it has already cached,
// so replacing art at an existing URL would never reach installed clients.
// If a rerun ever changes these bytes, rename to the next suffix and update
// every reader — manifest.webmanifest, index.html, sw.js (RUNTIME_PRECACHE
// plus the push icon/badge), and the components that render the lockup.
// A rerun that produces identical bytes needs no rename: the August 2026 mark
// swap was one of those, because it only recropped the source canvas and
// everything below trims that away.

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const brandDir = join(publicDir, 'brand')
// Repo-root master, shared with the editorial masthead.
const sourcePath = join(root, '..', '..', 'img', 'talus-field-mark.png')

const PAPER = '#f1ead6'

// Trim the transparent border so every framing decision below measures the
// illustration rather than the canvas it was exported on. This used to extract
// a fixed 960x645 window first, because the source carried a small sparkle
// glyph in the bottom-right corner that defeated the trim. The August 2026 mark
// is delivered already cropped to the rockfield with the sparkle gone, and the
// fixed window is now both pointless and wider than the source, which would
// throw. If a future export reintroduces stray marks outside the illustration,
// crop them at the source rather than re-adding a magic rectangle here.
async function trimmedMark() {
  return sharp(sourcePath).trim().png().toBuffer()
}

// Center the mark on a paper square. App icons must be opaque: iOS renders
// transparency as black.
async function writeIcon(mark, canvas, markWidth, outfile) {
  const inner = await sharp(mark)
    .resize({ width: markWidth, fit: 'inside' })
    .png({ palette: true, compressionLevel: 9 })
    .toBuffer()
  const meta = await sharp(inner).metadata()
  await sharp({
    create: { width: canvas, height: canvas, channels: 4, background: PAPER },
  })
    .composite([
      {
        input: inner,
        top: Math.round((canvas - meta.height) / 2),
        left: Math.round((canvas - meta.width) / 2),
      },
    ])
    .flatten({ background: PAPER })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(outfile)
}

async function main() {
  await mkdir(brandDir, { recursive: true })
  const mark = await trimmedMark()

  // Home-screen icons: mark at ~82% of the canvas on paper.
  await writeIcon(mark, 512, 420, join(publicDir, 'icon-512.v2.png'))
  await writeIcon(mark, 192, 158, join(publicDir, 'icon-192.v2.png'))
  await writeIcon(mark, 180, 148, join(publicDir, 'apple-touch-icon.v2.png'))

  // Maskable: Android crops up to a centered circle covering 80% of each
  // axis, so the mark stays inside ~66% of the canvas.
  await writeIcon(mark, 512, 340, join(publicDir, 'icon-maskable.v2.png'))
  await writeIcon(mark, 192, 128, join(publicDir, 'icon-maskable-192.v2.png'))

  // Favicon.
  await writeIcon(mark, 64, 54, join(brandDir, 'favicon-64.png'))

  // Transparent lockup marks for the in-app masthead, login, and the
  // purchase email; sized for ~48px display at 2x and 4x.
  await sharp(mark)
    .resize({ height: 96, fit: 'inside' })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(join(brandDir, 'mark-96.png'))
  await sharp(mark)
    .resize({ height: 192, fit: 'inside' })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(join(brandDir, 'mark-192.png'))

  console.log('Generated: icon-512.v2, icon-192.v2, apple-touch-icon.v2, icon-maskable.v2, icon-maskable-192.v2, brand/favicon-64, brand/mark-96, brand/mark-192')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
