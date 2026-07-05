// Responsive <picture> for stop photos. Variants (AVIF/WebP/JPEG at several
// widths) are pre-generated offline by scripts/gen-responsive-images.mjs into
// public/photos/responsive/. The URLs are derived from the original src with no
// manifest — keep slugify() in sync with that script. External URLs fall back to
// a plain <img>.

import { useCallback, useState, type CSSProperties } from 'react'
import { RESPONSIVE_WIDTHS, responsiveBase } from '../utils/photo'
import './ResponsivePhoto.css'

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
  const [loaded, setLoaded] = useState(false)
  const [instant, setInstant] = useState(false)

  // Cached images (back navigation, SW photo cache) are complete before
  // onLoad can fire. The ref callback runs at commit, before paint, so
  // flagging them here shows them at full opacity immediately, with the
  // transition suppressed so nothing re-fades.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete) {
      setInstant(true)
      setLoaded(true)
    }
  }, [])

  const fadeClass = [
    'photo-fade',
    loaded ? 'photo-fade--in' : '',
    instant ? 'photo-fade--instant' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  const handleLoad = () => setLoaded(true)
  // On failure, reveal the element anyway so the alt text is readable instead
  // of an invisible gap.
  const handleError = () => setLoaded(true)

  const isExternal = /^https?:/i.test(src)
  if (isExternal) {
    return (
      <img
        ref={imgRef}
        className={fadeClass}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    )
  }

  const cleaned = src.replace(/^\//, '')
  const respBase = responsiveBase(src)
  const srcSet = (ext: string) => RESPONSIVE_WIDTHS.map((w) => `${respBase}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        ref={imgRef}
        className={fadeClass}
        src={`/${cleaned}`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  )
}
