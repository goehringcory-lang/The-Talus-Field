/* global React */
// =============================================================================
// MAP PAGE — `/map` route. Google Maps JavaScript API + region-grouped trip
// builder. Visitors browse Yosemite pins by area, filter them by category
// chips (shareable via /map?cat=hike,vista), search the sidebar by name, and
// tap pins on the map or "+" buttons in the sidebar to assemble a trip. Pins
// cluster below zoom 13 (progressive enhancement; trip and selected pins
// never cluster). The trip persists in localStorage so it survives a refresh,
// and can be shared via /map?trip=id1,id2. Destructive trip actions (quick
// picks, Clear all) offer a one-level Undo through the toast.
//
// API KEY: set in index.html, restricted to thetalusfieldjournal.com and
// localhost:8765 in the Google Cloud console. Maps JS API + marker library
// must remain enabled. mapId is required by AdvancedMarkerElement.
// =============================================================================

const { useEffect, useMemo, useRef, useState, useCallback } = React;

const POINTS_URL = "/points.geojson?v=25";
// Shared with /itineraries (page-itineraries.jsx), which resolves stop names
// from the same pin data, so the cache-buster is bumped in exactly one place.
window.POINTS_URL = POINTS_URL;
// Worker API base for "email this trip". Override at runtime via
// window.GUIDE_API_BASE (same convention as page-guide.jsx) for local dev.
const MAP_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";
const STORAGE_KEY = "tfg.trip";
const STORAGE_VERSION = 1;
const TRIP_CAP = 30;
const TRIP_PIN_COLOR = "#7a8f5a"; // moss — matches --moss CSS var on the rail
// Google's dir URL accepts origin + destination + 9 waypoints. Stops past the
// limit are dropped from the exported route (the user is told via toast).
const ROUTE_STOP_LIMIT = 11;
// Mobile only: after the selection effect opens an InfoWindow, nudge the map
// center up so the pin sits below center, leaving room for the InfoWindow
// (which opens upward) above it and keeping the pin clear of the bottom
// sheet's 60px peek bar.
const MOBILE_SELECT_PAN_Y = -80;
// Undoable toasts (quick-pick replace, Clear all) stay up longer than plain
// status toasts; toast dismissal is also the undo expiry.
const TOAST_MS = 2500;
const TOAST_UNDO_MS = 6000;

// Newsletter gate. The whole map is the free lead magnet: a locked visitor
// sees a covering signup overlay (MapAccessGate) and cannot reach the map or
// the trip builder until they subscribe. One Buttondown signup flips this
// localStorage flag (a prior signup anywhere on the site, via tfg.nl.subscribed,
// also counts). Bypassable by design. Fails OPEN when storage is unavailable
// (private mode) so the gate can never permanently trap a reader who cannot
// persist the flag.
const MAP_UNLOCK_KEY = "tfg.map.unlocked";
function isMapUnlocked() {
  // The "1" fallback is what makes the gate fail open: safeStorage.get
  // returns it only when storage itself throws, never when the key is
  // merely absent.
  return window.safeStorage.get(MAP_UNLOCK_KEY, "1") === "1";
}
function setMapUnlocked() {
  window.safeStorage.set(MAP_UNLOCK_KEY, "1");
}

// Four-bucket region taxonomy. `keys` lists the geojson `region` values that
// roll up into this UI group; "tuolumne-area" intentionally folds in Hetch
// Hetchy so the high country reads as a single section.
const REGIONS = [
  { id: "valley",         label: "Yosemite Valley",                  keys: ["valley"] },
  { id: "glacier-point",  label: "Greater Valley & Glacier Point",   keys: ["glacier-point"] },
  { id: "wawona",         label: "Wawona",                           keys: ["wawona"] },
  { id: "tuolumne-area",  label: "Tuolumne & Hetch Hetchy",          keys: ["tuolumne", "hetch-hetchy"] },
];

// Suggested-trip presets: the curated, drive-ordered day plans from
// itineraries-data.js (window.ITINERARIES), not region dumps. Each preset
// replaces (not appends to) the user's current trip when clicked. The same
// plans render in prose on /itineraries.
const QUICK_PICKS = (window.ITINERARIES || []).map((it) => ({
  id: it.id,
  label: it.label,
}));

// Pin color + display label per category. Categories come from
// points.geojson — add a new entry here whenever a new category is
// introduced. The fallback color is used for any category not listed.
const CATEGORY_STYLES = {
  hike:    { color: "#2f8a3e", label: "Hike" },
  vista:   { color: "#1e6fb8", label: "Vista" },
  picnic:  { color: "#e07a1a", label: "Picnic" },
  parking: { color: "#6b6b6b", label: "Parking" },
  eat:     { color: "#b9453d", label: "Eat" },
};
const CATEGORY_FALLBACK = { color: "#666", label: "Other" };

function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_FALLBACK;
}

const ALL_CATEGORIES = Object.keys(CATEGORY_STYLES);

// Parses ?cat= into the Set of active (visible) categories. Absent means no
// filter, i.e. every category active. An empty value ("/map?cat=") is the
// legal all-off state. Unknown tokens are dropped; if every token is garbage
// the filter falls back to all-active rather than an accidentally empty map.
function parseCatParam(raw) {
  if (raw === null || raw === undefined) return new Set(ALL_CATEGORIES);
  if (raw === "") return new Set();
  const out = new Set();
  for (const token of raw.split(",")) {
    const t = token.trim();
    if (CATEGORY_STYLES[t]) out.add(t);
  }
  return out.size > 0 ? out : new Set(ALL_CATEGORIES);
}

// Serializes the active-category Set for ?cat=. Null when every category is
// active (param omitted, the default state). Sorted so writeUrlState's
// string comparison stays stable across toggles.
function serializeCats(activeCats) {
  if (ALL_CATEGORIES.every((c) => activeCats.has(c))) return null;
  return Array.from(activeCats).sort().join(",");
}

// ---------------------------------------------------------------------------
// URL state helpers. /map?stop=tunnel-view selects a pin; /map?trip=id1,id2 is
// a one-shot shared trip that replaces the local trip on load, then the URL
// normalizes back to /map. (No more ?itinerary= — the day-presets are now
// in-sidebar quick picks that don't persist to URL.) ?trip= must be captured
// before the first writeUrlState effect runs, which strips unknown params.
// ---------------------------------------------------------------------------
function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    stop: params.get("stop") || null,
    trip: params.get("trip") || null,
    // "" (from "/map?cat=") and null (param absent) are distinct: empty
    // string means all categories toggled off, absent means no filter.
    cat: params.get("cat"),
  };
}

