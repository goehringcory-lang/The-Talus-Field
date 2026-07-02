import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ESSENTIALS, ESSENTIALS_META, REGIONS, SECRET_META, SECRET_SPOTS, getStopById, getStopsByRegion, secretsLocked } from '../content'
import { useFavorites } from '../lib/favorites'
import { isPackCompleted } from '../offline/useDownloads'
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
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(BEFORE_YOU_GO_DISMISS_KEY) === '1',
  )
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
          localStorage.setItem(BEFORE_YOU_GO_DISMISS_KEY, '1')
          setDismissed(true)
        }}
      >
        Got it
      </button>
    </div>
  )
}

export default function Home() {
  const { session } = useAuth()
  const { ids: favoriteIds } = useFavorites()
  const savedStops = favoriteIds
    .map((id) => getStopById(id))
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
            eyebrow="Plan your days"
            title="Programs during your trip"
            teaser="Pick your dates and see the ranger walks, Junior Ranger tables, tours, and star parties running while you're there. Syncs online, readable offline."
            meta="Trip dates → day-by-day list"
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
                  <Link to={`/stop/${stop.id}`} style={{ fontFamily: 'var(--display)', fontSize: 18 }}>
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
