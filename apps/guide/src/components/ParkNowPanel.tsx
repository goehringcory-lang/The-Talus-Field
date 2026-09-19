// =============================================================================
// "Yosemite, right now": the front page's at-a-glance board. Four blocks in
// the order a visitor asks them: how long is the line at the gate, how much
// light is left, what is the weather doing, and where is everything else (the
// Park Bulletin, with the road that decides a trip printed on the link).
//
// It composes feeds the app already has (entrance waits, weather, roads) with
// the on-device sun calculation. It fetches nothing of its own: every hook
// shares one in-flight request per feed at module level, so mounting this
// alongside the rest of Home costs no extra network.
//
// Every block is independently honest. A feed that is missing, unreachable,
// or stale past its own HIDE window drops its block rather than showing a
// dash, a zero, or an error: a wrong reading here sends somebody up a closed
// road. The sun block is computed on the device and can never be stale, which
// is what guarantees the board is never empty and never a moving layout
// anchor. Every live block names its source and age ("NPS, 14 min ago").
//
// The lot-status cell that used to sit here is gone (September 2026 home
// redesign): most lots read "unknown" most days, and one lot's word on the
// front page was noise ahead of the readings a trip actually turns on. Lot
// status still renders where a lot is the subject: its map pin and the stops
// and hikes that park there.
// =============================================================================

import { useEffect, useState } from 'react'
import { useAlerts } from '../alerts/useAlerts'
import { HIDE_AFTER_MS as ALERTS_HIDE_MS } from '../alerts/staleness'
import { ARCHIVE_ORIGIN } from '../content/archive'
import { sunTimes } from '../sun/solar'
import { addDaysIso, formatClock, parkNowMinutes, todayIso } from '../utils/date'
import { compactStamp } from '../utils/relativeStamp'
import { useWaits } from '../waits/useWaits'
import { HIDE_AFTER_MS as WAITS_HIDE_MS } from '../waits/staleness'
import { groupPeriodsIntoDays } from '../weather/forecastDays'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS as WEATHER_HIDE_MS, WARN_AFTER_MS } from '../weather/staleness'
import type { WeatherPeriodT } from '../weather/schema'

// Same heartbeat WaitsLine runs, and for the same reason: ages are computed at
// render, so a phone left open on Home would keep presenting the reading it
// loaded with long past the hide window.
const TICK_MS = 60 * 1000

// The valley is the reference point for the board's weather and light: it is
// where most visitors are, and the region rows below carry the other three.
const REFERENCE_REGION = 'valley'

// The Park Bulletin lives on the editorial site (`/now`), rewritten once per
// NPS Yosemite Guide edition. It is a link out, so it needs the network; the
// readings above it do not.
const BULLETIN_URL = `${ARCHIVE_ORIGIN}/now`

// A wait at or past this reads in the alert colour. Same threshold the panel
// cell used before the redesign.
const LONG_WAIT_MIN = 30
// The bar's full width. A longer wait pins the bar; the number carries it.
const BAR_SCALE_MIN = 60

// How many NWS half-day periods follow the current one.
const NEXT_PERIODS = 4

