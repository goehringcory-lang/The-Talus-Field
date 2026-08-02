// Itinerary presets for the /map route and the /trip seeding. Each itinerary
// is a list of "days", each pinned to one or more regions. A day carries a
// curated `plan`: the recommended sequence for that day, in drive order,
// sized to fit a real 8 a.m.–9 p.m. day. Entries are stop ids or day-hike
// ids (content/hikes.ts) in one list, so a trail can sit in the middle of a
// day instead of after everything else — McGurk Meadow is on the way down
// from Glacier Point to Wawona, and the old two-array shape could only seed
// it after Wawona, an hour of backtracking up the road it had just left.
//
// Every day should have a `plan`. A day without one derives its list live
// from getStopsByRegion(), which is a reading sequence, not a day timeline:
// it front-loads the niche half-day entries (the Old Big Oak Flat Road climb
// and its parking pin), and on the days that used to rely on it the capacity
// filter in routes/Trip.tsx then dropped the reason to go — Soda Springs and
// Cathedral Lakes off the Tuolumne day, Wapama Falls off Hetch Hetchy. The
// fallback stays for safety, not as a way to skip curation.
//
// Two kinds of preset live here. The duration presets (half day through
// 3 days plus the Hetch Hetchy day) answer "how long do we have"; the
// audience presets (first visit, young kids, easy pace, the whole family)
// answer "who is going" and tune the same regions to a pace: shorter
// walks and Junior Ranger time for kids, viewpoints close to parking for
// the easy-pace plan, a split-the-difference mix for multigenerational
// groups. A day may also carry `programCategories`: the kinds of ranger-led
// programs worth building the day around. Program listings are dated, so the
// categories resolve to real events at seed time (trip/seedPrograms.ts picks
// free drop-in programs running that date near that day's region); the preset
// itself stays evergreen.
//
// Drive order sets the sequence, but not every time on the board: a stop
// whose content/schema.ts `dayPart` says the clock is a fact (a meal, a
// sunset viewpoint) is anchored by trip/slotting.ts and the rest of the day
// flows around it. Put those entries where they belong in the drive anyway —
// the anchor is a floor under the plan, not a license to order the day badly.
// scripts/check-itineraries.mjs slots every preset here and fails the build
// on a lunch outside midday, a sunset stop before late afternoon, or an entry
// the day has no room for.

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
  // The curated day, in drive order: stop ids and day-hike ids interleaved in
  // one list. Optional only as a fallback — a day without it seeds from the
  // full region sequence, which is a reading order and makes a poor plan.
  // Validated at module load below.
  plan?: string[]
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

// The recommended first day in the Valley, run west to east and back again on
// the one-way loop: orientation at Tunnel View, Bridalveil, then straight to
// the east end for Mirror Lake while the reflection is still there (its own
// body says the breeze takes it by mid-morning), lunch, the Ahwahnee, then
// west on Northside for the climbers on El Capitan. It closes at the Sentinel
// Bridge lot, where Cook's Meadow and the bridge share a parking space: the
// meadow loop in the last light, when the bears work the tree line, and Half
// Dome off the bridge as the wall goes gold to pink to grey.
//
// The Valley loop drive is deliberately not on this list, though it is a good
// stop and stays in the catalog. It is a 60-minute preview of the road this
// day already drives between its own stops, it carries no coordinate (so the
// planner spends another flat half hour reaching a place it cannot locate),
// and those ninety minutes were the difference between Mirror Lake in the
// morning and Mirror Lake at 1 p.m. — and, on a day that also draws two
// ranger programs, between ending at sunset and not ending at all.
const VALLEY_DAY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley',
  regions: ['valley'],
  plan: [
    'tunnel-view',
    'bridalveil-fall',
    'mirror-lake',
    'curry-village-pizza',
    'ahwahnee-hotel',
    'el-capitan-meadow',
    'cooks-meadow-loop',
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
  plan: ['mariposa-grove', 'sentinel-dome', 'washburn-point', 'glacier-point'],
  // The morning ranger walk in the grove, and, on star-party dates, the free
  // telescopes at the Glacier Point Amphitheater after the sunset.
  programCategories: ['walk', 'astronomy'],
}

