// =============================================================================
// Offline cache for the alerts feed. Same strategy as weather/cache.ts:
// payload in the unversioned tfg-data Cache API bucket (survives deploys),
// bookkeeping stamp in localStorage, cached copy treated as suspect until
// matched. One canonical synthetic key: a re-sync replaces the old alert set.
//
// A cached closure list is exactly what a reader wants offline mid-drive, so
// caching alerts (unlike waits) is deliberate — see alerts/staleness.ts.
// =============================================================================

import { API_BASE } from '../lib/api'
import { AlertsResponse, type AlertsResponseT } from './schema'

const CACHE_NAME = 'tfg-data'
const ALERTS_KEY = `${API_BASE}/api/alerts/current`
const META_KEY = 'tfg.alerts.meta'

export type AlertsMeta = {
  fetchedAt: string | null // when the Worker last fetched NPS; null = unknown
  cachedAt: string         // when this device saved the alert set
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

export function readAlertsMeta(): AlertsMeta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'fetchedAt' in parsed && 'cachedAt' in parsed) {
      return parsed as AlertsMeta
    }
  } catch {
    /* unreadable storage counts as no cached alert set */
  }
  return null
}

export async function writeCachedAlerts(payload: AlertsResponseT): Promise<void> {
  if (!cachesAvailable()) return
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    ALERTS_KEY,
    new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  const meta: AlertsMeta = {
    fetchedAt: payload.fetchedAt,
    cachedAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* non-fatal: cache contents still exist, only the stamp is lost */
  }
}

export async function readCachedAlerts(): Promise<AlertsResponseT | null> {
  if (!cachesAvailable()) return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(ALERTS_KEY)
    if (!hit) return null
    const parsed = AlertsResponse.safeParse(await hit.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
