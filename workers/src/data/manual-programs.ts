// =============================================================================
// MANUAL PROGRAM CURATION — the seasonal file for everything the NPS Events
// API does not carry.
//
// The API covers NPS-led programs plus whichever partner events park staff
// enter. It does NOT reliably carry: Yosemite Conservancy paid adventures and
// naturalist walks (yosemite.org), Aramark / Yosemite Hospitality tours
// (travelyosemite.com), or the Glacier Point astronomy-club star parties
// (dates posted per club on NASA's Night Sky Network). Those are curated here
// by hand, a few times a season, from the published schedules. The Yosemite
// Guide PDF (nps.gov/yose/planyourvisit/guide.htm) is the reconciliation
// ground truth each new issue.
//
// Workflow: edit this file → `npm run typecheck` → `wrangler deploy`.
// Entries are validated at module load; a bad date or category fails the
// deploy loudly instead of shipping a broken feed.
//
// Each entry expands to one ProgramEvent per date in `dates`. Keep entries
// honest: only list dates confirmed on the operator's own page, and carry the
// operator's URL so readers can verify and book.
// =============================================================================

import { z } from 'zod'
import { ProgramEvent, sortEvents, type ProgramEventT } from '../lib/programs'

const ManualEntry = ProgramEvent.omit({ id: true, date: true }).extend({
  key: z.string(),                                 // stable slug, unique in this file
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
})
type ManualEntryT = z.infer<typeof ManualEntry>

// ── Confirmed entries only ───────────────────────────────────────────────────
// Verification passes 2026-07-02 and 2026-07-03. Confirmed this pass: the
// Valley Floor Tour's daily year-round operation (travelyosemite.com), the
// Yosemite Facelift 2026 dates (Yosemite Climbing Association's own
// registration page), and the 2026 Bracebridge Dinner performances
// (travelyosemite.com Bracebridge page; the listed weekdays match the 2026
// calendar, which is the tell against the stale-year traps below). The
// Parsons series and the star parties sit in PENDING_VERIFICATION below until
// their 2026 dated schedules publish.
const entries: ManualEntryT[] = [
  {
    key: 'aramark-valley-floor-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Valley Floor Tour (Yosemite Hospitality)',
    description:
      'The two-hour open-air tram (or heated coach, off-season) loop of the valley floor with a guide. ' +
      'Departs Yosemite Valley Lodge daily, multiple departures. Paid; book at travelyosemite.com. ' +
      'Dates here mark availability, not a single departure time.',
    // Verified 2026-07-02: travelyosemite.com lists the tour as departing
    // daily, year-round (tram in warm months, heated coach off-season).
    // 2026-07-03: extended the availability window a year out on the same
    // year-round basis; refresh on the next curation pass.
    dates: buildDailyDates('2026-07-01', '2027-06-30'),
    location: 'Yosemite Valley Lodge',
    coord: [-119.5989, 37.7439],
    isFree: false,
    reservationRequired: true,
    url: 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/',
  },
  {
    key: 'yca-facelift',
    source: 'manual',
    category: 'other',
    title: 'Yosemite Facelift (Yosemite Climbing Association)',
    description:
      'The park\'s biggest volunteer cleanup: five days of trash collection, trail restoration, and ' +
      'evening films and speakers, run by the Yosemite Climbing Association with the park. Free, ' +
      'registration at yosemiteclimbing.org. Show up, grab a bag, meet the community.',
    // Verified 2026-07-03: yosemiteclimbing.org's 2026 Facelift registration
    // page lists September 23-27, 2026, daily 8 a.m. to 4 p.m.
    dates: ['2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27'],
    timeStart: '08:00',
    timeEnd: '16:00',
    location: 'Yosemite Valley (registration in the valley; sites parkwide)',
    isFree: true,
    url: 'https://www.yosemiteclimbing.org/facelift',
  },
  {
    key: 'bracebridge-dinner',
    source: 'aramark',
    category: 'arts',
    title: 'Bracebridge Dinner (The Ahwahnee)',
    description:
      'The Ahwahnee dining room becomes a Tudor hall for a four-hour pageant of carols, Renaissance ' +
      'theater, and a seven-course dinner; a park holiday tradition since 1927. Formal attire, not ' +
      'recommended under age ten, tickets well in advance at travelyosemite.com. Confirm the full ' +
      'performance calendar there before booking travel.',
    // Verified 2026-07-03: travelyosemite.com's Bracebridge page lists 2026
    // performances on Wed Dec 9, Tue Dec 15, and Sat Dec 19; those weekdays
    // match the 2026 calendar. Re-check for added dates when the winter
    // calendar firms up; some listings suggest a broader Dec 8-18 window.
    dates: ['2026-12-09', '2026-12-15', '2026-12-19'],
    timeStart: '17:00',
    location: 'The Ahwahnee',
    coord: [-119.5747, 37.7458],
    isFree: false,
    reservationRequired: true,
    url: 'https://www.travelyosemite.com/things-to-do/specialty-events/food-and-wine-events/bracebridge-dinner',
  },
]

