// =============================================================================
// useFlow — network-first river flow reading with an offline fallback,
// mirroring useWeather's hook shape exactly. A failed sync falls back to the
// last cached reading; the surfaces decide how stale is too stale to show
// (see flow/staleness.ts).
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { readCachedFlow, writeCachedFlow } from './cache'
import { FlowResponse, type FlowBandT } from './schema'

export type FlowState = {
  cfs: number | null
  band: FlowBandT | null
  observedAt: string | null
  fetchedAt: string | null
  ageMs: number // reading age at load time; Infinity when fetchedAt is unknown
  loading: boolean
  offline: boolean // showing cached data because the live sync failed
  sync: () => void
}

type LoadResult = Omit<FlowState, 'sync' | 'loading'>

// Computed when the load resolves, not in render (render must stay pure).
function ageOf(fetchedAt: string | null): number {
  return fetchedAt ? Date.now() - Date.parse(fetchedAt) : Number.POSITIVE_INFINITY
}

async function loadFlow(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/flow')
    const payload = FlowResponse.parse(raw)
    // Caching is best-effort: a quota or private-mode Cache API failure must
    // not turn a successful sync into the offline state.
    try {
      await writeCachedFlow(payload)
    } catch {
      /* payload still served from memory below */
    }
    return {
      cfs: payload.cfs,
      band: payload.band,
      observedAt: payload.observedAt,
      fetchedAt: payload.fetchedAt,
      ageMs: ageOf(payload.fetchedAt),
      offline: false,
    }
  } catch {
    /* fall through to the cached copy; flow is garnish, never an error */
  }

  const cached = await readCachedFlow()
  return {
    cfs: cached?.cfs ?? null,
    band: cached?.band ?? null,
    observedAt: cached?.observedAt ?? null,
    fetchedAt: cached?.fetchedAt ?? null,
    ageMs: ageOf(cached?.fetchedAt ?? null),
    offline: true,
  }
}

export function useFlow(): FlowState {
  const [state, setState] = useState<Omit<FlowState, 'sync'>>({
    cfs: null,
    band: null,
    observedAt: null,
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
      const result = await loadFlow()
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
