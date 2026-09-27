// =============================================================================
// The 3D map's look: every colour and every tunable number in one place.
//
// "Google Maps, but 3D, and ours": flat fills for forest, meadow, bare
// granite and water under a soft hillshade, drawn in the guide's two schemes.
// The colours that are app tokens (paper, ink, the rule, the accent) are read
// from tokens.css at style-build time, so the map follows the reader's
// daylight/granite choice with the rest of the app and a token change reaches
// the map with no edit here. The rest are map-only fills tuned against those
// grounds, one set per scheme.
//
// MapLibre takes concrete colours, not var(), which is why this reads the
// computed tokens instead of passing them through; `resolvedScheme()` and the
// style's rebuild on a scheme change (routes/Map.tsx) keep them current.
// =============================================================================

import { namedFlavor, type Flavor } from '@protomaps/basemaps'

export type Scheme = 'daylight' | 'granite'

/** Vertical exaggeration of the 3D terrain. One number, per the design brief. */
export const TERRAIN_EXAGGERATION = 1.4

/** Hillshade strength, 0-1. Soft: the terrain carries the relief in 3D. */
export const HILLSHADE_EXAGGERATION = 0.35

/** The pitch the 3D view opens at, and the most the reader may tilt. */
export const DEFAULT_PITCH = 60
export const MAX_PITCH = 78

/**
 * The opening camera: over the Valley's west end, looking east up the Valley
 * so El Capitan stands on the left and Half Dome closes the view.
 */
export const HOME_CAMERA = {
  center: [-119.6155, 37.7248] as [number, number],
  zoom: 12.4,
  pitch: DEFAULT_PITCH,
  bearing: 78,
}

/** How far past the archive extent the reader may pan, in degrees. */
export const PAN_BUFFER_DEG = 0.12

/** Which scheme the reader is seeing: their pinned choice, else the device's. */
export function resolvedScheme(): Scheme {
  const pinned = document.documentElement.getAttribute('data-theme')
  if (pinned === 'granite' || pinned === 'daylight') return pinned
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'granite' : 'daylight'
}

function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export type MapTheme = {
  scheme: Scheme
  flavor: Flavor
  hillshade: { shadow: string; highlight: string; accent: string }
  sky: { sky: string; horizon: string; fog: string }
  boundary: { line: string; mask: string; maskOpacity: number }
  /** Outline of a downloaded offline region, drawn while the device is offline. */
  offlineRegion: string
}

// Map-only fills. Muted and flat on purpose: the pins, the trip routes and the
// trails carry the colour; the ground must read under all of them.
const FILLS: Record<Scheme, {
  forest: string
  wood: string
  meadow: string
  scrub: string
  rock: string
  glacier: string
  water: string
  road: string
  roadCasing: string
  highway: string
  highwayCasing: string
  minor: string
  path: string
  building: string
}> = {
  daylight: {
    forest: '#c7d1ad',
    wood: '#bfcaa3',
    meadow: '#dde0b6',
    scrub: '#d6d6b2',
    rock: '#e2dccf',
    glacier: '#f3f5f2',
    water: '#9cc3d5',
    road: '#fffdf6',
    roadCasing: '#c8b98f',
    highway: '#f5d9a0',
    highwayCasing: '#c49a52',
    minor: '#fbf7ea',
    path: '#9a8a68',
    building: '#d9ceb1',
  },
  granite: {
    forest: '#27301f',
    wood: '#2b3522',
    meadow: '#33351f',
    scrub: '#302f22',
    rock: '#2c2821',
    glacier: '#3b3e3d',
    water: '#1f3a48',
    road: '#4a4133',
    roadCasing: '#1c1812',
    highway: '#6b5431',
    highwayCasing: '#1c1812',
    minor: '#3a3328',
    path: '#7f7058',
    building: '#3a3226',
  },
}

export function buildTheme(scheme: Scheme = resolvedScheme()): MapTheme {
  const f = FILLS[scheme]
  const paper = token('--paper', scheme === 'granite' ? '#1c1812' : '#f1ead6')
  const ink = token('--ink', scheme === 'granite' ? '#f0e8d8' : '#14110c')
  const ink3 = token('--ink-3', scheme === 'granite' ? '#b8a88a' : '#50402e')
  const accent = token('--rust', scheme === 'granite' ? '#d87040' : '#7a2a10')
  const base = namedFlavor(scheme === 'granite' ? 'dark' : 'light')

  const flavor: Flavor = {
    ...base,
    background: paper,
    earth: paper,
    park_a: f.meadow,
    park_b: f.meadow,
    wood_a: f.wood,
    wood_b: f.forest,
    scrub_a: f.scrub,
    scrub_b: f.scrub,
    glacier: f.glacier,
    sand: f.rock,
    beach: f.rock,
    water: f.water,
    buildings: f.building,
    pedestrian: f.minor,
    other: f.path,
    minor_service: f.minor,
    minor_a: f.minor,
    minor_b: f.minor,
    link: f.road,
    major: f.road,
    highway: f.highway,
    minor_service_casing: f.roadCasing,
    minor_casing: f.roadCasing,
    link_casing: f.roadCasing,
    major_casing_early: f.roadCasing,
    major_casing_late: f.roadCasing,
    highway_casing_early: f.highwayCasing,
    highway_casing_late: f.highwayCasing,
    boundaries: ink3,
    roads_label_minor: ink3,
    roads_label_minor_halo: paper,
    roads_label_major: ink,
    roads_label_major_halo: paper,
    subplace_label: ink3,
    subplace_label_halo: paper,
    city_label: ink,
    city_label_halo: paper,
    state_label: ink3,
    state_label_halo: paper,
    address_label: ink3,
    address_label_halo: paper,
    ocean_label: ink3,
    landcover: {
      barren: f.rock,
      farmland: f.meadow,
      forest: f.forest,
      glacier: f.glacier,
      grassland: f.meadow,
      scrub: f.scrub,
      urban_area: f.building,
    },
    // No POI layer: the guide draws its own points, and two sets of pins for
    // the same places would disagree about where they are.
    pois: undefined,
  }

  return {
    scheme,
    flavor,
    hillshade: {
      shadow: scheme === 'granite' ? '#000000' : '#3b3326',
      highlight: scheme === 'granite' ? '#6e6352' : '#ffffff',
      accent: scheme === 'granite' ? '#000000' : '#5b4f3b',
    },
    sky: scheme === 'granite'
      ? { sky: '#0f1419', horizon: '#2a2a2a', fog: paper }
      : { sky: '#a9c6d8', horizon: '#efe6cf', fog: paper },
    boundary: { line: accent, mask: ink, maskOpacity: scheme === 'granite' ? 0.35 : 0.12 },
    offlineRegion: accent,
  }
}
