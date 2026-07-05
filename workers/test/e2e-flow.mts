// End-to-end smoke of the paid-guide flow, driving the real Worker app
// in-process with mocked KV + stubbed Stripe/Resend network calls.
import worker from '../src/index'

// ---------- mocks ----------
class MockKV {
  store = new Map<string, string>()
  async get(key: string) { return this.store.get(key) ?? null }
  async put(key: string, value: string, _opts?: unknown) { this.store.set(key, value) }
  async delete(key: string) { this.store.delete(key) }
}

const buyers = new MockKV()
const programsKv = new MockKV()

const env: Record<string, unknown> = {
  GUIDE_BUYERS: buyers,
  GUIDE_PROGRAMS: programsKv,
  APP_BASE_URL: 'https://guide.thetalusfieldjournal.com',
  EDITORIAL_BASE_URL: 'https://thetalusfieldjournal.com',
  GUIDE_PRICE_CENTS: '1900',
  GUIDE_PRODUCT_TAG: 'field_guide_2026',
  GUIDE_MONTHLY_CAP: '100',
  STRIPE_SECRET_KEY: 'sk_test_dummy',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_dummy_secret',
  MAGIC_LINK_SIGNING_SECRET: 'test-signing-secret',
  RESEND_API_KEY: 're_test_dummy',
}

const ctx = { waitUntil(_p: Promise<unknown>) {}, passThroughOnException() {} } as ExecutionContext

// Capture outbound calls; fail on anything unexpected.
let stripeCreateParams: URLSearchParams | null = null
let sentEmails: { to: string; text: string }[] = []
let resendMode: 'ok' | 'fail' = 'ok'

const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  if (url.startsWith('https://api.stripe.com/v1/checkout/sessions')) {
    stripeCreateParams = new URLSearchParams(String(init?.body))
    return new Response(JSON.stringify({ id: 'cs_test_123', url: 'https://checkout.stripe.com/c/pay/cs_test_123' }), {
      status: 200, headers: { 'content-type': 'application/json' },
    })
  }
  if (url.startsWith('https://api.resend.com/emails')) {
    if (resendMode === 'fail') return new Response('boom', { status: 500 })
    const body = JSON.parse(String(init?.body))
    sentEmails.push({ to: body.to[0], text: body.text })
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
  check('price is 1900', r.json.priceCents === 1900, r.json)
  check('sold 0 / cap 100', r.json.sold === 0 && r.json.cap === 100, r.json)
}

console.log('\n2. checkout start')
{
  const r = await call('/api/checkout/start', { method: 'POST' })
  check('returns stripe url', r.status === 200 && r.json.url === 'https://checkout.stripe.com/c/pay/cs_test_123', r)
  const p = stripeCreateParams!
  check('mode=payment', p.get('mode') === 'payment')
  check('amount 1900', p.get('line_items[0][price_data][unit_amount]') === '1900')
  check('product tag in metadata', p.get('metadata[product]') === 'field_guide_2026')
  check('success url back to /guide', p.get('success_url') === 'https://thetalusfieldjournal.com/guide?guide=success')
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
  const refund = {
    id: 'evt_refund_1', type: 'charge.refunded',
    data: { object: { id: 'ch_test_123', billing_details: { email: 'Hiker@Example.com' } } },
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
    data: { object: { id: 'ch_test_456', billing_details: { email: 'nobody@example.com' } } },
  }
  const ob = JSON.stringify(orphan)
  const r2 = await call('/api/stripe/webhook', { method: 'POST', body: ob, headers: { 'stripe-signature': await signWebhook(ob, env.STRIPE_WEBHOOK_SECRET as string) } })
  check('refund for unknown buyer -> acknowledged, flagged', r2.status === 200 && r2.json.ignored === 'refund for unknown buyer', r2)
}

globalThis.fetch = realFetch
console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
