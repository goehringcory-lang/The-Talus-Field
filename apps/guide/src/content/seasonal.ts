// =============================================================================
// SEASONAL ALMANAC — the date-sensitive layer of the guide.
//
// Two kinds of entry, distinguished by `confidence`:
//   'confirmed' — a published date or an astronomical fact (full moons).
//   'typical'   — a recurring pattern (road opening windows, waterfall peak,
//                 the Horsetail Fall window). Labeled as such everywhere it
//                 renders; the description says "typically" in words.
//
// This file is bundled with the app, so the /programs agenda keeps a floor of
// content with no network and no cache: the almanac is part of the download.
// One-day entries (dateEnd === dateStart) merge into the agenda as ordinary
// rows; range entries render as "in season" window cards. Either converts to
// a ProgramEvent ('seasonal' source) via seasonalToProgramEvent when merged
// or added to a trip, and rides the existing snapshot + ICS export path.
//
// Range helpers take the same [start, end] inclusive YYYY-MM-DD contract as
// manualProgramsInRange in the Worker. MAX_SPAN_DAYS does not apply here;
// the pickers clamp the window before these are called.
//
// Every 'confirmed' entry must carry a source note in a comment. Do not add
// operator events with published dates here; those belong in
// workers/src/data/manual-programs.ts.
// =============================================================================

import type { z } from 'zod'
import { ProgramEvent, type ProgramEventT } from '../programs/schema'
import { SeasonalEvents, type SeasonalEventT } from './schema'

type SeasonalInput = z.input<typeof SeasonalEvents>[number]

// ── Full moons, July 2026 through December 2027 ──────────────────────────────
// Dates and Pacific times computed with the standard Meeus lunar-phase
// algorithm (Astronomical Algorithms ch. 49) and cross-checked 2026-07-03
// against published almanac calendars (Royal Museums Greenwich, Astronomy
// Magazine, Farmers' Almanac); every checked instant matched to the minute.
// Dates are the park-local (Pacific) calendar date of the full-moon instant.
const MOON_BASE =
  'A full moon washes out the Milky Way, so save the dark-sky ambitions for another week. The valley gets something in trade: granite holds moonlight, and Tunnel View or Sentinel Bridge stays readable all night without a headlamp.'
const MOON_MOONBOW =
  ' This is also moonbow season. On the nights around full, if Yosemite Falls is running hard, its spray can carry a faint lunar rainbow at the base after dark. A camera on a rock will find it before your eyes do.'

const FULL_MOONS: { date: string; name: string; time: string; moonbow?: boolean }[] = [
  { date: '2026-07-29', name: 'Buck Moon', time: '7:35 a.m.' },
  { date: '2026-08-27', name: 'Sturgeon Moon', time: '9:18 p.m.' },
  { date: '2026-09-26', name: 'Harvest Moon', time: '9:49 a.m.' },
  { date: '2026-10-25', name: "Hunter's Moon", time: '9:11 p.m.' },
  { date: '2026-11-24', name: 'Beaver Moon', time: '6:53 a.m.' },
  { date: '2026-12-23', name: 'Cold Moon', time: '5:28 p.m.' },
  { date: '2027-01-22', name: 'Wolf Moon', time: '4:17 a.m.' },
  { date: '2027-02-20', name: 'Snow Moon', time: '3:23 p.m.' },
  { date: '2027-03-22', name: 'Worm Moon', time: '3:43 a.m.' },
  { date: '2027-04-20', name: 'Pink Moon', time: '3:27 p.m.', moonbow: true },
  { date: '2027-05-20', name: 'Flower Moon', time: '3:58 a.m.', moonbow: true },
  { date: '2027-06-18', name: 'Strawberry Moon', time: '5:44 p.m.', moonbow: true },
  { date: '2027-07-18', name: 'Buck Moon', time: '8:44 a.m.' },
  { date: '2027-08-17', name: 'Sturgeon Moon', time: '12:28 a.m.' },
  { date: '2027-09-15', name: 'Harvest Moon', time: '4:03 p.m.' },
  { date: '2027-10-15', name: "Hunter's Moon", time: '6:47 a.m.' },
  { date: '2027-11-13', name: 'Beaver Moon', time: '7:25 p.m.' },
  { date: '2027-12-13', name: 'Cold Moon', time: '8:08 a.m.' },
]

