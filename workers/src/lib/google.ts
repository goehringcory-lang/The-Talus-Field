// =============================================================================
// Google OAuth + Calendar API client, raw fetch and SDK-free (same shape as
// lib/stripe.ts: guard on the missing secret, form-encoded token calls, throw
// on a non-ok response). Powers /api/calendar/google/*, which pushes the trip
// plan into the buyer's primary Google calendar and keeps it reconciled.
//
// The client id/secret are optional bindings; callers check them before
// reaching here, but the token calls guard again so a misconfig fails loud.
// =============================================================================

import type { Env } from '../env'

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke'
const CALENDAR_EVENTS_ENDPOINT =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events'

// Write to the buyer's own calendar events, plus the two non-sensitive
// identity scopes so we can show which Google account is connected.
const SCOPES = 'openid email https://www.googleapis.com/auth/calendar.events'

// America/Los_Angeles: the whole guide is Pacific. Google resolves DST from the
// timeZone field, so we send naive local times and let Google apply the offset.
const TZID = 'America/Los_Angeles'

// The private extendedProperty every pushed event carries, so a disconnect can
// find and delete strays even if the KV mapping was lost.
const TFG_TAG_KEY = 'tfgTrip'
const TFG_TAG_VALUE = '1'

/** True when a usable OAuth client is bound. The committed wrangler.toml ships
 * a REPLACE_WITH placeholder client id, which is truthy: a plain truthiness
 * check would pass it and send buyers to a dead Google "invalid_client" page.
 * Treat the placeholder as unconfigured so /start 503s and the PWA can offer
 * the feed-subscription fallback instead. */
export function isGoogleOAuthConfigured(env: Env): boolean {
  return Boolean(
    env.GOOGLE_OAUTH_CLIENT_ID &&
      env.GOOGLE_OAUTH_CLIENT_SECRET &&
      !env.GOOGLE_OAUTH_CLIENT_ID.startsWith('REPLACE_WITH'),
  )
}

/** Google reports a refresh token is dead (user revoked access, or it aged out
 * of a Testing-mode consent screen). The account's connection should be purged. */
export class GoogleAuthRevokedError extends Error {
  constructor(message = 'Google access was revoked') {
    super(message)
    this.name = 'GoogleAuthRevokedError'
  }
}

/** An insert hit an existing event id (Google keeps deleted ids in a
 * `cancelled` state). The caller resurrects it with a full PUT. */
export class GoogleConflictError extends Error {
  constructor(message = 'Event already exists') {
    super(message)
    this.name = 'GoogleConflictError'
  }
}

/** An update targeted an id Google no longer has. The caller re-inserts. */
export class GoogleNotFoundError extends Error {
  constructor(message = 'Event not found') {
    super(message)
    this.name = 'GoogleNotFoundError'
  }
}

// The normalized event the client sends and we render into a Google event.
// Mirrors the PWA's EventFields minus the fields Google has no home for (coord
// rides inside location/description text already).
export type CalendarEventPayload = {
  uid: string
  summary: string
  description: string
  location?: string
  url?: string
  day: string              // YYYY-MM-DD
  startMin: number | null  // minutes from midnight; null = all-day
  durationMin: number
}

type GoogleEventDate = { date: string } | { dateTime: string; timeZone: string }

type GoogleEventResource = {
  id: string
  status: 'confirmed'
  summary: string
  description?: string
  location?: string
  start: GoogleEventDate
  end: GoogleEventDate
  reminders: { useDefault: false; overrides: Array<{ method: 'popup'; minutes: number }> }
  source?: { title: string; url: string }
  extendedProperties: { private: Record<string, string> }
}

// --- OAuth -----------------------------------------------------------------

/** The Google consent URL to send the buyer to. `access_type=offline` +
 * `prompt=consent` guarantee a refresh token on every grant, including
 * reconnects (Google otherwise omits it on a repeat authorization). */
export function googleAuthUrl(
  env: Env,
  args: { state: string; redirectUri: string },
): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_OAUTH_CLIENT_ID ?? '',
    redirect_uri: args.redirectUri,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: args.state,
  })
  return `${AUTH_ENDPOINT}?${params.toString()}`
}

