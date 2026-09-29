// =============================================================================
// "Yosemite, right now": the front page's opening unit (the September 2026
// home redesign). A heading naming the park's date and hour, then one card
// holding the three readings a visitor checks before deciding anything, in
// the order the redesign fixed: the weather, the light (a sun over a horizon,
// rising and setting between two half-suns), and how long the line is at each
// gate. Under the card, the Park Bulletin band carries the road that decides
// a trip on its face.
//
// It composes feeds the app already has (weather, entrance waits, roads) with
// the on-device sun calculation. It fetches nothing of its own: every hook
// shares one in-flight request per feed at module level, so mounting this
// alongside the rest of Home costs no extra network.
//
// Every block is independently honest. A feed that is missing, unreachable,
// or stale past its own HIDE window drops its block rather than showing a
// dash, a zero, or an error: a wrong reading here sends somebody up a closed
// road. The light block is computed on the device and can never be stale,
// which is what guarantees the card is never empty and never a moving layout
// anchor. Every live block names its source and age ("NPS · 14 min ago").
//
// The lot-status cell that used to sit here is gone (September 2026 home
// redesign): most lots read "unknown" most days. Lot status still renders where
// a lot is the subject: its map pin and the stops and hikes that park there.
// =============================================================================

import { useEffect, useState } from 'react'
import { useAlerts } from '../alerts/useAlerts'
import { HIDE_AFTER_MS as ALERTS_HIDE_MS } from '../alerts/staleness'
import { ARCHIVE_ORIGIN } from '../content/archive'
import { sunTimes } from '../sun/solar'
import {
  SCENE_HORIZON,
  SCENE_LEFT,
  SCENE_RIGHT,
  sunScene,
  type SunScene,
} from '../sun/sunScene'
import { addDaysIso, formatClock, parkNowMinutes, todayIso } from '../utils/date'
import { compactStamp } from '../utils/relativeStamp'
import { useWaits } from '../waits/useWaits'
import { HIDE_AFTER_MS as WAITS_HIDE_MS } from '../waits/staleness'
import { gateHighway, gateName, LONG_WAIT_MIN, waitWord } from '../waits/waitWord'
import { conditionKind, type ConditionKind } from '../weather/conditionKind'
import { groupPeriodsIntoDays } from '../weather/forecastDays'
import { shortPeriodName } from '../weather/periodName'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS as WEATHER_HIDE_MS, WARN_AFTER_MS } from '../weather/staleness'
import type { WeatherPeriodT } from '../weather/schema'
import './ParkNowPanel.css'

// Same heartbeat WaitsLine runs, and for the same reason: ages are computed at
// render, so a phone left open on Home would keep presenting the reading it
// loaded with long past the hide window.
const TICK_MS = 60 * 1000

// The valley is the reference point for the card's weather and light: it is
// where most visitors are, and the region pages carry the other three.
const REFERENCE_REGION = 'valley'

// The Park Bulletin lives on the editorial site (`/now`), rewritten once per
// NPS Yosemite Guide edition. It is a link out, so it needs the network; the
// readings above it do not.
const BULLETIN_URL = `${ARCHIVE_ORIGIN}/now`

// The bar's full width. A longer wait pins the bar; the number carries it.
const BAR_SCALE_MIN = 60

// How many NWS half-day periods follow the current one.
const NEXT_PERIODS = 4

// "NPS · 14 min ago" from a feed's fetchedAt. Just the source when the feed
// gave no stamp.
function sourceStamp(source: string, fetchedAt: string | null, now: number): string {
  const age = fetchedAt ? compactStamp(fetchedAt, now) : null
  return age ? `${source} · ${age}` : source
}

// Tioga is the road a trip actually pivots on, so it leads when the feed knows
// its status; everything else keeps the order the feed gave.
function roadsInDecisionOrder<T extends { id: string; label: string }>(roads: T[]): T[] {
  const isTioga = (r: T) => `${r.id} ${r.label}`.toLowerCase().includes('tioga')
  return [...roads].sort((a, b) => Number(isTioga(b)) - Number(isTioga(a)))
}

