import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ESSENTIALS, ESSENTIALS_META, REGIONS, SEASONAL_EVENTS, SECRET_META, SECRET_SPOTS, getStopById, getStopsByRegion, seasonalRangeLabel, secretsLocked } from '../content'
import { todayIso } from '../utils/date'
import { useFavorites } from '../lib/favorites'
import { isPackCompleted } from '../offline/useDownloads'
import { useTripPlan } from '../trip/useTripPlan'
import GatedChrome from '../components/GatedChrome'
import RegionPickerCard from '../components/RegionPickerCard'
import SectionCard from '../components/SectionCard'
import UpdatedStamp from '../components/UpdatedStamp'
import '../styles/app.css'

// Pack ids mirrored from offline/manifest.ts: one photo pack per region plus
// the map. Used only for the status line; the manager itself lives on Account.
const PACK_IDS = [...REGIONS.map((r) => `photos-${r.id}`), 'park-map']

const BEFORE_YOU_GO_DISMISS_KEY = 'tfg.beforeYouGo.dismissed'

// One-time nudge toward the night-before downloads. Same dismissal pattern as
// InstallPrompt (tfg.install.dismissed).
function BeforeYouGoNudge() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(BEFORE_YOU_GO_DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  if (dismissed) return null
  return (
    <div className="notice-banner notice-banner--inline">
      <div className="notice-banner__body">
        Going soon? Do the <Link to="/essentials/before-you-go">night-before downloads</Link>{' '}
        while you still have wifi: the offline maps, this guide, and the current Yosemite Guide PDF.
      </div>
      <button
        type="button"
        className="btn btn--ghost btn--compact"
        onClick={() => {
          try {
            localStorage.setItem(BEFORE_YOU_GO_DISMISS_KEY, '1')
          } catch {
            /* non-fatal: nudge may reappear next launch */
          }
          setDismissed(true)
        }}
      >
        Got it
      </button>
    </div>
  )
}

// Up to three active or upcoming almanac entries, so the seasonal layer is
// discoverable from the front page. The full agenda lives on /programs.
function InSeasonStrip() {
  const today = todayIso()
  const upcoming = SEASONAL_EVENTS.filter((ev) => ev.dateEnd >= today).slice(0, 3)
  if (upcoming.length === 0) return null
  return (
    <section aria-label="In season" className="home-strip">
      <div className="eyebrow section-eyebrow">In season</div>
      <ul className="plain-list">
        {upcoming.map((ev) => (
          <li key={ev.id} className="plain-list__item">
            <span className="muted">{seasonalRangeLabel(ev)} · </span>
            {ev.title}
            {ev.confidence === 'typical' ? <span className="muted"> (typical)</span> : null}
          </li>
        ))}
      </ul>
      <Link to="/programs" className="strip-link">
        The full seasonal almanac, day by day →
      </Link>
    </section>
  )
}

export default function Home() {
  const { session } = useAuth()
  const { ids: favoriteIds } = useFavorites()
  const { plan } = useTripPlan()
  // Favorites can point at regular stops or secret spots; resolve both so a
  // saved secret spot does not silently vanish from this list.
  const savedStops = favoriteIds
    .map((id) => getStopById(id) ?? SECRET_SPOTS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
  const downloadedCount = PACK_IDS.filter((id) => isPackCompleted(id)).length

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <div className="eyebrow eyebrow--moss page__kicker">
          The Field Guide · 2026 Edition
        </div>
        <h1 className="page__title">Where in the park are you going?</h1>
        <p className="page__lede">
          Pick a region. Each one is a flat list of stops in a suggested order. Read them all or just the ones that fit your day.
        </p>

        <BeforeYouGoNudge />

        <div className="card-grid">
          {REGIONS.map((region) => (
            <RegionPickerCard
              key={region.id}
              region={region.id}
              title={region.title}
              teaser={region.teaser}
              stopCount={getStopsByRegion(region.id).length}
            />
          ))}
          <SectionCard
            to="/essentials"
            eyebrow="Know before you go"
            title={ESSENTIALS_META.title}
            teaser={ESSENTIALS_META.teaser}
            meta={`${ESSENTIALS.length} topics`}
          />
          <SectionCard
            to="/programs"
            eyebrow="What's on in the park"
            title="Programs during your trip"
            teaser="Ranger walks, Junior Ranger tables, tours, and star parties running while you're there. Syncs online, readable offline."
            meta="Day-by-day list for your dates"
          />
          <SectionCard
            to="/trip"
            eyebrow="Plan your days"
            title="Your trip plan"
            teaser="Dates, programs, and stops assembled into a day-by-day plan, then exported to your calendar. Events carry GPS coordinates and a directions link, so the calendar becomes the itinerary."
            meta={
              plan.items.length > 0
                ? `${plan.items.length} ${plan.items.length === 1 ? 'item' : 'items'} planned`
                : 'Dates → programs → stops → calendar'
            }
          />
          <SectionCard
            to="/secret-spots"
            eyebrow="Included with purchase"
            title={SECRET_META.title}
            teaser={SECRET_META.teaser}
            meta={secretsLocked() ? 'Coming soon' : `${SECRET_SPOTS.length} ${SECRET_SPOTS.length === 1 ? 'spot' : 'spots'}`}
            locked={secretsLocked()}
          />
        </div>

        <InSeasonStrip />

        <Link to="/account" className="offline-status-card">
          {downloadedCount === PACK_IDS.length ? (
            <>Downloaded for offline. The whole guide works in airplane mode. Manage →</>
          ) : (
            <>
              <strong>Offline:</strong> {downloadedCount} of {PACK_IDS.length} packs on this
              device. Download the guide and the park map before you leave wifi →
            </>
          )}
        </Link>

        {savedStops.length > 0 && (
          <section aria-label="Saved stops" className="home-section">
            <div className="eyebrow section-eyebrow">Saved stops</div>
            <ul className="plain-list">
              {savedStops.map((stop) => (
                <li key={stop.id}>
                  <Link
                    to={getStopById(stop.id) ? `/stop/${stop.id}` : '/secret-spots'}
                    className="saved-link"
                  >
                    {stop.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <UpdatedStamp />

        <p className="signin-note">
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
