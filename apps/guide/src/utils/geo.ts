// Shared great-circle math. Coordinates are [lng, lat] tuples, the GeoJSON
// order used everywhere in the content model.

const EARTH_RADIUS_MI = 3958.8

export function haversineMiles(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const [lngA, latA] = a
  const [lngB, latB] = b
  const dLat = toRad(latB - latA)
  const dLng = toRad(lngB - lngA)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(s))
}

/** Reader-facing distance: feet under ~1000 ft, one decimal under 10 mi. */
export function formatMiles(mi: number): string {
  if (mi < 0.19) return `${Math.max(50, Math.round((mi * 5280) / 50) * 50)} ft`
  if (mi < 10) return `${mi.toFixed(1)} mi`
  return `${Math.round(mi)} mi`
}

/** Initial great-circle bearing from `a` toward `b`, degrees from true north
 * clockwise, 0..360. At park scale this is the whole route's bearing. */
export function initialBearingDeg(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const [lngA, latA] = a
  const [lngB, latB] = b
  const dLng = toRad(lngB - lngA)
  const y = Math.sin(dLng) * Math.cos(toRad(latB))
  const x =
    Math.cos(toRad(latA)) * Math.sin(toRad(latB)) -
    Math.sin(toRad(latA)) * Math.cos(toRad(latB)) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

const WINDS_16 = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
] as const

/** 16-wind compass name for a bearing in degrees from north. */
export function cardinalOf(deg: number): string {
  const i = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16
  return WINDS_16[i]
}
