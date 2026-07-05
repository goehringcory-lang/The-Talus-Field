import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { search, type SearchHit } from '../search'
import '../styles/app.css'

export default function Search() {
  const [query, setQuery] = useState('')
  // Defer the expensive scoring pass so keystrokes stay instant; React
  // re-runs the search at lower priority once typing settles.
  const deferredQuery = useDeferredValue(query)
  const hits = useMemo(() => search(deferredQuery), [deferredQuery])

  const grouped = useMemo(() => {
    const out = new Map<SearchHit['section'], SearchHit[]>()
    for (const hit of hits) {
      const list = out.get(hit.section) ?? []
      list.push(hit)
      out.set(hit.section, list)
    }
    return out
  }, [hits])

  const trimmed = deferredQuery.trim()

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <div className="eyebrow eyebrow--moss page__kicker">
          The Field Guide
        </div>
        <h1 className="page__title">Search</h1>

        <input
          className="search-input"
          type="search"
          autoFocus
          enterKeyHint="search"
          placeholder="Tunnel View, parking, bears, chains…"
          aria-label="Search the guide"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {trimmed.length === 0 && (
          <p className="search-hint">
            Search every stop, the essentials, and the packing list. Works
            offline; the whole guide is on your device.
          </p>
        )}

        {trimmed.length > 0 && hits.length === 0 && (
          <p className="search-hint">
            Nothing matched. Try a place name, or a single word like "parking"
            or "sunrise".
          </p>
        )}

        {Array.from(grouped.entries()).map(([section, sectionHits]) => (
          <section key={section} className="search-section">
            <div className="eyebrow">{section}</div>
            {sectionHits.map((hit) => (
              <Link key={`${hit.section}-${hit.id}`} to={hit.url} className="search-result">
                <div className="dateline">{hit.eyebrow}</div>
                <div className="search-result__title">{hit.title}</div>
                <p className="search-result__snippet">{hit.snippet}</p>
              </Link>
            ))}
          </section>
        ))}
      </main>
    </GatedChrome>
  )
}
