// Pin styling and directions deeplinks for the /map route. Marker pins are
// DOM elements (MapLibre markers), so kinds are plain colors plus an inline
// SVG glyph — no sprite sheet, which keeps the map fully offline with tiles
// alone.

import type { AmenityKind, StopKind } from '../content'

// Everything that gets a teardrop pin on /map. Stops and amenities use their
// own kinds (two amenity kinds, parking and camping, are StopKinds too); day-
// hike trailheads are their own kind — a hike is a route, not a Stop, but on
// the map it earns the same first-class treatment (chip, count, legend) as
// any stop kind.
export type MapPinKind = StopKind | AmenityKind | 'hike'

export type KindStyle = {
  color: string
  label: string
  // Minor kinds hide below driving zoom on the "All" view (routes/Map.tsx):
  // a shuttle stop or a picnic table is a street-scale fact, and eighteen of
  // them on the whole-park frame bury the viewpoints the frame is for.
  minor?: boolean
}

// Hues tuned to the print palette (slate, forest, grey-brown, aubergine,
// --gold, --moss) while staying distinguishable from each other and legible
// against the greens and tans of the topo tiles. Declaration order is chip
// and legend order: destinations first, then the infrastructure layer.
export const KIND_STYLES: Record<MapPinKind, KindStyle> = {
  viewpoint: { color: '#2c4a63', label: 'Viewpoint' },
  trailhead: { color: '#3d5a3f', label: 'Trailhead' },
  hike: { color: '#7d3245', label: 'Day hike' },
  landmark: { color: '#4d4a6b', label: 'Landmark' },
  drive: { color: '#7a2a10', label: 'Drive' },
  lodging: { color: '#5a3a5e', label: 'Lodging' },
  meal: { color: '#8a661a', label: 'Meal' },
  camping: { color: '#1c6e63', label: 'Camping' },
  entrance: { color: '#1f1f1f', label: 'Entrance' },
  'visitor-center': { color: '#1d5f8a', label: 'Visitor center' },
  parking: { color: '#6b6355', label: 'Parking', minor: true },
  shuttle: { color: '#2f7d32', label: 'Shuttle stop', minor: true },
  picnic: { color: '#6a7d1e', label: 'Picnic area', minor: true },
  services: { color: '#4a4f57', label: 'Services', minor: true },
}

export const MINOR_KINDS: MapPinKind[] = (Object.keys(KIND_STYLES) as MapPinKind[]).filter(
  (k) => KIND_STYLES[k].minor,
)

