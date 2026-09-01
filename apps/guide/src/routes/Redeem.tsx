import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { PHOTO_CREDITS, formatCredit } from '../content/photoCredits'
import Plate from '../components/Plate'
import ResponsivePhoto from '../components/ResponsivePhoto'
import Button from '../components/ui/Button'
import { GUIDE_BUY_URL, useGuidePrice } from '../lib/storefront'

// Public redemption page for the shared newsletter codes (POST /api/redeem).
// The newsletter links here with the code in the URL, e.g. /redeem?code=TALUS30,
// so a subscriber only types their email. Access always arrives BY EMAIL (the
// magic link + 6-digit code, exactly like a purchase): the endpoint never
// signs the caller in directly, because owning the inbox is the only proof
// the address is theirs. This page therefore ends at "check your email".
export default function Redeem() {
  const [params] = useSearchParams()
  const price = useGuidePrice()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(() => params.get('code') ?? '')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Uncontrolled on purpose: a bot filling the DOM field must reach the POST,
  // and a controlled input would only carry what React state was told about.
  const honeypotRef = useRef<HTMLInputElement>(null)

  async function submit() {
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/redeem', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          website: honeypotRef.current?.value ?? '',
        }),
      })
      setDone(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('That code is not recognized. Check it against the newsletter.')
      } else if (err instanceof ApiError && err.status === 409) {
        setError(
          `That code has already been used with this email. If your access has since ended, the full guide is ${price} for 18 months.`,
        )
      } else if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Wait an hour and try again.')
      } else if (err instanceof ApiError && err.status === 502) {
        setError('The access email could not be sent. Try again in a minute.')
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await submit()
  }

  return (
    <div className="app-shell">
      <main className="wrap login-wrap">
        <header className="brand-lockup">
          <img
            className="brand-lockup__mark"
            src="/brand/mark-96.png"
            srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
            alt=""
            width="61"
            height="48"
          />
          <div>
            <div className="brand-lockup__title">The Talus Field</div>
            <div className="brand-lockup__sub">A field journal of Yosemite</div>
          </div>
        </header>

        <Plate
          tag="Plate · Tunnel View"
          credit={
            PHOTO_CREDITS['/photos/tunnel-view-panorama.jpg']
              ? formatCredit(PHOTO_CREDITS['/photos/tunnel-view-panorama.jpg'])
              : undefined
          }
        >
          <ResponsivePhoto
            src="/photos/tunnel-view-panorama.jpg"
            alt="Tunnel View: El Capitan, Bridalveil Fall, and Half Dome"
            loading="eager"
            width={1200}
            height={900}
            sizes="(max-width: 720px) 100vw, 560px"
            style={{ aspectRatio: '2 / 1', objectFit: 'cover' }}
          />
        </Plate>

        <div className="login-head">
          <span className="eyebrow eyebrow--moss">The Field Guide · 2026 Edition</span>
          <h1 className="login-title">Redeem a code</h1>
          <p className="login-intro">
            Enter the code from the newsletter and your email. The access link, your
            sign-in code, and the end date all arrive by email.
          </p>
        </div>

        {done ? (
          <div className="card">
            <p className="card__note" style={{ margin: 0 }}>
              Check your email. The access link and a 6-digit sign-in code are on their
              way to <strong>{email.trim()}</strong>. Check spam too. Nothing after a few
              minutes?{' '}
              <Button variant="quiet" onClick={() => void submit()} disabled={busy}>
                {busy ? 'Sending…' : 'Send it again'}
              </Button>
              , or write to{' '}
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="form-stack">
            <label className="field">
              Email
              <input
                className="input"
                type="text"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                enterKeyHint="next"
                aria-describedby={error ? 'redeem-error' : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              Newsletter code
              <input
                className="input"
                type="text"
                required
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                aria-describedby={error ? 'redeem-error' : undefined}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>

            {/* Honeypot mirror of the editorial trip-email box: off-screen,
                untabbable, and blank in any real browser. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label>
                Website
                <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Checking…
                </>
              ) : (
                'Send my access email →'
              )}
            </Button>
          </form>
        )}

        {/* Outside both branches: a failed "Send it again" from the done card
            has to show up too, not only a failed first submit. role="alert":
            the failure appears below the fold of a phone keyboard, so a
            silent render reads as the button doing nothing. */}
        {error && (
          <div className="form-error" id="redeem-error" role="alert">
            {error}
          </div>
        )}

        <p className="login-aside">
          Bought the guide? Your purchase email already has your sign-in code.{' '}
          <Button variant="quiet" to="/login">
            Sign in
          </Button>
          .
        </p>

        <section className="login-storefront" aria-label="About the Field Guide">
          <span className="eyebrow">No code</span>
          <p className="login-intro" style={{ marginTop: 8 }}>
            The Field Guide is {price}, one payment: four regional guides, the Secret
            Guide, and an offline topo map of the park, on every device you own for 18
            months.
          </p>
          <div className="action-row" style={{ marginTop: 16 }}>
            <Button variant="ghost" to="/preview">
              Read the free sample →
            </Button>
            <Button variant="quiet" href={GUIDE_BUY_URL} external>
              Get the guide
            </Button>
          </div>
        </section>

        <p className="page-footnote">
          Works offline once installed. The access email signs you in on every device
          you own.
        </p>
      </main>
    </div>
  )
}
