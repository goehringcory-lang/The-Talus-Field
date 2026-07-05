import jwt from '@tsndr/cloudflare-worker-jwt'

const TTL_SECONDS = 60 * 60 * 24 * 90 // 90 days

export type AccessClaims = {
  sub: string  // buyer email (lowercased) for /api/auth/login, or username for /api/auth/dev-login
  iat: number
  exp: number
}

// Buyer logins pass the buyer's KV expiresAt so one sign-in lasts the whole
// paid access window (essential offline in the park — there is no network to
// refresh against). Dev/admin logins omit it and get the 90-day default.
export async function signAccessJwt(
  sub: string,
  secret: string,
  expEpochSeconds?: number,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const claims: AccessClaims = {
    sub,
    iat: now,
    // Clamp a caller-supplied exp to at least a minute out so a buyer right at
    // the edge of their window still gets a briefly usable token instead of
    // one that is dead on arrival.
    exp: expEpochSeconds !== undefined ? Math.max(expEpochSeconds, now + 60) : now + TTL_SECONDS,
  }
  return jwt.sign(claims, secret, { algorithm: 'HS256' })
}

// Returns the verified claims, or null on any failure (bad signature, expired,
// malformed). verify() checks exp itself and resolves undefined rather than
// throwing when throwError is left at its default of false.
export async function verifyAccessJwt(
  token: string,
  secret: string,
): Promise<AccessClaims | null> {
  try {
    const data = await jwt.verify<AccessClaims>(token, secret, { algorithm: 'HS256' })
    if (!data?.payload?.sub || typeof data.payload.exp !== 'number') return null
    return data.payload as AccessClaims
  } catch {
    return null
  }
}
