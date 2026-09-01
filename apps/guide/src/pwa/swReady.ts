// =============================================================================
// serviceWorkerReady — `navigator.serviceWorker.ready` with a deadline. The
// bare promise settles only once a registration activates, and that can be
// never: a dev build (registerSW.ts only registers in prod), a browser that
// refused /sw.js, a hard reload racing the install. Anything awaiting it
// unguarded hangs for good, which on the Account card read as a busy spinner
// that never came back. Resolves null on the deadline; the caller decides
// whether that is a skip (photo pre-warm) or an error (push).
// =============================================================================

const READY_TIMEOUT_MS = 10_000

export async function serviceWorkerReady(
  timeoutMs = READY_TIMEOUT_MS,
): Promise<ServiceWorkerRegistration | null> {
  let timer: number | undefined
  try {
    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => {
        timer = window.setTimeout(() => resolve(null), timeoutMs)
      }),
    ])
  } finally {
    window.clearTimeout(timer)
  }
}
