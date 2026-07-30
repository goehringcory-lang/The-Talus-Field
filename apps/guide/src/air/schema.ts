// =============================================================================
// Air quality — the PWA's parse boundary for /api/air.
//
// KEEP IN SYNC with workers/src/lib/air.ts. The repo deliberately has no
// shared package; the schema is small enough to mirror by hand. The Worker
// picks the highest-AQI observation within 50 miles of the Valley, so aqi is
// the worst reading, not an average.
// =============================================================================

import { z } from 'zod'

export const AirResponse = z.object({
  fetchedAt: z.string().nullable(),
  observedAt: z.string().nullable(), // "YYYY-MM-DD HH:00", park-local, straight from AirNow
  aqi: z.number().nullable(),
  pollutant: z.string().nullable(), // AirNow ParameterName of the max-AQI observation
  category: z.string().nullable(),  // AirNow Category.Name ("Good", "Moderate", ...)
  reportingArea: z.string().nullable(),
})
export type AirResponseT = z.infer<typeof AirResponse>
