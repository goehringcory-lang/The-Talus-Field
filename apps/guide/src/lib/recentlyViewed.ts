// The last entries a reader opened: stop and hike pages, newest first. Kept on
// this device only (`tfg.recent.viewed`), never synced: it is a convenience
// for "the one I was just reading", not part of the trip. Written when a page
// mounts, read by /saved and the empty search box.

import { useSyncExternalStore } from 'react'

const KEY = 'tfg.recent.viewed'
const MAX = 10

export type RecentEntry = { type: 'stop' | 'hike'; id: string }

const listeners = new Set<() => void>()
let cache: RecentEntry[] | null = null

function readStore(): RecentEntry[] {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed)
      ? parsed.filter(
          (e): e is RecentEntry =>
            !!e && typeof e === 'object' && (e.type === 'stop' || e.type === 'hike') && typeof e.id === 'string',
        )
      : []
  } catch {
    cache = []
  }
  return cache
}

export function recordView(entry: RecentEntry): void {
  const next = [entry, ...readStore().filter((e) => !(e.type === entry.type && e.id === entry.id))].slice(0, MAX)
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* non-fatal: the list just won't survive a reload */
  }
  for (const fn of listeners) fn()
}

export function clearRecent(): void {
  cache = []
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* non-fatal */
  }
  for (const fn of listeners) fn()
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useRecentlyViewed(): RecentEntry[] {
  return useSyncExternalStore(subscribe, readStore, () => [])
}
