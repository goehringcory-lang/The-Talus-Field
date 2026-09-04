// The daylight verdicts ride on the solar module the slotter already trusts;
// what this checks is the arithmetic on top of it, against the two sunsets the
// solar tests pin (8:23 p.m. at the June solstice, 4:42 p.m. in December).
import { describe, expect, it } from 'vitest'
import { DAYLIGHT_MARGIN_MIN, daylightFit, latestStart } from './daylight'
import { sunTimes } from './solar'

const minutes = (hh: number, mm: number) => hh * 60 + mm

describe('latestStart', () => {
  it('is the sunset less the margin less the hike, on a June day', () => {
    const sunset = sunTimes('2026-06-21')!.sunsetMin
    const four = latestStart('2026-06-21', 240)!
    expect(four.latestStartMin).toBe(sunset - DAYLIGHT_MARGIN_MIN - 240)
    // About 3:23 p.m.: a four-hour walk started then is down by 7:23 with the hour in hand.
    expect(Math.abs(four.latestStartMin - minutes(15, 23))).toBeLessThanOrEqual(3)
    expect(four.beforeSunrise).toBe(false)
  })

  it('flags a start before sunrise for the long ones', () => {
    // A fourteen-hour day on the shortest day of the year: sunset 4:42, so the
    // latest start is 1:42 a.m., long before the 7:10 sunrise.
    const halfDomeInWinter = latestStart('2026-12-21', 14 * 60)!
    expect(halfDomeInWinter.beforeSunrise).toBe(true)
    expect(halfDomeInWinter.latestStartMin).toBeLessThan(halfDomeInWinter.sunriseMin)
  })

  it('honors a caller-supplied margin', () => {
    const none = latestStart('2026-06-21', 240, 0)!
    const hour = latestStart('2026-06-21', 240)!
    expect(none.latestStartMin - hour.latestStartMin).toBe(DAYLIGHT_MARGIN_MIN)
  })

  it('returns null for a malformed date', () => {
    expect(latestStart('June 21', 240)).toBeNull()
  })
})

describe('daylightFit', () => {
  it('is clear when the finish leaves the whole margin', () => {
    const fit = daylightFit('2026-06-21', minutes(8, 0), 240)!
    expect(fit.verdict).toBe('clear')
    expect(fit.endMin).toBe(minutes(12, 0))
    expect(fit.lightLeftMin).toBeGreaterThan(DAYLIGHT_MARGIN_MIN)
  })

  it('is tight when the finish lands inside the margin but before sunset', () => {
    const sunset = sunTimes('2026-09-22')!.sunsetMin
    const fit = daylightFit('2026-09-22', sunset - 30 - 120, 120)!
    expect(fit.verdict).toBe('tight')
    expect(fit.lightLeftMin).toBe(30)
  })

  it('is dark when the finish runs past sunset', () => {
    // A four-hour hike started at 1 p.m. in December ends at 5, after a 4:42 sunset.
    const fit = daylightFit('2026-12-21', minutes(13, 0), 240)!
    expect(fit.verdict).toBe('dark')
    expect(fit.lightLeftMin).toBeLessThan(0)
    expect(fit.endMin).toBe(minutes(17, 0))
  })

  it('agrees with latestStart at the boundary', () => {
    const ls = latestStart('2027-03-20', 300)!
    expect(daylightFit('2027-03-20', ls.latestStartMin, 300)!.verdict).toBe('clear')
    expect(daylightFit('2027-03-20', ls.latestStartMin + 1, 300)!.verdict).toBe('tight')
  })
})
