// =============================================================================
// /map route — three-tab map experience for the Field Guide PWA.
//
// Tabs: GPS points / Itineraries / Information.
// The MapLibre instance is created once on mount and lives inside a div that
// is never unmounted (panes overlay it via absolute positioning + visibility
// toggling). State is reflected in the URL:
//   /map?tab=points|itineraries|info&itinerary=1day|2day|3day&stop=<id>
//
// The basemap is a self-hosted vector map on 3D terrain (map/style.ts: the
// Worker's /vt and /dem tiles, first-party glyphs), served cache-first by the
// service worker, so once the overview and an area are downloaded (the map's
// Offline areas, or Account → Offline) that area works in airplane mode.
// Turn-by-turn routing stays a deeplink into the native Google Maps app.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import GatedChrome from '../components/GatedChrome'
import ResponsivePhoto from '../components/ResponsivePhoto'
import Button from '../components/ui/Button'
import { ChipButton } from '../components/ui/Chip'
import { AMENITIES, DINING, DINING_KIND_LABEL, HIKES, REGIONS, SECRET_SPOTS, stops as allStops, getItineraryDayPhotos, getStopById, isSecretGuideEntry, type AmenityT, type DiningVenueT, type GuideStopT, type HikeT, type Region } from '../content'
import { DIFFICULTY_LABEL, formatTime } from '../content/labels'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import { HIDDEN_PIN_STROKE, KIND_STYLES, buildPinElement, directionsUrl, getKindStyle, kindMarkSvg, type MapPinKind } from '../map/kinds'
import { getHikeById } from '../content'
import { hasTrack } from '../trails/track'
import { useTrack } from '../trails/useTrack'
import { announceTripAdd } from '../trip/addFeedback'
import {
  addHikeToPlan,
  addPlaceToPlan,
  addStopToPlan,
  isHikePlanned,
  isPlacePlanned,
  isStopPlanned,
  moveItemInDay,
  setItemTravelMode,
  useTripPlan,
} from '../trip/useTripPlan'
import { amenityPlaceId, diningPlaceId } from '../trip/places'
import { MAP_ATTRIBUTION } from '../map/attribution'
import { TERRAIN_SPEC, buildMapStyle } from '../map/style'
import { DEFAULT_PITCH, FOCUS_PITCH, FOCUS_ZOOM, HOME_CAMERA, MAX_PITCH, PAN_BUFFER_DEG, buildTheme } from '../map/theme'
import { OFFLINE_REGIONS, type OfflineRegion } from '../map/regions'
import { TILESET } from '../map/tiles.generated'
import { isPackCompleted } from '../offline/useDownloads'
import { MAP_OVERVIEW_PACK_ID, MAP_PACK_IDS, mapRegionPackId } from '../offline/manifest'
import DownloadManager from '../components/DownloadManager'
import TripPanel from '../map/TripPanel'
import MapCard, { type MapCardSelection } from '../map/MapCard'
import MapSearch from '../map/MapSearch'
import type { MapHit } from '../map/mapSearch'
import { programPoints, type ProgramPoint } from '../map/programPoints'
import { PIN_H, PIN_W, declutter, depthScale, type DeclutterItem } from '../map/declutter'
import { LENGTH_CHOICES, TRAIL_LINE_LAYER, ensureTrailLayers, loadTrails, recolorTrails, setTrailFilter, type TrailFilter } from '../map/trailsLayer'
import { TRAIL_LABEL, trailColors } from '../map/theme'
import { readTripDates, usePrograms } from '../programs/usePrograms'
import { useRoadReader } from '../alerts/roadState'
import { daysInWindow, seedItinerary, shortDay } from '../trip/seedItinerary'
import { useArmToConfirm } from '../utils/useArmToConfirm'
import { todayIso } from '../utils/date'
import { RoadGraph, type Pt, type RoadGraphFile } from '../map/roadGraph'
import { ROADS_URL } from '../map/mapData.generated'
import { buildTripDays, dayColor, tripLegsGeojson, tripStopsGeojson, type DayEnd, type TripDay, type TripLeg, type TripStop } from '../map/tripLayer'
import { PROGRAM_POINT_ICON, TRIP_KIND_LABEL, addTripIcons } from '../map/tripIcons'
import { TRIP_LEG_LAYERS, TRIP_PIN_LAYER, ensureTripLayers, setTripData, setTripDay, setTripFocus, setTripVisible } from '../map/tripMapLayers'
import { DAY_FIT_PITCH, accentColor, dayColors, tripCasing } from '../map/theme'
import { loadTrack } from '../trails/useTrack'
import type { TravelModeT } from '../trip/schema'
import { formatMiles, haversineMiles } from '../utils/geo'
import { popupPhotoUrl } from '../utils/photo'
import { LOT_STATUS_LABEL, lotForAmenity } from '../parking/lotMatch'
import type { ParkingLotT } from '../parking/schema'
import { HIDE_AFTER_MS as PARKING_HIDE_MS } from '../parking/staleness'
import { useParking } from '../parking/useParking'
import { compactStamp } from '../utils/relativeStamp'
import { useOnline } from '../utils/useOnline'
import './Map.css'
import { useDocumentTitle } from '../lib/documentTitle'

type Tab = 'points' | 'itineraries' | 'trip' | 'info'

function isTab(value: string | null | undefined): value is Tab {
  return value === 'points' || value === 'itineraries' || value === 'trip' || value === 'info'
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

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
  day: string | null // the trip day shown alone on the My trip tab (?day=)
  trail: string | null // the trail whose card is open (?trail=)
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
    day: DAY_RE.test(params.get('day') ?? '') ? params.get('day') : null,
    trail: params.get('trail') && hasTrack(params.get('trail')!) ? params.get('trail') : null,
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
  if (next.tab === 'trip' && next.day) params.set('day', next.day)
  if (next.trail) params.set('trail', next.trail)
  // The camera rides along untouched: it is written on its own schedule (on
  // moveend, see CAMERA below), and a state write must not drop it.
  const cam = new URLSearchParams(window.location.search).get('cam')
  if (cam) params.set('cam', cam)
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

// The live lot status for a parking pin, as a reading: the park's own word,
// the capacity it was read against, and the source with its age. Only a
// known status is printed; a lot the feed says nothing about gets no line,
// never "unknown", and a reading past the staleness ceiling is dropped.
type LotReading = { lot: ParkingLotT; fetchedAt: string | null }

function lotStatusLine(reading: LotReading | null): string | null {
  if (!reading || reading.lot.status === 'unknown') return null
  const { lot, fetchedAt } = reading
  const word = lot.statusText ?? LOT_STATUS_LABEL[lot.status]
  const capacity = lot.capacity ? ` · ${lot.capacity} spaces` : ''
  const age = fetchedAt ? compactStamp(fetchedAt, Date.now()) : null
  return `Now: ${word}${capacity} · NPS${age ? `, ${age}` : ''}`
}

// Amenity popup: name, kind chip, note (+ season line), Directions only.
// Amenities (parking lots, campgrounds) are map-only pins, not Stops, so
// there is no "Open stop" or "Add to trip". A parking pin also prints its
// live lot status when the feed has one (see lotStatusLine).
// "Add to trip" for a place the guide carries but does not treat as a stop: a
// parking lot, campground, lodge, visitor center or restaurant. It becomes a
// custom entry linked to the record (trip/places.ts), so its name and pin
// stay the record's, and it lands on the plan's first day like a stop does.
function placeTripButton(placeId: string, title: string, label = 'Add to trip'): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'map-popup__btn'
  btn.textContent = isPlacePlanned(placeId) ? 'In trip ✓' : label
  btn.addEventListener('click', () => {
    if (!isPlacePlanned(placeId)) {
      addPlaceToPlan(placeId, title)
      announceTripAdd(title)
    }
    btn.textContent = 'In trip ✓'
  })
  return btn
}

