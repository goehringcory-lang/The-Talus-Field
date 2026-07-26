import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Side-effect import: triggers Stops.parse() at boot so any seed-data error
// surfaces immediately instead of when Phase 3 first reads a stop.
import './content'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { captureInstallPrompt } from './pwa/installPrompt'
import { registerServiceWorker } from './pwa/registerSW'
import { stashPendingImportFromUrl } from './trip/importTrip'
import { startPlanSync } from './sync/planSync'
import { startPushSync } from './push/push'

// Before render: Chrome can fire beforeinstallprompt at any moment after
// load, and the install surfaces (welcome page, banner) mount later.
captureInstallPrompt()

// Also before render: a trip handed over from the editorial map arrives as
// /trip?import=…, and a visitor who doesn't own the guide yet is redirected
// away before /trip ever mounts. Capturing here means the trip survives the
// whole buy detour, not just a sign-in.
stashPendingImportFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Outside the router so even a routing failure gets the reload card. */}
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

// UpdateBanner subscribes through registerSW's own latch (onUpdateReady), so
// an update found during boot is still there whenever the banner mounts.
registerServiceWorker()

// Keep the trip, saved stops, visited stops, and notes in step across the
// buyer's devices (no-op until they turn sync on from the Account page).
startPlanSync()

// Keep this device's push registration and its copy of the trip dates fresh
// (no-op until notifications are turned on from the Account page; never
// prompts on its own).
startPushSync()
