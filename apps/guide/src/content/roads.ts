// =============================================================================
// SEASONAL ROADS: which entries sit behind Tioga Road or Glacier Point Road,
// and what those roads typically do on a given date.
//
// The two roads close for half the year, and until September 2026 nothing in
// the planner knew it: the three-day preset put Glacier Point on day two and
// Tuolumne on day three on January dates, and the board drew both days as if
// the gates were open. The region pages said "Closed in winter" once, in an
// intro, and the stops themselves said nothing.
//
// Two decisions. (1) Dependency is listed by hand, per entry, rather than
// inferred from region: the Tuolumne region reaches back to Crane Flat, which
// is on Big Oak Flat Road and open all winter, and the Glacier Point and
// Mariposa region is half Wawona, which never closes. Hikes carry it in their
// own `season` chip ("Tioga Road season"), so theirs is read from that and
// roads.test.ts keeps the chip and this file agreeing. (2) The dates come
// from the almanac already in the guide (content/seasonal.ts): its typical
// opening and closing windows, sourced to the park's historical opening
// dates, give the planner a day-level answer (open, closed, or inside a
// window where it could go either way). Nothing here reads the clock; callers
// pass the date. Past the last window in the almanac a month pattern takes
// over, the same one the editorial site's trip selector uses (TRIP_MONTHS in
// intent-data.js).
// =============================================================================

import type { HikeT } from './schema'
import { SEASONAL_EVENTS, seasonalRangeLabel } from './seasonal'
import type { SeasonalEventT } from './schema'

export type SeasonalRoadId = 'tioga' | 'glacier-point'
export const SEASONAL_ROADS: SeasonalRoadId[] = ['tioga', 'glacier-point']

// The seasonal road a whole region's core flow depends on. Glacier Point
// and Mariposa is half Wawona, open all year, so the note says which road it
// means rather than implying the region closes. Read by the region page and
// the region planner.
export const REGION_ROAD: Partial<Record<string, SeasonalRoadId>> = {
  tuolumne: 'tioga',
  'glacier-mariposa': 'glacier-point',
}

export const ROAD_NAME: Record<SeasonalRoadId, string> = {
  tioga: 'Tioga Road',
  'glacier-point': 'Glacier Point Road',
}

// Where the winter gate stands, for the one line that says what is still
// reachable. Both are the almanac's own words (seasonal.ts).
export const ROAD_WINTER_NOTE: Record<SeasonalRoadId, string> = {
  tioga: 'In winter the road is closed east of Crane Flat.',
  'glacier-point': 'In winter the road is plowed only as far as the Badger Pass ski area.',
}

// Stops and Secret Guide entries past each road's winter gate. Anything in
// the Tuolumne or Glacier Point and Mariposa regions that is NOT here is
// listed in ROAD_EXEMPT below with its reason, so a new entry in either
// region fails roads.test.ts until somebody decides which it is.
const ROAD_STOPS: Record<SeasonalRoadId, string[]> = {
  tioga: [
    'tioga-road-drive',
    'white-wolf',
    'olmsted-point',
    'may-lake',
    'tenaya-lake',
    'cathedral-lakes',
    'soda-springs-parsons-lodge',
    'tuolumne-meadows-grill',
    'gaylor-lake',
    'north-dome-indian-rock',
    'clouds-rest-tenaya',
    'lyell-canyon',
    'mono-pass-meadows',
    'el-capitan-summit-tamarack',
    // Secret Guide entries without a region.
    'olmsted-point-at-night',
    'pothole-dome-sunset',
    'hidden-lake',
    'siesta-lake',
    'bennettville',
    'tenaya-lake-lots',
    'yosemite-creek-campground',
    'tioga-lake-campground',
  ],
  'glacier-point': [
    'glacier-point-road-drive',
    'sentinel-dome',
    'taft-point',
    'washburn-point',
    'glacier-point',
    'crocker-stanford-points',
    'mcgurk-meadow',
    'bridalveil-creek-trail',
    'ostrander-lake',
    'sentinel-dome-overflow',
    'glacier-point-star-party',
  ],
}

// Entries in the two seasonal regions that do not depend on the closed
// stretch, with the reason. Kept as data so the test can hold the lists
// complete.
export const ROAD_EXEMPT: Record<string, string> = {
  'crane-flat-meadow': 'Crane Flat is on Big Oak Flat Road, open all year',
  'tuolumne-grove-old-road': 'the Tuolumne Grove trail starts at Crane Flat',
  'great-gray-owl-dusk': 'Crane Flat is on Big Oak Flat Road, open all year',
  'mariposa-grove': 'the Mariposa Grove is on Wawona Road',
  'wawona-hotel-history-center': 'Wawona is on Wawona Road',
  'wawona-meadow-loop': 'Wawona is on Wawona Road',
  'chilnualna-falls': 'Wawona is on Wawona Road',
  // Hike ids whose region is seasonal but whose trailhead is not.
  'tuolumne-grove': 'the Tuolumne Grove trail starts at Crane Flat',
  'wawona-swinging-bridge': 'Wawona is on Wawona Road',
  'grizzly-giant-loop': 'the Mariposa Grove is on Wawona Road',
  'mariposa-grove-guardians-loop': 'the Mariposa Grove is on Wawona Road',
}

