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
  hikeItemId,
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

// Cross-tab sync lives at module level, not inside the hook: memPlan is
// authoritative once set, so if only this listener kept it fresh while a
// useTripPlan hook happened to be mounted, another tab's edits made while
// this tab sat on a plan-free route would be silently clobbered by the next
// write here (stale base + one new item). Registered once for the session.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    memPlan = readStorage()
    for (const fn of subscribers) fn()
  })
}

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
    // Cross-tab sync is handled by the module-level storage listener above,
    // which refreshes memPlan and notifies every subscriber, this one included.
    const refresh = () => setPlan(read())
    subscribers.add(refresh)
    return () => {
      subscribers.delete(refresh)
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
        items: [
          ...p.items,
          { type: 'stop', itemId, stopId, day: target, eventUid: crypto.randomUUID() },
        ],
      }
    })
  }, [])

  const addHike = useCallback((hikeId: string, day?: string) => {
    update((p) => {
      const target = clampDay(day ?? p.dates.start, p.dates)
      const itemId = hikeItemId(hikeId, target)
      if (p.items.some((it) => it.itemId === itemId)) return p
      return {
        ...p,
        items: [
          ...p.items,
          { type: 'hike', itemId, hikeId, day: target, eventUid: crypto.randomUUID() },
        ],
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

  // Stops and hikes share the day-scoped shape, so the time and day mutators
  // handle both; programs keep their published date and time.
  const setStopTime = useCallback((itemId: string, startTime: string | undefined) => {
    update((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.itemId === itemId && it.type !== 'program' ? { ...it, startTime } : it,
      ),
    }))
  }, [])

  const moveStopToDay = useCallback((itemId: string, day: string) => {
    update((p) => {
      const moving = p.items.find((it) => it.itemId === itemId && it.type !== 'program')
      if (!moving || moving.type === 'program') return p
      const newId =
        moving.type === 'hike' ? hikeItemId(moving.hikeId, day) : stopItemId(moving.stopId, day)
      if (newId === itemId) return p
      // Target day already holds this item: dedupe by dropping the moved copy
      // instead of minting a colliding itemId (duplicate React keys / UID).
      if (p.items.some((it) => it.itemId === newId)) {
        return { ...p, items: p.items.filter((it) => it.itemId !== itemId) }
      }
      return {
        ...p,
        items: p.items.map((it) =>
          it.itemId === itemId && it.type !== 'program' ? { ...it, day, itemId: newId } : it,
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
    addHike,
    addProgram,
    removeItem,
    setStopTime,
    moveStopToDay,
    clear,
    hasItem,
  }
}

/**
 * Module-level subscription for non-React consumers (the calendar feed sync
 * republishes after every plan write). Returns the unsubscribe.
 */
export function subscribeTripPlan(fn: () => void): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

/** Current plan snapshot without a hook (feed sync runs outside React). */
export function readTripPlan(): TripPlanT {
  return read()
}

/** Cheap add-from-anywhere entry points (map popup lives outside React state). */
export function addStopToPlan(stopId: string, day?: string) {
  const p = read()
  const target = clampDay(day ?? p.dates.start, p.dates)
  const itemId = stopItemId(stopId, target)
  if (p.items.some((it: TripItemT) => it.itemId === itemId)) return
  write({
    ...p,
    items: [
      ...p.items,
      { type: 'stop', itemId, stopId, day: target, eventUid: crypto.randomUUID() },
    ],
    updatedAt: new Date().toISOString(),
  })
}

export function isStopPlanned(stopId: string): boolean {
  return read().items.some((it) => it.type === 'stop' && it.stopId === stopId)
}

export function isHikePlanned(hikeId: string): boolean {
  return read().items.some((it) => it.type === 'hike' && it.hikeId === hikeId)
}
