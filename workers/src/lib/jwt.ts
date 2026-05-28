import jwt from '@tsndr/cloudflare-worker-jwt'

const TTL_SECONDS = 60 * 60 * 24 * 90 // 90 days

export type AccessClaims = {
  sub: string  // buyer email (lowercased) for /api/auth/login, or username for /api/auth/dev-login
  iat: number
  exp: number
}

export async function signAccessJwt(email: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const claims: AccessClaims = {
    sub: email,
    iat: now,
    exp: now + TTL_SECONDS,
  }
  return jwt.sign(claims, secret, { algorithm: 'HS256' })
}
