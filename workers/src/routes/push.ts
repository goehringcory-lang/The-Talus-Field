// =============================================================================
// Web push subscription management for the PWA.
//
//   GET    /api/push/key       public VAPID key (unauthenticated; it is public)
//   POST   /api/push/subscribe register this device, JWT-gated
//   POST   /api/push/pending   what the push that just woke me was about
//   DELETE /api/push/subscribe unregister this device, JWT-gated
//
// /pending is the one route here without a JWT, and deliberately: it is called
// from the service worker's push handler, which has no access to localStorage
// and therefore no token. Its auth is the endpoint itself — a 100+ character
// capability URL minted by the push service, and already the credential that
// lets anyone send a push to that device. Presenting it proves at least as
// much as a JWT would, and the route only ever returns a notice the Worker
// itself queued moments earlier. See lib/push.ts for why pushes carry no
// payload in the first place.
// =============================================================================

import { Hono } from 'hono'
import type { Env } from '../env'
import {
  deletePushSubscription,
  getBuyer,
  getPushSubscription,
  hashEndpoint,
  putPushSubscription,
  takePushPending,
} from '../lib/kv'
import { isPushConfigured } from '../lib/push'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'

export const push = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

type PushBody = {
  endpoint?: unknown
  p256dh?: unknown
  auth?: unknown
  tripStart?: unknown
  tripEnd?: unknown
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
// Real endpoints run 100-250 characters; the ceiling just bounds what a
// hostile caller can hand the hasher and store.
const MAX_ENDPOINT_LENGTH = 1024

// Push services live on a handful of vendor origins. Restricting to https and
// bounding the length is the useful check here; an allow-list of hosts would
// break the moment a browser vendor moved its service.
function isPlausibleEndpoint(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > MAX_ENDPOINT_LENGTH) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

push.get('/key', (c) => {
  if (!isPushConfigured(c.env)) {
    return c.json({ error: 'Push is not configured' }, 503)
  }
  return c.json({ key: c.env.VAPID_PUBLIC_KEY })
})

push.post('/subscribe', requireAuth, async (c) => {
  if (!isPushConfigured(c.env)) {
    return c.json({ error: 'Push is not configured' }, 503)
  }

  const body = await c.req
    .json<PushBody>()
    .catch(() => ({}) as PushBody)

  if (!isPlausibleEndpoint(body.endpoint)) {
    return c.json({ error: 'Invalid subscription' }, 400)
  }

  const sub = c.get('authSub')

  // Same convention as every other account-scoped route: a buyer past
  // expiresAt has lost access; no buyer record is an operator session.
  const buyer = await getBuyer(c.env, sub)
  if (buyer && buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 410)
  }

  const endpointHash = await hashEndpoint(body.endpoint)
  const existing = await getPushSubscription(c.env, endpointHash)

  await putPushSubscription(c.env, endpointHash, {
    sub,
    endpoint: body.endpoint,
    p256dh: typeof body.p256dh === 'string' ? body.p256dh : undefined,
    auth: typeof body.auth === 'string' ? body.auth : undefined,
    // Re-subscribing (which the app does on every boot to refresh the TTL)
    // keeps the original date so "since" stays meaningful.
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    tripStart: typeof body.tripStart === 'string' && DATE_RE.test(body.tripStart)
      ? body.tripStart
      : undefined,
    tripEnd: typeof body.tripEnd === 'string' && DATE_RE.test(body.tripEnd)
      ? body.tripEnd
      : undefined,
  })

  return c.json({ ok: true })
})

// Called by the service worker on a push wake-up. Unauthenticated by
// necessity (see the header note); the endpoint is the capability.
push.post('/pending', async (c) => {
  const body = await c.req.json<PushBody>().catch(() => ({}) as PushBody)
  if (!isPlausibleEndpoint(body.endpoint)) {
    return c.json({ notice: null }, 400)
  }
  const endpointHash = await hashEndpoint(body.endpoint)
  // Single use: a collected notice is gone, so a second wake-up on the same
  // endpoint shows the generic fallback rather than repeating itself.
  const notice = await takePushPending(c.env, endpointHash)
  return c.json({ notice }, 200, { 'Cache-Control': 'no-store' })
})

push.delete('/subscribe', requireAuth, async (c) => {
  const body = await c.req.json<PushBody>().catch(() => ({}) as PushBody)
  if (!isPlausibleEndpoint(body.endpoint)) {
    return c.json({ error: 'Invalid subscription' }, 400)
  }
  const endpointHash = await hashEndpoint(body.endpoint)

  // Only the owner may unregister a device. Without this check the endpoint
  // (which travels to the push service and back) would be enough to
  // unsubscribe someone else's phone.
  const existing = await getPushSubscription(c.env, endpointHash)
  if (existing && existing.sub.toLowerCase() !== c.get('authSub').toLowerCase()) {
    return c.json({ error: 'Not found' }, 404)
  }

  await deletePushSubscription(c.env, endpointHash)
  return c.json({ ok: true })
})
