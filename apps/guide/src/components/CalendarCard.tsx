// =============================================================================
// Account-page calendar connect. Three paths:
//   1. Google, direct — a real OAuth login (handled by the Worker). Events go
//      straight into the buyer's primary Google calendar and auto-sync on every
//      edit (trip/calendarSync.ts). Connect kicks off the OAuth redirect; the
//      return lands back here with ?calendar=connected|denied|error.
//   2. Google, by subscription — when the Worker reports the OAuth client is
//      not configured (or the route predates it), the section falls back to the
//      hosted ICS feed with Google's add-by-URL entry point, so the trip can
//      always be added to a personal Google calendar.
//   3. Apple — no write API exists, so this reuses the same hosted feed via a
//      webcal:// subscription (shared with the trip page's calendar sheet).
// The hosted feed is one record per account; its state is lifted here so the
// Google fallback and the Apple section stay in step.
// =============================================================================

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApiError } from '../lib/api'
import {
  disconnectGoogleCalendar,
  fetchGoogleStatus,
  readGoogleCalInfo,
  startGoogleConnect,
  syncGoogleCalendarNow,
} from '../trip/googleCalendar'
import { buildTripIcs } from '../trip/ics'
import {
  googleCalendarSubscribeUrl,
  publishFeed,
  readFeedInfo,
  revokeFeed,
  webcalUrl,
  type TripFeedInfo,
} from '../trip/feed'
import { slotPlan } from '../trip/slotting'
import { readTripPlan } from '../trip/useTripPlan'
import { relativeStamp } from '../utils/relativeStamp'
import Button from './ui/Button'

const noteStyle = { color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55, margin: '0 0 10px' } as const
const mutedStyle = { color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.55, margin: '6px 0 0' } as const

// The hosted feed, shared by the Google fallback and the Apple section. One
// feed per account, so publish/revoke state must be shared too or the two
// sections drift (publishing from one would leave the other stale).
type FeedControls = {
  feed: TripFeedInfo | null
  busy: boolean
  publish: () => Promise<void> // throws on failure; callers own the error copy
  stop: () => Promise<void>    // throws on failure; callers own the error copy
}

function useTripFeed(): FeedControls {
  const [feed, setFeed] = useState<TripFeedInfo | null>(() => readFeedInfo())
  const [busy, setBusy] = useState(false)

  async function publish() {
    setBusy(true)
    try {
      const ics = buildTripIcs(slotPlan(readTripPlan().items))
      setFeed(await publishFeed(ics))
    } finally {
      setBusy(false)
    }
  }

  async function stop() {
    setBusy(true)
    try {
      await revokeFeed()
      setFeed(null)
    } finally {
      setBusy(false)
    }
  }

  return { feed, busy, publish, stop }
}

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function CalendarCard() {
  const feedCtl = useTripFeed()
  return (
    <section aria-label="Calendar">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Calendar</div>
      <p style={noteStyle}>
        Put your trip plan on your own calendar. Connect Google to have events dropped straight
        in and kept in step with every edit, or subscribe from Apple Calendar.
      </p>
      <GoogleCalendarSection feedCtl={feedCtl} />
      <AppleCalendarSection feedCtl={feedCtl} />
    </section>
  )
}

// --- Google ----------------------------------------------------------------

type GoogleState =
  | { kind: 'loading' }
  | { kind: 'disconnected' }
  // The Worker has no usable OAuth client (or is an older deploy without the
  // calendar routes): direct connect cannot work, offer the feed subscription.
  | { kind: 'unavailable' }
  | { kind: 'connected'; email?: string; lastSyncAt: string }

// Seed from the local mirror so the card renders offline, then reconcile with
// the server on mount (the AccessStatusCard cached-then-fetch pattern).
function seedGoogle(): GoogleState {
  const local = readGoogleCalInfo()
  if (local) return { kind: 'connected', email: local.email, lastSyncAt: local.lastSyncAt }
  return navigator.onLine ? { kind: 'loading' } : { kind: 'disconnected' }
}

type GoogleNote = 'connected' | 'denied' | 'error' | 'disconnect-error' | null

