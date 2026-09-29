#!/usr/bin/env node
// Renders the /guide page's 3D map film (img/guide/map-3d-trails.v1.*): a
// pin-free flight over the Field Guide's terrain in which the trails draw
// themselves on, one after another, the way they are walked.
//
// What is on screen: the app's own basemap and 3D terrain (the real style,
// tiles and elevation, so the ground is the shipping map) and nothing else.
// Every DOM pin, the app's own trail, trip and program layers are hidden, and
// the trail lines are drawn by this script from the same track files the app
// packs (apps/guide/public/tracks/*.json), in the app's own trail colours
// (theme.ts trailColors: red strenuous, amber moderate, green easy).
//
// The story is a growing network. Each line grows from where it meets a line
// already drawn: Upper Yosemite Fall up the wall from Camp 4, Eagle Peak off
// its top, the Valley Loop round the floor, the Four Mile Trail up the south
// wall to Glacier Point, where the Pohono Trail runs west and the Panorama
// Trail east, down to Happy Isles and up the Mist Trail toward Half Dome,
// then the camera lifts away and every other trail in the park draws on.
// Spurs (Sentinel Dome, Taft Point, McGurk Meadow, ...) are found from the
// geometry, not listed: a track whose start (or, drawn backward, whose end)
// lies on a drawn line grows from that point when the parent's tip passes it.
//
// Frame by frame, like record-map-flythrough.mjs, and for the same reason:
// each frame jumps the camera, waits for the map to settle (every tile in
// view loaded, terrain included) and only then screenshots, so a slow
// software-WebGL frame can never show half-loaded ground.
//
// Usage (the PWA dev server must be running against the live tile API):
//   cd apps/guide && VITE_API_BASE=https://api.thetalusfieldjournal.com npx vite --port 5173
//   node scripts/record-trail-flythrough.mjs [--name=map-3d-trails.v1] [--fps=30] [--out=<dir>]
//     --probe=2,9.5,20   render only those seconds to <frames dir>/probe-*.png, no encode
//     --layers           print the style's layer ids and exit
//     --plan             print the schedule and exit
// Needs playwright-core and ffmpeg on PATH (CHROMIUM_PATH points at a browser if
// the one playwright-core expects is not installed). Behind an HTTPS proxy, run it
// with NODE_USE_ENV_PROXY=1 so Node's fetch uses it.

import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
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
const FPS = Number(args.fps ?? 30)
const W = 1280
const H = 720
const OUT = resolve(args.out ?? join(ROOT, 'img/guide'))
// /img/* is served immutable for 30 days, so a re-render ships under a new
// name (bump the suffix) and page-guide.jsx is pointed at it.
const NAME = args.name ?? 'map-3d-trails.v1'
const CACHE_DIR = resolve(args.cache ?? join(tmpdir(), 'tfg-flythrough/tiles'))
const FRAME_DIR = resolve(args.frames_dir ?? join(tmpdir(), 'tfg-flythrough/frames'))
const TRACKS_DIR = join(ROOT, 'apps/guide/public/tracks')
const HIKES_TS = join(ROOT, 'apps/guide/src/content/hikes.ts')

// ---------------------------------------------------------------------------
// Geometry. A local metre plane is plenty at the scale of one park.
// ---------------------------------------------------------------------------
const LAT0 = 37.75
const MX = 111320 * Math.cos((LAT0 * Math.PI) / 180)
const MY = 110574
const toM = ([lng, lat]) => [lng * MX, lat * MY]
const fromM = ([x, y]) => [x / MX, y / MY]
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const clamp01 = (x) => Math.max(0, Math.min(1, x))
const smooth = (x) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, k) => a + (b - a) * k

function cumulative(pts) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist(pts[i - 1], pts[i]))
  return cum
}

/** The point s metres along a polyline (metre plane). */
function pointAt(pts, cum, s) {
  if (s <= 0) return pts[0]
  const len = cum[cum.length - 1]
  if (s >= len) return pts[pts.length - 1]
  let lo = 0
  let hi = cum.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (cum[mid] <= s) lo = mid
    else hi = mid
  }
  const k = (s - cum[lo]) / (cum[hi] - cum[lo] || 1)
  return [lerp(pts[lo][0], pts[hi][0], k), lerp(pts[lo][1], pts[hi][1], k)]
}

