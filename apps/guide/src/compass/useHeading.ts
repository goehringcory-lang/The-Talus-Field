// =============================================================================
// Device compass heading, in degrees from TRUE north. Sensors report magnetic
// north, so readings are corrected by the park's declination before anyone
// sees them; every bearing the compass page prints is true, matching the map
// and the printed topo.
//
// Platform reality this hook absorbs:
// - iOS requires DeviceOrientationEvent.requestPermission(), callable only
//   from a user gesture — which is why start() exists instead of an effect,
//   and why the page has a "start the compass" button at all.
// - iOS Safari reports `webkitCompassHeading` (magnetic, already fused);
//   Android reports it through `deviceorientationabsolute` alpha. A plain
//   `deviceorientation` alpha with absolute !== true is relative to wherever
//   the phone happened to point at page load and is useless as a compass, so
//   it is deliberately ignored rather than shown wrong.
// - Desktops fire the event once with null values or never; a reading that
//   hasn't arrived within a few seconds resolves to 'unavailable' so the page
//   can pin the rose north-up instead of waiting forever.
//
// Readings are smoothed on the unit circle (EMA over sin/cos), because a raw
// magnetometer jitters by several degrees and averaging raw angles breaks at
// the 359 -> 0 wrap.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'

// Magnetic declination at Yosemite Valley, degrees east of true north
// (WMM 2025 ~12.9 deg E, drifting under 0.1 deg/yr; the park's span moves it
// by less than the sensor's own wobble). True = magnetic + east declination.
export const PARK_DECLINATION_DEG = 12.9

// EMA weight per event: high enough to track a deliberate turn inside a
// second at typical 10-60 Hz event rates, low enough to sit still in a
// steady hand.
const SMOOTHING = 0.2

// How long after start() before silence means "this device has no compass".
const NO_READING_MS = 3000

export type HeadingStatus = 'idle' | 'requesting' | 'denied' | 'unavailable' | 'active'

export type HeadingState = {
  status: HeadingStatus
  /** Smoothed true heading, 0..360, only meaningful when status is 'active'. */
  headingDeg: number
  /** The same heading unwrapped along the shortest arc (may run past 360 or
   * below 0), so a CSS-transitioned rose never spins the 350-degree way
   * around from 359 to 1. Maintained here, in the event path, because
   * unwrapping needs the previous value and render must not touch refs. */
  continuousDeg: number
}

type OrientationEventCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function screenAngleDeg(): number {
  if (typeof screen !== 'undefined' && screen.orientation) return screen.orientation.angle
  // Deprecated fallback for older iOS.
  const legacy = (window as { orientation?: unknown }).orientation
  return typeof legacy === 'number' ? legacy : 0
}

export function useHeading(): HeadingState & { start: () => void } {
  const [state, setState] = useState<HeadingState>({
    status: 'idle',
    headingDeg: 0,
    continuousDeg: 0,
  })
  const sinRef = useRef(0)
  const cosRef = useRef(0)
  const continuousRef = useRef<number | null>(null)
  const haveReadingRef = useRef(false)
  const frameRef = useRef(0)
  const timerRef = useRef(0)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(
    () => () => {
      cleanupRef.current?.()
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(timerRef.current)
    },
    [],
  )

  const attach = useCallback(() => {
    const onEvent = (e: DeviceOrientationEvent) => {
      const webkitHeading = (e as { webkitCompassHeading?: unknown }).webkitCompassHeading
      let magneticDeg: number | null = null
      if (typeof webkitHeading === 'number' && Number.isFinite(webkitHeading) && webkitHeading >= 0) {
        magneticDeg = webkitHeading + screenAngleDeg()
      } else if (e.absolute === true && e.alpha != null) {
        magneticDeg = 360 - e.alpha + screenAngleDeg()
      }
      if (magneticDeg === null) return

      const trueDeg = magneticDeg + PARK_DECLINATION_DEG
      const rad = (trueDeg * Math.PI) / 180
      if (!haveReadingRef.current) {
        haveReadingRef.current = true
        sinRef.current = Math.sin(rad)
        cosRef.current = Math.cos(rad)
      } else {
        sinRef.current = sinRef.current * (1 - SMOOTHING) + Math.sin(rad) * SMOOTHING
        cosRef.current = cosRef.current * (1 - SMOOTHING) + Math.cos(rad) * SMOOTHING
      }
      // Commit once per frame: events can arrive at magnetometer rate, well
      // above anything worth re-rendering for.
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0
          const deg =
            ((Math.atan2(sinRef.current, cosRef.current) * 180) / Math.PI + 360) % 360
          const prev = continuousRef.current
          if (prev === null) {
            continuousRef.current = deg
          } else {
            const delta = ((((deg - prev) % 360) + 540) % 360) - 180
            continuousRef.current = prev + delta
          }
          setState({ status: 'active', headingDeg: deg, continuousDeg: continuousRef.current })
        })
      }
    }

    // Android's absolute event where it exists; the plain event covers iOS
    // (webkitCompassHeading rides on it). Listening to both is harmless: the
    // handler ignores anything that is not a real compass reading.
    window.addEventListener('deviceorientationabsolute', onEvent as EventListener)
    window.addEventListener('deviceorientation', onEvent)
    cleanupRef.current = () => {
      window.removeEventListener('deviceorientationabsolute', onEvent as EventListener)
      window.removeEventListener('deviceorientation', onEvent)
    }

    timerRef.current = window.setTimeout(() => {
      if (!haveReadingRef.current) {
        cleanupRef.current?.()
        cleanupRef.current = null
        setState({ status: 'unavailable', headingDeg: 0, continuousDeg: 0 })
      }
    }, NO_READING_MS)
  }, [])

  const start = useCallback(() => {
    if (cleanupRef.current) return
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      setState({ status: 'unavailable', headingDeg: 0, continuousDeg: 0 })
      return
    }
    const ctor = DeviceOrientationEvent as OrientationEventCtor
    if (typeof ctor.requestPermission === 'function') {
      setState({ status: 'requesting', headingDeg: 0, continuousDeg: 0 })
      ctor
        .requestPermission()
        .then((result) => {
          if (result === 'granted') attach()
          else setState({ status: 'denied', headingDeg: 0, continuousDeg: 0 })
        })
        // Safari throws if the call somehow lost its user-gesture context.
        .catch(() => setState({ status: 'denied', headingDeg: 0, continuousDeg: 0 }))
    } else {
      setState({ status: 'requesting', headingDeg: 0, continuousDeg: 0 })
      attach()
    }
  }, [attach])

  return { ...state, start }
}
