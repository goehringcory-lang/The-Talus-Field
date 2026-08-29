// =============================================================================
// /compass — the bearing instrument. Pick any stop in the guide and the rose
// points at it: live distance, true bearing, your heading, your elevation,
// and the sun's position on the same dial. Everything is computed on the
// device from sensors and bundled coordinates — no tiles, no feed, no data
// connection. GPS itself needs no signal, which is why this works in
// airplane mode and why the page says so.
//
// Honesty rules, same posture as ParkNowPanel: a reading that hasn't arrived
// renders as an em dash with the reason underneath, never a zero; a compass
// heading the platform cannot vouch for (relative alpha) is ignored, and the
// rose pins north-up with the copy saying to steer by the number instead.
// Distance is straight-line and labeled as such: the instrument is for the
// last quarter mile on foot, and Directions stays one tap away for the drive.
//
// The target mirrors to ?to= with replaceState (the /search idiom), so a
// bearing to a stop is a shareable link and stop pages can deep-link it.
// =============================================================================

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import { guideStopGroups } from '../lib/logSummary'
import { directionsUrl } from '../map/kinds'
import { useGeoWatch } from '../compass/useGeoWatch'
import { useHeading, PARK_DECLINATION_DEG } from '../compass/useHeading'
import { sunPosition } from '../sun/position'
import { sunTimes, PARK_COORD } from '../sun/solar'
import { formatClock, todayIso } from '../utils/date'
import { cardinalOf, formatMiles, haversineMiles, initialBearingDeg } from '../utils/geo'
import type { GuideStopT } from '../content'
import './Compass.css'

const M_TO_FT = 3.28084

// The sun crawls (~0.25 deg/min), so a slow tick keeps its marker honest
// without a per-frame ephemeris.
const SUN_TICK_MS = 30_000

// Below the official-sunset zenith the marker would point at a sun the
// reader cannot see; the light line still says when it comes back.
const SUN_VISIBLE_ABOVE_DEG = -0.833

function targetFromUrl(byId: Map<string, GuideStopT>): string | null {
  const to = new URLSearchParams(window.location.search).get('to')
  return to && byId.has(to) ? to : null
}

function mirrorTargetToUrl(id: string | null) {
  const url = id ? `/compass?to=${encodeURIComponent(id)}` : '/compass'
  if (url !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, '', url)
  }
}

function formatDeg(deg: number): string {
  return `${Math.round(deg) % 360}°`
}

// Tick marks every 5 degrees, heavier every 15, heaviest every 45. Built once:
// nothing in the rose's geometry depends on state, only its rotation does.
function roseTicks(): ReactElement[] {
  const ticks: ReactElement[] = []
  for (let deg = 0; deg < 360; deg += 5) {
    const major = deg % 45 === 0
    const mid = deg % 15 === 0
    const inner = major ? 138 : mid ? 144 : 150
    ticks.push(
      <line
        key={deg}
        x1={0}
        y1={-inner}
        x2={0}
        y2={-158}
        transform={`rotate(${deg})`}
        className={major ? 'rose__tick rose__tick--major' : mid ? 'rose__tick rose__tick--mid' : 'rose__tick'}
      />,
    )
  }
  return ticks
}

const ROSE_NUMERALS = [30, 60, 120, 150, 210, 240, 300, 330]

// The card's geometry never changes, only its rotation does: built once at
// module load, like the content indexes.
const ROSE_TICKS = roseTicks()

