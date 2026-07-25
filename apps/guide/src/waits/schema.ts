// =============================================================================
// KEEP IN SYNC with workers/src/routes/waits.ts (shape assembled by
// waitsDisplay in workers/src/lib/waits.ts). Hand-mirrored on purpose, same
// policy as weather/schema.ts: no shared package between the Worker and PWA.
// =============================================================================

import { z } from 'zod'

export const EntranceWait = z.object({
  name: z.string(),
  // null = the feed marked this entrance stale or missing; render "n/a".
  minutes: z.number().nullable(),
})
export type EntranceWaitT = z.infer<typeof EntranceWait>

export const WaitsResponse = z.object({
  fetchedAt: z.string().nullable(),
  waits: z.array(EntranceWait),
})
export type WaitsResponseT = z.infer<typeof WaitsResponse>
