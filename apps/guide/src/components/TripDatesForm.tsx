// "When are you in the park?" The first question the planner asks, on Home
// and on a region's planner when no dates are set. It writes through the
// plan's own setDates, which also stores tfg.trip.dates, so /programs and
// /trip read the same window. Clamped the way /trip clamps: the end never
// before the start, and no longer than the programs feed will answer.

import { useState } from 'react'
import { MAX_SPAN_DAYS, defaultTripDates } from '../programs/usePrograms'
import { useTripPlan } from '../trip/useTripPlan'
import { addDaysIso } from '../utils/date'
import Button from './ui/Button'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export default function TripDatesForm({ onSet, submitLabel = 'Set my days' }: { onSet?: () => void; submitLabel?: string }) {
  const { setDates } = useTripPlan()
  const [start, setStart] = useState(() => defaultTripDates().start)
  const [end, setEnd] = useState(() => defaultTripDates().end)
  const valid = DATE_RE.test(start) && DATE_RE.test(end)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    let boundedEnd = end < start ? start : end
    const max = addDaysIso(start, MAX_SPAN_DAYS)
    if (boundedEnd > max) boundedEnd = max
    setDates(start, boundedEnd)
    onSet?.()
  }

  return (
    <form className="trip-dates-form" onSubmit={submit}>
      <div className="trip-dates-form__fields">
        <label className="field">
          Arriving
          <input className="field-control" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label className="field">
          Leaving
          <input
            className="field-control"
            type="date"
            value={end}
            min={start}
            max={DATE_RE.test(start) ? addDaysIso(start, MAX_SPAN_DAYS) : undefined}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>
      </div>
      <Button type="submit" disabled={!valid}>
        {submitLabel}
      </Button>
    </form>
  )
}
