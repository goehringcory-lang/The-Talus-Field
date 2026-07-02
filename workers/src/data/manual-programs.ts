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

// ── Seed: recurring anchors, dates to be filled from the operators' pages ───
// The 2026 summer schedules publish in late spring. The entries below are the
// standing programs this file exists for, seeded with their known cadence.
// Replace/extend the `dates` arrays from the linked pages each season.
const entries: ManualEntryT[] = [
  {
    key: 'parsons-summer-series',
    source: 'conservancy',
    category: 'arts',
    title: 'Parsons Memorial Lodge Summer Series',
    description:
      'Free talks, music, and poetry in the 1915 stone Sierra Club lodge at Tuolumne Meadows. ' +
      'Programs run summer weekends and close with the Tuolumne Meadows Poetry Festival in mid-August. ' +
      'Confirm the current season schedule on yosemite.org before planning around a date.',
    // TODO: verify — placeholder cadence; replace with the dated list from
    // yosemite.org's Parsons series page before marketing this feed.
    dates: ['2026-07-11', '2026-07-12', '2026-07-18', '2026-07-19', '2026-07-25', '2026-07-26', '2026-08-01', '2026-08-02', '2026-08-08', '2026-08-09'],
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
    // TODO: verify — placeholder weekends; replace with each club's posted
    // Night Sky Network dates before marketing this feed.
    dates: ['2026-07-17', '2026-07-18', '2026-07-24', '2026-07-25', '2026-08-07', '2026-08-08', '2026-08-14', '2026-08-15'],
    timeStart: '21:00',
    location: 'Glacier Point',
    coord: [-119.5731, 37.7283],
    isFree: true,
    url: 'https://nightsky.jpl.nasa.gov/',
  },
  {
    key: 'aramark-valley-floor-tour',
    source: 'aramark',
    category: 'tour',
    title: 'Valley Floor Tour (Yosemite Hospitality)',
    description:
      'The two-hour open-air tram (or heated coach, off-season) loop of the valley floor with a guide. ' +
      'Departs Yosemite Valley Lodge daily, multiple departures. Paid; book at travelyosemite.com. ' +
      'Dates here mark availability, not a single departure time.',
    dates: buildDailyDates('2026-07-01', '2026-10-31'),
    location: 'Yosemite Valley Lodge',
    coord: [-119.5989, 37.7439],
    isFree: false,
    reservationRequired: true,
    url: 'https://www.travelyosemite.com/things-to-do/guided-bus-tours/',
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

// Version label surfaced in the /api/programs `sources` block so the app can
// show which curation pass the offline copy came from.
export const MANUAL_PROGRAMS_VERSION = '2026-summer-seed'

export const MANUAL_PROGRAMS: ProgramEventT[] = sortEvents(parsed.flatMap(expand))

export function manualProgramsInRange(start: string, end: string): ProgramEventT[] {
  return MANUAL_PROGRAMS.filter((ev) => ev.date >= start && ev.date <= end)
}
