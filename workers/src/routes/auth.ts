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
// Emails, usernames, and tokens become KV keys, and KV rejects keys over 512
// BYTES: unbounded input would throw inside record*Attempt and turn a garbage
// POST into a 500. Cap before any KV touch — measured in UTF-8 bytes, not
// string length: a 200-char CJK "email" passes a .length check at 254 yet
// yields a 600+ byte key and still 500s. 254 is the SMTP maximum; no real
// username approaches 128.
const EMAIL_MAX = 254
const USERNAME_MAX = 128
const CODE_MAX = 64
// Access tokens are 64 hex chars; double that is generous for any real value.
const TOKEN_MAX = 128
const utf8Bytes = (value: string): number => new TextEncoder().encode(value).length

export const auth = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

auth.post('/exchange', async (c) => {
  const body = await c.req.json<{ token?: string }>().catch(() => ({} as { token?: string }))
  const token = body.token?.trim()
  if (!token) return c.json({ error: 'Missing token' }, 400)
  // Same KV key-cap concern as the consts above: the token becomes part of a
  // KV key, so an oversized value would 500 in the lookup instead of 401 here.
  if (utf8Bytes(token) > TOKEN_MAX) return c.json({ error: 'Unknown or expired token' }, 401)

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
  if (utf8Bytes(email) > EMAIL_MAX || utf8Bytes(code) > CODE_MAX) {
    return c.json({ error: 'Missing email or code' }, 400)
  }

  const attempts = await recordLoginAttempt(c.env, email)
  if (attempts > MAX_LOGIN_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const buyer = await getBuyer(c.env, email)
  // One message for "no such buyer" and "wrong code": distinguishable 401s
  // made this endpoint a buyer-list oracle (one probe per address confirms
  // who bought the guide), defeating the enumeration defense /resend was
  // built with. The comparison runs unconditionally against a fallback (same
  // pattern as dev-login) so a missing record doesn't answer measurably
  // faster than a wrong code. A record without a code (hand-seeded, or
  // provisioned before codes existed) reads as a failed match rather than
  // throwing inside constantTimeEquals and turning sign-in into a 500.
  const storedCode = buyer && typeof buyer.accessCode === 'string' ? buyer.accessCode : ''
  const codeOk = constantTimeEquals(storedCode, code)
  if (!buyer || !storedCode || !codeOk) {
    return c.json({ error: 'Email or code does not match' }, 401)
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
// Private state behind a bearer token: never store it at the edge or in a
// shared browser cache (same posture as /api/trip/plan and /api/push/pending).
const NO_STORE = { 'Cache-Control': 'no-store' }

auth.get('/me', requireAuth, async (c) => {
  const sub = c.get('authSub')
  const buyer = await getBuyer(c.env, sub)
  if (!buyer) {
    // No buyer record: a dev/admin session. Report the JWT's own expiry so
    // the Account page has something sensible to show.
    return c.json({ kind: 'operator', email: sub, expiresAt: c.get('authExp') }, 200, NO_STORE)
  }
  return c.json(
    {
      kind: 'buyer',
      email: buyer.email,
      purchasedAt: buyer.purchasedAt,
      expiresAt: buyer.expiresAt,
      expired: buyer.expiresAt * 1000 < Date.now(),
    },
    200,
    NO_STORE,
  )
})

// Self-serve "I lost my purchase email." Re-sends the existing magic link +
// code to the address on the buyer record. Always answers 200 { ok: true } —
// including for unknown emails, expired buyers, and over-cap callers — so the
// endpoint can't be used to probe who bought the guide.
auth.post('/resend', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({} as { email?: string }))
  const email = body.email?.trim().toLowerCase()
  if (!email || utf8Bytes(email) > EMAIL_MAX) return c.json({ error: 'Missing email' }, 400)

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
  if (utf8Bytes(username) > USERNAME_MAX || utf8Bytes(code) > CODE_MAX) {
    return c.json({ error: 'Missing username or code' }, 400)
  }

  const attempts = await recordDevLoginAttempt(c.env, username)
  if (attempts > MAX_LOGIN_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  // Trim the stored secrets before comparing. constantTimeEquals is exact and
  // length-sensitive, and the client already sends username.trim()/code.trim():
  // a secret set by piping (`echo "code" | wrangler secret put DEV_CODE`) keeps
  // its trailing newline, so the lengths differ by one and the pair can NEVER
  // match. Nothing is logged and the answer is the ordinary 401, so a correct
  // code reads as "username or code does not match" forever with no diagnostic
  // trail: worth guarding against even though it is cheap to get right.
  const adminU = c.env.ADMIN_USERNAME?.trim()
  const adminC = c.env.ADMIN_CODE?.trim()
  const devU = c.env.DEV_USERNAME?.trim()
  const devC = c.env.DEV_CODE?.trim()

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

  await clearDevLoginAttempts(c.env, username)
  const jwt = await signAccessJwt(username, c.env.MAGIC_LINK_SIGNING_SECRET)
  return c.json({ jwt })
})
