import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// SPA navigations don't scroll to a #fragment on their own, and CSS :target
// never updates on a pushState, so a search hit that links /wildlife#coyote
// used to land at the top of a long page. This scrolls the entry into view,
// opens it when it is a <details>, and marks it `data-landed` for a moment
// so the eye finds it (the style is `[data-landed]` in components.css).
export function useLandOnHash(): void {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    let id: string
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    if (el instanceof HTMLDetailsElement) el.open = true
    el.scrollIntoView({ block: 'start' })
    el.setAttribute('data-landed', '')
    const t = window.setTimeout(() => el.removeAttribute('data-landed'), 2400)
    return () => {
      window.clearTimeout(t)
      el.removeAttribute('data-landed')
    }
  }, [hash])
}
