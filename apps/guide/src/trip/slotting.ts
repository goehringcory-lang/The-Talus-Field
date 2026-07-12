// =============================================================================
// Greedy day slotting, v1 and deliberately dumb:
//   - programs are fixed blocks at their published times
//   - user-timed stops are fixed blocks at their chosen times
//   - untimed stops fill the day from 08:00 in region `order`, taking
//     timeBudgetMin (default 60) plus a travel buffer estimated from the
//     driving distance to the previous stop, flowing around the fixed blocks
// Used by both the /trip agenda and the ICS export so the calendar matches
// the screen.
// =============================================================================

import { getStopById } from '../content'
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

/** Coordinate of a trip item, when its stop or program carries one. */
export function itemCoord(item: TripItemT): [number, number] | undefined {
  if (item.type === 'stop') return getStopById(item.stopId)?.coord
  return item.snapshot.coord ?? undefined
}

/** Slotting buffer between consecutive coordinates: drive + park-and-walk. */
function travelBufferMin(from?: [number, number], to?: [number, number]): number {
  if (!from || !to) return TRAVEL_BUFFER
  const miles = haversineMiles(from, to)
  const min = Math.round((miles / PARK_MPH) * 60) + PARK_AND_WALK_MIN
  return Math.min(75, Math.max(10, min))
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
  return item.type === 'stop' ? item.day : item.snapshot.date
}

function stopOrder(item: TripItemT): number {
  if (item.type !== 'stop') return 0
  return getStopById(item.stopId)?.order ?? 99
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
        durationMin: item.durationMin ?? getStopById(item.stopId)?.timeBudgetMin ?? DEFAULT_STOP_MIN,
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

  // Greedy fill: suggested reading order within the region. The travel
  // buffer between consecutive placements comes from the actual distance
  // between their coordinates, so Valley-to-Tuolumne days stop pretending
  // the drive is 30 minutes.
  floating.sort((a, b) => stopOrder(a) - stopOrder(b))
  const placed: SlottedItem[] = []
  let cursor = DAY_START
  let prevCoord: [number, number] | undefined
  let firstPlacement = true
  for (const item of floating) {
    const duration =
      (item.type === 'stop'
        ? item.durationMin ?? getStopById(item.stopId)?.timeBudgetMin
        : undefined) ?? DEFAULT_STOP_MIN
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

  return [...fixed, ...placed].sort((a, b) => (a.startMin ?? -1) - (b.startMin ?? -1))
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
