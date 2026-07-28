// Shared platform detection. One implementation so the install prompt, the
// download manager, the maps link, and the trip export can't drift apart.

/**
 * True on iPhone/iPad. iPadOS Safari reports itself as a Mac, so touch-Macs
 * are counted as iOS too; the rare touchscreen Mac desktop gets iOS copy,
 * which is the accepted tradeoff for catching every iPad.
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  )
}

/** Which browser is rendering this on iOS. See `iosBrowser()`. */
export type IOSBrowser = 'safari' | 'chrome' | 'firefox' | 'edge' | 'in-app' | 'unknown'

// Embedded webviews that stamp themselves in the UA. None of them can add
// anything to the home screen: the user has to leave for a real browser first.
const IN_APP_TOKENS =
  /FBAN|FBAV|FB_IAB|Instagram|Snapchat|Pinterest|LinkedInApp|Line\/|MicroMessenger|Twitter|GSA\//

/**
 * Which iOS browser this is, as far as the user agent can tell. Every browser
 * on iOS is WebKit underneath, so the vendor token is all there is to go on.
 *
 * This exists because the install instructions are wrong for all but one of
 * them: Safari's Add to Home Screen lives in the Share sheet, Chrome's and
 * Firefox's live behind their own menus, and an embedded webview has no such
 * item at all.
 *
 * The honest limit: SFSafariViewController, which is what Mail and Gmail open
 * a link in, is indistinguishable from Safari here and yet also has no Add to
 * Home Screen. That is why the install sheet carries a "don't see it?" line
 * rather than trusting a 'safari' return outright.
 */
export function iosBrowser(): IOSBrowser {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (IN_APP_TOKENS.test(ua)) return 'in-app'
  if (/CriOS\//.test(ua)) return 'chrome'
  if (/FxiOS\//.test(ua)) return 'firefox'
  if (/EdgiOS\//.test(ua)) return 'edge'
  if (/Safari\//.test(ua)) return 'safari'
  // WebKit with no vendor token at all is a bare WKWebView, i.e. some app's
  // built-in browser that did not bother to identify itself.
  return 'in-app'
}

/** True when running as an installed PWA (home-screen launch). */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  )
}
