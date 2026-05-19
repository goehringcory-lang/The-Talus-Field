/* global React */
// =============================================================================
// MAP PAGE — `/map` route. Google Maps JavaScript API + region-grouped trip
// builder. Visitors browse Yosemite pins by area, tap pins on the map or "+"
// buttons in the sidebar to assemble a trip. The trip persists in localStorage
// so it survives a refresh.
//
// API KEY: set in index.html, restricted to thetalusfieldjournal.com and
// localhost:8765 in the Google Cloud console. Maps JS API + marker library
// must remain enabled. mapId is required by AdvancedMarkerElement.
// =============================================================================

const { useEffect, useMemo, useRef, useState, useCallback } = React;

const POINTS_URL = "/points.geojson?v=17";
const STORAGE_KEY = "tfg.trip";
const STORAGE_VERSION = 1;
const TRIP_CAP = 20;
const TRIP_PIN_COLOR = "#7a8f5a"; // moss — matches --moss CSS var on the rail

// Four-bucket region taxonomy. `keys` lists the geojson `region` values that
// roll up into this UI group; "tuolumne-area" intentionally folds in Hetch
// Hetchy so the high country reads as a single section.
const REGIONS = [
  { id: "valley",         label: "Yosemite Valley",                  keys: ["valley"] },
  { id: "glacier-point",  label: "Greater Valley & Glacier Point",   keys: ["glacier-point"] },
  { id: "wawona",         label: "Wawona",                           keys: ["wawona"] },
  { id: "tuolumne-area",  label: "Tuolumne & Hetch Hetchy",          keys: ["tuolumne", "hetch-hetchy"] },
];

// Suggested-trip presets keyed by sidebar region IDs. Each preset replaces
// (not appends to) the user's current trip when clicked.
const QUICK_PICKS = [
  { id: "1day", label: "1 day",  regionIds: ["valley"] },
  { id: "2day", label: "2 days", regionIds: ["valley", "glacier-point"] },
  { id: "3day", label: "3 days", regionIds: ["valley", "glacier-point", "tuolumne-area"] },
];

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

// ---------------------------------------------------------------------------
// URL state helpers. /map?stop=tunnel-view  (no more ?itinerary= — the
// day-presets are now in-sidebar quick picks that don't persist to URL.)
// ---------------------------------------------------------------------------
function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  return { stop: params.get("stop") || null };
}

function writeUrlState({ stop }) {
  const params = new URLSearchParams();
  if (stop) params.set("stop", stop);
  const qs = params.toString();
  const newUrl = "/map" + (qs ? `?${qs}` : "");
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, "", newUrl);
  }
}

// ---------------------------------------------------------------------------
// localStorage helpers. Wrapped to survive Safari private mode (setItem
// throws) and quota errors. Falls back silently to in-memory state.
// ---------------------------------------------------------------------------
function loadTripFromStorage(validIds) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.ids)) return [];
    const seen = new Set();
    const out = [];
    for (const id of parsed.ids) {
      if (typeof id !== "string") continue;
      if (!validIds.has(id)) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
      if (out.length >= TRIP_CAP) break;
    }
    return out;
  } catch (_e) {
    return [];
  }
}

