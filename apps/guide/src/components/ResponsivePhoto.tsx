// Responsive <picture> for stop photos. Variants (AVIF/WebP/JPEG at several
// widths) are pre-generated offline by scripts/gen-responsive-images.mjs into
// public/photos/responsive/. The URLs are derived from the original src with no
// manifest — keep slugify() in sync with that script. External URLs fall back to
// a plain <img>.

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { RESPONSIVE_WIDTHS, responsiveBase, fallbackPhotoUrl } from '../utils/photo'
import PhotoPlaceholder from './PhotoPlaceholder'

type Props = {
  src: string
  alt: string
  className?: string
  sizes?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  style?: CSSProperties
}

export default function ResponsivePhoto({
  src,
  alt,
  className,
  sizes = '(max-width: 720px) 100vw, 680px',
  width = 1200,
  height = 900,
  loading = 'lazy',
  style,
}: Props) {
  // A 404ing photo (bad path, evicted cache while offline) would render the
  // browser's broken-image icon; fall back to the same tile used for stops
  // with no photo at all. onError on the <img> fires only after the whole
  // <picture> candidate chain has failed, so this is the right trigger.
  // The failure is recorded per-src: StopDetail keeps this component instance
  // alive across Prev/Next navigation, and a boolean would stick every
  // subsequent stop's photo on the placeholder after one bad image.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === src
  const isExternal = /^https?:/i.test(src)

  if (failed) {
    return <PhotoPlaceholder className={className} />
  }

  if (isExternal) {
    return (
      <img className={className} src={src} alt={alt} loading={loading} decoding="async" width={width} height={height} style={style} onError={() => setFailedSrc(src)} />
    )
  }

  const respBase = responsiveBase(src)
  const srcSet = (ext: string) => RESPONSIVE_WIDTHS.map((w) => `${respBase}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        className={className}
        src={fallbackPhotoUrl(src)}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={style}
        onError={() => setFailedSrc(src)}
      />
    </picture>
  )
}
