// =============================================================================
// The watch form: campground, nights, what counts as open, how to be told.
//
// Two rules carried over from the notifications card. The push checkbox
// never prompts on its own: enabling notifications is a tap on a button
// that says what it does, because a cold permission prompt gets denied and
// a denial cannot be undone from the page. And the copy names the deal
// before the buyer takes it: checked every five minutes, alerts at whatever
// hour a site appears, paid services poll faster.
// =============================================================================

import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import { defaultTripDates, readTripDates } from '../programs/usePrograms'
import { enablePush, isPushEnabled, permissionState, pushSupport } from '../push/push'
import { addDaysIso, todayIso } from '../utils/date'
import type { WatchPrefill } from './deepLink'
import { MAX_DAYS_AHEAD, MAX_WATCH_NIGHTS, clampLeave, nightsBetween, nightsCount } from './nights'
import type { CreateWatchInput, WatchModeT } from './schema'
import { WATCH_TARGETS, releaseCopy, targetById } from './targets'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_PARTY = 6

type Props = {
  prefill?: WatchPrefill
  onCreate: (input: CreateWatchInput) => Promise<void>
}

// The one storage read in the form: the trip dates the planner already
// holds, the same default /programs and /trip use. Prefill wins.
function initialDates(prefill: WatchPrefill | undefined, today: string) {
  const trip = readTripDates() ?? defaultTripDates()
  const arriveRaw = prefill?.start ?? trip.start
  const arrive = arriveRaw < today ? today : arriveRaw
  const leave = clampLeave(arrive, prefill?.end ?? trip.end)
  return { arrive, leave }
}

