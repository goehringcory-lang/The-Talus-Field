// =============================================================================
// forecastDays — folds NWS day/night half-periods into calendar days for the
// five-day card forecast. Pure data massage, no React.
//
// Grouping is by park-local calendar date via startTime.slice(0, 10): NWS ISO
// strings carry the local offset, so the first ten characters are the local
// date with no Date parsing and no UTC rollover. A "Tonight" period (starts
// 18:00) keys to the day it belongs to editorially even though it spans past
// midnight.
// =============================================================================

import type { WeatherPeriodT } from './schema'

export type ForecastDay = {
  date: string // YYYY-MM-DD, park-local; stable render key
  label: string // "Fri"
  hiF: number | null // daytime temp; null when the day half is missing (leading "Tonight")
  loF: number | null // overnight temp; null when the night half is missing (truncated tail)
  shortForecast: string
  precipChance: number | null
}

// Weekday from the calendar date, not period.name: names are half-specific
// and unbounded ("This Afternoon", "Independence Day"), while the paired row
// needs one constant-width label. Same timezone-safe idiom as formatDayHeader.
function formatDayLabel(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  })
}

export function groupPeriodsIntoDays(periods: WeatherPeriodT[], maxDays = 5): ForecastDay[] {
  // Insertion order is chronological order. Day halves keep the first writer
  // (defensive against duplicates in a malformed feed). Night halves keep the
  // LAST writer: an early-morning fetch legitimately opens with "Overnight"
  // (the night now ending, dated today) followed later by "Tonight" (the
  // coming night, also dated today), and the coming night's low is the one
  // the card must show.
  const byDate = new Map<string, { day?: WeatherPeriodT; night?: WeatherPeriodT }>()
  for (const period of periods) {
    const date = period.startTime.slice(0, 10)
    const slot = byDate.get(date) ?? {}
    if (period.isDaytime) slot.day = slot.day ?? period
    else slot.night = period
    byDate.set(date, slot)
  }

  // Condition and rain chance prefer the day half: an overnight thunderstorm
  // percentage should not masquerade as the daytime picture.
  return [...byDate.entries()].slice(0, maxDays).map(([date, { day, night }]) => ({
    date,
    label: formatDayLabel(date),
    hiF: day?.tempF ?? null,
    loF: night?.tempF ?? null,
    shortForecast: day?.shortForecast ?? night?.shortForecast ?? '',
    precipChance: day?.precipChance ?? night?.precipChance ?? null,
  }))
}
