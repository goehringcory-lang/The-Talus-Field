// =============================================================================
// Reading one paragraph aloud with the Web Speech API, and the reader's
// toggle for it. No recorded audio: the voice is the device's own, which is
// also why this needs no download and works with no signal.
//
// Three rules. (1) Speech is opt-in and the choice persists (tfg.near.speech,
// the theme.ts storage idiom: a denied store reads as "off"). (2) Exactly one
// utterance is ever in flight: speak() cancels whatever is playing first, so
// arriving at a new entry mid-sentence starts the new paragraph rather than
// queueing it behind the old one. (3) Where speechSynthesis is absent (some
// webviews, Firefox on Android without a voice installed) every call is a
// silent no-op and speechAvailable() lets the screen hide the control rather
// than offer a button that does nothing.
//
// Chrome refuses speak() until the page has had a user activation. The toggle
// is a tap, so a session with speech on has always had one; the screen still
// never speaks on its own first render (see routes/Near.tsx).
// =============================================================================

const KEY = 'tfg.near.speech'

// A little slower than the default: place names and the guide's clauses land
// better at 0.95, and the passenger is not in a hurry.
const RATE = 0.95

export function speechAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

export function readSpeechPref(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    // Storage denied: off is the honest default for something that makes noise.
    return false
  }
}

export function writeSpeechPref(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    /* non-fatal: the choice just won't survive this session */
  }
}

let current: SpeechSynthesisUtterance | null = null

/**
 * Speak `text`, cancelling anything already playing. Returns whether the
 * utterance was handed to the synthesiser; `onEnd` fires when it finishes or
 * is cut off, so the caller can drop its "speaking" state either way.
 */
export function speak(text: string, onEnd?: () => void): boolean {
  if (!speechAvailable() || !text.trim()) return false
  const synth = window.speechSynthesis
  stopSpeaking()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = RATE
  // Idempotent: cancel() settles the caller by hand below and some engines
  // then fire the end event anyway.
  let settled = false
  const done = () => {
    if (settled) return
    settled = true
    if (current === u) current = null
    onEnd?.()
  }
  u.onend = done
  u.onerror = done
  current = u
  try {
    synth.speak(u)
  } catch {
    current = null
    return false
  }
  return true
}

/** Cut the current paragraph off. Safe to call with nothing playing. */
export function stopSpeaking(): void {
  if (!speechAvailable()) return
  const u = current
  current = null
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* nothing to stop */
  }
  // Some engines skip the end event on cancel; settle the caller's state.
  u?.onend?.(new Event('end') as SpeechSynthesisEvent)
}
