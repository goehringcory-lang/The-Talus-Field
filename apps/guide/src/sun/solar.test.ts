// The on-device sun calculation is the one reading in the guide that can
// never be stale, which is also why nothing else checks it: a wrong number
// here renders with full confidence. The sunsets are the anchors the trip
// slotter's documentation quotes (4:42 p.m. in December, 8:23 p.m. in June);
// the sunrises are the NOAA calculator's for the Valley coordinate, allowing
// the ±2 minutes the module claims plus a minute of rounding.
import { describe, expect, it } from 'vitest'
import { sunTimes } from './solar'

const minutes = (hh: number, mm: number) => hh * 60 + mm

describe('sunTimes', () => {
  it('matches NOAA for the summer solstice (PDT)', () => {
    const t = sunTimes('2026-06-21')!
    expect(Math.abs(t.sunriseMin - minutes(5, 36))).toBeLessThanOrEqual(3)
    expect(Math.abs(t.sunsetMin - minutes(20, 23))).toBeLessThanOrEqual(3)
  })

  it('matches NOAA for the winter solstice (PST)', () => {
    const t = sunTimes('2026-12-21')!
    expect(Math.abs(t.sunriseMin - minutes(7, 10))).toBeLessThanOrEqual(3)
    expect(Math.abs(t.sunsetMin - minutes(16, 42))).toBeLessThanOrEqual(3)
  })

  it('keeps the day in order across the DST change', () => {
    for (const day of ['2026-03-07', '2026-03-08', '2026-03-09', '2026-10-31', '2026-11-01', '2026-11-02']) {
      const t = sunTimes(day)!
      expect(t.sunriseMin).toBeLessThan(t.goldenAmEndMin)
      expect(t.goldenAmEndMin).toBeLessThan(t.goldenPmStartMin)
      expect(t.goldenPmStartMin).toBeLessThan(t.sunsetMin)
      expect(t.sunriseMin).toBeGreaterThan(0)
      expect(t.sunsetMin).toBeLessThan(1440)
    }
  })

  it('rejects a malformed date', () => {
    expect(sunTimes('June 21')).toBeNull()
  })
})
