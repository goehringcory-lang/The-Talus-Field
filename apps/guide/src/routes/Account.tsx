import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { fetchMe, readCachedMe, type MeT } from '../auth/me'
import { apiFetch } from '../lib/api'
import GatedChrome from '../components/GatedChrome'
import DownloadManager from '../components/DownloadManager'
import InstallSheet from '../components/InstallSheet'
import NotificationsCard from '../components/NotificationsCard'
import SyncCard from '../components/SyncCard'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'
import { PHOTO_CREDITS } from '../content/photoCredits'
import { MAP_ATTRIBUTION } from '../map/style'
import { BUILD_DATE } from '../lib/buildInfo'
import { resetInstallDismissal } from '../lib/install'
import { isStandalonePWA } from '../utils/platform'

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

// Reads ?renew=success|cancel left behind by the renewal Stripe redirect,
// then strips it from the URL: a bookmarked or reloaded ?renew=success used
// to re-show the confirmation forever and hide the renew button behind it.
function readRenewOutcome(): 'success' | 'cancel' | null {
  try {
    const url = new URL(window.location.href)
    const value = url.searchParams.get('renew')
    if (value !== null) {
      url.searchParams.delete('renew')
      window.history.replaceState(window.history.state, '', url)
    }
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
    // apiFetch, not bare fetch: it carries the 15-second timeout that exists
    // for captive-portal wifi, which would otherwise hang this request.
    apiFetch<{ renewalPriceCents?: unknown }>('/api/inventory')
      .then((body) => {
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
            Your 18-month access period has ended. The one-click renewal link is in
            the reminder emails we sent as the date approached; if you can't find
            them, email{' '}
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
              Everything you download keeps working offline for the full window.
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
                Renewing early stacks on your current time. Trips, favorites,
                downloads, and sign-in all carry over.
              </p>
              {renewError && (
                <p className="card__note" style={{ color: 'var(--danger)' }} role="alert">
                  {renewError}
                </p>
              )}
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

// The way back to the install instructions after "Not now". Without it the
// banner's dismissal is permanent and undoable only by clearing site data,
// which is a poor trade for a buyer who changed their mind at the trailhead.
// Hidden once the app is running from the home screen, where it is moot.
function InstallCard() {
  const [sheet, setSheet] = useState(false)
  if (isStandalonePWA()) {
    return (
      <div className="card">
        <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          Home screen
        </span>
        <p>Installed on this device. This is the home-screen copy.</p>
      </div>
    )
  }
  return (
    <div className="card">
      <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
        Home screen
      </span>
      <p>
        Not installed on this device. Adding the guide to your home screen gives it its
        own icon, a full-screen window, and more durable offline storage.
      </p>
      <div className="action-row" style={{ marginTop: 12 }}>
        <Button
          size="sm"
          onClick={() => {
            // Undo any earlier "not now" so the banner is available again if
            // they close the sheet without finishing.
            resetInstallDismissal()
            setSheet(true)
          }}
        >
          Show me how
        </Button>
      </div>
      {sheet && <InstallSheet onClose={() => setSheet(false)} />}
    </div>
  )
}

// Sign out arms before it fires, the same shape as the trip board's clear
// button. Signing out drops the JWT, and getting back in needs a connection
// and the access code: in the park a mis-tap costs the buyer the paid content
// on the device they are standing on.
const ARM_GUARD_MS = 400
const DISARM_AFTER_MS = 6000

function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  const [armed, setArmed] = useState(false)
  const armedAt = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!armed) return
    const timer = window.setTimeout(() => setArmed(false), DISARM_AFTER_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArmed(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setArmed(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [armed])

  return (
    <div
      ref={rootRef}
      style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}
    >
      <div className="action-row">
        <Button
          variant={armed ? 'danger' : 'ghost'}
          className={armed ? 'is-armed' : undefined}
          onClick={() => {
            if (!armed) {
              armedAt.current = Date.now()
              setArmed(true)
              return
            }
            // Guards the double-tap that would arm and fire in one gesture.
            if (Date.now() - armedAt.current < ARM_GUARD_MS) return
            setArmed(false)
            onSignOut()
          }}
        >
          {armed ? 'Tap again to sign out' : 'Sign out'}
        </Button>
        {armed && (
          <Button variant="quiet" size="sm" onClick={() => setArmed(false)}>
            Stay signed in
          </Button>
        )}
      </div>
      {armed && (
        <p className="card__note" role="status">
          Signing back in needs a connection and your access code. Downloads stay on this
          device.
        </p>
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

          <InstallCard />

          <div className="card">
            <SyncCard />
          </div>

          <div className="card">
            <NotificationsCard />
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
        </div>

        <SignOutButton onSignOut={signOut} />

        <p className="page-footnote">
          2026 Edition · Build {BUILD_DATE}
          <br />
          Map tiles: {MAP_ATTRIBUTION}
        </p>
      </main>
    </GatedChrome>
  )
}