// Parses a ?trip= value ("id1,id2,...") against the loaded feature set.
// Unknown ids and duplicates are dropped; the result respects TRIP_CAP.
function parseTripParam(raw, validIds) {
  if (!raw) return [];
  const seen = new Set();
  const out = [];
  for (const id of raw.split(",")) {
    const trimmed = id.trim();
    if (!trimmed || !validIds.has(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= TRIP_CAP) break;
  }
  return out;
}

// The single URL writer. Callers must always pass BOTH keys — a partial call
// would silently strip the other param (the one URL-sync effect in MapView is
// the only caller for exactly this reason). Still deliberately strips
// everything else, including the one-shot ?trip=.
function writeUrlState({ stop, cat }) {
  const params = new URLSearchParams();
  if (stop) params.set("stop", stop);
  if (cat !== null && cat !== undefined) params.set("cat", cat);
  const qs = params.toString();
  const newUrl = "/map" + (qs ? `?${qs}` : "");
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, "", newUrl);
  }
}

// ---------------------------------------------------------------------------
// Trip persistence via window.safeStorage (see storage.js); an unavailable
// storage falls back silently to in-memory state.
// ---------------------------------------------------------------------------
function loadTripFromStorage(validIds) {
  const parsed = window.safeStorage.getJSON(STORAGE_KEY);
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
}

function saveTripToStorage(ids) {
  window.safeStorage.setJSON(STORAGE_KEY, { v: STORAGE_VERSION, ids });
}

// ---------------------------------------------------------------------------
// Google Maps JS API key. Formerly loaded globally in index.html on every page;
// now injected on demand only when the /map route mounts (see injectGoogleMaps),
// so non-map pages do not pay the script's parse/exec cost. The key is a public,
// HTTP-referrer-restricted key (thetalusfieldjournal.com + localhost), safe to
// ship client-side. CSP already allow-lists maps.googleapis.com in _headers.
// ---------------------------------------------------------------------------
const MAPS_API_KEY = "AIzaSyA03kEmQWQ52I7PiT9E2VyomelcpeKb_IU";
const MAPS_JS_SRC =
  `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=weekly&libraries=marker&loading=async`;

// Inject the Maps JS API <script> once, lazily. Idempotent: re-mounting /map
// (SPA navigation away and back) reuses the already-present script/namespace.
function injectGoogleMaps() {
  if (window.google && window.google.maps) return;
  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) return;
  const s = document.createElement("script");
  s.src = MAPS_JS_SRC;
  s.async = true;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// Injects the Maps script on first call, then polls window.google.maps for up
// to 8s for the namespace to come online (the script loads async).
//
// Readiness is gated on `importLibrary` being a *function*, not merely on the
// `google.maps` namespace existing: with `loading=async`, the bootstrap loader
// assigns the namespace in stages, so there is a brief window where
// `google.maps` is truthy but `importLibrary` is not yet attached. Resolving on
// the bare namespace and then calling `maps.importLibrary("marker")` threw
// "maps.importLibrary is not a function" on the first (uncached) load, while a
// refresh (cached, faster exec) raced past the gap and worked. Waiting for the
// function itself closes that race.
// ---------------------------------------------------------------------------
function mapsApiReady() {
  return !!(
    window.google &&
    window.google.maps &&
    typeof window.google.maps.importLibrary === "function"
  );
}

