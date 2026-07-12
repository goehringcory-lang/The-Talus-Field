// =============================================================================
// Account-page calendar connect. Two paths:
//   1. Google — a real OAuth login (handled by the Worker). Events go straight
//      into the buyer's primary Google calendar and auto-sync on every edit
//      (trip/calendarSync.ts). Connect kicks off the OAuth redirect; the return
//      lands back here with ?calendar=connected|denied|error.
//   2. Apple — no write API exists, so this reuses the hosted ICS feed via a
//      webcal:// subscription (shared with the trip page's calendar sheet).
// =============================================================================

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  disconnectGoogleCalendar,
  fetchGoogleStatus,
  readGoogleCalInfo,
  startGoogleConnect,
  syncGoogleCalendarNow,
} from '../trip/googleCalendar'
import { buildTripIcs } from '../trip/ics'
import { publishFeed, readFeedInfo, revokeFeed, webcalUrl, type TripFeedInfo } from '../trip/feed'
import { slotPlan } from '../trip/slotting'
import { readTripPlan } from '../trip/useTripPlan'
import { relativeStamp } from '../utils/relativeStamp'
import Button from './ui/Button'

const noteStyle = { color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.55, margin: '0 0 10px' } as const
const mutedStyle = { color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.55, margin: '6px 0 0' } as const

export default function CalendarCard() {
  return (
    <section aria-label="Calendar">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Calendar</div>
      <p style={noteStyle}>
        Put your trip plan on your own calendar. Connect Google to have events dropped straight
        in and kept in step with every edit, or subscribe from Apple Calendar.
      </p>
      <GoogleCalendarSection />
      <AppleCalendarSection />
    </section>
  )
}

// --- Google ----------------------------------------------------------------

type GoogleState =
  | { kind: 'loading' }
  | { kind: 'disconnected' }
  | { kind: 'connected'; email?: string; lastSyncAt: string }

// Seed from the local mirror so the card renders offline, then reconcile with
// the server on mount (the AccessStatusCard cached-then-fetch pattern).
function seedGoogle(): GoogleState {
  const local = readGoogleCalInfo()
  if (local) return { kind: 'connected', email: local.email, lastSyncAt: local.lastSyncAt }
  return navigator.onLine ? { kind: 'loading' } : { kind: 'disconnected' }
}

type GoogleNote = 'connected' | 'denied' | 'error' | 'disconnect-error' | null

function GoogleCalendarSection() {
  const [params, setParams] = useSearchParams()
  const calendarParam = params.get('calendar')
  const [state, setState] = useState<GoogleState>(seedGoogle)
  const [note, setNote] = useState<GoogleNote>(null)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
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
            : { kind: 'disconnected' },
        )
      })
      .catch(() => {
        if (!cancelled) setState((s) => (s.kind === 'loading' ? { kind: 'disconnected' } : s))
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
    } catch {
      setConnecting(false)
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

// --- Apple -----------------------------------------------------------------

function AppleCalendarSection() {
  const [feed, setFeed] = useState<TripFeedInfo | null>(() => readFeedInfo())
  const [online, setOnline] = useState(() => navigator.onLine)
  const [publishing, setPublishing] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function setUp() {
    setPublishing(true)
    setError(null)
    try {
      const ics = buildTripIcs(slotPlan(readTripPlan().items))
      setFeed(await publishFeed(ics))
    } catch {
      setError('Could not publish the feed. Try again when you have signal.')
    } finally {
      setPublishing(false)
    }
  }

  async function stop() {
    setRevoking(true)
    try {
      await revokeFeed()
      setFeed(null)
    } catch {
      setError('Could not reach the server to stop the feed. Try again.')
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--rule)' }}>
      <div className="download-row__label">Apple Calendar</div>

      {!feed ? (
        <>
          <p style={noteStyle}>
            Apple has no direct connect, so this adds a subscription your iPhone or Mac refreshes
            on its own. Set it up once.
          </p>
          {online ? (
            <Button onClick={setUp} disabled={publishing}>
              {publishing ? 'Setting up…' : 'Set up Apple Calendar'}
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
          <Button href={webcalUrl(feed.feedUrl)}>Open in Apple Calendar</Button>
          <p style={mutedStyle}>
            Updated {relativeStamp(feed.updatedAt)}. Apple refreshes subscriptions per its Fetch
            New Data setting, so same-day edits can lag; the trip page's one-time file is instant.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="quiet" onClick={stop} disabled={revoking || !online}>
              {revoking ? 'Stopping…' : 'Stop the feed'}
            </Button>
          </div>
        </>
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