function requireOAuthConfig(env: Env): { clientId: string; clientSecret: string } {
  if (!env.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET) {
    throw new Error('Google OAuth is not configured')
  }
  return {
    clientId: env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
  }
}

/** Exchange an authorization code for tokens. Returns the refresh token (the
 * long-lived secret we store), a first access token, and the connected email
 * decoded from the id_token. */
export async function exchangeCodeForTokens(
  env: Env,
  args: { code: string; redirectUri: string },
): Promise<{ refreshToken: string; accessToken: string; expiresIn: number; email?: string }> {
  const { clientId, clientSecret } = requireOAuthConfig(env)
  const body = new URLSearchParams({
    code: args.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: args.redirectUri,
    grant_type: 'authorization_code',
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Google token exchange failed (${res.status}): ${detail}`)
  }
  const json = (await res.json()) as {
    access_token: string
    expires_in: number
    refresh_token?: string
    id_token?: string
  }
  if (!json.refresh_token) {
    // Should not happen with prompt=consent, but never store a connection we
    // can't refresh later.
    throw new Error('Google token exchange returned no refresh token')
  }
  return {
    refreshToken: json.refresh_token,
    accessToken: json.access_token,
    expiresIn: json.expires_in,
    email: json.id_token ? decodeIdTokenEmail(json.id_token) : undefined,
  }
}

/** Trade the refresh token for a fresh access token. `invalid_grant` means the
 * grant is gone → GoogleAuthRevokedError so the caller purges the connection. */
export async function refreshAccessToken(
  env: Env,
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const { clientId, clientSecret } = requireOAuthConfig(env)
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const detail = await res.text()
    if (res.status === 400 && detail.includes('invalid_grant')) {
      throw new GoogleAuthRevokedError()
    }
    throw new Error(`Google token refresh failed (${res.status}): ${detail}`)
  }
  const json = (await res.json()) as { access_token: string; expires_in: number }
  return { accessToken: json.access_token, expiresIn: json.expires_in }
}

/** Best-effort revoke at Google. A 400 means the token is already gone, which
 * is the outcome we want, so it is not an error. */
export async function revokeToken(refreshToken: string): Promise<void> {
  try {
    await fetch(REVOKE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: refreshToken }).toString(),
    })
  } catch {
    /* network hiccup on disconnect: the local + KV state is already cleared */
  }
}

// The id_token is a JWT straight from Google's token endpoint over TLS in a
// server-to-server response, so the payload is trustworthy without verifying
// the signature — we only read the email claim for display.
function decodeIdTokenEmail(idToken: string): string | undefined {
  try {
    const segment = idToken.split('.')[1]
    if (!segment) return undefined
    const b64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const claims = JSON.parse(atob(padded)) as { email?: string }
    return typeof claims.email === 'string' ? claims.email : undefined
  } catch {
    return undefined
  }
}

// --- Calendar API ----------------------------------------------------------

/** Insert one event with a caller-chosen id. Throws GoogleConflictError when
 * the id already exists (including a previously deleted/cancelled event). */
export async function insertEvent(
  accessToken: string,
  event: GoogleEventResource,
): Promise<void> {
  const res = await fetch(CALENDAR_EVENTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
  if (res.ok) return
  if (res.status === 409) throw new GoogleConflictError()
  await throwCalendarError('insert', res)
}

/** Full replace of an event (PUT). A confirmed status un-cancels a resurrected
 * id. Throws GoogleNotFoundError when the id is gone so the caller re-inserts. */
export async function updateEvent(
  accessToken: string,
  eventId: string,
  event: GoogleEventResource,
): Promise<void> {
  const res = await fetch(`${CALENDAR_EVENTS_ENDPOINT}/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
  if (res.ok) return
  if (res.status === 404 || res.status === 410) throw new GoogleNotFoundError()
  await throwCalendarError('update', res)
}

/** Delete an event. A 404/410 means it is already gone, which counts as done. */
export async function deleteEvent(accessToken: string, eventId: string): Promise<void> {
  const res = await fetch(`${CALENDAR_EVENTS_ENDPOINT}/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.ok || res.status === 404 || res.status === 410) return
  await throwCalendarError('delete', res)
}

/** Every event id we've ever tagged, across pages. Used by disconnect to sweep
 * strays the KV mapping might have missed. */
export async function listTfgEventIds(accessToken: string): Promise<string[]> {
  const ids: string[] = []
  let pageToken: string | undefined
  do {
    const params = new URLSearchParams({
      privateExtendedProperty: `${TFG_TAG_KEY}=${TFG_TAG_VALUE}`,
      showDeleted: 'false',
      maxResults: '250',
    })
    if (pageToken) params.set('pageToken', pageToken)
    const res = await fetch(`${CALENDAR_EVENTS_ENDPOINT}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) await throwCalendarError('list', res)
    const json = (await res.json()) as {
      items?: Array<{ id?: string }>
      nextPageToken?: string
    }
    for (const item of json.items ?? []) {
      if (item.id) ids.push(item.id)
    }
    pageToken = json.nextPageToken
  } while (pageToken)
  return ids
}

async function throwCalendarError(op: string, res: Response): Promise<never> {
  const detail = await res.text()
  throw new Error(`Google Calendar ${op} failed (${res.status}): ${detail}`)
}

// --- Mapping ---------------------------------------------------------------

/** Render a normalized payload into a Google event resource with a fixed id. */
export function toGoogleEvent(ev: CalendarEventPayload, eventId: string): GoogleEventResource {
  const timed = ev.startMin !== null
  const start: GoogleEventDate = timed
    ? { dateTime: dtLocal(ev.day, ev.startMin as number), timeZone: TZID }
    : { date: ev.day }
  const end: GoogleEventDate = timed
    ? { dateTime: dtLocal(ev.day, (ev.startMin as number) + ev.durationMin), timeZone: TZID }
    : { date: addDays(ev.day, 1) } // all-day DTEND is exclusive: [day, day+1)

  return {
    id: eventId,
    status: 'confirmed',
    summary: ev.summary,
    description: ev.description || undefined,
    location: ev.location || undefined,
    start,
    end,
    // A 30-minute popup on timed events mirrors the ICS VALARM; all-day events
    // get none so the calendar doesn't fire an alert the night before.
    reminders: timed
      ? { useDefault: false, overrides: [{ method: 'popup', minutes: 30 }] }
      : { useDefault: false, overrides: [] },
    source: ev.url ? { title: 'The Talus Field', url: ev.url } : undefined,
    extendedProperties: { private: { [TFG_TAG_KEY]: TFG_TAG_VALUE } },
  }
}

/** Deterministic Google event id for a plan item: sha256 hex of the UID. Hex
 * (0-9a-f) is a subset of Google's required base32hex id alphabet, and 64 chars
 * sits inside the 5-1024 length window, so a retried insert can't duplicate. */
export function googleEventId(uid: string): Promise<string> {
  return sha256Hex(uid)
}

/** Content hash of an event, so a sync skips a PUT when nothing changed. Fixed
 * field order keeps it stable across runs. */
export function eventHash(ev: CalendarEventPayload): Promise<string> {
  const canonical = JSON.stringify([
    ev.summary,
    ev.description,
    ev.location ?? '',
    ev.url ?? '',
    ev.day,
    ev.startMin,
    ev.durationMin,
  ])
  return sha256Hex(canonical)
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Naive local wall-clock 'YYYY-MM-DDTHH:MM:00' for Google's timed events. An
// event running past midnight (a late program + duration) rolls the date
// forward so DTEND never lands before DTSTART. Mirrors ics.ts dtLocal().
function dtLocal(day: string, minutes: number): string {
  const dayOffset = Math.floor(minutes / 1440)
  const dayStr = dayOffset > 0 ? addDays(day, dayOffset) : day
  const timeOfDay = ((minutes % 1440) + 1440) % 1440
  const hh = String(Math.floor(timeOfDay / 60)).padStart(2, '0')
  const mm = String(timeOfDay % 60).padStart(2, '0')
  return `${dayStr}T${hh}:${mm}:00`
}