function buildAmenityPopupContent(amenity: AmenityT, lot: LotReading | null = null): HTMLElement {
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

  const status = amenity.kind === 'parking' ? lotStatusLine(lot) : null
  if (status) {
    const line = document.createElement('p')
    line.className = 'map-popup__stats'
    line.textContent = status
    root.appendChild(line)
  }

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
  if (amenity.kind !== 'landmark') {
    actions.appendChild(placeTripButton(amenityPlaceId(amenity.id), amenity.name))
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
    if (venue.coord) {
      const add = placeTripButton(diningPlaceId(venue.id), venue.name, single ? 'Add to trip' : `Add ${venue.name}`)
      add.classList.add('map-popup__btn--inline')
      block.appendChild(add)
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

// The whole park, for the Go to menu's last entry.
const PARK_FRAME: [[number, number], [number, number]] = [[-119.93, 37.45], [-119.05, 38.2]]

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

// Wire one pin's pointer tap and keyboard activation. A pin drawn full-size
// runs its action (the popup); a pin the declutter pass stepped down to a dot
// (map/declutter.ts) zooms in toward itself instead, because a dot is where
// pins were too close together to tap one on purpose, and a closer view is
// the answer. The keyboard always opens the popup, dot or not: a focused dot
// draws full-size (Map.css) and Enter means "this one".
//
// stopPropagation: the map's own click handler closes the shared popup, and
// MapLibre delivers that click after this one opened it.
function wirePin(el: HTMLElement, map: maplibregl.Map, lngLat: [number, number], activate: () => void) {
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    if (el.classList.contains('map-pin--dot')) {
      map.easeTo({ center: lngLat, zoom: Math.min(map.getZoom() + 1.6, 16) })
      return
    }
    activate()
  })
  el.addEventListener('keydown', pinKeydownHandler(activate))
}

// What of the map is on this device: the overview (the whole park at driving
// scale, plus the labels) and which corridors at trailhead scale. A corridor
// without the overview under it does not count; the download manager never
// leaves one in that state, but a cleared completion flag could.
type MapOffline = { overview: boolean; regions: OfflineRegion[] }

function readMapOffline(): MapOffline {
  const overview = isPackCompleted(MAP_OVERVIEW_PACK_ID)
  return {
    overview,
    regions: overview ? OFFLINE_REGIONS.filter((r) => isPackCompleted(mapRegionPackId(r.id))) : [],
  }
}

function listLabels(labels: string[]): string {
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

/** The downloaded corridors as boxes, for the outline drawn while offline. */
function offlineAreasGeojson(regions: OfflineRegion[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.map((r) => {
      const [w, s, e, n] = r.bbox
      return {
        type: 'Feature',
        properties: { id: r.id, label: r.label },
        geometry: { type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] },
      }
    }),
  }
}

// Sources and layers the page adds at runtime (the hike track, the offline
// outline, later the trip layer). A scheme change rebuilds the style, and
// setStyle would drop them; this carries them across in their order.
function keepRuntimeLayers(
  previous: maplibregl.StyleSpecification | undefined,
  next: maplibregl.StyleSpecification,
): maplibregl.StyleSpecification {
  if (!previous) return next
  const sources = { ...next.sources }
  for (const [id, src] of Object.entries(previous.sources)) if (!(id in sources)) sources[id] = src
  const known = new Set(next.layers.map((l) => l.id))
  return { ...next, sources, layers: [...next.layers, ...previous.layers.filter((l) => !known.has(l.id))] }
}

// The road graph loads once per session, the first time the trip view needs
// it: it is ~220 KB gzipped and nothing else on the map uses it.
let roadGraphPromise: Promise<RoadGraph> | null = null
function loadRoadGraph(): Promise<RoadGraph> {
  roadGraphPromise ??= fetch(ROADS_URL)
    .then((res) => {
      const type = res.headers.get('content-type')
      if (!res.ok || (type && type.includes('text/html'))) throw new Error('road graph unavailable')
      return res.json() as Promise<RoadGraphFile>
    })
    .then((file) => new RoadGraph(file))
    .catch((err) => {
      roadGraphPromise = null
      throw err
    })
  return roadGraphPromise
}

// CAMERA: ?cam=lng,lat,zoom,pitch,bearing, so a shared link opens on the view
// it was shared from. Written with replaceState once the camera settles (never
// per frame), read once at load, where it overrides the opening camera.
type Camera = { center: [number, number]; zoom: number; pitch: number; bearing: number }
function readCamera(): Camera | null {
  const raw = new URLSearchParams(window.location.search).get('cam')
  const n = raw?.split(',').map(Number)
  if (!n || n.length !== 5 || n.some((v) => !Number.isFinite(v))) return null
  const [lng, lat, zoom, pitch, bearing] = n
  if (lng < EXT_W - 1 || lng > EXT_E + 1 || lat < EXT_S - 1 || lat > EXT_N + 1) return null
  return { center: [lng, lat], zoom, pitch: Math.max(0, Math.min(pitch, MAX_PITCH)), bearing }
}
function writeCamera(map: maplibregl.Map) {
  const c = map.getCenter()
  const cam = [c.lng.toFixed(5), c.lat.toFixed(5), map.getZoom().toFixed(2), map.getPitch().toFixed(0), map.getBearing().toFixed(0)].join(',')
  const url = new URL(window.location.href)
  url.searchParams.set('cam', cam)
  window.history.replaceState(window.history.state, '', url.pathname + url.search)
}

// When a day counts as running late (the trip panel's "Warn when a day runs
// past"): sunset by default, or a clock time the reader picks. Device-only.
const DAY_END_KEY = 'tfg.trip.dayEnd'
function readDayEnd(): DayEnd {
  try {
    const raw = window.localStorage.getItem(DAY_END_KEY)
    if (raw && /^\d+$/.test(raw)) return { kind: 'fixed', minutes: Number(raw) }
  } catch {
    /* unreadable storage: the default */
  }
  return { kind: 'sunset' }
}
function writeDayEnd(next: DayEnd) {
  try {
    if (next.kind === 'sunset') window.localStorage.removeItem(DAY_END_KEY)
    else window.localStorage.setItem(DAY_END_KEY, String(next.minutes))
  } catch {
    /* non-fatal */
  }
}

function buildTripStopPopup(
  stop: TripStop,
  day: TripDay,
  color: string,
  handlers: { onOpen: (href: string) => void; onRemove: () => void },
): HTMLElement {
  const root = document.createElement('div')
  root.className = 'map-popup'
  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  title.textContent = `${stop.order}. ${stop.info.title}`
  root.appendChild(title)
  const chip = document.createElement('span')
  chip.className = 'map-popup__kind'
  chip.style.color = color
  chip.textContent = `${day.label} · ${TRIP_KIND_LABEL[stop.kind]}`
  root.appendChild(chip)
  const when = document.createElement('p')
  when.className = 'map-popup__stats'
  when.textContent = stop.timeRange
    ? `${stop.timeRange} · ${formatTime(stop.durationMin)}${stop.item.type === 'program' ? ' · published time' : ''}`
    : `${formatTime(stop.durationMin)} · doesn't fit in the day`
  root.appendChild(when)
  if (stop.info.meta.length > 0) {
    const meta = document.createElement('p')
    meta.className = 'map-popup__stats map-popup__stats--note'
    meta.textContent = stop.info.meta.join(' · ')
    root.appendChild(meta)
  }
  for (const w of day.warnings) {
    if (w.itemId !== stop.itemId || w.kind === 'unrouted') continue
    const line = document.createElement('p')
    line.className = 'map-popup__stats map-popup__warning'
    line.textContent = w.text
    root.appendChild(line)
  }
  const actions = document.createElement('p')
  actions.className = 'map-popup__actions'
  if (stop.info.href) {
    const open = document.createElement('button')
    open.type = 'button'
    open.className = 'map-popup__btn'
    open.textContent = stop.item.type === 'hike' ? 'Open hike →' : 'Open stop →'
    open.addEventListener('click', () => handlers.onOpen(stop.info.href!))
    actions.appendChild(open)
  }
  const remove = document.createElement('button')
  remove.type = 'button'
  remove.className = 'map-popup__btn'
  remove.textContent = 'Remove from day'
  remove.addEventListener('click', handlers.onRemove)
  actions.appendChild(remove)
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

function buildTripLegPopup(leg: TripLeg): HTMLElement {
  const root = document.createElement('div')
  root.className = 'map-popup'
  const title = document.createElement('strong')
  title.className = 'map-popup__title'
  const word = { drive: 'Drive', walk: 'Walk', shuttle: 'Shuttle' }[leg.mode]
  title.textContent = `${word}: ${leg.from.info.title} to ${leg.to.info.title}`
  root.appendChild(title)
  const stats = document.createElement('p')
  stats.className = 'map-popup__stats'
  stats.textContent = [
    leg.minutes !== null ? `about ${formatTime(Math.max(1, leg.minutes))}` : null,
    leg.metres !== null ? formatMiles(leg.metres / 1609.34) : null,
  ]
    .filter(Boolean)
    .join(' · ')
  root.appendChild(stats)
  const note = document.createElement('p')
  note.className = 'map-popup__stats map-popup__stats--note'
  note.textContent =
    leg.geometry === 'straight'
      ? 'No route found: drawn as a straight line. The time is still the planner\u2019s estimate.'
      : leg.mode === 'shuttle' && leg.shuttle
        ? `Ride from ${leg.shuttle.board} to ${leg.shuttle.alight}. Includes a 10-minute wait allowance; intervals are in the current Yosemite Guide.`
        : leg.mode === 'drive'
          ? 'Time from the park\u2019s driving table or a distance estimate, plus parking.'
          : 'Time at a walking pace, from the distance.'
  root.appendChild(note)
  return root
}

// Room for whatever floats over the map when a frame is computed: the view
// controls along the top, a side panel (the itineraries list and the info card
// on the left, the trip panel on the right) or a bottom sheet on phones. A
// frame computed for the whole canvas puts half of what it framed under them.
// Measured, not tabled, so a pane that changes size or side is still honoured.
function overlayPadding(map: maplibregl.Map): { top: number; bottom: number; left: number; right: number } {
  const base = 48
  const pad = { top: base, bottom: base, left: base, right: base }
  const canvas = map.getContainer().getBoundingClientRect()
  const controls = document.querySelector('.map-view-controls')?.getBoundingClientRect()
  if (controls && controls.height > 0) pad.top = Math.max(pad.top, controls.bottom - canvas.top + 16)
  const overlays = document.querySelectorAll('.map-pane:not([aria-hidden="true"]), .map-card')
  for (const el of overlays) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0 || r.bottom <= canvas.top || r.top >= canvas.bottom) continue
    if (r.width >= canvas.width * 0.9) {
      // A full-width sheet: along the bottom, or the phone's top-docked list.
      if (r.top - canvas.top > canvas.height / 3) pad.bottom = Math.max(pad.bottom, canvas.bottom - r.top + 24)
      else pad.top = Math.max(pad.top, r.bottom - canvas.top + 24)
    } else if (r.left - canvas.left < canvas.right - r.right) {
      pad.left = Math.max(pad.left, r.right - canvas.left + 24)
    } else {
      pad.right = Math.max(pad.right, canvas.right - r.left + 24)
    }
  }
  // Never more padding than the canvas can give: MapLibre refuses to fit then.
  pad.left = Math.min(pad.left, canvas.width * 0.6)
  pad.right = Math.min(pad.right, canvas.width * 0.6)
  pad.top = Math.min(pad.top, canvas.height * 0.45)
  pad.bottom = Math.min(pad.bottom, canvas.height * 0.45)
  return pad
}

