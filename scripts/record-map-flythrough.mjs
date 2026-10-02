#!/usr/bin/env node
// NOTE (September 2026): the /guide page no longer plays this film. It plays
// the trail film from scripts/record-trail-flythrough.mjs
// (img/guide/map-3d-trails.v2.*). This script, which renders the app with its
// pins on, is kept for a pins-included capture.
//
// Renders a 3D map flythrough of the Field Guide with its pins on (it wrote img/guide/map-3d-flythrough.*)
// frame by frame from the Field Guide's own map, pins included.
//
// Why frame by frame, and why the wait on every frame: the pins are DOM
// markers, and MapLibre places a marker on the terrain only with the elevation
// tiles under it loaded. Capture a frame before they arrive and the marker is
// projected at sea level, which on a tilted camera over a 4,000 ft valley puts
// it hundreds of pixels up the screen, floating over the ridges. The first cut
// of this video shipped exactly that. Here every frame jumps the camera, waits
// for the map to go idle (every tile in view loaded, terrain included), jumps
// again so each marker re-projects against the loaded terrain, lets MapLibre's
// occlusion test and the app's declutter run, and only then screenshots.
//
// Usage (the PWA dev server must be running against the live tile API):
//   cd apps/guide && VITE_API_BASE=https://api.thetalusfieldjournal.com npx vite --port 5173
//   node scripts/record-map-flythrough.mjs [--name=map-3d-flythrough.v3] [--frames=300] [--out=<dir>] [--probe]
// Needs playwright-core (or playwright) resolvable and ffmpeg on PATH. Behind
// an HTTPS proxy, run it with NODE_USE_ENV_PROXY=1 so Node's fetch uses it.
// --probe writes three frames (first, middle, last) and skips the encode.
//
// The app is not edited for this: the dev server's Map.tsx module is rewritten
// in flight to expose the map instance, and the account gate is satisfied with
// an unsigned stand-in token whose /api/auth/me check is answered locally.

import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let chromium
for (const name of ['playwright-core', 'playwright']) {
  try {
    ;({ chromium } = require(name))
    break
  } catch {
    /* try the next */
  }
}
if (!chromium) {
  console.error('playwright-core is not installed (npm i --no-save playwright-core)')
  process.exit(1)
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)
const ROOT = resolve(import.meta.dirname, '..')
const APP = args.app ?? 'http://localhost:5173'
const FRAMES = Number(args.frames ?? 300)
const FPS = 30
const W = 1280
const H = 720
const OUT = resolve(args.out ?? join(ROOT, 'img/guide'))
// /img/* is served immutable for 30 days, so a re-render ships under a new
// name (bump the suffix) and page-guide.jsx is pointed at it.
const NAME = args.name ?? 'map-3d-flythrough.v2'
const CACHE_DIR = resolve(args.cache ?? join(tmpdir(), 'tfg-flythrough/tiles'))
const FRAME_DIR = resolve(args.frames_dir ?? join(tmpdir(), 'tfg-flythrough/frames'))

// The flight: from above the Wawona Tunnel, looking east up the Valley the
// way Tunnel View sees it, down past El Capitan and Bridalveil Fall to the
// Valley floor by Yosemite Village. Keyframes are eased between, not flown
// with MapLibre's own animation, so every frame is a deterministic camera.
const KEYS = [
  { t: 0, center: [-119.6905, 37.7128], zoom: 13.0, pitch: 66, bearing: 72 },
  { t: 0.5, center: [-119.6400, 37.7240], zoom: 13.35, pitch: 64, bearing: 78 },
  { t: 1, center: [-119.5985, 37.7365], zoom: 13.45, pitch: 62, bearing: 80 },
]

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const lerp = (a, b, k) => a + (b - a) * k

