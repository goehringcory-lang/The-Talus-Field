import { useEffect, useState } from 'react'

// Suspense fallback for lazy routes. Renders nothing for a beat so fast
// chunk loads never flash a spinner; slow loads get a full-viewport one.
const SPINNER_DELAY_MS = 150

export default function RouteFallback() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), SPINNER_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="route-fallback" role="status" aria-label="Loading">
      <span className="spinner" aria-hidden="true" />
    </div>
  )
}