// ── Pending verification: NOT served ─────────────────────────────────────────
// Checked 2026-07-02, re-checked 2026-07-03, and withheld under the "only
// dates confirmed on the operator's own page" rule. Move an entry back into
// `entries` with real dates once its schedule publishes.
//
// - parsons-summer-series: yosemite.org confirms the series runs in 2026
//   (see their "Yosemite Art and Traditions" project page) but has not
//   published the dated 2026 schedule; the newest dated page is 2025
//   (which ran weekends July 19 to August 17).
// - glacier-point-star-party: no 2026 club weekends posted on the Night Sky
//   Network or the clubs' own sites as of the re-check.
// - vintners-holidays (not yet drafted): partial 2026 dates are visible via
//   participating wineries (e.g. Grgich Hills shows Session 2 Nov 11-14 and
//   Session 3 Nov 18-21, 2026) but travelyosemite.com's full session
//   calendar was not directly confirmable this pass. Draft the entry from
//   the operator page when it can be read.
// - chefs-holidays (not yet drafted): the January-to-early-February 2027
//   session calendar is unannounced as of 2026-07-03.
//
// Stale-date traps seen in search results during the checks, do not reuse:
// "Poetry Festival August 17–18" is the 2024 festival, and the NPS
// event-details star-party listing offering "July 26 & 27, Aug 2 & 3,
// Aug 9 & 10" matches the 2024/2025 calendars, not 2026 weekends (it
// resurfaced verbatim in the 2026-07-03 check; July 26, 2026 is a Sunday).
export const PENDING_VERIFICATION: ManualEntryT[] = [
  {
    key: 'parsons-summer-series',
    source: 'conservancy',
    category: 'arts',
    title: 'Parsons Memorial Lodge Summer Series',
    description:
      'Free talks, music, and poetry in the 1915 stone Sierra Club lodge at Tuolumne Meadows. ' +
      'Programs run summer weekends and close with the Tuolumne Meadows Poetry Festival in mid-August. ' +
      'Confirm the current season schedule on yosemite.org before planning around a date.',
    // TODO: fill from yosemite.org's 2026 Parsons series page when it posts.
    dates: ['2026-07-11'],
    timeStart: '14:00',
    location: 'Parsons Memorial Lodge, Tuolumne Meadows',
    coord: [-119.3589, 37.8772],
    isFree: true,
    url: 'https://yosemite.org/experience/',
  },
  {
    key: 'glacier-point-star-party',
    source: 'astronomy',
    category: 'astronomy',
    title: 'Glacier Point star party (amateur astronomy clubs)',
    description:
      'On assigned summer weekends, California astronomy clubs (San Francisco Amateur Astronomers, MIRA, ' +
      'San Jose Astronomical Association, and others) set up telescopes at Glacier Point and share the sky ' +
      'with the public. Free, weather permitting. Each club posts its own weekend; check the Night Sky ' +
      'Network and the Yosemite Guide for the current summer calendar.',
    // TODO: fill from each club's posted Night Sky Network dates when they post.
    dates: ['2026-07-17'],
    timeStart: '21:00',
    location: 'Glacier Point',
    coord: [-119.5731, 37.7283],
    isFree: true,
    url: 'https://nightsky.jpl.nasa.gov/',
  },
]

// Expand every entry to per-date ProgramEvents and validate the lot at module
// load, mirroring the stops.ts pattern: a curation typo fails typecheck/deploy
// rather than shipping.
function expand(entry: ManualEntryT): ProgramEventT[] {
  const { key, dates, ...rest } = entry
  return dates.map((date) =>
    ProgramEvent.parse({ ...rest, id: `${entry.source}:${key}:${date}`, date }),
  )
}

function buildDailyDates(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const stop = Date.parse(`${end}T00:00:00Z`)
  while (d.getTime() <= stop) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

const parsed = z.array(ManualEntry).parse(entries)
z.array(ManualEntry).parse(PENDING_VERIFICATION) // keep the parked entries valid too

// Version label surfaced in the /api/programs `sources` block so the app can
// show which curation pass the offline copy came from.
export const MANUAL_PROGRAMS_VERSION = '2026-07-fall-winter-pass'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
