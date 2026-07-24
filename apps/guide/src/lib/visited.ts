// Visited stops. A line-for-line sibling of lib/favorites.ts: localStorage-
// backed with a module-level subscriber set, in-memory copy authoritative
// within the session so a failed setItem never reverts a visible toggle.

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'tfg.visited'
const subscribers = new Set<() => void>()

let memIds: string[] | null = null

function readStorage(): string[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    /* unreadable storage reads as nothing visited */
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
  for (const fn of subscribers) fn()
}

export function useVisited() {
  const [ids, setIds] = useState<string[]>(read)

  useEffect(() => {
    const refresh = () => setIds(read())
    subscribers.add(refresh)
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

  const isVisited = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, isVisited }
}
