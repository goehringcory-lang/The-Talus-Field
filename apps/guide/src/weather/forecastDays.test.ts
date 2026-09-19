// Folding NWS half-periods into calendar days. The one rule that has bitten
// is timezone: the local date is the first ten characters of the period's own
// ISO string, so an 18:00 Pacific "Tonight" (01:00 UTC tomorrow) keys to the
// day it belongs to. The others: the day half wins for condition and rain,
// the LAST night half wins (an early fetch opens with the ending night), the
// FIRST day half wins against a duplicate.
import { describe, expect, it } from 'vitest'
import { groupPeriodsIntoDays } from './forecastDays'
import type { WeatherPeriodT } from './schema'

const period = (
  name: string,
  startTime: string,
  isDaytime: boolean,
  tempF: number,
  shortForecast = isDaytime ? 'Sunny' : 'Clear',
  precipChance: number | null = null,
): WeatherPeriodT => ({ name, startTime, isDaytime, tempF, shortForecast, precipChance, windSpeed: null })

describe('groupPeriodsIntoDays', () => {
  it('folds a day and its night into one row', () => {
    const days = groupPeriodsIntoDays([
      period('Friday', '2026-07-03T06:00:00-07:00', true, 88, 'Sunny', 10),
      period('Friday Night', '2026-07-03T18:00:00-07:00', false, 55, 'Clear', 40),
    ])
    expect(days).toEqual([{ date: '2026-07-03', label: 'Fri', hiF: 88, loF: 55, shortForecast: 'Sunny', precipChance: 10 }])
  })

  it('keys an evening period to its local date, not the UTC one', () => {
    // 18:00 PDT on the 3rd is 01:00 UTC on the 4th.
    const [day] = groupPeriodsIntoDays([period('Tonight', '2026-07-03T18:00:00-07:00', false, 54)])
    expect(day.date).toBe('2026-07-03')
    expect(day.label).toBe('Fri')
    expect(day.hiF).toBeNull()
    expect(day.loF).toBe(54)
    expect(day.shortForecast).toBe('Clear')
  })

  it('lets the coming night overwrite the ending one, and keeps the first day half', () => {
    const days = groupPeriodsIntoDays([
      period('Overnight', '2026-07-03T00:00:00-07:00', false, 49, 'Partly Cloudy'),
      period('Today', '2026-07-03T06:00:00-07:00', true, 90, 'Sunny'),
      period('Today (dup)', '2026-07-03T12:00:00-07:00', true, 95, 'Hot'),
      period('Tonight', '2026-07-03T18:00:00-07:00', false, 57, 'Clear'),
    ])
    expect(days).toHaveLength(1)
    expect(days[0].loF).toBe(57)
    expect(days[0].hiF).toBe(90)
    expect(days[0].shortForecast).toBe('Sunny')
  })

  it('falls through to the night half for rain only when the day carries none', () => {
    const [withDay] = groupPeriodsIntoDays([
      period('Sat', '2026-07-04T06:00:00-07:00', true, 80, 'Chance Showers', null),
      period('Sat Night', '2026-07-04T18:00:00-07:00', false, 50, 'Showers', 60),
    ])
    expect(withDay.precipChance).toBe(60)
    const [dayWins] = groupPeriodsIntoDays([
      period('Sun', '2026-07-05T06:00:00-07:00', true, 80, 'Sunny', 5),
      period('Sun Night', '2026-07-05T18:00:00-07:00', false, 50, 'Storms', 70),
    ])
    expect(dayWins.precipChance).toBe(5)
  })

  it('keeps chronological order and truncates to maxDays', () => {
    const periods: WeatherPeriodT[] = []
    for (let d = 1; d <= 7; d++) {
      periods.push(period(`D${d}`, `2026-07-0${d}T06:00:00-07:00`, true, 70 + d))
      periods.push(period(`N${d}`, `2026-07-0${d}T18:00:00-07:00`, false, 40 + d))
    }
    const days = groupPeriodsIntoDays(periods)
    expect(days.map((d) => d.date)).toEqual(['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'])
    expect(groupPeriodsIntoDays(periods, 2)).toHaveLength(2)
  })
})
