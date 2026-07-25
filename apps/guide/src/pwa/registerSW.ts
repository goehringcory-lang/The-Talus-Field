type UpdateHandler = (registration: ServiceWorkerRegistration) => void

// Long-lived tabs never re-check for SW updates on their own. Polling
// hourly + on every tab focus catches the user who keeps the PWA pinned
// or returns after a few days, so the UpdateBanner actually fires.
const UPDATE_POLL_MS = 60 * 60 * 1000

// The "an update is ready" fact is latched in module state rather than
// delivered as a one-shot notification. Two things used to lose it: the
// notification firing before UpdateBanner had subscribed (an update found
// during boot), and the banner component remounting. Both read to the user as
// "the update bar disappeared", and nothing brought it back.
let pendingRegistration: ServiceWorkerRegistration | null = null
const subscribers = new Set<UpdateHandler>()

/** The waiting-update registration, if one was already found. */
export function getPendingUpdate(): ServiceWorkerRegistration | null {
  return pendingRegistration
}

/** Subscribe to update-ready. Fires immediately if one is already pending. */
export function onUpdateReady(handler: UpdateHandler): () => void {
  subscribers.add(handler)
  if (pendingRegistration) handler(pendingRegistration)
  return () => {
    subscribers.delete(handler)
  }
}

function announce(registration: ServiceWorkerRegistration): void {
  pendingRegistration = registration
  for (const handler of subscribers) handler(registration)
}

export function registerServiceWorker(onUpdate?: UpdateHandler): void {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return

  if (onUpdate) subscribers.add(onUpdate)

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // "This install replaces something" — true whenever the app was already
      // installed on this device. Deliberately NOT `navigator.serviceWorker
      // .controller`: a hard reload (Ctrl+Shift+R, and some PWA pull-to-refresh
      // paths) loads the page uncontrolled, and keying off the controller meant
      // a genuine pending update went unannounced on exactly the reload the
      // user did to pick it up.
      const isUpdate = () =>
        !!registration.active || !!navigator.serviceWorker.controller

      // Snapshot: by the time a controllerchange lands, `registration.active`
      // is set even on a first-ever install, so the live check can't tell the
      // two apart there.
      const hadWorkerAtLoad = isUpdate()

      const watch = (worker: ServiceWorker | null) => {
        if (!worker) return
        const check = () => {
          if (worker.state === 'installed' && isUpdate()) announce(registration)
        }
        // The worker can already be past 'installing' by the time we look.
        check()
        worker.addEventListener('statechange', check)
      }

      // A worker may already be waiting from a prior visit where the user
      // never tapped the banner; updatefound won't fire again, so surface it.
      if (registration.waiting && isUpdate()) announce(registration)

      // register() resolves *after* the spec fires updatefound for a worker it
      // discovered itself, so an `updatefound` listener attached here misses
      // that first one. Pick it up from `installing` directly.
      watch(registration.installing)

      registration.addEventListener('updatefound', () => {
        watch(registration.installing)
      })

      // Re-check on every poll: `update()` does not re-fire updatefound for a
      // worker that is already waiting, so this is what brings the bar back if
      // its state was ever lost.
      const recheck = () => {
        registration
          .update()
          .catch(() => {})
          .finally(() => {
            if (registration.waiting && isUpdate()) announce(registration)
          })
      }

      // Periodic + focus-based update checks.
      setInterval(recheck, UPDATE_POLL_MS)

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') recheck()
      })

      // A second tab tapping the banner activates the new worker for everyone.
      // This tab is then running stale code under a fresh SW with nothing
      // waiting, so it has to be told too — tapping here just reloads.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadWorkerAtLoad) announce(registration)
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
  let reloaded = false
  const reload = () => {
    if (reloaded) return
    reloaded = true
    window.location.reload()
  }
  navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true })
  waiting.postMessage({ type: 'SKIP_WAITING' })
  // Safety net: if controllerchange never fires (the waiting worker was
  // already activated elsewhere, or the browser quietly dropped it), the
  // tapped banner must still do something visible.
  window.setTimeout(reload, 4000)
}
