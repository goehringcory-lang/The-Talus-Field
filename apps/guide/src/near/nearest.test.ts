// The hysteresis rule stated as cases. Entries sit on an east-west line at
// the park's latitude so a distance can be set in metres; one degree of
// longitude at 37.7° N is about 88.1 km, and the assertions leave slack for
// the haversine rounding that follows.
import { describe, expect, it } from 'vitest'
import type { NearEntry } from './entries'
import { HYSTERESIS_FLOOR_MI, pickNearest, rankEntries, switchMargin } from './nearest'

const LAT = 37.7
const M_PER_DEG_LNG = 111_320 * Math.cos((LAT * Math.PI) / 180)
const MI = 1609.344

function entryAt(key: string, metresEast: number): NearEntry {
  return {
    key,
    kind: 'stop',
    id: key,
    title: key,
    coord: [-119.6 + metresEast / M_PER_DEG_LNG, LAT],
    teaser: null,
    why: '',
    where: 'Valley',
    to: `/stop/${key}`,
  }
}

const fixAt = (metresEast: number): [number, number] => [-119.6 + metresEast / M_PER_DEG_LNG, LAT]

describe('rankEntries', () => {
  it('orders by distance and reports the bearing from the fix', () => {
    const ranked = rankEntries(fixAt(0), [entryAt('far', 3000), entryAt('near', -500)])
    expect(ranked.map((r) => r.entry.key)).toEqual(['near', 'far'])
    expect(ranked[0].miles * MI).toBeCloseTo(500, -1)
    expect(ranked[0].cardinal).toBe('W')
    expect(ranked[1].cardinal).toBe('E')
  })
})

describe('switchMargin', () => {
  it('is fifteen percent at range and a hundred metres on foot', () => {
    expect(switchMargin(2)).toBeCloseTo(0.3)
    expect(switchMargin(0.2)).toBeCloseTo(HYSTERESIS_FLOOR_MI)
    expect(HYSTERESIS_FLOOR_MI * MI).toBeCloseTo(100, 6)
  })
})

describe('pickNearest', () => {
  const a = entryAt('a', 0)
  const b = entryAt('b', 4000)

  it('takes the plain nearest when nothing is current', () => {
    expect(pickNearest(null, rankEntries(fixAt(100), [a, b]))).toBe('a')
    expect(pickNearest(null, [])).toBeNull()
  })

  it('keeps the current entry across the midpoint until the margin is beaten', () => {
    // Fix 2,100 m from a, 1,900 m from b: b is nearer by 200 m, under 15% of 2,100.
    expect(pickNearest('a', rankEntries(fixAt(2100), [a, b]))).toBe('a')
    // 2,400 m from a, 1,600 m from b: nearer by 800 m, past the 360 m margin.
    expect(pickNearest('a', rankEntries(fixAt(2400), [a, b]))).toBe('b')
  })

  it('applies the hundred-metre floor when the percentage would be smaller', () => {
    const c = entryAt('c', 350)
    // 200 m from a, 150 m from c: c is nearer by 50 m, more than 15% of 200 m
    // but under the floor, so a wobble of one fix cannot flip the announcement.
    expect(pickNearest('a', rankEntries(fixAt(200), [a, c]))).toBe('a')
    // 260 m from a, 90 m from c: nearer by 170 m, past the floor.
    expect(pickNearest('a', rankEntries(fixAt(260), [a, c]))).toBe('c')
  })

  it('is symmetric: the newcomer then holds its place the same way', () => {
    expect(pickNearest('b', rankEntries(fixAt(1900), [a, b]))).toBe('b')
    expect(pickNearest('b', rankEntries(fixAt(1600), [a, b]))).toBe('a')
  })

  it('falls back to the nearest when the current key has left the catalog', () => {
    expect(pickNearest('gone', rankEntries(fixAt(3900), [a, b]))).toBe('b')
  })
})
