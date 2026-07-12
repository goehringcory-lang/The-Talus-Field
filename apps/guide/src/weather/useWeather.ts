// =============================================================================
// useWeather — network-first forecast with an offline fallback, mirroring
// usePrograms without the date-window logic. A failed sync falls back to the
// last cached forecast; the surfaces decide how stale is too stale to show.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { readCachedWeather, writeCachedWeather } from './cache'
import { WeatherResponse, type WeatherSpotT } from './schema'

export type WeatherState = {
  spots: WeatherSpotT[]
  fetchedAt: string | null
  ageMs: number // forecast age at load time; Infinity when fetchedAt is unknown
  loading: boolean
  offline: boolean // showing cached data because the live sync failed
  sync: () => void
}

type LoadResult = Omit<WeatherState, 'sync' | 'loading'>

// Computed when the load resolves, not in render (render must stay pure).
function ageOf(fetchedAt: string | null): number {
  return fetchedAt ? Date.now() - Date.parse(fetchedAt) : Number.POSITIVE_INFINITY
}

async function loadWeather(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/weather')
    const payload = WeatherResponse.parse(raw)
    // Caching is best-effort: a quota or private-mode Cache API failure must
    // not turn a successful sync into the offline state.
    try {
      await writeCachedWeather(payload)
    } catch {
      /* payload still served from memory below */
    }
    return {
      spots: payload.spots,
      fetchedAt: payload.fetchedAt,
      ageMs: ageOf(payload.fetchedAt),
      offline: false,
    }
  } catch {
    /* fall through to the cached copy; weather is garnish, never an error */
  }

  const cached = await readCachedWeather()
  return {
    spots: cached?.spots ?? [],
    fetchedAt: cached?.fetchedAt ?? null,
    ageMs: ageOf(cached?.fetchedAt ?? null),
    offline: true,
  }
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<Omit<WeatherState, 'sync'>>({
    spots: [],
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
      const result = await loadWeather()
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
