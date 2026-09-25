// The drive check, stated as the cases that prompted it: a published program
// in one area followed too closely by one in another is reported with the
// drive it needs; a day that leaves the time is not; a Valley hop is judged
// by the short-hop estimate, not the park table; overlaps are their own kind.
import { describe, expect, it } from 'vitest'
import { dayLegs, shortLegsByTarget } from './driveCheck'
import { regionForItem } from './driveTimes'
import { slotDay } from './slotting'
import { programItemId, stopItemId } from './schema'
import type { TripItemT, TripProgramItemT } from './schema'

const DAY = '2026-10-14'

// Meeting points, [lng, lat], as workers/src/data/manual-programs.ts carries them.
const CURRY_VILLAGE: [number, number] = [-119.5688, 37.7395]
const LEMBERT_DOME: [number, number] = [-119.3589, 37.8772]
const GLACIER_POINT: [number, number] = [-119.5731, 37.7283]

const program = (id: string, timeStart: string, timeEnd: string, coord: [number, number]): TripProgramItemT => ({
  type: 'program',
  itemId: programItemId(id),
  programId: id,
  snapshot: { id, source: 'manual', category: 'ranger', title: `Program ${id}`, description: '', date: DAY, timeStart, timeEnd, coord },
})
const stop = (stopId: string, startTime?: string): TripItemT => ({
  type: 'stop',
  itemId: stopItemId(stopId, DAY),
  stopId,
  day: DAY,
  ...(startTime ? { startTime } : {}),
})

describe('drive check', () => {
  it('flags a 12:30 finish in the Valley before a 1:00 start in Tuolumne', () => {
    const vernal = program('vernal', '08:30', '12:30', CURRY_VILLAGE)
    const river = program('river', '13:00', '15:00', LEMBERT_DOME)
    expect(regionForItem(vernal)).toBe('valley')
    expect(regionForItem(river)).toBe('tuolumne')
    const short = shortLegsByTarget(slotDay(DAY, [vernal, river]))
    const leg = short.get(river.itemId)
    expect(leg).toBeDefined()
    expect(leg!.gapMin).toBe(30)
    // The park's table puts Tuolumne Meadows well over an hour from the Valley.
    expect(leg!.needMin).toBeGreaterThanOrEqual(80)
  })

  it('passes the same pair when the day leaves the drive', () => {
    const vernal = program('vernal', '08:30', '12:30', CURRY_VILLAGE)
    const later = program('later', '15:00', '16:00', LEMBERT_DOME)
    expect(shortLegsByTarget(slotDay(DAY, [vernal, later])).size).toBe(0)
  })

  it('flags Glacier Point to Tuolumne an hour apart: the road goes through the Valley', () => {
    const rim = program('rim', '12:00', '13:00', GLACIER_POINT)
    const meadow = program('meadow', '14:00', '15:00', LEMBERT_DOME)
    const leg = shortLegsByTarget(slotDay(DAY, [rim, meadow])).get(meadow.itemId)
    expect(leg).toBeDefined()
    expect(leg!.needMin).toBeGreaterThan(120)
  })

  it('reports overlapping blocks as overlaps, not as short drives', () => {
    const a = program('a', '10:00', '11:00', CURRY_VILLAGE)
    const b = program('b', '10:30', '11:30', LEMBERT_DOME)
    const legs = dayLegs(slotDay(DAY, [a, b]))
    expect(legs[0].kind).toBe('overlap')
    expect(shortLegsByTarget(slotDay(DAY, [a, b])).size).toBe(0)
  })

  it('does not judge a leg it cannot place', () => {
    const a = program('a', '10:00', '11:00', CURRY_VILLAGE)
    const note: TripItemT = { type: 'custom', itemId: 'custom:x', title: 'Check in', day: DAY, startTime: '11:00' }
    expect(dayLegs(slotDay(DAY, [a, note]))).toHaveLength(0)
  })

  it('leaves a slotted Valley morning alone: slotting already paid for its hops', () => {
    const legs = dayLegs(slotDay(DAY, [stop('tunnel-view'), stop('bridalveil-fall'), stop('mirror-lake')]))
    expect(legs.length).toBeGreaterThan(0)
    expect(legs.every((l) => l.kind === 'ok')).toBe(true)
  })

  it('slotting leaves the drive before a published program, so a morning stop cannot strand it', () => {
    // Tunnel View at 8:00 used to land in the half hour before an 8:30
    // program at Curry Village, with no time to drive there.
    const vernal = program('vernal', '08:30', '12:30', CURRY_VILLAGE)
    const slots = slotDay(DAY, [stop('tunnel-view'), vernal])
    expect(shortLegsByTarget(slots).size).toBe(0)
    const tv = slots.find((s) => s.item.itemId === stopItemId('tunnel-view', DAY))!
    expect(tv.startMin).toBeGreaterThanOrEqual(12 * 60 + 30)
  })
})
