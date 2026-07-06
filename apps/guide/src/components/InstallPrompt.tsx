import { useEffect, useState } from 'react'
import Button from './ui/Button'

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
    <InstallBanner>
      <div className="install-banner__body">Add to home screen for offline access.</div>
      <Button variant="ghost" size="sm" onClick={dismiss}>
        Not now
      </Button>
      <Button size="sm" onClick={install}>
        Install
      </Button>
    </InstallBanner>
  )
}

// ── iOS Safari: no beforeinstallprompt; show manual "Add to Home Screen" tip ──

function IOSBanner() {
  const { dismissed, dismiss } = useDismissed()

  if (dismissed) return null

  return (
    <InstallBanner>
      <div className="install-banner__body">
        Save for offline access:
        <div className="install-banner__hint">
          Tap <span className="install-banner__key">&#x2B06;</span> Share, then{' '}
          <strong>Add to Home Screen</strong>.
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={dismiss}>
        Got it
      </Button>
    </InstallBanner>
  )
}

// ── Shared banner shell ───────────────────────────────────────────────────────

function InstallBanner({ children }: { children: React.ReactNode }) {
  return (
    <div role="dialog" aria-label="Install The Field Guide" className="install-banner">
      {children}
    </div>
  )
}

// ── Router — pick the right prompt based on platform ────────────────────────

export default function InstallPrompt() {
  if (isIOS) return <IOSBanner />
  return <AndroidPrompt />
}
