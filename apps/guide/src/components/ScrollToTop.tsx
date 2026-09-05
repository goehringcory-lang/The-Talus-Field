import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { BASE_TITLE } from '../lib/documentTitle'

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

  // Reset the tab title before the new page's own effect names it, so a page
  // without a PageHeader does not inherit the previous page's title.
  useLayoutEffect(() => {
    document.title = BASE_TITLE
  }, [pathname])

  useEffect(() => {
    const pathChanged = prevPathname.current !== pathname
    prevPathname.current = pathname
    if (pathChanged && navigationType !== 'POP' && !hash) {
      window.scrollTo(0, 0)
      // Screen reader and keyboard focus stays on the link that was tapped,
      // which is now gone: move it to the new page's content container. Skip
      // when the new route has already claimed focus (Search autofocuses its
      // input, and that happens during commit, before this effect).
      const main = document.getElementById('main')
      if (main && !main.contains(document.activeElement)) {
        main.focus({ preventScroll: true })
      }
    }
  }, [pathname, hash, navigationType])

  return null
}
