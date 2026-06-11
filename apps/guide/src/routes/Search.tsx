import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { search, type SearchHit } from '../search'

export default function Search() {
  const [query, setQuery] = useState('')
  const hits = useMemo(() => search(query), [query])

  const grouped = useMemo(() => {
    const out = new Map<SearchHit['section'], SearchHit[]>()
    for (const hit of hits) {
      const list = out.get(hit.section) ?? []
      list.push(hit)
      out.set(hit.section, list)
    }
    return out
  }, [hits])

  const trimmed = query.trim()

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 18 }}>Search</h1>

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
          <p style={{ color: 'var(--ink-3)', marginTop: 28 }}>
            Search every stop, the essentials, and the packing list. Works
            offline; the whole guide is on your device.
          </p>
        )}

        {trimmed.length > 0 && hits.length === 0 && (
          <p style={{ color: 'var(--ink-3)', marginTop: 28 }}>
            Nothing matched. Try a place name, or a single word like "parking"
            or "sunrise".
          </p>
        )}

        {Array.from(grouped.entries()).map(([section, sectionHits]) => (
          <section key={section} style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{section}</div>
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
