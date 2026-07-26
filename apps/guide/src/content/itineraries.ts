// Itinerary presets for the /map route and the /trip seeding. Each itinerary
// is a list of "days", each pinned to one or more regions. A day may also
// carry a curated `stops` list: the recommended plan for that day, in drive
// order, sized to fit a real 8 a.m.–9 p.m. day. Days without one derive
// their stop list live from the region via getStopsByRegion(), so adding
// stops to a region flows through automatically.
//
// The curated lists exist because the region reading sequence is not a day
// plan: seeding "all of the Valley until the day fills" front-loads the
// niche half-day entries (the Old Big Oak Flat Road climb and its parking
// pin) and squeezes out the marquee stops, and the Glacier day fills before
// it ever reaches the Mariposa Grove. Keep the lists in drive order; the
// planner slots them in sequence with travel buffers.
//
// Two kinds of preset live here. The duration presets (half day through
// 3 days plus the Hetch Hetchy day) answer "how long do we have"; the
// audience presets (first visit, young kids, easy pace, the whole family)
// answer "who is going" and tune the same regions to a pace: shorter
// walks and Junior Ranger time for kids, viewpoints close to parking for
// the easy-pace plan, a split-the-difference mix for multigenerational
// groups. A day may also carry `hikes` (day-hike catalog ids seeded like
// stops) and `programCategories`: the kinds of ranger-led programs worth
// building the day around. Program listings are dated, so the categories
// resolve to real events at seed time (trip/seedPrograms.ts picks free
// drop-in programs running that date near that day's region); the preset
// itself stays evergreen.

import type { ProgramCategoryT } from '../programs/schema'
import type { Region } from './schema'
import { HIKES } from './hikes'
import { stops } from './stops'

export type ItineraryKey =
  | 'halfday'
  | '1day'
  | '2day'
  | '3day'
  | 'first-visit'
  | 'family-kids'
  | 'multigen'
  | 'grandparents'
  | 'hetch-hetchy'

export type ItineraryDay = {
  name: string
  regions: Region[]
  // Curated stop ids in drive order. Optional: days without it seed from the
  // full region sequence instead. Validated at module load below.
  stops?: string[]
  // Day-hike catalog ids (content/hikes.ts) seeded alongside the stops, for
  // days where the trail itself is the plan and no stop covers it. Validated
  // at module load below.
  hikes?: string[]
  // Ranger-led program categories worth building this day around, in priority
  // order. Seeding resolves them against the live /api/programs window
  // (trip/seedPrograms.ts): free drop-in events on that date, near this
  // day's regions. No matching event on the date simply seeds no program.
  programCategories?: ProgramCategoryT[]
}

export type Itinerary = {
  label: string
  subtitle: string
  days: ItineraryDay[]
}

export const ITINERARY_KEYS: ItineraryKey[] = [
  'halfday',
  '1day',
  '2day',
  '3day',
  'first-visit',
  'family-kids',
  'multigen',
  'grandparents',
  'hetch-hetchy',
]

// The recommended first day in the Valley: orientation at Tunnel View, the
// eastbound floor preview, the meadow loop, lunch, the Ahwahnee, Mirror Lake
// before the afternoon breeze is long gone, climbers on El Capitan, and the
// last light on Half Dome from Sentinel Bridge.
const VALLEY_DAY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley',
  regions: ['valley'],
  stops: [
    'tunnel-view',
    'bridalveil-fall',
    'valley-loop-drive',
    'cooks-meadow-loop',
    'curry-village-pizza',
    'ahwahnee-hotel',
    'mirror-lake',
    'el-capitan-meadow',
    'sentinel-bridge-sunset',
  ],
  // The 9 a.m. Ranger Walk from the Welcome Center and the late-afternoon
  // Yosemite Theater program both fit around this route.
  programCategories: ['walk', 'talk'],
}

// The southern-rim day: the Mariposa Grove on the morning shuttles, then up
// Glacier Point Road for the Sentinel Dome / Taft Point loop (one entry
// covers both points), Washburn Point, and Glacier Point after 4:30 when
// the lot empties and the light turns.
const GLACIER_MARIPOSA_DAY: ItineraryDay = {
  name: 'Day 2 — Glacier Point & Mariposa Grove',
  regions: ['glacier-mariposa'],
  stops: ['mariposa-grove', 'sentinel-dome', 'washburn-point', 'glacier-point'],
  // The morning ranger walk in the grove, and, on star-party dates, the free
  // telescopes at the Glacier Point Amphitheater after the sunset.
  programCategories: ['walk', 'astronomy'],
}

