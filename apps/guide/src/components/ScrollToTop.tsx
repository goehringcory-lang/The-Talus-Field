import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// BrowserRouter keeps the window scroll position across navigations, so a
// tap deep in a region list opens the next page mid-scroll. Reset to top on
// forward navigations only: POP (back/forward) keeps the browser's native
// restoration, and a hash is left for the anchor (/secret-guide#<id>).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP' && !hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navigationType])

  return null
}
