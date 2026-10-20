import { describe, expect, it } from 'vitest'
import type { BackpackTripT } from '../content/schema'
import { BACKPACK_TRIPS } from '../content/backpacking'
import { ROUTE_SUMMARY } from '../map/backpacking.generated'
import { longestDryStretch, planDays, waterPasses } from './plan'
import type { BackpackRouteT } from './routes'

// A made-up out-and-back: 10 miles there and back, one night at the far end,
// a reliable creek at mile 2 and a seasonal one at mile 4.
const trip: BackpackTripT = {
  id: 't',
  title: 'Test',
  region: 'tuolumne',
  order: 1,
  level: 'moderate',
  nightsMin: 1,
  nightsMax: 1,
  route: 'out-and-back',
  distanceMi: 10,
  elevationGainFt: 1000,
  highPointFt: 9000,
  season: 'Summer',
  teaser: '',
  description: '',
  permit: { trailhead: 'Test', note: '' },
  trailhead: { name: 'Trailhead', coord: [0, 0], parking: '' },
  days: [
    { from: 'Trailhead', to: 'Lake', campId: 'lake', summary: '' },
    { from: 'Lake', to: 'Trailhead', campId: null, summary: '' },
  ],
  camps: [{ id: 'lake', name: 'Lake', kind: 'zone', coord: [0, 0], elevFt: 9000, rules: '' }],
  water: [
    { id: 'a', name: 'Creek A', kind: 'creek', coord: [0, 0], reliability: 'reliable' },
    { id: 'b', name: 'Creek B', kind: 'creek', coord: [0, 0], reliability: 'seasonal' },
    { id: 'lake-w', name: 'The lake', kind: 'lake', coord: [0, 0], reliability: 'reliable' },
  ],
  hazards: [],
  sources: [{ label: 'x', url: 'https://example.com' }],
}

const route: BackpackRouteT = {
  route: 'out-and-back',
  source: 'test',
  verified: { distance: 'match', gain: 'match' },
  line: '',
  profile: [
    [0, 8000],
    [10, 8000],
  ],
  stats: { mi: 10, gainFt: 1000, lossFt: 1000, minFt: 8000, maxFt: 9000, highPointMi: 5, maxGradePct: 10 },
  days: [
    { startMi: 0, endMi: 5, mi: 5, gainFt: 1000, lossFt: 0 },
    { startMi: 5, endMi: 10, mi: 5, gainFt: 0, lossFt: 1000 },
  ],
  markers: { lake: { mi: 5, offM: 40 }, a: { mi: 2, offM: 10 }, b: { mi: 4, offM: 10 }, 'lake-w': { mi: 5, offM: 20 } },
  sideTrips: {},
}

describe('waterPasses', () => {
  it('passes every source twice on an out-and-back, the turnaround once', () => {
    expect(waterPasses(trip, route).map((p) => [p.water.id, p.mi, p.returnPass])).toEqual([
      ['a', 2, false],
      ['b', 4, false],
      ['lake-w', 5, false],
      ['b', 6, true],
      ['a', 8, true],
    ])
  })
})

describe('planDays', () => {
  it('gives each day the water up to its camp, and the camp the night', () => {
    const [d1, d2] = planDays(trip, route)
    expect(d1.entries.map((e) => (e.kind === 'water' ? e.water.id : `camp:${e.camp.id}`))).toEqual(['a', 'b', 'lake-w', 'camp:lake'])
    // The lake belongs to the evening, not the next morning.
    expect(d2.entries.map((e) => (e.kind === 'water' ? `${e.water.id}@${e.mi}` : 'camp'))).toEqual(['b@6', 'a@8'])
  })
})

describe('longestDryStretch', () => {
  it('counts only reliable water, the trailhead and the end', () => {
    // Reliable marks: 0 (start), 2, 5, 8, 10 (end): the longest gap is 3 mi.
    expect(longestDryStretch(trip, route)).toMatchObject({ mi: 3, fromMi: 2, toMi: 5 })
  })
})

describe('the catalog', () => {
  it('every trip has a verified route line', () => {
    // A trip the generator failed ships without a line (the page says so);
    // this test keeps that from happening unnoticed.
    expect(BACKPACK_TRIPS.filter((t) => !ROUTE_SUMMARY[t.id]).map((t) => t.id)).toEqual([])
  })
  it('every day split matches the trip’s own days', () => {
    for (const t of BACKPACK_TRIPS) {
      const s = ROUTE_SUMMARY[t.id]
      if (s) expect(s.dayMi.length, t.id).toBe(t.days.length)
    }
  })
})
