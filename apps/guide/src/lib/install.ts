// =============================================================================
// Install-prompt state. Two flags, both localStorage, subscribable so the
// banner, the welcome page, and the account card agree without a remount
// (same pattern as lib/onboarding.ts).
//
//   tfg.install.dismissed — the buyer said "not now" or "already added it".
//   tfg.install.shown     — the sheet has been auto-opened once on this device.
//
// The second flag is what makes this an ask rather than a hint. iOS has no
// beforeinstallprompt: Safari will never pop an OS install dialog, so the only
// prompt that can exist is one the app opens itself. It opens exactly once,
// unprompted, and after that it is banner-and-tap like every other platform.
//
// Both reads fail CLOSED (an unreadable store counts as not-yet-shown and
// not-dismissed) — the opposite of onboarding.ts, and deliberately: the worst
// case here is one dismissible sheet in a storage-denied browser, whereas the
// worst case there was being trapped on /welcome forever.
// =============================================================================

import { useEffect, useState } from 'react'
import { isStandalonePWA } from '../utils/platform'

const DISMISS_KEY = 'tfg.install.dismissed'
const SHOWN_KEY = 'tfg.install.shown'

const subscribers = new Set<() => void>()

function notify(): void {
  for (const fn of subscribers) fn()
}

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function write(key: string): void {
  try {
    window.localStorage.setItem(key, '1')
  } catch {
    /* non-fatal: the prompt may reappear next launch */
  }
}

/** Already installed, or told to stop asking. */
export function isInstallDismissed(): boolean {
  return isStandalonePWA() || read(DISMISS_KEY)
}

export function dismissInstall(): void {
  write(DISMISS_KEY)
  notify()
}

/** Undo a dismissal — the Account page's "show me how" entry point. */
export function resetInstallDismissal(): void {
  try {
    window.localStorage.removeItem(DISMISS_KEY)
  } catch {
    /* non-fatal */
  }
  notify()
}

/** True the first time only; records the auto-open so it never repeats. */
export function claimFirstAutoPrompt(): boolean {
  if (read(SHOWN_KEY)) return false
  write(SHOWN_KEY)
  return true
}

let autoDecision: boolean | null = null

/**
 * Whether this page load should open the sheet unprompted. Memoized in module
 * state because claiming is a write: StrictMode double-invokes a useState
 * initializer and the banner remounts on every route change, and either would
 * otherwise burn the one-time claim (or, worse, re-open the sheet on a later
 * mount because the first mount's claim came back false).
 */
export function shouldAutoPrompt(): boolean {
  if (autoDecision === null) autoDecision = !isInstallDismissed() && claimFirstAutoPrompt()
  return autoDecision
}

export function useInstallDismissed(): boolean {
  const [dismissed, setDismissed] = useState(() => isInstallDismissed())
  useEffect(() => {
    const update = () => setDismissed(isInstallDismissed())
    subscribers.add(update)
    update()
    return () => {
      subscribers.delete(update)
    }
  }, [])
  return dismissed
}