/** The polyline's first s metres, ending exactly at s. */
function headOf(pts, cum, s) {
  const out = []
  for (let i = 0; i < pts.length && cum[i] < s; i++) out.push(pts[i])
  out.push(pointAt(pts, cum, s))
  return out
}

/** The part of the polyline between metres a and b. */
function sliceOf(pts, cum, a, b) {
  const out = [pointAt(pts, cum, a)]
  for (let i = 0; i < pts.length; i++) if (cum[i] > a && cum[i] < b) out.push(pts[i])
  out.push(pointAt(pts, cum, b))
  return out
}

// ---------------------------------------------------------------------------
// The trails: the packed tracks and the guide's own difficulty per hike.
// ---------------------------------------------------------------------------
const difficulty = {}
for (const m of readFileSync(HIKES_TS, 'utf8').matchAll(/id:\s*'([^']+)'[\s\S]*?difficulty:\s*'(\w+)'/g)) difficulty[m[1]] = m[2]

const TRAILS = {}
for (const f of readdirSync(TRACKS_DIR)) {
  const j = JSON.parse(readFileSync(join(TRACKS_DIR, f), 'utf8'))
  const pts = j.line.map(toM)
  TRAILS[j.id] = { id: j.id, diff: difficulty[j.id] ?? 'unrated', pts, cum: cumulative(pts) }
}

// The app's daylight trail colours (theme.ts trailColors). The tip is the same
// hue lifted toward white so the growing end reads against its own line.
const COLORS = {
  easy: { line: '#2e7d32', tip: '#7ddc82' },
  moderate: { line: '#a86b00', tip: '#ffc857' },
  strenuous: { line: '#b3261e', tip: '#ff7b6b' },
  unrated: { line: '#5d6a61', tip: '#c3d0c8' },
}

// ---------------------------------------------------------------------------
// The cast: the order lines are laid down, and where a line starts.
// ---------------------------------------------------------------------------
const JOIN_M = 30 // a vertex this close to a drawn line is on it
const DRAWN = [] // metre-plane points, every 10 m along each line already laid down

function densify(pts) {
  const out = []
  for (let i = 1; i < pts.length; i++) {
    const n = Math.max(1, Math.ceil(dist(pts[i - 1], pts[i]) / 10))
    for (let k = 0; k < n; k++) out.push([lerp(pts[i - 1][0], pts[i][0], k / n), lerp(pts[i - 1][1], pts[i][1], k / n)])
  }
  out.push(pts[pts.length - 1])
  return out
}
const nearDrawn = (p) => {
  let best = { d: Infinity, at: null }
  for (const q of DRAWN) {
    const d = dist(p, q)
    if (d < best.d) best = { d, at: q }
  }
  return best
}

// Leads carry the camera and have hand-set timing. Everything else is found
// from the geometry and timed from its parent (see schedule below).
const LEADS = [
  { id: 'upper-yosemite-fall', t0: 0.8, dur: 5.6 },
  { id: 'lower-yosemite-fall', t0: 10.4, dur: 1.2 },
  { id: 'valley-loop-trail', t0: 11.1, dur: 5.0 },
  { id: 'four-mile-trail', t0: 16.5, dur: 5.4 },
  { id: 'pohono-trail', t0: 22.4, dur: 6.2 },
  { id: 'panorama-trail', t0: 22.4, dur: 5.6 },
  // Half Dome leaves the Panorama Trail at Nevada Fall and grows when
  // Panorama's tip passes that junction (t0 comes from the geometry).
  { id: 'half-dome', after: true, dur: 5.0 },
]
// Laid down after the leads; timed from their junction, with a set duration
// because the camera follows them.
const FOLLOWERS = [{ id: 'eagle-peak', dur: 2.8 }]

const FINALE_DUR = 3.2

const plan = [] // { id, diff, pts, cum, len, t0, t1, lead, join }
const byId = {}

