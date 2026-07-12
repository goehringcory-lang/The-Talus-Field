// =============================================================================
// Offline cache for the programs feed.
//
// Same storage strategy the download manager proved out (offline/useDownloads):
// the payload goes in the Cache API, bookkeeping goes in localStorage, and the
// cached copy is treated as suspect until matched (iOS Safari evicts caches).
// The cache name is unversioned like tfg-tiles so a synced trip window
// survives app deploys. One canonical synthetic key means a re-sync for new
// dates replaces the old window instead of accumulating.
// =============================================================================

import { API_BASE } from '../lib/api'
import { ProgramsResponse, type ProgramsResponseT } from './schema'

const CACHE_NAME = 'tfg-data'
const WINDOW_KEY = `${API_BASE}/api/programs/window`
const META_KEY = 'tfg.programs.meta'

export type ProgramsMeta = {
  start: string
  end: string
  syncedAt: string | null  // when the Worker last ingested source data; null = never
  cachedAt: string         // when this device saved the window
}

function cachesAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window
}

export function readMeta(): ProgramsMeta | null {
  try {
    const raw = window.localStorage.getItem(META_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      'start' in parsed &&
      'end' in parsed &&
      'syncedAt' in parsed &&
      'cachedAt' in parsed
    ) {
      return parsed as ProgramsMeta
    }
  } catch {
    /* unreadable storage counts as no cached window */
  }
  return null
}

export async function writeCachedWindow(payload: ProgramsResponseT): Promise<void> {
  if (!cachesAvailable()) return
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    WINDOW_KEY,
    new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  const meta: ProgramsMeta = {
    start: payload.start,
    end: payload.end,
    syncedAt: payload.syncedAt,
    cachedAt: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    /* non-fatal: cache contents still exist, only the stamp is lost */
  }
  await requestPersistence()
}

// Ask the browser not to evict the trip's data under storage pressure — once
// per session, and only when not already granted. Firefox surfaces persist()
// as a permission prompt, so calling it on every sync would re-prompt a user
// who dismissed it each time they change dates or press "Sync now".
let persistenceRequested = false
async function requestPersistence(): Promise<void> {
  if (persistenceRequested) return
  persistenceRequested = true
  try {
    if (await navigator.storage?.persisted?.()) return
    await navigator.storage?.persist?.()
  } catch {
    /* persistence is a hint */
  }
}

export async function readCachedWindow(): Promise<ProgramsResponseT | null> {
  if (!cachesAvailable()) return null
  try {
    const cache = await caches.open(CACHE_NAME)
    const hit = await cache.match(WINDOW_KEY)
    if (!hit) return null
    const parsed = ProgramsResponse.safeParse(await hit.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
