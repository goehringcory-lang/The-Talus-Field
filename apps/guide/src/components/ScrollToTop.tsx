import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// BrowserRouter keeps the window scroll position across navigations, so a
// tap deep in a region list opens the next page mid-scroll. Reset to top on
// forward navigations only: POP (back/forward) keeps the browser's native
// restoration, and a hash is left for the anchor (/secret-guide#<id>).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  // Query-param-only navigations (filter chips via setSearchParams) must not
  // scroll. pathname is deliberately the only location dep, but the effect
  // also re-runs when navigationType flips (POP → PUSH after a Back), so gate
  // on the pathname actually having changed.
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const pathChanged = prevPathname.current !== pathname
    prevPathname.current = pathname
    if (pathChanged && navigationType !== 'POP' && !hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navigationType])

  return null
}
