// =============================================================================
// DEADLINES — the dates that decide a Yosemite trip, drawn against the buyer's
// own trip dates on the trip board ("Dates that matter").
//
// This is a HAND MIRROR of scripts/data/deadlines.json: same ids, same fields,
// same order, asserted equal by scripts/check-deadlines.mjs. Edit the JSON
// first, then copy the row here. The editorial /dates page and its .ics files
// read the JSON; the app reads this file, because content in this app is
// bundled and offline. Every row carries the NPS page it was read from and the
// table carries the date it was verified. A wrong date here is worse than no
// date.
//
// `kind` decides how a row resolves against a trip:
//   annual        a fixed calendar window every year, placed in the trip year
//   relative      measured from a trip date in days (negative = before). Half
//                 Dome rows apply to every trip day, campground rows to the
//                 arrival day, wilderness rows to the start day
//   release-15th  the campground rule: the 15th at 7 a.m. Pacific,
//                 `monthsAhead` months before the arrival month; the 15th
//                 covers arrivals from the 15th of the target month through
//                 the 14th of the next
//   rule          computed from named anchors (cables-season: the Friday
//                 before Memorial Day, the last Monday in May, to the day after
//                 the second Monday in October)
//   season        a this-year dated window; listed only when its year matches
// `confidence` is `published` when the row is NPS policy and `typical` when it
// is a historical pattern the park does not promise; the board says which.
// Times are Pacific. House style: no em-dashes.
// =============================================================================

import { z } from 'zod'
import { addDaysIso } from '../utils/date'

// The `verified` date from the JSON, printed on the board.
export const DEADLINES_VERIFIED = '2026-09-05'

const MonthDay = z.object({ month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(31) })
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const Common = {
  id: z.string(),
  title: z.string(),
  time: z.string(),
  detail: z.string(),
  confidence: z.enum(['published', 'typical']),
  source: z.url(),
  tag: z.enum(['date-halfdome', 'date-wilderness', 'date-camping', 'date-roads']),
  reads: z.array(z.string()),
}

export const Deadline = z.discriminatedUnion('kind', [
  z.object({ ...Common, kind: z.literal('annual'), start: MonthDay, end: MonthDay }),
  z.object({ ...Common, kind: z.literal('relative'), offsetDays: z.number().int() }),
  z.object({ ...Common, kind: z.literal('release-15th'), monthsAhead: z.number().int().positive() }),
  z.object({ ...Common, kind: z.literal('rule'), rule: z.literal('cables-season') }),
  z.object({ ...Common, kind: z.literal('season'), year: z.number().int(), start: IsoDate, end: IsoDate }),
])
export type DeadlineT = z.infer<typeof Deadline>
export const Deadlines = z.array(Deadline)

type DeadlineInput = z.input<typeof Deadlines>[number]

