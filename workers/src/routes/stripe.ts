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

export const stripe = new Hono<{ Bindings: Env }>()

stripe.post('/webhook', async (c) => {
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return c.json(
      { error: 'Stripe webhook is not enabled in this environment.' },
      503,
    )
  }

  const rawBody = await c.req.text()
  const sig = c.req.header('stripe-signature') ?? null
  const ok = await verifyStripeSignature({
    rawBody,
    signatureHeader: sig,
    secret: webhookSecret,
  })
  if (!ok) return c.json({ error: 'Invalid signature' }, 400)

  let event: GenericStripeEvent
  try {
    event = JSON.parse(rawBody) as GenericStripeEvent
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
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

  // Email send is best-effort. The buyer record + access code are already in
  // KV, so the buyer can still log in via /api/auth/login with the code we
  // ship out-of-band if email fails. Returning 200 either way prevents Stripe
  // from retrying the whole webhook, which would re-issue tokens and orphan
  // the previous KV state.
  if (c.env.RESEND_API_KEY) {
    const magicLink = `${c.env.APP_BASE_URL}/open?token=${accessToken}`
    try {
      await sendMagicLink(c.env, { to: email, magicLink, code: accessCode })
    } catch (err) {
      console.error('sendMagicLink failed for', email, err)
    }
  } else {
    console.warn('RESEND_API_KEY not set; skipping magic-link email for', email)
  }

  return c.json({ received: true })
})
