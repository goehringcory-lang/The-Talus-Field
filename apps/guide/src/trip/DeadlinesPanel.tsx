// =============================================================================
// "Dates that matter": the deadline table (content/deadlines.ts) drawn against
// the buyer's own trip dates, under the trip board. An instrument panel, not
// prose: one readout per dated deadline, soonest first, past ones dimmed but
// kept (a lottery you missed is still a fact about your trip).
//
// Two actions per row. "Add to calendar" writes one .ics through the same
// writer the board export uses (trip/ics.ts), with a VALARM the evening
// before, because the moments here open at midnight and 7 a.m. Pacific and a
// reminder at the moment itself is a reminder of a thing already gone.
// "Remind me" appears only while push notifications are on (Account page) and
// only on rows the Worker knows how to send: it records the id the way the
// trip dates are recorded, on the device's subscription record, and the
// morning sweep sends one notice the day before (workers/src/lib/pushSweep.ts).
//
// Without trip dates the panel prints one line and nothing else: every date
// here is measured from the trip, and a table of undated rules belongs on the
// editorial /dates page, not on a board.
// =============================================================================

import { useState } from 'react'
import Button from '../components/ui/Button'
import {
  DEADLINES_VERIFIED,
  deadlineClock,
  resolveDeadlines,
  type ResolvedDeadline,
} from '../content/deadlines'
import { isPushEnabled, readDeadlineOptIns, setDeadlineOptIn } from '../push/push'
import { formatClock, todayIso } from '../utils/date'
import { deadlineEventFields } from './deadlineEvent'
import { exportTripIcs, type ExportMethod } from './exportTrip'
import { buildEventsIcs } from './ics'

// Which rows the push sweep can turn into a notice: dated moments a person
// acts on, with published confidence. Mirrors the rule in
// workers/src/lib/deadlines.ts; a toggle on any other row would record an
// opt-in nothing ever honours.
function remindable(d: ResolvedDeadline): boolean {
  if (d.confidence !== 'published') return false
  return d.kind === 'relative' || d.kind === 'release-15th' || d.kind === 'annual'
}

// "Tue, Jul 12" or "Sun, Jan 24 to Sat, Jan 30" for the readout label.
function dateLabel(d: ResolvedDeadline): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  return d.endDate > d.date ? `${fmt(d.date)} to ${fmt(d.endDate)}` : fmt(d.date)
}

function forDayLabel(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

type RowProps = {
  deadline: ResolvedDeadline
  pushOn: boolean
  reminded: boolean
  onRemind: (id: string, on: boolean) => void
}

function DeadlineRow({ deadline: d, pushOn, reminded, onRemind }: RowProps) {
  const [exported, setExported] = useState<ExportMethod | null>(null)
  const [busy, setBusy] = useState(false)
  const clock = deadlineClock(d.time)

  async function addToCalendar() {
    setBusy(true)
    try {
      // Built before the await: iOS only allows the share sheet inside the
      // user-gesture task.
      const ics = buildEventsIcs([deadlineEventFields(d)], `${d.title} · The Talus Field`)
      setExported(await exportTripIcs(ics, `yosemite-${d.id}-${d.date}.ics`))
    } finally {
      setBusy(false)
    }
  }

  const notes: string[] = []
  if (d.forDay && d.kind === 'relative') notes.push(`For your ${forDayLabel(d.forDay)} day`)
  if (d.confidence === 'typical') notes.push('Typical pattern, not a promise')
  if (d.past) notes.push('Past')

  return (
    <div className={d.past ? 'readout readout--wide deadline deadline--past' : 'readout readout--wide deadline'}>
      <span className="readout__label">
        {dateLabel(d)}
        {' · '}
        {clock ? (clock.durationMin === 60 ? formatClock(clock.startMin) : `${formatClock(clock.startMin)} to ${formatClock(clock.startMin + clock.durationMin)}`) : d.time}
      </span>
      <span className="readout__value deadline__title">{d.title}</span>
      {notes.length > 0 && <span className="readout__note">{notes.join(' · ')}</span>}
      <p className="deadline__detail">{d.detail}</p>
      <div className="deadline__actions">
        <Button variant="quiet" size="sm" disabled={busy} onClick={addToCalendar}>
          {busy ? 'Saving…' : 'Add to calendar'}
        </Button>
        {pushOn && !d.past && remindable(d) && (
          <label className="deadline__remind">
            <input
              type="checkbox"
              checked={reminded}
              onChange={(e) => onRemind(d.id, e.target.checked)}
            />
            Remind me the morning before
          </label>
        )}
        <a className="deadline__source" href={d.source} target="_blank" rel="noopener">
          NPS source →
        </a>
      </div>
      {exported === 'shared' && (
        <p className="deadline__result">Shared. On iPhone: Save to Files, then open the file to add it.</p>
      )}
      {exported === 'downloaded' && (
        <p className="deadline__result">Downloaded. Open the .ics file and your calendar adds it.</p>
      )}
      {exported === 'failed' && (
        <p className="deadline__result">The export didn't start. Try again, or from a desktop browser.</p>
      )}
    </div>
  )
}

type Props = {
  // null when the buyer has never picked dates: the panel says so and stops.
  dates: { start: string; end: string } | null
}

export default function DeadlinesPanel({ dates }: Props) {
  const [pushOn] = useState(isPushEnabled)
  const [optIns, setOptIns] = useState<string[]>(readDeadlineOptIns)

  function onRemind(id: string, on: boolean) {
    // Optimistic: the local list draws the toggle; the Worker copy follows.
    setOptIns((prev) => (on ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)))
    void setDeadlineOptIn(id, on)
  }

  const resolved = dates ? resolveDeadlines(dates.start, dates.end, todayIso()) : []

  return (
    <section className="panel deadlines" aria-label="Dates that matter for this trip">
      <div className="panel__head">
        <span className="panel__title">Dates that matter</span>
        <span className="panel__stamp">Verified {DEADLINES_VERIFIED}</span>
      </div>
      {!dates ? (
        <p className="deadlines__empty">Pick your arriving and leaving dates above and the dates that decide this trip appear here.</p>
      ) : (
        <div className="panel__grid deadlines__grid">
          {resolved.map((d) => (
            <DeadlineRow
              key={`${d.id}-${d.date}`}
              deadline={d}
              pushOn={pushOn}
              reminded={optIns.includes(d.id)}
              onRemind={onRemind}
            />
          ))}
        </div>
      )}
    </section>
  )
}
