// =============================================================================
// One-line live entrance waits: "At the entrances now · South 45 min ·
// Arch Rock 20 min · Big Oak Flat n/a". Owns its own useWaits(); renders
// nothing when the feed is empty, older than HIDE_AFTER_MS, or every entrance
// is unknown. Entrances the feed marks stale render "n/a" rather than being
// dropped, so the line keeps a stable shape. Shared by Home and /today.
// =============================================================================

import { relativeStamp } from '../utils/relativeStamp'
import { useWaits } from './useWaits'
import { HIDE_AFTER_MS, STAMP_AFTER_MS } from './staleness'

export default function WaitsLine() {
  const { waits, fetchedAt, ageMs } = useWaits()

  if (waits.length === 0) return null
  if (ageMs > HIDE_AFTER_MS) return null
  if (waits.every((w) => w.minutes === null)) return null

  return (
    <p className="waits-line">
      <span className="waits-line__muted">At the entrances now · </span>
      {waits.map((w, i) => (
        <span key={w.name} className="waits-line__entry">
          {i > 0 && <span className="waits-line__muted"> · </span>}
          {w.name}{' '}
          <strong>{w.minutes === null ? 'n/a' : `${w.minutes} min`}</strong>
        </span>
      ))}
      {fetchedAt && ageMs > STAMP_AFTER_MS && (
        <span className="waits-line__muted"> · as of {relativeStamp(fetchedAt)}</span>
      )}
    </p>
  )
}
