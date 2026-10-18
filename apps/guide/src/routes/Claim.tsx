import { useEffect, useRef, useState } from 'react'
import { EDITION_LABEL } from '../lib/buildInfo'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError, apiFetch } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import { SUPPORT_EMAIL } from '../lib/corrections'
import Skeleton from '../components/ui/Skeleton'

type ClaimResponse = { jwt: string }

// Instant-access landing: the Stripe success redirect (via the editorial
// /guide page) arrives here with ?session_id=, and the Worker's
// /api/checkout/claim verifies the payment against Stripe directly and
// answers with a JWT — no webhook to wait on, no email to open. The email
// still arrives and stays the way onto a second device; this page only
// removes it from the critical path. Mirrors Open.tsx, the emailed
// magic-link's landing, which stays the fallback when anything here fails.
export default function Claim() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  // Whether the access email is still coming. True for the failures that
  // leave the purchase intact (Stripe slow to answer, rate limit, a payment
  // still settling, no connection): the webhook mails access regardless.
  // False when the Worker says there is no paid purchase behind this id (an
  // unknown or unfinished session, or one that was refunded), where promising
  // an email would send the reader to an inbox that will stay empty.
  const [emailFollows, setEmailFollows] = useState(true)
  const sessionId = params.get('session_id')
  // Derive the "missing id" case during render rather than setState in effect.
  const error = sessionId ? apiError : 'This page is missing its checkout reference.'
  // One POST per session id per mount: StrictMode double-invokes the effect in
  // dev, and this ref (not effect cleanup) is what stops the redundant second
  // call — same pattern and reasoning as Open.tsx.
  const attempted = useRef<string | null>(null)

  useEffect(() => {
    if (!sessionId || attempted.current === sessionId) return
    attempted.current = sessionId
    // No cancellation, deliberately (see Open.tsx): only the first effect run
    // fires the POST, and completing sign-in after an unmount is the desired
    // outcome — setState on an unmounted component is a no-op, and navigate
    // stays valid because it belongs to the router.
    apiFetch<ClaimResponse>('/api/checkout/claim', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        signIn(res.jwt)
        // First sign-in on this device goes through the setup page. replace,
        // so Back never re-runs the claim (and the session id leaves the URL).
        navigate(isOnboarded() ? '/' : '/welcome', { replace: true })
      })
      .catch((err) => {
        const refunded =
          err instanceof ApiError &&
          typeof err.body === 'object' &&
          err.body !== null &&
          (err.body as { code?: unknown }).code === 'refunded'
        const noPurchase =
          err instanceof ApiError && (err.status === 400 || err.status === 402 || err.status === 404)
        setEmailFollows(!refunded && !noPurchase)
        setApiError(err.message ?? 'Could not sign you in.')
      })
  }, [sessionId, signIn, navigate])

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
          {error ? (
            <>
              <h1 className="login-title">We couldn't open your guide automatically.</h1>
              <p className="login-intro">{error}</p>
              {sessionId && emailFollows ? (
                <>
                  <p className="login-intro" style={{ marginTop: 12 }}>
                    No harm done: your access email, with a sign-in link and a 6-digit code, is on
                    its way to the address you used at checkout. Check spam if nothing arrives in a
                    few minutes.
                  </p>
                  <p style={{ marginTop: 16 }}>
                    <Link to="/login">Sign in with your code instead →</Link>
                  </p>
                </>
              ) : (
                <p className="login-intro" style={{ marginTop: 12 }}>
                  If you paid and think this is wrong, email{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Field%20Guide%20access`}>{SUPPORT_EMAIL}</a>{' '}
                  and it will be sorted out. Already have a code?{' '}
                  <Link to="/login">Sign in →</Link>
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="login-title">Payment received. Opening your guide…</h1>
              <div style={{ display: 'grid', gap: 10, maxWidth: 360, marginTop: 24 }}>
                <Skeleton height={14} width="70%" />
                <Skeleton height={14} width="88%" />
                <Skeleton height={14} width="55%" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
