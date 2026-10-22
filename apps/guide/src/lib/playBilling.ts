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

// --- Purchase ---------------------------------------------------------------

export type PlayVerifyResponse = { jwt: string; expiresAt: number; extended?: boolean }

// A purchase that Play completed but the Worker has not yet recorded (the
// connection dropped after the payment sheet closed). Kept so the next launch
// can finish it: Play refunds a purchase nobody acknowledges within 3 days.
const PENDING_KEY = 'tfg.playPending'
type PendingPurchase = { productId: PlayProductId; purchaseToken: string; email: string }

function readPending(): PendingPurchase[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]') as unknown
    return Array.isArray(parsed) ? (parsed as PendingPurchase[]) : []
  } catch {
    return []
  }
}

function writePending(list: PendingPurchase[]): void {
  try {
    if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list))
    else localStorage.removeItem(PENDING_KEY)
  } catch {
    /* storage-blocked: the server-side retry path still covers it */
  }
}

function verifyOnServer(p: PendingPurchase): Promise<PlayVerifyResponse> {
  return apiFetch<PlayVerifyResponse>(
    '/api/play/verify',
    { method: 'POST', body: JSON.stringify(p) },
    { timeoutMs: 30_000 },
  )
}

async function verifyAndForget(p: PendingPurchase): Promise<PlayVerifyResponse> {
  writePending([...readPending().filter((x) => x.purchaseToken !== p.purchaseToken), p])
  const res = await verifyOnServer(p)
  writePending(readPending().filter((x) => x.purchaseToken !== p.purchaseToken))
  return res
}

export class PlayCancelled extends Error {}

// Runs the whole purchase: an unconsumed earlier purchase of the same product
// is finished instead of charged again (Play refuses a second purchase of an
// unconsumed product anyway), otherwise Play's payment sheet opens. The email
// names the account; a signed-in session overrides it on the server.
export async function buyOnPlay(
  productId: PlayProductId,
  email: string,
): Promise<PlayVerifyResponse> {
  const service = await digitalGoods()
  if (!service) throw new Error('Google Play Billing is not available on this device.')

  const owned = (await service.listPurchases().catch(() => [])).find((p) => p.itemId === productId)
  if (owned) return verifyAndForget({ productId, purchaseToken: owned.purchaseToken, email })

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
    const res = await verifyAndForget({ productId, purchaseToken, email })
    await response.complete('success')
    return res
  } catch (err) {
    await response.complete('fail')
    throw err
  }
}

// At launch inside the shell: finish any purchase the Worker never recorded.
// Returns the sign-in when one was finished, so the caller can apply it.
export async function recoverPlayPurchases(): Promise<PlayVerifyResponse | null> {
  if (!isAndroidApp()) return null
  let signedIn: PlayVerifyResponse | null = null
  for (const pending of readPending()) {
    try {
      signedIn = await verifyAndForget(pending)
    } catch {
      /* still offline or still refused; the next launch tries again */
    }
  }
  return signedIn
}