// Frame a set of points the way the 3D view needs it: clear of the panes,
// at the gentler framing tilt (DAY_FIT_PITCH: at 55-60 degrees a flat frame
// crushes its far half against the horizon), and keeping the reader's
// bearing. fitBounds on its own snaps the map north-up, which on a map the
// reader has turned to look up the Valley reads as the map spinning away.
function frameBounds(
  map: maplibregl.Map,
  bounds: maplibregl.LngLatBoundsLike,
  is3d: boolean,
  opts: { maxZoom?: number; animate?: boolean } = {},
) {
  map.fitBounds(bounds, {
    padding: overlayPadding(map),
    maxZoom: opts.maxZoom ?? 14,
    pitch: is3d ? DAY_FIT_PITCH : 0,
    bearing: is3d ? map.getBearing() : 0,
    animate: opts.animate ?? true,
  })
}

// Frame a whole trail (the track file, cached offline; the trailhead alone
// when the track is not on this device) beside the info card.
function frameTrail(map: maplibregl.Map, hike: HikeT, is3d: boolean) {
  loadTrack(hike.id).then(
    (track) => {
      const bounds = new maplibregl.LngLatBounds()
      for (const p of track.line) bounds.extend(p)
      frameBounds(map, bounds, is3d, { maxZoom: 15 })
    },
    () => {
      if (hike.coord) map.flyTo({ center: hike.coord, zoom: FOCUS_ZOOM, pitch: is3d ? FOCUS_PITCH : 0 })
    },
  )
}

// One point with the info card open beside it (a program's meeting point):
// the card, not a popup, carries its detail, so it is framed clear of the
// card at the focus zoom rather than centred under it.
function framePoint(map: maplibregl.Map, coord: [number, number], is3d: boolean) {
  frameBounds(map, [coord, coord], is3d, { maxZoom: FOCUS_ZOOM })
}

// How far below the centre a selected pin lands, so its popup (which opens
// above the pin) has the top half of the screen to open into instead of
// running under the view controls.
function popupOffset(map: maplibregl.Map): [number, number] {
  return [0, Math.round(Math.min(160, map.getContainer().clientHeight * 0.22))]
}

const [EXT_W, EXT_S, EXT_E, EXT_N] = TILESET.bounds
const PAN_BOUNDS: [[number, number], [number, number]] = [
  [EXT_W - PAN_BUFFER_DEG, EXT_S - PAN_BUFFER_DEG],
  [EXT_E + PAN_BUFFER_DEG, EXT_N + PAN_BUFFER_DEG],
]

