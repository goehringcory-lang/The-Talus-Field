// End-to-end smoke of the paid-guide flow, driving the real Worker app
// in-process with mocked KV + stubbed Stripe/Resend network calls.
import worker from '../src/index'
import { sweepRenewals } from '../src/lib/renewals'

// ---------- mocks ----------
class MockKV {
  store = new Map<string, string>()
  async get(key: string) { return this.store.get(key) ?? null }
  async put(key: string, value: string, _opts?: unknown) { this.store.set(key, value) }
  async delete(key: string) { this.store.delete(key) }
  // Single-page prefix listing: enough for the renewal sweep, which only uses
  // { prefix } and follows cursors that never appear here.
  async list(opts: { prefix?: string; cursor?: string } = {}) {
    const keys = [...this.store.keys()]
      .filter((k) => !opts.prefix || k.startsWith(opts.prefix))
      .sort()
      .map((name) => ({ name }))
    return { keys, list_complete: true as const }
  }
}

const buyers = new MockKV()
const programsKv = new MockKV()

const env: Record<string, unknown> = {
  GUIDE_BUYERS: buyers,
  GUIDE_PROGRAMS: programsKv,
  APP_BASE_URL: 'https://talus-field-guide.pages.dev',
  EDITORIAL_BASE_URL: 'https://thetalusfieldjournal.com',
  GUIDE_PRICE_CENTS: '399',
  GUIDE_RENEWAL_PRICE_CENTS: '249',
  GUIDE_PRODUCT_TAG: 'field_guide_2026',
  GUIDE_MONTHLY_CAP: '100',
  STRIPE_SECRET_KEY: 'sk_test_dummy',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_dummy_secret',
  MAGIC_LINK_SIGNING_SECRET: 'test-signing-secret',
  RESEND_API_KEY: 're_test_dummy',
  PROMO_CODES: 'TALUS30:30',
}

const ctx = { waitUntil(_p: Promise<unknown>) {}, passThroughOnException() {} } as ExecutionContext

// Capture outbound calls; fail on anything unexpected.
let stripeCreateParams: URLSearchParams | null = null
let sentEmails: { to: string; text: string; html: string }[] = []
let resendMode: 'ok' | 'fail' = 'ok'
// Retrieve responses for /api/checkout/claim's GET, keyed by session id.
const stripeSessions = new Map<string, Record<string, unknown>>()
let npsAlertCalls = 0

