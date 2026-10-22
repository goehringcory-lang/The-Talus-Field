import jwt from '@tsndr/cloudflare-worker-jwt'
import type { Env } from '../env'
import { getBuyer, putBuyer } from './kv'
import { EIGHTEEN_MONTHS_SECONDS } from './provision'

// Google Play Developer API client for the Android app's purchases (the
// Trusted Web Activity in the FieldGuideAndroid project). The app sells the
// guide through Play Billing, reached from the PWA by the Digital Goods API;
// the purchase token it gets back is verified here, server to server, before
// a buyer record exists. Auth is a service account linked to the Play
// Console, whose JSON key is the PLAY_SERVICE_ACCOUNT_JSON secret.

const SCOPE = 'https://www.googleapis.com/auth/androidpublisher'
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications'

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string }

// One OAuth token per isolate, refreshed five minutes before it lapses.
let cachedToken: { value: string; expiresAt: number } | null = null

export function playConfigured(env: Env): boolean {
  return Boolean(env.PLAY_SERVICE_ACCOUNT_JSON && env.PLAY_PACKAGE_NAME)
}

async function accessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt - 300 > now) return cachedToken.value
  const sa = JSON.parse(env.PLAY_SERVICE_ACCOUNT_JSON ?? '') as ServiceAccount
  const tokenUri = sa.token_uri ?? 'https://oauth2.googleapis.com/token'
  const assertion = await jwt.sign(
    { iss: sa.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 },
    sa.private_key,
    { algorithm: 'RS256' },
  )
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  if (!res.ok) throw new Error(`Google OAuth failed (${res.status}): ${await res.text()}`)
  const body = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: body.access_token, expiresAt: now + body.expires_in }
  return body.access_token
}

// The fields of a ProductPurchase this Worker reads.
// https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.products
export type ProductPurchase = {
  purchaseState?: number // 0 purchased, 1 canceled, 2 pending
  consumptionState?: number // 0 not consumed, 1 consumed
  orderId?: string
  purchaseTimeMillis?: string
}

function productUrl(env: Env, productId: string, token: string): string {
  return `${API}/${encodeURIComponent(env.PLAY_PACKAGE_NAME ?? '')}/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(token)}`
}

// null when Google does not know the token for this product (a forged or
// mistyped token, or one for another app), so the route can answer 404.
export async function getProductPurchase(
  env: Env,
  productId: string,
  token: string,
): Promise<ProductPurchase | null> {
  const res = await fetch(productUrl(env, productId, token), {
    headers: { Authorization: `Bearer ${await accessToken(env)}` },
  })
  if (res.status === 400 || res.status === 404 || res.status === 410) return null
  if (!res.ok) throw new Error(`Play purchases.products.get failed (${res.status}): ${await res.text()}`)
  return (await res.json()) as ProductPurchase
}

// Both products are consumable on Play's side: the guide is 18 months of
// access, not a permanent unlock, so a buyer must be able to buy it again
// when it lapses. Consuming also acknowledges, which Play requires within
// three days or it refunds the purchase on its own.
export async function consumeProductPurchase(
  env: Env,
  productId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${productUrl(env, productId, token)}:consume`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await accessToken(env)}` },
  })
  if (!res.ok) throw new Error(`Play consume failed (${res.status}): ${await res.text()}`)
}

// The purchase token is long and opaque; KV keys use its hash.
export async function hashPurchaseToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`play:${token}`))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// What the verify route records per purchase token, so a retry from the app
// (a dropped connection after the payment sheet closed) is idempotent and a
// token can never be presented for a second email.
export type PlayPurchaseRecord = {
  email: string
  orderId: string
  productId: string
  consumed: boolean
}

export const PLAY_PURCHASE_KEY = (tokenHash: string) => `playPurchase:${tokenHash}`
const PLAY_ORDER_KEY = (orderId: string) => `playOrder:${orderId}`
const PLAY_VOIDED_KEY = (orderId: string) => `playVoided:${orderId}`

export async function getPlayPurchase(env: Env, tokenHash: string): Promise<PlayPurchaseRecord | null> {
  const raw = await env.GUIDE_BUYERS.get(PLAY_PURCHASE_KEY(tokenHash))
  if (!raw) return null
  try {
    return JSON.parse(raw) as PlayPurchaseRecord
  } catch {
    return null
  }
}

export async function putPlayPurchase(
  env: Env,
  tokenHash: string,
  record: PlayPurchaseRecord,
): Promise<void> {
  await env.GUIDE_BUYERS.put(PLAY_PURCHASE_KEY(tokenHash), JSON.stringify(record))
  // The voided-purchases sweep knows orders by id, not by token.
  await env.GUIDE_BUYERS.put(PLAY_ORDER_KEY(record.orderId), record.email)
}

// --- Refunds ----------------------------------------------------------------
// Play has no webhook this Worker can take without Pub/Sub, so refunds and
// chargebacks are read nightly from the Voided Purchases API (the last three
// days, so a missed night is caught by the next). The Stripe refund rule
// carries over: a refund of the purchase that provisioned the record revokes
// access; a refund of a purchase that only extended an active record takes
// those 18 months back off. Anything else is logged for a manual look.

type VoidedPurchase = { orderId?: string; purchaseToken?: string }

export async function sweepPlayVoided(env: Env): Promise<void> {
  if (!playConfigured(env)) return
  const startTime = Date.now() - 3 * 24 * 60 * 60 * 1000
  const url = `${API}/${encodeURIComponent(env.PLAY_PACKAGE_NAME ?? '')}/purchases/voidedpurchases?startTime=${startTime}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${await accessToken(env)}` } })
  if (!res.ok) throw new Error(`Play voidedpurchases failed (${res.status}): ${await res.text()}`)
  const body = (await res.json()) as { voidedPurchases?: VoidedPurchase[] }
  for (const voided of body.voidedPurchases ?? []) {
    if (!voided.orderId) continue
    await revokePlayOrder(env, voided.orderId)
  }
}

export async function revokePlayOrder(env: Env, orderId: string): Promise<void> {
  if (await env.GUIDE_BUYERS.get(PLAY_VOIDED_KEY(orderId))) return
  const email = await env.GUIDE_BUYERS.get(PLAY_ORDER_KEY(orderId))
  const buyer = email ? await getBuyer(env, email) : null
  const eventId = playEventId(orderId)
  const now = Math.floor(Date.now() / 1000)
  if (!buyer) {
    console.error('play refund for an unknown order, revoke manually', { orderId })
  } else if (buyer.provisionedSessionId === eventId) {
    await putBuyer(env, { ...buyer, expiresAt: now, refundedAt: now })
  } else if (buyer.lastExtensionEventId === eventId) {
    const { lastExtensionEventId: _dropped, ...kept } = buyer
    await putBuyer(env, { ...kept, expiresAt: Math.max(now, buyer.expiresAt - EIGHTEEN_MONTHS_SECONDS) })
  } else {
    console.error('play refund matches neither the provision nor the last extension, check manually', {
      orderId,
      email,
    })
  }
  await env.GUIDE_BUYERS.put(PLAY_VOIDED_KEY(orderId), '1')
}

// The id a Play order carries wherever a Stripe session or event id would:
// provisionedSessionId, lastExtensionEventId, and the HMAC credential seed.
export function playEventId(orderId: string): string {
  return `play:${orderId}`
}
