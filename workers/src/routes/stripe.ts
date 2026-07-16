import { Hono } from 'hono'
import type { Env } from '../env'
import {
  currentMonthLabel,
  getBuyer,
  incrementInventory,
  putBuyer,
  type BuyerRecord,
} from '../lib/kv'
import { sendGiftAccess, sendGiftReceipt, sendMagicLink } from '../lib/email'
import { verifyStripeSignature } from '../lib/stripe'
import { generateAccessCode, generateAccessToken } from '../lib/tokens'

const EIGHTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 548 // 18 calendar months is ~547.9 days; 30-day months undersold it by a week

type CheckoutSessionCompletedEvent = {
  id: string
  type: 'checkout.session.completed'
  data: {
    object: {
      id: string
      customer_email?: string | null
      customer_details?: { email?: string | null } | null
      metadata?: Record<string, string> | null
      created: number
    }
  }
}

type ChargeRefundedEvent = {
  id: string
  type: 'charge.refunded'
  data: {
    object: {
      id: string
      billing_details?: { email?: string | null } | null
      receipt_email?: string | null
      metadata?: Record<string, string> | null
    }
  }
}

type GenericStripeEvent = {
  id: string
  type: string
}

// Stripe retries failed webhooks for up to ~3 days; 30 days is comfortably
// longer and bounds KV growth.
const STRIPE_EVENT_DEDUPE_TTL_SECONDS = 60 * 60 * 24 * 30
const STRIPE_EVENT_DEDUPE_KEY = (eventId: string) => `stripe_event:${eventId}`

export const stripe = new Hono<{ Bindings: Env }>()

