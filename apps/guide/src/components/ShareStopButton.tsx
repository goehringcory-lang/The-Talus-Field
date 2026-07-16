// Share a stop's URL. Signed-out recipients land on the public teaser page
// for that stop (not the login wall), so a buyer sharing a find doubles as a
// referral. Web Share sheet where the platform has one, clipboard fallback
// elsewhere; hidden in the rare context that offers neither.

import { useEffect, useState } from 'react'
import Button from './ui/Button'

type Props = {
  stopId: string
  title: string
}

export default function ShareStopButton({ stopId, title }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(t)
  }, [copied])

  const canShare =
    typeof navigator !== 'undefined' && Boolean(navigator.share || navigator.clipboard)
  if (!canShare) return null

  async function onShare() {
    const url = `${window.location.origin}/stop/${stopId}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} · Yosemite Field Guide`, url })
      } catch {
        /* share sheet dismissed; not an error */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      /* clipboard denied: nothing useful to do */
    }
  }

  return (
    <Button variant="ghost" onClick={() => void onShare()}>
      {copied ? 'Link copied' : 'Share'}
    </Button>
  )
}
