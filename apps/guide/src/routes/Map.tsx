// =============================================================================
// /map route — three-tab map experience for the Field Guide PWA.
//
// Tabs: GPS points / Itineraries / Information.
// The MapLibre instance is created once on mount and lives inside a div that
// is never unmounted (panes overlay it via absolute positioning + visibility
// toggling). State is reflected in the URL:
//   /map?tab=points|itineraries|info&itinerary=1day|2day|3day&stop=<id>
//
// Tiles come from the Worker's /tiles proxy and are served cache-first by the
// service worker, so once the offline map pack is downloaded (Account →
// Offline) the whole map works in airplane mode. Turn-by-turn routing stays a
// deeplink into the native Google Maps app.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import GatedChrome from '../components/GatedChrome'
import ResponsivePhoto from '../components/ResponsivePhoto'
import { ChipButton } from '../components/ui/Chip'
import { AMENITIES, DINING, DINING_KIND_LABEL, HIKES, REGIONS, SECRET_SPOTS, stops as allStops, getItineraryDayPhotos, getStopById, isSecretGuideEntry, type AmenityT, type DiningVenueT, type GuideStopT, type HikeT, type Region } from '../content'
import { DIFFICULTY_LABEL, formatTime } from '../content/labels'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import { HIDDEN_PIN_STROKE, KIND_STYLES, MINOR_KINDS, buildPinElement, directionsUrl, getKindStyle, kindMarkSvg, type MapPinKind } from '../map/kinds'
import { getHikeById } from '../content'
import { hasTrack } from '../trails/track'
import { useTrack } from '../trails/useTrack'
import { announceTripAdd } from '../trip/addFeedback'
import { addHikeToPlan, addStopToPlan, isHikePlanned, isStopPlanned, useTripPlan } from '../trip/useTripPlan'
import { buildMapStyle } from '../map/style'
import { isPackCompleted } from '../offline/useDownloads'
import { MAP_PACK_ID } from '../offline/manifest'
import { formatMiles, haversineMiles } from '../utils/geo'
import { popupPhotoUrl } from '../utils/photo'
import './Map.css'
import { useDocumentTitle } from '../lib/documentTitle'

type Tab = 'points' | 'itineraries' | 'info'

function isTab(value: string | null | undefined): value is Tab {
  return value === 'points' || value === 'itineraries' || value === 'info'
}

type UrlState = {
  tab: Tab
  itinerary: ItineraryKey | null
  stop: string | null
  kinds: MapPinKind[] | null // null = no kind narrowing (all kinds show)
  secret: boolean
  hike: string | null // hike id whose track overlays the map (?hike=)
  // ?planned=1 narrows the map to the trip plan. Deliberately NOT ?trip=:
  // that name carries stop lists on the editorial map's share links.
  planned: boolean
}

const ALL_KINDS = Object.keys(KIND_STYLES) as MapPinKind[]

function isPinKind(value: string): value is MapPinKind {
  // Own-property check: `in` walks the prototype chain, so a URL like
  // ?kinds=constructor would validate and hide every pin.
  return Object.hasOwn(KIND_STYLES, value)
}

function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search)
  const tab = params.get('tab')
  const itin = params.get('itinerary')
  const stop = params.get('stop')
  const kindsRaw = params.get('kinds')
  // Invalid tokens drop; an empty or complete list is the same as no
  // narrowing, so both normalize to null and the param round-trips away.
  const kinds = kindsRaw ? [...new Set(kindsRaw.split(',').filter(isPinKind))] : null
  const hike = params.get('hike')
  return {
    tab: isTab(tab) ? tab : 'points',
    itinerary: isItineraryKey(itin) ? itin : null,
    stop: stop || null,
    kinds: kinds && kinds.length > 0 && kinds.length < ALL_KINDS.length ? kinds : null,
    secret: params.get('secret') !== '0',
    // Only hikes with a published track: an unknown id round-trips away.
    hike: hike && hasTrack(hike) ? hike : null,
    planned: params.get('planned') === '1',
  }
}

function writeUrlState(next: UrlState) {
  const params = new URLSearchParams()
  if (next.tab && next.tab !== 'points') params.set('tab', next.tab)
  if (next.itinerary) params.set('itinerary', next.itinerary)
  if (next.stop) params.set('stop', next.stop)
  if (next.kinds && next.kinds.length > 0) params.set('kinds', [...next.kinds].sort().join(','))
  if (!next.secret) params.set('secret', '0')
  if (next.hike) params.set('hike', next.hike)
  if (next.planned) params.set('planned', '1')
  const qs = params.toString()
  const newUrl = '/map' + (qs ? `?${qs}` : '')
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, '', newUrl)
  }
}

function extractExcerpt(body: string, maxLen = 170): string {
  const firstSentence = body.match(/^[^.!?\n]+[.!?]/)
  if (firstSentence && firstSentence[0].length <= maxLen) {
    return firstSentence[0].trim()
  }
  const chunk = body.slice(0, maxLen)
  const lastSpace = chunk.lastIndexOf(' ')
  return (lastSpace > 100 ? chunk.slice(0, lastSpace) : chunk) + '…'
}

// Popup content built as DOM so the "Open stop" action can route through
// react-router instead of a full page load.
function buildPopupContent(
  stop: GuideStopT,
  onOpenStop: (id: string) => void,
  userPos?: [number, number] | null,
): HTMLElement {
  const style = getKindStyle(stop.kind)
  const root = document.createElement('div')
  root.className = 'map-popup'

  const photo = stop.photos[0]
  if (photo) {
    const img = document.createElement('img')
    img.src = popupPhotoUrl(photo.src)
    img.alt = ''
    img.loading = 'lazy'
    img.className = 'map-popup__photo'
    // A 404 in a 300px popup degrades to text-only, no placeholder needed.
    img.onerror = () => img.remove()
    root.appendChild(img)
  }

  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  title.textContent = stop.title
  root.appendChild(title)

  const chip = document.createElement('span')
  chip.className = 'map-popup__kind'
  chip.style.color = style.color
  chip.textContent = style.label
  root.appendChild(chip)

  const excerpt = document.createElement('p')
  excerpt.className = 'map-popup__excerpt'
  excerpt.textContent = stop.teaser ?? extractExcerpt(stop.body)
  root.appendChild(excerpt)

  // Straight-line only: the map's own copy says it does not calculate routes.
  if (userPos && stop.coord) {
    const dist = document.createElement('p')
    dist.className = 'map-popup__distance'
    dist.textContent = `${formatMiles(haversineMiles(userPos, stop.coord))} from you, straight line`
    root.appendChild(dist)
  }

  const actions = document.createElement('p')
  actions.className = 'map-popup__actions'

  const open = document.createElement('button')
  open.type = 'button'
  open.className = 'map-popup__btn'
  open.textContent = 'Open stop →'
  open.addEventListener('click', () => onOpenStop(stop.id))
  actions.appendChild(open)

  const addTrip = document.createElement('button')
  addTrip.type = 'button'
  addTrip.className = 'map-popup__btn'
  addTrip.textContent = isStopPlanned(stop.id) ? 'In trip ✓' : 'Add to trip'
  addTrip.addEventListener('click', () => {
    if (!isStopPlanned(stop.id)) {
      addStopToPlan(stop.id)
      announceTripAdd(stop.title)
    }
    addTrip.textContent = 'In trip ✓'
  })
  actions.appendChild(addTrip)

  if (stop.coord) {
    const dir = document.createElement('a')
    dir.className = 'map-popup__btn map-popup__btn--dir'
    dir.href = directionsUrl(stop.coord)
    dir.target = '_blank'
    dir.rel = 'noopener'
    dir.textContent = 'Directions →'
    actions.appendChild(dir)
  }

  root.appendChild(actions)
  return root
}

