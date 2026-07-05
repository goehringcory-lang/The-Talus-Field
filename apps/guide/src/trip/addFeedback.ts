// App-wide notice bus. Module-level subscriber set like useTripPlan /
// lib/favorites, but ephemeral: no storage, just the most recent notice so the
// notice bar (mounted once in GatedChrome) can confirm actions from any
// surface, including the vanilla-DOM map popup. Surfaces call announceNotice
// (or the announceTripAdd wrapper) explicitly rather than hooking store
// writes — bulk preset seeding and edits on /trip itself must not raise
// notices.

import { useEffect, useState } from 'react'

export type NoticeKind = 'trip-add' | 'saved' | 'removed'

export type AppNotice = { kind: NoticeKind; title: string; ts: number }

/** Back-compat alias for the pre-bus shape (plus the kind discriminant). */
export type TripAddNotice = AppNotice

let current: AppNotice | null = null
const subscribers = new Set<() => void>()

/** Call from any surface (React or vanilla DOM). */
export function announceNotice(notice: { kind: NoticeKind; title: string }) {
  current = { ...notice, ts: Date.now() }
  for (const fn of subscribers) fn()
}

/** Thin wrapper kept for existing add surfaces (map popup, programs, stops). */
export function announceTripAdd(title: string) {
  announceNotice({ kind: 'trip-add', title })
}

/** The most recent notice, clearing itself after timeoutMs. */
export function useTripAddNotice(timeoutMs = 4000): AppNotice | null {
  const [notice, setNotice] = useState<AppNotice | null>(null)

  useEffect(() => {
    const refresh = () => setNotice(current)
    subscribers.add(refresh)
    return () => {
      subscribers.delete(refresh)
    }
  }, [])

  // Keyed on notice.ts so a rapid second notice supersedes the running timer
  // instead of being cut short by it.
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), timeoutMs)
    return () => window.clearTimeout(timer)
  }, [notice, timeoutMs])

  return notice
}
