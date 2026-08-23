// =============================================================================
// Cross-device sync for the planner state.
//
// The problem it solves: people plan a trip on a laptop and walk into the park
// with a phone. Every planner store was device-local, so signing in on the
// second device showed an empty board and a support email.
//
// Shape: whole-document last-write-wins, keyed on a timestamp (sync/schema.ts).
// Not a CRDT, and deliberately not: the two "devices" are one person, working
// sequentially, and a merge engine would buy correctness for a case that
// barely happens at the cost of behaviour nobody can predict. What LWW means
// in practice is stated plainly in the /account copy — the device that saved
// last wins — so the one lossy case is disclosed rather than hidden.
//
// Opt-in, and off by default. The guide's promise is that it works with no
// signal; a buyer who never turns this on is in exactly the state they were
// before it existed. When it is off, nothing here ever touches the network.
//
// Failure posture matches the calendar feed: silent. Being offline in the park
// is the normal case, not an error, and a sync banner over the trip board on a
// trailhead would be noise. The "last synced" stamp on /account going stale is
// the honest signal.
// =============================================================================

import { getStoredJwt } from '../auth/storage'
import { ApiError, apiFetch } from '../lib/api'
import {
  readFavoriteIds,
  replaceFavoriteIds,
  subscribeFavorites,
} from '../lib/favorites'
import { readStopNotes, replaceStopNotes, subscribeStopNotes } from '../lib/stopNotes'
import { readLocalStamp, setLocalStamp, withRemoteApply } from '../lib/syncStamp'
import { readVisitedIds, replaceVisitedIds, subscribeVisited } from '../lib/visited'
import { readTripPlan, replaceTripPlan, subscribeTripPlan } from '../trip/useTripPlan'
import { anyUnparseable, parseSyncDoc, type ParsedSyncDoc, type SyncDocT } from './schema'

const ENABLED_KEY = 'tfg.sync.enabled'
const LAST_SYNC_KEY = 'tfg.sync.lastAt'
// Same debounce as the calendar feed: long enough that dragging blocks around
// the board is one write, short enough that picking the phone up a minute
// later finds the change.
const DEBOUNCE_MS = 4000

let timer: ReturnType<typeof setTimeout> | undefined
let started = false

// Writes are serialized through this chain. The debounce timer, the online listener,
// and the boot pass can otherwise overlap, and the server is last-write-wins:
// a slow POST carrying an older document would land after, and overwrite, a
// newer one. Each run builds its payload only after the previous settles.
let chain: Promise<void> = Promise.resolve()

const listeners = new Set<() => void>()

function notify(): void {
  for (const fn of listeners) fn()
}

