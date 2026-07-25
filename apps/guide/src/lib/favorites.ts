// Saved stops. localStorage-backed with a module-level subscriber set so the
// star on a StopCard and the "Saved stops" list on Home stay in sync without
// a context provider.

import { useCallback, useEffect, useState } from 'react'
import { markLocalChange } from './syncStamp'

const STORAGE_KEY = 'tfg.favorites'
const subscribers = new Set<() => void>()

// In-memory copy is authoritative within the session. Without it, a failed
// setItem (quota, storage-denied context) silently reverts the star on the
// next read even though the tap "worked" — persistence is best-effort, the
// visible state must not be.
let memIds: string[] | null = null

function readStorage(): string[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    /* unreadable storage reads as no favorites */
  }
  return null
}

function read(): string[] {
  if (memIds === null) memIds = readStorage() ?? []
  return memIds
}

function write(ids: string[]) {
  memIds = ids
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* non-fatal: the toggle just won't persist past this session */
  }
  // Favorites carry no timestamp of their own; this is what lets cross-device
  // sync tell an ahead device from a behind one. No-op while a pull applies.
  markLocalChange()
  for (const fn of subscribers) fn()
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(read)

  useEffect(() => {
    const refresh = () => setIds(read())
    subscribers.add(refresh)
    // Cross-tab sync. The other tab's write is the fresher truth, so it
    // replaces the in-memory copy before subscribers re-read.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        memIds = readStorage() ?? []
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subscribers.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    const current = read()
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, isFavorite }
}

// --- Non-React surface, for the cross-device sync layer ---------------------

export function readFavoriteIds(): string[] {
  return read()
}

/** Replace wholesale (a sync pull). Notifies every mounted surface. */
export function replaceFavoriteIds(ids: string[]): void {
  write(ids)
}

export function subscribeFavorites(fn: () => void): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}
