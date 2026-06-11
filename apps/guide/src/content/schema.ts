import { z } from 'zod'

export const RegionEnum = z.enum(['valley', 'glacier-mariposa', 'tuolumne'])
export type Region = z.infer<typeof RegionEnum>

export const StopKindEnum = z.enum([
  'viewpoint',
  'trailhead',
  'parking',
  'lodging',
  'meal',
  'drive',
])
export type StopKind = z.infer<typeof StopKindEnum>

export const Stop = z.object({
  id: z.string(),                         // "tunnel-view"
  title: z.string(),
  region: RegionEnum,
  order: z.number(),                      // sort within region
  kind: StopKindEnum,
  coord: z.tuple([z.number(), z.number()]).optional(),  // [lng, lat]
  elevationFt: z.number().optional(),
  timeBudgetMin: z.number().optional(),
  body: z.string(),                       // markdown
  photos: z
    .array(
      z.object({
        src: z.string(),                  // "/photos/tunnel-view.jpg"
        caption: z.string().optional(),
      }),
    )
    .default([]),
  swap: z.string().optional(),            // "If full, drive to Valley View"
})

export type StopT = z.infer<typeof Stop>

export const Stops = z.array(Stop)

// Secret spots are stops without a region: they live in their own locked
// section, not in the three-region geography. Same card shape otherwise.
export const SecretSpot = Stop.omit({ region: true })

export type SecretSpotT = z.infer<typeof SecretSpot>

export const SecretSpots = z.array(SecretSpot)

export const EssentialTopic = z.object({
  id: z.string(),                         // "entrance-reservations"
  title: z.string(),
  order: z.number(),                      // sort within the section
  teaser: z.string(),                     // one line under the title in the list
  body: z.string(),                       // markdown
  checklist: z
    .array(
      z.object({
        id: z.string(),                   // stable; check-off state keys on it
        label: z.string(),
        season: z.string().optional(),    // "Winter", "Summer" — omit for year-round
      }),
    )
    .optional(),
})

export type EssentialTopicT = z.infer<typeof EssentialTopic>

export const EssentialTopics = z.array(EssentialTopic)
