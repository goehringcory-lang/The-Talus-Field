// =============================================================================
// /map route — three-tab map experience for the Field Guide PWA.
//
// Tabs: GPS points / Itineraries / Information.
// The Google Map instance is created once on mount and lives inside a div that
// is never unmounted (panes overlay it via absolute positioning + visibility
// toggling). State is reflected in the URL:
//   /map?tab=points|itineraries|info&itinerary=1day|2day|3day&stop=<id>
//
// API key wiring: VITE_GOOGLE_MAPS_API_KEY is substituted into index.html at
// build time; the Maps JS bootstrap is loaded async there. This component just
// polls for window.google.maps to be ready.
// =============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import GatedChrome from '../components/GatedChrome'
import { stops as allStops, getStopById, type StopT } from '../content'
import {
  ITINERARIES,
  ITINERARY_KEYS,
  isItineraryKey,
  type ItineraryKey,
} from '../content/itineraries'
import {
  KIND_STYLES,
  buildInfoHtml,
  buildMarkerIcon,
  directionsUrl,
  getKindStyle,
  waitForGoogleMaps,
} from '../map/googleMaps'
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

export default function Map() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Record<string, google.maps.Marker>>({})
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

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

  // Map init — runs once. Polls for window.google.maps then creates the Map.
  useEffect(() => {
    if (mapRef.current) return
    if (!containerRef.current) return

    let cancelled = false
    waitForGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) return
        const map = new maps.Map(containerRef.current, {
          center: { lat: 37.85, lng: -119.55 },
          zoom: 10,
          mapTypeId: 'terrain',
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'greedy',
        })
        mapRef.current = map
        infoWindowRef.current = new maps.InfoWindow({ maxWidth: 300 })
        setMapReady(true)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Marker reconciliation — runs whenever the visible set changes.
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return
    const maps = window.google.maps

    // Clear existing markers.
    for (const id of Object.keys(markersRef.current)) {
      markersRef.current[id].setMap(null)
    }
    markersRef.current = {}

    if (visibleStops.length === 0) return

    const bounds = new maps.LatLngBounds()
    for (const stop of visibleStops) {
      if (!stop.coord) continue
      const [lng, lat] = stop.coord
      const position = { lat, lng }
      bounds.extend(position)

      const marker = new maps.Marker({
        position,
        map,
        title: stop.title,
        icon: buildMarkerIcon(stop.kind),
      })
      marker.addListener('click', () => {
        const iw = infoWindowRef.current
        if (!iw) return
        iw.setContent(buildInfoHtml(stop))
        iw.open({ anchor: marker, map })
        setSelectedStopId(stop.id)
      })
      markersRef.current[stop.id] = marker
    }

    map.fitBounds(bounds, 40)
    const listener = maps.event.addListenerOnce(map, 'idle', () => {
      if ((map.getZoom() ?? 0) > 12) map.setZoom(12)
    })
    return () => {
      maps.event.removeListener(listener)
    }
  }, [visibleStops, mapReady])

  // Selection effect — pan/zoom + open InfoWindow when selectedStopId changes.
  useEffect(() => {
    if (!mapReady || !selectedStopId) return
    const map = mapRef.current
    const marker = markersRef.current[selectedStopId]
    const iw = infoWindowRef.current
    const stop = getStopById(selectedStopId)
    if (!map || !marker || !iw || !stop) return
    const pos = marker.getPosition()
    if (pos) map.panTo(pos)
    if ((map.getZoom() ?? 0) < 13) map.setZoom(13)
    iw.setContent(buildInfoHtml(stop))
    iw.open({ anchor: marker, map })
  }, [selectedStopId, mapReady, visibleStops])

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
          {error && (
            <div className="map-page__error" role="alert">
              Map failed to load: {error}
            </div>
          )}

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
            <InfoPane presentKinds={presentKinds} />
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

function InfoPane({ presentKinds }: { presentKinds: StopT['kind'][] }) {
  // Sample directions URL for the "what the link looks like" example below.
  const sample = directionsUrl([-119.6776, 37.7158])
  return (
    <div className="map-info">
      <h1>How to use the map offline</h1>
      <p className="lede">
        The embedded map needs a signal. Routing inside Yosemite does not.
        Set up your phone before you arrive and the map will keep working
        once the bars drop to nothing.
      </p>

      <h2>Before you leave home</h2>
      <ol>
        <li>
          Open the Google Maps app and search <em>Yosemite National Park</em>.
        </li>
        <li>
          Tap your profile photo → <strong>Offline maps</strong> →
          <strong> Select your own map</strong>.
        </li>
        <li>
          Frame the box to cover the valley, Glacier Point Road, and Tioga
          Road if you're going to the high country. Download.
        </li>
        <li>
          Confirm the download is finished before you leave cell service.
          It expires after about a year; refresh it when you re-enter coverage.
        </li>
      </ol>

      <h2>In the park</h2>
      <ul>
        <li>
          Open this page on the <strong>GPS points</strong> tab. Pins are
          colored by what they are (see legend below).
        </li>
        <li>
          Tap a pin. The popup has an <strong>Open in Google Maps →</strong>
          button.
        </li>
        <li>
          That button deep-links into the native Google Maps app, which uses
          the offline area you downloaded to route you to the turnout.
          Apple Maps does not have this data.
        </li>
        <li>
          The link looks like <code>{sample}</code>. Save it directly if
          you want to share a pin.
        </li>
      </ul>

      <h2>Itineraries tab</h2>
      <p>
        Filter the pin set by suggested trip length. 1 day stays in the
        valley; 2 days adds the southern rim; 3 days adds Tuolumne. Use
        the day-by-day list to walk through stops in order — the map pans
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

      <h2>What this map does not do</h2>
      <ul>
        <li>It does not work fully offline by itself — only the handoff to Google Maps does.</li>
        <li>It does not route. Routing happens in Google Maps with the offline area you downloaded.</li>
        <li>
          A handful of coordinates here are still flagged for verification in
          the source file. Trust the turnout names over the precise pin
          until that pass is done.
        </li>
      </ul>
    </div>
  )
}
