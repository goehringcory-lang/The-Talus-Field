import type { Env } from '../env'

const FROM = 'The Field Guide <hello@thetalusfieldjournal.com>'

type ResendBody = {
  from: string
  to: string[]
  subject: string
  text: string
  html: string
}

export async function sendMagicLink(
  env: Env,
  args: { to: string; magicLink: string; code: string },
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const { to, magicLink, code } = args

  const text = [
    `Welcome to The Field Guide.`,
    ``,
    `Tap to open the app on this device:`,
    magicLink,
    ``,
    `Setting up a second device? Use this 6-digit code at`,
    `${new URL(magicLink).origin}/login`,
    ``,
    `    ${code}`,
    ``,
    `Both keep working for 18 months.`,
    `— Cory`,
  ].join('\n')

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; line-height: 1.55; color: #14110c;">
      <p style="margin: 0 0 18px;">Welcome to <strong>The Field Guide</strong>.</p>
      <p style="margin: 0 0 14px;">Tap to open the app on this device:</p>
      <p style="margin: 0 0 24px;">
        <a href="${magicLink}" style="display:inline-block;padding:14px 22px;background:#14110c;color:#f1ead6;text-decoration:none;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;font-size:13px;">
          Open the guide
        </a>
      </p>
      <p style="margin: 0 0 8px;">Setting up a second device? Use this 6-digit code at <a href="${new URL(magicLink).origin}/login">${new URL(magicLink).origin}/login</a>:</p>
      <p style="margin: 0 0 24px; font-family: ui-monospace, monospace; font-size: 28px; letter-spacing: 0.3em;">${code}</p>
      <p style="margin: 0 0 6px; color: #6e5c43; font-size: 13px;">Both keep working for 18 months.</p>
      <p style="margin: 0; color: #6e5c43; font-size: 13px;">— Cory</p>
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
