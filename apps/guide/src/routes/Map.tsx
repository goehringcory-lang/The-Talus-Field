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
import { AMENITIES, REGIONS, REGION_SHORT, SECRET_SPOTS, stops as allStops, getItineraryDayPhotos, getStopById, isSecretGuideEntry, type AmenityT, type GuideStopT, type Region, type StopKind } from '../content'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import { HIDDEN_PIN_STROKE, KIND_STYLES, buildPinElement, directionsUrl, getKindStyle } from '../map/kinds'
import { getHikeById } from '../content'
import { hasTrack } from '../trails/track'
import { useTrack } from '../trails/useTrack'
import { announceTripAdd } from '../trip/addFeedback'
import { addStopToPlan, isStopPlanned, useTripPlan } from '../trip/useTripPlan'
import { buildMapStyle } from '../map/style'
import { isPackCompleted } from '../offline/useDownloads'
import { formatMiles, haversineMiles } from '../utils/geo'
import { popupPhotoUrl } from '../utils/photo'
import './Map.css'

type Tab = 'points' | 'itineraries' | 'info'

function isTab(value: string | null | undefined): value is Tab {
  return value === 'points' || value === 'itineraries' || value === 'info'
}

type UrlState = {
  tab: Tab
  itinerary: ItineraryKey | null
  stop: string | null
  kinds: StopKind[] | null // null = no kind narrowing (all kinds show)
  secret: boolean
  hike: string | null // hike id whose track overlays the map (?hike=)
}

const ALL_KINDS = Object.keys(KIND_STYLES) as StopKind[]

