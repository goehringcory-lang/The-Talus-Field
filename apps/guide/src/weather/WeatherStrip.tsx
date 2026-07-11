// =============================================================================
// WeatherStrip — the forecast surfaces. Without a region prop: one line per
// park spot (Home). With one: the next few periods for that region's spot.
//
// Weather is garnish, never a blocker: no data renders nothing, not an error
// card. Staleness is handled honestly: past WARN_AFTER the strip says the
// forecast is old; past HIDE_AFTER a stale forecast presented as current is
// worse than none, so nothing renders.
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import { useWeather } from './useWeather'
import type { WeatherSpotIdT, WeatherSpotT } from './schema'

const WARN_AFTER_MS = 12 * 60 * 60 * 1000
const HIDE_AFTER_MS = 48 * 60 * 60 * 1000

function periodLine(spot: WeatherSpotT): string | null {
  const period = spot.periods[0]
  if (!period) return null
  const rain =
    period.precipChance && period.precipChance >= 20 ? `, ${period.precipChance}% rain` : ''
  return `${period.name} ${period.tempF}°, ${period.shortForecast.toLowerCase()}${rain}`
}

export default function WeatherStrip({ region }: { region?: WeatherSpotIdT }) {
  const { spots, fetchedAt, ageMs, offline } = useWeather()

  if (spots.length === 0 || ageMs > HIDE_AFTER_MS) return null

  const shown = region ? spots.filter((s) => s.id === region) : spots
  if (shown.length === 0) return null

  return (
    <section aria-label="Weather" className="page-section">
      <span className="eyebrow">Weather</span>
      <ul className="weather-strip">
        {region ? (
          // Region page: the next few periods for this spot, two days out.
          shown[0].periods.slice(0, 4).map((period) => (
            <li key={period.startTime}>
              <span className="weather-strip__muted">{period.name} · </span>
              {period.tempF}°, {period.shortForecast.toLowerCase()}
              {period.precipChance && period.precipChance >= 20 ? (
                <span className="weather-strip__muted"> · {period.precipChance}% rain</span>
              ) : null}
            </li>
          ))
        ) : (
          // Home: one line per spot. The elevation is the editorial point:
          // it explains the temperature spread across the park.
          shown.map((spot) => {
            const line = periodLine(spot)
            if (!line) return null
            return (
              <li key={spot.id}>
                <span className="weather-strip__muted">{spot.label} · </span>
                {line}
                <span className="weather-strip__muted">
                  {' '}
                  · {spot.elevationFt.toLocaleString()} ft
                </span>
              </li>
            )
          })
        )}
      </ul>
      {fetchedAt && (
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
