import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import Skeleton from '../components/ui/Skeleton'

type ExchangeResponse = { jwt: string }

// Magic-link landing: exchanges the emailed accessToken for a JWT. The first
// thing a buyer sees after purchase, so it wears the full lockup.
export default function Open() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const token = params.get('token')
  // Derive the "missing token" case during render rather than setState in effect.
  const error = token ? apiError : 'Missing token in URL.'
  // The exchange token is single-use; one POST per token, ever. StrictMode
  // double-invokes this effect in dev, and this ref (not effect cleanup) is
  // what stops the second network call from burning the token.
  const attempted = useRef<string | null>(null)

  useEffect(() => {
    if (!token || attempted.current === token) return
    attempted.current = token
    // No cancellation here, deliberately. The `attempted` ref means only the
    // FIRST effect run ever fires the POST; under StrictMode's mount-unmount-
    // mount the second run early-returns, so a cleanup flag from run one would
    // permanently strand a successful exchange (token burnt server-side, page
    // stuck on "Signing you in…"). Completing sign-in after an unmount is the
    // desired outcome anyway: setState on an unmounted component is a no-op,
    // and navigate stays valid because it belongs to the router.
    apiFetch<ExchangeResponse>('/api/auth/exchange', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        signIn(res.jwt)
        // First sign-in on this device goes through the setup page. replace,
        // so Back never replays the burnt single-use token.
        navigate(isOnboarded() ? '/' : '/welcome', { replace: true })
      })
      .catch((err) => {
        setApiError(err.message ?? 'Could not sign you in.')
      })
  }, [token, signIn, navigate])

  return (
    <div className="app-shell">
      <main className="wrap login-wrap">
        <header className="brand-lockup">
          <img
            className="brand-lockup__mark"
            src="/brand/mark-96.png"
            srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
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
          <span className="eyebrow eyebrow--moss">The Field Guide · 2026 Edition</span>
          {error ? (
            <>
              <h1 className="login-title">Sign-in link didn't work.</h1>
              <p className="login-intro">{error}</p>
              <p style={{ marginTop: 16 }}>
                <Link to="/login">Sign in with your 6-digit code instead →</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="login-title">Signing you in…</h1>
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
