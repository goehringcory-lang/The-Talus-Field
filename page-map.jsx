/* global React, MapView, PinList, FilterChips, AdminOverlay, CATEGORY_META */
// =============================================================================
// MAP PAGE — `/map` route. Hidden preview while the feature is being tested:
// not linked from nav, not in sitemap, ships with <meta name="robots" noindex>.
//
// Owns all map state. Fetches points.geojson, parses URL params, and renders
// the split-view layout (filter chips + sidebar list + Leaflet map). The
// admin overlay activates when ?admin=1 is present in the query string.
// =============================================================================

const { useEffect, useMemo, useState, useCallback } = React;

const POINTS_URL = "/points.geojson?v=1";

// Read URL state on mount (and on popstate). Returns parsed state.
function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const stop = params.get("stop") || null;
  const catParam = params.get("cat");
  const cats = catParam
    ? catParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const admin = params.get("admin") === "1";
  return { stop, cats, admin };
}

// Replace the current URL with one that reflects current state, without
// pushing a new history entry. Selection + filter live in the query string;
// the path stays /map.
function writeUrlState({ selectedPinId, filterCategories, admin }) {
  const params = new URLSearchParams();
  if (selectedPinId) params.set("stop", selectedPinId);
  if (filterCategories && filterCategories.length > 0) {
    params.set("cat", filterCategories.join(","));
  }
  if (admin) params.set("admin", "1");
  const qs = params.toString();
  const newUrl = "/map" + (qs ? `?${qs}` : "");
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, "", newUrl);
  }
}

function MapPage() {
  const [features, setFeatures] = useState(null); // null = loading, [] = loaded empty
  const [error, setError] = useState(null);

  // Read initial URL state once. Subsequent state changes write back to URL.
  const initial = useMemo(() => readUrlState(), []);
  const [selectedPinId, setSelectedPinId] = useState(initial.stop);
  const [selectionSource, setSelectionSource] = useState(
    initial.stop ? "url" : null
  );
  const [filterCategories, setFilterCategories] = useState(initial.cats);
  const [hoveredPinId, setHoveredPinId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const adminMode = initial.admin;

  // Fetch points.geojson once.
  useEffect(() => {
    let cancelled = false;
    fetch(POINTS_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const fc = (data && data.features) || [];
        setFeatures(fc);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || String(err));
        setFeatures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync URL with state. Skip on initial mount (initial state already came
  // from the URL) — but the dependency array does this implicitly: the first
  // render writes a no-op URL update which short-circuits inside writeUrlState.
  useEffect(() => {
    writeUrlState({ selectedPinId, filterCategories, admin: adminMode });
  }, [selectedPinId, filterCategories, adminMode]);

  // Filtered feature set. Empty filterCategories means "show all".
  const filteredFeatures = useMemo(() => {
    if (!features) return [];
    if (filterCategories.length === 0) return features;
    return features.filter((f) =>
      filterCategories.includes(f.properties.category)
    );
  }, [features, filterCategories]);

  // If the selected pin gets filtered out, drop the selection so the map
  // doesn't try to fly to a marker that isn't rendered. Skip while features
  // are still loading — otherwise a deep-linked ?stop=... selection gets
  // wiped out before the data even arrives.
  useEffect(() => {
    if (!selectedPinId) return;
    if (!features) return;
    const inFiltered = filteredFeatures.some(
      (f) => f.properties.id === selectedPinId
    );
    if (!inFiltered) {
      setSelectedPinId(null);
      setSelectionSource(null);
    }
  }, [features, filteredFeatures, selectedPinId]);

  // Sync state from URL on browser back/forward. Without this, popstate
  // updates window.location but MapPage doesn't notice because the route
  // (`map`) is unchanged.
  useEffect(() => {
    const onPop = () => {
      const next = readUrlState();
      setSelectedPinId(next.stop);
      setSelectionSource(next.stop ? "url" : null);
      setFilterCategories(next.cats);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Selection handlers. Source distinguishes who clicked — the map,
  // the list, or a URL deep-link — so MapView and PinList can decide
  // whether to fly/scroll or sit still.
  const selectFromList = useCallback((id) => {
    setSelectedPinId(id);
    setSelectionSource("list");
  }, []);
  const selectFromMap = useCallback((id) => {
    setSelectedPinId(id);
    setSelectionSource("map");
  }, []);

  const toggleCategory = useCallback((cat) => {
    setFilterCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);
  const clearCategories = useCallback(() => setFilterCategories([]), []);

  if (features === null) {
    return (
      <div className="map-page map-page--loading">
        <p>Loading map…</p>
      </div>
    );
  }

  if (error && features.length === 0) {
    return (
      <div className="map-page map-page--error">
        <p>Map data failed to load: {error}</p>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-page__top">
        <h1 className="map-page__title">
          The Talus Field map{" "}
          <span className="map-page__hidden-tag" title="Hidden preview — URL access only, noindex.">
            preview
          </span>
        </h1>
        <FilterChips
          allFeatures={features}
          activeCategories={filterCategories}
          onToggle={toggleCategory}
          onClear={clearCategories}
        />
      </div>
      <div className="map-page__split">
        <PinList
          features={filteredFeatures}
          selectedPinId={selectedPinId}
          selectionSource={selectionSource}
          onSelect={selectFromList}
          onHover={setHoveredPinId}
        />
        <div className="map-page__map-wrap">
          <MapView
            features={filteredFeatures}
            selectedPinId={selectedPinId}
            selectionSource={selectionSource}
            hoveredPinId={hoveredPinId}
            onPinClick={selectFromMap}
            onMapReady={setMapInstance}
          />
          {adminMode && mapInstance && <AdminOverlay map={mapInstance} />}
        </div>
      </div>
    </div>
  );
}

window.MapPage = MapPage;
