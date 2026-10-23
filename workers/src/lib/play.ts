import jwt from '@tsndr/cloudflare-worker-jwt'
import type { Env } from '../env'

// Google Play Integrity for the Android app (the FieldGuideAndroid project, a
// Trusted Web Activity over the PWA). The app is a paid download: owning it on
// Google Play is the purchase. At first launch and about monthly after, the
// app asks Play for an integrity token over a nonce from GET /api/play/nonce,
// and POST /api/play/unlock decodes it here, server to server, before it
// signs the install in. Auth is a service account in the Google Cloud project
// linked to the app in the Play Console; its JSON key is the
// PLAY_SERVICE_ACCOUNT_JSON secret.

const SCOPE = 'https://www.googleapis.com/auth/playintegrity'

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string }

// One OAuth token per isolate, refreshed five minutes before it lapses.
let cachedToken: { value: string; expiresAt: number } | null = null

export function playConfigured(env: Env): boolean {
  return Boolean(env.PLAY_SERVICE_ACCOUNT_JSON && env.PLAY_PACKAGE_NAME)
}

async function accessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt - 300 > now) return cachedToken.value
  const sa = JSON.parse(env.PLAY_SERVICE_ACCOUNT_JSON ?? '') as ServiceAccount
  const tokenUri = sa.token_uri ?? 'https://oauth2.googleapis.com/token'
  const assertion = await jwt.sign(
    { iss: sa.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 },
    sa.private_key,
    { algorithm: 'RS256' },
  )
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`Google OAuth failed (${res.status}): ${await res.text()}`)
  const body = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: body.access_token, expiresAt: now + body.expires_in }
  return body.access_token
}

// The fields of a decoded integrity verdict this Worker reads.
// https://developer.android.com/google/play/integrity/verdicts
export type IntegrityPayload = {
  requestDetails?: { requestPackageName?: string; nonce?: string; timestampMillis?: string }
  appIntegrity?: { appRecognitionVerdict?: string; packageName?: string }
  accountDetails?: { appLicensingVerdict?: string }
}

// null when Google refuses the token as malformed or not this app's.
export async function decodeIntegrityToken(
  env: Env,
  token: string,
): Promise<IntegrityPayload | null> {
  const url = `https://playintegrity.googleapis.com/v1/${encodeURIComponent(env.PLAY_PACKAGE_NAME ?? '')}:decodeIntegrityToken`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken(env)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ integrity_token: token }),
  })
  if (res.status === 400 || res.status === 404) return null
  if (!res.ok) throw new Error(`Play Integrity decode failed (${res.status}): ${await res.text()}`)
  const body = (await res.json()) as { tokenPayloadExternal?: IntegrityPayload }
  return body.tokenPayloadExternal ?? null
}

// One-time nonces: issued by GET /api/play/nonce, spent by the unlock, ten
// minutes to live. They stop a token captured from one unlock (it travels in
// a URL) from being replayed.
const NONCE_KEY = (nonce: string) => `playNonce:${nonce}`
export const NONCE_TTL_SECONDS = 600

export async function issueNonce(env: Env): Promise<string> {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  const nonce = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  await env.GUIDE_BUYERS.put(NONCE_KEY(nonce), '1', { expirationTtl: NONCE_TTL_SECONDS })
  return nonce
}

export async function spendNonce(env: Env, nonce: string): Promise<boolean> {
  if (!(await env.GUIDE_BUYERS.get(NONCE_KEY(nonce)))) return false
  await env.GUIDE_BUYERS.delete(NONCE_KEY(nonce))
  return true
}

// An app owner's account: one per install (Play Integrity names no user, and
// the app makes a random install id the first time it runs). It is the JWT
// sub and the buyer record's key, kept in the record's `email` field, which
// every reader of a buyer record treats as the account id. It has no
// address, so nothing may email it; senders check for an @.
const INSTALL_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function playAppAccountId(installId: string): string | null {
  const id = installId.trim().toLowerCase()
  return INSTALL_ID_RE.test(id) ? `playapp:${id}` : null
}

export function isPlayAppAccount(sub: string): boolean {
  return sub.startsWith('playapp:')
}
