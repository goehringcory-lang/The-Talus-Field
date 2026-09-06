// =============================================================================
// /watch/:id — one watch: what it asks for, when it was last checked, what is
// open right now from the cached grid, and the outbound booking button. This
// is where a push tap lands (sw.js opens in-app paths only), so the page's
// job is to get the buyer to recreation.gov in one more tap.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import PageHeader from '../components/ui/PageHeader'
import { tripDatesLabel } from '../utils/date'
import { relativeStamp } from '../utils/relativeStamp'
import { leaveDateOf, nightLabel, nightsCount, nightsLabel } from '../watch/nights'
import type { WatchChannelsT, WatchDetailT, WatchT } from '../watch/schema'
import { checkedLine } from '../watch/status'
import { bookUrlFor, targetById } from '../watch/targets'
import { loadWatchDetail, readCachedWatches, removeWatch, updateWatchChannels } from '../watch/useWatches'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const ARM_GUARD_MS = 400
const DISARM_AFTER_MS = 6000

type View =
  | { kind: 'loading' }
  | { kind: 'missing' }
  | { kind: 'live'; detail: WatchDetailT }
  | { kind: 'cached'; watch: WatchT; cachedAt: string; error: string }

function BackLinks() {
  return (
    <p className="watch-form__note" style={{ marginTop: 24 }}>
      <Button variant="quiet" size="sm" to="/watch">
        ← All watches
      </Button>
    </p>
  )
}

