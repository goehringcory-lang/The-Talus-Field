// =============================================================================
// Greedy day slotting:
//   - programs are fixed blocks at their published times
//   - user-timed stops are fixed blocks at their chosen times
//   - stops carrying a `dayPart` are anchored to the clock (see below)
//   - everything else fills the day from 08:00 in plan order (the order they
//     were added; preset seeding adds them in drive order), taking
//     timeBudgetMin (default 60) plus a travel buffer estimated from the
//     driving distance to the previous stop, flowing around the fixed blocks
// Used by both the /trip agenda and the ICS export so the calendar matches
// the screen.
//
// Anchoring exists because plan order alone produced plans that contradicted
// the stops' own copy. A meal is a floating block like any other, so a couple
// of seeded ranger programs pushing the morning along would land "Lunch at
// Curry Village" at 5 p.m.; the same push sent "Sentinel Bridge, the last
// hour" to mid-morning, or off the end of the day entirely. A stop whose
// content/schema.ts `dayPart` says the clock is a fact now gets its time from
// the clock instead of from its neighbours, and the rest of the day flows
// around it the way it already flowed around programs.
// =============================================================================

import { getHikeById, getStopById } from '../content'
import { sunTimes } from '../sun/solar'
import { haversineMiles } from '../utils/geo'
import type { TripItemT } from './schema'

export type SlottedItem = {
  item: TripItemT
  day: string
  startMin: number | null   // minutes from midnight; null = couldn't place (day overflow)
  durationMin: number
  fixed: boolean             // published program time or user-set time
}

const DAY_START = 8 * 60
const DAY_END = 21 * 60
// Fallback buffer when either side has no coordinate.
const TRAVEL_BUFFER = 30
const DEFAULT_STOP_MIN = 60
const DEFAULT_PROGRAM_MIN = 60

// Park driving heuristic. Yosemite roads average out well under highway
// speed: curves, 25-35 mph limits, pullout traffic. 22 mph plus a flat
// park-and-walk allowance keeps estimates honest without routing data —
// the map's own copy says it does not calculate driving routes.
const PARK_MPH = 22
const PARK_AND_WALK_MIN = 10
// Great-circle distance is not road distance, and the gap is worst exactly
// where the presets drive: Mariposa Grove to Washburn Point is 15 straight
// miles and ~35 by road, because everything between the south end and the
// rim routes through Chinquapin. 1.35 is the low end of that spread, which
// leaves short valley legs almost untouched (a 14-minute hop becomes 15)
// while pulling the mountain legs back toward reality.
const ROAD_FACTOR = 1.35
// Ceiling on a single buffer. The old 75 sat below the park's real worst
// legs — Glacier Point to Mariposa Grove is about 75 minutes on its own, and
// Tuolumne or Hetch Hetchy to the Valley is longer — so it was silently
// erasing driving from any day that crossed the park.
const MAX_BUFFER = 120

// Meals anchor to the lunch block. A trip board that says "Lunch" has to mean
// it; if the day genuinely cannot spare noon, the surrounding stops move, not
// the meal.
const MIDDAY_ANCHOR = 12 * 60
// A sunset stop should still be there when the light goes, and the copy on
// these stops says to stay past it ("gold to pink to grey"), so the block is
// timed to end half an hour after sunset rather than to start at it. Sunset
// comes from sun/solar.ts, so the anchor tracks the real park calendar (a
// 4:42 p.m. sunset at the winter solstice, 8:23 at the summer one) with no
// table to maintain.
const EVENING_TAIL_MIN = 30
// Fallback when the day string is not a real date: sun/solar.ts returns null
// and there is nothing to compute against.
const FALLBACK_SUNSET = 19 * 60

/** Coordinate of a trip item, when its stop, hike, or program carries one.
 *  Custom items have none by design: they take the flat travel buffer. */
export function itemCoord(item: TripItemT): [number, number] | undefined {
  if (item.type === 'stop') return getStopById(item.stopId)?.coord
  if (item.type === 'hike') return getHikeById(item.hikeId)?.coord
  if (item.type === 'program') return item.snapshot.coord ?? undefined
  return undefined
}

/** Slotting buffer between consecutive coordinates: drive + park-and-walk. */
function travelBufferMin(from?: [number, number], to?: [number, number]): number {
  if (!from || !to) return TRAVEL_BUFFER
  const miles = haversineMiles(from, to) * ROAD_FACTOR
  const min = Math.round((miles / PARK_MPH) * 60) + PARK_AND_WALK_MIN
  return Math.min(MAX_BUFFER, Math.max(10, min))
}

/**
 * Display estimate between two items, for the /trip transit rows. Reuses
 * travelBufferMin so the on-screen number matches what actually placed the
 * items (drive time plus a park-and-walk allowance) instead of a bare drive
 * estimate that would silently run ~10 minutes short of the real gap; null
 * when either side has no coordinate, 0 when they share a parking area.
 */
