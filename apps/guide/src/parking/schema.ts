// =============================================================================
// KEEP IN SYNC with workers/src/routes/parking.ts (shape assembled by
// lib/parking.ts). Hand-mirrored on purpose, same policy as waits/schema.ts:
// no shared package between the Worker and PWA.
// =============================================================================

import { z } from 'zod'

// 'unknown' is the honest value for a lot the park has said nothing about
// today (most lots, most days). Every surface hides it; a blank is never
// "open".
export const LotStatus = z.enum(['open', 'full', 'closed', 'unknown'])
export type LotStatusT = z.infer<typeof LotStatus>

export const ParkingLot = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().nullable(),
  ada: z.number().nullable(),
  status: LotStatus,
  // The park's own word (Light, Moderate, Full), carried so a reading can
  // show its source; null when there was none.
  statusText: z.string().nullable(),
  updatedAt: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
})
export type ParkingLotT = z.infer<typeof ParkingLot>

export const ParkingResponse = z.object({
  fetchedAt: z.string().nullable(),
  lots: z.array(ParkingLot),
})
export type ParkingResponseT = z.infer<typeof ParkingResponse>
