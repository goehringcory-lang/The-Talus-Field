// =============================================================================
// GET /api/flow
//
// Merced River instantaneous discharge at Happy Isles Bridge (USGS gauge
// 11264500), the gauge below Vernal and Nevada Falls and the closest thing to
// a live "are the falls going" reading. Deliberately UNAUTHENTICATED, same
// reasoning as /api/weather: public conditions data with no reason to gate
// it behind a token. Band thresholds (see lib/flow.ts flowBand) are
// heuristic groupings for reader-facing copy, not a hydrology claim. Never an
// error: a dead feed serves nulls and the PWA renders nothing, per the
// lib/flow.ts contract.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getFlow } from '../lib/flow'

export const flow = new Hono<{ Bindings: Env }>()

flow.get('/', async (c) => {
  const record = await getFlow(c.env).catch(() => null)
  return c.json(
    {
      fetchedAt: record?.fetchedAt ?? null,
      observedAt: record?.observedAt ?? null,
      cfs: record?.cfs ?? null,
      band: record?.band ?? null,
    },
    200,
    // Edge/browser reuse for 15 minutes; user-visible freshness is governed
    // by fetchedAt on the client, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=900' },
  )
})
