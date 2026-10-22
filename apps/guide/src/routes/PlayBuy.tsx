import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EDITION_LABEL } from '../lib/buildInfo'
import { ApiError } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import { SUPPORT_EMAIL } from '../lib/corrections'
import Button from '../components/ui/Button'
import { GUIDE_CHECKOUT_URL } from '../lib/storefront'
import {
  PLAY_PRODUCTS,
  PlayCancelled,
  buyOnPlay,
  isAndroidApp,
  playBillingAvailable,
  playPrice,
} from '../lib/playBilling'

// /buy: the Android app's checkout (lib/playBilling.ts). Every buy and renew
// action in the Play Store build lands here instead of the editorial /guide
// page, because an app Play distributes sells through Play. The reader names
// the account's email first (Play does not share the payer's address, and
// the email is how the guide reaches a second device), then Play's own
// payment sheet takes over. ?renew=1 sells the renewal product to a buyer
// whose access is ending or has ended.
//
// Opened in an ordinary browser, the page has nothing to sell and points at
// the web checkout instead.
export default function PlayBuy() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { session, signIn } = useAuth()
  const renew = params.get('renew') === '1'
  const productId = renew ? PLAY_PRODUCTS.renewal : PLAY_PRODUCTS.guide
  const inApp = isAndroidApp()

  // null while asking Play; false when Play Billing cannot be reached.
  const [available, setAvailable] = useState<boolean | null>(inApp ? null : false)
  const [price, setPrice] = useState<string | null>(null)
  // A signed-in buyer renews their own account; the server reads it off the
  // session, so the field only pre-fills and is not editable.
  const signedInEmail = session && session.username.includes('@') ? session.username : null
  const [email, setEmail] = useState(signedInEmail ?? '')
  const [confirm, setConfirm] = useState(signedInEmail ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!inApp) return
    let cancelled = false
    void playBillingAvailable().then((ok) => {
      if (cancelled) return
      setAvailable(ok)
      if (ok) void playPrice(productId).then((p) => !cancelled && setPrice(p))
    })
    return () => {
      cancelled = true
    }
  }, [inApp, productId])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const typed = email.trim().toLowerCase()
    if (!signedInEmail && typed !== confirm.trim().toLowerCase()) {
      setError('The two email addresses do not match.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await buyOnPlay(productId, typed)
      signIn(res.jwt)
      navigate(isOnboarded() ? '/' : '/welcome', { replace: true })
    } catch (err) {
      if (err instanceof PlayCancelled) {
        setError(null)
      } else if (err instanceof ApiError && (err.body as { code?: unknown })?.code === 'pending') {
        setError(
          'Google Play is still confirming the payment. Open the app again in a few minutes and your guide will be ready.',
        )
      } else if (err instanceof ApiError && err.status === 409) {
        setError(err.message)
      } else if (err instanceof ApiError) {
        setError(
          `${err.message} Your purchase is safe: the app finishes it the next time it opens with a connection.`,
        )
      } else {
        setError(
          'No connection to finish the purchase. If Google Play charged you, the app finishes it the next time it opens online.',
        )
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="wrap login-wrap">
        <header className="brand-lockup">
          <img
            className="brand-lockup__mark"
            src="/brand/mark-96.webp"
            srcSet="/brand/mark-96.webp 1x, /brand/mark-192.webp 2x"
            alt=""
            width="61"
            height="48"
          />
          <div>
            <div className="brand-lockup__title">The Talus Field</div>
            <div className="brand-lockup__sub">A field journal of Yosemite</div>
          </div>
        </header>

        <div className="login-head">
          <span className="eyebrow eyebrow--moss">The Field Guide · {EDITION_LABEL}</span>
          <h1 className="login-title">{renew ? 'Renew the guide' : 'Get the guide'}</h1>
          <p className="login-intro">
            {renew
              ? 'Eighteen more months, added to the end of your current access. Trips, saved stops, downloads and sign-in all carry over.'
              : 'One payment, 18 months of access, no automatic renewal: four regional guides, the Secret Guide, and an offline topo map of the park, on every device you own.'}
          </p>
        </div>

        {!inApp ? (
          <div className="card">
            <p className="card__note" style={{ marginTop: 0 }}>
              This page is the Android app's checkout. In a browser, the guide is sold on The
              Talus Field.
            </p>
            <Button href={GUIDE_CHECKOUT_URL} external>
              Get the guide →
            </Button>
          </div>
        ) : available === false ? (
          <div className="card">
            <p className="card__note" style={{ margin: 0 }}>
              Purchases in this app go through Google Play, which this device cannot reach right
              now. Make sure Google Chrome and the Play Store are installed and up to date, then
              open the app again. Already bought the guide? <Link to="/login">Sign in</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="form-stack">
            {signedInEmail ? (
              <p className="card__note" style={{ margin: 0 }}>
                For <strong>{signedInEmail}</strong>.
              </p>
            ) : (
              <>
                <label className="field">
                  Your email
                  <input
                    className="input"
                    type="text"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="email"
                    enterKeyHint="next"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="field">
                  Email again
                  <input
                    className="input"
                    type="text"
                    required
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="email"
                    enterKeyHint="go"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </label>
                <p className="card__note" style={{ margin: 0 }}>
                  Your sign-in link and a 6-digit code go to this address, for opening the guide
                  on your other devices.
                </p>
              </>
            )}
            <Button type="submit" disabled={busy || available === null}>
              {busy ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Opening Google Play…
                </>
              ) : (
                `${renew ? 'Renew' : 'Buy'} with Google Play${price ? ` · ${price}` : ''}`
              )}
            </Button>
          </form>
        )}

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <p className="page-footnote">
          Questions about a purchase:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Field%20Guide%20purchase`}>{SUPPORT_EMAIL}</a>.{' '}
          {!renew && !session && !(inApp && available === false) && (
            <Link to="/login">Already bought it? Sign in →</Link>
          )}
        </p>
      </main>
    </div>
  )
}
