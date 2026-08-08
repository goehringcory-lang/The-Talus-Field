// =============================================================================
// useAlerts — network-first alerts + road status with an offline fallback,
// mirroring useWeather's hook shape exactly. A failed sync falls back to the
// last cached alert set; the surfaces decide how stale is too stale to show
// (see alerts/staleness.ts).
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { readCachedAlerts, writeCachedAlerts } from './cache'
import { AlertsResponse, type AlertItemT, type RoadStatusT } from './schema'

export type AlertsState = {
  alerts: AlertItemT[]
  roads: RoadStatusT[]
  chains: string | null
  fetchedAt: string | null
  ageMs: number // alert set age at load time; Infinity when fetchedAt is unknown
  loading: boolean
  offline: boolean // showing cached data because the live sync failed
  sync: () => void
}

type LoadResult = Omit<AlertsState, 'sync' | 'loading'>

// Computed when the load resolves, not in render (render must stay pure).
function ageOf(fetchedAt: string | null): number {
  return fetchedAt ? Date.now() - Date.parse(fetchedAt) : Number.POSITIVE_INFINITY
}

// Two surfaces can mount the hook at once (/this-week renders its own alert
// list plus RoadsLine's), and each used to issue its own GET. One in-flight
// load is shared; it clears on settle so sync() still fetches fresh.
let inflight: Promise<LoadResult> | null = null

function loadAlerts(): Promise<LoadResult> {
  if (!inflight) {
    inflight = doLoadAlerts().finally(() => {
      inflight = null
    })
  }
  return inflight
}

async function doLoadAlerts(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/alerts')
    const payload = AlertsResponse.parse(raw)
    // Caching is best-effort: a quota or private-mode Cache API failure must
    // not turn a successful sync into the offline state.
    try {
      await writeCachedAlerts(payload)
    } catch {
      /* payload still served from memory below */
    }
    return {
      alerts: payload.alerts,
      roads: payload.roads,
      chains: payload.chains,
      fetchedAt: payload.fetchedAt,
      ageMs: ageOf(payload.fetchedAt),
      offline: false,
    }
  } catch {
    /* fall through to the cached copy; alerts are garnish, never an error */
  }

  const cached = await readCachedAlerts()
  return {
    alerts: cached?.alerts ?? [],
    roads: cached?.roads ?? [],
    chains: cached?.chains ?? null,
    fetchedAt: cached?.fetchedAt ?? null,
    ageMs: ageOf(cached?.fetchedAt ?? null),
    offline: true,
  }
}

export function useAlerts(): AlertsState {
  const [state, setState] = useState<Omit<AlertsState, 'sync'>>({
    alerts: [],
    roads: [],
    chains: null,
    fetchedAt: null,
    ageMs: Number.POSITIVE_INFINITY,
    loading: true,
    offline: false,
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      const result = await loadAlerts()
      if (cancelled) return
      setState({ ...result, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const sync = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, sync }
}
