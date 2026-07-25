// =============================================================================
// GET /api/waits
//
// Live entrance waits for the Field Guide PWA. Deliberately UNAUTHENTICATED,
// same reasoning as /api/weather: public data, and a buyer standing in the
// entrance line should not hit a token-expiry failure mode.
//
// Mounted under /api/* on purpose (unlike /widget, which needs CORS *): the
// origin-echo CORS middleware answers the PWA's preflight. Never an error:
// a dead feed serves { fetchedAt: null, waits: [] } and the client renders
// nothing, per the lib/waits.ts contract.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getWaits, waitsDisplay } from '../lib/waits'

export const waits = new Hono<{ Bindings: Env }>()

waits.get('/', async (c) => {
  const record = await getWaits(c.env).catch(() => null)
  return c.json(
    { fetchedAt: record?.fetchedAt ?? null, waits: waitsDisplay(record) },
    200,
    // Matches the KV freshness window; user-visible staleness is governed by
    // fetchedAt on the client, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=300' },
  )
})
