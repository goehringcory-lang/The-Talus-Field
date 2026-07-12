// =============================================================================
// usePrograms — network-first programs feed with an offline fallback.
//
// Online: GET /api/programs for the trip window, zod-parse, save to the
// Cache API, stamp meta. Offline (or fetch failure): fall back to the cached
// window if it overlaps the requested dates, reporting how well it covers
// them so the UI can warn about partial or missing data.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { ZodError } from 'zod'
import { ApiError, apiFetch } from '../lib/api'
import { addDaysIso, todayIso } from '../utils/date'
import { readCachedWindow, readMeta, writeCachedWindow } from './cache'
import { ProgramsResponse, type ProgramEventT } from './schema'

export type Coverage = 'full' | 'partial' | 'none'

// Why the live sync failed. 'server' means the API answered but the answer
// was unusable (HTTP error or schema drift); 'network' means it never
// answered. The UI copy differs: "no connection" is a lie when the request
// landed and the server refused it.
export type SyncFailure = 'network' | 'server' | null

export type ProgramsState = {
  events: ProgramEventT[]
  syncedAt: string | null
  loading: boolean
  offline: boolean       // showing cached data because the live sync failed
  coverage: Coverage     // how much of the requested window the data covers
  failure: SyncFailure
  error: string | null
  sync: () => void
}

// Also read by the trip planner — keep the shape stable.
export const TRIP_DATES_KEY = 'tfg.trip.dates'

// Longest window /api/programs will answer (MAX_SPAN_DAYS in the Worker);
// the date pickers on /programs and /trip both clamp to it.
export const MAX_SPAN_DAYS = 31

export type TripDates = { start: string; end: string }

/** The window both /programs and the trip planner assume when the user has
 * never picked dates. Shared so the two pages can't drift apart: /programs
 * renders this default without persisting it, and the planner's empty plan
 * must fall back to the same span or a program added on day 3 lands
 * "outside your dates". */
export function defaultTripDates(): TripDates {
  const today = todayIso()
  return { start: today, end: addDaysIso(today, 4) }
}

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
  let failure: Exclude<SyncFailure, null> = 'network'
  try {
    const raw = await apiFetch<unknown>(
      `/api/programs?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
    )
    const payload = ProgramsResponse.parse(raw)
    // Caching is best-effort: a quota or private-mode Cache API failure must
    // not turn a successful sync into the offline "no saved listings" state.
    try {
      await writeCachedWindow(payload)
    } catch {
      /* payload still served from memory below */
    }
    return {
      events: payload.events,
      syncedAt: payload.syncedAt,
      offline: false,
      coverage: 'full',
      failure: null,
      error: null,
    }
  } catch (err) {
    // The cached fallback below serves both classes (stale beats none); only
    // the messaging differs.
    if (err instanceof ApiError || err instanceof ZodError) failure = 'server'
  }

  const cached = await readCachedWindow()
  const meta = readMeta()
  if (!cached) {
    return {
      events: [],
      syncedAt: null,
      offline: true,
      coverage: 'none',
      failure,
      error:
        failure === 'server'
          ? 'The programs sync failed on the server side. Try again in a few minutes.'
          : 'No connection and no saved listings on this device yet.',
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
    failure,
    error: overlaps ? null : 'The listings saved on this device cover different dates.',
  }
}

export function usePrograms(start: string | null, end: string | null): ProgramsState {
  const [state, setState] = useState<Omit<ProgramsState, 'sync'>>(() => ({
    events: [],
    syncedAt: null,
    // A valid window starts loading in the mount effect, but that state lands
    // a paint late; seeding it here keeps the first frame on the skeleton
    // instead of flashing the "Nothing listed for these dates" empty state.
    loading: Boolean(start && end && end >= start),
    offline: false,
    coverage: 'none',
    failure: null,
    error: null,
  }))
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!start || !end || end < start) {
      // A sync may have been in flight when the window went invalid (date
      // input cleared); its cancelled run never resets loading, so do it here
      // or the Sync button stays stuck on "Syncing…". Deferred like the load
      // below so no state update runs synchronously inside the effect body.
      let cancelledReset = false
      Promise.resolve().then(() => {
        if (cancelledReset) return
        setState((prev) => (prev.loading ? { ...prev, loading: false } : prev))
      })
      return () => {
        cancelledReset = true
      }
    }
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
