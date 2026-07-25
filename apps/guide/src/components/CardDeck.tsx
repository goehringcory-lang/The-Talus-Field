// =============================================================================
// CardDeck — one entry per screen, swipe up for the next one.
//
// The gesture is native scroll-snap, not a hand-rolled pointer drag: the
// browser already owns the fling physics, the rubber-band at the ends, and the
// interruption semantics, and a snap container never has its gesture stolen
// mid-drag the way a `touch-action: none` surface does. Panels are exactly the
// height of the viewport, so the current index is scrollTop / clientHeight —
// no observer needed, and it stays correct while a fling is still settling.
//
// Everything else here is the affordance layer: a counter, a progress rail, a
// first-run hint, keyboard paging, and prev/next buttons for pointer devices,
// which have no swipe.
// =============================================================================

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './CardDeck.css'

export type DeckPanel = {
  key: string
  // Announced to screen readers as the panel's name ("Tunnel View, 3 of 12").
  label: string
  node: ReactNode
}

type Props = {
  panels: DeckPanel[]
  // Names the deck itself, e.g. "Yosemite Valley stops".
  ariaLabel: string
  // Deep link: the panel to open on. Applied once per key change, without
  // animation, so /secret-guide#glacier-point-road lands where it used to.
  startKey?: string | null
  // Wording of the first-run hint; the noun changes per surface.
  hint?: string
}

const HINT_KEY = 'tfg.deck.hint'

function hintSeen(): boolean {
  try {
    return window.localStorage.getItem(HINT_KEY) === '1'
  } catch {
    // Storage-denied browsers see the hint every visit. Harmless, and better
    // than hiding the only instruction for the gesture.
    return false
  }
}

function markHintSeen() {
  try {
    window.localStorage.setItem(HINT_KEY, '1')
  } catch {
    /* non-fatal */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export default function CardDeck({ panels, ariaLabel, startKey, hint }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [showHint, setShowHint] = useState(() => !hintSeen())
  // Guards the one-time storage write; the scroll handler runs every frame.
  const hintDoneRef = useRef(false)
  const count = panels.length

  // Jump to the deep-linked panel before paint. Instant, not smooth: an
  // animated scroll from a fresh mount reads as the page drifting.
  useLayoutEffect(() => {
    if (!startKey) return
    const i = panels.findIndex((p) => p.key === startKey)
    const el = scrollerRef.current
    if (i <= 0 || !el) return
    el.scrollTop = i * el.clientHeight
    setIndex(i)
    // Panels are stable per surface; re-running on every render would fight
    // the user's own scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey])

  // Index from scroll position, sampled on a frame. Panels are viewport-height
  // by construction, so rounding the ratio is exact once a snap settles and
  // close enough while one is in flight.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const h = el.clientHeight
        if (h === 0) return
        const next = Math.max(0, Math.min(count - 1, Math.round(el.scrollTop / h)))
        setIndex((prev) => (prev === next ? prev : next))
        // The hint has done its job the moment the reader leaves the first
        // panel — by swipe, key, or button, all of which scroll.
        if (next > 0 && !hintDoneRef.current) {
          hintDoneRef.current = true
          markHintSeen()
          setShowHint(false)
        }
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  const goTo = useCallback(
    (target: number) => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(count - 1, target))
      el.scrollTo({
        top: clamped * el.clientHeight,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },
    [count],
  )

  // Arrow keys inside a mandatory-snap container scroll by a line and then get
  // yanked back to the nearest panel, so the deck pages them itself. Typing in
  // a field inside a card is left alone.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target.closest('input, textarea, select')) return
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault()
        goTo(index + 1)
        break
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault()
        goTo(index - 1)
        break
      case 'Home':
        e.preventDefault()
        goTo(0)
        break
      case 'End':
        e.preventDefault()
        goTo(count - 1)
        break
      default:
        break
    }
  }

  const current = panels[index]

  return (
    <div className="deck-viewport">
      <div
        className="deck"
        ref={scrollerRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {panels.map((panel, i) => (
          <section
            key={panel.key}
            id={panel.key}
            className="deck__panel"
            role="group"
            aria-roledescription="slide"
            aria-label={`${panel.label}, ${i + 1} of ${count}`}
          >
            {panel.node}
          </section>
        ))}
      </div>

      {/* Position, twice: a live region for screen readers, a rail for eyes.
          The rail is decorative and capped, so a 20-entry category doesn't
          render 20 unreadable ticks. */}
      <p className="sr-only" aria-live="polite">
        {current ? `${current.label}, ${index + 1} of ${count}` : ''}
      </p>
      {count > 1 && count <= 12 && (
        <div className="deck__rail" aria-hidden="true">
          {panels.map((panel, i) => (
            <span
              key={panel.key}
              className={`deck__tick${i === index ? ' deck__tick--on' : ''}`}
            />
          ))}
        </div>
      )}

      <div className="deck__nav" aria-hidden="true">
        <button
          type="button"
          className="deck__navbtn"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          tabIndex={-1}
          title="Previous"
        >
          ↑
        </button>
        <button
          type="button"
          className="deck__navbtn"
          onClick={() => goTo(index + 1)}
          disabled={index >= count - 1}
          tabIndex={-1}
          title="Next"
        >
          ↓
        </button>
      </div>

      {showHint && count > 1 && (
        <p className="deck__hint" aria-hidden="true">
          {hint ?? 'Swipe up for the next card'}
        </p>
      )}
    </div>
  )
}
