/**
 * PhotoPlaceholder — shown when a stop has no photo wired up yet.
 *
 * Most field-guide stops don't have dedicated photography yet. Rather than
 * leaving a broken <img> or a blank gap, render a tasteful tile that signals
 * "intentionally pending." Voice matches the editorial site: dry, minimal, no
 * exclamation marks. Aspect ratio (4:3) matches a real stop photo so it
 * doesn't shift the layout when a real photo lands later. Styles live in
 * ResponsivePhoto.css under .stop-card__photo--placeholder.
 */

import './ResponsivePhoto.css'

type Props = {
  className?: string
}

export default function PhotoPlaceholder({ className }: Props) {
  return (
    <div
      className={`stop-card__photo stop-card__photo--placeholder${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Photo coming"
    >
      <span aria-hidden="true">Photo coming</span>
    </div>
  )
}
