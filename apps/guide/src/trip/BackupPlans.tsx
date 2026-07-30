// =============================================================================
// "If the day turns" — the shared rain and smoke fallback plans from
// content/itineraries.ts, rendered as informational cards under the trip
// presets. Live conditions decide the badge, not the content: a wet forecast
// (valley precip chance 40%+ today) lights up the rain plan, an AQI past 100
// lights up the smoke plan. Nothing seeds itself; the reader opens the stops
// and adds what they want, per the only-an-explicit-tap-writes rule.
// =============================================================================

import { Link } from 'react-router-dom'
import { useAir } from '../air/useAir'
import { HIDE_AFTER_MS as AIR_HIDE_MS } from '../air/staleness'
import { BACKUP_PLANS } from '../content/itineraries'
import { getStopById } from '../content'
import { todayIso } from '../utils/date'
import { useWeather } from '../weather/useWeather'
import { HIDE_AFTER_MS as WEATHER_HIDE_MS } from '../weather/staleness'
import './BackupPlans.css'

const RAIN_CHANCE_THRESHOLD = 40
const SMOKE_AQI_THRESHOLD = 101

export default function BackupPlans() {
  const weather = useWeather()
  const air = useAir()
  const today = todayIso()

  // Today's valley precip chance, under the normal staleness rules.
  const valley = weather.spots.find((s) => s.id === 'valley')
  const rainInPlay =
    weather.ageMs <= WEATHER_HIDE_MS &&
    (valley?.periods ?? []).some(
      (p) =>
        p.startTime.slice(0, 10) === today &&
        (p.precipChance ?? 0) >= RAIN_CHANCE_THRESHOLD,
    )
  const smokeInPlay =
    air.ageMs <= AIR_HIDE_MS && air.aqi !== null && air.aqi >= SMOKE_AQI_THRESHOLD

  const inPlay = { rain: rainInPlay, smoke: smokeInPlay }

  return (
    <div className="backup-plans">
      <span className="trip-presets__label">If the day turns:</span>
      {BACKUP_PLANS.map((plan) => (
        <details className="backup-plan" key={plan.trigger}>
          <summary>
            <span className="backup-plan__title">{plan.title}</span>
            {inPlay[plan.trigger] && (
              <span className="backup-plan__live">
                {plan.trigger === 'rain' ? 'rain in the forecast today' : 'smoke in the air now'}
              </span>
            )}
          </summary>
          <p className="backup-plan__note">{plan.note}</p>
          <p className="backup-plan__stops">
            {plan.stops.map((id, i) => {
              const stop = getStopById(id)
              if (!stop) return null
              return (
                <span key={id}>
                  {i > 0 && ' · '}
                  <Link to={`/stop/${id}`}>{stop.title}</Link>
                </span>
              )
            })}
          </p>
          {plan.trigger === 'smoke' && (
            <p className="backup-plan__stops">
              <Link to="/essentials/smoke-season">The smoke-season thresholds →</Link>
            </p>
          )}
        </details>
      ))}
    </div>
  )
}
