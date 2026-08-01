// =============================================================================
// Account-page notification opt-in (push/push.ts).
//
// The card names both notices it will ever send before asking for anything.
// That is the whole design: a permission prompt raised without saying what it
// buys gets denied, and a denial on this platform is effectively permanent —
// the page can't re-ask, and the user has to find it in browser settings.
//
// Hidden entirely when the browser can't do push or the Worker has no VAPID
// keys, rather than showing a button that fails on tap.
// =============================================================================

import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import {
  disablePush,
  enablePush,
  isPushEnabled,
  permissionState,
  pushSupport,
} from '../push/push'
import Button from './ui/Button'

const noteStyle = {
  color: 'var(--ink-2)',
  fontSize: 14,
  lineHeight: 1.55,
  margin: '0 0 10px',
} as const
const mutedStyle = {
  color: 'var(--ink-3)',
  fontSize: 13,
  lineHeight: 1.55,
  margin: '6px 0 0',
} as const
const listStyle = {
  ...noteStyle,
  paddingLeft: 20,
  margin: '0 0 12px',
} as const

export default function NotificationsCard() {
  const [support] = useState(pushSupport)
  const [enabled, setEnabled] = useState(isPushEnabled)
  const [permission, setPermission] = useState(permissionState)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // null = still asking the Worker, false = no VAPID keys configured.
  const [configured, setConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    if (!support.supported) return
    let cancelled = false
    apiFetch<{ key?: string }>('/api/push/key')
      .then((res) => {
        if (!cancelled) setConfigured(!!res.key)
      })
      .catch(() => {
        // 503 (no keys) and a plain network failure are indistinguishable from
        // here. Both mean "don't offer it right now", which is the same card.
        if (!cancelled) setConfigured(false)
      })
    return () => {
      cancelled = true
    }
  }, [support.supported])

  // The browser can do push, but not here: iOS Safari outside a Home Screen
  // install, or a browser with no Push API. Say why rather than going silent —
  // "add to Home Screen" is an action the reader can take.
  if (!support.supported) {
    return (
      <>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Notifications
        </span>
        <p style={mutedStyle}>{support.reason}</p>
      </>
    )
  }

  // Nothing to offer while the Worker has no keys; an opt-in that 503s on tap
  // is worse than no opt-in.
  if (configured === false) return null

  async function run(fn: () => Promise<void>, failure: string) {
    setBusy(true)
    setError(null)
    try {
      await fn()
      setEnabled(isPushEnabled())
      setPermission(permissionState())
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : failure)
      setEnabled(isPushEnabled())
      setPermission(permissionState())
    } finally {
      setBusy(false)
    }
  }

  const blocked = permission === 'denied'

  return (
    <>
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
        Notifications
      </span>

      {enabled && !blocked ? (
        <>
          <p style={noteStyle}>
            This device will get a nudge on each morning of your trip, and a heads-up before your
            access ends. Nothing else.
          </p>
          <Button
            variant="quiet"
            size="sm"
            disabled={busy}
            onClick={() => run(disablePush, 'Could not turn notifications off.')}
          >
            {busy ? 'Turning off…' : 'Turn off notifications'}
          </Button>
        </>
      ) : (
        <>
          <p style={noteStyle}>Two notifications, and the guide sends no others:</p>
          <ul style={listStyle}>
            <li>
              On each morning of your trip, a tap straight to today's schedule, forecast, and the
              drive to your first stop.
            </li>
            <li>A heads-up two weeks and one day before your access ends.</li>
          </ul>
          {blocked ? (
            <p style={mutedStyle}>
              Notifications are blocked for this site in your browser. Turn them back on in your
              browser's site settings, then come back here.
            </p>
          ) : (
            <>
              <Button
                size="sm"
                disabled={busy || configured === null}
                onClick={() => run(enablePush, 'Could not turn notifications on.')}
              >
                {busy ? 'Turning on…' : 'Turn on notifications'}
              </Button>
              <p style={mutedStyle}>
                Your browser will ask for permission when you tap. Off by default, and the guide
                works exactly the same without them.
              </p>
            </>
          )}
        </>
      )}

      {error && (
        <p style={{ ...mutedStyle, color: 'var(--danger)' }} role="alert">
          {error}
        </p>
      )}
    </>
  )
}
