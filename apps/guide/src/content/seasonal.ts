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

// ── Full moons, July 2026 through December 2028 ──────────────────────────────
// Dates and Pacific times computed with the standard Meeus lunar-phase
// algorithm (Astronomical Algorithms ch. 49) and cross-checked 2026-07-03
// against published almanac calendars (Royal Museums Greenwich, Astronomy
// Magazine, Farmers' Almanac); every checked instant matched to the minute.
// The 2028 set was computed 2026-07-24 with the same implementation (which
// reproduces every previously verified 2026-2027 instant to the minute) and
// spot-checked against published 2028 calendars (Jan 11 and Dec 31 matched to
// the minute; 2028 has 13 full moons, two in December, the second a calendar
// blue moon). Dates are the park-local (Pacific) calendar date of the
// full-moon instant — early-morning UTC instants (e.g. June 2028) land a
// calendar day earlier here than in UTC-based lists, by design.
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
  { date: '2028-01-11', name: 'Wolf Moon', time: '8:03 p.m.' },
  { date: '2028-02-10', name: 'Snow Moon', time: '7:03 a.m.' },
  { date: '2028-03-10', name: 'Worm Moon', time: '5:06 p.m.' },
  { date: '2028-04-09', name: 'Pink Moon', time: '3:26 a.m.', moonbow: true },
  { date: '2028-05-08', name: 'Flower Moon', time: '12:48 p.m.', moonbow: true },
  { date: '2028-06-06', name: 'Strawberry Moon', time: '11:08 p.m.', moonbow: true },
  { date: '2028-07-06', name: 'Buck Moon', time: '11:10 a.m.' },
  { date: '2028-08-05', name: 'Sturgeon Moon', time: '1:09 a.m.' },
  // The Harvest Moon shifts to October in 2028 (nearer the equinox), so
  // September takes the Corn Moon name and November the Beaver Moon.
  { date: '2028-09-03', name: 'Corn Moon', time: '4:47 p.m.' },
  { date: '2028-10-03', name: 'Harvest Moon', time: '9:25 a.m.' },
  { date: '2028-11-02', name: 'Beaver Moon', time: '2:17 a.m.' },
  { date: '2028-12-01', name: 'Cold Moon', time: '5:40 p.m.' },
  // Second December full moon: a calendar blue moon closes the year.
  { date: '2028-12-31', name: 'Blue Moon', time: '8:48 a.m.' },
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
    id: 'mist-trail-repair-closure-2026',
    title: 'Mist Trail weekday closure for repairs',
    category: 'other',
    confidence: 'confirmed',
    // Source: Yosemite Guide Vol 51 Issue 6 (July 15 - August 18, 2026), which
    // moves the closure's start from the June 30 printed in v51n5 to July 27.
    dateStart: '2026-07-27',
    dateEnd: '2026-10-31',
    location: 'Mist Trail, Vernal and Nevada Fall corridor',
    url: 'https://www.nps.gov/yose/planyourvisit/conditions.htm',
    description:
      'The Mist Trail is closed for trail repairs Monday through Thursday, 7 a.m. to 3:30 p.m., from July 27 through the end of October 2026. It is open Fridays, Saturdays, Sundays, and holidays, and on weekdays before 7 and after 3:30 when conditions allow. If Vernal and Nevada Fall are the point of a weekday, start very early or plan the John Muir Trail side, and check conditions before committing.',
    stopIds: ['mist-trail'],
  },
  {
    id: 'jmt-clark-point-closure-2026',
    title: 'John Muir Trail closed below Clark Point',
    category: 'other',
    confidence: 'confirmed',
    // Source: Yosemite Guide Vol 51 Issue 5 (June 10 - July 14, 2026). The
    // guide says "until mid-July"; dateEnd pins the card's disappearance and
    // the description carries the hedge in words.
    dateStart: '2026-06-10',
    dateEnd: '2026-07-15',
    location: 'John Muir Trail, Clark Point to the Panorama Trail junction',
    url: 'https://www.nps.gov/yose/planyourvisit/conditions.htm',
    description:
      'The John Muir Trail is closed between Clark Point and the Panorama Trail junction for trail repair, scheduled through mid-July 2026. That blocks the usual gentle descent from Nevada Fall, and short Panorama Trail closures are possible during the work. Check at the Welcome Center before building a loop around it.',
    stopIds: ['mist-trail', 'four-mile-trailhead'],
  },
  {
    id: 'star-party-season-2026',
    title: 'Glacier Point star party season',
    category: 'astronomy',
    // Confirmed for this stretch, unlike the later years' typical windows: the
    // Yosemite Guide Vol 51 Issue 6 prints the club weekends, and the programs
    // feed carries each night as its own dated event.
    confidence: 'confirmed',
    dateStart: '2026-07-17',
    dateEnd: '2026-08-15',
    location: 'Glacier Point Amphitheater',
    description:
      'Amateur astronomy clubs set up telescopes at the Glacier Point Amphitheater and point them at whatever the sky offers, in cooperation with the park. Free, drop in any time after 8:30 p.m.; programs run two to four hours and are canceled if it clouds over. The published 2026 weekends are July 17 and 18, July 31 and August 1, August 7 and 8, and August 14 and 15, and each night appears as its own event in this list. Transportation to Glacier Point is on you, and it is an hour from the valley in the dark.',
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
  // 2028: the same typical patterns as 2027, so an 18-month access window
  // bought in mid-2026 (or renewed) never runs into an empty almanac. All
  // typical-confidence; the calendar arithmetic for the Half Dome cables
  // (Friday before Memorial Day 2028 = May 26; Tuesday after the second
  // Monday of October = Oct 10) follows the published pattern.
  {
    id: 'firefall-window-2028',
    title: 'Horsetail Fall firefall window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-02-10',
    dateEnd: '2028-02-28',
    location: 'El Capitan picnic area, Northside Drive',
    url: 'https://www.nps.gov/yose/planyourvisit/horsetailfall.htm',
    description:
      'For about two weeks in late February, if Horsetail Fall is running and the sunset sky is clear, the last light hits the fall head-on and it glows like a ribbon of fire on El Capitan\'s east face. Three things have to line up: water in the fall, a clear western horizon, and you in position an hour early. The park has managed the crowd differently each year, sometimes with reservations and road closures, so check the park\'s Horsetail Fall page once February details post.',
    stopIds: ['el-capitan-meadow'],
  },
  {
    id: 'half-dome-lottery-window-2028',
    title: 'Half Dome preseason permit lottery',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-03-01',
    dateEnd: '2028-03-31',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'The preseason lottery for Half Dome permits has run through March on recreation.gov in recent years, with results in mid-April. One application, up to six ranked dates. Miss it and the daily lottery runs two days ahead all season. Confirm the 2028 dates on recreation.gov before counting on the pattern.',
  },
  {
    id: 'glacier-point-open-2028',
    title: 'Glacier Point Road reopening window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-05-01',
    dateEnd: '2028-06-15',
    url: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    description:
      'Glacier Point Road typically reopens in May, stretching into June after a heavy winter. It usually beats Tioga Road open by a few weeks. Until then the only way to that view is a long ski or a longer walk.',
  },
  {
    id: 'waterfall-peak-2028',
    title: 'Waterfall peak flow',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-05-01',
    dateEnd: '2028-06-15',
    description:
      'The falls run on snowmelt and this is the crescendo: Yosemite Falls at full throat, Bridalveil throwing spray across the road, the Mist Trail earning its name. If waterfalls are the reason for the trip, these are the weeks. Peak moves with the snowpack, earlier in dry years, later in big ones.',
    stopIds: ['bridalveil-fall', 'mist-trail'],
  },
  {
    id: 'tioga-open-2028',
    title: 'Tioga Road reopening window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-05-20',
    dateEnd: '2028-06-30',
    url: 'https://www.nps.gov/yose/planyourvisit/tiogaopen.htm',
    description:
      'Plowing starts in mid-April and Tioga Road typically reopens somewhere between late May and late June, depending entirely on the snowpack. Big winters push it toward July. Opening weekend in the high country is its own event, with snowbanks over your head at the pass.',
  },
  {
    id: 'half-dome-cables-2028',
    title: 'Half Dome cables typically up',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-05-26',
    dateEnd: '2028-10-10',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'The cables that make the summit walkable typically go up the Friday before Memorial Day and come down after the second Monday in October; in 2028 that pattern lands on roughly these dates. The park confirms each season, and a late snowpack can delay the start. A permit is required every day the cables are up.',
  },
  {
    id: 'star-party-season-2028',
    title: 'Glacier Point star party season',
    category: 'astronomy',
    confidence: 'typical',
    dateStart: '2028-07-01',
    dateEnd: '2028-08-31',
    location: 'Glacier Point',
    description: STAR_PARTY_DESC,
    stopIds: ['glacier-point'],
  },
  {
    id: 'yosemite-falls-dry-2028',
    title: 'Yosemite Falls typically runs dry',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-08-15',
    dateEnd: '2028-10-31',
    description: FALLS_DRY_DESC,
  },
  {
    id: 'fall-color-2028',
    title: 'Fall color in the valley',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-10-15',
    dateEnd: '2028-11-07',
    description: FALL_COLOR_DESC,
    stopIds: ['cooks-meadow-loop'],
  },
  {
    id: 'tioga-close-2028',
    title: 'Tioga Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-11-01',
    dateEnd: '2028-11-30',
    url: 'https://www.nps.gov/yose/planyourvisit/seasonal.htm',
    description: TIOGA_CLOSE_DESC,
  },
  {
    id: 'glacier-point-close-2028',
    title: 'Glacier Point Road closing window',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-11-01',
    dateEnd: '2028-11-30',
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
  {
    id: 'half-dome-lottery-opens-2028',
    title: 'Half Dome preseason lottery typically opens',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-03-01',
    dateEnd: '2028-03-01',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'If the recent pattern holds, the month-long preseason lottery for Half Dome permits opens today on recreation.gov. It stays open all month; there is no advantage to applying on day one, only a penalty for forgetting.',
  },
  {
    id: 'half-dome-lottery-closes-2028',
    title: 'Half Dome preseason lottery typically closes',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-03-31',
    dateEnd: '2028-03-31',
    url: 'https://www.recreation.gov/permits/234652',
    description:
      'Last day of the typical preseason lottery window for Half Dome permits on recreation.gov. Results have historically arrived in mid-April. After this, the daily lottery, two days ahead, is the remaining door.',
  },
]

// ── Meteor showers, category 'astronomy' ─────────────────────────────────────
// Peak nights are IMO shower calendar dates (imo.net/resources/calendar,
// consulted 2026-07-30): Perseids ~Aug 12/13, Geminids ~Dec 13/14, Lyrids
// ~Apr 22. `confidence` is 'confirmed' because the peak date is an
// astronomical fact; the description still hedges viewing quality, since
// clear weather is never guaranteed. Each entry's moon call is checked
// against this file's own FULL_MOONS table: a peak within about 4 days of a
// listed full moon is called out as a washed-out year, otherwise the year is
// called good, and the arithmetic is shown in the comment above the entry.
// High country (Glacier Point Road, Tioga Road) is only open for the August
// showers; by December and still in April it is closed for the season, so
// those years point to valley-floor meadows instead.
// 2026 Lyrids (peak Apr 22, 2026) already fell before this file's 2026-07-30
// bundling date and is omitted; 2026 Perseids and Geminids both still lie
// ahead and are included.

const PERSEIDS_LOCATION = 'Glacier Point, or the Olmsted Point and Tenaya Lake pullouts on Tioga Road'
const GEMINIDS_LOCATION = "Cook's Meadow or El Capitan Meadow, valley floor"
const LYRIDS_LOCATION = 'Valley floor meadows; the high country is still closed'
const RIM_STOP_IDS = ['glacier-point', 'olmsted-point', 'tenaya-lake']
const VALLEY_MEADOW_STOP_IDS = ['cooks-meadow-loop', 'el-capitan-meadow']

const meteorEntries: SeasonalInput[] = [
  // Perseids 2026: IMO peak Aug 12/13. Nearest full moons in FULL_MOONS are
  // 2026-07-29 (Buck, 14 days before) and 2026-08-27 (Sturgeon, 15 days
  // after), both outside the ~4-day interference band. New moon falls
  // almost exactly on the peak (Jul 29 + a 14.77-day half cycle = Aug
  // 12-13), so the sky is about as dark as it gets. Good year.
  {
    id: 'perseids-2026',
    title: 'Perseid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2026-08-11',
    dateEnd: '2026-08-13',
    location: PERSEIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Perseids peak on the night of August 12 into the 13th, the most reliable meteor shower of the year, weather permitting. The moon works in your favor in 2026: a thin waning crescent that week, essentially out of the sky, so a clear night should run close to the shower\'s full rate. Glacier Point\'s open horizon, or the Olmsted Point and Tenaya Lake pullouts on Tioga Road, are considerably darker than the valley floor. Best after 11 p.m., once the radiant climbs higher in Perseus.',
    stopIds: RIM_STOP_IDS,
  },
  // Geminids 2026: IMO peak Dec 13/14. Nearest full moons: 2026-11-24
  // (Beaver, 19 days before) and 2026-12-23 (Cold, 10 days after), both
  // outside the ~4-day band. New moon falls around Dec 9 (Nov 24 + a
  // 14.77-day half cycle), so the peak sits in a young crescent that sets
  // by early evening. Good year; the road closures are the real constraint.
  {
    id: 'geminids-2026',
    title: 'Geminid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2026-12-12',
    dateEnd: '2026-12-14',
    location: GEMINIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Geminids peak on the night of December 13 into 14, reliably the strongest shower of the year, over 100 meteors an hour under a dark sky and clear weather. The moon cooperates in 2026 too, a thin crescent that sets by early evening, leaving the rest of the night moonless. The high country is not an option by mid-December: Tioga Road and Glacier Point Road are almost always closed for the season, so this is a valley-floor watch. Cook\'s Meadow or El Capitan Meadow, well back from the lodges\' lights, are the best the valley offers, a mediocre observatory next to the rim but good enough on a clear night.',
    stopIds: VALLEY_MEADOW_STOP_IDS,
  },
  // Perseids 2027: IMO peak Aug 12/13. Nearest full moon: 2027-08-17
  // (Sturgeon), 4-5 days after peak, roughly 80-85% illuminated waxing
  // gibbous, inside the ~4-day interference band. Poor year.
  {
    id: 'perseids-2027',
    title: 'Perseid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2027-08-11',
    dateEnd: '2027-08-13',
    location: PERSEIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Perseids peak on the night of August 12 into the 13th, but 2027 is a poor year to plan around, clouds aside. The moon turns full on August 17, close enough to peak that it rises bright and gibbous in mid-evening and does not set until near dawn, and only the shower\'s brightest fireballs will cut through the glow. Glacier Point and the Tioga Road pullouts are still the darkest sky within reach, moon or not, and a night closer to the new moon later in the month will show more meteors than the peak itself.',
    stopIds: RIM_STOP_IDS,
  },
  // Geminids 2027: IMO peak Dec 13/14. FULL_MOONS lists 2027-12-13 as the
  // Cold Moon: the peak night IS the full moon, a 0-day gap. Worst-case
  // interference.
  {
    id: 'geminids-2027',
    title: 'Geminid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2027-12-12',
    dateEnd: '2027-12-14',
    location: GEMINIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Geminids peak on the night of December 13 into 14, and in 2027 that night is also the full Cold Moon, about the worst pairing the calendar can produce. The sky stays bright from dusk to dawn and only the brightest fireballs will show, clear skies or not. Tioga Road and Glacier Point Road are closed for the season by then regardless, so the only option is the valley floor, and this is a year to expect a short list of meteors rather than skip the shower outright.',
    stopIds: VALLEY_MEADOW_STOP_IDS,
  },
  // Lyrids 2027: IMO peak Apr 22. FULL_MOONS lists the Pink Moon at
  // 2027-04-20, two days before peak, inside the ~4-day band and roughly
  // 95%+ illuminated. Poor year.
  {
    id: 'lyrids-2027',
    title: 'Lyrid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2027-04-21',
    dateEnd: '2027-04-23',
    location: LYRIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Lyrids peak on the night of April 22, a modest shower, usually 10 to 20 meteors an hour at best even on a clear night, but the only one on the spring calendar. The moon turns full on April 20, two days before peak, and will be up most of the night, bright enough to bury the fainter streaks. Glacier Point Road and Tioga Road are still closed for the season in April, so the valley floor is the only option regardless of the moon: an open meadow away from the lodges\' lights is the best this shower gets this year.',
    stopIds: VALLEY_MEADOW_STOP_IDS,
  },
  // Perseids 2028: IMO peak Aug 12/13. Nearest full moon: 2028-08-05
  // (Sturgeon), 7 days before peak, outside the ~4-day band. New moon falls
  // around Aug 20 (Aug 5 + a 14.77-day half cycle), so the peak sits in a
  // slim waning crescent that rises late. Good year for the evening hours.
  {
    id: 'perseids-2028',
    title: 'Perseid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2028-08-11',
    dateEnd: '2028-08-13',
    location: PERSEIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Perseids peak on the night of August 12 into the 13th. The moon is a slim waning crescent in 2028 and does not rise until well after midnight, so the evening hours run dark, a good year for it if the sky stays clear. Glacier Point\'s open horizon, or the Olmsted Point and Tenaya Lake pullouts on Tioga Road, are the darkest sky within a drive. Best after 11 p.m., once the radiant is higher and before moonrise starts to compete.',
    stopIds: RIM_STOP_IDS,
  },
  // Geminids 2028: IMO peak Dec 13/14. Nearest full moons: 2028-12-01
  // (Cold, 12-13 days before) and 2028-12-31 (Blue Moon, 17-18 days after),
  // both outside the ~4-day band despite December carrying two full moons
  // that year. New moon falls around Dec 16 (Dec 1 + a 14.77-day half
  // cycle), so the peak sits in a thin waning crescent 2-3 days before new.
  // Good year.
  {
    id: 'geminids-2028',
    title: 'Geminid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2028-12-12',
    dateEnd: '2028-12-14',
    location: GEMINIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Geminids peak on the night of December 13 into 14, and 2028 is a good year for it, clear skies permitting. December carries two full moons that year, but the peak falls in the dark stretch between them, a thin waning crescent with little to no interference. Tioga Road and Glacier Point Road are closed for the season by mid-December regardless, so this is a valley-floor watch. Cook\'s Meadow or El Capitan Meadow, back from the lodges\' lights, are the valley\'s best options.',
    stopIds: VALLEY_MEADOW_STOP_IDS,
  },
  // Lyrids 2028: IMO peak Apr 22. Nearest full moon: 2028-04-09 (Pink), 13
  // days before peak, outside the ~4-day band. New moon falls around Apr 24
  // (Apr 9 + a 14.77-day half cycle), so the peak sits one to two days
  // before new: about as dark as the sky gets. Good year.
  {
    id: 'lyrids-2028',
    title: 'Lyrid meteor shower peak',
    category: 'astronomy',
    confidence: 'confirmed',
    dateStart: '2028-04-21',
    dateEnd: '2028-04-23',
    location: LYRIDS_LOCATION,
    url: 'https://www.imo.net/resources/calendar/',
    description:
      'The Lyrids peak on the night of April 22, a modest shower but a genuinely good year for it: the moon is a thin waning crescent that week, close to new, and barely a factor if the sky cooperates. Glacier Point Road and Tioga Road are still closed for the season in April, so the valley floor is the only option regardless, and an open meadow away from the lodges\' lights works well.',
    stopIds: VALLEY_MEADOW_STOP_IDS,
  },
]

// ── Wildflowers, category 'other' ─────────────────────────────────────────────
// No ProgramCategory value fits a bloom better than 'other' (the enum in
// src/programs/schema.ts is ranger/junior-ranger/walk/talk/astronomy/kids/
// tour/arts/other; left as-is per the almanac's own rule against inventing
// facts, this file does not extend it). Confidence is 'typical' throughout:
// bloom timing is a recurring pattern, not a published date. Timing and
// species are sourced to the NPS wildflower page and, for the mid-elevation
// window, to this guide's own hike descriptions (hikes.ts calls McGurk
// Meadow's bloom "the flower show" in July, so that entry does not claim
// June for McGurk). 2026 windows for the valley, dogwood, and mid-elevation
// blooms have already closed relative to this file's 2026-07-30 bundling
// date; only the high-country window is still ahead and included for 2026.

const WILDFLOWERS_VALLEY_DESC =
  'The lowest-elevation bloom typically runs mid-April through May, and it starts outside the park entirely. The Merced River Canyon along Highway 140 is snow-free earliest of any approach road, and redbud and California poppies typically color the roadside for miles before the entrance station. Valley meadows follow a few weeks behind. Neither waits for the high country, which is still under snow this whole window.'
const DOGWOOD_DESC =
  'The valley\'s understory dogwoods typically flower in the first three weeks of May, white blossoms against dark conifer trunks along Southside Drive and near Pohono Bridge. It is the most photographed bloom in the park and a short window, usually gone within a couple of weeks of opening. Overcast light suits it better than midday sun, so a slow drive on a cloudy morning is worth planning around if the trip lands here.'
const WILDFLOWERS_MEADOWS_DESC =
  'Mid-elevation meadows typically peak from mid-June into mid-July, later at McGurk Meadow on Glacier Point Road, where July is the real flower show, than at lower, earlier-blooming Wawona Meadow. Both are easy, flat walks built for wandering rather than mileage. Glacier Point Road has to be open to reach McGurk; it usually is well before this window closes.'
const WILDFLOWERS_HIGH_DESC =
  'High-country meadows typically bloom from mid-July into mid-August, once the snowmelt clears and the ground warms at 8,600 feet. Lupine and paintbrush color the meadow edges around Tuolumne, later and shorter-lived than anything at valley elevation. Timing tracks the snowpack: a big winter pushes the bloom toward August, a light one brings it forward. The Soda Springs walk from the Lembert Dome lot is the easy way to see it up close.'
const WILDFLOWERS_SOURCE_URL = 'https://www.nps.gov/yose/learn/nature/wildflowers.htm'

const wildflowerEntries: SeasonalInput[] = [
  {
    id: 'wildflowers-high-2026',
    title: 'Tuolumne Meadows wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2026-07-10',
    dateEnd: '2026-08-15',
    location: 'Tuolumne Meadows',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_HIGH_DESC,
    stopIds: ['soda-springs-parsons-lodge'],
  },
  {
    id: 'wildflowers-valley-2027',
    title: 'Valley and foothill wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-04-15',
    dateEnd: '2027-05-31',
    location: 'Merced River Canyon (Highway 140) and valley meadows',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_VALLEY_DESC,
    stopIds: ['cooks-meadow-loop'],
  },
  {
    id: 'dogwood-bloom-2027',
    title: 'Dogwood bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-05-01',
    dateEnd: '2027-05-25',
    location: 'Southside Drive and Pohono Bridge',
    url: WILDFLOWERS_SOURCE_URL,
    description: DOGWOOD_DESC,
    stopIds: ['valley-view'],
  },
  {
    id: 'wildflowers-meadows-2027',
    title: 'Mid-elevation meadow wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-06-10',
    dateEnd: '2027-07-15',
    location: 'McGurk Meadow and Wawona Meadow',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_MEADOWS_DESC,
    stopIds: ['mcgurk-meadow', 'wawona-meadow-loop'],
  },
  {
    id: 'wildflowers-high-2027',
    title: 'Tuolumne Meadows wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2027-07-10',
    dateEnd: '2027-08-15',
    location: 'Tuolumne Meadows',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_HIGH_DESC,
    stopIds: ['soda-springs-parsons-lodge'],
  },
  {
    id: 'wildflowers-valley-2028',
    title: 'Valley and foothill wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-04-15',
    dateEnd: '2028-05-31',
    location: 'Merced River Canyon (Highway 140) and valley meadows',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_VALLEY_DESC,
    stopIds: ['cooks-meadow-loop'],
  },
  {
    id: 'dogwood-bloom-2028',
    title: 'Dogwood bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-05-01',
    dateEnd: '2028-05-25',
    location: 'Southside Drive and Pohono Bridge',
    url: WILDFLOWERS_SOURCE_URL,
    description: DOGWOOD_DESC,
    stopIds: ['valley-view'],
  },
  {
    id: 'wildflowers-meadows-2028',
    title: 'Mid-elevation meadow wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-06-10',
    dateEnd: '2028-07-15',
    location: 'McGurk Meadow and Wawona Meadow',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_MEADOWS_DESC,
    stopIds: ['mcgurk-meadow', 'wawona-meadow-loop'],
  },
  {
    id: 'wildflowers-high-2028',
    title: 'Tuolumne Meadows wildflower bloom',
    category: 'other',
    confidence: 'typical',
    dateStart: '2028-07-10',
    dateEnd: '2028-08-15',
    location: 'Tuolumne Meadows',
    url: WILDFLOWERS_SOURCE_URL,
    description: WILDFLOWERS_HIGH_DESC,
    stopIds: ['soda-springs-parsons-lodge'],
  },
]

const seed: SeasonalInput[] = [
  ...fullMoonEntries,
  ...windowEntries,
  ...dayEntries,
  ...meteorEntries,
  ...wildflowerEntries,
]

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
