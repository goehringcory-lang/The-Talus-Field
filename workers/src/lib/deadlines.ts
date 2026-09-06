// =============================================================================
// DEADLINES — which dated deadlines fall on a given day for a buyer's trip.
//
// The table is scripts/data/deadlines.json, imported at build time (frozen
// into the bundle like the editorial Worker's article catalog, so a row edit
// ships with the next `wrangler deploy`). The PWA carries its own hand mirror
// (apps/guide/src/content/deadlines.ts) with the full resolver the trip board
// draws; this file is the narrow server half the push sweep needs: given the
// trip window the device already registered (tripStart/tripEnd) and the
// deadline ids the buyer opted into on the trip board, which rows are due on
// a particular date.
//
// Only rows that name a moment a person has to act on are pushable:
//   relative     measured from a trip date (Half Dome daily lottery for each
//                day, campground releases and Camp 4 for the arrival day,
//                the wilderness rows for the start day)
//   release-15th the campground rule (the 15th, monthsAhead months before the
//                arrival month; the 15th covers arrivals from the 15th of the
//                target month through the 14th of the next)
//   annual       a fixed window with `published` confidence (the Half Dome
//                preseason lottery), on the day it opens, for the trip year
// `typical` rows (road openings), `season` rows (shuttle end dates) and the
// cables-season rule are information, not deadlines: they render on the board
// and never buzz a phone.
// =============================================================================

import table from '../../../scripts/data/deadlines.json'

type DeadlineRow = {
  id: string
  title: string
  kind: 'annual' | 'relative' | 'release-15th' | 'rule' | 'season'
  time: string
  detail: string
  confidence: 'published' | 'typical'
  tag: string
  offsetDays?: number
  monthsAhead?: number
  start?: { month: number; day: number } | string
  end?: { month: number; day: number } | string
  year?: number
}

const ROWS: DeadlineRow[] = (table as { items: DeadlineRow[] }).items

/** Every id in the table, for validating a device's opt-in list. */
export const DEADLINE_IDS: ReadonlySet<string> = new Set(ROWS.map((r) => r.id))

export type DueDeadline = {
  id: string
  title: string
  time: string
  detail: string
  date: string // YYYY-MM-DD
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function daysBetween(start: string, end: string): string[] {
  const out: string[] = []
  let d = start
  // Trip windows are clamped to 31 days by the app; the cap only guards a
  // malformed record.
  while (d <= end && out.length < 62) {
    out.push(d)
    d = addDays(d, 1)
  }
  return out
}

// The 15th that covers an arrival: arrivals on or after the 15th belong to
// the release `monthsAhead` months before their own month; arrivals before
// the 15th belong to the release one month earlier still.
export function releaseDateFor(arrival: string, monthsAhead: number): string {
  const y = Number(arrival.slice(0, 4))
  const m = Number(arrival.slice(5, 7))
  const day = Number(arrival.slice(8, 10))
  const back = monthsAhead + (day < 15 ? 1 : 0)
  const target = new Date(Date.UTC(y, m - 1 - back, 15))
  return target.toISOString().slice(0, 10)
}

/** Which trip days a relative row is measured from. */
function anchorDays(row: DeadlineRow, tripStart: string, tripEnd: string): string[] {
  if (row.tag === 'date-halfdome') return daysBetween(tripStart, tripEnd)
  return [tripStart] // camping rows: the arrival day; wilderness rows: the start day
}

/**
 * Deadlines from the opted-in set that fall on `date` for this trip window.
 * Pure. An unknown id or a malformed date contributes nothing.
 */
export function deadlinesDueOn(
  tripStart: string,
  tripEnd: string,
  optedIn: readonly string[],
  date: string,
): DueDeadline[] {
  if (!DATE_RE.test(tripStart) || !DATE_RE.test(tripEnd) || !DATE_RE.test(date)) return []
  if (tripEnd < tripStart) return []
  const wanted = new Set(optedIn)
  const out: DueDeadline[] = []
  const tripYear = Number(tripStart.slice(0, 4))

  for (const row of ROWS) {
    if (!wanted.has(row.id) || row.confidence !== 'published') continue
    const dates = new Set<string>()
    if (row.kind === 'relative' && typeof row.offsetDays === 'number') {
      for (const day of anchorDays(row, tripStart, tripEnd)) dates.add(addDays(day, row.offsetDays))
    } else if (row.kind === 'release-15th' && typeof row.monthsAhead === 'number') {
      dates.add(releaseDateFor(tripStart, row.monthsAhead))
    } else if (row.kind === 'annual' && row.start && typeof row.start === 'object') {
      const mm = String(row.start.month).padStart(2, '0')
      const dd = String(row.start.day).padStart(2, '0')
      dates.add(`${tripYear}-${mm}-${dd}`)
    }
    if (dates.has(date)) {
      out.push({ id: row.id, title: row.title, time: row.time, detail: row.detail, date })
    }
  }
  return out
}
