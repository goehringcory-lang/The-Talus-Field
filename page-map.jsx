/* global React */
// =============================================================================
// MAP PAGE — `/map` route. Google Maps JavaScript API + itinerary sidebar.
//
// The Maps API <script> tag lives in index.html (loaded async). This component
// fetches /points.geojson, waits for window.google.maps to be ready, then
// initializes a single map. A left sidebar lets visitors pick from preset
// itineraries (1/2/3 day) which filter the visible markers by region.
//
// API KEY: set in index.html, restricted to thetalusfieldjournal.com and
// localhost:8765 in the Google Cloud console. Maps JS API must remain enabled.
// =============================================================================

const { useEffect, useMemo, useRef, useState, useCallback } = React;

const POINTS_URL = "/points.geojson?v=7";

// Itinerary presets. Each is a list of "days", each day pinned to one or more
// region keys from points.geojson. Stop counts in the sidebar are derived
// from the actual feature set at render time, so adding/removing points
// updates the UI without touching this config.
const ITINERARIES = {
  "1day": {
    label: "1 day",
    subtitle: "Yosemite Valley",
    days: [{ name: "Day 1 — Yosemite Valley", regions: ["valley"] }],
  },
  "2day": {
    label: "2 days",
    subtitle: "Valley + Glacier Point & Mariposa",
    days: [
      { name: "Day 1 — Yosemite Valley", regions: ["valley"] },
      { name: "Day 2 — Glacier Point & Mariposa Grove", regions: ["glacier-mariposa"] },
    ],
  },
  "3day": {
    label: "3 days",
    subtitle: "+ Tuolumne Meadows",
    days: [
      { name: "Day 1 — Yosemite Valley", regions: ["valley"] },
      { name: "Day 2 — Glacier Point & Mariposa Grove", regions: ["glacier-mariposa"] },
      { name: "Day 3 — Tuolumne Meadows", regions: ["tuolumne"] },
    ],
  },
};

const ITINERARY_KEYS = ["1day", "2day", "3day"];

// Pin color + display label per category. Categories come from
// points.geojson — add a new entry here whenever a new category is
// introduced. The fallback color is used for any category not listed.
const CATEGORY_STYLES = {
  hike:    { color: "#2f8a3e", label: "Hike" },
  vista:   { color: "#1e6fb8", label: "Vista" },
  picnic:  { color: "#e07a1a", label: "Picnic" },
  parking: { color: "#6b6b6b", label: "Parking" },
};
const CATEGORY_FALLBACK = { color: "#666", label: "Other" };

function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_FALLBACK;
}

// Teardrop pin shape, anchored at the tip. Rendered as a Google Maps
// Symbol so we can recolor without shipping image assets.
const PIN_PATH =
  "M 0,0 C -2,-18 -11,-22 -11,-30 A 11,11 0 1,1 11,-30 C 11,-22 2,-18 0,0 z";

function buildMarkerIcon(category) {
  const { color } = getCategoryStyle(category);
  return {
    path: PIN_PATH,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 1,
    anchor: new window.google.maps.Point(0, 0),
    labelOrigin: new window.google.maps.Point(0, -28),
  };
}

// ---------------------------------------------------------------------------
// URL state helpers. /map?itinerary=2day&stop=tunnel-view
// ---------------------------------------------------------------------------
function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const itin = params.get("itinerary");
  const stop = params.get("stop");
  return {
    itinerary: ITINERARY_KEYS.includes(itin) ? itin : null,
    stop: stop || null,
  };
}

function writeUrlState({ itinerary, stop }) {
  const params = new URLSearchParams();
  if (itinerary) params.set("itinerary", itinerary);
  if (stop) params.set("stop", stop);
  const qs = params.toString();
  const newUrl = "/map" + (qs ? `?${qs}` : "");
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, "", newUrl);
  }
}

// ---------------------------------------------------------------------------
// Polls window.google.maps for up to 8s. The script in index.html loads
// async, so the namespace may not exist yet when MapPage mounts.
// ---------------------------------------------------------------------------
function waitForGoogleMaps(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const start = Date.now();
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        resolve(window.google.maps);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(
          new Error(
            "Google Maps API didn't load. Check the API key in index.html and that the Maps JavaScript API is enabled in the Cloud console."
          )
        );
      }
    }, 100);
  });
}

