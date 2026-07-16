// The one button. Renders a <Link> when `to` is set, an <a> when `href` is,
// otherwise a <button>. Solid is the primary ink-on-paper action, ghost the
// secondary outline, quiet a text link that happens to be a button.

import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  children: ReactNode
  variant?: 'solid' | 'ghost' | 'quiet'
  size?: 'md' | 'sm'
  to?: string
  // Router state forwarded with `to` (e.g. { from } so /login can return to
  // the page that sent the visitor there).
  state?: unknown
  href?: string
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler
  className?: string
  'aria-label'?: string
}

export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  to,
  state,
  href,
  external = false,
  type = 'button',
  disabled = false,
  onClick,
  className,
  'aria-label': ariaLabel,
}: Props) {
  const cls = [
    'btn',
    variant === 'ghost' && 'btn--ghost',
    variant === 'quiet' && 'btn--quiet',
    size === 'sm' && 'btn--sm',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} state={state} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