function saveTripToStorage(ids) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: STORAGE_VERSION, ids })
    );
  } catch (_e) {
    // Safari private mode, quota exceeded, etc. — silent.
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

// Builds a fresh PinElement. PinElement instances are passed directly as
// AdvancedMarkerElement.content (the legacy pattern of `pin.element` is
// deprecated). `glyphText` is the position digit ("1", "2", ...) for
// in-trip pins; using `glyphText` rather than `glyph` avoids Google's
// recent deprecation warning on the string form of `glyph`.
function buildPinElement(markerLib, { background, glyphText }) {
  return new markerLib.PinElement({
    background,
    borderColor: "#ffffff",
    glyphText: glyphText || undefined,
    glyphColor: "#ffffff",
    scale: 1,
  });
}

function MapPage() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLibRef = useRef(null);
  const markersRef = useRef({}); // id -> AdvancedMarkerElement
  const infoRef = useRef(null); // single shared InfoWindow
  const openFeatureRef = useRef(null); // properties of feature whose InfoWindow is open
  const tripActionRef = useRef(() => {}); // latest toggleTripStop, called from InfoWindow button
  const tripStopIdsRef = useRef([]); // latest tripStopIds, read inside marker click handlers
  const announcerRef = useRef(null);

  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const initial = useMemo(() => readUrlState(), []);
  const [selectedStopId, setSelectedStopId] = useState(initial.stop);
  const [tripStopIds, setTripStopIds] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState(
    () => new Set(REGIONS.map((r) => r.id))
  );
  // Mobile bottom-sheet state. Ignored on desktop (CSS scopes it to <=720px).
  const [sheetState, setSheetState] = useState("peek");

  // Keep refs in sync with latest state for the long-lived handlers
  // (marker click, InfoWindow domready) that need to read current trip state.
  useEffect(() => {
    tripStopIdsRef.current = tripStopIds;
  });

  // Fetch features once.
  useEffect(() => {
    let cancelled = false;
    fetch(POINTS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${POINTS_URL}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const feats = (data && data.features) || [];
        setFeatures(feats);
        const validIds = new Set(feats.map((f) => f.properties.id));
        setTripStopIds(loadTripFromStorage(validIds));
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

  // Persist trip on every change. The features=null guard skips the initial
  // tripStopIds=[] paint before localStorage has been read.
  useEffect(() => {
    if (features === null) return;
    saveTripToStorage(tripStopIds);
  }, [tripStopIds, features]);

  // Sync ?stop= back to URL.
  useEffect(() => {
    writeUrlState({ stop: selectedStopId });
  }, [selectedStopId]);

  // Restore from URL on browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const next = readUrlState();
      setSelectedStopId(next.stop);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ---- Trip-mutation actions ----------------------------------------------
  const announce = useCallback((msg) => {
    if (announcerRef.current) announcerRef.current.textContent = msg;
  }, []);

  const featureNameById = useCallback(
    (id) => {
      if (!features) return id;
      const f = features.find((x) => x.properties.id === id);
      return f ? f.properties.name : id;
    },
    [features]
  );

  const toggleTripStop = useCallback(
    (id) => {
      setTripStopIds((prev) => {
        if (prev.includes(id)) {
          const next = prev.filter((x) => x !== id);
          announce(
            `Removed ${featureNameById(id)} from trip. ${next.length} ${next.length === 1 ? "stop" : "stops"}.`
          );
          return next;
        }
        if (prev.length >= TRIP_CAP) {
          announce(
            `Trip is full at ${TRIP_CAP} stops. Remove one before adding more.`
          );
          return prev;
        }
        const next = [...prev, id];
        announce(
          `Added ${featureNameById(id)} to trip. ${next.length} ${next.length === 1 ? "stop" : "stops"}.`
        );
        return next;
      });
    },
    [announce, featureNameById]
  );

  const removeTripStop = useCallback(
    (id) => {
      setTripStopIds((prev) => {
        if (!prev.includes(id)) return prev;
        const next = prev.filter((x) => x !== id);
        announce(
          `Removed ${featureNameById(id)} from trip. ${next.length} ${next.length === 1 ? "stop" : "stops"}.`
        );
        return next;
      });
    },
    [announce, featureNameById]
  );

  const moveTripStop = useCallback(
    (id, dir) => {
      setTripStopIds((prev) => {
        const idx = prev.indexOf(id);
        if (idx === -1) return prev;
        const newIdx = idx + (dir === "up" ? -1 : 1);
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
        announce(
          `Moved ${featureNameById(id)} ${dir}. Now stop ${newIdx + 1} of ${next.length}.`
        );
        return next;
      });
    },
    [announce, featureNameById]
  );

  const clearTrip = useCallback(() => {
    setTripStopIds((prev) => {
      if (prev.length === 0) return prev;
      announce("Cleared trip. 0 stops.");
      return [];
    });
  }, [announce]);

  const addAllFromRegion = useCallback(
    (regionId) => {
      setTripStopIds((prev) => {
        if (!features) return prev;
        const region = REGIONS.find((r) => r.id === regionId);
        if (!region) return prev;
        const keys = new Set(region.keys);
        const regionStopIds = features
          .filter((f) => keys.has(f.properties.region))
          .map((f) => f.properties.id);
        const have = new Set(prev);
        const next = [...prev];
        let added = 0;
        for (const id of regionStopIds) {
          if (have.has(id)) continue;
          if (next.length >= TRIP_CAP) break;
          next.push(id);
          added++;
        }
        if (added === 0) return prev;
        announce(
          `Added ${added} ${added === 1 ? "stop" : "stops"} from ${region.label}. ${next.length} ${next.length === 1 ? "stop" : "stops"} total.`
        );
        return next;
      });
    },
    [announce, features]
  );

  const applyQuickPick = useCallback(
    (quickPickId) => {
      if (!features) return;
      const qp = QUICK_PICKS.find((q) => q.id === quickPickId);
      if (!qp) return;
      const keys = new Set();
      for (const rid of qp.regionIds) {
        const r = REGIONS.find((x) => x.id === rid);
        if (r) for (const k of r.keys) keys.add(k);
      }
      const stops = features
        .filter((f) => keys.has(f.properties.region))
        .map((f) => f.properties.id)
        .slice(0, TRIP_CAP);
      setTripStopIds(stops);
      announce(
        `Loaded ${qp.label} suggested trip. ${stops.length} ${stops.length === 1 ? "stop" : "stops"}.`
      );
    },
    [announce, features]
  );

  // Keep the InfoWindow button's callback fresh for the domready wireup.
  useEffect(() => {
    tripActionRef.current = toggleTripStop;
  });

  const handleSelectStop = useCallback((id) => {
    setSelectedStopId(id);
  }, []);

  const handleToggleRegion = useCallback((regionId) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) next.delete(regionId);
      else next.add(regionId);
      return next;
    });
  }, []);

  // ---- Map init (runs once, after features have loaded) -------------------
  useEffect(() => {
    if (mapRef.current) return;
    if (!features || features.length === 0) return;
    if (!containerRef.current) return;

    let cancelled = false;
    waitForGoogleMaps()
      .then(async (maps) => {
        if (cancelled) return;
        const markerLib = await maps.importLibrary("marker");
        if (cancelled) return;
        const map = new maps.Map(containerRef.current, {
          center: { lat: 37.85, lng: -119.55 },
          zoom: 10,
          mapTypeId: "terrain",
          mapId: "DEMO_MAP_ID", // required for AdvancedMarkerElement
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy",
        });
        mapRef.current = map;
        markerLibRef.current = markerLib;
        infoRef.current = new maps.InfoWindow();
        infoRef.current.addListener("closeclick", () => {
          openFeatureRef.current = null;
          setSelectedStopId(null);
        });
        setMapReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [features]);

  // ---- Effect A: create markers once. Never tear down — the visual-state
  // effect below mutates `.content` in place when the trip changes.
  useEffect(() => {
    if (!mapReady || !features) return;
    const map = mapRef.current;
    const markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    const maps = window.google.maps;

    const bounds = new maps.LatLngBounds();
    for (const feature of features) {
      const [lng, lat] = feature.geometry.coordinates;
      const p = feature.properties;
      const position = { lat, lng };
      bounds.extend(position);

      const pin = buildPinElement(markerLib, {
        background: getCategoryStyle(p.category).color,
      });
      const marker = new markerLib.AdvancedMarkerElement({
        position,
        map,
        title: p.name,
        content: pin,
      });
      // Use gmp-click event (the legacy 'click' bubbles via addListener but
      // logs a deprecation warning on each click).
      marker.addEventListener("gmp-click", () => {
        openFeatureRef.current = p;
        infoRef.current.setContent(buildInfoHtml(p, tripStopIdsRef.current));
        infoRef.current.open({ anchor: marker, map });
        setSelectedStopId(p.id);
      });
      markersRef.current[p.id] = marker;
    }

    // Reframe to the loaded set, with a zoom cap so the park doesn't zoom
    // to street level on first paint.
    map.fitBounds(bounds, 40);
    const listener = maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > 12) map.setZoom(12);
    });
    return () => {
      maps.event.removeListener(listener);
    };
  }, [features, mapReady]);

  // ---- Effect B: visual state. Walks every marker, swaps its content to
  // a numbered moss-green pin if the feature is in the trip, otherwise
  // restores the default category-colored pin.
  useEffect(() => {
    if (!mapReady || !features) return;
    const markerLib = markerLibRef.current;
    if (!markerLib) return;
    const tripIndex = new Map(tripStopIds.map((id, i) => [id, i]));
    for (const feature of features) {
      const p = feature.properties;
      const marker = markersRef.current[p.id];
      if (!marker) continue;
      const pin = tripIndex.has(p.id)
        ? buildPinElement(markerLib, {
            background: TRIP_PIN_COLOR,
            glyphText: String(tripIndex.get(p.id) + 1),
          })
        : buildPinElement(markerLib, {
            background: getCategoryStyle(p.category).color,
          });
      marker.content = pin;
    }
  }, [tripStopIds, features, mapReady]);

  // ---- InfoWindow content refresh: when the trip changes while an
  // InfoWindow is open, re-render its content so the Add/Remove button
  // label flips in real time.
  useEffect(() => {
    if (!mapReady) return;
    const info = infoRef.current;
    if (!info || !info.getMap() || !openFeatureRef.current) return;
    info.setContent(buildInfoHtml(openFeatureRef.current, tripStopIds));
  }, [tripStopIds, mapReady]);

  // ---- InfoWindow button wireup. On every InfoWindow open, locate
  // any [data-trip-toggle] buttons in the DOM and attach a click handler
  // that calls the latest toggleTripStop via tripActionRef. cloneNode
  // wipes any prior listener so we don't double-fire after setContent.
  useEffect(() => {
    if (!mapReady) return;
    const info = infoRef.current;
    if (!info) return;
    const maps = window.google.maps;
    const listener = info.addListener("domready", () => {
      const btns = document.querySelectorAll("[data-trip-toggle]");
      btns.forEach((btn) => {
        const fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
        fresh.addEventListener("click", (e) => {
          e.preventDefault();
          const id = fresh.getAttribute("data-stop-id");
          if (id) tripActionRef.current(id);
        });
      });
    });
    return () => {
      maps.event.removeListener(listener);
    };
  }, [mapReady]);

  // ---- Selection effect: pan/zoom to selected stop, open InfoWindow.
  useEffect(() => {
    if (!mapReady || !selectedStopId) return;
    const map = mapRef.current;
    const marker = markersRef.current[selectedStopId];
    if (!map || !marker) {
      // Stale ?stop=... (deleted pin, typo in URL) — clear it.
      setSelectedStopId(null);
      return;
    }
    map.panTo(marker.position);
    if (map.getZoom() < 13) map.setZoom(13);
    const feature = features && features.find((f) => f.properties.id === selectedStopId);
    if (feature) {
      openFeatureRef.current = feature.properties;
      infoRef.current.setContent(
        buildInfoHtml(feature.properties, tripStopIdsRef.current)
      );
      infoRef.current.open({ anchor: marker, map });
    }
  }, [selectedStopId, mapReady, features]);

  if (features === null) {
    return (
      <div className="map-page map-page--loading">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      <TripPlannerSidebar
        features={features}
        tripStopIds={tripStopIds}
        selectedStopId={selectedStopId}
        expandedRegions={expandedRegions}
        sheetState={sheetState}
        onSetSheetState={setSheetState}
        onSelectStop={handleSelectStop}
        onToggleStop={toggleTripStop}
        onRemoveStop={removeTripStop}
        onMoveStop={moveTripStop}
        onClearTrip={clearTrip}
        onAddAllFromRegion={addAllFromRegion}
        onApplyQuickPick={applyQuickPick}
        onToggleRegion={handleToggleRegion}
        announcerRef={announcerRef}
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
// Sidebar: My Trip + Suggested trips + Browse by area + Legend.
// ---------------------------------------------------------------------------
function TripPlannerSidebar({
  features,
  tripStopIds,
  selectedStopId,
  expandedRegions,
  sheetState,
  onSetSheetState,
  onSelectStop,
  onToggleStop,
  onRemoveStop,
  onMoveStop,
  onClearTrip,
  onAddAllFromRegion,
  onApplyQuickPick,
  onToggleRegion,
  announcerRef,
}) {
  // Group stops by their sidebar region (one geojson key per stop maps to
  // exactly one REGIONS entry).
  const regionGroups = useMemo(() => {
    return REGIONS.map((r) => {
      const keys = new Set(r.keys);
      const stops = features.filter((f) => keys.has(f.properties.region));
      return { ...r, stops };
    });
  }, [features]);

  const tripFeatures = useMemo(() => {
    const byId = new Map(features.map((f) => [f.properties.id, f]));
    return tripStopIds.map((id) => byId.get(id)).filter(Boolean);
  }, [tripStopIds, features]);

  const tripSet = useMemo(() => new Set(tripStopIds), [tripStopIds]);
  const tripFull = tripStopIds.length >= TRIP_CAP;

  const cycleSheet = () => {
    const order = ["peek", "half", "full"];
    const idx = order.indexOf(sheetState);
    onSetSheetState(order[(idx + 1) % order.length]);
  };

  return (
    <aside className={`map-page__sidebar map-page__sidebar--${sheetState}`}>
      {/* Mobile-only handle for bottom-sheet snap points. CSS hides on desktop. */}
      <button
        type="button"
        className="map-sidebar__sheet-handle"
        onClick={cycleSheet}
        aria-label={`Trip planner panel — currently ${sheetState}. Tap to expand.`}
      >
        <span className="map-sidebar__sheet-bar" aria-hidden="true" />
        <span className="map-sidebar__sheet-text">
          {tripStopIds.length > 0
            ? `My Trip (${tripStopIds.length})`
            : "Trip planner"}
        </span>
      </button>

      <header className="map-sidebar__header">
        <h2 className="map-sidebar__title">Trip planner</h2>
        <p className="map-sidebar__subtitle">
          Tap pins on the map or use the buttons below to build a trip.
        </p>
      </header>

      {/* My Trip */}
      <div className="map-sidebar__section">
        <div className="map-sidebar__trip-head">
          <h3 className="map-sidebar__section-label">My Trip</h3>
          {tripStopIds.length > 0 && (
            <button
              type="button"
              className="map-sidebar__trip-clear"
              onClick={onClearTrip}
            >Clear all</button>
          )}
        </div>
        {tripStopIds.length === 0 ? (
          <p className="map-sidebar__trip-empty">
            Your trip is empty. Tap pins on the map, use the “+” buttons below, or load a suggested trip.
          </p>
        ) : (
          <ol className="map-sidebar__trip-list">
            {tripFeatures.map((f, idx) => {
              const p = f.properties;
              const cat = getCategoryStyle(p.category);
              const isSelected = p.id === selectedStopId;
              const isFirst = idx === 0;
              const isLast = idx === tripFeatures.length - 1;
              return (
                <li
                  key={p.id}
                  className={`map-sidebar__trip-item${isSelected ? " map-sidebar__trip-item--selected" : ""}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.altKey && e.key === "ArrowUp") {
                      e.preventDefault();
                      onMoveStop(p.id, "up");
                    } else if (e.altKey && e.key === "ArrowDown") {
                      e.preventDefault();
                      onMoveStop(p.id, "down");
                    }
                  }}
                >
                  <span className="map-sidebar__trip-num" aria-hidden="true">{idx + 1}</span>
                  <button
                    type="button"
                    className="map-sidebar__trip-name"
                    onClick={() => onSelectStop(p.id)}
                  >
                    <span className="map-sidebar__trip-text">{p.name}</span>
                    <span
                      className="map-sidebar__trip-cat"
                      style={{ color: cat.color }}
                    >{p.category}</span>
                  </button>
                  <div className="map-sidebar__trip-actions">
                    <button
                      type="button"
                      className="map-sidebar__trip-btn"
                      onClick={() => onMoveStop(p.id, "up")}
                      disabled={isFirst}
                      aria-label={`Move ${p.name} up in trip`}
                    >↑</button>
                    <button
                      type="button"
                      className="map-sidebar__trip-btn"
                      onClick={() => onMoveStop(p.id, "down")}
                      disabled={isLast}
                      aria-label={`Move ${p.name} down in trip`}
                    >↓</button>
                    <button
                      type="button"
                      className="map-sidebar__trip-btn map-sidebar__trip-btn--remove"
                      onClick={() => onRemoveStop(p.id)}
                      aria-label={`Remove ${p.name} from trip`}
                    >×</button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <div
          ref={announcerRef}
          className="map-sidebar__sr-announcer"
          aria-live="polite"
          aria-atomic="true"
        />
      </div>

      {/* Suggested trips — quick-pick presets that replace the current trip. */}
      <div className="map-sidebar__section">
        <h3 className="map-sidebar__section-label">Suggested trips</h3>
        <p className="map-sidebar__hint">Click to replace your current trip.</p>
        <div className="map-sidebar__quickpicks">
          {QUICK_PICKS.map((qp) => (
            <button
              key={qp.id}
              type="button"
              className="map-sidebar__quickpick"
              onClick={() => onApplyQuickPick(qp.id)}
            >{qp.label}</button>
          ))}
        </div>
      </div>

      {/* Browse by area */}
      <div className="map-sidebar__section">
        <h3 className="map-sidebar__section-label">Browse by area</h3>
        <div className="map-sidebar__regions">
          {regionGroups.map((r) => {
            const isExpanded = expandedRegions.has(r.id);
            const stopCount = r.stops.length;
            const inTripCount = r.stops.filter((f) => tripSet.has(f.properties.id)).length;
            const allInTrip = stopCount > 0 && inTripCount === stopCount;
            const addAllDisabled = stopCount === 0 || allInTrip || tripFull;
            const addAllTitle = stopCount === 0
              ? "No stops in this region yet"
              : allInTrip
              ? "All stops in this region are already in your trip"
              : tripFull
              ? `Trip is full at ${TRIP_CAP} stops`
              : `Add all ${stopCount} stops from ${r.label}`;
            return (
              <section key={r.id} className="map-sidebar__region">
                <div className="map-sidebar__region-head">
                  <button
                    type="button"
                    className="map-sidebar__region-toggle"
                    onClick={() => onToggleRegion(r.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="map-sidebar__region-chev" aria-hidden="true">{isExpanded ? "▾" : "▸"}</span>
                    <span className="map-sidebar__region-name">{r.label}</span>
                    <span className="map-sidebar__region-count">{stopCount}</span>
                  </button>
                  <button
                    type="button"
                    className="map-sidebar__region-add"
                    onClick={() => onAddAllFromRegion(r.id)}
                    disabled={addAllDisabled}
                    title={addAllTitle}
                  >Add all</button>
                </div>
                {isExpanded && (
                  stopCount === 0 ? (
                    <p className="map-sidebar__region-empty">(no stops yet)</p>
                  ) : (
                    <ul className="map-sidebar__region-stops">
                      {r.stops.map((f) => {
                        const p = f.properties;
                        const cat = getCategoryStyle(p.category);
                        const inTrip = tripSet.has(p.id);
                        return (
                          <li
                            key={p.id}
                            className={`map-sidebar__region-row${p.id === selectedStopId ? " map-sidebar__region-row--selected" : ""}`}
                          >
                            <button
                              type="button"
                              className="map-sidebar__region-stop"
                              onClick={() => onSelectStop(p.id)}
                            >
                              <span className="map-sidebar__region-stop-name">{p.name}</span>
                              <span
                                className="map-sidebar__region-stop-cat"
                                style={{ color: cat.color }}
                              >{p.category}</span>
                            </button>
                            <button
                              type="button"
                              className={`map-sidebar__region-stop-add${inTrip ? " map-sidebar__region-stop-add--in" : ""}`}
                              onClick={() => onToggleStop(p.id)}
                              disabled={!inTrip && tripFull}
                              aria-label={inTrip ? `Remove ${p.name} from trip` : `Add ${p.name} to trip`}
                            >{inTrip ? "✓" : "+"}</button>
                          </li>
                        );
                      })}
                    </ul>
                  )
                )}
              </section>
            );
          })}
        </div>
      </div>

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildInfoHtml(p, tripStopIds) {
  const blurb = p.blurb ? `<p style="margin:6px 0 0;">${escapeHtml(p.blurb)}</p>` : "";
  const style = getCategoryStyle(p.category);
  const cat = p.category
    ? `<span style="display:inline-flex;align-items:center;gap:6px;text-transform:uppercase;font-size:11px;letter-spacing:0.06em;color:${style.color};font-weight:600;">
         <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${style.color};"></span>
         ${escapeHtml(p.category)}
       </span>`
    : "";
  const inTrip = Array.isArray(tripStopIds) && tripStopIds.includes(p.id);
  const btnLabel = inTrip ? "Remove from trip" : "Add to trip";
  const btnBg = inTrip ? "#ffffff" : TRIP_PIN_COLOR;
  const btnColor = inTrip ? TRIP_PIN_COLOR : "#ffffff";
  const btn = `<button type="button" data-trip-toggle data-stop-id="${escapeHtml(p.id)}" style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font:600 13px system-ui,sans-serif;background:${btnBg};color:${btnColor};border:1px solid ${TRIP_PIN_COLOR};border-radius:3px;cursor:pointer;">${escapeHtml(btnLabel)}</button>`;
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
      ${btn}
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
