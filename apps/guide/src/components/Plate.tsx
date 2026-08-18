// Editorial plate treatment for photography: ink border, engraved offset
// shadow, an uppercase label chip top-right (data-tag), optional italic
// caption. Ported from the editorial site's "Alpine Journal plate"; the hover
// zoom stays behind — this app is touch-first.

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  tag?: string
  caption?: string
  // One-line photographer/license credit, rendered under the caption. The
  // full attribution list (with source links) lives on /account.
  credit?: string
  className?: string
  // Instrument framing for the full read: corner brackets and a scrim over
  // the photograph instead of the engraved offset. The scrim is what lets
  // `footer` readings sit legibly on any exposure.
  hud?: boolean
  footer?: ReactNode
}

export default function Plate({
  children,
  tag,
  caption,
  credit,
  className,
  hud = false,
  footer,
}: Props) {
  const classes = ['plate', hud ? 'plate--hud' : '', className ?? ''].filter(Boolean).join(' ')
  return (
    <figure className={classes}>
      <div className="plate__frame" {...(tag ? { 'data-tag': tag } : {})}>
        {children}
        {hud && <span className="plate__ticks" aria-hidden="true" />}
        {hud && footer && <div className="plate__foot">{footer}</div>}
      </div>
      {(caption || credit) && (
        <figcaption className="plate__caption">
          {caption}
          {credit && <span className="plate__credit">{credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}
