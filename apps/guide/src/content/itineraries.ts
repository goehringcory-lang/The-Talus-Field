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

import type { Region } from './schema'
import { stops } from './stops'

export type ItineraryKey = '1day' | '2day' | '3day'

export type ItineraryDay = {
  name: string
  regions: Region[]
  // Curated stop ids in drive order. Optional: days without it seed from the
  // full region sequence instead. Validated at module load below.
  stops?: string[]
}

export type Itinerary = {
  label: string
  subtitle: string
  days: ItineraryDay[]
}

export const ITINERARY_KEYS: ItineraryKey[] = ['1day', '2day', '3day']

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
}

// The southern-rim day: the Mariposa Grove on the morning shuttles, then up
// Glacier Point Road for the Sentinel Dome / Taft Point loop (one entry
// covers both points), Washburn Point, and Glacier Point after 4:30 when
// the lot empties and the light turns.
const GLACIER_MARIPOSA_DAY: ItineraryDay = {
  name: 'Day 2 — Glacier Point & Mariposa Grove',
  regions: ['glacier-mariposa'],
  stops: ['mariposa-grove', 'sentinel-dome', 'washburn-point', 'glacier-point'],
}

export const ITINERARIES: Record<ItineraryKey, Itinerary> = {
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
      { name: 'Day 3 — Tuolumne Meadows', regions: ['tuolumne'] },
    ],
  },
}

// Fail fast at module load, same contract as Stops.parse in stops.ts: a
// curated id that doesn't resolve to a core stop in the day's regions is a
// content error, not something to discover in a buyer's seeded plan.
for (const itinerary of Object.values(ITINERARIES)) {
  for (const day of itinerary.days) {
    for (const id of day.stops ?? []) {
      const stop = stops.find((s) => s.id === id)
      if (!stop || stop.collection === 'hidden' || !day.regions.includes(stop.region)) {
        throw new Error(`Itinerary "${day.name}" lists unknown or out-of-region stop "${id}"`)
      }
    }
  }
}

export function isItineraryKey(value: string | null | undefined): value is ItineraryKey {
  return value === '1day' || value === '2day' || value === '3day'
}
