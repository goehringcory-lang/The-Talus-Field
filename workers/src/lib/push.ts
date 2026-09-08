// =============================================================================
// Web Push (RFC 8030) sending, VAPID half only (RFC 8292).
//
// Deliberately PAYLOAD-LESS. A push message carrying content must be encrypted
// with aes128gcm per RFC 8291: an ephemeral ECDH against the subscription's
// p256dh key, HKDF twice, AES-GCM, and a record framing that is unforgiving
// about padding. Hand-rolling that here would be the single riskiest code in
// this Worker, and getting it subtly wrong fails as "notifications silently
// stop", which is exactly the bug nobody reports.
//
// So we send an empty push, and the service worker asks what it was about
// (POST /api/push/pending with its own endpoint). That is not a security
// downgrade: the endpoint URL is already the capability that lets anyone push
// to that device, so a caller who can present it could have sent the
// notification itself. What it costs is one round trip at wake-up, which the
// SW handles inside its waitUntil, and a generic fallback notification when
// the device is somehow online enough to receive a push but not to answer.
//
// The VAPID half IS implemented here, because push services require it and it
// is small: an ES256 JWS over {aud, exp, sub}. WebCrypto's ECDSA P-256 signer
// emits raw r||s, which is precisely what JWS ES256 wants — no DER unwrapping,
// which is where most hand-rolled ES256 goes wrong.
//
// Keys: generate with `node scripts/gen-vapid-keys.mjs`, then
//   wrangler secret put VAPID_PUBLIC_KEY
//   wrangler secret put VAPID_PRIVATE_KEY
// Both are base64url. The public key is also served to the app by
// GET /api/push/key — it is public by design (it goes into every subscription).
// =============================================================================

import type { Env } from '../env'

export type PushSubscriptionInfo = {
  endpoint: string
  // Kept on the record for completeness and for a future encrypted-payload
  // path; unused while pushes are payload-less.
  p256dh?: string
  auth?: string
}

/** True when both VAPID secrets are set; every push path 503s without them. */
export function isPushConfigured(env: Env): boolean {
  return !!env.VAPID_PUBLIC_KEY && !!env.VAPID_PRIVATE_KEY
}

// --- base64url --------------------------------------------------------------

function b64urlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

function bytesToB64url(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function textToB64url(text: string): string {
  return bytesToB64url(new TextEncoder().encode(text))
}

// --- VAPID ------------------------------------------------------------------

// The uncompressed P-256 public key is 0x04 || X(32) || Y(32). The private key
// import needs X, Y, and d as separate base64url JWK fields.
async function importVapidKey(env: Env): Promise<CryptoKey> {
  const pub = b64urlToBytes(env.VAPID_PUBLIC_KEY!)
  if (pub.length !== 65 || pub[0] !== 0x04) {
    throw new Error('VAPID_PUBLIC_KEY is not an uncompressed P-256 point')
  }
  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: 'P-256',
    x: bytesToB64url(pub.slice(1, 33)),
    y: bytesToB64url(pub.slice(33, 65)),
    d: env.VAPID_PRIVATE_KEY!,
    ext: true,
    key_ops: ['sign'],
  }
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
  ])
}

// Push services reject a token whose lifetime is over 24 h. 12 h leaves room
// for clock skew at both ends while still being a short-lived credential.
const VAPID_TTL_SECONDS = 12 * 60 * 60

async function vapidAuthHeader(env: Env, endpoint: string): Promise<string> {
  const audience = new URL(endpoint).origin
  const header = textToB64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))
  const payload = textToB64url(
    JSON.stringify({
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + VAPID_TTL_SECONDS,
      // Contact for the push service operator if this sender misbehaves.
      sub: 'mailto:cory@thetalusfieldjournal.com',
    }),
  )
  const signingInput = `${header}.${payload}`
  const key = await importVapidKey(env)
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(signingInput),
  )
  const jwt = `${signingInput}.${bytesToB64url(new Uint8Array(signature))}`
  return `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`
}

// --- Sending ----------------------------------------------------------------

export type PushResult =
  | { ok: true }
  /** The subscription is dead (404/410): the caller should delete the record. */
  | { ok: false; gone: true; status: number }
  | { ok: false; gone: false; status: number; detail: string }

/**
 * Deliver one payload-less push. Never throws for a push-service rejection —
 * a dead subscription is an expected, routine outcome (app uninstalled,
 * notifications revoked, browser data cleared) and the sweep must keep going.
 */
export async function sendPush(env: Env, endpoint: string): Promise<PushResult> {
  let authorization: string
  try {
    authorization = await vapidAuthHeader(env, endpoint)
  } catch (err) {
    return { ok: false, gone: false, status: 0, detail: `vapid: ${String(err)}` }
  }

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        // No body, so no Content-Encoding. TTL is required by RFC 8030; a day
        // is right for these messages — a renewal notice or a morning nudge is
        // worth delivering late, but not a week late.
        TTL: '86400',
        // Wake the device even in a low-power state: every message this Worker
        // sends is one the buyer asked to receive.
        Urgency: 'normal',
        'Content-Length': '0',
      },
    })
  } catch (err) {
    return { ok: false, gone: false, status: 0, detail: String(err) }
  }

  if (res.status === 404 || res.status === 410) {
    return { ok: false, gone: true, status: res.status }
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { ok: false, gone: false, status: res.status, detail: detail.slice(0, 200) }
  }
  return { ok: true }
}
