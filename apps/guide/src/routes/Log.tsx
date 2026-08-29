// =============================================================================
// /log — the field log: the buyer's own record of the trip, composed from
// state the guide already keeps and previously never showed anywhere. Visited
// marks (tfg.visited, toggled on every stop card), private notes
// (tfg.stopNotes, written on stop pages), the wildlife life list and the
// find-it hunts (both on the shared tfg.checklist map). The page fetches
// nothing and works offline; it is a composition, same posture as /this-week.
//
// Two rules. Nothing the buyer recorded is silently dropped: a note whose
// stop id no longer resolves (edition churn) still renders under its raw id
// rather than vanishing. And zero is a reading, not an error: before the
// trip the log is honestly empty, and the empty state teaches the four
// inputs instead of apologizing.
// =============================================================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PageHeader from '../components/ui/PageHeader'
import { HUNTS } from '../content/hunts'
import { WILDLIFE } from '../content/wildlife'
import { CHECKLIST_STORAGE_KEY, readChecked, type CheckedMap } from '../lib/checklist'
import { guideStopGroups } from '../lib/logSummary'
import { useSightings } from '../lib/sightings'
import { readStopNotes, subscribeStopNotes } from '../lib/stopNotes'
import { useVisited } from '../lib/visited'
import './Log.css'