const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  // Order matters: the retrieve URL shares the create URL's prefix.
  if (url.startsWith('https://api.stripe.com/v1/checkout/sessions/')) {
    const id = decodeURIComponent(url.slice('https://api.stripe.com/v1/checkout/sessions/'.length))
    const session = stripeSessions.get(id)
    if (!session) {
      return new Response(JSON.stringify({ error: { type: 'invalid_request_error' } }), {
        status: 404, headers: { 'content-type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(session), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  if (url.startsWith('https://api.stripe.com/v1/checkout/sessions')) {
    stripeCreateParams = new URLSearchParams(String(init?.body))
    return new Response(JSON.stringify({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' }), {
      status: 200, headers: { 'content-type': 'application/json' },
    })
  }
  if (url.startsWith('https://npsvms-')) {
    // NPS S3 waits.json: a Range request answered with the summary head.
    return new Response(
      JSON.stringify({
        summary: [
          { pair_name: 'South Entrance Wait Time', current_wait_minutes: 12.4 },
          { pair_name: 'Arch Rock Wait Time', current_wait_minutes: 3, stale: true },
        ],
        history: [],
      }),
      { status: 206, headers: { 'content-type': 'application/json' } },
    )
  }
  if (url.startsWith('https://developer.nps.gov/api/v1/alerts')) {
    npsAlertCalls++
    return new Response(
      JSON.stringify({
        data: [
          { id: 'A1', title: 'Tioga Road is closed for the season', description: 'The road over Tioga Pass is closed.', category: 'Park Closure', url: 'https://www.nps.gov/yose/alert1' },
          { id: 'A2', title: 'Carry tire chains', description: 'Chains may be required on all park roads.', category: 'Information', url: '' },
          { id: 'A3', title: 'Trail conditions update', description: 'Expect ice on shaded trails.', category: 'Caution' },
        ],
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  if (url.startsWith('https://www.airnowapi.org/aq/observation/latLong/current/')) {
    return new Response(
      JSON.stringify([
        { DateObserved: '2026-07-30', HourObserved: 8, ReportingArea: 'Mariposa', ParameterName: 'O3', AQI: 42, Category: { Number: 1, Name: 'Good' } },
        { DateObserved: '2026-07-30', HourObserved: 8, ReportingArea: 'Mariposa', ParameterName: 'PM2.5', AQI: 158, Category: { Number: 4, Name: 'Unhealthy' } },
      ]),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  if (url.startsWith('https://waterservices.usgs.gov/nwis/iv/')) {
    return new Response(
      JSON.stringify({
        value: { timeSeries: [{ values: [{ value: [
          { value: '520', dateTime: '2026-07-30T06:00:00.000-07:00' },
          { value: '410', dateTime: '2026-07-30T07:00:00.000-07:00' },
        ] }] }] },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  if (url.startsWith('https://api.resend.com/emails')) {
    if (resendMode === 'fail') return new Response('boom', { status: 500 })
    const body = JSON.parse(String(init?.body))
    sentEmails.push({ to: body.to[0], text: body.text, html: body.html })
    return new Response(JSON.stringify({ id: 'email_1' }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  throw new Error(`unexpected outbound fetch: ${url}`)
}) as typeof fetch

async function call(path: string, init?: RequestInit) {
  const req = new Request(`https://api.thetalusfieldjournal.com${path}`, init)
  const res = await worker.fetch(req, env as never, ctx)
  const text = await res.text()
  let json: unknown = null
  try { json = JSON.parse(text) } catch { /* not json */ }
  return { status: res.status, json: json as Record<string, unknown>, text }
}

async function signWebhook(rawBody: string, secret: string, timestamp = Math.floor(Date.now() / 1000)) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${rawBody}`))
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `t=${timestamp},v1=${hex}`
}

let failures = 0
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) { console.log(`  ok  ${name}`) }
  else { failures++; console.log(`FAIL  ${name}${detail !== undefined ? ` :: ${JSON.stringify(detail)}` : ''}`) }
}

// ---------- the flow ----------
console.log('\n1. inventory + price')
{
  const r = await call('/api/inventory')
  check('inventory 200', r.status === 200, r)
  check('price is 399', r.json.priceCents === 399, r.json)
  check('sold 0 / cap 100', r.json.sold === 0 && r.json.cap === 100, r.json)
}

console.log('\n2. checkout start')
{
  const r = await call('/api/checkout/start', { method: 'POST' })
  check('returns stripe url', r.status === 200 && r.json.url === 'https://checkout.stripe.com/c/pay/cs_test_123', r)
  const p = stripeCreateParams!
  check('mode=payment', p.get('mode') === 'payment')
  check('amount 399', p.get('line_items[0][price_data][unit_amount]') === '399')
  check('product tag in metadata', p.get('metadata[product]') === 'field_guide_2026')
  check('success url back to /guide with the session id for instant access',
    p.get('success_url') === 'https://thetalusfieldjournal.com/guide?guide=success&session_id={CHECKOUT_SESSION_ID}')
}

console.log('\n3. webhook rejects bad/missing signatures')
{
  const body = JSON.stringify({ id: 'evt_bad', type: 'checkout.session.completed', data: { object: {} } })
  const r1 = await call('/api/stripe/webhook', { method: 'POST', body })
  check('no signature -> 400', r1.status === 400, r1)
  const r2 = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=${'0'.repeat(64)}` } })
  check('forged signature -> 400', r2.status === 400, r2)
  const stale = await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string, Math.floor(Date.now() / 1000) - 3600)
  const r3 = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': stale } })
  check('stale timestamp -> 400', r3.status === 400, r3)
}

console.log('\n4. webhook ignores other products')
{
  const body = JSON.stringify({
    id: 'evt_other_product', type: 'checkout.session.completed',
    data: { object: { id: 'cs_x', customer_details: { email: 'donor@example.com' }, metadata: { product: 'print_sale' }, created: Math.floor(Date.now() / 1000) } },
  })
  const r = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('wrong product ignored', r.status === 200 && r.json.ignored === 'wrong product', r)
  check('no buyer provisioned', (await buyers.get('buyer:donor@example.com')) === null)
}

console.log('\n5. real purchase webhook -> buyer + email')
const purchase = {
  id: 'evt_purchase_1', type: 'checkout.session.completed',
  data: { object: { id: 'cs_test_123', customer_details: { email: 'Hiker@Example.com' }, metadata: { product: 'field_guide_2026' }, created: Math.floor(Date.now() / 1000) } },
}
{
  const body = JSON.stringify(purchase)
  const r = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('webhook 200', r.status === 200 && r.json.received === true, r)
  check('buyer record exists (email lowercased)', (await buyers.get('buyer:hiker@example.com')) !== null)
  check('one provisioning email sent', sentEmails.length === 1 && sentEmails[0].to === 'hiker@example.com', sentEmails)
  const inv = await call('/api/inventory')
  check('inventory incremented', inv.json.sold === 1, inv.json)
}

console.log('\n6. webhook replay is deduped')
{
  const body = JSON.stringify(purchase)
  const r = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('replay -> deduped', r.status === 200 && r.json.deduped === true, r)
  check('no second email', sentEmails.length === 1)
  const inv = await call('/api/inventory')
  check('inventory not double-counted', inv.json.sold === 1, inv.json)
}

// pull the token + code out of the sent email, like a buyer would
const emailText = sentEmails[0].text
const token = /token=([0-9a-f]{64})/.exec(emailText)?.[1]
const code = /^\s{4}(\d{6})\s*$/m.exec(emailText)?.[1]

console.log('\n7. magic-link exchange')
{
  check('email contains 64-hex token', !!token, emailText)
  check('email contains 6-digit code', !!code, emailText)
  const r = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token }) })
  check('exchange -> jwt', r.status === 200 && typeof r.json.jwt === 'string', r)
  const claims = JSON.parse(Buffer.from(String(r.json.jwt).split('.')[1], 'base64url').toString())
  check('jwt sub = buyer email', claims.sub === 'hiker@example.com', claims)
  const hikerRec = JSON.parse((await buyers.get('buyer:hiker@example.com'))!)
  check('jwt exp = buyer expiresAt (full access window)', claims.exp === hikerRec.expiresAt, { exp: claims.exp, expiresAt: hikerRec.expiresAt })
  const bad = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: 'f'.repeat(64) }) })
  check('unknown token -> 401', bad.status === 401, bad)
}

console.log('\n8. email + code login (second device)')
{
  const r = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'HIKER@example.com', code }) })
  check('login -> jwt', r.status === 200 && typeof r.json.jwt === 'string', r)
  const wrong = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com', code: '000000' }) })
  check('wrong code -> 401', wrong.status === 401, wrong)
}

console.log('\n9. login rate limit')
{
  let last: Awaited<ReturnType<typeof call>> | null = null
  for (let i = 0; i < 6; i++) {
    last = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'brute@example.com', code: '123456' }) })
  }
  check('6th attempt -> 429', last!.status === 429, last)
}

console.log('\n10. expired access is refused')
{
  const now = Math.floor(Date.now() / 1000)
  const rec = { email: 'expired@example.com', purchasedAt: now - 600 * 86400, expiresAt: now - 60 * 86400, accessToken: 'a'.repeat(64), accessCode: '111111' }
  await buyers.put('buyer:expired@example.com', JSON.stringify(rec))
  await buyers.put(`token:${rec.accessToken}`, rec.email)
  const login = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: rec.email, code: rec.accessCode }) })
  check('expired login -> 401', login.status === 401 && String(login.json.error).includes('expired'), login)
  const ex = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: rec.accessToken }) })
  check('expired exchange -> 401', ex.status === 401, ex)
}

console.log('\n11. email delivery failure -> 500, retry not blocked')
{
  resendMode = 'fail'
  const evt = { ...purchase, id: 'evt_purchase_2', data: { object: { ...purchase.data.object, id: 'cs_test_456', customer_details: { email: 'retry@example.com' } } } }
  const body = JSON.stringify(evt)
  const sig = await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string)
  const r = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': sig } })
  check('email failure -> 500 (stripe will retry)', r.status === 500, r)
  check('buyer still provisioned', (await buyers.get('buyer:retry@example.com')) !== null)
  resendMode = 'ok'
  const r2 = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': sig } })
  check('stripe retry succeeds, not deduped', r2.status === 200 && r2.json.received === true && !r2.json.deduped, r2)
  check('retry email delivered', sentEmails.some((e) => e.to === 'retry@example.com'))
}

