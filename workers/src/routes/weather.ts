// =============================================================================
// GET /api/weather
//
// NWS forecasts for the four guide regions. Deliberately UNAUTHENTICATED,
// same reasoning as /api/programs: it aggregates public forecast data, and
// skipping JWT verification removes the "your token expired while you were
// standing in the park" failure mode for a feature that needs live data.
//
// Freshness model: KV holds the merged record; if it's missing or older than
// 2h the route refreshes inline (weather ages faster than program listings,
// so freshness is owned by this on-demand path; the daily cron only
// guarantees a floor so a cold deploy has data).
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import { readWeatherRecord, refreshWeather } from '../lib/weather'

const STALE_AFTER_MS = 2 * 60 * 60 * 1000

export const weather = new Hono<{ Bindings: Env }>()

weather.get('/', async (c) => {
  let record = await readWeatherRecord(c.env)
  const stale = !record || Date.now() - Date.parse(record.fetchedAt) > STALE_AFTER_MS

  if (stale) {
    try {
      record = (await refreshWeather(c.env)) ?? record
    } catch (err) {
      // Serve whatever KV had; its honest fetchedAt tells the PWA how old it is.
      console.error('weather: refresh failed, serving KV as-is', err)
    }
  }

  return c.json(
    {
      fetchedAt: record?.fetchedAt ?? null,
      spots: record?.spots ?? [],
    },
    200,
    // Edge/browser reuse for 15 minutes; user-visible freshness is governed
    // by fetchedAt, not the HTTP cache.
    { 'Cache-Control': 'public, max-age=900' },
  )
})
