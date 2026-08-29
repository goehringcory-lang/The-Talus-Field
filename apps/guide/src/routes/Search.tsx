import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import { search, type SearchHit } from '../search'

// The query rides the URL as ?q=, read once on mount and mirrored with
// replaceState (not pushState: one history entry per keystroke would bury
// the previous page). Coming back from a result restores the search instead
// of a blank box, and a search is a shareable link. Same idiom as the
// editorial site's /search and this app's Account ?renew= read.
function readInitialQuery(): string {
  try {
    return new URL(window.location.href).searchParams.get('q') ?? ''
  } catch {
    return ''
  }
}

export default function Search() {
  const [query, setQuery] = useState(readInitialQuery)
  const hits = useMemo(() => search(query), [query])

  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const trimmedQuery = query.trim()
      if (trimmedQuery) url.searchParams.set('q', trimmedQuery)
      else url.searchParams.delete('q')
      window.history.replaceState(window.history.state, '', url)
    } catch {
      /* mirroring is a convenience; the search itself never depends on it */
    }
  }, [query])

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
      <main className="wrap wrap--narrow page">
        <PageHeader eyebrow="Every page, offline" title="Search" />

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

        {/* Results rewrite themselves as the query changes with nothing said
            about it; this is that, spoken. Silent on an empty box, where
            "0 results" is only noise. */}
        <p className="sr-only" aria-live="polite">
          {trimmed.length > 0 ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'}` : ''}
        </p>

        {trimmed.length === 0 && (
          <p className="search-note">
            Search every stop, the essentials, and the packing list. Works
            offline; the whole guide is on your device.
          </p>
        )}

        {trimmed.length > 0 && hits.length === 0 && (
          <p className="search-note">
            Nothing matched. Try a place name, or a single word like "parking"
            or "sunrise".
          </p>
        )}

        {Array.from(grouped.entries()).map(([section, sectionHits]) => (
          <section key={section} style={{ marginTop: 32 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>{section}</span>
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
