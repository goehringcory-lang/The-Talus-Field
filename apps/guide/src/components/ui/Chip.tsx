// One chip family replacing the four ad-hoc implementations (.meta-chip,
// .gps-chip, .programs-chip, .program-row__badge). Chip renders the
// non-interactive variants as a <span>; ChipButton the tappable ones.

import type { MouseEventHandler, ReactNode } from 'react'

export function Chip({
  variant,
  children,
  className,
}: {
  variant: 'meta' | 'badge'
  children: ReactNode
  className?: string
}) {
  return <span className={`chip chip--${variant}${className ? ` ${className}` : ''}`}>{children}</span>
}

export function ChipButton({
  variant,
  children,
  onClick,
  pressed,
  'aria-label': ariaLabel,
  className,
}: {
  variant: 'action' | 'filter'
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
  pressed?: boolean
  'aria-label'?: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={`chip chip--${variant}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      aria-pressed={variant === 'filter' ? pressed === true : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
