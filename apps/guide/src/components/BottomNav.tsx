import { Link, useLocation } from 'react-router-dom'
import { useTripPlan } from '../trip/useTripPlan'

export default function BottomNav() {
  const { pathname } = useLocation()
  const planCount = useTripPlan().plan.items.length
  const isGuide =
    pathname === '/' ||
    pathname.startsWith('/region/') ||
    pathname.startsWith('/stop/') ||
    pathname.startsWith('/essentials') ||
    pathname.startsWith('/secret-spots') ||
    pathname.startsWith('/hidden-areas')
  const isMap = pathname === '/map' || pathname.startsWith('/map/')
  const isPlan = pathname === '/programs' || pathname.startsWith('/trip')
  const isSearch = pathname === '/search'
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
      <Link
        to="/trip"
        className="bottom-nav__tab"
        aria-current={isPlan ? 'page' : undefined}
        aria-label={planCount > 0 ? `Plan, ${planCount} ${planCount === 1 ? 'item' : 'items'}` : 'Plan'}
      >
        <span className="bottom-nav__iconwrap">
          <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18M8 15h3M13 15h3" />
          </svg>
          {planCount > 0 && (
            <span className="bottom-nav__badge" aria-hidden="true">
              {planCount > 9 ? '9+' : planCount}
            </span>
          )}
        </span>
        <span>Plan</span>
      </Link>
      <Link to="/search" className="bottom-nav__tab" aria-current={isSearch ? 'page' : undefined}>
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span>Search</span>
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
