// =============================================================================
// /welcome — one-time orientation after the first sign-in. A single scrolling
// page (house style: declarative, low chrome), three numbered sections:
// works-offline, install to home screen, download the offline packs. Renders
// without GatedChrome, like /open, so it reads as setup rather than the app.
// Skippable at any point; both exits mark onboarding done.
// =============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DownloadManager from '../components/DownloadManager'
import InstallSheet from '../components/InstallSheet'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import { claimFirstAutoPrompt } from '../lib/install'
import { markOnboarded } from '../lib/onboarding'
import { PACK_IDS } from '../offline/manifest'
import { isPackCompleted } from '../offline/useDownloads'
import { useDeferredInstallPrompt } from '../pwa/installPrompt'
import { isIOS, isStandalonePWA } from '../utils/platform'

function InstallStep() {
  const { event, prompt } = useDeferredInstallPrompt()
  const [sheet, setSheet] = useState(false)

  if (isStandalonePWA()) {
    return <p>Already installed on this device. You're reading the home-screen copy now.</p>
  }
  if (isIOS()) {
    // iOS cannot show an OS install dialog, so the button opens the app's own
    // step-by-step sheet. Opening it here also claims the one auto-prompt, so
    // Home doesn't repeat the ask a tap later.
    return (
      <>
        <p>
          iPhones don't install this from a button: it goes on your home screen through
          Safari's Share menu. It takes about ten seconds, and it is what makes the guide
          hold on to its offline downloads.
        </p>
        <Button
          size="sm"
          onClick={() => {
            claimFirstAutoPrompt()
            setSheet(true)
          }}
        >
          Show me how →
        </Button>
        {sheet && <InstallSheet onClose={() => setSheet(false)} />}
      </>
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
