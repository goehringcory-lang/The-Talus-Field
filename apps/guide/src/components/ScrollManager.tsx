import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Scroll + focus management for route changes. PUSH/REPLACE start at the
// top; POP (back/forward, reload) restores the saved offset once the lazy
// route's layout has settled. /map is exempt: it is a full-viewport stage
// with its own URL state and never scrolls the window.
const STORAGE_KEY = 'tfg.scroll'
const MAX_FRAMES = 20

const positions = new Map<string, number>(loadPositions())

function loadPositions(): [string, number][] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as [string, number][]) : []
  } catch {
    return []
  }
}

function persistPositions() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...positions]))
  } catch {
    // Storage unavailable; the in-memory map still covers this session.
  }
}

export default function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const onMap = location.pathname === '/map'

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Record this location's offset as the reader scrolls.
  useEffect(() => {
    if (onMap) return
    const key = location.key
    const onScroll = () => positions.set(key, window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', persistPositions)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', persistPositions)
      persistPositions()
    }
  }, [location.key, onMap])

  useEffect(() => {
    if (onMap) return

    if (navigationType === 'POP') {
      const target = positions.get(location.key) ?? 0
      let frames = 0
      let raf = requestAnimationFrame(function attempt() {
        const reachable =
          document.body.scrollHeight - window.innerHeight >= target
        if (reachable || frames >= MAX_FRAMES) {
          window.scrollTo(0, target)
          return
        }
        frames += 1
        raf = requestAnimationFrame(attempt)
      })
      return () => cancelAnimationFrame(raf)
    }

    window.scrollTo(0, 0)

    if (navigationType === 'PUSH') {
      // Focus the page container so screen readers announce the change.
      // Retry over a few frames: lazy chunks mount #main asynchronously.
      let frames = 0
      let raf = 0
      const tryFocus = () => {
        const main = document.getElementById('main')
        if (main) {
          main.focus({ preventScroll: true })
        } else if (frames < MAX_FRAMES) {
          frames += 1
          raf = requestAnimationFrame(tryFocus)
        }
      }
      tryFocus()
      return () => cancelAnimationFrame(raf)
    }
  }, [location.key, navigationType, onMap])

  return null
}
