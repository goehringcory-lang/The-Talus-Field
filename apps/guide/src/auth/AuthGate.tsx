import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  clearStoredJwt,
  readSessionFromStorage,
  setStoredJwt,
} from './storage'

type Session = { jwt: string; username: string } | null

type AuthContextValue = {
  session: Session
  signIn: (jwt: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => readSessionFromStorage())

  // If another tab signs in/out, keep this one in sync.
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
