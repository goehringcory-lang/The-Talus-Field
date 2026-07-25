// =============================================================================
// Sunrise, sunset, and golden hour, computed on-device from the standard NOAA
// solar equations: no API, no dependency, works in airplane mode like the
// rest of the guide. Times are minutes from park-local midnight, the same
// dialect as parkNowMinutes/formatClock/slotting.
//
// One fixed coordinate for the whole park (the Valley weather spot from
// workers/src/lib/weather.ts): across the park's ~0.4 degree longitude span
// astronomical times differ by under two minutes, far less than the terrain
// effects a flat-horizon model ignores. Copy that renders these should carry
// the caveat that canyon walls hold the valley floor in shade longer.
// =============================================================================

const PACIFIC = 'America/Los_Angeles'

export const PARK_COORD: [number, number] = [-119.5936, 37.7456] // [lng, lat]

export type SunTimes = {
  sunriseMin: number // official sunrise (zenith 90.833 deg), park-local minutes
  sunsetMin: number
  goldenAmEndMin: number // sun climbs past +6 deg altitude
  goldenPmStartMin: number // sun drops below +6 deg
}

const RAD = Math.PI / 180

// Hour angle in degrees for a given zenith, or null when the sun never
// crosses it that day (impossible at 37 N for these zeniths; guarded anyway).
function hourAngleDeg(zenithDeg: number, latDeg: number, declRad: number): number | null {
  const lat = latDeg * RAD
  const cosHa =
    Math.cos(zenithDeg * RAD) / (Math.cos(lat) * Math.cos(declRad)) -
    Math.tan(lat) * Math.tan(declRad)
  if (cosHa < -1 || cosHa > 1) return null
  return Math.acos(cosHa) / RAD
}

// Park-local minutes from midnight of `dateIso` for a UTC epoch. Events near
// UTC midnight land on a neighboring park-local date; the day difference
// folds in as whole days so the numbers stay monotonic for one calendar day.
function parkMinutesOf(epochMs: number, dateIso: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PACIFIC,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(epochMs)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  // en-CA formats as YYYY-MM-DD, same idiom as todayIso.
  const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: PACIFIC }).format(epochMs)
  const dayDiff = Math.round(
    (Date.parse(`${localDate}T00:00:00Z`) - Date.parse(`${dateIso}T00:00:00Z`)) / 86_400_000,
  )
  return (hour % 24) * 60 + minute + dayDiff * 1440
}

/** NOAA solar times for a park-local calendar date (YYYY-MM-DD). */
export function sunTimes(dateIso: string, coord: [number, number] = PARK_COORD): SunTimes | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso)
  if (!m) return null
  const [, y, mo, d] = m
  const year = Number(y)
  const dayStartMs = Date.UTC(year, Number(mo) - 1, Number(d))
  const dayOfYear = Math.round((dayStartMs - Date.UTC(year, 0, 1)) / 86_400_000) + 1
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)

  // Fractional year at solar noon, then the NOAA equation-of-time (minutes)
  // and solar declination (radians) series.
  const g = ((2 * Math.PI) / (leap ? 366 : 365)) * (dayOfYear - 1 + 0.5)
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

  const [lng, lat] = coord
  const haOfficial = hourAngleDeg(90.833, lat, decl)
  const haGolden = hourAngleDeg(84, lat, decl)
  if (haOfficial === null || haGolden === null) return null

  // UTC minutes of the event on this date: 720 - 4(lng +/- ha) - eqTime,
  // east-positive longitude, +ha for rising events, -ha for setting.
  const toLocal = (ha: number, rising: boolean): number => {
    const utcMinutes = 720 - 4 * (lng + (rising ? ha : -ha)) - eqTime
    return parkMinutesOf(dayStartMs + utcMinutes * 60_000, dateIso)
  }

  return {
    sunriseMin: toLocal(haOfficial, true),
    sunsetMin: toLocal(haOfficial, false),
    goldenAmEndMin: toLocal(haGolden, true),
    goldenPmStartMin: toLocal(haGolden, false),
  }
}
