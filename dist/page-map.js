var {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} = React;
var POINTS_URL = "/points.geojson?v=25";
window.POINTS_URL = POINTS_URL;
var MAP_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var STORAGE_KEY = "tfg.trip";
var STORAGE_VERSION = 1;
var TRIP_CAP = 30;
var TRIP_PIN_COLOR = "#7a8f5a";
var ROUTE_STOP_LIMIT = 11;
var MOBILE_SELECT_PAN_Y = -80;
var TOAST_MS = 2500;
var TOAST_UNDO_MS = 6000;
var MAP_UNLOCK_KEY = "tfg.map.unlocked";
function isMapUnlocked() {
  return window.safeStorage.get(MAP_UNLOCK_KEY, "1") === "1";
}
function setMapUnlocked() {
  window.safeStorage.set(MAP_UNLOCK_KEY, "1");
}
var REGIONS = [{
  id: "valley",
  label: "Yosemite Valley",
  keys: ["valley"]
}, {
  id: "glacier-point",
  label: "Greater Valley & Glacier Point",
  keys: ["glacier-point"]
}, {
  id: "wawona",
  label: "Wawona",
  keys: ["wawona"]
}, {
  id: "tuolumne-area",
  label: "Tuolumne & Hetch Hetchy",
  keys: ["tuolumne", "hetch-hetchy"]
}];
var QUICK_PICKS = (window.ITINERARIES || []).map(it => ({
  id: it.id,
  label: it.label
}));
var CATEGORY_STYLES = {
  hike: {
    color: "#2f8a3e",
    label: "Hike"
  },
  vista: {
    color: "#1e6fb8",
    label: "Vista"
  },
  picnic: {
    color: "#e07a1a",
    label: "Picnic"
  },
  parking: {
    color: "#6b6b6b",
    label: "Parking"
  },
  eat: {
    color: "#b9453d",
    label: "Eat"
  }
};
var CATEGORY_FALLBACK = {
  color: "#666",
  label: "Other"
};
function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_FALLBACK;
}
var ALL_CATEGORIES = Object.keys(CATEGORY_STYLES);
function parseCatParam(raw) {
  if (raw === null || raw === undefined) return new Set(ALL_CATEGORIES);
  if (raw === "") return new Set();
  var out = new Set();
  for (var token of raw.split(",")) {
    var t = token.trim();
    if (CATEGORY_STYLES[t]) out.add(t);
  }
  return out.size > 0 ? out : new Set(ALL_CATEGORIES);
}
function serializeCats(activeCats) {
  if (ALL_CATEGORIES.every(c => activeCats.has(c))) return null;
  return Array.from(activeCats).sort().join(",");
}
function readUrlState() {
  var params = new URLSearchParams(window.location.search);
  return {
    stop: params.get("stop") || null,
    trip: params.get("trip") || null,
    cat: params.get("cat")
  };
}
function parseTripParam(raw, validIds) {
  if (!raw) return [];
  var seen = new Set();
  var out = [];
  for (var id of raw.split(",")) {
    var trimmed = id.trim();
    if (!trimmed || !validIds.has(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= TRIP_CAP) break;
  }
  return out;
}
function writeUrlState({
  stop,
  cat
}) {
  var params = new URLSearchParams();
  if (stop) params.set("stop", stop);
  if (cat !== null && cat !== undefined) params.set("cat", cat);
  var qs = params.toString();
  var newUrl = "/map" + (qs ? `?${qs}` : "");
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.replaceState(window.history.state, "", newUrl);
  }
}
function loadTripFromStorage(validIds) {
  var parsed = window.safeStorage.getJSON(STORAGE_KEY);
  if (!parsed || !Array.isArray(parsed.ids)) return [];
  var seen = new Set();
  var out = [];
  for (var id of parsed.ids) {
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
  window.safeStorage.setJSON(STORAGE_KEY, {
    v: STORAGE_VERSION,
    ids
  });
}
var MAPS_API_KEY = "AIzaSyA03kEmQWQ52I7PiT9E2VyomelcpeKb_IU";
var MAPS_JS_SRC = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=weekly&libraries=marker&loading=async`;
function injectGoogleMaps() {
  if (window.google && window.google.maps) return;
  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) return;
  var s = document.createElement("script");
  s.src = MAPS_JS_SRC;
  s.async = true;
  document.head.appendChild(s);
}
function mapsApiReady() {
  return !!(window.google && window.google.maps && typeof window.google.maps.importLibrary === "function");
}
function waitForGoogleMaps(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (mapsApiReady()) {
      resolve(window.google.maps);
      return;
    }
    injectGoogleMaps();
    var start = Date.now();
    var interval = setInterval(() => {
      if (mapsApiReady()) {
        clearInterval(interval);
        resolve(window.google.maps);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error("Google Maps API didn't load. Check the API key in index.html and that the Maps JavaScript API is enabled in the Cloud console."));
      }
    }, 100);
  });
}
var CLUSTERER_SRC = "https://unpkg.com/@googlemaps/markerclusterer@2.5.3/dist/index.min.js";
var CLUSTER_MAX_ZOOM = 12;
function markerClustererLoaded() {
  return !!(window.markerClusterer && window.markerClusterer.MarkerClusterer);
}
function injectMarkerClusterer() {
  if (markerClustererLoaded()) return;
  if (document.querySelector(`script[src="${CLUSTERER_SRC}"]`)) return;
  var s = document.createElement("script");
  s.src = CLUSTERER_SRC;
  s.async = true;
  document.head.appendChild(s);
}
function waitForMarkerClusterer(timeoutMs = 8000) {
  return new Promise(resolve => {
    if (markerClustererLoaded()) {
      resolve(window.markerClusterer);
      return;
    }
    injectMarkerClusterer();
    var start = Date.now();
    var interval = setInterval(() => {
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
function buildClusterRenderer(markerLib) {
  return {
    render({
      count,
      position
    }) {
      var div = document.createElement("div");
      div.className = "map-cluster";
      div.textContent = String(count);
      return new markerLib.AdvancedMarkerElement({
        position,
        content: div,
        zIndex: 1000 + count
      });
    }
  };
}
function buildPinElement(markerLib, {
  background,
  glyphText
}) {
  return new markerLib.PinElement({
    background,
    borderColor: "#ffffff",
    glyphText: glyphText || undefined,
    glyphColor: "#ffffff",
    scale: 1
  });
}
function MapView({
  go
}) {
  var containerRef = useRef(null);
  var mapRef = useRef(null);
  var markerLibRef = useRef(null);
  var markersRef = useRef({});
  var infoRef = useRef(null);
  var openFeatureRef = useRef(null);
  var tripActionRef = useRef(() => {});
  var tripStopIdsRef = useRef([]);
  var goRef = useRef(go);
  var announcerRef = useRef(null);
  var toastTimerRef = useRef(null);
  var clustererRef = useRef(null);
  var markerModesRef = useRef({});
  var pendingUndoRef = useRef(null);
  var [features, setFeatures] = useState(null);
  var [error, setError] = useState(null);
  var [mapReady, setMapReady] = useState(false);
  var [toast, setToast] = useState(null);
  var [unlocked, setUnlocked] = useState(() => isMapUnlocked() || window.isSubscribed && window.isSubscribed());
  var [gateOpen, setGateOpen] = useState(false);
  var initial = useMemo(() => readUrlState(), []);
  var [selectedStopId, setSelectedStopId] = useState(initial.stop);
  var [tripStopIds, setTripStopIds] = useState([]);
  var [activeCats, setActiveCats] = useState(() => parseCatParam(initial.cat));
  var [hasClusterer, setHasClusterer] = useState(false);
  var [expandedRegions, setExpandedRegions] = useState(() => new Set(REGIONS.map(r => r.id)));
  var [sheetState, setSheetState] = useState("peek");
  useEffect(() => {
    goRef.current = go;
  });
  useEffect(() => {
    tripStopIdsRef.current = tripStopIds;
  });
  useEffect(() => {
    var cancelled = false;
    fetch(POINTS_URL).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${POINTS_URL}`);
      return r.json();
    }).then(data => {
      if (cancelled) return;
      var feats = data && data.features || [];
      setFeatures(feats);
      var validIds = new Set(feats.map(f => f.properties.id));
      var shared = parseTripParam(initial.trip, validIds);
      if (shared.length > 0) {
        setTripStopIds(shared);
        announce(`Loaded a shared trip. ${shared.length} ${shared.length === 1 ? "stop" : "stops"}.`);
        if (window.track) window.track("trip_share_open", {
          trip_size: shared.length
        });
      } else {
        setTripStopIds(loadTripFromStorage(validIds));
      }
    }).catch(err => {
      if (cancelled) return;
      setError(err.message);
      setFeatures([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (features === null) return;
    saveTripToStorage(tripStopIds);
  }, [tripStopIds, features]);
  useEffect(() => {
    writeUrlState({
      stop: selectedStopId,
      cat: serializeCats(activeCats)
    });
  }, [selectedStopId, activeCats]);
  useEffect(() => {
    var onPop = () => {
      var next = readUrlState();
      setSelectedStopId(next.stop);
      setActiveCats(parseCatParam(next.cat));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  var toggleCategory = useCallback(cat => {
    var next = new Set(activeCats);
    var nowActive = !next.has(cat);
    if (nowActive) next.add(cat);else next.delete(cat);
    setActiveCats(next);
    if (features) {
      var tripSet = new Set(tripStopIdsRef.current);
      var shown = features.filter(f => next.has(f.properties.category) || tripSet.has(f.properties.id)).length;
      announce(`${getCategoryStyle(cat).label} pins ${nowActive ? "shown" : "hidden"}. ${shown} of ${features.length} stops shown.`);
    }
    if (window.track) {
      window.track("map_filter_category", {
        category: cat,
        active: nowActive,
        active_count: next.size
      });
    }
  }, [activeCats, features, announce]);
  var announce = useCallback((msg, opts) => {
    var undoable = !!(opts && opts.undoable);
    if (!undoable) pendingUndoRef.current = null;
    if (announcerRef.current) {
      announcerRef.current.textContent = undoable ? `${msg} Undo available.` : msg;
    }
    setToast({
      msg,
      undoable
    });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      pendingUndoRef.current = null;
    }, undoable ? TOAST_UNDO_MS : TOAST_MS);
  }, []);
  var featureNameById = useCallback(id => {
    if (!features) return id;
    var f = features.find(x => x.properties.id === id);
    return f ? f.properties.name : id;
  }, [features]);
  var openGate = useCallback(() => {
    setGateOpen(true);
  }, []);
  var handleGateSubscribed = useCallback(() => {
    setMapUnlocked();
    setUnlocked(true);
    setGateOpen(false);
  }, []);
  useEffect(() => {
    if (gateOpen && window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_trip_gate", "map-gate");
    }
  }, [gateOpen]);
  var performToggleTripStop = useCallback(id => {
    setTripStopIds(prev => {
      if (prev.includes(id)) {
        var _next = prev.filter(x => x !== id);
        announce(`Removed ${featureNameById(id)} from trip. ${_next.length} ${_next.length === 1 ? "stop" : "stops"}.`);
        return _next;
      }
      if (prev.length >= TRIP_CAP) {
        announce(`Trip is full at ${TRIP_CAP} stops. Remove one before adding more.`);
        return prev;
      }
      var next = [...prev, id];
      announce(`Added ${featureNameById(id)} to trip. ${next.length} ${next.length === 1 ? "stop" : "stops"}.`);
      return next;
    });
  }, [announce, featureNameById]);
  var toggleTripStop = useCallback((id, source) => {
    if (!unlocked) {
      openGate();
      return;
    }
    var adding = !tripStopIdsRef.current.includes(id);
    if (adding && window.track && tripStopIdsRef.current.length < TRIP_CAP) {
      window.track("trip_add", {
        stop_id: id,
        trip_size: tripStopIdsRef.current.length + 1,
        source: source || "sidebar"
      });
    }
    performToggleTripStop(id);
  }, [performToggleTripStop, unlocked, openGate]);
  var removeTripStop = useCallback(id => {
    setTripStopIds(prev => {
      if (!prev.includes(id)) return prev;
      var next = prev.filter(x => x !== id);
      announce(`Removed ${featureNameById(id)} from trip. ${next.length} ${next.length === 1 ? "stop" : "stops"}.`);
      return next;
    });
  }, [announce, featureNameById]);
  var moveTripStop = useCallback((id, dir) => {
    setTripStopIds(prev => {
      var idx = prev.indexOf(id);
      if (idx === -1) return prev;
      var newIdx = idx + (dir === "up" ? -1 : 1);
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      var next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      announce(`Moved ${featureNameById(id)} ${dir}. Now stop ${newIdx + 1} of ${next.length}.`);
      return next;
    });
  }, [announce, featureNameById]);
  var clearTrip = useCallback(() => {
    var prev = tripStopIdsRef.current;
    if (prev.length === 0) return;
    pendingUndoRef.current = {
      ids: prev
    };
    setTripStopIds([]);
    announce("Cleared trip. 0 stops.", {
      undoable: true
    });
  }, [announce]);
  var undoTripChange = useCallback(() => {
    var saved = pendingUndoRef.current;
    if (!saved) return;
    pendingUndoRef.current = null;
    setTripStopIds(saved.ids);
    if (window.track) window.track("trip_undo", {
      restored_size: saved.ids.length
    });
    announce(`Restored previous trip. ${saved.ids.length} ${saved.ids.length === 1 ? "stop" : "stops"}.`);
  }, [announce]);
  var performAddAllFromRegion = useCallback(regionId => {
    setTripStopIds(prev => {
      if (!features) return prev;
      var region = REGIONS.find(r => r.id === regionId);
      if (!region) return prev;
      var keys = new Set(region.keys);
      var regionStopIds = features.filter(f => keys.has(f.properties.region) && activeCats.has(f.properties.category)).map(f => f.properties.id);
      var have = new Set(prev);
      var next = [...prev];
      var added = 0;
      for (var id of regionStopIds) {
        if (have.has(id)) continue;
        if (next.length >= TRIP_CAP) break;
        next.push(id);
        added++;
      }
      if (added === 0) return prev;
      announce(`Added ${added} ${added === 1 ? "stop" : "stops"} from ${region.label}. ${next.length} ${next.length === 1 ? "stop" : "stops"} total.`);
      return next;
    });
  }, [announce, features, activeCats]);
  var addAllFromRegion = useCallback(regionId => {
    if (!unlocked) {
      openGate();
      return;
    }
    if (window.track) window.track("trip_add_all", {
      region: regionId
    });
    performAddAllFromRegion(regionId);
  }, [performAddAllFromRegion, unlocked, openGate]);
  var performApplyQuickPick = useCallback(quickPickId => {
    if (!features) return;
    var qp = QUICK_PICKS.find(q => q.id === quickPickId);
    if (!qp) return;
    var validIds = new Set(features.map(f => f.properties.id));
    var stops = (window.getItineraryStopIds ? window.getItineraryStopIds(qp.id) : []).filter(id => validIds.has(id)).slice(0, TRIP_CAP);
    if (stops.length === 0) return;
    var prev = tripStopIdsRef.current;
    if (prev.length > 0) pendingUndoRef.current = {
      ids: prev
    };
    setTripStopIds(stops);
    announce(`Loaded ${qp.label} suggested trip. ${stops.length} ${stops.length === 1 ? "stop" : "stops"}.`, {
      undoable: prev.length > 0
    });
  }, [announce, features]);
  var applyQuickPick = useCallback(quickPickId => {
    if (!unlocked) {
      openGate();
      return;
    }
    if (window.track) window.track("trip_quick_pick", {
      pick: quickPickId
    });
    performApplyQuickPick(quickPickId);
  }, [performApplyQuickPick, unlocked, openGate]);
  var shareTrip = useCallback(() => {
    var ids = tripStopIdsRef.current;
    if (ids.length === 0) return;
    var url = `${window.location.origin}/map?trip=${ids.join(",")}`;
    var done = () => {
      announce("Link copied. Anyone who opens it gets this trip.");
      if (window.track) window.track("trip_share", {
        trip_size: ids.length
      });
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
  var openTripRoute = useCallback(() => {
    if (!features) return;
    var byId = new Map(features.map(f => [f.properties.id, f]));
    var coords = tripStopIdsRef.current.map(id => byId.get(id)).filter(Boolean).map(f => f.geometry.coordinates);
    if (coords.length < 2) return;
    var used = coords.slice(0, ROUTE_STOP_LIMIT);
    var fmt = ([lng, lat]) => `${lat},${lng}`;
    var origin = fmt(used[0]);
    var destination = fmt(used[used.length - 1]);
    var waypoints = used.slice(1, -1).map(fmt).join("|");
    var url = `https://www.google.com/maps/dir/?api=1` + `&origin=${encodeURIComponent(origin)}` + `&destination=${encodeURIComponent(destination)}` + `&travelmode=driving`;
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    if (coords.length > ROUTE_STOP_LIMIT) {
      announce(`Route opens with the first ${ROUTE_STOP_LIMIT} stops. Google Maps caps waypoints.`);
    }
    if (window.track) window.track("trip_route_open", {
      trip_size: tripStopIdsRef.current.length
    });
    window.open(url, "_blank", "noopener");
  }, [features, announce]);
  useEffect(() => {
    tripActionRef.current = toggleTripStop;
  });
  var handleSelectStop = useCallback(id => {
    setSelectedStopId(id);
    if (window.innerWidth <= 720) setSheetState("peek");
  }, []);
  var handleToggleRegion = useCallback(regionId => {
    setExpandedRegions(prev => {
      var next = new Set(prev);
      if (next.has(regionId)) next.delete(regionId);else next.add(regionId);
      return next;
    });
  }, []);
  useEffect(() => {
    if (mapRef.current) return;
    if (!features || features.length === 0) return;
    if (!containerRef.current) return;
    var cancelled = false;
    waitForGoogleMaps().then(async maps => {
      if (cancelled) return;
      var markerLib = await maps.importLibrary("marker");
      if (cancelled) return;
      var map = new maps.Map(containerRef.current, {
        center: {
          lat: 37.85,
          lng: -119.55
        },
        zoom: 10,
        mapTypeId: "terrain",
        mapId: "DEMO_MAP_ID",
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy"
      });
      mapRef.current = map;
      markerLibRef.current = markerLib;
      infoRef.current = new maps.InfoWindow({
        maxWidth: 300
      });
      infoRef.current.addListener("closeclick", () => {
        openFeatureRef.current = null;
        setSelectedStopId(null);
      });
      setMapReady(true);
      waitForMarkerClusterer().then(mc => {
        if (cancelled || !mc) return;
        clustererRef.current = new mc.MarkerClusterer({
          map,
          markers: [],
          algorithm: new mc.SuperClusterAlgorithm({
            maxZoom: CLUSTER_MAX_ZOOM,
            radius: 60
          }),
          renderer: buildClusterRenderer(markerLib),
          onClusterClick: (event, cluster, m) => {
            if (window.track) window.track("map_cluster_click", {
              count: cluster.count
            });
            m.fitBounds(cluster.bounds);
          }
        });
        markerModesRef.current = {};
        setHasClusterer(true);
      });
    }).catch(err => {
      if (cancelled) return;
      setError(err.message);
    });
    return () => {
      cancelled = true;
    };
  }, [features]);
  useEffect(() => {
    if (!mapReady || !features) return;
    var map = mapRef.current;
    var markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    var maps = window.google.maps;
    var bounds = new maps.LatLngBounds();
    var _loop = function (feature) {
      var [lng, lat] = feature.geometry.coordinates;
      var p = feature.properties;
      var position = {
        lat,
        lng
      };
      bounds.extend(position);
      var pin = buildPinElement(markerLib, {
        background: getCategoryStyle(p.category).color
      });
      var marker = new markerLib.AdvancedMarkerElement({
        position,
        title: p.name,
        content: pin
      });
      marker.addEventListener("click", () => {
        if (window.track) window.track("map_pin_click", {
          stop_id: p.id,
          category: p.category || ""
        });
        openFeatureRef.current = feature;
        infoRef.current.setContent(buildInfoHtml(p, feature.geometry.coordinates, tripStopIdsRef.current));
        infoRef.current.open({
          anchor: marker,
          map
        });
        setSelectedStopId(p.id);
        if (window.innerWidth <= 720) setSheetState("peek");
      });
      markersRef.current[p.id] = marker;
    };
    for (var feature of features) {
      _loop(feature);
    }
    map.fitBounds(bounds, 40);
    var listener = maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > 12) map.setZoom(12);
    });
    return () => {
      maps.event.removeListener(listener);
    };
  }, [features, mapReady]);
  useEffect(() => {
    if (!mapReady || !features) return;
    var markerLib = markerLibRef.current;
    if (!markerLib) return;
    var tripIndex = new Map(tripStopIds.map((id, i) => [id, i]));
    for (var feature of features) {
      var p = feature.properties;
      var marker = markersRef.current[p.id];
      if (!marker) continue;
      var pin = tripIndex.has(p.id) ? buildPinElement(markerLib, {
        background: TRIP_PIN_COLOR,
        glyphText: String(tripIndex.get(p.id) + 1)
      }) : buildPinElement(markerLib, {
        background: getCategoryStyle(p.category).color
      });
      marker.content = pin;
    }
  }, [tripStopIds, features, mapReady]);
  useEffect(() => {
    if (!mapReady || !features) return;
    var map = mapRef.current;
    if (!map) return;
    var clusterer = clustererRef.current;
    var tripSet = new Set(tripStopIds);
    var modes = markerModesRef.current;
    var clusterChanged = false;
    for (var feature of features) {
      var p = feature.properties;
      var marker = markersRef.current[p.id];
      if (!marker) continue;
      var mode = tripSet.has(p.id) || p.id === selectedStopId ? "direct" : !activeCats.has(p.category) ? "hidden" : clusterer ? "clustered" : "direct";
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
    var of = openFeatureRef.current;
    if (of && modes[of.properties.id] === "hidden" && infoRef.current) {
      infoRef.current.close();
      openFeatureRef.current = null;
    }
  }, [tripStopIds, activeCats, selectedStopId, features, mapReady, hasClusterer]);
  useEffect(() => {
    if (!mapReady) return;
    var info = infoRef.current;
    if (!info || !info.getMap() || !openFeatureRef.current) return;
    var of = openFeatureRef.current;
    info.setContent(buildInfoHtml(of.properties, of.geometry.coordinates, tripStopIds));
  }, [tripStopIds, mapReady]);
  useEffect(() => {
    if (!mapReady) return;
    var info = infoRef.current;
    if (!info) return;
    var maps = window.google.maps;
    var listener = info.addListener("domready", () => {
      var btns = document.querySelectorAll("[data-trip-toggle]");
      btns.forEach(btn => {
        var fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
        fresh.addEventListener("click", e => {
          e.preventDefault();
          var id = fresh.getAttribute("data-stop-id");
          if (id) tripActionRef.current(id, "infowindow");
        });
      });
      var links = document.querySelectorAll("[data-article-link]");
      links.forEach(link => {
        var fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", e => {
          e.preventDefault();
          var slug = fresh.getAttribute("data-article-slug");
          if (!slug) return;
          if (window.track) window.track("map_article_click", {
            slug
          });
          if (goRef.current) goRef.current("a:" + slug);
        });
      });
      var shares = document.querySelectorAll("[data-stop-share]");
      shares.forEach(link => {
        var fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", e => {
          e.preventDefault();
          var id = fresh.getAttribute("data-stop-id");
          if (!id) return;
          var url = `${window.location.origin}/map?stop=${id}`;
          var done = () => {
            if (window.track) window.track("stop_share", {
              stop_id: id
            });
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
      var dirs = document.querySelectorAll("[data-directions-link]");
      dirs.forEach(link => {
        var fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);
        fresh.addEventListener("click", () => {
          if (window.track) {
            window.track("map_directions_click", {
              stop_id: fresh.getAttribute("data-stop-id") || ""
            });
          }
        });
      });
    });
    return () => {
      maps.event.removeListener(listener);
    };
  }, [mapReady]);
  useEffect(() => {
    if (!mapReady || !selectedStopId) return;
    var map = mapRef.current;
    var marker = markersRef.current[selectedStopId];
    if (!map || !marker) {
      setSelectedStopId(null);
      return;
    }
    map.panTo(marker.position);
    if (map.getZoom() < 13) map.setZoom(13);
    var feature = features && features.find(f => f.properties.id === selectedStopId);
    if (feature) {
      openFeatureRef.current = feature;
      infoRef.current.setContent(buildInfoHtml(feature.properties, feature.geometry.coordinates, tripStopIdsRef.current));
      infoRef.current.open({
        anchor: marker,
        map
      });
      if (window.innerWidth <= 720) map.panBy(0, MOBILE_SELECT_PAN_Y);
    }
  }, [selectedStopId, mapReady, features]);
  if (features === null) {
    return React.createElement("div", {
      className: "map-page map-page--loading"
    }, React.createElement("p", null, "Loading map…"));
  }
  return React.createElement("div", {
    className: `map-page${gateOpen ? " map-page--locked" : ""}`
  }, React.createElement(TripPlannerSidebar, {
    features: features,
    tripStopIds: tripStopIds,
    selectedStopId: selectedStopId,
    activeCats: activeCats,
    onToggleCategory: toggleCategory,
    onUndo: undoTripChange,
    expandedRegions: expandedRegions,
    sheetState: sheetState,
    onSetSheetState: setSheetState,
    onSelectStop: handleSelectStop,
    onToggleStop: toggleTripStop,
    onRemoveStop: removeTripStop,
    onMoveStop: moveTripStop,
    onClearTrip: clearTrip,
    onAddAllFromRegion: addAllFromRegion,
    onApplyQuickPick: applyQuickPick,
    onToggleRegion: handleToggleRegion,
    onShareTrip: shareTrip,
    onOpenRoute: openTripRoute,
    onEmailSubscribed: handleGateSubscribed,
    go: go,
    announcerRef: announcerRef,
    toast: toast
  }), React.createElement("div", {
    className: "map-page__main"
  }, error && React.createElement("div", {
    className: "map-page__error",
    role: "alert"
  }, "Map failed to load: ", error), React.createElement("div", {
    ref: containerRef,
    id: "map",
    className: "map-page__map"
  })), gateOpen && React.createElement(MapAccessGate, {
    onSubscribed: handleGateSubscribed,
    onClose: () => setGateOpen(false)
  }));
}
function TripEmailBox({
  tripStopIds,
  onFallbackCopy,
  onSubscribed
}) {
  var [state, setState] = useState("idle");
  var emailRef = useRef(null);
  var hpRef = useRef(null);
  useEffect(() => {
    if (window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_trip_email", "map-trip");
    }
  }, []);
  useEffect(() => {
    if (state === "failed" && onFallbackCopy) onFallbackCopy();
  }, [state, onFallbackCopy]);
  var onSubmit = e => {
    var email = emailRef.current ? emailRef.current.value.trim() : "";
    var website = hpRef.current ? hpRef.current.value : "";
    var ids = tripStopIds.slice(0, TRIP_CAP);
    if (!email || ids.length === 0) {
      e.preventDefault();
      return;
    }
    var wasSubscribed = window.isSubscribed && window.isSubscribed();
    if (wasSubscribed) {
      e.preventDefault();
    } else if (window.trackNewsletterSubmit) {
      window.trackNewsletterSubmit("map_trip_email", "map-trip");
    }
    if (window.track) window.track("trip_email_send", {
      trip_size: ids.length
    });
    if (!wasSubscribed && onSubscribed) setTimeout(onSubscribed, 0);
    setTimeout(() => setState("sending"), 0);
    fetch(`${MAP_API_BASE}/api/trip/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        stops: ids,
        website
      })
    }).then(r => setState(r.ok ? "sent" : "failed")).catch(() => setState("failed"));
  };
  if (state === "sent") {
    return React.createElement("div", {
      className: "map-sidebar__email"
    }, React.createElement("p", {
      className: "map-sidebar__email-fine map-sidebar__email-fine--sent",
      role: "status"
    }, "Sent. The trip is in your inbox."));
  }
  return React.createElement("div", {
    className: "map-sidebar__email"
  }, React.createElement("h4", {
    className: "map-sidebar__email-label"
  }, "Email this trip to yourself"), React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: onSubmit
  }, React.createElement("input", {
    ref: emailRef,
    type: "email",
    name: "email",
    placeholder: "you@email.com",
    required: true,
    "aria-label": "Email address"
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "map-trip"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("div", {
    style: {
      position: "absolute",
      left: "-10000px",
      width: 1,
      height: 1,
      overflow: "hidden"
    },
    "aria-hidden": "true"
  }, React.createElement("label", null, "Website", React.createElement("input", {
    ref: hpRef,
    type: "text",
    name: "website",
    tabIndex: -1,
    autoComplete: "off"
  }))), React.createElement("button", {
    type: "submit",
    disabled: state === "sending"
  }, state === "sending" ? "Sending…" : "Send the trip →")), React.createElement("p", {
    className: "map-sidebar__email-fine"
  }, state === "failed" ? "Could not send just now. The share link was copied instead." : "The link opens your stops on this map. Sending also signs you up for Sunday Field Notes, one short letter a week. Free, leave anytime."));
}
function TripNextSteps({
  tripFeatures,
  go
}) {
  var suggestion = useMemo(() => {
    var counts = new Map();
    tripFeatures.forEach(f => {
      (f.properties && f.properties.articles || []).forEach(slug => {
        counts.set(slug, (counts.get(slug) || 0) + 1);
      });
    });
    var best = null;
    counts.forEach((n, slug) => {
      var article = (window.ARTICLES || []).find(a => a.slug === slug);
      if (!article) return;
      if (!best || n > best.n) best = {
        n,
        article
      };
    });
    return best ? best.article : null;
  }, [tripFeatures]);
  return React.createElement("div", {
    className: "map-sidebar__next"
  }, React.createElement("h4", {
    className: "map-sidebar__next-label"
  }, "Before you go"), suggestion ? React.createElement("p", {
    className: "map-sidebar__next-line"
  }, "Reading for this trip:", " ", React.createElement("a", {
    href: `/articles/${suggestion.slug}`,
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("map_article_click", {
        slug: suggestion.slug,
        source: "trip_next"
      });
      go(`a:${suggestion.slug}`);
    }
  }, suggestion.title), ".") : React.createElement("p", {
    className: "map-sidebar__next-line"
  }, "Reading for this trip:", " ", React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "the planning guide"), "."), React.createElement("p", {
    className: "map-sidebar__next-line"
  }, "This trip, offline, at the trailhead: the Field Guide app is $19 for eighteen months.", " ", React.createElement("a", {
    href: "/guide",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("guide_teaser_click", {
        location: "map_sidebar"
      });
      go("guide");
    }
  }, "See the guide →")));
}
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
  toast
}) {
  var [searchQuery, setSearchQuery] = useState("");
  var query = searchQuery.trim().toLowerCase();
  var regionGroups = useMemo(() => {
    return REGIONS.map(r => {
      var keys = new Set(r.keys);
      var catStops = features.filter(f => keys.has(f.properties.region) && activeCats.has(f.properties.category));
      var stops = query ? catStops.filter(f => f.properties.name.toLowerCase().includes(query)) : catStops;
      return {
        ...r,
        stops,
        catStops
      };
    });
  }, [features, activeCats, query]);
  var matchCount = useMemo(() => regionGroups.reduce((n, r) => n + r.stops.length, 0), [regionGroups]);
  useEffect(() => {
    if (!query) return;
    var t = setTimeout(() => {
      if (window.track) window.track("map_search", {
        query: query.slice(0, 50),
        matches: matchCount
      });
      if (announcerRef.current) {
        announcerRef.current.textContent = matchCount === 0 ? "No stops match." : `${matchCount} ${matchCount === 1 ? "stop matches" : "stops match"}.`;
      }
    }, 800);
    return () => clearTimeout(t);
  }, [query, matchCount]);
  var tripFeatures = useMemo(() => {
    var byId = new Map(features.map(f => [f.properties.id, f]));
    return tripStopIds.map(id => byId.get(id)).filter(Boolean);
  }, [tripStopIds, features]);
  var tripSet = useMemo(() => new Set(tripStopIds), [tripStopIds]);
  var tripFull = tripStopIds.length >= TRIP_CAP;
  var cycleSheet = () => {
    var order = ["peek", "half", "full"];
    var idx = order.indexOf(sheetState);
    onSetSheetState(order[(idx + 1) % order.length]);
  };
  var dragRef = useRef(null);
  var skipNextClickRef = useRef(false);
  var [dragOffsetPx, setDragOffsetPx] = useState(null);
  var baseTranslateYFor = state => {
    var vh = window.innerHeight;
    if (state === "peek") return vh * 0.9 - 60;
    if (state === "half") return vh * 0.4;
    return 0;
  };
  var snapForRelease = (currentTy, vy) => {
    var vh = window.innerHeight;
    var peekTy = vh * 0.9 - 60;
    var halfTy = vh * 0.4;
    var fullTy = 0;
    if (vy < -600) return currentTy <= halfTy ? "full" : "half";
    if (vy > 600) return currentTy >= halfTy ? "peek" : "half";
    var ranked = [["full", Math.abs(currentTy - fullTy)], ["half", Math.abs(currentTy - halfTy)], ["peek", Math.abs(currentTy - peekTy)]].sort((a, b) => a[1] - b[1]);
    return ranked[0][0];
  };
  var onHandlePointerDown = e => {
    if (window.innerWidth > 720) return;
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      base: baseTranslateYFor(sheetState),
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };
  var onHandlePointerMove = e => {
    var d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    var dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dy) < 6) return;
    d.moved = true;
    var now = performance.now();
    if (now - d.lastT > 60) {
      d.lastY = e.clientY;
      d.lastT = now;
    }
    var vh = window.innerHeight;
    var peekTy = vh * 0.9 - 60;
    var next = Math.max(0, Math.min(peekTy, d.base + dy));
    setDragOffsetPx(next);
  };
  var onHandlePointerEnd = e => {
    var d = dragRef.current;
    if (!d) return;
    if (d.moved) {
      var vh = window.innerHeight;
      var peekTy = vh * 0.9 - 60;
      var finalTy = Math.max(0, Math.min(peekTy, d.base + (e.clientY - d.startY)));
      var dt = Math.max(1, performance.now() - d.lastT);
      var vy = (e.clientY - d.lastY) / dt * 1000;
      onSetSheetState(snapForRelease(finalTy, vy));
      skipNextClickRef.current = true;
    }
    dragRef.current = null;
    setDragOffsetPx(null);
  };
  var onHandleClick = () => {
    if (skipNextClickRef.current) {
      skipNextClickRef.current = false;
      return;
    }
    cycleSheet();
  };
  var asideStyle = dragOffsetPx != null ? {
    transform: `translateY(${dragOffsetPx}px)`,
    transition: "none"
  } : undefined;
  return React.createElement("aside", {
    className: `map-page__sidebar map-page__sidebar--${sheetState}`,
    style: asideStyle
  }, React.createElement("button", {
    type: "button",
    className: "map-sidebar__sheet-handle",
    onClick: onHandleClick,
    onPointerDown: onHandlePointerDown,
    onPointerMove: onHandlePointerMove,
    onPointerUp: onHandlePointerEnd,
    onPointerCancel: onHandlePointerEnd,
    "aria-label": `Trip planner panel — currently ${sheetState}. Tap or swipe up to expand.`
  }, React.createElement("span", {
    className: "map-sidebar__sheet-bar",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "map-sidebar__sheet-text"
  }, tripStopIds.length > 0 ? `My Trip (${tripStopIds.length})` : "Trip planner")), React.createElement("header", {
    className: "map-sidebar__header"
  }, React.createElement("h2", {
    className: "map-sidebar__title"
  }, "Trip planner"), React.createElement("p", {
    className: "map-sidebar__subtitle"
  }, "Tap pins on the map or use the buttons below to build a trip.")), React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "About these places"), React.createElement("p", {
    className: "map-sidebar__subtitle"
  }, "Not every must-see in Yosemite lives on this map. Mist Trail, Tunnel View, and Lower Yosemite Falls still belong on your list. These pins are the curated in-between: quieter places worth a stop, and alternates for when the famous overlooks are full.")), React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("div", {
    className: "map-sidebar__trip-head"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "My Trip"), tripStopIds.length > 0 && React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-clear",
    onClick: onClearTrip
  }, "Clear all")), tripStopIds.length === 0 ? React.createElement("p", {
    className: "map-sidebar__trip-empty"
  }, "Your trip is empty. Tap pins on the map, use the “+” buttons below, or load a suggested trip.") : React.createElement("ol", {
    className: "map-sidebar__trip-list"
  }, tripFeatures.map((f, idx) => {
    var p = f.properties;
    var cat = getCategoryStyle(p.category);
    var isSelected = p.id === selectedStopId;
    var isFirst = idx === 0;
    var isLast = idx === tripFeatures.length - 1;
    return React.createElement("li", {
      key: p.id,
      className: `map-sidebar__trip-item${isSelected ? " map-sidebar__trip-item--selected" : ""}`,
      tabIndex: 0,
      onKeyDown: e => {
        if (e.altKey && e.key === "ArrowUp") {
          e.preventDefault();
          onMoveStop(p.id, "up");
        } else if (e.altKey && e.key === "ArrowDown") {
          e.preventDefault();
          onMoveStop(p.id, "down");
        }
      }
    }, React.createElement("span", {
      className: "map-sidebar__trip-num",
      "aria-hidden": "true"
    }, idx + 1), React.createElement("button", {
      type: "button",
      className: "map-sidebar__trip-name",
      onClick: () => onSelectStop(p.id)
    }, React.createElement("span", {
      className: "map-sidebar__trip-text"
    }, p.name), React.createElement("span", {
      className: "map-sidebar__trip-cat",
      style: {
        color: cat.color
      }
    }, p.category)), React.createElement("div", {
      className: "map-sidebar__trip-actions"
    }, React.createElement("button", {
      type: "button",
      className: "map-sidebar__trip-btn",
      onClick: () => onMoveStop(p.id, "up"),
      disabled: isFirst,
      "aria-label": `Move ${p.name} up in trip`
    }, "↑"), React.createElement("button", {
      type: "button",
      className: "map-sidebar__trip-btn",
      onClick: () => onMoveStop(p.id, "down"),
      disabled: isLast,
      "aria-label": `Move ${p.name} down in trip`
    }, "↓"), React.createElement("button", {
      type: "button",
      className: "map-sidebar__trip-btn map-sidebar__trip-btn--remove",
      onClick: () => onRemoveStop(p.id),
      "aria-label": `Remove ${p.name} from trip`
    }, "×")));
  })), tripStopIds.length > 0 && React.createElement("div", {
    className: "map-sidebar__trip-tools"
  }, React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-tool",
    onClick: onShareTrip
  }, "Copy link to this trip"), tripStopIds.length >= 2 && React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-tool",
    onClick: onOpenRoute
  }, "Open route in Google Maps")), tripStopIds.length >= 2 && React.createElement(TripEmailBox, {
    tripStopIds: tripStopIds,
    onFallbackCopy: onShareTrip,
    onSubscribed: onEmailSubscribed
  }), tripFeatures.length >= 3 && React.createElement(TripNextSteps, {
    tripFeatures: tripFeatures,
    go: go
  }), toast && React.createElement("div", {
    className: "map-sidebar__toast",
    role: "status",
    "aria-live": "off"
  }, React.createElement("span", null, toast.msg), toast.undoable && React.createElement("button", {
    type: "button",
    className: "map-sidebar__toast-undo",
    onClick: onUndo
  }, "Undo")), React.createElement("div", {
    ref: announcerRef,
    className: "map-sidebar__sr-announcer",
    "aria-live": "polite",
    "aria-atomic": "true"
  })), React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "Suggested trips"), React.createElement("p", {
    className: "map-sidebar__hint"
  }, "Click to replace your current trip."), React.createElement("div", {
    className: "map-sidebar__quickpicks"
  }, QUICK_PICKS.map(qp => React.createElement("button", {
    key: qp.id,
    type: "button",
    className: "map-sidebar__quickpick",
    onClick: () => onApplyQuickPick(qp.id)
  }, qp.label)))), React.createElement(CategoryFilters, {
    features: features,
    activeCats: activeCats,
    onToggleCategory: onToggleCategory
  }), React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "Browse by area"), React.createElement("input", {
    type: "search",
    className: "map-sidebar__search",
    placeholder: "Find a stop",
    "aria-label": "Search stops by name",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value)
  }), query && React.createElement("p", {
    className: "map-sidebar__search-count"
  }, matchCount === 0 ? "No stops match." : `${matchCount} ${matchCount === 1 ? "stop matches" : "stops match"}.`), React.createElement("div", {
    className: "map-sidebar__regions"
  }, regionGroups.map(r => {
    if (query && r.stops.length === 0) return null;
    var isExpanded = query ? true : expandedRegions.has(r.id);
    var stopCount = r.stops.length;
    var addableCount = r.catStops.length;
    var inTripCount = r.catStops.filter(f => tripSet.has(f.properties.id)).length;
    var allInTrip = addableCount > 0 && inTripCount === addableCount;
    var addAllDisabled = addableCount === 0 || allInTrip || tripFull;
    var addAllTitle = addableCount === 0 ? "No stops to add with the current filters" : allInTrip ? "All stops in this region are already in your trip" : tripFull ? `Trip is full at ${TRIP_CAP} stops` : `Add all ${addableCount} stops from ${r.label}`;
    return React.createElement("section", {
      key: r.id,
      className: "map-sidebar__region"
    }, React.createElement("div", {
      className: "map-sidebar__region-head"
    }, React.createElement("button", {
      type: "button",
      className: "map-sidebar__region-toggle",
      onClick: () => onToggleRegion(r.id),
      "aria-expanded": isExpanded
    }, React.createElement("span", {
      className: "map-sidebar__region-chev",
      "aria-hidden": "true"
    }, isExpanded ? "▾" : "▸"), React.createElement("span", {
      className: "map-sidebar__region-name"
    }, r.label), React.createElement("span", {
      className: "map-sidebar__region-count"
    }, stopCount)), React.createElement("button", {
      type: "button",
      className: "map-sidebar__region-add",
      onClick: () => onAddAllFromRegion(r.id),
      disabled: addAllDisabled,
      title: addAllTitle
    }, "Add all")), isExpanded && (stopCount === 0 ? React.createElement("p", {
      className: "map-sidebar__region-empty"
    }, "(no stops with these filters)") : React.createElement("ul", {
      className: "map-sidebar__region-stops"
    }, r.stops.map(f => {
      var p = f.properties;
      var cat = getCategoryStyle(p.category);
      var inTrip = tripSet.has(p.id);
      return React.createElement("li", {
        key: p.id,
        className: `map-sidebar__region-row${p.id === selectedStopId ? " map-sidebar__region-row--selected" : ""}`
      }, React.createElement("button", {
        type: "button",
        className: "map-sidebar__region-stop",
        onClick: () => onSelectStop(p.id)
      }, React.createElement("span", {
        className: "map-sidebar__region-stop-name"
      }, p.name), React.createElement("span", {
        className: "map-sidebar__region-stop-cat",
        style: {
          color: cat.color
        }
      }, p.category)), React.createElement("button", {
        type: "button",
        className: `map-sidebar__region-stop-add${inTrip ? " map-sidebar__region-stop-add--in" : ""}`,
        onClick: () => onToggleStop(p.id),
        disabled: !inTrip && tripFull,
        "aria-label": inTrip ? `Remove ${p.name} from trip` : `Add ${p.name} to trip`
      }, inTrip ? "✓" : "+"));
    }))));
  }))));
}
function CategoryFilters({
  features,
  activeCats,
  onToggleCategory
}) {
  var present = useMemo(() => {
    var counts = new Map();
    for (var f of features) {
      var c = f.properties && f.properties.category;
      if (!c) continue;
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [features]);
  if (present.length === 0) return null;
  return React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "Filter by type"), React.createElement("p", {
    className: "map-sidebar__hint"
  }, "Chips toggle pin types on the map and in the list below. Trip stops stay visible."), React.createElement("div", {
    className: "map-sidebar__filters"
  }, present.map(([cat, count]) => {
    var {
      color,
      label
    } = getCategoryStyle(cat);
    var active = activeCats.has(cat);
    return React.createElement("button", {
      key: cat,
      type: "button",
      className: "map-sidebar__filter-chip",
      "aria-pressed": active,
      onClick: () => onToggleCategory(cat)
    }, React.createElement("span", {
      className: "map-sidebar__legend-dot",
      style: {
        backgroundColor: color
      },
      "aria-hidden": "true"
    }), React.createElement("span", null, label, " (", count, ")"));
  })));
}
function getMapsApiKey() {
  return MAPS_API_KEY;
}
function streetViewUrl(lat, lng, apiKey) {
  return `https://maps.googleapis.com/maps/api/streetview?size=280x120&location=${lat},${lng}&key=${encodeURIComponent(apiKey)}&pitch=10&fov=80`;
}
function buildInfoHtml(p, coords, tripStopIds) {
  var style = getCategoryStyle(p.category);
  var photo = "";
  if (p.image) {
    photo = `<img src="/${p.image}" alt="" loading="lazy" style="width:100%;height:120px;object-fit:cover;display:block;border-radius:3px;margin-bottom:10px;">`;
  } else if (coords) {
    var apiKey = getMapsApiKey();
    if (apiKey) {
      var [lng, lat] = coords;
      var svUrl = streetViewUrl(lat, lng, apiKey);
      photo = `<img src="${svUrl}" alt="" loading="lazy" onerror="this.style.display='none'" style="width:100%;height:120px;object-fit:cover;display:block;border-radius:3px;margin-bottom:10px;">`;
    }
  }
  var cat = p.category ? `<span style="display:inline-flex;align-items:center;gap:5px;text-transform:uppercase;font-size:10px;letter-spacing:0.06em;color:${style.color};font-weight:600;">
         <span style="width:7px;height:7px;border-radius:50%;background:${style.color};display:inline-block;flex-shrink:0;"></span>
         ${escapeHtml(style.label)}
       </span>` : "";
  var approx = p.verified === false ? `<p style="margin:5px 0 0;font-size:11px;color:#8a8675;">Pin location is approximate.</p>` : "";
  var blurb = p.blurb ? `<p style="margin:7px 0 0;font-size:12px;color:#444;line-height:1.5;">${escapeHtml(p.blurb)}</p>` : "";
  var inTrip = Array.isArray(tripStopIds) && tripStopIds.includes(p.id);
  var btnLabel = inTrip ? "Remove from trip" : "Add to trip";
  var btnBg = inTrip ? "#ffffff" : TRIP_PIN_COLOR;
  var btnColor = inTrip ? TRIP_PIN_COLOR : "#ffffff";
  var btn = `<button type="button" data-trip-toggle data-stop-id="${escapeHtml(p.id)}" style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font:600 12px system-ui,sans-serif;background:${btnBg};color:${btnColor};border:1px solid ${TRIP_PIN_COLOR};border-radius:3px;cursor:pointer;">${escapeHtml(btnLabel)}</button>`;
  var directions = "";
  if (coords) {
    var [_lng, _lat] = coords;
    var dirUrl = `https://www.google.com/maps/dir/?api=1` + `&destination=${encodeURIComponent(`${_lat},${_lng}`)}` + `&travelmode=driving`;
    directions = `<p style="margin:8px 0 0;"><a href="${escapeHtml(dirUrl)}" data-directions-link data-stop-id="${escapeHtml(p.id)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Directions →</a></p>`;
  }
  var gmaps = p.gmapsUrl ? `<p style="margin:8px 0 0;"><a href="${escapeHtml(p.gmapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Open in Google Maps →</a></p>` : "";
  var stopShare = `<p style="margin:8px 0 0;"><a href="/map?stop=${escapeHtml(p.id)}" data-stop-share data-stop-id="${escapeHtml(p.id)}" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Copy link to this stop</a></p>`;
  var journal = "";
  if (Array.isArray(p.articles) && p.articles.length > 0) {
    var links = p.articles.map(slug => {
      var a = (window.ARTICLES || []).find(x => x.slug === slug);
      if (!a) return "";
      return `<p style="margin:4px 0 0;font-size:12px;line-height:1.4;"><a href="/articles/${escapeHtml(slug)}" data-article-link data-article-slug="${escapeHtml(slug)}" style="color:#1e6fb8;text-decoration:underline;font-weight:500;">${escapeHtml(a.title)}</a></p>`;
    }).filter(Boolean);
    if (links.length > 0) {
      journal = `<div style="margin:10px 0 0;padding-top:8px;border-top:1px solid #e3ddcf;">` + `<span style="text-transform:uppercase;font-size:10px;letter-spacing:0.06em;color:#8a8675;font-weight:600;">From the journal</span>` + links.join("") + `</div>`;
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
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function MapAccessGate({
  onSubscribed,
  onClose
}) {
  useEffect(() => {
    var onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return React.createElement("div", {
    className: "map-page__gate",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Subscribe to save this trip"
  }, React.createElement("div", {
    className: "map-page__gate-backdrop",
    onClick: onClose
  }), React.createElement("div", {
    className: "nlmodal__card map-page__gate-card"
  }, React.createElement("button", {
    type: "button",
    className: "nlmodal__close",
    "aria-label": "Close",
    onClick: onClose
  }, "✕"), React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The Map · Trip Builder"), React.createElement("h3", null, "Save this trip."), React.createElement("p", null, "Browsing the map is free. Building and saving a trip: tapping pins to assemble a route, loading a suggested itinerary, is open to subscribers. Drop your email and it opens right here, and stays open on this device."), React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("map_trip_gate", "map-gate");
      setTimeout(onSubscribed, 0);
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    placeholder: "you@email.com",
    required: true
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "map-gate"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, "Unlock the trip builder →")), React.createElement("p", {
    className: "map-gate__fine"
  }, "No spam. One short letter on Sundays, when there is something to say.")));
}
function MapPage(props) {
  return React.createElement(MapView, props);
}
window.MapPage = MapPage;
