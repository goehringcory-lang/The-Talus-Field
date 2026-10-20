// =============================================================================
// /backpacking: the overnight routes, in the order to work up through them
// (a first night at May Lake to four days down the Grand Canyon of the
// Tuolumne), each with its nights, its measured numbers and its permit
// trailhead, and below them the wilderness rules every one of them carries.
// Fully bundled, so it reads offline; the route lines are on the map.
// =============================================================================

import { Link } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import HikeModeToggle from '../components/HikeModeToggle'
import PlanTabs from '../components/PlanTabs'
import TrackSparkline from '../components/TrackSparkline'
import { Chip } from '../components/ui/Chip'
import PageHeader from '../components/ui/PageHeader'
import { REGION_SHORT } from '../content'
import { BACKPACK_TRIPS } from '../content/backpacking'
import { BACKPACK_RULES } from '../content/backpacking-rules'
import { formatElevation } from '../content/labels'
import { LEVEL_LABEL, nightsLabel } from '../backpacking/plan'
import { ROUTE_SUMMARY } from '../backpacking/routes'
import './Backpacking.css'

export default function Backpacking() {
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="hikes" />
        <HikeModeToggle active="overnight" />
        <PageHeader
          eyebrow="Overnight routes"
          title="Backpacking"
          intro="Ten routes, in the order to work up through them: where each night is legally spent, every place to fill a bottle, and the permit trailhead to apply for."
        />

        <p className="bp-lede">
          Every trip needs a wilderness permit, and the permit reserves a trailhead and a start date, not a
          campsite. The rules that ride along on all of them are{' '}
          <a href="#rules">at the foot of this page</a>.
        </p>

        <ol className="bp-list">
          {BACKPACK_TRIPS.map((t, i) => {
            const s = ROUTE_SUMMARY[t.id]
            return (
              <li key={t.id} className="bp-card">
                <Link to={`/backpacking/${t.id}`} className="bp-card__link">
                  <span className="bp-card__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="bp-card__body">
                    <span className="bp-card__eyebrow">
                      {REGION_SHORT[t.region]} · {LEVEL_LABEL[t.level]}
                    </span>
                    <span className="bp-card__title">{t.title}</span>
                    <span className="bp-card__teaser">{t.teaser}</span>
                    <span className="bp-card__chips">
                      <Chip variant="meta">{nightsLabel(t)}</Chip>
                      <Chip variant="meta">
                        {(s?.mi ?? t.distanceMi).toFixed(1)}&nbsp;mi{t.route === 'one-way' ? ' one way' : ''}
                      </Chip>
                      <Chip variant="meta">{(s?.gainFt ?? t.elevationGainFt).toLocaleString('en-US')}&nbsp;ft gain</Chip>
                      <Chip variant="meta">Tops {formatElevation(s?.maxFt ?? t.highPointFt)}</Chip>
                    </span>
                    {s && (
                      <span className="bp-card__profile">
                        <TrackSparkline spark={s.spark} />
                        <span className="bp-card__days">
                          {s.dayMi.map((mi, d) => `Day ${d + 1} ${mi.toFixed(1)}`).join(' · ')} mi
                        </span>
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>

        <p className="bp-maplink">
          <Link className="btn btn--ghost" to="/map?tab=backpacking">
            All ten on the offline map →
          </Link>
        </p>

        <section id="rules" className="bp-rules" aria-labelledby="bp-rules-title">
          <h2 id="bp-rules-title" className="bp-section__title">
            The rules on every trip
          </h2>
          {BACKPACK_RULES.map((r) => (
            <details key={r.id} className="bp-rule">
              <summary>{r.title}</summary>
              <p>
                {r.text}{' '}
                <a href={r.source} target="_blank" rel="noreferrer">
                  Source
                </a>
              </p>
            </details>
          ))}
        </section>

        <p className="page-footnote">
          Routes measured over USGS National Map trail linework (NPS source data), with OpenStreetMap where the
          USGS lines miss the signed trail; elevations from USGS 3DEP. Camps, water and permit details checked
          against nps.gov, Recreation.gov and USGS place names in October 2026. Trail and fire closures change
          week to week: read the park's conditions page before you go.
        </p>
      </main>
    </GatedChrome>
  )
}
