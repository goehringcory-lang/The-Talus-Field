// Per-route document titles. Every route used to share index.html's
// "Yosemite Field Guide · The Talus Field", so the tab strip, the history
// menu, the OS task switcher and a screen reader's page announcement could
// not tell /trip from /map from a stop page. ScrollToTop resets the title to
// the base on every path change (a layout effect, so it runs before the
// passive effect below), and any page that knows its name sets it after.

import { useEffect } from 'react'

export const BASE_TITLE = 'Yosemite Field Guide · The Talus Field'
const SUFFIX = ' · The Talus Field'

export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) return
    document.title = title + SUFFIX
  }, [title])
}
