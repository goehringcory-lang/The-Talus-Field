// =============================================================================
// "The park, right now": the four live readings a visitor checks before they
// decide anything, on one instrument panel at the top of Home.
//
// It composes feeds the app already has (weather, roads, entrance waits) with
// the on-device sun calculation. It fetches nothing of its own: all four hooks
// share one in-flight request per feed at module level, so mounting this
// alongside the rest of Home costs no extra network.
//
// Every cell is independently honest. A feed that is missing, unreachable, or
// stale past its own HIDE window drops its cell rather than showing a dash, a
// zero, or an error: a wrong reading here sends somebody up a closed road. The
// sun cell is computed on the device and can never be stale, which is what
// guarantees the panel is never empty and never a moving layout anchor.
// =============================================================================

import { useEffect, useState } from 'react'
import { useAlerts } from '../alerts/useAlerts'
import { HIDE_AFTER_MS as ALERTS_HIDE_MS } from '../alerts/staleness'
import { sunTimes } from '../sun/solar'
import { addDaysIso, formatClock, parkNowMinutes, todayIso } from '../utils/date'
import { relativeStamp } from '../utils/relativeStamp'
import { useWaits } from '../waits/useWaits'
import { HIDE_AFTER_MS as WAITS_HIDE_MS } from '../waits/staleness'
import { groupPeriodsIntoDays } from '../weather/forecastDays'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS as WEATHER_HIDE_MS, WARN_AFTER_MS } from '../weather/staleness'

// Same heartbeat WaitsLine runs, and for the same reason: ages are computed at
// render, so a phone left open on Home would keep presenting the reading it
// loaded with long past the hide window.
const TICK_MS = 60 * 1000

// The valley is the reference point for the panel's weather and light: it is
// where most visitors are, and the region rows below carry the other three.
const REFERENCE_REGION = 'valley'

type Cell = {
  key: string
  label: string
  value: string
  tone?: 'signal' | 'alert'
  note?: string
}

// Tioga is the road a trip actually pivots on, so it leads when the feed knows
// its status; everything else keeps the order the feed gave.
function roadsInDecisionOrder<T extends { id: string; label: string }>(roads: T[]): T[] {
  const isTioga = (r: T) => `${r.id} ${r.label}`.toLowerCase().includes('tioga')
  return [...roads].sort((a, b) => Number(isTioga(b)) - Number(isTioga(a)))
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

  const cells: Cell[] = []

  // ---- Weather -------------------------------------------------------------
  const spot = weather.spots.find((s) => s.id === REFERENCE_REGION)
  const day = spot ? groupPeriodsIntoDays(spot.periods, 1)[0] : undefined
  if (day && weather.ageMs <= WEATHER_HIDE_MS) {
    cells.push({
      key: 'weather',
      label: 'Valley today',
      value: `${day.hiF ?? '–'}°/${day.loF ?? '–'}°`,
      note: day.precipChance && day.precipChance >= 20
        ? `${day.shortForecast} · ${day.precipChance}% rain`
        : day.shortForecast,
    })
  }

  // ---- Light ---------------------------------------------------------------
  // Never stale (computed here), so this is the cell that guarantees the panel
  // has something to say. After sunset it turns over to tomorrow's sunrise
  // rather than reporting a time that has already passed.
  const today = todayIso()
  const times = sunTimes(today)
  if (times) {
    if (nowMin >= times.sunsetMin) {
      const tomorrow = sunTimes(addDaysIso(today, 1))
      if (tomorrow) {
        cells.push({
          key: 'sun',
          label: 'Sunrise',
          value: formatClock(tomorrow.sunriseMin),
          note: `Tomorrow · golden until ${formatClock(tomorrow.goldenAmEndMin)}`,
        })
      }
    } else {
      cells.push({
        key: 'sun',
        label: 'Sunset',
        value: formatClock(times.sunsetMin),
        note: `Golden light from ${formatClock(times.goldenPmStartMin)}`,
      })
    }
  }

  // ---- Roads ---------------------------------------------------------------
  // An unknown road is dropped, not printed: NPS pulls the closure alert when a
  // road opens, so silence is not a status.
  const knownRoads = roadsInDecisionOrder(alerts.roads.filter((r) => r.status !== 'unknown'))
  if (alerts.ageMs <= ALERTS_HIDE_MS && (knownRoads.length > 0 || alerts.chains)) {
    const lead = knownRoads[0]
    const rest = knownRoads.slice(1).map((r) => `${r.label} ${r.status}`)
    if (alerts.chains) rest.push('Chains in effect')
    cells.push({
      key: 'roads',
      label: lead ? lead.label : 'Roads',
      value: lead ? lead.status : 'Chains',
      tone: lead && lead.status.toLowerCase().includes('closed') ? 'alert' : 'signal',
      note: rest.join(' · ') || undefined,
    })
  }

  // ---- Entrance waits ------------------------------------------------------
  const waitsFetchedMs = waitsFetchedAt ? Date.parse(waitsFetchedAt) : Number.NaN
  const waitsAgeMs = Number.isNaN(waitsFetchedMs)
    ? Number.POSITIVE_INFINITY
    : now - waitsFetchedMs
  const knownWaits = waits.filter((w) => w.minutes !== null)
  if (waitsAgeMs <= WAITS_HIDE_MS && knownWaits.length > 0) {
    const lead = knownWaits[0]
    cells.push({
      key: 'waits',
      label: `${lead.name} gate`,
      value: `${lead.minutes} min`,
      tone: (lead.minutes ?? 0) >= 30 ? 'alert' : undefined,
      note: knownWaits
        .slice(1)
        .map((w) => `${w.name} ${w.minutes}`)
        .join(' · ') || undefined,
    })
  }

  if (cells.length === 0) return null

  const stampSource = weather.fetchedAt ?? alerts.fetchedAt ?? waitsFetchedAt
  const stale = weather.ageMs > WARN_AFTER_MS

  return (
    <section className="panel" aria-label="The park right now">
      <div className="panel__head">
        <span className="panel__title">The park · right now</span>
        {stampSource && (
          <span className={stale ? 'panel__stamp panel__stamp--warn' : 'panel__stamp'}>
            {stale ? 'Readings are old · ' : ''}
            {relativeStamp(stampSource)}
          </span>
        )}
      </div>
      <div className="panel__grid">
        {cells.map((cell, i) => (
          <div
            key={cell.key}
            className={
              // An odd final cell spans the row; a half-width gap would show
              // the grid's rule colour and read as a cell that failed to load.
              cells.length % 2 === 1 && i === cells.length - 1 ? 'readout readout--wide' : 'readout'
            }
          >
            <span className="readout__label">{cell.label}</span>
            <span
              className={
                cell.tone ? `readout__value readout__value--${cell.tone}` : 'readout__value'
              }
            >
              {cell.value}
            </span>
            {cell.note && <span className="readout__note">{cell.note}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
