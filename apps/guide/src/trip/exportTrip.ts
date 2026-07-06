// =============================================================================
// ICS delivery. In an installed iOS PWA (standalone display mode) a plain
// <a download> of a blob is unreliable — there's no download manager and the
// file can open in a dead-end preview. Order of attack:
//   1. Web Share with a File (iOS offers Save to Files / Mail; opening the
//      saved file imports to Calendar)
//   2. Object-URL anchor download (Android / desktop)
// Both work offline. The caller shows a follow-up hint for the share path.
// =============================================================================

import { isIOS, isStandalonePWA } from '../utils/platform'

export type ExportMethod = 'shared' | 'downloaded' | 'cancelled' | 'failed'

export async function exportTripIcs(ics: string, filename: string): Promise<ExportMethod> {
  const file = new File([ics], filename, { type: 'text/calendar' })

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Yosemite trip plan' })
      return 'shared'
    } catch (err) {
      // AbortError = the user closed the sheet; don't force a download on them.
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      // In an installed iOS PWA the anchor fallback is the dead-end preview
      // this module exists to avoid; report failure so the caller's copy can
      // point at the subscribe path instead.
      if (isIOS() && isStandalonePWA()) return 'failed'
      /* fall through to download */
    }
  }

  try {
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}