function isStopKind(value: string): value is StopKind {
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
  const kinds = kindsRaw ? [...new Set(kindsRaw.split(',').filter(isStopKind))] : null
  const hike = params.get('hike')
  return {
    tab: isTab(tab) ? tab : 'points',
    itinerary: isItineraryKey(itin) ? itin : null,
    stop: stop || null,
    kinds: kinds && kinds.length > 0 && kinds.length < ALL_KINDS.length ? kinds : null,
    secret: params.get('secret') !== '0',
    // Only hikes with a published track: an unknown id round-trips away.
    hike: hike && hasTrack(hike) ? hike : null,
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

  if (amenity.season) {
    const season = document.createElement('p')
    season.className = 'map-popup__excerpt'
    const em = document.createElement('em')
    em.textContent = amenity.season
    season.appendChild(em)
    root.appendChild(season)
  }

  const actions = document.createElement('p')
  actions.className = 'map-popup__actions'
  const dir = document.createElement('a')
  dir.className = 'map-popup__btn map-popup__btn--dir'
  dir.href = directionsUrl(amenity.coord)
  dir.target = '_blank'
  dir.rel = 'noopener'
  dir.textContent = 'Directions →'
  actions.appendChild(dir)
  root.appendChild(actions)
  return root
}

export default function Map() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})
  const amenityMarkersRef = useRef<Record<string, maplibregl.Marker>>({})
  const popupRef = useRef<maplibregl.Popup | null>(null)
  // Camera refits only when the itinerary context changes, not on filter
  // chip toggles: refitting on every tap yanks the map around.
  const lastFitKeyRef = useRef<string | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)
  const [mapDownloaded, setMapDownloaded] = useState(() => isPackCompleted('park-map'))

  // Device position from the locate control. The ref mirrors the state so the
  // selection effect can read the position at popup-open time without taking
  // it as a dependency: with trackUserLocation on, every GPS tick would
  // otherwise re-run easeTo and yank the camera back to the selected stop.
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const userPosRef = useRef<[number, number] | null>(null)
  const [geoDenied, setGeoDenied] = useState(false)
  const [outOfPark, setOutOfPark] = useState(false)

  // The pack can complete in another tab (or on /account in this one);
  // re-check whenever this tab regains focus so the offline notice is live.
  useEffect(() => {
    const recheck = () => setMapDownloaded(isPackCompleted('park-map'))
    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [])

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
  const [kindFilter, setKindFilter] = useState<Set<StopKind> | null>(() =>
    initial.kinds ? new Set(initial.kinds) : null,
  )
  const [showSecret, setShowSecret] = useState<boolean>(initial.secret)

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

  // Only stops with a coord can be mapped. Secret spots (region-less Secret
  // Guide entries) join the pin set alongside core and hidden stops.
  const mappableStops = useMemo<GuideStopT[]>(
    () => [...allStops, ...SECRET_SPOTS].filter((s) => !!s.coord),
    [],
  )

  // Kinds actually present in the stops and amenities, in KIND_STYLES
  // declaration order. Drives the chip row and the InfoPane legend.
  const presentKinds = useMemo(() => {
    const seen = new Set<GuideStopT['kind']>()
    for (const s of mappableStops) seen.add(s.kind)
    for (const a of AMENITIES) seen.add(a.kind)
    return ALL_KINDS.filter((k) => seen.has(k))
  }, [mappableStops])

  const toggleKind = useCallback(
    (kind: StopKind) => {
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
        if (kindFilter && !kindFilter.has(s.kind)) return false
        if (!showSecret && isSecretGuideEntry(s)) return false
        if (itineraryRegions) {
          return 'region' in s && itineraryRegions.has(s.region) && s.collection !== 'hidden'
        }
        return true
      }),
    [mappableStops, itineraryRegions, kindFilter, showSecret],
  )

  // Amenities follow the same kind and region narrowing but never join the
  // day-by-day lists or counts: on an itinerary view, "where do I park and
  // camp" for those regions is the point; park-wide clutter is not.
  const visibleAmenities = useMemo<AmenityT[]>(
    () =>
      AMENITIES.filter((a) => {
        if (kindFilter && !kindFilter.has(a.kind)) return false
        return !itineraryRegions || itineraryRegions.has(a.region)
      }),
    [itineraryRegions, kindFilter],
  )

  // Chip count badges: what enabling each kind yields under the OTHER active
  // filters (itinerary narrowing and the secret toggle), never the kind
  // filter itself, so a chip's number always states what tapping it shows.
  const kindCounts = useMemo(() => {
    const out = Object.fromEntries(presentKinds.map((k) => [k, 0])) as Record<StopKind, number>
    for (const s of mappableStops) {
      if (!showSecret && isSecretGuideEntry(s)) continue
      if (
        itineraryRegions &&
        !('region' in s && itineraryRegions.has(s.region) && s.collection !== 'hidden')
      ) {
        continue
      }
      out[s.kind]++
    }
    for (const a of AMENITIES) {
      if (itineraryRegions && !itineraryRegions.has(a.region)) continue
      out[a.kind]++
    }
    return out
  }, [mappableStops, itineraryRegions, showSecret, presentKinds])

  const allCount = useMemo(
    () => Object.values(kindCounts).reduce((a, b) => a + b, 0),
    [kindCounts],
  )
  const secretCount = useMemo(
    () => mappableStops.filter(isSecretGuideEntry).length,
    [mappableStops],
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
    })
  }, [tab, selectedItinerary, selectedStopId, kindFilter, showSecret, trackHikeId])

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
        positionOptions: { enableHighAccuracy: true },
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
      }
      geolocate.on('geolocate', (pos) => onFix(pos, false))
      // Fired instead of 'geolocate' when the fix falls outside maxBounds,
      // i.e. the reader is planning from home. Distances still render.
      geolocate.on('outofmaxbounds', (pos) => onFix(pos, true))
      geolocate.on('error', (err) => {
        if (err.code === 1) setGeoDenied(true)
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

      const el = buildPinElement(stop.kind, isSecretGuideEntry(stop))
      el.addEventListener('click', (e) => {
        // Don't let the click reach the map canvas: the shared popup is
        // closeOnClick, and MapLibre delivers the map's click after the
        // selection effect has opened the popup, closing it in the same
        // frame. Deep links and the sidebar never hit the canvas, which is
        // why only pin taps were affected.
        e.stopPropagation()
        selectStop(stop.id)
      })
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
      const el = buildPinElement(amenity.kind)
      el.addEventListener('click', (e) => {
        // Same canvas-click race as the stop pins above.
        e.stopPropagation()
        // Clear any stop selection so ?stop= doesn't keep pointing at a stop
        // whose popup this one just replaced.
        selectStop(null)
        popupRef.current
          ?.setLngLat(amenity.coord)
          .setDOMContent(buildAmenityPopupContent(amenity))
          .addTo(map)
      })
      amenityMarkersRef.current[amenity.id] = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(amenity.coord)
        .addTo(map)
    }
  }, [visibleAmenities, mapReady, selectStop])

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

  // Counts for the itinerary buttons, derived live.
  const counts = useMemo(() => {
    const out: Record<'all' | ItineraryKey, number> = {
      all: mappableStops.length,
      '1day': 0,
      '2day': 0,
      '3day': 0,
    }
    for (const key of ITINERARY_KEYS) {
      const regions = new Set(ITINERARIES[key].days.flatMap((d) => d.regions))
      out[key] = mappableStops.filter(
        (s) => 'region' in s && regions.has(s.region) && s.collection !== 'hidden',
      ).length
    }
    return out
  }, [mappableStops])

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

  // "Browse by area" groups for the points pane: the four regions in REGIONS
  // order plus a region-less "Secret spots" group. Derived from visibleStops
  // so a row can never point at a filtered-out marker; empty groups drop.
  const browseGroups = useMemo(() => {
    const groups: { id: string; label: string; stops: GuideStopT[] }[] = REGIONS.map((r) => ({
      id: r.id as string,
      label: REGION_SHORT[r.id],
      stops: visibleStops
        .filter((s) => 'region' in s && s.region === r.id)
        .sort((a, b) => a.order - b.order),
    }))
    const secretSpots = visibleStops
      .filter((s) => !('region' in s))
      .sort((a, b) => a.order - b.order)
    if (secretSpots.length > 0) {
      groups.push({ id: 'secret', label: 'Secret spots', stops: secretSpots })
    }
    return groups.filter((g) => g.stops.length > 0)
  }, [visibleStops])

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
            <>Map downloaded. Works offline, even in airplane mode.</>
          ) : (
            <>
              Viewing online.{' '}
              <Link className="map-online-notice__link" to="/account">
                Download the map for offline →
              </Link>
            </>
          )}
        </div>

        <nav className="map-tabbar" aria-label="Map view">
          <button
            type="button"
            className="map-tabbar__tab"
            aria-current={tab === 'points' ? 'page' : undefined}
            onClick={() => handleTab('points')}
          >
            GPS points
          </button>
          <button
            type="button"
            className="map-tabbar__tab"
            aria-current={tab === 'itineraries' ? 'page' : undefined}
            onClick={() => handleTab('itineraries')}
          >
            Itineraries
          </button>
          <button
            type="button"
            className="map-tabbar__tab"
            aria-current={tab === 'info' ? 'page' : undefined}
            onClick={() => handleTab('info')}
          >
            Information
          </button>
        </nav>

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
                  <span className="map-filterbar__dot" style={{ background: color }} aria-hidden />
                  {label} <span className="map-filterbar__count">{kindCounts[kind]}</span>
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
          <div ref={containerRef} className="map-page__map" />

          {mapReady && visibleStops.length === 0 && visibleAmenities.length === 0 && (
            <div className="map-page__empty" role="status">
              <p>No pins match these filters.</p>
              <button type="button" className="map-popup__btn" onClick={resetFilters}>
                Show all pins
              </button>
            </div>
          )}

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
              <span>Browse by area</span>
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
            {nearbyStops.length > 0 && (
              <div className="map-nearby">
                <h3 className="map-pane__title">Near you</h3>
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
            <h3 className="map-pane__title map-pane__title--browse">Browse by area</h3>
            <div className="map-browse">
              {browseGroups.map((group) => (
                <details key={group.id} className="map-browse__region">
                  <summary className="map-browse__summary">
                    <span>{group.label}</span>
                    <span className="map-browse__count">{group.stops.length}</span>
                  </summary>
                  <ul className="map-browse__list">
                    {group.stops.map((s) => {
                      const { color, label } = getKindStyle(s.kind)
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            className={`map-stop${s.id === selectedStopId ? ' map-stop--selected' : ''}`}
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
                </details>
              ))}
            </div>
            <p className="map-browse__footnote">Gold outline: Secret Guide entry.</p>
            </div>
          </aside>

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
  presentKinds: GuideStopT['kind'][]
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
          Open the <strong>GPS points</strong> tab. Pins are colored by what
          they are (see legend below).
        </li>
        <li>
          Use the filter chips above the map to narrow pins by kind, or hide
          the gold-outlined Secret Guide entries while you plan.
        </li>
        <li>
          Tap a pin. The popup has <strong>Open stop →</strong> (the full
          write-up in this guide) and <strong>Directions →</strong>.
        </li>
        <li>
          A moss checkmark marks a stop already in your trip plan.
        </li>
        <li>
          Parking-lot and campground pins are navigation aids: a short note
          and a Directions button, no stop write-up.
        </li>
        <li>
          Directions deep-links into the native Google Maps app, which routes
          you to the turnout using the offline area you downloaded. The
          handoff works without signal if that area is on your phone.
        </li>
      </ul>

      <h2>Itineraries tab</h2>
      <p>
        Filter the pin set by suggested trip length. 1 day stays in the
        valley; 2 days adds the southern rim; 3 days adds Tuolumne. Use
        the day-by-day list to walk through stops in order; the map pans
        to each selection.
      </p>

      <h2>Legend</h2>
      <ul className="map-legend" style={{ marginTop: 8 }}>
        {presentKinds.map((kind) => {
          const { color, label } = KIND_STYLES[kind]
          return (
            <li key={kind} className="map-legend__item">
              <span
                className="map-legend__dot"
                style={{ background: color }}
                aria-hidden
              />
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
          Most pin coordinates are verified against NPS and USGS sources. A
          few unsigned pullouts and off-trail spots are still flagged for a
          ground check; for those, trust the turnout described in the stop
          page over the precise pin.
        </li>
        <li>Map tiles: Esri, USGS. © OpenStreetMap contributors.</li>
      </ul>
    </div>
  )
}