// "NPS, 14 min ago" from a feed's fetchedAt. Just the source when the feed
// gave no stamp.
function sourceStamp(source: string, fetchedAt: string | null, now: number): string {
  const age = fetchedAt ? compactStamp(fetchedAt, now) : null
  return age ? `${source}, ${age}` : source
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

// formatClock gives "7:03 p.m."; the board sets the figure large and the
// meridiem small, so split it once here.
function Clock({ minutes }: { minutes: number }) {
  const [figure, meridiem] = formatClock(minutes).split(' ')
  return (
    <>
      {figure}
      <span className="glance-sun__meridiem">{meridiem}</span>
    </>
  )
}

// The NWS period in force now: the last one that has started. A forecast
// fetched this morning still opens with "Today" after lunch, and the board
// should read "This Afternoon"-onward, not the morning that has passed.
function currentPeriodIndex(periods: WeatherPeriodT[], now: number): number {
  let idx = 0
  periods.forEach((p, i) => {
    const t = Date.parse(p.startTime)
    if (!Number.isNaN(t) && t <= now) idx = i
  })
  return idx
}

function SunriseMark() {
  return (
    <svg className="glance-sun__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17h16M7.5 17a4.5 4.5 0 0 1 9 0M12 6v3M5.6 10.6l1.6 1.6M18.4 10.6l-1.6 1.6" />
    </svg>
  )
}

function SunsetMark() {
  return (
    <svg className="glance-sun__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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

  // ---- Entrance waits ------------------------------------------------------
  // Every entrance the feed lists keeps its row; one it marks stale reads
  // "n/a" rather than vanishing, so the list keeps a stable shape. The block
  // drops only when the whole feed is old or knows nothing.
  const waitsFetchedMs = waitsFetchedAt ? Date.parse(waitsFetchedAt) : Number.NaN
  const waitsAgeMs = Number.isNaN(waitsFetchedMs) ? Number.POSITIVE_INFINITY : now - waitsFetchedMs
  const showWaits =
    waitsAgeMs <= WAITS_HIDE_MS && waits.some((w) => w.minutes !== null)

  // ---- Light ---------------------------------------------------------------
  // Today's pair while the sun is up or still to rise; after sunset the
  // sunrise card turns over to tomorrow rather than reporting a time that has
  // passed.
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
  const dayPct = times && daylight
    ? ((nowMin - times.sunriseMin) / (times.sunsetMin - times.sunriseMin)) * 100
    : null

  // ---- Weather -------------------------------------------------------------
  const spot = weather.spots.find((s) => s.id === REFERENCE_REGION)
  const showWeather = !!spot && spot.periods.length > 0 && weather.ageMs <= WEATHER_HIDE_MS
  const periods = spot?.periods ?? []
  const nowIdx = currentPeriodIndex(periods, now)
  const current = periods[nowIdx]
  const next = periods.slice(nowIdx + 1, nowIdx + 1 + NEXT_PERIODS)
  const todayDay = spot ? groupPeriodsIntoDays(spot.periods, 1)[0] : undefined
  const staleWeather = weather.ageMs > WARN_AFTER_MS

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

  return (
    <section className="glance" aria-labelledby="glance-title">
      <h2 id="glance-title" className="glance__title">Yosemite, right now</h2>

      {showWaits && (
        <section className="glance-block" aria-labelledby="glance-waits">
          <div className="glance-block__head">
            <h3 id="glance-waits" className="glance-block__label">Entrance waits</h3>
            <span className="glance-block__stamp">{sourceStamp('NPS', waitsFetchedAt, now)}</span>
          </div>
          <ul className="glance-waits">
            {waits.map((w) => {
              const long = w.minutes !== null && w.minutes >= LONG_WAIT_MIN
              const pct = w.minutes === null ? 0 : Math.min(100, (w.minutes / BAR_SCALE_MIN) * 100)
              return (
                <li key={w.name} className={long ? 'glance-wait glance-wait--long' : 'glance-wait'}>
                  <span className="glance-wait__name">{w.name}</span>
                  <span className="glance-wait__bar" aria-hidden="true">
                    <span style={{ width: `${pct}%` }} />
                  </span>
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
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {times && (
        <section className="glance-block" aria-labelledby="glance-sun">
          <div className="glance-block__head">
            <h3 id="glance-sun" className="glance-block__label">Sun · Yosemite Valley</h3>
            {sunStatus && <span className="glance-block__stamp">{sunStatus}</span>}
          </div>
          <div className="glance-sun">
            <div className="glance-sun__card">
              <span className="glance-sun__label">
                <SunriseMark />
                {tomorrow ? 'Sunrise tomorrow' : 'Sunrise'}
              </span>
              <span className="glance-sun__time">
                <Clock minutes={(tomorrow ?? times).sunriseMin} />
              </span>
              <span className="glance-sun__note">
                Golden until {formatClock((tomorrow ?? times).goldenAmEndMin)}
              </span>
            </div>
            <div className="glance-sun__card">
              <span className="glance-sun__label">
                <SunsetMark />
                Sunset
              </span>
              <span className="glance-sun__time glance-sun__time--set">
                <Clock minutes={times.sunsetMin} />
              </span>
              <span className="glance-sun__note">
                Golden from {formatClock(times.goldenPmStartMin)}
              </span>
            </div>
          </div>
          {dayPct !== null && (
            <div className="glance-day" aria-hidden="true">
              <span className="glance-day__track">
                <span style={{ width: `${dayPct}%` }} />
              </span>
              <span className="glance-day__scale">
                <span>{formatClock(times.sunriseMin)}</span>
                <span>Now {formatClock(nowMin)}</span>
                <span>{formatClock(times.sunsetMin)}</span>
              </span>
            </div>
          )}
        </section>
      )}

      {showWeather && current && (
        <section className="glance-block" aria-labelledby="glance-wx">
          <div className="glance-block__head">
            <h3 id="glance-wx" className="glance-block__label">Weather · Valley floor</h3>
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
            <span className="glance-wx__temp">{current.tempF}°</span>
            <span className="glance-wx__detail">
              <span className="glance-wx__sky">
                {current.name} · {current.shortForecast}
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
            <ol className="glance-wx__next">
              {next.map((p) => (
                <li key={p.startTime} className="glance-wx__period">
                  <span className="glance-wx__period-name">{p.name}</span>
                  <span className="glance-wx__period-temp">{p.tempF}°</span>
                  <span className="glance-wx__period-sky">{p.shortForecast}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      <a className="glance-bulletin" href={BULLETIN_URL} target="_blank" rel="noopener">
        <span className="glance-bulletin__text">
          <span className="glance-bulletin__label">The Park Bulletin</span>
          <span className="glance-bulletin__title">
            Alerts, roads, programs and hours for this edition
          </span>
          {roadNotes.length > 0 && (
            <span
              className={
                roadClosed ? 'glance-bulletin__note glance-bulletin__note--alert' : 'glance-bulletin__note'
              }
            >
              {roadNotes.join(' · ')}
            </span>
          )}
        </span>
        <svg className="glance-bulletin__arrow" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
  )
}
