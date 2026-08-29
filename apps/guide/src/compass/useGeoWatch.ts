// =============================================================================
// A live GPS fix for the compass page. watchPosition, not one-shot: the whole
// point of a bearing instrument is that the numbers walk with you. GPS needs
// no data connection, which is why the compass works in airplane mode; the
// copy on the page says so because almost nobody knows it.
//
// start() is explicit (a user gesture) rather than an effect, so opening the
// page never throws a permission prompt at someone who only came to look.
// A fix, once held, is never discarded for a later transient error: a canyon
// wall dropping the signal should read as "last fix, aging", not as the
// instrument breaking.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'

export type GeoStatus = 'idle' | 'requesting' | 'denied' | 'unavailable' | 'active'

export type GeoFix = {
  coord: [number, number] // [lng, lat], the content model's order
  accuracyM: number
  altitudeM: number | null
  atMs: number
}

export type GeoState = {
  status: GeoStatus
  fix: GeoFix | null
  /** The session's first fix, then never replaced: stable derivations (the
   * compass page's default target) key off this instead of chasing every
   * update. */
  firstFix: GeoFix | null
}

export function useGeoWatch(): GeoState & { start: () => void } {
  const [state, setState] = useState<GeoState>({ status: 'idle', fix: null, firstFix: null })
  const watchRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (watchRef.current !== null) navigator.geolocation?.clearWatch(watchRef.current)
    },
    [],
  )

  const start = useCallback(() => {
    if (watchRef.current !== null) return
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((s) => ({ ...s, status: 'unavailable' }))
      return
    }
    setState((s) => ({ ...s, status: 'requesting' }))
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const fix: GeoFix = {
          coord: [pos.coords.longitude, pos.coords.latitude],
          accuracyM: pos.coords.accuracy,
          altitudeM: pos.coords.altitude,
          atMs: pos.timestamp,
        }
        setState((s) => ({ status: 'active', fix, firstFix: s.firstFix ?? fix }))
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState((s) => ({ status: 'denied', fix: null, firstFix: s.firstFix }))
          if (watchRef.current !== null) {
            navigator.geolocation.clearWatch(watchRef.current)
            watchRef.current = null
          }
          return
        }
        // Timeout / position-unavailable: keep any fix already held.
        setState((s) => (s.fix ? s : { ...s, status: 'unavailable' }))
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 },
    )
  }, [])

  return { ...state, start }
}
