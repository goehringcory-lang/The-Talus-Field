import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  clearStoredJwt,
  readSessionFromStorage,
  setStoredJwt,
} from './storage'
import { AuthContext, useAuth, type Session } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => readSessionFromStorage())

  useEffect(() => {
    const onStorage = () => setSession(readSessionFromStorage())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const signIn = useCallback((jwt: string) => {
    setStoredJwt(jwt)
    setSession(readSessionFromStorage())
  }, [])

  const signOut = useCallback(() => {
    clearStoredJwt()
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
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
