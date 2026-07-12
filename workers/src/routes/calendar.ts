// =============================================================================
// Google Calendar push (/api/calendar/google/*). An OAuth code flow, handled
// entirely server-side, connects a buyer's Google account; the plan is then
// reconciled into their PRIMARY calendar and re-synced after every edit.
//
// Shape borrows from routes/trip.ts (JWT-gated writes, KV keyed by sub, an
// hourly write counter) with two twists Google forces: the OAuth callback is a
// top-level browser redirect with no Authorization header (a single-use `state`
// stored in KV is its auth), and the refresh token is a real secret that never
// leaves the Worker (the client only ever learns "connected" + the email).
// =============================================================================

import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../env'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import { generateAccessToken } from '../lib/tokens'
import {
  deleteGcalConnection,
  getBuyer,
  getGcalAccessToken,
  getGcalConnection,
  getGcalEventMap,
  putGcalAccessToken,
  putGcalConnection,
  putGcalEventMap,
  recordGcalSyncAttempt,
  takeGcalState,
  putGcalState,
  type GcalConnectionRecord,
  type GcalEventMap,
} from '../lib/kv'
import {
  GoogleAuthRevokedError,
  GoogleConflictError,
  GoogleNotFoundError,
  deleteEvent,
  eventHash,
  exchangeCodeForTokens,
  googleAuthUrl,
  googleEventId,
  insertEvent,
  isGoogleOAuthConfigured,
  listTfgEventIds,
  refreshAccessToken,
  revokeToken,
  toGoogleEvent,
  updateEvent,
  type CalendarEventPayload,
} from '../lib/google'

// The PWA re-pushes after every planner edit (debounced 4s), so the cap sits
// well above real usage while still stopping a scripted loop from hammering
// Google's API and KV.
const MAX_SYNC_WRITES_PER_HOUR = 30
// A trip is dozens of events; 300 is generous headroom over any real plan while
// bounding how much work one sync can fan out to Google.
const MAX_EVENTS = 300
const MAX_BODY_BYTES = 256 * 1024

// The client builds these from slottedToEventFields (minus coord/allDay, which
// Google has no field for). Values originate from our own bundled content, but
// validate anyway — this is an authenticated but untrusted body.
const CalendarEvent = z.object({
  uid: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  description: z.string().max(8000),
  location: z.string().max(1000).optional(),
  url: z.string().max(2000).optional(),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startMin: z.number().int().min(0).max(1440 * 2).nullable(),
  durationMin: z.number().int().min(0).max(1440 * 3),
})
const SyncBody = z.object({ events: z.array(CalendarEvent).max(MAX_EVENTS) })

export const calendar = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

function callbackUri(reqUrl: string): string {
  return `${new URL(reqUrl).origin}/api/calendar/google/callback`
}

// Begin the OAuth flow: mint a single-use state bound to this account, hand the
// PWA the Google consent URL to navigate to.
calendar.post('/google/start', requireAuth, async (c) => {
  // Placeholder-aware: the committed client id is a truthy REPLACE_WITH string,
  // and starting the flow with it strands the buyer on a Google error page.
  if (!isGoogleOAuthConfigured(c.env)) {
    return c.json({ error: 'Google Calendar is not configured' }, 503)
  }
  const sub = c.get('authSub')
  const state = generateAccessToken()
  await putGcalState(c.env, state, sub)
  return c.json({
    authUrl: googleAuthUrl(c.env, { state, redirectUri: callbackUri(c.req.url) }),
  })
})

