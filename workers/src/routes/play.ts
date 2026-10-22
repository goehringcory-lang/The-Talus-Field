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
import { sendMagicLink, sendRenewalConfirmation } from '../lib/email'
import {
  consumeProductPurchase,
  getPlayPurchase,
  getProductPurchase,
  hashPurchaseToken,
  playConfigured,
  playEventId,
  putPlayPurchase,
} from '../lib/play'

// POST /api/play/verify — the Android app's purchase, after Play's payment
// sheet closes. The PWA (running in the Trusted Web Activity) holds a purchase
// token from the Digital Goods API; this route verifies it with Google,
// provisions or extends the buyer record exactly as the Stripe webhook would,
// consumes the purchase so it can be bought again in 18 months, and signs the
// buyer in. It is this flow's claim and webhook in one, because Play sends
// nothing to a Worker without Pub/Sub.
//
// Body: { productId, purchaseToken, email? }. The email is the account the
// purchase is for, collected by the app before the payment sheet opens (Play
// does not share the payer's address). A signed-in caller's JWT names the
// account instead, which is the renewal path from the Account page.
export const play = new Hono<{ Bindings: Env }>()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX = 254
// Play purchase tokens are opaque; this only bounds them for KV and logs.
const TOKEN_RE = /^[A-Za-z0-9._:-]{20,1000}$/
const MAX_VERIFY_ATTEMPTS_PER_HOUR = 20

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
    email?: unknown
  }
  const productId = typeof body.productId === 'string' ? body.productId : ''
  const purchaseToken = typeof body.purchaseToken === 'string' ? body.purchaseToken : ''
  const isRenewal = productId === c.env.PLAY_RENEWAL_PRODUCT_ID
  if (productId !== c.env.PLAY_PRODUCT_ID && !isRenewal) {
    return c.json({ error: 'Unknown product' }, 400)
  }
  if (!TOKEN_RE.test(purchaseToken)) {
    return c.json({ error: 'Invalid purchase' }, 400)
  }

  // Whose account: a live session wins over the typed address, so a renewal
  // from the Account page cannot land on a mistyped email.
  const header = c.req.header('authorization') ?? ''
  const bearer = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
  const claims = bearer ? await verifyAccessJwt(bearer, c.env.MAGIC_LINK_SIGNING_SECRET) : null
  const typed = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const email = claims && EMAIL_RE.test(claims.sub) ? claims.sub.toLowerCase() : typed
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'An email address is required' }, 400)
  }

  const tokenHash = await hashPurchaseToken(purchaseToken)
  const seen = await getPlayPurchase(c.env, tokenHash)
  if (seen) {
    // A retry of a purchase this route already recorded: answer it again,
    // and finish the consume if the first attempt could not.
    if (seen.email !== email) {
      return c.json({ error: 'This purchase belongs to another account' }, 409)
    }
    if (!seen.consumed) {
      try {
        await consumeProductPurchase(c.env, seen.productId, purchaseToken)
        await putPlayPurchase(c.env, tokenHash, { ...seen, consumed: true })
      } catch (err) {
        console.error('play: consume retry failed', { orderId: seen.orderId, err })
      }
    }
    const record = await getBuyer(c.env, email)
    if (!record || record.refundedAt != null) {
      return c.json({ error: 'This purchase was refunded.', code: 'refunded' }, 409)
    }
    const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET, record.expiresAt)
    return c.json({ jwt, expiresAt: record.expiresAt })
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

  const eventId = playEventId(purchase.orderId)
  const purchasedAt = Math.floor(Number(purchase.purchaseTimeMillis ?? Date.now()) / 1000)
  const nowSeconds = Math.floor(Date.now() / 1000)
  const existing = await getBuyer(c.env, email)
  const existingActive =
    existing != null && existing.refundedAt == null && existing.expiresAt > nowSeconds

  // The Stripe webhook's extension rules, unchanged: a renewal always extends
  // (from now after a lapse), and so does a full-price purchase by an active
  // buyer, so their remaining months and their emailed code survive. Anyone
  // else gets a fresh record whose credentials derive from the order id.
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
    if (isRenewal) {
      console.error('play renewal for unknown buyer, provisioned fresh, verify manually', { email })
    }
    record = {
      email,
      purchasedAt,
      expiresAt: purchasedAt + EIGHTEEN_MONTHS_SECONDS,
      accessToken: await deriveAccessToken(c.env.MAGIC_LINK_SIGNING_SECRET, eventId),
      accessCode: await deriveAccessCode(c.env.MAGIC_LINK_SIGNING_SECRET, eventId),
      provisionedSessionId: eventId,
    }
  }

  await putBuyer(c.env, record)
  await putPlayPurchase(c.env, tokenHash, {
    email,
    orderId: purchase.orderId,
    productId,
    consumed: false,
  })
  if (!isRenewal) {
    await incrementInventory(c.env, currentMonthLabel(new Date(purchasedAt * 1000)))
  }

  try {
    await consumeProductPurchase(c.env, productId, purchaseToken)
    await putPlayPurchase(c.env, tokenHash, {
      email,
      orderId: purchase.orderId,
      productId,
      consumed: true,
    })
  } catch (err) {
    // Access is granted either way; the next retry or the app's own
    // pending-purchase check on launch finishes the consume. Unconsumed for
    // three days, Play refunds it, and the voided sweep revokes it.
    console.error('play: consume failed', { orderId: purchase.orderId, err })
  }

  // The email is how the buyer reaches the guide on a second device; the
  // purchase itself is already delivered by the JWT below, so a failed send
  // is logged rather than failing the response.
  try {
    if (extended) {
      await sendRenewalConfirmation(c.env, {
        to: email,
        expiresAt: record.expiresAt,
        receiptFrom: 'Google Play',
      })
    } else {
      await sendMagicLink(c.env, {
        to: email,
        magicLink: `${c.env.APP_BASE_URL}/open?token=${record.accessToken}`,
        code: record.accessCode,
      })
    }
  } catch (err) {
    console.error('play: access email failed', { orderId: purchase.orderId, email, err })
  }

  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET, record.expiresAt)
  return c.json({ jwt, expiresAt: record.expiresAt, extended })
})
