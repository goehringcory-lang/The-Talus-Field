import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/auth-context'

type LoginResponse = { jwt: string }

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await apiFetch<LoginResponse>('/api/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), code: code.trim() }),
      })
      signIn(res.jwt)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("That username and code don't match.")
      } else {
        setError(err instanceof Error ? err.message : 'Sign-in failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="wrap wrap--narrow" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 18 }}>Sign in</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Enter the username and access code you were given.
        </p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 18, maxWidth: 420 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Username</span>
            <input
              className="input"
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Access code</span>
            <input
              className="input"
              type="password"
              required
              autoComplete="current-password"
              autoCapitalize="none"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          {error && (
            <div style={{ color: 'var(--moss)', fontSize: 14 }}>{error}</div>
          )}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Sign in →'}
          </button>
        </form>
      </main>
    </div>
  )
}
