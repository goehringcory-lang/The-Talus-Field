import { z } from 'zod'
import { ProgramCategory } from '../programs/schema'

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

export const EssentialSection = z.enum(['plan', 'on-the-ground', 'safety', 'packing'])
export type EssentialSectionT = z.infer<typeof EssentialSection>

export const EssentialTopic = z.object({
  id: z.string(),                         // "entrance-reservations"
  title: z.string(),
  order: z.number(),                      // globally unique; numbered in section blocks
  section: EssentialSection,              // grouping header on the /essentials list
  teaser: z.string(),                     // one line under the title in the list
  body: z.string(),                       // markdown
  checklist: z
    .array(
      z.object({
        id: z.string(),                   // stable; check-off state keys on it —
                                          // one GLOBAL id→checked map (tfg.checklist)
                                          // shared across topics, so ids must not
                                          // collide between topics
        label: z.string(),
        note: z.string().optional(),      // small print under the label
        group: z.string().optional(),     // heading; contiguous items with the same
                                          // group render under one header
        season: z.string().optional(),    // "Winter", "Summer" — omit for year-round
      }),
    )
    .optional(),
})

export type EssentialTopicT = z.infer<typeof EssentialTopic>

export const EssentialTopics = z.array(EssentialTopic)

// Seasonal almanac: recurring natural and administrative windows (road opening
// patterns, waterfall peak, firefall) plus computable astronomy (full moons).
// Bundled with the app so the /programs agenda has an offline floor; converted
// to ProgramEvent records ('seasonal' source) when merged or added to a trip.
export const SeasonalConfidence = z.enum([
  'confirmed', // a published date or an astronomical fact
  'typical',   // a historical pattern; always labeled as such in the UI and copy
])
export type SeasonalConfidenceT = z.infer<typeof SeasonalConfidence>

export const SeasonalEvent = z
  .object({
    id: z.string(),                       // "firefall-window-2027"
    title: z.string(),
    category: ProgramCategory,            // reuses the agenda's category chips
    confidence: SeasonalConfidence,
    dateStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dateEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // inclusive; === dateStart for one-day facts
    timeStart: z.string().regex(/^\d{2}:\d{2}$/).optional(), // deadlines with a clock time
    description: z.string(),              // house voice; states the "typical" caveat in words
    location: z.string().optional(),
    coord: z.tuple([z.number(), z.number()]).optional(), // [lng, lat]
    url: z.string().optional(),           // nps.gov road status page, recreation.gov, etc.
    stopIds: z.array(z.string()).default([]), // cross-links to stops
  })
  .refine((e) => e.dateEnd >= e.dateStart, { message: 'dateEnd before dateStart' })

export type SeasonalEventT = z.infer<typeof SeasonalEvent>

export const SeasonalEvents = z.array(SeasonalEvent)
