// =============================================================================
// Automatic feed republish. Once the user has subscribed (a feed record
// exists in tfg.trip.feed), every plan edit re-renders the ICS and re-POSTs
// it, debounced, while online; app start and the online event catch up on
// edits made offline. Failures are silent by design — the sheet's
// last-updated stamp going stale is the honest signal.
// =============================================================================

import { buildTripIcs } from './ics'
import { publishFeed, readFeedInfo } from './feed'
import { slotPlan } from './slotting'
import { readTripPlan, subscribeTripPlan } from './useTripPlan'

const DEBOUNCE_MS = 4000

let timer: ReturnType<typeof setTimeout> | undefined
let started = false

export async function syncFeedNow(): Promise<void> {
  if (!readFeedInfo()) return
  if (!navigator.onLine) return
  const ics = buildTripIcs(slotPlan(readTripPlan().items))
  await publishFeed(ics)
}

function scheduleSync(): void {
  if (!readFeedInfo()) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    void syncFeedNow().catch(() => {
      /* offline or transient: the next edit or online event retries */
    })
  }, DEBOUNCE_MS)
}

/** Idempotent; called once at app boot. */
export function startFeedSync(): void {
  if (started) return
  started = true
  subscribeTripPlan(scheduleSync)
  window.addEventListener('online', () => {
    void syncFeedNow().catch(() => {})
  })
  // Catch up on plan edits made while offline or in another install.
  void syncFeedNow().catch(() => {})
}
