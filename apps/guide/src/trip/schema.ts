// =============================================================================
// TripPlan — the user's day-by-day plan: stops (by id, resolved against the
// bundled content at render) and programs (denormalized snapshots, so a plan
// survives the programs cache being refreshed or evicted).
// Persisted in localStorage under tfg.trip.plan; small structured data, so
// localStorage is the right tool here (unlike the programs payload).
// =============================================================================

import { z } from 'zod'
import { ProgramEvent } from '../programs/schema'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

export const TripStopItem = z.object({
  type: z.literal('stop'),
  itemId: z.string(),                    // "stop:<stopId>:<day>"
  stopId: z.string(),
  day: z.string().regex(DATE_RE),
  startTime: z.string().regex(TIME_RE).optional(), // set by the user; unset = auto-slotted
  durationMin: z.number().optional(),    // default: stop.timeBudgetMin ?? 60
  // Calendar identity. itemId embeds the day, so moving a stop across days
  // would change a UID built from it and orphan the old event on re-import.
  // Minted once at add; optional so plans stored before it existed still parse.
  eventUid: z.string().optional(),
})
export type TripStopItemT = z.infer<typeof TripStopItem>

export const TripProgramItem = z.object({
  type: z.literal('program'),
  itemId: z.string(),                    // "program:<programId>"
  programId: z.string(),
  snapshot: ProgramEvent,
})
export type TripProgramItemT = z.infer<typeof TripProgramItem>

export const TripItem = z.discriminatedUnion('type', [TripStopItem, TripProgramItem])
export type TripItemT = z.infer<typeof TripItem>

export const TripPlan = z.object({
  version: z.literal(1),
  dates: z.object({ start: z.string().regex(DATE_RE), end: z.string().regex(DATE_RE) }),
  items: z.array(TripItem),
  updatedAt: z.string(),
})
export type TripPlanT = z.infer<typeof TripPlan>

export function stopItemId(stopId: string, day: string): string {
  return `stop:${stopId}:${day}`
}

export function programItemId(programId: string): string {
  return `program:${programId}`
}
