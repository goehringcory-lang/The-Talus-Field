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
  // the older document entirely. Stamps compare as ISO strings in planSync,
  // so one that is not a date at all would out-sort every real stamp and pin
  // this device to it for good: demand a parseable date here, the same test
  // the salvage path below applies.
  updatedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'updatedAt must be a date'),
  plan: TripPlan.nullable(),
  favorites: z.array(z.string()),
  visited: z.array(z.string()),
  notes: z.record(z.string(), z.string()),
})
export type SyncDocT = z.infer<typeof SyncDoc>

export type ParsedSyncDoc = {
  doc: SyncDocT
  /**
   * True when the strict parse failed and the document below is a repair.
   * The sync layer has to know: a salvaged document is missing whatever went
   * bad, so a device that adopts its stamp and stops there is in step with a
   * broken server copy forever (see planSync's doSync).
   */
  salvaged: boolean
  /**
   * Per field: true when the document did NOT carry that field in a shape this
   * build accepts. Almost always that means a NEWER build wrote it, not
   * bit-rot, which has two consequences and they apply to all four fields
   * equally (the plan used to be the only one that got them):
   *
   *   1. applyRemote must not write it. The repaired document below carries an
   *      empty placeholder so the envelope parses, and an empty placeholder
   *      applied over real data is a wipe: favorites, visited marks, and notes
   *      would go on this device and then, on the heal push, on every other
   *      one. Keeping what this device already holds is always the safe half
   *      of that trade.
   *   2. The heal push must not fire, for the mirror reason: pushing our
   *      version of a field we could not read would destroy the newer build's
   *      copy and re-clobber it on every pass.
   *
   * A field that is absent counts as unparseable too. Every build that has
   * ever written this document writes all four, so absence is not "the other
   * device has none" — it is a shape this build does not know.
   */
  unparseable: SalvageLoss
}

/** Which fields did not survive the parse. See ParsedSyncDoc.unparseable. */
export type SalvageLoss = {
  plan: boolean
  favorites: boolean
  visited: boolean
  notes: boolean
}

const NO_LOSS: SalvageLoss = { plan: false, favorites: false, visited: false, notes: false }

/** True when any field arrived in a shape this build rejects. */
export function anyUnparseable(loss: SalvageLoss): boolean {
  return loss.plan || loss.favorites || loss.visited || loss.notes
}

// A list of ids survives only INTACT. Dropping the entries that fail and
// keeping the rest looks tolerant and is the wipe in slow motion: a newer
// build that stores `[{ id, addedAt }]` filters down to zero strings, which
// this build would then apply as "no favorites" over a real list.
function parseIdList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  return value.every((x) => typeof x === 'string') ? (value as string[]) : null
}

function parseNotes(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const entries = Object.entries(value as Record<string, unknown>)
  return entries.every(([, v]) => typeof v === 'string')
    ? (Object.fromEntries(entries) as Record<string, string>)
    : null
}

/**
 * Parse a pulled document, salvaging what survives. Returns null only when the
 * envelope itself is unusable (no timestamp to merge on, so no way to know
 * whether it is newer than what this device holds).
 */
export function parseSyncDoc(data: unknown): ParsedSyncDoc | null {
  const strict = SyncDoc.safeParse(data)
  if (strict.success) return { doc: strict.data, salvaged: false, unparseable: NO_LOSS }

  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  if (typeof raw.updatedAt !== 'string' || Number.isNaN(Date.parse(raw.updatedAt))) return null

  // A null plan is a real value here (the schema allows it), so only a plan
  // that is present and rejected counts as a loss. The other three have no
  // such empty-but-valid form: for them, anything this build cannot read is a
  // loss, absence included.
  const planOk = TripPlan.safeParse(raw.plan).success
  const favorites = parseIdList(raw.favorites)
  const visited = parseIdList(raw.visited)
  const notes = parseNotes(raw.notes)
  const unparseable: SalvageLoss = {
    plan: !planOk && typeof raw.plan === 'object' && raw.plan !== null,
    favorites: favorites === null,
    visited: visited === null,
    notes: notes === null,
  }

  const repaired = SyncDoc.safeParse({
    version: 1,
    updatedAt: raw.updatedAt,
    plan: planOk ? raw.plan : null,
    favorites: favorites ?? [],
    visited: visited ?? [],
    notes: notes ?? {},
  })
  return repaired.success ? { doc: repaired.data, salvaged: true, unparseable } : null
}