const STOP_ROAD = new Map<string, SeasonalRoadId>()
for (const road of SEASONAL_ROADS) for (const id of ROAD_STOPS[road]) STOP_ROAD.set(id, road)

/** The seasonal road a stop or Secret Guide entry sits behind, if any. */
export function roadForStopId(id: string): SeasonalRoadId | null {
  return STOP_ROAD.get(id) ?? null
}

// A hike's own season chip is the source of truth for its road, so the chip a
// reader sees and the flag the planner draws cannot disagree.
const HIKE_SEASON_ROAD: Record<string, SeasonalRoadId> = {
  'Tioga Road season': 'tioga',
  'Glacier Point Road season': 'glacier-point',
}

export function roadForHike(hike: Pick<HikeT, 'season'>): SeasonalRoadId | null {
  return hike.season ? HIKE_SEASON_ROAD[hike.season] ?? null : null
}

// ── Typical state by date ───────────────────────────────────────────────────

export type RoadState = 'open' | 'closed' | 'unsettled'

type Window = { kind: 'open' | 'close'; event: SeasonalEventT }

// The almanac names its road windows `tioga-open-2027`, `glacier-point-close-
// 2026` and so on; roads.test.ts fails if the pattern stops matching, or if
// the windows stop alternating close, open, close.
const WINDOW_ID = /^(tioga|glacier-point)-(open|close)-\d{4}$/

function windowsFor(road: SeasonalRoadId): Window[] {
  return SEASONAL_EVENTS.flatMap((event): Window[] => {
    const m = WINDOW_ID.exec(event.id)
    if (!m || m[1] !== road) return []
    return [{ kind: m[2] as 'open' | 'close', event }]
  }).sort((a, b) => (a.event.dateStart < b.event.dateStart ? -1 : 1))
}

const WINDOWS: Record<SeasonalRoadId, Window[]> = {
  tioga: windowsFor('tioga'),
  'glacier-point': windowsFor('glacier-point'),
}

export function roadWindows(road: SeasonalRoadId): { kind: 'open' | 'close'; event: SeasonalEventT }[] {
  return WINDOWS[road]
}

// Beyond the almanac: the editorial trip selector's month table, mirrored.
// Index 0 is January.
const MONTH_PATTERN: Record<SeasonalRoadId, RoadState[]> = {
  tioga: ['closed', 'closed', 'closed', 'closed', 'unsettled', 'open', 'open', 'open', 'open', 'open', 'closed', 'closed'],
  'glacier-point': ['closed', 'closed', 'closed', 'closed', 'unsettled', 'open', 'open', 'open', 'open', 'open', 'unsettled', 'closed'],
}

export type TypicalRoadState = {
  state: RoadState
  // The almanac window that decides it: the window the date falls in when
  // unsettled, the next reopening when closed, the next closing when open.
  window: SeasonalEventT | null
  // True when the almanac ran out and the month pattern answered.
  fromMonthPattern: boolean
}

export function typicalRoadState(road: SeasonalRoadId, dateIso: string): TypicalRoadState {
  const windows = WINDOWS[road]
  const first = windows[0]
  const last = windows[windows.length - 1]
  // Inside the almanac's reach: from a year before its first window to the
  // end of its last one.
  const reachStart = first ? `${Number(first.event.dateStart.slice(0, 4)) - 1}${first.event.dateStart.slice(4)}` : null
  if (first && last && reachStart && dateIso >= reachStart && dateIso <= last.event.dateEnd) {
    let current: Window | null = null
    for (const w of windows) if (w.event.dateStart <= dateIso) current = w
    const next = windows.find((w) => w.event.dateStart > dateIso) ?? null
    if (current && dateIso <= current.event.dateEnd) {
      return { state: 'unsettled', window: current.event, fromMonthPattern: false }
    }
    if (current) {
      return {
        state: current.kind === 'close' ? 'closed' : 'open',
        window: next?.event ?? null,
        fromMonthPattern: false,
      }
    }
    // Before the first window: the road is in whatever state that window ends.
    return { state: first.kind === 'close' ? 'open' : 'closed', window: first.event, fromMonthPattern: false }
  }
  const month = Number(dateIso.slice(5, 7)) - 1
  return { state: MONTH_PATTERN[road][month] ?? 'unsettled', window: null, fromMonthPattern: true }
}

/** "May 20 to Jun 30, 2027" for the window a state names, or null. */
export function roadWindowLabel(t: TypicalRoadState): string | null {
  return t.window ? seasonalRangeLabel(t.window) : null
}
