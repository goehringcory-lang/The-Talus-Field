// =============================================================================
// /watch — the Openings tab: the buyer's campsite watches and the form for a
// new one. ?target=&start=&end= pre-fills the form (the map popup's "Watch
// for openings" link); a signed-out visitor is carried through /login with
// the query intact by RequireAuth.
// =============================================================================

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import PlanTabs from '../components/PlanTabs'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import PageHeader from '../components/ui/PageHeader'
import { relativeStamp } from '../utils/relativeStamp'
import WatchForm from '../watch/WatchForm'
import WatchList from '../watch/WatchList'
import { parseWatchParams } from '../watch/deepLink'
import { useWatches } from '../watch/useWatches'

const MAX_WATCHES = 5

export default function Watch() {
  const location = useLocation()
  const navigate = useNavigate()
  const { watches, loading, offline, unavailable, cachedAt, error, create, refresh } = useWatches()
  const [prefill] = useState(() => parseWatchParams(location.search))
  // A deep link opens the form; otherwise it opens once the list is short
  // or the buyer asks for it.
  const [showForm, setShowForm] = useState(() => !!prefill.target)

  const atCap = watches.length >= MAX_WATCHES
  const formOpen = showForm || (!loading && watches.length === 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PlanTabs active="watch" />
        <PageHeader
          eyebrow="Campsite openings"
          title="Watch for a site"
          intro="Pick a campground and your nights, and the guide checks recreation.gov every five minutes. When a site opens, you get a notification, an email, or both, at whatever hour it happens, with the booking link one tap away."
        />

        {unavailable && (
          <Callout tone="warn">
            Openings needs the guide's server to update before it can hold a watch. Try again
            later.
          </Callout>
        )}
        {offline && !unavailable && (
          <Callout
            tone="warn"
            action={
              <Button variant="ghost" size="sm" onClick={refresh}>
                Retry
              </Button>
            }
          >
            {error ?? 'No signal.'}
            {cachedAt ? ` Saved ${relativeStamp(cachedAt)}.` : ''}
          </Callout>
        )}

        {loading ? (
          <p className="watch-form__note" role="status">
            Loading your watches…
          </p>
        ) : (
          <WatchList watches={watches} />
        )}

        {!unavailable && !loading && (
          <section className="watch-new" aria-label="New watch">
            {atCap ? (
              <p className="watch-form__note">
                Five watches is the most one account can hold at a time. Delete one to add
                another.
              </p>
            ) : formOpen ? (
              <>
                <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>
                  New watch
                </span>
                <WatchForm
                  prefill={prefill}
                  onCreate={async (input) => {
                    const watch = await create(input)
                    navigate(`/watch/${watch.id}`)
                  }}
                />
              </>
            ) : (
              <div className="action-row">
                <Button variant="ghost" onClick={() => setShowForm(true)}>
                  Add a watch
                </Button>
              </div>
            )}
          </section>
        )}
      </main>
    </GatedChrome>
  )
}
