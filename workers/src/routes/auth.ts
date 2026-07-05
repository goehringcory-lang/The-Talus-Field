import { Hono } from 'hono'
import type { Env } from '../env'
import {
  clearDevLoginAttempts,
  clearLoginAttempts,
  getBuyer,
  getEmailByAccessToken,
  recordDevLoginAttempt,
  recordLoginAttempt,
  recordResendAttempt,
  recordResendAttemptByIp,
} from '../lib/kv'
import { signAccessJwt } from '../lib/jwt'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import { sendMagicLink } from '../lib/email'
import { constantTimeEquals } from '../lib/tokens'

const MAX_LOGIN_ATTEMPTS_PER_HOUR = 5
// Each resend attempt fires a real email, so the caps sit below login's 5/hr.
const MAX_RESEND_PER_EMAIL_PER_HOUR = 3
const MAX_RESEND_PER_IP_PER_HOUR = 10

export const auth = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

auth.post('/exchange', async (c) => {
  const body = await c.req.json<{ token?: string }>().catch(() => ({} as { token?: string }))
  const token = body.token?.trim()
  if (!token) return c.json({ error: 'Missing token' }, 400)

  const email = await getEmailByAccessToken(c.env, token)
  if (!email) return c.json({ error: 'Unknown or expired token' }, 401)

  const buyer = await getBuyer(c.env, email)
  if (!buyer) return c.json({ error: 'Buyer record missing' }, 401)
  if (buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 401)
  }

  // Sign to the buyer's real access expiry so one magic-link click lasts the
  // whole paid window instead of logging the buyer out every 90 days.
  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET, buyer.expiresAt)
  return c.json({ jwt })
})

auth.post('/login', async (c) => {
  const body = await c.req
    .json<{ email?: string; code?: string }>()
    .catch(() => ({} as { email?: string; code?: string }))
  const email = body.email?.trim().toLowerCase()
  const code = body.code?.trim()
  if (!email || !code) return c.json({ error: 'Missing email or code' }, 400)

  const attempts = await recordLoginAttempt(c.env, email)
  if (attempts > MAX_LOGIN_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const buyer = await getBuyer(c.env, email)
  if (!buyer) return c.json({ error: 'Email not recognized' }, 401)
  if (!constantTimeEquals(buyer.accessCode, code)) {
    return c.json({ error: 'Code does not match' }, 401)
  }
  if (buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 401)
  }

  await clearLoginAttempts(c.env, email)
  // Same as /exchange: the JWT lives as long as the purchased access does.
  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET, buyer.expiresAt)
  return c.json({ jwt })
})

// Who am I, and when does my access end? The PWA's Account page renders the
// access-ends date from this, and the app revalidates against it when online
// so a refund actually signs the buyer out. Returns 200 with expired: true
// (rather than a 401) for a lapsed buyer — the client needs the date to
// explain what happened.
auth.get('/me', requireAuth, async (c) => {
  const sub = c.get('authSub')
  const buyer = await getBuyer(c.env, sub)
  if (!buyer) {
    // No buyer record: a dev/admin session. Report the JWT's own expiry so
    // the Account page has something sensible to show.
    return c.json({ kind: 'operator', email: sub, expiresAt: c.get('authExp') })
  }
  return c.json({
    kind: 'buyer',
    email: buyer.email,
    purchasedAt: buyer.purchasedAt,
    expiresAt: buyer.expiresAt,
    expired: buyer.expiresAt * 1000 < Date.now(),
  })
})

// Self-serve "I lost my purchase email." Re-sends the existing magic link +
// code to the address on the buyer record. Always answers 200 { ok: true } —
// including for unknown emails, expired buyers, and over-cap callers — so the
// endpoint can't be used to probe who bought the guide.
auth.post('/resend', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({} as { email?: string }))
  const email = body.email?.trim().toLowerCase()
  if (!email) return c.json({ error: 'Missing email' }, 400)

  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  const emailAttempts = await recordResendAttempt(c.env, email)
  const ipAttempts = await recordResendAttemptByIp(c.env, ip)
  // Over cap: silently drop rather than 429 — a different status would leak
  // that the request was being processed at all.
  if (emailAttempts <= MAX_RESEND_PER_EMAIL_PER_HOUR && ipAttempts <= MAX_RESEND_PER_IP_PER_HOUR) {
    const buyer = await getBuyer(c.env, email)
    if (buyer && buyer.expiresAt * 1000 >= Date.now()) {
      const magicLink = `${c.env.APP_BASE_URL}/open?token=${buyer.accessToken}`
      try {
        await sendMagicLink(c.env, { to: buyer.email, magicLink, code: buyer.accessCode })
      } catch (err) {
        // Still 200: the caller can retry, and the mailto fallback remains.
        console.error('resend: sendMagicLink failed', { email, err })
      }
    }
  }

  return c.json({ ok: true })
})

// Pre-Stripe dev / admin login. Username + code are checked against env
// secrets. Two pairs are honored: a "dev" pair for previewing the buyer
// experience, and an "admin" pair for the operator. Either issues the same
// JWT shape as the buyer login above, so the rest of the PWA is unchanged.
auth.post('/dev-login', async (c) => {
  const body = await c.req
    .json<{ username?: string; code?: string }>()
    .catch(() => ({} as { username?: string; code?: string }))
  const username = body.username?.trim()
  const code = body.code?.trim()
  if (!username || !code) return c.json({ error: 'Missing username or code' }, 400)

  // Cloudflare always sets cf-connecting-ip in production. Fall back to a
  // sentinel so the bucket key is still well-formed (e.g. for `wrangler dev`
  // local requests without the header).
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  const attempts = await recordDevLoginAttempt(c.env, ip, username)
  if (attempts > MAX_LOGIN_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const adminU = c.env.ADMIN_USERNAME
  const adminC = c.env.ADMIN_CODE
  const devU = c.env.DEV_USERNAME
  const devC = c.env.DEV_CODE

  // Evaluate every comparison unconditionally against a fallback so the path
  // doesn't short-circuit on a wrong username (or on creds being unset), which
  // would otherwise leak via timing whether a pair is configured / half-right.
  const adminUserOk = constantTimeEquals(username, adminU || '')
  const adminCodeOk = constantTimeEquals(code, adminC || '')
  const adminMatch = !!adminU && !!adminC && adminUserOk && adminCodeOk

  const devUserOk = constantTimeEquals(username, devU || '')
  const devCodeOk = constantTimeEquals(code, devC || '')
  const devMatch = !!devU && !!devC && devUserOk && devCodeOk

  if (!adminMatch && !devMatch) {
    return c.json({ error: 'Username or code does not match' }, 401)
  }

  await clearDevLoginAttempts(c.env, ip, username)
  const jwt = await signAccessJwt(username, c.env.MAGIC_LINK_SIGNING_SECRET)
  return c.json({ jwt })
})
