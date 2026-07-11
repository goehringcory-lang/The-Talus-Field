// =============================================================================
// First-run onboarding flag. `tfg.onboarded` decides whether /open and /
// route the buyer through /welcome. Subscribable (favorites.ts pattern) so
// the global InstallPrompt banner, which stays suppressed during onboarding,
// can reappear the moment onboarding finishes without a remount.
//
// Read failure counts as ONBOARDED, inverting the usual "unreadable storage
// reads as unset" convention on purpose: a storage-denied browser must not
// trap the user on /welcome every launch. Skipping orientation beats nagging.
// =============================================================================

import { useEffect, useState } from 'react'

const KEY = 'tfg.onboarded'

const subscribers = new Set<() => void>()

export function isOnboarded(): boolean {
  try {
    return window.localStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

export function markOnboarded(): void {
  try {
    window.localStorage.setItem(KEY, '1')
  } catch {
    /* non-fatal: isOnboarded() fails open, so the flow still exits */
  }
  for (const fn of subscribers) fn()
}

export function useIsOnboarded(): boolean {
  const [onboarded, setOnboarded] = useState(() => isOnboarded())
  useEffect(() => {
    const update = () => setOnboarded(isOnboarded())
    subscribers.add(update)
    return () => {
      subscribers.delete(update)
    }
  }, [])
  return onboarded
}
