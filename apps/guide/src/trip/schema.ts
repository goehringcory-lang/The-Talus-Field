// =============================================================================
// TripPlan — the user's day-by-day plan: stops and hikes (by id, resolved
// against the bundled content at render) and programs (denormalized
// snapshots, so a plan survives the programs cache being refreshed or
// evicted).
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

// Hikes mirror stops exactly: resolved by id against the bundled catalog,
// day-scoped itemId, user-settable time. Kept as a distinct type so the
// agenda and ICS can render trail stats without overloading Stop.
export const TripHikeItem = z.object({
  type: z.literal('hike'),
  itemId: z.string(),                    // "hike:<hikeId>:<day>"
  hikeId: z.string(),
  day: z.string().regex(DATE_RE),
  startTime: z.string().regex(TIME_RE).optional(), // set by the user; unset = auto-slotted
  durationMin: z.number().optional(),    // default: hike.durationMin
  eventUid: z.string().optional(),       // same day-move-proof identity as TripStopItem
})
export type TripHikeItemT = z.infer<typeof TripHikeItem>

export const TripProgramItem = z.object({
  type: z.literal('program'),
  itemId: z.string(),                    // "program:<programId>"
  programId: z.string(),
  snapshot: ProgramEvent,
})
export type TripProgramItemT = z.infer<typeof TripProgramItem>

// Free-form entries: the parts of a real trip the guide doesn't model — a
// lodging check-in, a dinner reservation, a permit pickup. Title and note are
// the user's own words; no coord, so slotting uses the flat travel buffer.
export const TripCustomItem = z.object({
  type: z.literal('custom'),
  itemId: z.string(),                    // "custom:<uuid>" — day-independent, unlike stop/hike ids
  title: z.string().min(1),
  note: z.string().optional(),
  day: z.string().regex(DATE_RE),
  startTime: z.string().regex(TIME_RE).optional(), // set by the user; unset = auto-slotted
  durationMin: z.number().optional(),    // default 60
  eventUid: z.string().optional(),
})
export type TripCustomItemT = z.infer<typeof TripCustomItem>

export const TripItem = z.discriminatedUnion('type', [
  TripStopItem,
  TripHikeItem,
  TripProgramItem,
  TripCustomItem,
])
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

export function hikeItemId(hikeId: string, day: string): string {
  return `hike:${hikeId}:${day}`
}

export function programItemId(programId: string): string {
  return `program:${programId}`
}
