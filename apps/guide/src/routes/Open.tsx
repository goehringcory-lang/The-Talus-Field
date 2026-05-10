import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { useAuth } from '../auth/useAuth'

type ExchangeResponse = { jwt: string }

export default function Open() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const token = params.get('token')
  // Derive the "missing token" case during render rather than setState in effect.
  const error = token ? apiError : 'Missing token in URL.'

  useEffect(() => {
    if (!token) return
    let cancelled = false
    apiFetch<ExchangeResponse>('/api/auth/exchange', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (cancelled) return
        signIn(res.jwt)
        navigate('/', { replace: true })
      })
      .catch((err) => {
        if (cancelled) return
        setApiError(err.message ?? 'Could not sign you in.')
      })
    return () => {
      cancelled = true
    }
  }, [token, signIn, navigate])

  return (
    <div className="app-shell">
      <main className="wrap wrap--narrow" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        {error ? (
          <>
            <h1 style={{ marginBottom: 18 }}>Sign-in link didn't work.</h1>
            <p style={{ color: 'var(--ink-2)' }}>{error}</p>
            <p>
              <Link to="/login">Sign in with your 6-digit code instead →</Link>
            </p>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: 18 }}>Signing you in…</h1>
            <p style={{ color: 'var(--ink-3)' }}>One moment.</p>
          </>
        )}
      </main>
    </div>
  )
}
