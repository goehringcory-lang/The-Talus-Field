// =============================================================================
// The Field Guide survey sheet. Four questions (how useful, worth the price,
// rank the missing features, anything else), sent to the owner's inbox through
// POST /api/feedback. Opened unprompted once by Home (lib/survey.ts decides
// when) and on demand from the Account page. Same dialog mechanics as
// InstallSheet: focus moves in, Tab is trapped, Escape and the backdrop close,
// and focus returns to the opener.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import { ApiError } from '../lib/api'
import { ChipButton } from './ui/Chip'
import {
  SURVEY_FEATURES,
  SURVEY_RANK_COUNT,
  endSurvey,
  sendSurvey,
  snoozeSurvey,
  type SurveyAnswers,
  type SurveyFeatureId,
} from '../lib/survey'

const RATINGS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

// Only a request that never got an answer is a connection problem. Every
// status the Worker sends has its own line, so a server-side failure no longer
// tells a reader on good Wi-Fi to check their connection.
function failureMessage(err: unknown): string {
  if (!(err instanceof ApiError)) {
    return 'That did not send. Check your connection and try again.'
  }
  if (err.status === 401) {
    return 'Your sign-in has lapsed on this device. Sign out and back in from Account, then send again.'
  }
  if (err.status === 429) {
    return 'That is more sends than an hour allows. Try again in an hour.'
  }
  if (err.status === 400) {
    return `The server did not accept these answers (error ${err.status}). Try again after the app updates.`
  }
  return `The server could not send it (error ${err.status}). Your answers are still here; try again in a few minutes.`
}

const WORTH: { id: SurveyAnswers['worth']; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'somewhat', label: 'Somewhat' },
  { id: 'no', label: 'No' },
]

export default function FeedbackSurvey({
  onClose,
  unprompted = false,
}: {
  onClose: () => void
  /** Opened by the app rather than a tap: offers "Not now" and "Don't ask again". */
  unprompted?: boolean
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [worth, setWorth] = useState<SurveyAnswers['worth'] | null>(null)
  const [ranking, setRanking] = useState<SurveyFeatureId[]>([])
  const [missing, setMissing] = useState('')
  const [comment, setComment] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [error, setError] = useState('')

  // A dismissal by Escape or the backdrop counts as "Not now" when the app
  // opened the sheet, so it does not come back on the next visit to Home.
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = () => {
      if (unprompted && state !== 'sent') snoozeSurvey()
      onClose()
    }
  }, [onClose, unprompted, state])

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [])

  function toggleRank(id: SurveyFeatureId) {
    setRanking((r) =>
      r.includes(id) ? r.filter((x) => x !== id) : r.length < SURVEY_RANK_COUNT ? [...r, id] : r,
    )
  }

  const ready = rating !== null && worth !== null && ranking.length > 0

  async function submit() {
    if (rating === null || worth === null || ranking.length === 0 || state === 'sending') return
    setState('sending')
    try {
      await sendSurvey({
        rating,
        worth,
        ranking,
        missing: missing.trim() || undefined,
        comment: comment.trim() || undefined,
      })
      setState('sent')
    } catch (err) {
      setError(failureMessage(err))
      setState('failed')
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop tap duplicates Escape and the close button
    <div
      className="survey-sheet__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current()
      }}
    >
      <div
        className="survey-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <span className="eyebrow">Four questions</span>
        <h2 className="survey-sheet__title" id="survey-title">
          {state === 'sent' ? 'Thank you.' : 'How is the guide working for you?'}
        </h2>

        {state === 'sent' ? (
          <>
            <p className="survey-sheet__lede">
              Your answers went straight to the editor, who reads every one. They decide what
              the guide builds next.
            </p>
            <div className="survey-sheet__actions">
              <Button onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <form
            className="survey-form"
            onSubmit={(e) => {
              e.preventDefault()
              void submit()
            }}
          >
            <p className="survey-sheet__lede">
              It takes about a minute, and the answers go to the editor, not a marketing list.
            </p>

            <fieldset className="survey-form__q">
              <legend>1. How useful has the guide been?</legend>
              <div className="theme-picker">
                {RATINGS.map((r) => (
                  <ChipButton
                    key={r.value}
                    variant="filter"
                    pressed={rating === r.value}
                    onClick={() => setRating(r.value)}
                    aria-label={`${r.value} of 5`}
                  >
                    {r.label}
                  </ChipButton>
                ))}
              </div>
              <p className="survey-form__scale" aria-hidden="true">
                <span>Not useful</span>
                <span>Essential</span>
              </p>
            </fieldset>

            <fieldset className="survey-form__q">
              <legend>2. Was it worth the price?</legend>
              <div className="theme-picker">
                {WORTH.map((w) => (
                  <ChipButton
                    key={w.id}
                    variant="filter"
                    pressed={worth === w.id}
                    onClick={() => setWorth(w.id)}
                  >
                    {w.label}
                  </ChipButton>
                ))}
              </div>
            </fieldset>

            <fieldset className="survey-form__q">
              <legend>
                3. Rank what the guide should add next. Tap up to {SURVEY_RANK_COUNT}, most
                wanted first.
              </legend>
              <ul className="survey-rank">
                {SURVEY_FEATURES.map((f) => {
                  const pos = ranking.indexOf(f.id)
                  const full = pos < 0 && ranking.length >= SURVEY_RANK_COUNT
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        className="survey-rank__item"
                        aria-pressed={pos >= 0}
                        aria-disabled={full || undefined}
                        aria-label={pos >= 0 ? `${f.label}, ranked ${pos + 1}` : f.label}
                        onClick={() => toggleRank(f.id)}
                      >
                        <span className="survey-rank__pos" aria-hidden="true">
                          {pos >= 0 ? pos + 1 : ''}
                        </span>
                        {f.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {ranking.length > 0 && (
                <Button variant="quiet" size="sm" onClick={() => setRanking([])}>
                  Clear ranking
                </Button>
              )}
              <label className="field survey-form__text">
                Not on the list? Name it (optional)
                <input
                  className="field-control"
                  type="text"
                  maxLength={300}
                  value={missing}
                  onChange={(e) => setMissing(e.target.value)}
                />
              </label>
            </fieldset>

            <label className="field survey-form__text">
              4. Anything else the editor should know? (optional)
              <textarea
                className="field-control"
                rows={4}
                maxLength={2000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>

            {state === 'failed' && (
              <p className="survey-form__error" role="alert">
                {error}
              </p>
            )}

            <div className="survey-sheet__actions">
              <Button type="submit" disabled={!ready || state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send answers'}
              </Button>
              {unprompted ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      snoozeSurvey()
                      onClose()
                    }}
                  >
                    Not now
                  </Button>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => {
                      endSurvey()
                      onClose()
                    }}
                  >
                    Don't ask again
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
