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

// Landmarks: the major-destination pin layer + GPS directory. Reference
// coordinates only — no editorial body, so the curated stops stay the star.
export const LandmarkAreaEnum = z.enum([
  'valley',
  'south',        // Glacier Point Road corridor
  'wawona',
  'tioga',        // Tioga Road / Tuolumne corridor
  'hetch-hetchy',
  'entrances',
  'practical',    // gas, gateway towns
])
export type LandmarkArea = z.infer<typeof LandmarkAreaEnum>

export const LandmarkKindEnum = z.enum([...StopKindEnum.options, 'entrance', 'facility'])
export type LandmarkKind = z.infer<typeof LandmarkKindEnum>

export const Landmark = z.object({
  id: z.string(),
  name: z.string(),
  area: LandmarkAreaEnum,
  kind: LandmarkKindEnum,
  coord: z
    .tuple([z.number(), z.number()])      // [lng, lat] — required, unlike Stop
    .refine(
      ([lng, lat]) => lng >= -120.8 && lng <= -118.2 && lat >= 36.8 && lat <= 38.8,
      { message: 'coord outside the Yosemite bbox — swapped lat/lng?' },
    ),
  pointsAt: z.enum(['parking', 'feature']), // what the pin marks for navigation
  note: z.string(),                          // one line, incl. pairing ("Park at the dam; 2.5 mi hike")
  seasonal: z.string().optional(),           // "Glacier Point Road closed ~Nov–late May"
  verified: z.boolean(),                     // false = TODO-grade coordinate
})

export type LandmarkT = z.infer<typeof Landmark>

export const Landmarks = z.array(Landmark)

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
