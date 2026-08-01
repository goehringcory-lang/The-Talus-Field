/** True when the reader has asked the OS for reduced motion.
 *
 * The CSS `prefers-reduced-motion` block only governs animations and
 * `scroll-behavior: auto`; a scrollIntoView called with `behavior: 'smooth'`
 * animates regardless, so scripted scrolls have to check for themselves.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}
