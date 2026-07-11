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
const PACK_IDS = [...REGIONS.map((r) => `photos-${r.id}`), 'park-map']

function InstallStep() {
  const { event, prompt } = useDeferredInstallPrompt()

  if (isStandalonePWA()) {
    return <p>Already installed on this device. You're reading the home-screen copy now.</p>
  }
  if (isIOS()) {
    return (
      <p>
        Tap <span className="install-banner__key">&#x2B06;</span> Share in Safari, then{' '}
        <strong>Add to Home Screen</strong>. The guide gets its own icon and opens
        full-screen, and iOS gives installed apps more durable offline storage.
      </p>
    )
  }
  return (
    <>
      <p>
        Installing gives the guide its own icon and a full-screen window, and makes the
        offline storage more durable.
      </p>
      {event ? (
        <Button size="sm" onClick={() => void prompt()}>
          Install the app
        </Button>
      ) : (
        <p>
          If your browser offers <strong>Install app</strong> in its menu, use that. You can
          also do this later; nothing below depends on it.
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
          title="Two minutes now saves you in the canyon."
          intro="Most of Yosemite has no cell signal. The guide is built for that, but only after this page's downloads are on your phone."
        />

        <section className="page-section">
          <span className="eyebrow">1 · It works offline</span>
          <p>
            Every stop write-up, checklist, and GPS coordinate is part of the app itself.
            Once you finish this page, airplane mode changes nothing: the regions, the
            Secret Guide, search, and your trip plan all keep working. Only the live
            layers (program listings, weather) need a connection to refresh, and both
            fall back to the last copy they synced.
          </p>
        </section>

        <section className="page-section">
          <span className="eyebrow">2 · Put it on your home screen</span>
          <InstallStep />
        </section>

        <section className="page-section">
          <span className="eyebrow">3 · Download the offline packs</span>
          <p>
            The photos and the park map are the only parts that need a real download. Do
            this on wifi, the night before you drive in.
          </p>
          <DownloadManager />
        </section>

        <div className="page-section">
          <Button onClick={finish}>Done, into the guide →</Button>
        </div>

        <p className="page-footnote">
          <Button variant="quiet" size="sm" onClick={finish}>
            Skip for now
          </Button>
          {' '}· Everything here is repeatable later from Account → Offline.
        </p>
      </main>
    </div>
  )
}
