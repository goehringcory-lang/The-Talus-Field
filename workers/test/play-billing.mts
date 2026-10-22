// The Android app's Play purchase path (/api/play/verify and the nightly
// voided-purchase sweep), driving the real Worker app in-process with mocked
// KV and stubbed Google OAuth, Play Developer API and Resend calls.
import worker from '../src/index'
import { sweepPlayVoided } from '../src/lib/play'
import { signAccessJwt } from '../src/lib/jwt'

class MockKV {
  store = new Map<string, string>()
  async get(key: string) { return this.store.get(key) ?? null }
  async put(key: string, value: string, _opts?: unknown) { this.store.set(key, value) }
  async delete(key: string) { this.store.delete(key) }
  async list(opts: { prefix?: string } = {}) {
    const keys = [...this.store.keys()].filter((k) => !opts.prefix || k.startsWith(opts.prefix)).sort().map((name) => ({ name }))
    return { keys, list_complete: true as const }
  }
}

// A throwaway RSA key stands in for the service account's.
const pair = (await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true,
  ['sign', 'verify'],
)) as CryptoKeyPair
const pkcs8 = new Uint8Array((await crypto.subtle.exportKey('pkcs8', pair.privateKey)) as ArrayBuffer)
const pem = `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...pkcs8)).replace(/(.{64})/g, '$1\n')}\n-----END PRIVATE KEY-----\n`

const buyers = new MockKV()
const SECRET = 'test-signing-secret'
const env: Record<string, unknown> = {
  GUIDE_BUYERS: buyers,
  GUIDE_PROGRAMS: new MockKV(),
  APP_BASE_URL: 'https://guide.thetalusfieldjournal.com',
  EDITORIAL_BASE_URL: 'https://thetalusfieldjournal.com',
  GUIDE_PRICE_CENTS: '399',
  GUIDE_RENEWAL_PRICE_CENTS: '249',
  GUIDE_PRODUCT_TAG: 'field_guide_2026',
  MAGIC_LINK_SIGNING_SECRET: SECRET,
  RESEND_API_KEY: 're_test_dummy',
  PLAY_PACKAGE_NAME: 'com.thetalusfieldjournal.guide',
  PLAY_PRODUCT_ID: 'field_guide_18mo',
  PLAY_RENEWAL_PRODUCT_ID: 'field_guide_renewal_18mo',
  PLAY_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'sa@test.iam.gserviceaccount.com', private_key: pem }),
}
const ctx = { waitUntil(_p: Promise<unknown>) {}, passThroughOnException() {} } as ExecutionContext

// Google's side: purchases by token, consumes, voided orders.
const purchases = new Map<string, Record<string, unknown>>()
const consumed: string[] = []
let voided: { orderId: string }[] = []
let consumeMode: 'ok' | 'fail' = 'ok'
let oauthCalls = 0
const sentEmails: { to: string; subject: string; text: string }[] = []

const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.thetalusfieldjournal.guide/purchases/'
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  if (url === 'https://oauth2.googleapis.com/token') {
    oauthCalls++
    const form = new URLSearchParams(String(init?.body))
    if (form.get('grant_type') !== 'urn:ietf:params:oauth:grant-type:jwt-bearer' || !form.get('assertion')) {
      return json({ error: 'invalid_grant' }, 400)
    }
    return json({ access_token: 'ya29.test', expires_in: 3600 })
  }
  if (url.startsWith(API)) {
    if (new Headers(init?.headers).get('authorization') !== 'Bearer ya29.test') return json({}, 401)
    const rest = url.slice(API.length)
    if (rest.startsWith('voidedpurchases')) return json({ voidedPurchases: voided })
    const m = rest.match(/^products\/([^/]+)\/tokens\/([^:]+)(:consume)?$/)
    if (m) {
      const key = `${decodeURIComponent(m[1])}|${decodeURIComponent(m[2])}`
      const p = purchases.get(key)
      if (!p) return json({ error: { code: 400 } }, 400)
      if (m[3]) {
        if (consumeMode === 'fail') return json({ error: { code: 500 } }, 500)
        p.consumptionState = 1
        consumed.push(key)
        return new Response(null, { status: 204 })
      }
      return json(p)
    }
  }
  if (url === 'https://api.resend.com/emails') {
    const body = JSON.parse(String(init?.body))
    sentEmails.push({ to: body.to[0], subject: body.subject, text: body.text })
    return json({ id: 'email_1' })
  }
  throw new Error(`unexpected fetch: ${url}`)
}) as typeof fetch

