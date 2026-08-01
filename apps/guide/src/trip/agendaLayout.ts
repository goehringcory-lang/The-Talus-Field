// =============================================================================
// Geometry for the agenda board: where each slotted item sits on its day's
// timeline, and how tall the timeline has to be.
//
// Pure functions on top of slotting.ts output, kept out of the component so
// the lane packing (two things at the same hour sit side by side, the way a
// calendar draws them) can be reasoned about on its own.
// =============================================================================

import type { SlottedItem } from './slotting'

/** Minutes-from-midnight bounds a day's timeline is drawn between. */
export type DayWindow = { from: number; to: number }

export type Placed = {
  s: SlottedItem
  startMin: number
  endMin: number
  lane: number
  /** Lanes in this item's overlap cluster; width is 1/lanes of the track. */
  lanes: number
}

export type DayLayout = {
  placed: Placed[]
  /** Items the day couldn't place: overflow, and programs with no published time. */
  loose: SlottedItem[]
}

// The board opens on a normal park day even when the plan is empty, so an
// empty day is still a drop target with recognizable hours on it.
const DEFAULT_FROM = 7 * 60
const DEFAULT_TO = 21 * 60
// An hour of empty timeline past the first and last thing on the day. Without
// it the window ends exactly where the last block ends, and a drag has
// nowhere later to go: the drop clamps the block straight back where it was.
const HEADROOM = 60
// Past midnight: a 10 p.m. star party runs into the next calendar day and the
// block has to be drawable. The ICS layer already rolls its DTEND forward.
const LATEST = 26 * 60

/**
 * Lane-pack one day. Items are sorted by start; each takes the first lane free
 * at its start time, and a run of transitively overlapping items shares a lane
 * count so their widths line up.
 */
export function layoutDay(items: SlottedItem[]): DayLayout {
  const loose = items.filter((s) => s.startMin === null)
  const timed = items
    .filter((s) => s.startMin !== null)
    .sort((a, b) => (a.startMin ?? 0) - (b.startMin ?? 0) || b.durationMin - a.durationMin)

  const placed: Placed[] = []
  let cluster: Placed[] = []
  let clusterEnd = -1
  let laneEnds: number[] = []

  const flush = () => {
    if (cluster.length === 0) return
    const lanes = cluster.reduce((max, p) => Math.max(max, p.lane + 1), 1)
    for (const p of cluster) p.lanes = lanes
    placed.push(...cluster)
    cluster = []
    laneEnds = []
  }

  for (const s of timed) {
    const startMin = s.startMin ?? 0
    const endMin = startMin + Math.max(s.durationMin, 1)
    // A gap with nothing running ends the cluster: widths reset to full.
    if (cluster.length > 0 && startMin >= clusterEnd) flush()
    let lane = laneEnds.findIndex((end) => end <= startMin)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = endMin
    cluster.push({ s, startMin, endMin, lane, lanes: 1 })
    clusterEnd = Math.max(clusterEnd, endMin)
  }
  flush()

  return { placed, loose }
}

/** The hour range a day is drawn across: the default park day, widened to fit. */
export function dayWindowFor(placed: Placed[]): DayWindow {
  let from = DEFAULT_FROM
  let to = DEFAULT_TO
  for (const p of placed) {
    from = Math.min(from, p.startMin)
    to = Math.max(to, p.endMin)
  }
  // The floor follows the day's own earliest block rather than a fixed hour:
  // a 3 a.m. alpine start set on the block's own time field has to be drawable
  // inside the track, or it renders above it and any drag snaps it away.
  from = Math.max(0, Math.min(DEFAULT_FROM, Math.floor(from / 60) * 60 - HEADROOM))
  to = Math.min(LATEST, Math.max(DEFAULT_TO, Math.ceil(to / 60) * 60 + HEADROOM))
  if (to - from < 6 * 60) to = from + 6 * 60
  return { from, to }
}

/** Hour marks inside a window, for the gutter labels and the rules. */
export function hourMarks(win: DayWindow): number[] {
  const out: number[] = []
  for (let m = win.from; m <= win.to; m += 60) out.push(m)
  return out
}

/** Round to the nearest 5 minutes: the grain the board drags and resizes on. */
export function snapMinutes(minutes: number): number {
  return Math.round(minutes / 5) * 5
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** "9:30 a.m." for minutes that may run past midnight, house style. */
export function clockLabel(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

/** "3h 30m" / "45m" — the duration chip on a block. */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
