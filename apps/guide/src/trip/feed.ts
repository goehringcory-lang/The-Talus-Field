// =============================================================================
// Hosted calendar feed client. The Worker stores the rendered ICS under a
// capability token (workers/src/routes/trip.ts); calendar apps subscribe to
// the resulting URL and poll it on their own schedule. Response types are
// mirrored by hand per repo convention — no shared package.
// =============================================================================

import { apiFetch } from '../lib/api'

export type TripFeedInfo = {
  token: string
  feedUrl: string
  updatedAt: string // ISO timestamp of the last successful publish
}

const FEED_KEY = 'tfg.trip.feed'

export function readFeedInfo(): TripFeedInfo | null {
  try {
    const raw = window.localStorage.getItem(FEED_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TripFeedInfo>
    if (
      typeof parsed.token === 'string' &&
      typeof parsed.feedUrl === 'string' &&
      typeof parsed.updatedAt === 'string'
    ) {
      return parsed as TripFeedInfo
    }
  } catch {
    /* corrupt storage reads as "no feed" */
  }
  return null
}

function writeFeedInfo(info: TripFeedInfo): void {
  try {
    window.localStorage.setItem(FEED_KEY, JSON.stringify(info))
  } catch {
    /* non-fatal: the subscription survives server-side; re-publish re-learns it */
  }
}

/** Drop the local feed record (feedSync clears it when the token is dead). */
export function clearFeedInfo(): void {
  try {
    window.localStorage.removeItem(FEED_KEY)
  } catch {
    /* non-fatal */
  }
}

/** Publish (or refresh) the hosted feed. The Worker reuses the account's token. */
export async function publishFeed(ics: string): Promise<TripFeedInfo> {
  const res = await apiFetch<{ token: string; feedUrl: string }>('/api/trip/feed', {
    method: 'POST',
    body: JSON.stringify({ ics }),
  })
  const info: TripFeedInfo = { ...res, updatedAt: new Date().toISOString() }
  writeFeedInfo(info)
  return info
}

/** Revoke the feed server-side; subscribed calendars 404 on their next poll. */
export async function revokeFeed(): Promise<void> {
  await apiFetch('/api/trip/feed', { method: 'DELETE' })
  clearFeedInfo()
}

/** The same feed as a webcal:// link, which iOS and macOS open in Calendar. */
export function webcalUrl(feedUrl: string): string {
  return feedUrl.replace(/^https?:\/\//, 'webcal://')
}

/** Google Calendar's add-by-URL entry point for the feed. Takes the plain
 * https feed URL — Google's `cid` parameter expects http(s), not webcal. */
export function googleCalendarSubscribeUrl(feedUrl: string): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(feedUrl)}`
}
