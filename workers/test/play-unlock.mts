// The Android app's unlock (/api/play/nonce + /api/play/unlock): a paid
// download whose installs are signed in from a Play Integrity verdict. Drives
// the real Worker app in-process with mocked KV and stubbed Google OAuth and
// Play Integrity calls.
import worker from '../src/index'

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
  PLAY_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'sa@test.iam.gserviceaccount.com', private_key: pem }),
}
const ctx = { waitUntil(_p: Promise<unknown>) {}, passThroughOnException() {} } as ExecutionContext

// Google's side: what decodeIntegrityToken answers, keyed by the token.
const verdicts = new Map<string, Record<string, unknown>>()
let decodeMode: 'ok' | 'fail' = 'ok'
let oauthScope = ''
const sentEmails: string[] = []

const DECODE = 'https://playintegrity.googleapis.com/v1/com.thetalusfieldjournal.guide:decodeIntegrityToken'
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input)
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  if (url === 'https://oauth2.googleapis.com/token') {
    const form = new URLSearchParams(String(init?.body))
    const claims = JSON.parse(atob(String(form.get('assertion')).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    oauthScope = claims.scope
    return json({ access_token: 'ya29.test', expires_in: 3600 })
  }
  if (url === DECODE) {
    if (new Headers(init?.headers).get('authorization') !== 'Bearer ya29.test') return json({}, 401)
    if (decodeMode === 'fail') return json({ error: { code: 500 } }, 500)
    const token = JSON.parse(String(init?.body)).integrity_token
    const v = verdicts.get(token)
    return v ? json({ tokenPayloadExternal: v }) : json({ error: { code: 400 } }, 400)
  }
  if (url === 'https://api.resend.com/emails') {
    sentEmails.push(JSON.parse(String(init?.body)).to[0])
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

async function call(method: string, path: string, body?: unknown, ip = '203.0.113.9') {
  const res = await worker.fetch(
    new Request(`https://api.test${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    env as never,
    ctx,
  )
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}
function sub(jwt: unknown): string {
  return JSON.parse(atob(String(jwt).split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub
}
const PKG = 'com.thetalusfieldjournal.guide'
function verdict(nonce: string, over: { licensing?: string; recognition?: string; pkg?: string; age?: number } = {}) {
  return {
    requestDetails: { requestPackageName: over.pkg ?? PKG, nonce, timestampMillis: String(Date.now() - (over.age ?? 1000)) },
    appIntegrity: { appRecognitionVerdict: over.recognition ?? 'PLAY_RECOGNIZED', packageName: PKG },
    accountDetails: { appLicensingVerdict: over.licensing ?? 'LICENSED' },
  }
}
async function freshNonce() {
  return String((await call('GET', '/api/play/nonce')).body.nonce)
}
const INSTALL = '3f2a8c1e-5b7d-4e9a-8c2f-1a2b3c4d5e6f'
const ACCOUNT = `playapp:${INSTALL}`
const nowS = () => Math.floor(Date.now() / 1000)

console.log('nonce')
{
  const r = await call('GET', '/api/play/nonce')
  check('200 with a url-safe nonce', r.status === 200 && /^[A-Za-z0-9_-]{40,}$/.test(String(r.body.nonce)), r)
  check('stored for ten minutes', buyers.store.has(`playNonce:${r.body.nonce}`))
}

console.log('unlock: a licensed install')
{
  const nonce = await freshNonce()
  verdicts.set('tok-1', verdict(nonce))
  const r = await call('POST', '/api/play/unlock', { token: 'tok-1', installId: INSTALL.toUpperCase() })
  check('200 with a jwt for the install', r.status === 200 && sub(r.body.jwt) === ACCOUNT, r)
  check('OAuth asked for the Play Integrity scope', oauthScope === 'https://www.googleapis.com/auth/playintegrity', oauthScope)
  const rec = JSON.parse(buyers.store.get(`buyer:${ACCOUNT}`) ?? 'null')
  check('buyer record for the install, 90-day session', rec && Math.abs(rec.expiresAt - (nowS() + 90 * 86400)) < 5, rec)
  check('nonce spent', !buyers.store.has(`playNonce:${nonce}`))
  check('no email, no inventory', sentEmails.length === 0 && ![...buyers.store.keys()].some((k) => k.startsWith('inventory:')))
  const replay = await call('POST', '/api/play/unlock', { token: 'tok-1', installId: INSTALL })
  check('the same token cannot be replayed', replay.status === 400 && replay.body.code === 'stale', replay)
}

console.log('unlock: a refresh a month later keeps the account')
{
  const rec = JSON.parse(buyers.store.get(`buyer:${ACCOUNT}`)!)
  buyers.store.set(`buyer:${ACCOUNT}`, JSON.stringify({ ...rec, purchasedAt: rec.purchasedAt - 30 * 86400, expiresAt: rec.expiresAt - 30 * 86400 }))
  const nonce = await freshNonce()
  verdicts.set('tok-2', verdict(nonce))
  const r = await call('POST', '/api/play/unlock', { token: 'tok-2', installId: INSTALL })
  const after = JSON.parse(buyers.store.get(`buyer:${ACCOUNT}`)!)
  check('200, same account', r.status === 200 && sub(r.body.jwt) === ACCOUNT, r)
  check('session pushed out to 90 days again', Math.abs(after.expiresAt - (nowS() + 90 * 86400)) < 5)
  check('purchasedAt kept', after.purchasedAt === rec.purchasedAt - 30 * 86400)
  check('access token kept', after.accessToken === rec.accessToken)
}

console.log('unlock: refusals')
{
  let nonce = await freshNonce()
  verdicts.set('tok-unlicensed', verdict(nonce, { licensing: 'UNLICENSED' }))
  const unlicensed = await call('POST', '/api/play/unlock', { token: 'tok-unlicensed', installId: INSTALL })
  check('UNLICENSED 402 not_licensed', unlicensed.status === 402 && unlicensed.body.code === 'not_licensed', unlicensed)

  nonce = await freshNonce()
  verdicts.set('tok-sideload', verdict(nonce, { recognition: 'UNRECOGNIZED_VERSION' }))
  const sideload = await call('POST', '/api/play/unlock', { token: 'tok-sideload', installId: INSTALL })
  check('an app Play did not distribute 402', sideload.status === 402 && sideload.body.code === 'not_licensed', sideload)

  nonce = await freshNonce()
  verdicts.set('tok-uneval', verdict(nonce, { licensing: 'UNEVALUATED' }))
  const uneval = await call('POST', '/api/play/unlock', { token: 'tok-uneval', installId: INSTALL })
  check('UNEVALUATED 503 unevaluated', uneval.status === 503 && uneval.body.code === 'unevaluated', uneval)

  verdicts.set('tok-forged-nonce', verdict('not-a-nonce-we-issued'))
  const forged = await call('POST', '/api/play/unlock', { token: 'tok-forged-nonce', installId: INSTALL })
  check('a nonce this Worker never issued 400', forged.status === 400 && forged.body.code === 'stale', forged)

  nonce = await freshNonce()
  verdicts.set('tok-old', verdict(nonce, { age: 11 * 60 * 1000 }))
  const old = await call('POST', '/api/play/unlock', { token: 'tok-old', installId: INSTALL })
  check('a token older than ten minutes 400', old.status === 400 && old.body.code === 'stale', old)

  nonce = await freshNonce()
  verdicts.set('tok-other-app', verdict(nonce, { pkg: 'com.example.other' }))
  check('another app\'s token 400', (await call('POST', '/api/play/unlock', { token: 'tok-other-app', installId: INSTALL })).status === 400)

  check('a token Google rejects 400', (await call('POST', '/api/play/unlock', { token: 'garbage', installId: INSTALL })).status === 400)
  check('a malformed install id 400', (await call('POST', '/api/play/unlock', { token: 'tok-1', installId: 'nope' })).status === 400)

  decodeMode = 'fail'
  const down = await call('POST', '/api/play/unlock', { token: 'tok-1', installId: INSTALL })
  check('Google down 503 unavailable', down.status === 503 && down.body.code === 'unavailable', down)
  decodeMode = 'ok'
  check('no record for refused installs', [...buyers.store.keys()].filter((k) => k.startsWith('buyer:playapp:')).length === 1)
}

console.log('renewal email sweep and push sweep leave app installs alone')
{
  const rec = JSON.parse(buyers.store.get(`buyer:${ACCOUNT}`)!)
  buyers.store.set(`buyer:${ACCOUNT}`, JSON.stringify({ ...rec, expiresAt: nowS() + 10 * 86400 }))
  const { sweepRenewals } = await import('../src/lib/renewals')
  await sweepRenewals(env as never)
  check('no renewal email to an install', !sentEmails.some((e) => e.startsWith('playapp:')), sentEmails)
}

console.log('rate limit')
{
  for (let i = 0; i < 20; i++) await call('GET', '/api/play/nonce', undefined, '198.51.100.7')
  check('the 21st nonce in an hour 429', (await call('GET', '/api/play/nonce', undefined, '198.51.100.7')).status === 429)
}

console.log('not configured')
{
  const saved = env.PLAY_SERVICE_ACCOUNT_JSON
  delete env.PLAY_SERVICE_ACCOUNT_JSON
  check('nonce 503 without the service account', (await call('GET', '/api/play/nonce', undefined, '192.0.2.1')).status === 503)
  check('unlock 503 without the service account', (await call('POST', '/api/play/unlock', { token: 'x', installId: INSTALL })).status === 503)
  env.PLAY_SERVICE_ACCOUNT_JSON = saved
}

if (failures) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall play app unlock checks passed')
