const KEY = 'tfg.jwt'

type JwtClaims = {
  sub: string
  exp: number
}

function decodeClaims(jwt: string): JwtClaims | null {
  try {
    const [, payload] = jwt.split('.')
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

// localStorage access can throw (Safari "Block all cookies", storage-denied
// embedded contexts). Since readSessionFromStorage runs during AuthProvider's
// initial render, an unguarded throw here would blank the whole app at boot.
export function getStoredJwt(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setStoredJwt(jwt: string): void {
  try {
    localStorage.setItem(KEY, jwt)
  } catch {
    /* non-fatal: session just won't persist across reloads */
  }
}

export function clearStoredJwt(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* non-fatal */
  }
}

export function readSessionFromStorage(): { jwt: string; username: string } | null {
  const jwt = getStoredJwt()
  if (!jwt) return null
  const claims = decodeClaims(jwt)
  if (!claims) {
    clearStoredJwt()
    return null
  }
  if (claims.exp * 1000 < Date.now()) {
    clearStoredJwt()
    return null
  }
  return { jwt, username: claims.sub }
}
