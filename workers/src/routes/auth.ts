import { Hono } from 'hono'
import type { Env } from '../env'
import {
  clearDevLoginAttempts,
  clearLoginAttempts,
  getBuyer,
  getEmailByAccessToken,
  recordDevLoginAttempt,
  recordLoginAttempt,
} from '../lib/kv'
import { signAccessJwt } from '../lib/jwt'
import { constantTimeEquals } from '../lib/tokens'

const MAX_LOGIN_ATTEMPTS_PER_HOUR = 5

export const auth = new Hono<{ Bindings: Env }>()

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

  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET)
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
  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET)
  return c.json({ jwt })
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
