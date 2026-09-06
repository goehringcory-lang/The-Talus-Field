// =============================================================================
// /near — companion mode, the "you are near" screen. As the fix moves, the
// nearest entry in the guide comes up with its teaser and its opening
// paragraph, the next three wait under it, and, if the passenger has switched
// it on, the device reads that one paragraph aloud once on arrival.
//
// It is the passenger's companion and the copy says so. A web app cannot run
// in the background, cannot play through CarPlay or Android Auto, and cannot
// keep the GPS alive behind a locked screen, so this is honest only as a
// screen that works while it is open and looked at. The driver does not look
// at it; the passenger reads or lets the phone read.
//
// Four rules, in order of how badly the wrong version would go. (1) Unverified
// coordinates are not in the catalog (near/unverified.ts): announcing "you are
// at Ribbon Fall" at the wrong pullout is the one failure a companion cannot
// make. (2) The GPS watch runs only while this route is mounted and the page
// is visible; hidden stops it, visible restarts it (useGeoWatch.stop). (3)
// Nothing is ever spoken without a tap first: the toggle is opt-in, the entry
// showing when it is switched on is not read, and the first entry to appear
// after mount is never read either. A new arrival is the only automatic
// trigger, and the Stop control is always on screen while a voice is. (4) The
// nearest entry changes only past a margin (near/nearest.ts), so a boundary
// does not flicker.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { useGeoWatch } from '../compass/useGeoWatch'
import { NEAR_ENTRIES } from '../near/entries'
import { readSpeechPref, speak, speechAvailable, stopSpeaking, writeSpeechPref } from '../near/speech'
import { useNearest } from '../near/useNearest'
import { feetLabel } from '../lib/position'
import { formatMiles } from '../utils/geo'
import './Near.css'

