import { createContext, useContext } from 'react'

export type Session = { jwt: string; username: string } | null

export type AuthContextValue = {
  session: Session
  signIn: (jwt: string) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
