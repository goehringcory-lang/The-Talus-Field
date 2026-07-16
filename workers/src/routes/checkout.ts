import { Hono } from 'hono'
import type { Env } from '../env'
import {
  currentMonthLabel,
  firstOfNextMonthIso,
  getInventoryCount,
} from '../lib/kv'
import { createCheckoutSession } from '../lib/stripe'

export const checkout = new Hono<{ Bindings: Env }>()

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
    const note = typeof body.giftNote === 'string' ? body.giftNote.trim() : ''
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
