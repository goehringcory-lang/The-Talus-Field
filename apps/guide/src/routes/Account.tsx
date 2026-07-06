import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { fetchMe, readCachedMe, type MeT } from '../auth/me'
import GatedChrome from '../components/GatedChrome'
import DownloadManager from '../components/DownloadManager'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'
import { PHOTO_CREDITS } from '../content/photoCredits'
import { MAP_ATTRIBUTION } from '../map/style'

function formatAccessDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// "Access ends {date}" card. Starts from the cached copy so it renders
// offline, then refreshes from /api/auth/me when the network allows. If
// neither source is available (first visit, offline, old worker) the card is
// omitted rather than shown empty.
function AccessStatusCard() {
  const [me, setMe] = useState<MeT | null>(() => readCachedMe())
  // Skeleton only for the first online visit (no cache, fetch in flight);
  // offline with no cache keeps the card omitted instead of loading forever.
  const [checking, setChecking] = useState(() => readCachedMe() === null && navigator.onLine)

  useEffect(() => {
    let cancelled = false
    fetchMe()
      .then((fresh) => {
        if (!cancelled) setMe(fresh)
      })
      .catch(() => {
        /* offline or old worker: the cached copy (or nothing) stands */
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!me && checking) {
    return (
      <div className="card" aria-hidden="true">
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Access</span>
        <div style={{ display: 'grid', gap: 8, maxWidth: 280 }}>
          <Skeleton height={18} width="60%" />
          <Skeleton height={13} width="90%" />
        </div>
      </div>
    )
  }
  if (!me) return null
  return (
    <div className="card">
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Access</span>
      {me.kind === 'operator' ? (
        <div className="card__value">Operator access</div>
      ) : me.expired ? (
        <>
          <div className="card__value">Ended {formatAccessDate(me.expiresAt)}</div>
          <p className="card__note">
            Your 18-month access period has ended. Email{' '}
            <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{' '}
            about renewing.
          </p>
        </>
      ) : (
        <>
          <div className="card__value">Good through {formatAccessDate(me.expiresAt)}</div>
          <p className="card__note">
            Everything you download keeps working offline for the full window.
          </p>
        </>
      )}
    </div>
  )
}

// Full attribution for the guide's photography: author, license, and source
// link per file. This is the Creative Commons compliance surface (the plate
// captions carry only a courtesy line); it renders offline once cached.
// Hidden until the credits manifest ships entries.
function PhotoCreditsSection() {
  const entries = Object.entries(PHOTO_CREDITS)
  if (entries.length === 0) return null
  return (
    <section id="photo-credits" aria-label="Photo credits" style={{ marginTop: 28 }}>
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Photography</span>
      <p className="card__note" style={{ marginTop: 0 }}>
        The photographs in this guide are public domain and Creative Commons works, credited
        below, alongside our own field photography.
      </p>
      <ul className="link-list" style={{ fontSize: 13 }}>
        {entries.map(([src, credit]) => {
          const basename = src.split('/').pop() ?? src
          return (
            <li key={src}>
              {basename}: {credit.author}, {credit.license}
              {credit.source && (
                <>
                  {' · '}
                  <a href={credit.source} target="_blank" rel="noopener noreferrer">
                    source
                  </a>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Account() {
  const { session, signOut } = useAuth()
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader eyebrow="Your copy of the guide" title="Account" />

        <div className="card-stack card-stack--boxed">
          <div className="card">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Signed in as</span>
            <div className="card__value">{session?.username}</div>
          </div>

          <AccessStatusCard />

          <div className="card">
            <DownloadManager />
          </div>
        </div>

        <PhotoCreditsSection />

        <p style={{ marginTop: 28 }}>
          Questions? Email{' '}
          <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
        </p>

        <div className="action-row" style={{ marginTop: 36 }}>
          <Button variant="ghost" to="/">← Back to guide</Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </div>

        <p className="page-footnote">
          2026 Edition · Build {import.meta.env.VITE_BUILD_DATE}
          <br />
          Map tiles: {MAP_ATTRIBUTION}
        </p>
      </main>
    </GatedChrome>
  )
}
