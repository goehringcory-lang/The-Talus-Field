// =============================================================================
// useWatches — the buyer's campsite watches, network-first with the last
// list cached so /watch renders offline. The state is the buyer's (JWT-gated
// on the Worker), the evaluation is server-side only, and the PWA never talks
// to recreation.gov: the five-minute sweep does, and this hook reads what it
// found.
//
// A 404 on the list is a specific, expected state: the PWA auto-deploys on
// merge and the Worker does not, so a build can meet an API that predates the
// watch routes. That is `unavailable`, and the page says so rather than
// rendering an empty list a buyer would read as "no watches".
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { ApiError, apiFetch } from '../lib/api'
import {
  CachedWatches,
  WatchDetailResponse,
  WatchListResponse,
  WatchResponse,
  type CreateWatchInput,
  type WatchChannelsT,
  type WatchDetailT,
  type WatchT,
} from './schema'

const CACHE_KEY = 'tfg.watch.cache'

export type WatchesState = {
  watches: WatchT[]
  loading: boolean
  offline: boolean        // showing the cached list because the live load failed
  unavailable: boolean    // the Worker has no /api/watch yet (deployed before this build)
  cachedAt: string | null
  error: string | null
  refresh: () => void
  create: (input: CreateWatchInput) => Promise<WatchT>
  remove: (id: string) => Promise<void>
  setChannels: (id: string, channels: WatchChannelsT) => Promise<WatchT>
}

type Loaded = Pick<WatchesState, 'watches' | 'offline' | 'unavailable' | 'cachedAt' | 'error'>

export function readCachedWatches(): { watches: WatchT[]; cachedAt: string } | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = CachedWatches.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

function writeCachedWatches(watches: WatchT[]): void {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ watches, cachedAt: new Date().toISOString() }),
    )
  } catch {
    /* storage-blocked: the list still renders from memory */
  }
}

// One in-flight load shared by every mount, the useWeather idiom.
let inflight: Promise<Loaded> | null = null

function loadWatches(): Promise<Loaded> {
  if (!inflight) {
    inflight = doLoadWatches().finally(() => {
      inflight = null
    })
  }
  return inflight
}

async function doLoadWatches(): Promise<Loaded> {
  try {
    const raw = await apiFetch<unknown>('/api/watch')
    const payload = WatchListResponse.parse(raw)
    writeCachedWatches(payload.watches)
    return { watches: payload.watches, offline: false, unavailable: false, cachedAt: null, error: null }
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { watches: [], offline: false, unavailable: true, cachedAt: null, error: null }
    }
    const cached = readCachedWatches()
    return {
      watches: cached?.watches ?? [],
      offline: true,
      unavailable: false,
      cachedAt: cached?.cachedAt ?? null,
      error:
        err instanceof ApiError && err.status !== 0
          ? err.message
          : 'No signal. Showing the watches saved on this device.',
    }
  }
}

// Changing a watch is a server write; there is no offline queue because a
// watch queued while out of signal would miss the openings in between anyway.
function requireSignal(): void {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Watches need signal to change. Try again when you have it.')
  }
}

export async function loadWatchDetail(id: string): Promise<WatchDetailT | null> {
  try {
    const raw = await apiFetch<unknown>(`/api/watch/${encodeURIComponent(id)}`)
    return WatchDetailResponse.parse(raw)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export async function createWatch(input: CreateWatchInput): Promise<WatchT> {
  requireSignal()
  const raw = await apiFetch<unknown>('/api/watch', { method: 'POST', body: JSON.stringify(input) })
  return WatchResponse.parse(raw).watch
}

export async function removeWatch(id: string): Promise<void> {
  requireSignal()
  await apiFetch(`/api/watch/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function updateWatchChannels(id: string, channels: WatchChannelsT): Promise<WatchT> {
  requireSignal()
  const raw = await apiFetch<unknown>(`/api/watch/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ channels }),
  })
  return WatchResponse.parse(raw).watch
}

export function useWatches(): WatchesState {
  const [state, setState] = useState<Loaded & { loading: boolean }>({
    watches: [],
    loading: true,
    offline: false,
    unavailable: false,
    cachedAt: null,
    error: null,
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      const result = await loadWatches()
      if (cancelled) return
      setState({ ...result, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  // Every mutation re-reads the list afterwards: the Worker owns the truth,
  // and a re-read is one request the buyer is already waiting on.
  const create = useCallback(
    async (input: CreateWatchInput) => {
      const watch = await createWatch(input)
      refresh()
      return watch
    },
    [refresh],
  )
  const remove = useCallback(
    async (id: string) => {
      await removeWatch(id)
      refresh()
    },
    [refresh],
  )
  const setChannels = useCallback(
    async (id: string, channels: WatchChannelsT) => {
      const watch = await updateWatchChannels(id, channels)
      refresh()
      return watch
    },
    [refresh],
  )

  return { ...state, refresh, create, remove, setChannels }
}
