import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { fetchMe, readCachedMe, type MeT } from '../auth/me'
import { apiFetch, API_BASE } from '../lib/api'
import GatedChrome from '../components/GatedChrome'
import CalendarCard from '../components/CalendarCard'
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

// Show the renew button inside this many days of expiry. Wide on purpose:
// the T-60 email and this card should agree about when renewal season starts.
const RENEW_WINDOW_DAYS = 60

// Reads ?renew=success|cancel left behind by the renewal Stripe redirect.
function readRenewOutcome(): 'success' | 'cancel' | null {
  try {
    const value = new URLSearchParams(window.location.search).get('renew')
    return value === 'success' || value === 'cancel' ? value : null
  } catch {
    return null
  }
}

// "Access ends {date}" card. Starts from the cached copy so it renders
// offline, then refreshes from /api/auth/me when the network allows. If
// neither source is available (first visit, offline, old worker) the card is
// omitted rather than shown empty. Inside the renewal window it grows a
// renew button (JWT-gated POST /api/checkout/renew -> Stripe); the price
// comes live from /api/inventory so it stays edited in one place.
function AccessStatusCard() {
  const [me, setMe] = useState<MeT | null>(() => readCachedMe())
  // Skeleton only for the first online visit (no cache, fetch in flight);
  // offline with no cache keeps the card omitted instead of loading forever.
  const [checking, setChecking] = useState(() => readCachedMe() === null && navigator.onLine)
  const [renewOutcome] = useState(readRenewOutcome)
  const [renewBusy, setRenewBusy] = useState(false)
  const [renewError, setRenewError] = useState<string | null>(null)
  const [renewalPriceCents, setRenewalPriceCents] = useState<number | null>(null)

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

  // Mount-time clock: day-level precision, so a stale render is harmless,
  // and the react-hooks/purity rule bars Date.now() in render proper.
  const [nowMs] = useState(() => Date.now())
  const daysLeft =
    me && me.kind === 'buyer' && !me.expired
      ? (me.expiresAt * 1000 - nowMs) / 86_400_000
      : null
  const inRenewWindow = daysLeft !== null && daysLeft <= RENEW_WINDOW_DAYS

  useEffect(() => {
    if (!inRenewWindow || !navigator.onLine) return
    let cancelled = false
    fetch(`${API_BASE}/api/inventory`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { renewalPriceCents?: unknown } | null) => {
        if (!cancelled && body && typeof body.renewalPriceCents === 'number') {
          setRenewalPriceCents(body.renewalPriceCents)
        }
      })
      .catch(() => {
        /* price is garnish; the button works without it */
      })
    return () => {
      cancelled = true
    }
  }, [inRenewWindow])

  async function startRenewal() {
    setRenewBusy(true)
    setRenewError(null)
    try {
      const res = await apiFetch<{ url?: string }>('/api/checkout/renew', { method: 'POST' })
      if (!res.url) throw new Error('no checkout url')
      window.location.href = res.url
    } catch {
      setRenewError('Checkout didn’t start. Try again in a minute, or use the link in your renewal email.')
      setRenewBusy(false)
    }
  }

  const priceLabel =
    renewalPriceCents !== null ? ` · $${(renewalPriceCents / 100).toFixed(renewalPriceCents % 100 === 0 ? 0 : 2)}` : ''

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
            Your access has ended. The renewal link is in the reminder emails we sent
            you. Can't find them? Email{' '}
            <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{' '}
            and a fresh link comes back.
          </p>
        </>
      ) : (
        <>
          <div className="card__value">Good through {formatAccessDate(me.expiresAt)}</div>
          {renewOutcome === 'success' ? (
            <p className="card__note">
              Renewed. Your new end date is settling in; if it hasn't updated yet,
              check back in a minute.
            </p>
          ) : (
            <p className="card__note">
              Everything you download keeps working offline until this date.
            </p>
          )}
          {renewOutcome === 'cancel' && (
            <p className="card__note">Checkout was cancelled. Nothing was charged.</p>
          )}
          {inRenewWindow && renewOutcome !== 'success' && (
            <>
              <div style={{ marginTop: 10 }}>
                <Button onClick={startRenewal} disabled={renewBusy}>
                  {renewBusy ? 'Opening checkout…' : `Renew for 18 more months${priceLabel}`}
                </Button>
              </div>
              <p className="card__note" style={{ marginTop: 8 }}>
                Renewing early adds time on top of what you have. You keep your trips,
                saved stops, and downloads.
              </p>
              {renewError && <p className="card__note">{renewError}</p>}
            </>
          )}
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
        The photographs credited below are public domain and Creative Commons works. The rest
        of the guide's photography comes from The Talus Field's editorial archive.
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
            <CalendarCard />
          </div>

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
