// The slotting rules, stated as cases. check-itineraries.ts drives this module
// over the presets across five dates; what it cannot do is say which rule a
// day depends on. These pin the rules the trip-board bullet in
// apps/guide/CLAUDE.md promises: plan order fills from 08:00, a midday stop
// is reserved at noon before the day is filled, a sunset stop is timed off the
// real sunset, an evening stop is only a floor placed last, a published
// program is a wall the rest flows around, and the travel buffer is
// distance-derived and clamped.
//
// Buffers are computed from the stops' own coordinates, so a coordinate
// re-verification can legitimately move one by a step; those assertions use
// five-minute bands, not exact minutes.
import { describe, expect, it } from 'vitest'
import { sunTimes } from '../sun/solar'
import { driveMinutesBetween, slotDay, slotPlan, toHhmm, toMinutes } from './slotting'
import { hikeItemId, programItemId, stopItemId } from './schema'
import type { TripItemT, TripProgramItemT } from './schema'

const DAY = '2026-06-21'
const DAY_START = 8 * 60
const DAY_END = 21 * 60

const stop = (stopId: string, day = DAY, extra: Partial<{ startTime: string; durationMin: number }> = {}): TripItemT => ({
  type: 'stop',
  itemId: stopItemId(stopId, day),
  stopId,
  day,
  ...extra,
})
const hike = (hikeId: string, day = DAY): TripItemT => ({ type: 'hike', itemId: hikeItemId(hikeId, day), hikeId, day })
const custom = (title: string, day = DAY, durationMin?: number): TripItemT => ({
  type: 'custom',
  itemId: `custom:${title}`,
  title,
  day,
  ...(durationMin === undefined ? {} : { durationMin }),
})
const program = (
  id: string,
  times: { timeStart?: string; timeEnd?: string },
  coord?: [number, number],
  day = DAY,
): TripProgramItemT => ({
  type: 'program',
  itemId: programItemId(id),
  programId: id,
  snapshot: {
    id,
    source: 'nps',
    category: 'ranger',
    title: `Program ${id}`,
    description: '',
    date: day,
    ...times,
    ...(coord ? { coord } : {}),
  },
})

const byId = (slots: ReturnType<typeof slotDay>, itemId: string) => {
  const s = slots.find((x) => x.item.itemId === itemId)
  if (!s) throw new Error(`no slot for ${itemId}`)
  return s
}
const near = (actual: number, expected: number, band = 5) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(band)

describe('plan-order fill', () => {
  it('starts the first stop at 08:00 and separates the next by its budget plus a drive', () => {
    const slots = slotDay(DAY, [stop('tunnel-view'), stop('glacier-point')])
    const tv = byId(slots, stopItemId('tunnel-view', DAY))
    const gp = byId(slots, stopItemId('glacier-point', DAY))
    expect(tv.startMin).toBe(DAY_START)
    expect(tv.durationMin).toBe(25)
    expect(tv.fixed).toBe(false)
    // Tunnel View to Glacier Point is priced from the park's driving table
    // (content/driveTimes.ts): Tunnel View is 15 minutes from the Valley and
    // Glacier Point 60, on one road as far as Chinquapin, so 45 of driving
    // plus the park-and-walk ten. The straight line (5.8 miles) said 31.
    near(gp.startMin!, DAY_START + 25 + 55)
    expect(gp.durationMin).toBe(75)
  })

  it('keeps the plan order, not the region reading order', () => {
    // Olmsted Point (Tuolumne) listed before Tunnel View (Valley) stays first.
    const slots = slotDay(DAY, [stop('olmsted-point'), stop('tunnel-view')])
    expect(slots[0].item.itemId).toBe(stopItemId('olmsted-point', DAY))
    expect(slots[0].startMin).toBe(DAY_START)
    // And the Valley leg after it carries the long drive, not the flat 30:
    // Olmsted Point anchors to Tenaya Lake (75 from the Valley), Tunnel View
    // to its own row (15), and the roads part at the Valley's west end (10),
    // so 75 + 15 - 20 = 70 of driving, plus the park-and-walk ten.
    near(slots[1].startMin!, DAY_START + 30 + 80)
  })

  it('sends an item that no longer fits before 21:00 to the unplaced bucket', () => {
    const late = stop('glacier-point', DAY, { startTime: '19:30' })
    const slots = slotDay(DAY, [late, stop('olmsted-point'), stop('tunnel-view', DAY, { durationMin: 12 * 60 })])
    const tv = byId(slots, stopItemId('tunnel-view', DAY))
    expect(tv.startMin).toBeNull()
    expect(tv.durationMin).toBe(12 * 60)
    // Unplaced sorts first, never wallpapering the morning as a 0 would.
    expect(slots[0].startMin).toBeNull()
  })
})

