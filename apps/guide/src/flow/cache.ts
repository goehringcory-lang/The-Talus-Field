// =============================================================================
// Offline cache for the river flow reading. Same strategy as weather/cache.ts:
// payload in the unversioned tfg-data Cache API bucket (survives deploys),
// bookkeeping stamp in localStorage, cached copy treated as suspect until
// matched. One canonical synthetic key: a re-sync replaces the old reading.
//
// Cached with the loosest hide window of the three conditions features (see
// flow/staleness.ts): snowmelt flow moves on a days scale, not hours.
// =============================================================================

import { API_BASE } from '../lib/api'
import { FlowResponse, type FlowResponseT } from './schema'

const CACHE_NAME = 'tfg-data'
const FLOW_KEY = `${API_BASE}/api/flow/current`
const META_KEY = 'tfg.flow.meta'

export type FlowMeta = {
  fetchedAt: string | null // when the Worker last fetched the gauge; null = unknown
  cachedAt: string         // when this device saved the reading
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

export function readFlowMeta(): FlowMeta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'fetchedAt' in parsed && 'cachedAt' in parsed) {
      return parsed as FlowMeta
    }
  } catch {
    /* unreadable storage counts as no cached reading */
  }
  return null
}

export async function writeCachedFlow(payload: FlowResponseT): Promise<void> {
  if (!cachesAvailable()) return
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    FLOW_KEY,
    new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  const meta: FlowMeta = {
    fetchedAt: payload.fetchedAt,
    cachedAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* non-fatal: cache contents still exist, only the stamp is lost */
  }
}

export async function readCachedFlow(): Promise<FlowResponseT | null> {
  if (!cachesAvailable()) return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(FLOW_KEY)
    if (!hit) return null
    const parsed = FlowResponse.safeParse(await hit.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