const fullMoonEntries: SeasonalInput[] = FULL_MOONS.map((m) => ({
  id: `full-moon-${m.date}`,
  title: `Full moon (${m.name})`,
  category: 'astronomy',
  confidence: 'confirmed',
  dateStart: m.date,
  dateEnd: m.date,
  description:
    `The moon reaches full at ${m.time} Pacific, traditionally the ${m.name}. ` +
    MOON_BASE +
    (m.moonbow ? MOON_MOONBOW : ''),
}))

// ── Recurring windows, labeled typical ───────────────────────────────────────
// Patterns anchored against published history, checked 2026-07-03:
// - Tioga/Glacier Point open-close history: nps.gov/yose/planyourvisit/tiogaopen.htm
//   and the Mono Basin research dataset (median close early November; reopen
//   late May to late June, later after big winters).
// - Horsetail Fall window and crowd management: nps.gov/yose/planyourvisit/
//   horsetailfall.htm (the 2026 window ran roughly Feb 11-26 with no
//   reservation requirement; several prior years required one).
// - Half Dome cables and lottery pattern: recreation.gov/permits/234652
//   (cables typically Friday before Memorial Day to the Tuesday after the
//   second Monday in October; preseason lottery has run March 1-31).

const TIOGA_CLOSE_DESC =
  'Tioga Road typically closes for the season with the first storm that sticks, most often in early November, occasionally late October or into December. Closing day is the weather\'s call, not the calendar\'s. When it closes, the whole Tuolumne region of this guide goes with it until spring plowing.'
const GLACIER_CLOSE_DESC =
  'Glacier Point Road typically closes with the first lasting snow in November. Glacier Point, Sentinel Dome, and Taft Point go with it; in winter the road is plowed only as far as the Badger Pass ski area.'
const FALLS_DRY_DESC =
  'Most years, by late summer, Yosemite Falls quietly stops. It is not broken, it is seasonal: the fall runs on snowmelt and returns with the first autumn storms. Bridalveil and Vernal keep running all year, thinner. The wall is still worth standing under.'
const FALL_COLOR_DESC =
  'The valley\'s big-leaf maples, dogwoods, and black oaks turn in the second half of October, and by then the summer crowds are gone. Cook\'s Meadow and the river bends along Northside Drive do most of the work. The quietest good light of the year.'
const STAR_PARTY_DESC =
  'On summer Saturday nights, amateur astronomy clubs have historically set up telescopes at Glacier Point and pointed them at whatever the sky offers. Specific club weekends appear in this programs list once published; if your trip hits a summer Saturday, check before you plan the evening.'

