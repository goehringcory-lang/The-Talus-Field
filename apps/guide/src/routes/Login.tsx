import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import { getAccessEndedAt } from '../auth/storage'

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
      <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 28 }}>
        If that email bought the guide, your access email is on its way. Check spam too.
        Still stuck? Write to <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
      </p>
    )
  }

  if (!open) {
    return (
      <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 28 }}>
        Lost the email?{' '}
        <button
          type="button"
          onClick={() => {
            setResendEmail(prefillEmail)
            setOpen(true)
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--moss)',
            fontSize: 13,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Resend my access email
        </button>
        , or write to <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
      </p>
    )
  }

  return (
    <form onSubmit={onResend} style={{ display: 'grid', gap: 12, maxWidth: 420, marginTop: 28 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span className="eyebrow">Email you bought with</span>
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
      <button className="btn btn--ghost" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Resend access email'}
      </button>
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
      <main className="wrap wrap--narrow" style={{ paddingTop: 'clamp(32px, 10vh, 96px)', paddingBottom: 'clamp(32px, 10vh, 96px)' }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 18 }}>Sign in</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Enter the email you bought the guide with and the 6-digit access code from your purchase email.
        </p>

        {accessEndedAt !== null && (
          <div className="card" style={{ marginBottom: 28, maxWidth: 420 }}>
            <p style={{ color: 'var(--ink-2)', fontSize: 14, margin: 0 }}>
              Your access period ended {formatEndedDate(accessEndedAt)}. Purchases include
              18 months of access. Email{' '}
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{' '}
              about renewing.
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 18, maxWidth: 420 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Email</span>
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
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Access code</span>
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

          {error && (
            <div style={{ color: 'var(--moss)', fontSize: 14 }}>{error}</div>
          )}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span className="spinner" aria-hidden="true" />
                Checking…
              </span>
            ) : 'Sign in →'}
          </button>
        </form>

        <ResendAccessEmail prefillEmail={email} />
      </main>
    </div>
  )
}