function waitForGoogleMaps(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (mapsApiReady()) {
      resolve(window.google.maps);
      return;
    }
    injectGoogleMaps();
    const start = Date.now();
    const interval = setInterval(() => {
      if (mapsApiReady()) {
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

// ---------------------------------------------------------------------------
// Marker clusterer (progressive enhancement). The UMD build ships from
// unpkg, which the _headers CSP already allow-lists because React loads from
// the same origin. Clustering is never required for the map to work: the
// wait helper resolves null on timeout/failure and the map falls back to
// plain un-clustered markers, exactly the pre-clusterer behavior.
// ---------------------------------------------------------------------------
const CLUSTERER_SRC =
  "https://unpkg.com/@googlemaps/markerclusterer@2.5.3/dist/index.min.js";
// Clusters form only below this zoom. The selection effect zooms to 13, so a
// selected or deep-linked stop always lands above the clustering ceiling.
const CLUSTER_MAX_ZOOM = 12;

function markerClustererLoaded() {
  return !!(window.markerClusterer && window.markerClusterer.MarkerClusterer);
}

function injectMarkerClusterer() {
  if (markerClustererLoaded()) return;
  if (document.querySelector(`script[src="${CLUSTERER_SRC}"]`)) return;
  const s = document.createElement("script");
  s.src = CLUSTERER_SRC;
  s.async = true;
  document.head.appendChild(s);
}

function waitForMarkerClusterer(timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (markerClustererLoaded()) {
      resolve(window.markerClusterer);
      return;
    }
    injectMarkerClusterer();
    const start = Date.now();
    const interval = setInterval(() => {
      if (markerClustererLoaded()) {
        clearInterval(interval);
        resolve(window.markerClusterer);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
}

// Cluster badge renderer: a moss circle with the stop count (styles.css
// .map-cluster). zIndex tracks count so denser clusters sit on top.
function buildClusterRenderer(markerLib) {
  return {
    render({ count, position }) {
      const div = document.createElement("div");
      div.className = "map-cluster";
      div.textContent = String(count);
      return new markerLib.AdvancedMarkerElement({
        position,
        content: div,
        zIndex: 1000 + count,
      });
    },
  };
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

function MapView({ go }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLibRef = useRef(null);
  const markersRef = useRef({}); // id -> AdvancedMarkerElement
  const infoRef = useRef(null); // single shared InfoWindow
  const openFeatureRef = useRef(null); // properties of feature whose InfoWindow is open
  const tripActionRef = useRef(() => {}); // latest toggleTripStop, called from InfoWindow button
  const tripStopIdsRef = useRef([]); // latest tripStopIds, read inside marker click handlers
  const goRef = useRef(go); // latest SPA navigate, called from InfoWindow article links
  const announcerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const clustererRef = useRef(null); // MarkerClusterer instance, null until (unless) the lib loads
  const markerModesRef = useRef({}); // id -> last applied visibility mode ("direct"|"clustered"|"hidden")
  const pendingUndoRef = useRef(null); // { ids } snapshot restorable while an undoable toast shows

  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [toast, setToast] = useState(null);
  // Trip-builder gate: the map itself (pins, filters, search, shared trips) is
  // browsable by everyone. Only a write action — adding a stop, "add all from
  // region", or loading a suggested trip — opens the signup gate for a locked
  // visitor (see openGate / gateOpen below). Seeded once from the persisted
  // unlock flag (or a prior signup anywhere on the site), so a returning
  // subscriber never sees the gate at all. Fails OPEN via isMapUnlocked when
  // storage throws (private mode), matching the rest of the site.
  const [unlocked, setUnlocked] = useState(
    () => isMapUnlocked() || (window.isSubscribed && window.isSubscribed())
  );
  // Whether the trip-builder gate modal is currently showing. Only ever true
  // for a locked visitor who just attempted a trip-building action; dismissable
  // (unlike the old full-view gate), since browsing the map needs no signup.
  const [gateOpen, setGateOpen] = useState(false);

  const initial = useMemo(() => readUrlState(), []);
  const [selectedStopId, setSelectedStopId] = useState(initial.stop);
  const [tripStopIds, setTripStopIds] = useState([]);
  // Active pin categories. Everything active is the default (no filter);
  // toggled off categories hide their pins and sidebar rows, except stops
  // that are in the trip or currently selected (see the visibility effect).
  const [activeCats, setActiveCats] = useState(() => parseCatParam(initial.cat));
  // Flips once if/when the clusterer library arrives; re-runs the visibility
  // effect so already-placed markers re-home into the clusterer.
  const [hasClusterer, setHasClusterer] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState(
    () => new Set(REGIONS.map((r) => r.id))
  );
  // Mobile bottom-sheet state. Ignored on desktop (CSS scopes it to <=720px).
  const [sheetState, setSheetState] = useState("peek");

  useEffect(() => {
    goRef.current = go;
  });

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
        // A shared ?trip= link replaces whatever trip was saved on this device.
        const shared = parseTripParam(initial.trip, validIds);
        if (shared.length > 0) {
          setTripStopIds(shared);
          announce(`Loaded a shared trip. ${shared.length} ${shared.length === 1 ? "stop" : "stops"}.`);
          if (window.track) window.track("trip_share_open", { trip_size: shared.length });
        } else {
          setTripStopIds(loadTripFromStorage(validIds));
        }
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

  // Sync ?stop= and ?cat= back to URL. Keep this the only writeUrlState
  // caller: it always passes both keys, so neither param can strip the other.
  useEffect(() => {
    writeUrlState({ stop: selectedStopId, cat: serializeCats(activeCats) });
  }, [selectedStopId, activeCats]);

  // Restore from URL on browser back/forward.
  useEffect(() => {
    const onPop = () => {
      const next = readUrlState();
      setSelectedStopId(next.stop);
      setActiveCats(parseCatParam(next.cat));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Undoable announcements keep their toast up longer and surface an Undo
  // button (see the toast render in TripPlannerSidebar). The undo snapshot
  // lives only as long as its toast: expiry or replacement clears it.
  // Declared above its first consumer (toggleCategory) — referencing a const
  // before its declaration in a deps array is a TDZ error in the source,
  // masked only while gen-compiled.mjs downlevels const to var.
  const announce = useCallback((msg, opts) => {
    const undoable = !!(opts && opts.undoable);
    if (!undoable) pendingUndoRef.current = null;
    if (announcerRef.current) {
      announcerRef.current.textContent = undoable ? `${msg} Undo available.` : msg;
    }
    setToast({ msg, undoable });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      pendingUndoRef.current = null;
    }, undoable ? TOAST_UNDO_MS : TOAST_MS);
  }, []);

  // ---- Category filter -----------------------------------------------------
  const toggleCategory = useCallback(
    (cat) => {
      const next = new Set(activeCats);
      const nowActive = !next.has(cat);
      if (nowActive) next.add(cat);
      else next.delete(cat);
      setActiveCats(next);
      if (features) {
        const tripSet = new Set(tripStopIdsRef.current);
        const shown = features.filter(
          (f) => next.has(f.properties.category) || tripSet.has(f.properties.id)
        ).length;
        announce(
          `${getCategoryStyle(cat).label} pins ${nowActive ? "shown" : "hidden"}. ${shown} of ${features.length} stops shown.`
        );
      }
      if (window.track) {
        window.track("map_filter_category", {
          category: cat,
          active: nowActive,
          active_count: next.size,
        });
      }
    },
    [activeCats, features, announce]
  );

  // ---- Trip-mutation actions ----------------------------------------------
  const featureNameById = useCallback(
    (id) => {
      if (!features) return id;
      const f = features.find((x) => x.properties.id === id);
      return f ? f.properties.name : id;
    },
    [features]
  );

  // ---- Signup gate ---------------------------------------------------------
  // Opens the trip-builder gate modal for a locked visitor. Each of the three
  // write actions below (toggle a stop, add all from a region, load a quick
  // pick) calls this instead of mutating trip state when !unlocked.
  const openGate = useCallback(() => {
    setGateOpen(true);
  }, []);

  // One signup flips the persisted unlock flag, reveals the trip builder, and
  // closes the modal; a prior signup anywhere on the site (tfg.nl.subscribed)
  // counts too and is already reflected in the seeded `unlocked` state.
  const handleGateSubscribed = useCallback(() => {
    setMapUnlocked();
    setUnlocked(true);
    setGateOpen(false);
  }, []);

  // Record one impression each time the gate is actually shown (not merely
  // because the visitor is locked — browsing needs no signup, so a locked
  // visitor who never attempts a write action never sees or counts as shown
  // the gate).
  useEffect(() => {
    if (gateOpen && window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_trip_gate", "map-gate");
    }
  }, [gateOpen]);

  const performToggleTripStop = useCallback(
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

  // Public toggle. A locked visitor's first add opens the signup gate instead
  // of mutating trip state; membership is read from the ref (not inside the
  // state updater) so the add/remove branch is decided before any change.
  const toggleTripStop = useCallback(
    (id, source) => {
      if (!unlocked) { openGate(); return; }
      const adding = !tripStopIdsRef.current.includes(id);
      if (adding && window.track && tripStopIdsRef.current.length < TRIP_CAP) {
        window.track("trip_add", {
          stop_id: id,
          trip_size: tripStopIdsRef.current.length + 1,
          source: source || "sidebar",
        });
      }
      performToggleTripStop(id);
    },
    [performToggleTripStop, unlocked, openGate]
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
    const prev = tripStopIdsRef.current;
    if (prev.length === 0) return;
    pendingUndoRef.current = { ids: prev };
    setTripStopIds([]);
    announce("Cleared trip. 0 stops.", { undoable: true });
  }, [announce]);

  // Restores the trip snapshotted by the last destructive action (quick-pick
  // replace or Clear all) while its toast is still up. Pin repaint and
  // persistence follow from the tripStopIds effects; nothing else to do.
  const undoTripChange = useCallback(() => {
    const saved = pendingUndoRef.current;
    if (!saved) return;
    pendingUndoRef.current = null;
    setTripStopIds(saved.ids);
    if (window.track) window.track("trip_undo", { restored_size: saved.ids.length });
    announce(
      `Restored previous trip. ${saved.ids.length} ${saved.ids.length === 1 ? "stop" : "stops"}.`
    );
  }, [announce]);

  const performAddAllFromRegion = useCallback(
    (regionId) => {
      setTripStopIds((prev) => {
        if (!features) return prev;
        const region = REGIONS.find((r) => r.id === regionId);
        if (!region) return prev;
        const keys = new Set(region.keys);
        // Respects the category filter (never adds pins the user just hid)
        // but not the sidebar search, which is a find tool, not a selection.
        const regionStopIds = features
          .filter(
            (f) => keys.has(f.properties.region) && activeCats.has(f.properties.category)
          )
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
    [announce, features, activeCats]
  );

  const addAllFromRegion = useCallback(
    (regionId) => {
      if (!unlocked) { openGate(); return; }
      if (window.track) window.track("trip_add_all", { region: regionId });
      performAddAllFromRegion(regionId);
    },
    [performAddAllFromRegion, unlocked, openGate]
  );

  const performApplyQuickPick = useCallback(
    (quickPickId) => {
      if (!features) return;
      const qp = QUICK_PICKS.find((q) => q.id === quickPickId);
      if (!qp) return;
      // Curated drive order from itineraries-data.js, filtered against the
      // pins that actually exist so a stale id can never wedge the trip.
      const validIds = new Set(features.map((f) => f.properties.id));
      const stops = (window.getItineraryStopIds ? window.getItineraryStopIds(qp.id) : [])
        .filter((id) => validIds.has(id))
        .slice(0, TRIP_CAP);
      if (stops.length === 0) return;
      // Quick picks replace the trip outright; snapshot the old one so the
      // toast can offer Undo when there was something to lose.
      const prev = tripStopIdsRef.current;
      if (prev.length > 0) pendingUndoRef.current = { ids: prev };
      setTripStopIds(stops);
      announce(
        `Loaded ${qp.label} suggested trip. ${stops.length} ${stops.length === 1 ? "stop" : "stops"}.`,
        { undoable: prev.length > 0 }
      );
    },
    [announce, features]
  );

  const applyQuickPick = useCallback(
    (quickPickId) => {
      if (!unlocked) { openGate(); return; }
      if (window.track) window.track("trip_quick_pick", { pick: quickPickId });
      performApplyQuickPick(quickPickId);
    },
    [performApplyQuickPick, unlocked, openGate]
  );

  // ---- Trip share + route export -------------------------------------------
  const shareTrip = useCallback(() => {
    const ids = tripStopIdsRef.current;
    if (ids.length === 0) return;
    const url = `${window.location.origin}/map?trip=${ids.join(",")}`;
    const done = () => {
      announce("Link copied. Anyone who opens it gets this trip.");
      if (window.track) window.track("trip_share", { trip_size: ids.length });
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => {
        window.prompt("Copy this link:", url);
        done();
      });
    } else {
      window.prompt("Copy this link:", url);
      done();
    }
  }, [announce]);

  // Coordinate-based DIRECTIONS links are fine here: they route navigation,
  // unlike coordinate-synthesized PLACE links (forbidden above, see gmapsUrl),
  // which would land on a generic dropped pin instead of the named place.
  const openTripRoute = useCallback(() => {
    if (!features) return;
    const byId = new Map(features.map((f) => [f.properties.id, f]));
    const coords = tripStopIdsRef.current
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((f) => f.geometry.coordinates);
    if (coords.length < 2) return;
    const used = coords.slice(0, ROUTE_STOP_LIMIT);
    const fmt = ([lng, lat]) => `${lat},${lng}`;
    const origin = fmt(used[0]);
    const destination = fmt(used[used.length - 1]);
    const waypoints = used.slice(1, -1).map(fmt).join("|");
    let url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=driving`;
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    if (coords.length > ROUTE_STOP_LIMIT) {
      announce(`Route opens with the first ${ROUTE_STOP_LIMIT} stops. Google Maps caps waypoints.`);
    }
    if (window.track) window.track("trip_route_open", { trip_size: tripStopIdsRef.current.length });
    window.open(url, "_blank", "noopener");
  }, [features, announce]);

  // Keep the InfoWindow button's callback fresh for the domready wireup.
  useEffect(() => {
    tripActionRef.current = toggleTripStop;
  });

  const handleSelectStop = useCallback((id) => {
    setSelectedStopId(id);
    // On mobile the sheet covers the map at half/full; drop it to peek so
    // the InfoWindow this selection opens is actually visible. Evaluated at
    // event time, same pattern as the sheet-drag guard.
    if (window.innerWidth <= 720) setSheetState("peek");
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
        infoRef.current = new maps.InfoWindow({ maxWidth: 300 });
        infoRef.current.addListener("closeclick", () => {
          openFeatureRef.current = null;
          setSelectedStopId(null);
        });
        setMapReady(true);
        // Clustering arrives whenever the lib does (or never, on a failed
        // load — the map is already live either way). Resetting the mode
        // cache makes the visibility effect re-home every marker cleanly.
        waitForMarkerClusterer().then((mc) => {
          if (cancelled || !mc) return;
          clustererRef.current = new mc.MarkerClusterer({
            map,
            markers: [],
            algorithm: new mc.SuperClusterAlgorithm({ maxZoom: CLUSTER_MAX_ZOOM, radius: 60 }),
            renderer: buildClusterRenderer(markerLib),
            onClusterClick: (event, cluster, m) => {
              if (window.track) window.track("map_cluster_click", { count: cluster.count });
              m.fitBounds(cluster.bounds);
            },
          });
          markerModesRef.current = {};
          setHasClusterer(true);
        });
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
      // Created detached: the visibility effect below is the single owner of
      // marker.map / clusterer membership. Nothing else may attach markers.
      const marker = new markerLib.AdvancedMarkerElement({
        position,
        title: p.name,
        content: pin,
      });
      // Standard DOM click — more reliable than gmp-click, which requires a
      // cloud-provisioned Map ID (DEMO_MAP_ID doesn't fire it consistently).
      marker.addEventListener("click", () => {
        if (window.track) window.track("map_pin_click", { stop_id: p.id, category: p.category || "" });
        openFeatureRef.current = feature;
        infoRef.current.setContent(buildInfoHtml(p, feature.geometry.coordinates, tripStopIdsRef.current));
        infoRef.current.open({ anchor: marker, map });
        setSelectedStopId(p.id);
        // Tapping the map is a statement of intent to look at the map: on
        // mobile, drop the sheet so the InfoWindow isn't opened behind it.
        if (window.innerWidth <= 720) setSheetState("peek");
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

  // ---- Effect C: marker visibility. The single owner of marker.map and
  // clusterer membership (Effect A creates markers detached). Trip and
  // selected pins bypass the clusterer entirely so the numbered route always
  // reads and the InfoWindow keeps a live anchor; pins whose category is
  // toggled off are hidden unless they are in the trip or selected. Runs
  // before the selection effect below (declaration order), so a selected
  // marker is attached by the time the InfoWindow opens on it.
  useEffect(() => {
    if (!mapReady || !features) return;
    const map = mapRef.current;
    if (!map) return;
    const clusterer = clustererRef.current;
    const tripSet = new Set(tripStopIds);
    const modes = markerModesRef.current;
    let clusterChanged = false;
    for (const feature of features) {
      const p = feature.properties;
      const marker = markersRef.current[p.id];
      if (!marker) continue;
      const mode =
        tripSet.has(p.id) || p.id === selectedStopId
          ? "direct"
          : !activeCats.has(p.category)
          ? "hidden"
          : clusterer
          ? "clustered"
          : "direct";
      if (modes[p.id] === mode) continue;
      if (modes[p.id] === "clustered" && clusterer) {
        clusterer.removeMarker(marker, true);
        clusterChanged = true;
      }
      if (mode === "clustered") {
        marker.map = null;
        clusterer.addMarker(marker, true);
        clusterChanged = true;
      } else {
        marker.map = mode === "direct" ? map : null;
      }
      modes[p.id] = mode;
    }
    if (clusterer && clusterChanged) clusterer.render();
    // A chip toggle can hide the feature whose InfoWindow is open (only a
    // non-selected one; selected stops are always direct). Close it rather
    // than leave it anchored to a hidden marker.
    const of = openFeatureRef.current;
    if (of && modes[of.properties.id] === "hidden" && infoRef.current) {
      infoRef.current.close();
      openFeatureRef.current = null;
    }
  }, [tripStopIds, activeCats, selectedStopId, features, mapReady, hasClusterer]);

  // ---- InfoWindow content refresh: when the trip changes while an
  // InfoWindow is open, re-render its content so the Add/Remove button
  // label flips in real time.
  useEffect(() => {
    if (!mapReady) return;
    const info = infoRef.current;
    if (!info || !info.getMap() || !openFeatureRef.current) return;
    const of = openFeatureRef.current;
    info.setContent(buildInfoHtml(of.properties, of.geometry.coordinates, tripStopIds));
  }, [tripStopIds, mapReady]);

  // ---- InfoWindow wireup. On every InfoWindow open, locate any
  // [data-trip-toggle] buttons and [data-article-link] anchors in the DOM and
  // attach click handlers that call the latest toggleTripStop / go via refs.
  // cloneNode wipes any prior listener so we don't double-fire after
  // setContent.
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
          if (id) tripActionRef.current(id, "infowindow");
        });
      });
      // Article cross-links route through the SPA navigator so the journal
      // opens without a full page load (plain hrefs 404 under the local
      // python server, which has no route rewrites).
      const links = document.querySelectorAll("[data-article-link]");
      links.forEach((link) => {
        const fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", (e) => {
          e.preventDefault();
          const slug = fresh.getAttribute("data-article-slug");
          if (!slug) return;
          if (window.track) window.track("map_article_click", { slug });
          if (goRef.current) goRef.current("a:" + slug);
        });
      });
      // Per-pin share links copy /map?stop=<id> to the clipboard instead of
      // navigating (the pin is already selected; reloading would be noise).
      const shares = document.querySelectorAll("[data-stop-share]");
      shares.forEach((link) => {
        const fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", (e) => {
          e.preventDefault();
          const id = fresh.getAttribute("data-stop-id");
          if (!id) return;
          const url = `${window.location.origin}/map?stop=${id}`;
          const done = () => {
            if (window.track) window.track("stop_share", { stop_id: id });
            fresh.textContent = "Link copied";
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done).catch(() => {
              window.prompt("Copy this link:", url);
              done();
            });
          } else {
            window.prompt("Copy this link:", url);
            done();
          }
        });
      });
      // Directions links open natively (no preventDefault); the listener
      // only records the click.
      const dirs = document.querySelectorAll("[data-directions-link]");
      dirs.forEach((link) => {
        const fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", () => {
          if (window.track) {
            window.track("map_directions_click", {
              stop_id: fresh.getAttribute("data-stop-id") || "",
            });
          }
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
      openFeatureRef.current = feature;
      infoRef.current.setContent(
        buildInfoHtml(feature.properties, feature.geometry.coordinates, tripStopIdsRef.current)
      );
      infoRef.current.open({ anchor: marker, map });
      // Mobile: the InfoWindow opens upward from a centered pin and can
      // clip the top edge; shift the center up so the pin sits lower while
      // staying clear of the bottom sheet's peek bar. Desktop unchanged.
      if (window.innerWidth <= 720) map.panBy(0, MOBILE_SELECT_PAN_Y);
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
    <div className={`map-page${gateOpen ? " map-page--locked" : ""}`}>
      <TripPlannerSidebar
        features={features}
        tripStopIds={tripStopIds}
        selectedStopId={selectedStopId}
        activeCats={activeCats}
        onToggleCategory={toggleCategory}
        onUndo={undoTripChange}
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
        onShareTrip={shareTrip}
        onOpenRoute={openTripRoute}
        onEmailSubscribed={handleGateSubscribed}
        go={go}
        announcerRef={announcerRef}
        toast={toast}
      />
      <div className="map-page__main">
        {error && (
          <div className="map-page__error" role="alert">
            Map failed to load: {error}
          </div>
        )}
        <div ref={containerRef} id="map" className="map-page__map" />
      </div>
      {gateOpen && <MapAccessGate onSubscribed={handleGateSubscribed} onClose={() => setGateOpen(false)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Email this trip to yourself." The natural capture moment: a built trip is
// worth keeping, and the reader's inbox is where it survives a closed tab.
// The form POSTs natively into the hidden Buttondown iframe (same optimistic
// pattern as every other unit, tag map-trip) while the actual send rides
// alongside as a fetch to the Worker (/api/trip/email), which builds the
// share URL server-side from the id list. The Worker deploy is manual, so a
// failed send falls back to copying the share link instead of dead-ending.
// A reader who already subscribed skips the Buttondown POST; the send still
// goes out.
// ---------------------------------------------------------------------------
function TripEmailBox({ tripStopIds, onFallbackCopy, onSubscribed }) {
  const [state, setState] = useState("idle"); // idle | sending | sent | failed
  const emailRef = useRef(null);
  const hpRef = useRef(null);

  // One impression per mount, matching the other newsletter units.
  useEffect(() => {
    if (window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_trip_email", "map-trip");
    }
  }, []);

  // The share-link fallback fires once, from an effect, so the copy happens
  // after the failed state has rendered its explanation.
  useEffect(() => {
    if (state === "failed" && onFallbackCopy) onFallbackCopy();
  }, [state, onFallbackCopy]);

  const onSubmit = (e) => {
    const email = emailRef.current ? emailRef.current.value.trim() : "";
    const website = hpRef.current ? hpRef.current.value : "";
    const ids = tripStopIds.slice(0, TRIP_CAP);
    if (!email || ids.length === 0) {
      e.preventDefault();
      return;
    }
    const wasSubscribed = window.isSubscribed && window.isSubscribed();
    if (wasSubscribed) {
      // Already on the list: skip the Buttondown POST, keep the send.
      e.preventDefault();
    } else if (window.trackNewsletterSubmit) {
      window.trackNewsletterSubmit("map_trip_email", "map-trip");
    }
    if (window.track) window.track("trip_email_send", { trip_size: ids.length });
    // Unlock the trip builder like any other signup would; deferred a tick so
    // the native POST into the iframe fires before any re-render.
    if (!wasSubscribed && onSubscribed) setTimeout(onSubscribed, 0);
    setTimeout(() => setState("sending"), 0);
    fetch(`${MAP_API_BASE}/api/trip/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, stops: ids, website }),
    })
      .then((r) => setState(r.ok ? "sent" : "failed"))
      .catch(() => setState("failed"));
  };

  if (state === "sent") {
    return (
      <div className="map-sidebar__email">
        <p className="map-sidebar__email-fine map-sidebar__email-fine--sent" role="status">
          Sent. The trip is in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="map-sidebar__email">
      <h4 className="map-sidebar__email-label">Email this trip to yourself</h4>
      <form
        className="nlbox__form"
        action="https://buttondown.com/api/emails/embed-subscribe/goehring"
        method="post"
        target="buttondown-target"
        onSubmit={onSubmit}
      >
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          aria-label="Email address"
        />
        <input type="hidden" name="tag" value="map-trip" />
        <input type="hidden" name="embed" value="1" />
        {/* Honeypot for the Worker payload; Buttondown ignores the field. */}
        <div style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
          <label>
            Website
            <input ref={hpRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send the trip →"}
        </button>
      </form>
      <p className="map-sidebar__email-fine">
        {state === "failed"
          ? "Could not send just now. The share link was copied instead."
          : "The link opens your stops on this map. Sending also signs you up for Sunday Field Notes, one short letter a week. Free, leave anytime."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post-trip next steps. Once a trip has real shape (three stops or more) the
// planner should not dead-end at "copy link": point at the journal piece the
// trip's own pins cite most, and at the Field Guide waitlist. Text lines, not
// a second form; the trip stays the hero.
// ---------------------------------------------------------------------------
function TripNextSteps({ tripFeatures, go }) {
  // The article linked by the most stops in this trip wins; /planning is the
  // fallback when no stop cites a piece.
  const suggestion = useMemo(() => {
    const counts = new Map();
    tripFeatures.forEach((f) => {
      ((f.properties && f.properties.articles) || []).forEach((slug) => {
        counts.set(slug, (counts.get(slug) || 0) + 1);
      });
    });
    let best = null;
    counts.forEach((n, slug) => {
      const article = (window.ARTICLES || []).find((a) => a.slug === slug);
      if (!article) return;
      if (!best || n > best.n) best = { n, article };
    });
    return best ? best.article : null;
  }, [tripFeatures]);

  return (
    <div className="map-sidebar__next">
      <h4 className="map-sidebar__next-label">Before you go</h4>
      {suggestion ? (
        <p className="map-sidebar__next-line">
          Reading for this trip:{" "}
          <a
            href={`/articles/${suggestion.slug}`}
            onClick={(e) => {
              e.preventDefault();
              if (window.track) window.track("map_article_click", { slug: suggestion.slug, source: "trip_next" });
              go(`a:${suggestion.slug}`);
            }}
          >{suggestion.title}</a>.
        </p>
      ) : (
        <p className="map-sidebar__next-line">
          Reading for this trip:{" "}
          <a
            href="/planning"
            onClick={(e) => { e.preventDefault(); go("planning"); }}
          >the planning guide</a>.
        </p>
      )}
      <p className="map-sidebar__next-line">
        This trip, offline, at the trailhead: the Field Guide app is $19 for eighteen months.{" "}
        <a
          href="/guide"
          onClick={(e) => {
            e.preventDefault();
            if (window.track) window.track("guide_teaser_click", { location: "map_sidebar" });
            go("guide");
          }}
        >See the guide →</a>
      </p>
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
  activeCats,
  onToggleCategory,
  onUndo,
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
  onShareTrip,
  onOpenRoute,
  onEmailSubscribed,
  go,
  announcerRef,
  toast,
}) {
  // Sidebar search. Filters the region lists only, never the map markers:
  // category chips control the map, search finds rows in the list.
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();

  // Group stops by their sidebar region (one geojson key per stop maps to
  // exactly one REGIONS entry). `stops` is what the list renders (category
  // filter + search); `catStops` ignores search and drives the "Add all"
  // button, which is a selection tool, not a find tool.
  const regionGroups = useMemo(() => {
    return REGIONS.map((r) => {
      const keys = new Set(r.keys);
      const catStops = features.filter(
        (f) => keys.has(f.properties.region) && activeCats.has(f.properties.category)
      );
      const stops = query
        ? catStops.filter((f) => f.properties.name.toLowerCase().includes(query))
        : catStops;
      return { ...r, stops, catStops };
    });
  }, [features, activeCats, query]);

  const matchCount = useMemo(
    () => regionGroups.reduce((n, r) => n + r.stops.length, 0),
    [regionGroups]
  );

  // Debounced search analytics + SR announcement of the match count (reuses
  // the shared announcer instead of adding a second live region).
  useEffect(() => {
    if (!query) return;
    const t = setTimeout(() => {
      if (window.track) window.track("map_search", { query: query.slice(0, 50), matches: matchCount });
      if (announcerRef.current) {
        announcerRef.current.textContent =
          matchCount === 0
            ? "No stops match."
            : `${matchCount} ${matchCount === 1 ? "stop matches" : "stops match"}.`;
      }
    }, 800);
    return () => clearTimeout(t);
  }, [query, matchCount]);

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

  // ---- Mobile bottom-sheet swipe ------------------------------------------
  // The handle accepts vertical drag in addition to taps. During a drag we
  // bypass the CSS snap classes by writing translateY directly to the aside;
  // on release we choose the nearest snap (biased by flick velocity).
  const dragRef = useRef(null);
  const skipNextClickRef = useRef(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(null);

  const baseTranslateYFor = (state) => {
    const vh = window.innerHeight;
    if (state === "peek") return vh * 0.9 - 60;
    if (state === "half") return vh * 0.4;
    return 0; // "full"
  };

  const snapForRelease = (currentTy, vy) => {
    const vh = window.innerHeight;
    const peekTy = vh * 0.9 - 60;
    const halfTy = vh * 0.4;
    const fullTy = 0;
    // Flick: bias toward the next snap in the swipe direction.
    if (vy < -600) return currentTy <= halfTy ? "full" : "half";
    if (vy > 600) return currentTy >= halfTy ? "peek" : "half";
    // Otherwise: nearest of the three snap points.
    const ranked = [
      ["full", Math.abs(currentTy - fullTy)],
      ["half", Math.abs(currentTy - halfTy)],
      ["peek", Math.abs(currentTy - peekTy)],
    ].sort((a, b) => a[1] - b[1]);
    return ranked[0][0];
  };

  const onHandlePointerDown = (e) => {
    if (window.innerWidth > 720) return; // bottom sheet is mobile-only
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      base: baseTranslateYFor(sheetState),
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {
      // Older browsers / unusual pointer types; gesture still works without capture.
    }
  };

  const onHandlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dy) < 6) return; // disambiguate tap from drag
    d.moved = true;
    const now = performance.now();
    // Sample velocity over a ~60ms window so the value isn't dominated by a
    // single noisy frame at release.
    if (now - d.lastT > 60) {
      d.lastY = e.clientY;
      d.lastT = now;
    }
    const vh = window.innerHeight;
    const peekTy = vh * 0.9 - 60;
    const next = Math.max(0, Math.min(peekTy, d.base + dy));
    setDragOffsetPx(next);
  };

  const onHandlePointerEnd = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.moved) {
      const vh = window.innerHeight;
      const peekTy = vh * 0.9 - 60;
      const finalTy = Math.max(
        0,
        Math.min(peekTy, d.base + (e.clientY - d.startY))
      );
      const dt = Math.max(1, performance.now() - d.lastT);
      const vy = ((e.clientY - d.lastY) / dt) * 1000;
      onSetSheetState(snapForRelease(finalTy, vy));
      // The browser fires a click after pointerup on touch; swallow it so the
      // chosen snap isn't immediately cycled away.
      skipNextClickRef.current = true;
    }
    dragRef.current = null;
    setDragOffsetPx(null);
  };

  const onHandleClick = () => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;
      return;
    }
    cycleSheet();
  };

  const asideStyle =
    dragOffsetPx != null
      ? { transform: `translateY(${dragOffsetPx}px)`, transition: "none" }
      : undefined;

  return (
    <aside
      className={`map-page__sidebar map-page__sidebar--${sheetState}`}
      style={asideStyle}
    >
      {/* Mobile-only handle for bottom-sheet snap points. CSS hides on desktop. */}
      <button
        type="button"
        className="map-sidebar__sheet-handle"
        onClick={onHandleClick}
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerEnd}
        onPointerCancel={onHandlePointerEnd}
        aria-label={`Trip planner panel — currently ${sheetState}. Tap or swipe up to expand.`}
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

      {/* Framing — what the curated pin set is and isn't. */}
      <div className="map-sidebar__section">
        <h3 className="map-sidebar__section-label">About these places</h3>
        <p className="map-sidebar__subtitle">
          Not every must-see in Yosemite lives on this map. Mist Trail, Tunnel View, and Lower Yosemite Falls still belong on your list. These pins are the curated in-between: quieter places worth a stop, and alternates for when the famous overlooks are full.
        </p>
      </div>

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
        {tripStopIds.length > 0 && (
          <div className="map-sidebar__trip-tools">
            <button
              type="button"
              className="map-sidebar__trip-tool"
              onClick={onShareTrip}
            >Copy link to this trip</button>
            {tripStopIds.length >= 2 && (
              <button
                type="button"
                className="map-sidebar__trip-tool"
                onClick={onOpenRoute}
              >Open route in Google Maps</button>
            )}
          </div>
        )}
        {tripStopIds.length >= 2 && (
          <TripEmailBox
            tripStopIds={tripStopIds}
            onFallbackCopy={onShareTrip}
            onSubscribed={onEmailSubscribed}
          />
        )}
        {tripFeatures.length >= 3 && <TripNextSteps tripFeatures={tripFeatures} go={go} />}
        {toast && (
          <div className="map-sidebar__toast" role="status" aria-live="off">
            <span>{toast.msg}</span>
            {toast.undoable && (
              <button
                type="button"
                className="map-sidebar__toast-undo"
                onClick={onUndo}
              >Undo</button>
            )}
          </div>
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

      {/* Filter by type — chips control both the map pins and the list below. */}
      <CategoryFilters
        features={features}
        activeCats={activeCats}
        onToggleCategory={onToggleCategory}
      />

      {/* Browse by area */}
      <div className="map-sidebar__section">
        <h3 className="map-sidebar__section-label">Browse by area</h3>
        <input
          type="search"
          className="map-sidebar__search"
          placeholder="Find a stop"
          aria-label="Search stops by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {query && (
          <p className="map-sidebar__search-count">
            {matchCount === 0
              ? "No stops match."
              : `${matchCount} ${matchCount === 1 ? "stop matches" : "stops match"}.`}
          </p>
        )}
        <div className="map-sidebar__regions">
          {regionGroups.map((r) => {
            // While searching, regions with matches render expanded and empty
            // ones drop out; the manual accordion state resumes on clear.
            if (query && r.stops.length === 0) return null;
            const isExpanded = query ? true : expandedRegions.has(r.id);
            const stopCount = r.stops.length;
            // "Add all" ignores the search query: its counts come from the
            // category-filtered set (catStops), not the searched list.
            const addableCount = r.catStops.length;
            const inTripCount = r.catStops.filter((f) => tripSet.has(f.properties.id)).length;
            const allInTrip = addableCount > 0 && inTripCount === addableCount;
            const addAllDisabled = addableCount === 0 || allInTrip || tripFull;
            const addAllTitle = addableCount === 0
              ? "No stops to add with the current filters"
              : allInTrip
              ? "All stops in this region are already in your trip"
              : tripFull
              ? `Trip is full at ${TRIP_CAP} stops`
              : `Add all ${addableCount} stops from ${r.label}`;
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
                    <p className="map-sidebar__region-empty">(no stops with these filters)</p>
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

    </aside>
  );
}

// The old display-only legend, now clickable filter chips. Keyed off the
// categories that actually appear in the current feature set (with counts),
// so it stays in sync with points.geojson without manual edits.
function CategoryFilters({ features, activeCats, onToggleCategory }) {
  const present = useMemo(() => {
    const counts = new Map();
    for (const f of features) {
      const c = f.properties && f.properties.category;
      if (!c) continue;
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [features]);

  if (present.length === 0) return null;

  return (
    <div className="map-sidebar__section">
      <h3 className="map-sidebar__section-label">Filter by type</h3>
      <p className="map-sidebar__hint">
        Chips toggle pin types on the map and in the list below. Trip stops stay visible.
      </p>
      <div className="map-sidebar__filters">
        {present.map(([cat, count]) => {
          const { color, label } = getCategoryStyle(cat);
          const active = activeCats.has(cat);
          return (
            <button
              key={cat}
              type="button"
              className="map-sidebar__filter-chip"
              aria-pressed={active}
              onClick={() => onToggleCategory(cat)}
            >
              <span
                className="map-sidebar__legend-dot"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span>{label} ({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// The Maps JS API key, reused for Street View Static API image URLs without a
// second key. Now a module constant (the script is injected on demand by
// injectGoogleMaps rather than read from a global index.html tag).
function getMapsApiKey() {
  return MAPS_API_KEY;
}

// Returns a Street View Static API thumbnail URL for the given lat/lng.
// Falls back gracefully: the <img> carries onerror="this.style.display='none'"
// so missing Street View coverage (remote trailheads, etc.) is invisible.
function streetViewUrl(lat, lng, apiKey) {
  return `https://maps.googleapis.com/maps/api/streetview?size=280x120&location=${lat},${lng}&key=${encodeURIComponent(apiKey)}&pitch=10&fov=80`;
}

// coords is [lng, lat] from GeoJSON geometry.coordinates, passed through from
// the feature so we don't have to re-look it up from properties.
function buildInfoHtml(p, coords, tripStopIds) {
  const style = getCategoryStyle(p.category);
  let photo = "";
  if (p.image) {
    photo = `<img src="/${p.image}" alt="" loading="lazy" style="width:100%;height:120px;object-fit:cover;display:block;border-radius:3px;margin-bottom:10px;">`;
  } else if (coords) {
    const apiKey = getMapsApiKey();
    if (apiKey) {
      const [lng, lat] = coords;
      const svUrl = streetViewUrl(lat, lng, apiKey);
      photo = `<img src="${svUrl}" alt="" loading="lazy" onerror="this.style.display='none'" style="width:100%;height:120px;object-fit:cover;display:block;border-radius:3px;margin-bottom:10px;">`;
    }
  }
  const cat = p.category
    ? `<span style="display:inline-flex;align-items:center;gap:5px;text-transform:uppercase;font-size:10px;letter-spacing:0.06em;color:${style.color};font-weight:600;">
         <span style="width:7px;height:7px;border-radius:50%;background:${style.color};display:inline-block;flex-shrink:0;"></span>
         ${escapeHtml(style.label)}
       </span>`
    : "";
  // Coord verification status comes straight from points.geojson; 17 of the
  // 31 pins are web-sourced but not ground-truthed.
  const approx = p.verified === false
    ? `<p style="margin:5px 0 0;font-size:11px;color:#8a8675;">Pin location is approximate.</p>`
    : "";
  const blurb = p.blurb ? `<p style="margin:7px 0 0;font-size:12px;color:#444;line-height:1.5;">${escapeHtml(p.blurb)}</p>` : "";
  const inTrip = Array.isArray(tripStopIds) && tripStopIds.includes(p.id);
  const btnLabel = inTrip ? "Remove from trip" : "Add to trip";
  const btnBg = inTrip ? "#ffffff" : TRIP_PIN_COLOR;
  const btnColor = inTrip ? TRIP_PIN_COLOR : "#ffffff";
  const btn = `<button type="button" data-trip-toggle data-stop-id="${escapeHtml(p.id)}" style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font:600 12px system-ui,sans-serif;background:${btnBg};color:${btnColor};border:1px solid ${TRIP_PIN_COLOR};border-radius:3px;cursor:pointer;">${escapeHtml(btnLabel)}</button>`;
  // Coordinate-based DIRECTIONS links are safe on every pin (they route
  // navigation), unlike coordinate-synthesized PLACE links (see gmapsUrl
  // below). This gives stops without a verified place URL a way out the door.
  let directions = "";
  if (coords) {
    const [lng, lat] = coords;
    const dirUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${encodeURIComponent(`${lat},${lng}`)}` +
      `&travelmode=driving`;
    directions = `<p style="margin:8px 0 0;"><a href="${escapeHtml(dirUrl)}" data-directions-link data-stop-id="${escapeHtml(p.id)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Directions →</a></p>`;
  }
  // Only render a Google Maps link when the stop carries a verified URL —
  // synthesizing one from coordinates would point at a generic dropped pin
  // rather than the named place with its photos and reviews.
  const gmaps = p.gmapsUrl
    ? `<p style="margin:8px 0 0;"><a href="${escapeHtml(p.gmapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Open in Google Maps →</a></p>`
    : "";
  // Per-pin deep link. /map?stop=<id> already selects a pin on load, so the
  // share URL costs nothing; the copy handler lives in the domready wireup.
  const stopShare = `<p style="margin:8px 0 0;"><a href="/map?stop=${escapeHtml(p.id)}" data-stop-share data-stop-id="${escapeHtml(p.id)}" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Copy link to this stop</a></p>`;
  // Cross-links into the journal. Slugs come from points.geojson; anything
  // that no longer resolves against the live catalog is skipped silently.
  // The anchors get real hrefs for hover/long-press affordance, but clicks
  // are intercepted in the InfoWindow domready wireup and routed via go().
  let journal = "";
  if (Array.isArray(p.articles) && p.articles.length > 0) {
    const links = p.articles
      .map((slug) => {
        const a = (window.ARTICLES || []).find((x) => x.slug === slug);
        if (!a) return "";
        return `<p style="margin:4px 0 0;font-size:12px;line-height:1.4;"><a href="/articles/${escapeHtml(slug)}" data-article-link data-article-slug="${escapeHtml(slug)}" style="color:#1e6fb8;text-decoration:underline;font-weight:500;">${escapeHtml(a.title)}</a></p>`;
      })
      .filter(Boolean);
    if (links.length > 0) {
      journal =
        `<div style="margin:10px 0 0;padding-top:8px;border-top:1px solid #e3ddcf;">` +
        `<span style="text-transform:uppercase;font-size:10px;letter-spacing:0.06em;color:#8a8675;font-weight:600;">From the journal</span>` +
        links.join("") +
        `</div>`;
    }
  }
  return `
    <div style="font:13px/1.5 system-ui,sans-serif;max-width:280px;color:#222;">
      ${photo}
      <strong style="font-size:14px;display:block;margin:0 0 4px;line-height:1.3;">${escapeHtml(p.name || "")}</strong>
      ${cat}
      ${approx}
      ${blurb}
      ${btn}
      ${directions}
      ${gmaps}
      ${stopShare}
      ${journal}
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

// ---------------------------------------------------------------------------
// Trip-builder signup gate. The map itself (pins, filters, search, a shared
// trip opened via ?trip=) is browsable by everyone with no gate at all; this
// overlay appears only when a locked visitor attempts a write action — adding
// a stop, "add all from region", or loading a suggested trip (see openGate in
// MapView). Unlike the old full-view gate, this one is dismissable (close
// button, backdrop click, Escape): browsing needs no signup, so trapping a
// visitor who was just looking would be hostile. The overlay does not lock
// body scroll, leaving the global header and footer reachable. Reuses the
// exit-intent modal's .nlmodal card styling. The signup also satisfies the
// shared "subscribed" flag (via trackNewsletterSubmit), suppressing the
// exit-intent modal elsewhere on the site.
// ---------------------------------------------------------------------------
function MapAccessGate({ onSubscribed, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="map-page__gate" role="dialog" aria-modal="true" aria-label="Subscribe to save this trip">
      <div className="map-page__gate-backdrop" onClick={onClose} />
      <div className="nlmodal__card map-page__gate-card">
        <button type="button" className="nlmodal__close" aria-label="Close" onClick={onClose}>✕</button>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Map · Trip Builder</div>
        <h3>Save this trip.</h3>
        <p>Browsing the map is free. Building and saving a trip: tapping pins to assemble a route, loading a suggested itinerary, is open to subscribers. Drop your email and it opens right here, and stays open on this device.</p>
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => {
            if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("map_trip_gate", "map-gate");
            // Defer one tick so the form's native POST into the hidden iframe
            // fires before onSubscribed unmounts this form.
            setTimeout(onSubscribed, 0);
          }}
        >
          <input type="email" name="email" placeholder="you@email.com" required />
          <input type="hidden" name="tag" value="map-gate" />
          <input type="hidden" name="embed" value="1" />
          <button type="submit">Unlock the trip builder →</button>
        </form>
        <p className="map-gate__fine">No spam. One short letter on Sundays, when there is something to say.</p>
      </div>
    </div>
  );
}

// The map page itself stays indexable and fully browsable; only the trip
// builder sits behind the subscriber gate above (MapAccessGate, rendered by
// MapView on the first write action from a locked visitor).
function MapPage(props) {
  return <MapView {...props} />;
}

window.MapPage = MapPage;
