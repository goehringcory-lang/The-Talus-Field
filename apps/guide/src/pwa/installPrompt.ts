// =============================================================================
// Module-level beforeinstallprompt capture. Chrome fires the event once,
// early; a component-scoped listener misses it whenever the component mounts
// after the fact (or remounts). Capturing into module state at boot (imported
// from main.tsx) means any consumer, whenever it mounts, can still offer the
// native install dialog. Subscriber pattern matches lib/favorites.ts.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
const subscribers = new Set<() => void>()

function notify(): void {
  for (const fn of subscribers) fn()
}

export function captureInstallPrompt(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    notify()
  })
  // Once installed the deferred prompt is dead; drop it so consumers hide.
  window.addEventListener('appinstalled', () => {
    deferred = null
    notify()
  })
}

/** The captured install event (null until Chrome offers one) and a prompt()
 * that shows the native dialog then consumes the event. */
export function useDeferredInstallPrompt(): {
  event: BeforeInstallPromptEvent | null
  prompt: () => Promise<void>
} {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(deferred)
  useEffect(() => {
    const update = () => setEvent(deferred)
    subscribers.add(update)
    // The event may have fired between the initial render and this effect.
    update()
    return () => {
      subscribers.delete(update)
    }
  }, [])
  const prompt = useCallback(async () => {
    if (!deferred) return
    const current = deferred
    deferred = null
    notify()
    await current.prompt()
  }, [])
  return { event, prompt }
}
