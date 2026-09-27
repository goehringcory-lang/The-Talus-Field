// =============================================================================
// The Valley shuttle as a way to get between two trip items.
//
// A shuttle leg is three parts: walk to the nearest numbered stop, ride the
// Valleywide loop to the stop nearest the destination, walk from there. Every
// number below comes from something the guide already publishes:
//
//   - The stops and their numbers are the NPS records in content/amenities.ts,
//     numbered in route order around a one-way loop (there is no stop 13), so
//     a ride is a count of stops forward around the loop.
//   - The pace is the Valleywide loop's published round trip, "about an hour
//     and a half" over its 18 stops (content/essentials.ts, shuttle
//     mechanics): five minutes a stop.
//   - The wait is an allowance, not a timetable: the guide sends readers to
//     the current Yosemite Guide for intervals, and the map labels the figure
//     as an estimate that includes a wait.
//
// Pure: no clock, no network, so it prices the same leg the same way on the
// board, the map and the drive check.
// =============================================================================

import { AMENITIES } from '../content'
import { haversineMiles } from '../utils/geo'

/** content/essentials.ts: the Valleywide loop is "about an hour and a half round trip". */
export const VALLEY_LOOP_ROUND_TRIP_MIN = 90
/** Planning allowance for the wait at the stop; intervals are in the current Yosemite Guide. */
export const SHUTTLE_WAIT_ALLOWANCE_MIN = 10
/** Farther than this from a stop, at either end, and the shuttle is not a way to make the leg. */
export const SHUTTLE_REACH_MILES = 0.5
const WALK_MPH = 2.5
const WALK_PATH_FACTOR = 1.3

export type ShuttleStop = { id: string; number: number; name: string; coord: [number, number] }

/** The Valleywide loop's stops in route order. */
export const VALLEY_LOOP: ShuttleStop[] = AMENITIES.filter(
  (a) => a.kind === 'shuttle' && a.glyph !== undefined && /^\d+$/.test(a.glyph),
)
  .map((a) => ({ id: a.id, number: Number(a.glyph), name: a.name, coord: a.coord }))
  .sort((a, b) => a.number - b.number)

export type ShuttleLeg = {
  board: ShuttleStop
  alight: ShuttleStop
  /** Stops between boarding and alighting, in riding order, both ends included. */
  path: ShuttleStop[]
  hops: number
  walkMin: number
  rideMin: number
  waitMin: number
  totalMin: number
}

export function walkMinutes(miles: number): number {
  return Math.round(((miles * WALK_PATH_FACTOR) / WALK_MPH) * 60)
}

function nearest(coord: [number, number]): { stop: ShuttleStop; miles: number } | null {
  let best: { stop: ShuttleStop; miles: number } | null = null
  for (const stop of VALLEY_LOOP) {
    const miles = haversineMiles(coord, stop.coord)
    if (!best || miles < best.miles) best = { stop, miles }
  }
  return best
}

/** The shuttle leg between two points, or null when either end is out of reach of a stop. */
export function shuttleLeg(from: [number, number], to: [number, number]): ShuttleLeg | null {
  const a = nearest(from)
  const b = nearest(to)
  if (!a || !b || a.miles > SHUTTLE_REACH_MILES || b.miles > SHUTTLE_REACH_MILES) return null
  const n = VALLEY_LOOP.length
  const i = VALLEY_LOOP.indexOf(a.stop)
  const j = VALLEY_LOOP.indexOf(b.stop)
  const hops = (j - i + n) % n
  const path: ShuttleStop[] = []
  for (let k = 0; k <= hops; k++) path.push(VALLEY_LOOP[(i + k) % n])
  const walkMin = walkMinutes(a.miles) + walkMinutes(b.miles)
  const rideMin = Math.round((hops * VALLEY_LOOP_ROUND_TRIP_MIN) / n)
  // Same stop at both ends: nothing to ride, so nothing to wait for.
  const waitMin = hops === 0 ? 0 : SHUTTLE_WAIT_ALLOWANCE_MIN
  return { board: a.stop, alight: b.stop, path, hops, walkMin, rideMin, waitMin, totalMin: walkMin + rideMin + waitMin }
}
