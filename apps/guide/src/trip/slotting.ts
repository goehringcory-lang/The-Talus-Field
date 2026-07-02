// =============================================================================
// Greedy day slotting, v1 and deliberately dumb:
//   - programs are fixed blocks at their published times
//   - user-timed stops are fixed blocks at their chosen times
//   - untimed stops fill the day from 08:00 in region `order`, taking
//     timeBudgetMin (default 60) plus a 30-minute travel buffer, flowing
//     around the fixed blocks
// Used by both the /trip agenda and the ICS export so the calendar matches
// the screen.
// =============================================================================

import { getStopById } from '../content'
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
const TRAVEL_BUFFER = 30
const DEFAULT_STOP_MIN = 60
const DEFAULT_PROGRAM_MIN = 60

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
      fixed.push({
        item,
        day,
        startMin: start,
        durationMin:
          start !== null && end !== null && end > start ? end - start : DEFAULT_PROGRAM_MIN,
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

  // Greedy fill: suggested reading order within the region.
  floating.sort((a, b) => stopOrder(a) - stopOrder(b))
  const placed: SlottedItem[] = []
  let cursor = DAY_START
  for (const item of floating) {
    const duration =
      (item.type === 'stop'
        ? item.durationMin ?? getStopById(item.stopId)?.timeBudgetMin
        : undefined) ?? DEFAULT_STOP_MIN

    // Advance past any fixed block that overlaps the candidate slot.
    let start = cursor
    for (const b of blocks) {
      const bStart = b.startMin ?? 0
      const bEnd = bStart + b.durationMin
      if (start < bEnd && start + duration > bStart) start = bEnd + TRAVEL_BUFFER
    }
    if (start + duration > DAY_END) {
      placed.push({ item, day, startMin: null, durationMin: duration, fixed: false })
      continue
    }
    placed.push({ item, day, startMin: start, durationMin: duration, fixed: false })
    cursor = start + duration + TRAVEL_BUFFER
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
