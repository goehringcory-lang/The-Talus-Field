import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  clearStoredJwt,
  getStoredJwtExpiryMs,
  readSessionFromStorage,
  setStoredJwt,
} from './storage'
import { AuthContext, useAuth } from './useAuth'
import type { Session } from './useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => readSessionFromStorage())

  // Re-read storage and update state only when the session actually changed
  // (readSessionFromStorage clears expired JWTs as a side effect).
  const refresh = useCallback(() => {
    setSession((prev) => {
      const next = readSessionFromStorage()
      return prev?.jwt === next?.jwt ? prev : next
    })
  }, [])

  // If another tab signs in/out, keep this one in sync.
  useEffect(() => {
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [refresh])

  const signIn = useCallback((jwt: string) => {
    setStoredJwt(jwt)
    setSession(readSessionFromStorage())
  }, [])

  const signOut = useCallback(() => {
    clearStoredJwt()
    setSession(null)
  }, [])

  // apiFetch dispatches this on a 401 from any non-auth endpoint. Only sign
  // out when a session exists, so failed login/exchange attempts (which have
  // no session yet) can't trigger a redirect loop.
  useEffect(() => {
    const onUnauthorized = () => {
      if (readSessionFromStorage()) signOut()
    }
    window.addEventListener('tfg:unauthorized', onUnauthorized)
    return () => window.removeEventListener('tfg:unauthorized', onUnauthorized)
  }, [signOut])

  // Catch expiry while the tab was backgrounded: readSessionFromStorage
  // drops expired JWTs, so a refresh on return is enough.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', refresh)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  // Sign out at the JWT's exp moment while the tab stays open, rather than
  // waiting for the next failed call. setTimeout delays overflow past
  // 2^31-1 ms (~24.8 days); these JWTs live 90 days, so skip scheduling
  // when expiry is beyond the clamp — a later refresh will catch it.
  useEffect(() => {
    if (!session) return
    const expMs = getStoredJwtExpiryMs()
    if (expMs === null) return
    const delay = expMs - Date.now()
    if (delay > 2 ** 31 - 1) return
    const id = window.setTimeout(refresh, Math.max(delay, 0) + 1000)
    return () => window.clearTimeout(id)
  }, [session, refresh])

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