describe('the midday reservation', () => {
  it('holds lunch at noon wherever it sits in the plan', () => {
    const slots = slotDay(DAY, [stop('tunnel-view'), stop('glacier-point'), stop('curry-village-pizza')])
    const lunch = byId(slots, stopItemId('curry-village-pizza', DAY))
    expect(lunch.startMin).toBe(12 * 60)
    expect(lunch.fixed).toBe(false)
    // The day flowed around it: Glacier Point (08:56 to 10:11 or so) fits
    // before, nothing overlaps the meal.
    for (const s of slots) {
      if (s === lunch || s.startMin === null) continue
      const overlaps = s.startMin < lunch.startMin! + lunch.durationMin && s.startMin + s.durationMin > lunch.startMin!
      expect(overlaps).toBe(false)
    }
  })

  it('moves lunch past a published program standing on noon, by the drive between them', () => {
    const talk = program('noon-talk', { timeStart: '12:00', timeEnd: '13:00' }, [-119.5726, 37.7377])
    const slots = slotDay(DAY, [talk, stop('curry-village-pizza')])
    const lunch = byId(slots, stopItemId('curry-village-pizza', DAY))
    // Same pin as the program: the buffer bottoms out at the ten-minute floor.
    expect(lunch.startMin).toBe(13 * 60 + 10)
  })

  it('does not let an over-long meal run past the end of the day', () => {
    const slots = slotDay(DAY, [stop('curry-village-pizza', DAY, { durationMin: 10 * 60 })])
    const lunch = slots[0]
    expect(lunch.startMin).toBe(DAY_END - 10 * 60)
  })
})

describe('the sunset anchor', () => {
  it.each(['2026-06-21', '2026-12-21'])('ends half an hour after the real sunset on %s', (day) => {
    const sunset = sunTimes(day)!.sunsetMin
    const slots = slotDay(day, [stop('sentinel-bridge-sunset', day)])
    const s = slots[0]
    expect(s.durationMin).toBe(60)
    expect(s.startMin).toBe(Math.max(DAY_START, Math.min(sunset + 30 - 60, DAY_END - 60)))
    expect(s.startMin! + s.durationMin).toBeGreaterThan(sunset)
    expect(s.fixed).toBe(false)
  })

  it('is laid down before the free stops, which flow around it', () => {
    const day = '2026-12-21'
    const sunset = sunTimes(day)!.sunsetMin
    // Five hours at Tunnel View end at 13:00; two and a half more at Glacier
    // Point, 55 minutes up the road, would run 13:55 to 16:25, straight
    // through a 4:12 p.m. sunset block. After the block and the hour-plus
    // drive back up from the Valley floor it still fits, ending 8:52 p.m.
    const slots = slotDay(day, [
      stop('tunnel-view', day, { durationMin: 5 * 60 }),
      stop('sentinel-bridge-sunset', day),
      stop('glacier-point', day, { durationMin: 150 }),
    ])
    const sun = byId(slots, stopItemId('sentinel-bridge-sunset', day))
    expect(sun.startMin).toBe(sunset + 30 - 60)
    const gp = byId(slots, stopItemId('glacier-point', day))
    // Glacier Point gives way: it lands after the bridge (or off the day),
    // never on top of the light.
    expect(gp.startMin === null || gp.startMin >= sun.startMin! + sun.durationMin).toBe(true)
    expect(gp.startMin).not.toBeNull()
  })
})

describe('the evening floor', () => {
  it('is placed last and never before its sun-derived floor, whatever the plan order says', () => {
    const sunset = sunTimes(DAY)!.sunsetMin
    const slots = slotDay(DAY, [stop('evergreen-lodge'), stop('tunnel-view'), stop('olmsted-point')])
    const dinner = byId(slots, stopItemId('evergreen-lodge', DAY))
    const placed = slots.filter((s) => s.startMin !== null)
    expect(placed[placed.length - 1]).toBe(dinner)
    expect(dinner.startMin).toBeGreaterThanOrEqual(sunset + 30 - 75)
    // On a June day the two stops end mid-morning, so the floor is what holds.
    expect(dinner.startMin).toBe(Math.max(DAY_START, Math.min(sunset + 30 - 75, DAY_END - 75)))
  })

  it('yields to a day that runs past its floor instead of sitting in front of the walk', () => {
    const day = '2026-12-21'
    const sunset = sunTimes(day)!.sunsetMin
    const floor = Math.max(DAY_START, Math.min(sunset + 30 - 75, DAY_END - 75))
    // A five-hour block from 08:00 ends at 13:00, then a long drive; the meal
    // still waits for its floor (4:42 sunset means a 3:37 floor)...
    const long = slotDay(day, [stop('tunnel-view', day, { durationMin: 5 * 60 }), stop('evergreen-lodge', day)])
    expect(byId(long, stopItemId('evergreen-lodge', day)).startMin).toBe(floor)
    // ...and once the day genuinely runs later than the floor, it goes after.
    const longer = slotDay(day, [stop('tunnel-view', day, { durationMin: 9 * 60 }), stop('evergreen-lodge', day)])
    const dinner = byId(longer, stopItemId('evergreen-lodge', day))
    expect(dinner.startMin).toBeGreaterThan(floor)
    expect(dinner.startMin).toBeGreaterThanOrEqual(DAY_START + 9 * 60)
  })
})

