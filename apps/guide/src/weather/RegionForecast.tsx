// =============================================================================
// RegionForecast — the compact five-day forecast on each region page (inside
// WeatherStrip). Hi/lo per calendar day, condition from the daytime half.
//
// The site line names the forecast point and its elevation: the elevation is
// the editorial point, it explains the temperature spread across the park and
// says which spot the numbers describe (Glacier Point, not the Mariposa
// Grove). Weather is garnish, never a blocker: no days renders nothing.
//
// Staleness is decided by the caller (WeatherStrip renders nothing past
// HIDE_AFTER); this component stays dumb.
// =============================================================================

import { groupPeriodsIntoDays } from './forecastDays'
import type { WeatherSpotT } from './schema'

export default function RegionForecast({ spot }: { spot: WeatherSpotT }) {
  const days = groupPeriodsIntoDays(spot.periods)
  if (days.length === 0) return null

  return (
    <div className="region-forecast">
      <span className="region-forecast__site">
        {spot.label} · {spot.elevationFt.toLocaleString()} ft
      </span>
      {days.map((day) => (
        <div key={day.date} className="region-forecast__day">
          <span className="region-forecast__label">{day.label}</span>
          <span className="region-forecast__temps">
            {day.hiF ?? '–'}°/{day.loF ?? '–'}°
          </span>
          <span className="region-forecast__cond">
            {day.shortForecast.toLowerCase()}
            {day.precipChance && day.precipChance >= 20 ? (
              <span className="region-forecast__rain"> · {day.precipChance}% rain</span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  )
}
