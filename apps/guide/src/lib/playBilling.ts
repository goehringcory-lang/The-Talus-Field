// =============================================================================
// The Android app's storefront: Google Play Billing, reached from the PWA.
//
// The Play Store build of the guide (the FieldGuideAndroid project) is a
// Trusted Web Activity: Chrome showing this PWA full screen, with a small
// native shell that gives the page Play Billing through the Digital Goods API
// and the Payment Request API. Play's payments policy requires that an app
// it distributes sells digital content through Play, so inside that shell the
// web checkout (the editorial /guide page and Stripe) is never offered: every
// buy and renew action goes to /buy, which runs the Play purchase, and
// /api/play/verify on the Worker verifies it with Google and signs the buyer in.
//
// Outside the shell nothing here changes anything: isAndroidApp() is false
// and the storefront links out to the web checkout exactly as before.
// =============================================================================

import { apiFetch } from './api'

// Must match the Android project's applicationId and PLAY_PACKAGE_NAME in
// workers/wrangler.toml.
const ANDROID_PACKAGE = 'com.thetalusfieldjournal.guide'
// The shell's launch URL carries this query parameter (FieldGuideAndroid's
// app/build.gradle.kts, launchUrl), as a second signal beside the referrer.
const LAUNCH_PARAM = 'source'
const LAUNCH_VALUE = 'android-app'
const SESSION_KEY = 'tfg.androidApp'

// Product ids, as created in the Play Console. Mirrored in wrangler.toml
// (PLAY_PRODUCT_ID, PLAY_RENEWAL_PRODUCT_ID); change both together.
export const PLAY_PRODUCTS = {
  guide: 'field_guide_18mo',
  renewal: 'field_guide_renewal_18mo',
} as const
export type PlayProductId = (typeof PLAY_PRODUCTS)[keyof typeof PLAY_PRODUCTS]

const PLAY_METHOD = 'https://play.google.com/billing'

// Called once at boot, before render. Chrome sets the referrer to
// android-app://<package>/ when the shell launches the page; the flag goes in
// sessionStorage, which is per tab, because the shell shares Chrome's storage
// for this origin and a localStorage flag would leak into the reader's
// ordinary Chrome tabs, where the web checkout must keep working.
export function markAndroidLaunch(): void {
  try {
    const fromShell =
      document.referrer.startsWith(`android-app://${ANDROID_PACKAGE}`) ||
      new URLSearchParams(window.location.search).get(LAUNCH_PARAM) === LAUNCH_VALUE
    if (fromShell) sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* storage-blocked: treated as the web app */
  }
}

export function isAndroidApp(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

// --- Digital Goods API ------------------------------------------------------
// Typed here because TypeScript's DOM library does not carry it yet.
// https://wicg.github.io/digital-goods/

type PlayItemDetails = {
  itemId: string
  title: string
  price: { currency: string; value: string }
}
type PlayPurchaseDetails = { itemId: string; purchaseToken: string }
type DigitalGoodsService = {
  getDetails(itemIds: string[]): Promise<PlayItemDetails[]>
  listPurchases(): Promise<PlayPurchaseDetails[]>
}
declare global {
  interface Window {
    getDigitalGoodsService?: (paymentMethod: string) => Promise<DigitalGoodsService>
  }
}

let servicePromise: Promise<DigitalGoodsService | null> | null = null

function digitalGoods(): Promise<DigitalGoodsService | null> {
  if (!servicePromise) {
    servicePromise =
      typeof window.getDigitalGoodsService === 'function'
        ? window.getDigitalGoodsService(PLAY_METHOD).catch(() => null)
        : Promise.resolve(null)
  }
  return servicePromise
}

// Whether Play Billing is reachable: false in the shell's fallback modes (no
// Chrome on the device, or one too old for the Digital Goods API).
export async function playBillingAvailable(): Promise<boolean> {
  return isAndroidApp() && (await digitalGoods()) !== null
}

// The localized price Play will charge, e.g. "$3.99" or "3,99 €". Play is
// the authority here, not GUIDE_PRICE_CENTS: it converts per country.
export async function playPrice(productId: PlayProductId): Promise<string | null> {
  const service = await digitalGoods()
  if (!service) return null
  try {
    const [item] = await service.getDetails([productId])
    if (!item) return null
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: item.price.currency,
    }).format(Number(item.price.value))
  } catch {
    return null
  }
}

// --- Purchase and restore ---------------------------------------------------
// There is no email in this flow: the Google Play purchase is the account.
// The guide product is acknowledged, never consumed, so Play keeps listing
// its token for the reader's Google account, and that token signs them in on
// a reinstall or a new phone (the Worker's /api/play/verify). The renewal is
// consumed; it names its account by the session or, for a lapsed buyer, by
// that same guide token sent as previousToken.

export type PlayVerifyResponse = {
  jwt: string
  expiresAt: number
  extended?: boolean
  restored?: boolean
}

// The guide was bought on this Google account, but its 18 months are over:
// the caller offers the renewal.
export class PlayExpired extends Error {}
export class PlayCancelled extends Error {}

