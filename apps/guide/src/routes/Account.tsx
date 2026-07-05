import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { fetchMe, readCachedMe, type MeT } from '../auth/me'
import GatedChrome from '../components/GatedChrome'
import DownloadManager from '../components/DownloadManager'
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
    <div className="card" style={{ marginBottom: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Access</div>
      {me.kind === 'operator' ? (
        <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>Operator access</div>
      ) : me.expired ? (
        <>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>
            Ended {formatAccessDate(me.expiresAt)}
          </div>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
            Your 18-month access period has ended. Email{' '}
            <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{' '}
            about renewing.
          </p>
        </>
      ) : (
        <>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>
            Good through {formatAccessDate(me.expiresAt)}
          </div>
          <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 8, marginBottom: 0 }}>
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
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 24 }}>Account</h1>

        <div className="card" style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Signed in as</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{session?.username}</div>
        </div>

        <AccessStatusCard />

        <div className="card" style={{ marginBottom: 28 }}>
          <DownloadManager />
        </div>

        <p>
          Questions? Email{' '}
          <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
        </p>

        <div style={{ marginTop: 36, display: 'flex', gap: 12 }}>
          <Link to="/" className="btn btn--ghost">← Back to guide</Link>
          <button className="btn btn--ghost" onClick={signOut} type="button">
            Sign out
          </button>
        </div>

        <p style={{ marginTop: 40, color: 'var(--ink-3)', fontSize: 12, fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
          2026 Edition · Build {import.meta.env.VITE_BUILD_DATE}
          <br />
          Map tiles: {MAP_ATTRIBUTION}
        </p>
      </main>
    </GatedChrome>
  )
}