console.log('\n12. monthly cap fails closed / sells out')
{
  const month = new Date().toISOString().slice(0, 7)
  await buyers.put(`inventory:${month}`, '100')
  const r = await call('/api/checkout/start', { method: 'POST' })
  check('sold out -> 409', r.status === 409 && r.json.soldOut === true, r)
  await buyers.put(`inventory:${month}`, '2')
  const badCap = { ...env, GUIDE_MONTHLY_CAP: 'oops' }
  const req = new Request('https://api.thetalusfieldjournal.com/api/checkout/start', { method: 'POST' })
  const res = await worker.fetch(req, badCap as never, ctx)
  check('garbled cap fails closed -> 500', res.status === 500)
}

console.log('\n13. /api/auth/me')
let hikerJwt = ''
{
  const login = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com', code }) })
  hikerJwt = String(login.json.jwt)
  const me = await call('/api/auth/me', { headers: { authorization: `Bearer ${hikerJwt}` } })
  check('me -> buyer identity', me.status === 200 && me.json.kind === 'buyer' && me.json.email === 'hiker@example.com', me)
  check('me carries expiresAt, not expired', typeof me.json.expiresAt === 'number' && me.json.expired === false, me.json)
  const noToken = await call('/api/auth/me')
  check('me without token -> 401', noToken.status === 401, noToken)
  const garbage = await call('/api/auth/me', { headers: { authorization: 'Bearer not.a.jwt' } })
  check('me with garbage token -> 401', garbage.status === 401, garbage)
}

console.log('\n14. resend access email')
{
  const before = sentEmails.length
  const r1 = await call('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email: 'Hiker@Example.com' }) })
  check('resend -> 200 + email re-sent', r1.status === 200 && r1.json.ok === true && sentEmails.length === before + 1, { status: r1.status, sent: sentEmails.length - before })
  check('resent email carries same token', sentEmails[sentEmails.length - 1].text.includes(token!), sentEmails[sentEmails.length - 1].text)

  const unknown = await call('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email: 'stranger@example.com' }) })
  check('unknown email -> 200 (no enumeration), nothing sent', unknown.status === 200 && unknown.json.ok === true && sentEmails.length === before + 1, unknown)

  // Cap is 3/email/hour: attempts 2 and 3 send, the 4th is silently dropped.
  await call('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com' }) })
  await call('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com' }) })
  const overCap = await call('/api/auth/resend', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com' }) })
  check('over-cap resend -> still 200, no 4th email', overCap.status === 200 && overCap.json.ok === true && sentEmails.length === before + 3, { sent: sentEmails.length - before })
}

