// =============================================================================
// WeatherStrip — the region-page forecast surface: the five-day week at a
// glance (RegionForecast) plus the next few NWS periods in detail. (Home's
// region index rows carry only a one-line current forecast; this page is
// where the full picture lives.)
//
// Weather is garnish, never a blocker: no data renders nothing, not an error
// card. Staleness is handled honestly: past WARN_AFTER the strip says the
// forecast is old; past HIDE_AFTER a stale forecast presented as current is
// worse than none, so nothing renders.
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import SunLine from '../sun/SunLine'
import { todayIso } from '../utils/date'
import RegionForecast from './RegionForecast'
import { useWeather } from './useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from './staleness'
import type { WeatherSpotIdT } from './schema'

export default function WeatherStrip({ region }: { region: WeatherSpotIdT }) {
  const { spots, fetchedAt, ageMs, offline } = useWeather()

  // Sun times are computed, not fetched, so this section survives the weather
  // staleness gate: with no usable forecast it renders the sun line alone.
  // This is the one deliberate loosening of the "weather renders nothing"
  // rule, and only because the sun numbers cannot be stale.
  const spot =
    spots.length > 0 && ageMs <= HIDE_AFTER_MS
      ? spots.find((s) => s.id === region)
      : undefined

  return (
    <section aria-label="Weather and light" className="page-section">
      <span className="eyebrow">Weather &amp; light</span>
      {spot && (
        <>
          <div className="weather-strip__week">
            <RegionForecast spot={spot} />
          </div>
          <span className="weather-strip__sub">In detail</span>
          <ul className="weather-strip">
            {/* The next few periods for this spot, two days out. */}
            {spot.periods.slice(0, 4).map((period) => (
              <li key={period.startTime}>
                <span className="weather-strip__muted">{period.name} · </span>
                {period.tempF}°, {period.shortForecast.toLowerCase()}
                {period.precipChance && period.precipChance >= 20 ? (
                  <span className="weather-strip__muted"> · {period.precipChance}% rain</span>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
      <SunLine dateIso={todayIso()} />
      {spot && fetchedAt && (
        <p className="weather-strip__stamp">
          Forecast as of {relativeStamp(fetchedAt)}
          {offline ? ', saved on this device' : ''}
          {ageMs > WARN_AFTER_MS ? '. This forecast is old; conditions have likely moved on.' : ''}
          {' '}· National Weather Service
        </p>
      )}
    </section>
  )
}