export default function Map() {
  useDocumentTitle('Map')
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})
  const amenityMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  // Live lot status for the parking pins. Read through a ref at popup-open
  // time so the marker effect below does not re-run (and rebuild every pin)
  // each time the feed refreshes.
  const parking = useParking()
  const parkingRef = useRef(parking)
  useEffect(() => {
    parkingRef.current = parking
  }, [parking])
  const hikeMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const mealMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const popupRef = useRef<maplibregl.Popup | null>(null)
  // The pin whose popup is open, drawn full-size whatever it collides with.
  const activePinRef = useRef<HTMLElement | null>(null)
  // Runs the declutter pass on the next frame (set once the map is ready).
  const declutterRef = useRef<() => void>(() => {})
  const [hasDots, setHasDots] = useState(false)
  // Camera refits only when the itinerary context changes, not on filter
  // chip toggles: refitting on every tap yanks the map around.
  // Starts at 'all' so the unfiltered first render keeps the opening camera
  // (the Valley in 3D) instead of fitting a flat frame around every pin.
  const lastFitKeyRef = useRef<string | null>('all')

  const [mapReady, setMapReady] = useState(false)
  const online = useOnline()
  const [mapFailed, setMapFailed] = useState(false)
  const [mapOffline, setMapOffline] = useState<MapOffline>(readMapOffline)
  const mapDownloaded = mapOffline.overview && mapOffline.regions.length === OFFLINE_REGIONS.length
  // 3D (terrain, tilted) or 2D (flat, north-up). A ref mirrors it for the
  // scheme-change rebuild, which runs from a listener, not a render.
  const [initialCamera] = useState(readCamera)
  // Read once by the map's init effect, which runs once; a ref keeps it out
  // of that effect's dependencies.
  const initialCameraRef = useRef(initialCamera)
  const [is3d, setIs3d] = useState(() => (initialCamera ? initialCamera.pitch > 0 : true))
  const is3dRef = useRef(initialCamera ? initialCamera.pitch > 0 : true)
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
    const recheck = () => setMapOffline(readMapOffline())
    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [])

  // No offline zoom clamp: the vector source declares maxzoom 15 and the
  // elevation source 13 (map/style.ts), so past those MapLibre overzooms the
  // same tiles the area packs carry, and trailhead scale draws from cache.

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
  // Bumped by each seed from the Itineraries pane so the camera frames the
  // new trip even when the trip filter was already on.
  const [tripFitNonce, setTripFitNonce] = useState(0)

  // Hike track overlay (?hike=<id>). The track loads from the runtime cache
  // offline; the overlay draws above the topo with the trailhead marked.
  const [trackHikeId, setTrackHikeId] = useState<string | null>(initial.hike)
  const trackState = useTrack(trackHikeId ?? undefined)
  const trackHike = trackHikeId ? getHikeById(trackHikeId) : undefined

  // Stops already in the trip plan get a checkmark badge on their pin.
  const { plan, removeItem, addStop, addHike, addProgram, clear: clearPlan, setDates } = useTripPlan()
  const plannedStopIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'stop').map((it) => it.stopId)),
    [plan],
  )
  const plannedHikeIds = useMemo(
    () => new Set(plan.items.filter((it) => it.type === 'hike').map((it) => it.hikeId)),
    [plan],
  )

  // --- The trip layer (My trip tab) ---------------------------------------
  // The plan drawn day by day: numbered pins, legs in their travel mode along
  // the roads, the hikes' trails, and the itinerary panel as its text
  // alternative. Built from the same plan store and slotting as the board.
  const [selectedDay, setSelectedDay] = useState<string | null>(initial.day)
  const [focusedTripItem, setFocusedTripItem] = useState<string | null>(null)
  const [tripExpanded, setTripExpanded] = useState(false)
  const [dayEnd, setDayEndState] = useState<DayEnd>(readDayEnd)
  const setDayEnd = useCallback((next: DayEnd) => {
    writeDayEnd(next)
    setDayEndState(next)
  }, [])
  const [roadGraph, setRoadGraph] = useState<RoadGraph | null>(null)
  const [graphState, setGraphState] = useState<'loading' | 'ready' | 'failed'>('loading')
  // Bumped when the colour scheme changes, so the day colours re-read tokens.
  const [schemeTick, setSchemeTick] = useState(0)
  const colors = useMemo(() => {
    void schemeTick
    return dayColors()
  }, [schemeTick])
  const tripDays = useMemo(() => buildTripDays(plan, roadGraph, dayEnd), [plan, roadGraph, dayEnd])
  const tripDaysRef = useRef<TripDay[]>(tripDays)
  useEffect(() => {
    tripDaysRef.current = tripDays
  }, [tripDays])
  const [hikeLines, setHikeLines] = useState<Record<string, Pt[]>>({})

  // --- Trails, program meeting points, the info card, search --------------
  const [trailFilter, setTrailFilterState] = useState<TrailFilter>({ difficulties: null, maxMiles: null, visible: true })
  const [trailsReady, setTrailsReady] = useState(false)
  const [card, setCard] = useState<MapCardSelection | null>(() => {
    const hike = initial.trail ? getHikeById(initial.trail) : undefined
    return hike ? { kind: 'trail', hike } : null
  })
  const selectedTrailId = card?.kind === 'trail' ? card.hike.id : null
  const programsState = usePrograms(plan.dates.start, plan.dates.end)
  const programPlaces = useMemo(
    () => programPoints(programsState.events, todayIso()),
    [programsState.events],
  )
  const selectedTrailIdRef = useRef<string | null>(selectedTrailId)
  useEffect(() => {
    selectedTrailIdRef.current = selectedTrailId
  }, [selectedTrailId])
  const programPointsRef = useRef<ProgramPoint[]>([])
  useEffect(() => {
    programPointsRef.current = programPlaces.points
  }, [programPlaces])

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
  // The trip filter outranks it: "My trip" means the plan, all of it, and a
  // stop added by hand outside the preset's regions is still on the trip.
  const itineraryRegions = useMemo<Set<Region> | null>(() => {
    if (tab !== 'itineraries' || !selectedItinerary || plannedOnly) return null
    return new Set(ITINERARIES[selectedItinerary].days.flatMap((d) => d.regions))
  }, [selectedItinerary, tab, plannedOnly])

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
  // Read by the stop-marker effect when it frames the trip: a hike-only plan
  // has no stop pins to fit around. A ref, not a dependency, so adding a hike
  // from a trailhead popup never rebuilds (and closes) the stop markers.
  const visibleTrailheadsRef = useRef<TrailheadGroup[]>(visibleTrailheads)
  useEffect(() => {
    visibleTrailheadsRef.current = visibleTrailheads
  }, [visibleTrailheads])

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
      day: selectedDay,
      trail: selectedTrailId,
    })
  }, [tab, selectedItinerary, selectedStopId, kindFilter, showSecret, trackHikeId, plannedOnly, selectedDay, selectedTrailId])

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
      setSelectedDay(next.day)
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
    // The Valley has a view worth opening on (the opening camera, looking up
    // the Valley); every other frame is fitted, keeping the reader's bearing.
    if (region === 'valley' && is3dRef.current) {
      map.flyTo({ ...HOME_CAMERA, essential: true })
      return
    }
    frameBounds(map, region === 'park' ? PARK_FRAME : REGION_BOUNDS[region], is3dRef.current, {
      maxZoom: region === 'park' ? 10 : 13,
    })
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
      // Over the Valley's west end looking east: El Capitan on the left,
      // Half Dome closing the view (map/theme.ts).
      center: initialCameraRef.current?.center ?? HOME_CAMERA.center,
      zoom: initialCameraRef.current?.zoom ?? HOME_CAMERA.zoom,
      pitch: initialCameraRef.current?.pitch ?? HOME_CAMERA.pitch,
      bearing: initialCameraRef.current?.bearing ?? HOME_CAMERA.bearing,
      minZoom: 7,
      maxZoom: 17,
      maxPitch: MAX_PITCH,
      // The archive extent plus a small buffer: past it there are no tiles.
      maxBounds: PAN_BOUNDS,
      // One finger pans, two rotate and tilt, pinch zooms. The compass in the
      // navigation control shows the bearing and resets it on a tap, and the
      // Reset button restores the whole opening camera.
      attributionControl: { compact: true },
      // Mid-range phones: the terrain mesh is the expensive part, and a 2x
      // canvas on a 3x screen is indistinguishable from native at arm's length.
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    })
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left')
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
      if (is3dRef.current) map.setTerrain(TERRAIN_SPEC)
      setMapReady(true)
      setMapFailed(false)
    })

    // The trip pins are drawn images (map/tripIcons.ts); a rebuilt style drops
    // them, and the first frame after asks for them here.
    map.on('styleimagemissing', (e) => {
      if (e.id.startsWith('trip-')) addTripIcons(map, dayColors(), tripCasing(), accentColor())
    })

    // Follow the reader's colour scheme (Account's theme card, or the device
    // in Auto): the map's tokens are read into the style at build time, so a
    // scheme change rebuilds it, carrying the page's own layers across.
    let scheme = buildTheme().scheme
    const restyle = () => {
      const next = buildTheme()
      if (next.scheme === scheme) return
      scheme = next.scheme
      setSchemeTick((t) => t + 1)
      map.setStyle(buildMapStyle(next), {
        transformStyle: (prev, style) => ({
          ...keepRuntimeLayers(prev, style),
          terrain: is3dRef.current ? TERRAIN_SPEC : undefined,
        }),
      })
    }
    const themeObserver = new MutationObserver(restyle)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const darkQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    darkQuery?.addEventListener('change', restyle)
    map.on('moveend', () => writeCamera(map))
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
      themeObserver.disconnect()
      darkQuery?.removeEventListener('change', restyle)
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 2D/3D. 3D drapes the map on the terrain and tilts it; 2D drops the
  // terrain and returns to north-up, the flat map a reader reads like paper.
  const toggle3d = useCallback(() => {
    const map = mapRef.current
    const next = !is3dRef.current
    is3dRef.current = next
    setIs3d(next)
    if (!map) return
    if (next) {
      map.setTerrain(TERRAIN_SPEC)
      map.easeTo({ pitch: DEFAULT_PITCH, duration: 600 })
    } else {
      map.setTerrain(null)
      map.easeTo({ pitch: 0, bearing: 0, duration: 600 })
    }
  }, [])

  const resetView = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    popupRef.current?.remove()
    map.flyTo({
      center: HOME_CAMERA.center,
      zoom: HOME_CAMERA.zoom,
      pitch: is3dRef.current ? HOME_CAMERA.pitch : 0,
      bearing: is3dRef.current ? HOME_CAMERA.bearing : 0,
      essential: true,
    })
  }, [])

  // The downloaded corridors, outlined while the device is offline so the
  // reader can see where the map will draw at trailhead scale. Online the
  // outline is noise, and the notice above the map says it in words.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const data = offlineAreasGeojson(mapOffline.regions)
    const src = map.getSource('offline-areas') as maplibregl.GeoJSONSource | undefined
    if (src) src.setData(data)
    else {
      map.addSource('offline-areas', { type: 'geojson', data })
      map.addLayer({
        id: 'offline-areas',
        type: 'line',
        source: 'offline-areas',
        paint: {
          'line-color': buildTheme().offlineRegion,
          'line-width': 2,
          'line-dasharray': [1, 1.5],
          'line-opacity': 0.8,
        },
      })
    }
    map.setLayoutProperty('offline-areas', 'visibility', online ? 'none' : 'visible')
  }, [mapReady, mapOffline, online])

  // The road graph, the first time the trip view opens. Legs draw straight,
  // marked pending, until it lands; a failure leaves them straight and says so.
  useEffect(() => {
    if (tab !== 'trip' || roadGraph) return
    let cancelled = false
    loadRoadGraph().then(
      (g) => {
        if (cancelled) return
        setRoadGraph(g)
        setGraphState('ready')
      },
      () => {
        if (!cancelled) setGraphState('failed')
      },
    )
    return () => {
      cancelled = true
    }
  }, [tab, roadGraph])

  // Trails for the planned hikes: the same track files /hike/:id draws, from
  // the runtime cache offline. A hike with no track keeps its pin, no line.
  const plannedHikeKey = useMemo(() => [...plannedHikeIds].sort().join(','), [plannedHikeIds])
  useEffect(() => {
    if (tab !== 'trip' || !plannedHikeKey) return
    let cancelled = false
    for (const id of plannedHikeKey.split(',')) {
      if (!hasTrack(id)) continue
      loadTrack(id).then(
        (track) => {
          if (!cancelled) setHikeLines((prev) => (prev[id] ? prev : { ...prev, [id]: track.line }))
        },
        () => {
          /* no track offline: the pin stays */
        },
      )
    }
    return () => {
      cancelled = true
    }
  }, [tab, plannedHikeKey])

  // Draw the trip: sources, layers and pin images once, data on every change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    ensureTripLayers(map)
    addTripIcons(map, colors, tripCasing(), accentColor())
    const hikes: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: tripDays.flatMap((d) =>
        d.stops.flatMap((s) => {
          const line = s.item.type === 'hike' ? hikeLines[s.item.hikeId] : undefined
          return line
            ? [{ type: 'Feature' as const, properties: { day: d.day, color: dayColor(colors, d.index) }, geometry: { type: 'LineString' as const, coordinates: line } }]
            : []
        }),
      ),
    }
    setTripData(map, { legs: tripLegsGeojson(tripDays, colors), hikes, stops: tripStopsGeojson(tripDays, colors) })
  }, [mapReady, tripDays, colors, hikeLines, schemeTick])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    ensureTripLayers(map)
    setTripVisible(map, tab === 'trip')
    setTripDay(map, selectedDay)
    setTripFocus(map, focusedTripItem)
  }, [mapReady, tab, selectedDay, focusedTripItem, schemeTick])

  // Taps on the trip layer: a pin opens its card and marks its row in the
  // panel; a leg says how long and how far. Registered once; the handlers
  // read the current days through a ref.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const findStop = (itemId: string) => {
      for (const d of tripDaysRef.current) {
        const stop = d.stops.find((s) => s.itemId === itemId)
        if (stop) return { stop, day: d }
      }
      return null
    }
    const onPin = (e: maplibregl.MapLayerMouseEvent) => {
      const itemId = e.features?.[0]?.properties?.itemId as string | undefined
      const hit = itemId ? findStop(itemId) : null
      if (!hit) return
      setFocusedTripItem(hit.stop.itemId)
      document.getElementById(`trip-stop-${hit.stop.itemId}`)?.scrollIntoView({ block: 'nearest' })
      popupRef.current
        ?.setLngLat(hit.stop.coord!)
        .setDOMContent(
          buildTripStopPopup(hit.stop, hit.day, dayColor(dayColors(), hit.day.index), {
            onOpen: (href) => navigate(href),
            onRemove: () => {
              removeItem(hit.stop.itemId)
              popupRef.current?.remove()
            },
          }),
        )
        .addTo(map)
    }
    const onLeg = (e: maplibregl.MapLayerMouseEvent) => {
      // A pin sits on the end of its legs; a tap on it is the pin's.
      if (map.queryRenderedFeatures(e.point, { layers: [TRIP_PIN_LAYER] }).length > 0) return
      const props = e.features?.[0]?.properties
      if (!props) return
      const leg = tripDaysRef.current
        .flatMap((d) => d.legs)
        .find((l) => l.from.itemId === props.fromId && l.to.itemId === props.toId)
      if (!leg) return
      popupRef.current?.setLngLat(e.lngLat).setDOMContent(buildTripLegPopup(leg)).addTo(map)
    }
    const pointer = () => (map.getCanvas().style.cursor = 'pointer')
    const plain = () => (map.getCanvas().style.cursor = '')
    const layers = [TRIP_PIN_LAYER, ...TRIP_LEG_LAYERS]
    map.on('click', TRIP_PIN_LAYER, onPin)
    for (const id of TRIP_LEG_LAYERS) map.on('click', id, onLeg)
    for (const id of layers) {
      map.on('mouseenter', id, pointer)
      map.on('mouseleave', id, plain)
    }
    return () => {
      map.off('click', TRIP_PIN_LAYER, onPin)
      for (const id of TRIP_LEG_LAYERS) map.off('click', id, onLeg)
      for (const id of layers) {
        map.off('mouseenter', id, pointer)
        map.off('mouseleave', id, plain)
      }
    }
  }, [mapReady, navigate, removeItem])

  // From the panel: fly to a stop at a good 3D angle and mark it.
  const focusTripStop = useCallback((stop: TripStop) => {
    const map = mapRef.current
    setFocusedTripItem(stop.itemId)
    if (!map || !stop.coord) return
    map.flyTo({
      center: stop.coord,
      zoom: Math.max(map.getZoom(), 13.5),
      pitch: is3dRef.current ? 55 : 0,
    })
  }, [])

  // Selecting one day frames it; "All days" frames the whole trip.
  const frameTrip = useCallback((day: string | null) => {
    const map = mapRef.current
    if (!map) return
    const pts = tripDaysRef.current
      .filter((d) => !day || d.day === day)
      .flatMap((d) => d.stops.map((s) => s.coord!))
    if (pts.length === 0) return
    const bounds = new maplibregl.LngLatBounds()
    for (const p of pts) bounds.extend(p)
    frameBounds(map, bounds, is3dRef.current)
  }, [])
  const selectTripDay = useCallback(
    (day: string | null) => {
      setSelectedDay(day)
      frameTrip(day)
    },
    [frameTrip],
  )

  // Opening My trip frames the plan (the day in ?day=, else all of it): the
  // tab is about the plan, and the camera was wherever the points tab left
  // it. Once per opening, never on a plan edit, which would yank the map out
  // from under a reader reordering stops. A shared ?cam= link wins on load.
  const prevTabRef = useRef<Tab | null>(initialCamera ? initial.tab : null)
  useEffect(() => {
    if (!mapReady) return
    const was = prevTabRef.current
    prevTabRef.current = tab
    if (tab !== 'trip' || was === 'trip') return
    // After the panel has laid out, so the frame leaves room for it.
    const raf = requestAnimationFrame(() => frameTrip(selectedDay))
    return () => cancelAnimationFrame(raf)
    // selectedDay is read at the moment the tab opens, not followed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mapReady, frameTrip])

  // "Play day": fly the day stop to stop, pausing at each. Any touch on the
  // map, a tab change or leaving the page stops it. MapLibre turns the flight
  // into a jump for readers who ask for reduced motion.
  const playTokenRef = useRef<{ cancelled: boolean } | null>(null)
  const stopPlaying = useCallback(() => {
    if (playTokenRef.current) playTokenRef.current.cancelled = true
    playTokenRef.current = null
  }, [])
  const playDay = useCallback(
    async (day: TripDay) => {
      const map = mapRef.current
      if (!map || day.stops.length === 0) return
      stopPlaying()
      const token = { cancelled: false }
      playTokenRef.current = token
      setSelectedDay(day.day)
      const cancel = () => (token.cancelled = true)
      map.once('mousedown', cancel)
      map.once('touchstart', cancel)
      map.once('wheel', cancel)
      for (const stop of day.stops) {
        if (token.cancelled) break
        setFocusedTripItem(stop.itemId)
        await new Promise<void>((resolve) => {
          map.once('moveend', () => resolve())
          map.flyTo({ center: stop.coord!, zoom: 14, pitch: is3dRef.current ? 60 : 0, speed: 0.8 })
        })
        if (token.cancelled) break
        await new Promise((r) => setTimeout(r, 1800))
      }
      map.off('mousedown', cancel)
      map.off('touchstart', cancel)
      map.off('wheel', cancel)
      if (playTokenRef.current === token) playTokenRef.current = null
    },
    [stopPlaying],
  )
  useEffect(() => {
    if (tab !== 'trip') stopPlaying()
    return stopPlaying
  }, [tab, stopPlaying])

  const setLegMode = useCallback((itemId: string, mode: TravelModeT | undefined) => {
    setItemTravelMode(itemId, mode)
  }, [])
  const moveTripItem = useCallback((itemId: string, direction: -1 | 1) => {
    moveItemInDay(itemId, direction)
  }, [])

  // The trails layer: every verified day hike on the terrain, coloured by
  // difficulty. Loaded once (the overview pack keeps it offline).
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    let cancelled = false
    loadTrails().then(
      (data) => {
        if (cancelled) return
        ensureTrailLayers(map, data)
        setTrailsReady(true)
      },
      () => {
        /* no trails file offline: the pins and the per-hike overlay remain */
      },
    )
    return () => {
      cancelled = true
    }
  }, [mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !trailsReady) return
    recolorTrails(map)
    // The trip view draws its own hikes along their trails; fifty-seven more
    // under the plan would bury the legs the view exists to show. The trip
    // filter keeps the trails of the plan's hikes and nothing else, the lines
    // doing what the pins do.
    setTrailFilter(
      map,
      { ...trailFilter, visible: trailFilter.visible && tab !== 'trip' },
      selectedTrailId,
      plannedOnly ? plannedHikeIds : null,
    )
  }, [trailsReady, trailFilter, selectedTrailId, schemeTick, tab, plannedOnly, plannedHikeIds])

  // Program meeting points: a layer of their own, the programs feed for the
  // trip's dates grouped by where they meet.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const data: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: programPlaces.points.map((p) => ({
        type: 'Feature' as const,
        properties: { id: p.id, count: String(p.events.length) },
        geometry: { type: 'Point' as const, coordinates: p.coord },
      })),
    }
    const src = map.getSource('program-points') as maplibregl.GeoJSONSource | undefined
    if (src) src.setData(data)
    else {
      map.addSource('program-points', { type: 'geojson', data })
      map.addLayer({
        id: 'program-points',
        type: 'symbol',
        source: 'program-points',
        minzoom: 11,
        layout: {
          'icon-image': PROGRAM_POINT_ICON,
          'icon-size': 0.8,
          'icon-allow-overlap': true,
          'text-field': ['get', 'count'],
          'text-font': ['Noto Sans Medium'],
          'text-size': 11,
          'text-allow-overlap': true,
        },
        paint: { 'text-color': '#ffffff' },
      })
    }
    map.setLayoutProperty('program-points', 'visibility', tab === 'points' ? 'visible' : 'none')
  }, [mapReady, programPlaces, tab, schemeTick])

  // Taps: a trail opens its card; a program point opens its card. A tap that
  // lands on a trip pin or a DOM pin is theirs.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !trailsReady) return
    const onTrail = (e: maplibregl.MapLayerMouseEvent) => {
      const target = e.originalEvent.target
      if (target instanceof Element && target.closest('.map-pin')) return
      if (map.getLayer(TRIP_PIN_LAYER) && map.queryRenderedFeatures(e.point, { layers: [TRIP_PIN_LAYER, 'program-points'].filter((l) => map.getLayer(l)) }).length) return
      const hike = getHikeById(e.features?.[0]?.properties?.id as string)
      if (hike) setCard({ kind: 'trail', hike })
    }
    const onProgram = (e: maplibregl.MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id as string
      const point = programPointsRef.current.find((p) => p.id === id)
      if (point) setCard({ kind: 'program', point })
    }
    const hover = (e: maplibregl.MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer'
      map.setFilter('trails-selected', ['==', ['get', 'id'], (e.features?.[0]?.properties?.id as string) ?? ''])
    }
    const unhover = () => {
      map.getCanvas().style.cursor = ''
      map.setFilter('trails-selected', ['==', ['get', 'id'], selectedTrailIdRef.current ?? ''])
    }
    map.on('click', TRAIL_LINE_LAYER, onTrail)
    map.on('mousemove', TRAIL_LINE_LAYER, hover)
    map.on('mouseleave', TRAIL_LINE_LAYER, unhover)
    map.on('click', 'program-points', onProgram)
    return () => {
      map.off('click', TRAIL_LINE_LAYER, onTrail)
      map.off('mousemove', TRAIL_LINE_LAYER, hover)
      map.off('mouseleave', TRAIL_LINE_LAYER, unhover)
      map.off('click', 'program-points', onProgram)
    }
  }, [mapReady, trailsReady])

  // Fly to the selected trail or point at a good 3D angle: the whole trail
  // in frame, tilted, with room for the card.
  const flyToCard = useCallback(() => {
    const map = mapRef.current
    if (!map || !card) return
    popupRef.current?.remove()
    if (card.kind === 'program') {
      framePoint(map, card.point.coord, is3dRef.current)
      return
    }
    frameTrail(map, card.hike, is3dRef.current)
  }, [card])

  const closeCard = useCallback(() => setCard(null), [])

  // A search pick: go there, and open what that thing opens when tapped.
  const pickSearch = useCallback(
    (hit: MapHit) => {
      const map = mapRef.current
      if (!map) return
      popupRef.current?.remove()
      if (hit.kind === 'stop') {
        // A filter could be hiding it; the reader asked for it by name.
        setKindFilter(null)
        setShowSecret(true)
        setPlannedOnly(false)
        if (tab !== 'points') setTab('points')
        selectStop(hit.id)
        return
      }
      if (hit.kind === 'trail') {
        const hike = getHikeById(hit.id)
        if (!hike) return
        setCard({ kind: 'trail', hike })
        // After the card has laid out, so the frame leaves room for it.
        requestAnimationFrame(() => frameTrail(map, hike, is3dRef.current))
        return
      }
      if (hit.kind === 'program') {
        const point = programPointsRef.current.find((p) => p.id === hit.id)
        if (point) setCard({ kind: 'program', point })
        requestAnimationFrame(() => framePoint(map, hit.coord, is3dRef.current))
        return
      }
      map.flyTo({
        center: hit.coord,
        zoom: Math.max(map.getZoom(), FOCUS_ZOOM),
        pitch: is3dRef.current ? FOCUS_PITCH : 0,
        offset: popupOffset(map),
      })
      if (hit.kind === 'place') {
        const amenity = AMENITIES.find((a) => a.id === hit.id)
        if (amenity) {
          const { lots, fetchedAt } = parkingRef.current
          const fresh = fetchedAt !== null && Date.now() - Date.parse(fetchedAt) <= PARKING_HIDE_MS
          const lot = fresh ? lotForAmenity(amenity, lots) : null
          activePinRef.current = amenityMarkersRef.current[amenity.id]?.getElement() ?? null
          popupRef.current
            ?.setLngLat(amenity.coord)
            .setDOMContent(buildAmenityPopupContent(amenity, lot ? { lot, fetchedAt } : null))
            .addTo(map)
        }
      } else if (hit.kind === 'meal') {
        const group = MEAL_GROUPS.find((g) => g.venues.some((v) => v.id === hit.id))
        if (group) activePinRef.current = mealMarkersRef.current[group.id]?.getElement() ?? null
        if (group) popupRef.current?.setLngLat(group.coord).setDOMContent(buildMealPopupContent(group, openDining)).addTo(map)
      }
    },
    [tab, selectStop, openDining],
  )

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

    // A few stops intentionally share a viewing location (for example,
    // Tunnel View and the hidden waterfall entry seen from it). Keep those
    // pins individually tappable instead of letting the last marker added
    // sit on top of every earlier one.
    const stopCoordCounts: Record<string, number> = {}
    const stopCoordIndexes: Record<string, number> = {}
    for (const stop of visibleStops) {
      if (stop.coord) {
        const key = stop.coord.join(',')
        stopCoordCounts[key] = (stopCoordCounts[key] ?? 0) + 1
      }
    }

    const bounds = new maplibregl.LngLatBounds()
    for (const stop of visibleStops) {
      if (!stop.coord) continue
      const [lng, lat] = stop.coord
      bounds.extend([lng, lat])

      const el = buildPinElement(stop.kind, stop.title, isSecretGuideEntry(stop))
      wirePin(el, map, stop.coord, () => selectStop(stop.id))
      const coordKey = stop.coord.join(',')
      const coordIndex = stopCoordIndexes[coordKey] ?? 0
      stopCoordIndexes[coordKey] = coordIndex + 1
      const coordCount = stopCoordCounts[coordKey] ?? 1
      const horizontalOffset = Math.round((coordIndex - (coordCount - 1) / 2) * 16)
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
        offset: [horizontalOffset, 0],
      })
        .setLngLat([lng, lat])
        .addTo(map)
      markersRef.current[stop.id] = marker
    }

    // The trip filter frames the trip: its trailheads count, since a plan of
    // hikes alone has no stop pins, and each seed from the Itineraries pane
    // (tripFitNonce) is a new trip to frame.
    if (plannedOnly) {
      for (const g of visibleTrailheadsRef.current) bounds.extend(g.coord)
    }
    // Not advanced on an empty frame, so the first non-empty render after a
    // reset still fits when the itinerary changed meanwhile.
    if (bounds.isEmpty()) return
    const fitKey = plannedOnly ? `trip:${tripFitNonce}` : itineraryRegions && selectedItinerary ? selectedItinerary : 'all'
    if (lastFitKeyRef.current !== fitKey) {
      // Turning the trip filter off is a chip toggle like the others: the
      // camera stays where the reader has it rather than pulling out to the
      // whole park.
      const leavingTrip = !plannedOnly && lastFitKeyRef.current?.startsWith('trip:')
      if (!leavingTrip) frameBounds(map, bounds, is3dRef.current, { maxZoom: 12 })
      lastFitKeyRef.current = fitKey
    }
  }, [visibleStops, mapReady, selectStop, itineraryRegions, selectedItinerary, plannedOnly, tripFitNonce])

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
      const el = buildPinElement(amenity.kind, amenity.name, false, amenity.glyph, amenity.mark)
      const activate = () => {
        // Clear any stop selection so ?stop= doesn't keep pointing at a stop
        // whose popup this one just replaced.
        selectStop(null)
        const { lots, fetchedAt } = parkingRef.current
        const fresh =
          fetchedAt !== null && Date.now() - Date.parse(fetchedAt) <= PARKING_HIDE_MS
        const lot = fresh ? lotForAmenity(amenity, lots) : null
        activePinRef.current = el
        popupRef.current
          ?.setLngLat(amenity.coord)
          .setDOMContent(buildAmenityPopupContent(amenity, lot ? { lot, fetchedAt } : null))
          .addTo(map)
      }
      wirePin(el, map, amenity.coord, activate)
      amenityMarkersRef.current[amenity.id] = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(amenity.coord)
        .addTo(map)
    }
  }, [visibleAmenities, mapReady, selectStop])

  // ?place=<amenity id>: a search hit for a map-only pin (gas, showers, a
  // campground). One shot at load: fly to the pin, open its popup, drop the
  // param (writeUrlState never writes it back). An unknown id does nothing.
  const [initialPlace] = useState(() => new URLSearchParams(window.location.search).get('place'))
  const placeShown = useRef(false)
  useEffect(() => {
    if (!mapReady || !initialPlace || placeShown.current) return
    const map = mapRef.current
    const amenity = AMENITIES.find((a) => a.id === initialPlace)
    placeShown.current = true
    const url = new URL(window.location.href)
    url.searchParams.delete('place')
    window.history.replaceState(window.history.state, '', url.pathname + url.search)
    if (!map || !amenity) return
    map.easeTo({ center: amenity.coord, zoom: Math.max(map.getZoom(), FOCUS_ZOOM), offset: popupOffset(map), duration: 0 })
    activePinRef.current = amenityMarkersRef.current[amenity.id]?.getElement() ?? null
    const { lots, fetchedAt } = parkingRef.current
    const fresh = fetchedAt !== null && Date.now() - Date.parse(fetchedAt) <= PARKING_HIDE_MS
    const lot = fresh ? lotForAmenity(amenity, lots) : null
    popupRef.current
      ?.setLngLat(amenity.coord)
      .setDOMContent(buildAmenityPopupContent(amenity, lot ? { lot, fetchedAt } : null))
      .addTo(map)
  }, [mapReady, initialPlace])

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
        activePinRef.current = el
        popupRef.current
          ?.setLngLat(group.coord)
          .setDOMContent(
            buildHikePopupContent(group, { onOpenHike: openHike, onShowTrack: showTrack }, userPosRef.current),
          )
          .addTo(map)
      }
      wirePin(el, map, group.coord, activate)
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
        activePinRef.current = el
        popupRef.current
          ?.setLngLat(group.coord)
          .setDOMContent(buildMealPopupContent(group, openDining))
          .addTo(map)
      }
      wirePin(el, map, group.coord, activate)
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

  // Declutter: every frame the camera moves, place the pins in rank order in
  // screen space and step the ones that would land on a higher-ranked pin
  // down to a dot (map/declutter.ts). In a tilted view the far pins also
  // shrink with depth. All of it is a class and two style properties on
  // elements that already exist, so a pan never rebuilds a marker.
  useEffect(() => {
    const map = mapRef.current
    const popup = popupRef.current
    if (!map || !popup || !mapReady) return
    let frame = 0
    let shownBefore = new Set<string>()
    const run = () => {
      frame = 0
      const container = map.getContainer()
      // Trip view hides these pins (Map.css); nothing to place.
      if (container.dataset.tripView !== undefined) return
      const hideMinor = container.dataset.zoomBand === 'far' && container.dataset.kinds === 'all'
      const canvas = map.getCanvas()
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const pitch = map.getPitch()
      const active = popup.isOpen() ? activePinRef.current : null
      const focused = document.activeElement
      const items: DeclutterItem[] = []
      const els: Record<string, HTMLElement> = {}
      const groups = {
        s: markersRef.current,
        a: amenityMarkersRef.current,
        h: hikeMarkersRef.current,
        m: mealMarkersRef.current,
      }
      for (const [group, markers] of Object.entries(groups)) {
        for (const [id, marker] of Object.entries(markers)) {
          const el = marker.getElement()
          if (hideMinor && el.classList.contains('map-pin--minor')) continue
          const p = map.project(marker.getLngLat())
          const off = marker.getOffset()
          const x = p.x + off.x
          const y = p.y + off.y
          // Off screen: leave it as it was; it is re-placed when it returns.
          if (x < -40 || x > w + 40 || y < -10 || y > h + 60) continue
          const scale = depthScale(y, h, pitch)
          if (el.style.getPropertyValue('--pin-scale') !== String(scale)) el.style.setProperty('--pin-scale', String(scale))
          const key = `${group}:${id}`
          els[key] = el
          items.push({
            id: key,
            x,
            y,
            w: PIN_W * scale,
            h: PIN_H * scale,
            // A pin that was drawn last frame keeps a small edge, so pins at
            // equal rank do not trade places every frame of a rotation; a pin
            // behind a ridge (MapLibre fades it) gives way to one in view.
            priority:
              Number(el.dataset.rank ?? 0) +
              (shownBefore.has(key) ? 0.3 : 0) -
              (el.classList.contains('maplibregl-marker-covered') ? 20 : 0),
            pinned: el === active || el === focused || el.classList.contains('map-pin--planned'),
          })
        }
      }
      const shown = declutter(items)
      for (const it of items) {
        const el = els[it.id]
        const dot = !shown.has(it.id)
        if (el.classList.contains('map-pin--dot') !== dot) el.classList.toggle('map-pin--dot', dot)
        // Nearer pins (lower on the screen) draw over farther ones, and every
        // pin over every dot; the open popup's pin over all of them.
        const z = String((el === active ? 20000 : dot ? 0 : 10000) + Math.round(it.y))
        if (el.style.zIndex !== z) el.style.zIndex = z
      }
      shownBefore = shown
      const anyDots = items.length > shown.size
      setHasDots((prev) => (prev === anyDots ? prev : anyDots))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run)
    }
    declutterRef.current = schedule
    // 'idle' catches the terrain settling under the pins after tiles load,
    // which moves them without a camera move.
    map.on('move', schedule)
    map.on('resize', schedule)
    map.on('idle', schedule)
    popup.on('open', schedule)
    popup.on('close', schedule)
    // A dot that takes keyboard focus draws full-size (Map.css); re-place
    // around it so it does not sit on a neighbour.
    const container = map.getContainer()
    container.addEventListener('focusin', schedule)
    container.addEventListener('focusout', schedule)
    schedule()
    return () => {
      map.off('move', schedule)
      map.off('resize', schedule)
      map.off('idle', schedule)
      popup.off('open', schedule)
      popup.off('close', schedule)
      container.removeEventListener('focusin', schedule)
      container.removeEventListener('focusout', schedule)
      cancelAnimationFrame(frame)
      declutterRef.current = () => {}
    }
  }, [mapReady])

  // Re-place after anything that changes which pins exist or which are pinned.
  // Declared after the marker and badge effects, so it runs after them.
  useEffect(() => {
    declutterRef.current()
  }, [visibleStops, visibleAmenities, visibleTrailheads, visibleMeals, plannedStopIds, plannedHikeIds, selection, tab, zoomBand, kindFilter])

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
      frameBounds(map, bounds, is3dRef.current, { maxZoom: 15, animate: false })
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
    activePinRef.current = marker.getElement()
    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 13), offset: popupOffset(map) })
    popup
      .setLngLat(lngLat)
      .setDOMContent(buildPopupContent(stop, openStop, userPosRef.current))
      .addTo(map)
  }, [selection, mapReady, visibleStops, openStop, selectStop])

  const handleTab = useCallback((next: Tab) => {
    setTab(next)
  }, [])

  // "Download for offline": the Information pane's Offline areas section,
  // which carries each area's size, progress and Remove. Scrolled to after
  // the pane has rendered; focus moves with it for keyboard and screen
  // reader users, who would otherwise stay on a button that just vanished.
  const openOfflineAreas = useCallback(() => {
    setTab('info')
    requestAnimationFrame(() => {
      const target = document.getElementById('map-offline')
      target?.scrollIntoView({ block: 'start' })
      target?.focus({ preventScroll: true })
    })
  }, [])

  const handleSelectItinerary = useCallback(
    (key: ItineraryKey | null) => {
      setSelectedItinerary(key)
      selectStop(null)
    },
    [selectStop],
  )

  // Putting a preset on the plan from here: the trip board's own seeding
  // (trip/seedItinerary.ts), onto the plan's dates, so the entries, the days
  // and the note about what stayed off are the ones the board would give.
  // Seeding over a planned trip replaces it, and that tap arms before it
  // fires, as on the board. Once seeded the trip filter goes on, so the map
  // shows the plan it just made: its pins and the trails of its hikes.
  const roads = useRoadReader()
  const seedConfirm = useArmToConfirm<ItineraryKey>('.map-seed')
  const [seeded, setSeeded] = useState<{ key: ItineraryKey; note: string | null } | null>(null)
  const planItemCount = plan.items.length
  const seedFromMap = (key: ItineraryKey) => {
    if (planItemCount > 0 && !seedConfirm.press(key)) return
    // The board's window: dates picked on /programs win over the stored plan's.
    const picked = readTripDates()
    const dates = picked ?? plan.dates
    if (picked && (picked.start !== plan.dates.start || picked.end !== plan.dates.end)) {
      setDates(picked.start, picked.end)
    }
    if (planItemCount > 0) clearPlan()
    const note = seedItinerary(key, {
      windowDays: daysInWindow(dates.start, dates.end),
      programEvents: programsState.events,
      readRoad: roads.forRoad,
      addStop,
      addHike,
      addProgram,
    })
    setSeeded({ key, note })
    setPlannedOnly(true)
    setTripFitNonce((n) => n + 1)
  }

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
        {/* Only when it changes what the reader can expect of the map: it
            failed, or the phone is offline. Online, the download state rides
            on the Offline areas control over the map instead of a bar that
            took a row from the map on every visit. */}
        {(mapFailed && !mapReady) || !online ? (
          <div className="map-online-notice" role="note">
            {mapFailed && !mapReady ? (
              <>
                The map couldn't load. Check your connection and reload. GPS
                points are still on each stop's page.
              </>
            ) : mapOffline.overview ? (
              <>
                <strong>Offline.</strong> The whole park draws at driving scale
                {mapOffline.regions.length > 0
                  ? `; trailhead detail for ${listLabels(mapOffline.regions.map((r) => r.label))} (outlined).`
                  : '; no area is downloaded at trailhead scale.'}
              </>
            ) : (
              <>
                <strong>Offline</strong>, and the park map is not downloaded to
                this phone: only places you have already viewed will draw.{' '}
                <button type="button" className="map-online-notice__link" onClick={openOfflineAreas}>
                  Offline areas →
                </button>
              </>
            )}
          </div>
        ) : null}

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
            aria-pressed={tab === 'trip'}
            onClick={() => handleTab('trip')}
          >
            My trip
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
          // Hidden on the trip view as well: its pins are the plan's, which
          // these chips do not narrow.
          className={`map-filterbar${tab === 'info' || tab === 'trip' ? ' map-filterbar--hidden' : ''}`}
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
                  className={kindCounts[kind] === 0 ? 'map-filterbar__chip--empty' : undefined}
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
            {/* Stays while it is on, even once the plan empties, so the
                filter that is hiding every pin can always be turned off. */}
            {(plannedCount > 0 || plannedOnly) && (
              <ChipButton
                variant="filter"
                pressed={plannedOnly}
                aria-label={`My trip only: its ${plannedCount} pins and the trails of its hikes`}
                onClick={() => setPlannedOnly((v) => !v)}
              >
                My trip <span className="map-filterbar__count">{plannedCount}</span>
              </ChipButton>
            )}
          </div>
          <div className="map-filterbar__row map-trailfilter" role="group" aria-label="Filter trails">
            <ChipButton
              variant="filter"
              pressed={trailFilter.visible}
              aria-label="Show trails on the map"
              onClick={() => setTrailFilterState((f) => ({ ...f, visible: !f.visible }))}
            >
              Trails
            </ChipButton>
            {(['easy', 'moderate', 'strenuous'] as const).map((d) => (
              <ChipButton
                key={d}
                variant="filter"
                pressed={trailFilter.difficulties?.has(d) ?? false}
                aria-label={`${TRAIL_LABEL[d]} trails`}
                onClick={() =>
                  setTrailFilterState((f) => {
                    const next = new Set(f.difficulties ?? [])
                    if (next.has(d)) next.delete(d)
                    else next.add(d)
                    return { ...f, difficulties: next.size === 0 || next.size === 3 ? null : next }
                  })
                }
              >
                <span className="map-trailfilter__swatch" style={{ background: trailColors()[d] }} aria-hidden />
                {TRAIL_LABEL[d]}
              </ChipButton>
            ))}
            <label className="map-trailfilter__length">
              <span className="sr-only">Trail length</span>
              <select
                value={trailFilter.maxMiles ?? ''}
                disabled={!trailFilter.visible}
                onChange={(e) =>
                  setTrailFilterState((f) => ({ ...f, maxMiles: e.target.value ? Number(e.target.value) : null }))
                }
              >
                {LENGTH_CHOICES.map((c) => (
                  <option key={c.label} value={c.max ?? ''}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
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
            data-trip-view={tab === 'trip' || undefined}
          />

          <div className="map-view-controls" role="group" aria-label="Map view controls">
            <button
              type="button"
              className="map-view-controls__btn"
              aria-pressed={is3d}
              aria-label="3D terrain"
              onClick={toggle3d}
            >
              3D
            </button>
            <button type="button" className="map-view-controls__btn" onClick={resetView}>
              Reset
            </button>
            {/* A menu, not a row of links: it costs the map no height, and the
                empty first option means picking the same area twice still
                flies there (a select only reports changes). */}
            <label className="map-view-controls__goto">
              <span className="sr-only">Go to an area of the park</span>
              <select
                className="map-view-controls__btn map-view-controls__select"
                value=""
                onChange={(e) => {
                  const v = e.target.value
                  if (v) jumpTo(v as Region | 'park')
                }}
              >
                <option value="">Go to…</option>
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {REGION_JUMP_LABEL[r.id]}
                  </option>
                ))}
                <option value="park">Whole park</option>
              </select>
            </label>
            <button
              type="button"
              className="map-view-controls__btn map-view-controls__offline"
              data-state={mapDownloaded ? 'ready' : mapOffline.overview ? 'partial' : 'none'}
              aria-label={
                mapDownloaded
                  ? 'Offline areas: the whole map is on this device'
                  : `Offline areas: ${mapOffline.overview ? mapOffline.regions.length : 0} of ${OFFLINE_REGIONS.length} downloaded`
              }
              onClick={openOfflineAreas}
            >
              Offline{' '}
              <span className="map-view-controls__meter" aria-hidden>
                {mapDownloaded ? '✓' : `${mapOffline.overview ? mapOffline.regions.length : 0}/${OFFLINE_REGIONS.length}`}
              </span>
            </button>
            <MapSearch programs={programPlaces.points} onPick={pickSearch} />
          </div>

          {card && <MapCard selection={card} onClose={closeCard} onFlyTo={flyToCard} />}

          {mapReady && (tab === 'points' || tab === 'itineraries') && (hasDots || (zoomBand === 'far' && !kindFilter)) && (
            <p className="map-zoom-hint" role="note">
              {hasDots
                ? 'Dots are pins with no room to draw. Tap one or zoom in.'
                : 'Zoom in for parking, shuttle stops, picnic areas, and services, or tap a chip.'}
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
                    {/* Under the card it acts on, not below the whole list. */}
                    {selectedItinerary === key && (
                      <SeedItinerarySection
                        itinerary={key}
                        itemCount={planItemCount}
                        armed={seedConfirm.armed === key}
                        seeded={seeded?.key === key ? seeded : null}
                        tripOnly={plannedOnly}
                        dates={readTripDates() ?? plan.dates}
                        onSeed={() => seedFromMap(key)}
                        onShowTrip={() => handleTab('trip')}
                      />
                    )}
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

          <aside className="map-pane map-pane--trip" aria-hidden={tab !== 'trip'} aria-label="Your trip, day by day">
            <TripPanel
              days={tripDays}
              colors={colors}
              selectedDay={selectedDay}
              onSelectDay={selectTripDay}
              focusedItemId={focusedTripItem}
              onFocusItem={focusTripStop}
              onSetMode={setLegMode}
              onMove={moveTripItem}
              onRemove={removeItem}
              onPlayDay={playDay}
              dayEnd={dayEnd}
              onDayEnd={setDayEnd}
              graphState={roadGraph ? 'ready' : graphState}
              expanded={tripExpanded}
              onToggleExpanded={() => setTripExpanded((v) => !v)}
            />
          </aside>

          <section className="map-pane map-pane--info" aria-hidden={tab !== 'info'}>
            <InfoPane presentKinds={presentKinds} mapOffline={mapOffline} />
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

// The Itineraries pane's "Add to my trip": one button that puts the selected
// preset on the plan's dates (or, over a planned trip, arms to replace it),
// then says what landed and where to read it day by day.
function SeedItinerarySection({
  itinerary,
  itemCount,
  armed,
  seeded,
  tripOnly,
  dates,
  onSeed,
  onShowTrip,
}: {
  itinerary: ItineraryKey
  itemCount: number
  armed: boolean
  seeded: { note: string | null } | null
  tripOnly: boolean
  dates: { start: string; end: string }
  onSeed: () => void
  onShowTrip: () => void
}) {
  const { label } = ITINERARIES[itinerary]
  const noun = itemCount === 1 ? 'item' : 'items'
  const range = dates.start === dates.end ? shortDay(dates.start) : `${shortDay(dates.start)} to ${shortDay(dates.end)}`
  return (
    <div className="map-seed">
      <Button size="sm" variant={armed ? 'danger' : 'solid'} className="map-seed__btn" onClick={onSeed}>
        {armed
          ? `Replace your ${itemCount} planned ${noun}?`
          : itemCount === 0
            ? 'Add to my trip'
            : 'Replace my trip with this plan'}
      </Button>
      <p className="map-seed__sub">
        {armed ? (
          `Tap again to start over from ${label}. Anything else cancels.`
        ) : (
          <>
            Onto your dates, {range}. <Link to="/trip">Change them on the trip board</Link>.
          </>
        )}
      </p>
      {seeded && (
        <div className="map-seed__done" role="status">
          <p>
            {label} is on your trip.
            {tripOnly && ' The map now shows only your trip: its stops and the trails of its hikes. Turn off My trip above to see everything.'}
          </p>
          {seeded.note && <p className="map-seed__note">{seeded.note}</p>}
          <button type="button" className="map-seed__link" onClick={onShowTrip}>
            See it day by day →
          </button>
        </div>
      )}
    </div>
  )
}

function InfoPane({
  presentKinds,
  mapOffline,
}: {
  presentKinds: MapPinKind[]
  mapOffline: MapOffline
}) {
  const allAreas = mapOffline.overview && mapOffline.regions.length === OFFLINE_REGIONS.length
  return (
    <div className="map-info">
      <h1>How the map works offline</h1>
      <p className="lede">
        This map is built to work with zero bars. Download it once and the
        terrain and map tiles live on your device; the pins are part of the
        app itself.
      </p>

      <h2>Before you leave wifi</h2>
      <ol>
        <li>
          Download the <strong>overview</strong> below and each area you're
          visiting (the whole park is about 22 MB), and the photo packs in{' '}
          <Link to="/account">Account → Offline</Link>.
        </li>
        <li>
          {allAreas
            ? 'Done on this device. Every area works offline.'
            : mapOffline.overview && mapOffline.regions.length > 0
              ? `On this device: the overview and ${listLabels(mapOffline.regions.map((r) => r.label))}.`
              : 'Once downloaded, the map works offline.'}
        </li>
        <li>
          For turn-by-turn <em>driving</em> directions, also download an
          offline area in the Google Maps app: search <em>Yosemite National
          Park</em>, tap your profile photo → <strong>Offline maps</strong> →
          <strong> Select your own map</strong>, frame the park, download.
        </li>
      </ol>

      <section id="map-offline" className="map-info__offline" tabIndex={-1} aria-labelledby="map-offline-title">
        <h2 id="map-offline-title">Offline areas</h2>
        <DownloadManager
          only={(p) => MAP_PACK_IDS.includes(p.id)}
          intro={
            <p>
              The overview draws the whole park in 3D at driving scale, with
              every road and label; each area adds trailhead-scale detail. An
              area needs the overview, which downloads with it. Offline, the
              map outlines the areas on this device.
            </p>
          }
        />
      </section>

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
          <strong> Go to</strong> menu over the map flies it to one area of
          the park.
        </li>
        <li>
          Where pins crowd each other, the most useful one draws and the rest
          step down to small dots in their own colour: viewpoints and hikes
          first, then trailheads and drives, lodging and camping, then meals,
          and parking and services last. Tap a dot, or zoom in, and it opens
          into its pin. In 3D the far pins also draw smaller, the way the
          ground does. Nothing is removed: every dot is in the keyboard order
          and opens its popup on Enter.
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
          The map is 3D: drag with two fingers to tilt and turn it, tap
          <strong> 3D</strong> for the flat, north-up map, and
          <strong> Reset</strong> to come back to the Valley. The search
          box finds any stop, trail, parking lot, place to eat or program
          meeting point by name, offline.
        </li>
        <li>
          Every verified day hike is drawn on the terrain, green for easy,
          amber for moderate, red for strenuous; the Trails chips narrow them
          by difficulty and length. Tap one for its card, with the elevation
          profile and <strong>Fly to</strong>.
        </li>
        <li>
          Small accent squares are where the park's programs meet during your
          trip dates, numbered by how many; tap one for what starts there and
          when, and add any of them to your trip.
        </li>
        <li>
          <strong>My trip</strong> draws your plan day by day: numbered pins in
          the order each day runs, drives along the roads, walks dotted, the
          Valley shuttle dash-dotted, hikes along their trails, and the
          itinerary beside it with every time and every warning. Pick how you
          get between two stops there; the trip board's times follow.
        </li>
        <li>
          A moss checkmark marks a stop already in your trip plan.
        </li>
        <li>
          Parking, campground, entrance, visitor-center, shuttle-stop, picnic
          and services pins are navigation aids: a short note, the published
          hours where NPS publishes them, and a Directions button, no stop
          write-up. The Valley shuttle stops carry the number NPS paints on
          the sign; the shuttle is free and runs 7 a.m. to 10 p.m. Among the
          services, only the gas stations draw a fuel pump; the clinic carries
          a cross and the chargers "EV".
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
          Pins with a small filled peak are day-hike trailheads (a landmark
          draws its peak in outline). Tap one for
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
          Most pin coordinates are verified against NPS, USGS, and
          OpenStreetMap sources; the entrance, visitor-center, shuttle-stop,
          parking, picnic and services pins are quoted from the National Park
          Service's own records. About a third of the stop and trailhead pins
          are unsigned pullouts or off-trail spots that nobody has yet checked
          on the ground; their popups say so, and for those, trust the turnout
          described on the stop page over the precise pin.
        </li>
        <li>Map tiles: {MAP_ATTRIBUTION}.</li>
      </ul>
    </div>
  )
}
