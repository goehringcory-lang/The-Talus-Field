// =============================================================================
// useParking — live lot status, the waits hook's skeleton exactly: no Cache
// API fallback, no meta stamp, every failure (route not deployed yet -> 404,
// timeout, offline, schema drift) resolves to the empty state. Lots are
// garnish, never an error.
//
// Reports fetchedAt and nothing derived from it; age belongs to the render
// (see waits/useWaits.ts for why).
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetch } from '../lib/api'
import { ParkingResponse, type ParkingLotT } from './schema'

// Matches the Worker's 5-minute KV cache on /api/parking.
const REFETCH_AFTER_MS = 5 * 60 * 1000

export type ParkingState = {
  lots: ParkingLotT[]
  fetchedAt: string | null
  loading: boolean
  sync: () => void
}

type LoadResult = Omit<ParkingState, 'sync' | 'loading'>

const EMPTY: LoadResult = { lots: [], fetchedAt: null }

// One in-flight load shared across surfaces (Home's panel and the map can
// mount together); clears on settle so sync() still fetches fresh.
let inflight: Promise<LoadResult> | null = null

function loadParking(): Promise<LoadResult> {
  if (!inflight) {
    inflight = doLoadParking().finally(() => {
      inflight = null
    })
  }
  return inflight
}

async function doLoadParking(): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>('/api/parking')
    const payload = ParkingResponse.parse(raw)
    return { lots: payload.lots, fetchedAt: payload.fetchedAt }
  } catch {
    return EMPTY
  }
}

export function useParking(): ParkingState {
  const [state, setState] = useState<Omit<ParkingState, 'sync'>>({ ...EMPTY, loading: true })
  const [reloadKey, setReloadKey] = useState(0)
  const lastLoadAt = useRef(0)

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(async () => {
      if (cancelled) return
      const result = await loadParking()
      if (cancelled) return
      lastLoadAt.current = Date.now()
      setState({ ...result, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

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
