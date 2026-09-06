// =============================================================================
// Campsite watches for the PWA's Openings tab.
//
//   GET    /api/watch/targets  the campground registry (public, cacheable)
//   GET    /api/watch          this buyer's watches, JWT-gated
//   POST   /api/watch          create one, JWT-gated
//   GET    /api/watch/:id      one watch with the current openings from the
//                              cached grid, JWT-gated
//   POST   /api/watch/:id      retune its channels (CORS allows no PATCH)
//   DELETE /api/watch/:id      remove it, idempotent
//
// The route never talks to recreation.gov. Freshness is the five-minute
// sweep's business (lib/availabilitySweep.ts); an inline fetch here would be
// the thundering herd programs.ts had to single-flight, and a stale grid with
// its age printed is more honest than a slow page. The openings on the detail
// page come from the same matcher the sweep uses, so the two cannot disagree.
// =============================================================================

import { Hono } from 'hono'
import type { Context } from 'hono'
import type { Env } from '../env'
import { CAMPGROUNDS, CAMPGROUND_BY_ID, bookUrl, type Campground } from '../data/campgrounds'
import { matchWatch, monthsOf, watchDates, type Opening } from '../lib/availabilityMatch'
import {
  deleteWatch,
  getBuyer,
  getWatch,
  listWatches,
  putWatch,
  recordWatchWriteAttempt,
  type WatchChannels,
  type WatchRecord,
} from '../lib/kv'
import { parkToday } from '../lib/parkTime'
import { addDays, isIsoDate } from '../lib/programs'
import { readMonth, type MonthAvailabilityT } from '../lib/recreationGov'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'

export const watch = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

// Five is a trip's worth of campgrounds; each live watch is recurring
// upstream cost, so the cap is the buyer's, not the account's lifetime.
const MAX_WATCHES = 5
const MAX_NIGHTS = 14
// The five-month release window plus a month of slack: a watch on unreleased
// (NYR) nights is valid and fires on release day.
const MAX_DAYS_AHEAD = 190
const MAX_PARTY = 6
const MAX_WRITES_PER_HOUR = 30
// Past this the detail page says the grid is old (the sweep runs every five
// minutes, so half an hour means it has been backing off or failing).
const STALE_AFTER_MS = 30 * 60_000
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
// Private state behind a bearer token: never store it at the edge.
const NO_STORE = { 'Cache-Control': 'no-store' }

type Ctx = Context<{ Bindings: Env; Variables: AuthVariables }>

// Same convention as /api/trip/plan: a buyer past expiresAt has lost access;
// no buyer record at all is an operator session, which is allowed.
async function accessEnded(c: Ctx): Promise<boolean> {
  const buyer = await getBuyer(c.env, c.get('authSub'))
  return !!buyer && buyer.expiresAt * 1000 < Date.now()
}

function targetView(t: Campground) {
  return {
    id: t.id,
    name: t.name,
    rgId: t.rgId,
    model: t.model,
    amenityId: t.amenityId,
    release: t.release,
    bookUrl: bookUrl(t),
  }
}

// The public shape (mirrored by hand in apps/guide/src/watch/schema.ts):
// the record minus its owner and raw expiry, with every optional stamp made
// an explicit null so the mirror can be strict about what it receives.
// `open` is the grid's current answer for the watch's nights; `lastOpen` is
// the nights the buyer has been told about, which lags it inside the
// ten-minute backstop or when nothing could be delivered.
function watchView(record: WatchRecord, evaluation: Evaluation) {
  const { lastCheckedAt, openNow } = evaluation
  return {
    id: record.id,
    targetId: record.targetId,
    start: record.start,
    nights: record.nights,
    mode: record.mode,
    party: record.party,
    channels: record.channels,
    createdAt: record.createdAt,
    endsAt: new Date(record.expiresAt * 1000).toISOString(),
    lastCheckedAt,
    open: openNow,
    lastOpen: record.lastOpen ?? [],
    lastError: record.lastError ?? null,
    lastNotifiedAt: record.lastNotifiedAt ?? null,
    notifyCount: record.notifyCount ?? 0,
  }
}

type Availability = { fetchedAt: string; stale: boolean; openings: Opening[] }
type Evaluation = {
  lastCheckedAt: string | null
  openNow: string[]
  availability: Availability | null
}
const UNCHECKED: Evaluation = { lastCheckedAt: null, openNow: [], availability: null }

// Per-request grid cache: five watches on the Pines read each month once.
type GridCache = Map<string, Promise<MonthAvailabilityT | null>>