function lay(id, spec) {
  const T = TRAILS[id]
  let pts = T.pts
  // Find where this line leaves what is already drawn. Forward: the first
  // vertex that is not on a drawn line. If the start is off the drawn network
  // but the end is on it, draw it backward so it grows out of the junction.
  let cum = T.cum
  let a = 0
  if (DRAWN.length) {
    const startOn = nearDrawn(pts[0]).d <= JOIN_M
    const endOn = nearDrawn(pts[pts.length - 1]).d <= JOIN_M
    if (!startOn && endOn) {
      pts = [...pts].reverse()
      cum = cumulative(pts)
    }
    let i = 0
    while (i < pts.length && nearDrawn(pts[i]).d <= JOIN_M) i++
    if (i >= pts.length) return null // wholly on drawn lines
    a = i > 0 ? cum[i - 1] : 0
  }
  const len = cum[cum.length - 1] - a
  const use = a > 0 ? sliceOf(pts, cum, a, cum[cum.length - 1]) : pts
  const ucum = cumulative(use)
  // The junction: the parent's point nearest this line's first vertex.
  let join = null
  for (const p of plan) {
    for (let i = 0; i < p.pts.length; i += 1) {
      const d = dist(p.pts[i], use[0])
      if (d <= JOIN_M * 2 && (!join || d < join.d)) join = { d, parent: p, s: p.cum[i] }
    }
  }
  const entry = { id, diff: T.diff, pts: use, cum: ucum, len, t0: spec.t0, t1: spec.t0 + spec.dur, lead: !!spec.lead, join }
  plan.push(entry)
  byId[id] = entry
  for (const q of densify(use)) DRAWN.push(q)
  return entry
}

// Time a line grows: when its parent's tip reaches the junction.
const drawnAt = (e, t) => {
  const k = clamp01((t - e.t0) / (e.t1 - e.t0))
  return e.len * (e.lead ? lerp(k, smooth(k), 0.35) : k)
}
function timeAtDistance(e, s) {
  let lo = e.t0
  let hi = e.t1
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (drawnAt(e, mid) < s) lo = mid
    else hi = mid
  }
  return hi
}
const lengthTimed = (len) => Math.min(3.2, Math.max(0.9, len / 3200))

// Leads first (geometry only, times fixed or from the junction), then
// followers, then every other track as a spur or a finale sprout.
for (const L of LEADS) {
  const e = lay(L.id, { t0: L.t0 ?? 0, dur: L.dur, lead: true })
  e.after = !!L.after
}
for (const F of FOLLOWERS) {
  const e = lay(F.id, { t0: 0, dur: F.dur, lead: true })
  e.after = true
}
const remaining = Object.keys(TRAILS).filter((id) => !byId[id])
// Longest first, so a track that another one hangs from is laid before it.
remaining.sort((x, y) => TRAILS[y].cum.at(-1) - TRAILS[x].cum.at(-1))
for (const id of remaining) {
  const e = lay(id, { t0: 0, dur: 1 })
  if (!e) continue
  e.after = !!e.join
  e.orphan = !e.join
  e.dur = lengthTimed(e.len)
}

// Timing. The story's own end is set by the last lead; the finale follows it.
const settleTime = (e) => {
  if (!e.after) return
  const j = e.join
  const dur = e.dur ?? e.t1 - e.t0
  e.t0 = timeAtDistance(j.parent, j.s)
  e.t1 = e.t0 + dur
}
for (const e of plan) {
  if (!e.orphan) {
    e.dur = e.dur ?? e.t1 - e.t0
    settleTime(e)
  }
}
const storyEnd = Math.max(...plan.filter((e) => !e.orphan && e.lead).map((e) => e.t1))
const FINALE_T0 = storyEnd + 0.3
{
  const orphans = plan.filter((e) => e.orphan)
  // Sprout from the west of the park to the east.
  orphans.sort((x, y) => x.pts[0][0] - y.pts[0][0])
  orphans.forEach((e, i) => {
    e.t0 = FINALE_T0 + (i / Math.max(1, orphans.length - 1)) * (FINALE_DUR - 0.8)
    e.t1 = e.t0 + Math.min(2.6, Math.max(1.0, e.len / 3500))
  })
}
// Spurs of orphans (children laid after them) resolve now that orphans have times.
for (const e of plan) if (e.after && !e.lead) settleTime(e)
const END_T = FINALE_T0 + FINALE_DUR + 2.2
for (const e of plan) e.t1 = Math.min(e.t1, END_T - 1.0)
const tipAt = (e, t) => pointAt(e.pts, e.cum, drawnAt(e, t))

