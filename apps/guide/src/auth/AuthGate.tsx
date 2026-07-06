import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  clearAccessEndedAt,
  clearStoredJwt,
  readSessionFromStorage,
  setAccessEndedAt,
  setStoredJwt,
} from './storage'
import { clearCachedMe, fetchMe } from './me'
import { ApiError } from '../lib/api'
import { AuthContext, useAuth } from './useAuth'
import type { Session } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => readSessionFromStorage())

  // If another tab signs in/out, keep this one in sync.
  useEffect(() => {
    const onStorage = () => setSession(readSessionFromStorage())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Online revalidation: JWTs are signed to the buyer's access expiry, so a
  // server-side revocation (refund) can outrun the token. When we have both a
  // session and a network, ask /me once per app boot; if access has ended,
  // sign out with the explanation marker set. Network failure does nothing —
  // offline in the park must never punish the buyer.
  useEffect(() => {
    if (!session || !navigator.onLine) return
    let cancelled = false
    fetchMe()
      .then((me) => {
        if (cancelled) return
        if (me.expired) {
          setAccessEndedAt(me.expiresAt)
          clearStoredJwt()
          setSession(null)
        }
      })
      .catch((err) => {
        if (cancelled) return
        // A definitive 401 while online means the Worker rejected this JWT
        // (revocation, secret rotation): sign out with no "access ended"
        // marker, since the reason is unknown and /login's plain form is
        // right. Anything else (network, 5xx, schema drift) keeps the
        // session: offline must never punish the buyer.
        if (err instanceof ApiError && err.status === 401) {
          clearStoredJwt()
          clearCachedMe()
          setSession(null)
        }
      })
    return () => {
      cancelled = true
    }
    // Deliberately keyed on the jwt string, not the session object, so the
    // check re-runs only on actual sign-in changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.jwt])

  const signIn = useCallback((jwt: string) => {
    setStoredJwt(jwt)
    // A successful sign-in supersedes any "access ended" explanation.
    clearAccessEndedAt()
    setSession(readSessionFromStorage())
  }, [])

  const signOut = useCallback(() => {
    clearStoredJwt()
    clearCachedMe()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, signIn, signOut }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) {
    // Keep the query string: /map?tab=…&stop=… is the shape shared links use.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <>{children}</>
}
