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
  const rawBody = await c.req.text()
  const sig = c.req.header('stripe-signature') ?? null
  const ok = await verifyStripeSignature({
    rawBody,
    signatureHeader: sig,
    secret: c.env.STRIPE_WEBHOOK_SECRET,
  })
  if (!ok) return c.json({ error: 'Invalid signature' }, 400)

  const event = JSON.parse(rawBody) as GenericStripeEvent

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

  // Email is the only step that talks to a third party and can fail
  // transiently. Don't mark the event deduped if it throws — let Stripe retry.
  const magicLink = `${c.env.APP_BASE_URL}/open?token=${accessToken}`
  try {
    await sendMagicLink(c.env, { to: email, magicLink, code: accessCode })
  } catch (err) {
    console.error('sendMagicLink failed', { eventId: event.id, email, err })
    return c.json({ error: 'Email delivery failed' }, 500)
  }

  await c.env.GUIDE_BUYERS.put(dedupeKey, '1', {
    expirationTtl: STRIPE_EVENT_DEDUPE_TTL_SECONDS,
  })

  return c.json({ received: true })
})
