// =============================================================================
// Account-page cross-device sync toggle (sync/planSync.ts).
//
// Off by default and opt-in on purpose. The guide's whole promise is that it
// works with no signal; a buyer who never touches this is exactly where they
// were before it existed. So the copy leads with what gets sent and what the
// merge rule actually is, rather than a checkbox labelled "Sync".
// =============================================================================

import { useEffect, useState } from 'react'
import {
  disableSync,
  enableSync,
  isSyncEnabled,
  readLastSyncAt,
  subscribeSyncStatus,
  syncNow,
} from '../sync/planSync'
import { relativeStamp } from '../utils/relativeStamp'
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

export default function SyncCard() {
  const [enabled, setEnabled] = useState(isSyncEnabled)
  const [lastAt, setLastAt] = useState(readLastSyncAt)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // planSync notifies on every state change, including the boot exchange and
  // the auto-disable that follows a dead session.
  useEffect(() => {
    const refresh = () => {
      setEnabled(isSyncEnabled())
      setLastAt(readLastSyncAt())
    }
    return subscribeSyncStatus(refresh)
  }, [])

  async function run(fn: () => Promise<void>, failure: string) {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : failure)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
        Your devices
      </span>

      {enabled ? (
        <>
          <p style={noteStyle}>
            Your trip plan, saved stops, visited stops, and stop notes are kept in step across
            every device you sign in on.
          </p>
          <div className="action-row">
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => run(syncNow, 'Could not sync just now.')}
            >
              {busy ? 'Syncing…' : 'Sync now'}
            </Button>
            <Button
              variant="quiet"
              size="sm"
              disabled={busy}
              onClick={() => run(disableSync, 'Could not turn sync off.')}
            >
              Turn off
            </Button>
          </div>
          <p style={mutedStyle}>
            {lastAt ? `Last synced ${relativeStamp(lastAt)}.` : 'Not synced yet.'} Syncing needs a
            connection, so changes made in the park go up the next time you have signal. If you
            edit the same trip on two devices, the one that saved last wins.
          </p>
        </>
      ) : (
        <>
          <p style={noteStyle}>
            Plan on a laptop, walk in with a phone. Turn this on and your trip plan, saved stops,
            visited stops, and stop notes follow you onto every device you sign in on.
          </p>
          <Button
            size="sm"
            disabled={busy}
            onClick={() => run(enableSync, 'Could not turn sync on. Check your connection.')}
          >
            {busy ? 'Turning on…' : 'Turn on sync'}
          </Button>
          <p style={mutedStyle}>
            Off by default: the guide works offline without it. Your notes stay private to your
            account, are never shared, and turning sync off deletes the copy on our server without
            touching anything on this device.
          </p>
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
