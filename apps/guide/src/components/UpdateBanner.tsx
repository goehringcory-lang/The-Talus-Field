import { useEffect, useState } from 'react'
import { triggerUpdate } from '../pwa/registerSW'

export default function UpdateBanner() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<ServiceWorkerRegistration>).detail
      if (detail) setRegistration(detail)
    }
    window.addEventListener('tfg:update-ready', handler)
    return () => window.removeEventListener('tfg:update-ready', handler)
  }, [])

  if (!registration) return null

  return (
    <button type="button" className="update-banner" onClick={() => triggerUpdate(registration)}>
      Updated. Tap to refresh.
    </button>
  )
}
