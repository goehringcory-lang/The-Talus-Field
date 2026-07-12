// =============================================================================
// WeatherStrip — the region-page forecast surface: the next few periods for
// that region's spot. (Home renders per-card RegionForecast blocks instead.)
//
// Weather is garnish, never a blocker: no data renders nothing, not an error
// card. Staleness is handled honestly: past WARN_AFTER the strip says the
// forecast is old; past HIDE_AFTER a stale forecast presented as current is
// worse than none, so nothing renders.
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import { useWeather } from './useWeather'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from './staleness'
import type { WeatherSpotIdT } from './schema'

export default function WeatherStrip({ region }: { region: WeatherSpotIdT }) {
  const { spots, fetchedAt, ageMs, offline } = useWeather()

  if (spots.length === 0 || ageMs > HIDE_AFTER_MS) return null

  const spot = spots.find((s) => s.id === region)
  if (!spot) return null

  return (
    <section aria-label="Weather" className="page-section">
      <span className="eyebrow">Weather</span>
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
