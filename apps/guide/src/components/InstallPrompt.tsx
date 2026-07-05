import { useEffect, useState } from 'react'
import '../styles/app.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'tfg.install.dismissed'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

const isIOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1))

// Shared dismiss state
function useDismissed() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return isStandalone() || localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* non-fatal: banner may reappear next launch */
    }
    setDismissed(true)
  }
  return { dismissed, dismiss }
}

// ── Android / desktop Chrome: uses the native beforeinstallprompt event ──────

function AndroidPrompt() {
  const { dismissed, dismiss } = useDismissed()
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (dismissed) return
    function handler(e: Event) {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [dismissed])

  if (dismissed || !promptEvent) return null

  async function install() {
    if (!promptEvent) return
    await promptEvent.prompt()
    setPromptEvent(null)
  }

  return (
    <InstallBanner onDismiss={dismiss}>
      <div className="notice-banner__body">
        Add to home screen for offline access.
      </div>
      <button type="button" className="btn btn--ghost btn--compact" onClick={dismiss}>
        Not now
      </button>
      <button type="button" className="btn btn--compact" onClick={install}>
        Install
      </button>
    </InstallBanner>
  )
}

// ── iOS Safari: no beforeinstallprompt; show manual "Add to Home Screen" tip ──

function IOSBanner() {
  const { dismissed, dismiss } = useDismissed()

  if (dismissed) return null

  return (
    <InstallBanner onDismiss={dismiss}>
      <div className="notice-banner__body">
        <div className="notice-banner__lead">
          Save for offline access:
        </div>
        <div className="notice-banner__hint">
          Tap <span className="key-glyph">&#x2B06;</span> Share, then{' '}
          <strong>Add to Home Screen</strong>.
        </div>
      </div>
      <button type="button" className="btn btn--ghost btn--compact" onClick={dismiss}>
        Got it
      </button>
    </InstallBanner>
  )
}

// ── Shared banner shell ───────────────────────────────────────────────────────

function InstallBanner({
  children,
  onDismiss,
}: {
  children: React.ReactNode
  onDismiss: () => void
}) {
  return (
    <div
      role="region"
      aria-label="Install The Field Guide"
      className="notice-banner notice-banner--fixed"
      onKeyDown={(e) => {
        // Escape dismisses when focus is inside the banner. Non-modal, so no
        // focus trap; keyboard users just get the same out as the button.
        if (e.key === 'Escape') onDismiss()
      }}
    >
      {children}
    </div>
  )
}

// ── Router — pick the right prompt based on platform ────────────────────────

export default function InstallPrompt() {
  if (isIOS) return <IOSBanner />
  return <AndroidPrompt />
}
