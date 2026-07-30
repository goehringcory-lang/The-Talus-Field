// =============================================================================
// One-line river flow: "Merced River · strong flow · 410 cfs at Happy Isles".
// Owns its own useFlow(); renders nothing without a band or past
// HIDE_AFTER_MS (72h: snowmelt moves on a days scale, so a stale band stays
// honest longer than a stale AQI). The band words come from the Worker's
// flowBand mapping and are the reader-facing copy; this line never rephrases
// them.
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from './staleness'
import { useFlow } from './useFlow'

export default function FlowLine() {
  const { band, cfs, fetchedAt, ageMs } = useFlow()

  if (band === null) return null
  if (ageMs > HIDE_AFTER_MS) return null

  return (
    <p className="waits-line">
      <span className="waits-line__muted">Merced River · </span>
      <span className="waits-line__entry">
        <strong>{band}</strong>
        {band !== 'dry' && <span className="waits-line__muted"> flow</span>}
      </span>
      {cfs !== null && (
        <span className="waits-line__muted"> · {Math.round(cfs)} cfs at Happy Isles</span>
      )}
      {fetchedAt && ageMs > WARN_AFTER_MS && (
        <span className="waits-line__muted"> · as of {relativeStamp(fetchedAt)}</span>
      )}
    </p>
  )
}
