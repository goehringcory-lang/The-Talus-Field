// =============================================================================
// capture-guide-screens.mjs — the Field Guide screenshots on /guide.
//
// Drives the PWA's vite dev server in headless Chromium at a 390 x 844 phone
// frame, 2x, with a fixed park clock, a staged three-day trip and every API
// feed stubbed with plausible readings, and writes each shot as a 640 x 1385
// WebP into img/guide/screens/<name>.v<N>.webp. The table at the bottom
// (SHOTS) is the list page-guide.jsx's APP_SHOTS / NEW_SHOTS draw from.
//
// Usage (from the repo root):
//   cd apps/guide && npx vite --port 5173 --host 127.0.0.1 &
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
//     node scripts/capture-guide-screens.mjs --version=6 [shot ...]
//
// Two rules. The version number is new every refresh: /img/* is served
// immutable for a month, so a replaced file under an old name keeps serving
// the old picture, and page-guide.jsx is edited to the new suffix by hand
// (with every alt and caption that quotes a reading off a screen re-read
// against the new capture). And nothing here talks to the network: the API
// is stubbed below, and every other host is aborted, so a capture can never
// depend on the weather or publish a signup.
//
// Playwright is the global install the verify skill documents
// (.claude/skills/verify/SKILL.md); it is not a dependency of scripts/.
// =============================================================================
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'img', 'guide', 'screens')
const args = process.argv.slice(2)
const versionArg = args.find((a) => a.startsWith('--version='))
if (!versionArg) {
  console.error('usage: node scripts/capture-guide-screens.mjs --version=<N> [shot ...]')
  process.exit(2)
}
const VERSION = versionArg.slice('--version='.length)
const APP = 'http://127.0.0.1:5173'
const API = 'http://localhost:8787'

// Saturday, September 19, 2026, 4:12 p.m. Pacific: the same clock the
// homepage's front-page capture used, so the two agree.
const NOW = new Date('2026-09-19T16:12:00-07:00')
const D1 = '2026-09-19', D2 = '2026-09-20', D3 = '2026-09-21'
const iso = (min) => new Date(NOW.getTime() - min * 60000).toISOString()

