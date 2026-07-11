// =============================================================================
// Google Calendar push client. The Worker (workers/src/routes/calendar.ts) runs
// the OAuth flow and holds the refresh token; the app only ever learns whether
// it's connected, to which address, and when it last synced. Response types are
// mirrored by hand per repo convention — no shared package.
//
// The connection record here is a lightweight local mirror for offline render
// and the auto-sync gate. It holds NO tokens; the server is the source of
// truth, and fetchGoogleStatus() reconciles this mirror whenever online.
// =============================================================================

import { apiFetch, ApiError } from '../lib/api'
import { slottedToEventFields } from './ics'
import { slotPlan } from './slotting'
import { readTripPlan } from './useTripPlan'

// The event shape the Worker's zod schema accepts: EventFields minus coord and
// allDay (Google has no geo field; the coordinate rides in location/text).
export type CalendarEventPayload = {
  uid: string
  summary: string
  description: string
  location?: string
  url?: string
  day: string
  startMin: number | null
  durationMin: number
}

export type GoogleCalInfo = {
  email?: string
  lastSyncAt: string // ISO timestamp of the last successful sync ('' if never)
}

const KEY = 'tfg.calendar.google'

export function readGoogleCalInfo(): GoogleCalInfo | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<GoogleCalInfo>
    if (typeof parsed.lastSyncAt === 'string') {
      return { email: parsed.email, lastSyncAt: parsed.lastSyncAt }
    }
  } catch {
    /* corrupt storage reads as "not connected" */
  }
  return null
}

function writeGoogleCalInfo(info: GoogleCalInfo): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(info))
  } catch {
    /* non-fatal: the connection survives server-side; status refetch re-learns it */
  }
}

/** Drop the local record (calendarSync clears it when the server says the
 * connection is gone). The server-side grant is untouched. */
export function clearGoogleCalInfo(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* non-fatal */
  }
}

/** Kick off the OAuth flow. A top-level redirect (not a popup) is PWA-safe on
 * iOS standalone and dodges popup blockers; the JWT lives in localStorage, so
 * the session survives the round-trip back to /account. */
export async function startGoogleConnect(): Promise<void> {
  const { authUrl } = await apiFetch<{ authUrl: string }>('/api/calendar/google/start', {
    method: 'POST',
  })
  window.location.assign(authUrl)
}

type StatusResponse = {
  connected: boolean
  email?: string | null
  lastSyncAt?: string | null
  eventCount?: number
}

/** Ask the server whether this account is connected and refresh the local
 * mirror. Returns the server's view; callers use `connected` to render. */
export async function fetchGoogleStatus(): Promise<StatusResponse> {
  const status = await apiFetch<StatusResponse>('/api/calendar/google/status')
  if (status.connected) {
    writeGoogleCalInfo({
      email: status.email ?? undefined,
      lastSyncAt: status.lastSyncAt ?? '',
    })
  } else {
    clearGoogleCalInfo()
  }
  return status
}

/** The current plan as the wire payload: slotted, resolved to event fields,
 * stripped to what Google needs. Unresolvable stops (deleted content) drop. */
export function buildCalendarPayload(): CalendarEventPayload[] {
  const events: CalendarEventPayload[] = []
  for (const slottedItems of slotPlan(readTripPlan().items).values()) {
    for (const slotted of slottedItems) {
      const f = slottedToEventFields(slotted)
      if (!f) continue
      events.push({
        uid: f.uid,
        summary: f.summary,
        description: f.description,
        location: f.location,
        url: f.url,
        day: f.day,
        startMin: f.startMin,
        durationMin: f.durationMin,
      })
    }
  }
  return events
}

/** Push the current plan to Google. Throws ApiError on failure (callers decide
 * whether to surface or swallow); 410 means the server dropped the connection. */
export async function syncGoogleCalendarNow(): Promise<void> {
  const events = buildCalendarPayload()
  const res = await apiFetch<{ ok: true; lastSyncAt: string }>(
    '/api/calendar/google/sync',
    { method: 'POST', body: JSON.stringify({ events }) },
    // The Worker fans out to Google per event; give the round trip extra headroom.
    { timeoutMs: 30_000 },
  )
  const prev = readGoogleCalInfo()
  writeGoogleCalInfo({ email: prev?.email, lastSyncAt: res.lastSyncAt })
}

/** Disconnect: the server deletes the events it created and revokes the grant.
 * A dead session (401/410) means it's effectively already gone, so treat that
 * as success. A transient error rethrows WITHOUT clearing, so the card keeps
 * showing "connected" and the user can retry rather than being left in limbo. */
export async function disconnectGoogleCalendar(): Promise<void> {
  try {
    await apiFetch('/api/calendar/google', { method: 'DELETE' })
  } catch (err) {
    const alreadyGone =
      err instanceof ApiError && (err.status === 401 || err.status === 410)
    if (!alreadyGone) throw err
  }
  clearGoogleCalInfo()
}
