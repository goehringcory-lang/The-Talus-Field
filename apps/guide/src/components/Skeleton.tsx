// =============================================================================
// Skeleton — flat loading rectangle in the field-journal idiom.
//
// A plain block of --paper-3 with a slow, low-contrast shimmer. No rounded
// corners, no pulsing bubbles. The shimmer is a pure CSS animation, so the
// global prefers-reduced-motion rule in styles/tokens.css neuters it with no
// JS involved.
//
// Accessibility contract: every Skeleton is decorative and renders with
// aria-hidden="true". The container that hosts a loading state is responsible
// for carrying aria-busy="true" (see the /programs loading block for the
// pattern).
// =============================================================================

import type { CSSProperties } from 'react'
import './Skeleton.css'

type Props = {
  /**
   * 'title' and 'text' are preset line heights that approximate one line of
   * display and caption type; 'block' takes its size entirely from
   * width/height/className.
   */
  variant?: 'block' | 'title' | 'text'
  width?: number | string
  height?: number | string
  className?: string
  style?: CSSProperties
}

export default function Skeleton({
  variant = 'block',
  width,
  height,
  className,
  style,
}: Props) {
  const classes = ['skeleton']
  if (variant !== 'block') classes.push(`skeleton--${variant}`)
  if (className) classes.push(className)
  return (
    <span
      aria-hidden="true"
      className={classes.join(' ')}
      style={{ width, height, ...style }}
    />
  )
}
