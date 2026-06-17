// Pin styling and directions deeplinks for the /map route. Marker pins are
// DOM elements (MapLibre markers), so kinds are plain colors — no sprite
// sheet, which keeps the map fully offline with tiles alone.

import type { StopKind } from '../content'

export type KindStyle = { color: string; label: string }

export const KIND_STYLES: Record<StopKind, KindStyle> = {
  viewpoint: { color: '#1e6fb8', label: 'Viewpoint' },
  trailhead: { color: '#2f8a3e', label: 'Trailhead' },
  parking: { color: '#6b6b6b', label: 'Parking' },
  lodging: { color: '#7a4ea8', label: 'Lodging' },
  meal: { color: '#e07a1a', label: 'Meal' },
  drive: { color: '#b8442e', label: 'Drive' },
}

export function getKindStyle(kind: StopKind): KindStyle {
  return KIND_STYLES[kind]
}

// Google Maps Directions deeplink. On phones with the Google Maps app
// installed, the OS deep-links into the app, which uses the user's
// pre-downloaded Yosemite offline area for routing.
export function directionsUrl(coord: [number, number]): string {
  const [lng, lat] = coord
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
}

/** Teardrop pin as a DOM element for maplibregl.Marker. */
export function buildPinElement(kind: StopKind): HTMLElement {
  const { color, label } = getKindStyle(kind)
  const el = document.createElement('div')
  el.className = 'map-pin'
  el.setAttribute('aria-label', label)
  el.innerHTML = `
    <svg width="26" height="36" viewBox="0 0 26 36" aria-hidden="true">
      <path d="M13 35C13 35 25 21 25 13A12 12 0 1 0 1 13C1 21 13 35 13 35Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="13" cy="13" r="4.5" fill="#ffffff"/>
    </svg>`
  return el
}