if (args.plan) {
  for (const e of plan.sort((a, b) => a.t0 - b.t0)) {
    console.log(
      e.id.padEnd(30),
      e.diff.padEnd(10),
      `${e.t0.toFixed(1).padStart(5)}-${e.t1.toFixed(1).padStart(5)}s`,
      `${(e.len / 1000).toFixed(1).padStart(5)} km`,
      e.orphan ? 'finale' : e.join ? `from ${e.join.parent.id}` : 'root',
    )
  }
  console.log(`${plan.length} lines, ${END_T.toFixed(1)}s`)
  process.exit(0)
}

/** Heading of the line at its tip, degrees clockwise from north, over +-600 m. */
function headingAt(e, t) {
  const s = drawnAt(e, t)
  const a = pointAt(e.pts, e.cum, Math.max(0, s - 600))
  const b = pointAt(e.pts, e.cum, Math.min(e.len, s + 600))
  return (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI
}

// ---------------------------------------------------------------------------
// The camera. Keyframes hold where to look (a fixed point, or the tip of a
// line), and how (zoom, pitch, bearing: a number, or the line's heading plus
// an offset). Between two keyframes the look-at point and the angles are each
// blended, so a keyframe on a line follows its tip through the whole span.
// The sampled path is then smoothed both ways (no lag, no kinks).
// ---------------------------------------------------------------------------
const VALLEY = [-119.637, 37.7295] // the Valley Loop's own centre: it runs from the Lower Falls west to Bridalveil
const GLACIER = [-119.617, 37.7245]
const PARK = [-119.5, 37.79]
const t0Of = (id, dt = 0) => byId[id].t0 + dt
const t1Of = (id, dt = 0) => byId[id].t1 + dt
const KEYS = [
  { t: 0, at: 'upper-yosemite-fall', zoom: 13.5, pitch: 60, bearing: 12 },
  { t: t0Of('upper-yosemite-fall', 0.8), at: 'upper-yosemite-fall', zoom: 14.1, pitch: 67, bearing: 8 },
  { t: t1Of('upper-yosemite-fall'), at: 'upper-yosemite-fall', zoom: 13.7, pitch: 64, bearing: 352 },
  { t: t0Of('eagle-peak', 2.0), at: 'eagle-peak', zoom: 13.4, pitch: 54, bearing: 118 },
  { t: t1Of('eagle-peak'), at: 'eagle-peak', zoom: 13.3, pitch: 56, bearing: 108 },
  { t: t1Of('eagle-peak', 1.4), at: VALLEY, zoom: 12.75, pitch: 46, bearing: 96 },
  { t: t1Of('valley-loop-trail'), at: VALLEY, zoom: 12.65, pitch: 46, bearing: 72 },
  { t: t0Of('four-mile-trail', 0.6), at: 'four-mile-trail', zoom: 14.1, pitch: 67, bearing: 196 },
  { t: t1Of('four-mile-trail'), at: 'four-mile-trail', zoom: 13.8, pitch: 66, bearing: 168 },
  { t: t0Of('pohono-trail', 0.6), at: GLACIER, zoom: 12.6, pitch: 60, bearing: 190 },
  { t: t0Of('half-dome', -2.0), at: GLACIER, zoom: 12.4, pitch: 58, bearing: 165 },
  { t: t0Of('half-dome', -0.3), at: 'panorama-trail', zoom: 13.2, pitch: 64, bearing: { heading: 10 } },
  { t: t0Of('half-dome', 1.0), at: 'half-dome', zoom: 13.8, pitch: 64, bearing: { heading: 0 } },
  { t: t1Of('half-dome', -0.4), at: 'half-dome', zoom: 13.3, pitch: 66, bearing: { heading: -25 } },
  { t: FINALE_T0 + 0.6, at: 'half-dome', zoom: 13.0, pitch: 62, bearing: { heading: -25 } },
  { t: FINALE_T0 + FINALE_DUR + 1.4, at: PARK, zoom: 10.25, pitch: 52, bearing: 40 },
  { t: END_T, at: PARK, zoom: 10.15, pitch: 52, bearing: 48 },
]

const angDiff = (a, b) => ((((b - a) % 360) + 540) % 360) - 180
const lerpAng = (a, b, k) => a + angDiff(a, b) * k

function lookAt(key, t) {
  if (Array.isArray(key.at)) return toM(key.at)
  return tipAt(byId[key.at], t)
}
function bearingOf(key, t) {
  if (typeof key.bearing === 'number') return key.bearing
  return headingAt(byId[key.at], t) + key.bearing.heading
}
function rawCamera(t) {
  let i = 0
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++
  const A = KEYS[i]
  const B = KEYS[i + 1]
  const u = smooth((t - A.t) / (B.t - A.t))
  const pa = lookAt(A, t)
  const pb = lookAt(B, t)
  return {
    c: [lerp(pa[0], pb[0], u), lerp(pa[1], pb[1], u)],
    zoom: lerp(A.zoom, B.zoom, u),
    pitch: lerp(A.pitch, B.pitch, u),
    bearing: lerpAng(bearingOf(A, t), bearingOf(B, t), u),
  }
}

const FRAMES = Math.round(END_T * FPS)
const raw = Array.from({ length: FRAMES }, (_, f) => rawCamera(f / FPS))
// Unwrap the bearing so the smoothing does not average across north.
for (let f = 1; f < FRAMES; f++) raw[f].bearing = raw[f - 1].bearing + angDiff(raw[f - 1].bearing, raw[f].bearing)
function gauss(values, sigmaFrames) {
  const r = Math.ceil(sigmaFrames * 3)
  const w = Array.from({ length: 2 * r + 1 }, (_, k) => Math.exp(-0.5 * ((k - r) / sigmaFrames) ** 2))
  return values.map((_, f) => {
    let s = 0
    let n = 0
    for (let k = -r; k <= r; k++) {
      const g = Math.min(values.length - 1, Math.max(0, f + k))
      s += values[g] * w[k + r]
      n += w[k + r]
    }
    return s / n
  })
}
const sx = gauss(raw.map((r) => r.c[0]), 0.45 * FPS)
const sy = gauss(raw.map((r) => r.c[1]), 0.45 * FPS)
const sz = gauss(raw.map((r) => r.zoom), 0.4 * FPS)
const sp = gauss(raw.map((r) => r.pitch), 0.4 * FPS)
const sb = gauss(raw.map((r) => r.bearing), 0.4 * FPS)
const camera = (f) => ({ center: fromM([sx[f], sy[f]]), zoom: sz[f], pitch: sp[f], bearing: sb[f] })

// Metres per pixel at the screen centre, for sizing the glowing tip.
const mppAt = (zoom) => (156543.03 * Math.cos((LAT0 * Math.PI) / 180)) / 2 ** zoom

/** The GeoJSON for time t: each line as drawn so far, and each growing tip. */
function frameData(t, zoom) {
  const lines = []
  const tips = []
  const tipLen = 100 * mppAt(zoom)
  for (const e of plan) {
    if (t <= e.t0) continue
    const s = drawnAt(e, t)
    if (s <= 0.5) continue
    const props = { diff: e.diff }
    lines.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: headOf(e.pts, e.cum, s).map(fromM) } })
    if (t < e.t1) {
      tips.push({
        type: 'Feature',
        properties: props,
        geometry: { type: 'LineString', coordinates: sliceOf(e.pts, e.cum, Math.max(0, s - tipLen), s).map(fromM) },
      })
    }
  }
  return {
    lines: { type: 'FeatureCollection', features: lines },
    tips: { type: 'FeatureCollection', features: tips },
  }
}

