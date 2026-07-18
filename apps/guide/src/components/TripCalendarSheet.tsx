// =============================================================================
// The add-to-calendar sheet, the finalize flow's last step. Two paths:
//   1. Subscribe — publish the plan as a hosted feed (Worker), then hand the
//      URL to Apple Calendar (webcal) or Google Calendar (add-by-URL). Once
//      subscribed, feedSync.ts republishes automatically after every edit.
//   2. One-time file — the original share/download of a .ics, which works
//      fully offline. The ICS is built synchronously inside the tap handler:
//      iOS only allows the share sheet inside the user-gesture task.
// Copy is deliberately honest about refresh cadence: calendar apps poll
// subscriptions on their own schedule.
// =============================================================================

import { useEffect, useState } from 'react'
import { ApiError } from '../lib/api'
import { buildTripIcs } from '../trip/ics'
import { exportTripIcs, type ExportMethod } from '../trip/exportTrip'
import {
  googleCalendarSubscribeUrl,
  publishFeed,
  readFeedInfo,
  revokeFeed,
  webcalUrl,
  type TripFeedInfo,
} from '../trip/feed'
import { readGoogleCalInfo } from '../trip/googleCalendar'
import type { SlottedItem } from '../trip/slotting'
import { relativeStamp } from '../utils/relativeStamp'
import Button from './ui/Button'

type Props = {
  open: boolean
  onClose: () => void
  slotted: Map<string, SlottedItem[]>
  eventCount: number
  filenameDate: string
}

// Wrapper mounts the body fresh on every open, so state initializers read
// the current feed record and the transient state (errors, export hints)
// never leaks between opens.
export default function TripCalendarSheet({ open, ...rest }: Props) {
  if (!open) return null
  return <SheetBody {...rest} />
}

