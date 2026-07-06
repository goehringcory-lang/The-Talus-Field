// The "← Back" link every detail page carries; placement 'top' sits above the
// content, 'footer' below it.

import { Link } from 'react-router-dom'

type Props = {
  to: string
  label: string
  placement?: 'top' | 'footer'
}

export default function BackLink({ to, label, placement = 'footer' }: Props) {
  return (
    <p className={placement === 'top' ? 'back-row' : 'back-row back-row--footer'}>
      <Link to={to} className="back-link">
        ← {label}
      </Link>
    </p>
  )
}
