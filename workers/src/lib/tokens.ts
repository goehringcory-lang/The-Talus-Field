// Cryptographically random identifiers for buyer access.

export function generateAccessToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function generateAccessCode(): string {
  // 6-digit numeric code, zero-padded. ~1M space; rate-limited login compensates.
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return String(bytes[0] % 1_000_000).padStart(6, '0')
}

// Deterministic variants, derived from the Stripe Checkout session id and
// keyed by a server secret. The instant-access claim (/api/checkout/claim)
// and the webhook can both provision the same purchase within seconds of each
// other, and KV is eventually consistent, so neither can reliably see the
// other's write. Deriving the credentials from the session id makes the two
// writes byte-identical: the race can only ever overwrite a record with
// itself, and the emailed code always matches whatever is stored.
async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function deriveAccessToken(secret: string, sessionId: string): Promise<string> {
  return hmacHex(secret, `access-token:${sessionId}`)
}

export async function deriveAccessCode(secret: string, sessionId: string): Promise<string> {
  // Same 6-digit shape as generateAccessCode. 48 bits mod 1e6: the modulo
  // bias is far below anything the rate-limited login could ever surface.
  const hex = await hmacHex(secret, `access-code:${sessionId}`)
  return String(Number.parseInt(hex.slice(0, 12), 16) % 1_000_000).padStart(6, '0')
}

export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
