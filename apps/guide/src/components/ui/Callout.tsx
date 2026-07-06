// Inline notice. 'info' is the moss-edged serif nudge; 'warn' the gold-tinted
// sans advisory (stale listings, partial coverage).

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  tone?: 'info' | 'warn'
  action?: ReactNode
}

export default function Callout({ children, tone = 'info', action }: Props) {
  return (
    <div className={tone === 'warn' ? 'callout callout--warn' : 'callout'}>
      <div className="callout__body">{children}</div>
      {action}
    </div>
  )
}
