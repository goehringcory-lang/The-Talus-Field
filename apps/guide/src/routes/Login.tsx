import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/useAuth'
import '../styles/app.css'

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
      <main className="wrap wrap--narrow page page--auth">
        <div className="eyebrow eyebrow--moss page__kicker">
          The Field Guide
        </div>
        <h1 className="page__title">Sign in</h1>
        <p className="page__lede">
          Enter the email you bought the guide with and the 6-digit access code from your purchase email.
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-form__field">
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
          <label className="auth-form__field">
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
            <div className="form-error">{error}</div>
          )}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? (
              <span className="btn__busy">
                <span className="spinner" aria-hidden="true" />
                Checking…
              </span>
            ) : 'Sign in →'}
          </button>
        </form>

        <p className="auth-footnote">
          Lost the email? Write to cory@thetalusfieldjournal.com and it will be resent.
        </p>
      </main>
    </div>
  )
}
