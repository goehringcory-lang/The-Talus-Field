// =============================================================================
// The synced document: everything a buyer would be annoyed to lose when they
// pick up the other device. The Worker stores this opaquely (see
// workers/src/routes/trip.ts) — this file is the only definition of the shape,
// and it is re-validated on every pull, because a document written by a newer
// build is exactly the case that must not corrupt this one.
//
// Salvage over rejection, same principle as the stored plan: a document whose
// plan fails to parse still carries usable favorites, visited stops, and
// notes, and dropping all four because one went bad would be the worse trade.
// =============================================================================

import { z } from 'zod'
import { TripPlan } from '../trip/schema'

export const SyncDoc = z.object({
  version: z.literal(1),
  // The merge key. Whole-document last-write-wins: the newer stamp replaces
  // the older document entirely.
  updatedAt: z.string(),
  plan: TripPlan.nullable(),
  favorites: z.array(z.string()),
  visited: z.array(z.string()),
  notes: z.record(z.string(), z.string()),
})
export type SyncDocT = z.infer<typeof SyncDoc>

/**
 * Parse a pulled document, salvaging what survives. Returns null only when the
 * envelope itself is unusable (no timestamp to merge on, so no way to know
 * whether it is newer than what this device holds).
 */
export function parseSyncDoc(data: unknown): SyncDocT | null {
  const strict = SyncDoc.safeParse(data)
  if (strict.success) return strict.data

  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  if (typeof raw.updatedAt !== 'string' || Number.isNaN(Date.parse(raw.updatedAt))) return null

  const salvaged = SyncDoc.safeParse({
    version: 1,
    updatedAt: raw.updatedAt,
    plan: TripPlan.safeParse(raw.plan).success ? raw.plan : null,
    favorites: Array.isArray(raw.favorites)
      ? raw.favorites.filter((x): x is string => typeof x === 'string')
      : [],
    visited: Array.isArray(raw.visited)
      ? raw.visited.filter((x): x is string => typeof x === 'string')
      : [],
    notes:
      raw.notes && typeof raw.notes === 'object' && !Array.isArray(raw.notes)
        ? Object.fromEntries(
            Object.entries(raw.notes).filter(([, v]) => typeof v === 'string'),
          )
        : {},
  })
  return salvaged.success ? salvaged.data : null
}
