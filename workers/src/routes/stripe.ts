import { Hono } from 'hono'
import type { Env } from '../env'
import {
  currentMonthLabel,
  incrementInventory,
  putBuyer,
  type BuyerRecord,
} from '../lib/kv'
import { sendMagicLink } from '../lib/email'
import { verifyStripeSignature } from '../lib/stripe'
import { generateAccessCode, generateAccessToken } from '../lib/tokens'

const EIGHTEEN_MONTHS_SECONDS = 60 * 60 * 24 * 30 * 18

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

  if (event.type !== 'checkout.session.completed') {
    return c.json({ received: true, ignored: event.type })
  }

  const completed = event as CheckoutSessionCompletedEvent
  const session = completed.data.object
  const email =
    session.customer_details?.email?.trim().toLowerCase() ??
    session.customer_email?.trim().toLowerCase() ??
    null

  if (!email) {
    console.error('checkout.session.completed missing email', session.id)
    return c.json({ error: 'Missing customer email' }, 400)
  }

  const purchasedAt = session.created
  const expiresAt = purchasedAt + EIGHTEEN_MONTHS_SECONDS
  const accessToken = generateAccessToken()
  const accessCode = generateAccessCode()

  const record: BuyerRecord = {
    email,
    purchasedAt,
    expiresAt,
    accessToken,
    accessCode,
  }

  await putBuyer(c.env, record)
  await incrementInventory(c.env, currentMonthLabel(new Date(purchasedAt * 1000)))

  const magicLink = `${c.env.APP_BASE_URL}/open?token=${accessToken}`
  try {
    await sendMagicLink(c.env, { to: email, magicLink, code: accessCode })
  } catch (err) {
    console.error('sendMagicLink failed', { eventId: event.id, email, err })
    // Do NOT claim the dedupe slot here: returning 500 makes Stripe retry,
    // and the retry must be allowed to re-attempt delivery rather than being
    // short-circuited. putBuyer is idempotent on email, so re-provisioning is
    // harmless; re-sending the code beats silently dropping it. (Inventory may
    // be over-counted by a retry — acceptable at this volume, same trade-off
    // noted in kv.ts incrementInventory.)
    return c.json({ error: 'Email delivery failed' }, 500)
  }

  // Claim the dedupe slot only after the email is confirmed sent, so a failed
  // delivery is retried by Stripe instead of being treated as already done.
  await c.env.GUIDE_BUYERS.put(dedupeKey, '1', {
    expirationTtl: STRIPE_EVENT_DEDUPE_TTL_SECONDS,
  })

  return c.json({ received: true })
})
