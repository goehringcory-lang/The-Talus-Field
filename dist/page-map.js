var {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} = React;
var POINTS_URL = "/points.geojson?v=23";
var STORAGE_KEY = "tfg.trip";
var STORAGE_VERSION = 1;
var TRIP_CAP = 30;
var TRIP_PIN_COLOR = "#7a8f5a";
var ROUTE_STOP_LIMIT = 11;
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
var QUICK_PICKS = [{
  id: "1day",
  label: "1 day",
  regionIds: ["valley"]
}, {
  id: "2day",
  label: "2 days",
  regionIds: ["valley", "glacier-point"]
}, {
  id: "3day",
  label: "3 days",
  regionIds: ["valley", "glacier-point", "tuolumne-area"]
}];
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
function readUrlState() {
  var params = new URLSearchParams(window.location.search);
  return {
    stop: params.get("stop") || null,
    trip: params.get("trip") || null
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
  stop
}) {
  var params = new URLSearchParams();
  if (stop) params.set("stop", stop);
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
function waitForGoogleMaps(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    injectGoogleMaps();
    var start = Date.now();
    var interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        resolve(window.google.maps);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error("Google Maps API didn't load. Check the API key in index.html and that the Maps JavaScript API is enabled in the Cloud console."));
      }
    }, 100);
  });
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
  var pendingActionRef = useRef(null);
  var announcerRef = useRef(null);
  var toastTimerRef = useRef(null);
  var [features, setFeatures] = useState(null);
  var [error, setError] = useState(null);
  var [mapReady, setMapReady] = useState(false);
  var [toast, setToast] = useState(null);
  var [gateOpen, setGateOpen] = useState(false);
  var initial = useMemo(() => readUrlState(), []);
  var [selectedStopId, setSelectedStopId] = useState(initial.stop);
  var [tripStopIds, setTripStopIds] = useState([]);
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
      stop: selectedStopId
    });
  }, [selectedStopId]);
  useEffect(() => {
    var onPop = () => {
      var next = readUrlState();
      setSelectedStopId(next.stop);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  var announce = useCallback(msg => {
    if (announcerRef.current) announcerRef.current.textContent = msg;
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  }, []);
  var featureNameById = useCallback(id => {
    if (!features) return id;
    var f = features.find(x => x.properties.id === id);
    return f ? f.properties.name : id;
  }, [features]);
  var requireUnlock = useCallback(action => {
    if (isMapUnlocked() || window.isSubscribed && window.isSubscribed()) {
      setMapUnlocked();
      action();
      return;
    }
    pendingActionRef.current = action;
    setGateOpen(true);
    if (window.trackNewsletterImpression) window.trackNewsletterImpression("map_gate", "map-gate");
  }, []);
  var handleGateSubscribed = useCallback(() => {
    setMapUnlocked();
    setGateOpen(false);
    var action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) action();
  }, []);
  var handleGateClose = useCallback(() => {
    pendingActionRef.current = null;
    setGateOpen(false);
  }, []);
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
    var adding = !tripStopIdsRef.current.includes(id);
    if (!adding) {
      performToggleTripStop(id);
      return;
    }
    requireUnlock(() => {
      if (window.track && tripStopIdsRef.current.length < TRIP_CAP) {
        window.track("trip_add", {
          stop_id: id,
          trip_size: tripStopIdsRef.current.length + 1,
          source: source || "sidebar"
        });
      }
      performToggleTripStop(id);
    });
  }, [performToggleTripStop, requireUnlock]);
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
    setTripStopIds(prev => {
      if (prev.length === 0) return prev;
      announce("Cleared trip. 0 stops.");
      return [];
    });
  }, [announce]);
  var performAddAllFromRegion = useCallback(regionId => {
    setTripStopIds(prev => {
      if (!features) return prev;
      var region = REGIONS.find(r => r.id === regionId);
      if (!region) return prev;
      var keys = new Set(region.keys);
      var regionStopIds = features.filter(f => keys.has(f.properties.region)).map(f => f.properties.id);
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
  }, [announce, features]);
  var addAllFromRegion = useCallback(regionId => {
    requireUnlock(() => {
      if (window.track) window.track("trip_add_all", {
        region: regionId
      });
      performAddAllFromRegion(regionId);
    });
  }, [requireUnlock, performAddAllFromRegion]);
  var performApplyQuickPick = useCallback(quickPickId => {
    if (!features) return;
    var qp = QUICK_PICKS.find(q => q.id === quickPickId);
    if (!qp) return;
    var keys = new Set();
    var _loop = function (rid) {
      var r = REGIONS.find(x => x.id === rid);
      if (r) for (var k of r.keys) keys.add(k);
    };
    for (var rid of qp.regionIds) {
      _loop(rid);
    }
    var stops = features.filter(f => keys.has(f.properties.region)).map(f => f.properties.id).slice(0, TRIP_CAP);
    setTripStopIds(stops);
    announce(`Loaded ${qp.label} suggested trip. ${stops.length} ${stops.length === 1 ? "stop" : "stops"}.`);
  }, [announce, features]);
  var applyQuickPick = useCallback(quickPickId => {
    requireUnlock(() => {
      if (window.track) window.track("trip_quick_pick", {
        pick: quickPickId
      });
      performApplyQuickPick(quickPickId);
    });
  }, [requireUnlock, performApplyQuickPick]);
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
    var _loop2 = function (feature) {
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
        map,
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
      });
      markersRef.current[p.id] = marker;
    };
    for (var feature of features) {
      _loop2(feature);
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
    }
  }, [selectedStopId, mapReady, features]);
  if (features === null) {
    return React.createElement("div", {
      className: "map-page map-page--loading"
    }, React.createElement("p", null, "Loading map…"));
  }
  return React.createElement("div", {
    className: "map-page"
  }, React.createElement(TripPlannerSidebar, {
    features: features,
    tripStopIds: tripStopIds,
    selectedStopId: selectedStopId,
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
  })), gateOpen && React.createElement(MapGateModal, {
    onSubscribed: handleGateSubscribed,
    onClose: handleGateClose
  }));
}
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
  onShareTrip,
  onOpenRoute,
  announcerRef,
  toast
}) {
  var regionGroups = useMemo(() => {
    return REGIONS.map(r => {
      var keys = new Set(r.keys);
      var stops = features.filter(f => keys.has(f.properties.region));
      return {
        ...r,
        stops
      };
    });
  }, [features]);
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
  }, "Open route in Google Maps")), toast && React.createElement("div", {
    className: "map-sidebar__toast",
    role: "status",
    "aria-live": "off"
  }, toast), React.createElement("div", {
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
  }, qp.label)))), React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "Browse by area"), React.createElement("div", {
    className: "map-sidebar__regions"
  }, regionGroups.map(r => {
    var isExpanded = expandedRegions.has(r.id);
    var stopCount = r.stops.length;
    var inTripCount = r.stops.filter(f => tripSet.has(f.properties.id)).length;
    var allInTrip = stopCount > 0 && inTripCount === stopCount;
    var addAllDisabled = stopCount === 0 || allInTrip || tripFull;
    var addAllTitle = stopCount === 0 ? "No stops in this region yet" : allInTrip ? "All stops in this region are already in your trip" : tripFull ? `Trip is full at ${TRIP_CAP} stops` : `Add all ${stopCount} stops from ${r.label}`;
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
    }, "(no stops yet)") : React.createElement("ul", {
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
  }))), React.createElement(CategoryLegend, {
    features: features
  }));
}
function CategoryLegend({
  features
}) {
  var present = useMemo(() => {
    var seen = new Set();
    for (var f of features) {
      if (f.properties && f.properties.category) seen.add(f.properties.category);
    }
    return Array.from(seen).sort();
  }, [features]);
  if (present.length === 0) return null;
  return React.createElement("div", {
    className: "map-sidebar__section"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "Legend"), React.createElement("ul", {
    className: "map-sidebar__legend"
  }, present.map(cat => {
    var {
      color,
      label
    } = getCategoryStyle(cat);
    return React.createElement("li", {
      key: cat,
      className: "map-sidebar__legend-item"
    }, React.createElement("span", {
      className: "map-sidebar__legend-dot",
      style: {
        backgroundColor: color
      },
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "map-sidebar__legend-label"
    }, label));
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
  var blurb = p.blurb ? `<p style="margin:7px 0 0;font-size:12px;color:#444;line-height:1.5;">${escapeHtml(p.blurb)}</p>` : "";
  var inTrip = Array.isArray(tripStopIds) && tripStopIds.includes(p.id);
  var btnLabel = inTrip ? "Remove from trip" : "Add to trip";
  var btnBg = inTrip ? "#ffffff" : TRIP_PIN_COLOR;
  var btnColor = inTrip ? TRIP_PIN_COLOR : "#ffffff";
  var btn = `<button type="button" data-trip-toggle data-stop-id="${escapeHtml(p.id)}" style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;font:600 12px system-ui,sans-serif;background:${btnBg};color:${btnColor};border:1px solid ${TRIP_PIN_COLOR};border-radius:3px;cursor:pointer;">${escapeHtml(btnLabel)}</button>`;
  var gmaps = p.gmapsUrl ? `<p style="margin:8px 0 0;"><a href="${escapeHtml(p.gmapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#1e6fb8;text-decoration:underline;font-weight:500;font-size:12px;">Open in Google Maps →</a></p>` : "";
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
      ${blurb}
      ${btn}
      ${gmaps}
      ${journal}
    </div>
  `;
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function MapGateModal({
  onSubscribed,
  onClose
}) {
  useEffect(() => {
    var onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    var prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return React.createElement("div", {
    className: "nlmodal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Unlock the trip builder"
  }, React.createElement("div", {
    className: "nlmodal__backdrop",
    onClick: onClose
  }), React.createElement("div", {
    className: "nlmodal__card"
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
  }, "The Map · Free"), React.createElement("h3", null, "Save this trip."), React.createElement("p", null, "Drop your email and the trip builder opens: add stops, reorder them, share the link. Your trip saves on this device. Free."), React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("map_gate", "map-gate");
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
  }, "Open the trip builder →")), React.createElement("p", {
    className: "map-gate__fine"
  }, "No spam. One short letter on Sundays, when there is something to say.")));
}
function MapPage(props) {
  return React.createElement(MapView, props);
}
window.MapPage = MapPage;
