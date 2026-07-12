import { z } from 'zod'
import { ProgramCategory } from '../programs/schema'

export const RegionEnum = z.enum(['valley', 'glacier-mariposa', 'tuolumne', 'hetch-hetchy'])
export type Region = z.infer<typeof RegionEnum>

export const StopKindEnum = z.enum([
  'viewpoint',
  'trailhead',
  'parking',
  'lodging',
  'meal',
  'drive',
  'camping', // used by map amenities and secret spots, never by a core Stop
])
export type StopKind = z.infer<typeof StopKindEnum>

// Two collections share the Stop shape. 'core' is the curated region
// reading flow; 'hidden' is the lesser-known set surfaced in The Secret
// Guide (/secret-guide) and kept out of region lists and itinerary presets
// by default.
export const StopCollection = z.enum(['core', 'hidden'])
export type StopCollectionT = z.infer<typeof StopCollection>

// Categories for The Secret Guide (/secret-guide). Shared by hidden-collection
// Stops and SecretSpots; the filter tabs and category headers key on these.
export const SecretCategory = z.enum(['vistas', 'trails', 'parking', 'camping', 'after-dark'])
export type SecretCategoryT = z.infer<typeof SecretCategory>

export const Stop = z.object({
  id: z.string(),                         // "tunnel-view"
  title: z.string(),
  region: RegionEnum,
  order: z.number(),                      // sort within region; hidden stops number from 101
  kind: StopKindEnum,
  collection: StopCollection.default('core'),
  category: SecretCategory.optional(),    // required when collection is 'hidden' (enforced on Stops)
  difficulty: z.enum(['easy', 'moderate', 'strenuous']).optional(), // meta chip
  season: z.string().optional(),          // chip-length window, e.g. "April to June"
  hazard: z.string().optional(),          // 1-3 plain sentences; renders as a Caution callout
  teaser: z.string().optional(),          // 1-2 plain sentences for the map popup;
                                          // facts from body only, no markdown
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

export const Stops = z.array(Stop).superRefine((list, ctx) => {
  list.forEach((s, i) => {
    if (s.collection === 'hidden' && !s.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [i, 'category'],
        message: `hidden stop '${s.id}' needs a category`,
      })
    }
  })
})

// Secret spots are stops without a region: they live in The Secret Guide
// (/secret-guide), not the four-region geography. Same card shape otherwise.
// `category` is required; it drives the Secret Guide filter tabs.
export const SecretSpot = Stop.omit({ region: true }).extend({
  category: SecretCategory,
})

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

// Map-only amenity points: parking lots and campgrounds rendered as pins on
// /map with a Directions deeplink. Deliberately NOT Stops — no pages, no
// region lists, no search, no itinerary presets.
export const AmenityKindEnum = z.enum(['parking', 'camping'])
export type AmenityKind = z.infer<typeof AmenityKindEnum>

export const Amenity = z.object({
  id: z.string(),                         // "upper-pines-campground"
  name: z.string(),
  kind: AmenityKindEnum,                  // subset of StopKind, so pin styling is shared
  region: RegionEnum,                     // itinerary-tab filtering only
  coord: z.tuple([z.number(), z.number()]), // [lng, lat] — required, unlike Stop
  note: z.string(),                       // 1-2 plain sentences for the popup
  season: z.string().optional(),          // e.g. "Tioga Road season only"
})

export type AmenityT = z.infer<typeof Amenity>

export const Amenities = z.array(Amenity)