// "4h 12m" / "38m".
function span(minutes: number): string {
  const m = Math.max(0, Math.round(minutes))
  const h = Math.floor(m / 60)
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`
}

// formatClock gives "7:03 p.m."; the card sets the figure large and the
// meridiem small, so split it once here.
function Clock({ minutes }: { minutes: number }) {
  const [figure, meridiem] = formatClock(minutes).split(' ')
  return (
    <>
      {figure}
      <span className="glance-time__meridiem">{meridiem}</span>
    </>
  )
}

// "Mon Sep 28" for the park's date.
function parkDateLabel(iso: string): string {
  return new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
    .replace(',', '')
}

// The NWS period in force now: the last one that has started. A forecast
// fetched this morning still opens with "Today" after lunch, and the card
// should read "This Afternoon"-onward, not the morning that has passed.
function currentPeriodIndex(periods: WeatherPeriodT[], now: number): number {
  let idx = 0
  periods.forEach((p, i) => {
    const t = Date.parse(p.startTime)
    if (!Number.isNaN(t) && t <= now) idx = i
  })
  return idx
}

// Eight rays around a disc, as one path. The disc is drawn r = 9 in the scene;
// rays run from 13 to 18 units out, the same in every direction.
function rayPath(cx: number, cy: number): string {
  const seg: string[] = []
  for (let deg = 0; deg < 360; deg += 45) {
    const a = (deg * Math.PI) / 180
    const x1 = cx + 13 * Math.cos(a)
    const y1 = cy + 13 * Math.sin(a)
    const x2 = cx + 18 * Math.cos(a)
    const y2 = cy + 18 * Math.sin(a)
    seg.push(`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`)
  }
  return seg.join('')
}

function ConditionIcon({ kind }: { kind: ConditionKind }) {
  const common = {
    className: 'glance-wx__icon',
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  const sun = (
    <>
      <circle cx="9" cy="8.5" r="3" stroke="var(--moss)" />
      <path d="M9 2.5v1M3 8.5h1M4.8 4.3l.7.7M13.2 4.3l-.7.7" stroke="var(--moss)" />
    </>
  )
  const cloud = (
    <path
      d="M8.5 20h9.2a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.4 1.3A3 3 0 0 0 8.5 20z"
      stroke="var(--ink)"
    />
  )
  switch (kind) {
    case 'partly':
      return (
        <svg {...common}>
          {sun}
          {cloud}
        </svg>
      )
    case 'cloudy':
      return (
        <svg {...common}>
          <path d="M7 19h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 19z" stroke="var(--ink)" />
        </svg>
      )
    case 'rain':
      return (
        <svg {...common}>
          <path d="M7 15h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 15z" stroke="var(--ink)" />
          <path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5" stroke="var(--moss)" />
        </svg>
      )
    case 'snow':
      return (
        <svg {...common}>
          <path d="M7 15h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 15z" stroke="var(--ink)" />
          <path d="M8 18.5v.1M12 19.5v.1M16 18.5v.1M10 21v.1M14 21v.1" stroke="var(--moss)" strokeWidth="2.2" />
        </svg>
      )
    case 'storm':
      return (
        <svg {...common}>
          <path d="M7 14h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.3 1.6A3.3 3.3 0 0 0 7 14z" stroke="var(--ink)" />
          <path d="M12.5 14l-2.5 4h3l-2 4" stroke="var(--moss)" />
        </svg>
      )
    case 'fog':
      return (
        <svg {...common}>
          <path d="M4 9h13M3 13h16M6 17h13" stroke="var(--ink)" />
        </svg>
      )
    case 'clear-night':
      return (
        <svg {...common}>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" stroke="var(--ink)" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" stroke="var(--moss)" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" stroke="var(--moss)" />
        </svg>
      )
  }
}

// The horizon scene: a flat horizon, a half-sun on it at each end (sunrise
// outlined, sunset filled in the accent), and between them the sun where the
// clock puts it, with the light so far drawn as a solid line along the horizon
// and a dotted drop line down to it. Before sunrise and after sunset there is
// no sun above the horizon, so only the two half-suns and the line remain.
function HorizonScene({ scene, label }: { scene: SunScene; label: string }) {
  const H = SCENE_HORIZON
  const elapsedTo = scene.phase === 'day' ? scene.x : scene.phase === 'after' ? SCENE_RIGHT : null
  return (
    <svg
      className="glance-scene"
      viewBox="0 0 358 100"
      width="100%"
      role="img"
      aria-label={label}
    >
      <rect x="0" y={H} width="358" height="16" className="glance-scene__ground" />
      <line x1="0" y1={H} x2="358" y2={H} className="glance-scene__horizon" />
      {elapsedTo !== null && (
        <line x1={SCENE_LEFT} y1={H} x2={elapsedTo} y2={H} className="glance-scene__elapsed" />
      )}
      {scene.phase === 'day' && (
        <line
          x1={scene.x}
          y1={scene.y + 22}
          x2={scene.x}
          y2={H}
          className="glance-scene__drop"
        />
      )}
      {/* Sunrise: an outlined half-sun with three rays. */}
      <path d="M18 84a12 12 0 0 1 24 0" className="glance-scene__rise" />
      <path d="M18.7 72.7l-2.8-2.8M30 68v-4M41.3 72.7l2.8-2.8" className="glance-scene__rise-rays" />
      {/* Sunset: a filled half-sun in the accent. */}
      <path d="M316 84a12 12 0 0 1 24 0z" className="glance-scene__set" />
      <path d="M316.7 72.7l-2.8-2.8M328 68v-4M339.3 72.7l2.8-2.8" className="glance-scene__set-rays" />
      {scene.phase === 'day' && (
        <>
          <circle cx={scene.x} cy={scene.y} r="21" className="glance-scene__halo" />
          <circle cx={scene.x} cy={scene.y} r="9" className="glance-scene__sun" />
          <path d={rayPath(scene.x, scene.y)} className="glance-scene__rays" />
        </>
      )}
    </svg>
  )
}

function SunriseMark() {
  return (
    <svg className="glance-time__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17h16M7.5 17a4.5 4.5 0 0 1 9 0M12 6v3M5.6 10.6l1.6 1.6M18.4 10.6l-1.6 1.6" />
    </svg>
  )
}

function SunsetMark() {
  return (
    <svg className="glance-time__icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17h16M7.5 17a4.5 4.5 0 0 1 9 0M12 5v4M10 7.5l2 2 2-2" />
    </svg>
  )
}

export default function ParkNowPanel() {
  const weather = useWeather()
  const alerts = useAlerts()
  const { waits, fetchedAt: waitsFetchedAt } = useWaits()
  const [now, setNow] = useState(() => Date.now())
  const [nowMin, setNowMin] = useState(parkNowMinutes)

  useEffect(() => {
    const tick = () => {
      setNow(Date.now())
      setNowMin(parkNowMinutes())
    }
    const id = setInterval(tick, TICK_MS)
    // Intervals are suspended in the background on iOS especially, so a
    // return to the foreground would show the pre-suspend age for a full tick.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // ---- Weather -------------------------------------------------------------
  const spot = weather.spots.find((s) => s.id === REFERENCE_REGION)
  const showWeather = !!spot && spot.periods.length > 0 && weather.ageMs <= WEATHER_HIDE_MS
  const periods = spot?.periods ?? []
  const nowIdx = currentPeriodIndex(periods, now)
  const current = periods[nowIdx]
  const next = periods.slice(nowIdx + 1, nowIdx + 1 + NEXT_PERIODS)
  const todayDay = spot ? groupPeriodsIntoDays(spot.periods, 1)[0] : undefined
  const staleWeather = weather.ageMs > WARN_AFTER_MS

  // ---- Light ---------------------------------------------------------------
  // Today's pair while the sun is up or still to rise; after sunset the
  // sunrise column turns over to tomorrow rather than reporting a time that
  // has passed.
  const today = todayIso()
  const times = sunTimes(today)
  const afterSunset = times ? nowMin >= times.sunsetMin : false
  const tomorrow = afterSunset ? sunTimes(addDaysIso(today, 1)) : null
  const daylight = times && nowMin >= times.sunriseMin && nowMin < times.sunsetMin
  const sunStatus = !times
    ? null
    : daylight
      ? `${span(times.sunsetMin - nowMin)} of light left`
      : afterSunset
        ? 'The sun is down'
        : `Sunrise in ${span(times.sunriseMin - nowMin)}`
  const scene = times ? sunScene(nowMin, times.sunriseMin, times.sunsetMin) : null
  const sceneLabel = !times
    ? ''
    : daylight
      ? `The sun is above the horizon. Sunrise was at ${formatClock(times.sunriseMin)}, and it sets at ${formatClock(times.sunsetMin)}.`
      : afterSunset
        ? `The sun has set. It set at ${formatClock(times.sunsetMin)}.`
        : `The sun has not risen. It rises at ${formatClock(times.sunriseMin)}.`

  // ---- Entrance waits ------------------------------------------------------
  // Every entrance the feed lists keeps its column; one it marks stale reads
  // "n/a" rather than vanishing, so the row keeps a stable shape. The block
  // drops only when the whole feed is old or knows nothing.
  const waitsFetchedMs = waitsFetchedAt ? Date.parse(waitsFetchedAt) : Number.NaN
  const waitsAgeMs = Number.isNaN(waitsFetchedMs) ? Number.POSITIVE_INFINITY : now - waitsFetchedMs
  const showWaits = waitsAgeMs <= WAITS_HIDE_MS && waits.some((w) => w.minutes !== null)

  // ---- Roads, carried on the bulletin link ---------------------------------
  // An unknown road is dropped, not printed: NPS pulls the closure alert when
  // a road opens, so silence is not a status.
  const knownRoads = roadsInDecisionOrder(alerts.roads.filter((r) => r.status !== 'unknown'))
  const roadNotes: string[] = []
  if (alerts.ageMs <= ALERTS_HIDE_MS) {
    for (const r of knownRoads.slice(0, 2)) roadNotes.push(`${r.label} ${r.status.toLowerCase()}`)
    if (alerts.chains) roadNotes.push('Chains in effect')
  }
  const roadClosed = knownRoads.some((r) => r.status.toLowerCase().includes('closed'))

  const hasCard = (showWeather && !!current) || !!times || showWaits

  return (
    <>
      <header className="glance-head">
        <span className="glance-head__eyebrow">Yosemite National Park · {parkDateLabel(today)}</span>
        <h1 className="glance-head__title">Yosemite, right now</h1>
        <span className="glance-head__sub">Yosemite Valley · {formatClock(nowMin)} Pacific</span>
      </header>

      {hasCard && (
        <section className="glance" aria-label="Conditions right now">
          {showWeather && current && (
            <div className="glance-block glance-block--wx">
              <div className="glance-block__head">
                <h2 className="glance-block__label">Weather · Valley floor</h2>
                <span
                  className={
                    staleWeather ? 'glance-block__stamp glance-block__stamp--warn' : 'glance-block__stamp'
                  }
                >
                  {staleWeather ? 'Forecast is old · ' : ''}
                  {sourceStamp('NWS', weather.fetchedAt, now)}
                </span>
              </div>
              <div className="glance-wx">
                <span className="glance-wx__temp">
                  {current.tempF}
                  <span className="glance-wx__unit">°F</span>
                </span>
                <span className="glance-wx__detail">
                  <span className="glance-wx__sky">
                    <ConditionIcon kind={conditionKind(current.shortForecast, current.isDaytime)} />
                    {current.shortForecast}
                  </span>
                  {todayDay && (todayDay.hiF !== null || todayDay.loF !== null) && (
                    <span className="glance-wx__meta">
                      {todayDay.hiF !== null ? `High ${todayDay.hiF}°` : ''}
                      {todayDay.hiF !== null && todayDay.loF !== null ? ' · ' : ''}
                      {todayDay.loF !== null ? `Low ${todayDay.loF}°` : ''}
                    </span>
                  )}
                  {(current.windSpeed || (current.precipChance ?? 0) >= 20) && (
                    <span className="glance-wx__meta">
                      {current.windSpeed ? `Wind ${current.windSpeed}` : ''}
                      {current.windSpeed && (current.precipChance ?? 0) >= 20 ? ' · ' : ''}
                      {(current.precipChance ?? 0) >= 20 ? `${current.precipChance}% rain` : ''}
                    </span>
                  )}
                </span>
              </div>
              {next.length > 0 && (
                <ol
                  className="glance-wx__next"
                  style={{ gridTemplateColumns: `repeat(${next.length}, minmax(0, 1fr))` }}
                >
                  {next.map((p) => (
                    <li key={p.startTime} className="glance-wx__period">
                      <span className="glance-wx__period-name">{shortPeriodName(p.name)}</span>
                      <span className="glance-wx__period-temp">{p.tempF}°</span>
                      <span className="glance-wx__period-sky">{p.shortForecast}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {times && scene && (
            <div className="glance-block">
              <div className="glance-block__head">
                <h2 className="glance-block__label">Light</h2>
                {sunStatus && <span className="glance-block__stamp glance-block__stamp--ink">{sunStatus}</span>}
              </div>
              <HorizonScene scene={scene} label={sceneLabel} />
              <div className="glance-times">
                <div className="glance-time">
                  <span className="glance-time__label">
                    <SunriseMark />
                    {tomorrow ? 'Sunrise tomorrow' : 'Sunrise'}
                  </span>
                  <span className="glance-time__figure">
                    <Clock minutes={(tomorrow ?? times).sunriseMin} />
                  </span>
                  <span className="glance-time__note">
                    Golden until {formatClock((tomorrow ?? times).goldenAmEndMin)}
                  </span>
                </div>
                <div className="glance-time glance-time--now">
                  <span className="glance-time__label glance-time__label--now">Now</span>
                  <span className="glance-time__now">{formatClock(nowMin)}</span>
                </div>
                <div className="glance-time glance-time--end">
                  <span className="glance-time__label">
                    Sunset
                    <SunsetMark />
                  </span>
                  <span className="glance-time__figure glance-time__figure--set">
                    <Clock minutes={times.sunsetMin} />
                  </span>
                  <span className="glance-time__note">
                    Alpenglow begins at {formatClock(times.goldenPmStartMin)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {showWaits && (
            <div className="glance-block">
              <div className="glance-block__head">
                <h2 className="glance-block__label">Entrance waits</h2>
                <span className="glance-block__stamp">{sourceStamp('NPS', waitsFetchedAt, now)}</span>
              </div>
              <ul className="glance-waits">
                {waits.map((w) => {
                  const long = w.minutes !== null && w.minutes >= LONG_WAIT_MIN
                  const pct = w.minutes === null ? 0 : Math.min(100, (w.minutes / BAR_SCALE_MIN) * 100)
                  const hwy = gateHighway(w.name)
                  return (
                    <li key={w.name} className={long ? 'glance-wait glance-wait--long' : 'glance-wait'}>
                      <span className="glance-wait__name">{gateName(w.name)}</span>
                      <span className="glance-wait__hwy">{hwy ?? ' '}</span>
                      <span className="glance-wait__value">
                        {w.minutes === null ? (
                          <span className="glance-wait__none">n/a</span>
                        ) : (
                          <>
                            {w.minutes}
                            <span className="glance-wait__unit">min</span>
                          </>
                        )}
                      </span>
                      <span className="glance-wait__bar" aria-hidden="true">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <span className="glance-wait__word">
                        {w.minutes === null ? 'Not reported' : waitWord(w.minutes)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      <a className="glance-bulletin" href={BULLETIN_URL} target="_blank" rel="noopener">
        <span className="glance-bulletin__text">
          <span className="glance-bulletin__label">The Park Bulletin</span>
          <span className="glance-bulletin__title">Alerts, roads, programs and hours</span>
          {roadNotes.length > 0 && (
            <span
              className={
                roadClosed ? 'glance-bulletin__note glance-bulletin__note--alert' : 'glance-bulletin__note'
              }
            >
              <span className="glance-bulletin__dot" aria-hidden="true" />
              {roadNotes.join(' · ')}
            </span>
          )}
        </span>
        <svg className="glance-bulletin__arrow" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </>
  )
}