// Amenity popup: name, kind chip, note (+ season line), Directions only.
// Amenities (parking lots, campgrounds) are map-only pins, not Stops, so
// there is no "Open stop" or "Add to trip".
function buildAmenityPopupContent(amenity: AmenityT): HTMLElement {
  const style = getKindStyle(amenity.kind)
  const root = document.createElement('div')
  root.className = 'map-popup'

  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  title.textContent = amenity.name
  root.appendChild(title)

  const chip = document.createElement('span')
  chip.className = 'map-popup__kind'
  chip.style.color = style.color
  chip.textContent = style.label
  root.appendChild(chip)

  const excerpt = document.createElement('p')
  excerpt.className = 'map-popup__excerpt'
  excerpt.textContent = amenity.note
  root.appendChild(excerpt)

  // Hours and season are published facts, set in the instrument face like
  // every other reading in the guide.
  for (const [label, value] of [
    ['Hours', amenity.hours],
    ['Season', amenity.season],
  ] as const) {
    if (!value) continue
    const line = document.createElement('p')
    line.className = 'map-popup__stats map-popup__stats--note'
    line.textContent = `${label}: ${value}`
    root.appendChild(line)
  }

  const actions = document.createElement('p')
  actions.className = 'map-popup__actions'
  // A landmark is something you look at from where you are; directions to
  // the foot of Cathedral Rocks would send a car onto a meadow.
  if (amenity.kind !== 'landmark') {
    const dir = document.createElement('a')
    dir.className = 'map-popup__btn map-popup__btn--dir'
    dir.href = directionsUrl(amenity.coord)
    dir.target = '_blank'
    dir.rel = 'noopener'
    dir.textContent = 'Directions →'
    actions.appendChild(dir)
  }
  if (amenity.kind === 'shuttle') {
    const note = document.createElement('span')
    note.className = 'map-popup__stats'
    note.textContent = 'Free, no ticket. Times in Essentials → Getting around.'
    actions.appendChild(note)
  }
  if (actions.childNodes.length > 0) root.appendChild(actions)
  return root
}

// Places to eat, from the dining directory. One pin per coordinate, like the
// trailheads: the Village, the Lodge and Curry each hold four or five venues
// on one spot, and five stacked teardrops leave four of them untappable.
// Venues that double as a Stop (stopId set) already have a pin and stay out.
type MealGroup = {
  id: string // first venue's id, stable, keys the marker
  coord: [number, number]
  region: Region | null // gateway venues carry none and never narrow to an itinerary
  place: string
  venues: DiningVenueT[]
}

const MEAL_GROUPS: MealGroup[] = (() => {
  const byCoord: Record<string, MealGroup> = {}
  for (const venue of DINING) {
    if (!venue.coord || venue.stopId) continue
    const key = venue.coord.join(',')
    const group = byCoord[key]
    if (group) group.venues.push(venue)
    else {
      byCoord[key] = {
        id: venue.id,
        coord: venue.coord,
        region: venue.area === 'gateway' ? null : venue.area,
        place: venue.place,
        venues: [venue],
      }
    }
  }
  const groups = Object.values(byCoord)
  for (const g of groups) g.venues.sort((a, b) => a.order - b.order)
  return groups
})()

function buildMealPopupContent(group: MealGroup, onOpenDining: () => void): HTMLElement {
  const style = getKindStyle('meal')
  const root = document.createElement('div')
  root.className = 'map-popup'
  const single = group.venues.length === 1

  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  title.textContent = single ? group.venues[0].name : `${group.venues.length} places to eat`
  root.appendChild(title)

  const chip = document.createElement('span')
  chip.className = 'map-popup__kind'
  chip.style.color = style.color
  chip.textContent = single ? DINING_KIND_LABEL[group.venues[0].kind] : style.label
  root.appendChild(chip)

  const where = document.createElement('p')
  where.className = 'map-popup__distance'
  where.textContent = group.place
  root.appendChild(where)

  for (const venue of group.venues) {
    const block = document.createElement('div')
    block.className = 'map-popup__hike'
    if (!single) {
      const name = document.createElement('strong')
      name.className = 'map-popup__hike-name'
      name.textContent = venue.name
      block.appendChild(name)
    }
    const stats = document.createElement('p')
    stats.className = 'map-popup__stats'
    stats.textContent = [
      single ? null : DINING_KIND_LABEL[venue.kind],
      venue.price,
      venue.hours ?? null,
      venue.closed ? 'closed' : null,
      venue.season ?? null,
    ]
      .filter(Boolean)
      .join(' · ')
    block.appendChild(stats)
    if (single) {
      const excerpt = document.createElement('p')
      excerpt.className = 'map-popup__excerpt'
      excerpt.textContent = extractExcerpt(venue.description)
      block.appendChild(excerpt)
    }
    root.appendChild(block)
  }

  const actions = document.createElement('p')
  actions.className = 'map-popup__actions'
  const open = document.createElement('button')
  open.type = 'button'
  open.className = 'map-popup__btn'
  open.textContent = 'Dining directory →'
  open.addEventListener('click', onOpenDining)
  actions.appendChild(open)
  const dir = document.createElement('a')
  dir.className = 'map-popup__btn map-popup__btn--dir'
  dir.href = directionsUrl(group.coord)
  dir.target = '_blank'
  dir.rel = 'noopener'
  dir.textContent = 'Directions →'
  actions.appendChild(dir)
  root.appendChild(actions)
  return root
}

// Kind mark for chips and the legend: the pin's own glyph, so the row shows
// the mark the reader will meet on the map. The SVG string is built from
// KIND_STYLES alone, never from content, which is what makes innerHTML safe.
function KindMark({ kind }: { kind: MapPinKind }) {
  return <span className="map-kindmark" aria-hidden dangerouslySetInnerHTML={{ __html: kindMarkSvg(kind) }} />
}

// Region frames for the quick-jump row, from the core stops' own coords, so a
// new stop widens its region's frame with no table to update.
const REGION_BOUNDS: Record<Region, [[number, number], [number, number]]> = (() => {
  const out = {} as Record<Region, [[number, number], [number, number]]>
  for (const region of REGIONS) {
    let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity
    for (const s of allStops) {
      if (s.region !== region.id || !s.coord || s.collection === 'hidden') continue
      const [lng, lat] = s.coord
      west = Math.min(west, lng); east = Math.max(east, lng)
      south = Math.min(south, lat); north = Math.max(north, lat)
    }
    out[region.id] = [[west, south], [east, north]]
  }
  return out
})()

// Below this zoom the minor kinds hide on the "All" view. z12 is the whole
// Valley on a phone: at that scale eighteen shuttle stops are one blot.
const MINOR_PIN_MIN_ZOOM = 12

// Chip-length region names for the quick-jump row.
const REGION_JUMP_LABEL: Record<Region, string> = {
  valley: 'Valley',
  'glacier-mariposa': 'Glacier Point',
  tuolumne: 'Tuolumne',
  'hetch-hetchy': 'Hetch Hetchy',
}

// One pin per trailhead, not per hike: several routes start from the same
// turnout (Happy Isles, Tunnel View, Camp 4), and stacking identical pins at
// one coord would leave all but the top one untappable. The popup lists every
// route starting at the pin.
type TrailheadGroup = {
  id: string // first hike's id, stable, keys the marker
  coord: [number, number]
  region: Region
  hikes: HikeT[]
}

const TRAILHEAD_GROUPS: TrailheadGroup[] = (() => {
  // Plain record, not a Map: this file's default export shadows the global
  // Map constructor at module scope.
  const byCoord: Record<string, TrailheadGroup> = {}
  for (const hike of HIKES) {
    if (!hike.coord) continue
    const key = hike.coord.join(',')
    const group = byCoord[key]
    if (group) group.hikes.push(hike)
    else byCoord[key] = { id: hike.id, coord: hike.coord, region: hike.region, hikes: [hike] }
  }
  const groups = Object.values(byCoord)
  for (const g of groups) g.hikes.sort((a, b) => a.order - b.order)
  return groups
})()

// Trailhead pins sitting exactly on a stop or amenity pin (most hike coords
// reuse the trailhead stop's verified pin) get a small pixel nudge so both
// teardrops stay individually tappable at every zoom.
const OCCUPIED_COORD_KEYS = new Set([
  ...[...allStops, ...SECRET_SPOTS].filter((s) => s.coord).map((s) => s.coord!.join(',')),
  ...AMENITIES.map((a) => a.coord.join(',')),
])