function verifyOnServer(body: {
  productId: PlayProductId
  purchaseToken: string
  previousToken?: string
}): Promise<PlayVerifyResponse> {
  return apiFetch<PlayVerifyResponse>(
    '/api/play/verify',
    { method: 'POST', body: JSON.stringify(body) },
    { timeoutMs: 30_000 },
  ).catch((err: unknown) => {
    const code = (err as { body?: { code?: unknown } })?.body?.code
    if (code === 'expired') throw new PlayExpired('expired')
    throw err
  })
}

type Owned = { guide?: string; renewal?: string }

async function ownedTokens(service: DigitalGoodsService): Promise<Owned> {
  const list = await service.listPurchases().catch(() => [] as PlayPurchaseDetails[])
  return {
    guide: list.find((p) => p.itemId === PLAY_PRODUCTS.guide)?.purchaseToken,
    renewal: list.find((p) => p.itemId === PLAY_PRODUCTS.renewal)?.purchaseToken,
  }
}

// A renewal Play completed but the Worker never recorded (the connection
// dropped as the sheet closed) is still listed until it is consumed.
async function finishRenewal(owned: Owned): Promise<PlayVerifyResponse | null> {
  if (!owned.renewal) return null
  return verifyOnServer({
    productId: PLAY_PRODUCTS.renewal,
    purchaseToken: owned.renewal,
    previousToken: owned.guide,
  })
}

// The purchase, from tap to signed in. A guide already owned on this Google
// account is restored rather than charged again (Play would refuse a second
// purchase of it anyway); throws PlayExpired when that copy's time is up.
export async function buyOnPlay(productId: PlayProductId): Promise<PlayVerifyResponse> {
  const service = await digitalGoods()
  if (!service) throw new Error('Google Play Billing is not available on this device.')
  const owned = await ownedTokens(service)

  if (productId === PLAY_PRODUCTS.guide && owned.guide) {
    return verifyOnServer({ productId, purchaseToken: owned.guide })
  }
  if (productId === PLAY_PRODUCTS.renewal && owned.renewal) {
    const finished = await finishRenewal(owned)
    if (finished) return finished
  }

  const request = new PaymentRequest(
    [{ supportedMethods: PLAY_METHOD, data: { sku: productId } }],
    // Play shows its own price; the Payment Request API still requires a total.
    { total: { label: 'Total', amount: { currency: 'USD', value: '0' } } },
  )
  let response: PaymentResponse
  try {
    response = await request.show()
  } catch (err) {
    // AbortError is the reader closing the sheet.
    if (err instanceof DOMException && err.name === 'AbortError') throw new PlayCancelled('cancelled')
    throw err
  }
  const purchaseToken = (response.details as { purchaseToken?: string }).purchaseToken
  if (!purchaseToken) {
    await response.complete('fail')
    throw new Error('Google Play did not return a purchase.')
  }
  try {
    const res = await verifyOnServer({
      productId,
      purchaseToken,
      previousToken: productId === PLAY_PRODUCTS.renewal ? owned.guide : undefined,
    })
    await response.complete('success')
    return res
  } catch (err) {
    await response.complete('fail')
    throw err
  }
}

export type RestoreResult =
  | { kind: 'signed-in'; res: PlayVerifyResponse }
  | { kind: 'expired' }
  | { kind: 'none' }

// Sign in from the purchases Play holds for this Google account: the
// reinstall, the new phone, the cleared browser. Finishes an unrecorded
// renewal first, so a lapsed buyer whose renewal went through comes back in.
export async function restorePlayPurchase(): Promise<RestoreResult> {
  const service = await digitalGoods()
  if (!service) return { kind: 'none' }
  const owned = await ownedTokens(service)
  try {
    const renewed = await finishRenewal(owned)
    if (renewed) return { kind: 'signed-in', res: renewed }
    if (!owned.guide) return { kind: 'none' }
    return { kind: 'signed-in', res: await verifyOnServer({ productId: PLAY_PRODUCTS.guide, purchaseToken: owned.guide }) }
  } catch (err) {
    if (err instanceof PlayExpired) return { kind: 'expired' }
    throw err
  }
}

// At launch inside the shell. Signed out, it restores whatever Play holds.
// Signed in, it only finishes an unrecorded renewal: restoring the guide
// token could switch a web buyer who signed in with their code over to
// another account.
export async function recoverPlayPurchases(signedIn: boolean): Promise<PlayVerifyResponse | null> {
  if (!isAndroidApp()) return null
  try {
    if (signedIn) {
      const service = await digitalGoods()
      return service ? await finishRenewal(await ownedTokens(service)) : null
    }
    const result = await restorePlayPurchase()
    return result.kind === 'signed-in' ? result.res : null
  } catch {
    return null // offline or refused; the next launch tries again
  }
}

// Account labels: a Play account's id is its order number, which means
// nothing to a reader.
export function isPlayAccount(sub: string | undefined): boolean {
  return !!sub && sub.startsWith('play:')
}

export function accountLabel(sub: string | undefined): string {
  return isPlayAccount(sub) ? 'Your Google Play purchase' : (sub ?? '')
}
