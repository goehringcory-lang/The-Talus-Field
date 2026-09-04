// =============================================================================
// /help — the Help card. One screen for the moment something has gone wrong:
// the call, your position in the two formats a dispatcher and a rescue team
// use, the nearest named place to say out loud, the numbers the park prints,
// and where a person or a landline is when the handset has nothing.
//
// Everything on this page except the call itself works with no signal. GPS
// needs no data connection, the coordinates and the nearest-place sentence
// are computed here from bundled data, and the share sheet hands the message
// to whatever can still send it (an SMS often gets out where a call will not).
//
// Honesty rules, the ParkNowPanel posture applied to a reading that matters
// more than any other in the guide: a fix that has not arrived renders as an
// em dash with the reason under it, never a zero; the fix carries its own
// accuracy and age, because a five-minute-old reading from the last ridge is
// not where you are now; and nothing is inferred. The numbers are the park's
// own list, transcribed, and the staffed places are the buildings the Guide
// prints hours for.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { useGeoWatch } from '../compass/useGeoWatch'
import { AMENITIES } from '../content'
import { HELP_NUMBERS, HELP_SOURCE, STAFFED_HELP, TRAFFIC_TEXT } from '../content/help'
import { guideStopGroups } from '../lib/logSummary'
import {
  decimalDegrees,
  degreesMinutes,
  feetLabel,
  nearbyLabel,
  nearestPlaces,
  positionMessage,
  type NamedPlace,
} from '../lib/position'
import './Help.css'

// Every named, coordinate-carrying place the guide knows: the stops the log
// indexes plus the parking lots and campgrounds, because "Upper Pines
// Campground" is a place a dispatcher recognises and a stop list would miss.
// Built once: the content is bundled and never changes at runtime.
const PLACES: NamedPlace[] = [
  ...guideStopGroups()
    .flatMap((g) => g.all)
    .filter((s) => s.coord)
    .map((s) => ({ id: s.id, title: s.title, coord: s.coord! })),
  ...AMENITIES.map((a) => ({ id: a.id, title: a.name, coord: a.coord })),
]