console.log('\n15. refund revokes access')
{
  // A refund of some OTHER product sold through the same Stripe account must
  // not revoke guide access, even when the billing email matches a buyer.
  const otherProduct = {
    id: 'evt_refund_other', type: 'charge.refunded',
    data: { object: { id: 'ch_print_1', billing_details: { email: 'Hiker@Example.com' }, metadata: { product: 'print_sale' } } },
  }
  const opBody = JSON.stringify(otherProduct)
  const op = await call('/api/stripe/webhook', { method: 'POST', body: opBody, headers: { 'stripe-signature': await signWebhook(opBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('other-product refund ignored', op.status === 200 && op.json.ignored === 'refund for other product', op)
  const stillIn = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com', code }) })
  check('buyer keeps access after unrelated refund', stillIn.status === 200 && typeof stillIn.json.jwt === 'string', stillIn)

  // Guide charges carry the product tag (createCheckoutSession sets it in
  // payment_intent_data metadata, which Stripe copies onto the charge).
  const refund = {
    id: 'evt_refund_1', type: 'charge.refunded',
    data: { object: { id: 'ch_test_123', billing_details: { email: 'Hiker@Example.com' }, metadata: { product: 'field_guide_2026' } } },
  }
  const body = JSON.stringify(refund)
  const r = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('refund webhook -> revoked', r.status === 200 && r.json.revoked === 'hiker@example.com', r)

  const login = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'hiker@example.com', code }) })
  check('refunded login -> 401 expired', login.status === 401 && String(login.json.error).includes('expired'), login)
  const ex = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token }) })
  check('refunded exchange -> 401', ex.status === 401, ex)
  const me = await call('/api/auth/me', { headers: { authorization: `Bearer ${hikerJwt}` } })
  check('me on already-issued jwt reports expired', me.status === 200 && me.json.expired === true, me.json)

  const orphan = {
    id: 'evt_refund_2', type: 'charge.refunded',
    data: { object: { id: 'ch_test_456', billing_details: { email: 'nobody@example.com' }, metadata: { product: 'field_guide_2026' } } },
  }
  const ob = JSON.stringify(orphan)
  const r2 = await call('/api/stripe/webhook', { method: 'POST', body: ob, headers: { 'stripe-signature': await signWebhook(ob, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('refund for unknown buyer -> acknowledged, flagged', r2.status === 200 && r2.json.ignored === 'refund for unknown buyer', r2)
}

console.log('\n16. gift purchase flow')
{
  // Checkout start: the gift body flows into session metadata on both the
  // session and the payment intent (so refunds carry it on the charge).
  const start = await call('/api/checkout/start', {
    method: 'POST',
    body: JSON.stringify({ gift: true, recipientEmail: 'Friend@Example.com', giftNote: 'See you at Tunnel View' }),
  })
  check('gift checkout start -> stripe url', start.status === 200 && !!start.json.url, start)
  const p = stripeCreateParams!
  check('gift kind in metadata', p.get('metadata[kind]') === 'gift')
  check('recipient in metadata (lowercased)', p.get('metadata[recipientEmail]') === 'friend@example.com')
  check('gift metadata mirrored onto payment intent', p.get('payment_intent_data[metadata][recipientEmail]') === 'friend@example.com')
  check('product tag not overridable', p.get('metadata[product]') === 'field_guide_2026')
  check('gift success url', p.get('success_url') === 'https://thetalusfieldjournal.com/guide?guide=gift-success')

  const bad = await call('/api/checkout/start', {
    method: 'POST',
    body: JSON.stringify({ gift: true, recipientEmail: 'not-an-email' }),
  })
  check('gift without valid recipient -> 400', bad.status === 400, bad)

  const empty = await call('/api/checkout/start', { method: 'POST', body: '' })
  check('empty body still works (plain purchase)', empty.status === 200 && !!empty.json.url, empty)

  // Gift webhook: the RECIPIENT gets provisioned, the payer gets a receipt,
  // and the user-supplied note is escaped in the HTML body.
  const before = sentEmails.length
  const gift = {
    id: 'evt_gift_1', type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_gift_1',
        customer_details: { email: 'Payer@Example.com' },
        metadata: {
          product: 'field_guide_2026',
          kind: 'gift',
          recipientEmail: 'friend@example.com',
          giftNote: '<script>alert(1)</script> happy trails',
        },
        created: Math.floor(Date.now() / 1000),
      },
    },
  }
  const gBody = JSON.stringify(gift)
  const g = await call('/api/stripe/webhook', { method: 'POST', body: gBody, headers: { 'stripe-signature': await signWebhook(gBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('gift webhook 200', g.status === 200 && g.json.received === true, g)
  check('recipient provisioned', (await buyers.get('buyer:friend@example.com')) !== null)
  check('payer NOT provisioned', (await buyers.get('buyer:payer@example.com')) === null)
  check('two emails: access to recipient, receipt to payer',
    sentEmails.length === before + 2 &&
    sentEmails[before].to === 'friend@example.com' &&
    sentEmails[before + 1].to === 'payer@example.com',
    sentEmails.slice(before).map((e) => e.to))
  check('gift note escaped in html', sentEmails[before].html.includes('&lt;script&gt;') && !sentEmails[before].html.includes('<script>'))
  const friendRec1 = JSON.parse((await buyers.get('buyer:friend@example.com'))!)
  const friendToken = /token=([0-9a-f]{64})/.exec(sentEmails[before].text)?.[1]
  check('gift access email carries the recipient token', friendToken === friendRec1.accessToken)

  // Gifting an active buyer extends the window and keeps token + code.
  const gift2 = { ...gift, id: 'evt_gift_2', data: { object: { ...gift.data.object, id: 'cs_gift_2' } } }
  const g2Body = JSON.stringify(gift2)
  const g2 = await call('/api/stripe/webhook', { method: 'POST', body: g2Body, headers: { 'stripe-signature': await signWebhook(g2Body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('second gift webhook 200', g2.status === 200 && g2.json.received === true, g2)
  const friendRec2 = JSON.parse((await buyers.get('buyer:friend@example.com'))!)
  check('active recipient extended, not clobbered',
    friendRec2.expiresAt === friendRec1.expiresAt + 60 * 60 * 24 * 548 &&
    friendRec2.accessToken === friendRec1.accessToken &&
    friendRec2.accessCode === friendRec1.accessCode,
    { first: friendRec1.expiresAt, second: friendRec2.expiresAt })

  // A gift refund revokes the recipient (charge metadata names them), not the payer.
  const giftRefund = {
    id: 'evt_gift_refund', type: 'charge.refunded',
    data: { object: { id: 'ch_gift_1', billing_details: { email: 'Payer@Example.com' }, metadata: { product: 'field_guide_2026', kind: 'gift', recipientEmail: 'friend@example.com' } } },
  }
  const grBody = JSON.stringify(giftRefund)
  const gr = await call('/api/stripe/webhook', { method: 'POST', body: grBody, headers: { 'stripe-signature': await signWebhook(grBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('gift refund revokes the recipient', gr.status === 200 && gr.json.revoked === 'friend@example.com', gr)
  const friendRec3 = JSON.parse((await buyers.get('buyer:friend@example.com'))!)
  check('recipient record expired + refund-stamped', friendRec3.refundedAt > 0 && friendRec3.expiresAt <= Math.floor(Date.now() / 1000))
}

console.log('\n17. renewal arc')
{
  const now = Math.floor(Date.now() / 1000)
  const seedBuyer = async (email: string, daysLeft: number, token: string, code: string) => {
    const rec = {
      email, purchasedAt: now - 100 * 86400, expiresAt: now + daysLeft * 86400,
      accessToken: token, accessCode: code,
    }
    await buyers.put(`buyer:${email}`, JSON.stringify(rec))
    await buyers.put(`token:${token}`, email)
    return rec
  }

  // -- JWT-gated POST /renew bypasses the monthly cap --
  const renewer = await seedBuyer('renewer@example.com', 200, 'b'.repeat(64), '222222')
  const month = new Date().toISOString().slice(0, 7)
  await buyers.put(`inventory:${month}`, '100') // sold out
  const soldOut = await call('/api/checkout/start', { method: 'POST' })
  check('sanity: /start is sold out', soldOut.status === 409, soldOut)
  const login = await call('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: 'renewer@example.com', code: '222222' }) })
  const jwt = String(login.json.jwt)
  const noAuth = await call('/api/checkout/renew', { method: 'POST' })
  check('renew without jwt -> 401', noAuth.status === 401, noAuth)
  const renew = await call('/api/checkout/renew', { method: 'POST', headers: { authorization: `Bearer ${jwt}` } })
  check('renew bypasses the cap -> stripe url', renew.status === 200 && !!renew.json.url, renew)
  const p = stripeCreateParams!
  check('renewal kind + renewEmail in metadata', p.get('metadata[kind]') === 'renewal' && p.get('metadata[renewEmail]') === 'renewer@example.com')
  check('renewal price 249', p.get('line_items[0][price_data][unit_amount]') === '249')
  check('customer email prefilled', p.get('customer_email') === 'renewer@example.com')
  check('renewal success url lands on /account', p.get('success_url') === 'https://talus-field-guide.pages.dev/account?renew=success')

  // -- token GET path (email CTA): 302 into Stripe; bad tokens rejected --
  const redirectReq = new Request(`https://api.thetalusfieldjournal.com/api/checkout/renew?token=${'b'.repeat(64)}`)
  const redirectRes = await worker.fetch(redirectReq, env as never, ctx)
  check('token renew link -> 302 to stripe', redirectRes.status === 302 && (redirectRes.headers.get('location') ?? '').startsWith('https://checkout.stripe.com/'), redirectRes.status)
  check('token GET success url returns through /open with the token', stripeCreateParams!.get('success_url') === `https://talus-field-guide.pages.dev/open?token=${'b'.repeat(64)}&renew=success`)
  const unknownTok = await call(`/api/checkout/renew?token=${'e'.repeat(64)}`)
  check('unknown token -> 404', unknownTok.status === 404, unknownTok)
  const badTok = await call('/api/checkout/renew?token=nope')
  check('malformed token -> 400', badTok.status === 400, badTok)

  // -- renewal webhook: extends, keeps token+code, skips inventory --
  const invBefore = await buyers.get(`inventory:${month}`)
  const renewalEvt = {
    id: 'evt_renew_1', type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_renew_1',
        customer_details: { email: 'renewer@example.com' },
        metadata: { product: 'field_guide_2026', kind: 'renewal', renewEmail: 'renewer@example.com' },
        created: now,
      },
    },
  }
  const rBody = JSON.stringify(renewalEvt)
  const emailsBefore = sentEmails.length
  const r = await call('/api/stripe/webhook', { method: 'POST', body: rBody, headers: { 'stripe-signature': await signWebhook(rBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('renewal webhook 200', r.status === 200 && r.json.received === true, r)
  const renewedRec = JSON.parse((await buyers.get('buyer:renewer@example.com'))!)
  check('expiry extended from current expiry (early renewal stacks)',
    renewedRec.expiresAt === renewer.expiresAt + 60 * 60 * 24 * 548,
    { before: renewer.expiresAt, after: renewedRec.expiresAt })
  check('token and code survive renewal', renewedRec.accessToken === renewer.accessToken && renewedRec.accessCode === renewer.accessCode)
  check('inventory untouched by renewal', (await buyers.get(`inventory:${month}`)) === invBefore)
  check('renewal confirmation email sent', sentEmails.length === emailsBefore + 1 && sentEmails[emailsBefore].to === 'renewer@example.com')

  // -- a refunded buyer who pays for a renewal gets access back --
  const friendBefore = JSON.parse((await buyers.get('buyer:friend@example.com'))!)
  check('sanity: friend is refunded', friendBefore.refundedAt > 0)
  const rescueEvt = {
    id: 'evt_renew_2', type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_renew_2',
        customer_details: { email: 'friend@example.com' },
        metadata: { product: 'field_guide_2026', kind: 'renewal', renewEmail: 'friend@example.com' },
        created: now,
      },
    },
  }
  const resBody = JSON.stringify(rescueEvt)
  const r2 = await call('/api/stripe/webhook', { method: 'POST', body: resBody, headers: { 'stripe-signature': await signWebhook(resBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('post-refund renewal webhook 200', r2.status === 200, r2)
  const friendAfter = JSON.parse((await buyers.get('buyer:friend@example.com'))!)
  check('refund stamp cleared, ~548d granted from now',
    friendAfter.refundedAt === undefined &&
    Math.abs(friendAfter.expiresAt - (now + 60 * 60 * 24 * 548)) < 60,
    friendAfter)
  const ex = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: friendAfter.accessToken }) })
  check('rescued buyer can sign in again', ex.status === 200 && typeof ex.json.jwt === 'string', ex)
}

console.log('\n18. renewal sweep (cron)')
{
  const now = Math.floor(Date.now() / 1000)
  const expiring = {
    email: 'expiring@example.com', purchasedAt: now - 518 * 86400, expiresAt: now + 30 * 86400,
    accessToken: 'c'.repeat(64), accessCode: '333333',
  }
  await buyers.put('buyer:expiring@example.com', JSON.stringify(expiring))
  await buyers.put(`token:${expiring.accessToken}`, expiring.email)
  await buyers.put('buyer:corrupt@example.com', 'not json {')

  const before = sentEmails.length
  const hikerEmailsBefore = sentEmails.filter((e) => e.to === 'hiker@example.com').length
  await sweepRenewals(env as never)
  const noticed = sentEmails.slice(before)
  check('exactly one notice sent', noticed.length === 1 && noticed[0].to === 'expiring@example.com', noticed.map((e) => e.to))
  check('notice carries the token renew link', noticed[0]?.text.includes(`/api/checkout/renew?token=${'c'.repeat(64)}`))
  check('t60 sentinel written', (await buyers.get('renewalNotice:expiring@example.com:t60')) === '1')
  check('refunded buyer got no notice', sentEmails.filter((e) => e.to === 'hiker@example.com').length === hikerEmailsBefore)

  await sweepRenewals(env as never)
  check('second sweep sends nothing (sentinel)', sentEmails.length === before + 1, sentEmails.length - before)
}

console.log('\n19. conditions widget')
{
  await programsKv.put('weather:v1', JSON.stringify({
    fetchedAt: new Date().toISOString(),
    spots: [{
      id: 'valley', label: 'Yosemite Valley', elevationFt: 3966,
      updatedAt: new Date().toISOString(),
      periods: [
        { name: 'Today', startTime: '2026-07-16T06:00:00-07:00', isDaytime: true, tempF: 88, shortForecast: 'Sunny', precipChance: 0, windSpeed: '5 mph' },
        { name: 'Tonight', startTime: '2026-07-16T18:00:00-07:00', isDaytime: false, tempF: 55, shortForecast: 'Clear', precipChance: 0, windSpeed: '5 mph' },
        { name: 'Friday', startTime: '2026-07-17T06:00:00-07:00', isDaytime: true, tempF: 91, shortForecast: 'Mostly Sunny', precipChance: 10, windSpeed: '5 mph' },
      ],
    }],
  }))

  const req = new Request('https://api.thetalusfieldjournal.com/widget/conditions')
  const res = await worker.fetch(req, env as never, ctx)
  const body = JSON.parse(await res.text()) as { waits: Array<{ name: string; minutes: number | null }>; forecast: Array<{ day: string; hi: number; lo: number | null; short: string }> }
  check('widget conditions 200 with CORS *', res.status === 200 && res.headers.get('access-control-allow-origin') === '*')
  check('widget conditions edge-cacheable', (res.headers.get('cache-control') ?? '').includes('max-age=300'))
  check('waits parsed from the S3 summary (short names, stale -> null)',
    body.waits.length === 2 &&
    body.waits[0].name === 'South' && body.waits[0].minutes === 12 &&
    body.waits[1].name === 'Arch Rock' && body.waits[1].minutes === null,
    body.waits)
  check('forecast folded into calendar days',
    body.forecast.length === 2 &&
    body.forecast[0].hi === 88 && body.forecast[0].lo === 55 && body.forecast[0].short === 'Sunny' &&
    body.forecast[1].hi === 91 && body.forecast[1].lo === null,
    body.forecast)

  const jsReq = new Request('https://api.thetalusfieldjournal.com/widget.js')
  const jsRes = await worker.fetch(jsReq, env as never, ctx)
  const js = await jsRes.text()
  check('widget.js served as javascript', jsRes.status === 200 && (jsRes.headers.get('content-type') ?? '').includes('javascript'))
  check('widget.js carries the mandatory backlink', js.includes('https://thetalusfieldjournal.com/conditions?utm_source=widget'))
  check('widget.js fails silent (no error rendering)', js.includes('render nothing'))
}

console.log('\n20. conditions feeds (/api/alerts, /api/air, /api/flow)')
{
  // env has no NPS_API_KEY yet: the route must serve the empty shape, not an
  // error, and must not fire a doomed upstream call on every request.
  const npsCallsBefore = npsAlertCalls
  const alertsUnkeyed = await call('/api/alerts')
  check('alerts without key -> 200, no upstream call',
    alertsUnkeyed.status === 200 && npsAlertCalls === npsCallsBefore, alertsUnkeyed.json)

  env.NPS_API_KEY = 'nps_test_dummy'
  const a = await call('/api/alerts')
  check('alerts 200', a.status === 200 && a.json !== null)
  const alertsBody = a.json as { alerts: Array<{ category: string }>; roads: Array<{ id: string; status: string }>; chains: string | null }
  check('closure sorted first', alertsBody.alerts[0]?.category === 'closure', alertsBody.alerts)
  const tioga = alertsBody.roads.find((r) => r.id === 'tioga')
  check('tioga derived closed', tioga?.status === 'closed', alertsBody.roads)
  check('other roads unknown, never open by silence',
    alertsBody.roads.filter((r) => r.id !== 'tioga').every((r) => r.status === 'unknown'),
    alertsBody.roads)
  check('chains notice derived', alertsBody.chains === 'Carry tire chains', alertsBody.chains)

  // env has no AIRNOW_API_KEY yet: the route must serve nulls, not an error.
  const airUnkeyed = await call('/api/air')
  check('air without key serves nulls', airUnkeyed.status === 200 && airUnkeyed.json.aqi === null, airUnkeyed.json)

  env.AIRNOW_API_KEY = 'airnow_test_dummy'
  const air = await call('/api/air')
  check('air 200 with worst observation', air.status === 200 && air.json.aqi === 158, air.json)
  check('air pollutant + category from the max-AQI row',
    air.json.pollutant === 'PM2.5' && air.json.category === 'Unhealthy', air.json)
  delete env.AIRNOW_API_KEY

  const f = await call('/api/flow')
  check('flow 200 with latest reading', f.status === 200 && f.json.cfs === 410, f.json)
  check('cfs mapped to band', f.json.band === 'strong', f.json)
}

console.log('\n21. promo-code redemption (/api/redeem)')
{
  const now = Math.floor(Date.now() / 1000)
  const month = new Date().toISOString().slice(0, 7)
  // Distinct per-arc IPs: the test's default 'unknown' IP would pool every
  // POST below into one 10/hour bucket and trip the cap mid-section.
  const redeemCall = (ip: string, body: Record<string, unknown>) =>
    call('/api/redeem', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'cf-connecting-ip': ip },
    })

  // -- refusals send nothing and write nothing --
  const unknown = await redeemCall('9.9.9.1', { email: 'stranger2@example.com', code: 'NOPE30' })
  check('unknown code -> 404', unknown.status === 404, unknown)
  check('unknown code leaves no record', (await buyers.get('buyer:stranger2@example.com')) === null)
  const potBefore = sentEmails.length
  const pot = await redeemCall('9.9.9.1', { email: 'bot@example.com', code: 'TALUS30', website: 'http://spam' })
  check('honeypot -> fake 200, nothing sent or written',
    pot.status === 200 && pot.json.ok === true && sentEmails.length === potBefore &&
    (await buyers.get('buyer:bot@example.com')) === null, pot)
  const badEmail = await redeemCall('9.9.9.1', { email: 'not-an-email', code: 'TALUS30' })
  check('bad email -> 400', badEmail.status === 400, badEmail)

  // -- happy path: lowercased code, 30-day record, email carries the keys --
  const invBefore = await buyers.get(`inventory:${month}`)
  const emailsBefore = sentEmails.length
  const r1 = await redeemCall('9.9.9.2', { email: 'Reader@Example.com', code: ' talus30 ' })
  check('redeem -> 200 (code case/space-insensitive)', r1.status === 200 && r1.json.ok === true, r1)
  const rec1 = JSON.parse((await buyers.get('buyer:reader@example.com'))!)
  check('record carries promoCode + ~30-day expiry',
    rec1.promoCode === 'TALUS30' && Math.abs(rec1.expiresAt - (now + 30 * 86400)) < 60, rec1)
  check('redemption sentinel written', (await buyers.get('promoRedeemed:TALUS30:reader@example.com')) === '1')
  check('inventory untouched by redemption', (await buyers.get(`inventory:${month}`)) === invBefore)
  const trialEmail = sentEmails[sentEmails.length - 1]
  check('trial email sent with token, code, and end date',
    sentEmails.length === emailsBefore + 1 && trialEmail.to === 'reader@example.com' &&
    trialEmail.text.includes(rec1.accessToken) && trialEmail.text.includes(rec1.accessCode) &&
    trialEmail.text.includes('through'), trialEmail?.text)
  const ex = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: rec1.accessToken }) })
  check('trial magic link exchanges into a jwt', ex.status === 200 && typeof ex.json.jwt === 'string', ex)

  // -- re-redeeming while active re-sends, never clobbers --
  const r2 = await redeemCall('9.9.9.2', { email: 'reader@example.com', code: 'TALUS30' })
  const resent = sentEmails[sentEmails.length - 1]
  check('active re-redeem -> 200, same token re-sent',
    r2.status === 200 && resent.to === 'reader@example.com' && resent.text.includes(rec1.accessToken), r2)
  const rec2 = JSON.parse((await buyers.get('buyer:reader@example.com'))!)
  check('record not extended or regenerated',
    rec2.expiresAt === rec1.expiresAt && rec2.accessCode === rec1.accessCode, rec2)

  // -- renewal sweep: no "ends in two months" on day one, t14/t1 still fire --
  const sweepBefore = sentEmails.length
  await sweepRenewals(env as never)
  check('sweep skips t60 for the 30-day promo record',
    sentEmails.slice(sweepBefore).every((e) => e.to !== 'reader@example.com'),
    sentEmails.slice(sweepBefore).map((e) => e.to))
  await buyers.put('buyer:reader@example.com', JSON.stringify({ ...rec2, expiresAt: now + 14 * 86400 - 60 }))
  await sweepRenewals(env as never)
  const t14 = sentEmails[sentEmails.length - 1]
  check('sweep sends t14 to the trial as its conversion notice',
    t14.to === 'reader@example.com' && t14.text.includes(`/api/checkout/renew?token=${rec1.accessToken}`), t14?.text)

  // -- a real purchase converts the trial: extends, keeps keys, clears promoCode --
  const buyEvt = {
    id: 'evt_trial_convert', type: 'checkout.session.completed',
    data: { object: { id: 'cs_trial_1', customer_details: { email: 'reader@example.com' }, metadata: { product: 'field_guide_2026' }, created: now } },
  }
  const buyBody = JSON.stringify(buyEvt)
  const buy = await call('/api/stripe/webhook', { method: 'POST', body: buyBody, headers: { 'stripe-signature': await signWebhook(buyBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('trial buyer purchase webhook 200', buy.status === 200 && buy.json.received === true, buy)
  const rec3 = JSON.parse((await buyers.get('buyer:reader@example.com'))!)
  check('purchase stacks 548d on the trial time and keeps token + code',
    Math.abs(rec3.expiresAt - (now + 14 * 86400 - 60 + 548 * 86400)) < 60 &&
    rec3.accessToken === rec1.accessToken && rec3.accessCode === rec1.accessCode, rec3)
  check('promoCode cleared by the payment', rec3.promoCode === undefined, rec3)

  // -- attempt caps (3/email/hour; the two redeems above already count) --
  const r3 = await redeemCall('9.9.9.2', { email: 'reader@example.com', code: 'TALUS30' })
  check('paid-buyer redeem -> 200, purchase email re-sent',
    r3.status === 200 && sentEmails[sentEmails.length - 1].text.includes('18 months'), r3)
  const r4 = await redeemCall('9.9.9.2', { email: 'reader@example.com', code: 'TALUS30' })
  check('4th attempt for one email -> 429', r4.status === 429, r4)

  // -- one grant per (code, email), ever --
  const l1 = await redeemCall('9.9.9.3', { email: 'lapsed@example.com', code: 'TALUS30' })
  check('lapsed arc: first redeem -> 200', l1.status === 200, l1)
  const lapsedRec = JSON.parse((await buyers.get('buyer:lapsed@example.com'))!)
  await buyers.put('buyer:lapsed@example.com', JSON.stringify({ ...lapsedRec, expiresAt: now - 60 }))
  const l2 = await redeemCall('9.9.9.3', { email: 'lapsed@example.com', code: 'TALUS30' })
  check('expired trial re-redeem -> 409 (sentinel)', l2.status === 409, l2)
}

console.log('\n22. instant-access claim (/api/checkout/claim)')
{
  const now = Math.floor(Date.now() / 1000)
  const claimCall = (ip: string, sessionId: string) =>
    call('/api/checkout/claim', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
      headers: { 'cf-connecting-ip': ip },
    })

  // -- refusals --
  const malformed = await claimCall('8.8.8.1', 'not-a-session')
  check('malformed session id -> 400', malformed.status === 400, malformed)
  const unknown = await claimCall('8.8.8.1', 'cs_test_unknown_999')
  check('unknown session -> 404', unknown.status === 404, unknown)

  stripeSessions.set('cs_claim_other', {
    id: 'cs_claim_other', payment_status: 'paid', created: now,
    metadata: { product: 'print_sale' }, customer_details: { email: 'donor2@example.com' },
  })
  const wrongProduct = await claimCall('8.8.8.1', 'cs_claim_other')
  check('wrong product answers like unknown -> 404 (no product probe)', wrongProduct.status === 404, wrongProduct)
  check('wrong product not provisioned', (await buyers.get('buyer:donor2@example.com')) === null)

  stripeSessions.set('cs_claim_unpaid', {
    id: 'cs_claim_unpaid', payment_status: 'unpaid', created: now,
    metadata: { product: 'field_guide_2026', kind: 'purchase' }, customer_details: { email: 'slowbank@example.com' },
  })
  const unpaid = await claimCall('8.8.8.1', 'cs_claim_unpaid')
  check('async payment still settling -> 409, not provisioned',
    unpaid.status === 409 && (await buyers.get('buyer:slowbank@example.com')) === null, unpaid)

  stripeSessions.set('cs_claim_gift', {
    id: 'cs_claim_gift', payment_status: 'paid', created: now,
    metadata: { product: 'field_guide_2026', kind: 'gift', recipientEmail: 'friend2@example.com' },
    customer_details: { email: 'payer2@example.com' },
  })
  const gift = await claimCall('8.8.8.1', 'cs_claim_gift')
  check('gift session -> 409, payer gets no access', gift.status === 409 && (await buyers.get('buyer:payer2@example.com')) === null, gift)

  // -- claim beats the webhook: provisions the buyer and signs them in --
  stripeSessions.set('cs_claim_1', {
    id: 'cs_claim_1', payment_status: 'paid', created: now,
    metadata: { product: 'field_guide_2026', kind: 'purchase' }, customer_details: { email: 'Instant@Example.com' },
  })
  const emailsBefore = sentEmails.length
  const r1 = await claimCall('8.8.8.2', 'cs_claim_1')
  check('claim -> jwt', r1.status === 200 && typeof r1.json.jwt === 'string', r1)
  const claims = JSON.parse(Buffer.from(String(r1.json.jwt).split('.')[1], 'base64url').toString())
  const recAfterClaim = JSON.parse((await buyers.get('buyer:instant@example.com'))!)
  check('jwt sub = buyer email (lowercased), exp = full access window',
    claims.sub === 'instant@example.com' && claims.exp === recAfterClaim.expiresAt, claims)
  check('record stamped with the provisioning session', recAfterClaim.provisionedSessionId === 'cs_claim_1', recAfterClaim)
  check('~548d granted from session creation', recAfterClaim.expiresAt === now + 548 * 86400, recAfterClaim)
  check('claim sends no email (the webhook owns delivery)', sentEmails.length === emailsBefore)
  const exchange = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: recAfterClaim.accessToken }) })
  check('derived token works in /exchange like an emailed one', exchange.status === 200 && typeof exchange.json.jwt === 'string', exchange)

  // -- the webhook then lands for the SAME session: no double grant --
  const evt = {
    id: 'evt_claimed_purchase', type: 'checkout.session.completed',
    data: { object: { id: 'cs_claim_1', customer_details: { email: 'Instant@Example.com' }, metadata: { product: 'field_guide_2026', kind: 'purchase' }, created: now } },
  }
  const body = JSON.stringify(evt)
  const wh = await call('/api/stripe/webhook', { method: 'POST', body, headers: { 'stripe-signature': await signWebhook(body, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('webhook after claim 200', wh.status === 200 && wh.json.received === true, wh)
  const recAfterWebhook = JSON.parse((await buyers.get('buyer:instant@example.com'))!)
  check('webhook kept the claimed record (no 36-month double grant)',
    recAfterWebhook.expiresAt === recAfterClaim.expiresAt &&
    recAfterWebhook.accessToken === recAfterClaim.accessToken &&
    recAfterWebhook.accessCode === recAfterClaim.accessCode,
    { claim: recAfterClaim.expiresAt, webhook: recAfterWebhook.expiresAt })
  const accessEmail = sentEmails[sentEmails.length - 1]
  check('webhook still sent the access email, code matches the stored record',
    sentEmails.length === emailsBefore + 1 && accessEmail.to === 'instant@example.com' &&
    accessEmail.text.includes(recAfterClaim.accessCode) && accessEmail.text.includes(recAfterClaim.accessToken),
    accessEmail?.text)

  // -- re-claim (success page refreshed): fresh jwt, record untouched --
  const r2 = await claimCall('8.8.8.2', 'cs_claim_1')
  check('re-claim -> jwt against the standing record', r2.status === 200 && typeof r2.json.jwt === 'string', r2)
  const recAfterReclaim = JSON.parse((await buyers.get('buyer:instant@example.com'))!)
  check('re-claim rewrites nothing', JSON.stringify(recAfterReclaim) === JSON.stringify(recAfterWebhook))

  // -- webhook-first order (tab closed at checkout, success link opened later) --
  const evt2 = {
    id: 'evt_claimed_purchase_2', type: 'checkout.session.completed',
    data: { object: { id: 'cs_claim_2', customer_details: { email: 'patient@example.com' }, metadata: { product: 'field_guide_2026', kind: 'purchase' }, created: now } },
  }
  const body2 = JSON.stringify(evt2)
  await call('/api/stripe/webhook', { method: 'POST', body: body2, headers: { 'stripe-signature': await signWebhook(body2, env.STRIPE_WEBHOOK_SECRET as string) } })
  const recFromWebhook = JSON.parse((await buyers.get('buyer:patient@example.com'))!)
  stripeSessions.set('cs_claim_2', {
    id: 'cs_claim_2', payment_status: 'paid', created: now,
    metadata: { product: 'field_guide_2026', kind: 'purchase' }, customer_details: { email: 'patient@example.com' },
  })
  const r3 = await claimCall('8.8.8.3', 'cs_claim_2')
  check('claim after webhook -> jwt, record untouched',
    r3.status === 200 && typeof r3.json.jwt === 'string' &&
    JSON.stringify(JSON.parse((await buyers.get('buyer:patient@example.com'))!)) === JSON.stringify(recFromWebhook),
    r3)

  // -- a refunded session cannot be replayed into fresh access --
  // Stripe leaves the Checkout Session at payment_status 'paid' after a
  // refund, and the session id sits in the buyer's browser history.
  stripeSessions.set('cs_claim_refunded', {
    id: 'cs_claim_refunded', payment_status: 'paid', created: now,
    customer_details: { email: 'refunded@example.com' }, metadata: { product: 'field_guide_2026', kind: 'purchase' },
  })
  const rf1 = await claimCall('8.8.8.4', 'cs_claim_refunded')
  check('claim before refund -> jwt', rf1.status === 200 && typeof rf1.json.jwt === 'string', rf1)
  const refundEvt = {
    id: 'evt_refund_claimed', type: 'charge.refunded',
    data: { object: { id: 'ch_claimed_1', billing_details: { email: 'refunded@example.com' }, metadata: { product: 'field_guide_2026' } } },
  }
  const refundBody = JSON.stringify(refundEvt)
  const rfw = await call('/api/stripe/webhook', { method: 'POST', body: refundBody, headers: { 'stripe-signature': await signWebhook(refundBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('claimed purchase refunded', rfw.status === 200 && rfw.json.revoked === 'refunded@example.com', rfw)
  const rf2 = await claimCall('8.8.8.4', 'cs_claim_refunded')
  check('re-claim of the refunded session -> 409', rf2.status === 409, rf2)
  const refundedRec = JSON.parse((await buyers.get('buyer:refunded@example.com'))!)
  check('refunded record untouched by the replay', refundedRec.refundedAt > 0 && refundedRec.expiresAt <= Math.floor(Date.now() / 1000), refundedRec)

  // -- a re-provision retires the superseded magic link --
  // patient@example.com lapses, then buys again: the new session derives a
  // new token, and the old token index must stop resolving.
  const patientOld = JSON.parse((await buyers.get('buyer:patient@example.com'))!)
  await buyers.put('buyer:patient@example.com', JSON.stringify({ ...patientOld, expiresAt: now - 60 }))
  const rebuy = {
    id: 'evt_patient_rebuy', type: 'checkout.session.completed',
    data: { object: { id: 'cs_claim_3', customer_details: { email: 'patient@example.com' }, metadata: { product: 'field_guide_2026', kind: 'purchase' }, created: now } },
  }
  const rebuyBody = JSON.stringify(rebuy)
  const rb = await call('/api/stripe/webhook', { method: 'POST', body: rebuyBody, headers: { 'stripe-signature': await signWebhook(rebuyBody, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('lapsed buyer re-purchase webhook 200', rb.status === 200, rb)
  const patientNew = JSON.parse((await buyers.get('buyer:patient@example.com'))!)
  check('re-purchase derived a new token', patientNew.accessToken !== patientOld.accessToken)
  check('old token index retired', (await buyers.get(`token:${patientOld.accessToken}`)) === null)
  check('new token index present', (await buyers.get(`token:${patientNew.accessToken}`)) === 'patient@example.com')
  const staleEx = await call('/api/auth/exchange', { method: 'POST', body: JSON.stringify({ token: patientOld.accessToken }) })
  check('superseded magic link -> 401', staleEx.status === 401, staleEx)

  // -- rate limit (20/hour per hashed IP) --
  let last: Awaited<ReturnType<typeof call>> | null = null
  for (let i = 0; i < 21; i++) {
    last = await claimCall('8.8.8.9', 'cs_claim_1')
  }
  check('21st claim from one IP -> 429', last!.status === 429, last)
}

globalThis.fetch = realFetch
console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
