// =============================================================================
// ProgramEvent — the PWA's parse boundary for /api/programs.
//
// KEEP IN SYNC with workers/src/lib/programs.ts. The repo deliberately has no
// shared package; the schema is small enough to mirror by hand. One record
// per date occurrence, dates and times are park-local strings.
// =============================================================================

import { z } from 'zod'

export const ProgramSource = z.enum(['nps', 'conservancy', 'aramark', 'astronomy', 'manual', 'seasonal'])
export type ProgramSourceT = z.infer<typeof ProgramSource>

export const ProgramCategory = z.enum([
  'ranger',
  'junior-ranger',
  'walk',
  'talk',
  'astronomy',
  'kids',
  'tour',
  'arts',
  'other',
])
export type ProgramCategoryT = z.infer<typeof ProgramCategory>

export const ProgramEvent = z.object({
  id: z.string(),
  source: ProgramSource,
  category: ProgramCategory,
  title: z.string(),
  description: z.string().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  timeEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.string().optional(),
  coord: z.tuple([z.number(), z.number()]).optional(), // [lng, lat]
  isFree: z.boolean().optional(),
  reservationRequired: z.boolean().optional(),
  url: z.string().optional(),
})
export type ProgramEventT = z.infer<typeof ProgramEvent>

export const ProgramsResponse = z.object({
  start: z.string(),
  end: z.string(),
  syncedAt: z.string(),
  events: z.array(ProgramEvent),
  sources: z
    .object({
      nps: z.object({ fetchedAt: z.string() }).optional(),
      manual: z.object({ version: z.string() }).optional(),
    })
    .partial()
    .optional(),
})
export type ProgramsResponseT = z.infer<typeof ProgramsResponse>

export const SOURCE_LABELS: Record<ProgramSourceT, string> = {
  nps: 'National Park Service',
  conservancy: 'Yosemite Conservancy',
  aramark: 'Yosemite Hospitality',
  astronomy: 'Astronomy clubs',
  manual: 'Curated',
  seasonal: 'Seasonal almanac',
}

export const CATEGORY_LABELS: Record<ProgramCategoryT, string> = {
  ranger: 'Ranger programs',
  'junior-ranger': 'Junior Ranger',
  walk: 'Walks & hikes',
  talk: 'Talks',
  astronomy: 'Astronomy',
  kids: 'Kids & family',
  tour: 'Tours',
  arts: 'Arts & theater',
  other: 'Other',
}
