// Standard page opening: contextual eyebrow, display title, intro paragraph.

import type { ReactNode } from 'react'
import { useDocumentTitle } from '../../lib/documentTitle'

type Props = {
  title: ReactNode
  eyebrow?: string
  eyebrowTone?: 'moss' | 'ink'
  intro?: ReactNode
  /** Tab/history title; defaults to `title` when that is a plain string. */
  documentTitle?: string
}

export default function PageHeader({
  title,
  eyebrow,
  eyebrowTone = 'moss',
  intro,
  documentTitle,
}: Props) {
  useDocumentTitle(documentTitle ?? (typeof title === 'string' ? title : undefined))
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
