// =============================================================================
// /report — tell the guide it is wrong. ?type=stop|hike|dining|place|app and
// ?id= name the entry; the page says which one it is about, offers the five
// kinds of problem a field guide actually has, and can attach one GPS reading,
// taken only when the reader taps for it (the Help card and compass rule: no
// location prompt on open). Sending goes through lib/corrections.ts, which
// queues the report on the device when there is no signal.
// =============================================================================

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import GatedChrome from '../components/GatedChrome'
import BackLink from '../components/ui/BackLink'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { ChipButton } from '../components/ui/Chip'
import { AMENITIES, DINING, getHikeById, getStopById } from '../content'
import { useAuth } from '../auth/useAuth'
import { BUILD_DATE } from '../lib/buildInfo'
import { correctionMailto, sendCorrection, type SendResult } from '../lib/corrections'
import { useDocumentTitle } from '../lib/documentTitle'

const KINDS = [
  { id: 'pin', label: 'Pin or turnout' },
  { id: 'hours', label: 'Hours or fee' },
  { id: 'closed', label: 'Closed or changed' },
  { id: 'trail', label: 'Trail or road' },
  { id: 'other', label: 'Something else' },
] as const

function subjectOf(type: string | null, id: string | null): { title: string; back: string } | null {
  if (!id) return null
  if (type === 'hike') {
    const h = getHikeById(id)
    return h ? { title: h.title, back: `/hike/${h.id}` } : null
  }
  if (type === 'dining') {
    const v = DINING.find((x) => x.id === id)
    return v ? { title: v.name, back: `/dining#${v.id}` } : null
  }
  if (type === 'place') {
    const a = AMENITIES.find((x) => x.id === id)
    return a ? { title: a.name, back: `/map?place=${a.id}` } : null
  }
  const s = getStopById(id)
  return s ? { title: s.title, back: `/stop/${s.id}` } : null
}

type Fix = { lat: number; lng: number; accuracyM: number }

export default function Report() {
  useDocumentTitle('Report a problem')
  const { session } = useAuth()
  const [params] = useSearchParams()
  const type = params.get('type')
  const id = params.get('id')
  const subject = subjectOf(type, id)
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>(params.get('kind') === 'pin' ? 'pin' : 'other')
  const [text, setText] = useState('')
  const [fix, setFix] = useState<Fix | null>(null)
  const [fixState, setFixState] = useState<'idle' | 'reading' | 'denied'>('idle')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const email = session?.username && session.username.includes('@') ? session.username : ''
  const about = subject ? `${subject.title} (${type ?? 'stop'} ${id})` : 'the app'
  const kindLabel = KINDS.find((k) => k.id === kind)?.label ?? kind
  const body = [
    `About: ${about}`,
    `Problem: ${kindLabel}`,
    '',
    text.trim(),
    '',
    fix ? `Position: ${fix.lat.toFixed(5)}, ${fix.lng.toFixed(5)} (±${Math.round(fix.accuracyM)} m)` : '',
    `Guide build: ${BUILD_DATE}`,
  ]
    .filter((l, i, all) => l !== '' || (i > 0 && all[i - 1] !== ''))
    .join('\n')

  function readPosition() {
    if (!('geolocation' in navigator)) {
      setFixState('denied')
      return
    }
    setFixState('reading')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setFix({ lat: p.coords.latitude, lng: p.coords.longitude, accuracyM: p.coords.accuracy })
        setFixState('idle')
      },
      () => setFixState('denied'),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 },
    )
  }

  async function send() {
    if (!email || text.trim().length === 0) return
    setBusy(true)
    setResult(await sendCorrection(email, body))
    setBusy(false)
  }

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Report a problem"
          title={subject ? subject.title : 'Something wrong in the guide?'}
          intro="Report something that has changed. We check it against park sources before updating the guide. Reports written offline send once you have signal."
        />

        {result === 'sent' || result === 'queued' ? (
          <div className="card">
            <p className="card__value">{result === 'sent' ? 'Sent. Thank you.' : 'Saved on this phone.'}</p>
            <p className="card__note">
              {result === 'sent'
                ? 'It goes to the editor, who checks it before anything in the guide changes.'
                : 'There is no connection right now. It sends the next time this phone has signal and the guide is open.'}
            </p>
            {subject && (
              <p>
                <Link to={subject.back}>Back to {subject.title} →</Link>
              </p>
            )}
          </div>
        ) : (
          <form
            className="report-form"
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
          >
            <fieldset className="report-form__kinds">
              <legend className="eyebrow">What is wrong</legend>
              <div className="theme-picker">
                {KINDS.map((k) => (
                  <ChipButton key={k.id} variant="filter" pressed={kind === k.id} onClick={() => setKind(k.id)}>
                    {k.label}
                  </ChipButton>
                ))}
              </div>
            </fieldset>

            <label className="field report-form__text">
              What you found
              <textarea
                className="field-control"
                rows={6}
                maxLength={4000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  kind === 'pin'
                    ? 'The turnout is about 200 yards further east, on the south side of the road.'
                    : 'The store closes at 6 now, per the sign on the door.'
                }
                required
              />
            </label>

            <div className="report-form__fix">
              {fix ? (
                <p className="card__note">
                  Position attached: {fix.lat.toFixed(5)}, {fix.lng.toFixed(5)}, to within about {Math.round(fix.accuracyM)} m.{' '}
                  <Button variant="quiet" size="sm" onClick={() => setFix(null)}>
                    Remove
                  </Button>
                </p>
              ) : (
                <Button variant="ghost" size="sm" onClick={readPosition} disabled={fixState === 'reading'}>
                  {fixState === 'reading' ? 'Reading your position…' : 'Include my position'}
                </Button>
              )}
              {fixState === 'denied' && (
                <p className="card__note">Location is off for this site, so no position is attached.</p>
              )}
            </div>

            {!email && (
              <p className="card__note">
                This session has no email address to reply to. Use the email link below instead.
              </p>
            )}
            {result === 'rejected' && (
              <p className="card__note" role="alert" style={{ color: 'var(--danger)' }}>
                The report did not go through (too many sent in the last hour, or a problem on our side). The email link below always works.
              </p>
            )}

            <div className="action-row">
              <Button type="submit" disabled={busy || !email || text.trim().length === 0}>
                {busy ? 'Sending…' : 'Send report'}
              </Button>
              <a className="more-link" href={correctionMailto(`Field Guide: ${about}`, body)}>
                Or send it as an email →
              </a>
            </div>
          </form>
        )}

        <BackLink to={subject?.back ?? '/'} label={subject ? `Back to ${subject.title}` : 'Back to the guide'} />
      </main>
    </GatedChrome>
  )
}
