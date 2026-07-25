// How the card surfaces (region pages, the Secret Guide) present their
// entries: 'cards' is the swipe deck, one entry per screen; 'list' is the
// original long scroll. One preference shared by every deck surface, stored
// like favorites (module-level copy + subscribers) so flipping the toggle on
// a region page is already flipped when the Secret Guide mounts.

import { useCallback, useEffect, useState } from 'react'

export type ViewMode = 'cards' | 'list'

const STORAGE_KEY = 'tfg.viewMode'
const DEFAULT_MODE: ViewMode = 'cards'
const subscribers = new Set<() => void>()

// In-memory copy is authoritative within the session: a storage-denied
// browser must still be able to switch modes for as long as the tab lives.
let memMode: ViewMode | null = null

function isMode(value: unknown): value is ViewMode {
  return value === 'cards' || value === 'list'
}

function readStorage(): ViewMode | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return isMode(raw) ? raw : null
  } catch {
    /* unreadable storage reads as "no preference set" */
    return null
  }
}

function read(): ViewMode {
  if (memMode === null) memMode = readStorage() ?? DEFAULT_MODE
  return memMode
}

function write(mode: ViewMode) {
  memMode = mode
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* non-fatal: the choice just won't survive this session */
  }
  for (const fn of subscribers) fn()
}

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(read)

  useEffect(() => {
    const refresh = () => setMode(read())
    subscribers.add(refresh)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        memMode = readStorage() ?? DEFAULT_MODE
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      subscribers.delete(refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setViewMode = useCallback((next: ViewMode) => write(next), [])

  return { mode, setViewMode }
}
