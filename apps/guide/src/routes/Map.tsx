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
import { AMENITIES, SECRET_SPOTS, stops as allStops, getStopById, isSecretGuideEntry, type AmenityT, type GuideStopT, type Region } from '../content'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import { HIDDEN_PIN_STROKE, KIND_STYLES, buildPinElement, directionsUrl, getKindStyle } from '../map/kinds'
import { announceTripAdd } from '../trip/addFeedback'
import { addStopToPlan, isStopPlanned } from '../trip/useTripPlan'
import { buildMapStyle } from '../map/style'
import { isPackCompleted } from '../offline/useDownloads'
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
}

function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search)
  const tab = params.get('tab')
  const itin = params.get('itinerary')
  const stop = params.get('stop')
  return {
    tab: isTab(tab) ? tab : 'points',
    itinerary: isItineraryKey(itin) ? itin : null,
    stop: stop || null,
  }
}

function writeUrlState(next: UrlState) {
  const params = new URLSearchParams()
  if (next.tab && next.tab !== 'points') params.set('tab', next.tab)
  if (next.itinerary) params.set('itinerary', next.itinerary)
  if (next.stop) params.set('stop', next.stop)
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
function buildPopupContent(stop: GuideStopT, onOpenStop: (id: string) => void): HTMLElement {
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

  const [mapReady, setMapReady] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)
  const [mapDownloaded, setMapDownloaded] = useState(() => isPackCompleted('park-map'))

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

  // Only stops with a coord can be mapped. Secret spots (region-less Secret
  // Guide entries) join the pin set alongside core and hidden stops.
  const mappableStops = useMemo<GuideStopT[]>(
    () => [...allStops, ...SECRET_SPOTS].filter((s) => !!s.coord),
    [],
  )

  // The itinerary's region set, or null when no itinerary narrows the map.
  const itineraryRegions = useMemo<Set<Region> | null>(() => {
    if (tab !== 'itineraries' || !selectedItinerary) return null
    return new Set(ITINERARIES[selectedItinerary].days.flatMap((d) => d.regions))
  }, [selectedItinerary, tab])

  // Filter by itinerary when one is selected and the itineraries tab is active.
  // Secret Guide entries (hidden stops and region-less secret spots) are
  // excluded from itineraries: the presets are the mainstream path, and
  // itinerary days are derived from regions, so without this filter the
  // premium set would silently inflate every preset.
  const visibleStops = useMemo<GuideStopT[]>(() => {
    if (!itineraryRegions) return mappableStops
    return mappableStops.filter(
      (s) => 'region' in s && itineraryRegions.has(s.region) && s.collection !== 'hidden',
    )
  }, [mappableStops, itineraryRegions])

  // Amenities follow the same region narrowing but never join the day-by-day
  // lists or counts: on an itinerary view, "where do I park and camp" for
  // those regions is the point; park-wide clutter is not.
  const visibleAmenities = useMemo<AmenityT[]>(() => {
    if (!itineraryRegions) return AMENITIES
    return AMENITIES.filter((a) => itineraryRegions.has(a.region))
  }, [itineraryRegions])

  // Sync state to URL.
  useEffect(() => {
    writeUrlState({ tab, itinerary: selectedItinerary, stop: selectedStopId })
  }, [tab, selectedItinerary, selectedStopId])

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
      attributionControl: { compact: true },
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left')

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

    map.fitBounds(bounds, { padding: 48, maxZoom: 12, animate: false })
  }, [visibleStops, mapReady, selectStop])

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
    popup.setLngLat(lngLat).setDOMContent(buildPopupContent(stop, openStop)).addTo(map)
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

  // Legend: only the kinds actually present in the stops and amenities.
  const presentKinds = useMemo(() => {
    const seen = new Set<GuideStopT['kind']>()
    for (const s of mappableStops) seen.add(s.kind)
    for (const a of AMENITIES) seen.add(a.kind)
    return Array.from(seen)
  }, [mappableStops])

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

        <div className="map-page__stage">
          <div ref={containerRef} className="map-page__map" />

          <aside className="map-pane map-pane--points" aria-hidden={tab !== 'points'}>
            <h3 className="map-pane__title">Legend</h3>
            <ul className="map-legend">
              {presentKinds.map((kind) => {
                const { color, label } = getKindStyle(kind)
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
                    const stopsInDay = mappableStops.filter(
                      (s) => 'region' in s && day.regions.includes(s.region) && s.collection !== 'hidden',
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

type ItineraryButtonProps = {
  label: string
  subtitle: string
  count: number
  selected: boolean
  onClick: () => void
}

function ItineraryButton({ label, subtitle, count, selected, onClick }: ItineraryButtonProps) {
  return (
    <button
      type="button"
      className={`map-itinerary${selected ? ' map-itinerary--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="map-itinerary__label">{label}</span>
      <span className="map-itinerary__sub">{subtitle}</span>
      <span className="map-itinerary__count">{count} stops</span>
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
          Tap a pin. The popup has <strong>Open stop →</strong> (the full
          write-up in this guide) and <strong>Directions →</strong>.
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
