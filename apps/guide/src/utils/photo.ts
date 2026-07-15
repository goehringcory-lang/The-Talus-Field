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

/** Mid-ladder JPEG variant used as the <img src> fallback. Browsers with
 * srcset support never request it; anything that does gets a sane size
 * instead of the multi-MB original (which stays on disk only as generator
 * input and is never fetched). */
export function fallbackPhotoUrl(src: string): string {
  if (/^https?:/i.test(src)) return src
  return `${responsiveBase(src)}-${RESPONSIVE_WIDTHS[2]}.jpg`
}

export type PhotoFormat = 'avif' | 'webp' | 'jpg'

// 1-pixel probe images. Decoding one tells us which <picture> source the
// browser will actually pick (sources are ordered avif → webp → jpg).
const AVIF_PROBE =
  'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
const WEBP_PROBE =
  'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'

function canDecode(dataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.width > 0)
    img.onerror = () => resolve(false)
    img.src = dataUri
  })
}

let formatPromise: Promise<PhotoFormat> | null = null

/** The image format this device will actually render. Probed once per session. */
export function detectPhotoFormat(): Promise<PhotoFormat> {
  formatPromise ??= (async () => {
    if (await canDecode(AVIF_PROBE)) return 'avif'
    if (await canDecode(WEBP_PROBE)) return 'webp'
    return 'jpg'
  })()
  return formatPromise
}

/** The URLs an offline pack (or opportunistic pre-warm) needs for one photo:
 * the width ladder of the one format this device renders, plus the small JPEG
 * the map popup always requests. Fetching only the rendered format, not all
 * three, keeps the offline download lean over park cellular. The Cache API is
 * per-device, so the format probed at download time is the one served later. */
export function precachePhotoUrls(src: string, format: PhotoFormat): string[] {
  if (/^https?:/i.test(src)) return [src]
  const base = responsiveBase(src)
  const urls = RESPONSIVE_WIDTHS.map((w) => `${base}-${w}.${format}`)
  const popup = popupPhotoUrl(src)
  if (!urls.includes(popup)) urls.push(popup)
  return urls
}
