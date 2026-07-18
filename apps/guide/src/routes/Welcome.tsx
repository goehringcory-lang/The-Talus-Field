// =============================================================================
// /welcome — one-time orientation after the first sign-in. A single scrolling
// page (house style: declarative, low chrome), three numbered sections:
// works-offline, install to home screen, download the offline packs. Renders
// without GatedChrome, like /open, so it reads as setup rather than the app.
// Skippable at any point; both exits mark onboarding done.
// =============================================================================

import { useNavigate } from 'react-router-dom'
import DownloadManager from '../components/DownloadManager'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { REGIONS } from '../content'
import { markOnboarded } from '../lib/onboarding'
import { isPackCompleted } from '../offline/useDownloads'
import { useDeferredInstallPrompt } from '../pwa/installPrompt'
import { isIOS, isStandalonePWA } from '../utils/platform'

// Pack ids mirrored from offline/manifest.ts, same derivation as Home.
const PACK_IDS = [...REGIONS.map((r) => `photos-${r.id}`), 'photos-secret-guide', 'park-map']

function InstallStep() {
  const { event, prompt } = useDeferredInstallPrompt()

  if (isStandalonePWA()) {
    return <p>Already installed on this device. You're reading the home-screen copy now.</p>
  }
  if (isIOS()) {
    return (
      <p>
        Tap <span className="install-banner__key">&#x2B06;</span> Share in Safari, then{' '}
        <strong>Add to Home Screen</strong>. The guide gets its own icon, opens like an
        app, and keeps its downloads safe.
      </p>
    )
  }
  return (
    <>
      <p>
        Installing gives the guide its own icon and keeps its downloads safe.
      </p>
      {event ? (
        <Button size="sm" onClick={() => void prompt()}>
          Install the app
        </Button>
      ) : (
        <p>
          If your browser has <strong>Install app</strong> in its menu, use that. You can
          also skip this; nothing below needs it.
        </p>
      )}
    </>
  )
}

export default function Welcome() {
  const navigate = useNavigate()

  function finish() {
    markOnboarded()
    // If they just downloaded everything, the Home nudge pitching those same
    // downloads is noise; if they skipped, it stays as the correct reminder.
    if (PACK_IDS.every((id) => isPackCompleted(id))) {
      try {
        localStorage.setItem('tfg.beforeYouGo.dismissed', '1')
      } catch {
        /* non-fatal */
      }
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="app-shell">
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="The Field Guide · Setup"
          title="Three steps before you go."
          intro="Most of Yosemite has no cell signal. Do these steps while you have wifi, and the whole guide will work anywhere in the park."
        />

        <section className="page-section">
          <span className="eyebrow">1 · It works offline</span>
          <p>
            The whole guide is stored on your phone: every stop, checklist, and GPS point.
            Airplane mode changes nothing. Only the weather and the program listings need
            signal to update, and even those keep showing their last saved copy.
          </p>
        </section>

        <section className="page-section">
          <span className="eyebrow">2 · Put it on your home screen</span>
          <InstallStep />
        </section>

        <section className="page-section">
          <span className="eyebrow">3 · Download the offline packs</span>
          <p>
            The photos and the park map are big files. Download them on wifi, the night
            before you drive in.
          </p>
          <DownloadManager />
        </section>

        <div className="page-section">
          <Button onClick={finish}>Done. Open the guide →</Button>
        </div>

        <p className="page-footnote">
          <Button variant="quiet" size="sm" onClick={finish}>
            Skip for now
          </Button>
          {' '}· You can come back to all of this later on the Account page.
        </p>
      </main>
    </div>
  )
}