let failures = 0
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  ok  ${label}`)
  else {
    failures++
    console.error(`  FAIL ${label}`, detail ?? '')
  }
}

async function verify(body: Record<string, unknown>, jwt?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.9' }
  if (jwt) headers.Authorization = `Bearer ${jwt}`
  const res = await worker.fetch(
    new Request('https://api.test/api/play/verify', { method: 'POST', headers, body: JSON.stringify(body) }),
    env as never,
    ctx,
  )
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

const now = Date.now()
const TOKEN_A = 'tokenA.' + 'a'.repeat(40)
purchases.set(`field_guide_18mo|${TOKEN_A}`, {
  purchaseState: 0, consumptionState: 0, orderId: 'GPA.1111-0000-0000-00001', purchaseTimeMillis: String(now),
})

console.log('verify: a new purchase')
{
  const r = await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_A, email: ' Hiker@Example.com ' })
  check('200 with a jwt', r.status === 200 && typeof r.body.jwt === 'string', r)
  const rec = JSON.parse(buyers.store.get('buyer:hiker@example.com') ?? 'null')
  check('buyer record provisioned from the order id', rec?.provisionedSessionId === 'play:GPA.1111-0000-0000-00001')
  check('18 months of access', rec && Math.abs(rec.expiresAt - (Math.floor(now / 1000) + 548 * 86400)) < 5)
  check('purchase consumed', consumed.includes(`field_guide_18mo|${TOKEN_A}`))
  check('access email sent', sentEmails.some((e) => e.to === 'hiker@example.com' && e.subject === 'Your Field Guide is ready'))
  check('inventory tallied', [...buyers.store.keys()].some((k) => k.startsWith('inventory:')))
  check('one OAuth exchange so far', oauthCalls === 1, oauthCalls)
}

console.log('verify: the same token again (a retry)')
{
  const emailsBefore = sentEmails.length
  const r = await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_A, email: 'hiker@example.com' })
  check('200 again, idempotent', r.status === 200 && typeof r.body.jwt === 'string', r)
  check('no second email', sentEmails.length === emailsBefore)
  const other = await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_A, email: 'someone@else.com' })
  check('another email is refused', other.status === 409, other)
  check('OAuth token reused across requests', oauthCalls === 1, oauthCalls)
}

console.log('verify: refusals')
{
  check('unknown product 400', (await verify({ productId: 'x', purchaseToken: TOKEN_A, email: 'a@b.co' })).status === 400)
  check('missing email 400', (await verify({ productId: 'field_guide_18mo', purchaseToken: 'b'.repeat(30) })).status === 400)
  check('token Google does not know 404', (await verify({ productId: 'field_guide_18mo', purchaseToken: 'c'.repeat(30), email: 'a@b.co' })).status === 404)
  purchases.set(`field_guide_18mo|${'p'.repeat(30)}`, { purchaseState: 2, orderId: 'GPA.pending' })
  const pending = await verify({ productId: 'field_guide_18mo', purchaseToken: 'p'.repeat(30), email: 'a@b.co' })
  check('pending payment 409 code pending', pending.status === 409 && pending.body.code === 'pending', pending)
  purchases.set(`field_guide_18mo|${'q'.repeat(30)}`, { purchaseState: 1, orderId: 'GPA.cancel' })
  check('canceled payment 402', (await verify({ productId: 'field_guide_18mo', purchaseToken: 'q'.repeat(30), email: 'a@b.co' })).status === 402)
  check('no buyer record for refusals', !buyers.store.has('buyer:a@b.co'))
}

console.log('verify: a renewal from a signed-in account')
{
  const before = JSON.parse(buyers.store.get('buyer:hiker@example.com')!)
  const TOKEN_R = 'tokenR.' + 'r'.repeat(40)
  purchases.set(`field_guide_renewal_18mo|${TOKEN_R}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.2222-0000-0000-00002', purchaseTimeMillis: String(now),
  })
  const jwt = await signAccessJwt('hiker@example.com', SECRET, before.expiresAt)
  // The typed address is ignored when a session names the account.
  const r = await verify({ productId: 'field_guide_renewal_18mo', purchaseToken: TOKEN_R, email: 'typo@example.com' }, jwt)
  const after = JSON.parse(buyers.store.get('buyer:hiker@example.com')!)
  check('200, extended', r.status === 200 && r.body.extended === true, r)
  check('stacked onto the current expiry', after.expiresAt === before.expiresAt + 548 * 86400)
  check('token and code kept', after.accessToken === before.accessToken && after.accessCode === before.accessCode)
  check('no record for the typed address', !buyers.store.has('buyer:typo@example.com'))
  check('renewal email names Google Play', sentEmails.at(-1)?.text.includes('Google Play sends your payment receipt'))
}

