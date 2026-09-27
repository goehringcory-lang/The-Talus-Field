// =============================================================================
// Map places a trip can hold as a custom entry: a parking lot, a campground, a
// lodge, a visitor center (content/amenities.ts) or a place to eat
// (content/dining.ts). The entry stores only `placeId`; the name and the
// coordinate are read live from the record here, so a corrected coordinate in
// the content reaches every plan that holds the place.
// =============================================================================

import { AMENITIES, DINING } from '../content'
import type { MapPinKind } from '../map/kinds'

export type TripPlace = {
  placeId: string
  title: string
  coord: [number, number]
  kind: MapPinKind
}

export function amenityPlaceId(id: string): string {
  return `amenity:${id}`
}

export function diningPlaceId(id: string): string {
  return `dining:${id}`
}

const byId = new Map<string, TripPlace>()
for (const a of AMENITIES) {
  byId.set(amenityPlaceId(a.id), { placeId: amenityPlaceId(a.id), title: a.name, coord: a.coord, kind: a.kind })
}
for (const d of DINING) {
  if (!d.coord) continue
  byId.set(diningPlaceId(d.id), { placeId: diningPlaceId(d.id), title: d.name, coord: d.coord, kind: 'meal' })
}

export function resolvePlace(placeId: string | undefined): TripPlace | undefined {
  return placeId ? byId.get(placeId) : undefined
}
