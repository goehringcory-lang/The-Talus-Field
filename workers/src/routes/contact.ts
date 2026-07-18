import { Hono } from 'hono'
import type { Env } from '../env'
import { recordContactAttempt } from '../lib/kv'
import { sendContactMessage } from '../lib/email'

export const contact = new Hono<{ Bindings: Env }>()

// Every submission relays a real email to the operator inbox, so the window
// is tight and keyed by hashed IP, same as /api/waitlist and /api/trip/email.
const MAX_SENDS_PER_HOUR = 5

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`contact:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const SUBJECT_LABELS: Record<string, string> = {
  general: 'A general note',
  planning: 'A trip-planning question',
  correction: 'A correction or update to an article',
  press: 'Press / interview',
  other: 'Something else',
}

const NAME_MAX = 120
const EMAIL_MAX = 254
const MESSAGE_MAX = 8000
// Simple, intentionally permissive. Resend will hard-bounce real garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactBody = {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  // Honeypot. Real browsers won't fill this; bots will.
  website?: unknown
}

contact.post('/', async (c) => {
  const body = await c.req
    .json<ContactBody>()
    .catch(() => ({}) as ContactBody)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    // Pretend success so bots don't learn the honeypot exists.
    return c.json({ ok: true }, 200)
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const subjectKey = typeof body.subject === 'string' ? body.subject : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || name.length > NAME_MAX) {
    return c.json({ error: 'Invalid name' }, 400)
  }
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return c.json({ error: 'Invalid email' }, 400)
  }
  if (!message || message.length > MESSAGE_MAX) {
    return c.json({ error: 'Invalid message' }, 400)
  }
  const subjectLabel = SUBJECT_LABELS[subjectKey] ?? SUBJECT_LABELS.general

  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const attempts = await recordContactAttempt(c.env, await hashIp(ip))
  if (attempts > MAX_SENDS_PER_HOUR) {
    return c.json({ error: 'Too many messages. Try again later.' }, 429)
  }

  try {
    await sendContactMessage(c.env, {
      name,
      email,
      subject: subjectLabel,
      message,
    })
  } catch (err) {
    console.error('contact send failed', err)
    return c.json({ error: 'Send failed' }, 502)
  }

  return c.json({ ok: true }, 200)
})
