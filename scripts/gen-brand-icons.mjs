// Generates the editorial site's icon set from the Talus Field mark
// (img/talus-field-mark.png), the same master the masthead and the PWA icon
// generator (apps/guide/scripts/generate-icons.mjs) read. Run after replacing
// the mark:
//
//   npm --prefix scripts run brand
//
// This exists because the icons it writes used to be made by hand, so a mark
// swap left them behind: before this script the favicons still carried the
// previous wide canvas letterboxed into a square, illustration shrunk to about
// half the frame with the retired corner sparkle still in it. Everything here
// is derived, so the next swap is one command.
//
// Outputs, and who reads them:
//   img/talus-field-mark-square.png  JSON-LD publisher logo (edge/seo.js,
//                                    app.jsx, index.html) — Google wants a
//                                    square, transparent is fine
//   img/favicon-{48,96,144,192,256,512}.png  index.html <link rel=icon>; 48px
//                                    is the one Google renders beside a result
//   img/apple-touch-icon.png         iOS home screen; opaque, iOS paints
//                                    transparency black
//   img/talus-field-mark-masthead.png  the editorial masthead (Header in
//                                    components.jsx, baked into index.html's
//                                    home shell). 168 px tall: three times
//                                    the 56 px the CSS draws it at, so it
//                                    stays crisp on 3x phones. Before this
//                                    output existed the masthead loaded the
//                                    805 x 622 master itself, 567 KB on every
//                                    page view (and every archive page) for
//                                    an image drawn 56 px tall.
//   img/mark-192.png                 the trip-share email's masthead
//                                    (workers/src/lib/email.ts), which has
//                                    always pointed here — the file was simply
//                                    never created, so that email shipped with
//                                    a broken image until now
//   favicon.ico                      legacy /favicon.ico, PNG-in-ICO at 16/32/48
//
// Sizes and the apple-touch background are matched to the files this replaced;
// only the artwork inside them changes.

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const imgDir = join(root, 'img')
const sourcePath = join(imgDir, 'talus-field-mark.png')

// iOS renders a transparent app icon on black, so the touch icon is flattened.
// This is the tone the hand-made icon carried, kept so the swap changes the
// illustration and nothing else.
const TOUCH_BG = '#f5f0e6'

// The mark is wider than it is tall, so it can never fill a square. Leave a
// hairline of margin at the widest point rather than letting the linework touch
// the frame; the touch icon sits further in because iOS rounds the corners.
const SQUARE_FILL = 0.96
const TOUCH_FILL = 0.82

// Trim the transparent border so the framing below measures the illustration
// and not the canvas it was exported on.
async function trimmedMark() {
  return sharp(sourcePath).trim().png().toBuffer()
}

// The mark is flat-shaded linework in a handful of tones, so palette encoding
// is the right container: it holds the art without visible loss at roughly half
// the bytes of truecolor, and /img/favicon-512.png is a file the site serves.
// Same encoder settings the PWA icon generator uses.
const PNG_OPTS = { palette: true, compressionLevel: 9 }

// Center the mark on a square canvas. `background` null keeps the square
// transparent; a color flattens it, and the alpha channel is dropped with it so
// nothing downstream can read a stray transparent pixel (iOS paints those black).
async function squareIcon(mark, canvas, fill, background) {
  const inner = await sharp(mark)
    .resize({ width: Math.round(canvas * fill), fit: 'inside' })
    .png()
    .toBuffer()
  const meta = await sharp(inner).metadata()
  let pipeline = sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: background || { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([
    {
      input: inner,
      top: Math.round((canvas - meta.height) / 2),
      left: Math.round((canvas - meta.width) / 2),
    },
  ])
  if (background) pipeline = pipeline.flatten({ background }).removeAlpha()
  return pipeline.png(PNG_OPTS).toBuffer()
}

// Minimal ICO container. Each entry is a whole PNG file, which every browser
// that still asks for /favicon.ico has understood for years, and which is what
// the file this replaces already did.
function encodeIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  let offset = 6 + pngs.length * 16
  const entries = []
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16)
    entry[0] = size >= 256 ? 0 : size // width, 0 means 256
    entry[1] = size >= 256 ? 0 : size // height
    entry[2] = 0 // palette size: 0 for truecolor
    entry[3] = 0 // reserved
    entry.writeUInt16LE(1, 4) // color planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

async function main() {
  const mark = await trimmedMark()
  const written = []

  const write = (name, buf) => {
    writeFileSync(name.startsWith('favicon.ico') ? join(root, name) : join(imgDir, name), buf)
    written.push(name)
  }

  // Square, transparent: the publisher logo and the browser favicon ladder.
  write('talus-field-mark-square.png', await squareIcon(mark, 512, SQUARE_FILL, null))
  for (const size of [48, 96, 144, 192, 256, 512]) {
    write(`favicon-${size}.png`, await squareIcon(mark, size, SQUARE_FILL, null))
  }

  // Opaque, for iOS.
  write('apple-touch-icon.png', await squareIcon(mark, 180, TOUCH_FILL, TOUCH_BG))

  // The masthead mark. Palette PNG like the rest of the set; ~20 KB against
  // the master's 567 KB. The Header sets width/height from these dimensions
  // (see components.jsx), so a change in the trimmed mark's aspect ratio
  // needs those attributes updated too.
  write(
    'talus-field-mark-masthead.png',
    await sharp(mark).resize({ height: 168, fit: 'inside' }).png(PNG_OPTS).toBuffer(),
  )

  // Transparent lockup mark for the trip-share email, sized to match the
  // PWA's /brand/mark-192.png so both emails render the same asset shape.
  write(
    'mark-192.png',
    await sharp(mark).resize({ height: 192, fit: 'inside' }).png(PNG_OPTS).toBuffer(),
  )

  const icoSizes = [16, 32, 48]
  const icoPngs = []
  for (const size of icoSizes) {
    icoPngs.push({ size, data: await squareIcon(mark, size, SQUARE_FILL, null) })
  }
  write('favicon.ico', encodeIco(icoPngs))

  console.log(`Generated ${written.length} files from img/talus-field-mark.png:`)
  for (const name of written) console.log(`  ${name}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