function GoogleCalendarSection({ feedCtl }: { feedCtl: FeedControls }) {
  const [params, setParams] = useSearchParams()
  const calendarParam = params.get('calendar')
  const [state, setState] = useState<GoogleState>(seedGoogle)
  const [note, setNote] = useState<GoogleNote>(null)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const online = useOnline()

  // Reconcile the local mirror with the server on mount. Split from the return-
  // param effect below so StrictMode's cancel-then-remount doesn't strand the
  // card on "Checking…": the second run's fetch is what resolves the state.
  // Offline, the fetch rejects and the catch resolves the loading seed.
  useEffect(() => {
    let cancelled = false
    fetchGoogleStatus()
      .then((status) => {
        if (cancelled) return
        setState(
          status.connected
            ? { kind: 'connected', email: status.email ?? undefined, lastSyncAt: status.lastSyncAt ?? '' }
            : status.configured === false
              ? { kind: 'unavailable' }
              : { kind: 'disconnected' },
        )
      })
      .catch((err) => {
        if (cancelled) return
        // 404: a Worker deployed before the calendar routes existed. 503: the
        // routes exist but no OAuth client is bound. Neither can ever connect,
        // so show the subscription fallback instead of a doomed button.
        if (err instanceof ApiError && (err.status === 404 || err.status === 503)) {
          setState({ kind: 'unavailable' })
          return
        }
        setState((s) => (s.kind === 'loading' ? { kind: 'disconnected' } : s))
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Handle the OAuth return (?calendar=connected|denied|error), then strip the
  // param so a reload can't replay it. The strip changes `calendarParam` to
  // null, which re-runs this and hits the early return — no loop. Double-firing
  // under StrictMode is harmless: the sync and status fetch are idempotent.
  //
  // No cancellation flag, deliberately: the param strip below re-runs this
  // effect immediately, so a cleanup flag would fire before the status fetch
  // resolves and permanently skip the first calendar push — the card would
  // claim "syncing now" while pushing nothing until the next plan edit. The
  // work is idempotent and wanted even if the card unmounts mid-flight
  // (setState after unmount is a no-op).
  useEffect(() => {
    if (!calendarParam) return

    // All setState lives inside this async task (not the effect body) so it
    // doesn't trip the no-synchronous-setState-in-effect rule.
    void (async () => {
      if (calendarParam === 'denied') {
        setNote('denied')
      } else if (calendarParam === 'error') {
        setNote('error')
      } else if (calendarParam === 'connected') {
        setNote('connected')
        try {
          const status = await fetchGoogleStatus()
          if (!status.connected) return
          setState({
            kind: 'connected',
            email: status.email ?? undefined,
            lastSyncAt: status.lastSyncAt ?? '',
          })
          // First push of the current plan right after connecting.
          await syncGoogleCalendarNow()
          const local = readGoogleCalInfo()
          if (local) setState({ kind: 'connected', email: local.email, lastSyncAt: local.lastSyncAt })
        } catch {
          /* silent: calendarSync retries on the next edit or online event */
        }
      }
    })()

    // Strip the param so a reload can't replay it. This flips calendarParam to
    // null and re-runs the effect straight into the early return — no loop.
    const next = new URLSearchParams(params)
    next.delete('calendar')
    setParams(next, { replace: true })
  }, [calendarParam, params, setParams])

  async function connect() {
    setConnecting(true)
    setNote(null)
    try {
      // Navigates away on success; control only returns here on failure.
      await startGoogleConnect()
    } catch (err) {
      setConnecting(false)
      // Connect can never succeed against an unconfigured or older Worker:
      // swap to the subscription fallback rather than asking for a retry.
      if (err instanceof ApiError && (err.status === 404 || err.status === 503)) {
        setState({ kind: 'unavailable' })
        return
      }
      setNote('error')
    }
  }

  async function disconnect() {
    setDisconnecting(true)
    setNote(null)
    try {
      await disconnectGoogleCalendar()
      setState({ kind: 'disconnected' })
    } catch {
      setNote('disconnect-error')
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div style={{ marginTop: 4 }}>
      <div className="download-row__label">Google Calendar</div>

      {state.kind === 'connected' ? (
        <>
          <p style={noteStyle}>
            Connected{state.email ? ` as ${state.email}` : ''}. Trip changes sync automatically.
          </p>
          <p style={mutedStyle}>
            {state.lastSyncAt ? `Synced ${relativeStamp(state.lastSyncAt)}.` : 'Not synced yet.'}
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="quiet" onClick={disconnect} disabled={disconnecting}>
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </Button>
          </div>
          <p style={mutedStyle}>Disconnecting removes the trip events we added to Google.</p>
        </>
      ) : state.kind === 'loading' ? (
        <p style={mutedStyle}>Checking…</p>
      ) : state.kind === 'unavailable' ? (
        <GoogleFeedFallback feedCtl={feedCtl} online={online} />
      ) : (
        <>
          <p style={noteStyle}>
            Events land in your primary Google calendar and follow every edit you make here.
          </p>
          {online ? (
            <Button onClick={connect} disabled={connecting}>
              {connecting ? 'Opening Google…' : 'Connect Google Calendar'}
            </Button>
          ) : (
            <p style={mutedStyle}>Connecting needs a connection.</p>
          )}
        </>
      )}

      {note === 'connected' && (
        <p style={mutedStyle}>Connected. Your trip is syncing to Google Calendar now.</p>
      )}
      {note === 'denied' && (
        <p style={mutedStyle}>No changes made, you canceled on the Google screen.</p>
      )}
      {note === 'error' && <p className="form-error">Couldn't finish connecting. Try again.</p>}
      {note === 'disconnect-error' && (
        <p className="form-error">Couldn't reach the server to disconnect. Try again.</p>
      )}
    </div>
  )
}

// Direct connect is off (no OAuth client on the Worker), so Google gets the
// same hosted feed the Apple section uses, through Google's add-by-URL entry
// point. Once added, the calendar follows edits on Google's own refresh cycle.
function GoogleFeedFallback({ feedCtl, online }: { feedCtl: FeedControls; online: boolean }) {
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function setUp() {
    setError(null)
    try {
      await feedCtl.publish()
    } catch {
      setError('Could not publish the feed. Try again when you have signal.')
    }
  }

  async function copyLink() {
    if (!feedCtl.feed) return
    try {
      await navigator.clipboard.writeText(feedCtl.feed.feedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard denied: the add button above still covers the main path */
    }
  }

  return (
    <>
      {!feedCtl.feed ? (
        <>
          <p style={noteStyle}>
            Direct connect isn't available yet, but a subscription does the same job: publish
            your plan at a private link, add it to Google Calendar once, and it follows every
            edit you make here.
          </p>
          {online ? (
            <Button onClick={setUp} disabled={feedCtl.busy}>
              {feedCtl.busy ? 'Setting up…' : 'Set up Google Calendar'}
            </Button>
          ) : (
            <p style={mutedStyle}>Setup needs a connection.</p>
          )}
        </>
      ) : (
        <>
          <p style={noteStyle}>
            Your subscription link is live. Add it to Google once below; it arrives as its own
            calendar named Yosemite trip and follows every edit you make here.
          </p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 4 }}>
            <Button href={googleCalendarSubscribeUrl(feedCtl.feed.feedUrl)} external>
              Add to Google Calendar
            </Button>
            <Button variant="ghost" onClick={copyLink}>
              {copied ? 'Copied' : 'Copy feed link'}
            </Button>
          </div>
          <p style={mutedStyle}>
            Google only accepts a new subscription from a computer browser, never its phone app:
            on a phone, copy the feed link and add it later at calendar.google.com, under Other
            calendars, From URL. Once added it syncs to the phone app on its own. Updated{' '}
            {relativeStamp(feedCtl.feed.updatedAt)}. Google refreshes subscriptions on its own
            schedule, usually within a day.
          </p>
        </>
      )}
      {error && <p className="form-error">{error}</p>}
    </>
  )
}

// --- Apple -----------------------------------------------------------------

function AppleCalendarSection({ feedCtl }: { feedCtl: FeedControls }) {
  const online = useOnline()
  const [error, setError] = useState<string | null>(null)

  async function setUp() {
    setError(null)
    try {
      await feedCtl.publish()
    } catch {
      setError('Could not publish the feed. Try again when you have signal.')
    }
  }

  async function stop() {
    setError(null)
    try {
      await feedCtl.stop()
    } catch {
      setError('Could not reach the server to stop the feed. Try again.')
    }
  }

  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--rule)' }}>
      <div className="download-row__label">Apple Calendar</div>

      {!feedCtl.feed ? (
        <>
          <p style={noteStyle}>
            Apple has no direct connect, so this adds a subscription your iPhone or Mac refreshes
            on its own. Set it up once.
          </p>
          {online ? (
            <Button onClick={setUp} disabled={feedCtl.busy}>
              {feedCtl.busy ? 'Setting up…' : 'Set up Apple Calendar'}
            </Button>
          ) : (
            <p style={mutedStyle}>Setup needs a connection.</p>
          )}
        </>
      ) : (
        <>
          <p style={noteStyle}>
            Your subscription is live. Add it once below; after that Apple Calendar refreshes it on
            its own schedule.
          </p>
          <Button href={webcalUrl(feedCtl.feed.feedUrl)}>Open in Apple Calendar</Button>
          <p style={mutedStyle}>
            Updated {relativeStamp(feedCtl.feed.updatedAt)}. Apple refreshes subscriptions per its Fetch
            New Data setting, so same-day edits can lag; the trip page's one-time file is instant.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="quiet" onClick={stop} disabled={feedCtl.busy || !online}>
              {feedCtl.busy ? 'Working…' : 'Stop the feed'}
            </Button>
          </div>
        </>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
