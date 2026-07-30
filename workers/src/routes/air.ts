// =============================================================================
// GET /api/air
//
// Current AQI near Yosemite Valley from AirNow. Deliberately UNAUTHENTICATED,
// same reasoning as /api/weather: public conditions data, and a buyer
// checking whether it's a smoke day should never hit a token failure mode.
// The use case is narrow and time-sensitive — during fire season the reading
// on the morning of is the fact a trip decision hangs on, not a forecast —
// so this route never errors: a dead feed or a missing API key serves nulls
// and the PWA renders nothing, per the lib/air.ts contract.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { getAir } from '../lib/air'

export const air = new Hono<{ Bindings: Env }>()

air.get('/', async (c) => {
  const record = await getAir(c.env).catch(() => null)
  return c.json(
    {
      fetchedAt: record?.fetchedAt ?? null,
      observedAt: record?.observedAt ?? null,
      aqi: record?.aqi ?? null,
      pollutant: record?.pollutant ?? null,
      category: record?.category ?? null,
      reportingArea: record?.reportingArea ?? null,
    },
    200,
    // Edge/browser reuse for 15 minutes; user-visible freshness is governed
    // by fetchedAt on the client, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=900' },
  )
})
