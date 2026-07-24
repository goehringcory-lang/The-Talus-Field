// Seasonal-almanac notices scoped to a place: every current or upcoming
// almanac entry whose stopIds intersect the given ids. Rendered on stop and
// hike pages so a closure or window that affects the place the reader is
// looking at surfaces there, not only on /programs. Copy comes verbatim from
// content/seasonal.ts; 'typical'-confidence entries are labeled as such, the
// house rule for the almanac everywhere it renders.

import { SEASONAL_EVENTS, seasonalRangeLabel } from '../content'
import { todayIso } from '../utils/date'
import Callout from './ui/Callout'

export default function SeasonalNotices({ stopIds }: { stopIds: string[] }) {
  if (stopIds.length === 0) return null
  const today = todayIso()
  const events = SEASONAL_EVENTS.filter(
    (ev) => ev.dateEnd >= today && ev.stopIds?.some((id) => stopIds.includes(id)),
  )
  if (events.length === 0) return null

  return (
    <section aria-label="In season here" className="page-section">
      <span className="eyebrow">In season here</span>
      {events.map((ev) => (
        <Callout key={ev.id} tone={ev.confidence === 'confirmed' ? 'warn' : 'info'}>
          <p>
            <strong>{ev.title}</strong>
            {ev.confidence === 'typical' ? ' (typical)' : null} · {seasonalRangeLabel(ev)}
          </p>
          <p>{ev.description}</p>
          {ev.url && (
            <p>
              <a href={ev.url} target="_blank" rel="noreferrer">
                Check current conditions →
              </a>
            </p>
          )}
        </Callout>
      ))}
    </section>
  )
}