function jwt() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: 'reader@example.com', exp: 1800000000 })}.sig`
}

const period = (name, startTime, isDaytime, tempF, shortForecast, precip = 0, wind = '5 mph') => ({
  name, startTime, isDaytime, tempF, shortForecast, precipChance: precip, windSpeed: wind,
})
const spot = (id, label, elevationFt, hi, lo, fc) => ({
  id, label, elevationFt, updatedAt: iso(22),
  periods: [
    period('This Afternoon', `${D1}T12:00:00-07:00`, true, hi, fc, 0, '5 mph'),
    period('Tonight', `${D1}T18:00:00-07:00`, false, lo, 'Clear', 0, '0 to 5 mph'),
    period('Sunday', `${D2}T06:00:00-07:00`, true, hi - 1, 'Sunny', 0, '5 mph'),
    period('Sunday Night', `${D2}T18:00:00-07:00`, false, lo - 1, 'Mostly Clear', 0, '0 to 5 mph'),
    period('Monday', `${D3}T06:00:00-07:00`, true, hi - 3, 'Sunny', 0, '5 to 10 mph'),
    period('Monday Night', `${D3}T18:00:00-07:00`, false, lo - 2, 'Clear', 0, '5 mph'),
    period('Tuesday', `2026-09-22T06:00:00-07:00`, true, hi - 4, 'Mostly Sunny', 10, '5 to 10 mph'),
  ],
})

const FEEDS = {
  '/api/auth/me': { kind: 'buyer', email: 'reader@example.com', purchasedAt: 1756000000, expiresAt: 1803000000 },
  '/api/inventory': { priceCents: 399, renewalPriceCents: 299, cap: 500, sold: 212, remaining: 288 },
  '/api/weather': {
    fetchedAt: iso(22),
    spots: [
      spot('valley', 'Yosemite Valley', 4000, 79, 48, 'Sunny'),
      spot('glacier-mariposa', 'Glacier Point', 7200, 66, 41, 'Sunny'),
      spot('tuolumne', 'Tuolumne Meadows', 8600, 61, 33, 'Sunny'),
      spot('hetch-hetchy', 'Hetch Hetchy', 3800, 82, 52, 'Sunny'),
    ],
  },
  '/api/waits': {
    fetchedAt: iso(6),
    waits: [
      { name: 'South', minutes: 35 },
      { name: 'Arch Rock', minutes: 10 },
      { name: 'Big Oak Flat', minutes: 20 },
    ],
  },
  '/api/alerts': {
    fetchedAt: iso(9),
    alerts: [
      {
        id: 'a1',
        title: 'Glacier Point Road: expect delays for paving through October 1',
        description: 'One-way traffic control on Glacier Point Road between Badger Pass and Washburn Point, weekdays 7 a.m. to 5 p.m. Expect delays up to 30 minutes.',
        category: 'caution',
        url: 'https://www.nps.gov/yose/planyourvisit/conditions.htm',
      },
    ],
    roads: [
      { id: 'tioga', label: 'Tioga Road', status: 'open', detail: 'Tioga Road is open.' },
      { id: 'glacier-point', label: 'Glacier Point Road', status: 'open', detail: 'Glacier Point Road is open.' },
      { id: 'mariposa-grove', label: 'Mariposa Grove Road', status: 'open', detail: 'Mariposa Grove Road is open.' },
      { id: 'hetch-hetchy', label: 'Hetch Hetchy Road', status: 'open', detail: 'Hetch Hetchy Road is open.' },
    ],
    chains: null,
  },
  '/api/air': { fetchedAt: iso(22), observedAt: '2026-09-19 15:00', aqi: 38, pollutant: 'PM2.5', category: 'Good', reportingArea: 'Yosemite NP - Turtleback Dome' },
  '/api/flow': { fetchedAt: iso(31), observedAt: iso(45), cfs: 96, band: 'trickle' },
  '/api/parking': {
    fetchedAt: iso(4),
    lots: [
      { id: 'yosemite-village', name: 'Yosemite Village', capacity: 500, ada: 12, status: 'full', statusText: 'Full', updatedAt: iso(4), lat: 37.7466, lng: -119.5871 },
      { id: 'yosemite-falls', name: 'Yosemite Falls', capacity: 180, ada: 6, status: 'open', statusText: 'Moderate', updatedAt: iso(4), lat: 37.7455, lng: -119.5963 },
      { id: 'curry-village', name: 'Curry Village', capacity: 350, ada: 10, status: 'open', statusText: 'Moderate', updatedAt: iso(4), lat: 37.7377, lng: -119.5719 },
      { id: 'trailhead', name: 'Trailhead (Curry Village)', capacity: 250, ada: 8, status: 'full', statusText: 'Full', updatedAt: iso(4), lat: 37.7358, lng: -119.5669 },
      { id: 'el-capitan', name: 'El Capitan picnic area', capacity: 40, ada: 2, status: 'open', statusText: 'Light', updatedAt: iso(4), lat: 37.7318, lng: -119.6297 },
    ],
  },
}

const ev = (id, source, category, title, date, timeStart, timeEnd, location, extra = {}) => ({
  id, source, category, title, description: '', date, timeStart, timeEnd, location, ...extra,
})
const PROGRAMS = [
  ev('p1', 'nps', 'ranger', 'Ranger Walk: Reading the Valley Floor', D1, '10:00', '11:00', 'Yosemite Valley Welcome Center (shuttle stop 2)', { isFree: true, accessible: true, familyFriendly: true }),
  ev('p2', 'aramark', 'tour', 'Valley Floor Tour', D1, '10:00', '12:00', 'Yosemite Valley Lodge', { reservationRequired: true }),
  ev('p3', 'conservancy', 'arts', 'Art Class: Watercolor in the Meadow', D1, '13:00', '16:00', 'Happy Isles Art and Nature Center (shuttle stop 16)', { reservationRequired: true }),
  ev('p4', 'nps', 'talk', 'Evening Program: Bears of Yosemite', D1, '20:00', '21:00', 'Curry Village Amphitheater', { isFree: true, familyFriendly: true }),
  ev('p5', 'astronomy', 'astronomy', 'Star Party at Glacier Point', D2, '20:30', '22:30', 'Glacier Point amphitheater', { isFree: true }),
  ev('p6', 'nps', 'walk', 'Ranger Walk: Sentinel Dome Sunset', D2, '17:30', '19:00', 'Sentinel Dome Trailhead', { isFree: true }),
  ev('p7', 'nps', 'junior-ranger', 'Junior Ranger Walk', D2, '10:00', '11:00', 'Wawona Visitor Center at Hill’s Studio', { isFree: true, familyFriendly: true, accessible: true }),
  ev('p8', 'nps', 'walk', 'Ranger Walk: Tuolumne Meadows Wildflowers', D3, '10:00', '11:30', 'Tuolumne Meadows Visitor Center', { isFree: true }),
  ev('p9', 'conservancy', 'walk', 'Naturalist Walk: Soda Springs and Parsons Lodge', D3, '14:00', '15:30', 'Lembert Dome parking, Tuolumne Meadows', { reservationRequired: true }),
  ev('p10', 'aramark', 'tour', 'Tuolumne Meadows Hikers Bus', D3, '08:00', '09:30', 'Yosemite Valley Lodge', { reservationRequired: true }),
]

const stop = (stopId, day, startTime, durationMin) => ({
  type: 'stop', itemId: `stop:${stopId}:${day}`, stopId, day,
  ...(startTime ? { startTime } : {}), ...(durationMin ? { durationMin } : {}),
  eventUid: `${stopId}-${day}@guide.thetalusfieldjournal.com`,
})
const hike = (hikeId, day, startTime) => ({
  type: 'hike', itemId: `hike:${hikeId}:${day}`, hikeId, day, ...(startTime ? { startTime } : {}),
  eventUid: `${hikeId}-${day}@guide.thetalusfieldjournal.com`,
})
const prog = (p) => ({ type: 'program', itemId: `program:${p.id}`, programId: p.id, snapshot: p })
const custom = (id, title, day, startTime, durationMin, note) => ({
  type: 'custom', itemId: `custom:${id}`, title, day, startTime, durationMin, ...(note ? { note } : {}),
  eventUid: `${id}@guide.thetalusfieldjournal.com`,
})

const PLAN = {
  version: 1,
  dates: { start: D1, end: D3 },
  updatedAt: iso(80),
  items: [
    stop('tunnel-view', D1, '08:00'),
    stop('bridalveil-fall', D1),
    prog(PROGRAMS[0]),
    stop('mirror-lake', D1),
    custom('lunch-d1', 'Lunch at Curry Village', D1, '13:00', 60, 'Pizza deck. Sit facing Glacier Point.'),
    stop('lower-yosemite-fall', D1),
    stop('sentinel-bridge-sunset', D1, '18:30'),
    stop('glacier-point-road-drive', D2, '08:00'),
    hike('taft-point', D2),
    stop('washburn-point', D2),
    stop('glacier-point', D2),
    prog(PROGRAMS[5]),
    stop('tioga-road-drive', D3, '08:00'),
    stop('olmsted-point', D3),
    stop('tenaya-lake', D3),
    prog(PROGRAMS[8]),
    stop('soda-springs-parsons-lodge', D3),
  ],
}

const STORAGE = {
  'tfg.jwt': jwt(),
  'tfg.onboarded': '1',
  'tfg.install.dismissed': '1',
  'tfg.install.shown': '1',
  'tfg.beforeYouGo.dismissed': '1',
  'tfg.deck.hint': '1',
  'tfg.trip.plan': JSON.stringify(PLAN),
  'tfg.trip.dates': JSON.stringify({ start: D1, end: D3 }),
  'tfg.viewMode': 'cards',
  'tfg.visited': JSON.stringify(['tunnel-view']),
  'tfg.me': JSON.stringify(FEEDS['/api/auth/me']),
  'tfg.downloads': JSON.stringify(Object.fromEntries(['photos-valley','photos-glacier-mariposa','photos-tuolumne','photos-hetch-hetchy','photos-secret-guide','photos-wildlife','trail-tracks','park-map'].map((k) => [k, true]))),
}

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
    colorScheme: 'light',
    permissions: ['geolocation'],
    geolocation: opts.geolocation ?? { latitude: 37.7163, longitude: -119.6773, accuracy: 8 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  await ctx.route(`${API}/**`, async (route) => {
    const u = new URL(route.request().url())
    if (u.pathname === '/api/programs') {
      return route.fulfill({ json: { start: u.searchParams.get('start') ?? D1, end: u.searchParams.get('end') ?? D3, syncedAt: iso(140), events: PROGRAMS, sources: { nps: { fetchedAt: iso(140) }, manual: { version: '2026-09' } } } })
    }
    const body = FEEDS[u.pathname]
    if (body) return route.fulfill({ json: body })
    return route.fulfill({ status: 404, json: { error: 'not staged' } })
  })
  // Nothing else leaves the machine.
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort())
  const page = await ctx.newPage()
  await page.clock.setFixedTime(opts.time ?? NOW)
  await page.addInitScript((storage) => {
    for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v)
  }, { ...STORAGE, ...(opts.storage ?? {}) })
  page.on('pageerror', (e) => console.error('  pageerror:', e.message))
  return { ctx, page }
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
}

// Scroll the window so the first match of `sel` (a Playwright locator
// string) sits `offset` px from the top of the viewport.
async function scrollTo(page, sel, offset = 0) {
  const loc = page.locator(sel).first()
  await loc.waitFor({ state: 'attached', timeout: 15000 })
  await loc.evaluate((el, off) => {
    const r = el.getBoundingClientRect()
    window.scrollBy({ top: r.top - off, behavior: 'instant' })
  }, offset)
  await page.waitForTimeout(500)
}

async function heading(page, alpha) {
  await page.evaluate((a) => {
    const e = new DeviceOrientationEvent('deviceorientationabsolute', { alpha: a, beta: 0, gamma: 0, absolute: true })
    window.dispatchEvent(e)
  }, alpha)
}

const SHOTS = {
  'front-page': { path: '/' },
  'instruments': { path: '/', scroll: ['section[aria-label="Instruments"]', 84] },
  'region-cards': {
    path: '/region/valley',
    prep: async (page) => {
      await page.locator('#valley-loop-drive').evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
    },
  },
  'stop': { path: '/stop/tunnel-view', scroll: ['main picture', 0] },
  'swap': { path: '/stop/tunnel-view', scroll: ['text=/^If full/i', 84] },
  'hikes': { path: '/hikes', scroll: ['text=/Yosemite Valley & surrounding/i', 84] },
  'programs': { path: '/programs', scroll: ['text=/Saturday, September 19/i', 84] },
  'trip-board': { path: '/trip', scroll: ['text=/planned/', 72] },
  'calendar': {
    path: '/trip',
    prep: async (page) => { await page.getByRole('button', { name: /Review & save the calendar file/ }).click() },
    scroll: ['.trip-export', 72],
  },
  'deadlines': { path: '/trip', scroll: ['section.deadlines', 84] },
  'today': { path: '/today' },
  'secret-guide': { path: '/secret-guide' },
  'help': { path: '/help' },
  'near': { path: '/near' },
  'compass': {
    path: '/compass',
    prep: async (page) => {
      const value = await page.locator('select option', { hasText: /Lower Yosemite Fall/ }).first().getAttribute('value')
      await page.selectOption('select', value)
      await page.getByRole('button', { name: /Start the compass/ }).click()
      await page.waitForTimeout(800)
      for (let i = 0; i < 6; i++) { await heading(page, 330); await page.waitForTimeout(80) }
    },
  },
  // A morning clock: at 4:12 p.m. the panel honestly reports the start
  // window as past, which is not the reading the caption describes.
  'daylight': { path: '/hike/upper-yosemite-fall', time: new Date('2026-09-19T07:40:00-07:00'), scroll: ['h2:has-text("Daylight")', 84] },
  'wildlife': { path: '/wildlife' },
}

const names = args.filter((a) => !a.startsWith('--'))
const wanted = names.length ? names : Object.keys(SHOTS)
const browser = await chromium.launch({ args: ['--no-sandbox'] })
for (const name of wanted) {
  const shot = SHOTS[name]
  if (!shot) { console.error('unknown shot', name); continue }
  const { ctx, page } = await newPage(browser, shot)
  await page.goto(APP + shot.path, { waitUntil: 'domcontentloaded' })
  await settle(page)
  if (shot.prep) { await shot.prep(page); await settle(page) }
  if (shot.scroll) await scrollTo(page, ...shot.scroll).catch((e) => console.error('  scroll failed for', name, e.message))
  await page.waitForTimeout(300)
  const png = await page.screenshot({ fullPage: false })
  const file = path.join(OUT, `${name}.v${VERSION}.webp`)
  if (fs.existsSync(file)) {
    console.error(`refusing to overwrite ${file}: pick a new --version (immutable cache, see header)`)
    process.exit(1)
  }
  await sharp(png).resize(640, 1385, { kernel: 'lanczos3' }).webp({ quality: 82 }).toFile(file)
  console.log('captured', path.relative(ROOT, file))
  await ctx.close()
}
await browser.close()
