// =============================================================================
// The install sheet: the closest thing to an "install this app?" dialog that
// exists on iOS. Safari has never fired beforeinstallprompt, so no code can
// make iOS show its own install dialog — Add to Home Screen is a manual path
// through the Share sheet, and the only honest thing an app can do is point at
// it clearly. This is that pointer, per browser, because the path differs:
// Safari hides it in Share, Chrome and Firefox behind their own menus, and an
// app's built-in browser (Gmail, Instagram) does not have it at all.
//
// Android/desktop Chrome gets the real thing instead — a native prompt via the
// captured beforeinstallprompt event — and only falls back to this sheet's
// menu instructions when the browser declined to offer one.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import Button from './ui/Button'
import { dismissInstall } from '../lib/install'
import { iosBrowser, isIOS } from '../utils/platform'

/** The iOS Share glyph, drawn rather than described, so the instruction and
 * the toolbar button are recognisably the same thing. */
function ShareGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg
      className="install-sheet__glyph"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.2v10.6" />
      <path d="M8.4 6.8 12 3.2l3.6 3.6" />
      <path d="M7.4 10.6H5.8A1.8 1.8 0 0 0 4 12.4v6.8A1.8 1.8 0 0 0 5.8 21h12.4a1.8 1.8 0 0 0 1.8-1.8v-6.8a1.8 1.8 0 0 0-1.8-1.8h-1.6" />
    </svg>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="install-sheet__steps">{children}</ol>
}

// ── Per-browser instructions ────────────────────────────────────────────────

function SafariSteps() {
  return (
    <>
      <Steps>
        <li>
          Tap <ShareGlyph /> <strong>Share</strong> in the toolbar. On an iPhone it is at
          the bottom of the screen, on an iPad the top right.
        </li>
        <li>
          Scroll down the list and tap <strong>Add to Home Screen</strong>.
        </li>
        <li>
          Tap <strong>Add</strong>. The guide gets its own icon and opens full screen.
        </li>
      </Steps>
      <p className="install-sheet__note">
        No <strong>Add to Home Screen</strong> in that list? You opened this from inside
        another app (Mail, Gmail, Messages), which uses a stripped-down browser. Tap{' '}
        <strong>Open in Safari</strong> in the same Share sheet first, then start again.
      </p>
    </>
  )
}

function ChromiumIOSSteps({ label }: { label: string }) {
  return (
    <>
      <Steps>
        <li>
          Tap <ShareGlyph /> <strong>Share</strong> in {label}'s address bar.
        </li>
        <li>
          Tap <strong>Add to Home Screen</strong>.
        </li>
      </Steps>
      <p className="install-sheet__note">
        Safari handles installed apps best on iPhone, including how much offline storage
        it will keep. If you have the choice, open this page in Safari and add it there.
      </p>
    </>
  )
}

function FirefoxIOSSteps() {
  return (
    <Steps>
      <li>
        Tap the <strong>☰</strong> menu, bottom right.
      </li>
      <li>
        Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
      </li>
    </Steps>
  )
}

function InAppSteps({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <>
      <p className="install-sheet__lede">
        You are in an app's built-in browser, not Safari. It cannot add anything to your
        home screen, so open this page in Safari first.
      </p>
      <Steps>
        <li>
          Look for <strong>Open in Safari</strong> or <strong>Open in browser</strong>,
          usually behind the <strong>•••</strong> or <ShareGlyph /> button in a corner.
        </li>
        <li>
          Or copy the link and paste it into Safari yourself.
        </li>
        <li>
          Once you are in Safari, tap <ShareGlyph /> <strong>Share</strong> →{' '}
          <strong>Add to Home Screen</strong>.
        </li>
      </Steps>
      <Button size="sm" variant="ghost" onClick={onCopy}>
        {copied ? 'Link copied' : 'Copy this page link'}
      </Button>
    </>
  )
}

function AndroidMenuSteps() {
  return (
    <Steps>
      <li>
        Open the browser menu: <strong>⋮</strong>, top right.
      </li>
      <li>
        Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
      </li>
    </Steps>
  )
}

// ── The sheet ───────────────────────────────────────────────────────────────

export default function InstallSheet({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const browser = isIOS() ? iosBrowser() : null

  useEffect(() => {
    // Focus the dialog itself rather than a control inside it: the shared
    // Button takes no ref, and moving focus to the heading is what a screen
    // reader wants anyway.
    dialogRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    // The sheet covers the page; letting the page scroll underneath it reads
    // as the sheet itself failing to scroll.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      // Clipboard is permission-gated and absent on old WebKit; the typed-out
      // URL below is the fallback, so say nothing and leave it visible.
    }
  }

  function stopAsking() {
    dismissInstall()
    onClose()
  }

  let steps: React.ReactNode
  if (browser === 'in-app') steps = <InAppSteps onCopy={copyLink} copied={copied} />
  else if (browser === 'chrome') steps = <ChromiumIOSSteps label="Chrome" />
  else if (browser === 'edge') steps = <ChromiumIOSSteps label="Edge" />
  else if (browser === 'firefox') steps = <FirefoxIOSSteps />
  else if (browser) steps = <SafariSteps />
  else steps = <AndroidMenuSteps />

  return (
    <div
      className="install-sheet__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="install-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-sheet-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <span className="eyebrow">Keep the guide on your phone</span>
        <h2 className="install-sheet__title" id="install-sheet-title">
          Add it to your home screen.
        </h2>
        <p className="install-sheet__lede">
          Most of Yosemite has no signal. Added to your home screen, the guide gets its
          own icon, opens full screen, and holds on to its offline downloads instead of
          letting the browser clear them.
        </p>

        {steps}

        {browser === 'in-app' && (
          <p className="install-sheet__url">{window.location.origin}</p>
        )}

        <div className="install-sheet__actions">
          <Button onClick={onClose}>Got it</Button>
          <Button variant="quiet" size="sm" onClick={stopAsking}>
            Don't ask again
          </Button>
        </div>
      </div>
    </div>
  )
}
