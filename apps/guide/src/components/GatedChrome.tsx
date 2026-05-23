import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

type Props = {
  children: ReactNode
}

export default function GatedChrome({ children }: Props) {
  const { pathname } = useLocation()
  const mapActive = pathname === '/map' || pathname.startsWith('/map/')
  const accountActive = pathname === '/account'
  return (
    <div className="app-shell">
      <header className="gated-chrome">
        <Link
          to="/map"
          className="gated-chrome__link"
          aria-current={mapActive ? 'page' : undefined}
        >
          Map →
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
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
