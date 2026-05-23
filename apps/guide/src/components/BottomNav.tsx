import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const { pathname } = useLocation()
  const isGuide =
    pathname === '/' || pathname.startsWith('/region/') || pathname.startsWith('/stop/')
  const isMap = pathname === '/map' || pathname.startsWith('/map/')
  const isAccount = pathname === '/account'

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link to="/" className="bottom-nav__tab" aria-current={isGuide ? 'page' : undefined}>
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20h20M6 20V10l6-7 6 7v10M10 20v-6h4v6" />
        </svg>
        <span>Guide</span>
      </Link>
      <Link to="/map" className="bottom-nav__tab" aria-current={isMap ? 'page' : undefined}>
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
        <span>Map</span>
      </Link>
      <Link to="/account" className="bottom-nav__tab" aria-current={isAccount ? 'page' : undefined}>
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span>Account</span>
      </Link>
    </nav>
  )
}
