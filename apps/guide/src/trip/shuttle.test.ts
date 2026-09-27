import { describe, expect, it } from 'vitest'
import { SHUTTLE_WAIT_ALLOWANCE_MIN, VALLEY_LOOP, VALLEY_LOOP_ROUND_TRIP_MIN, shuttleLeg } from './shuttle'

const stop = (n: number) => VALLEY_LOOP.find((s) => s.number === n)!.coord

describe('the Valley shuttle', () => {
  it('is the 18 numbered Valleywide stops in route order, with no stop 13', () => {
    expect(VALLEY_LOOP.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19])
  })

  it('rides forward around the loop at the published pace, plus the wait allowance', () => {
    const leg = shuttleLeg(stop(7), stop(16))!
    expect(leg.board.number).toBe(7)
    expect(leg.alight.number).toBe(16)
    // 7 -> 8, 9, 10, 11, 12, 14, 15, 16: eight stops.
    expect(leg.hops).toBe(8)
    expect(leg.rideMin).toBe(Math.round((8 * VALLEY_LOOP_ROUND_TRIP_MIN) / 18))
    expect(leg.waitMin).toBe(SHUTTLE_WAIT_ALLOWANCE_MIN)
    expect(leg.path.map((s) => s.number)).toEqual([7, 8, 9, 10, 11, 12, 14, 15, 16])
  })

  it('wraps past stop 19 back to stop 1: the loop only runs one way', () => {
    const leg = shuttleLeg(stop(18), stop(2))!
    expect(leg.path.map((s) => s.number)).toEqual([18, 19, 1, 2])
  })

  it('does not make a leg whose end is out of reach of every stop', () => {
    expect(shuttleLeg(stop(7), [-119.5741, 37.7277])).toBeNull() // Glacier Point
  })

  it('charges no wait when both ends share a stop', () => {
    const leg = shuttleLeg(stop(16), [-119.5598, 37.7326])!
    expect(leg.hops).toBe(0)
    expect(leg.waitMin).toBe(0)
  })
})
