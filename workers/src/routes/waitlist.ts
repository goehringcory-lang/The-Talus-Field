import { Hono } from 'hono'
import type { Env } from '../env'
import { recordWaitlistAttempt } from '../lib/kv'
import { sendWaitlistRequest } from '../lib/email'

// Reader-facing "put me on the wait-list" for the editorial /guide page
// (page-guide.jsx, GuideWaitlistBox). Unauthenticated by design: the
// editorial site has no accounts. It only mails the operator inbox that a
// reader wants in; it never mails the reader an arbitrary link.
export const waitlist = new Hono<{ Bindings: Env }>()

const EMAIL_MAX = 254
// Same intentionally permissive shape as /api/contact; Resend hard-bounces
// real garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_SENDS_PER_HOUR = 5

type WaitlistBody = {
  email?: unknown
  // Honeypot. Real browsers won't fill this; bots will.
  website?: unknown
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`waitlist:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

waitlist.post('/', async (c) => {
  const body = await c.req
    .json<WaitlistBody>()
    .catch(() => ({}) as WaitlistBody)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't learn the honeypot exists.
    return c.json({ ok: true }, 200)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Invalid email' }, 400)
  }

  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const attempts = await recordWaitlistAttempt(c.env, await hashIp(ip))
  if (attempts > MAX_SENDS_PER_HOUR) {
    return c.json({ error: 'Too many requests. Try again later.' }, 429)
  }

  try {
    await sendWaitlistRequest(c.env, { email })
  } catch (err) {
    console.error('waitlist send failed', err)
    return c.json({ error: 'Send failed' }, 502)
  }

  return c.json({ ok: true }, 200)
})
