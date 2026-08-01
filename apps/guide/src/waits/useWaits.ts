// =============================================================================
// useWaits — live entrance waits, mirroring useWeather's hook skeleton but
// deliberately with NO Cache API fallback and no meta stamp: a wait older
// than staleness.HIDE_AFTER_MS is worse than none, so an offline cache could
// only ever hold data the staleness policy exists to suppress. Every failure
// (route not deployed yet -> 404, timeout, offline, schema drift) resolves to
// the empty state; waits are garnish, never an error.
//
// The hook reports fetchedAt and nothing derived from it. Age belongs to the
// render, not to the moment the response landed: a phone left open on /today
// would otherwise keep presenting a reading from hours ago as current, because
// the staleness gate had been evaluated once and never again.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetch } from '../lib/api'
import { WaitsResponse, type EntranceWaitT } from './schema'

// Matches the Worker's 5-minute KV cache on /api/waits: a return to the
// foreground inside that window would fetch the same bytes back.
const REFETCH_AFTER_MS = 5 * 60 * 1000

export type WaitsState = {
  waits: EntranceWaitT[]
  fetchedAt: string | null
  loading: boolean
  sync: () => void
}

type LoadResult = Omit<WaitsState, 'sync' | 'loading'>

const EMPTY: LoadResult = {
  waits: [],
  fetchedAt: null,
}

async function loadWaits(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/waits')
    const payload = WaitsResponse.parse(raw)
    return { waits: payload.waits, fetchedAt: payload.fetchedAt }
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
  const lastLoadAt = useRef(0)

  useEffect(() => {
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      const result = await loadWaits()
      if (cancelled) return
      lastLoadAt.current = Date.now()
      setState({ ...result, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // A phone that spent an hour in a pocket comes back holding a reading the
  // staleness gate will hide, so refetch on the way back to the foreground.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastLoadAt.current < REFETCH_AFTER_MS) return
      setReloadKey((k) => k + 1)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const sync = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, sync }
}