if (args.plan === undefined && args.layers === undefined) {
  console.log(`${plan.length} lines, ${END_T.toFixed(1)}s, ${FRAMES} frames`)
}

// ---------------------------------------------------------------------------
// The browser side: the app's map with everything but the ground hidden.
// ---------------------------------------------------------------------------
function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url')
}
const FAKE_JWT = `${b64url({ alg: 'none', typ: 'JWT' })}.${b64url({ sub: 'flythrough@render.local', exp: 4102444800 })}.x`

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  // Software WebGL by default (works anywhere, a few seconds a frame). With a
  // GPU, GPU=1 and CHROMIUM_PATH=/usr/bin/chromium draw a frame in about a second.
  args: process.env.GPU
    ? ['--headless=new', '--use-gl=angle', '--use-angle=gl', '--enable-gpu-rasterization', '--ignore-gpu-blocklist']
    : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await context.addInitScript((jwt) => {
  try {
    localStorage.setItem('tfg.jwt', jwt)
  } catch {
    /* ignore */
  }
}, FAKE_JWT)

let page
async function newPage() {
  page = await context.newPage()
  page.on('pageerror', (e) => console.error('[page]', e.message))
  page.on('crash', () => console.error('[page] crashed'))

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
    const body = (await res.text()).replace(/mapRef\.current = map(?!\w)/, 'mapRef.current = map; window.__tfgMap = map')
    if (!body.includes('window.__tfgMap')) throw new Error('Map.tsx hook point not found')
    await route.fulfill({ response: res, body })
  })

  page.on('framenavigated', (f) => {
    // The app rewrites ?cam= as the camera moves; only a change of route is news.
    if (f === page.mainFrame() && !new URL(f.url()).pathname.startsWith('/map')) console.log(`\n[page left the map: ${f.url()}]`)
  })
  page.on('close', () => console.log('\n[page closed]'))
}

