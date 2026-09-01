// =============================================================================
// Push notification opt-in.
//
// Two notices exist and no more (workers/src/lib/pushSweep.ts): a morning-of
// nudge on each day of the trip, and a heads-up when access is about to end.
// The bar is deliberately high — this audience installed a field guide, not a
// marketing channel, and the fastest way to lose a notification permission
// forever is to spend it on something nobody asked about.
//
// Off by default, and the permission prompt is only ever raised from a real
// tap on the Account page. A cold prompt on first launch is the single most
// reliable way to get denied permanently, and a denial cannot be undone from
// the page — the user has to go into browser settings, which most never will.
//
// The whole feature is optional at every level: no VAPID keys on the Worker,
// no Push API in the browser, no permission, or a failed subscribe all end in
// the same place — the card explains why and nothing else in the app changes.
// =============================================================================

import { apiFetch } from '../lib/api'
import { readTripDates } from '../programs/usePrograms'
import { serviceWorkerReady } from '../pwa/swReady'
import { subscribeTripPlan } from '../trip/useTripPlan'

const ENABLED_KEY = 'tfg.push.enabled'

export type PushSupport =
  | { supported: true }
  | { supported: false; reason: string }

/** Whether this browser can do web push at all. */
export function pushSupport(): PushSupport {
  if (typeof window === 'undefined') return { supported: false, reason: 'No browser context.' }
  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'This browser has no service worker support.' }
  }
  if (!('PushManager' in window)) {
    return { supported: false, reason: 'This browser does not support push notifications.' }
  }
  if (!('Notification' in window)) {
    return { supported: false, reason: 'This browser does not support notifications.' }
  }
  // iOS grants the Push API only to a home-screen install, and a subscribe
  // from a Safari tab fails with an opaque error. Saying so up front is more
  // useful than letting the user tap into that wall.
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  const isIos = /iP(hone|ad|od)/.test(navigator.userAgent)
  if (isIos && !standalone) {
    return {
      supported: false,
      reason: 'On iPhone and iPad, notifications work once the guide is added to the Home Screen.',
    }
  }
  return { supported: true }
}

export function permissionState(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export function isPushEnabled(): boolean {
  try {
    return window.localStorage.getItem(ENABLED_KEY) === '1'
  } catch {
    return false
  }
}

function setEnabledFlag(on: boolean): void {
  try {
    window.localStorage.setItem(ENABLED_KEY, on ? '1' : '0')
  } catch {
    /* the server-side subscription is the real state; this is a UI hint */
  }
}

// The Push API wants the VAPID public key as raw bytes, not base64url. Returns
// an ArrayBuffer rather than a Uint8Array: applicationServerKey is typed
// BufferSource, which a Uint8Array over a possibly-shared buffer doesn't satisfy.
function b64urlToBytes(value: string): ArrayBuffer {
  const padded = (value + '='.repeat((4 - (value.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const binary = atob(padded)
  const buffer = new ArrayBuffer(binary.length)
  const out = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return buffer
}

function keyFromSubscription(sub: PushSubscription, name: 'p256dh' | 'auth'): string | undefined {
  const raw = sub.getKey(name)
  if (!raw) return undefined
  let binary = ''
  for (const b of new Uint8Array(raw)) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// `serviceWorker.ready` can hang forever (see pwa/swReady.ts), and the card's
// busy state was waiting on it. The message is what NotificationsCard renders
// for a thrown Error.
async function swRegistration(): Promise<ServiceWorkerRegistration> {
  const registration = await serviceWorkerReady()
  if (!registration) {
    throw new Error('The app is still starting up. Try again in a moment.')
  }
  return registration
}

/**
 * Register this device. Raises the browser permission prompt if it hasn't been
 * answered, so it MUST be called from a user gesture. Throws with copy the
 * card can show; the caller owns the error state.
 */
export async function enablePush(): Promise<void> {
  const support = pushSupport()
  if (!support.supported) throw new Error(support.reason)

  const { key } = await apiFetch<{ key: string }>('/api/push/key').catch(() => {
    throw new Error('Notifications are not switched on for this guide yet.')
  })
  if (!key) throw new Error('Notifications are not switched on for this guide yet.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error(
      permission === 'denied'
        ? 'Notifications are blocked for this site. Turn them back on in your browser settings.'
        : 'Notifications need permission to work.',
    )
  }

  const registration = await swRegistration()
  // Reuse an existing subscription rather than minting a second endpoint for
  // the same device; subscribing twice leaves an orphan the sweeps keep
  // pushing to until the push service reports it gone.
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      // Required by Chrome: a subscription that could deliver a silent push
      // is rejected outright.
      userVisibleOnly: true,
      applicationServerKey: b64urlToBytes(key),
    }))

  await apiFetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionBody(subscription)),
  })
  setEnabledFlag(true)
}

