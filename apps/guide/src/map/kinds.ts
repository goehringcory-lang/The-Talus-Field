// Pin styling and directions deeplinks for the /map route. Marker pins are
// DOM elements (MapLibre markers), so kinds are plain colors — no sprite
// sheet, which keeps the map fully offline with tiles alone.

import type { StopKind } from '../content'

export type KindStyle = { color: string; label: string }

// Hues tuned to the print palette (slate, forest, grey-brown, aubergine,
// --gold, --moss) while staying distinguishable from each other and legible
// against the greens and tans of the topo tiles.
export const KIND_STYLES: Record<StopKind, KindStyle> = {
  viewpoint: { color: '#2c4a63', label: 'Viewpoint' },
  trailhead: { color: '#3d5a3f', label: 'Trailhead' },
  parking: { color: '#6b6355', label: 'Parking' },
  lodging: { color: '#5a3a5e', label: 'Lodging' },
  meal: { color: '#8a661a', label: 'Meal' },
  drive: { color: '#7a2a10', label: 'Drive' },
  camping: { color: '#1c6e63', label: 'Camping' },
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

// Gold outline for Secret Guide pins (hidden stops and secret spots). Kind
// color stays authoritative so the kind legend remains truthful; the outline
// is a second, orthogonal signal. Name and CSS class kept from the original
// hidden-areas feature to avoid churn.
export const HIDDEN_PIN_STROKE = '#e9c46a'

/** Teardrop pin as a DOM element for maplibregl.Marker. */
export function buildPinElement(kind: StopKind, hidden = false): HTMLElement {
  const { color, label } = getKindStyle(kind)
  const stroke = hidden ? HIDDEN_PIN_STROKE : '#ffffff'
  const el = document.createElement('div')
  el.className = hidden ? 'map-pin map-pin--hidden' : 'map-pin'
  el.setAttribute('aria-label', hidden ? `${label} (Secret Guide)` : label)
  el.innerHTML = `
    <svg width="26" height="36" viewBox="0 0 26 36" aria-hidden="true">
      <path d="M13 35C13 35 25 21 25 13A12 12 0 1 0 1 13C1 21 13 35 13 35Z" fill="${color}" stroke="${stroke}" stroke-width="2"/>
      <circle cx="13" cy="13" r="4.5" fill="${stroke}"/>
    </svg>`
  return el
}