// Loads the app's map and turns it into the film's frame. Run once, and again
// if the app's page dies mid-render (it does, now and then: the tab crashes or
// the app navigates away), after which the frame in hand is drawn again.
async function setupPage() {
  await page.goto(`${APP}/map`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => window.__tfgMap && window.__tfgMap.loaded(), null, { timeout: 120_000 })

  if (args.layers) {
    console.log(await page.evaluate(() => window.__tfgMap.getStyle().layers.map((l) => `${l.id} (${l.type})`).join('\n')))
    await browser.close()
    process.exit(0)
  }

  // The frame is the map alone: no bars, controls, popups or pins.
  await page.addStyleTag({
    content: `
    .map-page__map { position: fixed !important; inset: 0 !important; width: ${W}px !important; height: ${H}px !important; z-index: 2147483000 !important; border-radius: 0 !important; }
    .maplibregl-ctrl-top-left, .maplibregl-ctrl-top-right, .maplibregl-ctrl-bottom-left, .maplibregl-ctrl-bottom-right { display: none !important; }
    .maplibregl-popup, .maplibregl-marker { display: none !important; }
  `,
  })

  // Hide every layer the app added over the basemap (its own trails, the trip,
  // programs, offline outlines), and lay this film's lines in their place.
  await page.evaluate(
    ({ colors }) => {
      const map = window.__tfgMap
      map.resize()
      const style = map.getStyle()
      const APP_LAYER = /^(trails|trip|hike-track|program|offline|road-alert|selected|amenit|pin|marker|route|itinerar|day-)/i
      for (const l of style.layers) {
        if (APP_LAYER.test(l.id)) map.setLayoutProperty(l.id, 'visibility', 'none')
      }
      const empty = { type: 'FeatureCollection', features: [] }
      map.addSource('film-lines', { type: 'geojson', data: empty })
      map.addSource('film-tips', { type: 'geojson', data: empty })
      const colour = (key) => ['match', ['get', 'diff'], 'easy', colors.easy[key], 'moderate', colors.moderate[key], 'strenuous', colors.strenuous[key], colors.unrated[key]]
      const w = (a, b, c) => ['interpolate', ['linear'], ['zoom'], 10, a, 12.5, b, 14.5, c]
      const layout = { 'line-join': 'round', 'line-cap': 'round' }
      map.addLayer({ id: 'film-casing', type: 'line', source: 'film-lines', layout, paint: { 'line-color': '#f8f5ed', 'line-width': w(5.4, 7.6, 11), 'line-opacity': 0.92 } })
      map.addLayer({ id: 'film-line', type: 'line', source: 'film-lines', layout, paint: { 'line-color': colour('line'), 'line-width': w(3.2, 4.8, 7) } })
      map.addLayer({ id: 'film-tip-glow', type: 'line', source: 'film-tips', layout, paint: { 'line-color': colour('tip'), 'line-width': w(5, 7.5, 11), 'line-blur': 4, 'line-opacity': 0.4 } })
      map.addLayer({ id: 'film-tip', type: 'line', source: 'film-tips', layout, paint: { 'line-color': colour('tip'), 'line-width': w(3.2, 4.8, 7) } })
    },
    { colors: COLORS },
  )
}
await newPage()
await setupPage()

