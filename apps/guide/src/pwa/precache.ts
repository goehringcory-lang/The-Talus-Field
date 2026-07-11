// =============================================================================
// Opportunistic photo pre-warm: hand a URL list to the service worker's
// PRECACHE_URLS handler (public/sw.js). Unlike the old inline controller
// check, this also works on the very first visit, when the page loaded
// before the SW took control and navigator.serviceWorker.controller is null:
// the message handler doesn't require a controlled page, so posting to the
// registration's active worker is enough.
// =============================================================================

export async function precacheUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return
  if (!('serviceWorker' in navigator)) return
  // The SW only registers in prod builds (registerSW.ts); awaiting `ready`
  // in dev would hang forever.
  if (!import.meta.env.PROD) return

  const message = { type: 'PRECACHE_URLS', urls }
  const controller = navigator.serviceWorker.controller
  if (controller) {
    controller.postMessage(message)
    return
  }
  // First visit: wait for the registration to activate, but never block a
  // session on it — if the SW isn't up within 10s, skip; the next visit
  // (or the fetch handler's cache-first path) picks the photos up.
  const registration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 10_000)),
  ])
  registration?.active?.postMessage(message)
}