function gridFor(env: Env, cache: GridCache, rgId: number, month: string) {
  const key = `${rgId}:${month}`
  let pending = cache.get(key)
  if (!pending) {
    pending = readMonth(env, rgId, month)
    cache.set(key, pending)
  }
  return pending
}

// "Last checked" is the age of the grids, not a stamp on the record: the
// sweep rewrites a watch only when something changed, and the grid's
// fetchedAt is the moment recreation.gov was actually asked.
async function evaluate(
  env: Env,
  cache: GridCache,
  record: WatchRecord,
  target: Campground,
  today: string,
): Promise<Evaluation> {
  const dates = watchDates(record.start, record.nights).filter((d) => d >= today)
  if (dates.length === 0) return UNCHECKED
  const months: MonthAvailabilityT[] = []
  for (const month of monthsOf(dates)) {
    const grid = await gridFor(env, cache, target.rgId, month)
    if (!grid) return UNCHECKED
    months.push(grid)
  }
  const fetchedAt = months.map((m) => m.fetchedAt).sort()[0]
  const result = matchWatch(
    { model: target.model, dates, mode: record.mode, party: record.party },
    months,
  )
  return {
    lastCheckedAt: fetchedAt,
    openNow: result.dates,
    availability: {
      fetchedAt,
      stale: Date.now() - Date.parse(fetchedAt) > STALE_AFTER_MS,
      openings: result.openings,
    },
  }
}

function isInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

// Absent keys default on; present keys must be booleans. `strict` (the
// retune route) refuses an absent object outright.
function parseChannels(value: unknown, strict = false): WatchChannels | null {
  if (value === undefined) return strict ? null : { push: true, email: true }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const v = value as Record<string, unknown>
  const push = v.push === undefined ? true : v.push
  const email = v.email === undefined ? true : v.email
  if (typeof push !== 'boolean' || typeof email !== 'boolean') return null
  return { push, email }
}

// Registered before /:id: Hono matches in registration order.
watch.get('/targets', (c) =>
  c.json({ targets: CAMPGROUNDS.map(targetView) }, 200, {
    'Cache-Control': 'public, max-age=3600',
  }),
)

watch.get('/', requireAuth, async (c) => {
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410, NO_STORE)
  const sub = c.get('authSub')
  const records = (await listWatches(c.env, sub)).sort(
    (a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt),
  )
  const cache: GridCache = new Map()
  const today = parkToday()
  const watches = []
  for (const record of records) {
    const target = CAMPGROUND_BY_ID.get(record.targetId)
    const evaluation = target ? await evaluate(c.env, cache, record, target, today) : UNCHECKED
    watches.push(watchView(record, evaluation))
  }
  return c.json({ watches }, 200, NO_STORE)
})

type CreateBody = {
  targetId?: unknown
  start?: unknown
  nights?: unknown
  mode?: unknown
  party?: unknown
  channels?: unknown
}

