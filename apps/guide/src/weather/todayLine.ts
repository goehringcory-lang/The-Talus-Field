// One-line forecast formatters shared by Home's region rows, stop pages, and
// the trip planner, so every surface words a forecast the same way and none
// can drift from the staleness policy its caller applies.

import { groupPeriodsIntoDays } from './forecastDays'
import type { WeatherSpotT } from './schema'

// Current forecast for a region row. Labeled with the weekday rather than
// "Today": between WARN_AFTER and HIDE_AFTER the leading day can legitimately
// be yesterday, and the label should not lie about it.
export function regionTodayLine(spot: WeatherSpotT | undefined): string | null {
  if (!spot) return null
  const day = groupPeriodsIntoDays(spot.periods, 1)[0]
  if (!day) return null
  const rain = day.precipChance && day.precipChance >= 20 ? ` · ${day.precipChance}% rain` : ''
  return `${day.label} ${day.hiF ?? '–'}°/${day.loF ?? '–'}° ${day.shortForecast.toLowerCase()}${rain}`
}

// Forecast line for a specific calendar day (the trip planner's day headers).
// Returns null when the date is beyond the forecast window; the NWS gives
// about seven days and dates past that simply get no line.
export function forecastLineForDay(
  spots: WeatherSpotT[],
  region: string,
  dayIso: string,
): string | null {
  const spot = spots.find((s) => s.id === region)
  if (!spot) return null
  const day = groupPeriodsIntoDays(spot.periods, 7).find((d) => d.date === dayIso)
  if (!day) return null
  const rain = day.precipChance && day.precipChance >= 20 ? ` · ${day.precipChance}% rain` : ''
  return `${day.hiF ?? '–'}°/${day.loF ?? '–'}° ${day.shortForecast.toLowerCase()}${rain}`
}
