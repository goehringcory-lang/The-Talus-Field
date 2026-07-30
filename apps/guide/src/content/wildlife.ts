// =============================================================================
// WILDLIFE QUICK ID — "what did I see?" for the animals, birds, and trees a
// visitor actually encounters. Same content posture as stops.ts: a bundled,
// zod-validated TS seed that works offline and fails the build on a bad
// entry. Entries are identification aids, not an encyclopedia: the lookFor
// field is the one or two marks that settle it in the field, whereWhen is
// where a visitor plausibly crosses paths with it, and note is the single
// fact worth retelling at dinner. Safety text appears only where behavior
// matters (bears, lions, and the deer that injure more visitors than
// either); the full rules live in the bear-safety essentials topic, which
// /wildlife links rather than duplicates.
//
// Facts were drawn from NPS Yosemite species pages and cross-checked at
// authoring time (July 2026); anything uncertain was cut rather than hedged.
// =============================================================================

import { z } from 'zod'

export const WildlifeKind = z.enum(['mammal', 'bird', 'tree', 'other'])
export type WildlifeKindT = z.infer<typeof WildlifeKind>

export const WildlifeEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  // Scientific name, for the reader who wants to look further.
  latin: z.string(),
  kind: WildlifeKind,
  // The one or two field marks that settle the identification.
  lookFor: z.string(),
  // Where and when a visitor plausibly encounters it.
  whereWhen: z.string(),
  // One fact worth retelling.
  note: z.string(),
  // Present only where behavior around the animal matters.
  safety: z.string().optional(),
})
export type WildlifeEntryT = z.infer<typeof WildlifeEntry>

export const KIND_LABELS: Record<WildlifeKindT, string> = {
  mammal: 'Mammals',
  bird: 'Birds',
  tree: 'Trees',
  other: 'Reptiles & amphibians',
}

const seed: WildlifeEntryT[] = [
  /* GENERATED-SPECIES */
]

export const WILDLIFE: WildlifeEntryT[] = z.array(WildlifeEntry).parse(seed)

{
  const ids = new Set<string>()
  for (const entry of WILDLIFE) {
    if (ids.has(entry.id)) throw new Error(`wildlife: duplicate id '${entry.id}'`)
    ids.add(entry.id)
  }
}

export function getWildlifeByKind(kind: WildlifeKindT): WildlifeEntryT[] {
  return WILDLIFE.filter((w) => w.kind === kind)
}
