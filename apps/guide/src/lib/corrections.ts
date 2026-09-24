// =============================================================================
// Reports from readers: a wrong hour, a moved turnout, a closed trail, a bug.
// Sent through the Worker's existing /api/contact route (subject
// 'correction', which relays to the operator inbox and rate-limits by IP).
//
// A report is most often written where there is no signal, so it never fails
// into nothing: a send that cannot reach the Worker lands in an outbox on this
// device (`tfg.corrections.outbox`) and goes out on the next `online` event or
// app start, the way sync does. The operator copies what checks out into the
// fact audit's queue (scripts/data/guide-fact-ledger.json); a reader's GPS
// fix never clears a `TODO: verify` mark on its own.
// =============================================================================

import { apiFetch, ApiError } from './api'

const OUTBOX_KEY = 'tfg.corrections.outbox'

export type Correction = {
  email: string
  message: string
  queuedAt: string
}

function readOutbox(): Correction[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter(
          (c): c is Correction =>
            !!c && typeof c === 'object' && typeof c.email === 'string' && typeof c.message === 'string',
        )
      : []
  } catch {
    return []
  }
}

function writeOutbox(list: Correction[]): void {
  try {
    if (list.length === 0) localStorage.removeItem(OUTBOX_KEY)
    else localStorage.setItem(OUTBOX_KEY, JSON.stringify(list))
  } catch {
    /* non-fatal: the page offers the mailto fallback */
  }
}

export function outboxCount(): number {
  return readOutbox().length
}

async function post(c: Correction): Promise<void> {
  await apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Field Guide reader',
      email: c.email,
      subject: 'correction',
      message: c.message,
    }),
  })
}

export type SendResult = 'sent' | 'queued' | 'rejected'

/** Send now, or queue for later when the network is the problem. A 4xx from
 *  the Worker (bad address, rate limit) is not a network problem and is not
 *  queued: the page offers the email fallback instead. */
export async function sendCorrection(email: string, message: string): Promise<SendResult> {
  const c: Correction = { email, message, queuedAt: new Date().toISOString() }
  if (!navigator.onLine) {
    writeOutbox([...readOutbox(), c])
    return 'queued'
  }
  try {
    await post(c)
    return 'sent'
  } catch (err) {
    if (err instanceof ApiError && err.status >= 400 && err.status < 500) return 'rejected'
    writeOutbox([...readOutbox(), c])
    return 'queued'
  }
}

let flushing = false

/** Try the outbox. Called at boot and on every `online` event. */
export async function flushCorrections(): Promise<void> {
  if (flushing || !navigator.onLine) return
  const pending = readOutbox()
  if (pending.length === 0) return
  flushing = true
  const left: Correction[] = []
  for (const c of pending) {
    try {
      await post(c)
    } catch (err) {
      // A rejected report will never send; keeping it would retry forever.
      if (!(err instanceof ApiError && err.status >= 400 && err.status < 500)) left.push(c)
    }
  }
  writeOutbox(left)
  flushing = false
}

export function startCorrectionsOutbox(): void {
  void flushCorrections()
  window.addEventListener('online', () => void flushCorrections())
}

export const SUPPORT_EMAIL = 'cory@thetalusfieldjournal.com'

export function correctionMailto(subject: string, body: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