export default function Compass() {
  const groups = useMemo(
    () =>
      guideStopGroups()
        .map((g) => ({ ...g, all: g.all.filter((s) => s.coord) }))
        .filter((g) => g.all.length > 0),
    [],
  )
  const byId = useMemo(
    () => new Map(groups.flatMap((g) => g.all).map((s) => [s.id, s])),
    [groups],
  )

  const [targetId, setTargetId] = useState<string | null>(() => targetFromUrl(byId))
  const heading = useHeading()
  const geo = useGeoWatch()
  const started = heading.status !== 'idle' || geo.status !== 'idle'

  // The sun's clock: re-render on a slow tick so the marker and the light
  // line stay current on a page left open through an afternoon.
  const [nowMs, setNowMs] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), SUN_TICK_MS)
    return () => window.clearInterval(t)
  }, [])

  // No explicit choice: default to the stop nearest the session's first fix,
  // mirrored to the URL like a choice. It is the question a compass answers,
  // and keying off the first fix (never later ones) keeps the target from
  // silently switching mid-walk.
  const autoTargetId = useMemo(() => {
    if (!geo.firstFix) return null
    let best: { id: string; mi: number } | null = null
    for (const s of byId.values()) {
      const mi = haversineMiles(geo.firstFix.coord, s.coord!)
      if (!best || mi < best.mi) best = { id: s.id, mi }
    }
    return best?.id ?? null
  }, [geo.firstFix, byId])

  const effectiveTargetId = targetId ?? autoTargetId
  const target = effectiveTargetId ? byId.get(effectiveTargetId) : undefined

  useEffect(() => {
    mirrorTargetToUrl(effectiveTargetId)
  }, [effectiveTargetId])

  const fix = geo.fix
  const bearingDeg =
    fix && target?.coord ? initialBearingDeg(fix.coord, target.coord) : null
  const distanceMi = fix && target?.coord ? haversineMiles(fix.coord, target.coord) : null

  // Sun position at the reader's spot when there is a fix, else the park
  // coordinate; across the park the difference is under half a degree. Plain
  // calls, no memo: this is trigonometry, cheaper than the bookkeeping.
  const sunCoord = fix?.coord ?? target?.coord ?? PARK_COORD
  const sun = sunPosition(new Date(nowMs), sunCoord)
  const sunUp = sun.altitudeDeg > SUN_VISIBLE_ABOVE_DEG
  const light = sunTimes(todayIso(), sunCoord)

  const headingActive = heading.status === 'active'
  // The hook keeps continuousDeg unwrapped along the shortest arc, so the
  // CSS transition never takes the 350-degree way around from 359 to 1.
  const roseRotation = headingActive ? -heading.continuousDeg : 0

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page compass">
        <PageHeader
          eyebrow="Instrument"
          title="Bearing compass"
          intro="Pick a stop and the rose points at it: distance, true bearing, your heading, and the sun on the same dial. Computed on this device from sensors alone, so it works in airplane mode. GPS needs no data connection."
        />

        <label className="compass-target">
          <span className="eyebrow">Target</span>
          <select
            className="field-control"
            value={effectiveTargetId ?? ''}
            onChange={(e) => setTargetId(e.target.value || null)}
            aria-label="Choose a target stop"
          >
            <option value="">Choose a stop…</option>
            {groups.map((g) => (
              <optgroup key={g.key} label={g.title}>
                {g.all.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {!started && (
          <div className="compass-start">
            <Button
              onClick={() => {
                heading.start()
                geo.start()
              }}
            >
              Start the compass
            </Button>
            <p className="card__note">
              Starting asks for location and, on iPhone, motion access. Both readings stay on
              this device.
            </p>
          </div>
        )}

        <div className="compass-dial" role="img" aria-label={roseAriaLabel(headingActive, heading.headingDeg, target?.title, bearingDeg)}>
          <svg viewBox="-170 -170 340 340" className="compass-rose-svg">
            <g
              className="rose"
              style={{ transform: `rotate(${roseRotation}deg)` }}
            >
              <circle r={158} className="rose__ring" />
              <circle r={118} className="rose__ring rose__ring--inner" />
              {ROSE_TICKS}
              {/* Letters ride the card radially, like a real compass card:
                  keeping them upright would need a counter-rotation that
                  cannot stay in sync with the CSS-transitioned rose. */}
              {(['N', 'E', 'S', 'W'] as const).map((letter, i) => (
                <text
                  key={letter}
                  className={letter === 'N' ? 'rose__cardinal rose__cardinal--n' : 'rose__cardinal'}
                  transform={`rotate(${i * 90}) translate(0 -122)`}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {letter}
                </text>
              ))}
              {ROSE_NUMERALS.map((deg) => (
                <text
                  key={deg}
                  className="rose__numeral"
                  transform={`rotate(${deg}) translate(0 -130)`}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {deg}
                </text>
              ))}
              {bearingDeg !== null && (
                <g transform={`rotate(${bearingDeg})`} className="rose__target">
                  <line x1={0} y1={0} x2={0} y2={-136} className="rose__target-line" />
                  <polygon points="0,-158 -7,-138 7,-138" className="rose__target-arrow" />
                </g>
              )}
              {sunUp && (
                <g transform={`rotate(${sun.azimuthDeg})`} className="rose__sun">
                  <g transform="translate(0 -100)">
                    <circle r={6} className="rose__sun-disc" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <line
                        key={a}
                        x1={0}
                        y1={-9}
                        x2={0}
                        y2={-12}
                        transform={`rotate(${a})`}
                        className="rose__sun-ray"
                      />
                    ))}
                  </g>
                </g>
              )}
            </g>
            {headingActive && (
              <polygon points="0,-150 -6,-166 6,-166" className="rose__lubber" />
            )}
          </svg>
          <div className="compass-dial__center" aria-hidden="true">
            {headingActive ? (
              <>
                <span className="compass-dial__deg">{formatDeg(heading.headingDeg)}</span>
                <span className="compass-dial__wind">{cardinalOf(heading.headingDeg)}</span>
              </>
            ) : (
              <span className="compass-dial__wind">{started ? 'N-UP' : 'OFF'}</span>
            )}
          </div>
        </div>

        {heading.status === 'unavailable' && (
          <p className="card__note compass-note">
            This device reports no compass heading, so the rose is pinned north-up. Steer by
            the bearing number instead: face the sun, whose direction is printed below, and
            turn from there.
          </p>
        )}
        {heading.status === 'denied' && (
          <p className="card__note compass-note">
            Motion access was declined, so the rose is pinned north-up. The bearing and
            distance numbers still work.
          </p>
        )}
        {geo.status === 'denied' && (
          <p className="card__note compass-note">
            Location was declined, so distance and bearing can't be measured. The rose still
            shows your heading and the sun.
          </p>
        )}

        <div className="panel">
          <div className="panel__head">
            <span className="panel__title">Readings</span>
            <span className="panel__stamp">Computed on-device</span>
          </div>
          <div className="panel__grid">
            <div className="readout">
              <span className="readout__label">Distance</span>
              <span className="readout__value">
                {distanceMi !== null ? formatMiles(distanceMi) : '—'}
              </span>
              <span className="readout__note">
                {distanceMi !== null
                  ? 'Straight line, not road'
                  : geo.status === 'active' || geo.status === 'requesting'
                    ? 'Waiting for a fix'
                    : 'Needs location'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Bearing to target</span>
              <span className={bearingDeg !== null ? 'readout__value readout__value--signal' : 'readout__value'}>
                {bearingDeg !== null
                  ? `${formatDeg(bearingDeg)} ${cardinalOf(bearingDeg)}`
                  : '—'}
              </span>
              <span className="readout__note">
                {bearingDeg !== null ? 'True north, declination applied' : target ? 'Needs a fix' : 'Choose a target'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Your heading</span>
              <span className="readout__value">
                {headingActive
                  ? `${formatDeg(heading.headingDeg)} ${cardinalOf(heading.headingDeg)}`
                  : '—'}
              </span>
              <span className="readout__note">
                {headingActive ? 'Where the phone points' : 'No compass reading'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Elevation</span>
              <span className="readout__value">
                {fix?.altitudeM != null
                  ? `${Math.round(fix.altitudeM * M_TO_FT).toLocaleString()} ft`
                  : '—'}
              </span>
              <span className="readout__note">
                {fix?.altitudeM != null ? 'GPS altitude' : 'No altitude in the fix'}
              </span>
            </div>
            <div className="readout readout--wide">
              <span className="readout__label">Your fix</span>
              <span className="readout__value">
                {fix
                  ? `${fix.coord[1].toFixed(5)}, ${fix.coord[0].toFixed(5)}`
                  : '—'}
              </span>
              <span className="readout__note">
                {fix
                  ? `± ${Math.round(fix.accuracyM * M_TO_FT).toLocaleString()} ft`
                  : geo.status === 'requesting'
                    ? 'Acquiring'
                    : 'Start the compass for a fix'}
              </span>
            </div>
            <div className="readout readout--wide">
              <span className="readout__label">Sun</span>
              <span className="readout__value">
                {sunUp ? `${formatDeg(sun.azimuthDeg)} ${cardinalOf(sun.azimuthDeg)}` : 'Down'}
              </span>
              <span className="readout__note">
                {light
                  ? sunUp
                    ? `Sets ${formatClock(light.sunsetMin)} · golden after ${formatClock(light.goldenPmStartMin)}`
                    : `Rises ${formatClock(light.sunriseMin)}`
                  : 'Marked on the rose while up'}
              </span>
            </div>
          </div>
        </div>

        {target && (
          <div className="action-row compass-actions">
            <Button variant="ghost" to={`/stop/${target.id}`}>
              {target.title} →
            </Button>
            {target.coord && (
              <Button variant="ghost" href={directionsUrl(target.coord)} external>
                Directions →
              </Button>
            )}
            <Button variant="ghost" to={`/map?stop=${target.id}`}>
              On the map →
            </Button>
          </div>
        )}

        <p className="page-footnote">
          Bearings are true, corrected for the park's magnetic declination (
          {PARK_DECLINATION_DEG.toFixed(1)}&deg; east). Phone compasses drift near car
          electronics and metal railings; wave the phone in a slow figure eight to
          recalibrate. For the drive, use <Link to="/map">the map</Link>: this instrument is
          for the last stretch on foot, and for knowing which wall of the valley the light
          will leave first.
        </p>
      </main>
    </GatedChrome>
  )
}

function roseAriaLabel(
  headingActive: boolean,
  headingDeg: number,
  targetTitle: string | undefined,
  bearingDeg: number | null,
): string {
  const parts: string[] = []
  parts.push(
    headingActive
      ? `Compass rose, heading ${Math.round(headingDeg)} degrees ${cardinalOf(headingDeg)}`
      : 'Compass rose, pinned north-up',
  )
  if (targetTitle && bearingDeg !== null) {
    parts.push(`${targetTitle} bears ${Math.round(bearingDeg)} degrees ${cardinalOf(bearingDeg)}`)
  }
  return parts.join('. ')
}
