import { useEffect, useState } from 'react'

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
  const [dismissed, setDismissed] = useState(
    () => isStandalone() || localStorage.getItem(DISMISS_KEY) === '1',
  )
  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
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
      <div style={{ flex: 1, fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.4 }}>
        Add to home screen for offline access.
      </div>
      <button type="button" className="btn btn--ghost" onClick={dismiss} style={{ padding: '6px 10px', fontSize: 13, minHeight: 44 }}>
        Not now
      </button>
      <button type="button" className="btn" onClick={install} style={{ padding: '6px 14px', fontSize: 13, minHeight: 44 }}>
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
    <InstallBanner>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.4, marginBottom: 4 }}>
          Save for offline access:
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Tap{' '}
          <span style={{ display: 'inline-block', verticalAlign: 'middle', padding: '0 3px', border: '1px solid var(--rule-soft)', borderRadius: 3, fontSize: 13 }}>
            &#x2B06;
          </span>
          {' '}Share, then <strong>Add to Home Screen</strong>.
        </div>
      </div>
      <button type="button" className="btn btn--ghost" onClick={dismiss} style={{ padding: '6px 10px', fontSize: 13, minHeight: 44, flexShrink: 0 }}>
        Got it
      </button>
    </InstallBanner>
  )
}

// ── Shared banner shell ───────────────────────────────────────────────────────

function InstallBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="dialog"
      aria-label="Install The Field Guide"
      style={{
        position: 'fixed',
        bottom: 'calc(56px + env(safe-area-inset-bottom) + 8px)',
        left: 16,
        right: 16,
        maxWidth: 480,
        margin: '0 auto',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        borderRadius: 8,
        padding: '12px 14px',
        boxShadow: '0 8px 24px rgba(20, 17, 12, 0.12)',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        zIndex: 200,
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
