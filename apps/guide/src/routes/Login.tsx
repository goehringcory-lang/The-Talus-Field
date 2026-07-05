import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { getAccessEndedAt } from '../auth/storage'
import Plate from '../components/Plate'
import ResponsivePhoto from '../components/ResponsivePhoto'
import Button from '../components/ui/Button'

type LoginResponse = { jwt: string }

function formatEndedDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Self-serve replacement for "email cory@ and wait": posts /api/auth/resend,
// which re-sends the purchase email (magic link + code). The response is
// always the same regardless of whether the email bought the guide, so the
// confirmation copy is deliberately conditional.
function ResendAccessEmail({ prefillEmail }: { prefillEmail: string }) {
  const [open, setOpen] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function onResend(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await apiFetch('/api/auth/resend', {
        method: 'POST',
        body: JSON.stringify({ email: resendEmail.trim() }),
      })
    } catch {
      /* same confirmation either way: the endpoint is deliberately opaque */
    }
    setBusy(false)
    setDone(true)
  }

  if (done) {
    return (
      <p className="login-aside">
        If that email bought the guide, your access email is on its way. Check spam too.
        Still stuck? Write to <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
      </p>
    )
  }

  if (!open) {
    return (
      <p className="login-aside">
        Lost the email?{' '}
        <Button
          variant="quiet"
          onClick={() => {
            setResendEmail(prefillEmail)
            setOpen(true)
          }}
        >
          Resend my access email
        </Button>
        , or write to <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
      </p>
    )
  }

  return (
    <form onSubmit={onResend} className="form-stack" style={{ marginTop: 28 }}>
      <label className="field">
        Email you bought with
        <input
          className="input"
          type="email"
          required
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
        />
      </label>
      <Button variant="ghost" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Resend access email'}
      </Button>
    </form>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Set by storage.ts when a session ended because the paid window lapsed.
  const [accessEndedAt] = useState<number | null>(() => getAccessEndedAt())

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      let res: LoginResponse
      try {
        res = await apiFetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), code: code.trim() }),
        })
      } catch (err) {
        // The operator's pre-Stripe username/code pair isn't a buyer record;
        // give it one shot at the env-backed path before reporting failure.
        // 429 included: operator sign-ins never clear the legacy per-email
        // attempt bucket, so after five of them /login rate-limits even
        // though /dev-login (its own ip+username bucket) would succeed.
        if (err instanceof ApiError && (err.status === 401 || err.status === 429)) {
          try {
            res = await apiFetch<LoginResponse>('/api/auth/dev-login', {
              method: 'POST',
              body: JSON.stringify({ username: email.trim(), code: code.trim() }),
            })
          } catch {
            // Surface the buyer-path error; it matches what the user tried.
            throw err
          }
        } else {
          throw err
        }
      }
      signIn(res.jwt)
      // Return to the deep link the user was gated out of, if any.
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && err.message === 'Access has expired') {
        setError('Your 18-month access period has ended. Email cory@thetalusfieldjournal.com about renewing.')
      } else if (err instanceof ApiError && err.status === 401) {
        setError("That email and code don't match. The code is in your purchase email.")
      } else if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Wait an hour and try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Sign-in failed.')
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

        <Plate tag="Plate · Tunnel View">
          <ResponsivePhoto
            src="/photos/tunnel-view.jpg"
            alt="Tunnel View at first light: El Capitan, Bridalveil Fall, and Half Dome"
            loading="eager"
            width={1200}
            height={900}
            sizes="(max-width: 720px) 100vw, 560px"
            style={{ aspectRatio: '2 / 1', objectFit: 'cover' }}
          />
        </Plate>

        <div className="login-head">
          <span className="eyebrow eyebrow--moss">The Field Guide · 2026 Edition</span>
          <h1 className="login-title">Sign in</h1>
          <p className="login-intro">
            Enter the email you bought the guide with and the 6-digit access code from your
            purchase email.
          </p>
        </div>

        {accessEndedAt !== null && (
          <div className="card" style={{ marginBottom: 28 }}>
            <p className="card__note" style={{ margin: 0 }}>
              Your access period ended {formatEndedDate(accessEndedAt)}. Purchases include
              18 months of access. Email{' '}
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{' '}
              about renewing.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="form-stack">
          <label className="field">
            Email
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
            Access code
            <input
              className="input"
              type="password"
              required
              autoComplete="one-time-code"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="go"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <Button type="submit" disabled={busy}>
            {busy ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Checking…
              </>
            ) : (
              'Sign in →'
            )}
          </Button>
        </form>

        <ResendAccessEmail prefillEmail={email} />

        <p className="page-footnote">
          Works offline once installed. Pay once, sign in on every device you own.
        </p>
      </main>
    </div>
  )
}
