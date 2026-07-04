// =============================================================================
// useTripPlan — localStorage-backed plan state with module-level subscribers,
// the same pattern as lib/favorites.ts, so "Add to trip" buttons on stop
// pages, the map popup, and program rows stay in sync with /trip without a
// context provider. Corrupt storage drops to an empty plan.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { defaultTripDates, readTripDates, writeTripDates } from '../programs/usePrograms'
import type { ProgramEventT } from '../programs/schema'
import {
  TripPlan,
  programItemId,
  stopItemId,
  type TripItemT,
  type TripPlanT,
} from './schema'

const STORAGE_KEY = 'tfg.trip.plan'
const subscribers = new Set<() => void>()

function emptyPlan(): TripPlanT {
  // Same fallback window /programs renders, so a program added there before
  // the user ever touched the date pickers lands inside the plan's dates.
  const dates = readTripDates() ?? defaultTripDates()
  return { version: 1, dates, items: [], updatedAt: new Date(0).toISOString() }
}

// In-memory copy is authoritative within the session. Without it, a failed
// setItem (quota, storage-denied context) makes the next read() revert to the
// stored plan while the "Added to trip" toast is still on screen. An
// emptyPlan() derived when nothing is stored is deliberately NOT cached: its
// dates come from tfg.trip.dates, which /programs may write later.
let memPlan: TripPlanT | null = null

function readStorage(): TripPlanT | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = TripPlan.safeParse(JSON.parse(raw))
    if (parsed.success) return parsed.data
  } catch {
    /* corrupt storage drops to an empty plan */
  }
  return null
}

function read(): TripPlanT {
  if (memPlan) return memPlan
  const stored = readStorage()
  if (stored) memPlan = stored
  return stored ?? emptyPlan()
}

function write(plan: TripPlanT) {
  memPlan = plan
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  } catch {
    /* non-fatal: the plan just won't persist past this session */
  }
  for (const fn of subscribers) fn()
}

function update(mutate: (plan: TripPlanT) => TripPlanT) {
  const next = mutate(read())
  write({ ...next, updatedAt: new Date().toISOString() })
}

function clampDay(day: string, dates: TripPlanT['dates']): string {
  if (day < dates.start) return dates.start
  if (day > dates.end) return dates.end
  return day
}

export function useTripPlan() {
  const [plan, setPlan] = useState<TripPlanT>(read)

  useEffect(() => {
    const refresh = () => setPlan(read())
    subscribers.add(refresh)
    // Cross-tab sync: the other tab's write replaces the in-memory copy.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        memPlan = readStorage()
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subscribers.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setDates = useCallback((start: string, end: string) => {
    writeTripDates({ start, end })
    update((p) => ({
      ...p,
      dates: { start, end },
      // Items keep their day even if it now falls outside the window; the
      // agenda renders them under an "outside your dates" section instead of
      // silently deleting the user's picks.
    }))
  }, [])

  const addStop = useCallback((stopId: string, day?: string) => {
    update((p) => {
      const target = clampDay(day ?? p.dates.start, p.dates)
      const itemId = stopItemId(stopId, target)
      if (p.items.some((it) => it.itemId === itemId)) return p
      return {
        ...p,
        items: [...p.items, { type: 'stop', itemId, stopId, day: target }],
      }
    })
  }, [])

  const addProgram = useCallback((ev: ProgramEventT) => {
    update((p) => {
      const itemId = programItemId(ev.id)
      if (p.items.some((it) => it.itemId === itemId)) return p
      return {
        ...p,
        items: [...p.items, { type: 'program', itemId, programId: ev.id, snapshot: ev }],
      }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    update((p) => ({ ...p, items: p.items.filter((it) => it.itemId !== itemId) }))
  }, [])

  const setStopTime = useCallback((itemId: string, startTime: string | undefined) => {
    update((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.itemId === itemId && it.type === 'stop' ? { ...it, startTime } : it,
      ),
    }))
  }, [])

  const moveStopToDay = useCallback((itemId: string, day: string) => {
    update((p) => {
      const moving = p.items.find((it) => it.itemId === itemId && it.type === 'stop')
      if (!moving || moving.type !== 'stop') return p
      const newId = stopItemId(moving.stopId, day)
      if (newId === itemId) return p
      // Target day already holds this stop: dedupe by dropping the moved copy
      // instead of minting a colliding itemId (duplicate React keys / UID).
      if (p.items.some((it) => it.itemId === newId)) {
        return { ...p, items: p.items.filter((it) => it.itemId !== itemId) }
      }
      return {
        ...p,
        items: p.items.map((it) =>
          it.itemId === itemId && it.type === 'stop' ? { ...it, day, itemId: newId } : it,
        ),
      }
    })
  }, [])

  const clear = useCallback(() => {
    update((p) => ({ ...p, items: [] }))
  }, [])

  const hasItem = useCallback(
    (itemId: string) => plan.items.some((it) => it.itemId === itemId),
    [plan],
  )

  return {
    plan,
    setDates,
    addStop,
    addProgram,
    removeItem,
    setStopTime,
    moveStopToDay,
    clear,
    hasItem,
  }
}

/** Cheap add-from-anywhere entry points (map popup lives outside React state). */
export function addStopToPlan(stopId: string, day?: string) {
  const p = read()
  const target = clampDay(day ?? p.dates.start, p.dates)
  const itemId = stopItemId(stopId, target)
  if (p.items.some((it: TripItemT) => it.itemId === itemId)) return
  write({
    ...p,
    items: [...p.items, { type: 'stop', itemId, stopId, day: target }],
    updatedAt: new Date().toISOString(),
  })
}

export function isStopPlanned(stopId: string): boolean {
  return read().items.some((it) => it.type === 'stop' && it.stopId === stopId)
}
