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

export function getStoredJwt(): string | null {
  return localStorage.getItem(KEY)
}

export function setStoredJwt(jwt: string): void {
  localStorage.setItem(KEY, jwt)
}

export function clearStoredJwt(): void {
  localStorage.removeItem(KEY)
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
