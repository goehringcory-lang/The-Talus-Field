import { Hono } from 'hono'
import type { Env } from '../env'
import type { BuyerRecord } from '../lib/kv'
import {
  currentMonthLabel,
  getBuyer,
  incrementInventory,
  putBuyer,
  recordPlayVerifyAttempt,
} from '../lib/kv'
import { EIGHTEEN_MONTHS_SECONDS } from '../lib/provision'
import { deriveAccessCode, deriveAccessToken } from '../lib/tokens'
import { signAccessJwt, verifyAccessJwt } from '../lib/jwt'
import { sendRenewalConfirmation } from '../lib/email'
import {
  acknowledgeProductPurchase,
  consumeProductPurchase,
  getPlayPurchase,
  getProductPurchase,
  hashPurchaseToken,
  isEmailAccount,
  playAccountId,
  playConfigured,
  playEventId,
  putPlayPurchase,
  type PlayPurchaseRecord,
} from '../lib/play'

// POST /api/play/verify — the Android app's purchases and restores. The Play
// Store build (FieldGuideAndroid, a Trusted Web Activity over the PWA) sells
// through Play Billing with no email: the Google Play purchase is the account.
//
// Body: { productId, purchaseToken, previousToken? }. Three cases:
//   - A guide purchase this Worker has seen: a restore (reinstall, new phone,
//     a cleared browser). Signs its account in, or 410 `expired` once its 18
//     months are up, which the app answers by offering the renewal.
//   - A new guide purchase: verified with Google, provisioned, acknowledged
//     (never consumed, so Play keeps handing the token back), signed in. The
//     account is the signed-in caller's if there is one (a web buyer adding
//     the app), otherwise a new one named for the order.
//   - A renewal: verified, consumed, and added to the account named by the
//     caller's session or, for a lapsed buyer with no session, by
//     previousToken, the guide token the app reads back from Play.
// This is the flow's claim and webhook in one, since Play sends nothing to a
// Worker without Pub/Sub.
export const play = new Hono<{ Bindings: Env }>()

// Play purchase tokens are opaque; this only bounds them for KV and logs.
const TOKEN_RE = /^[A-Za-z0-9._:-]{20,1000}$/
const MAX_VERIFY_ATTEMPTS_PER_HOUR = 30

async function hashIp(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`play:${ip}`))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

