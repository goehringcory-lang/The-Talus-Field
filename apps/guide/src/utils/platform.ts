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

/** True when running as an installed PWA (home-screen launch). */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  )
}
