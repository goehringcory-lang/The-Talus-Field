// Cards / List switch for the deck surfaces. The choice is global (see
// lib/viewMode) — a reader who wants the long scroll wants it everywhere.

import { useViewMode } from '../lib/viewMode'

export default function ViewToggle({ label }: { label: string }) {
  const { mode, setViewMode } = useViewMode()
  return (
    <div className="view-toggle" role="group" aria-label={label}>
      <button
        type="button"
        className="view-toggle__btn"
        aria-pressed={mode === 'cards'}
        onClick={() => setViewMode('cards')}
      >
        Cards
      </button>
      <button
        type="button"
        className="view-toggle__btn"
        aria-pressed={mode === 'list'}
        onClick={() => setViewMode('list')}
      >
        List
      </button>
    </div>
  )
}
