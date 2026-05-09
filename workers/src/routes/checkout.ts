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
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json(
      { error: 'Checkout is not enabled in this environment.' },
      503,
    )
  }

  const monthLabel = currentMonthLabel()
  const sold = await getInventoryCount(c.env, monthLabel)
  const cap = Number.parseInt(c.env.GUIDE_MONTHLY_CAP, 10)

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

  const session = await createCheckoutSession(c.env, {
    successUrl: `${c.env.EDITORIAL_BASE_URL}/?guide=success`,
    cancelUrl: `${c.env.EDITORIAL_BASE_URL}/?guide=cancel`,
  })

  return c.json({ url: session.url })
})
