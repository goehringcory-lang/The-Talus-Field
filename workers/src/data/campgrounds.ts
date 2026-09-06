// =============================================================================
// CAMPGROUNDS — the recreation.gov registry behind campsite watches.
//
// Every reservable campground inside the park, keyed by the short id a watch
// carries (`targetId`), with the recreation.gov campground id the five-minute
// sweep polls (lib/availabilitySweep.ts) and the map amenity the PWA links
// from. The ids were read off recreation.gov's own search endpoint on
// 2026-09-05; a wrong one fails as a 404 the sweep logs and skips, never as a
// wrong campsite.
//
// `model` is how recreation.gov sells the place: `site` campgrounds list every
// campsite with a per-night status, and `person` (Camp 4) is one pseudo-site
// whose `quantities` are the walk-in spots left. `release` feeds one sentence
// of form copy and nothing else — the windows are quoted from the camping
// guide, which is where they get re-verified.
//
// KEEP IN SYNC with apps/guide/src/watch/targets.ts. The PWA mirrors this
// table by hand (the repo deliberately has no shared package) and
// scripts/check-watch-targets.mjs fails the build when the two disagree, so
// keep one entry per line in this field order: the check reads the file as
// text.
// =============================================================================

export type CampgroundRelease = 'fifteenth-5mo' | 'rolling-14' | 'rolling-7' | 'mixed'

export type Campground = {
  id: string                 // watch targetId, also the PWA's ?target= value
  name: string
  rgId: number               // recreation.gov campground id
  model: 'site' | 'person'   // per-site availability, or per-person quantities (Camp 4)
  amenityId: string          // apps/guide/src/content/amenities.ts id, kind 'camping'
  release: CampgroundRelease
}

export const CAMPGROUNDS: Campground[] = [
  { id: 'upper-pines', name: 'Upper Pines', rgId: 232447, model: 'site', amenityId: 'upper-pines-campground', release: 'fifteenth-5mo' },
  { id: 'lower-pines', name: 'Lower Pines', rgId: 232450, model: 'site', amenityId: 'lower-pines-campground', release: 'fifteenth-5mo' },
  { id: 'north-pines', name: 'North Pines', rgId: 232449, model: 'site', amenityId: 'north-pines-campground', release: 'fifteenth-5mo' },
  { id: 'wawona', name: 'Wawona', rgId: 232446, model: 'site', amenityId: 'wawona-campground', release: 'fifteenth-5mo' },
  { id: 'hodgdon-meadow', name: 'Hodgdon Meadow', rgId: 232451, model: 'site', amenityId: 'hodgdon-meadow-campground', release: 'fifteenth-5mo' },
  { id: 'crane-flat', name: 'Crane Flat', rgId: 232452, model: 'site', amenityId: 'crane-flat-campground', release: 'rolling-14' },
  { id: 'tuolumne-meadows', name: 'Tuolumne Meadows', rgId: 232448, model: 'site', amenityId: 'tuolumne-meadows-campground', release: 'mixed' },
  { id: 'bridalveil-creek', name: 'Bridalveil Creek', rgId: 232453, model: 'site', amenityId: 'bridalveil-creek-campground', release: 'rolling-14' },
  { id: 'tamarack-flat', name: 'Tamarack Flat', rgId: 10083845, model: 'site', amenityId: 'tamarack-flat-campground', release: 'rolling-14' },
  { id: 'white-wolf', name: 'White Wolf', rgId: 10083567, model: 'site', amenityId: 'white-wolf-campground', release: 'rolling-14' },
  { id: 'yosemite-creek', name: 'Yosemite Creek', rgId: 10083840, model: 'site', amenityId: 'yosemite-creek-campground', release: 'rolling-14' },
  { id: 'porcupine-flat', name: 'Porcupine Flat', rgId: 10083831, model: 'site', amenityId: 'porcupine-flat-campground', release: 'rolling-14' },
  { id: 'camp-4', name: 'Camp 4', rgId: 10004152, model: 'person', amenityId: 'camp-4', release: 'rolling-7' },
]

export const CAMPGROUND_BY_ID: ReadonlyMap<string, Campground> = new Map(
  CAMPGROUNDS.map((c) => [c.id, c]),
)

/** The recreation.gov campground page: the one place a reader can book. */
export function bookUrl(c: Campground): string {
  return `https://www.recreation.gov/camping/campgrounds/${c.rgId}`
}

// Load-time guard, the manual-programs.ts idiom: a duplicated id would make a
// watch ambiguous, a duplicated rgId would poll one campground under two
// names, and a duplicated amenityId would put two Watch buttons on one pin.
{
  const ids = new Set<string>()
  const rgIds = new Set<number>()
  const amenityIds = new Set<string>()
  for (const c of CAMPGROUNDS) {
    if (ids.has(c.id) || rgIds.has(c.rgId) || amenityIds.has(c.amenityId)) {
      throw new Error(`campgrounds.ts: duplicate entry for ${c.id}`)
    }
    ids.add(c.id)
    rgIds.add(c.rgId)
    amenityIds.add(c.amenityId)
  }
}
