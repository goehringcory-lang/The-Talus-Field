// =============================================================================
// useWaits — live entrance waits, mirroring useWeather's hook skeleton but
// deliberately with NO Cache API fallback and no meta stamp: a wait older
// than staleness.HIDE_AFTER_MS is worse than none, so an offline cache could
// only ever hold data the staleness policy exists to suppress. Every failure
// (route not deployed yet -> 404, timeout, offline, schema drift) resolves to
// the empty state; waits are garnish, never an error.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { WaitsResponse, type EntranceWaitT } from './schema'

export type WaitsState = {
  waits: EntranceWaitT[]
  fetchedAt: string | null
  ageMs: number // age at load time; Infinity when fetchedAt is unknown
  loading: boolean
  sync: () => void
}

type LoadResult = Omit<WaitsState, 'sync' | 'loading'>

const EMPTY: LoadResult = {
  waits: [],
  fetchedAt: null,
  ageMs: Number.POSITIVE_INFINITY,
}

async function loadWaits(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/waits')
    const payload = WaitsResponse.parse(raw)
    return {
      waits: payload.waits,
      fetchedAt: payload.fetchedAt,
      ageMs: payload.fetchedAt
        ? Date.now() - Date.parse(payload.fetchedAt)
        : Number.POSITIVE_INFINITY,
    }
  } catch {
    return EMPTY
  }
}

export function useWaits(): WaitsState {
  const [state, setState] = useState<Omit<WaitsState, 'sync'>>({
    ...EMPTY,
    loading: true,
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      const result = await loadWaits()
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
