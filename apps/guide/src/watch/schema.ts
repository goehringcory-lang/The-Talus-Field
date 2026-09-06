// =============================================================================
// Campsite watches: the PWA's parse boundary for /api/watch.
//
// KEEP IN SYNC with workers/src/routes/watch.ts (watchView, targetView, and
// the detail route's availability block). The repo deliberately has no shared
// package. The stamps are nullish rather than nullable so a Worker deployed
// before or after this build still parses.
// =============================================================================

import { z } from 'zod'

export const WatchMode = z.enum(['any', 'full'])
export type WatchModeT = z.infer<typeof WatchMode>

export const WatchChannels = z.object({ push: z.boolean(), email: z.boolean() })
export type WatchChannelsT = z.infer<typeof WatchChannels>

export const Watch = z.object({
  id: z.string(),
  targetId: z.string(),
  start: z.string(),                 // first night, YYYY-MM-DD
  nights: z.number(),
  mode: WatchMode,
  party: z.number(),
  channels: WatchChannels,
  createdAt: z.string(),
  endsAt: z.string(),
  lastCheckedAt: z.string().nullish(),
  open: z.array(z.string()).optional(),   // the grid's current answer; absent from an older Worker
  lastOpen: z.array(z.string()),          // the nights the buyer has been told about
  lastError: z.string().nullish(),
  lastNotifiedAt: z.string().nullish(),
  notifyCount: z.number(),
})
export type WatchT = z.infer<typeof Watch>

export const WatchListResponse = z.object({ watches: z.array(Watch) })
export const WatchResponse = z.object({ watch: Watch })

export const Opening = z.object({
  date: z.string(),
  sites: z.array(z.object({ id: z.string(), site: z.string(), loop: z.string() })),
  qty: z.number().nullable(),        // spots left (Camp 4); null for site campgrounds
})
export type OpeningT = z.infer<typeof Opening>

export const WatchDetailResponse = z.object({
  watch: Watch,
  target: z.object({
    id: z.string(),
    name: z.string(),
    rgId: z.number(),
    model: z.enum(['site', 'person']),
    bookUrl: z.string(),
  }),
  availability: z
    .object({
      fetchedAt: z.string(),
      stale: z.boolean(),
      openings: z.array(Opening),
    })
    .nullable(),
})
export type WatchDetailT = z.infer<typeof WatchDetailResponse>

export type CreateWatchInput = {
  targetId: string
  start: string
  nights: number
  mode: WatchModeT
  party?: number
  channels?: WatchChannelsT
}

// The list, as last seen, so /watch renders offline with a stamp.
export const CachedWatches = z.object({ watches: z.array(Watch), cachedAt: z.string() })
export type CachedWatchesT = z.infer<typeof CachedWatches>
