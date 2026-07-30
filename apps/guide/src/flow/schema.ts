// =============================================================================
// River flow — the PWA's parse boundary for /api/flow.
//
// KEEP IN SYNC with workers/src/lib/flow.ts. The repo deliberately has no
// shared package; the schema is small enough to mirror by hand. band is a
// pre-bucketed read on cfs (cubic feet per second) so every surface renders
// the same words for the same flow instead of re-deriving thresholds.
// =============================================================================

import { z } from 'zod'

export const FlowBand = z.enum(['roaring', 'strong', 'moderate', 'trickle', 'dry'])
export type FlowBandT = z.infer<typeof FlowBand>

export const FlowResponse = z.object({
  fetchedAt: z.string().nullable(),
  observedAt: z.string().nullable(),
  cfs: z.number().nullable(),
  band: FlowBand.nullable(),
})
export type FlowResponseT = z.infer<typeof FlowResponse>
