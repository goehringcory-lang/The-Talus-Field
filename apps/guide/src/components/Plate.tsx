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
}

export default function Plate({ children, tag, caption, credit, className }: Props) {
  return (
    <figure className={`plate${className ? ` ${className}` : ''}`}>
      <div className="plate__frame" {...(tag ? { 'data-tag': tag } : {})}>
        {children}
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
