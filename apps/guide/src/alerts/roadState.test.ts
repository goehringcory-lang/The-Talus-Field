// Live beats typical, but only for today, only while fresh, and never when
// the feed says 'unknown'. A typical reading always says "usually".
import { describe, expect, it } from 'vitest'
import { roadForItem, roadReading } from './roadState'
import { HIDE_AFTER_MS } from './staleness'
import type { RoadStatusT } from './schema'
import { hikeItemId, stopItemId } from '../trip/schema'
import type { TripItemT } from '../trip/schema'

const TODAY = '2027-01-12'
const live = (status: RoadStatusT['status'], ageMs = 60_000) => ({
  roads: [{ id: 'tioga' as const, label: 'Tioga Road', status, detail: null }],
  ageMs,
})

describe('roadReading', () => {
  it('uses the live status for today while it is fresh', () => {
    const r = roadReading('tioga', TODAY, TODAY, live('open'))
    expect(r).toMatchObject({ state: 'open', basis: 'live', flag: null })
    const c = roadReading('tioga', TODAY, TODAY, live('closed'))
    expect(c).toMatchObject({ state: 'closed', basis: 'live', flag: 'Road closed today' })
  })

  it('never carries a live status to another day', () => {
    const r = roadReading('tioga', '2027-01-13', TODAY, live('open'))
    expect(r.basis).toBe('typical')
    expect(r.state).toBe('closed')
  })

  it('ignores a stale or unknown live status', () => {
    expect(roadReading('tioga', TODAY, TODAY, live('open', HIDE_AFTER_MS + 1)).basis).toBe('typical')
    expect(roadReading('tioga', TODAY, TODAY, live('unknown')).basis).toBe('typical')
  })

  it('says "usually" for a typical closure and names the reopening window', () => {
    const r = roadReading('tioga', TODAY, '2026-09-24', null)
    expect(r.flag).toBe('Road usually closed')
    expect(r.sentence).toMatch(/^Tioga Road is usually closed in January; it typically reopens between /)
  })

  it('flags an unsettled date without calling it closed', () => {
    const r = roadReading('glacier-point', '2026-11-10', '2026-09-24', null)
    expect(r.state).toBe('unsettled')
    expect(r.flag).toBe('Road may be closed')
    expect(r.sentence).toMatch(/typically closes for the season between November/)
  })
})

describe('roadForItem', () => {
  it('reads stops from the list and hikes from their season chip', () => {
    const stop: TripItemT = { type: 'stop', itemId: stopItemId('glacier-point', TODAY), stopId: 'glacier-point', day: TODAY }
    const hike: TripItemT = { type: 'hike', itemId: hikeItemId('cathedral-lakes', TODAY), hikeId: 'cathedral-lakes', day: TODAY }
    const valley: TripItemT = { type: 'stop', itemId: stopItemId('tunnel-view', TODAY), stopId: 'tunnel-view', day: TODAY }
    expect(roadForItem(stop)).toBe('glacier-point')
    expect(roadForItem(hike)).toBe('tioga')
    expect(roadForItem(valley)).toBeNull()
  })
})
