// =============================================================================
// Program starting points: the park's programs for the reader's trip window
// (the /programs feed, cached for offline), grouped by where they meet, so a
// map pin says "what starts here, and when". Only programs whose feed record
// carries a meeting coordinate are placed; the rest are counted and sent to
// /programs rather than guessed onto the map (the region planner's rule).
// Pure; tested in programPoints.test.ts.
// =============================================================================

import type { ProgramEventT } from '../programs/schema'

export type ProgramPoint = {
  id: string
  coord: [number, number]
  /** The feed's location name for the meeting point, when it gives one. */
  location: string
  /** Upcoming programs here, soonest first. */
  events: ProgramEventT[]
}

// Two records a few metres apart name one meeting point (the feed rounds
// differently from the curated entries); ~20 m buckets merge them.
const key = ([lng, lat]: [number, number]) => `${lng.toFixed(4)},${lat.toFixed(4)}`

export function programPoints(events: ProgramEventT[], today: string): { points: ProgramPoint[]; unplaced: number } {
  const byKey = new Map<string, ProgramPoint>()
  let unplaced = 0
  for (const ev of events) {
    if (ev.date < today) continue
    if (!ev.coord) {
      unplaced++
      continue
    }
    const k = key(ev.coord)
    let point = byKey.get(k)
    if (!point) {
      point = { id: `program-point:${k}`, coord: ev.coord, location: ev.location ?? ev.title, events: [] }
      byKey.set(k, point)
    }
    point.events.push(ev)
  }
  const points = [...byKey.values()]
  for (const p of points) {
    p.events.sort((a, b) => `${a.date} ${a.timeStart ?? '99:99'}`.localeCompare(`${b.date} ${b.timeStart ?? '99:99'}`))
  }
  points.sort((a, b) => a.id.localeCompare(b.id))
  return { points, unplaced }
}
