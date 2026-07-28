// =============================================================================
// The global install nudge. Three platforms, three different truths:
//
//   Android / desktop Chrome — a real OS install dialog exists. Show the
//     banner only when the browser has actually offered one (the captured
//     beforeinstallprompt event) and hand it straight over on tap.
//   iOS — no such event has ever existed in Safari, so nothing can pop an OS
//     dialog. The ask has to be the app's own: InstallSheet, opened once
//     unprompted on the first visit and reachable by tap from the banner after
//     that.
//   An app's built-in browser on iOS (Gmail, Instagram) — installing is not
//     possible at all from there. The banner says so and the sheet explains
//     how to get to Safari, because the alternative is a buyer following
//     Share-sheet instructions for a menu item that is not in their Share
//     sheet.
// =============================================================================

import { useState } from 'react'
import InstallSheet from './InstallSheet'
import Button from './ui/Button'
import { dismissInstall, shouldAutoPrompt, useInstallDismissed } from '../lib/install'
import { useIsOnboarded } from '../lib/onboarding'
import { useDeferredInstallPrompt } from '../pwa/installPrompt'
import { iosBrowser, isIOS } from '../utils/platform'

// ── Android / desktop Chrome: uses the native beforeinstallprompt event ──────

function AndroidPrompt() {
  const dismissed = useInstallDismissed()
  // Module-level capture (pwa/installPrompt.ts): Chrome fires the event once,
  // often before this banner mounts; a component-scoped listener missed it.
  const { event, prompt } = useDeferredInstallPrompt()

  if (dismissed || !event) return null

  return (
    <InstallBanner>
      <div className="install-banner__body">Add to home screen for offline access.</div>
      <Button variant="ghost" size="sm" onClick={dismissInstall}>
        Not now
      </Button>
      <Button size="sm" onClick={() => void prompt()}>
        Install
      </Button>
    </InstallBanner>
  )
}

// ── iOS: no native prompt exists; the app asks, then shows the manual path ───

function IOSPrompt() {
  const dismissed = useInstallDismissed()
  // The one unprompted ask, on the first visit that gets this far. The claim
  // behind shouldAutoPrompt() is memoized in module state, so this initializer
  // is safe to run on every mount and under StrictMode.
  const [open, setOpen] = useState(() => shouldAutoPrompt())

  if (dismissed) return null

  const inApp = iosBrowser() === 'in-app'

  return (
    <>
      {open && <InstallSheet onClose={() => setOpen(false)} />}
      <InstallBanner>
        <div className="install-banner__body">
          {inApp ? 'Open in Safari to keep this on your phone.' : 'Keep the guide on your home screen.'}
          <div className="install-banner__hint">Works offline once it is installed.</div>
        </div>
        <Button variant="ghost" size="sm" onClick={dismissInstall}>
          Not now
        </Button>
        <Button size="sm" onClick={() => setOpen(true)}>
          Show me
        </Button>
      </InstallBanner>
    </>
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
  if (isIOS()) return <IOSPrompt />
  return <AndroidPrompt />
}