function MapPage() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // id -> google.maps.Marker
  const infoRef = useRef(null); // single shared InfoWindow

  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const initial = useMemo(() => readUrlState(), []);
  const [selectedItinerary, setSelectedItinerary] = useState(initial.itinerary);
  const [selectedStopId, setSelectedStopId] = useState(initial.stop);

  // Fetch points.geojson once.
  useEffect(() => {
    let cancelled = false;
    fetch(POINTS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${POINTS_URL}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFeatures((data && data.features) || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setFeatures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync state back to the URL.
  useEffect(() => {
    writeUrlState({ itinerary: selectedItinerary, stop: selectedStopId });
  }, [selectedItinerary, selectedStopId]);

  // Restore state from URL on browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const next = readUrlState();
      setSelectedItinerary(next.itinerary);
      setSelectedStopId(next.stop);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Derive the visible feature set from the selected itinerary.
  const visibleFeatures = useMemo(() => {
    if (!features) return [];
    if (!selectedItinerary) return features;
    const regions = new Set(
      ITINERARIES[selectedItinerary].days.flatMap((d) => d.regions)
    );
    return features.filter((f) => regions.has(f.properties.region));
  }, [features, selectedItinerary]);

  // ---- Map init (runs once, after features have loaded) -------------------
  useEffect(() => {
    if (mapRef.current) return;
    if (!features || features.length === 0) return;
    if (!containerRef.current) return;

    waitForGoogleMaps()
      .then((maps) => {
        const map = new maps.Map(containerRef.current, {
          center: { lat: 37.85, lng: -119.55 },
          zoom: 10,
          mapTypeId: "terrain",
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy",
        });
        mapRef.current = map;
        infoRef.current = new maps.InfoWindow();
        // Flip the gate so the marker reconciliation effect can run.
        setMapReady(true);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [features]);

  // ---- Marker reconciliation (runs whenever visibleFeatures changes) ------
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map) return;
    const maps = window.google.maps;

    // Clear existing markers.
    for (const id of Object.keys(markersRef.current)) {
      markersRef.current[id].setMap(null);
    }
    markersRef.current = {};

    if (visibleFeatures.length === 0) return;

    // Add markers for the visible set.
    const bounds = new maps.LatLngBounds();
    for (const feature of visibleFeatures) {
      const [lng, lat] = feature.geometry.coordinates;
      const p = feature.properties;
      const position = { lat, lng };
      bounds.extend(position);

      const marker = new maps.Marker({
        position,
        map,
        title: p.name,
        icon: buildMarkerIcon(p.category),
      });
      marker.addListener("click", () => {
        infoRef.current.setContent(buildInfoHtml(p));
        infoRef.current.open({ anchor: marker, map });
        setSelectedStopId(p.id);
      });
      markersRef.current[p.id] = marker;
    }

    // Reframe to the new set, with a zoom cap so single-region itineraries
    // don't zoom to street level.
    map.fitBounds(bounds, 40);
    const listener = maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > 12) map.setZoom(12);
    });
    return () => {
      maps.event.removeListener(listener);
    };
  }, [visibleFeatures, mapReady]);

  // ---- Selection effect: pan/zoom to selected stop, open InfoWindow -------
  useEffect(() => {
    if (!mapReady || !selectedStopId) return;
    const map = mapRef.current;
    const marker = markersRef.current[selectedStopId];
    if (!map || !marker) return;
    map.panTo(marker.getPosition());
    if (map.getZoom() < 13) map.setZoom(13);
    const props = getFeatureProps(visibleFeatures, selectedStopId);
    infoRef.current.setContent(buildInfoHtml(props));
    infoRef.current.open({ anchor: marker, map });
  }, [selectedStopId, mapReady, visibleFeatures]);

  const handleSelectItinerary = useCallback((key) => {
    setSelectedItinerary(key);
    setSelectedStopId(null); // clear stop when itinerary changes
  }, []);

  const handleSelectStop = useCallback((id) => {
    setSelectedStopId(id);
  }, []);

  if (features === null) {
    return (
      <div className="map-page map-page--loading">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      <ItinerarySidebar
        features={features}
        selectedItinerary={selectedItinerary}
        selectedStopId={selectedStopId}
        onSelectItinerary={handleSelectItinerary}
        onSelectStop={handleSelectStop}
      />
      <div className="map-page__main">
        {error && (
          <div className="map-page__error" role="alert">
            Map failed to load: {error}
          </div>
        )}
        <div ref={containerRef} id="map" className="map-page__map" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar: itinerary buttons + day-by-day stop list.
// ---------------------------------------------------------------------------
function ItinerarySidebar({
  features,
  selectedItinerary,
  selectedStopId,
  onSelectItinerary,
  onSelectStop,
}) {
  // Stop counts per itinerary, derived live.
  const counts = useMemo(() => {
    const all = features.length;
    const out = { null: all };
    for (const key of ITINERARY_KEYS) {
      const regions = new Set(
        ITINERARIES[key].days.flatMap((d) => d.regions)
      );
      out[key] = features.filter((f) => regions.has(f.properties.region)).length;
    }
    return out;
  }, [features]);

  return (
    <aside className="map-page__sidebar">
      <header className="map-sidebar__header">
        <h2 className="map-sidebar__title">Trip planner</h2>
        <p className="map-sidebar__subtitle">Pick a length, see suggested stops.</p>
      </header>

      <div className="map-sidebar__section">
        <h3 className="map-sidebar__section-label">Itineraries</h3>
        <ul className="map-sidebar__itineraries">
          <li>
            <ItineraryButton
              label="All locations"
              subtitle="Every region · Hetch Hetchy included"
              count={counts.null}
              selected={selectedItinerary === null}
              onClick={() => onSelectItinerary(null)}
            />
          </li>
          {ITINERARY_KEYS.map((key) => {
            const meta = ITINERARIES[key];
            return (
              <li key={key}>
                <ItineraryButton
                  label={meta.label}
                  subtitle={meta.subtitle}
                  count={counts[key]}
                  selected={selectedItinerary === key}
                  onClick={() => onSelectItinerary(key)}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {selectedItinerary && (
        <div className="map-sidebar__section">
          <h3 className="map-sidebar__section-label">Day by day</h3>
          <div className="map-sidebar__days">
            {ITINERARIES[selectedItinerary].days.map((day) => {
              const stopsInDay = features.filter((f) =>
                day.regions.includes(f.properties.region)
              );
              return (
                <section key={day.name} className="map-sidebar__day">
                  <h4 className="map-sidebar__day-name">
                    {day.name}
                    <span className="map-sidebar__day-count">{stopsInDay.length}</span>
                  </h4>
                  <ul className="map-sidebar__stops">
                    {stopsInDay.map((f) => {
                      const p = f.properties;
                      const isSelected = p.id === selectedStopId;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            className={`map-sidebar__stop${isSelected ? " map-sidebar__stop--selected" : ""}`}
                            onClick={() => onSelectStop(p.id)}
                          >
                            <span className="map-sidebar__stop-name">{p.name}</span>
                            <span
                              className="map-sidebar__stop-cat"
                              style={{ color: getCategoryStyle(p.category).color }}
                            >
                              {p.category}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      )}

      <CategoryLegend features={features} />
    </aside>
  );
}

// Legend keyed off the categories that actually appear in the current
// feature set, so it stays in sync with points.geojson without manual edits.
function CategoryLegend({ features }) {
  const present = useMemo(() => {
    const seen = new Set();
    for (const f of features) {
      if (f.properties && f.properties.category) seen.add(f.properties.category);
    }
    return Array.from(seen).sort();
  }, [features]);

  if (present.length === 0) return null;

  return (
    <div className="map-sidebar__section">
      <h3 className="map-sidebar__section-label">Legend</h3>
      <ul className="map-sidebar__legend">
        {present.map((cat) => {
          const { color, label } = getCategoryStyle(cat);
          return (
            <li key={cat} className="map-sidebar__legend-item">
              <span
                className="map-sidebar__legend-dot"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="map-sidebar__legend-label">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ItineraryButton({ label, subtitle, count, selected, onClick }) {
  return (
    <button
      type="button"
      className={`map-sidebar__itinerary${selected ? " map-sidebar__itinerary--selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="map-sidebar__itinerary-label">{label}</span>
      <span className="map-sidebar__itinerary-sub">{subtitle}</span>
      <span className="map-sidebar__itinerary-count">{count} stops</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getFeatureProps(features, id) {
  const f = features.find((x) => x.properties.id === id);
  return f ? f.properties : {};
}

function buildInfoHtml(p) {
  const blurb = p.blurb ? `<p style="margin:6px 0 0;">${escapeHtml(p.blurb)}</p>` : "";
  const style = getCategoryStyle(p.category);
  const cat = p.category
    ? `<span style="display:inline-flex;align-items:center;gap:6px;text-transform:uppercase;font-size:11px;letter-spacing:0.06em;color:${style.color};font-weight:600;">
         <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${style.color};"></span>
         ${escapeHtml(p.category)}
       </span>`
    : "";
  // Only render a Google Maps link when the stop carries a verified URL —
  // synthesizing one from coordinates would point at a generic dropped pin
  // rather than the named place with its photos and reviews.
  const gmaps = p.gmapsUrl
    ? `<p style="margin:8px 0 0;"><a href="${escapeHtml(p.gmapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;">Open in Google Maps →</a></p>`
    : "";
  return `
    <div style="font:14px/1.4 system-ui,sans-serif;max-width:240px;color:#222;">
      <strong style="font-size:15px;">${escapeHtml(p.name || "")}</strong><br/>
      ${cat}
      ${blurb}
      ${gmaps}
    </div>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

window.MapPage = MapPage;
