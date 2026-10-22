import { useEffect, useState } from 'react'
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
  PlayExpired,
  buyOnPlay,
  isAndroidApp,
  playBillingAvailable,
  playPrice,
  restorePlayPurchase,
} from '../lib/playBilling'

// /buy: the Android app's checkout (lib/playBilling.ts). Every buy and renew
// action in the Play Store build lands here instead of the editorial /guide
// page, because an app Play distributes sells through Play. There is no
// email: one tap opens Play's payment sheet, and the guide opens the moment
// the Worker has verified the purchase, which is also the reader's account
// from then on (restored from their Google account on a reinstall or a new
// phone). ?renew=1 sells the renewal to a buyer whose time is ending or over.
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
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

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

  function signedIn(jwt: string) {
    signIn(jwt)
    navigate(isOnboarded() ? '/' : '/welcome', { replace: true })
  }

  function explain(err: unknown) {
    if (err instanceof PlayCancelled) return
    if (err instanceof PlayExpired) {
      // The guide is on this Google account, but its 18 months are over.
      navigate('/buy?renew=1', { replace: true })
      setNote('This Google account bought the guide, and its 18 months have ended. Renew to carry on where you left off.')
      return
    }
    if (err instanceof ApiError && (err.body as { code?: unknown })?.code === 'pending') {
      setError('Google Play is still confirming the payment. Open the app again in a few minutes and your guide will be ready.')
    } else if (err instanceof ApiError && err.status === 409) {
      setError(err.message)
    } else if (err instanceof ApiError) {
      setError(`${err.message} If Google Play charged you, the app finishes it the next time it opens online.`)
    } else {
      setError('No connection to finish the purchase. If Google Play charged you, the app finishes it the next time it opens online.')
    }
  }

  async function buy() {
    setBusy('buy')
    setError(null)
    try {
      signedIn((await buyOnPlay(productId)).jwt)
    } catch (err) {
      explain(err)
    } finally {
      setBusy(null)
    }
  }

  async function restore() {
    setBusy('restore')
    setError(null)
    setNote(null)
    try {
      const result = await restorePlayPurchase()
      if (result.kind === 'signed-in') signedIn(result.res.jwt)
      else if (result.kind === 'expired') explain(new PlayExpired('expired'))
      else setError('This Google account has no Field Guide purchase. Bought it on the website? Sign in with your email code instead.')
    } catch (err) {
      explain(err)
    } finally {
      setBusy(null)
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
              : 'One payment, 18 months of access, no automatic renewal: four regional guides, the Secret Guide, and an offline topo map of the park, on any Android phone signed in to your Google account.'}
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
          <div className="form-stack">
            {note && (
              <p className="card__note" role="status" style={{ margin: 0 }}>
                {note}
              </p>
            )}
            <Button onClick={() => void buy()} disabled={busy !== null || available === null}>
              {busy === 'buy' ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Opening Google Play…
                </>
              ) : (
                `${renew ? 'Renew' : 'Buy'} with Google Play${price ? ` · ${price}` : ''}`
              )}
            </Button>
            <p className="card__note" style={{ margin: 0 }}>
              Paid with your Google account, and kept with it: the guide opens as soon as Google
              Play confirms, and comes back on its own if you reinstall or move to a new Android
              phone.
            </p>
            {!session && (
              <Button variant="quiet" onClick={() => void restore()} disabled={busy !== null || available === null}>
                {busy === 'restore' ? 'Looking for your purchase…' : 'Already bought it on Google Play? Restore'}
              </Button>
            )}
          </div>
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
            <Link to="/login">Bought it on the website? Sign in →</Link>
          )}
        </p>
      </main>
    </div>
  )
}
