import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EDITION_LABEL } from '../lib/buildInfo'
import { ApiError, apiFetch } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { isOnboarded } from '../lib/onboarding'
import { SUPPORT_EMAIL } from '../lib/corrections'
import Skeleton from '../components/ui/Skeleton'
import { PLAY_STORE_URL, UNLOCK_INTENT_URL, isPlayAppAccount } from '../lib/androidApp'

type UnlockResponse = { jwt: string; expiresAt: number }

// /unlock?token=…&install=…&next=…: where the Android app's shell lands after
// Google Play has vouched for the copy (lib/androidApp.ts). The Worker's
// /api/play/unlock checks the verdict and answers with a session; the reader
// sees this page for a moment at first launch and then the guide.
//
// The shell also comes here about monthly to refresh a session it already
// has. A refresh that fails for want of a signal changes nothing, and a
// reader signed in with a website code is never switched over to the
// install's account.
export default function Unlock() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { session, signIn, signOut } = useAuth()
  const token = params.get('token')
  const installId = params.get('install')
  const next = safeNext(params.get('next'))
  const [error, setError] = useState<{ message: string; licensed: boolean } | null>(
    token && installId ? null : { message: 'The app could not check your purchase with Google Play.', licensed: true },
  )
  // One POST per token: the nonce inside it is single-use, and StrictMode
  // double-invokes the effect in dev (the Claim.tsx pattern).
  const attempted = useRef<string | null>(null)

  useEffect(() => {
    if (!token || !installId || attempted.current === token) return
    attempted.current = token
    const finish = () => navigate(isOnboarded() ? next : '/welcome', { replace: true })

    // A website buyer signed in with their code keeps that account.
    if (session && !isPlayAppAccount(session.username)) {
      finish()
      return
    }
    apiFetch<UnlockResponse>('/api/play/unlock', {
      method: 'POST',
      body: JSON.stringify({ token, installId }),
    })
      .then((res) => {
        signIn(res.jwt)
        finish()
      })
      .catch((err) => {
        const code =
          err instanceof ApiError && typeof err.body === 'object' && err.body !== null
            ? (err.body as { code?: unknown }).code
            : undefined
        if (code === 'not_licensed') {
          // Refunded, or not bought on this Google account: the session goes.
          if (session) signOut()
          setError({
            message: 'Google Play says the Google account on this phone has not bought the app.',
            licensed: false,
          })
        } else if (session) {
          // A monthly refresh without a signal: the session still stands.
          finish()
        } else {
          setError({
            message:
              code === 'stale'
                ? 'That check took too long.'
                : 'The app could not reach Google Play or the guide. Check the connection.',
            licensed: true,
          })
        }
      })
  }, [token, installId, next, session, signIn, signOut, navigate])

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
              <h1 className="login-title">The guide didn't open.</h1>
              <p className="login-intro">{error.message}</p>
              <div className="action-row" style={{ marginTop: 16 }}>
                {error.licensed ? (
                  <a className="btn" href={UNLOCK_INTENT_URL}>
                    Try again
                  </a>
                ) : (
                  <a className="btn" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                    Get it on Google Play
                  </a>
                )}
                <Link className="btn btn--quiet" to="/login">
                  Bought it on the website? Sign in
                </Link>
              </div>
              <p className="login-intro" style={{ marginTop: 16 }}>
                Bought the app and still stuck? Email{' '}
                <a href={`mailto:${SUPPORT_EMAIL}?subject=Field%20Guide%20Android%20app`}>{SUPPORT_EMAIL}</a>.
              </p>
            </>
          ) : (
            <>
              <h1 className="login-title">Opening your guide…</h1>
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

// Only an in-app path: the shell passes the page the reader opened, and
// nothing else may ride along as a redirect.
function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/unlock') ? raw : '/'
}