const windowEntries: SeasonalInput[] = [
  {
    id: 'star-party-season-2026',
    title: 'Glacier Point star party season',
    category: 'astronomy',
    confidence: 'typical',
    dateStart: '2026-07-01',
    dateEnd: '2026-08-31',
    location: 'Glacier Point',
    description: STAR_PARTY_DESC,
    stopIds: ['glacier-point'],
  },
  {
    id: 'yosemite-falls-dry-2026',
    title: 'Yosemite Falls typically runs dry',
    category: 'other',
    confidence: 'typical',
    dateStart: '2026-08-15',
    dateEnd: '2026-10-31',
    description: FALLS_DRY_DESC,
  },
  {
    id: 'fall-color-2026',
    title: 'Fall color in the valley',
    category: 'other',
    confidence: 'typical',
    dateStart: '2026-10-15',
    dateEnd: '2026-11-07',
    description: FALL_COLOR_DESC,
    stopIds: ['cooks-meadow-loop'],
  },
  {
    id: 'tioga-close-2026',
    title: 'Tioga Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2026-11-01',
    dateEnd: '2026-11-30',
    url: 'https://www.nps.gov/yose/planyourvisit/seasonal.htm',
    description: TIOGA_CLOSE_DESC,
  },
  {
    id: 'glacier-point-close-2026',
    title: 'Glacier Point Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2026-11-01',
    dateEnd: '2026-11-30',
    url: 'https://www.nps.gov/yose/planyourvisit/seasonal.htm',
    description: GLACIER_CLOSE_DESC,
  },
  {
    id: 'firefall-window-2027',
    title: 'Horsetail Fall firefall window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-02-10',
    dateEnd: '2027-02-28',
    location: 'El Capitan picnic area, Northside Drive',
    url: 'https://www.nps.gov/yose/planyourvisit/horsetailfall.htm',
    description:
      'For about two weeks in late February, if Horsetail Fall is running and the sunset sky is clear, the last light hits the fall head-on and it glows like a ribbon of fire on El Capitan\'s east face. Three things have to line up: water in the fall, a clear western horizon, and you in position an hour early. The park has managed the crowd differently each year, sometimes with reservations and road closures, so check the park\'s Horsetail Fall page once February details post.',
    stopIds: ['el-capitan-meadow'],
  },
  {
    id: 'half-dome-lottery-window-2027',
    title: 'Half Dome preseason permit lottery',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-03-01',
    dateEnd: '2027-03-31',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'The preseason lottery for Half Dome permits has run through March on recreation.gov in recent years, with results in mid-April. One application, up to six ranked dates. Miss it and the daily lottery runs two days ahead all season. Confirm the 2027 dates on recreation.gov before counting on the pattern.',
  },
  {
    id: 'glacier-point-open-2027',
    title: 'Glacier Point Road reopening window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-05-01',
    dateEnd: '2027-06-15',
    url: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    description:
      'Glacier Point Road typically reopens in May, stretching into June after a heavy winter. It usually beats Tioga Road open by a few weeks. Until then the only way to that view is a long ski or a longer walk.',
  },
  {
    id: 'waterfall-peak-2027',
    title: 'Waterfall peak flow',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-05-01',
    dateEnd: '2027-06-15',
    description:
      'The falls run on snowmelt and this is the crescendo: Yosemite Falls at full throat, Bridalveil throwing spray across the road, the Mist Trail earning its name. If waterfalls are the reason for the trip, these are the weeks. Peak moves with the snowpack, earlier in dry years, later in big ones.',
    stopIds: ['bridalveil-fall', 'mist-trail'],
  },
  {
    id: 'tioga-open-2027',
    title: 'Tioga Road reopening window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-05-20',
    dateEnd: '2027-06-30',
    url: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    description:
      'Plowing starts in mid-April and Tioga Road typically reopens somewhere between late May and late June, depending entirely on the snowpack. Big winters push it toward July. Opening weekend in the high country is its own event, with snowbanks over your head at the pass.',
  },
  {
    id: 'half-dome-cables-2027',
    title: 'Half Dome cables typically up',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-05-28',
    dateEnd: '2027-10-12',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'The cables that make the summit walkable typically go up the Friday before Memorial Day and come down after the second Monday in October; in 2027 that pattern lands on roughly these dates. The park confirms each season, and a late snowpack can delay the start. A permit is required every day the cables are up.',
  },
  {
    id: 'star-party-season-2027',
    title: 'Glacier Point star party season',
    category: 'astronomy',
    confidence: 'typical',
    dateStart: '2027-07-01',
    dateEnd: '2027-08-31',
    location: 'Glacier Point',
    description: STAR_PARTY_DESC,
    stopIds: ['glacier-point'],
  },
  {
    id: 'yosemite-falls-dry-2027',
    title: 'Yosemite Falls typically runs dry',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-08-15',
    dateEnd: '2027-10-31',
    description: FALLS_DRY_DESC,
  },
  {
    id: 'fall-color-2027',
    title: 'Fall color in the valley',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-10-15',
    dateEnd: '2027-11-07',
    description: FALL_COLOR_DESC,
    stopIds: ['cooks-meadow-loop'],
  },
  {
    id: 'tioga-close-2027',
    title: 'Tioga Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-11-01',
    dateEnd: '2027-11-30',
    url: 'https://www.nps.gov/yose/planyourvisit/seasonal.htm',
    description: TIOGA_CLOSE_DESC,
  },
  {
    id: 'glacier-point-close-2027',
    title: 'Glacier Point Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-11-01',
    dateEnd: '2027-11-30',
    url: 'https://www.nps.gov/yose/planyourvisit/seasonal.htm',
    description: GLACIER_CLOSE_DESC,
  },
]

