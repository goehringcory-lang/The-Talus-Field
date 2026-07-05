import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Side-effect import: triggers Stops.parse() at boot so any seed-data error
// surfaces immediately instead of when Phase 3 first reads a stop.
import './content'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { registerServiceWorker } from './pwa/registerSW'
import { startFeedSync } from './trip/feedSync'

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

registerServiceWorker((registration) => {
  window.dispatchEvent(
    new CustomEvent('tfg:update-ready', { detail: registration }),
  )
})

// Keep the hosted calendar feed current with local plan edits (no-op until
// the user subscribes from the trip page's calendar sheet).
startFeedSync()
