// =============================================================================
// Colour scheme preference: Auto (follow the device), Daylight (cream paper),
// Granite (the dark instrument scheme). Written to `tfg.theme` and applied as
// `data-theme` on <html>, which tokens.css reads.
//
// Auto is the default and resolves to Daylight unless the device is in dark
// mode. That asymmetry is deliberate: a cream ground outreads a dark one in
// direct sun and this guide is used outdoors, so a reader who wants granite in
// daylight has to say so. Storage failures fail open to Auto rather than
// trapping a storage-blocked browser in one scheme.
// =============================================================================

import { useCallback, useState } from 'react'

export type ThemeT = 'auto' | 'daylight' | 'granite'

const KEY = 'tfg.theme'

const THEMES: readonly ThemeT[] = ['auto', 'daylight', 'granite']

export const THEME_LABEL: Record<ThemeT, string> = {
  auto: 'Auto',
  daylight: 'Daylight',
  granite: 'Granite',
}

export const THEME_NOTE: Record<ThemeT, string> = {
  auto: 'Follows your device. Best for most trips.',
  daylight: 'Cream paper. Easiest to read in direct sun.',
  granite: 'Dark instrument panel. Low light and star gazing.',
}

// Browser chrome colour per scheme, mirrored by hand from --paper in
// tokens.css. index.html ships one <meta name="theme-color"> per scheme; an
// explicit choice has to override both, because the media attribute on those
// tags answers the device, not the reader.
const CHROME: Record<'daylight' | 'granite', string> = {
  daylight: '#f1ead6',
  granite: '#1c1812',
}

function isTheme(value: string | null): value is ThemeT {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

export function readTheme(): ThemeT {
  try {
    const raw = localStorage.getItem(KEY)
    return isTheme(raw) ? raw : 'auto'
  } catch {
    // Storage denied: Auto is the honest answer, and the device still decides.
    return 'auto'
  }
}

export function applyTheme(theme: ThemeT): void {
  const root = document.documentElement
  if (theme === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)

  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  metas.forEach((meta) => {
    if (theme === 'auto') {
      // Hand each tag back the scheme it was written for.
      const forDark = meta.getAttribute('media')?.includes('dark')
      meta.content = forDark ? CHROME.granite : CHROME.daylight
    } else {
      meta.content = CHROME[theme]
    }
  })
}

export function setTheme(theme: ThemeT): void {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Non-fatal: the choice holds for this session and is lost on reload.
  }
  applyTheme(theme)
}

export function useTheme(): [ThemeT, (next: ThemeT) => void] {
  const [theme, setLocal] = useState<ThemeT>(readTheme)
  const update = useCallback((next: ThemeT) => {
    setTheme(next)
    setLocal(next)
  }, [])
  return [theme, update]
}

export const THEME_OPTIONS = THEMES
