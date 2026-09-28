// =============================================================================
// The search box over the map: a combobox over map/mapSearch.ts. Arrow keys
// walk the results, Enter or a tap goes to one, Escape clears. Everything it
// searches is bundled or cached, so it answers in airplane mode.
// =============================================================================

import { useId, useMemo, useState } from 'react'
import { searchMap, type MapHit } from './mapSearch'
import type { ProgramPoint } from './programPoints'

type Props = {
  programs: ProgramPoint[]
  onPick: (hit: MapHit) => void
}

export default function MapSearch({ programs, onPick }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const hits = useMemo(() => searchMap(query, programs), [query, programs])
  const listId = useId()
  const show = open && query.trim().length >= 2

  const pick = (hit: MapHit) => {
    onPick(hit)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="map-search">
      <input
        type="search"
        className="map-search__input"
        placeholder="Search the map"
        aria-label="Search the map for a place, trail, lot or program"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={show && hits[active] ? `${listId}-${active}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((i) => Math.min(i + 1, hits.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter' && hits[active]) {
            e.preventDefault()
            pick(hits[active])
          } else if (e.key === 'Escape') {
            setQuery('')
            setOpen(false)
          }
        }}
      />
      {show && (
        <ul className="map-search__list" id={listId} role="listbox" aria-label="Places on the map">
          {hits.length === 0 ? (
            <li className="map-search__empty" role="presentation">
              Nothing on the map by that name.
            </li>
          ) : (
            hits.map((hit, i) => (
              <li
                key={`${hit.kind}:${hit.id}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="map-search__hit"
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(hit)
                }}
              >
                <span className="map-search__title">{hit.title}</span>
                <span className="map-search__detail">{hit.detail}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