export default function WatchDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState<View>({ kind: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [armed, setArmed] = useState(false)
  const armedAt = useRef(0)

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(async () => {
      if (cancelled) return
      if (!UUID_RE.test(id)) {
        setView({ kind: 'missing' })
        return
      }
      try {
        const detail = await loadWatchDetail(id)
        if (cancelled) return
        setView(detail ? { kind: 'live', detail } : { kind: 'missing' })
      } catch (err) {
        if (cancelled) return
        // Offline: the list cache still knows the watch, minus the openings.
        const cached = readCachedWatches()
        const watch = cached?.watches.find((w) => w.id === id)
        setView(
          watch && cached
            ? {
                kind: 'cached',
                watch,
                cachedAt: cached.cachedAt,
                error: err instanceof Error && err.message ? err.message : 'No signal.',
              }
            : { kind: 'missing' },
        )
      }
    })
    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  useEffect(() => {
    if (!armed) return
    const timer = window.setTimeout(() => setArmed(false), DISARM_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [armed])

  if (view.kind === 'loading') {
    return (
      <GatedChrome>
        <main className="wrap wrap--narrow page">
          <p className="watch-form__note" role="status">
            Loading…
          </p>
        </main>
      </GatedChrome>
    )
  }
  if (view.kind === 'missing') {
    return (
      <GatedChrome>
        <main className="wrap wrap--narrow page">
          <PageHeader eyebrow="Campsite openings" title="That watch is gone" intro="It was deleted, or its last night has passed. Watches clean themselves up two days after the stay." />
          <BackLinks />
        </main>
      </GatedChrome>
    )
  }

  const watch = view.kind === 'live' ? view.detail.watch : view.watch
  const target = targetById(watch.targetId)
  const name = view.kind === 'live' ? view.detail.target.name : (target?.name ?? watch.targetId)
  const bookUrl = view.kind === 'live' ? view.detail.target.bookUrl : target ? bookUrlFor(target) : null
  const isPerson = (view.kind === 'live' ? view.detail.target.model : target?.model) === 'person'
  const availability = view.kind === 'live' ? view.detail.availability : null
  const checked = checkedLine(watch)
  const openNow = watch.open ?? watch.lastOpen

  async function run(fn: () => Promise<void>, failure: string) {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : failure)
    } finally {
      setBusy(false)
    }
  }

  function toggleChannel(key: keyof WatchChannelsT) {
    const next = { ...watch.channels, [key]: !watch.channels[key] }
    void run(async () => {
      await updateWatchChannels(watch.id, next)
      setReloadKey((k) => k + 1)
    }, 'Could not change how you are told.')
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Campsite openings"
          title={name}
          intro={`${tripDatesLabel({ start: watch.start, end: leaveDateOf(watch.start, watch.nights) })} · ${nightsCount(watch.nights)} · ${watch.mode === 'full' ? 'every night on one site' : 'any single night'}${isPerson ? ` · ${watch.party} ${watch.party === 1 ? 'spot' : 'spots'}` : ''}`}
        />

        {view.kind === 'cached' && (
          <Callout tone="warn">
            {view.error} Showing what this device saved {relativeStamp(view.cachedAt)}; current
            openings need signal.
          </Callout>
        )}
        {watch.lastError && (
          <Callout tone="warn">
            {watch.lastError}. The guide keeps trying; if this persists for an hour, check
            recreation.gov directly.
          </Callout>
        )}

        <section className="panel" aria-label="Watch status">
          <div className="panel__head">
            <span className="panel__title">Last check</span>
            <span className={checked.warn ? 'panel__stamp panel__stamp--warn' : 'panel__stamp'}>
              {watch.lastCheckedAt ? relativeStamp(watch.lastCheckedAt) : 'pending'}
            </span>
          </div>
          <div className="panel__grid">
            <div className="readout">
              <span className="readout__label">Open now</span>
              <span className={`readout__value${openNow.length > 0 ? ' readout__value--signal' : ''}`}>
                {openNow.length > 0 ? nightsLabel(openNow) : 'none'}
              </span>
            </div>
            <div className="readout">
              <span className="readout__label">Alerts sent</span>
              <span className="readout__value">{watch.notifyCount}</span>
              {watch.lastNotifiedAt && (
                <span className="readout__note">last {relativeStamp(watch.lastNotifiedAt)}</span>
              )}
            </div>
          </div>
        </section>

        {availability && availability.openings.length > 0 && (
          <section className="watch-openings" aria-label="Openings right now">
            <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
              Openings right now
            </span>
            <ul className="watch-openings__list">
              {availability.openings.map((o) => (
                <li key={o.date}>
                  <strong>{nightLabel(o.date)}</strong>
                  {o.qty !== null
                    ? `: ${o.qty} ${o.qty === 1 ? 'spot' : 'spots'}`
                    : `: ${o.sites.length} ${o.sites.length === 1 ? 'site' : 'sites'} (${o.sites
                        .slice(0, 6)
                        .map((s) => (s.site.startsWith(s.loop) ? s.site : `${s.loop} ${s.site}`.trim()))
                        .join(', ')}${o.sites.length > 6 ? ` and ${o.sites.length - 6} more` : ''})`}
                </li>
              ))}
            </ul>
            {availability.stale && (
              <p className="watch-form__note">
                This grid is more than half an hour old; what it shows may already be gone.
              </p>
            )}
          </section>
        )}

        {bookUrl && (
          <div className="action-row" style={{ marginTop: 18 }}>
            <Button href={bookUrl} external>
              Book on recreation.gov →
            </Button>
          </div>
        )}
        <p className="watch-form__note">
          Sites go in minutes. Have your recreation.gov account signed in and your card ready
          before the alert comes.
        </p>

        <section className="watch-channels" aria-label="How you are told">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>
            How you are told
          </span>
          <label className="watch-choice">
            <input
              type="checkbox"
              checked={watch.channels.push}
              disabled={busy || view.kind !== 'live'}
              onChange={() => toggleChannel('push')}
            />
            <span>A notification on every device you have notifications on.</span>
          </label>
          <label className="watch-choice">
            <input
              type="checkbox"
              checked={watch.channels.email}
              disabled={busy || view.kind !== 'live'}
              onChange={() => toggleChannel('email')}
            />
            <span>An email to the address on your account.</span>
          </label>
          <p className="watch-form__note">
            Alerts arrive at whatever hour a site appears. Deleting the watch is the off switch;
            it also goes on its own two days after your last night.
          </p>
        </section>

        {error && (
          <p className="watch-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="action-row" style={{ marginTop: 24 }}>
          <Button
            variant={armed ? 'danger' : 'ghost'}
            disabled={busy || view.kind !== 'live'}
            onClick={() => {
              if (!armed) {
                armedAt.current = Date.now()
                setArmed(true)
                return
              }
              if (Date.now() - armedAt.current < ARM_GUARD_MS) return
              setArmed(false)
              void run(async () => {
                await removeWatch(watch.id)
                navigate('/watch', { replace: true })
              }, 'Could not delete the watch.')
            }}
          >
            {armed ? 'Tap again to delete' : 'Delete watch'}
          </Button>
          {armed && (
            <Button variant="quiet" size="sm" onClick={() => setArmed(false)}>
              Keep it
            </Button>
          )}
        </div>
        <BackLinks />
      </main>
    </GatedChrome>
  )
}