function SheetBody({ onClose, slotted, eventCount, filenameDate }: Omit<Props, 'open'>) {
  const [feed, setFeed] = useState<TripFeedInfo | null>(() => readFeedInfo())
  // Read once on open: if Google is already connected from the Account page,
  // subscribing here too would double the trip in Google Calendar.
  const [googleConnected] = useState(() => readGoogleCalInfo() !== null)
  const [online, setOnline] = useState(() => navigator.onLine)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<ExportMethod | null>(null)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  async function subscribe() {
    setPublishing(true)
    setPublishError(null)
    try {
      const ics = buildTripIcs(slotted)
      setFeed(await publishFeed(ics))
    } catch (err) {
      setPublishError(
        err instanceof ApiError && err.status === 401
          ? 'Your session needs a refresh. Sign in again, then retry.'
          : 'Could not turn on sync. Try again when you have signal.',
      )
    } finally {
      setPublishing(false)
    }
  }

  async function stopSync() {
    setRevoking(true)
    try {
      await revokeFeed()
      setFeed(null)
    } catch {
      setPublishError('Could not reach the server to turn off sync. Try again when you have signal.')
    } finally {
      setRevoking(false)
    }
  }

  async function copyLink() {
    if (!feed) return
    try {
      // Plain https, not webcal: pasted into a text field (email, notes, a
      // calendar app's "subscribe by URL" box) http(s) is the portable form.
      await navigator.clipboard.writeText(feed.feedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard denied: the buttons above still cover both major apps */
    }
  }

  async function exportFile() {
    setExporting(true)
    try {
      // Built synchronously before the await: iOS only allows the share
      // sheet inside the user-gesture task.
      const ics = buildTripIcs(slotted)
      setExportResult(await exportTripIcs(ics, `yosemite-trip-${filenameDate}.ics`))
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Add trip to calendar">
        <div className="sheet__head">
          <span className="eyebrow eyebrow--moss">
            {eventCount} {eventCount === 1 ? 'event' : 'events'}, ready for your calendar
          </span>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <section className="sheet__section">
          <h3 className="sheet__title">Sync to your calendar</h3>
          {googleConnected && (
            <p className="sheet__note sheet__note--muted">
              Google Calendar is already connected on your Account page, so your trip syncs
              there by itself. The sync below is for other calendar apps, like Apple Calendar
              or Outlook.
            </p>
          )}
          {!feed && (
            <>
              <p className="sheet__note">
                Two steps. First, turn on sync below. Then add the private link it makes to
                your calendar app. After that, when you change the plan here, your calendar
                updates by itself. Your account has one link; turning sync on here replaces
                what another device set up.
              </p>
              {online ? (
                <Button onClick={subscribe} disabled={publishing}>
                  {publishing ? 'Turning on…' : 'Turn on calendar sync'}
                </Button>
              ) : (
                <p className="sheet__note sheet__note--muted">
                  Turning on sync needs a connection. The file below works offline.
                </p>
              )}
            </>
          )}
          {feed && (
            <>
              <p className="sheet__note">
                Sync is on, but it is not in your calendar yet. Add it once below. Your trip
                shows up as its own calendar, named Yosemite trip, and it follows every change
                you make here.
              </p>
              <div className="sheet__buttons">
                <Button href={webcalUrl(feed.feedUrl)}>Apple Calendar</Button>
                {/* Hidden once the account is directly connected: adding the feed
                    to Google too would duplicate the trip, and on a phone the
                    add-by-URL page dead-ends in the Google Calendar app anyway. */}
                {!googleConnected && (
                  <Button href={googleCalendarSubscribeUrl(feed.feedUrl)} external>
                    Google Calendar
                  </Button>
                )}
                <Button variant="ghost" onClick={copyLink}>
                  {copied ? 'Copied' : 'Copy the link'}
                </Button>
              </div>
              <p className="sheet__note sheet__note--muted">
                {!googleConnected &&
                  'Google only lets you add a calendar link from a computer browser, not from ' +
                    'its phone app. On a phone, copy the link and add it later at ' +
                    'calendar.google.com, under Other calendars, From URL. After that it syncs ' +
                    'to the phone app on its own. '}
                Last update {relativeStamp(feed.updatedAt)}.{' '}
                {googleConnected
                  ? 'Apple checks for changes on its own schedule, so same-day changes can lag. For those, use the file below.'
                  : 'Calendar apps check for changes on their own schedule: Google usually within a day, Apple per its settings. For same-day changes, use the file below.'}
              </p>
              <Button variant="quiet" onClick={stopSync} disabled={revoking || !online}>
                {revoking ? 'Turning off…' : 'Turn off calendar sync'}
              </Button>
            </>
          )}
          {publishError && <p className="form-error">{publishError}</p>}
        </section>

        <section className="sheet__section">
          <h3 className="sheet__title">Or save a file once</h3>
          <p className="sheet__note">
            Saves one calendar file with all your events. It works offline. Apple Calendar,
            Google Calendar, and Outlook can all open it.
          </p>
          <Button variant={feed ? 'ghost' : 'solid'} onClick={exportFile} disabled={exporting}>
            {exporting ? 'Preparing…' : 'Save the calendar file'}
          </Button>
          {exportResult === 'shared' && (
            <p className="sheet__note sheet__note--muted">
              Shared. On iPhone: choose Save to Files, then open the saved file and tap Add All.
              Or share it straight to Mail and open the attachment on any device.
            </p>
          )}
          {exportResult === 'downloaded' && (
            <p className="sheet__note sheet__note--muted">
              Downloaded. Open the .ics file and your calendar imports the whole trip.
            </p>
          )}
          {exportResult === 'cancelled' && (
            <p className="sheet__note sheet__note--muted">
              Share sheet closed, nothing was created. Tap again to retry.
            </p>
          )}
          {exportResult === 'failed' && (
            <p className="sheet__note sheet__note--muted">
              The save didn't start. Turn on calendar sync above, or save the file from a
              computer browser.
            </p>
          )}
        </section>

        <p className="sheet__fine">
          Each event carries the spot's GPS location and a directions link, plus a 30-minute
          reminder where your calendar allows it.
        </p>
      </div>
    </>
  )
}
