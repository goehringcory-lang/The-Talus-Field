// Where the sun is at an instant, for the compass dial. solar.ts is trusted
// for event times (its own tests pin the solstice sunrises and sunsets to the
// NOAA calculator); this module evaluates the same series at the instant, so
// the cases check it against those events: the sun is due south at solar
// noon, on the horizon at the pinned sunrise and sunset, at the NOAA
// azimuths for 37.75 N, 119.59 W, and below the horizon at two in the morning.
import { describe, expect, it } from 'vitest'
import { sunPosition } from './position'
import { PARK_COORD, sunTimes } from './solar'

// Pacific minutes-from-midnight on a date to a UTC instant (PDT in June, PST
// in December; neither date is near a transition).
const instant = (day: string, parkMin: number, offsetH: number) => new Date(Date.parse(`${day}T00:00:00Z`) + (parkMin + offsetH * 60) * 60_000)

describe('sunPosition', () => {
  it('is due south and at its highest at solar noon on the solstice', () => {
    const noon = sunPosition(new Date('2026-06-21T20:00:00Z'), PARK_COORD)
    expect(Math.abs(noon.azimuthDeg - 180)).toBeLessThanOrEqual(1.5)
    // 90 minus the latitude plus the declination: about 75.7 degrees.
    expect(Math.abs(noon.altitudeDeg - 75.7)).toBeLessThanOrEqual(0.5)
  })

  it('sits on the horizon at the June sunrise and sunset, at the NOAA azimuths', () => {
    const rise = sunPosition(new Date('2026-06-21T12:36:00Z'), PARK_COORD)
    expect(Math.abs(rise.azimuthDeg - 59.4)).toBeLessThanOrEqual(1.5)
    expect(rise.altitudeDeg).toBeGreaterThan(-1.5)
    expect(rise.altitudeDeg).toBeLessThan(0.5)
    const set = sunPosition(new Date('2026-06-22T03:23:00Z'), PARK_COORD)
    expect(Math.abs(set.azimuthDeg - 300.6)).toBeLessThanOrEqual(1.5)
    expect(Math.abs(set.altitudeDeg)).toBeLessThan(1.5)
  })

  it('rises well south of east and sets well south of west in December', () => {
    const rise = sunPosition(new Date('2026-12-21T15:10:00Z'), PARK_COORD)
    expect(Math.abs(rise.azimuthDeg - 119.5)).toBeLessThanOrEqual(1.5)
    const set = sunPosition(new Date('2026-12-22T00:42:00Z'), PARK_COORD)
    expect(Math.abs(set.azimuthDeg - 240.4)).toBeLessThanOrEqual(1.5)
  })

  it.each([
    ['2026-06-21', 7],
    ['2026-12-21', 8],
  ])('agrees with solar.ts about when the sun goes down on %s', (day, offsetH) => {
    const times = sunTimes(day)!
    const atSunset = sunPosition(instant(day, times.sunsetMin, offsetH), PARK_COORD)
    // Sunset is the upper limb at -0.833 degrees, refraction included.
    expect(Math.abs(atSunset.altitudeDeg + 0.83)).toBeLessThanOrEqual(1)
    const atSunrise = sunPosition(instant(day, times.sunriseMin, offsetH), PARK_COORD)
    expect(Math.abs(atSunrise.altitudeDeg + 0.83)).toBeLessThanOrEqual(1)
  })

  it('is below the horizon at two in the morning, with a bearing still on the dial', () => {
    const night = sunPosition(new Date('2026-06-21T09:00:00Z'), PARK_COORD)
    expect(night.altitudeDeg).toBeLessThan(-10)
    expect(night.azimuthDeg).toBeGreaterThanOrEqual(0)
    expect(night.azimuthDeg).toBeLessThan(360)
  })
})