const seed: DeadlineInput[] = [
  {
    id: 'halfdome-preseason',
    title: 'Half Dome preseason lottery',
    kind: 'annual',
    start: { month: 3, day: 1 },
    end: { month: 3, day: 31 },
    time: 'all day',
    detail:
      'Applications open March 1 and close March 31 on Recreation.gov. Results are emailed in mid-April. $10 per application plus $10 per person if you win. About 225 day-hiker permits a day.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/hdpermits.htm',
    tag: 'date-halfdome',
    reads: ['half-dome-lottery'],
  },
  {
    id: 'halfdome-daily',
    title: 'Half Dome daily lottery',
    kind: 'relative',
    offsetDays: -2,
    time: 'midnight to 4 p.m.',
    detail:
      'About 50 permits a day are drawn two days before the hiking date. Apply between midnight and 4 p.m. Pacific two days ahead; results arrive that evening. $10 per application plus $10 per person.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/hdpermits.htm',
    tag: 'date-halfdome',
    reads: ['half-dome-lottery'],
  },
  {
    id: 'halfdome-cables',
    title: 'Half Dome cables season',
    kind: 'rule',
    rule: 'cables-season',
    time: 'all day',
    detail:
      'The cables go up the Friday before Memorial Day and come down the day after the second Monday in October, conditions permitting. No permit is issued for a day outside the season.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/hdpermits.htm',
    tag: 'date-halfdome',
    reads: ['half-dome-lottery'],
  },
  {
    id: 'wilderness-lottery',
    title: 'Wilderness permit lottery window',
    kind: 'relative',
    offsetDays: -168,
    time: 'Sunday to Saturday',
    detail:
      "60 percent of each trailhead's quota is drawn by lottery 24 weeks ahead: apply during the Sunday-to-Saturday week that falls 24 weeks before your start date. Results come the following Monday. $10 per application plus $5 per person.",
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/wpres.htm',
    tag: 'date-wilderness',
    reads: ['yosemite-walk-up-and-day-of-permits'],
  },
  {
    id: 'wilderness-week-ahead',
    title: 'Wilderness permits: the seven-day release',
    kind: 'relative',
    offsetDays: -7,
    time: '7 a.m.',
    detail:
      "The remaining 40 percent of each trailhead's quota is released on Recreation.gov seven days before the start date at 7 a.m. Pacific. Pickup is in person, the day before between 8 and 5 or the same day between 8 and 11.",
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/wpres.htm',
    tag: 'date-wilderness',
    reads: ['yosemite-walk-up-and-day-of-permits'],
  },
  {
    id: 'camp-15th',
    title: 'Campground release: Pines, Wawona, Hodgdon Meadow',
    kind: 'release-15th',
    monthsAhead: 5,
    time: '7 a.m.',
    detail:
      'Upper, Lower and North Pines, Wawona and Hodgdon Meadow open on Recreation.gov on the 15th of the month at 7 a.m. Pacific, five months ahead: the 15th covers arrivals from the 15th of the month five months out through the 14th of the month after. Valley sites go in minutes.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/camping.htm',
    tag: 'date-camping',
    reads: ['yosemite-camping-complete-guide'],
  },
  {
    id: 'camp-two-weeks',
    title: 'Campground release: the two-week campgrounds',
    kind: 'relative',
    offsetDays: -14,
    time: '7 a.m.',
    detail:
      'Bridalveil Creek, Crane Flat, Tamarack Flat, White Wolf, Yosemite Creek, Porcupine Flat and half of Tuolumne Meadows release two weeks before the arrival date at 7 a.m. Pacific.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/camping.htm',
    tag: 'date-camping',
    reads: ['yosemite-camping-complete-guide'],
  },
  {
    id: 'camp4',
    title: 'Camp 4 release',
    kind: 'relative',
    offsetDays: -7,
    time: '7 a.m.',
    detail: 'Camp 4 sites release one week before the arrival date at 7 a.m. Pacific. $10 per person a night.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/camping.htm',
    tag: 'date-camping',
    reads: ['yosemite-camping-complete-guide'],
  },
  {
    id: 'firefall',
    title: 'Horsetail Fall (Firefall) window',
    kind: 'annual',
    start: { month: 2, day: 10 },
    end: { month: 2, day: 26 },
    time: 'the last 15 minutes of light',
    detail:
      "The sun lines up with Horsetail Fall in the second half of February. In 2026 the park's projected window was February 10 to 26, with no reservation required. The fall only glows if there is water in it and the western sky is clear.",
    confidence: 'typical',
    source:
      'https://www.nps.gov/yose/learn/news/yosemite-national-park-prepares-for-2026-horsetail-fall-viewing.htm',
    tag: 'date-roads',
    reads: ['firefall'],
  },
  {
    id: 'glacier-point-open',
    title: 'Glacier Point Road typically opens',
    kind: 'annual',
    start: { month: 5, day: 1 },
    end: { month: 5, day: 31 },
    time: 'no fixed date',
    detail:
      'Glacier Point Road usually opens in May once plowing is done; in 2026 it opened May 9. The park announces the date a few days ahead. Chains can still be required in the first weeks.',
    confidence: 'typical',
    source: 'https://www.nps.gov/yose/planyourvisit/glacierpointroad.htm',
    tag: 'date-roads',
    reads: ['tioga-opening'],
  },
  {
    id: 'tioga-open',
    title: 'Tioga Road typically opens',
    kind: 'annual',
    start: { month: 5, day: 15 },
    end: { month: 6, day: 30 },
    time: 'no fixed date',
    detail:
      'Tioga Road has opened between late April and early July over the record; late May to mid-June is the usual range, and 2026 opened May 15. The park posts plowing progress weekly and announces the opening a day or two ahead.',
    confidence: 'typical',
    source: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    tag: 'date-roads',
    reads: ['tioga-opening'],
  },
  {
    id: 'tioga-close',
    title: 'Tioga Road typically closes',
    kind: 'annual',
    start: { month: 11, day: 1 },
    end: { month: 11, day: 30 },
    time: 'no fixed date',
    detail:
      'Tioga Road closes for the season with the first storm that sticks, usually in November. Services in Tuolumne Meadows close weeks earlier: after mid-September a day up high is drive-yourself and self-supported.',
    confidence: 'typical',
    source: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    tag: 'date-roads',
    reads: ['tioga-opening'],
  },
  {
    id: 'tuolumne-shuttle-2026',
    title: 'Tuolumne Meadows shuttle and hikers bus end',
    kind: 'season',
    year: 2026,
    start: '2026-09-13',
    end: '2026-09-13',
    time: 'last runs',
    detail:
      'The Tuolumne shuttle and the Valley-to-Tuolumne hikers bus stop for 2026 on September 13. The Tuolumne store and grill close September 20. Tioga Road itself stays open until the snow closes it.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/tmbus.htm',
    tag: 'date-roads',
    reads: ['tioga-opening'],
  },
  {
    id: 'grove-shuttle-2026',
    title: 'Mariposa Grove shuttle season',
    kind: 'season',
    year: 2026,
    start: '2026-05-03',
    end: '2026-10-31',
    time: '8 a.m. to 7 p.m. through September 23, then 8 to 5',
    detail:
      'The free shuttle from the Welcome Plaza to the grove runs May 3 to October 31, 2026, with November service 8 to 3:30 and none from December to mid-April. When it is off, the Washburn Trail is 2 miles and 500 feet up to the trees.',
    confidence: 'published',
    source: 'https://www.nps.gov/yose/planyourvisit/mg.htm',
    tag: 'date-roads',
    reads: ['tioga-opening'],
  },
]

