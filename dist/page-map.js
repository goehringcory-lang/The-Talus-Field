var {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} = React;
var POINTS_URL = window.POINTS_URL;
var MAP_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var GUIDE_APP_BASE = typeof window !== "undefined" && window.GUIDE_APP_BASE || "https://guide.thetalusfieldjournal.com";
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
var PARK_CENTER = {
  lat: 37.85,
  lng: -119.55
};
var LOCATE_PAN_MAX_KM = 100;
function haversineKm(a, b) {
  var toRad = d => d * Math.PI / 180;
  var dLat = toRad(b.lat - a.lat);
  var dLng = toRad(b.lng - a.lng);
  var s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
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
var SETUP_KEY = "tfg.map.setup";
var TRIP_SELECTOR_KEY = "tfg.trip.selector";
function getTripMonths() {
  return Array.isArray(window.TRIP_MONTHS) ? window.TRIP_MONTHS : [];
}
function getTripMonth(key) {
  return getTripMonths().find(m => m.key === key) || null;
}
function loadSetup() {
  var saved = window.safeStorage.getJSON(SETUP_KEY) || {};
  var setup = {
    gate: typeof saved.gate === "string" ? saved.gate : null,
    month: typeof saved.month === "string" ? saved.month : null
  };
  if (!setup.month) {
    var answers = window.safeStorage.getJSON(TRIP_SELECTOR_KEY);
    if (answers && typeof answers.when === "string") setup.month = answers.when;
  }
  if (setup.month && !getTripMonth(setup.month)) setup.month = null;
  if (setup.gate && !ORIENT_GATES.some(g => g.id === setup.gate)) setup.gate = null;
  return setup;
}
var ORIENT_GATES = [{
  id: "arch",
  label: "Arch Rock",
  hwy: "Hwy 140",
  pos: {
    lat: 37.6878,
    lng: -119.7297
  },
  hint: "From Mariposa and El Portal, open year-round. El Portal to the Valley is 25 to 35 minutes."
}, {
  id: "south",
  label: "South",
  hwy: "Hwy 41",
  pos: {
    lat: 37.5049,
    lng: -119.6318
  },
  hint: "From Oakhurst. The Mariposa Grove welcome plaza is immediately inside the gate; Wawona is six miles on, the Valley about an hour past that."
}, {
  id: "bof",
  label: "Big Oak Flat",
  hwy: "Hwy 120 W",
  pos: {
    lat: 37.7996,
    lng: -119.8739
  },
  hint: "From Groveland and the Bay Area. Crane Flat, just inside, has the only gas on the west side and is where Tioga Road begins."
}, {
  id: "hh",
  label: "Hetch Hetchy",
  hwy: "Evergreen Rd",
  pos: {
    lat: 37.892,
    lng: -119.841
  },
  hint: "Its own entrance on its own road, open daylight hours only. It connects to nothing else in the park: to reach the Valley you drive back out."
}, {
  id: "tioga",
  label: "Tioga Pass",
  hwy: "Hwy 120 E",
  road: "tioga",
  pos: {
    lat: 37.9108,
    lng: -119.258
  },
  hint: "From Lee Vining and the Eastern Sierra, about 30 minutes to Tuolumne Meadows. Only while Tioga Pass is open, and there is no gas between Lee Vining and Crane Flat."
}];
var ORIENT_SERVICES = [{
  id: "gas-crane",
  kind: "gas",
  label: "Gas at Crane Flat",
  pos: {
    lat: 37.7536,
    lng: -119.8006
  },
  note: "The only fuel inside the park on the west side, pay-at-pump."
}, {
  id: "gas-wawona",
  kind: "gas",
  label: "Gas at Wawona",
  pos: {
    lat: 37.5364,
    lng: -119.6537
  },
  note: "The other in-park pumps, on the Wawona Road."
}, {
  id: "gas-elportal",
  kind: "gas",
  label: "Gas in El Portal",
  pos: {
    lat: 37.6746,
    lng: -119.7835
  },
  note: "Outside the Arch Rock gate. Fill up in the gateway town."
}, {
  id: "vc-valley",
  kind: "vc",
  label: "Yosemite Valley Visitor Center",
  pos: {
    lat: 37.7486,
    lng: -119.5871
  }
}, {
  id: "vc-tuolumne",
  kind: "vc",
  label: "Tuolumne Meadows Visitor Center",
  pos: {
    lat: 37.8736,
    lng: -119.3724
  },
  note: "Seasonal, with Tioga Road."
}];
var ORIENT_AREAS = [{
  id: "valley",
  label: "Yosemite Valley",
  line: "Where most first days start. No gas.",
  pos: {
    lat: 37.785,
    lng: -119.6
  }
}, {
  id: "glacier",
  label: "Glacier Point",
  line: "About an hour from the Valley",
  road: "glacier",
  pos: {
    lat: 37.7,
    lng: -119.5
  }
}, {
  id: "wawona",
  label: "Wawona",
  line: "About an hour south of the Valley",
  pos: {
    lat: 37.555,
    lng: -119.56
  }
}, {
  id: "tuolumne",
  label: "Tuolumne Meadows",
  line: "Roughly 90 minutes, Tioga Road only. No gas.",
  road: "tioga",
  pos: {
    lat: 37.93,
    lng: -119.4
  }
}, {
  id: "hetch",
  label: "Hetch Hetchy",
  line: "Its own road, daylight hours only",
  pos: {
    lat: 37.955,
    lng: -119.79
  }
}];
var AREA_LABEL_MAX_ZOOM = 11;
var LABEL_MIN_ZOOM = 10;
var REGION_ROAD = {
  "glacier-point": "glacier",
  tuolumne: "tioga"
};
var ROAD_NAMES = {
  tioga: "Tioga Road",
  glacier: "Glacier Point Road"
};
var ROAD_STATUS_TEXT = {
  open: "Open",
  closed: "Closed to cars",
  unsettled: "Opening date varies"
};
var ROAD_LINES = {
  tioga: [[[37.79233, -119.72272], [37.78981, -119.72422], [37.78889, -119.72623], [37.78871, -119.72799], [37.78944, -119.73152], [37.78874, -119.73555], [37.78685, -119.73843], [37.78482, -119.7404], [37.78148, -119.74745], [37.78034, -119.7484], [37.77764, -119.7493], [37.77539, -119.75224], [37.77476, -119.7538], [37.77462, -119.75665], [37.77308, -119.75858], [37.77178, -119.76165], [37.76987, -119.76328], [37.76959, -119.76441], [37.76989, -119.76894], [37.76907, -119.77097], [37.76587, -119.77413], [37.76237, -119.7749], [37.76115, -119.77428], [37.76035, -119.77187], [37.75846, -119.76986], [37.75756, -119.76995], [37.75541, -119.77216], [37.75536, -119.77352], [37.75656, -119.77694], [37.75728, -119.77768], [37.75909, -119.77848], [37.75943, -119.77919], [37.75705, -119.78535], [37.75721, -119.78643], [37.75853, -119.78821], [37.75864, -119.78912], [37.75715, -119.79064], [37.75687, -119.79159], [37.75781, -119.79352], [37.75942, -119.79473], [37.75969, -119.79775], [37.76116, -119.80025], [37.76069, -119.80235], [37.75901, -119.80481], [37.75819, -119.80486], [37.75546, -119.80231], [37.75326, -119.79791], [37.75248, -119.79756]], [[37.87223, -119.36514], [37.87324, -119.35943], [37.87695, -119.35355], [37.87783, -119.34366], [37.88041, -119.33661], [37.8802, -119.32803], [37.88086, -119.32603], [37.88213, -119.32401], [37.88112, -119.32091], [37.88024, -119.31548], [37.88083, -119.30791], [37.87883, -119.30033], [37.87885, -119.29408], [37.87756, -119.28764], [37.87779, -119.28444], [37.87924, -119.27887], [37.87939, -119.27645], [37.88597, -119.27046], [37.89301, -119.26021], [37.8972, -119.25967], [37.90385, -119.26003], [37.9109, -119.25788]], [[37.852, -119.57509], [37.85097, -119.57272], [37.84983, -119.57194], [37.84841, -119.57173], [37.84324, -119.5737], [37.83724, -119.57781], [37.83364, -119.57792], [37.83216, -119.57838], [37.82811, -119.58135], [37.82667, -119.58137], [37.82446, -119.58001], [37.82276, -119.58096], [37.82194, -119.58096], [37.82053, -119.5788], [37.81915, -119.57805], [37.81811, -119.57825], [37.8162, -119.58034], [37.81546, -119.58056], [37.81465, -119.58026], [37.81402, -119.57907], [37.81467, -119.57644], [37.81432, -119.57497], [37.81086, -119.5725], [37.80836, -119.56894], [37.8074, -119.566], [37.80588, -119.55612], [37.80642, -119.55138], [37.80726, -119.54856], [37.80679, -119.5446], [37.80842, -119.5369], [37.81164, -119.53194], [37.81254, -119.52783], [37.81592, -119.51963], [37.81771, -119.51712], [37.81796, -119.51612], [37.81721, -119.51397], [37.81725, -119.5095], [37.8167, -119.50808], [37.81576, -119.50751], [37.81479, -119.50753], [37.81229, -119.50948], [37.8116, -119.50922], [37.81115, -119.50843], [37.81122, -119.50739], [37.81331, -119.50247], [37.81686, -119.49855], [37.81717, -119.49752], [37.81659, -119.49637], [37.81495, -119.49627], [37.81425, -119.49585], [37.81272, -119.49314], [37.81233, -119.49155], [37.81258, -119.48762], [37.81115, -119.48597], [37.81093, -119.48497], [37.81151, -119.48384], [37.81597, -119.48139], [37.81875, -119.47876], [37.82009, -119.47815], [37.82262, -119.47779], [37.82375, -119.47703], [37.82447, -119.47576], [37.82644, -119.46945], [37.82889, -119.46808], [37.83051, -119.46763], [37.83285, -119.46606], [37.83431, -119.46323], [37.83362, -119.46075], [37.83383, -119.45895], [37.83611, -119.45478], [37.8403, -119.44984], [37.8432, -119.44754], [37.84737, -119.44536], [37.85215, -119.44094], [37.85724, -119.43801], [37.86331, -119.43296], [37.86587, -119.43161], [37.87191, -119.42736], [37.87339, -119.42554], [37.87431, -119.42002], [37.87622, -119.41786], [37.87672, -119.41649], [37.87601, -119.41189], [37.87658, -119.40674], [37.87737, -119.40541], [37.87958, -119.40394], [37.88112, -119.40194], [37.88149, -119.4007], [37.88039, -119.39691], [37.87684, -119.39458], [37.87363, -119.38645], [37.87333, -119.38415], [37.87373, -119.37763], [37.87203, -119.37065], [37.87222, -119.36517]], [[37.79264, -119.72254], [37.79693, -119.72042], [37.79908, -119.71871], [37.80291, -119.71765], [37.81112, -119.71323], [37.81302, -119.71342], [37.81407, -119.71268], [37.81595, -119.71248], [37.81708, -119.71286], [37.81859, -119.71424], [37.81961, -119.71409], [37.82003, -119.71333], [37.82103, -119.70622], [37.82159, -119.70491], [37.82362, -119.70278], [37.82541, -119.70189], [37.83028, -119.70224], [37.83122, -119.70172], [37.83224, -119.69866], [37.83613, -119.6926], [37.83827, -119.6903], [37.83952, -119.68687], [37.84408, -119.68092], [37.84973, -119.6719], [37.85008, -119.67055], [37.85013, -119.66553], [37.85159, -119.66137], [37.85139, -119.66017], [37.84984, -119.65715], [37.85013, -119.65372], [37.85097, -119.65209], [37.85284, -119.65086], [37.85701, -119.64622], [37.85757, -119.64497], [37.85764, -119.64346], [37.85653, -119.63994], [37.85249, -119.63322], [37.84983, -119.62598], [37.84902, -119.62022], [37.85055, -119.61568], [37.84872, -119.61101], [37.84988, -119.60786], [37.85021, -119.60536], [37.84833, -119.60161], [37.84873, -119.59717], [37.84825, -119.5964], [37.84627, -119.59498], [37.84364, -119.59508], [37.84146, -119.59384], [37.83988, -119.59364], [37.83904, -119.59221], [37.83994, -119.58954], [37.84156, -119.58889], [37.84445, -119.58864], [37.84641, -119.58712], [37.8499, -119.58091], [37.85202, -119.57862], [37.85232, -119.57746], [37.85205, -119.57539]], [[37.9108, -119.25789], [37.91045, -119.25793]]],
  glacier: [[[37.6674, -119.66292], [37.6692, -119.65927], [37.67183, -119.65678], [37.67282, -119.65528], [37.67442, -119.64943], [37.67402, -119.64732], [37.67193, -119.64362], [37.67158, -119.6414], [37.67193, -119.6403], [37.67361, -119.63911], [37.67381, -119.63731], [37.67135, -119.63435], [37.67026, -119.62734], [37.66634, -119.61506], [37.66674, -119.61299], [37.66946, -119.61055], [37.66996, -119.60945], [37.66969, -119.6085], [37.66774, -119.60598], [37.66722, -119.60385], [37.66755, -119.59872], [37.66828, -119.59572], [37.6678, -119.59282], [37.66806, -119.58912], [37.66823, -119.58732], [37.66873, -119.5863], [37.66947, -119.58543], [37.67091, -119.58502], [37.67312, -119.58576], [37.67436, -119.5875], [37.67953, -119.58929], [37.68355, -119.58859], [37.686, -119.58988], [37.68813, -119.5904], [37.69008, -119.59008], [37.69113, -119.58709], [37.69391, -119.58588], [37.70113, -119.58668], [37.70697, -119.58868], [37.7091, -119.58873], [37.71169, -119.58717], [37.71498, -119.58156], [37.71671, -119.57958], [37.71862, -119.5789], [37.71941, -119.58079], [37.7208, -119.57951], [37.72053, -119.57779], [37.71904, -119.57655], [37.71922, -119.57619], [37.72038, -119.57645], [37.72134, -119.57728], [37.71979, -119.5743], [37.71997, -119.57335], [37.7212, -119.57432], [37.72236, -119.57465], [37.72366, -119.57419], [37.72506, -119.57443], [37.72612, -119.57352], [37.72576, -119.57464], [37.72614, -119.57543], [37.72635, -119.57461], [37.72719, -119.57443]]]
};
var ROAD_LINE_COLORS = {
  closed: "#7a2a10",
  unsettled: "#b07d10"
};
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
  var userMarkerRef = useRef(null);
  var [features, setFeatures] = useState(null);
  var [error, setError] = useState(null);
  var [mapReady, setMapReady] = useState(false);
  var [toast, setToast] = useState(null);
  var [unlocked, setUnlocked] = useState(() => {
    if (isMapUnlocked() || window.isSubscribed && window.isSubscribed()) return true;
    try {
      return new URLSearchParams(window.location.search).has("trip");
    } catch (_e) {
      return false;
    }
  });
  var [locating, setLocating] = useState(false);
  var initial = useMemo(() => readUrlState(), []);
  var [selectedStopId, setSelectedStopId] = useState(initial.stop);
  var [tripStopIds, setTripStopIds] = useState([]);
  var [activeCats, setActiveCats] = useState(() => parseCatParam(initial.cat));
  var [hasClusterer, setHasClusterer] = useState(false);
  var [setup, setSetup] = useState(loadSetup);
  var setupRef = useRef(setup);
  var [layers, setLayers] = useState({
    gates: true,
    gas: true,
    vc: true,
    areas: true
  });
  var orientMarkersRef = useRef({});
  var [zoom, setZoom] = useState(10);
  var [expandedRegions, setExpandedRegions] = useState(() => new Set(REGIONS.map(r => r.id)));
  var [sheetState, setSheetState] = useState("peek");
  useEffect(() => {
    goRef.current = go;
  });
  useEffect(() => {
    tripStopIdsRef.current = tripStopIds;
  });
  useEffect(() => {
    setupRef.current = setup;
    window.safeStorage.setJSON(SETUP_KEY, setup);
  }, [setup]);
  var monthRow = setup.month ? getTripMonth(setup.month) : null;
  var tiogaStatus = monthRow ? monthRow.tioga : null;
  var glacierStatus = monthRow ? monthRow.glacier : null;
  var chooseGate = useCallback(id => {
    setSetup(prev => ({
      ...prev,
      gate: prev.gate === id ? null : id
    }));
    if (window.track) window.track("map_setup_gate", {
      gate: id
    });
  }, []);
  var chooseMonth = useCallback(key => {
    setSetup(prev => ({
      ...prev,
      month: prev.month === key ? null : key
    }));
    if (window.track) window.track("map_setup_month", {
      month: key
    });
  }, []);
  var toggleLayer = useCallback(key => {
    setLayers(prev => {
      var next = {
        ...prev,
        [key]: !prev[key]
      };
      if (window.track) window.track("map_layer_toggle", {
        layer: key,
        active: next[key]
      });
      return next;
    });
  }, []);
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
  var featureNameById = useCallback(id => {
    if (!features) return id;
    var f = features.find(x => x.properties.id === id);
    return f ? f.properties.name : id;
  }, [features]);
  var handleGateSubscribed = useCallback(() => {
    setMapUnlocked();
    setUnlocked(true);
  }, []);
  useEffect(() => {
    if (!unlocked && window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_gate", "map-gate");
    }
  }, [unlocked]);
  useEffect(() => {
    if (unlocked) return;
    var page = document.querySelector(".map-page--locked");
    if (!page) return;
    var covered = Array.from(page.children).filter(el => !el.classList.contains("map-page__gate"));
    covered.forEach(el => {
      el.inert = true;
    });
    return () => covered.forEach(el => {
      el.inert = false;
    });
  }, [unlocked, features]);
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
    if (adding && window.track && tripStopIdsRef.current.length < TRIP_CAP) {
      window.track("trip_add", {
        stop_id: id,
        trip_size: tripStopIdsRef.current.length + 1,
        source: source || "sidebar"
      });
    }
    performToggleTripStop(id);
  }, [performToggleTripStop]);
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
    if (window.track) window.track("trip_add_all", {
      region: regionId
    });
    performAddAllFromRegion(regionId);
  }, [performAddAllFromRegion]);
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
    if (window.track) window.track("trip_quick_pick", {
      pick: quickPickId
    });
    performApplyQuickPick(quickPickId);
  }, [performApplyQuickPick]);
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
  var openInGuide = useCallback(() => {
    var ids = tripStopIdsRef.current;
    if (ids.length === 0) return;
    var url = `${GUIDE_APP_BASE}/trip?import=${ids.join(",")}`;
    if (window.track) window.track("trip_open_in_guide", {
      trip_size: ids.length
    });
    window.open(url, "_blank", "noopener");
  }, []);
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
  var resetView = useCallback(() => {
    var map = mapRef.current;
    if (!map || !features) return;
    var maps = window.google && window.google.maps;
    if (!maps) return;
    var tripSet = new Set(tripStopIdsRef.current);
    var bounds = new maps.LatLngBounds();
    var visible = 0;
    for (var f of features) {
      var p = f.properties;
      if (!activeCats.has(p.category) && !tripSet.has(p.id)) continue;
      var [lng, lat] = f.geometry.coordinates;
      bounds.extend({
        lat,
        lng
      });
      visible++;
    }
    if (visible === 0) return;
    map.fitBounds(bounds, 40);
    maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > 12) map.setZoom(12);
    });
    if (window.track) window.track("map_reset_view", {
      visible
    });
  }, [features, activeCats]);
  var locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      announce("Location is not available in this browser.");
      return;
    }
    var map = mapRef.current;
    var markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(pos => {
      setLocating(false);
      var position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      if (!userMarkerRef.current) {
        var dot = document.createElement("div");
        dot.className = "map-user-dot";
        userMarkerRef.current = new markerLib.AdvancedMarkerElement({
          position,
          content: dot,
          title: "Your location",
          zIndex: 2000
        });
      }
      userMarkerRef.current.position = position;
      userMarkerRef.current.map = map;
      var km = haversineKm(position, PARK_CENTER);
      if (km > LOCATE_PAN_MAX_KM) {
        announce("You are well outside the park right now. The map stayed on Yosemite.");
      } else {
        map.panTo(position);
        if (map.getZoom() < 13) map.setZoom(13);
        announce("Centered on your location.");
      }
      if (window.track) window.track("map_locate", {
        in_park: km <= LOCATE_PAN_MAX_KM
      });
    }, () => {
      setLocating(false);
      announce("Could not get your location. Check the browser's location permission.");
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  }, [announce]);
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
        infoRef.current.setContent(buildInfoHtml(p, feature.geometry.coordinates, tripStopIdsRef.current, roadNoteFor(p, setupRef.current.month)));
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
    info.setContent(buildInfoHtml(of.properties, of.geometry.coordinates, tripStopIds, roadNoteFor(of.properties, setup.month)));
  }, [tripStopIds, mapReady, setup.month]);
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
    if (!mapReady) return;
    var map = mapRef.current;
    var markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    var maps = window.google.maps;
    var made = {};
    var place = (id, kind, pos, el, title, zIndex, info) => {
      var marker = new markerLib.AdvancedMarkerElement({
        position: pos,
        content: el,
        title,
        zIndex
      });
      if (info) {
        marker.addEventListener("click", () => {
          openFeatureRef.current = null;
          infoRef.current.setContent(info);
          infoRef.current.open({
            anchor: marker,
            map
          });
          if (window.track) window.track("map_orient_click", {
            id
          });
        });
      }
      made[id] = {
        kind,
        marker
      };
    };
    ORIENT_GATES.forEach(g => {
      var el = document.createElement("div");
      el.className = "map-orient map-orient--gate";
      el.innerHTML = `<span class="map-orient__mark" aria-hidden="true"></span><span class="map-orient__label">${escapeHtml(g.label)}</span>`;
      place(`gate-${g.id}`, "gates", g.pos, el, `${g.label} entrance, ${g.hwy}`, 900, orientInfoHtml(`${g.label} entrance`, g.hwy, g.hint));
    });
    ORIENT_SERVICES.forEach(sv => {
      var el = document.createElement("div");
      el.className = `map-orient map-orient--${sv.kind}`;
      el.innerHTML = sv.kind === "gas" ? `<span class="map-orient__mark" aria-hidden="true">${GAS_ICON_SVG}</span><span class="map-orient__label">${escapeHtml(sv.label)}</span>` : `<span class="map-orient__mark" aria-hidden="true">i</span>`;
      place(sv.id, sv.kind, sv.pos, el, sv.label, 850, orientInfoHtml(sv.label, "", sv.note || ""));
    });
    ORIENT_AREAS.forEach(a => {
      var el = document.createElement("div");
      el.className = "map-orient map-orient--area";
      el.innerHTML = `<span class="map-orient__area-name">${escapeHtml(a.label)}</span><span class="map-orient__area-line">${escapeHtml(a.line)}</span>`;
      place(`area-${a.id}`, "areas", a.pos, el, a.label, 800, null);
    });
    orientMarkersRef.current = made;
    var onZoom = () => {
      var z = map.getZoom();
      setZoom(z);
      if (containerRef.current) containerRef.current.classList.toggle("map-orient-far", z < LABEL_MIN_ZOOM);
    };
    var zoomListener = map.addListener("zoom_changed", onZoom);
    onZoom();
    return () => {
      maps.event.removeListener(zoomListener);
      Object.values(made).forEach(m => {
        m.marker.map = null;
      });
      orientMarkersRef.current = {};
    };
  }, [mapReady]);
  useEffect(() => {
    if (!mapReady) return;
    var map = mapRef.current;
    Object.values(orientMarkersRef.current).forEach(m => {
      var on = m.kind === "areas" ? layers.areas && zoom >= LABEL_MIN_ZOOM && zoom <= AREA_LABEL_MAX_ZOOM : layers[m.kind];
      m.marker.map = on ? map : null;
    });
  }, [mapReady, layers, zoom]);
  useEffect(() => {
    if (!mapReady) return;
    var status = {
      tioga: tiogaStatus,
      glacier: glacierStatus
    };
    ORIENT_GATES.forEach(g => {
      var m = orientMarkersRef.current[`gate-${g.id}`];
      if (!m) return;
      m.marker.content.classList.toggle("is-selected", setup.gate === g.id);
      m.marker.content.classList.toggle("is-closed", !!g.road && status[g.road] === "closed");
    });
    ORIENT_AREAS.forEach(a => {
      var m = orientMarkersRef.current[`area-${a.id}`];
      if (!m) return;
      m.marker.content.classList.toggle("is-closed", !!a.road && status[a.road] === "closed");
    });
  }, [mapReady, setup.gate, tiogaStatus, glacierStatus]);
  useEffect(() => {
    if (!mapReady) return;
    var map = mapRef.current;
    var maps = window.google && window.google.maps;
    if (!map || !maps) return;
    var lines = [];
    var status = {
      tioga: tiogaStatus,
      glacier: glacierStatus
    };
    Object.keys(ROAD_LINES).forEach(road => {
      var color = ROAD_LINE_COLORS[status[road]];
      if (!color) return;
      ROAD_LINES[road].forEach(line => {
        var path = line.map(([lat, lng]) => ({
          lat,
          lng
        }));
        lines.push(new maps.Polyline({
          map,
          path,
          clickable: false,
          zIndex: 1,
          strokeColor: "#ffffff",
          strokeOpacity: 0.9,
          strokeWeight: 7
        }));
        lines.push(new maps.Polyline({
          map,
          path,
          clickable: false,
          zIndex: 2,
          strokeOpacity: 0,
          icons: [{
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              strokeColor: color,
              strokeWeight: 4,
              scale: 2.5
            },
            offset: "0",
            repeat: "11px"
          }]
        }));
      });
    });
    return () => lines.forEach(l => l.setMap(null));
  }, [mapReady, tiogaStatus, glacierStatus]);
  var roadIssues = useMemo(() => {
    if (!features || !monthRow) return [];
    var byId = new Map(features.map(f => [f.properties.id, f]));
    var issues = [];
    ["glacier", "tioga"].forEach(road => {
      var status = monthRow[road];
      if (status !== "closed" && status !== "unsettled") return;
      var names = tripStopIds.map(id => byId.get(id)).filter(f => f && REGION_ROAD[f.properties.region] === road).map(f => f.properties.name);
      if (names.length) issues.push({
        road,
        status,
        names
      });
    });
    return issues;
  }, [features, monthRow, tripStopIds]);
  var roadKeyRows = useMemo(() => {
    if (!monthRow) return [];
    var rows = [];
    ["tioga", "glacier"].forEach(r => {
      var status = monthRow[r];
      if (!ROAD_LINE_COLORS[status]) return;
      var row = rows.find(x => x.status === status);
      if (row) row.roads.push(ROAD_NAMES[r]);else rows.push({
        status,
        roads: [ROAD_NAMES[r]]
      });
    });
    return rows;
  }, [monthRow]);
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
      infoRef.current.setContent(buildInfoHtml(feature.properties, feature.geometry.coordinates, tripStopIdsRef.current, roadNoteFor(feature.properties, setupRef.current.month)));
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
    className: `map-page${!unlocked ? " map-page--locked" : ""}`
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
    onOpenInGuide: openInGuide,
    onEmailSubscribed: handleGateSubscribed,
    setup: setup,
    monthRow: monthRow,
    onChooseGate: chooseGate,
    onChooseMonth: chooseMonth,
    layers: layers,
    onToggleLayer: toggleLayer,
    roadIssues: roadIssues,
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
  }), mapReady && unlocked && roadKeyRows.length > 0 && React.createElement("div", {
    className: "map-page__roadkey",
    role: "note"
  }, roadKeyRows.map(row => {
    var many = row.roads.length > 1;
    return React.createElement("p", {
      key: row.status,
      className: "map-page__roadkey-row"
    }, React.createElement("span", {
      className: `map-page__roadkey-swatch map-page__roadkey-swatch--${row.status}`,
      "aria-hidden": "true"
    }), React.createElement("span", null, React.createElement("strong", null, row.roads.join(" and ")), " ", row.status === "closed" ? `${many ? "are" : "is"} typically closed to cars in ${monthRow.name}.` : `${many ? "have" : "has"} no fixed opening date; in ${monthRow.name} ${many ? "they move" : "it moves"} with the snowpack.`));
  }), React.createElement("p", {
    className: "map-page__roadkey-fine"
  }, React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "Today's status on Conditions"), " · ", "Road lines © OpenStreetMap contributors")), mapReady && unlocked && React.createElement("div", {
    className: "map-page__controls"
  }, React.createElement("button", {
    type: "button",
    className: "map-page__ctrl",
    onClick: resetView,
    title: "Reframe the map to every visible pin"
  }, "Reset view"), React.createElement("button", {
    type: "button",
    className: "map-page__ctrl",
    onClick: locateMe,
    disabled: locating,
    title: "Show where you are on the map"
  }, locating ? "Locating…" : "Find me"))), !unlocked && React.createElement(MapAccessGate, {
    onSubscribed: handleGateSubscribed
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
  }, "Somewhere to sleep between the days:", " ", React.createElement("a", {
    href: "/stay",
    onClick: e => {
      e.preventDefault();
      go("stay");
    }
  }, "the lodging board"), ", or", " ", React.createElement(window.AvailabilityLink, {
    destination: "Yosemite National Park",
    list: "map_sidebar",
    slug: "map",
    name: "Map sidebar lodging search"
  }, "check your dates →"), React.createElement("span", {
    className: "map-sidebar__next-disclosure"
  }, " Affiliate link. ", React.createElement("a", {
    href: "/affiliate",
    onClick: e => {
      e.preventDefault();
      go("affiliate");
    }
  }, "Disclosure."))), React.createElement("p", {
    className: "map-sidebar__next-line"
  }, "This trip, offline, at the trailhead: the Field Guide app is $3.99 for eighteen months.", " ", React.createElement("a", {
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
  onOpenInGuide,
  onEmailSubscribed,
  setup,
  monthRow,
  onChooseGate,
  onChooseMonth,
  layers,
  onToggleLayer,
  roadIssues,
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
    "aria-label": `Trip planner panel, currently ${sheetState}. Tap or swipe up to expand.`
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
  }, "Tap pins on the map or use the buttons below to build a trip.")), React.createElement(MapSetup, {
    setup: setup,
    monthRow: monthRow,
    onChooseGate: onChooseGate,
    onChooseMonth: onChooseMonth,
    layers: layers,
    onToggleLayer: onToggleLayer,
    go: go
  }), React.createElement("div", {
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
  })), roadIssues.map(issue => React.createElement("div", {
    key: issue.road,
    className: `map-sidebar__road-warn map-sidebar__road-warn--${issue.status}`,
    role: "note"
  }, React.createElement("strong", null, issue.status === "closed" ? `${ROAD_NAMES[issue.road]} is typically closed to cars in ${monthRow.name}.` : `${ROAD_NAMES[issue.road]} may not be open yet in ${monthRow.name}.`), " ", issue.names.length === 1 ? "This stop sits" : `These ${issue.names.length} stops sit`, " beyond it:", " ", issue.names.join(", "), ".")), tripStopIds.length > 0 && React.createElement("div", {
    className: "map-sidebar__trip-tools"
  }, React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-tool",
    onClick: onShareTrip
  }, "Copy link to this trip"), tripStopIds.length >= 2 && React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-tool",
    onClick: onOpenRoute
  }, "Open route in Google Maps"), React.createElement("button", {
    type: "button",
    className: "map-sidebar__trip-tool",
    onClick: onOpenInGuide
  }, "Open this trip in the Field Guide"), React.createElement("p", {
    className: "map-sidebar__offline"
  }, "This map needs a signal. In the park that means the east end of the Valley, and very little anywhere else (", React.createElement("a", {
    href: "/articles/cell-service-in-yosemite",
    onClick: e => {
      e.preventDefault();
      if (window.track) window.track("map_article_click", {
        slug: "cell-service-in-yosemite",
        source: "map_offline"
      });
      go("a:cell-service-in-yosemite");
    }
  }, "where it works"), "). The Field Guide carries the trip offline.")), tripStopIds.length >= 2 && React.createElement(TripEmailBox, {
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
var ORIENT_LAYERS = [{
  key: "gates",
  label: "Entrance gates"
}, {
  key: "gas",
  label: "Gas"
}, {
  key: "vc",
  label: "Visitor centers"
}, {
  key: "areas",
  label: "Areas and drive times"
}];
function MapSetup({
  setup,
  monthRow,
  onChooseGate,
  onChooseMonth,
  layers,
  onToggleLayer,
  go
}) {
  var months = getTripMonths();
  var gate = setup.gate ? ORIENT_GATES.find(g => g.id === setup.gate) : null;
  var status = road => monthRow ? monthRow[road] : null;
  var [editing, setEditing] = useState(() => !(setup.gate && setup.month));
  var answered = !!(gate && monthRow);
  return React.createElement("div", {
    className: "map-sidebar__section map-setup"
  }, React.createElement("h3", {
    className: "map-sidebar__section-label"
  }, "First time in Yosemite"), React.createElement("p", {
    className: "map-setup__lede"
  }, "The park's areas are an hour or more apart, and two of its roads close for half the year. Tell the map how you are coming in and when."), answered && !editing && React.createElement("p", {
    className: "map-setup__summary"
  }, React.createElement("span", null, gate.label, " entrance, ", monthRow.name, "."), React.createElement("button", {
    type: "button",
    className: "map-setup__change",
    onClick: () => setEditing(true)
  }, "Change")), (editing || !answered) && React.createElement(React.Fragment, null, React.createElement("h4", {
    className: "map-setup__q"
  }, "Your entrance"), React.createElement("div", {
    className: "map-setup__gates"
  }, ORIENT_GATES.map(g => {
    var closed = g.road && status(g.road) === "closed";
    return React.createElement("button", {
      key: g.id,
      type: "button",
      className: `map-setup__gate${closed ? " is-closed" : ""}`,
      "aria-pressed": setup.gate === g.id,
      onClick: () => onChooseGate(g.id)
    }, React.createElement("span", {
      className: "map-setup__gate-name"
    }, g.label), React.createElement("span", {
      className: "map-setup__gate-sub"
    }, closed ? `Closed in ${monthRow.label}` : g.hwy));
  })), gate && React.createElement("p", {
    className: "map-setup__hint"
  }, gate.road && status(gate.road) === "closed" ? `Tioga Pass is typically closed in ${monthRow.name}, and it is the only gate on the east side.` : gate.hint), months.length > 0 && React.createElement(React.Fragment, null, React.createElement("h4", {
    className: "map-setup__q"
  }, "Your month"), React.createElement("div", {
    className: "map-setup__months"
  }, months.map(m => React.createElement("button", {
    key: m.key,
    type: "button",
    className: "map-setup__month",
    "aria-pressed": setup.month === m.key,
    "aria-label": m.name,
    onClick: () => onChooseMonth(m.key)
  }, m.label))))), monthRow && React.createElement(React.Fragment, null, React.createElement("ul", {
    className: "map-setup__roads",
    "aria-label": `Roads in ${monthRow.name}, typically`
  }, ["tioga", "glacier"].map(road => React.createElement("li", {
    key: road,
    className: "map-setup__road"
  }, React.createElement("span", null, ROAD_NAMES[road]), React.createElement("span", {
    className: `map-setup__status map-setup__status--${monthRow[road]}`
  }, ROAD_STATUS_TEXT[monthRow[road]]))), React.createElement("li", {
    className: "map-setup__road"
  }, React.createElement("span", null, "Valley and Wawona roads"), React.createElement("span", {
    className: "map-setup__status map-setup__status--open"
  }, "Open all year")), React.createElement("li", {
    className: "map-setup__road"
  }, React.createElement("span", null, "Hetch Hetchy Road"), React.createElement("span", {
    className: "map-setup__status map-setup__status--open"
  }, "Daylight hours"))), monthRow.arrive && React.createElement("p", {
    className: "map-setup__arrive"
  }, React.createElement("strong", null, "At the gate in ", monthRow.name, ":"), " ", monthRow.arrive), React.createElement("p", {
    className: "map-setup__fine"
  }, "Typical for the month, not today.", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "Today's road status"))), React.createElement("h4", {
    className: "map-setup__q"
  }, "Also on the map"), React.createElement("div", {
    className: "map-sidebar__filters"
  }, ORIENT_LAYERS.map(l => React.createElement("button", {
    key: l.key,
    type: "button",
    className: `map-sidebar__filter-chip map-setup__layer map-setup__layer--${l.key}`,
    "aria-pressed": !!layers[l.key],
    onClick: () => onToggleLayer(l.key)
  }, React.createElement("span", {
    className: "map-setup__layer-mark",
    "aria-hidden": "true"
  }), React.createElement("span", null, l.label)))));
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
function roadNoteFor(p, monthKey) {
  var road = REGION_ROAD[p && p.region];
  var m = road && monthKey ? getTripMonth(monthKey) : null;
  if (!m) return "";
  if (m[road] === "closed") return `${ROAD_NAMES[road]} is typically closed to cars in ${m.name}.`;
  if (m[road] === "unsettled") {
    return `${ROAD_NAMES[road]} has no fixed opening date; in ${m.name} it moves with the snowpack. Check Conditions before you count on it.`;
  }
  return "";
}
var GAS_ICON_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2.5 11V1.5h5V11M7.5 5l2 1.5V10M3.5 4h3"/></svg>';
function orientInfoHtml(title, sub, note) {
  return `
    <div style="font:13px/1.5 system-ui,sans-serif;max-width:260px;color:#222;">
      <strong style="font-size:14px;display:block;line-height:1.3;">${escapeHtml(title)}</strong>
      ${sub ? `<span style="font-size:11px;color:#8a8675;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">${escapeHtml(sub)}</span>` : ""}
      ${note ? `<p style="margin:6px 0 0;font-size:12px;color:#444;line-height:1.5;">${escapeHtml(note)}</p>` : ""}
    </div>
  `;
}
function buildInfoHtml(p, coords, tripStopIds, roadNote) {
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
  var road = roadNote ? `<p style="margin:8px 0 0;padding:6px 8px;font-size:12px;line-height:1.4;color:#7a2a10;background:#f6ebe5;border-left:3px solid #7a2a10;">${escapeHtml(roadNote)}</p>` : "";
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
      ${road}
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
  onSubscribed
}) {
  return (React.createElement("div", {
      className: "map-page__gate",
      role: "dialog",
      "aria-label": "Subscribe to open the map"
    }, React.createElement("div", {
      className: "map-page__gate-backdrop"
    }), React.createElement("div", {
      className: "nlmodal__card map-page__gate-card"
    }, React.createElement("div", {
      className: "eyebrow eyebrow--moss",
      style: {
        marginBottom: 12
      }
    }, "The Trip Planner Map"), React.createElement("h3", null, "The map opens with an email."), React.createElement("p", null, "Every pin here was placed and written by a resident of the park: quiet vistas, parking turnouts that actually have space, picnic tables worth the drive. Drop your email and the full map, filters, and trip builder open right here, and stay open on this device."), React.createElement("form", {
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
      "aria-label": "Email address",
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
    }, "Unlock the map →")), React.createElement("p", {
      className: "map-gate__fine"
    }, "Signing up also gets you Sunday Field Notes, one short letter a week. No spam, leave anytime.")))
  );
}
function useMastheadHeight() {
  React.useEffect(() => {
    var el = document.querySelector(".hp-navigation");
    var root = document.documentElement;
    if (!el) return undefined;
    var set = () => root.style.setProperty("--masthead-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    set();
    var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(set) : null;
    if (ro) ro.observe(el);else window.addEventListener("resize", set);
    return () => {
      if (ro) ro.disconnect();else window.removeEventListener("resize", set);
      root.style.removeProperty("--masthead-h");
    };
  }, []);
}
function MapPage(props) {
  useMastheadHeight();
  return React.createElement(MapView, props);
}
window.MapPage = MapPage;
