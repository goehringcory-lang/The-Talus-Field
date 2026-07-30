// =============================================================================
// useAir — network-first AQI reading with an offline fallback, mirroring
// useWeather's hook shape exactly. A failed sync falls back to the last
// cached reading; the surfaces decide how stale is too stale to show (see
// air/staleness.ts).
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { readCachedAir, writeCachedAir } from './cache'
import { AirResponse } from './schema'

export type AirState = {
  aqi: number | null
  pollutant: string | null
  category: string | null
  reportingArea: string | null
  observedAt: string | null
  fetchedAt: string | null
  ageMs: number // reading age at load time; Infinity when fetchedAt is unknown
  loading: boolean
  offline: boolean // showing cached data because the live sync failed
  sync: () => void
}

type LoadResult = Omit<AirState, 'sync' | 'loading'>

// Computed when the load resolves, not in render (render must stay pure).
function ageOf(fetchedAt: string | null): number {
  return fetchedAt ? Date.now() - Date.parse(fetchedAt) : Number.POSITIVE_INFINITY
}

async function loadAir(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/air')
    const payload = AirResponse.parse(raw)
    // Caching is best-effort: a quota or private-mode Cache API failure must
    // not turn a successful sync into the offline state.
    try {
      await writeCachedAir(payload)
    } catch {
      /* payload still served from memory below */
    }
    return {
      aqi: payload.aqi,
      pollutant: payload.pollutant,
      category: payload.category,
      reportingArea: payload.reportingArea,
      observedAt: payload.observedAt,
      fetchedAt: payload.fetchedAt,
      ageMs: ageOf(payload.fetchedAt),
      offline: false,
    }
  } catch {
    /* fall through to the cached copy; air quality is garnish, never an error */
  }

  const cached = await readCachedAir()
  return {
    aqi: cached?.aqi ?? null,
    pollutant: cached?.pollutant ?? null,
    category: cached?.category ?? null,
    reportingArea: cached?.reportingArea ?? null,
    observedAt: cached?.observedAt ?? null,
    fetchedAt: cached?.fetchedAt ?? null,
    ageMs: ageOf(cached?.fetchedAt ?? null),
    offline: true,
  }
}

export function useAir(): AirState {
  const [state, setState] = useState<Omit<AirState, 'sync'>>({
    aqi: null,
    pollutant: null,
    category: null,
    reportingArea: null,
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
      const result = await loadAir()
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
