// =============================================================================
// /dining — where to eat, in and around the park. Every food and drink
// option inside the park with hours from the current Yosemite Guide edition,
// then the gateway-town places worth knowing, grouped by corridor. Fully
// bundled content, so it works offline like the rest of the guide.
// =============================================================================

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import MapsLink from '../components/MapsLink'
import Callout from '../components/ui/Callout'
import { Chip, ChipButton } from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import {
  DINING_AREAS,
  DINING_HOURS_SOURCE,
  DINING_KIND_LABEL,
  GATEWAY_TOWNS,
  getDiningByArea,
  getDiningByTown,
  getStopById,
} from '../content'
import type { DiningKind, DiningVenueT } from '../content'
import './Dining.css'

const KINDS: DiningKind[] = ['sit-down', 'counter', 'snack', 'coffee', 'bar', 'grocery']

function VenueRow({ venue }: { venue: DiningVenueT }) {
  const stop = venue.stopId ? getStopById(venue.stopId) : undefined
  return (
    <details className="dining-row">
      <summary>
        <span className="dining-row__price">
          {venue.price}
          <span className="dining-row__kind">{DINING_KIND_LABEL[venue.kind]}</span>
        </span>
        <span>
          <h2 className="dining-row__title">{venue.name}</h2>
          <span className="dining-row__meta">
            <span>{venue.place}</span>
            {venue.closed ? (
              <Chip variant="badge">Closed</Chip>
            ) : (
              venue.hours && <span>{venue.hours}</span>
            )}
            {venue.season && <Chip variant="badge">{venue.season}</Chip>}
            {venue.reservations && <Chip variant="badge">Reservations</Chip>}
          </span>
        </span>
      </summary>
      <p className="dining-row__body">{venue.description}</p>
      {venue.closed && <p className="dining-row__note">{venue.closed}</p>}
      {venue.hoursNote && !venue.closed && (
        <p className="dining-row__note">Hours: {venue.hours ? `${venue.hours}, ` : ''}{venue.hoursNote}.</p>
      )}
      {venue.reservations && <p className="dining-row__note">{venue.reservations}</p>}
      {(venue.coord || stop) && (
        <p className="dining-row__body dining-row__footer">
          <MapsLink coord={venue.coord} label={venue.name} />
          {stop && <Link to={`/stop/${stop.id}`}>In the guide →</Link>}
        </p>
      )}
    </details>
  )
}

export default function Dining() {
  const [kindFilter, setKindFilter] = useState<DiningKind | null>(null)

  const byKind = (list: DiningVenueT[]) =>
    list.filter((v) => !kindFilter || v.kind === kindFilter)

  const parkSections = useMemo(
    () =>
      DINING_AREAS.map((area) => ({
        area,
        venues: byKind(getDiningByArea(area.id)),
      })).filter((s) => s.venues.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kindFilter],
  )

  const townSections = useMemo(
    () =>
      GATEWAY_TOWNS.map((town) => ({
        town,
        venues: byKind(getDiningByTown(town.name)),
      })).filter((s) => s.venues.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kindFilter],
  )

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Fuel, coffee, and the one splurge"
          title="Where to eat"
          intro="Every food and drink option inside the park, with the hours the park publishes, then the gateway-town places actually worth a table. The strategy layer, cooler first, lives in the essentials."
        />

        <Callout tone="warn">
          In-park hours are from the {DINING_HOURS_SOURCE.edition} Yosemite Guide and shift with
          each edition and season. Gateway-town hours change even more often. Confirm before
          driving hungry: travelyosemite.com for in-park, a phone call for the towns.
        </Callout>

        <div className="dining-chips" role="group" aria-label="Filter by kind">
          {KINDS.map((k) => (
            <ChipButton
              key={k}
              variant="filter"
              pressed={kindFilter === k}
              onClick={() => setKindFilter(kindFilter === k ? null : k)}
            >
              {DINING_KIND_LABEL[k]}
            </ChipButton>
          ))}
        </div>

        {parkSections.length === 0 && townSections.length === 0 && (
          <EmptyState note="Nothing matches the current filter." />
        )}

        {parkSections.map(({ area, venues }) => (
          <section key={area.id} aria-label={area.title}>
            <div className="dining-area-header">{area.title}</div>
            {area.note && <p className="dining-area-note">{area.note}</p>}
            {venues.map((v) => (
              <VenueRow key={v.id} venue={v} />
            ))}
          </section>
        ))}

        {townSections.length > 0 && (
          <section aria-label="The gateway towns">
            <div className="dining-area-header">The gateway towns</div>
            <p className="dining-area-note">
              Outside the gates the food gets better and cheaper at the same time. Each corridor
              below is listed with its entrance; drive times to the Valley floor run 45 minutes to
              two hours, so these are dinner-near-your-bed options, not lunch-mid-hike options.
            </p>
            {townSections.map(({ town, venues }) => (
              <div key={town.name}>
                <h2 className="dining-town-header">
                  {town.name}
                  <small>{town.route}</small>
                </h2>
                {venues.map((v) => (
                  <VenueRow key={v.id} venue={v} />
                ))}
              </div>
            ))}
          </section>
        )}

        <p className="page-footnote">
          The playbook that ties this together, cooler lunches, the pizza-deck night, when the
          Ahwahnee is worth it, is in{' '}
          <Link to="/essentials/eating-in-the-park">Eating in the park: the realistic tiers</Link>.
          And everything scented follows the <Link to="/essentials/bear-safety">bear rules</Link>:
          food lockers or arm&apos;s reach, never loose in the car overnight.
        </p>
      </main>
    </GatedChrome>
  )
}