// Google's redirect back. No JWT here — the single-use state carries identity.
// Every exit is a redirect to the Account page with a ?calendar= status so a
// human never sees raw JSON.
calendar.get('/google/callback', async (c) => {
  const appBase = c.env.APP_BASE_URL
  const accountUrl = (status: string) => `${appBase}/account?calendar=${status}`

  if (c.req.query('error')) return c.redirect(accountUrl('denied'))

  const code = c.req.query('code')
  const state = c.req.query('state')
  if (!code || !state) return c.redirect(accountUrl('error'))

  const sub = await takeGcalState(c.env, state)
  if (!sub) return c.redirect(accountUrl('error'))

  try {
    const tokens = await exchangeCodeForTokens(c.env, {
      code,
      redirectUri: callbackUri(c.req.url),
    })
    const record: GcalConnectionRecord = {
      sub,
      refreshToken: tokens.refreshToken,
      email: tokens.email,
      connectedAt: new Date().toISOString(),
    }
    await putGcalConnection(c.env, record)
    await putGcalAccessToken(c.env, sub, tokens.accessToken, tokens.expiresIn - 60)
    return c.redirect(accountUrl('connected'))
  } catch (err) {
    console.error('calendar callback: token exchange failed', err)
    return c.redirect(accountUrl('error'))
  }
})

// Is this account connected, and to which Google address? `configured` tells
// the PWA whether the OAuth connect path exists at all on this deployment, so
// it can render the feed-subscription fallback instead of a Connect button
// that is guaranteed to fail.
calendar.get('/google/status', requireAuth, async (c) => {
  const configured = isGoogleOAuthConfigured(c.env)
  const sub = c.get('authSub')
  const conn = await getGcalConnection(c.env, sub)
  if (!conn) return c.json({ connected: false, configured })
  const map = await getGcalEventMap(c.env, sub)
  return c.json({
    connected: true,
    configured,
    email: conn.email ?? null,
    lastSyncAt: map?.lastSyncAt || null,
    eventCount: map ? Object.keys(map.events).length : 0,
  })
})

// Push the desired event set into the buyer's primary calendar, reconciling
// against what we pushed before.
calendar.post('/google/sync', requireAuth, async (c) => {
  const sub = c.get('authSub')

  const raw = await c.req.text()
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return c.json({ error: 'Payload too large' }, 400)
  }
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }
  const parsed = SyncBody.safeParse(json)
  if (!parsed.success) return c.json({ error: 'Invalid calendar payload' }, 400)

  // Same convention as /api/trip: a buyer past expiresAt has lost access (a
  // Stripe refund sets expiresAt = now); a missing buyer record is an operator.
  const buyer = await getBuyer(c.env, sub)
  if (buyer && buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 410)
  }

  const conn = await getGcalConnection(c.env, sub)
  if (!conn) return c.json({ error: 'Not connected' }, 410)

  const attempts = await recordGcalSyncAttempt(c.env, sub)
  if (attempts > MAX_SYNC_WRITES_PER_HOUR) {
    return c.json({ error: 'Too many updates. Try again later.' }, 429)
  }

  try {
    const accessToken = await accessTokenFor(c.env, sub, conn)
    const counts = await reconcile(c.env, sub, accessToken, parsed.data.events)
    const map = await getGcalEventMap(c.env, sub)
    return c.json({
      ok: true,
      ...counts,
      lastSyncAt: map?.lastSyncAt ?? new Date().toISOString(),
    })
  } catch (err) {
    // The grant is gone (revoked at Google, or a Testing-mode token aged out):
    // purge the connection so the client flips back to "Connect".
    if (err instanceof GoogleAuthRevokedError) {
      await deleteGcalConnection(c.env, sub)
      return c.json({ error: 'Calendar disconnected' }, 410)
    }
    console.error('calendar sync failed', err)
    return c.json({ error: 'Sync failed' }, 502)
  }
})

// Disconnect: remove every event we created, revoke the grant at Google, drop
// all KV state. Idempotent — 200 even when nothing was connected.
calendar.delete('/google', requireAuth, async (c) => {
  const sub = c.get('authSub')
  const conn = await getGcalConnection(c.env, sub)
  if (!conn) return c.json({ ok: true })

  try {
    const accessToken = await accessTokenFor(c.env, sub, conn)
    // Delete by tag: catches both events in our map and any strays from a lost
    // map. showDeleted=false means the list only returns events still present.
    const ids = await listTfgEventIds(accessToken)
    for (const id of ids) {
      try {
        await deleteEvent(accessToken, id)
      } catch (err) {
        console.error('disconnect: event delete failed', err)
      }
    }
  } catch (err) {
    // GoogleAuthRevokedError: the grant is already gone, so we can't reach the
    // calendar — the buyer can clear leftovers from Google directly. Either way
    // we still revoke (no-op) and purge our own state below.
    if (!(err instanceof GoogleAuthRevokedError)) {
      console.error('disconnect: cleanup failed', err)
    }
  }

  await revokeToken(conn.refreshToken)
  await deleteGcalConnection(c.env, sub)
  return c.json({ ok: true })
})

