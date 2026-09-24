// The seasonal-road tables and the typical state, stated as cases. The
// dependency lists are hand-kept, so the first block holds them complete: a
// new stop, hike or Secret Guide entry in a seasonal region fails here until
// somebody decides which side of the winter gate it is on.
import { describe, expect, it } from 'vitest'
import { HIKES, SECRET_SPOTS, stops } from './index'
import {
  ROAD_EXEMPT,
  SEASONAL_ROADS,
  roadForHike,
  roadForStopId,
  roadWindows,
  typicalRoadState,
} from './roads'

describe('who depends on which road', () => {
  it('decides every stop in the two seasonal regions', () => {
    for (const s of stops) {
      if (s.region !== 'tuolumne' && s.region !== 'glacier-mariposa') continue
      const decided = roadForStopId(s.id) !== null || s.id in ROAD_EXEMPT
      expect(decided, `${s.id}: add it to ROAD_STOPS or ROAD_EXEMPT in roads.ts`).toBe(true)
    }
  })

  it('names only entries that exist, and never a Valley or Hetch Hetchy stop', () => {
    const known = new Map<string, string | null>([
      ...stops.map((s) => [s.id, s.region] as [string, string]),
      ...SECRET_SPOTS.map((s) => [s.id, null] as [string, null]),
    ])
    for (const id of [...stops, ...SECRET_SPOTS].map((s) => s.id)) {
      const road = roadForStopId(id)
      if (!road) continue
      expect(known.has(id)).toBe(true)
      const region = known.get(id)
      if (region) expect(['tuolumne', 'glacier-mariposa']).toContain(region)
    }
    const hikeIds = new Set(HIKES.map((h) => h.id))
    for (const id of Object.keys(ROAD_EXEMPT)) {
      expect(known.has(id) || hikeIds.has(id), `stale ROAD_EXEMPT entry ${id}`).toBe(true)
    }
  })

  it('reads a hike road off its own season chip, and every seasonal-region hike is decided', () => {
    for (const h of HIKES) {
      if (h.region !== 'tuolumne' && h.region !== 'glacier-mariposa') continue
      const decided = roadForHike(h) !== null || h.id in ROAD_EXEMPT
      expect(decided, `${h.id}: its season chip names no road and it is not exempt`).toBe(true)
    }
    expect(roadForHike({ season: 'Tioga Road season' })).toBe('tioga')
    expect(roadForHike({ season: 'Glacier Point Road season' })).toBe('glacier-point')
    expect(roadForHike({ season: undefined })).toBeNull()
  })

  it('agrees with a hike that starts at a stop behind the same gate', () => {
    for (const h of HIKES) {
      if (!h.stopId) continue
      const stopRoad = roadForStopId(h.stopId)
      const hikeRoad = roadForHike(h)
      if (stopRoad && hikeRoad) expect(hikeRoad, `${h.id} vs ${h.stopId}`).toBe(stopRoad)
    }
  })
})

describe('the almanac windows', () => {
  it('exist for both roads and alternate close, open, close without overlapping', () => {
    for (const road of SEASONAL_ROADS) {
      const w = roadWindows(road)
      expect(w.length, road).toBeGreaterThanOrEqual(2)
      for (let i = 1; i < w.length; i++) {
        expect(w[i].kind, `${road} window ${w[i].event.id}`).not.toBe(w[i - 1].kind)
        expect(w[i].event.dateStart > w[i - 1].event.dateEnd, `${road}: ${w[i].event.id} overlaps`).toBe(true)
      }
    }
  })
})

describe('typical state by date', () => {
  it('reads January as closed and July as open for both roads', () => {
    for (const road of SEASONAL_ROADS) {
      expect(typicalRoadState(road, '2027-01-12').state, road).toBe('closed')
      expect(typicalRoadState(road, '2027-07-15').state, road).toBe('open')
    }
  })

  it('reads a date inside an almanac window as unsettled, and names that window', () => {
    const tioga = roadWindows('tioga').find((w) => w.kind === 'open')!
    const inside = typicalRoadState('tioga', tioga.event.dateStart)
    expect(inside.state).toBe('unsettled')
    expect(inside.window?.id).toBe(tioga.event.id)
  })

  it('points a closed date at the next reopening', () => {
    const t = typicalRoadState('glacier-point', '2027-02-01')
    expect(t.state).toBe('closed')
    expect(t.window?.id).toMatch(/^glacier-point-open-\d{4}$/)
  })

  it('falls back to the month pattern past the almanac, and says so', () => {
    const t = typicalRoadState('tioga', '2031-01-15')
    expect(t.state).toBe('closed')
    expect(t.fromMonthPattern).toBe(true)
    expect(typicalRoadState('tioga', '2031-08-01').state).toBe('open')
  })
})
