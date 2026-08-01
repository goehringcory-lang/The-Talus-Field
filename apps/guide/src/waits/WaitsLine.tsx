// =============================================================================
// One-line live entrance waits: "At the entrances now · South 45 min ·
// Arch Rock 20 min · Big Oak Flat n/a". Owns its own useWaits(); renders
// nothing when the feed is empty, older than HIDE_AFTER_MS, or every entrance
// is unknown. Entrances the feed marks stale render "n/a" rather than being
// dropped, so the line keeps a stable shape. Shared by Home and /today.
// =============================================================================

import { Fragment, useEffect, useState } from 'react'
import { relativeStamp } from '../utils/relativeStamp'
import { useWaits } from './useWaits'
import { HIDE_AFTER_MS, STAMP_AFTER_MS } from './staleness'

// Age is computed at render, so the line needs a heartbeat to re-run its own
// gates: a phone left sitting on /today would otherwise still be presenting the
// reading it loaded with, hours past HIDE_AFTER_MS. A minute is far finer than
// the ten-minute stamp and the hour-long hide it drives.
const TICK_MS = 60 * 1000

export default function WaitsLine() {
  const { waits, fetchedAt } = useWaits()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!fetchedAt) return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    // The interval is suspended in the background (iOS especially), so a
    // return to the foreground would show the pre-suspend age for up to a
    // tick; catching visibility restores the gates immediately.
    const onVisible = () => {
      if (document.visibilityState === 'visible') setNow(Date.now())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchedAt])

  const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : Number.NaN
  const ageMs = Number.isNaN(fetchedMs) ? Number.POSITIVE_INFINITY : now - fetchedMs

  if (waits.length === 0) return null
  if (ageMs > HIDE_AFTER_MS) return null
  if (waits.every((w) => w.minutes === null)) return null

  return (
    <p className="waits-line">
      <span className="waits-line__muted">At the entrances now · </span>
      {waits.map((w, i) => (
        // The separator sits OUTSIDE the nowrap entry on purpose: inside it,
        // the only spaces between entrances were unbreakable, so the whole
        // line became one unbreakable run and overflowed a phone's width.
        <Fragment key={w.name}>
          {i > 0 && <span className="waits-line__muted"> · </span>}
          <span className="waits-line__entry">
            {w.name} <strong>{w.minutes === null ? 'n/a' : `${w.minutes} min`}</strong>
          </span>
        </Fragment>
      ))}
      {fetchedAt && ageMs > STAMP_AFTER_MS && (
        <span className="waits-line__muted"> · as of {relativeStamp(fetchedAt)}</span>
      )}
    </p>
  )
}
