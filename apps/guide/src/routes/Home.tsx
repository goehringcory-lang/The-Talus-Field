import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ESSENTIALS, ESSENTIALS_META, HIDDEN_META, REGIONS, SEASONAL_EVENTS, SECRET_META, SECRET_SPOTS, getHiddenStops, getStopById, getStopsByRegion, seasonalRangeLabel } from '../content'
import { todayIso } from '../utils/date'
import { useFavorites } from '../lib/favorites'
import { isPackCompleted } from '../offline/useDownloads'
import { useTripPlan } from '../trip/useTripPlan'
import GatedChrome from '../components/GatedChrome'
import RegionPickerCard from '../components/RegionPickerCard'
import SectionCard from '../components/SectionCard'
import UpdatedStamp from '../components/UpdatedStamp'

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
    <div
      style={{
        border: '1px solid var(--rule)',
        borderLeft: '3px solid var(--moss)',
        background: 'var(--paper-2)',
        padding: '14px 16px',
        marginBottom: 24,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.5 }}>
        Going soon? Do the <Link to="/essentials/before-you-go">night-before downloads</Link>{' '}
        while you still have wifi: the offline maps, this guide, and the current Yosemite Guide PDF.
      </div>
      <button
        type="button"
        className="btn btn--ghost"
        style={{ padding: '6px 10px', fontSize: 13, minHeight: 44, flexShrink: 0 }}
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
    <section aria-label="In season" style={{ marginTop: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>In season</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {upcoming.map((ev) => (
          <li key={ev.id} style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ color: 'var(--ink-3)' }}>{seasonalRangeLabel(ev)} · </span>
            {ev.title}
            {ev.confidence === 'typical' ? <span style={{ color: 'var(--ink-3)' }}> (typical)</span> : null}
          </li>
        ))}
      </ul>
      <Link to="/programs" style={{ fontFamily: 'var(--sans)', fontSize: 13, display: 'inline-block', marginTop: 8 }}>
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
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>Where in the park are you going?</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Pick a region. Each one is a flat list of stops in a suggested order — read them all or just the ones that fit your day.
        </p>

        <BeforeYouGoNudge />

        <div style={{ display: 'grid', gap: 18 }}>
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
            meta={`${SECRET_SPOTS.length} ${SECRET_SPOTS.length === 1 ? 'spot' : 'spots'}`}
          />
          <SectionCard
            to="/hidden-areas"
            eyebrow="Included with purchase"
            title={HIDDEN_META.title}
            teaser={HIDDEN_META.teaser}
            meta={`${getHiddenStops().length} areas`}
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
          <section aria-label="Saved stops" style={{ marginTop: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Saved stops</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {savedStops.map((stop) => (
                <li key={stop.id}>
                  <Link
                    to={getStopById(stop.id) ? `/stop/${stop.id}` : '/secret-spots'}
                    style={{ fontFamily: 'var(--display)', fontSize: 18 }}
                  >
                    {stop.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <UpdatedStamp />

        <p style={{ marginTop: 32, color: 'var(--ink-3)', fontSize: 13 }}>
          Signed in as <strong>{session?.username}</strong>. <Link to="/account">Account →</Link>
        </p>
      </main>
    </GatedChrome>
  )
}