const renderFrame = async (cam, data) => {
  await page.evaluate(
    async ({ c, d }) => {
      const map = window.__tfgMap
      const raf = () => new Promise((r) => requestAnimationFrame(() => r()))
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
      map.getSource('film-lines').setData(d.lines)
      map.getSource('film-tips').setData(d.tips)
      // Settled means MapLibre's own 'idle': style and every source loaded,
      // every tile in view (basemap and elevation) loaded, nothing queued.
      // Polling map.loaded() alone races on a GPU: it reads true in the
      // instant after a jump, before the frame that requests the new tiles.
      const idle = () => {
        const done = new Promise((r) => map.once('idle', r))
        map.triggerRepaint()
        return Promise.race([done, sleep(120_000).then(() => Promise.reject(new Error('map did not settle')))])
      }
      map.jumpTo(c)
      await idle()
      // The camera's ground elevation moves inside the render after a jump,
      // so jump once more against the loaded terrain and let it draw.
      map.jumpTo(c)
      await idle()
      for (let i = 0; i < 4; i++) {
        map.triggerRepaint()
        await raf()
      }
      await sleep(120)
    },
    { c: cam, d: data },
  )
}

// The app's map has a fault this film runs into: over a band of zoom levels
// (about 13.65 to 14.05 at these pitches; it moves with the view and with what
// the tile cache holds) the terrain reports idle with the ground's textures
// missing on whole faces of the scene: the hillshade shows through on bare
// cream, sometimes over the entire frame, in the software and the GPU renderer
// alike. The vector source's tile manager still holds the tiles; reloading it
// redraws them. So each frame is measured, and one that is mostly washed out
// gets that reload and one more look. (Bare granite in full light is bright
// too, so the reload is only kept if it lowers the measure.)
const washedFraction = async (png) =>
  page.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = document.createElement('canvas')
    c.width = 160
    c.height = 90
    const g = c.getContext('2d')
    g.drawImage(img, 0, 0, 160, 90)
    const px = g.getImageData(0, 0, 160, 90).data
    let washed = 0
    for (let i = 0; i < px.length; i += 4) {
      const hi = Math.max(px[i], px[i + 1], px[i + 2])
      const lo = Math.min(px[i], px[i + 1], px[i + 2])
      if (hi > 222 && hi - lo < 24) washed++
    }
    return washed / (px.length / 4)
  }, png.toString('base64'))

const stillWashed = []
const settleAfter = (js) =>
  page.evaluate(async (code) => {
    const map = window.__tfgMap
    const raf = () => new Promise((r) => requestAnimationFrame(() => r()))
    const idle = () => {
      const done = new Promise((r) => map.once('idle', r))
      map.triggerRepaint()
      return done
    }
    new Function('map', code)(map)
    await idle()
    await idle()
    for (let i = 0; i < 4; i++) {
      map.triggerRepaint()
      await raf()
    }
    await new Promise((r) => setTimeout(r, 300))
  }, js)

// Ways to get the ground's textures back, mildest first.
const FIXES = [
  'map.style.tileManagers.protomaps.reload()',
  "for (const k of ['protomaps', 'terrain']) map.style.tileManagers[k].clearTiles()",
]

async function capture(cam, data, path, frame = -1) {
  let png
  let first
  for (let attempt = 0; ; attempt++) {
    try {
      await renderFrame(cam, data)
      png = await page.screenshot()
      first = await washedFraction(png)
      break
    } catch (e) {
      if (attempt >= 4) throw e
      console.log(`\n[frame failed (${String(e.message).split('\n')[0].slice(0, 90)}); reloading the page]`)
      // A crashed tab cannot be navigated; open a fresh one.
      await page.close().catch(() => {})
      await newPage()
      await setupPage()
    }
  }
  // The fault is bimodal. Across a 1,108-frame render, 992 frames measured
  // under 0.02 (sky and haze) and every faulty one measured over 0.08, none in
  // between, so a fixed ceiling separates them and needs no memory of the last
  // frame (a run of bad frames cannot become the new normal).
  const suspect = (w) => w > 0.05
  let washed = first
  if (suspect(first)) {
    for (const fix of FIXES) {
      try {
        await settleAfter(fix)
      } catch (e) {
        await page.close().catch(() => {})
        await newPage()
        await setupPage()
        await renderFrame(cam, data)
      }
      const again = await page.screenshot()
      const second = await washedFraction(again)
      if (second < washed * 0.8) {
        png = again
        washed = second
        process.stdout.write(`[fixed ${first.toFixed(2)}>${second.toFixed(2)}] `)
      }
      if (!suspect(washed)) break
    }
    // Last resort: a few hundredths of a zoom level move the tile cover, which
    // the eye cannot see on one frame between two that are not nudged.
    for (let k = 1; suspect(washed) && k <= 6; k++) {
      await renderFrame({ ...cam, zoom: cam.zoom + 0.03 * k }, data)
      const again = await page.screenshot()
      const w = await washedFraction(again)
      if (w < washed * 0.8) {
        png = again
        washed = w
      }
    }
    if (suspect(washed)) {
      stillWashed.push(frame)
      process.stdout.write(`[STILL WASHED frame ${frame}: ${washed.toFixed(2)}] `)
    }
  }
  if (path) writeFileSync(path, png)
}

