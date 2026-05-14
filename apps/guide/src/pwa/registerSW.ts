type UpdateHandler = (registration: ServiceWorkerRegistration) => void

// Long-lived tabs never re-check for SW updates on their own. Polling
// hourly + on every tab focus catches the user who keeps the PWA pinned
// or returns after a few days, so the UpdateBanner actually fires.
const UPDATE_POLL_MS = 60 * 60 * 1000

export function registerServiceWorker(onUpdate: UpdateHandler): void {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing
        if (!installing) return
        installing.addEventListener('statechange', () => {
          if (
            installing.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            onUpdate(registration)
          }
        })
      })

      // Periodic + focus-based update checks.
      setInterval(() => {
        registration.update().catch(() => {})
      }, UPDATE_POLL_MS)

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {})
        }
      })
    })
  })
}

export async function triggerUpdate(
  registration: ServiceWorkerRegistration,
): Promise<void> {
  const waiting = registration.waiting
  if (!waiting) {
    window.location.reload()
    return
  }
  // controllerchange fires once the new SW takes over; reload then so
  // the page is served by the fresh worker on the very next paint.
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => window.location.reload(),
    { once: true },
  )
  waiting.postMessage({ type: 'SKIP_WAITING' })
}