export const DEADLINES: DeadlineT[] = Deadlines.parse(seed)

// ── Resolution ───────────────────────────────────────────────────────────────

export type ResolvedDeadline = {
  id: string
  title: string
  kind: DeadlineT['kind']
  confidence: DeadlineT['confidence']
  tag: DeadlineT['tag']
  source: string
  /** The day the deadline falls on (a window's first day). YYYY-MM-DD. */
  date: string
  /** A window's last day, inclusive; equals `date` for a one-day deadline. */
  endDate: string
  time: string
  detail: string
  /** For a relative row, the trip day it is measured from. */
  forDay?: string
  /** True once the whole date (or window) is behind `today`. */
  past: boolean
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function ymd(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`
}

function dayOfWeek(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getUTCDay()
}

export function daysInWindow(start: string, end: string): string[] {
  const out: string[] = []
  let d = start
  // The app clamps a trip to 31 days; the cap only guards a malformed input.
  while (d <= end && out.length < 62) {
    out.push(d)
    d = addDaysIso(d, 1)
  }
  return out
}

/** Memorial Day: the last Monday in May. */
export function memorialDay(year: number): string {
  let d = ymd(year, 5, 31)
  while (dayOfWeek(d) !== 1) d = addDaysIso(d, -1)
  return d
}

/** The Half Dome cables season for a year: up the Friday before Memorial Day,
 *  down the day after the second Monday in October. */
export function cablesSeason(year: number): { start: string; end: string } {
  const start = addDaysIso(memorialDay(year), -3)
  let firstMonday = ymd(year, 10, 1)
  while (dayOfWeek(firstMonday) !== 1) firstMonday = addDaysIso(firstMonday, 1)
  const end = addDaysIso(firstMonday, 8) // second Monday, plus one
  return { start, end }
}

/** The 15th that covers an arrival date under the release-15th rule. */
export function releaseDateFor(arrival: string, monthsAhead: number): string {
  const y = Number(arrival.slice(0, 4))
  const m = Number(arrival.slice(5, 7))
  const day = Number(arrival.slice(8, 10))
  // Arrivals before the 15th belong to the release one month earlier still:
  // the 15th of X covers arrivals from the 15th of X+n through the 14th of X+n+1.
  const back = monthsAhead + (day < 15 ? 1 : 0)
  return new Date(Date.UTC(y, m - 1 - back, 15)).toISOString().slice(0, 10)
}

/** Which trip days a relative row is measured from. */
export function anchorDaysFor(row: DeadlineT, tripStart: string, tripEnd: string): string[] {
  if (row.tag === 'date-halfdome') return daysInWindow(tripStart, tripEnd)
  // Campground rows: the arrival day. Wilderness rows: the start day. Same
  // date, different reason, both the first day of the trip.
  return [tripStart]
}

/**
 * The deadlines that matter for a trip, dated, soonest first. Pure: the same
 * three dates always give the same list. A malformed or inverted window
 * resolves to nothing rather than to a guess.
 */
export function resolveDeadlines(tripStart: string, tripEnd: string, today: string): ResolvedDeadline[] {
  if (!ISO_RE.test(tripStart) || !ISO_RE.test(tripEnd) || !ISO_RE.test(today)) return []
  if (tripEnd < tripStart) return []
  const tripYear = Number(tripStart.slice(0, 4))
  const out: ResolvedDeadline[] = []

  const push = (row: DeadlineT, date: string, endDate: string, forDay?: string) => {
    out.push({
      id: row.id,
      title: row.title,
      kind: row.kind,
      confidence: row.confidence,
      tag: row.tag,
      source: row.source,
      date,
      endDate,
      time: row.time,
      detail: row.detail,
      forDay,
      past: endDate < today,
    })
  }

  for (const row of DEADLINES) {
    switch (row.kind) {
      case 'relative': {
        for (const day of anchorDaysFor(row, tripStart, tripEnd)) {
          const date = addDaysIso(day, row.offsetDays)
          // The wilderness lottery is a Sunday-to-Saturday week, not a day:
          // the window is the week containing the date 24 weeks out.
          if (row.id === 'wilderness-lottery') {
            const sunday = addDaysIso(date, -dayOfWeek(date))
            push(row, sunday, addDaysIso(sunday, 6), day)
          } else {
            push(row, date, date, day)
          }
        }
        break
      }
      case 'release-15th': {
        const date = releaseDateFor(tripStart, row.monthsAhead)
        push(row, date, date, tripStart)
        break
      }
      case 'annual': {
        push(row, ymd(tripYear, row.start.month, row.start.day), ymd(tripYear, row.end.month, row.end.day))
        break
      }
      case 'rule': {
        const season = cablesSeason(tripYear)
        push(row, season.start, season.end)
        break
      }
      case 'season': {
        if (row.year === tripYear) push(row, row.start, row.end)
        break
      }
    }
  }

  out.sort((a, b) => a.date.localeCompare(b.date) || a.endDate.localeCompare(b.endDate) || a.id.localeCompare(b.id))
  return out
}

// ── Clock ────────────────────────────────────────────────────────────────────

/** Minutes from midnight for "7 a.m.", "4 p.m.", "midnight", "noon", "8:30 p.m.". */
export function parseClock(text: string): number | null {
  const t = text.trim().toLowerCase()
  if (t === 'midnight') return 0
  if (t === 'noon') return 12 * 60
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)$/)
  if (!m) return null
  let h = Number(m[1])
  const min = m[2] ? Number(m[2]) : 0
  if (h < 1 || h > 12 || min > 59) return null
  const pm = m[3].startsWith('p')
  if (h === 12) h = 0
  if (pm) h += 12
  return h * 60 + min
}

/**
 * The clock window a row's `time` string names, for the calendar event: a
 * single time ("7 a.m.") is a one-hour event starting then; a range
 * ("midnight to 4 p.m.") is the range; anything else ("all day", "no fixed
 * date", "last runs", the shuttle hours) is an all-day event.
 */
export function deadlineClock(time: string): { startMin: number; durationMin: number } | null {
  const range = time.split(/\s+to\s+/)
  if (range.length === 2) {
    const a = parseClock(range[0])
    const b = parseClock(range[1])
    if (a !== null && b !== null && b > a) return { startMin: a, durationMin: b - a }
    return null
  }
  const single = parseClock(time)
  return single === null ? null : { startMin: single, durationMin: 60 }
}