export function subscribeSyncStatus(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// --- Preference + stamp -----------------------------------------------------

export function isSyncEnabled(): boolean {
  try {
    return window.localStorage.getItem(ENABLED_KEY) === '1'
  } catch {
    // Storage-denied browsers can't hold a preference, and defaulting an
    // opt-in feature to ON because storage failed is the wrong direction.
    return false
  }
}

export function readLastSyncAt(): string | null {
  try {
    return window.localStorage.getItem(LAST_SYNC_KEY)
  } catch {
    return null
  }
}

function markSynced(): void {
  try {
    window.localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
  } catch {
    /* the stamp is a display nicety; sync itself is unaffected */
  }
  notify()
}

// --- Document assembly ------------------------------------------------------

/**
 * This device's document. `updatedAt` is the later of the plan's own stamp and
 * the local-change clock that covers the three unstamped stores, so a device
 * that has only starred a stop still reads as newer than one that hasn't.
 */
export function localDoc(): SyncDocT {
  const plan = readTripPlan()
  const stamp = readLocalStamp()
  const updatedAt = plan.updatedAt > stamp ? plan.updatedAt : stamp
  return {
    version: 1,
    updatedAt,
    plan,
    favorites: readFavoriteIds(),
    visited: readVisitedIds(),
    notes: readStopNotes(),
  }
}

function applyRemote(parsed: ParsedSyncDoc): void {
  const { doc, unparseable } = parsed
  // One suppressed block: these writes are the server's data arriving, not the
  // user's edits, and stamping them would push this device straight back.
  //
  // A field the parse could not read is SKIPPED, not written: the repaired
  // document carries an empty placeholder for it, and writing that placeholder
  // over real data is how a single bad field on the server used to take out
  // every saved stop, visited mark, and note on this device (and then, via the
  // heal push, on all the others). The plan has always been protected this
  // way; the other three are protected the same way now.
  withRemoteApply(() => {
    if (doc.plan) replaceTripPlan(doc.plan)
    if (!unparseable.favorites) replaceFavoriteIds(doc.favorites)
    if (!unparseable.visited) replaceVisitedIds(doc.visited)
    if (!unparseable.notes) replaceStopNotes(doc.notes)
  })
  // Adopt the document's own stamp so this device now reads as exactly as
  // fresh as what it accepted — no newer, or it would push a needless echo.
  setLocalStamp(doc.updatedAt)
}

// --- The exchange -----------------------------------------------------------

type RemoteResponse = { doc: unknown; updatedAt?: string }

async function push(doc: SyncDocT): Promise<void> {
  await apiFetch('/api/trip/plan', {
    method: 'POST',
    body: JSON.stringify({ doc, updatedAt: doc.updatedAt }),
  })
}

function hasPlanItems(doc: SyncDocT): boolean {
  return (doc.plan?.items.length ?? 0) > 0
}

async function doSync(): Promise<void> {
  if (!isSyncEnabled()) return
  if (!navigator.onLine) return
  // No session means no account to sync with. Skipping here rather than
  // letting the request 401 keeps a signed-out moment from being mistaken for
  // a revoked one and switching the preference off behind the user's back.
  if (!getStoredJwt()) return

  const remote = await apiFetch<RemoteResponse>('/api/trip/plan')
  const parsed = remote.doc ? parseSyncDoc(remote.doc) : null
  const mine = localDoc()

  // A salvaged document that lost nothing readable can be healed from here; one
  // that lost a field cannot. The loss is almost always a NEWER build's shape,
  // and pushing our version of a field we could not read destroys it and
  // re-clobbers it on every pass. This used to guard the plan alone, which left
  // the other three fields to be overwritten by whatever the salvage produced.
  const canHeal = parsed != null && parsed.salvaged && !anyUnparseable(parsed.unparseable)

  if (parsed && parsed.doc.updatedAt > mine.updatedAt) {
    applyRemote(parsed)
    // Adopting the server's stamp leaves the two reading as identical, so
    // nothing would ever push the good plan or heal the broken copy. Push the
    // merged document instead. localDoc() is re-read so the push carries the
    // favorites/visited/notes just accepted.
    if (canHeal && hasPlanItems(mine)) await push(localDoc())
    markSynced()
    return
  }
  if (parsed && parsed.doc.updatedAt === mine.updatedAt) {
    // Already in step; a push would only cost a KV write. Unless the stamps
    // match because a salvage happened on an earlier pass and this device is
    // wedged against a server copy that lost its plan, in which case the push
    // below is the only thing that can heal it.
    if (!(canHeal && hasPlanItems(mine))) {
      markSynced()
      return
    }
  }

  await push(mine)
  markSynced()
}

/** Run one exchange now. Rejects on failure; callers decide whether to care. */
export function syncNow(): Promise<void> {
  const run = chain.then(() => doSync())
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

function scheduleSync(): void {
  if (!isSyncEnabled()) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    void syncNow().catch(() => {
      /* offline or transient: the next edit or online event retries */
    })
  }, DEBOUNCE_MS)
}

// --- Turning it on and off --------------------------------------------------

/**
 * Enable sync and do the first exchange. Rethrows so the settings card can
 * report a real failure — this is the one moment the user is watching.
 */
export async function enableSync(): Promise<void> {
  try {
    window.localStorage.setItem(ENABLED_KEY, '1')
  } catch {
    throw new Error('This browser is blocking storage, so sync cannot be turned on.')
  }
  notify()
  await syncNow()
}

/**
 * Stop syncing and drop the server copy. Local state is untouched on purpose:
 * turning sync off must never look like losing the trip. A failed delete still
 * disables locally — the record ages out of KV on its own TTL.
 */
export async function disableSync(): Promise<void> {
  try {
    window.localStorage.setItem(ENABLED_KEY, '0')
    window.localStorage.removeItem(LAST_SYNC_KEY)
  } catch {
    /* the in-flight disable below is what matters */
  }
  clearTimeout(timer)
  notify()
  try {
    await apiFetch('/api/trip/plan', { method: 'DELETE' })
  } catch {
    /* offline: the server copy expires on its own TTL */
  }
}

/** Idempotent; called once at app boot. */
export function startPlanSync(): void {
  if (started) return
  started = true

  subscribeTripPlan(scheduleSync)
  subscribeFavorites(scheduleSync)
  subscribeVisited(scheduleSync)
  subscribeStopNotes(scheduleSync)

  window.addEventListener('online', () => {
    void syncNow().catch(() => {})
  })

  // Catch up on edits made offline, and pull anything the other device wrote.
  void syncNow().catch((err) => {
    // A dead session (signed out, revoked, expired) will never succeed on
    // retry. Sync goes quiet rather than hammering a 401 on every edit; the
    // /account card shows it as off, which is the truth.
    if (err instanceof ApiError && (err.status === 401 || err.status === 403 || err.status === 410)) {
      try {
        window.localStorage.setItem(ENABLED_KEY, '0')
      } catch {
        /* nothing more to do */
      }
      notify()
    }
  })
}
