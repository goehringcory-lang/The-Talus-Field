// =============================================================================
// JUNIOR NATURALIST HUNTS — one find-it list per region, for the kid in the
// back seat. These are deliberately NOT a new state system: every item is a
// checklist item in the same shape as EssentialTopic.checklist, so it rides
// the shared tfg.checklist id→checked map and ChecklistBlock renders it
// unchanged. Ids are prefixed `hunt-<region>-` to satisfy the global-id rule
// in content/schema.ts.
//
// Two content rules. Every item must be findable by a child without leaving
// the paved or well-worn path a family is already on, which is why the items
// lean on things the guide's own stop prose already promises (a dipper at
// Happy Isles, acorn granaries on a black oak, glacial polish at Olmsted).
// And nothing asks a child to touch, collect, feed, or approach anything: the
// hunt is looking, which is also the park rule.
//
// Facts behind the items come from the guide's existing stop, hike, and
// wildlife content. Anything a child could not plausibly spot in one visit
// belongs in the wildlife guide, not here.
// =============================================================================

import { z } from 'zod'
import { RegionEnum } from './schema'

export const HuntItem = z.object({
  id: z.string().regex(/^hunt-[a-z-]+-[a-z0-9-]+$/),
  label: z.string(),
  note: z.string().optional(),
  group: z.string().optional(),
})
export type HuntItemT = z.infer<typeof HuntItem>

export const Hunt = z.object({
  region: RegionEnum,
  title: z.string(),
  intro: z.string(),
  items: z.array(HuntItem).min(4),
})
export type HuntT = z.infer<typeof Hunt>

const seed: HuntT[] = [
  /* GENERATED-HUNTS */
]

export const HUNTS: HuntT[] = z.array(Hunt).parse(seed)

// Global-uniqueness check across every hunt, because the check-off map is one
// flat namespace shared with the packing and night-before lists.
{
  const ids = new Set<string>()
  for (const hunt of HUNTS) {
    for (const item of hunt.items) {
      if (ids.has(item.id)) throw new Error(`hunts: duplicate item id '${item.id}'`)
      ids.add(item.id)
    }
  }
}

export function getHuntByRegion(region: string): HuntT | undefined {
  return HUNTS.find((h) => h.region === region)
}

export function allHuntItemIds(): string[] {
  return HUNTS.flatMap((h) => h.items.map((i) => i.id))
}
