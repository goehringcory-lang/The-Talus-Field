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
let settleMode: 'ok' | 'fail' = 'ok'
const acknowledged: string[] = []
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
    const m = rest.match(/^products\/([^/]+)\/tokens\/([^:]+)(:consume|:acknowledge)?$/)
    if (m) {
      const key = `${decodeURIComponent(m[1])}|${decodeURIComponent(m[2])}`
      const p = purchases.get(key)
      if (!p) return json({ error: { code: 400 } }, 400)
      if (m[3]) {
        if (settleMode === 'fail') return json({ error: { code: 500 } }, 500)
        if (m[3] === ':consume') {
          p.consumptionState = 1
          consumed.push(key)
        } else {
          p.acknowledgementState = 1
          acknowledged.push(key)
        }
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
const nowS = Math.floor(now / 1000)
const DAYS_548 = 548 * 86400
function buyer(account: string) {
  return JSON.parse(buyers.store.get(`buyer:${account}`) ?? 'null')
}
function sub(jwt: unknown): string {
  return JSON.parse(atob(String(jwt).split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub
}
const GUIDE = 'field_guide_18mo'
const RENEW = 'field_guide_renewal_18mo'
const TOKEN_A = 'tokenA.' + 'a'.repeat(40)
purchases.set(`${GUIDE}|${TOKEN_A}`, {
  purchaseState: 0, consumptionState: 0, orderId: 'GPA.1111-0000-0000-00001', purchaseTimeMillis: String(now),
})
const ACCOUNT_A = 'play:gpa.1111-0000-0000-00001'

console.log('verify: a new purchase, no email')
{
  const r = await verify({ productId: GUIDE, purchaseToken: TOKEN_A })
  check('200 with a jwt', r.status === 200 && typeof r.body.jwt === 'string', r)
  check('the account is the order', sub(r.body.jwt) === ACCOUNT_A, r.body.jwt && sub(r.body.jwt))
  const rec = buyer(ACCOUNT_A)
  check('buyer record provisioned from the order id', rec?.provisionedSessionId === 'play:GPA.1111-0000-0000-00001')
  check('18 months of access', rec && Math.abs(rec.expiresAt - (nowS + DAYS_548)) < 5)
  check('guide acknowledged, not consumed', acknowledged.includes(`${GUIDE}|${TOKEN_A}`) && !consumed.includes(`${GUIDE}|${TOKEN_A}`))
  check('no email sent', sentEmails.length === 0, sentEmails)
  check('inventory tallied', [...buyers.store.keys()].some((k) => k.startsWith('inventory:')))
  check('one OAuth exchange so far', oauthCalls === 1, oauthCalls)
}

console.log('verify: the same token again is a restore')
{
  const ackBefore = acknowledged.length
  const r = await verify({ productId: GUIDE, purchaseToken: TOKEN_A })
  check('200, restored, same account', r.status === 200 && r.body.restored === true && sub(r.body.jwt) === ACCOUNT_A, r)
  check('not acknowledged twice', acknowledged.length === ackBefore)
  check('no inventory double count', buyers.store.get(`inventory:${new Date(now).toISOString().slice(0, 7)}`) === '1')
  check('OAuth token reused across requests', oauthCalls === 1, oauthCalls)
}

console.log('verify: refusals')
{
  check('unknown product 400', (await verify({ productId: 'x', purchaseToken: TOKEN_A })).status === 400)
  check('malformed previousToken 400', (await verify({ productId: RENEW, purchaseToken: 'r'.repeat(30), previousToken: 'bad token' })).status === 400)
  check('token Google does not know 404', (await verify({ productId: GUIDE, purchaseToken: 'c'.repeat(30) })).status === 404)
  purchases.set(`${GUIDE}|${'p'.repeat(30)}`, { purchaseState: 2, orderId: 'GPA.pending' })
  const pending = await verify({ productId: GUIDE, purchaseToken: 'p'.repeat(30) })
  check('pending payment 409 code pending', pending.status === 409 && pending.body.code === 'pending', pending)
  purchases.set(`${GUIDE}|${'q'.repeat(30)}`, { purchaseState: 1, orderId: 'GPA.cancel' })
  check('canceled payment 402', (await verify({ productId: GUIDE, purchaseToken: 'q'.repeat(30) })).status === 402)
  check('no buyer record for refusals', !buyers.store.has('buyer:play:gpa.pending') && !buyers.store.has('buyer:play:gpa.cancel'))
}

console.log('verify: an early renewal from the signed-in account')
{
  const before = buyer(ACCOUNT_A)
  const TOKEN_R = 'tokenR.' + 'r'.repeat(40)
  purchases.set(`${RENEW}|${TOKEN_R}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.2222-0000-0000-00002', purchaseTimeMillis: String(now),
  })
  const jwt = await signAccessJwt(ACCOUNT_A, SECRET, before.expiresAt)
  const r = await verify({ productId: RENEW, purchaseToken: TOKEN_R }, jwt)
  const after = buyer(ACCOUNT_A)
  check('200, extended', r.status === 200 && r.body.extended === true, r)
  check('stacked onto the current expiry', after.expiresAt === before.expiresAt + DAYS_548)
  check('token and code kept', after.accessToken === before.accessToken && after.accessCode === before.accessCode)
  check('renewal consumed', consumed.includes(`${RENEW}|${TOKEN_R}`))
  check('still no email', sentEmails.length === 0)
}

console.log('verify: a lapsed buyer renews with the guide token, no session')
{
  const LAPSED_TOKEN = 'tokenL.' + 'l'.repeat(40)
  purchases.set(`${GUIDE}|${LAPSED_TOKEN}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.5555-0000-0000-00005', purchaseTimeMillis: String(now - DAYS_548 * 1000 - 86400_000),
  })
  const first = await verify({ productId: GUIDE, purchaseToken: LAPSED_TOKEN })
  check('an old purchase provisions already lapsed', first.status === 200, first)
  const restore = await verify({ productId: GUIDE, purchaseToken: LAPSED_TOKEN })
  check('restoring it answers 410 expired', restore.status === 410 && restore.body.code === 'expired', restore)
  const TOKEN_R2 = 'tokenR2.' + 's'.repeat(40)
  purchases.set(`${RENEW}|${TOKEN_R2}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.6666-0000-0000-00006', purchaseTimeMillis: String(now),
  })
  const r = await verify({ productId: RENEW, purchaseToken: TOKEN_R2, previousToken: LAPSED_TOKEN })
  check('renewal lands on the lapsed account', r.status === 200 && sub(r.body.jwt) === 'play:gpa.5555-0000-0000-00005', r)
  const rec = buyer('play:gpa.5555-0000-0000-00005')
  check('extended from now', Math.abs(rec.expiresAt - (nowS + DAYS_548)) < 5, rec)
  const again = await verify({ productId: GUIDE, purchaseToken: LAPSED_TOKEN })
  check('the guide token restores again', again.status === 200 && again.body.restored === true, again)
}

console.log('verify: a web buyer adds the app while signed in')
{
  buyers.store.set('buyer:hiker@example.com', JSON.stringify({
    email: 'hiker@example.com', purchasedAt: nowS - 86400, expiresAt: nowS + 100 * 86400,
    accessToken: 'f'.repeat(64), accessCode: '123456',
  }))
  const TOKEN_W = 'tokenW.' + 'w'.repeat(40)
  purchases.set(`${GUIDE}|${TOKEN_W}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.7777-0000-0000-00007', purchaseTimeMillis: String(now),
  })
  const jwt = await signAccessJwt('hiker@example.com', SECRET, nowS + 100 * 86400)
  const r = await verify({ productId: GUIDE, purchaseToken: TOKEN_W }, jwt)
  check('extends the email account', r.status === 200 && sub(r.body.jwt) === 'hiker@example.com' && buyer('hiker@example.com').expiresAt === nowS + 100 * 86400 + DAYS_548, r)
  check('emails the renewal confirmation naming Google Play', sentEmails.at(-1)?.to === 'hiker@example.com' && sentEmails.at(-1)?.text.includes('Google Play sends your payment receipt'))
  const restore = await verify({ productId: GUIDE, purchaseToken: TOKEN_W })
  check('that token restores the email account', restore.status === 200 && sub(restore.body.jwt) === 'hiker@example.com', restore)
}

console.log('verify: a failed acknowledge is finished by the next verify')
{
  settleMode = 'fail'
  const TOKEN_C = 'tokenC.' + 'c'.repeat(40)
  purchases.set(`${GUIDE}|${TOKEN_C}`, {
    purchaseState: 0, consumptionState: 0, orderId: 'GPA.3333-0000-0000-00003', purchaseTimeMillis: String(now),
  })
  const first = await verify({ productId: GUIDE, purchaseToken: TOKEN_C })
  check('access granted despite the failed acknowledge', first.status === 200, first)
  check('not acknowledged yet', !acknowledged.includes(`${GUIDE}|${TOKEN_C}`))
  settleMode = 'ok'
  const retry = await verify({ productId: GUIDE, purchaseToken: TOKEN_C })
  check('retry 200', retry.status === 200, retry)
  check('retry acknowledged it', acknowledged.includes(`${GUIDE}|${TOKEN_C}`))
}

console.log('voided sweep')
{
  voided = [
    { orderId: 'GPA.3333-0000-0000-00003' }, // provisioned play:gpa.3333 → revoke
    { orderId: 'GPA.2222-0000-0000-00002' }, // extended ACCOUNT_A → take 18 months back
  ]
  const aBefore = buyer(ACCOUNT_A)
  await sweepPlayVoided(env as never)
  const c3 = buyer('play:gpa.3333-0000-0000-00003')
  check('provisioning order refunded: revoked', c3.refundedAt != null && c3.expiresAt <= Math.floor(Date.now() / 1000))
  const a = buyer(ACCOUNT_A)
  check('extension refunded: 18 months off', a.expiresAt === aBefore.expiresAt - DAYS_548 && a.refundedAt == null)
  await sweepPlayVoided(env as never)
  check('a second sweep changes nothing', buyer(ACCOUNT_A).expiresAt === a.expiresAt)
  const refunded = await verify({ productId: GUIDE, purchaseToken: 'tokenC.' + 'c'.repeat(40) })
  check('a refunded token no longer signs in', refunded.status === 409 && refunded.body.code === 'refunded', refunded)
}

console.log('renewal email sweep skips Play accounts')
{
  const { sweepRenewals } = await import('../src/lib/renewals')
  const emailsBefore = sentEmails.length
  // ACCOUNT_A ends in about 18 months; put it inside the t14 window.
  const rec = buyer(ACCOUNT_A)
  buyers.store.set(`buyer:${ACCOUNT_A}`, JSON.stringify({ ...rec, expiresAt: nowS + 10 * 86400 }))
  await sweepRenewals(env as never)
  check('nothing mailed to a play: account', !sentEmails.slice(emailsBefore).some((e) => e.to.startsWith('play:')), sentEmails.slice(emailsBefore))
}

console.log('not configured')
{
  const saved = env.PLAY_SERVICE_ACCOUNT_JSON
  delete env.PLAY_SERVICE_ACCOUNT_JSON
  check('503 without the service account', (await verify({ productId: GUIDE, purchaseToken: TOKEN_A })).status === 503)
  env.PLAY_SERVICE_ACCOUNT_JSON = saved
}

if (failures) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall play billing checks passed')
