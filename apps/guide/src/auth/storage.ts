const KEY = 'tfg.jwt'
// Set when a session ends because access lapsed (JWT expiry or a server-side
// revocation), so /login can explain instead of silently bouncing the buyer.
const ACCESS_ENDED_KEY = 'tfg.accessEndedAt'

type JwtClaims = {
  sub: string
  exp: number
}

function decodeClaims(jwt: string): JwtClaims | null {
  try {
    const [, payload] = jwt.split('.')
    if (!payload) return null
    // atob yields latin1; a sub with multibyte characters needs a real
    // UTF-8 decode or JSON.parse gets mojibake (or throws).
    const bin = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
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

export function setAccessEndedAt(epochSeconds: number): void {
  try {
    localStorage.setItem(ACCESS_ENDED_KEY, String(epochSeconds))
  } catch {
    /* non-fatal: /login just won't show the explanation */
  }
}

export function getAccessEndedAt(): number | null {
  try {
    const raw = localStorage.getItem(ACCESS_ENDED_KEY)
    if (!raw) return null
    const n = Number.parseInt(raw, 10)
    return Number.isNaN(n) ? null : n
  } catch {
    return null
  }
}

export function clearAccessEndedAt(): void {
  try {
    localStorage.removeItem(ACCESS_ENDED_KEY)
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
    // JWTs are signed to the buyer's access expiry, so hitting this means the
    // paid window ended. Leave a marker so /login says so.
    setAccessEndedAt(claims.exp)
    clearStoredJwt()
    return null
  }
  return { jwt, username: claims.sub }
}

// Session derived from the JWT itself, not from storage. Sign-in must not
// depend on setStoredJwt having persisted: in storage-blocked contexts the
// write silently fails, and re-reading storage would discard a JWT the server
// just issued (burning a single-use magic-link token in the process).
export function sessionFromJwt(jwt: string): { jwt: string; username: string } | null {
  const claims = decodeClaims(jwt)
  if (!claims || claims.exp * 1000 < Date.now()) return null
  return { jwt, username: claims.sub }
}
