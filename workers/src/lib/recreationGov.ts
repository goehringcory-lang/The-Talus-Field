// =============================================================================
// RECREATION.GOV — the month availability grid behind campsite watches.
//
// One undocumented but long-stable endpoint answers a campground-month with
// every campsite's per-night status:
//
//   GET https://www.recreation.gov/api/camps/availability/campground/<rgId>
//         /month?start_date=YYYY-MM-01T00:00:00.000Z
//
// Statuses seen on 2026-09-05: Available (bookable online), Reserved, Open
// (walk-up only, not reservable online), Closed, NYR (not yet released), Not
// Reservable, Not Available, Not Available Cutoff. Only `Available` is a
// night somebody can book right now, and it is the only one kept: a month of
// Upper Pines is 500 KB on the wire and a few KB once compacted to the sites
// with at least one open night. Camp 4 is a `Per Person` campground — one
// pseudo-site whose `quantities[date]` is the walk-in spots left — so the
// compaction keeps quantities alongside the dates.
//
// KV (GUIDE_PROGRAMS, the safe-to-lose cache): avail:rg:<rgId>:<yyyy-mm> is
// the compacted month, six hours of TTL so the detail page can still show a
// stale grid with its age while the upstream is refusing us; avail:backoff:rg
// is the stamp that stops the sweep from hammering a 403 or a 429.
//
// The endpoint is not ours. Every request identifies itself (the NWS rule in
// weather.ts), only months with a live watch are fetched, and an unhealthy
// answer backs off exponentially to an hour. Nothing here is a claim about
// the campground: a missing month is "unchecked", never "closed".
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

const RG_USER_AGENT =
  'The Talus Field Guide (thetalusfieldjournal.com, cory@thetalusfieldjournal.com)'
const FETCH_TIMEOUT_MS = 10_000
const MONTH_TTL_SECONDS = 6 * 60 * 60
const BACKOFF_KEY = 'avail:backoff:rg'
const BACKOFF_TTL_SECONDS = 2 * 60 * 60
// Minutes of quiet after the 1st, 2nd, ... consecutive unhealthy answer.
const BACKOFF_STEPS_MIN = [5, 10, 20, 40, 60]
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const AVAIL_MONTH_KEY = (rgId: number, yyyymm: string) => `avail:rg:${rgId}:${yyyymm}`

export const MonthSite = z.object({
  site: z.string(),                                   // "044", the number on the post
  loop: z.string(),                                   // "Upper Pines Loop"
  dates: z.array(z.string()),                         // YYYY-MM-DD nights with status Available, sorted
  qty: z.record(z.string(), z.number()).optional(),   // spots per night where the grid carries a quantity
})
export type MonthSiteT = z.infer<typeof MonthSite>

export const MonthAvailability = z.object({
  fetchedAt: z.string(),
  sites: z.record(z.string(), MonthSite),             // keyed by recreation.gov campsite id
})
export type MonthAvailabilityT = z.infer<typeof MonthAvailability>

export type Backoff = { until: string; failures: number; lastStatus: number }

