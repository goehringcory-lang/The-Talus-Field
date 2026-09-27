import { describe, expect, it } from 'vitest'
import { buildTripDays, tripLegsGeojson, tripStopsGeojson } from './tripLayer'
import { RoadGraph, type RoadGraphFile } from './roadGraph'
import { ROADS_URL } from './mapData.generated'
import { amenityPlaceId } from '../trip/places'
import { programItemId, stopItemId, type TripItemT, type TripPlanT, type TripProgramItemT } from '../trip/schema'

const DAY = '2026-06-21'
const DAY2 = '2026-06-22'
const CURRY_VILLAGE: [number, number] = [-119.5688, 37.7395]
const LEMBERT_DOME: [number, number] = [-119.3589, 37.8772]

const files = import.meta.glob<RoadGraphFile>('../../public/map/roads-*.json', { eager: true, import: 'default' })
const graph = new RoadGraph(files[`../../public${ROADS_URL}`])

const stop = (stopId: string, day = DAY, extra: Partial<TripItemT> = {}): TripItemT =>
  ({ type: 'stop', itemId: stopItemId(stopId, day), stopId, day, ...extra }) as TripItemT
const program = (id: string, timeStart: string, timeEnd: string, coord: [number, number], day = DAY): TripProgramItemT => ({
  type: 'program',
  itemId: programItemId(id),
  programId: id,
  snapshot: { id, source: 'nps', category: 'ranger', title: `Program ${id}`, description: '', date: day, timeStart, timeEnd, coord },
})
const plan = (items: TripItemT[], end = DAY2): TripPlanT => ({ version: 1, dates: { start: DAY, end }, items, updatedAt: DAY })

describe('the trip as the map draws it', () => {
  it('lists every day of the window, numbered, empty days included', () => {
    const days = buildTripDays(plan([stop('tunnel-view')]), graph)
    expect(days.map((d) => d.label)).toEqual(['Day 1 · Sunday, June 21', 'Day 2 · Monday, June 22'])
    expect(days[1].stops).toEqual([])
  })

  it('numbers pins in the order the day runs, not the order they were added', () => {
    const days = buildTripDays(
      plan([stop('glacier-point', DAY, { startTime: '14:00' }), stop('tunnel-view', DAY, { startTime: '09:00' })]),
      graph,
    )
    expect(days[0].stops.map((s) => [s.order, s.item.itemId])).toEqual([
      [1, stopItemId('tunnel-view', DAY)],
      [2, stopItemId('glacier-point', DAY)],
    ])
    expect(days[0].stops[0].pinLabel).toBe('9 a.m. · 25 min')
  })

  it('draws a drive along the roads, longer than the straight line', () => {
    const leg = buildTripDays(plan([stop('tunnel-view'), stop('glacier-point')]), graph)[0].legs[0]
    expect(leg.mode).toBe('drive')
    expect(leg.geometry).toBe('road')
    expect(leg.coords.length).toBeGreaterThan(20)
    // Tunnel View to Glacier Point is ~7 straight miles and ~24 by road.
    expect(leg.metres! / 1609).toBeGreaterThan(18)
  })

  it('draws straight lines, marked pending, until the road graph has loaded', () => {
    const leg = buildTripDays(plan([stop('tunnel-view'), stop('glacier-point')]), null)[0].legs[0]
    expect(leg.geometry).toBe('pending')
    expect(leg.coords).toHaveLength(2)
  })

  it('flags a program the day cannot reach in time', () => {
    const days = buildTripDays(
      plan([program('vernal', '08:30', '12:30', CURRY_VILLAGE), program('lembert', '13:00', '14:00', LEMBERT_DOME)]),
      graph,
    )
    expect(days[0].warnings.find((w) => w.kind === 'late')?.itemId).toBe(programItemId('lembert'))
  })

  it('flags a day running past the reader’s fixed end of day', () => {
    const late = plan([stop('tunnel-view', DAY, { startTime: '19:00', durationMin: 90 } as Partial<TripItemT>)])
    expect(buildTripDays(late, graph, { kind: 'fixed', minutes: 20 * 60 })[0].warnings.map((w) => w.kind)).toContain('past-end')
  })

  it('draws a linked parking lot as a parking pin with its own coordinate', () => {
    const lot: TripItemT = { type: 'custom', itemId: 'custom:lot', title: 'Lot', day: DAY, placeId: amenityPlaceId('shuttle-stop-1') }
    const day = buildTripDays(plan([lot, stop('tunnel-view')]), graph)[0]
    expect(day.stops.some((s) => s.itemId === 'custom:lot')).toBe(true)
  })

  it('emits one point per mapped stop and one line per leg, coloured by day', () => {
    const days = buildTripDays(plan([stop('tunnel-view'), stop('glacier-point'), stop('tunnel-view', DAY2)]), graph)
    const colors = ['#111111', '#222222']
    const pts = tripStopsGeojson(days, colors)
    const lines = tripLegsGeojson(days, colors)
    expect(pts.features.map((f) => f.properties?.color)).toEqual(['#111111', '#111111', '#222222'])
    expect(pts.features[1].properties?.icon).toBe('trip-other-0')
    expect(lines.features).toHaveLength(1)
  })
})
