import { Hono } from 'hono'
import type { Env } from '../env'
import { recordSubscribeAttempt } from '../lib/kv'
import { PRINTABLES, sendPrintableLink, type PrintableKey } from '../lib/email'

// Sunday letter signup for every editorial form (components.jsx
// submitNewsletter). Unauthenticated by design: the site has no accounts.
//
// Why this exists: the forms used to POST straight to Buttondown's
// embed-subscribe endpoint, and from early September 2026 Buttondown answered
// those with a Cloudflare Turnstile "Verify Your Subscription" page. Posted
// into a hidden iframe, that page could never be completed, so no signup
// reached the list for a month while every form reported success. The API
// takes the same address with no challenge, answers with a real status the
// page can act on, and applies the tag (the embed form's `tag` field never
// reached a single subscriber record).
//
// The response contract the page relies on:
//   200 {ok: true}                  on the list (new, or already there);
//                                   with `send`, also `sent: true|false`
//   400 {error: 'invalid_email'}    the reader can fix it
//   429                             too many tries from this address
//   502/503 {fallback: true}        anything else; the page offers the
//                                   Buttondown tab, which still works for a
//                                   human, so no failure here loses a signup.
export const subscribe = new Hono<{ Bindings: Env }>()

const BUTTONDOWN_SUBSCRIBERS = 'https://api.buttondown.com/v1/subscribers'
const EMAIL_MAX = 254
// Same permissive shape as /api/contact; Buttondown rejects real garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Buttondown tags as the site writes them (home, map-gate, date-halfdome).
const TAG_RE = /^[a-z0-9-]{1,40}$/
const MAX_ATTEMPTS_PER_HOUR = 10

type SubscribeBody = {
  email?: unknown
  tag?: unknown
  // The page the form sat on, recorded as Buttondown's referrer_url.
  referrer?: unknown
  // Optional: a printable to mail once the signup lands (a PRINTABLES key in
  // lib/email.ts, e.g. "checklist"). Unknown values are ignored.
  send?: unknown
  // Honeypot. Real browsers leave it empty; bots fill it.
  website?: unknown
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`subscribe:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function referrerFrom(raw: unknown, editorialBase: string): string | undefined {
  if (typeof raw !== 'string' || raw.length > 500) return undefined
  try {
    const u = new URL(raw)
    const allowed = new URL(editorialBase).hostname.replace(/^www\./, '')
    return u.hostname.replace(/^www\./, '') === allowed ? u.toString() : undefined
  } catch {
    return undefined
  }
}

async function createSubscriber(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<{ status: number; code: string }> {
  const res = await fetch(BUTTONDOWN_SUBSCRIBERS, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
      // An address already on the list is merged (new tag added), not a 400,
      // and one that unsubscribed earlier and is signing up again is
      // resubscribed: they just asked to be.
      'X-Buttondown-Collision-Behavior': 'add',
    },
    body: JSON.stringify(payload),
  })
  let code = ''
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { code?: unknown } | null
    code = body && typeof body.code === 'string' ? body.code : ''
  }
  return { status: res.status, code }
}

subscribe.post('/', async (c) => {
  const body = await c.req.json<SubscribeBody>().catch(() => ({}) as SubscribeBody)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't learn the honeypot exists.
    return c.json({ ok: true }, 200)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'invalid_email' }, 400)
  }
  const tag = typeof body.tag === 'string' && TAG_RE.test(body.tag) ? body.tag : ''

  if (!c.env.BUTTONDOWN_API_KEY) {
    console.error('subscribe: BUTTONDOWN_API_KEY is not set')
    return c.json({ error: 'unavailable', fallback: true }, 503)
  }

  const ip = c.req.header('CF-Connecting-IP') ?? ''
  const attempts = await recordSubscribeAttempt(c.env, await hashIp(ip || 'unknown'))
  if (attempts > MAX_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'rate_limited' }, 429)
  }

  const editorialBase = c.env.EDITORIAL_BASE_URL || 'https://thetalusfieldjournal.com'
  const payload: Record<string, unknown> = {
    email_address: email,
    // Single opt-in: the reader typed the address into our form a moment
    // ago, and the confirmation step lost about half of every signup.
    type: 'regular',
    // Buttondown's own firewall still screens the address with the real IP;
    // the firewall bypass header is deliberately not sent.
    ...(ip ? { ip_address: ip } : {}),
  }
  const referrer = referrerFrom(body.referrer, editorialBase)
  if (referrer) payload.referrer_url = referrer
  if (tag) payload.tags = [tag]

  try {
    let result = await createSubscriber(c.env.BUTTONDOWN_API_KEY, payload)
    // A plan without tag creation refuses an unknown tag outright. A missing
    // tag must never cost a signup, so try once more without it.
    if (result.status === 403 && tag) {
      console.warn(`subscribe: tag "${tag}" refused (${result.code}), retrying untagged`)
      delete payload.tags
      result = await createSubscriber(c.env.BUTTONDOWN_API_KEY, payload)
    }
    if (result.status >= 200 && result.status < 300) {
      console.log(`subscribe: ok tag=${payload.tags ? tag : '-'}`)
      // The signup is what the reader came for; a failed mail of the
      // printable is logged and reported, never turned into a failed signup.
      const send = typeof body.send === 'string' && body.send in PRINTABLES ? (body.send as PrintableKey) : null
      if (send) {
        try {
          await sendPrintableLink(c.env, { to: email, kind: send })
          return c.json({ ok: true, sent: true }, 200)
        } catch (err) {
          console.error(`subscribe: printable "${send}" not sent`, err)
          return c.json({ ok: true, sent: false }, 200)
        }
      }
      return c.json({ ok: true }, 200)
    }
    console.error(`subscribe: buttondown ${result.status} ${result.code || '-'} tag=${tag || '-'}`)
    if (result.status === 400 && /invalid/i.test(result.code)) {
      return c.json({ error: 'invalid_email' }, 400)
    }
    return c.json({ error: 'upstream', code: result.code, fallback: true }, 502)
  } catch (err) {
    console.error('subscribe: buttondown unreachable', err)
    return c.json({ error: 'upstream', fallback: true }, 502)
  }
})
