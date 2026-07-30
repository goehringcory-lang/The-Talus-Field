// =============================================================================
// Alerts — the PWA's parse boundary for /api/alerts.
//
// KEEP IN SYNC with workers/src/lib/alerts.ts. The repo deliberately has no
// shared package; the schema is small enough to mirror by hand. Road ids
// match the seasonal roads readers actually plan around, not every road in
// the park.
// =============================================================================

import { z } from 'zod'

export const AlertCategory = z.enum(['closure', 'danger', 'caution', 'information'])
export type AlertCategoryT = z.infer<typeof AlertCategory>

export const AlertItem = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: AlertCategory,
  url: z.string().nullable(),
})
export type AlertItemT = z.infer<typeof AlertItem>

export const RoadId = z.enum(['tioga', 'glacier-point', 'mariposa-grove', 'hetch-hetchy'])
export type RoadIdT = z.infer<typeof RoadId>

export const RoadStatus = z.object({
  id: RoadId,
  label: z.string(),
  status: z.enum(['open', 'closed', 'unknown']),
  // The sentence the status was derived from, so the client can show its work.
  detail: z.string().nullable(),
})
export type RoadStatusT = z.infer<typeof RoadStatus>

export const AlertsResponse = z.object({
  fetchedAt: z.string().nullable(),
  alerts: z.array(AlertItem),
  roads: z.array(RoadStatus),
  // Chain-control notice text when an active alert mentions chains, else null.
  chains: z.string().nullable(),
})
export type AlertsResponseT = z.infer<typeof AlertsResponse>