// The Valley with an afternoon, not a day: the orientation view, the two
// walks that pay off fastest, and the sunset bridge. All VALLEY_DAY ids, so
// the module-load validation below covers it.
const VALLEY_HALF_DAY: ItineraryDay = {
  name: 'Half day — Yosemite Valley',
  regions: ['valley'],
  stops: ['tunnel-view', 'bridalveil-fall', 'cooks-meadow-loop', 'sentinel-bridge-sunset'],
  // An afternoon arrival still catches the Yosemite Theater program.
  programCategories: ['talk'],
}

// ── Audience presets ─────────────────────────────────────────────────────────
// Same regions, different pace. Each curated list below was checked against
// the stop catalog's own numbers: every walk on the kids and easy-pace days
// is under two flat miles, and the whole-family days mix one real leg
// stretcher with stops the slower half of the group can do from the car.

// First visit, day 1: orientation first (the Welcome Center exhibits answer
// the questions every first-timer asks), then the two shortest marquee
// walks, pizza, the climbers, and the sunset bridge. Deliberately roomier
// than VALLEY_DAY: first-timers underestimate valley traffic and parking.
const FIRST_VISIT_VALLEY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley',
  regions: ['valley'],
  stops: [
    'tunnel-view',
    'yosemite-village',
    'lower-yosemite-fall',
    'cooks-meadow-loop',
    'curry-village-pizza',
    'el-capitan-meadow',
    'sentinel-bridge-sunset',
  ],
  // The 9 a.m. Ranger Walk is the single best first-morning orientation the
  // park offers; the theater program caps the afternoon.
  programCategories: ['walk', 'talk'],
}

// First visit, day 2: the big trees on the morning shuttles, then up the
// road for the two rim overlooks. Ends at Glacier Point on purpose: on
// star-party dates the free amphitheater telescopes are the trip's keeper.
const FIRST_VISIT_RIM: ItineraryDay = {
  name: 'Day 2 — Mariposa Grove & Glacier Point',
  regions: ['glacier-mariposa'],
  stops: ['mariposa-grove', 'washburn-point', 'glacier-point'],
  programCategories: ['walk', 'astronomy'],
}

// Young kids, day 1: everything under two miles and flat. The falls
// boardwalk, the meadow loop, the Welcome Center (Junior Ranger badge
// headquarters), pizza, and the Mirror Lake wade. Sentinel Bridge is the
// one late entry; it is a parking lot and a bridge, not a hike.
const FAMILY_KIDS_VALLEY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley with kids',
  regions: ['valley'],
  stops: [
    'lower-yosemite-fall',
    'cooks-meadow-loop',
    'yosemite-village',
    'curry-village-pizza',
    'mirror-lake',
    'sentinel-bridge-sunset',
  ],
  // The 10 a.m. Jr. Ranger Walk and an afternoon family program; both meet
  // at the Welcome Center, which the day already passes.
  programCategories: ['junior-ranger', 'kids'],
}

// Young kids, day 2: sequoias read at kid scale (the shuttle ride is half
// the fun), then the rim overlooks, which ask nothing of short legs.
const FAMILY_KIDS_GROVE: ItineraryDay = {
  name: 'Day 2 — Big trees & the rim',
  regions: ['glacier-mariposa'],
  stops: ['mariposa-grove', 'washburn-point', 'glacier-point'],
  // The grove runs its own Jr. Ranger talk at the big trees.
  programCategories: ['junior-ranger', 'kids'],
}

// Easy pace, day 1: every stop is at or a few flat minutes from parking.
// Cook's Meadow is the one loop, a mile of boardwalk and pavement; the
// Ahwahnee is a sit-down destination with its own free history tour.
const EASY_PACE_VALLEY: ItineraryDay = {
  name: 'Day 1 — The Valley, close to the car',
  regions: ['valley'],
  stops: [
    'tunnel-view',
    'valley-view',
    'bridalveil-fall',
    'cooks-meadow-loop',
    'ahwahnee-hotel',
    'sentinel-bridge-sunset',
  ],
  // The free Ahwahnee history tour and the Yosemite Theater program: two
  // sitting-down hours in the middle of the day.
  programCategories: ['tour', 'talk'],
}

// Easy pace, day 2: the two rim overlooks (both a short paved walk from
// the lot), then down to Wawona for the hotel porch and the history
// center. McGurk Meadow is the optional leg stretcher: 1.6 flat miles to a
// wildflower meadow, right off the road to Glacier Point.
const EASY_PACE_RIM: ItineraryDay = {
  name: 'Day 2 — Glacier Point & Wawona',
  regions: ['glacier-mariposa'],
  stops: ['washburn-point', 'glacier-point', 'wawona-hotel-history-center'],
  hikes: ['mcgurk-meadow'],
  // Wawona's coffee-with-a-ranger mornings, when the date lines up.
  programCategories: ['ranger', 'talk'],
}

