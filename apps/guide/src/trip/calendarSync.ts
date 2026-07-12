// =============================================================================
// Automatic Google Calendar push. Once the account is connected (a record
// exists in tfg.calendar.google), every plan edit re-pushes the desired event
// set, debounced, while online; app start and the online event catch up on
// edits made offline. The mirror of feedSync.ts for the hosted ICS feed, and
// the two run side by side — a user can have both on at once.
//
// Failures are silent by design. A dead connection (revoked at Google, session
// expired, access lapsed) surfaces from the Worker as 401/403/410; the local
// record is dropped so the Account card honestly flips back to "Connect".
// =============================================================================

import { ApiError } from '../lib/api'
import { clearGoogleCalInfo, readGoogleCalInfo, syncGoogleCalendarNow } from './googleCalendar'
import { subscribeTripPlan } from './useTripPlan'

const DEBOUNCE_MS = 4000

let timer: ReturnType<typeof setTimeout> | undefined
let started = false

// Pushes are serialized through this chain: the debounce timer, the online
// listener, and the boot catch-up can otherwise overlap, and the Worker
// applies whichever event set arrives last — a slow POST carrying an older
// plan would land after (and overwrite) a newer one. Each sync builds its
// payload only after the previous request settles.
let chain: Promise<void> = Promise.resolve()

export function syncCalendarNow(): Promise<void> {
  const run = chain.then(() => doSyncCalendar())
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function doSyncCalendar(): Promise<void> {
  if (!readGoogleCalInfo()) return
  if (!navigator.onLine) return
  try {
    await syncGoogleCalendarNow()
  } catch (err) {
    // A revoked/expired grant or session never recovers on retry: drop the
    // local record so the card stops pretending sync works. Transient failures
    // rethrow into the callers' silent catch and retry on the next edit.
    if (err instanceof ApiError && (err.status === 401 || err.status === 403 || err.status === 410)) {
      clearGoogleCalInfo()
      return
    }
    throw err
  }
}

function scheduleSync(): void {
  if (!readGoogleCalInfo()) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    void syncCalendarNow().catch(() => {
      /* offline or transient: the next edit or online event retries */
    })
  }, DEBOUNCE_MS)
}

/** Idempotent; called once at app boot. */
export function startCalendarSync(): void {
  if (started) return
  started = true
  subscribeTripPlan(scheduleSync)
  window.addEventListener('online', () => {
    void syncCalendarNow().catch(() => {})
  })
  // Catch up on plan edits made while offline or in another install.
  void syncCalendarNow().catch(() => {})
}