// A smooth path through the keyframes: one global ease over the whole
// flight, then Catmull-Rom through the keys so the middle key bends the path
// without a visible kink.
function cameraAt(u) {
  const s = ease(u)
  let i = 0
  while (i < KEYS.length - 2 && s > KEYS[i + 1].t) i++
  const p0 = KEYS[Math.max(0, i - 1)]
  const p1 = KEYS[i]
  const p2 = KEYS[i + 1]
  const p3 = KEYS[Math.min(KEYS.length - 1, i + 2)]
  const k = (s - p1.t) / (p2.t - p1.t)
  const cr = (a, b, c, d) =>
    0.5 * (2 * b + (-a + c) * k + (2 * a - 5 * b + 4 * c - d) * k * k + (-a + 3 * b - 3 * c + d) * k * k * k)
  const f = (get) => cr(get(p0), get(p1), get(p2), get(p3))
  return {
    center: [f((p) => p.center[0]), f((p) => p.center[1])],
    zoom: f((p) => p.zoom),
    pitch: f((p) => p.pitch),
    bearing: f((p) => p.bearing),
  }
}

function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url')
}
const FAKE_JWT = `${b64url({ alg: 'none', typ: 'JWT' })}.${b64url({ sub: 'flythrough@render.local', exp: 4102444800 })}.x`

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await context.addInitScript((jwt) => {
  try {
    localStorage.setItem('tfg.jwt', jwt)
  } catch {
    /* ignore */
  }
}, FAKE_JWT)

const page = await context.newPage()
page.on('pageerror', (e) => console.error('[page]', e.message))
page.on('crash', () => console.error('[page] crashed'))

// Answer the account check locally. Everything else on the API (the tiles,
// the live feeds the map draws) is fetched from Node and cached on disk, so a
// re-render costs no second download and the browser never has to trust
// anything between it and the API.
await page.route(/\/api\/auth\/me/, (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ email: 'flythrough@render.local', expired: false, expiresAt: 4102444800 * 1000 }),
  }),
)
const API_HOST = /^https:\/\/api\.thetalusfieldjournal\.com\//
mkdirSync(CACHE_DIR, { recursive: true })
await page.route(API_HOST, async (route) => {
  const url = route.request().url()
  if (/\/api\/auth\/me/.test(url)) return route.fallback()
  const cacheable = /\/(vt|dem)\//.test(url)
  const file = join(CACHE_DIR, createHash('sha1').update(url).digest('hex'))
  if (cacheable && existsSync(file)) {
    const { status, type } = JSON.parse(readFileSync(file + '.json', 'utf8'))
    return route.fulfill({ status, contentType: type, headers: { 'access-control-allow-origin': '*' }, body: readFileSync(file) })
  }
  let res
  let body
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
      body = Buffer.from(await res.arrayBuffer())
      break
    } catch (e) {
      if (attempt === 3) return route.abort()
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
    }
  }
  const type = res.headers.get('content-type') ?? 'application/octet-stream'
  if (cacheable && (res.status === 200 || res.status === 204)) {
    writeFileSync(file, body)
    writeFileSync(file + '.json', JSON.stringify({ status: res.status, type }))
  }
  return route.fulfill({ status: res.status, contentType: type, headers: { 'access-control-allow-origin': '*' }, body })
})
// Expose the map instance without editing the app.
await page.route(/\/src\/routes\/Map\.tsx/, async (route) => {
  const res = await route.fetch()
  const body = (await res.text()).replace(
    /mapRef\.current = map(?!\w)/,
    'mapRef.current = map; window.__tfgMap = map; window.__tfgPins = { markersRef, amenityMarkersRef, hikeMarkersRef, mealMarkersRef }',
  )
  if (!body.includes('window.__tfgMap')) throw new Error('Map.tsx hook point not found')
  await route.fulfill({ response: res, body })
})

