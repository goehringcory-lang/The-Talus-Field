// =============================================================================
// usePrograms — network-first programs feed with an offline fallback.
//
// Online: GET /api/programs for the trip window, zod-parse, save to the
// Cache API, stamp meta. Offline (or fetch failure): fall back to the cached
// window if it overlaps the requested dates, reporting how well it covers
// them so the UI can warn about partial or missing data.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { readCachedWindow, readMeta, writeCachedWindow } from './cache'
import { ProgramsResponse, type ProgramEventT } from './schema'

export type Coverage = 'full' | 'partial' | 'none'

export type ProgramsState = {
  events: ProgramEventT[]
  syncedAt: string | null
  loading: boolean
  offline: boolean       // showing cached data because the network failed
  coverage: Coverage     // how much of the requested window the data covers
  error: string | null
  sync: () => void
}

// Also read by the trip planner — keep the shape stable.
export const TRIP_DATES_KEY = 'tfg.trip.dates'

// Longest window /api/programs will answer (MAX_SPAN_DAYS in the Worker);
// the date pickers on /programs and /trip both clamp to it.
export const MAX_SPAN_DAYS = 31

export type TripDates = { start: string; end: string }

export function readTripDates(): TripDates | null {
  try {
    const raw = window.localStorage.getItem(TRIP_DATES_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'start' in parsed && 'end' in parsed) {
      const { start, end } = parsed as TripDates
      if (/^\d{4}-\d{2}-\d{2}$/.test(start) && /^\d{4}-\d{2}-\d{2}$/.test(end)) {
        return { start, end }
      }
    }
  } catch {
    /* unreadable storage counts as no dates picked */
  }
  return null
}

export function writeTripDates(dates: TripDates): void {
  try {
    window.localStorage.setItem(TRIP_DATES_KEY, JSON.stringify(dates))
  } catch {
    /* non-fatal */
  }
}

type LoadResult = Omit<ProgramsState, 'sync' | 'loading'>

async function loadWindow(start: string, end: string): Promise<LoadResult> {
  try {
    const raw = await apiFetch<unknown>(
      `/api/programs?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    )
    const payload = ProgramsResponse.parse(raw)
    await writeCachedWindow(payload)
    return {
      events: payload.events,
      syncedAt: payload.syncedAt,
      offline: false,
      coverage: 'full',
      error: null,
    }
  } catch {
    /* fall through to the cached window */
  }

  const cached = await readCachedWindow()
  const meta = readMeta()
  if (!cached) {
    return {
      events: [],
      syncedAt: null,
      offline: true,
      coverage: 'none',
      error: 'No connection and no saved listings on this device yet.',
    }
  }

  const overlaps = cached.start <= end && cached.end >= start
  const covers = cached.start <= start && cached.end >= end
  return {
    events: overlaps
      ? cached.events.filter((ev) => ev.date >= start && ev.date <= end)
      : [],
    syncedAt: meta?.syncedAt ?? cached.syncedAt,
    offline: true,
    coverage: covers ? 'full' : overlaps ? 'partial' : 'none',
    error: overlaps ? null : 'The listings saved on this device cover different dates.',
  }
}

export function usePrograms(start: string | null, end: string | null): ProgramsState {
  const [state, setState] = useState<Omit<ProgramsState, 'sync'>>({
    events: [],
    syncedAt: null,
    loading: false,
    offline: false,
    coverage: 'none',
    error: null,
  })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!start || !end || end < start) return
    let cancelled = false
    // Deferred so no state update runs synchronously inside the effect body.
    Promise.resolve().then(async () => {
      if (cancelled) return
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const result = await loadWindow(start, end)
      if (cancelled) return
      setState({ ...result, loading: false })
    })
    return () => {
      cancelled = true
    }
  }, [start, end, reloadKey])

  const sync = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, sync }
}