console.log('verify: a failed consume is finished by the retry')
{
  consumeMode = 'fail'
  const TOKEN_C = 'tokenC.' + 'c'.repeat(40)
  purchases.set(`field_guide_18mo|${TOKEN_C}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.3333-0000-0000-00003', purchaseTimeMillis: String(now),
  })
  const first = await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_C, email: 'camper@example.com' })
  check('access granted despite the failed consume', first.status === 200, first)
  check('not consumed yet', !consumed.includes(`field_guide_18mo|${TOKEN_C}`))
  consumeMode = 'ok'
  const retry = await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_C, email: 'camper@example.com' })
  check('retry 200', retry.status === 200, retry)
  check('retry consumed it', consumed.includes(`field_guide_18mo|${TOKEN_C}`))
}

console.log('voided sweep')
{
  voided = [
    { orderId: 'GPA.3333-0000-0000-00003' }, // provisioned camper@ → revoke
    { orderId: 'GPA.2222-0000-0000-00002' }, // extended hiker@ → take 18 months back
  ]
  const hikerBefore = JSON.parse(buyers.store.get('buyer:hiker@example.com')!)
  await sweepPlayVoided(env as never)
  const camper = JSON.parse(buyers.store.get('buyer:camper@example.com')!)
  check('provisioning order refunded: revoked', camper.refundedAt != null && camper.expiresAt <= Math.floor(Date.now() / 1000))
  const hiker = JSON.parse(buyers.store.get('buyer:hiker@example.com')!)
  check('extension refunded: 18 months off', hiker.expiresAt === hikerBefore.expiresAt - 548 * 86400 && hiker.refundedAt == null)
  await sweepPlayVoided(env as never)
  const hikerAgain = JSON.parse(buyers.store.get('buyer:hiker@example.com')!)
  check('a second sweep changes nothing', hikerAgain.expiresAt === hiker.expiresAt)
  const camperRetry = await verify({ productId: 'field_guide_18mo', purchaseToken: 'tokenC.' + 'c'.repeat(40), email: 'camper@example.com' })
  check('a refunded token no longer signs in', camperRetry.status === 409 && camperRetry.body.code === 'refunded', camperRetry)
}

console.log('not configured')
{
  const saved = env.PLAY_SERVICE_ACCOUNT_JSON
  delete env.PLAY_SERVICE_ACCOUNT_JSON
  check('503 without the service account', (await verify({ productId: 'field_guide_18mo', purchaseToken: TOKEN_A, email: 'a@b.co' })).status === 503)
  env.PLAY_SERVICE_ACCOUNT_JSON = saved
}

if (failures) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall play billing checks passed')
