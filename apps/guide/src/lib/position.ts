// =============================================================================
// Reading a GPS fix out loud. The Help card's whole job is to put a position
// in front of somebody who has to say it to a dispatcher, so every format here
// is one that gets used on that call, and nothing is rounded past what the
// fix supports:
//
//   decimal degrees      37.74560, -119.59360   what 911 centers and every
//                                               maps app take as typed
//   degrees and minutes  37° 44.736′ N          what search-and-rescue radios
//                        119° 35.616′ W         and most handheld GPS units show
//
// Plus the sentence that turns a number into a place ("0.4 mi NE of Olmsted
// Point"), because the first thing dispatch asks after the coordinates is
// where that is. Pure functions, unit-tested; the route composes them.
// =============================================================================

import { cardinalOf, formatMiles, haversineMiles, initialBearingDeg } from '../utils/geo'

const M_TO_FT = 3.28084

/** "37.74560, -119.59360" — latitude first, the order a dispatcher types. */
export function decimalDegrees(coord: [number, number]): string {
  const [lng, lat] = coord
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

/** One axis as degrees and decimal minutes with its hemisphere letter. */
function ddmAxis(value: number, positive: 'N' | 'E', negative: 'S' | 'W'): string {
  const hemisphere = value < 0 ? negative : positive
  const abs = Math.abs(value)
  let deg = Math.floor(abs)
  let min = (abs - deg) * 60
  // 59.9995 rounds to 60.000 at three decimals; carry it into the degree.
  if (Number(min.toFixed(3)) >= 60) {
    deg += 1
    min = 0
  }
  return `${deg}° ${min.toFixed(3)}′ ${hemisphere}`
}

/** "37° 44.736′ N, 119° 35.616′ W" — the SAR and handheld-GPS dialect. */
export function degreesMinutes(coord: [number, number]): string {
  const [lng, lat] = coord
  return `${ddmAxis(lat, 'N', 'S')}, ${ddmAxis(lng, 'E', 'W')}`
}

/** Meters to a whole-foot label, thousands separated. */
export function feetLabel(meters: number): string {
  return `${Math.round(meters * M_TO_FT).toLocaleString('en-US')} ft`
}

export type NamedPlace = {
  id: string
  title: string
  coord: [number, number]
}

export type NearbyPlace = {
  place: NamedPlace
  miles: number
  /** Bearing FROM the place TO the fix: what "NE of Olmsted Point" means. */
  bearingDeg: number
  cardinal: string
}

// Under this distance the fix is at the place, not near it: saying "50 ft NE
// of Tunnel View" adds a bearing nobody can act on. The same radius folds two
// guide entries that share a pullout (Olmsted Point and its stargazing entry)
// into one place, since naming both tells a dispatcher nothing new.
const AT_PLACE_MILES = 0.05

/** The closest named places to a fix, nearest first, one per pullout. */
export function nearestPlaces(
  fix: [number, number],
  places: NamedPlace[],
  limit = 3,
): NearbyPlace[] {
  const ranked = places
    .map((place) => {
      const bearingDeg = initialBearingDeg(place.coord, fix)
      return {
        place,
        miles: haversineMiles(fix, place.coord),
        bearingDeg,
        cardinal: cardinalOf(bearingDeg),
      }
    })
    .sort((a, b) => a.miles - b.miles)
  const out: NearbyPlace[] = []
  for (const n of ranked) {
    if (out.length >= limit) break
    if (out.some((o) => haversineMiles(o.place.coord, n.place.coord) < AT_PLACE_MILES)) continue
    out.push(n)
  }
  return out
}

/** "0.4 mi NE of Olmsted Point", or "at Olmsted Point" when on top of it. */
export function nearbyLabel(n: NearbyPlace): string {
  if (n.miles < AT_PLACE_MILES) return `at ${n.place.title}`
  return `${formatMiles(n.miles)} ${n.cardinal} of ${n.place.title}`
}

export type PositionReport = {
  coord: [number, number]
  accuracyM: number
  altitudeM: number | null
  nearest: NearbyPlace | null
}

/** The message the share sheet carries: everything a dispatcher or a friend
 * needs in one text, ending in a link any maps app opens. Plain ASCII apart
 * from the degree sign; some carriers still mangle anything fancier. */
export function positionMessage(r: PositionReport): string {
  const parts = [`My position: ${decimalDegrees(r.coord)} (±${feetLabel(r.accuracyM)})`]
  if (r.altitudeM !== null) parts.push(`elevation about ${feetLabel(r.altitudeM)}`)
  if (r.nearest) parts.push(`about ${nearbyLabel(r.nearest)}`)
  parts.push('Yosemite National Park')
  const [lng, lat] = r.coord
  return `${parts.join('. ')}. https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`
}