// The fix's age matters here in a way it does not on the compass: the last
// reading from a ridge is not where a fallen hiker is now. Seconds until a
// minute, then minutes.
const AGE_TICK_MS = 5_000
function fixAgeLabel(ageMs: number): string {
  const s = Math.max(0, Math.round(ageMs / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s} s ago`
  const m = Math.round(s / 60)
  return `${m} min ago`
}

type ShareResult = 'shared' | 'copied' | 'failed' | null

export default function Help() {
  const geo = useGeoWatch()
  const { start } = geo
  const fix = geo.fix
  const [shareResult, setShareResult] = useState<ShareResult>(null)
  const [now, setNow] = useState(() => Date.now())

  // A page opened in an emergency should not wait on a permission tap the
  // reader already gave the compass: when the platform says location is
  // granted, start straight away. Otherwise the prompt stays behind a button,
  // the same rule the compass follows, so a page opened to read a phone number
  // does not throw a dialog at anyone.
  useEffect(() => {
    let cancelled = false
    const permissions = typeof navigator !== 'undefined' ? navigator.permissions : undefined
    if (!permissions?.query) return
    permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (!cancelled && status.state === 'granted') start()
      })
      .catch(() => {
        /* no Permissions API: the button is the door */
      })
    return () => {
      cancelled = true
    }
  }, [start])

  // Age ticks only while there is a fix to age.
  useEffect(() => {
    if (!fix) return
    const id = window.setInterval(() => setNow(Date.now()), AGE_TICK_MS)
    return () => window.clearInterval(id)
  }, [fix])

  const nearby = useMemo(() => (fix ? nearestPlaces(fix.coord, PLACES, 3) : []), [fix])
  const nearest = nearby[0] ?? null

  const report = fix
    ? { coord: fix.coord, accuracyM: fix.accuracyM, altitudeM: fix.altitudeM, nearest }
    : null

  async function sharePosition() {
    if (!report) return
    const text = positionMessage(report)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text })
        setShareResult('shared')
        return
      } catch (err) {
        // The reader closed the sheet: not a failure, and not a copy either.
        if (err instanceof DOMException && err.name === 'AbortError') return
        /* fall through to the clipboard */
      }
    }
    await copyPosition()
  }

  async function copyPosition() {
    if (!report) return
    try {
      await navigator.clipboard.writeText(positionMessage(report))
      setShareResult('copied')
    } catch {
      setShareResult('failed')
    }
  }

  const acquiring = geo.status === 'requesting' || (geo.status === 'active' && !fix)
  const stamp = fix
    ? `Fix ${fixAgeLabel(now - fix.atMs)}`
    : acquiring
      ? 'Acquiring'
      : geo.status === 'denied'
        ? 'Location declined'
        : geo.status === 'unavailable'
          ? 'No GPS on this device'
          : 'Not started'

  const urgent = HELP_NUMBERS.filter((n) => n.tier === 'urgent')
  const info = HELP_NUMBERS.filter((n) => n.tier === 'info')

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Instrument"
          title="Help"
          intro="The call, your position, and the numbers the park prints, on one screen. Everything here but the call itself works with no signal."
        />

        {/* The emergency row comes before the readouts: nobody opening this
            page in trouble should scroll to find the number. */}
        <div className="help-emergency">
          <Button href="tel:911" className="help-emergency__call">
            Call 911
          </Button>
          <Button href="sms:911" variant="ghost">
            Text 911
          </Button>
        </div>
        <p className="help-lede">
          A text needs less signal than a call, so try both. A landline reaches dispatch where a
          handset has nothing: a lodge room phone, a visitor center, an entrance station. If
          neither goes and the situation allows it, send someone to the nearest of those rather
          than keep redialing a dead phone.
        </p>

        <div className="panel help-fix">
          <div className="panel__head">
            <span className="panel__title">Your position</span>
            <span className={fix && now - fix.atMs > 120_000 ? 'panel__stamp panel__stamp--warn' : 'panel__stamp'}>
              {stamp}
            </span>
          </div>
          <div className="panel__grid">
            <div className="readout readout--wide">
              <span className="readout__label">Read to dispatch · decimal degrees</span>
              <span className="readout__value readout__value--big">
                {fix ? decimalDegrees(fix.coord) : '—'}
              </span>
              <span className="readout__note">
                {fix ? 'Latitude, then longitude' : acquiring ? 'Waiting for the first fix' : 'Needs location'}
              </span>
            </div>
            <div className="readout readout--wide">
              <span className="readout__label">Degrees and minutes</span>
              <span className="readout__value">{fix ? degreesMinutes(fix.coord) : '—'}</span>
              <span className="readout__note">
                {fix ? 'The rescue-radio and handheld-GPS form' : 'Same fix, other dialect'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Accuracy</span>
              <span className="readout__value">{fix ? `± ${feetLabel(fix.accuracyM)}` : '—'}</span>
              <span className="readout__note">
                {fix && fix.accuracyM > 100 ? 'Poor fix · step clear of walls or trees' : 'GPS radius'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Elevation</span>
              <span className="readout__value">
                {fix?.altitudeM != null ? feetLabel(fix.altitudeM) : '—'}
              </span>
              <span className="readout__note">
                {fix?.altitudeM != null ? 'GPS altitude, approximate' : 'No altitude in the fix'}
              </span>
            </div>
            <div className="readout readout--wide">
              <span className="readout__label">Where that is</span>
              <span className={nearest ? 'readout__value readout__value--signal' : 'readout__value'}>
                {nearest ? nearbyLabel(nearest) : '—'}
              </span>
              <span className="readout__note">
                {nearby.length > 1
                  ? `Also ${nearby
                      .slice(1)
                      .map((n) => nearbyLabel(n))
                      .join(' · ')}`
                  : 'Straight-line distance to the nearest named place in the guide'}
              </span>
            </div>
          </div>
          {!fix && geo.status !== 'denied' && geo.status !== 'unavailable' && (
            <div className="help-start">
              <Button onClick={start} disabled={acquiring}>
                {acquiring ? 'Acquiring a fix…' : 'Get my position'}
              </Button>
              <p className="card__note">
                Asks for location once. GPS works in airplane mode; the reading stays on this
                device until you share it.
              </p>
            </div>
          )}
          {geo.status === 'denied' && (
            <div className="help-start">
              <p className="card__note">
                Location is declined for this app, so the position cannot be read here. Your
                phone's own maps app can still show coordinates: in Google Maps, press and
                hold on the blue dot; in Apple Maps, tap the dot, then swipe up.
              </p>
            </div>
          )}
          {geo.status === 'unavailable' && !fix && (
            <div className="help-start">
              <p className="card__note">
                This device reports no location. Read your position off a car GPS, a watch, or
                a companion's phone instead.
              </p>
            </div>
          )}
        </div>

        <div className="action-row help-actions">
          <Button onClick={sharePosition} disabled={!fix}>
            Share my position
          </Button>
          <Button variant="ghost" onClick={copyPosition} disabled={!fix}>
            Copy
          </Button>
          <p className="card__note help-actions__result" role="status">
            {shareResult === 'shared' && 'Shared. A text carries the coordinates and a map link.'}
            {shareResult === 'copied' && 'Copied. Paste it into a text or read it out.'}
            {shareResult === 'failed' &&
              'Could not share from here. Read the decimal degrees above out loud instead.'}
          </p>
        </div>

        <section aria-label="What to say" className="page-section" style={{ marginTop: 0 }}>
          <span className="eyebrow">What to tell them</span>
          <ol className="help-script">
            <li>What happened, and how many people are hurt or stranded.</li>
            <li>Your position: the decimal degrees above, digit by digit, then the nearest place.</li>
            <li>What you need, and what you have: water, layers, a headlamp, a working phone.</li>
            <li>Stay put once they know where you are, unless staying put is the danger.</li>
          </ol>
        </section>

        <section aria-label="Numbers" className="page-section" style={{ marginTop: 0 }}>
          <span className="eyebrow">Numbers the park prints</span>
          <ul className="help-numbers">
            {[...urgent, ...info].map((n) => (
              <li key={n.id} className="help-number">
                <a className="help-number__link" href={`tel:${n.tel}`}>
                  <span className="help-number__label">{n.label}</span>
                  {n.note && <span className="help-number__note">{n.note}</span>}
                  <span className="help-number__tel">{n.display}</span>
                </a>
              </li>
            ))}
            <li className="help-number">
              <a
                className="help-number__link"
                href={`sms:${TRAFFIC_TEXT.number}?&body=${TRAFFIC_TEXT.keyword}`}
              >
                <span className="help-number__label">Traffic and parking alerts</span>
                <span className="help-number__note">
                  Text {TRAFFIC_TEXT.keyword} to {TRAFFIC_TEXT.number}.
                </span>
                <span className="help-number__tel">{TRAFFIC_TEXT.number}</span>
              </a>
            </li>
          </ul>
        </section>

        <section aria-label="Where to find a person" className="page-section" style={{ marginTop: 0 }}>
          <span className="eyebrow">Where a person or a landline is</span>
          <div className="help-staffed">
            {STAFFED_HELP.map((s) => (
              <div key={s.area}>
                <span className="help-staffed__area">{s.area}</span>
                <p>{s.places}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="page-footnote">
          Numbers are the National Park Service's own list from the Yosemite Guide for{' '}
          {HELP_SOURCE.edition}; the clinic is urgent care, not a hospital, and a serious case
          is stabilized and driven out to one. The habits that make all of this manageable are
          in <Link to="/essentials/safety-and-help">Safety and help</Link>. For the last stretch
          on foot toward a named place, <Link to="/compass">the bearing compass</Link> points at
          it.
        </p>
      </main>
    </GatedChrome>
  )
}
