// =============================================================================
// Offline cache for the air quality reading. Same strategy as weather/cache.ts:
// payload in the unversioned tfg-data Cache API bucket (survives deploys),
// bookkeeping stamp in localStorage, cached copy treated as suspect until
// matched. One canonical synthetic key: a re-sync replaces the old reading.
//
// Cached (unlike waits) but with a short hide window (air/staleness.ts):
// smoke swings on an hours scale, so a morning reading is worth holding
// through a canyon dead zone but not into the afternoon.
// =============================================================================

import { API_BASE } from '../lib/api'
import { AirResponse, type AirResponseT } from './schema'

const CACHE_NAME = 'tfg-data'
const AIR_KEY = `${API_BASE}/api/air/current`
const META_KEY = 'tfg.air.meta'

export type AirMeta = {
  fetchedAt: string | null // when the Worker last fetched AirNow; null = unknown
  cachedAt: string         // when this device saved the reading
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

export function readAirMeta(): AirMeta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'fetchedAt' in parsed && 'cachedAt' in parsed) {
      return parsed as AirMeta
    }
  } catch {
    /* unreadable storage counts as no cached reading */
  }
  return null
}

export async function writeCachedAir(payload: AirResponseT): Promise<void> {
  if (!cachesAvailable()) return
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    AIR_KEY,
    new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  const meta: AirMeta = {
    fetchedAt: payload.fetchedAt,
    cachedAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* non-fatal: cache contents still exist, only the stamp is lost */
  }
}

export async function readCachedAir(): Promise<AirResponseT | null> {
  if (!cachesAvailable()) return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(AIR_KEY)
    if (!hit) return null
    const parsed = AirResponse.safeParse(await hit.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