stripe.post('/webhook', async (c) => {
  if (!c.env.STRIPE_WEBHOOK_SECRET) {
    console.error('stripe webhook: STRIPE_WEBHOOK_SECRET not configured')
    return c.json({ error: 'Webhook not configured' }, 500)
  }

  const rawBody = await c.req.text()
  const sig = c.req.header('stripe-signature') ?? null
  const ok = await verifyStripeSignature({
    rawBody,
    signatureHeader: sig,
    secret: c.env.STRIPE_WEBHOOK_SECRET,
  })
  if (!ok) return c.json({ error: 'Invalid signature' }, 400)

  let event: GenericStripeEvent
  try {
    event = JSON.parse(rawBody) as GenericStripeEvent
  } catch (err) {
    console.error('stripe webhook: malformed JSON body', err)
    return c.json({ error: 'Malformed event body' }, 400)
  }

  // Idempotency: if we have already processed this event id, short-circuit.
  // This must happen *after* signature verification so unauthenticated callers
  // can't probe or poison the dedupe set.
  const dedupeKey = STRIPE_EVENT_DEDUPE_KEY(event.id)
  const alreadyProcessed = await c.env.GUIDE_BUYERS.get(dedupeKey)
  if (alreadyProcessed) {
    return c.json({ received: true, deduped: true })
  }

  // Refunds revoke access. charge.refunded fires for full AND partial
  // refunds; at $19 one-time the operator only ever issues full refunds, so
  // any refund revokes. NOTE: the Stripe dashboard webhook endpoint must be
  // configured to send charge.refunded or this branch never runs.
  if (event.type === 'charge.refunded') {
    const charge = (event as ChargeRefundedEvent).data.object

    // Mirror of the provisioning guard below: anything else sold through this
    // Stripe account (a print, a donation, a payment link) also fires
    // charge.refunded. Guide charges carry the tag because
    // createCheckoutSession sets payment_intent_data metadata, which Stripe
    // copies onto the charge. Without this check, refunding an unrelated
    // purchase would revoke guide access whenever the billing email happens
    // to match a buyer record.
    const product = charge.metadata?.product
    if (product !== c.env.GUIDE_PRODUCT_TAG) {
      if (!product) {
        // A guide refund should always carry the tag; a bare charge is most
        // likely another product, but flag it so the operator can verify and
        // revoke manually if the copy-from-PaymentIntent assumption breaks.
        console.error('charge.refunded without product metadata — verify manually', {
          chargeId: charge.id,
        })
      }
      return c.json({ received: true, ignored: 'refund for other product' })
    }

    // Gift charges carry the recipient in metadata (copied from
    // payment_intent_data): the refund must revoke the person who holds the
    // access, not the payer whose card was charged.
    const email =
      charge.metadata?.recipientEmail?.trim().toLowerCase() ??
      charge.billing_details?.email?.trim().toLowerCase() ??
      charge.receipt_email?.trim().toLowerCase() ??
      null

    if (!email) {
      console.error('charge.refunded missing email — revoke manually', { chargeId: charge.id })
      return c.json({ received: true, ignored: 'refund without email' })
    }

    const buyer = await getBuyer(c.env, email)
    if (!buyer) {
      // Billing email can differ from the checkout email; flag for manual
      // follow-up rather than failing (Stripe would retry forever).
      console.error('charge.refunded: no buyer record — revoke manually', {
        chargeId: charge.id,
        email,
      })
      return c.json({ received: true, ignored: 'refund for unknown buyer' })
    }

    const now = Math.floor(Date.now() / 1000)
    // Expiring the record is the revocation: /login, /exchange, and /me all
    // key off expiresAt. The PWA revalidates via /me when online and signs
    // the buyer out.
    await putBuyer(c.env, { ...buyer, expiresAt: now, refundedAt: now })

    await c.env.GUIDE_BUYERS.put(dedupeKey, '1', {
      expirationTtl: STRIPE_EVENT_DEDUPE_TTL_SECONDS,
    })
    return c.json({ received: true, revoked: email })
  }

  if (event.type !== 'checkout.session.completed') {
    return c.json({ received: true, ignored: event.type })
  }

  const completed = event as CheckoutSessionCompletedEvent
  const session = completed.data.object

  // Only provision the field guide for OUR product. Any other item sold
  // through the same Stripe account (a payment link, a donation, a print)
  // also fires checkout.session.completed; without this guard those buyers
  // would be handed 18-month guide access and decrement inventory.
  if (session.metadata?.product !== c.env.GUIDE_PRODUCT_TAG) {
    return c.json({ received: true, ignored: 'wrong product' })
  }

  const payerEmail =
    session.customer_details?.email?.trim().toLowerCase() ??
    session.customer_email?.trim().toLowerCase() ??
    null

  // Sessions carry metadata.kind since the gift feature landed; older
  // in-flight sessions have no kind and are plain purchases.
  const kind = session.metadata?.kind === 'gift' ? 'gift' : 'purchase'

  // For a purchase the payer is the buyer. For a gift the buyer record
  // belongs to the recipient named at checkout; a gift session that somehow
  // lost its recipient falls back to provisioning the payer, so paid access
  // is never stranded (flagged for manual follow-up).
  let email = payerEmail
  if (kind === 'gift') {
    const recipient = session.metadata?.recipientEmail?.trim().toLowerCase() || null
    if (recipient) {
      email = recipient
    } else {
      console.error('gift session missing recipientEmail — provisioning payer, verify manually', {
        sessionId: session.id,
      })
    }
  }

  if (!email) {
    console.error('checkout.session.completed missing email', session.id)
    return c.json({ error: 'Missing customer email' }, 400)
  }

  const purchasedAt = session.created
  const nowSeconds = Math.floor(Date.now() / 1000)

  // Gifting someone who already owns the guide must never clobber their
  // record: extend the paid window and keep their token and code, so signed-in
  // devices and old access emails stay valid. Expired or refunded records get
  // a fresh provision like any new buyer.
  const existing = kind === 'gift' ? await getBuyer(c.env, email) : null
  const existingActive =
    existing != null && existing.refundedAt == null && existing.expiresAt > nowSeconds

  const record: BuyerRecord = existingActive
    ? {
        ...existing,
        expiresAt: Math.max(nowSeconds, existing.expiresAt) + EIGHTEEN_MONTHS_SECONDS,
      }
    : {
        email,
        purchasedAt,
        expiresAt: purchasedAt + EIGHTEEN_MONTHS_SECONDS,
        accessToken: generateAccessToken(),
        accessCode: generateAccessCode(),
      }

  await putBuyer(c.env, record)
  await incrementInventory(c.env, currentMonthLabel(new Date(purchasedAt * 1000)))

  const magicLink = `${c.env.APP_BASE_URL}/open?token=${record.accessToken}`
  try {
    if (kind === 'gift') {
      await sendGiftAccess(c.env, {
        to: email,
        payerEmail,
        magicLink,
        code: record.accessCode,
        note: session.metadata?.giftNote,
      })
    } else {
      await sendMagicLink(c.env, { to: email, magicLink, code: record.accessCode })
    }
  } catch (err) {
    console.error('access email failed', { eventId: event.id, email, kind, err })
    // Do NOT claim the dedupe slot here: returning 500 makes Stripe retry,
    // and the retry must be allowed to re-attempt delivery rather than being
    // short-circuited. putBuyer is idempotent on email, so re-provisioning is
    // harmless; re-sending the code beats silently dropping it. (Inventory may
    // be over-counted by a retry — acceptable at this volume, same trade-off
    // noted in kv.ts incrementInventory.)
    return c.json({ error: 'Email delivery failed' }, 500)
  }

  // The payer's receipt is best-effort: access is already delivered, so a
  // failed receipt is logged rather than making Stripe re-run the whole event
  // (which would re-send the recipient's access email).
  if (kind === 'gift' && payerEmail && payerEmail !== email) {
    try {
      await sendGiftReceipt(c.env, { to: payerEmail, recipientEmail: email })
    } catch (err) {
      console.error('sendGiftReceipt failed', { eventId: event.id, payerEmail, err })
    }
  }

  // Claim the dedupe slot only after the email is confirmed sent, so a failed
  // delivery is retried by Stripe instead of being treated as already done.
  await c.env.GUIDE_BUYERS.put(dedupeKey, '1', {
    expirationTtl: STRIPE_EVENT_DEDUPE_TTL_SECONDS,
  })

  return c.json({ received: true })
})