watch.post('/', requireAuth, async (c) => {
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410, NO_STORE)
  const body = await c.req.json<CreateBody>().catch(() => ({}) as CreateBody)
  const today = parkToday()

  const target = typeof body.targetId === 'string' ? CAMPGROUND_BY_ID.get(body.targetId) : undefined
  if (!target) return c.json({ error: 'Pick a campground from the list.' }, 400)
  const start = typeof body.start === 'string' ? body.start : ''
  if (!isIsoDate(start)) return c.json({ error: 'Pick a first night.' }, 400)
  if (start < today) return c.json({ error: 'That first night has already passed.' }, 400)
  if (start > addDays(today, MAX_DAYS_AHEAD)) {
    return c.json(
      { error: `A watch reaches ${MAX_DAYS_AHEAD} days ahead, a month past the five-month release window.` },
      400,
    )
  }
  if (!isInt(body.nights) || body.nights < 1 || body.nights > MAX_NIGHTS) {
    return c.json({ error: `A watch covers one to ${MAX_NIGHTS} nights.` }, 400)
  }
  const nights = body.nights
  if (body.mode !== 'any' && body.mode !== 'full') {
    return c.json({ error: 'Choose any single night, or every night on one site.' }, 400)
  }
  const mode = body.mode
  let party = 1
  if (target.model === 'person' && body.party !== undefined) {
    if (!isInt(body.party) || body.party < 1 || body.party > MAX_PARTY) {
      return c.json({ error: `Party size is one to ${MAX_PARTY}.` }, 400)
    }
    party = body.party
  }
  const channels = parseChannels(body.channels)
  if (!channels) return c.json({ error: 'Channels must be on or off.' }, 400)
  if (!channels.push && !channels.email) {
    return c.json({ error: 'Turn on at least one of notifications or email.' }, 400)
  }

  const sub = c.get('authSub').toLowerCase()
  if ((await recordWatchWriteAttempt(c.env, sub)) > MAX_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many changes. Try again later.' }, 429, NO_STORE)
  }

  const existing = await listWatches(c.env, sub)
  const cache: GridCache = new Map()
  // A re-submit of the same ask (a double tap, a retried request) is the
  // same watch, not a second one.
  const duplicate = existing.find(
    (w) => w.targetId === target.id && w.start === start && w.nights === nights && w.mode === mode,
  )
  if (duplicate) {
    const evaluation = await evaluate(c.env, cache, duplicate, target, today)
    return c.json({ watch: watchView(duplicate, evaluation) }, 200, NO_STORE)
  }
  if (existing.length >= MAX_WATCHES) {
    return c.json(
      { error: `You already have ${MAX_WATCHES} watches. Delete one to add another.` },
      409,
      NO_STORE,
    )
  }

  const lastNight = addDays(start, nights - 1)
  const record: WatchRecord = {
    id: crypto.randomUUID(),
    sub,
    targetId: target.id,
    start,
    nights,
    mode,
    party,
    channels,
    createdAt: new Date().toISOString(),
    // UTC midnight three days after the last night: at least two full
    // Pacific days for the detail page to still answer, then gone.
    expiresAt: Math.floor(Date.parse(`${addDays(lastNight, 3)}T00:00:00Z`) / 1000),
    lastOpen: [],
    notifyCount: 0,
  }
  await putWatch(c.env, record)
  const evaluation = await evaluate(c.env, cache, record, target, today)
  return c.json({ watch: watchView(record, evaluation) }, 201, NO_STORE)
})

watch.get('/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  if (!UUID_RE.test(id)) return c.json({ error: 'Not found' }, 404, NO_STORE)
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410, NO_STORE)
  const record = await getWatch(c.env, c.get('authSub'), id)
  if (!record || record.expiresAt <= Math.floor(Date.now() / 1000)) {
    return c.json({ error: 'Not found' }, 404, NO_STORE)
  }
  const target = CAMPGROUND_BY_ID.get(record.targetId)
  if (!target) return c.json({ error: 'Not found' }, 404, NO_STORE)
  const evaluation = await evaluate(c.env, new Map(), record, target, parkToday())
  return c.json(
    {
      watch: watchView(record, evaluation),
      target: targetView(target),
      availability: evaluation.availability,
    },
    200,
    NO_STORE,
  )
})

watch.post('/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  if (!UUID_RE.test(id)) return c.json({ error: 'Not found' }, 404, NO_STORE)
  if (await accessEnded(c)) return c.json({ error: 'Access has expired' }, 410, NO_STORE)
  const body = await c.req.json<{ channels?: unknown }>().catch(() => ({}) as { channels?: unknown })
  const channels = parseChannels(body.channels, true)
  if (!channels) return c.json({ error: 'Channels must be on or off.' }, 400)
  if (!channels.push && !channels.email) {
    return c.json({ error: 'Turn on at least one of notifications or email.' }, 400)
  }
  const sub = c.get('authSub').toLowerCase()
  if ((await recordWatchWriteAttempt(c.env, sub)) > MAX_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many changes. Try again later.' }, 429, NO_STORE)
  }
  const record = await getWatch(c.env, sub, id)
  if (!record || record.expiresAt <= Math.floor(Date.now() / 1000)) {
    return c.json({ error: 'Not found' }, 404, NO_STORE)
  }
  record.channels = channels
  await putWatch(c.env, record)
  const target = CAMPGROUND_BY_ID.get(record.targetId)
  const evaluation = target
    ? await evaluate(c.env, new Map(), record, target, parkToday())
    : UNCHECKED
  return c.json({ watch: watchView(record, evaluation) }, 200, NO_STORE)
})

// Idempotent, and the key carries the owner, so there is nothing to check
// beyond the shape of the id. An expired buyer may still tidy up.
watch.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  if (!UUID_RE.test(id)) return c.json({ error: 'Not found' }, 404, NO_STORE)
  const sub = c.get('authSub').toLowerCase()
  if ((await recordWatchWriteAttempt(c.env, sub)) > MAX_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many changes. Try again later.' }, 429, NO_STORE)
  }
  await deleteWatch(c.env, sub, id)
  return c.json({ ok: true }, 200, NO_STORE)
})
