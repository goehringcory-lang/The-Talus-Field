// =============================================================================
// The companion's choice, live. Takes the raw fix from useGeoWatch and returns
// the entry to show plus the ranking under it, with two dampers between the
// GPS and the screen:
//
//   throttle    a fix is applied at most once per APPLY_MS; the latest one
//               wins when the timer fires. A trailing debounce would be wrong
//               here, because a moving car delivers a fix every second and
//               the screen would never settle. The first fix applies at once,
//               the useGeoWatch first-fix rule carried through.
//   hysteresis  pickNearest (nearest.ts) keeps the current entry until a
//               rival is nearer by a real margin.
//
// The choice lives in state, updated only from the timer callback, so render
// touches no ref and the react-hooks compiler rules hold.
// =============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import type { GeoFix } from '../compass/useGeoWatch'
import { NEAR_ENTRIES } from './entries'
import { pickNearest, rankEntries, type RankedEntry } from './nearest'

export const APPLY_MS = 2_000
export const NEXT_COUNT = 3

type Held = { fix: GeoFix | null; key: string | null }

export type Nearest = {
  /** The fix the ranking was computed from (throttled, so it can trail). */
  fix: GeoFix | null
  ranked: RankedEntry[]
  current: RankedEntry | null
  /** The next few after the current one, nearest first. */
  next: RankedEntry[]
}

export function useNearest(fix: GeoFix | null): Nearest {
  const [held, setHeld] = useState<Held>({ fix: null, key: null })
  const latestRef = useRef<GeoFix | null>(null)
  const timerRef = useRef<number | null>(null)
  const appliedOnceRef = useRef(false)

  useEffect(() => {
    if (!fix) return
    latestRef.current = fix
    if (timerRef.current !== null) return
    const delay = appliedOnceRef.current ? APPLY_MS : 0
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      const next = latestRef.current
      if (!next) return
      appliedOnceRef.current = true
      setHeld((prev) => {
        const ranked = rankEntries(next.coord, NEAR_ENTRIES)
        return { fix: next, key: pickNearest(prev.key, ranked) }
      })
    }, delay)
    // Deliberately not cleared per fix: clearing here would reset the timer on
    // every arrival and turn the throttle into a debounce that never fires.
  }, [fix])

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  const ranked = useMemo(
    () => (held.fix ? rankEntries(held.fix.coord, NEAR_ENTRIES) : []),
    [held.fix],
  )
  const current = ranked.find((r) => r.entry.key === held.key) ?? null
  const next = ranked.filter((r) => r.entry.key !== held.key).slice(0, NEXT_COUNT)

  return { fix: held.fix, ranked, current, next }
}
