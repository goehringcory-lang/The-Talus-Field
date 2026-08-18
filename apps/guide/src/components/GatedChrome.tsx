import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PACK_IDS } from '../offline/manifest'
import { isPackCompleted } from '../offline/useDownloads'
import BottomNav from './BottomNav'
import TripAddNotice from './TripAddNotice'

type Props = {
  children: ReactNode
}

// Offline status as a masthead reading: pack count while downloads are
// incomplete, "Offline ready" once the device holds everything. Read at
// render like the Home offline card; the chip is a status, not a live wire.
function OfflineChip() {
  const done = PACK_IDS.filter((id) => isPackCompleted(id)).length
  return (
    <span className="masthead-offline" aria-label={`Offline packs: ${done} of ${PACK_IDS.length}`}>
      <span className="masthead-offline__dot" aria-hidden="true" />
      {done === PACK_IDS.length ? 'Offline ready' : `Offline ${done}/${PACK_IDS.length}`}
    </span>
  )
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
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          // Keep the href for assistive tech, but move focus by hand: letting
          // the anchor navigate writes "#main" into the SPA's URL, where it
          // lands in history and rides along in anything the reader shares.
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
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
          </span>
        </Link>
        <div className="gated-chrome__right">
          <OfflineChip />
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
        </div>
      </header>
      {/* The skip-link and route-change focus target. Every gated route
          renders its own <main> inside here, so this wrapper is the one
          content container they all share. */}
      <div className="bottom-nav-offset" id="main" tabIndex={-1}>
        {children}
      </div>
      <TripAddNotice />
      <BottomNav />
    </div>
  )
}