const camFor = (f) => camera(Math.min(FRAMES - 1, Math.max(0, f)))
const stateAt = (f) => {
  const cam = camFor(f)
  return { cam, data: frameData(f / FPS, cam.zoom) }
}

// Warm the tile cache along the path first, so the recorded pass is not
// waiting on the network frame by frame.
console.log('warming tiles along the path...')
for (let f = 0; !args.probe && !args.from && !args.only && f < FRAMES; f += Math.round(FPS * 0.75)) {
  const { cam, data } = stateAt(f)
  await renderFrame(cam, data)
  process.stdout.write(`${Math.round(f / FPS)} `)
}
console.log()

if (!args.from && !args.only) rmSync(FRAME_DIR, { recursive: true, force: true })
mkdirSync(FRAME_DIR, { recursive: true })

if (args.probe) {
  const secs = String(args.probe).split(',').map(Number)
  for (const s of secs) {
    const f = Math.min(FRAMES - 1, Math.round(s * FPS))
    const { cam, data } = stateAt(f)
    await capture(cam, data, join(FRAME_DIR, `probe-${String(s).replace('.', '_')}.png`))
    console.log(`probe ${s}s`, JSON.stringify(cam))
  }
  await browser.close()
  console.log(`probe frames in ${FRAME_DIR}`)
  process.exit(0)
}

const startFrame = Number(args.from ?? 0)
// --only=38-39,95-119 redraws just those frames into the kept frame directory
// (the rest are reused), so a bad stretch is repaired without a full render.
const parseRanges = (spec) =>
  String(spec)
    .split(',')
    .flatMap((r) => {
      const [a, b = a] = r.split('-').map(Number)
      return Array.from({ length: b - a + 1 }, (_, i) => a + i)
    })
const frameList = args.only ? parseRanges(args.only) : Array.from({ length: FRAMES - startFrame }, (_, i) => startFrame + i)
const t00 = Date.now()
for (const [n, f] of frameList.entries()) {
  const { cam, data } = stateAt(f)
  await capture(cam, data, join(FRAME_DIR, `f${String(f).padStart(4, '0')}.png`), f)
  if (n % 30 === 0) console.log(`frame ${f + 1}/${FRAMES} ${new Date().toISOString().slice(11, 19)} (${((Date.now() - t00) / 1000 / (n + 1)).toFixed(1)} s/frame)`)
}
if (stillWashed.length) console.log(`STILL WASHED: ${stillWashed.join(',')}`)
await browser.close()
if (args.noencode) process.exit(stillWashed.length ? 3 : 0)

// A short fade in from the page's paper and out to it, so the loop reads as a
// beat rather than a cut.
const ff = (argv) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...argv], { stdio: 'inherit' })
const input = ['-framerate', String(FPS), '-i', join(FRAME_DIR, 'f%04d.png')]
const fade = `fade=t=in:st=0:d=0.5:color=0xf8f5ed,fade=t=out:st=${(END_T - 0.7).toFixed(2)}:d=0.7:color=0xf8f5ed`
console.log('encoding webm...')
ff([...input, '-vf', fade, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-pix_fmt', 'yuv420p', '-an', join(OUT, `${NAME}.webm`)])
console.log('encoding mp4...')
ff([...input, '-vf', fade, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', join(OUT, `${NAME}.mp4`)])
console.log('poster...')
const posterFrame = String(Math.round((FINALE_T0 + FINALE_DUR + 0.6) * FPS)).padStart(4, '0')
ff(['-i', join(FRAME_DIR, `f${posterFrame}.png`), '-q:v', '4', join(OUT, `${NAME}-poster.jpg`)])
// The frames are kept (about 1.6 GB): a bad stretch is repaired with --only and
// the film re-encoded from them. Delete the directory once the film is accepted.
console.log(`frames kept in ${FRAME_DIR}`)
console.log('done')
