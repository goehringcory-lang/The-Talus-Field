// =============================================================================
// Campsite watch targets: the campgrounds a buyer can watch.
//
// KEEP IN SYNC with workers/src/data/campgrounds.ts, which is the canonical
// registry (the Worker refuses a targetId it does not carry). The mirror
// exists so the form, the list, and the map popup render offline and without
// a round trip; scripts/check-watch-targets.mjs fails the build when the two
// tables disagree, and it reads both files as text, so keep one entry per
// line in this field order.
// =============================================================================

export type WatchTargetRelease = 'fifteenth-5mo' | 'rolling-14' | 'rolling-7' | 'mixed'

export type WatchTarget = {
  id: string                 // the Worker's targetId, also the ?target= value
  name: string
  rgId: number               // recreation.gov campground id
  model: 'site' | 'person'   // per-site availability, or per-person spots (Camp 4)
  amenityId: string          // content/amenities.ts id, kind 'camping'
  release: WatchTargetRelease
}

export const WATCH_TARGETS: WatchTarget[] = [
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

const BY_ID = new Map(WATCH_TARGETS.map((t) => [t.id, t]))
const BY_AMENITY = new Map(WATCH_TARGETS.map((t) => [t.amenityId, t]))

export function targetById(id: string): WatchTarget | undefined {
  return BY_ID.get(id)
}

export function targetForAmenity(amenityId: string): WatchTarget | undefined {
  return BY_AMENITY.get(amenityId)
}

/** The recreation.gov campground page, the one place a reader can book. */
export function bookUrlFor(t: WatchTarget): string {
  return `https://www.recreation.gov/camping/campgrounds/${t.rgId}`
}

// The release windows as the camping guide states them. A watch on nights
// that are not yet released is valid: it fires the morning they open.
export function releaseCopy(release: WatchTargetRelease): string {
  switch (release) {
    case 'fifteenth-5mo':
      return 'Released on the 15th of each month at 7 a.m. Pacific, five months ahead. The good dates go in minutes; cancellations come back in waves 14 days, 3 to 5 days, and the day before.'
    case 'rolling-14':
      return 'Released 14 days ahead, one night at a time, at 7 a.m. Pacific.'
    case 'rolling-7':
      return 'Released 7 days ahead, one night at a time, at 7 a.m. Pacific. Sold by the spot, not the site.'
    case 'mixed':
      return 'Half the sites release five months ahead on the 15th, half 14 days ahead, both at 7 a.m. Pacific.'
  }
}
