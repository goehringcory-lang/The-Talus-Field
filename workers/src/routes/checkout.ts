import { Hono } from 'hono'
import type { Env } from '../env'
import {
  currentMonthLabel,
  firstOfNextMonthIso,
  getBuyer,
  getEmailByAccessToken,
  getInventoryCount,
  recordRenewLinkAttempt,
} from '../lib/kv'
import { createCheckoutSession } from '../lib/stripe'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'

export const checkout = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

// Same permissive shape as routes/trip-email.ts: real validation is Stripe's
// job at checkout; this only rejects obvious garbage before a session exists.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX = 254
// Stripe metadata values cap at 500 chars; the note also renders in the gift
// email, so keep it a short personal line, not a letter.
const GIFT_NOTE_MAX = 280

checkout.post('/start', async (c) => {
  const monthLabel = currentMonthLabel()
  const sold = await getInventoryCount(c.env, monthLabel)
  const cap = Number.parseInt(c.env.GUIDE_MONTHLY_CAP, 10)

  // A missing or non-numeric cap yields NaN, and `sold >= NaN` is always
  // false — which would silently bypass the inventory cap and oversell.
  // Fail closed instead.
  if (Number.isNaN(cap)) {
    console.error('checkout/start: GUIDE_MONTHLY_CAP is missing or non-numeric', c.env.GUIDE_MONTHLY_CAP)
    return c.json({ error: 'Inventory cap misconfigured' }, 500)
  }

  if (sold >= cap) {
    return c.json(
      {
        soldOut: true,
        cap,
        monthLabel,
        reopens: firstOfNextMonthIso(),
      },
      409,
    )
  }

  // The body is optional: the original buy button POSTs with no body at all,
  // and that must keep working. A gift purchase sends
  // { gift: true, recipientEmail, giftNote? }.
  const body = (await c.req.json().catch(() => ({}))) as {
    gift?: unknown
    recipientEmail?: unknown
    giftNote?: unknown
  }

  const isGift = body.gift === true
  let giftMetadata: Record<string, string> | undefined
  if (isGift) {
    const recipient =
      typeof body.recipientEmail === 'string' ? body.recipientEmail.trim().toLowerCase() : ''
    if (!recipient || recipient.length > EMAIL_MAX || !EMAIL_RE.test(recipient)) {
      return c.json({ error: 'A valid recipient email is required for a gift' }, 400)
    }
    // Collapse all whitespace (including CR/LF) to single spaces: the note is
    // spliced verbatim into the plain-text part of the gift email, and raw
    // newlines would let a paying attacker forge whole paragraphs of a
    // DKIM-signed email to an address they choose.
    const note =
      typeof body.giftNote === 'string' ? body.giftNote.replace(/\s+/g, ' ').trim() : ''
    if (note.length > GIFT_NOTE_MAX) {
      return c.json({ error: `Gift note must be ${GIFT_NOTE_MAX} characters or fewer` }, 400)
    }
    giftMetadata = { kind: 'gift', recipientEmail: recipient }
    if (note) giftMetadata.giftNote = note
  }

  let session
  try {
    session = await createCheckoutSession(c.env, {
      successUrl: `${c.env.EDITORIAL_BASE_URL}/guide?guide=${isGift ? 'gift-success' : 'success'}`,
      cancelUrl: `${c.env.EDITORIAL_BASE_URL}/guide?guide=cancel`,
      metadata: giftMetadata ?? { kind: 'purchase' },
    })
  } catch (err) {
    console.error('createCheckoutSession failed', err)
    return c.json({ error: 'Checkout temporarily unavailable' }, 503)
  }

  return c.json({ url: session.url })
})

// --- Renewals ---------------------------------------------------------------
// Renewals bypass the monthly cap and never touch inventory: the cap models
// new-copy supply, and a renewal is an existing buyer keeping access. The
// webhook (kind=renewal) extends expiresAt from max(now, current expiry) and
// keeps the buyer's token and code, so signed-in devices survive.

function renewalPriceCents(env: Env): string {
  // Fall back to full price if the renewal var is missing or garbled, rather
  // than failing a paying customer's checkout.
  const parsed = Number.parseInt(env.GUIDE_RENEWAL_PRICE_CENTS, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    console.error('renew: GUIDE_RENEWAL_PRICE_CENTS missing or non-numeric; using full price')
    return env.GUIDE_PRICE_CENTS
  }
  return env.GUIDE_RENEWAL_PRICE_CENTS
}

function startRenewalSession(
  env: Env,
  email: string,
  urls: { successUrl: string; cancelUrl: string },
) {
  return createCheckoutSession(env, {
    ...urls,
    priceCents: renewalPriceCents(env),
    productName: 'The Field Guide — Renewal (18 more months)',
    customerEmail: email,
    metadata: { kind: 'renewal', renewEmail: email },
  })
}

// In-app path: the PWA Account page's renew button. JWT-gated; the buyer is
// whoever the JWT names. Operators (dev/admin) have no buyer record -> 404.
checkout.post('/renew', requireAuth, async (c) => {
  const sub = c.get('authSub')
  const buyer = await getBuyer(c.env, sub)
  if (!buyer) {
    return c.json({ error: 'No purchase found for this account' }, 404)
  }

  try {
    const session = await startRenewalSession(c.env, buyer.email, {
      successUrl: `${c.env.APP_BASE_URL}/account?renew=success`,
      cancelUrl: `${c.env.APP_BASE_URL}/account?renew=cancel`,
    })
    return c.json({ url: session.url })
  } catch (err) {
    console.error('renewal createCheckoutSession failed', err)
    return c.json({ error: 'Checkout temporarily unavailable' }, 503)
  }
})

// Email path: the renewal notices link here. A lapsed buyer's JWT is dead
// (exp clamps to expiresAt), so this route authenticates by access token —
// the same 64-hex capability the magic link carries — and 302s straight into
// Stripe. Success lands on /open with the same token, which signs them back
// in against the freshly extended record.
const RENEW_TOKEN_RE = /^[0-9a-f]{64}$/
const MAX_RENEW_LINK_ATTEMPTS_PER_HOUR = 10

async function hashRenewIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`renewlink:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

checkout.get('/renew', async (c) => {
  const token = c.req.query('token') ?? ''
  if (!RENEW_TOKEN_RE.test(token)) {
    return c.text('This renewal link is not valid.', 400)
  }

  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const attempts = await recordRenewLinkAttempt(c.env, await hashRenewIp(ip))
  if (attempts > MAX_RENEW_LINK_ATTEMPTS_PER_HOUR) {
    return c.text('Too many attempts. Try again later.', 429)
  }

  const email = await getEmailByAccessToken(c.env, token)
  if (!email) {
    return c.text('This renewal link is not valid.', 404)
  }

  try {
    const session = await startRenewalSession(c.env, email, {
      successUrl: `${c.env.APP_BASE_URL}/open?token=${token}&renew=success`,
      cancelUrl: `${c.env.APP_BASE_URL}/login?renew=cancel`,
    })
    return c.redirect(session.url, 302)
  } catch (err) {
    console.error('renewal createCheckoutSession failed', err)
    return c.text('Checkout is temporarily unavailable. Try the link again in a few minutes.', 503)
  }
})