// The high country, west to east along Tioga Road: the drive itself, the
// Half Dome view from Olmsted Point, Tenaya Lake, lunch at the grill, and
// the meadow walk to Soda Springs and Parsons Lodge.
//
// This day used to have no curated list and derive from the region reading
// order instead, which produced the worst plan in the file: it spent the
// morning on Crane Flat and White Wolf, and the capacity filter then dropped
// Soda Springs, Cathedral Lakes, and Gaylor Lake — the reasons to drive up
// here — while pushing "lunch at 8,600 feet" to almost 7 p.m.
const TUOLUMNE_DAY: ItineraryDay = {
  name: 'Day 3 — Tuolumne Meadows',
  regions: ['tuolumne'],
  plan: [
    'tioga-road-drive',
    'olmsted-point',
    'tenaya-lake',
    'tuolumne-meadows-grill',
    'soda-springs-parsons-lodge',
  ],
  // The noon orientation talk at the visitor center lot, plus whichever
  // ranger walk the date carries.
  programCategories: ['walk', 'talk'],
}

// The Valley with an afternoon, not a day: the orientation view, the two
// walks that pay off fastest, and the sunset bridge. All VALLEY_DAY ids, so
// the module-load validation below covers it.
const VALLEY_HALF_DAY: ItineraryDay = {
  name: 'Half day — Yosemite Valley',
  regions: ['valley'],
  plan: ['tunnel-view', 'bridalveil-fall', 'cooks-meadow-loop', 'sentinel-bridge-sunset'],
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
  plan: [
    'tunnel-view',
    'yosemite-village',
    'lower-yosemite-fall',
    'curry-village-pizza',
    'el-capitan-meadow',
    'cooks-meadow-loop',
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
  plan: ['mariposa-grove', 'washburn-point', 'glacier-point'],
  programCategories: ['walk', 'astronomy'],
}

// Young kids, day 1: everything under two miles and flat. The falls
// boardwalk, the meadow loop, the Welcome Center (Junior Ranger badge
// headquarters), pizza, and the Mirror Lake wade. Sentinel Bridge is the
// one late entry; it is a parking lot and a bridge, not a hike.
const FAMILY_KIDS_VALLEY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley with kids',
  regions: ['valley'],
  plan: [
    'lower-yosemite-fall',
    'yosemite-village',
    'mirror-lake',
    'curry-village-pizza',
    'cooks-meadow-loop',
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
  plan: ['mariposa-grove', 'washburn-point', 'glacier-point'],
  // The grove runs its own Jr. Ranger talk at the big trees.
  programCategories: ['junior-ranger', 'kids'],
}

// Easy pace, day 1: every stop is at or a few flat minutes from parking.
// Cook's Meadow is the one loop, a mile of boardwalk and pavement; the
// Ahwahnee is a sit-down destination with its own free history tour, and the
// pizza deck is a flat walk from its own lot.
//
// Valley View is deliberately not here, though it used to sit second. It is
// reached on Northside Drive, which runs one way west, so on a one-way loop
// second place meant a full lap of the valley to get to it; and its own body
// says to make it the last stop of the last day, which this day is not — the
// day ends at Sentinel Bridge for the sunset, and the pullout is three miles
// the wrong way from there. A preset that cannot honor a stop's own
// instruction should not list the stop.
const EASY_PACE_VALLEY: ItineraryDay = {
  name: 'Day 1 — The Valley, close to the car',
  regions: ['valley'],
  plan: [
    'tunnel-view',
    'bridalveil-fall',
    'curry-village-pizza',
    'ahwahnee-hotel',
    'cooks-meadow-loop',
    'sentinel-bridge-sunset',
  ],
  // The free Ahwahnee history tour and the Yosemite Theater program: two
  // sitting-down hours in the middle of the day.
  programCategories: ['tour', 'talk'],
}

// Easy pace, day 2: the two rim overlooks (both a short paved walk from
// the lot), then McGurk Meadow, then down to Wawona for the hotel porch and
// the history center. McGurk is the optional leg stretcher, 1.6 flat miles to
// a wildflower meadow, and its trailhead is on Glacier Point Road, so it
// belongs between the rim and Wawona: seeding it after Wawona sent the day
// back up an hour of road it had already come down.
const EASY_PACE_RIM: ItineraryDay = {
  name: 'Day 2 — Glacier Point & Wawona',
  regions: ['glacier-mariposa'],
  plan: ['washburn-point', 'glacier-point', 'mcgurk-meadow', 'wawona-hotel-history-center'],
  // Wawona's coffee-with-a-ranger mornings, when the date lines up.
  programCategories: ['ranger', 'talk'],
}

// Whole family, day 1: the classic valley circuit with the two shortest
// marquee walks, so nobody is left at the trailhead.
const MULTIGEN_VALLEY: ItineraryDay = {
  name: 'Day 1 — Yosemite Valley, all paces',
  regions: ['valley'],
  plan: [
    'tunnel-view',
    'bridalveil-fall',
    'lower-yosemite-fall',
    'curry-village-pizza',
    'mirror-lake',
    'cooks-meadow-loop',
    'sentinel-bridge-sunset',
  ],
  // An evening amphitheater program seats every generation at once.
  programCategories: ['kids', 'talk'],
}

// Whole family, day 2: the grove first, on the morning shuttles, the way
// every other rim preset runs it — the shuttle from the Welcome Plaza is
// mandatory in peak season and thins out late, so an afternoon grove is a
// gamble the rest of the day does not need. Then up the road, where Sentinel
// Dome is the split: the walkers take the 2.2-mile dome while the rest drive
// ahead to Washburn Point, and everyone regroups at Glacier Point, which is
// the right place to end anyway once the lot empties and the light turns.
const MULTIGEN_RIM: ItineraryDay = {
  name: 'Day 2 — The rim, split and regroup',
  regions: ['glacier-mariposa'],
  plan: ['mariposa-grove', 'sentinel-dome', 'washburn-point', 'glacier-point'],
  programCategories: ['junior-ranger', 'astronomy'],
}

// Whole family, day 3: the high country as a drive with short payoffs.
// Pothole Dome is the family scramble: a mile round trip, granite the
// whole way up, the meadow view from the top. It sits at the west end of
// Tuolumne Meadows, so it comes before Soda Springs, not after the day.
const MULTIGEN_TUOLUMNE: ItineraryDay = {
  name: 'Day 3 — Tuolumne Meadows',
  regions: ['tuolumne'],
  plan: [
    'tioga-road-drive',
    'olmsted-point',
    'tenaya-lake',
    'tuolumne-meadows-grill',
    'pothole-dome',
    'soda-springs-parsons-lodge',
  ],
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
      TUOLUMNE_DAY,
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
  // The Hetch Hetchy region reads close to drive order, but relying on that
  // cost the day its whole point: the capacity filter dropped Wapama Falls,
  // the five-mile walk to the spray that is the reason anyone makes this
  // drive. Curated, and deliberately front-loaded — Hetch Hetchy sits at
  // 3,800 feet with almost no shade on the Wapama trail, so the hike goes
  // first, while it is cool, and the dam and the overlook fill the afternoon.
  // The trail starts by crossing the dam, so the dam reads either way; taking
  // it on the return buys the hike most of an hour of cooler morning.
  // The Evergreen Lodge is the dinner on the way out, and anchors itself
  // there (its `dayPart` is 'evening'). No program categories: the park
  // schedules nothing out here.
  'hetch-hetchy': {
    label: 'Hetch Hetchy day',
    subtitle: 'The other granite valley',
    days: [
      {
        name: 'Hetch Hetchy day',
        regions: ['hetch-hetchy'],
        plan: [
          'evergreen-road-drive',
          'wapama-falls-trail',
          'oshaughnessy-dam',
          'lookout-point',
          'evergreen-lodge',
        ],
      },
    ],
  },
}

/** Resolve one `plan` entry to the stop or hike it names.
 *
 *  Core stop first, then hike, then hidden stop — and the order matters,
 *  because the two catalogs do collide. `mcgurk-meadow` is both a hidden
 *  Secret Guide stop and an entry in the day-hike catalog; hidden stops are
 *  deliberately kept out of the presets, so a preset naming that id means the
 *  hike. Hidden stops still resolve last rather than not at all, so the
 *  validation below can reject one by name instead of calling it unknown. */
export function resolvePlanEntry(
  id: string,
): { kind: 'stop'; stop: (typeof stops)[number] } | { kind: 'hike'; hike: (typeof HIKES)[number] } | null {
  const core = stops.find((s) => s.id === id && s.collection !== 'hidden')
  if (core) return { kind: 'stop', stop: core }
  const hike = HIKES.find((h) => h.id === id)
  if (hike) return { kind: 'hike', hike }
  const hidden = stops.find((s) => s.id === id)
  if (hidden) return { kind: 'stop', stop: hidden }
  return null
}

// Fail fast at module load, same contract as Stops.parse in stops.ts: a
// curated id that doesn't resolve to a core stop or a hike in the day's
// regions is a content error, not something to discover in a buyer's
// seeded plan. What a day's entries add up to is checked separately, by
// scripts/check-itineraries.mjs — nothing at module load can tell that a
// day's lunch landed at 5 p.m.
for (const itinerary of Object.values(ITINERARIES)) {
  for (const day of itinerary.days) {
    for (const id of day.plan ?? []) {
      const entry = resolvePlanEntry(id)
      if (!entry) {
        throw new Error(`Itinerary "${day.name}" lists unknown entry "${id}"`)
      }
      if (entry.kind === 'stop') {
        if (entry.stop.collection === 'hidden' || !day.regions.includes(entry.stop.region)) {
          throw new Error(`Itinerary "${day.name}" lists hidden or out-of-region stop "${id}"`)
        }
      } else if (!day.regions.includes(entry.hike.region)) {
        throw new Error(`Itinerary "${day.name}" lists out-of-region hike "${id}"`)
      }
    }
  }
}

export function isItineraryKey(value: string | null | undefined): value is ItineraryKey {
  return !!value && (ITINERARY_KEYS as string[]).includes(value)
}

// ── Backup plans: what to do when the day turns ──────────────────────────────
// One curated fallback per trigger, shared across every preset rather than
// duplicated per itinerary: a rained-out first-visit day and a rained-out
// easy-pace day want the same answer (the valley, close to the car, where
// rain feeds the falls and clearing storms make the famous light). These are
// informational plans the reader swaps in by hand; nothing seeds itself,
// per the pendingImport rule that only an explicit tap writes to the plan.
// The stop lists validate at load like the itinerary days above.

export type BackupPlan = {
  trigger: 'rain' | 'smoke'
  title: string
  note: string
  stops: string[]
}

export const BACKUP_PLANS: BackupPlan[] = [
  {
    trigger: 'rain',
    title: 'The rain day',
    note: 'Rain is the falls turned up. Work the valley close to the car: the paved falls walks take ten wet minutes each, the museum and the Ahwahnee great room are dry, and if the storm breaks, Tunnel View in clearing weather is the most famous light in the park.',
    stops: [
      'lower-yosemite-fall',
      'bridalveil-fall',
      'yosemite-village',
      'ahwahnee-hotel',
      'tunnel-view',
      'curry-village-pizza',
    ],
  },
  {
    trigger: 'smoke',
    title: 'The smoke day',
    note: 'Smoke pools by elevation and drainage, so the move is to check the morning AQI and drive to the clear end of the park, most often up. Tuolumne at 8,600 feet frequently sits above what the valley is breathing. If the whole park reads unhealthy, make it a short day: the smoke-season essentials page covers the thresholds.',
    stops: [
      'olmsted-point',
      'tenaya-lake',
      'soda-springs-parsons-lodge',
      'tuolumne-meadows-grill',
    ],
  },
]

for (const plan of BACKUP_PLANS) {
  for (const id of plan.stops) {
    const stop = stops.find((s) => s.id === id)
    if (!stop || stop.collection === 'hidden') {
      throw new Error(`Backup plan "${plan.title}" lists unknown or hidden stop "${id}"`)
    }
  }
}