describe('fixed blocks', () => {
  it('places a published program at its time and pushes the free stops past it', () => {
    const walk = program('morning-walk', { timeStart: '09:00', timeEnd: '10:30' }, [-119.6773, 37.7156])
    const slots = slotDay(DAY, [stop('tunnel-view', DAY, { durationMin: 90 }), walk])
    const w = byId(slots, programItemId('morning-walk'))
    expect(w.startMin).toBe(9 * 60)
    expect(w.durationMin).toBe(90)
    expect(w.fixed).toBe(true)
    const tv = byId(slots, stopItemId('tunnel-view', DAY))
    // 08:00 for 90 minutes would overlap 09:00; it moves to after the walk
    // plus the floor buffer (the program is pinned at the same overlook).
    expect(tv.startMin).toBe(10 * 60 + 30 + 10)
  })

  it('gives a program that runs past midnight its real duration', () => {
    const stars = program('star-party', { timeStart: '22:00', timeEnd: '00:30' })
    const s = slotDay(DAY, [stars])[0]
    expect(s.startMin).toBe(22 * 60)
    expect(s.durationMin).toBe(150)
    expect(s.fixed).toBe(true)
  })

  it('leaves an untimed program unplaced but fixed, and a user time is a wall too', () => {
    const allDay = program('exhibit', {})
    const pinned = stop('glacier-point', DAY, { startTime: '08:15' })
    const slots = slotDay(DAY, [allDay, pinned, stop('tunnel-view')])
    expect(byId(slots, programItemId('exhibit')).startMin).toBeNull()
    expect(byId(slots, programItemId('exhibit')).fixed).toBe(true)
    const gp = byId(slots, stopItemId('glacier-point', DAY))
    expect(gp.startMin).toBe(toMinutes('08:15'))
    expect(gp.fixed).toBe(true)
    // Tunnel View at 08:00 for 25 would overlap; it lands after Glacier Point
    // and the 45-minute drive down the park's table, plus the ten.
    near(byId(slots, stopItemId('tunnel-view', DAY)).startMin!, toMinutes('08:15') + 75 + 55)
  })
})

describe('travel buffers', () => {
  it('falls back to a flat 30 when a side has no coordinate', () => {
    const slots = slotDay(DAY, [stop('tunnel-view'), custom('Check in', DAY, 20)])
    const c = byId(slots, 'custom:Check in')
    expect(c.startMin).toBe(DAY_START + 25 + 30)
    expect(c.durationMin).toBe(20)
    expect(driveMinutesBetween(stop('tunnel-view'), custom('Check in'))).toBeNull()
  })

  it('caps a single drive at 120 minutes', () => {
    // A program forty straight miles east of the Valley, then Tunnel View.
    const far = program('far', { timeStart: '08:00', timeEnd: '09:00' }, [-118.9, 37.75])
    const slots = slotDay(DAY, [far, stop('tunnel-view')])
    expect(byId(slots, stopItemId('tunnel-view', DAY)).startMin).toBe(9 * 60 + 120)
  })

  it('reads two stops on one pin as no drive at all', () => {
    expect(driveMinutesBetween(stop('curry-village'), stop('curry-village-pizza'))).toBe(0)
    // And the display estimate rounds to the nearest five, matching the placement.
    expect(driveMinutesBetween(stop('tunnel-view'), stop('glacier-point'))! % 5).toBe(0)
    near(driveMinutesBetween(stop('tunnel-view'), stop('glacier-point'))!, 55)
    near(driveMinutesBetween(stop('tunnel-view'), stop('olmsted-point'))!, 80)
  })

  it('uses a hike catalog entry the way it uses a stop', () => {
    const slots = slotDay(DAY, [stop('glacier-point'), hike('sentinel-dome')])
    const h = byId(slots, hikeItemId('sentinel-dome', DAY))
    expect(h.durationMin).toBe(100)
    // Glacier Point to the Sentinel Dome lot is about a mile: the floor buffer band.
    near(h.startMin!, DAY_START + 75 + 15)
  })
})

describe('slotPlan and the clock helpers', () => {
  it('groups by day, sorted ascending, and slots each independently', () => {
    const plan = slotPlan([stop('tunnel-view', '2026-07-05'), stop('glacier-point', '2026-07-04'), program('p', { timeStart: '10:00' }, undefined, '2026-07-04')])
    expect([...plan.keys()]).toEqual(['2026-07-04', '2026-07-05'])
    expect(plan.get('2026-07-04')!.map((s) => s.item.itemId)).toEqual([stopItemId('glacier-point', '2026-07-04'), programItemId('p')])
    expect(plan.get('2026-07-05')![0].startMin).toBe(DAY_START)
  })

  it('round-trips hh:mm and wraps past midnight', () => {
    expect(toMinutes('08:05')).toBe(485)
    expect(toHhmm(485)).toBe('08:05')
    expect(toHhmm(24 * 60 + 30)).toBe('00:30')
  })
})
