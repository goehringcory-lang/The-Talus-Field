// Shared photo URL utilities — used by both ResponsivePhoto and the SW precache.
// Keep slugify() in sync with scripts/gen-responsive-images.mjs.

export const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600] as const

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Returns the /photos/responsive/ base path (no width/ext suffix) for a given src. */
export function responsiveBase(src: string): string {
  const cleaned = src.replace(/^\//, '')
  const lastSlash = cleaned.lastIndexOf('/')
  const dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : ''
  return `/${dir ? dir + '/' : ''}responsive/${slugify(cleaned.split('/').pop() ?? cleaned)}`
}

/** Smallest JPEG variant, for the map popup thumbnail. Derived from
 * RESPONSIVE_WIDTHS so a widths change can't strand a hard-coded suffix. */
export function popupPhotoUrl(src: string): string {
  if (/^https?:/i.test(src)) return src
  return `${responsiveBase(src)}-${RESPONSIVE_WIDTHS[0]}.jpg`
}

/** Returns every URL the browser may request for a photo (original + all responsive variants). */
export function allPhotoUrls(src: string): string[] {
  if (/^https?:/i.test(src)) return [src]
  const base = responsiveBase(src)
  const variants = RESPONSIVE_WIDTHS.flatMap((w) => [
    `${base}-${w}.avif`,
    `${base}-${w}.webp`,
    `${base}-${w}.jpg`,
  ])
  return [src, ...variants]
}