function formatHikeStats(hike: HikeT): string {
  const dist = `${hike.distanceMi} mi${hike.route === 'one-way' ? ' one-way' : ''}`
  const gain =
    hike.elevationGainFt === 0
      ? 'flat'
      : `${hike.elevationGainFt.toLocaleString('en-US')} ft gain`
  return `${dist} · ${gain} · ${DIFFICULTY_LABEL[hike.difficulty]} · ~${formatTime(hike.durationMin)}`
}

type HikePopupHandlers = {
  onOpenHike: (id: string) => void
  onShowTrack: (id: string) => void
}

// Trailhead popup: the trail data card. One block per route starting at the
// pin — published stats, first sentence of the write-up (single-route pins),
// permit/season flags, and per-route actions. Same DOM-not-React deal as the
// stop popup.
function buildHikePopupContent(
  group: TrailheadGroup,
  handlers: HikePopupHandlers,
  userPos?: [number, number] | null,
): HTMLElement {
  const style = getKindStyle('hike')
  const root = document.createElement('div')
  root.className = 'map-popup'

  const single = group.hikes.length === 1

  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  title.textContent = single
    ? group.hikes[0].title
    : `${group.hikes.length} hikes from this trailhead`
  root.appendChild(title)

  const chip = document.createElement('span')
  chip.className = 'map-popup__kind'
  chip.style.color = style.color
  chip.textContent = single ? style.label : 'Day hikes'
  root.appendChild(chip)

  const trailhead = document.createElement('p')
  trailhead.className = 'map-popup__distance'
  trailhead.textContent = `Trailhead: ${group.hikes[0].trailhead}`
  root.appendChild(trailhead)

  if (userPos) {
    const dist = document.createElement('p')
    dist.className = 'map-popup__distance'
    dist.textContent = `${formatMiles(haversineMiles(userPos, group.coord))} from you, straight line`
    root.appendChild(dist)
  }

  for (const hike of group.hikes) {
    const block = document.createElement('div')
    block.className = 'map-popup__hike'

    if (!single) {
      const name = document.createElement('strong')
      name.className = 'map-popup__hike-name'
      name.textContent = hike.title
      block.appendChild(name)
    }

    const stats = document.createElement('p')
    stats.className = 'map-popup__stats'
    stats.textContent = formatHikeStats(hike)
    block.appendChild(stats)

    if (single) {
      const excerpt = document.createElement('p')
      excerpt.className = 'map-popup__excerpt'
      excerpt.textContent = extractExcerpt(hike.description)
      block.appendChild(excerpt)
    }

    if (hike.permit || hike.season) {
      const note = document.createElement('p')
      note.className = 'map-popup__stats map-popup__stats--note'
      note.textContent = [
        hike.permit ? 'Permit required' : null,
        hike.season ? `Season: ${hike.season}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      block.appendChild(note)
    }

    const actions = document.createElement('p')
    actions.className = 'map-popup__actions'

    const details = document.createElement('button')
    details.type = 'button'
    details.className = 'map-popup__btn'
    details.textContent = 'Trail details →'
    details.addEventListener('click', () => handlers.onOpenHike(hike.id))
    actions.appendChild(details)

    const addTrip = document.createElement('button')
    addTrip.type = 'button'
    addTrip.className = 'map-popup__btn'
    addTrip.textContent = isHikePlanned(hike.id) ? 'In trip ✓' : 'Add to trip'
    addTrip.addEventListener('click', () => {
      if (!isHikePlanned(hike.id)) {
        addHikeToPlan(hike.id)
        announceTripAdd(hike.title)
      }
      addTrip.textContent = 'In trip ✓'
    })
    actions.appendChild(addTrip)

    if (hasTrack(hike.id)) {
      const track = document.createElement('button')
      track.type = 'button'
      track.className = 'map-popup__btn map-popup__btn--dir'
      track.textContent = 'Trail on map'
      track.addEventListener('click', () => handlers.onShowTrack(hike.id))
      actions.appendChild(track)
    }

    block.appendChild(actions)
    root.appendChild(block)
  }

  const foot = document.createElement('p')
  foot.className = 'map-popup__actions'
  const dir = document.createElement('a')
  dir.className = 'map-popup__btn map-popup__btn--dir'
  dir.href = directionsUrl(group.coord)
  dir.target = '_blank'
  dir.rel = 'noopener'
  dir.textContent = 'Directions to trailhead →'
  foot.appendChild(dir)
  root.appendChild(foot)

  return root
}

// Keyboard equivalent of a pin tap, for the role="button" pins built by
// buildPinElement. One closure per marker, same as the click listener, so the
// cost stays flat across the several hundred pins on the map. Space is
// prevented because a focused pin would otherwise scroll the page under it.
function pinKeydownHandler(activate: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    if (e.key === ' ') e.preventDefault()
    e.stopPropagation()
    activate()
  }
}

export default function Map() {
  useDocumentTitle('Map')
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})
  const amenityMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const hikeMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const mealMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const popupRef = useRef<maplibregl.Popup | null>(null)
  // Camera refits only when the itinerary context changes, not on filter
  // chip toggles: refitting on every tap yanks the map around.
  const lastFitKeyRef = useRef<string | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)
  const [mapDownloaded, setMapDownloaded] = useState(() => isPackCompleted(MAP_PACK_ID))
  // 'far' below MINOR_PIN_MIN_ZOOM. Drives a data attribute on the map
  // container; the CSS does the hiding, so a zoom never rebuilds a marker.
  const [zoomBand, setZoomBand] = useState<'far' | 'near'>('far')

  // Device position from the locate control. The ref mirrors the state so the
  // selection effect can read the position at popup-open time without taking
  // it as a dependency: with trackUserLocation on, every GPS tick would
  // otherwise re-run easeTo and yank the camera back to the selected stop.
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const userPosRef = useRef<[number, number] | null>(null)
  const [geoDenied, setGeoDenied] = useState(false)
  // Set for the geolocation failures that are not a denial (position
  // unavailable, timeout). Deep in the valley those are the common case, and
  // without a line of copy the control just spins.
  const [geoNote, setGeoNote] = useState<string | null>(null)
  const [outOfPark, setOutOfPark] = useState(false)

  // The pack can complete in another tab (or on /account in this one);
  // re-check whenever this tab regains focus so the offline notice is live.
  useEffect(() => {
    const recheck = () => setMapDownloaded(isPackCompleted(MAP_PACK_ID))
    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [])

  // No offline zoom clamp: the raster source declares maxzoom 14 (see
  // map/style.ts), so past z14 MapLibre overzooms the SAME z14 tiles the
  // offline pack carries — z15-16 render offline from cache, just scaled.
  // The old clamp held airplane-mode users at z14 and cost them trailhead-
  // scale reading for no saved tiles.

  const initial = useMemo(() => readUrlState(), [])
  const [tab, setTab] = useState<Tab>(initial.tab)
  // On phones the points pane docks to the bottom over the map, so it opens
  // collapsed to a single handle and expands on tap. The handle is hidden on
  // wider screens (CSS), where the pane is a floating card that always shows.
  const [pointsExpanded, setPointsExpanded] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryKey | null>(initial.itinerary)
  // Selection carries a nonce: the popup closes on map click / its X button
  // without clearing state, so re-selecting the same stop must still re-run
  // the selection effect — a bare id would bail out on the same-value set.
  const [selection, setSelection] = useState<{ id: string | null; nonce: number }>({
    id: initial.stop,
    nonce: 0,
  })
  const selectedStopId = selection.id
  const selectStop = useCallback((id: string | null) => {
    setSelection((prev) => ({ id, nonce: prev.nonce + 1 }))
  }, [])

  // Pin-group filters. kindFilter null means no narrowing; the chip row
  // renders "All" pressed. showSecret hides the gold-outline Secret Guide
  // entries (hidden stops and secret spots) when off.
  const [kindFilter, setKindFilter] = useState<Set<MapPinKind> | null>(() =>
    initial.kinds ? new Set(initial.kinds) : null,
  )
  const [showSecret, setShowSecret] = useState<boolean>(initial.secret)
  const [plannedOnly, setPlannedOnly] = useState<boolean>(initial.planned)

  // Hike track overlay (?hike=<id>). The track loads from the runtime cache
  // offline; the overlay draws above the topo with the trailhead marked.
  const [trackHikeId, setTrackHikeId] = useState<string | null>(initial.hike)
  const trackState = useTrack(trackHikeId ?? undefined)
  const trackHike = trackHikeId ? getHikeById(trackHikeId) : undefined

  // Stops already in the trip plan get a checkmark badge on their pin.
  const { plan } = useTripPlan()
  const plannedStopIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'stop').map((it) => it.stopId)),
    [plan],
  )
  const plannedHikeIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'hike').map((it) => it.hikeId)),
    [plan],
  )

  // Only stops with a coord can be mapped. Secret spots (region-less Secret
  // Guide entries) join the pin set alongside core and hidden stops.
  const mappableStops = useMemo<GuideStopT[]>(
    () => [...allStops, ...SECRET_SPOTS].filter((s) => !!s.coord),
    [],
  )

  // Kinds actually present in the stops, amenities, and hike trailheads, in
  // KIND_STYLES declaration order. Drives the chip row and the InfoPane legend.
  const presentKinds = useMemo(() => {
    const seen = new Set<MapPinKind>()
    for (const s of mappableStops) seen.add(s.kind)
    for (const a of AMENITIES) seen.add(a.kind)
    if (TRAILHEAD_GROUPS.length > 0) seen.add('hike')
    if (MEAL_GROUPS.length > 0) seen.add('meal')
    return ALL_KINDS.filter((k) => seen.has(k))
  }, [mappableStops])

  const toggleKind = useCallback(
    (kind: MapPinKind) => {
      setKindFilter((prev) => {
        const next = new Set(prev ?? [])
        if (next.has(kind)) next.delete(kind)
        else next.add(kind)
        // Empty and complete both mean "no narrowing".
        if (next.size === 0 || next.size === presentKinds.length) return null
        return next
      })
    },
    [presentKinds],
  )
  const clearKinds = useCallback(() => setKindFilter(null), [])
  const resetFilters = useCallback(() => {
    setKindFilter(null)
    setShowSecret(true)
    setPlannedOnly(false)
  }, [])

  // The itinerary's region set, or null when no itinerary narrows the map.
  const itineraryRegions = useMemo<Set<Region> | null>(() => {
    if (tab !== 'itineraries' || !selectedItinerary) return null
    return new Set(ITINERARIES[selectedItinerary].days.flatMap((d) => d.regions))
  }, [selectedItinerary, tab])

  // Filter by itinerary when one is selected and the itineraries tab is
  // active, AND-composed with the kind and Secret Guide filters. Secret Guide
  // entries (hidden stops and region-less secret spots) are excluded from
  // itineraries: the presets are the mainstream path, and itinerary days are
  // derived from regions, so without this filter the premium set would
  // silently inflate every preset.
  const visibleStops = useMemo<GuideStopT[]>(
    () =>
      mappableStops.filter((s) => {
        if (plannedOnly && !plannedStopIds.has(s.id)) return false
        if (kindFilter && !kindFilter.has(s.kind)) return false
        if (!showSecret && isSecretGuideEntry(s)) return false
        if (itineraryRegions) {
          return 'region' in s && itineraryRegions.has(s.region) && s.collection !== 'hidden'
        }
        return true
      }),
    [mappableStops, itineraryRegions, kindFilter, showSecret, plannedOnly, plannedStopIds],
  )

  // Amenities follow the same kind and region narrowing but never join the
  // day-by-day lists or counts: on an itinerary view, "where do I park and
  // camp" for those regions is the point; park-wide clutter is not.
  const visibleAmenities = useMemo<AmenityT[]>(
    () =>
      AMENITIES.filter((a) => {
        // Amenities are never planned; under the trip layer they are clutter.
        if (plannedOnly) return false
        if (kindFilter && !kindFilter.has(a.kind)) return false
        return !itineraryRegions || itineraryRegions.has(a.region)
      }),
    [itineraryRegions, kindFilter, plannedOnly],
  )

  // Day-hike trailheads narrow the same way as amenities: by the hike kind
  // chip and, under an itinerary, by that itinerary's regions. Like
  // amenities, they stay out of the browse lists and fitBounds.
  const visibleTrailheads = useMemo<TrailheadGroup[]>(
    () =>
      TRAILHEAD_GROUPS.filter((g) => {
        if (plannedOnly && !g.hikes.some((h) => plannedHikeIds.has(h.id))) return false
        if (kindFilter && !kindFilter.has('hike')) return false
        return !itineraryRegions || itineraryRegions.has(g.region)
      }),
    [itineraryRegions, kindFilter, plannedOnly, plannedHikeIds],
  )

  // Places to eat narrow like amenities. A gateway venue has no region, so
  // it never joins an itinerary view.
  const visibleMeals = useMemo<MealGroup[]>(
    () =>
      MEAL_GROUPS.filter((g) => {
        if (plannedOnly) return false
        if (kindFilter && !kindFilter.has('meal')) return false
        return !itineraryRegions || (g.region !== null && itineraryRegions.has(g.region))
      }),
    [itineraryRegions, kindFilter, plannedOnly],
  )

  // Chip count badges: what enabling each kind yields under the OTHER active
  // filters (itinerary narrowing, the secret toggle and the trip layer),
  // never the kind filter itself, so a chip's number always states what
  // tapping it shows. The planned clauses mirror the visible* filters above
  // exactly; with "My trip" on, a park-wide number here promised pins the
  // tap did not deliver.
  const kindCounts = useMemo(() => {
    const out = Object.fromEntries(presentKinds.map((k) => [k, 0])) as Record<MapPinKind, number>
    for (const s of mappableStops) {
      if (plannedOnly && !plannedStopIds.has(s.id)) continue
      if (!showSecret && isSecretGuideEntry(s)) continue
      if (
        itineraryRegions &&
        !('region' in s && itineraryRegions.has(s.region) && s.collection !== 'hidden')
      ) {
        continue
      }
      out[s.kind]++
    }
    // Amenities are never planned (see visibleAmenities).
    if (!plannedOnly) {
      for (const a of AMENITIES) {
        if (itineraryRegions && !itineraryRegions.has(a.region)) continue
        out[a.kind]++
      }
    }
    // Pins, not routes: a multi-hike trailhead counts once, matching what
    // tapping the chip puts on the map.
    for (const g of TRAILHEAD_GROUPS) {
      if (plannedOnly && !g.hikes.some((h) => plannedHikeIds.has(h.id))) continue
      if (itineraryRegions && !itineraryRegions.has(g.region)) continue
      out.hike++
    }
    if (!plannedOnly) {
      for (const g of MEAL_GROUPS) {
        if (itineraryRegions && (g.region === null || !itineraryRegions.has(g.region))) continue
        out.meal++
      }
    }
    return out
  }, [mappableStops, itineraryRegions, showSecret, presentKinds, plannedOnly, plannedStopIds, plannedHikeIds])

  const allCount = useMemo(
    () => Object.values(kindCounts).reduce((a, b) => a + b, 0),
    [kindCounts],
  )
  const secretCount = useMemo(
    () => mappableStops.filter(isSecretGuideEntry).length,
    [mappableStops],
  )
  // Pins the trip layer yields: planned stops with coords plus trailhead
  // groups carrying a planned hike. States what tapping the chip shows, like
  // the kind counts.
  const plannedCount = useMemo(
    () =>
      mappableStops.filter((s) => plannedStopIds.has(s.id)).length +
      TRAILHEAD_GROUPS.filter((g) => g.hikes.some((h) => plannedHikeIds.has(h.id))).length,
    [mappableStops, plannedStopIds, plannedHikeIds],
  )

  // Sync state to URL.
  useEffect(() => {
    writeUrlState({
      tab,
      itinerary: selectedItinerary,
      stop: selectedStopId,
      kinds: kindFilter ? [...kindFilter] : null,
      secret: showSecret,
      hike: trackHikeId,
      planned: plannedOnly,
    })
  }, [tab, selectedItinerary, selectedStopId, kindFilter, showSecret, trackHikeId, plannedOnly])

  // Restore from URL on every router navigation: back/forward (the router
  // owns popstate) and bottom-nav "Map" re-taps that push a bare /map over a
  // replaceState'd ?tab=… URL. The component doesn't remount for either, so
  // pane state must follow the address bar or the two silently diverge.
  const location = useLocation()
  useEffect(() => {
    // Deferred so no state update runs synchronously inside the effect body.
    let cancelled = false
    Promise.resolve().then(() => {
      if (cancelled) return
      const next = readUrlState()
      setTab(next.tab)
      setSelectedItinerary(next.itinerary)
      setKindFilter(next.kinds ? new Set(next.kinds) : null)
      setShowSecret(next.secret)
      setPlannedOnly(next.planned)
      setTrackHikeId(next.hike)
      selectStop(next.stop)
    })
    return () => {
      cancelled = true
    }
  }, [location.key, selectStop])

  const openStop = useCallback(
    (id: string) => {
      navigate(`/stop/${id}`)
    },
    [navigate],
  )

  const openHike = useCallback(
    (id: string) => {
      navigate(`/hike/${id}`)
    },
    [navigate],
  )

  const openDining = useCallback(() => {
    navigate('/dining')
  }, [navigate])

  // Fly the camera to one region's frame. Animated, unlike the fitBounds
  // calls the filters make: this one is the reader's own tap, and the motion
  // is what tells them where the map went.
  const jumpTo = useCallback((region: Region | 'park') => {
    const map = mapRef.current
    if (!map) return
    popupRef.current?.remove()
    if (region === 'park') {
      map.fitBounds([[-119.93, 37.45], [-119.05, 38.2]], { padding: 24, maxZoom: 10 })
      return
    }
    map.fitBounds(REGION_BOUNDS[region], { padding: 56, maxZoom: 13 })
  }, [])

  // "Trail on map" in a trailhead popup: draw that hike's track overlay (the
  // ?hike= pipeline) and close the popup so the fitted track is unobstructed.
  const showTrack = useCallback((id: string) => {
    setTrackHikeId(id)
    popupRef.current?.remove()
  }, [])

  // Map init — runs once per mount.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(),
      center: [-119.55, 37.85],
      zoom: 9,
      maxZoom: 16,
      // Padded park bbox: keeps panning on the cached tile set.
      maxBounds: [
        [-120.8, 36.8],
        [-118.2, 38.8],
      ],
      // North-up 2D only: with the compass hidden, an accidental two-finger
      // rotate or pitch would leave the topo tilted with no way to reset.
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      attributionControl: { compact: true },
    })
    map.touchZoomRotate.disableRotation()
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left')

    // Locate-me. GPS itself needs no signal, so this works in airplane mode.
    // Only offered where it can work (https; localhost counts as secure), and
    // never auto-triggered: the first fix waits for an explicit tap, which is
    // also what makes iOS raise its permission prompt at a sensible moment.
    if (window.isSecureContext && 'geolocation' in navigator) {
      const geolocate = new maplibregl.GeolocateControl({
        // A timeout is not optional here: the default is Infinity, and a
        // high-accuracy fix under granite walls can never arrive, leaving the
        // control spinning with no error to report. maximumAge accepts a
        // half-minute-old fix, which is plenty at driving and walking speed.
        positionOptions: { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
        trackUserLocation: true,
        fitBoundsOptions: { maxZoom: 14 },
      })
      map.addControl(geolocate, 'top-left')
      const onFix = (pos: GeolocationPosition, outside: boolean) => {
        const coord: [number, number] = [pos.coords.longitude, pos.coords.latitude]
        userPosRef.current = coord
        setUserPos(coord)
        setOutOfPark(outside)
        setGeoDenied(false)
        setGeoNote(null)
      }
      geolocate.on('geolocate', (pos) => onFix(pos, false))
      // Fired instead of 'geolocate' when the fix falls outside maxBounds,
      // i.e. the reader is planning from home. Distances still render.
      geolocate.on('outofmaxbounds', (pos) => onFix(pos, true))
      geolocate.on('error', (err) => {
        if (err.code === 1) {
          setGeoDenied(true)
          setGeoNote(null)
          return
        }
        // Code 2 (position unavailable) and code 3 (timeout). Both are a
        // failed fix, not a settings problem, so they get their own note
        // rather than sending the reader off to check permissions.
        setGeoNote(
          'Could not get a GPS fix here. Try again with a clearer view of the sky.',
        )
      })
    }

    mapRef.current = map
    // closeOnClick is off because it only listens for real DOM clicks, which
    // touch taps on the canvas never synthesize; the map 'click' handler
    // below closes the popup on both mouse and touch instead.
    popupRef.current = new maplibregl.Popup({
      maxWidth: '300px',
      offset: 30,
      closeOnClick: false,
    })
    map.on('click', (e) => {
      // MapLibre delivers this after the selection effect has opened the
      // popup, so a tap that lands on a pin must not close it. Empty-map
      // taps close it, matching the closeOnClick behavior this replaces.
      const target = e.originalEvent.target
      if (target instanceof Element && target.closest('.map-pin')) return
      popupRef.current?.remove()
    })
    map.on('load', () => {
      setMapReady(true)
      setMapFailed(false)
    })
    const readBand = () => setZoomBand(map.getZoom() >= MINOR_PIN_MIN_ZOOM ? 'near' : 'far')
    map.on('zoom', readBand)
    readBand()
    // MapLibre fires 'error' for every failed tile fetch, which is routine
    // when semi-offline — only a failure BEFORE 'load' means a blank map
    // (style/glyph/initial fetch failure) worth telling the user about.
    map.on('error', () => {
      if (!map.loaded()) setMapFailed(true)
    })

    return () => {
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Marker reconciliation — runs whenever the visible set changes.
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    for (const id of Object.keys(markersRef.current)) {
      markersRef.current[id].remove()
    }
    markersRef.current = {}
    // Close any open popup: its marker was just removed, so a floating popup
    // (with a live "Add to trip") would otherwise hang over the filtered map.
    popupRef.current?.remove()

    if (visibleStops.length === 0) return

    const bounds = new maplibregl.LngLatBounds()
    for (const stop of visibleStops) {
      if (!stop.coord) continue
      const [lng, lat] = stop.coord
      bounds.extend([lng, lat])

      const el = buildPinElement(stop.kind, stop.title, isSecretGuideEntry(stop))
      const activate = () => selectStop(stop.id)
      el.addEventListener('click', (e) => {
        // Don't let the click reach the map canvas: the shared popup is
        // closeOnClick, and MapLibre delivers the map's click after the
        // selection effect has opened the popup, closing it in the same
        // frame. Deep links and the sidebar never hit the canvas, which is
        // why only pin taps were affected.
        e.stopPropagation()
        activate()
      })
      el.addEventListener('keydown', pinKeydownHandler(activate))
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map)
      markersRef.current[stop.id] = marker
    }

    // Not advanced on the empty early-return above, so the first non-empty
    // render after a reset still fits when the itinerary changed meanwhile.
    const fitKey = itineraryRegions && selectedItinerary ? selectedItinerary : 'all'
    if (lastFitKeyRef.current !== fitKey) {
      map.fitBounds(bounds, { padding: 48, maxZoom: 12, animate: false })
      lastFitKeyRef.current = fitKey
    }
  }, [visibleStops, mapReady, selectStop, itineraryRegions, selectedItinerary])

  // Badge planned stops without rebuilding markers: a rebuild would close
  // the popup in the same tap that pressed its "Add to trip" button.
  // Declared after the reconciliation effect so it runs after every rebuild;
  // visibleStops in the deps re-applies badges to fresh marker elements.
  useEffect(() => {
    if (!mapReady) return
    for (const [id, marker] of Object.entries(markersRef.current)) {
      marker.getElement().classList.toggle('map-pin--planned', plannedStopIds.has(id))
    }
  }, [plannedStopIds, visibleStops, mapReady])

  // Amenity marker reconciliation. Amenities stay outside the stop pipeline:
  // no selection state, no ?stop= URL param, and no fitBounds contribution,
  // so a far-flung campground never stretches the auto-fit frame. Their pins
  // open the shared popup directly.
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    for (const id of Object.keys(amenityMarkersRef.current)) {
      amenityMarkersRef.current[id].remove()
    }
    amenityMarkersRef.current = {}

    for (const amenity of visibleAmenities) {
      const el = buildPinElement(amenity.kind, amenity.name, false, amenity.glyph)
      const activate = () => {
        // Clear any stop selection so ?stop= doesn't keep pointing at a stop
        // whose popup this one just replaced.
        selectStop(null)
        popupRef.current
          ?.setLngLat(amenity.coord)
          .setDOMContent(buildAmenityPopupContent(amenity))
          .addTo(map)
      }
      el.addEventListener('click', (e) => {
        // Same canvas-click race as the stop pins above.
        e.stopPropagation()
        activate()
      })
      el.addEventListener('keydown', pinKeydownHandler(activate))
      amenityMarkersRef.current[amenity.id] = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(amenity.coord)
        .addTo(map)
    }
  }, [visibleAmenities, mapReady, selectStop])

  // Trailhead marker reconciliation. Same shape as the amenity pipeline: no
  // ?stop= selection state and no fitBounds contribution; the pins open the
  // shared popup with the trail data card.
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    for (const id of Object.keys(hikeMarkersRef.current)) {
      hikeMarkersRef.current[id].remove()
    }
    hikeMarkersRef.current = {}

    for (const group of visibleTrailheads) {
      // One pin can serve several routes, so it is named for the trailhead
      // and how many start there, matching what the popup says.
      const el = buildPinElement(
        'hike',
        group.hikes.length === 1
          ? group.hikes[0].title
          : `${group.hikes[0].trailhead}, ${group.hikes.length} hikes`,
      )
      const activate = () => {
        // Clear any stop selection so ?stop= doesn't keep pointing at a stop
        // whose popup this one just replaced.
        selectStop(null)
        popupRef.current
          ?.setLngLat(group.coord)
          .setDOMContent(
            buildHikePopupContent(group, { onOpenHike: openHike, onShowTrack: showTrack }, userPosRef.current),
          )
          .addTo(map)
      }
      el.addEventListener('click', (e) => {
        // Same canvas-click race as the stop pins above.
        e.stopPropagation()
        activate()
      })
      el.addEventListener('keydown', pinKeydownHandler(activate))
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
        // Most trailhead coords reuse a stop's verified pin; nudge those a
        // few pixels so both teardrops stay tappable. The tip lands a couple
        // of meters off at street zoom, which is inside the coord tolerance.
        offset: OCCUPIED_COORD_KEYS.has(group.coord.join(',')) ? [14, -4] : [0, 0],
      })
        .setLngLat(group.coord)
        .addTo(map)
      hikeMarkersRef.current[group.id] = marker
    }
  }, [visibleTrailheads, mapReady, selectStop, openHike, showTrack])

  // Meal pin reconciliation, the amenity pipeline again: no selection state,
  // no fitBounds contribution.
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return
    for (const id of Object.keys(mealMarkersRef.current)) mealMarkersRef.current[id].remove()
    mealMarkersRef.current = {}
    for (const group of visibleMeals) {
      const el = buildPinElement(
        'meal',
        group.venues.length === 1 ? group.venues[0].name : `${group.place}, ${group.venues.length} places to eat`,
      )
      const activate = () => {
        selectStop(null)
        popupRef.current
          ?.setLngLat(group.coord)
          .setDOMContent(buildMealPopupContent(group, openDining))
          .addTo(map)
      }
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        activate()
      })
      el.addEventListener('keydown', pinKeydownHandler(activate))
      mealMarkersRef.current[group.id] = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
        offset: OCCUPIED_COORD_KEYS.has(group.coord.join(',')) ? [-14, -4] : [0, 0],
      })
        .setLngLat(group.coord)
        .addTo(map)
    }
  }, [visibleMeals, mapReady, selectStop, openDining])

  // Same badge-without-rebuild deal as the stop pins: a trailhead pin gets
  // the checkmark when any hike starting there is in the plan.
  useEffect(() => {
    if (!mapReady) return
    for (const group of visibleTrailheads) {
      hikeMarkersRef.current[group.id]
        ?.getElement()
        .classList.toggle(
          'map-pin--planned',
          group.hikes.some((h) => plannedHikeIds.has(h.id)),
        )
    }
  }, [plannedHikeIds, visibleTrailheads, mapReady])

  // Hike track overlay — draw the loaded track as a casing + line pair above
  // the topo, fit the camera to it once per hike, and mark the trailhead.
  const trackFitRef = useRef<string | null>(null)
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return
    if (trackState.status !== 'ready' || !trackHikeId) {
      trackFitRef.current = null
      return
    }
    // A lost WebGL context (routine on iOS under memory pressure) nulls
    // map.style until the browser restores it; every style call below would
    // throw into the error boundary. Skip this pass — the restore re-renders.
    if (!map.style) return

    const geojson = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: trackState.track.line },
    }
    map.addSource('hike-track', { type: 'geojson', data: geojson })
    // Casing under the line keeps it legible over both forest greens and
    // granite tans on the topo.
    map.addLayer({
      id: 'hike-track-casing',
      type: 'line',
      source: 'hike-track',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#f5efe0', 'line-width': 6, 'line-opacity': 0.9 },
    })
    map.addLayer({
      id: 'hike-track-line',
      type: 'line',
      source: 'hike-track',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#7a2a10', 'line-width': 3 },
    })

    const start = trackState.track.line[0]
    const startEl = document.createElement('div')
    startEl.className = 'map-track-start'
    startEl.setAttribute('aria-label', 'Trailhead')
    const startMarker = new maplibregl.Marker({ element: startEl })
      .setLngLat(start as [number, number])
      .addTo(map)

    if (trackFitRef.current !== trackHikeId) {
      const bounds = new maplibregl.LngLatBounds()
      for (const c of trackState.track.line) bounds.extend(c as [number, number])
      map.fitBounds(bounds, { padding: 56, animate: false })
      trackFitRef.current = trackHikeId
    }

    return () => {
      startMarker.remove()
      // On unmount React runs cleanups in declaration order, so the map-init
      // effect's map.remove() (which deletes map.style) runs before this one;
      // a lost WebGL context also nulls map.style. Either way getLayer itself
      // would throw (this.style.getLayer), taking down the whole app through
      // the error boundary — leaving the map with a trail up crashed on every
      // navigation until this bailout.
      if (!map.style) return
      if (map.getLayer('hike-track-line')) map.removeLayer('hike-track-line')
      if (map.getLayer('hike-track-casing')) map.removeLayer('hike-track-casing')
      if (map.getSource('hike-track')) map.removeSource('hike-track')
    }
  }, [trackState, trackHikeId, mapReady])

  // Selection effect — pan/zoom + open popup when the selection changes.
  useEffect(() => {
    if (!mapReady || !selection.id) return
    const map = mapRef.current
    const marker = markersRef.current[selection.id]
    const popup = popupRef.current
    const stop = getStopById(selection.id)
    if (!map || !popup) return
    if (!marker || !stop) {
      // Unknown id, no coord, or filtered out by the active itinerary: clear
      // the selection (and with it the ?stop= in the URL) instead of leaving
      // a stale deep link pointing at nothing. Loop-safe: this effect bails
      // on a null id.
      selectStop(null)
      return
    }

    const lngLat = marker.getLngLat()
    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 13) })
    popup
      .setLngLat(lngLat)
      .setDOMContent(buildPopupContent(stop, openStop, userPosRef.current))
      .addTo(map)
  }, [selection, mapReady, visibleStops, openStop, selectStop])

  const handleTab = useCallback((next: Tab) => {
    setTab(next)
  }, [])

  const handleSelectItinerary = useCallback(
    (key: ItineraryKey | null) => {
      setSelectedItinerary(key)
      selectStop(null)
    },
    [selectStop],
  )

  const handleSelectStop = useCallback(
    (id: string) => {
      selectStop(id)
    },
    [selectStop],
  )

  // Counts for the itinerary buttons, derived live. "All" honors the Secret
  // Guide toggle the same way kindCounts does — with it off, the number must
  // match the pins actually on the map.
  const counts = useMemo(() => {
    const out = {
      all: showSecret
        ? mappableStops.length
        : mappableStops.filter((s) => !isSecretGuideEntry(s)).length,
    } as Record<'all' | ItineraryKey, number>
    for (const key of ITINERARY_KEYS) {
      const regions = new Set(ITINERARIES[key].days.flatMap((d) => d.regions))
      out[key] = mappableStops.filter(
        (s) => 'region' in s && regions.has(s.region) && s.collection !== 'hidden',
      ).length
    }
    return out
  }, [mappableStops, showSecret])

  // The five closest visible stops, for the "Near you" list. Straight-line
  // distance; a coord is guaranteed upstream. Derived from visibleStops (not
  // mappableStops) for the same reason as browseGroups below: a row pointing
  // at a filtered-out marker would select nothing and silently close any open
  // popup.
  const nearbyStops = useMemo(() => {
    if (!userPos) return []
    return visibleStops
      .map((stop) => ({ stop, miles: haversineMiles(userPos, stop.coord!) }))
      .sort((a, b) => a.miles - b.miles)
      .slice(0, 5)
  }, [visibleStops, userPos])

  // The points pane exists only for "Near you", so it renders only when there
  // is something to say: a location fix, or the note explaining there isn't
  // one. Otherwise the map keeps the whole stage.
  const showPointsPane = nearbyStops.length > 0 || (!userPos && (geoDenied || !!geoNote))

  return (
    <GatedChrome>
      <div className="map-page">
        <div className="map-online-notice" role="note">
          {mapFailed && !mapReady ? (
            <>
              The map couldn't load. Check your connection and reload. GPS
              points are still on each stop's page.
            </>
          ) : mapDownloaded ? (
            <>Map downloaded. Works offline, even in airplane mode, down to trailhead scale.</>
          ) : (
            <>
              Viewing online.{' '}
              <Link className="map-online-notice__link" to="/account">
                Download the map for offline →
              </Link>
            </>
          )}
        </div>

        {/* Pane switchers, not navigation: buttons with a pressed state (the
            pattern ViewToggle uses), so AT doesn't announce a page change
            that never happens. */}
        <div className="map-tabbar" role="group" aria-label="Map view">
          <button
            type="button"
            className="map-tabbar__tab"
            aria-pressed={tab === 'points'}
            onClick={() => handleTab('points')}
          >
            GPS points
          </button>
          <button
            type="button"
            className="map-tabbar__tab"
            aria-pressed={tab === 'itineraries'}
            onClick={() => handleTab('itineraries')}
          >
            Itineraries
          </button>
          <button
            type="button"
            className="map-tabbar__tab"
            aria-pressed={tab === 'info'}
            onClick={() => handleTab('info')}
          >
            Information
          </button>
        </div>

        <div
          className={`map-filterbar${tab === 'info' ? ' map-filterbar--hidden' : ''}`}
          role="group"
          aria-label="Filter pins"
        >
          <div className="map-filterbar__row">
            <ChipButton
              variant="filter"
              pressed={kindFilter === null}
              aria-label={`All kinds, ${allCount} pins`}
              onClick={clearKinds}
            >
              All <span className="map-filterbar__count">{allCount}</span>
            </ChipButton>
            {presentKinds.map((kind) => {
              const { color, label } = getKindStyle(kind)
              return (
                <ChipButton
                  key={kind}
                  variant="filter"
                  pressed={kindFilter?.has(kind) ?? false}
                  aria-label={`${label}, ${kindCounts[kind]} pins`}
                  onClick={() => toggleKind(kind)}
                >
                  <KindMark kind={kind} />
                  <span style={{ color: kindFilter?.has(kind) ? undefined : color }} className="map-filterbar__label">{label}</span>{' '}
                  <span className="map-filterbar__count">{kindCounts[kind]}</span>
                </ChipButton>
              )
            })}
            {tab !== 'itineraries' && (
              <ChipButton
                variant="filter"
                className="map-filterbar__secret"
                pressed={showSecret}
                aria-label={`Secret Guide entries, ${secretCount} pins`}
                onClick={() => setShowSecret((v) => !v)}
              >
                <span className="map-filterbar__dot map-filterbar__dot--secret" aria-hidden />
                Secret Guide <span className="map-filterbar__count">{secretCount}</span>
              </ChipButton>
            )}
            {plannedCount > 0 && (
              <ChipButton
                variant="filter"
                pressed={plannedOnly}
                aria-label={`My trip, ${plannedCount} pins`}
                onClick={() => setPlannedOnly((v) => !v)}
              >
                My trip <span className="map-filterbar__count">{plannedCount}</span>
              </ChipButton>
            )}
          </div>
          <div className="map-jump" role="group" aria-label="Go to a region">
            <span className="map-jump__label">Go to</span>
            {REGIONS.map((r) => (
              <button key={r.id} type="button" className="map-jump__btn" onClick={() => jumpTo(r.id)}>
                {REGION_JUMP_LABEL[r.id]}
              </button>
            ))}
            <button type="button" className="map-jump__btn" onClick={() => jumpTo('park')}>
              Whole park
            </button>
          </div>
        </div>

        {trackHikeId && trackHike && (
          <div className="map-track-banner" role="status">
            <span className="map-track-banner__swatch" aria-hidden />
            <span className="map-track-banner__text">
              {trackState.status === 'error'
                ? `The ${trackHike.title} track isn't saved on this device yet.`
                : `Trail: ${trackHike.title}`}
            </span>
            <Link className="map-track-banner__link" to={`/hike/${trackHikeId}`}>
              Details
            </Link>
            <button
              type="button"
              className="map-track-banner__clear"
              aria-label="Hide this trail"
              onClick={() => setTrackHikeId(null)}
            >
              ✕
            </button>
          </div>
        )}

        <div className="map-page__stage">
          <div
            ref={containerRef}
            className="map-page__map"
            data-zoom-band={zoomBand}
            data-kinds={kindFilter ? 'some' : 'all'}
          />

          {mapReady && zoomBand === 'far' && !kindFilter && tab !== 'info' && (
            <p className="map-zoom-hint" role="note">
              Zoom in for {MINOR_KINDS.map((k) => `${getKindStyle(k).label.toLowerCase()}s`).join(', ')}, or tap a chip.
            </p>
          )}

          {mapReady && visibleStops.length === 0 && visibleAmenities.length === 0 && visibleTrailheads.length === 0 && visibleMeals.length === 0 && (
            <div className="map-page__empty" role="status">
              <p>No pins match these filters.</p>
              <button type="button" className="map-popup__btn" onClick={resetFilters}>
                Show all pins
              </button>
            </div>
          )}

          {showPointsPane && (
            <aside
              className={`map-pane map-pane--points${pointsExpanded ? ' map-pane--points-open' : ''}`}
              aria-hidden={tab !== 'points'}
            >
              <button
                type="button"
                className="map-pane__handle"
                aria-expanded={pointsExpanded}
                onClick={() => setPointsExpanded((v) => !v)}
              >
                <span>Near you</span>
                <span className="map-pane__handle-caret" aria-hidden>
                  {pointsExpanded ? '▾' : '▴'}
                </span>
              </button>
              <div className="map-pane__scroll">
                {geoDenied && !userPos && (
                  <p className="map-nearby__note">
                    Location is off for this app. Enable it in your phone's
                    settings to see distances to stops.
                  </p>
                )}
                {!geoDenied && geoNote && !userPos && (
                  <p className="map-nearby__note">{geoNote}</p>
                )}
                {nearbyStops.length > 0 && (
                  <div className="map-nearby">
                    <h3 className="map-pane__title map-pane__title--near">Near you</h3>
                    {outOfPark && (
                      <p className="map-nearby__note">
                        You're outside the park map area; distances are from your
                        current location.
                      </p>
                    )}
                    <ul className="map-nearby__list">
                      {nearbyStops.map(({ stop, miles }) => {
                        const { color, label } = getKindStyle(stop.kind)
                        return (
                          <li key={stop.id}>
                            <button
                              type="button"
                              className={`map-stop${stop.id === selectedStopId ? ' map-stop--selected' : ''}`}
                              onClick={() => handleSelectStop(stop.id)}
                            >
                              <span className="map-stop__name">{stop.title}</span>
                              <span className="map-stop__kind" style={{ color }}>
                                {label} · {formatMiles(miles)}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          )}

          <aside
            className="map-pane map-pane--itineraries"
            aria-hidden={tab !== 'itineraries'}
          >
            <div className="map-sidebar__section">
              <h3 className="map-sidebar__section-label">Itineraries</h3>
              <ul className="map-sidebar__itineraries">
                <li>
                  <ItineraryButton
                    photos={REGIONS.map((r) => r.photo)}
                    label="All locations"
                    subtitle="Every region"
                    count={counts.all}
                    selected={selectedItinerary === null}
                    onClick={() => handleSelectItinerary(null)}
                  />
                </li>
                {ITINERARY_KEYS.map((key) => (
                  <li key={key}>
                    <ItineraryButton
                      photos={getItineraryDayPhotos(ITINERARIES[key])}
                      label={ITINERARIES[key].label}
                      subtitle={ITINERARIES[key].subtitle}
                      count={counts[key]}
                      selected={selectedItinerary === key}
                      onClick={() => handleSelectItinerary(key)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {selectedItinerary && (
              <div className="map-sidebar__section">
                <h3 className="map-sidebar__section-label">Day by day</h3>
                <div className="map-sidebar__days">
                  {ITINERARIES[selectedItinerary].days.map((day) => {
                    // visibleStops already excludes hidden entries under an
                    // active itinerary and applies the kind filter, so the
                    // list never points at a missing marker.
                    const stopsInDay = visibleStops.filter(
                      (s) => 'region' in s && day.regions.includes(s.region),
                    )
                    return (
                      <section key={day.name}>
                        <h4 className="map-day__name">
                          <span>{day.name}</span>
                          <span className="map-day__count">{stopsInDay.length}</span>
                        </h4>
                        <ul className="map-day__stops">
                          {stopsInDay.map((s) => {
                            const isSelected = s.id === selectedStopId
                            const { color, label } = getKindStyle(s.kind)
                            return (
                              <li key={s.id}>
                                <button
                                  type="button"
                                  className={`map-stop${isSelected ? ' map-stop--selected' : ''}`}
                                  onClick={() => handleSelectStop(s.id)}
                                >
                                  <span className="map-stop__name">{s.title}</span>
                                  <span className="map-stop__kind" style={{ color }}>
                                    {label}
                                  </span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </section>
                    )
                  })}
                </div>
              </div>
            )}
          </aside>

          <section className="map-pane map-pane--info" aria-hidden={tab !== 'info'}>
            <InfoPane presentKinds={presentKinds} mapDownloaded={mapDownloaded} />
          </section>
        </div>
      </div>
    </GatedChrome>
  )
}

type ItineraryButtonPhoto = { src: string }

type ItineraryButtonProps = {
  photos: ItineraryButtonPhoto[]
  label: string
  subtitle: string
  count: number
  selected: boolean
  onClick: () => void
}

function ItineraryButton({ photos, label, subtitle, count, selected, onClick }: ItineraryButtonProps) {
  return (
    <button
      type="button"
      className={`map-itinerary${selected ? ' map-itinerary--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="map-itinerary__text">
        <span className="map-itinerary__label">{label}</span>
        <span className="map-itinerary__sub">{subtitle}</span>
        <span className="map-itinerary__count">{count} stops</span>
      </span>
      {/* One thumbnail per day (region photos), decorative. */}
      <span className="map-itinerary__photos" aria-hidden="true">
        {photos.map((photo, i) => (
          <span className="map-itinerary__media" key={i}>
            <ResponsivePhoto src={photo.src} alt="" width={400} height={400} sizes="36px" />
          </span>
        ))}
      </span>
    </button>
  )
}

function InfoPane({
  presentKinds,
  mapDownloaded,
}: {
  presentKinds: MapPinKind[]
  mapDownloaded: boolean
}) {
  return (
    <div className="map-info">
      <h1>How the map works offline</h1>
      <p className="lede">
        This map is built to work with zero bars. Download it once and the
        topo tiles live on your device; the pins are part of the app itself.
      </p>

      <h2>Before you leave wifi</h2>
      <ol>
        <li>
          Open <Link to="/account">Account → Offline</Link> and download the
          <strong> offline park map</strong> (about 20 MB) and the photo packs
          for the regions you're visiting.
        </li>
        <li>
          {mapDownloaded
            ? 'Done on this device. The map pans and zooms in airplane mode.'
            : 'Once downloaded, this map pans and zooms in airplane mode.'}
        </li>
        <li>
          For turn-by-turn <em>driving</em> directions, also download an
          offline area in the Google Maps app: search <em>Yosemite National
          Park</em>, tap your profile photo → <strong>Offline maps</strong> →
          <strong> Select your own map</strong>, frame the park, download.
        </li>
      </ol>

      <h2>In the park</h2>
      <ul>
        <li>
          Open the <strong>GPS points</strong> tab. Every pin carries the
          mark of what it is, an eye for a viewpoint, a tent for a
          campground, a numbered disc for a shuttle stop (see legend below).
        </li>
        <li>
          Use the filter chips above the map to narrow pins by kind, or hide
          the gold-outlined Secret Guide entries while you plan. The
          <strong> Go to</strong> row under the chips flies the map to one
          region.
        </li>
        <li>
          Parking, shuttle stops, picnic areas and services are street-scale
          facts, so on the whole-park view they stay hidden until you zoom in
          to about the size of the Valley. Tap their chip to see them at any
          zoom.
        </li>
        <li>
          Tap a pin. The popup has <strong>Open stop →</strong> (the full
          write-up in this guide) and <strong>Directions →</strong>.
        </li>
        <li>
          A moss checkmark marks a stop already in your trip plan.
        </li>
        <li>
          Parking, campground, entrance, visitor-center, shuttle-stop, picnic
          and services pins are navigation aids: a short note, the published
          hours where NPS publishes them, and a Directions button, no stop
          write-up. The Valley shuttle stops carry the number NPS paints on
          the sign; the shuttle is free and runs 7 a.m. to 10 p.m.
        </li>
        <li>
          A landmark pin names a thing you look at, Cathedral Rocks, Royal
          Arches, Nevada Fall, so the wall in front of you has a name. It has
          no Directions button, because there is nowhere to drive to.
        </li>
        <li>
          Meal pins come from the <Link to="/dining">dining directory</Link>:
          one pin per place, listing every venue there with its price and
          hours.
        </li>
        <li>
          Pins with a small peak glyph are day-hike trailheads. Tap one for
          each trail's numbers (distance, climbing, difficulty, time), then
          open the full trail page, add the hike to your trip, or draw its
          GPS track over the topo. Trailheads shared by several routes list
          them all in one popup.
        </li>
        <li>
          Directions deep-links into the native Google Maps app, which routes
          you to the turnout using the offline area you downloaded. The
          handoff works without signal if that area is on your phone.
        </li>
      </ul>

      <h2>Itineraries tab</h2>
      <p>
        Filter the pin set to one ready-made plan: trip lengths, first
        visit, young kids, easy pace, and the rest. Use the day-by-day
        list to walk through its stops in order; the map pans to each
        selection.
      </p>

      <h2>Legend</h2>
      <ul className="map-legend" style={{ marginTop: 8 }}>
        {presentKinds.map((kind) => {
          const { label } = KIND_STYLES[kind]
          return (
            <li key={kind} className="map-legend__item">
              <KindMark kind={kind} />
              {label}
            </li>
          )
        })}
        <li className="map-legend__item">
          <span
            className="map-legend__dot"
            style={{ background: 'transparent', border: `2px solid ${HIDDEN_PIN_STROKE}` }}
            aria-hidden
          />
          Gold outline: Secret Guide
        </li>
      </ul>
      <p>
        A gold outline marks a <Link to="/secret-guide">Secret Guide</Link> entry:
        the quiet vistas, hidden trails, parking moves, camping, and after-dark
        spots included with your purchase. They stay out of the itinerary
        presets; add them to your trip from the pin or the stop page.
      </p>

      <h2>The fine print</h2>
      <ul>
        <li>
          This map shows where things are; it does not calculate driving
          routes. Routing happens in Google Maps via the Directions button.
        </li>
        <li>
          Most pin coordinates are verified against NPS and USGS sources; the
          entrance, visitor-center, shuttle-stop, picnic and services pins are
          quoted from the National Park Service's own place records. A few
          unsigned pullouts and off-trail spots are still flagged for a
          ground check; for those, trust the turnout described in the stop
          page over the precise pin.
        </li>
        <li>Map tiles: Esri, USGS. © OpenStreetMap contributors.</li>
      </ul>
    </div>
  )
}
