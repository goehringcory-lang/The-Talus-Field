// =============================================================================
// PROGRAMS — normalized park program/event records.
//
// One record per DATE OCCURRENCE: a ranger walk that runs every Tuesday in
// July is many records, one per date. That matches both the NPS Events API
// (which pre-expands recurring events into a `dates` array) and the PWA's
// date-grouped list, and makes range queries plain filters.
//
// KEEP IN SYNC with apps/guide/src/programs/schema.ts — the PWA re-declares
// this schema at its parse boundary. The repo deliberately has no shared
// package; the schema is small enough to mirror by hand.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

export const ProgramSource = z.enum([
  'nps',          // NPS Events API (ranger programs + some partner events)
  'conservancy',  // Yosemite Conservancy (manual curation)
  'aramark',      // Yosemite Hospitality / travelyosemite.com (manual curation)
  'astronomy',    // Glacier Point star parties etc. (manual curation)
  'manual',       // anything else curated by hand
  'seasonal',     // bundled seasonal almanac in the PWA; the Worker never emits it
])
export type ProgramSourceT = z.infer<typeof ProgramSource>

export const ProgramCategory = z.enum([
  'ranger',
  'junior-ranger',
  'walk',
  'talk',
  'astronomy',
  'kids',
  'tour',
  'arts',
  'other',
])
export type ProgramCategoryT = z.infer<typeof ProgramCategory>

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

export const ProgramEvent = z.object({
  id: z.string(),                          // "nps:<guid>:2026-07-12", "manual:parsons-poetry:2026-07-12"
  source: ProgramSource,
  category: ProgramCategory,
  title: z.string(),
  description: z.string().default(''),     // plain text; HTML stripped at normalization
  date: z.string().regex(DATE_RE),          // YYYY-MM-DD, park-local
  timeStart: z.string().regex(TIME_RE).optional(), // "HH:MM" park-local 24h
  timeEnd: z.string().regex(TIME_RE).optional(),
  location: z.string().optional(),          // "Parsons Memorial Lodge"
  coord: z.tuple([z.number(), z.number()]).optional(), // [lng, lat], same convention as Stop
  isFree: z.boolean().optional(),
  reservationRequired: z.boolean().optional(),
  url: z.string().optional(),               // official detail page
})
export type ProgramEventT = z.infer<typeof ProgramEvent>

// ── KV layout ────────────────────────────────────────────────────────────────
// events:YYYY-MM  → ProgramEventT[] for that month (NPS-sourced only; the
//                   manual file is merged at read time so a curation edit
//                   lands on the next deploy without waiting for the cron)
// events:meta     → { fetchedAt: ISO string, months: string[] }

export const EVENTS_MONTH_KEY = (yyyymm: string) => `events:${yyyymm}`
export const EVENTS_META_KEY = 'events:meta'

export type EventsMeta = {
  fetchedAt: string
  months: string[]
}

export async function readEventsMeta(env: Env): Promise<EventsMeta | null> {
  const raw = await env.GUIDE_PROGRAMS.get(EVENTS_META_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as EventsMeta
  } catch (err) {
    console.error('readEventsMeta: corrupt KV record', err)
    return null
  }
}

export async function readMonthEvents(env: Env, yyyymm: string): Promise<ProgramEventT[]> {
  const raw = await env.GUIDE_PROGRAMS.get(EVENTS_MONTH_KEY(yyyymm))
  if (!raw) return []
  try {
    const parsed = z.array(ProgramEvent).safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.error('readMonthEvents: schema drift in KV', yyyymm, parsed.error.issues[0])
      return []
    }
    return parsed.data
  } catch (err) {
    console.error('readMonthEvents: corrupt KV record', yyyymm, err)
    return []
  }
}

export async function writeMonthEvents(
  env: Env,
  byMonth: Map<string, ProgramEventT[]>,
  fetchedAt: string,
): Promise<void> {
  for (const [yyyymm, events] of byMonth) {
    await env.GUIDE_PROGRAMS.put(EVENTS_MONTH_KEY(yyyymm), JSON.stringify(events))
  }
  const meta: EventsMeta = { fetchedAt, months: [...byMonth.keys()].sort() }
  await env.GUIDE_PROGRAMS.put(EVENTS_META_KEY, JSON.stringify(meta))
}

// ── date helpers (all park-local calendar dates as plain strings) ───────────

export function isIsoDate(s: string): boolean {
  return DATE_RE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`))
}

export function monthOf(date: string): string {
  return date.slice(0, 7)
}

// Inclusive list of YYYY-MM months touched by [start, end].
export function monthsInRange(start: string, end: string): string[] {
  const months: string[] = []
  let [y, m] = [Number(start.slice(0, 4)), Number(start.slice(5, 7))]
  const endKey = monthOf(end)
  for (;;) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    months.push(key)
    if (key === endKey || months.length > 24) break
    m += 1
    if (m === 13) {
      m = 1
      y += 1
    }
  }
  return months
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(start: string, end: string): number {
  return Math.round(
    (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000,
  )
}

export function sortEvents(events: ProgramEventT[]): ProgramEventT[] {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1
    const at = a.timeStart ?? '99:99'
    const bt = b.timeStart ?? '99:99'
    if (at !== bt) return at < bt ? -1 : 1
    return a.title.localeCompare(b.title)
  })
}
