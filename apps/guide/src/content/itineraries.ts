// Itinerary presets for the /map route. Each itinerary is a list of "days",
// each pinned to one or more regions. Day stop lists are derived live from
// the stops collection via getStopsByRegion(), so adding stops to a region
// flows through automatically with no edit here.

import type { Region } from './schema'

export type ItineraryKey = '1day' | '2day' | '3day'

export type ItineraryDay = {
  name: string
  regions: Region[]
}

export type Itinerary = {
  label: string
  subtitle: string
  days: ItineraryDay[]
}

export const ITINERARY_KEYS: ItineraryKey[] = ['1day', '2day', '3day']

export const ITINERARIES: Record<ItineraryKey, Itinerary> = {
  '1day': {
    label: '1 day',
    subtitle: 'Yosemite Valley',
    days: [{ name: 'Day 1 — Yosemite Valley', regions: ['valley'] }],
  },
  '2day': {
    label: '2 days',
    subtitle: 'Valley + Glacier Point & Mariposa',
    days: [
      { name: 'Day 1 — Yosemite Valley', regions: ['valley'] },
      { name: 'Day 2 — Glacier Point & Mariposa Grove', regions: ['glacier-mariposa'] },
    ],
  },
  '3day': {
    label: '3 days',
    subtitle: '+ Tuolumne Meadows',
    days: [
      { name: 'Day 1 — Yosemite Valley', regions: ['valley'] },
      { name: 'Day 2 — Glacier Point & Mariposa Grove', regions: ['glacier-mariposa'] },
      { name: 'Day 3 — Tuolumne Meadows', regions: ['tuolumne'] },
    ],
  },
}

export function isItineraryKey(value: string | null | undefined): value is ItineraryKey {
  return value === '1day' || value === '2day' || value === '3day'
}
