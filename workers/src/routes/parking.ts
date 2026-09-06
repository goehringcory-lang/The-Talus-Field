// =============================================================================
// GET /api/parking
//
// Live parking-lot status for the Field Guide PWA and the editorial site's
// "lots and gates now" block. Deliberately UNAUTHENTICATED, same reasoning as
// /api/waits: public data, and a driver circling the Village lot should not
// hit a token-expiry failure mode.
//
// Mounted under /api/* on purpose: the origin-echo CORS middleware answers
// the PWA's preflight. Never an error: a dead feed serves
// { fetchedAt: null, lots: [] } and the client renders nothing, per the
// lib/parking.ts contract. Response shape:
//
//   { fetchedAt: string|null,
//     lots: [{ id, name, capacity, ada, status, statusText, updatedAt, lat, lng }] }
//
// where status is 'open' | 'full' | 'closed' | 'unknown' and a lot the feed
// says nothing about is 'unknown' (consumers hide it).
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getParking } from '../lib/parking'

export const parking = new Hono<{ Bindings: Env }>()

parking.get('/', async (c) => {
  const record = await getParking(c.env).catch(() => null)
  return c.json(
    { fetchedAt: record?.fetchedAt ?? null, lots: record?.lots ?? [] },
    200,
    // Matches the KV freshness window; user-visible staleness (hide past an
    // hour) is governed by fetchedAt on the client, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=300' },
  )
})