// Whole family, day 1: the classic valley circuit with the two shortest
// marquee walks, so nobody is left at the trailhead.
const MULTIGEN_VALLEY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley, all paces',
  regions: ['valley'],
  stops: [
    'tunnel-view',
    'bridalveil-fall',
    'lower-yosemite-fall',
    'curry-village-pizza',
    'mirror-lake',
    'sentinel-bridge-sunset',
  ],
  // An evening amphitheater program seats every generation at once.
  programCategories: ['kids', 'talk'],
}

// Whole family, day 2: Sentinel Dome is the split — the walkers take the
// 2.2-mile dome while the rest drive ahead to Washburn Point, and everyone
// regroups at Glacier Point before the grove.
const MULTIGEN_RIM: ItineraryDay = {
  name: 'Day 2 — The rim, split and regroup',
  regions: ['glacier-mariposa'],
  stops: ['sentinel-dome', 'washburn-point', 'glacier-point', 'mariposa-grove'],
  programCategories: ['junior-ranger', 'astronomy'],
}

// Whole family, day 3: the high country as a drive with short payoffs.
// Pothole Dome is the family scramble: a mile round trip, granite the
// whole way up, the meadow view from the top.
const MULTIGEN_TUOLUMNE: ItineraryDay = {
  name: 'Day 3 — Tuolumne Meadows',
  regions: ['tuolumne'],
  stops: [
    'tioga-road-drive',
    'olmsted-point',
    'tenaya-lake',
    'tuolumne-meadows-grill',
    'soda-springs-parsons-lodge',
  ],
  hikes: ['pothole-dome'],
  programCategories: ['walk', 'kids'],
}

export const ITINERARIES: Record<ItineraryKey, Itinerary> = {
  halfday: {
    label: 'Half day',
    subtitle: 'Yosemite Valley, the short version',
    days: [VALLEY_HALF_DAY],
  },
  '1day': {
    label: '1 day',
    subtitle: 'Yosemite Valley',
    days: [VALLEY_DAY],
  },
  '2day': {
    label: '2 days',
    subtitle: 'Valley + Glacier Point & Mariposa',
    days: [VALLEY_DAY, GLACIER_MARIPOSA_DAY],
  },
  '3day': {
    label: '3 days',
    subtitle: '+ Tuolumne Meadows',
    days: [
      VALLEY_DAY,
      GLACIER_MARIPOSA_DAY,
      {
        name: 'Day 3 — Tuolumne Meadows',
        regions: ['tuolumne'],
        // The noon orientation talk at the visitor center lot, plus
        // whichever ranger walk the date carries.
        programCategories: ['walk', 'talk'],
      },
    ],
  },
  'first-visit': {
    label: 'First visit',
    subtitle: 'The icons in two days, ranger-led',
    days: [FIRST_VISIT_VALLEY, FIRST_VISIT_RIM],
  },
  'family-kids': {
    label: 'With young kids',
    subtitle: 'Short flat walks, Junior Ranger days',
    days: [FAMILY_KIDS_VALLEY, FAMILY_KIDS_GROVE],
  },
  multigen: {
    label: 'The whole family',
    subtitle: 'Three days with something for every pace',
    days: [MULTIGEN_VALLEY, MULTIGEN_RIM, MULTIGEN_TUOLUMNE],
  },
  grandparents: {
    label: 'Easy pace',
    subtitle: 'The views a few steps from parking',
    days: [EASY_PACE_VALLEY, EASY_PACE_RIM],
  },
  // No curated list: the Hetch Hetchy region reads in drive order already,
  // and the seeder's capacity and kind filters handle the rest. No program
  // categories either: the park schedules nothing out there.
  'hetch-hetchy': {
    label: 'Hetch Hetchy day',
    subtitle: 'The other granite valley',
    days: [{ name: 'Hetch Hetchy day', regions: ['hetch-hetchy'] }],
  },
}

// Fail fast at module load, same contract as Stops.parse in stops.ts: a
// curated id that doesn't resolve to a core stop (or a hike) in the day's
// regions is a content error, not something to discover in a buyer's
// seeded plan.
for (const itinerary of Object.values(ITINERARIES)) {
  for (const day of itinerary.days) {
    for (const id of day.stops ?? []) {
      const stop = stops.find((s) => s.id === id)
      if (!stop || stop.collection === 'hidden' || !day.regions.includes(stop.region)) {
        throw new Error(`Itinerary "${day.name}" lists unknown or out-of-region stop "${id}"`)
      }
    }
    for (const id of day.hikes ?? []) {
      const hike = HIKES.find((h) => h.id === id)
      if (!hike || !day.regions.includes(hike.region)) {
        throw new Error(`Itinerary "${day.name}" lists unknown or out-of-region hike "${id}"`)
      }
    }
  }
}

export function isItineraryKey(value: string | null | undefined): value is ItineraryKey {
  return !!value && (ITINERARY_KEYS as string[]).includes(value)
}
