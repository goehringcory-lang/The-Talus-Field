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
