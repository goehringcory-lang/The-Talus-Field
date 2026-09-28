import { useEffect, useRef, useState } from 'react'

// Throwing away a hand-arranged plan is the one destructive tap in the planner,
// and every button that can do it (clearing the board, and replacing the plan
// with a preset, from the board or from the map's Itineraries pane) arms
// before it fires: the first tap turns the button into an explicit question,
// the second answers it. The same element carries both states, so a keyboard
// user keeps focus through the change; a short guard after arming swallows the
// second half of a double-tap, which is the accident this is here to prevent.
// It disarms on Escape, on a tap outside `scope`, and on its own after a few
// seconds of nothing. Deliberately not window.confirm: in-app browsers
// (Instagram, Facebook) suppress it, and a suppressed confirm reads as true.
const ARM_GUARD_MS = 400
const DISARM_AFTER_MS = 6000

export function useArmToConfirm<T>(scope: string) {
  const [armed, setArmed] = useState<T | null>(null)
  const armedAt = useRef(0)

  useEffect(() => {
    if (armed === null) return
    const timer = window.setTimeout(() => setArmed(null), DISARM_AFTER_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArmed(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target?.closest(scope)) setArmed(null)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [armed, scope])

  /** True when this press is the confirming one; arming otherwise. */
  function press(key: T): boolean {
    if (armed !== key) {
      armedAt.current = Date.now()
      setArmed(key)
      return false
    }
    if (Date.now() - armedAt.current < ARM_GUARD_MS) return false
    setArmed(null)
    return true
  }

  return { armed, press, disarm: () => setArmed(null) }
}
