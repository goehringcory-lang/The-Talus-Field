import { Hono } from 'hono'
import type { Env } from '../env'
import {
  currentMonthLabel,
  firstOfNextMonthIso,
  getInventoryCount,
} from '../lib/kv'
import { createCheckoutSession } from '../lib/stripe'

export const checkout = new Hono<{ Bindings: Env }>()

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

  let session
  try {
    session = await createCheckoutSession(c.env, {
      successUrl: `${c.env.EDITORIAL_BASE_URL}/?guide=success`,
      cancelUrl: `${c.env.EDITORIAL_BASE_URL}/?guide=cancel`,
    })
  } catch (err) {
    console.error('createCheckoutSession failed', err)
    return c.json({ error: 'Checkout temporarily unavailable' }, 503)
  }

  return c.json({ url: session.url })
})
