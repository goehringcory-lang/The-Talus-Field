// =============================================================================
// Hand a generated file to the OS: Web Share with a File first (the only
// reliable path in an installed iOS PWA, where a blob <a download> can dead-
// end in a preview), object-URL anchor download second. The same order of
// attack as trip/exportTrip.ts, generalized for files that are not calendars
// (the field card PNG today). Both paths work offline.
// =============================================================================

import { isIOS, isStandalonePWA } from '../utils/platform'

export type ShareFileMethod = 'shared' | 'downloaded' | 'cancelled' | 'failed'

export async function shareOrDownloadFile(file: File, title: string): Promise<ShareFileMethod> {
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title })
      return 'shared'
    } catch (err) {
      // AbortError = the user closed the sheet; don't force a download on them.
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      if (isIOS() && isStandalonePWA()) return 'failed'
      /* fall through to download */
    }
  }

  try {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}
