import type { Env } from '../env'

// Stripe API access via raw fetch — keeps the Worker bundle small (no `stripe` SDK).
// Docs: https://docs.stripe.com/api

type StripeCheckoutSession = {
  id: string
  url: string
  customer_email?: string
}

export async function createCheckoutSession(
  env: Env,
  args: {
    successUrl: string
    cancelUrl: string
    // Overrides for non-default SKUs (gift, renewal). Every session keeps the
    // GUIDE_PRODUCT_TAG metadata guard; `metadata` is merged onto BOTH the
    // session and payment_intent_data so refunds carry it on the charge.
    priceCents?: string
    productName?: string
    customerEmail?: string
    metadata?: Record<string, string>
  },
): Promise<StripeCheckoutSession> {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }

  const params = new URLSearchParams()
  params.set('mode', 'payment')
  params.set('success_url', args.successUrl)
  params.set('cancel_url', args.cancelUrl)
  params.set('line_items[0][price_data][currency]', 'usd')
  params.set(
    'line_items[0][price_data][product_data][name]',
    args.productName ?? 'The Field Guide — 2026 Edition',
  )
  params.set('line_items[0][price_data][unit_amount]', args.priceCents ?? env.GUIDE_PRICE_CENTS)
  params.set('line_items[0][quantity]', '1')
  params.set('metadata[product]', env.GUIDE_PRODUCT_TAG)
  params.set('billing_address_collection', 'auto')
  params.set('customer_creation', 'always')
  params.set('payment_intent_data[metadata][product]', env.GUIDE_PRODUCT_TAG)
  if (args.customerEmail) {
    params.set('customer_email', args.customerEmail)
  }
  for (const [key, value] of Object.entries(args.metadata ?? {})) {
    // `product` stays authoritative; a caller must not be able to overwrite
    // the tag the webhook guard keys on.
    if (key === 'product') continue
    params.set(`metadata[${key}]`, value)
    params.set(`payment_intent_data[metadata][${key}]`, value)
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Stripe checkout.sessions.create failed (${res.status}): ${detail}`)
  }
  return (await res.json()) as StripeCheckoutSession
}

// Verify Stripe webhook signature: HMAC-SHA256 of `${timestamp}.${rawBody}` with the webhook secret.
// Docs: https://docs.stripe.com/webhooks#verify-manually
export async function verifyStripeSignature(args: {
  rawBody: string
  signatureHeader: string | null
  secret: string
  toleranceSeconds?: number
}): Promise<boolean> {
  const { rawBody, signatureHeader, secret } = args
  const tolerance = args.toleranceSeconds ?? 300
  if (!signatureHeader) return false

  const parts = signatureHeader.split(',').map((kv) => kv.split('='))
  const t = parts.find(([k]) => k === 't')?.[1]
  // Stripe sends one v1 per active secret; during a secret rotation there are
  // several. Collect them all and accept if any matches, or a valid webhook
  // gets rejected whenever the matching signature isn't the last entry.
  const v1s = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!t || v1s.length === 0) return false

  const timestamp = Number.parseInt(t, 10)
  if (Number.isNaN(timestamp)) return false
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > tolerance) return false

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${rawBody}`))
  const expected = [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Constant-time compare against each candidate signature.
  return v1s.some((v1) => {
    if (expected.length !== v1.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i)
    }
    return diff === 0
  })
}
