// =============================================================================
// Where the sun is right now: azimuth from true north and altitude above the
// horizon, computed on-device from the same NOAA series solar.ts uses for
// event times. No API, no dependency, works in airplane mode.
//
// solar.ts answers "when does the sun cross a zenith today"; this module
// answers "where is it at this instant", which is what a compass rose needs.
// The equation-of-time and declination series are the published NOAA
// coefficients, restated here because this module evaluates them at the
// actual instant rather than at solar noon — sharing solar.ts's noon-fixed
// evaluation would put the sun marker up to a quarter degree off by evening.
// Accuracy is a few tenths of a degree, far inside the wobble of a phone
// compass.
// =============================================================================

const RAD = Math.PI / 180

export type SunPosition = {
  azimuthDeg: number // from true north, clockwise, 0..360
  altitudeDeg: number // above the horizon; negative once the sun is down
}

/** Solar azimuth/altitude at `date` for a [lng, lat] coordinate. */
export function sunPosition(date: Date, coord: [number, number]): SunPosition {
  const [lng, lat] = coord

  // Fractional year (radians) at this instant, UTC-based like the NOAA
  // reference implementation.
  const year = date.getUTCFullYear()
  const yearStartMs = Date.UTC(year, 0, 1)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const dayOfYear = Math.floor((date.getTime() - yearStartMs) / 86_400_000)
  const utcHours =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const g = ((2 * Math.PI) / (leap ? 366 : 365)) * (dayOfYear + (utcHours - 12) / 24)

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(g) -
      0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) -
      0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g)

  // True solar time in minutes, then the hour angle: 0 at solar noon,
  // positive (west) in the afternoon.
  const utcMinutes = utcHours * 60
  const trueSolarMin = (((utcMinutes + eqTime + 4 * lng) % 1440) + 1440) % 1440
  const hourAngle = (trueSolarMin / 4 - 180) * RAD

  const latRad = lat * RAD
  const sinAlt =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngle)
  const altitudeDeg = Math.asin(Math.min(1, Math.max(-1, sinAlt))) / RAD

  // Azimuth via atan2 of the horizontal components: no quadrant bookkeeping,
  // no divide-by-zero at the zenith. Measured from south, west-positive,
  // then folded to compass convention (from north, clockwise).
  const azFromSouth = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(latRad) - Math.tan(decl) * Math.cos(latRad),
  )
  const azimuthDeg = (azFromSouth / RAD + 180 + 360) % 360

  return { azimuthDeg, altitudeDeg }
}