export function monthUrl(rgId: number, yyyymm: string): string {
  return `https://www.recreation.gov/api/camps/availability/campground/${rgId}/month?start_date=${yyyymm}-01T00%3A00%3A00.000Z`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Reduce a raw month grid to the sites with at least one Available night. A
 * hand-rolled walk with type guards rather than a zod parse: the body is
 * hundreds of KB and every field the sweep does not need is dropped on the
 * way through. A campground in its first-come season (empty availabilities)
 * compacts to `sites: {}`, which is a true statement, not an error.
 */
export function compactMonth(body: unknown, fetchedAt: string): MonthAvailabilityT {
  const sites: Record<string, MonthSiteT> = {}
  const campsites = isRecord(body) ? body.campsites : null
  if (!isRecord(campsites)) return { fetchedAt, sites }
  for (const [id, raw] of Object.entries(campsites)) {
    if (!isRecord(raw)) continue
    const availabilities = isRecord(raw.availabilities) ? raw.availabilities : {}
    const quantities = isRecord(raw.quantities) ? raw.quantities : {}
    const dates: string[] = []
    let qty: Record<string, number> | undefined
    for (const [stamp, status] of Object.entries(availabilities)) {
      if (status !== 'Available') continue
      const date = stamp.slice(0, 10)
      if (!DATE_RE.test(date)) continue
      dates.push(date)
      const q = quantities[stamp]
      if (typeof q === 'number') (qty ??= {})[date] = q
    }
    if (dates.length === 0) continue
    dates.sort()
    sites[id] = { site: str(raw.site), loop: str(raw.loop), dates, ...(qty ? { qty } : {}) }
  }
  return { fetchedAt, sites }
}

export type FetchMonthResult =
  | { ok: true; month: MonthAvailabilityT }
  | { ok: false; status: number; detail: string; retryAfterSeconds?: number }   // status 0 = timeout / network / bad JSON

export async function fetchMonth(rgId: number, yyyymm: string, now = new Date()): Promise<FetchMonthResult> {
  let res: Response
  try {
    res = await fetch(monthUrl(rgId, yyyymm), {
      headers: { 'User-Agent': RG_USER_AGENT, Accept: 'application/json' },
      // Bounded like every upstream here: a hung answer must not eat the run.
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch (err) {
    return { ok: false, status: 0, detail: String(err).slice(0, 200) }
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    // A 429 may say how long to wait; the backoff honors it up to an hour.
    const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '', 10)
    return {
      ok: false,
      status: res.status,
      detail: detail.slice(0, 200),
      ...(Number.isFinite(retryAfter) && retryAfter > 0 ? { retryAfterSeconds: retryAfter } : {}),
    }
  }
  let body: unknown
  try {
    body = await res.json()
  } catch (err) {
    return { ok: false, status: 0, detail: `bad json: ${String(err).slice(0, 160)}` }
  }
  return { ok: true, month: compactMonth(body, now.toISOString()) }
}

/** A refusal or an outage: back off. Anything else (a 404 for a bad rgId) is
 *  that pair's problem alone and never slows the others down. */
export function isUpstreamUnhealthy(status: number): boolean {
  return status === 0 || status === 403 || status === 429 || status >= 500
}

export async function readMonth(
  env: Env,
  rgId: number,
  yyyymm: string,
): Promise<MonthAvailabilityT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(AVAIL_MONTH_KEY(rgId, yyyymm))
  if (!raw) return null
  try {
    const parsed = MonthAvailability.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readMonth: schema drift in KV', { rgId, yyyymm, issue: parsed.error.issues[0] })
      return null
    }
    return parsed.data
  } catch (err) {
    console.error('readMonth: corrupt KV record', { rgId, yyyymm, err })
    return null
  }
}

export async function writeMonth(
  env: Env,
  rgId: number,
  yyyymm: string,
  month: MonthAvailabilityT,
): Promise<void> {
  await env.GUIDE_PROGRAMS.put(AVAIL_MONTH_KEY(rgId, yyyymm), JSON.stringify(month), {
    expirationTtl: MONTH_TTL_SECONDS,
  })
}

export async function readBackoff(env: Env): Promise<Backoff | null> {
  const raw = await env.GUIDE_PROGRAMS.get(BACKOFF_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<Backoff>
    if (typeof parsed.until !== 'string' || typeof parsed.failures !== 'number') return null
    return { until: parsed.until, failures: parsed.failures, lastStatus: parsed.lastStatus ?? 0 }
  } catch {
    return null
  }
}

export async function writeBackoff(
  env: Env,
  prior: Backoff | null,
  status: number,
  now: Date,
  retryAfterSeconds?: number,
): Promise<Backoff> {
  const failures = (prior?.failures ?? 0) + 1
  const stepSeconds = BACKOFF_STEPS_MIN[Math.min(failures, BACKOFF_STEPS_MIN.length) - 1] * 60
  const askedSeconds = Math.min(retryAfterSeconds ?? 0, 60 * 60)
  const next: Backoff = {
    until: new Date(now.getTime() + Math.max(stepSeconds, askedSeconds) * 1000).toISOString(),
    failures,
    lastStatus: status,
  }
  await env.GUIDE_PROGRAMS.put(BACKOFF_KEY, JSON.stringify(next), {
    expirationTtl: BACKOFF_TTL_SECONDS,
  })
  return next
}

export async function clearBackoff(env: Env): Promise<void> {
  await env.GUIDE_PROGRAMS.delete(BACKOFF_KEY)
}
