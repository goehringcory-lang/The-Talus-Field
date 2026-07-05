import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import TripAddNotice from './TripAddNotice'
import '../styles/shell.css'

type Props = {
  children: ReactNode
}

export default function GatedChrome({ children }: Props) {
  const { pathname } = useLocation()
  const mapActive = pathname === '/map' || pathname.startsWith('/map/')
  const searchActive = pathname === '/search'
  const accountActive = pathname === '/account'
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="gated-chrome">
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
      </header>
      <div className="bottom-nav-offset">
        <div key={pathname} id="main" tabIndex={-1} className="page-enter">
          {children}
        </div>
      </div>
      <TripAddNotice />
      <BottomNav />
    </div>
  )
}
