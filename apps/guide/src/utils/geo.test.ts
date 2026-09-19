// Great-circle math on [lng, lat] tuples, the order the whole content model
// uses. The slotter, the compass, the companion and the Help card all stand
// on these four functions.
import { describe, expect, it } from 'vitest'
import { cardinalOf, formatMiles, haversineMiles, initialBearingDeg } from './geo'

const TUNNEL_VIEW: [number, number] = [-119.6773, 37.7156]
const GLACIER_POINT: [number, number] = [-119.5731, 37.7283]

describe('haversineMiles', () => {
  it('measures Tunnel View to Glacier Point at about five and three-quarter miles', () => {
    expect(haversineMiles(TUNNEL_VIEW, GLACIER_POINT)).toBeCloseTo(5.76, 1)
    expect(haversineMiles(GLACIER_POINT, TUNNEL_VIEW)).toBeCloseTo(haversineMiles(TUNNEL_VIEW, GLACIER_POINT), 6)
    expect(haversineMiles(TUNNEL_VIEW, TUNNEL_VIEW)).toBe(0)
  })

  it('takes [lng, lat], not [lat, lng]', () => {
    // One degree of latitude is about 69 miles anywhere; swapping the tuple
    // would read it as a degree of longitude at 37.7 N, about 55.
    expect(haversineMiles([-119.5, 37.0], [-119.5, 38.0])).toBeCloseTo(69.1, 0)
  })
})

describe('formatMiles', () => {
  it('rounds feet to fifty with a floor, then tenths, then whole miles', () => {
    expect(formatMiles(0.005)).toBe('50 ft')
    expect(formatMiles(0.1)).toBe('550 ft')
    expect(formatMiles(0.19)).toBe('0.2 mi')
    expect(formatMiles(2.345)).toBe('2.3 mi')
    expect(formatMiles(12.6)).toBe('13 mi')
  })
})

describe('initialBearingDeg and cardinalOf', () => {
  it('reads due north as 0 and due east as about 90, always in [0, 360)', () => {
    expect(initialBearingDeg([-119.5, 37.7], [-119.5, 37.8])).toBeCloseTo(0, 5)
    expect(initialBearingDeg([-119.5, 37.7], [-119.4, 37.7])).toBeCloseTo(90, 0)
    const west = initialBearingDeg([-119.4, 37.7], [-119.5, 37.7])
    expect(west).toBeGreaterThanOrEqual(0)
    expect(west).toBeLessThan(360)
    expect(west).toBeCloseTo(270, 0)
  })

  it('names the sixteen winds on their rounding boundaries', () => {
    expect(cardinalOf(0)).toBe('N')
    expect(cardinalOf(359)).toBe('N')
    expect(cardinalOf(348.75)).toBe('N')
    expect(cardinalOf(11.25)).toBe('NNE')
    expect(cardinalOf(270)).toBe('W')
    expect(cardinalOf(-90)).toBe('W')
  })
})