play.post('/verify', async (c) => {
  if (!playConfigured(c.env)) {
    return c.json({ error: 'Play purchases are not set up yet' }, 503)
  }
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  if ((await recordPlayVerifyAttempt(c.env, await hashIp(ip))) > MAX_VERIFY_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const body = (await c.req.json().catch(() => ({}))) as {
    productId?: unknown
    purchaseToken?: unknown
    previousToken?: unknown
  }
  const productId = typeof body.productId === 'string' ? body.productId : ''
  const purchaseToken = typeof body.purchaseToken === 'string' ? body.purchaseToken : ''
  const previousToken = typeof body.previousToken === 'string' ? body.previousToken : ''
  const isRenewal = productId === c.env.PLAY_RENEWAL_PRODUCT_ID
  if (productId !== c.env.PLAY_PRODUCT_ID && !isRenewal) {
    return c.json({ error: 'Unknown product' }, 400)
  }
  if (!TOKEN_RE.test(purchaseToken) || (previousToken && !TOKEN_RE.test(previousToken))) {
    return c.json({ error: 'Invalid purchase' }, 400)
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  const tokenHash = await hashPurchaseToken(purchaseToken)
  const seen = await getPlayPurchase(c.env, tokenHash)
  if (seen) {
    // A restore, or a retry after a dropped connection: answer for the
    // account the token already belongs to, and finish a settle that failed.
    if (!seen.settled) await settle(c.env, tokenHash, seen, purchaseToken)
    const record = await getBuyer(c.env, seen.account)
    if (!record || record.refundedAt != null) {
      return c.json({ error: 'This purchase was refunded.', code: 'refunded' }, 409)
    }
    if (record.expiresAt <= nowSeconds) {
      return c.json(
        { error: 'Your 18 months with the guide have ended.', code: 'expired', expiresAt: record.expiresAt },
        410,
      )
    }
    const jwt = await signAccessJwt(seen.account, c.env.MAGIC_LINK_SIGNING_SECRET, record.expiresAt)
    return c.json({ jwt, expiresAt: record.expiresAt, restored: true })
  }

  let purchase
  try {
    purchase = await getProductPurchase(c.env, productId, purchaseToken)
  } catch (err) {
    console.error('play: purchases.products.get failed', err)
    return c.json({ error: 'Could not verify the purchase. Try again in a minute.' }, 503)
  }
  if (!purchase || !purchase.orderId) {
    return c.json({ error: 'Invalid purchase' }, 404)
  }
  if (purchase.purchaseState === 2) {
    return c.json(
      { error: 'Payment is still processing. Your guide opens when Google Play confirms it.', code: 'pending' },
      409,
    )
  }
  if (purchase.purchaseState !== 0) {
    return c.json({ error: 'Payment has not completed' }, 402)
  }
  if (purchase.consumptionState === 1) {
    // Consumed but unknown to this Worker: spent somewhere else (another
    // environment sharing the package), never provisioned here.
    console.error('play: token already consumed but not recorded', { orderId: purchase.orderId })
    return c.json({ error: 'Invalid purchase' }, 404)
  }

  // Whose account. A live session wins; then the guide token a lapsed buyer's
  // app read back from Play; then, for a guide purchase, a new account.
  const header = c.req.header('authorization') ?? ''
  const bearer = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
  const claims = bearer ? await verifyAccessJwt(bearer, c.env.MAGIC_LINK_SIGNING_SECRET) : null
  let account = claims ? claims.sub.toLowerCase() : ''
  if (!account && previousToken) {
    const previous = await getPlayPurchase(c.env, await hashPurchaseToken(previousToken))
    if (previous) account = previous.account
  }
  if (!account) {
    if (isRenewal) {
      // A renewal with nothing to renew: provision rather than strand a
      // paying reader, but it cannot be restored without a guide token.
      console.error('play renewal with no account to extend, provisioned fresh', { orderId: purchase.orderId })
    }
    account = playAccountId(purchase.orderId)
  }

  const eventId = playEventId(purchase.orderId)
  const purchasedAt = Math.floor(Number(purchase.purchaseTimeMillis ?? Date.now()) / 1000)
  const existing = await getBuyer(c.env, account)
  const existingActive =
    existing != null && existing.refundedAt == null && existing.expiresAt > nowSeconds

  // The Stripe webhook's extension rules, unchanged: a renewal always extends
  // (from now after a lapse), and so does a guide purchase on an active
  // account, so its remaining months survive. Anything else is a fresh record
  // whose credentials derive from the order id.
  let record: BuyerRecord
  let extended = false
  if (existing && (isRenewal || existingActive)) {
    const { refundedAt: _cleared, promoCode: _promo, ...kept } = existing
    const alreadyExtended = existing.lastExtensionEventId === eventId
    record = {
      ...kept,
      expiresAt: alreadyExtended
        ? existing.expiresAt
        : Math.max(nowSeconds, existing.expiresAt) + EIGHTEEN_MONTHS_SECONDS,
      lastExtensionEventId: eventId,
    }
    extended = true
  } else {
    record = {
      email: account,
      purchasedAt,
      expiresAt: purchasedAt + EIGHTEEN_MONTHS_SECONDS,
      accessToken: await deriveAccessToken(c.env.MAGIC_LINK_SIGNING_SECRET, eventId),
      accessCode: await deriveAccessCode(c.env.MAGIC_LINK_SIGNING_SECRET, eventId),
      provisionedSessionId: eventId,
    }
  }

  await putBuyer(c.env, record)
  const seenRecord: PlayPurchaseRecord = { account, orderId: purchase.orderId, productId, settled: false }
  await putPlayPurchase(c.env, tokenHash, seenRecord)
  if (!isRenewal) {
    await incrementInventory(c.env, currentMonthLabel(new Date(purchasedAt * 1000)))
  }
  await settle(c.env, tokenHash, seenRecord, purchaseToken)

  // Only a web buyer who renewed or added the app while signed in has an
  // address; a Play account is never emailed (Google sends the receipt).
  if (extended && isEmailAccount(account)) {
    try {
      await sendRenewalConfirmation(c.env, { to: account, expiresAt: record.expiresAt, receiptFrom: 'Google Play' })
    } catch (err) {
      console.error('play: renewal email failed', { orderId: purchase.orderId, err })
    }
  }

  const jwt = await signAccessJwt(account, c.env.MAGIC_LINK_SIGNING_SECRET, record.expiresAt)
  return c.json({ jwt, expiresAt: record.expiresAt, extended })
})

// Tell Play the purchase is delivered: the guide is acknowledged (it stays
// owned, and is the account's key), the renewal consumed. Access is granted
// either way; a failure is retried by the next verify of the same token,
// which the app sends at every launch while Play still lists it, and Play
// refunds a purchase left unsettled for three days, which the voided sweep
// then revokes.
async function settle(
  env: Env,
  tokenHash: string,
  record: PlayPurchaseRecord,
  purchaseToken: string,
): Promise<void> {
  try {
    if (record.productId === env.PLAY_RENEWAL_PRODUCT_ID) {
      await consumeProductPurchase(env, record.productId, purchaseToken)
    } else {
      await acknowledgeProductPurchase(env, record.productId, purchaseToken)
    }
    await putPlayPurchase(env, tokenHash, { ...record, settled: true })
  } catch (err) {
    console.error('play: settle failed', { orderId: record.orderId, err })
  }
}
