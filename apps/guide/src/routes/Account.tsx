import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { fetchMe, readCachedMe, type MeT } from '../auth/me'
import GatedChrome from '../components/GatedChrome'
import DownloadManager from '../components/DownloadManager'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
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

  useEffect(() => {
    let cancelled = false
    fetchMe()
      .then((fresh) => {
        if (!cancelled) setMe(fresh)
      })
      .catch(() => {
        /* offline or old worker: the cached copy (or nothing) stands */
      })
    return () => {
      cancelled = true
    }
  }, [])

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