// ── Single-day markers derived from the typical patterns ─────────────────────

const dayEntries: SeasonalInput[] = [
  {
    id: 'half-dome-lottery-opens-2027',
    title: 'Half Dome preseason lottery typically opens',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-03-01',
    dateEnd: '2027-03-01',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'If the recent pattern holds, the month-long preseason lottery for Half Dome permits opens today on recreation.gov. It stays open all month; there is no advantage to applying on day one, only a penalty for forgetting.',
  },
  {
    id: 'half-dome-lottery-closes-2027',
    title: 'Half Dome preseason lottery typically closes',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-03-31',
    dateEnd: '2027-03-31',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'Last day of the typical preseason lottery window for Half Dome permits on recreation.gov. Results have historically arrived in mid-April. After this, the daily lottery, two days ahead, is the remaining door.',
  },
]

const seed: SeasonalInput[] = [...fullMoonEntries, ...windowEntries, ...dayEntries]

export const SEASONAL_EVENTS: SeasonalEventT[] = SeasonalEvents.parse(seed).sort((a, b) =>
  a.dateStart === b.dateStart ? a.dateEnd.localeCompare(b.dateEnd) : a.dateStart.localeCompare(b.dateStart),
)

// Range windows (multi-day entries) overlapping [start, end], both inclusive.
export function seasonalWindowsInRange(start: string, end: string): SeasonalEventT[] {
  return SEASONAL_EVENTS.filter(
    (e) => e.dateEnd > e.dateStart && e.dateStart <= end && e.dateEnd >= start,
  )
}

// One-day entries (dateEnd === dateStart) falling inside [start, end].
export function seasonalDaysInRange(start: string, end: string): SeasonalEventT[] {
  return SEASONAL_EVENTS.filter(
    (e) => e.dateEnd === e.dateStart && e.dateStart >= start && e.dateStart <= end,
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function humanDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

// "Feb 10 to Feb 28, 2027" (same-year ranges drop the first year).
export function seasonalRangeLabel(ev: SeasonalEventT): string {
  if (ev.dateEnd === ev.dateStart) return humanDate(ev.dateStart)
  const sameYear = ev.dateStart.slice(0, 4) === ev.dateEnd.slice(0, 4)
  const startLabel = sameYear
    ? `${MONTHS[Number(ev.dateStart.slice(5, 7)) - 1]} ${Number(ev.dateStart.slice(8, 10))}`
    : humanDate(ev.dateStart)
  return `${startLabel} to ${humanDate(ev.dateEnd)}`
}

// Convert an almanac entry to a ProgramEvent pinned to a specific day, so it
// can merge into the agenda and ride the trip snapshot + ICS path unchanged.
// For windows, `day` is the day it is pinned to (usually the first day of the
// window inside the user's dates); the description carries the full range so
// the exported calendar event is self-explanatory.
export function seasonalToProgramEvent(ev: SeasonalEventT, day: string): ProgramEventT {
  const isWindow = ev.dateEnd > ev.dateStart
  const rangeLine = isWindow
    ? `${ev.confidence === 'typical' ? 'Typical window' : 'Window'} runs ${humanDate(ev.dateStart)} to ${humanDate(ev.dateEnd)}.\n\n`
    : ''
  return ProgramEvent.parse({
    id: `seasonal:${ev.id}`,
    source: 'seasonal',
    category: ev.category,
    title: ev.confidence === 'typical' && !ev.title.includes('typically') ? `${ev.title} (typical window)` : ev.title,
    description: rangeLine + ev.description,
    date: day,
    timeStart: ev.timeStart,
    location: ev.location,
    coord: ev.coord,
    url: ev.url,
  })
}
