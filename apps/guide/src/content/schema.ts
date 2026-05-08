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
