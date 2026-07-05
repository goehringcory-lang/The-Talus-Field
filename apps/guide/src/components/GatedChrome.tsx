import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import TripAddNotice from './TripAddNotice'

type Props = {
  children: ReactNode
}

// App shell for every gated route: a one-line masthead up top (brand lockup
// always visible; quick links fold into the bottom nav below 640px), the
// bottom tab bar, and the shared add-to-trip notice.
export default function GatedChrome({ children }: Props) {
  const { pathname } = useLocation()
  const mapActive = pathname === '/map' || pathname.startsWith('/map/')
  const searchActive = pathname === '/search'
  const accountActive = pathname === '/account'
  return (
    <div className="app-shell">
      <header className="gated-chrome">
        <Link to="/" className="masthead-brand" aria-label="The Field Guide, home">
          <img
            className="masthead-brand__mark"
            src="/brand/mark-96.png"
            srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
            alt=""
            width="61"
            height="48"
          />
          <span className="masthead-brand__text">
            <span className="masthead-brand__title">The Talus Field</span>
            <span className="masthead-brand__sub">Field Guide · 2026 Edition</span>
          </span>
        </Link>
        <nav className="gated-chrome__links" aria-label="Quick links">
          <Link
            to="/map"
            className="gated-chrome__link"
            aria-current={mapActive ? 'page' : undefined}
          >
            Map →
          </Link>
          <Link
            to="/search"
            className="gated-chrome__link"
            aria-current={searchActive ? 'page' : undefined}
          >
            Search →
          </Link>
          <Link
            to="/account"
            className="gated-chrome__link"
            aria-current={accountActive ? 'page' : undefined}
          >
            Account →
          </Link>
        </nav>
      </header>
      <div className="bottom-nav-offset">
        {children}
      </div>
      <TripAddNotice />
      <BottomNav />
    </div>
  )
}