// --- internals -------------------------------------------------------------

// A valid access token for the account: the KV cache when warm, otherwise a
// refresh (cached just short of its real expiry). May throw
// GoogleAuthRevokedError, which the callers translate into a purge.
async function accessTokenFor(
  env: Env,
  sub: string,
  conn: GcalConnectionRecord,
): Promise<string> {
  const cached = await getGcalAccessToken(env, sub)
  if (cached) return cached
  const { accessToken, expiresIn } = await refreshAccessToken(env, conn.refreshToken)
  await putGcalAccessToken(env, sub, accessToken, expiresIn - 60)
  return accessToken
}

// Reconcile the desired set against the stored uid→{id,hash} map: insert new
// events, PUT changed ones, delete dropped ones, skip unchanged. Deterministic
// ids make a retried insert idempotent; a 409 (id exists, possibly cancelled)
// falls back to a full PUT that resurrects it, and a 404 on update re-inserts.
// The map is persisted even if the loop throws partway, so the next sync
// resumes from real progress instead of redoing everything.
async function reconcile(
  env: Env,
  sub: string,
  accessToken: string,
  desired: CalendarEventPayload[],
): Promise<{ created: number; updated: number; deleted: number }> {
  const map: GcalEventMap = (await getGcalEventMap(env, sub)) ?? { events: {}, lastSyncAt: '' }

  // Duplicate uids can't really occur (eventUid is unique per item), but if one
  // slips through, last wins — matching the client's own de-dup.
  const desiredByUid = new Map<string, CalendarEventPayload>()
  for (const ev of desired) desiredByUid.set(ev.uid, ev)

  let created = 0
  let updated = 0
  let deleted = 0

  try {
    for (const [uid, ev] of desiredByUid) {
      const id = await googleEventId(uid)
      const hash = await eventHash(ev)
      const existing = map.events[uid]

      if (!existing) {
        await insertOrResurrect(accessToken, ev, id)
        map.events[uid] = { id, hash }
        created++
      } else if (existing.hash !== hash) {
        await updateOrInsert(accessToken, ev, id)
        map.events[uid] = { id, hash }
        updated++
      }
      // unchanged hash: nothing to do
    }

    for (const uid of Object.keys(map.events)) {
      if (!desiredByUid.has(uid)) {
        await deleteEvent(accessToken, map.events[uid].id)
        delete map.events[uid]
        deleted++
      }
    }
  } finally {
    map.lastSyncAt = new Date().toISOString()
    await putGcalEventMap(env, sub, map)
  }

  return { created, updated, deleted }
}

async function insertOrResurrect(
  accessToken: string,
  ev: CalendarEventPayload,
  id: string,
): Promise<void> {
  try {
    await insertEvent(accessToken, toGoogleEvent(ev, id))
  } catch (err) {
    // The id already exists (often a previously deleted event Google keeps in a
    // cancelled state): a full PUT overwrites and un-cancels it.
    if (err instanceof GoogleConflictError) {
      await updateEvent(accessToken, id, toGoogleEvent(ev, id))
      return
    }
    throw err
  }
}

async function updateOrInsert(
  accessToken: string,
  ev: CalendarEventPayload,
  id: string,
): Promise<void> {
  try {
    await updateEvent(accessToken, id, toGoogleEvent(ev, id))
  } catch (err) {
    // Our map thinks the event exists but Google doesn't have it (deleted from
    // the calendar app): recreate it.
    if (err instanceof GoogleNotFoundError) {
      await insertOrResurrect(accessToken, ev, id)
      return
    }
    throw err
  }
}