// Fix age, the Help card's rule: a reading from the last bend is not here.
const AGE_TICK_MS = 5_000
const STALE_AFTER_MS = 120_000
function fixAgeLabel(ageMs: number): string {
  const s = Math.max(0, Math.round(ageMs / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s} s ago`
  return `${Math.round(s / 60)} min ago`
}

function formatDeg(deg: number): string {
  return `${Math.round(deg) % 360}°`
}

export default function Near() {
  const geo = useGeoWatch()
  const { start, stop } = geo
  const nearest = useNearest(geo.fix)
  const current = nearest.current

  // Whether the reader has opened the watch this visit: what visibility
  // restores. Auto-start only when the platform already says granted (the
  // Help card's rule), otherwise the prompt waits behind the button.
  const [wanted, setWanted] = useState(false)
  const begin = useCallback(() => {
    setWanted(true)
    start()
  }, [start])

  useEffect(() => {
    let cancelled = false
    const permissions = typeof navigator !== 'undefined' ? navigator.permissions : undefined
    if (!permissions?.query) return
    permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (!cancelled && status.state === 'granted') begin()
      })
      .catch(() => {
        /* no Permissions API: the button is the door */
      })
    return () => {
      cancelled = true
    }
  }, [begin])

  // Battery: no watch and no voice behind a hidden page. Restart on return
  // only if the reader had it running.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        stop()
        stopSpeaking()
      } else if (wanted) {
        start()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [wanted, start, stop])

  // Leaving the route silences it. The watch itself is cleared by the hook.
  useEffect(() => () => stopSpeaking(), [])

  // ---- Read-aloud ----------------------------------------------------------
  const [canSpeak] = useState(() => speechAvailable())
  const [speechOn, setSpeechOn] = useState(() => canSpeak && readSpeechPref())
  const [speaking, setSpeaking] = useState(false)
  // Keys already read (or deliberately skipped) this visit: one read per arrival.
  const spokenRef = useRef<Set<string>>(new Set())
  const onSpeechEnd = useCallback(() => setSpeaking(false), [])

  const readEntry = useCallback(
    (key: string, text: string) => {
      spokenRef.current.add(key)
      if (speak(text, onSpeechEnd)) setSpeaking(true)
    },
    [onSpeechEnd],
  )

  useEffect(() => {
    if (!current) return
    const { key, why } = current.entry
    if (spokenRef.current.has(key)) return
    // The first entry after mount is what was already there, not an arrival.
    if (spokenRef.current.size === 0 || !speechOn) {
      spokenRef.current.add(key)
      return
    }
    readEntry(key, why)
  }, [current, speechOn, readEntry])

  function toggleSpeech() {
    const next = !speechOn
    setSpeechOn(next)
    writeSpeechPref(next)
    if (!next) {
      stopSpeaking()
    } else if (current) {
      // Switching on is not an arrival: the entry showing now stays unread
      // until the reader asks for it.
      spokenRef.current.add(current.entry.key)
    }
  }

  // ---- Status line -----------------------------------------------------------
  const fix = nearest.fix
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!fix) return
    const id = window.setInterval(() => setNow(Date.now()), AGE_TICK_MS)
    return () => window.clearInterval(id)
  }, [fix])

  const acquiring = geo.status === 'requesting' || (geo.status === 'active' && !fix)
  const gpsLine =
    geo.status === 'denied'
      ? 'Location declined'
      : geo.status === 'unavailable' && !fix
        ? 'No GPS on this device'
        : fix && (geo.status === 'active' || geo.status === 'unavailable')
          ? 'GPS active'
          : acquiring
            ? 'Waiting for a fix'
            : 'Location off'
  const gpsTone =
    gpsLine === 'GPS active'
      ? 'readout__value readout__value--signal'
      : gpsLine === 'Location declined' || gpsLine === 'No GPS on this device'
        ? 'readout__value readout__value--alert'
        : 'readout__value'
  const ageMs = fix ? now - fix.atMs : 0
  const stamp = fix ? `Fix ${fixAgeLabel(ageMs)}` : acquiring ? 'Acquiring' : 'No fix'

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page near">
        <PageHeader
          eyebrow="Companion"
          title="You are near"
          intro="The nearest entry in the guide comes up as you move, with the paragraph that says why it is worth stopping. For the passenger: the driver does not look at this."
        />

        {!wanted && geo.status === 'idle' && (
          <div className="near-start">
            <Button onClick={begin}>Start the companion</Button>
            <p className="card__note">
              Starting asks for location. The fix stays on this device; nothing is sent
              anywhere.
            </p>
          </div>
        )}

        <div className="panel near-status" aria-live="polite">
          <div className="panel__head">
            <span className="panel__title">Companion</span>
            <span className={fix && ageMs > STALE_AFTER_MS ? 'panel__stamp panel__stamp--warn' : 'panel__stamp'}>
              {stamp}
            </span>
          </div>
          <div className="panel__grid">
            <div className="readout">
              <span className="readout__label">GPS</span>
              <span className={gpsTone}>{gpsLine}</span>
              <span className="readout__note">
                {fix ? `± ${feetLabel(fix.accuracyM)}` : 'Needs no data connection'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Distance</span>
              <span className="readout__value">{current ? formatMiles(current.miles) : '—'}</span>
              <span className="readout__note">
                {current ? `Straight line · ${formatDeg(current.bearingDeg)} ${current.cardinal}` : 'Nearest entry'}
              </span>
            </div>
            <div className="readout readout--wide">
              <span className="readout__label">Nearest</span>
              <span className="readout__value near-status__name">
                {current ? current.entry.title : '—'}
              </span>
              <span className="readout__note">
                {current
                  ? current.entry.where
                  : geo.status === 'denied'
                    ? 'Allow location in the browser settings to use this screen'
                    : `${NEAR_ENTRIES.length} entries with a verified pin`}
              </span>
            </div>
          </div>
        </div>

        {current && (
          <article className="near-entry" aria-label="Nearest entry">
            <span className="eyebrow eyebrow--moss">{current.entry.where}</span>
            <h2 className="near-entry__title">{current.entry.title}</h2>
            {current.entry.teaser && <p className="near-entry__teaser">{current.entry.teaser}</p>}
            <p className="near-entry__why">{current.entry.why}</p>
            <div className="action-row near-entry__actions">
              <Button variant="ghost" to={current.entry.to}>
                Open the entry →
              </Button>
              <Button
                variant="ghost"
                to={
                  current.entry.kind === 'hike'
                    ? `/map?hike=${current.entry.id}`
                    : `/map?stop=${current.entry.id}`
                }
              >
                On the map →
              </Button>
              {canSpeak && !speaking && (
                <Button
                  variant="ghost"
                  onClick={() => readEntry(current.entry.key, current.entry.why)}
                >
                  Read this aloud
                </Button>
              )}
              {canSpeak && speaking && (
                <Button
                  variant="danger"
                  onClick={() => {
                    stopSpeaking()
                    setSpeaking(false)
                  }}
                >
                  Stop reading
                </Button>
              )}
            </div>
          </article>
        )}

        {canSpeak && (
          <div className="near-speech">
            <button
              type="button"
              className="near-speech__toggle"
              role="switch"
              aria-checked={speechOn}
              onClick={toggleSpeech}
            >
              <span className="near-speech__label">Read aloud on arrival</span>
              <span className="near-speech__state">{speechOn ? 'ON' : 'OFF'}</span>
            </button>
            <p className="card__note">
              {speechOn
                ? 'One paragraph per entry, once, when a new entry becomes the nearest. Nothing plays until then.'
                : 'Off. The device voice reads each new entry’s opening paragraph once as you reach it.'}
            </p>
          </div>
        )}

        {nearest.next.length > 0 && (
          <section className="near-next" aria-label="Next nearest">
            <span className="eyebrow">Next three</span>
            <ol className="near-next__list">
              {nearest.next.map((r) => (
                <li key={r.entry.key} className="near-next__row">
                  <Link to={r.entry.to} className="near-next__link">
                    <span className="near-next__title">{r.entry.title}</span>
                    <span className="near-next__meta">
                      {formatMiles(r.miles)} · {formatDeg(r.bearingDeg)} {r.cardinal} · {r.entry.where}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="near-honest" aria-label="What this can and cannot do">
          <span className="eyebrow">What this is</span>
          <p>
            A companion for the passenger, not a driving tour. It runs only while this app is
            open and the screen is on: a web app cannot play in the background, cannot use
            CarPlay or Android Auto, and stops when the phone locks. Lock the screen and it
            stops reading and stops watching the GPS, which is also what saves the battery.
          </p>
          <p>
            Distances are straight-line, not road. Only entries whose coordinate has been
            checked against a published source are on this screen; the ones still marked for a
            field visit are left off rather than announced at the wrong pullout. GPS needs no
            signal, so this works in airplane mode. For the drive itself use{' '}
            <Link to="/map">the map</Link>; for the last stretch on foot,{' '}
            <Link to="/compass">the compass</Link>.
          </p>
        </section>
      </main>
    </GatedChrome>
  )
}
