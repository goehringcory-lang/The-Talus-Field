import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import { ChipButton } from '../components/ui/Chip'
import PageHeader from '../components/ui/PageHeader'
import { clearRecentSearches, readRecentSearches, recordSearch } from '../lib/recentSearches'
import { SEARCH_SUGGESTIONS, queryTokens, search, tokenVariants, type SearchHit } from '../search'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Marks every form of every query word inside `text`, so a reader can see
// why a result matched before opening it.
function highlight(text: string, tokens: string[]): ReactNode {
  const forms = tokens.flatMap(tokenVariants).sort((a, b) => b.length - a.length)
  if (forms.length === 0) return text
  const parts = text.split(new RegExp(`(${forms.map(escapeRegExp).join('|')})`, 'gi'))
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="search-mark">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

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
  const [recent, setRecent] = useState(readRecentSearches)
  const hits = useMemo(() => search(query), [query])
  const tokens = useMemo(() => queryTokens(query), [query])

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
          // The page exists to type into (the editorial /search does the
          // same); a reader who opened it and has to find the box first is
          // the usability cost, not the focus.
          // eslint-disable-next-line jsx-a11y/no-autofocus -- the search box is the page's only purpose
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
            Search every stop, hike, and Secret Guide entry, the essentials and
            packing list, dining, wildlife, and the seasonal almanac. Works
            offline; the whole guide is on your device.
          </p>
        )}

        {trimmed.length === 0 && recent.length > 0 && (
          <section className="search-starts" aria-label="Recent searches">
            <div className="search-starts__head">
              <span className="eyebrow">Recent</span>
              <button
                type="button"
                className="search-starts__clear"
                onClick={() => {
                  clearRecentSearches()
                  setRecent([])
                }}
              >
                Clear
              </button>
            </div>
            <div className="hikes-chips">
              {recent.map((q) => (
                <ChipButton key={q} variant="filter" onClick={() => setQuery(q)}>
                  {q}
                </ChipButton>
              ))}
            </div>
          </section>
        )}

        {trimmed.length > 0 && hits.length === 0 && (
          <p className="search-note">
            Nothing matched "{trimmed}". Try a place name, or one of these.
          </p>
        )}

        {hits.length === 0 && (
          <section className="search-starts" aria-label="Try searching for">
            {trimmed.length === 0 && <span className="eyebrow">Try</span>}
            <div className="hikes-chips">
              {SEARCH_SUGGESTIONS.map((q) => (
                <ChipButton key={q} variant="filter" onClick={() => setQuery(q)}>
                  {q}
                </ChipButton>
              ))}
            </div>
          </section>
        )}

        {Array.from(grouped.entries()).map(([section, sectionHits]) => (
          <section key={section} style={{ marginTop: 32 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 4 }}>{section}</span>
            {sectionHits.map((hit) => (
              <Link
                key={`${hit.section}-${hit.id}`}
                to={hit.url}
                className="search-result"
                onClick={() => recordSearch(query)}
              >
                <div className="dateline">{hit.eyebrow}</div>
                <div className="search-result__title">{highlight(hit.title, tokens)}</div>
                <p className="search-result__snippet">{highlight(hit.snippet, tokens)}</p>
              </Link>
            ))}
          </section>
        ))}
      </main>
    </GatedChrome>
  )
}