await page.goto(`${APP}/map`, { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.__tfgMap && window.__tfgMap.loaded(), null, { timeout: 120_000 })

// The frame is the map alone: the app's bars, tabs and controls are hidden,
// and the map's container is made the full viewport.
await page.addStyleTag({
  content: `
    .map-page__map { position: fixed !important; inset: 0 !important; width: ${W}px !important; height: ${H}px !important; z-index: 2147483000 !important; border-radius: 0 !important; }
    .maplibregl-ctrl-top-left, .maplibregl-ctrl-top-right, .maplibregl-ctrl-bottom-left { display: none !important; }
    .maplibregl-popup { display: none !important; }
  `,
})
await page.evaluate(() => window.__tfgMap.resize())

const settle = async (cam) => {
  await page.evaluate(async (c) => {
    const map = window.__tfgMap
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()))
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    // Settled: style and every source loaded, every tile in view (basemap and
    // elevation) loaded, and no frame still queued to draw them. Polled rather
    // than waiting on 'idle': under software WebGL a frame can take seconds
    // and 'idle' arrives long after the map has in fact settled.
    const settled = () => map.loaded() && map.areTilesLoaded() && !map.isMoving() && !map._frameRequest
    const waitSettled = async () => {
      const t0 = performance.now()
      // Give the camera move one frame to request its tiles first.
      await raf()
      while (!settled()) {
        if (performance.now() - t0 > 180_000) throw new Error('map did not settle')
        await sleep(50)
      }
    }
    map.jumpTo(c)
    await waitSettled()
    // Re-project every pin against the camera as it now stands. MapLibre
    // moves the camera's ground elevation inside the render that follows a
    // jump (and again as elevation tiles arrive) without firing 'move', so a
    // marker placed on the jump keeps a stale position: in a live flight the
    // next frame's 'move' corrects it, in a frame-by-frame render nothing
    // does. 'terrain' is the event markers re-project on.
    map.fire('terrain')
    await waitSettled()
    await raf()
    await raf()
    await raf()
    // Every pin must now sit where MapLibre projects its coordinate.
    const off = []
    for (const ref of Object.values(window.__tfgPins)) {
      for (const mk of Object.values(ref.current)) {
        const p = map.project(mk.getLngLat())
        const o = mk.getOffset()
        const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(mk.getElement().style.transform)
        if (!m) continue
        const dx = Number(m[1]) - (p.x + o.x)
        const dy = Number(m[2]) - (p.y + o.y)
        if (Math.hypot(dx, dy) > 1.5) off.push(`${mk.getElement().getAttribute('aria-label')}: ${dx.toFixed(1)},${dy.toFixed(1)}`)
      }
    }
    if (off.length) throw new Error(`pins off their coordinates:\n${off.slice(0, 10).join('\n')}`)
  }, cam)
}

// Warm the tile cache along the whole path first, so the recorded pass is
// not waiting on the network frame by frame.
console.log('warming tiles along the path...')
for (let i = 0; i <= 20; i++) {
  await settle(cameraAt(i / 20))
  process.stdout.write(`${i} `)
}
console.log()

rmSync(FRAME_DIR, { recursive: true, force: true })
mkdirSync(FRAME_DIR, { recursive: true })
const indices = args.probe ? [0, Math.floor(FRAMES / 2), FRAMES - 1] : [...Array(FRAMES).keys()]
for (const i of indices) {
  const cam = cameraAt(FRAMES === 1 ? 0 : i / (FRAMES - 1))
  await settle(cam)
  await page.screenshot({ path: join(FRAME_DIR, `f${String(i).padStart(4, '0')}.png`) })
  if (i % 10 === 0) console.log(`frame ${i + 1}/${FRAMES} ${new Date().toISOString().slice(11, 19)}`)
}
await browser.close()

if (args.probe) {
  console.log(`probe frames in ${FRAME_DIR}`)
  process.exit(0)
}

const ff = (argv) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...argv], { stdio: 'inherit' })
const input = ['-framerate', String(FPS), '-i', join(FRAME_DIR, 'f%04d.png')]
console.log('encoding webm...')
ff([...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-pix_fmt', 'yuv420p', '-an', join(OUT, `${NAME}.webm`)])
console.log('encoding mp4...')
ff([...input, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', join(OUT, `${NAME}.mp4`)])
console.log('poster...')
ff(['-i', join(FRAME_DIR, 'f0000.png'), '-q:v', '4', join(OUT, `${NAME}-poster.jpg`)])
rmSync(FRAME_DIR, { recursive: true, force: true })
console.log('done')
