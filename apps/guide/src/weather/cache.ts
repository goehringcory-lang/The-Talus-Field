// =============================================================================
// Offline cache for the weather feed. Same strategy as programs/cache.ts:
// payload in the unversioned tfg-data Cache API bucket (survives deploys),
// bookkeeping stamp in localStorage, cached copy treated as suspect until
// matched. One canonical synthetic key: a re-sync replaces the old forecast.
// =============================================================================

import { API_BASE } from '../lib/api'
import { WeatherResponse, type WeatherResponseT } from './schema'

const CACHE_NAME = 'tfg-data'
const WEATHER_KEY = `${API_BASE}/api/weather/current`
const META_KEY = 'tfg.weather.meta'

export type WeatherMeta = {
  fetchedAt: string | null // when the Worker last fetched NWS; null = unknown
  cachedAt: string         // when this device saved the forecast
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

export function readWeatherMeta(): WeatherMeta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'fetchedAt' in parsed && 'cachedAt' in parsed) {
      return parsed as WeatherMeta
    }
  } catch {
    /* unreadable storage counts as no cached forecast */
  }
  return null
}

export async function writeCachedWeather(payload: WeatherResponseT): Promise<void> {
  if (!cachesAvailable()) return
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    WEATHER_KEY,
    new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  const meta: WeatherMeta = {
    fetchedAt: payload.fetchedAt,
    cachedAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* non-fatal: cache contents still exist, only the stamp is lost */
  }
}

export async function readCachedWeather(): Promise<WeatherResponseT | null> {
  if (!cachesAvailable()) return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(WEATHER_KEY)
    if (!hit) return null
    const parsed = WeatherResponse.safeParse(await hit.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
