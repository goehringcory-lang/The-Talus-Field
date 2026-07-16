import type { Env } from '../env'

const FROM = 'The Field Guide <cory@thetalusfieldjournal.com>'
const CONTACT_FROM = 'The Talus Field <cory@thetalusfieldjournal.com>'
const CONTACT_TO = 'Goehring.cory@gmail.com'

type ResendBody = {
  from: string
  to: string[]
  subject: string
  text: string
  html: string
  reply_to?: string
}

export async function sendMagicLink(
  env: Env,
  args: { to: string; magicLink: string; code: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, magicLink, code } = args
  const appOrigin = new URL(magicLink).origin

  const text = [
    `Welcome to The Field Guide.`,
    ``,
    `Tap to open the app on this device:`,
    magicLink,
    ``,
    `Setting up a second device? Use this 6-digit code at`,
    `${appOrigin}/login`,
    ``,
    `    ${code}`,
    ``,
    `Both keep working for 18 months.`,
    `— Cory`,
  ].join('\n')

  // Brand palette inlined by hex (mail clients strip <style> and custom
  // properties): paper #f1ead6, paper-2 #e6dcc1, ink #14110c, ink-3 #50402e,
  // rule #2a2118. Georgia stands in for EB Garamond, which mail clients
  // cannot be relied on to load. The mark is served by the deployed app.
  const serif = `Georgia, 'Times New Roman', serif`
  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <img src="${appOrigin}/brand/mark-192.png" width="60" height="47" alt="The Talus Field" style="display:block;border:0;" />
            <div style="font-family:${serif};font-size:24px;color:#14110c;padding-top:12px;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">The Field Guide &middot; 2026 Edition</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">Welcome to The Field Guide.</p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 14px;">Tap to open the app on this device:</p>
            <p style="margin:0 0 26px;">
              <a href="${magicLink}" style="display:inline-block;padding:14px 22px;background:#14110c;color:#f1ead6;text-decoration:none;font-family:${sans};font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
                Open the guide
              </a>
            </p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 10px;">Setting up a second device? Use this 6-digit code at <a href="${appOrigin}/login" style="color:#7a2a10;">${appOrigin}/login</a>:</p>
            <p style="font-family:ui-monospace,Menlo,monospace;font-size:28px;letter-spacing:8px;color:#14110c;background:#e6dcc1;border:1px solid #2a2118;padding:12px 16px;margin:0 0 26px;display:inline-block;">${code}</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">Both keep working for 18 months, on every device you own.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = {
    from: FROM,
    to: [to],
    subject: 'Your Field Guide is ready',
    text,
    html,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

// Access email for a gifted guide: same open-link + code mechanics as
// sendMagicLink, framed as a gift. `note` is user text from checkout and MUST
// stay escaped in the HTML body.
export async function sendGiftAccess(
  env: Env,
  args: {
    to: string
    payerEmail: string | null
    magicLink: string
    code: string
    note?: string
  },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, payerEmail, magicLink, code } = args
  const note = args.note?.trim() ?? ''
  const appOrigin = new URL(magicLink).origin
  const fromLine = payerEmail
    ? `${payerEmail} sent you The Field Guide, an offline Yosemite guide.`
    : `Someone sent you The Field Guide, an offline Yosemite guide.`

  const text = [
    fromLine,
    ...(note ? [``, `Their note:`, ``, `    ${note}`] : []),
    ``,
    `Tap to open the app on this device:`,
    magicLink,
    ``,
    `Setting up a second device? Use this 6-digit code at`,
    `${appOrigin}/login`,
    ``,
    `    ${code}`,
    ``,
    `Both keep working for 18 months. Nothing was charged to you.`,
    `— Cory`,
  ].join('\n')

  // Same inlined brand palette as the magic-link email; mail clients strip
  // <style>, so hex values ride along.
  const serif = `Georgia, 'Times New Roman', serif`
  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const noteHtml = note
    ? `<blockquote style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;background:#e6dcc1;border-left:3px solid #2a2118;margin:0 0 22px;padding:12px 16px;">${escapeHtml(note)}</blockquote>`
    : ''
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <img src="${appOrigin}/brand/mark-192.png" width="60" height="47" alt="The Talus Field" style="display:block;border:0;" />
            <div style="font-family:${serif};font-size:24px;color:#14110c;padding-top:12px;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">The Field Guide &middot; A Gift</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">${escapeHtml(fromLine)}</p>
            ${noteHtml}
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 14px;">Tap to open the app on this device:</p>
            <p style="margin:0 0 26px;">
              <a href="${magicLink}" style="display:inline-block;padding:14px 22px;background:#14110c;color:#f1ead6;text-decoration:none;font-family:${sans};font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
                Open the guide
              </a>
            </p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 10px;">Setting up a second device? Use this 6-digit code at <a href="${appOrigin}/login" style="color:#7a2a10;">${appOrigin}/login</a>:</p>
            <p style="font-family:ui-monospace,Menlo,monospace;font-size:28px;letter-spacing:8px;color:#14110c;background:#e6dcc1;border:1px solid #2a2118;padding:12px 16px;margin:0 0 26px;display:inline-block;">${code}</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">Both keep working for 18 months, on every device you own. Nothing was charged to you.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = {
    from: FROM,
    to: [to],
    subject: 'The Field Guide, a gift for you',
    text,
    html,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

// Payer's confirmation after a gift purchase. Plain and short: the access
// email went to the recipient, and a wrong address is fixable by replying.
export async function sendGiftReceipt(
  env: Env,
  args: { to: string; recipientEmail: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, recipientEmail } = args

  const text = [
    `Your gift is on its way.`,
    ``,
    `The Field Guide access email was sent to ${recipientEmail}.`,
    `Their access runs 18 months from today.`,
    ``,
    `If that address is wrong, reply to this email and I will move the access.`,
    `Stripe sends your payment receipt separately.`,
    `— Cory`,
  ].join('\n')

  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const serif = `Georgia, 'Times New Roman', serif`
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <div style="font-family:${serif};font-size:24px;color:#14110c;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">The Field Guide &middot; Gift Receipt</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">Your gift is on its way.</p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 14px;">The Field Guide access email was sent to <strong>${escapeHtml(recipientEmail)}</strong>. Their access runs 18 months from today.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">If that address is wrong, reply to this email and I will move the access. Stripe sends your payment receipt separately.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = {
    from: FROM,
    to: [to],
    subject: 'Your Field Guide gift is on its way',
    text,
    html,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

function formatAccessDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// One of the three staged renewal notices the daily sweep sends (T-60, T-14,
// T-1). The CTA is the token-authenticated GET /api/checkout/renew link, so a
// lapsed buyer whose JWT is dead can still renew in one click.
export async function sendRenewalNotice(
  env: Env,
  args: { to: string; stage: 't60' | 't14' | 't1'; expiresAt: number; renewUrl: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, stage, expiresAt, renewUrl } = args
  const endDate = formatAccessDate(expiresAt)
  const parsedPrice = Number.parseInt(env.GUIDE_RENEWAL_PRICE_CENTS, 10)
  const priceLabel = Number.isNaN(parsedPrice) ? 'a reduced price' : `$${(parsedPrice / 100).toFixed(parsedPrice % 100 === 0 ? 0 : 2)}`

  const subject =
    stage === 't1'
      ? 'Your Field Guide access ends tomorrow'
      : stage === 't14'
        ? 'Your Field Guide access ends in two weeks'
        : 'Your Field Guide access ends in two months'
  const lead =
    stage === 't1'
      ? `Your access ends tomorrow, ${endDate}.`
      : `Your access runs through ${endDate}.`

  const text = [
    lead,
    ``,
    `Renew for ${priceLabel} and keep everything: your trips, favorites, downloads, and sign-in, for 18 more months. Renewing early stacks on top of your current time; nothing is lost.`,
    ``,
    `Renew here:`,
    renewUrl,
    ``,
    `If you're done with the park for a while, do nothing and the access simply ends. No subscription, nothing to cancel.`,
    `— Cory`,
  ].join('\n')

  const serif = `Georgia, 'Times New Roman', serif`
  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <div style="font-family:${serif};font-size:24px;color:#14110c;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">The Field Guide &middot; Renewal</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">${lead}</p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 22px;">Renew for ${priceLabel} and keep everything: your trips, favorites, downloads, and sign-in, for 18 more months. Renewing early stacks on top of your current time; nothing is lost.</p>
            <p style="margin:0 0 26px;">
              <a href="${renewUrl}" style="display:inline-block;padding:14px 22px;background:#14110c;color:#f1ead6;text-decoration:none;font-family:${sans};font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
                Renew for ${priceLabel}
              </a>
            </p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">If you're done with the park for a while, do nothing and the access simply ends. No subscription, nothing to cancel.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = { from: FROM, to: [to], subject, text, html }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

// Confirmation after a successful renewal payment: the new end date, and
// reassurance that nothing else changed (same sign-in, same devices).
export async function sendRenewalConfirmation(
  env: Env,
  args: { to: string; expiresAt: number },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, expiresAt } = args
  const endDate = formatAccessDate(expiresAt)

  const text = [
    `You're renewed.`,
    ``,
    `Your Field Guide access now runs through ${endDate}.`,
    `Nothing else changes: same sign-in, same devices, same trips and downloads.`,
    ``,
    `Stripe sends your payment receipt separately.`,
    `— Cory`,
  ].join('\n')

  const serif = `Georgia, 'Times New Roman', serif`
  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <div style="font-family:${serif};font-size:24px;color:#14110c;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">The Field Guide &middot; Renewed</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">You're renewed.</p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 14px;">Your Field Guide access now runs through <strong>${endDate}</strong>. Nothing else changes: same sign-in, same devices, same trips and downloads.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">Stripe sends your payment receipt separately.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = {
    from: FROM,
    to: [to],
    subject: 'Your Field Guide access is renewed',
    text,
    html,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

export async function sendTripLink(
  env: Env,
  args: { to: string; tripUrl: string; stopCount: number },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, tripUrl, stopCount } = args
  const editorialOrigin = env.EDITORIAL_BASE_URL || 'https://thetalusfieldjournal.com'
  const stopsLabel = stopCount === 1 ? '1 stop' : `${stopCount} stops`

  const text = [
    `Your Yosemite trip, ${stopsLabel}.`,
    ``,
    `Open it on the map:`,
    tripUrl,
    ``,
    `The link keeps your stops in order. It works on any device.`,
    ``,
    `Sunday Field Notes carries what changed in the park each week.`,
    `You are on the list if you asked to be; nothing else follows from this email.`,
    `— Cory`,
  ].join('\n')

  // Same inlined brand palette as the magic-link email: mail clients strip
  // <style>, so hex values ride along. The mark is served by the editorial
  // site.
  const serif = `Georgia, 'Times New Roman', serif`
  const sans = `-apple-system, 'Segoe UI', Arial, sans-serif`
  const html = `
    <div style="background:#f1ead6;padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
        <tr>
          <td style="padding:0 0 18px;">
            <img src="${editorialOrigin}/img/mark-192.png" width="60" height="47" alt="The Talus Field" style="display:block;border:0;" />
            <div style="font-family:${serif};font-size:24px;color:#14110c;padding-top:12px;">The Talus Field</div>
            <div style="font-family:${sans};font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#50402e;padding-top:4px;">Trip Planner</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #2a2118;padding:24px 0 0;">
            <p style="font-family:${serif};font-size:17px;line-height:1.55;color:#14110c;margin:0 0 18px;">Your Yosemite trip, ${stopsLabel}.</p>
            <p style="margin:0 0 26px;">
              <a href="${tripUrl}" style="display:inline-block;padding:14px 22px;background:#14110c;color:#f1ead6;text-decoration:none;font-family:${sans};font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:13px;">
                Open the trip
              </a>
            </p>
            <p style="font-family:${serif};font-size:15px;line-height:1.55;color:#14110c;margin:0 0 22px;">The link keeps your stops in order. It works on any device.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0 0 6px;">Sunday Field Notes carries what changed in the park each week. You are on the list if you asked to be; nothing else follows from this email.</p>
            <p style="font-family:${sans};font-size:13px;color:#50402e;margin:0;">&mdash; Cory</p>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  const body: ResendBody = {
    from: CONTACT_FROM,
    to: [to],
    subject: 'Your Yosemite trip',
    text,
    html,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Guide waitlist request: a reader clicked "Put me on the wait-list" on the
// editorial /guide page. Goes to the operator inbox (same recipient as the
// contact form) with the reader's address as reply_to, so a one-tap reply
// reaches them the day the guide opens.
export async function sendWaitlistRequest(
  env: Env,
  args: { email: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { email } = args

  const text = [
    `New Field Guide waitlist request.`,
    ``,
    `${email} wants on the wait-list for the Field Guide.`,
    `Reply to this email to reach them the day it opens.`,
  ].join('\n')

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; line-height: 1.55; color: #14110c;">
      <p style="margin: 0 0 14px;"><strong>New Field Guide waitlist request.</strong></p>
      <p style="margin: 0 0 6px;"><strong>${escapeHtml(email)}</strong> wants on the wait-list for the Field Guide.</p>
      <p style="margin: 0; color: #50402e;">Reply to this email to reach them the day it opens.</p>
    </div>
  `.trim()

  const body: ResendBody = {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    subject: '[Talus Field] New Field Guide waitlist request',
    text,
    html,
    reply_to: email,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}

export async function sendContactMessage(
  env: Env,
  args: { name: string; email: string; subject: string; message: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { name, email, subject, message } = args

  const text = [
    `New contact-form message.`,
    ``,
    `From:    ${name} <${email}>`,
    `Subject: ${subject}`,
    ``,
    message,
  ].join('\n')

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; line-height: 1.55; color: #14110c;">
      <p style="margin: 0 0 14px;"><strong>New contact-form message.</strong></p>
      <p style="margin: 0 0 6px;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p style="margin: 0 0 18px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <pre style="white-space: pre-wrap; font-family: inherit; font-size: 15px; margin: 0; padding: 16px; background: #f7f1e1; border-left: 3px solid #14110c;">${escapeHtml(message)}</pre>
    </div>
  `.trim()

  const body: ResendBody = {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    subject: `[Talus Field contact] ${subject}`,
    text,
    html,
    reply_to: email,
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${detail}`)
  }
}
