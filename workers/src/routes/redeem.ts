import { Hono } from 'hono'
import type { Env } from '../env'
import {
  getBuyer,
  hasPromoRedemption,
  markPromoRedemption,
  putBuyer,
  recordRedeemAttempt,
  recordRedeemAttemptByIp,
  type BuyerRecord,
} from '../lib/kv'
import { sendMagicLink, sendTrialAccess } from '../lib/email'
import { generateAccessCode, generateAccessToken } from '../lib/tokens'

// Shared promo codes (PROMO_CODES in wrangler.toml, "CODE:DAYS" comma-
// separated). A valid redemption provisions a normal buyer record for DAYS
// days and emails the same magic link + 6-digit code a purchase does, so the
// rest of the system (login, /me, sync, expiry) needs no promo awareness.
// Unauthenticated by design: the code IS the gate, and it is a soft one —
// it ships in a newsletter, same philosophy as the editorial map gate.
//
// Access always arrives by email, never as a JWT in the response: /api/trip
// sync is keyed by the JWT sub, so handing a token to whoever types an
// address would let anyone read that address's synced trip plan. Delivering
// to the inbox is what proves the redeemer owns it.
export const redeem = new Hono<{ Bindings: Env }>()

// Same intentionally permissive shape as /api/contact; Resend hard-bounces
// real garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Emails become KV keys (attempt counters, the redemption sentinel), and KV
// rejects keys over 512 bytes — cap in UTF-8 bytes before any KV touch, same
// reasoning as auth.ts.
const EMAIL_MAX = 254
const CODE_MAX = 64
// Each valid attempt sends a real email, so the caps mirror /resend's: the
// per-email bucket protects an inbox from someone else redeeming at it, the
// per-IP bucket stops address probing and bounds code guessing.
const MAX_REDEEMS_PER_EMAIL_PER_HOUR = 3
const MAX_REDEEMS_PER_IP_PER_HOUR = 10

const utf8Bytes = (value: string): number => new TextEncoder().encode(value).length

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`redeem:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// PROMO_CODES → { CODE: days }. Codes compare case-insensitively (readers
// retype them off an email). Malformed entries are skipped, not fatal: a typo
// in one code must not take down the others.
export function parsePromoCodes(raw: string | undefined): Map<string, number> {
  const codes = new Map<string, number>()
  for (const entry of (raw ?? '').split(',')) {
    const [code, daysRaw] = entry.split(':')
    const normalized = code?.trim().toUpperCase()
    const days = Number.parseInt(daysRaw ?? '', 10)
    if (!normalized || Number.isNaN(days) || days < 1) continue
    codes.set(normalized, days)
  }
  return codes
}

type RedeemBody = {
  email?: unknown
  code?: unknown
  // Honeypot. Real browsers won't fill this; bots will.
  website?: unknown
}

redeem.post('/', async (c) => {
  const body = await c.req.json<RedeemBody>().catch(() => ({}) as RedeemBody)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't learn the honeypot exists.
    return c.json({ ok: true }, 200)
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const codeInput = typeof body.code === 'string' ? body.code.trim() : ''
  if (!email || utf8Bytes(email) > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Enter a valid email address.' }, 400)
  }
  if (!codeInput || utf8Bytes(codeInput) > CODE_MAX) {
    return c.json({ error: 'Enter the code from the newsletter.' }, 400)
  }

  // Rate-limit before the code is even looked at, so guessing burns the
  // window whether or not a guess lands.
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  const emailAttempts = await recordRedeemAttempt(c.env, email)
  const ipAttempts = await recordRedeemAttemptByIp(c.env, await hashIp(ip))
  if (
    emailAttempts > MAX_REDEEMS_PER_EMAIL_PER_HOUR ||
    ipAttempts > MAX_REDEEMS_PER_IP_PER_HOUR
  ) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const code = codeInput.toUpperCase()
  const days = parsePromoCodes(c.env.PROMO_CODES).get(code)
  if (!days) {
    return c.json({ error: 'That code is not recognized.' }, 404)
  }

  const nowSeconds = Math.floor(Date.now() / 1000)

  // An ACTIVE record is never clobbered: a paid buyer clicking the newsletter
  // offer would otherwise trade 18 months for 30 days, and a trial redeemed
  // twice would regenerate the code in the first email. Re-send what they
  // already hold instead — for the redeemer this is indistinguishable from a
  // fresh grant (same 200, an access email arrives), which also keeps the
  // endpoint from confirming who bought the guide to anyone with the code.
  const existing = await getBuyer(c.env, email)
  if (existing && existing.refundedAt == null && existing.expiresAt > nowSeconds) {
    const magicLink = `${c.env.APP_BASE_URL}/open?token=${existing.accessToken}`
    try {
      if (existing.promoCode) {
        await sendTrialAccess(c.env, {
          to: email,
          magicLink,
          code: existing.accessCode,
          expiresAt: existing.expiresAt,
        })
      } else {
        await sendMagicLink(c.env, { to: email, magicLink, code: existing.accessCode })
      }
    } catch (err) {
      console.error('redeem: re-send to active record failed', { email, err })
      return c.json({ error: 'Could not send the access email. Try again.' }, 502)
    }
    return c.json({ ok: true })
  }

  // Expired (or refunded) record, or none at all: one grant per (code, email)
  // ever, or the trial re-arms every 30 days. The sentinel is only claimed
  // after the email sends, so a failed send can be retried.
  if (await hasPromoRedemption(c.env, code, email)) {
    return c.json({ error: 'That code has already been used with this email.' }, 409)
  }

  const record: BuyerRecord = {
    email,
    purchasedAt: nowSeconds,
    expiresAt: nowSeconds + days * 24 * 60 * 60,
    accessToken: generateAccessToken(),
    accessCode: generateAccessCode(),
    promoCode: code,
  }
  // No inventory increment: the monthly cap models paid supply.
  await putBuyer(c.env, record)

  const magicLink = `${c.env.APP_BASE_URL}/open?token=${record.accessToken}`
  try {
    await sendTrialAccess(c.env, {
      to: email,
      magicLink,
      code: record.accessCode,
      expiresAt: record.expiresAt,
    })
  } catch (err) {
    // The record exists but the email didn't land; putBuyer is idempotent on
    // email, so a retry re-provisions and re-sends (same trade-off as the
    // Stripe webhook's retry path).
    console.error('redeem: access email failed', { email, code, err })
    return c.json({ error: 'Could not send the access email. Try again.' }, 502)
  }

  await markPromoRedemption(c.env, code, email)
  return c.json({ ok: true })
})
