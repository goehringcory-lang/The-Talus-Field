// Editorial empty state: hairline rule, an italic serif note, optionally one
// action. No illustrations.

import type { ReactNode } from 'react'

type Props = {
  note: ReactNode
  action?: ReactNode
}

export default function EmptyState({ note, action }: Props) {
  return (
    <div className="empty-state">
      <p className="empty-state__note">{note}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
