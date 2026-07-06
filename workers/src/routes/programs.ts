// =============================================================================
// GET /api/programs?start=YYYY-MM-DD&end=YYYY-MM-DD
//
// Merged, date-sorted park program listings for a trip window: NPS Events API
// data (ingested into KV by the daily cron) plus the manually curated
// partner file. Deliberately UNAUTHENTICATED: it aggregates public program
// listings, and skipping JWT verification removes the "your token expired
// while you were standing in the park" failure mode. The paid wedge is the
// packaged offline experience, not this feed.
//
// Freshness model: the cron refreshes KV daily; if KV is missing or older
// than 48h the route fetches NPS live inline and backfills KV via waitUntil,
// so the feature works the moment the Worker deploys, before any cron tick.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import {
  MANUAL_PROGRAMS_VERSION,
  manualProgramsInRange,
} from '../data/manual-programs'
import { fetchNpsEvents, groupByMonth } from '../lib/nps'
import {
  addDays,
  daysBetween,
  isIsoDate,
  monthsInRange,
  readEventsMeta,
  readMonthEvents,
  sortEvents,
  writeMonthEvents,
  type ProgramEventT,
} from '../lib/programs'

const MAX_SPAN_DAYS = 31
const STALE_AFTER_MS = 48 * 60 * 60 * 1000
export const INGEST_WINDOW_DAYS = 120

// Program dates are park-local (Pacific) calendar strings. "Today" must be
// computed in that zone, not UTC: after ~5pm PDT the UTC date is already
// tomorrow, so a UTC-based ingest window would start tomorrow and drop
// tonight's programs when it rewrites the month buckets.
function parkToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date())
}

// Two program events are "the same" listing when they fall on the same date
// with a title that normalizes identically. Used to drop a hand-curated
// partner entry when NPS staff have entered the same event (e.g. the Parsons
// Lodge series appears in both sources).
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export const programs = new Hono<{ Bindings: Env }>()

programs.get('/', async (c) => {
  const start = c.req.query('start') ?? ''
  const end = c.req.query('end') ?? ''
  if (!isIsoDate(start) || !isIsoDate(end) || end < start || daysBetween(start, end) > MAX_SPAN_DAYS) {
    return c.json(
      { error: `start and end must be YYYY-MM-DD, end >= start, span <= ${MAX_SPAN_DAYS} days` },
      400,
    )
  }

  const meta = await readEventsMeta(c.env)
  const stale = !meta || Date.now() - Date.parse(meta.fetchedAt) > STALE_AFTER_MS

  let npsEvents: ProgramEventT[]
  let syncedAt: string | null
  if (stale) {
    // Cold start or cron gap: serve live and backfill KV in the background.
    try {
      npsEvents = await fetchNpsEvents(c.env, start, end)
      syncedAt = new Date().toISOString()
      c.executionCtx.waitUntil(ingestNpsWindow(c.env))
    } catch (err) {
      console.error('programs: live NPS fetch failed, serving KV as-is', err)
      npsEvents = await readRange(c.env, start, end)
      // No KV meta means the sync moment is simply unknown; an epoch-0
      // stamp used to render as "synced 56 years ago" in the PWA.
      syncedAt = meta?.fetchedAt ?? null
    }
  } else {
    npsEvents = await readRange(c.env, start, end)
    syncedAt = meta.fetchedAt
  }

  const npsInRange = npsEvents.filter((ev) => ev.date >= start && ev.date <= end)
  // Drop manual entries that NPS already carries on the same date, so a
  // program curated in both sources doesn't render twice.
  const npsKeys = new Set(npsInRange.map((ev) => `${ev.date}|${normalizeTitle(ev.title)}`))
  const manual = manualProgramsInRange(start, end).filter(
    (ev) => !npsKeys.has(`${ev.date}|${normalizeTitle(ev.title)}`),
  )
  const events = sortEvents([...npsInRange, ...manual])

  return c.json(
    {
      start,
      end,
      syncedAt,
      events,
      sources: {
        // Omitted (not null) when unknown so pre-nullable PWA builds,
        // whose schema types fetchedAt as a plain string, still parse.
        nps: syncedAt ? { fetchedAt: syncedAt } : undefined,
        manual: { version: MANUAL_PROGRAMS_VERSION },
      },
    },
    200,
    // Edge/browser reuse within the hour; user-visible freshness is governed
    // by syncedAt, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=3600' },
  )
})

async function readRange(env: Env, start: string, end: string): Promise<ProgramEventT[]> {
  const months = monthsInRange(start, end)
  const buckets = await Promise.all(months.map((m) => readMonthEvents(env, m)))
  return buckets.flat()
}

// Shared by the cron and the cold-start backfill: fetch a rolling window of
// NPS events (today → +INGEST_WINDOW_DAYS) and rewrite the month keys.
export async function ingestNpsWindow(env: Env): Promise<void> {
  if (!env.NPS_API_KEY) {
    console.error('ingestNpsWindow: NPS_API_KEY not set; skipping ingest')
    return
  }
  const today = parkToday()
  const horizon = addDays(today, INGEST_WINDOW_DAYS)
  const events = await fetchNpsEvents(env, today, horizon)
  const byMonth = groupByMonth(events)
  // Make sure every month in the window gets (re)written, including months
  // with zero events, so stale KV data ages out.
  for (const month of monthsInRange(today, horizon)) {
    if (!byMonth.has(month)) byMonth.set(month, [])
  }
  await writeMonthEvents(env, byMonth, new Date().toISOString())
  console.log(`ingestNpsWindow: ${events.length} events across ${byMonth.size} months`)
}
