import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/useAuth'

type LoginResponse = { jwt: string }

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        if (err instanceof ApiError && err.status === 401) {
          res = await apiFetch<LoginResponse>('/api/auth/dev-login', {
            method: 'POST',
            body: JSON.stringify({ username: email.trim(), code: code.trim() }),
          })
        } else {
          throw err
        }
      }
      signIn(res.jwt)
      // Return to the deep link the user was gated out of, if any.
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
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

        <p style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 28 }}>
          Lost the email? Write to cory@thetalusfieldjournal.com and it will be resent.
        </p>
      </main>
    </div>
  )
}
