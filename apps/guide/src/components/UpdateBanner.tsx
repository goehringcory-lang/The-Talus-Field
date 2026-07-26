import { useEffect, useState } from 'react'
import { getPendingUpdate, onUpdateReady, triggerUpdate } from '../pwa/registerSW'

export default function UpdateBanner() {
  // Seeded from module state, not only from the event: registerSW can announce
  // before this component's effect runs (a worker already waiting from a prior
  // visit is found during boot), and a one-shot event fired into an empty room
  // is a bar that never appears — or appears once and vanishes on remount.
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(getPendingUpdate)
  const [updating, setUpdating] = useState(false)
  // Session-only: the banner comes back on the next launch by design.
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => onUpdateReady(setRegistration), [])

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
        {updating ? 'Refreshing…' : 'Updated. Tap to refresh.'}
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
