// navigator.onLine as React state, shared: one pair of window listeners for
// every surface that needs to tell "not downloaded" from "no signal".
import { useSyncExternalStore } from 'react'

function subscribe(fn: () => void): () => void {
  window.addEventListener('online', fn)
  window.addEventListener('offline', fn)
  return () => {
    window.removeEventListener('online', fn)
    window.removeEventListener('offline', fn)
  }
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
}