function subscriptionBody(subscription: PushSubscription) {
  const dates = readTripDates()
  return {
    endpoint: subscription.endpoint,
    p256dh: keyFromSubscription(subscription, 'p256dh'),
    auth: keyFromSubscription(subscription, 'auth'),
    // The only planner state that leaves the device outside the opaque sync
    // document, and only because a morning-of nudge can't be scheduled
    // without knowing which mornings. What is planned never goes.
    tripStart: dates?.start,
    tripEnd: dates?.end,
  }
}

/**
 * Stop notifications: drop the browser subscription and the server record.
 * The browser permission itself is left alone — only the user can revoke that,
 * and re-enabling later should not need a second prompt.
 */
export async function disablePush(): Promise<void> {
  setEnabledFlag(false)
  try {
    const registration = await swRegistration()
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return
    // Tell the Worker before unsubscribing: once the local subscription is
    // gone we no longer know the endpoint to delete server-side, and the
    // sweep would keep pushing until the push service reported it dead.
    await apiFetch('/api/push/subscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).catch(() => {
      /* offline: the record dies on its own TTL, or on the next 410 */
    })
    await subscription.unsubscribe()
  } catch {
    /* already gone, or no service worker: the flag above is what the UI reads */
  }
}

/**
 * Re-register at boot so the server record keeps its TTL and its copy of the
 * trip dates current. Silent and best-effort: never prompts (a subscription
 * only exists if permission was granted once), never surfaces an error.
 * Idempotent; called once from main.tsx.
 */
export async function refreshPushSubscription(): Promise<void> {
  if (!isPushEnabled()) return
  if (!pushSupport().supported) return
  if (permissionState() !== 'granted') return
  if (!navigator.onLine) return
  try {
    const registration = await swRegistration()
    const subscription = await registration.pushManager.getSubscription()
    // No subscription despite the flag means the browser dropped it (data
    // cleared, endpoint rotated). Don't resubscribe behind the user's back —
    // the Account card will show it as off and offer the tap.
    if (!subscription) {
      setEnabledFlag(false)
      return
    }
    await apiFetch('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionBody(subscription)),
    })
  } catch {
    /* offline or a dead session: retried on the next boot */
  }
}

// Trip dates change (someone moves the trip a week later) and the server copy
// has to follow, or the morning nudge fires on the old days. Debounced so
// dragging the date pickers is one write.
const DATE_SYNC_DEBOUNCE_MS = 5000
let dateTimer: ReturnType<typeof setTimeout> | undefined
let started = false

/** Idempotent; called once at app boot. No-op until notifications are on. */
export function startPushSync(): void {
  if (started) return
  started = true

  void refreshPushSubscription()

  subscribeTripPlan(() => {
    if (!isPushEnabled()) return
    clearTimeout(dateTimer)
    dateTimer = setTimeout(() => void refreshPushSubscription(), DATE_SYNC_DEBOUNCE_MS)
  })
}
