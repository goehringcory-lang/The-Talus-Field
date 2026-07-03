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
import { Link, useNavigate } from 'react-router-dom'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import GatedChrome from '../components/GatedChrome'
import { stops as allStops, getStopById, type StopT } from '../content'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import { KIND_STYLES, buildPinElement, directionsUrl, getKindStyle } from '../map/kinds'
import { announceTripAdd } from '../trip/addFeedback'
import { addStopToPlan, isStopPlanned } from '../trip/useTripPlan'
import { buildMapStyle } from '../map/style'
import { isPackCompleted } from '../offline/useDownloads'
import { responsiveBase } from '../utils/photo'
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
function buildPopupContent(stop: StopT, onOpenStop: (id: string) => void): HTMLElement {
  const style = getKindStyle(stop.kind)
  const root = document.createElement('div')
  root.className = 'map-popup'

  const photo = stop.photos[0]
  if (photo) {
    const img = document.createElement('img')
    img.src = `${responsiveBase(photo.src)}-400.jpg`
    img.alt = ''
    img.loading = 'lazy'
    img.className = 'map-popup__photo'
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
  excerpt.textContent = extractExcerpt(stop.body)
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

export default function Map() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Record<string, maplibregl.Marker>>({})
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const mapDownloaded = useMemo(() => isPackCompleted('park-map'), [])

  const initial = useMemo(() => readUrlState(), [])
  const [tab, setTab] = useState<Tab>(initial.tab)
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryKey | null>(initial.itinerary)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(initial.stop)

  // Only stops with a coord can be mapped.
  const mappableStops = useMemo<StopT[]>(() => allStops.filter((s) => !!s.coord), [])

  // Filter by itinerary when one is selected and the itineraries tab is active.
  const visibleStops = useMemo<StopT[]>(() => {
    if (tab !== 'itineraries' || !selectedItinerary) return mappableStops
    const regions = new Set(
      ITINERARIES[selectedItinerary].days.flatMap((d) => d.regions),
    )
    return mappableStops.filter((s) => regions.has(s.region))
  }, [mappableStops, selectedItinerary, tab])

  // Sync state to URL.
  useEffect(() => {
    writeUrlState({ tab, itinerary: selectedItinerary, stop: selectedStopId })
  }, [tab, selectedItinerary, selectedStopId])

  // Restore from URL on browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const next = readUrlState()
      setTab(next.tab)
      setSelectedItinerary(next.itinerary)
      setSelectedStopId(next.stop)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

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
    popupRef.current = new maplibregl.Popup({ maxWidth: '300px', offset: 30 })
    map.on('load', () => setMapReady(true))

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

      const el = buildPinElement(stop.kind)
      el.addEventListener('click', () => setSelectedStopId(stop.id))
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map)
      markersRef.current[stop.id] = marker
    }

    map.fitBounds(bounds, { padding: 48, maxZoom: 12, animate: false })
  }, [visibleStops, mapReady])

  // Selection effect — pan/zoom + open popup when selectedStopId changes.
  useEffect(() => {
    if (!mapReady || !selectedStopId) return
    const map = mapRef.current
    const marker = markersRef.current[selectedStopId]
    const popup = popupRef.current
    const stop = getStopById(selectedStopId)
    if (!map || !marker || !popup || !stop) return

    const lngLat = marker.getLngLat()
    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 13) })
    popup.setLngLat(lngLat).setDOMContent(buildPopupContent(stop, openStop)).addTo(map)
  }, [selectedStopId, mapReady, visibleStops, openStop])

  const handleTab = useCallback((next: Tab) => {
    setTab(next)
  }, [])

  const handleSelectItinerary = useCallback((key: ItineraryKey | null) => {
    setSelectedItinerary(key)
    setSelectedStopId(null)
  }, [])

  const handleSelectStop = useCallback((id: string) => {
    setSelectedStopId(id)
  }, [])

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
      out[key] = mappableStops.filter((s) => regions.has(s.region)).length
    }
    return out
  }, [mappableStops])

  // Legend: only the kinds actually present in the stops.
  const presentKinds = useMemo(() => {
    const seen = new Set<StopT['kind']>()
    for (const s of mappableStops) seen.add(s.kind)
    return Array.from(seen)
  }, [mappableStops])

  return (
    <GatedChrome>
      <div className="map-page">
        <div className="map-online-notice" role="note">
          {mapDownloaded ? (
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
                    const stopsInDay = mappableStops.filter((s) =>
                      day.regions.includes(s.region),
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
  presentKinds: StopT['kind'][]
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
      </ul>

      <h2>The fine print</h2>
      <ul>
        <li>
          This map shows where things are; it does not calculate driving
          routes. Routing happens in Google Maps via the Directions button.
        </li>
        <li>
          A handful of coordinates are still flagged for verification in the
          source file. Trust the turnout names over the precise pin until
          that pass is done.
        </li>
        <li>Map tiles: Esri, USGS. © OpenStreetMap contributors.</li>
      </ul>
    </div>
  )
}
