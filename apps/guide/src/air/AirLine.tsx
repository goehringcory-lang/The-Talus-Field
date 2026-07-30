// =============================================================================
// One-line air quality: "Air quality · AQI 158 Unhealthy (PM2.5)". Owns its
// own useAir(); renders nothing without a reading or past HIDE_AFTER_MS,
// because a stale AQI on a smoke day misleads in exactly the direction that
// matters. The reading on the morning of is the fact (see the smoke-season
// essentials topic, which tells readers what to do with this number).
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from './staleness'
import { useAir } from './useAir'

export default function AirLine() {
  const { aqi, pollutant, category, fetchedAt, ageMs } = useAir()

  if (aqi === null) return null
  if (ageMs > HIDE_AFTER_MS) return null

  return (
    <p className="waits-line">
      <span className="waits-line__muted">Air quality · </span>
      <span className="waits-line__entry">
        AQI <strong>{aqi}</strong>
        {category ? ` ${category}` : ''}
        {pollutant ? <span className="waits-line__muted"> ({pollutant})</span> : null}
      </span>
      {fetchedAt && ageMs > WARN_AFTER_MS && (
        <span className="waits-line__muted"> · as of {relativeStamp(fetchedAt)}</span>
      )}
    </p>
  )
}
