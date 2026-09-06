// =============================================================================
// Matching NPS lots to the guide's parking pins, by name. The feed names its
// twelve lots the way the park's traffic team does ("Curry Village (Orchard)",
// "Yosemite Village"); content/amenities.ts names ours the way a reader asks
// for them ("Curry Village day-use parking"). Both are normalized (lower case,
// the parenthetical and the words "day-use" / "parking" / "lot" stripped) and
// a lot matches a pin when one normalized name begins with the other. Two
// pins whose NPS lot is named for the place rather than the lot are aliased by
// hand below. No coordinate is ever touched: the pin keeps its verified
// coord, and the lot's own lat/lng is ignored here on purpose.
//
// A pin with no matching lot renders no status line, which is the truthful
// case for Tuolumne Meadows (the feed carries no lot there).
// =============================================================================

import type { AmenityT } from '../content'
import type { ParkingLotT } from './schema'

// amenity id -> the NPS lot name, for pins the name rule cannot reach.
const LOT_ALIASES: Record<string, string> = {
  'hetch-hetchy-dam-lot': 'Hetch Hetchy Reservoir',
}

export function normalizeLotName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b(day-use|day use|parking|lot|area)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The feed's lot for a parking pin, or null when the feed has none for it. */
export function lotForAmenity(amenity: AmenityT, lots: ParkingLotT[]): ParkingLotT | null {
  if (amenity.kind !== 'parking' || lots.length === 0) return null
  const alias = LOT_ALIASES[amenity.id]
  if (alias) {
    const hit = lots.find((l) => l.name === alias)
    if (hit) return hit
  }
  const ours = normalizeLotName(amenity.name)
  if (!ours) return null
  return (
    lots.find((l) => {
      const theirs = normalizeLotName(l.name)
      return theirs !== '' && (theirs.startsWith(ours) || ours.startsWith(theirs))
    }) ?? null
  )
}

export const LOT_STATUS_LABEL: Record<ParkingLotT['status'], string> = {
  open: 'Open',
  full: 'Full',
  closed: 'Closed',
  unknown: 'Unknown',
}
