import { Hono } from 'hono'
import type { Env } from '../env'
import type { BuyerRecord } from '../lib/kv'
import {
  getBuyer,
  putBuyer,
  recordPlayNonceAttempt,
  recordPlayUnlockAttempt,
} from '../lib/kv'
import { deriveAccessCode, deriveAccessToken } from '../lib/tokens'
import { signAccessJwt } from '../lib/jwt'
import {
  NONCE_TTL_SECONDS,
  decodeIntegrityToken,
  issueNonce,
  playAppAccountId,
  playConfigured,
  spendNonce,
} from '../lib/play'

// The Android app's unlock (lib/play.ts). The app is a paid download on
// Google Play, so there is nothing to buy here: the app proves it is a copy
// Play licensed to the person holding the phone, and the install is signed in
// for as long as that stays true.
//
//   GET  /api/play/nonce   -> { nonce }                 (the app's native code)
//   POST /api/play/unlock  { token, installId } -> { jwt, expiresAt }
//                                                       (the PWA's /unlock page)
//
// The session lasts SESSION_DAYS and the app re-unlocks about monthly while it
// has a signal, so a refunded copy (Play then answers UNLICENSED) falls out
// within that window and a buyer can still go two months in the backcountry
// without one.
export const play = new Hono<{ Bindings: Env }>()

const SESSION_DAYS = 90
const MAX_NONCES_PER_HOUR = 20
const MAX_UNLOCKS_PER_HOUR = 20
const TOKEN_MAX = 8000

async function hashIp(prefix: string, ip: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${prefix}:${ip}`))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

play.get('/nonce', async (c) => {
  if (!playConfigured(c.env)) return c.json({ error: 'The app unlock is not set up yet' }, 503)
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  if ((await recordPlayNonceAttempt(c.env, await hashIp('playnonce', ip))) > MAX_NONCES_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }
  return c.json({ nonce: await issueNonce(c.env), ttl: NONCE_TTL_SECONDS }, 200, { 'Cache-Control': 'no-store' })
})

play.post('/unlock', async (c) => {
  if (!playConfigured(c.env)) return c.json({ error: 'The app unlock is not set up yet' }, 503)
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  if ((await recordPlayUnlockAttempt(c.env, await hashIp('playunlock', ip))) > MAX_UNLOCKS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const body = (await c.req.json().catch(() => ({}))) as { token?: unknown; installId?: unknown }
  const token = typeof body.token === 'string' ? body.token.trim() : ''
  const account = typeof body.installId === 'string' ? playAppAccountId(body.installId) : null
  if (!token || token.length > TOKEN_MAX || !account) {
    return c.json({ error: 'Invalid unlock request' }, 400)
  }

  let payload
  try {
    payload = await decodeIntegrityToken(c.env, token)
  } catch (err) {
    console.error('play: decodeIntegrityToken failed', err)
    return c.json({ error: 'Google Play could not be reached. Try again in a minute.', code: 'unavailable' }, 503)
  }
  const pkg = c.env.PLAY_PACKAGE_NAME
  const details = payload?.requestDetails
  if (!payload || !details || details.requestPackageName !== pkg || !details.nonce) {
    return c.json({ error: 'Invalid unlock request' }, 400)
  }
  // The nonce must be one this Worker issued, unspent, and the token fresh.
  const age = Date.now() - Number(details.timestampMillis ?? 0)
  if (!(await spendNonce(c.env, details.nonce)) || !(age >= -60_000 && age <= NONCE_TTL_SECONDS * 1000)) {
    return c.json({ error: 'This unlock has expired. Open the app again.', code: 'stale' }, 400)
  }

  // The app must be our build, as Play distributed it...
  const app = payload.appIntegrity
  if (app?.appRecognitionVerdict !== 'PLAY_RECOGNIZED' || app.packageName !== pkg) {
    return c.json(
      { error: 'This copy of the app was not installed from Google Play.', code: 'not_licensed' },
      402,
    )
  }
  // ...and the Google account on the phone must own it.
  const licensing = payload.accountDetails?.appLicensingVerdict
  if (licensing === 'UNEVALUATED') {
    return c.json(
      { error: 'Google Play could not check the purchase just now. Try again in a minute.', code: 'unevaluated' },
      503,
    )
  }
  if (licensing !== 'LICENSED') {
    return c.json(
      { error: 'The Google account on this phone has not bought the app.', code: 'not_licensed' },
      402,
    )
  }

  // Provision on the first unlock, refresh the session on every one after.
  const nowSeconds = Math.floor(Date.now() / 1000)
  const existing = await getBuyer(c.env, account)
  const record: BuyerRecord = existing
    ? { ...existing, expiresAt: nowSeconds + SESSION_DAYS * 86400, refundedAt: undefined }
    : {
        email: account,
        purchasedAt: nowSeconds,
        expiresAt: nowSeconds + SESSION_DAYS * 86400,
        accessToken: await deriveAccessToken(c.env.MAGIC_LINK_SIGNING_SECRET, account),
        accessCode: await deriveAccessCode(c.env.MAGIC_LINK_SIGNING_SECRET, account),
        provisionedSessionId: 'playapp',
      }
  // No inventory tally: a reinstall or a second phone is a new install id,
  // not a new sale. Play's own reports count these sales.
  await putBuyer(c.env, record)

  const jwt = await signAccessJwt(account, c.env.MAGIC_LINK_SIGNING_SECRET, record.expiresAt)
  return c.json({ jwt, expiresAt: record.expiresAt })
})
