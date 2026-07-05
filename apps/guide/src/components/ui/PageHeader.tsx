// Standard page opening: contextual eyebrow, display title, intro paragraph.

import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  eyebrow?: string
  eyebrowTone?: 'moss' | 'ink'
  intro?: ReactNode
}

export default function PageHeader({ title, eyebrow, eyebrowTone = 'moss', intro }: Props) {
  return (
    <header className="page-header">
      {eyebrow && (
        <span className={eyebrowTone === 'moss' ? 'eyebrow eyebrow--moss' : 'eyebrow'}>
          {eyebrow}
        </span>
      )}
      <h1>{title}</h1>
      {intro && <p className="page-header__intro">{intro}</p>}
    </header>
  )
}