export function getKindStyle(kind: MapPinKind): KindStyle {
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

// One glyph per kind, drawn inside the 26×36 teardrop whose circle is
// centred at (13,13) with radius 12. Every path is drawn in the pin's stroke
// colour (white, or gold for Secret Guide entries) and must survive 26 px:
// simple silhouettes only, nothing under two units wide. The peak glyph is
// the day-hike mark that predates this table and is kept as drawn so a
// trailhead pin and a hike pin stay tellable apart at the same turnout.
function kindGlyph(kind: MapPinKind, stroke: string): string {
  switch (kind) {
    case 'hike':
      return `<path d="M6.5 16.5 L11 9 L13.5 13 L15.5 10.2 L19.5 16.5 Z" fill="${stroke}"/>`
    case 'viewpoint':
      // An eye: the almond outline with a pupil.
      return `<path d="M6.5 13 Q13 6.5 19.5 13 Q13 19.5 6.5 13 Z" fill="none" stroke="${stroke}" stroke-width="1.8"/><circle cx="13" cy="13" r="2.4" fill="${stroke}"/>`
    case 'trailhead':
      // A signpost: post plus a right-pointing blade.
      return `<rect x="11.8" y="7.5" width="2.4" height="12" fill="${stroke}"/><path d="M7 9 H17.5 L20 11.75 L17.5 14.5 H7 Z" fill="${stroke}"/>`
    case 'landmark':
      // A peak with a summit notch.
      return `<path d="M6 18 L11.5 8.5 L14 12 L16 9.5 L20 18 Z" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/>`
    case 'drive':
      // A road: two edge lines and a dashed centre.
      return `<path d="M8 19 L11 7 M18 19 L15 7" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/><path d="M13 8 V11 M13 13 V16 M13 18 V19" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/>`
    case 'lodging':
      // A bed seen from the side.
      return `<path d="M6.5 17.5 V10.5 M6.5 14 H19.5 V17.5 M19.5 14 V12 H11 V14" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="11.5" r="1.5" fill="${stroke}"/>`
    case 'meal':
      // Fork and knife.
      return `<path d="M10 7 V19 M8 7 V11 Q8 13 10 13 Q12 13 12 11 V7" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/><path d="M16.5 7 Q14.5 9 14.5 12.5 Q14.5 14 16.5 14 V19" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/>`
    case 'camping':
      // A tent.
      return `<path d="M13 7.5 L19.5 18.5 H6.5 Z" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 12 L15.5 18.5 H10.5 Z" fill="${stroke}"/>`
    case 'entrance':
      // A gate: two posts and the crossbar.
      return `<path d="M7.5 19 V9 M18.5 19 V9 M7.5 9 Q13 5.5 18.5 9" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 14 H17.5" stroke="${stroke}" stroke-width="1.8"/>`
    case 'visitor-center':
      // The information "i".
      return `<circle cx="13" cy="8.5" r="1.7" fill="${stroke}"/><path d="M10.5 11.5 H14 V17.5 H16 M10.5 17.5 H12" fill="none" stroke="${stroke}" stroke-width="2"/>`
    case 'parking':
      return `<text x="13" y="17.5" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700" font-size="13" fill="${stroke}">P</text>`
    case 'shuttle':
      // A bus seen head-on; a stop number, when the entry carries one,
      // replaces this (see buildPinElement).
      return `<rect x="7.5" y="7" width="11" height="10" rx="2" fill="none" stroke="${stroke}" stroke-width="1.8"/><path d="M8 12.5 H18" stroke="${stroke}" stroke-width="1.6"/><circle cx="10" cy="18.5" r="1.3" fill="${stroke}"/><circle cx="16" cy="18.5" r="1.3" fill="${stroke}"/>`
    case 'picnic':
      // A picnic table: top, bench, two splayed legs.
      return `<path d="M7 9.5 H19 M8.5 15 H17.5 M11 9.5 L8 18.5 M15 9.5 L18 18.5" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round"/>`
    case 'services':
      // A fuel pump: body, window, hose.
      return `<rect x="7.5" y="7.5" width="8" height="11.5" rx="1" fill="none" stroke="${stroke}" stroke-width="1.7"/><rect x="9.5" y="9.5" width="4" height="3" fill="${stroke}"/><path d="M15.5 11 H17.5 V16.5 Q17.5 18 19 18" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round"/>`
  }
}

/** Teardrop pin as a DOM element for maplibregl.Marker. Each kind carries its
 * own glyph so a pin says what it is before its colour does; `glyph` (one or
 * two characters, a shuttle stop's number) replaces the kind glyph when given.
 *
 * `name` is the entry's own name and is required: a pin's popup carries the
 * only route to Open stop, Add to trip, and Directions, so pins that all
 * announce "Viewpoint" and take no focus put those actions out of reach for
 * anyone not using a mouse. Callers pair this with a keydown listener
 * matching their click listener. */
export function buildPinElement(
  kind: MapPinKind,
  name: string,
  hidden = false,
  glyph?: string,
): HTMLElement {
  const { color, label, minor } = getKindStyle(kind)
  const stroke = hidden ? HIDDEN_PIN_STROKE : '#ffffff'
  const el = document.createElement('div')
  el.className = [
    'map-pin',
    hidden ? 'map-pin--hidden' : '',
    minor ? 'map-pin--minor' : '',
    `map-pin--${kind}`,
  ]
    .filter(Boolean)
    .join(' ')
  el.setAttribute('role', 'button')
  el.tabIndex = 0
  el.setAttribute(
    'aria-label',
    hidden ? `${name}, ${label}, Secret Guide` : `${name}, ${label}`,
  )
  const inner = glyph
    ? `<text x="13" y="17.5" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700" font-size="${glyph.length > 1 ? 11 : 13}" fill="${stroke}">${escapeXml(glyph)}</text>`
    : kindGlyph(kind, stroke)
  el.innerHTML = `
    <svg width="26" height="36" viewBox="0 0 26 36" aria-hidden="true">
      <path d="M13 35C13 35 25 21 25 13A12 12 0 1 0 1 13C1 21 13 35 13 35Z" fill="${color}" stroke="${stroke}" stroke-width="2"/>
      ${inner}
    </svg>`
  return el
}

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

/** The same glyph as a standalone 18×18 mark, for legends and chips: the
 * teardrop cropped to its circle, so a legend row shows the mark the reader
 * will meet on the map instead of a bare colour dot. */
export function kindMarkSvg(kind: MapPinKind): string {
  const { color } = getKindStyle(kind)
  return `<svg width="18" height="18" viewBox="1 1 24 24" aria-hidden="true"><circle cx="13" cy="13" r="11" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>${kindGlyph(kind, '#ffffff')}</svg>`
}
