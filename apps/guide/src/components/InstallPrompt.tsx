import { useState } from 'react'
import Button from './ui/Button'
import { useIsOnboarded } from '../lib/onboarding'
import { useDeferredInstallPrompt } from '../pwa/installPrompt'
import { isIOS, isStandalonePWA } from '../utils/platform'

const DISMISS_KEY = 'tfg.install.dismissed'

// Shared dismiss state
function useDismissed() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return isStandalonePWA() || localStorage.getItem(DISMISS_KEY) === '1'
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
  // Module-level capture (pwa/installPrompt.ts): Chrome fires the event once,
  // often before this banner mounts; a component-scoped listener missed it.
  const { event, prompt } = useDeferredInstallPrompt()

  if (dismissed || !event) return null

  async function install() {
    await prompt()
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
  // The welcome page owns install messaging until onboarding is done or
  // skipped; a banner on top of it would be the same pitch twice.
  const onboarded = useIsOnboarded()
  if (!onboarded) return null
  if (isIOS()) return <IOSBanner />
  return <AndroidPrompt />
}
