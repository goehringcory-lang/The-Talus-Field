// =============================================================================
// One-line road status: "Roads now · Tioga Road closed · Chains in effect".
// Owns its own useAlerts(); renders nothing when every road is unknown and no
// chain notice is active, or when the alert set is older than HIDE_AFTER_MS.
// Unknown roads are dropped rather than shown as "unknown": NPS removes a
// closure alert when a road opens, so silence is not a status and printing it
// would claim more than the feed knows. Shared by Home and /today; reuses the
// waits-line classes so the conditions lines read as one family.
// =============================================================================

import { Fragment } from 'react'
import { relativeStamp } from '../utils/relativeStamp'
import { HIDE_AFTER_MS, WARN_AFTER_MS } from './staleness'
import { useAlerts } from './useAlerts'

export default function RoadsLine() {
  const { roads, chains, fetchedAt, ageMs } = useAlerts()

  if (ageMs > HIDE_AFTER_MS) return null
  const known = roads.filter((r) => r.status !== 'unknown')
  if (known.length === 0 && !chains) return null

  return (
    <p className="waits-line">
      <span className="waits-line__muted">Roads now · </span>
      {known.map((r, i) => (
        <Fragment key={r.id}>
          {i > 0 && <span className="waits-line__muted"> · </span>}
          <span className="waits-line__entry">
            {r.label} <strong>{r.status}</strong>
          </span>
        </Fragment>
      ))}
      {chains && (
        <>
          {known.length > 0 && <span className="waits-line__muted"> · </span>}
          <span className="waits-line__entry">
            <strong>Chains in effect</strong>
          </span>
        </>
      )}
      {fetchedAt && ageMs > WARN_AFTER_MS && (
        <span className="waits-line__muted"> · as of {relativeStamp(fetchedAt)}</span>
      )}
    </p>
  )
}