export default function WatchForm({ prefill, onCreate }: Props) {
  const { session } = useAuth()
  const canEmail = EMAIL_RE.test(session?.username ?? '')
  const [today] = useState(todayIso)
  const [support] = useState(pushSupport)
  const [targetId, setTargetId] = useState(prefill?.target ?? WATCH_TARGETS[0].id)
  const [dates, setDates] = useState(() => initialDates(prefill, today))
  const [mode, setMode] = useState<WatchModeT>('any')
  const [party, setParty] = useState(2)
  const [email, setEmail] = useState(canEmail)
  const [pushOn, setPushOn] = useState(() => support.supported && isPushEnabled())
  const [permission, setPermission] = useState(permissionState)
  const [pushBusy, setPushBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const target = targetById(targetId) ?? WATCH_TARGETS[0]
  const nights = nightsBetween(dates.arrive, dates.leave)
  const pushBlocked = permission === 'denied'
  const pushReady = support.supported && !pushBlocked && isPushEnabled()

  function updateArrive(arrive: string) {
    if (!arrive) return
    const clamped = arrive < today ? today : arrive
    setDates({ arrive: clamped, leave: clampLeave(clamped, dates.leave) })
  }
  function updateLeave(leave: string) {
    if (!leave) return
    setDates({ arrive: dates.arrive, leave: clampLeave(dates.arrive, leave) })
  }

  // Raised from the tap, never from an effect: the permission prompt has to
  // sit inside a user gesture, and a prompt nobody asked for gets denied.
  async function turnOnPush() {
    setPushBusy(true)
    setError(null)
    try {
      await enablePush()
      setPushOn(true)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not turn notifications on.')
      setPushOn(false)
    } finally {
      setPermission(permissionState())
      setPushBusy(false)
    }
  }

  async function submit() {
    setError(null)
    if (!pushOn && !email) {
      setError('Pick at least one way to be told: notifications on this device, or email.')
      return
    }
    setBusy(true)
    try {
      await onCreate({
        targetId: target.id,
        start: dates.arrive,
        nights,
        mode,
        ...(target.model === 'person' ? { party } : {}),
        channels: { push: pushOn, email },
      })
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not save the watch.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      className="watch-form"
      onSubmit={(e) => {
        e.preventDefault()
        void submit()
      }}
    >
      <label className="field">
        Campground
        <select
          className="field-control"
          value={target.id}
          onChange={(e) => setTargetId(e.target.value)}
        >
          {WATCH_TARGETS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <p className="watch-form__note">{releaseCopy(target.release)}</p>

      <div className="watch-form__dates">
        <label className="field">
          Arriving
          <input
            className="field-control"
            type="date"
            value={dates.arrive}
            min={today}
            max={addDaysIso(today, MAX_DAYS_AHEAD)}
            onChange={(e) => updateArrive(e.target.value)}
          />
        </label>
        <label className="field">
          Leaving
          <input
            className="field-control"
            type="date"
            value={dates.leave}
            min={addDaysIso(dates.arrive, 1)}
            max={addDaysIso(dates.arrive, MAX_WATCH_NIGHTS)}
            onChange={(e) => updateLeave(e.target.value)}
          />
        </label>
      </div>
      <p className="watch-form__note">
        {nightsCount(nights)}. A watch covers up to {MAX_WATCH_NIGHTS} nights and reaches{' '}
        {MAX_DAYS_AHEAD} days ahead, so nights that have not been released yet can be watched
        for release day.
      </p>

      <fieldset className="watch-form__group">
        <legend className="field">What counts as open</legend>
        <label className="watch-choice">
          <input
            type="radio"
            name="mode"
            checked={mode === 'any'}
            onChange={() => setMode('any')}
          />
          <span>
            <strong>Any single night.</strong> One night of your stay on any site. The way to
            piece a trip together out of cancellations.
          </span>
        </label>
        <label className="watch-choice">
          <input
            type="radio"
            name="mode"
            checked={mode === 'full'}
            onChange={() => setMode('full')}
          />
          <span>
            <strong>Every night, one site.</strong> Rarer, and the alert you can book in one go.
          </span>
        </label>
      </fieldset>

      {target.model === 'person' && (
        <label className="field watch-form__party">
          Spots for your party
          <input
            className="field-control field-control--sm"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_PARTY}
            value={party}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10)
              if (Number.isInteger(n)) setParty(Math.min(MAX_PARTY, Math.max(1, n)))
            }}
          />
        </label>
      )}

      <fieldset className="watch-form__group">
        <legend className="field">How to be told</legend>
        {support.supported && !pushBlocked ? (
          <label className="watch-choice">
            <input
              type="checkbox"
              checked={pushOn}
              disabled={pushBusy}
              onChange={(e) => {
                if (!e.target.checked) {
                  setPushOn(false)
                  return
                }
                if (pushReady) setPushOn(true)
                else void turnOnPush()
              }}
            />
            <span>
              <strong>A notification on this device</strong>
              {pushReady
                ? ', and on every other device you have notifications on.'
                : '. Ticking this asks your browser for permission.'}
              {!pushReady && (
                <span className="watch-choice__action">
                  <Button variant="ghost" size="sm" disabled={pushBusy} onClick={() => void turnOnPush()}>
                    {pushBusy ? 'Turning on…' : 'Turn on notifications on this device'}
                  </Button>
                </span>
              )}
            </span>
          </label>
        ) : (
          <p className="watch-form__note">
            {pushBlocked
              ? 'Notifications are blocked for this site in your browser. Turn them back on in its site settings to get the buzz; email still works.'
              : support.supported
                ? ''
                : support.reason}
          </p>
        )}
        {canEmail ? (
          <label className="watch-choice">
            <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
            <span>
              <strong>An email</strong> to {session?.username}.
            </span>
          </label>
        ) : (
          <p className="watch-form__note">
            Email needs a buyer account; this sign-in has no address.
          </p>
        )}
      </fieldset>

      <p className="watch-form__note watch-form__note--deal">
        Checked every five minutes. Alerts arrive at whatever hour a site appears, overnight
        included: that is when releases and cancellations land. Sites go in minutes, so the
        alert opens straight to the booking link. Paid services poll faster; this is the one you
        already own. Deleting the watch is the off switch.
      </p>

      {error && (
        <p className="watch-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="action-row">
        <Button type="submit" disabled={busy || nights < 1}>
          {busy ? 'Saving…' : 'Watch for openings'}
        </Button>
      </div>
    </form>
  )
}
