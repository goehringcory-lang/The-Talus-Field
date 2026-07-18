import { useEffect, useState } from 'react'
import { triggerUpdate } from '../pwa/registerSW'

export default function UpdateBanner() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)
  const [updating, setUpdating] = useState(false)
  // Session-only: the banner comes back on the next launch by design.
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<ServiceWorkerRegistration>).detail
      if (detail) setRegistration(detail)
    }
    window.addEventListener('tfg:update-ready', handler)
    return () => window.removeEventListener('tfg:update-ready', handler)
  }, [])

  if (!registration || dismissed) return null

  return (
    <div className="update-banner" role="status">
      <button
        type="button"
        className="update-banner__action"
        disabled={updating}
        onClick={() => {
          setUpdating(true)
          void triggerUpdate(registration)
        }}
      >
        {updating ? 'Updating…' : 'A new version is ready. Tap to update.'}
      </button>
      <button
        type="button"
        className="update-banner__dismiss"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
      >
        ×
      </button>
    </div>
  )
}
