// The forecast region for a planned day: the first item that resolves to a
// place with a region. Days of region-less items (secret spots, custom
// entries) read as the Valley, the guide's center of gravity.

import { getHikeById, getStopById } from '../content'
import type { TripItemT } from './schema'

export function dayForecastRegion(items: TripItemT[]): string {
  for (const item of items) {
    if (item.type === 'stop') {
      const stop = getStopById(item.stopId)
      if (stop && 'region' in stop && stop.region) return stop.region
    }
    if (item.type === 'hike') {
      const hike = getHikeById(item.hikeId)
      if (hike) return hike.region
    }
  }
  return 'valley'
}
