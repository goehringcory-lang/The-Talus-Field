// Responsive <picture> for stop photos. Variants (AVIF/WebP/JPEG at several
// widths) are pre-generated offline by scripts/gen-responsive-images.mjs into
// public/photos/responsive/. The URLs are derived from the original src with no
// manifest — keep slugify() in sync with that script. External URLs fall back to
// a plain <img>.

import type { CSSProperties } from 'react'

const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600]

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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
  const isExternal = /^https?:/i.test(src)
  if (isExternal) {
    return (
      <img className={className} src={src} alt={alt} loading={loading} decoding="async" width={width} height={height} style={style} />
    )
  }

  const cleaned = src.replace(/^\//, '')
  const lastSlash = cleaned.lastIndexOf('/')
  const dir = lastSlash >= 0 ? cleaned.slice(0, lastSlash) : ''
  const respBase = `/${dir ? dir + '/' : ''}responsive/${slugify(cleaned.split('/').pop() ?? cleaned)}`
  const srcSet = (ext: string) => RESPONSIVE_WIDTHS.map((w) => `${respBase}-${w}.${ext} ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        className={className}
        src={`/${cleaned}`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={style}
      />
    </picture>
  )
}
