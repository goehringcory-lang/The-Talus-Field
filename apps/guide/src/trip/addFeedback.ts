// "Added to trip" / "Removed from trip" notices. Module-level subscriber set
// like useTripPlan / lib/favorites, but ephemeral: no storage, just the most
// recent change so the notice bar (mounted once in GatedChrome) can confirm
// adds and offer undo on removals from any surface, including the vanilla-DOM
// map popup. Surfaces call announceTripAdd / announceTripRemove explicitly
// rather than hooking useTripPlan's write() — bulk preset seeding and edits on
// /trip itself must not raise notices.

import { useEffect, useState } from 'react'

export type TripAddNotice = {
  title: string
  ts: number
  kind: 'added' | 'removed'
  // Present on removals: restores the removed items exactly as they were.
  undo?: () => void
}

let current: TripAddNotice | null = null
const subscribers = new Set<() => void>()

/** Call from any add surface (React or vanilla DOM). */
export function announceTripAdd(title: string) {
  current = { title, ts: Date.now(), kind: 'added' }
  for (const fn of subscribers) fn()
}

/** Call from remove surfaces; undo restores the captured items. */
export function announceTripRemove(title: string, undo: () => void) {
  current = { title, ts: Date.now(), kind: 'removed', undo }
  for (const fn of subscribers) fn()
}

/** The most recent add, clearing itself after timeoutMs. */
export function useTripAddNotice(timeoutMs = 4000): TripAddNotice | null {
  const [notice, setNotice] = useState<TripAddNotice | null>(null)

  useEffect(() => {
    const refresh = () => setNotice(current)
    subscribers.add(refresh)
    return () => {
      subscribers.delete(refresh)
    }
  }, [])

  // Keyed on notice.ts so a rapid second add supersedes the running timer
  // instead of being cut short by it.
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), timeoutMs)
    return () => window.clearTimeout(timer)
  }, [notice, timeoutMs])

  return notice
}