export function driveMinutesBetween(a: TripItemT, b: TripItemT): number | null {
  const ca = itemCoord(a)
  const cb = itemCoord(b)
  if (!ca || !cb) return null
  if (haversineMiles(ca, cb) < 0.15) return 0
  return Math.round(travelBufferMin(ca, cb) / 5) * 5
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function toHhmm(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function itemDay(item: TripItemT): string {
  return item.type === 'program' ? item.snapshot.date : item.day
}

/** Planning duration for a stop or hike item (programs derive from times). */
function floatingDuration(item: TripItemT): number {
  if (item.type === 'stop') {
    return item.durationMin ?? getStopById(item.stopId)?.timeBudgetMin ?? DEFAULT_STOP_MIN
  }
  if (item.type === 'hike') {
    return item.durationMin ?? getHikeById(item.hikeId)?.durationMin ?? DEFAULT_STOP_MIN
  }
  if (item.type === 'custom') {
    return item.durationMin ?? DEFAULT_STOP_MIN
  }
  return DEFAULT_STOP_MIN
}

/** The `dayPart` a stop declares, or null for the ordinary floating items —
 *  which is nearly everything. Programs, hikes, and custom entries never
 *  anchor: a program already has a published time, and a hike or a note the
 *  buyer wrote makes no content claim about the clock.
 *
 *  The three parts behave differently on purpose. 'midday' and 'sunset' are
 *  reserved blocks laid down before the day is filled: a meal has to interrupt
 *  the day (that is what stops two ranger programs from walking lunch to
 *  5 p.m.) and a sunset viewpoint is what the day is built toward, so whatever
 *  no longer fits around it should be what gives way. 'evening' is only a
 *  floor, placed after everything else — reserving a dinner too would let a
 *  December meal, anchored to a 4:42 p.m. sunset, sit down in front of the
 *  five-hour walk to Wapama Falls and push the hike off the day. */
function dayPartOf(item: TripItemT): 'midday' | 'sunset' | 'evening' | null {
  if (item.type !== 'stop') return null
  return getStopById(item.stopId)?.dayPart ?? null
}

/** Start time that puts a block across the end of the day's light: the copy on
 *  these stops says to stay past sunset, so the block ends after it rather
 *  than starting at it. Clamped into the 08:00-21:00 day. */
function sunAnchorMin(day: string, duration: number): number {
  const sunsetMin = sunTimes(day)?.sunsetMin ?? FALLBACK_SUNSET
  return Math.max(DAY_START, Math.min(sunsetMin + EVENING_TAIL_MIN - duration, DAY_END - duration))
}

/** Slot every item of a single day. */
export function slotDay(day: string, items: TripItemT[]): SlottedItem[] {
  const fixed: SlottedItem[] = []
  const floating: TripItemT[] = []

  for (const item of items) {
    if (item.type === 'program') {
      const start = item.snapshot.timeStart ? toMinutes(item.snapshot.timeStart) : null
      const end = item.snapshot.timeEnd ? toMinutes(item.snapshot.timeEnd) : null
      // An end at or before the start means the program runs past midnight
      // (a 22:00–00:30 star party); the ICS layer already rolls DTEND's date
      // forward, so give it the real duration instead of the 60-min default.
      const duration =
        start !== null && end !== null && end !== start
          ? (end > start ? end : end + 1440) - start
          : DEFAULT_PROGRAM_MIN
      fixed.push({
        item,
        day,
        startMin: start,
        durationMin: duration,
        fixed: true,
      })
    } else if (item.startTime) {
      fixed.push({
        item,
        day,
        startMin: toMinutes(item.startTime),
        durationMin: floatingDuration(item),
        fixed: true,
      })
    } else {
      floating.push(item)
    }
  }

  // Fixed blocks with a time, ordered; all-day/no-time programs sort first.
  const blocks = fixed
    .filter((f) => f.startMin !== null)
    .sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))

  // Split the floating items three ways: the reserved blocks (meals and
  // sunset stops) that go down before the day is filled, the evening stops
  // that wait until after it, and everything else. Anchored items keep
  // `fixed: false` throughout — the buyer can still drag one, and dragging
  // pins it as a user time like any other block.
  const anchored: SlottedItem[] = []
  const evening: TripItemT[] = []
  const floatingFree: TripItemT[] = []
  for (const item of floating) {
    const part = dayPartOf(item)
    if (part === 'evening') {
      evening.push(item)
      continue
    }
    if (part === null) {
      floatingFree.push(item)
      continue
    }
    const duration = floatingDuration(item)
    anchored.push({
      item,
      day,
      // A day is 08:00-21:00; an over-long meal must not run past the end.
      startMin:
        part === 'midday'
          ? Math.max(DAY_START, Math.min(MIDDAY_ANCHOR, DAY_END - duration))
          : sunAnchorMin(day, duration),
      durationMin: duration,
      fixed: false,
    })
  }
  // Push each reserved block past anything already standing, earliest first,
  // so a published program at 12:30 moves lunch rather than sitting on top of
  // it, and lunch and the sunset never overlap each other.
  anchored.sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
  for (const slot of anchored) {
    let start = slot.startMin ?? DAY_START
    let moved = true
    while (moved) {
      moved = false
      for (const b of blocks) {
        const bStart = b.startMin ?? 0
        const bEnd = bStart + b.durationMin
        if (start < bEnd && start + slot.durationMin > bStart) {
          start = bEnd + travelBufferMin(itemCoord(b.item), itemCoord(slot.item))
          moved = true
        }
      }
    }
    // Same overflow rule as the floating and evening loops: an anchor pushed
    // past the end of the day goes to the couldn't-place bucket, not to a
    // 9:30 p.m. lunch. It must not join `blocks` either — a null startMin
    // reads as 0 there and would wall off the morning.
    if (start + slot.durationMin > DAY_END) {
      slot.startMin = null
      continue
    }
    slot.startMin = start
    blocks.push(slot)
    blocks.sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
  }

  // Greedy fill in plan order. Region `order` is a reading sequence, not a
  // day timeline — sorting by it used to shove a midday lunch stop to the
  // evening because meals number late in the region. The plan's own order is
  // the drive order for seeded presets and the order the user added things
  // otherwise. The travel buffer between consecutive placements comes from
  // the actual distance between their coordinates, so Valley-to-Tuolumne
  // days stop pretending the drive is 30 minutes.
  const placed: SlottedItem[] = []
  let cursor = DAY_START
  let prevCoord: [number, number] | undefined
  let firstPlacement = true
  for (const item of floatingFree) {
    const duration = floatingDuration(item)
    const coord = itemCoord(item)

    let start = firstPlacement ? cursor : cursor + travelBufferMin(prevCoord, coord)
    // Advance past any fixed block that overlaps the candidate slot. Re-scan
    // after every move: a travel buffer can push the candidate into a block
    // the single pass had already cleared. Terminates because start only
    // moves forward past finitely many sorted blocks.
    let moved = true
    while (moved) {
      moved = false
      for (const b of blocks) {
        const bStart = b.startMin ?? 0
        const bEnd = bStart + b.durationMin
        if (start < bEnd && start + duration > bStart) {
          start = bEnd + travelBufferMin(itemCoord(b.item), coord)
          moved = true
        }
      }
    }
    if (start + duration > DAY_END) {
      placed.push({ item, day, startMin: null, durationMin: duration, fixed: false })
      continue
    }
    placed.push({ item, day, startMin: start, durationMin: duration, fixed: false })
    cursor = start + duration
    prevCoord = coord ?? prevCoord
    firstPlacement = false
  }

  // Evening stops close the day. They go last and take the later of their
  // sun-derived floor and wherever the day actually got to, so the light is
  // the earliest they can happen and a long day can still push them back.
  for (const item of evening) {
    const duration = floatingDuration(item)
    const coord = itemCoord(item)
    const natural = firstPlacement ? cursor : cursor + travelBufferMin(prevCoord, coord)
    let start = Math.max(sunAnchorMin(day, duration), natural)
    let moved = true
    while (moved) {
      moved = false
      for (const b of blocks) {
        const bStart = b.startMin ?? 0
        const bEnd = bStart + b.durationMin
        if (start < bEnd && start + duration > bStart) {
          start = bEnd + travelBufferMin(itemCoord(b.item), coord)
          moved = true
        }
      }
    }
    if (start + duration > DAY_END) {
      placed.push({ item, day, startMin: null, durationMin: duration, fixed: false })
      continue
    }
    placed.push({ item, day, startMin: start, durationMin: duration, fixed: false })
    cursor = start + duration
    prevCoord = coord ?? prevCoord
    firstPlacement = false
    blocks.push(placed[placed.length - 1])
    blocks.sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0))
  }

  return [...fixed, ...anchored, ...placed].sort((a, b) => (a.startMin ?? -1) - (b.startMin ?? -1))
}

/** Group a plan's items by day and slot each day. Days sorted ascending. */
export function slotPlan(items: TripItemT[]): Map<string, SlottedItem[]> {
  const byDay = new Map<string, TripItemT[]>()
  for (const item of items) {
    const day = itemDay(item)
    const bucket = byDay.get(day)
    if (bucket) bucket.push(item)
    else byDay.set(day, [item])
  }
  return new Map(
    [...byDay.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([day, dayItems]) => [day, slotDay(day, dayItems)]),
  )
}
