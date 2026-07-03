// "Added to trip" notices. Module-level subscriber set like useTripPlan /
// lib/favorites, but ephemeral: no storage, just the most recent add so the
// notice bar (mounted once in GatedChrome) can confirm adds from any surface,
// including the vanilla-DOM map popup. Add surfaces call announceTripAdd
// explicitly rather than hooking useTripPlan's write() — bulk preset seeding
// and edits on /trip itself must not raise notices.

import { useEffect, useState } from 'react'

export type TripAddNotice = { title: string; ts: number }

let current: TripAddNotice | null = null
const subscribers = new Set<() => void>()

/** Call from any add surface (React or vanilla DOM). */
export function announceTripAdd(title: string) {
  current = { title, ts: Date.now() }
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
