// =============================================================================
// GET /api/alerts
//
// NPS park alerts plus the derived road-status summary. Deliberately
// UNAUTHENTICATED, same reasoning as /api/weather: public data, and a buyer
// checking whether Tioga is open should never hit a token failure mode.
//
// Mounted under /api/* on purpose (unlike /widget): the origin-echo CORS
// middleware answers the PWA's preflight. Never an error: a dead feed serves
// empty arrays and the client renders nothing, per the lib/alerts.ts contract.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getAlerts } from '../lib/alerts'

export const alerts = new Hono<{ Bindings: Env }>()

alerts.get('/', async (c) => {
  const record = await getAlerts(c.env).catch(() => null)
  return c.json(
    {
      fetchedAt: record?.fetchedAt ?? null,
      alerts: record?.alerts ?? [],
      roads: record?.roads ?? [],
      chains: record?.chains ?? null,
    },
    200,
    // Edge/browser reuse for 5 minutes; user-visible freshness is governed by
    // fetchedAt on the client, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=300' },
  )
})