export default function Log() {
  const { ids: visitedIds } = useVisited()
  const { ids: sightingIds } = useSightings()
  // Notes and hunt check-offs have no live hook of their own; mount-time
  // reads plus the same listeners their home surfaces use keep this page in
  // step with a sync pull or another tab without a reload.
  const [notes, setNotes] = useState<Record<string, string>>(() => ({ ...readStopNotes() }))
  const [checked, setChecked] = useState<CheckedMap>(readChecked)

  useEffect(() => {
    const unsubNotes = subscribeStopNotes(() => setNotes({ ...readStopNotes() }))
    const onStorage = (e: StorageEvent) => {
      if (e.key === CHECKLIST_STORAGE_KEY) setChecked(readChecked())
    }
    window.addEventListener('storage', onStorage)
    return () => {
      unsubNotes()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const visitedSet = new Set(visitedIds)
  const groups = guideStopGroups().map((g) => ({
    ...g,
    visited: g.all.filter((s) => visitedSet.has(s.id)),
  }))
  // Counting through the groups, not visitedIds.length: an id left over from
  // an earlier edition should not inflate the reading.
  const visitedCount = groups.reduce((n, g) => n + g.visited.length, 0)
  const stopTotal = groups.reduce((n, g) => n + g.all.length, 0)

  const species = sightingIds
    .map((id) => WILDLIFE.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))

  const hunts = HUNTS.map((h) => ({
    hunt: h,
    done: h.items.filter((i) => checked[i.id]).length,
  }))
  const huntsDone = hunts.reduce((n, h) => n + h.done, 0)
  const huntsTotal = HUNTS.reduce((n, h) => n + h.items.length, 0)

  // Notes in the guide's own reading order, then anything that no longer
  // resolves (renamed or retired stops) under its raw id, never dropped.
  const orderedStops = groups.flatMap((g) => g.all)
  const notedStops = orderedStops.filter((s) => notes[s.id])
  const resolvedNoteIds = new Set(notedStops.map((s) => s.id))
  const orphanNotes = Object.keys(notes)
    .filter((id) => !resolvedNoteIds.has(id))
    .sort()
  const noteCount = notedStops.length + orphanNotes.length

  const hasAnything =
    visitedCount > 0 || species.length > 0 || huntsDone > 0 || noteCount > 0

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page log">
        <PageHeader
          eyebrow="Your record of the park"
          title="Field log"
          intro="Everything you marked while you were out there, gathered on one page: the stops you reached, the species you settled, the find-it hunts, and your own notes. It fills itself in as you use the guide."
        />

        {hasAnything ? (
          <>
            <div className="spec-strip">
              <div className="spec">
                <span className="spec__label">Stops</span>
                <span className="spec__value">
                  {visitedCount} of {stopTotal}
                </span>
              </div>
              <div className="spec">
                <span className="spec__label">Species</span>
                <span className="spec__value">
                  {species.length} of {WILDLIFE.length}
                </span>
              </div>
              <div className="spec">
                <span className="spec__label">Find-it</span>
                <span className="spec__value">
                  {huntsDone} of {huntsTotal}
                </span>
              </div>
              <div className="spec">
                <span className="spec__label">Notes</span>
                <span className="spec__value">{noteCount}</span>
              </div>
            </div>

            <div className="log-actions no-print">
              <button type="button" className="btn btn--sm" onClick={() => window.print()}>
                Print the log
              </button>
              <span className="dateline">A paper copy makes a decent souvenir.</span>
            </div>
          </>
        ) : (
          <div className="log-empty">
            <p>
              Nothing here yet, which is how it should look before the trip. The log writes
              itself as you go: the visited check on any stop card, the Seen it check on{' '}
              <Link to="/wildlife">the wildlife list</Link>, the{' '}
              <Link to="/hunts">find-it hunts</Link>, and the notes box at the bottom of every
              stop page all land on this page.
            </p>
          </div>
        )}

        {visitedCount > 0 && (
          <section aria-label="Stops visited" className="page-section log-section">
            <span className="eyebrow">Stops visited</span>
            {groups
              .filter((g) => g.visited.length > 0)
              .map((g) => (
                <div key={g.key} className="log-group">
                  <div className="log-group__head">
                    <span className="log-group__title">{g.title}</span>
                    <span className="log-group__count">
                      {g.visited.length} of {g.all.length}
                    </span>
                  </div>
                  <span className="meter" aria-hidden="true">
                    {g.all.map((s, i) => (
                      <span
                        key={s.id}
                        className={i < g.visited.length ? 'meter__seg meter__seg--on' : 'meter__seg'}
                      />
                    ))}
                  </span>
                  <ul className="link-list">
                    {g.visited.map((s) => (
                      <li key={s.id}>
                        <Link to={`/stop/${s.id}`}>{s.title} →</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </section>
        )}

        {species.length > 0 && (
          <section aria-label="Species logged" className="page-section log-section">
            <span className="eyebrow">Species logged</span>
            <ul className="log-species">
              {species.map((w) => (
                <li key={w.id}>
                  {w.name} <span className="log-species__latin">{w.latin}</span>
                </li>
              ))}
            </ul>
            <Link to="/wildlife" className="more-link no-print">
              The quick-ID guide →
            </Link>
          </section>
        )}

        {huntsDone > 0 && (
          <section aria-label="Find-it hunts" className="page-section log-section">
            <span className="eyebrow">Find-it hunts</span>
            <ul className="log-list">
              {hunts
                .filter((h) => h.done > 0)
                .map(({ hunt, done }) => (
                  <li key={hunt.region}>
                    {hunt.title}: {done} of {hunt.items.length} found
                    {done === hunt.items.length ? ', the whole list' : ''}
                  </li>
                ))}
            </ul>
            <Link to="/hunts" className="more-link no-print">
              The find-it lists →
            </Link>
          </section>
        )}

        {noteCount > 0 && (
          <section aria-label="Your notes" className="page-section log-section">
            <span className="eyebrow">Your notes</span>
            {notedStops.map((s) => (
              <div key={s.id} className="log-note">
                <Link to={`/stop/${s.id}`} className="log-note__title">
                  {s.title} →
                </Link>
                <p className="log-note__body">{notes[s.id]}</p>
              </div>
            ))}
            {/* A note outlives the stop it was written on; the raw id is a
                worse label than the title was, but losing the words is worse. */}
            {orphanNotes.map((id) => (
              <div key={id} className="log-note">
                <span className="log-note__title">{id} (no longer in this edition)</span>
                <p className="log-note__body">{notes[id]}</p>
              </div>
            ))}
          </section>
        )}

        <p className="page-footnote">
          The log is yours alone and nothing in it is ever public. Visited marks and notes
          travel to your other devices if you turn on sync in{' '}
          <Link to="/account">Account</Link>; the wildlife list and hunt check-offs stay on
          the device that recorded them.
        </p>
      </main>
    </GatedChrome>
  )
}
