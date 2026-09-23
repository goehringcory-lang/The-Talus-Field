/* global React */
// =============================================================================
// MAP PAGE — `/map` route. Google Maps JavaScript API + region-grouped trip
// builder, gated as a whole behind the newsletter signup (see MapAccessGate).
// Subscribers browse Yosemite pins by area, filter them by category chips
// (shareable via /map?cat=hike,vista), search the sidebar by name, and tap
// pins on the map or "+" buttons in the sidebar to assemble a trip. Pins
// cluster below zoom 13 (progressive enhancement; trip and selected pins
// never cluster). Overlay controls reset the view to all visible pins or drop
// a "you are here" dot via geolocation. The trip persists in localStorage so
// it survives a refresh, and can be shared via /map?trip=id1,id2. Destructive
// trip actions (quick picks, Clear all) offer a one-level Undo through the
// toast.
//
// API KEY: set in index.html, restricted to thetalusfieldjournal.com and
// localhost:8765 in the Google Cloud console. Maps JS API + marker library
// must remain enabled. mapId is required by AdvancedMarkerElement.
// =============================================================================

const { useEffect, useMemo, useRef, useState, useCallback } = React;

// The pin data's own cache-buster lives in itineraries-data.js
// (window.POINTS_URL), which both /map and /itineraries load eagerly, so a
// direct load of /itineraries sees the same versioned URL this page does.
const POINTS_URL = window.POINTS_URL;
// Worker API base for "email this trip". Override at runtime via
// window.GUIDE_API_BASE (same convention as page-guide.jsx) for local dev.
const MAP_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";
// Field Guide app base for "open this trip in the guide". Same runtime
// override convention as above (window.GUIDE_APP_BASE, see page-guide.jsx).
const GUIDE_APP_BASE =
  (typeof window !== "undefined" && window.GUIDE_APP_BASE) ||
  "https://guide.thetalusfieldjournal.com";
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

// Newsletter gate. The whole map is the lead magnet: a locked visitor sees a
// covering signup overlay (MapAccessGate) over a blurred live map and cannot
// reach the pins, filters, or trip builder until they subscribe. One
// Buttondown signup flips this localStorage flag (a prior signup anywhere on
// the site, via tfg.nl.subscribed, also counts), so a returning subscriber
// never sees the gate. Bypassable by design. Fails OPEN when storage is
// unavailable (private mode) so the gate can never permanently trap a reader
// who cannot persist the flag.
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

// Rough park center, used by the Find-me control to decide whether panning
// to the visitor's position is useful. Beyond LOCATE_PAN_MAX_KM the dot is
// still placed but the map stays framed on the park (panning to a living
// room in another state would just strand the visitor off the pin set).
const PARK_CENTER = { lat: 37.85, lng: -119.55 };
const LOCATE_PAN_MAX_KM = 100;

function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
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

// ---------------------------------------------------------------------------
// First-visit orientation. The pins answer "what is worth a stop"; this layer
// answers the questions a first-time visitor has before any of that: which
// gate am I using, which roads are shut in my month, where is the gas, and how
// far apart are the park's areas. Every line of copy below restates something
// the journal already publishes (the source article is named beside each), so
// the map adds no advice of its own; a new entry needs a published sentence
// behind it, the same rule the /stay picker follows.
// ---------------------------------------------------------------------------

// The reader's gate and month, persisted per device. The month seeds from the
// /planning trip selector's `when` answer (tfg.trip.selector) when this map
// has never been set up, so a reader who told the site their month once is
// not asked twice.
const SETUP_KEY = "tfg.map.setup";
const TRIP_SELECTOR_KEY = "tfg.trip.selector";

// Road status per month is NOT restated here: it is window.TRIP_MONTHS
// (intent-data.js, loaded on this route by PAGE_MODULES), the same table that
// caps the trip selector's itineraries, so the map and /planning cannot
// disagree about whether Tioga Road is open in May.
function getTripMonths() {
  return Array.isArray(window.TRIP_MONTHS) ? window.TRIP_MONTHS : [];
}
function getTripMonth(key) {
  return getTripMonths().find((m) => m.key === key) || null;
}

function loadSetup() {
  const saved = window.safeStorage.getJSON(SETUP_KEY) || {};
  const setup = {
    gate: typeof saved.gate === "string" ? saved.gate : null,
    month: typeof saved.month === "string" ? saved.month : null,
  };
  if (!setup.month) {
    const answers = window.safeStorage.getJSON(TRIP_SELECTOR_KEY);
    if (answers && typeof answers.when === "string") setup.month = answers.when;
  }
  if (setup.month && !getTripMonth(setup.month)) setup.month = null;
  if (setup.gate && !ORIENT_GATES.some((g) => g.id === setup.gate)) setup.gate = null;
  return setup;
}

// The five entrance stations. `road` names the TRIP_MONTHS field that closes
// the gate, where one does. Hints: /distances (drive times), getting-to-yosemite
// (Hetch Hetchy), tuolumne-meadows-in-a-day (the Tioga side).
const ORIENT_GATES = [
  { id: "arch", label: "Arch Rock", hwy: "Hwy 140", pos: { lat: 37.6878, lng: -119.7297 },
    hint: "From Mariposa and El Portal, open year-round. El Portal to the Valley is 25 to 35 minutes." },
  { id: "south", label: "South", hwy: "Hwy 41", pos: { lat: 37.5049, lng: -119.6318 },
    hint: "From Oakhurst. The Mariposa Grove welcome plaza is immediately inside the gate; Wawona is six miles on, the Valley about an hour past that." },
  { id: "bof", label: "Big Oak Flat", hwy: "Hwy 120 W", pos: { lat: 37.7996, lng: -119.8739 },
    hint: "From Groveland and the Bay Area. Crane Flat, just inside, has the only gas on the west side and is where Tioga Road begins." },
  { id: "hh", label: "Hetch Hetchy", hwy: "Evergreen Rd", pos: { lat: 37.892, lng: -119.841 },
    hint: "Its own entrance on its own road, open daylight hours only. It connects to nothing else in the park: to reach the Valley you drive back out." },
  { id: "tioga", label: "Tioga Pass", hwy: "Hwy 120 E", road: "tioga", pos: { lat: 37.9108, lng: -119.258 },
    hint: "From Lee Vining and the Eastern Sierra, about 30 minutes to Tuolumne Meadows. Only while Tioga Pass is open, and there is no gas between Lee Vining and Crane Flat." },
];

// Gas and visitor centers. The in-park pumps are at Crane Flat and Wawona
// (yosemite-gateway-towns-compared, first-time-yosemite-overwhelm); El Portal's
// station is outside the gate (gateway towns). Only the two visitor centers
// the journal names are here.
const ORIENT_SERVICES = [
  { id: "gas-crane", kind: "gas", label: "Gas at Crane Flat", pos: { lat: 37.7536, lng: -119.8006 },
    note: "The only fuel inside the park on the west side, pay-at-pump." },
  { id: "gas-wawona", kind: "gas", label: "Gas at Wawona", pos: { lat: 37.5364, lng: -119.6537 },
    note: "The other in-park pumps, on the Wawona Road." },
  { id: "gas-elportal", kind: "gas", label: "Gas in El Portal", pos: { lat: 37.6746, lng: -119.7835 },
    note: "Outside the Arch Rock gate. Fill up in the gateway town." },
  { id: "vc-valley", kind: "vc", label: "Yosemite Valley Visitor Center", pos: { lat: 37.7486, lng: -119.5871 } },
  { id: "vc-tuolumne", kind: "vc", label: "Tuolumne Meadows Visitor Center", pos: { lat: 37.8736, lng: -119.3724 },
    note: "Seasonal, with Tioga Road." },
];

// The four areas and how far they sit from the Valley, drawn as labels at
// park-wide zoom. Positions sit in open ground beside each area rather than on
// it, so a label never covers the area's own pins or cluster. glacier-point-how-to-visit (about an hour),
// yosemite-camping-complete-guide (Wawona, about an hour south),
// tioga-road-opening-weekend-2026 (roughly 90 minutes), getting-to-yosemite
// (Hetch Hetchy), tuolumne-meadows-in-a-day (no gas at Tuolumne).
const ORIENT_AREAS = [
  { id: "valley", label: "Yosemite Valley", line: "Where most first days start. No gas.", pos: { lat: 37.785, lng: -119.6 } },
  { id: "glacier", label: "Glacier Point", line: "About an hour from the Valley", road: "glacier", pos: { lat: 37.7, lng: -119.5 } },
  { id: "wawona", label: "Wawona", line: "About an hour south of the Valley", pos: { lat: 37.555, lng: -119.56 } },
  { id: "tuolumne", label: "Tuolumne Meadows", line: "Roughly 90 minutes, Tioga Road only. No gas.", road: "tioga", pos: { lat: 37.93, lng: -119.4 } },
  { id: "hetch", label: "Hetch Hetchy", line: "Its own road, daylight hours only", pos: { lat: 37.955, lng: -119.79 } },
];
// Area labels only make sense at park-wide zoom: closer in they crowd the
// pins, and further out (a phone's first frame) the five of them pile onto
// one another. Below LABEL_MIN_ZOOM the gate and gas markers drop their text
// labels too and keep only the mark, for the same reason.
const AREA_LABEL_MAX_ZOOM = 11;
const LABEL_MIN_ZOOM = 10;

// Which pin regions sit beyond a seasonal gate. Everything on Glacier Point
// Road is past Badger Pass, and every "tuolumne" pin is on Tioga Road past the
// Crane Flat gate; Hetch Hetchy and Wawona are plowed all winter
// (yosemite-in-winter).
const REGION_ROAD = { "glacier-point": "glacier", tuolumne: "tioga" };
const ROAD_NAMES = { tioga: "Tioga Road", glacier: "Glacier Point Road" };
const ROAD_STATUS_TEXT = {
  open: "Open",
  closed: "Closed to cars",
  unsettled: "Opening date varies",
};

// The two seasonal roads, drawn over the map when the chosen month closes
// them (or leaves the opening date to the snowpack). Geometry is OpenStreetMap
// data (© OpenStreetMap contributors, ODbL), simplified: Tioga Road from
// Crane Flat to the Tioga Pass gate, Glacier Point Road from Badger Pass,
// where the winter plowing ends (glacier-point-how-to-visit), to the point.
const ROAD_LINES = {
  tioga: [
    [
      [37.79233,-119.72272],[37.78981,-119.72422],[37.78889,-119.72623],[37.78871,-119.72799],[37.78944,-119.73152],[37.78874,-119.73555],
      [37.78685,-119.73843],[37.78482,-119.7404],[37.78148,-119.74745],[37.78034,-119.7484],[37.77764,-119.7493],[37.77539,-119.75224],
      [37.77476,-119.7538],[37.77462,-119.75665],[37.77308,-119.75858],[37.77178,-119.76165],[37.76987,-119.76328],[37.76959,-119.76441],
      [37.76989,-119.76894],[37.76907,-119.77097],[37.76587,-119.77413],[37.76237,-119.7749],[37.76115,-119.77428],[37.76035,-119.77187],
      [37.75846,-119.76986],[37.75756,-119.76995],[37.75541,-119.77216],[37.75536,-119.77352],[37.75656,-119.77694],[37.75728,-119.77768],
      [37.75909,-119.77848],[37.75943,-119.77919],[37.75705,-119.78535],[37.75721,-119.78643],[37.75853,-119.78821],[37.75864,-119.78912],
      [37.75715,-119.79064],[37.75687,-119.79159],[37.75781,-119.79352],[37.75942,-119.79473],[37.75969,-119.79775],[37.76116,-119.80025],
      [37.76069,-119.80235],[37.75901,-119.80481],[37.75819,-119.80486],[37.75546,-119.80231],[37.75326,-119.79791],[37.75248,-119.79756],
    ],
    [
      [37.87223,-119.36514],[37.87324,-119.35943],[37.87695,-119.35355],[37.87783,-119.34366],[37.88041,-119.33661],[37.8802,-119.32803],
      [37.88086,-119.32603],[37.88213,-119.32401],[37.88112,-119.32091],[37.88024,-119.31548],[37.88083,-119.30791],[37.87883,-119.30033],
      [37.87885,-119.29408],[37.87756,-119.28764],[37.87779,-119.28444],[37.87924,-119.27887],[37.87939,-119.27645],[37.88597,-119.27046],
      [37.89301,-119.26021],[37.8972,-119.25967],[37.90385,-119.26003],[37.9109,-119.25788],
    ],
    [
      [37.852,-119.57509],[37.85097,-119.57272],[37.84983,-119.57194],[37.84841,-119.57173],[37.84324,-119.5737],[37.83724,-119.57781],
      [37.83364,-119.57792],[37.83216,-119.57838],[37.82811,-119.58135],[37.82667,-119.58137],[37.82446,-119.58001],[37.82276,-119.58096],
      [37.82194,-119.58096],[37.82053,-119.5788],[37.81915,-119.57805],[37.81811,-119.57825],[37.8162,-119.58034],[37.81546,-119.58056],
      [37.81465,-119.58026],[37.81402,-119.57907],[37.81467,-119.57644],[37.81432,-119.57497],[37.81086,-119.5725],[37.80836,-119.56894],
      [37.8074,-119.566],[37.80588,-119.55612],[37.80642,-119.55138],[37.80726,-119.54856],[37.80679,-119.5446],[37.80842,-119.5369],
      [37.81164,-119.53194],[37.81254,-119.52783],[37.81592,-119.51963],[37.81771,-119.51712],[37.81796,-119.51612],[37.81721,-119.51397],
      [37.81725,-119.5095],[37.8167,-119.50808],[37.81576,-119.50751],[37.81479,-119.50753],[37.81229,-119.50948],[37.8116,-119.50922],
      [37.81115,-119.50843],[37.81122,-119.50739],[37.81331,-119.50247],[37.81686,-119.49855],[37.81717,-119.49752],[37.81659,-119.49637],
      [37.81495,-119.49627],[37.81425,-119.49585],[37.81272,-119.49314],[37.81233,-119.49155],[37.81258,-119.48762],[37.81115,-119.48597],
      [37.81093,-119.48497],[37.81151,-119.48384],[37.81597,-119.48139],[37.81875,-119.47876],[37.82009,-119.47815],[37.82262,-119.47779],
      [37.82375,-119.47703],[37.82447,-119.47576],[37.82644,-119.46945],[37.82889,-119.46808],[37.83051,-119.46763],[37.83285,-119.46606],
      [37.83431,-119.46323],[37.83362,-119.46075],[37.83383,-119.45895],[37.83611,-119.45478],[37.8403,-119.44984],[37.8432,-119.44754],
      [37.84737,-119.44536],[37.85215,-119.44094],[37.85724,-119.43801],[37.86331,-119.43296],[37.86587,-119.43161],[37.87191,-119.42736],
      [37.87339,-119.42554],[37.87431,-119.42002],[37.87622,-119.41786],[37.87672,-119.41649],[37.87601,-119.41189],[37.87658,-119.40674],
      [37.87737,-119.40541],[37.87958,-119.40394],[37.88112,-119.40194],[37.88149,-119.4007],[37.88039,-119.39691],[37.87684,-119.39458],
      [37.87363,-119.38645],[37.87333,-119.38415],[37.87373,-119.37763],[37.87203,-119.37065],[37.87222,-119.36517],
    ],
    [
      [37.79264,-119.72254],[37.79693,-119.72042],[37.79908,-119.71871],[37.80291,-119.71765],[37.81112,-119.71323],[37.81302,-119.71342],
      [37.81407,-119.71268],[37.81595,-119.71248],[37.81708,-119.71286],[37.81859,-119.71424],[37.81961,-119.71409],[37.82003,-119.71333],
      [37.82103,-119.70622],[37.82159,-119.70491],[37.82362,-119.70278],[37.82541,-119.70189],[37.83028,-119.70224],[37.83122,-119.70172],
      [37.83224,-119.69866],[37.83613,-119.6926],[37.83827,-119.6903],[37.83952,-119.68687],[37.84408,-119.68092],[37.84973,-119.6719],
      [37.85008,-119.67055],[37.85013,-119.66553],[37.85159,-119.66137],[37.85139,-119.66017],[37.84984,-119.65715],[37.85013,-119.65372],
      [37.85097,-119.65209],[37.85284,-119.65086],[37.85701,-119.64622],[37.85757,-119.64497],[37.85764,-119.64346],[37.85653,-119.63994],
      [37.85249,-119.63322],[37.84983,-119.62598],[37.84902,-119.62022],[37.85055,-119.61568],[37.84872,-119.61101],[37.84988,-119.60786],
      [37.85021,-119.60536],[37.84833,-119.60161],[37.84873,-119.59717],[37.84825,-119.5964],[37.84627,-119.59498],[37.84364,-119.59508],
      [37.84146,-119.59384],[37.83988,-119.59364],[37.83904,-119.59221],[37.83994,-119.58954],[37.84156,-119.58889],[37.84445,-119.58864],
      [37.84641,-119.58712],[37.8499,-119.58091],[37.85202,-119.57862],[37.85232,-119.57746],[37.85205,-119.57539],
    ],
    [
      [37.9108,-119.25789],[37.91045,-119.25793],
    ],
  ],
  glacier: [
    [
      [37.6674,-119.66292],[37.6692,-119.65927],[37.67183,-119.65678],[37.67282,-119.65528],[37.67442,-119.64943],[37.67402,-119.64732],
      [37.67193,-119.64362],[37.67158,-119.6414],[37.67193,-119.6403],[37.67361,-119.63911],[37.67381,-119.63731],[37.67135,-119.63435],
      [37.67026,-119.62734],[37.66634,-119.61506],[37.66674,-119.61299],[37.66946,-119.61055],[37.66996,-119.60945],[37.66969,-119.6085],
      [37.66774,-119.60598],[37.66722,-119.60385],[37.66755,-119.59872],[37.66828,-119.59572],[37.6678,-119.59282],[37.66806,-119.58912],
      [37.66823,-119.58732],[37.66873,-119.5863],[37.66947,-119.58543],[37.67091,-119.58502],[37.67312,-119.58576],[37.67436,-119.5875],
      [37.67953,-119.58929],[37.68355,-119.58859],[37.686,-119.58988],[37.68813,-119.5904],[37.69008,-119.59008],[37.69113,-119.58709],
      [37.69391,-119.58588],[37.70113,-119.58668],[37.70697,-119.58868],[37.7091,-119.58873],[37.71169,-119.58717],[37.71498,-119.58156],
      [37.71671,-119.57958],[37.71862,-119.5789],[37.71941,-119.58079],[37.7208,-119.57951],[37.72053,-119.57779],[37.71904,-119.57655],
      [37.71922,-119.57619],[37.72038,-119.57645],[37.72134,-119.57728],[37.71979,-119.5743],[37.71997,-119.57335],[37.7212,-119.57432],
      [37.72236,-119.57465],[37.72366,-119.57419],[37.72506,-119.57443],[37.72612,-119.57352],[37.72576,-119.57464],[37.72614,-119.57543],
      [37.72635,-119.57461],[37.72719,-119.57443],
    ],
  ],
};
const ROAD_LINE_COLORS = { closed: "#7a2a10", unsettled: "#b07d10" };

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
  const userMarkerRef = useRef(null); // "you are here" dot from the Find-me control

  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [toast, setToast] = useState(null);
  // Map gate: the whole map (pins, filters, search, the trip builder) sits
  // behind the newsletter signup. While locked, MapAccessGate covers the page
  // and the live map renders blurred behind it as a teaser. Seeded once from
  // the persisted unlock flag (or a prior signup anywhere on the site), so a
  // returning subscriber never sees the gate at all. Fails OPEN via
  // isMapUnlocked when storage throws (private mode), matching the rest of
  // the site. A shared ?trip= link also opens ungated for the visit: the
  // per-trip OG cards and edge/seo.js title overrides exist to make those
  // links worth tapping in a text thread, and landing the recipient on a
  // blurred email wall voided all of it. Presence is enough (ids are
  // whitelisted in parseTripParam); the unlock flag is deliberately NOT
  // written, so a later plain /map visit still meets the gate.
  const [unlocked, setUnlocked] = useState(() => {
    if (isMapUnlocked() || (window.isSubscribed && window.isSubscribed())) return true;
    try {
      return new URLSearchParams(window.location.search).has("trip");
    } catch (_e) {
      return false;
    }
  });
  // "Locating…" state for the Find-me map control below.
  const [locating, setLocating] = useState(false);

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
  // First-visit setup (see ORIENT_GATES): the reader's gate and month. The
  // month drives the seasonal road overlay, the trip's road check and the
  // road line in each InfoWindow; the gate is highlighted on the map.
  const [setup, setSetup] = useState(loadSetup);
  const setupRef = useRef(setup); // latest setup, read inside marker click handlers
  // Orientation layers. Stop pins keep their own category chips; these govern
  // only the gates, services and area labels this page adds.
  const [layers, setLayers] = useState({ gates: true, gas: true, vc: true, areas: true });
  const orientMarkersRef = useRef({}); // id -> { kind, marker }
  // Current map zoom, for the zoom-dependent orientation labels.
  const [zoom, setZoom] = useState(10);
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

  useEffect(() => {
    setupRef.current = setup;
    window.safeStorage.setJSON(SETUP_KEY, setup);
  }, [setup]);

  const monthRow = setup.month ? getTripMonth(setup.month) : null;
  const tiogaStatus = monthRow ? monthRow.tioga : null;
  const glacierStatus = monthRow ? monthRow.glacier : null;

  // Choosing the selected gate or month again clears it: the setup is an
  // aid, never a mode the reader has to find the way out of.
  const chooseGate = useCallback((id) => {
    setSetup((prev) => ({ ...prev, gate: prev.gate === id ? null : id }));
    if (window.track) window.track("map_setup_gate", { gate: id });
  }, []);
  const chooseMonth = useCallback((key) => {
    setSetup((prev) => ({ ...prev, month: prev.month === key ? null : key }));
    if (window.track) window.track("map_setup_month", { month: key });
  }, []);
  const toggleLayer = useCallback((key) => {
    setLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (window.track) window.track("map_layer_toggle", { layer: key, active: next[key] });
      return next;
    });
  }, []);

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
  // One signup flips the persisted unlock flag and drops the overlay; a prior
  // signup anywhere on the site (tfg.nl.subscribed) counts too and is already
  // reflected in the seeded `unlocked` state.
  const handleGateSubscribed = useCallback(() => {
    setMapUnlocked();
    setUnlocked(true);
  }, []);

  // Record one impression per visit while the gate is showing (it covers the
  // whole page for a locked visitor, so locked === shown).
  useEffect(() => {
    if (!unlocked && window.trackNewsletterImpression) {
      window.trackNewsletterImpression("map_gate", "map-gate");
    }
  }, [unlocked]);

  // While the gate covers the page, the blurred planner and map behind it are
  // only *visually* inaccessible: without this a keyboard user tabs straight
  // into the trip planner they have not unlocked. `inert` (set as a DOM
  // property, degrades to nothing where unsupported) takes the covered
  // children out of the tab order and the accessibility tree; the gate
  // itself stays live. `features` is a dependency because the first commit
  // is the "Loading map…" placeholder (features === null), and the real
  // .map-page--locked only exists once the pins arrive.
  useEffect(() => {
    if (unlocked) return;
    const page = document.querySelector(".map-page--locked");
    if (!page) return;
    const covered = Array.from(page.children).filter(
      (el) => !el.classList.contains("map-page__gate")
    );
    covered.forEach((el) => { el.inert = true; });
    return () => covered.forEach((el) => { el.inert = false; });
  }, [unlocked, features]);

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

  // Public toggle. Membership is read from the ref (not inside the state
  // updater) so the add/remove branch is decided before any change.
  const toggleTripStop = useCallback(
    (id, source) => {
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
    [performToggleTripStop]
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
      if (window.track) window.track("trip_add_all", { region: regionId });
      performAddAllFromRegion(regionId);
    },
    [performAddAllFromRegion]
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
      if (window.track) window.track("trip_quick_pick", { pick: quickPickId });
      performApplyQuickPick(quickPickId);
    },
    [performApplyQuickPick]
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

  // Hand the trip to the Field Guide app. The two catalogs share most of their
  // ids (points.geojson was seeded from the guide's stops), and the app maps
  // the rest itself, so the link carries plain ids and the app reports whatever
  // it could not bring across. Buyers land straight on the planner; everyone
  // else hits the app's sign-in, which stashes the trip until they own it.
  const openInGuide = useCallback(() => {
    const ids = tripStopIdsRef.current;
    if (ids.length === 0) return;
    const url = `${GUIDE_APP_BASE}/trip?import=${ids.join(",")}`;
    if (window.track) window.track("trip_open_in_guide", { trip_size: ids.length });
    window.open(url, "_blank", "noopener");
  }, []);

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

  // ---- Map controls (Reset view / Find me) --------------------------------
  // Reframes the map to every currently visible pin: active categories plus
  // trip stops (which stay visible regardless of the filter). Mirrors the
  // first-paint framing, including the zoom cap.
  const resetView = useCallback(() => {
    const map = mapRef.current;
    if (!map || !features) return;
    const maps = window.google && window.google.maps;
    if (!maps) return;
    const tripSet = new Set(tripStopIdsRef.current);
    const bounds = new maps.LatLngBounds();
    let visible = 0;
    for (const f of features) {
      const p = f.properties;
      if (!activeCats.has(p.category) && !tripSet.has(p.id)) continue;
      const [lng, lat] = f.geometry.coordinates;
      bounds.extend({ lat, lng });
      visible++;
    }
    if (visible === 0) return;
    map.fitBounds(bounds, 40);
    maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > 12) map.setZoom(12);
    });
    if (window.track) window.track("map_reset_view", { visible });
  }, [features, activeCats]);

  // Drops (or moves) a "you are here" dot and pans to it when the visitor is
  // near the park. Far away, the dot is still placed but the map stays framed
  // on Yosemite; either way the announcer says what happened. Geolocation
  // errors are a toast, never a broken control.
  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      announce("Location is not available in this browser.");
      return;
    }
    const map = mapRef.current;
    const markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!userMarkerRef.current) {
          const dot = document.createElement("div");
          dot.className = "map-user-dot";
          userMarkerRef.current = new markerLib.AdvancedMarkerElement({
            position,
            content: dot,
            title: "Your location",
            zIndex: 2000,
          });
        }
        userMarkerRef.current.position = position;
        userMarkerRef.current.map = map;
        const km = haversineKm(position, PARK_CENTER);
        if (km > LOCATE_PAN_MAX_KM) {
          announce("You are well outside the park right now. The map stayed on Yosemite.");
        } else {
          map.panTo(position);
          if (map.getZoom() < 13) map.setZoom(13);
          announce("Centered on your location.");
        }
        if (window.track) window.track("map_locate", { in_park: km <= LOCATE_PAN_MAX_KM });
      },
      () => {
        setLocating(false);
        announce("Could not get your location. Check the browser's location permission.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [announce]);

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
        infoRef.current.setContent(
          buildInfoHtml(p, feature.geometry.coordinates, tripStopIdsRef.current, roadNoteFor(p, setupRef.current.month))
        );
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
    info.setContent(
      buildInfoHtml(of.properties, of.geometry.coordinates, tripStopIds, roadNoteFor(of.properties, setup.month))
    );
  }, [tripStopIds, mapReady, setup.month]);

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

  // ---- Orientation layer: gates, services and area labels. Created once,
  // detached; the visibility effect below owns marker.map, the same split as
  // the stop pins. Gates and services open the shared InfoWindow with their
  // one published line; area labels are not interactive.
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const markerLib = markerLibRef.current;
    if (!map || !markerLib) return;
    const maps = window.google.maps;
    const made = {};
    const place = (id, kind, pos, el, title, zIndex, info) => {
      const marker = new markerLib.AdvancedMarkerElement({ position: pos, content: el, title, zIndex });
      if (info) {
        marker.addEventListener("click", () => {
          openFeatureRef.current = null;
          infoRef.current.setContent(info);
          infoRef.current.open({ anchor: marker, map });
          if (window.track) window.track("map_orient_click", { id });
        });
      }
      made[id] = { kind, marker };
    };
    ORIENT_GATES.forEach((g) => {
      const el = document.createElement("div");
      el.className = "map-orient map-orient--gate";
      el.innerHTML = `<span class="map-orient__mark" aria-hidden="true"></span><span class="map-orient__label">${escapeHtml(g.label)}</span>`;
      place(`gate-${g.id}`, "gates", g.pos, el, `${g.label} entrance, ${g.hwy}`, 900,
        orientInfoHtml(`${g.label} entrance`, g.hwy, g.hint));
    });
    ORIENT_SERVICES.forEach((sv) => {
      const el = document.createElement("div");
      el.className = `map-orient map-orient--${sv.kind}`;
      el.innerHTML = sv.kind === "gas"
        ? `<span class="map-orient__mark" aria-hidden="true">${GAS_ICON_SVG}</span><span class="map-orient__label">${escapeHtml(sv.label)}</span>`
        : `<span class="map-orient__mark" aria-hidden="true">i</span>`;
      place(sv.id, sv.kind, sv.pos, el, sv.label, 850, orientInfoHtml(sv.label, "", sv.note || ""));
    });
    ORIENT_AREAS.forEach((a) => {
      const el = document.createElement("div");
      el.className = "map-orient map-orient--area";
      el.innerHTML = `<span class="map-orient__area-name">${escapeHtml(a.label)}</span><span class="map-orient__area-line">${escapeHtml(a.line)}</span>`;
      place(`area-${a.id}`, "areas", a.pos, el, a.label, 800, null);
    });
    orientMarkersRef.current = made;
    const onZoom = () => {
      const z = map.getZoom();
      setZoom(z);
      // Marker labels hide by CSS under this class; the marks stay.
      if (containerRef.current) containerRef.current.classList.toggle("map-orient-far", z < LABEL_MIN_ZOOM);
    };
    const zoomListener = map.addListener("zoom_changed", onZoom);
    onZoom();
    return () => {
      maps.event.removeListener(zoomListener);
      Object.values(made).forEach((m) => { m.marker.map = null; });
      orientMarkersRef.current = {};
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    Object.values(orientMarkersRef.current).forEach((m) => {
      const on = m.kind === "areas"
        ? layers.areas && zoom >= LABEL_MIN_ZOOM && zoom <= AREA_LABEL_MAX_ZOOM
        : layers[m.kind];
      m.marker.map = on ? map : null;
    });
  }, [mapReady, layers, zoom]);

  // Selected gate gets a ring; a gate or area behind a closed road is drawn
  // in the closed colour, so a January reader sees Tioga Pass shut before
  // reading a word.
  useEffect(() => {
    if (!mapReady) return;
    const status = { tioga: tiogaStatus, glacier: glacierStatus };
    ORIENT_GATES.forEach((g) => {
      const m = orientMarkersRef.current[`gate-${g.id}`];
      if (!m) return;
      m.marker.content.classList.toggle("is-selected", setup.gate === g.id);
      m.marker.content.classList.toggle("is-closed", !!g.road && status[g.road] === "closed");
    });
    ORIENT_AREAS.forEach((a) => {
      const m = orientMarkersRef.current[`area-${a.id}`];
      if (!m) return;
      m.marker.content.classList.toggle("is-closed", !!a.road && status[a.road] === "closed");
    });
  }, [mapReady, setup.gate, tiogaStatus, glacierStatus]);

  // Seasonal road overlay: Tioga Road and Glacier Point Road drawn dashed in
  // the month's status colour, over a white casing so the dash reads on the
  // terrain tiles. An open road draws nothing; Google already draws the road.
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const maps = window.google && window.google.maps;
    if (!map || !maps) return;
    const lines = [];
    const status = { tioga: tiogaStatus, glacier: glacierStatus };
    Object.keys(ROAD_LINES).forEach((road) => {
      const color = ROAD_LINE_COLORS[status[road]];
      if (!color) return;
      ROAD_LINES[road].forEach((line) => {
        const path = line.map(([lat, lng]) => ({ lat, lng }));
        lines.push(new maps.Polyline({
          map, path, clickable: false, zIndex: 1,
          strokeColor: "#ffffff", strokeOpacity: 0.9, strokeWeight: 7,
        }));
        lines.push(new maps.Polyline({
          map, path, clickable: false, zIndex: 2, strokeOpacity: 0,
          icons: [{
            icon: { path: "M 0,-1 0,1", strokeOpacity: 1, strokeColor: color, strokeWeight: 4, scale: 2.5 },
            offset: "0",
            repeat: "11px",
          }],
        }));
      });
    });
    return () => lines.forEach((l) => l.setMap(null));
  }, [mapReady, tiogaStatus, glacierStatus]);

  // Trip stops that sit behind a seasonal road the chosen month closes (or
  // leaves to the snowpack), grouped by road for the sidebar warning.
  const roadIssues = useMemo(() => {
    if (!features || !monthRow) return [];
    const byId = new Map(features.map((f) => [f.properties.id, f]));
    const issues = [];
    ["glacier", "tioga"].forEach((road) => {
      const status = monthRow[road];
      if (status !== "closed" && status !== "unsettled") return;
      const names = tripStopIds
        .map((id) => byId.get(id))
        .filter((f) => f && REGION_ROAD[f.properties.region] === road)
        .map((f) => f.properties.name);
      if (names.length) issues.push({ road, status, names });
    });
    return issues;
  }, [features, monthRow, tripStopIds]);

  // Roads the overlay is currently drawing, grouped by status for the
  // on-map key (in every TRIP_MONTHS row so far both roads share a status,
  // which reads as one line rather than two identical ones).
  const roadKeyRows = useMemo(() => {
    if (!monthRow) return [];
    const rows = [];
    ["tioga", "glacier"].forEach((r) => {
      const status = monthRow[r];
      if (!ROAD_LINE_COLORS[status]) return;
      const row = rows.find((x) => x.status === status);
      if (row) row.roads.push(ROAD_NAMES[r]);
      else rows.push({ status, roads: [ROAD_NAMES[r]] });
    });
    return rows;
  }, [monthRow]);

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
        buildInfoHtml(
          feature.properties,
          feature.geometry.coordinates,
          tripStopIdsRef.current,
          roadNoteFor(feature.properties, setupRef.current.month)
        )
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
    <div className={`map-page${!unlocked ? " map-page--locked" : ""}`}>
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
        onOpenInGuide={openInGuide}
        onEmailSubscribed={handleGateSubscribed}
        setup={setup}
        monthRow={monthRow}
        onChooseGate={chooseGate}
        onChooseMonth={chooseMonth}
        layers={layers}
        onToggleLayer={toggleLayer}
        roadIssues={roadIssues}
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
        {mapReady && unlocked && roadKeyRows.length > 0 && (
          <div className="map-page__roadkey" role="note">
            {roadKeyRows.map((row) => {
              const many = row.roads.length > 1;
              return (
                <p key={row.status} className="map-page__roadkey-row">
                  <span
                    className={`map-page__roadkey-swatch map-page__roadkey-swatch--${row.status}`}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>{row.roads.join(" and ")}</strong>{" "}
                    {row.status === "closed"
                      ? `${many ? "are" : "is"} typically closed to cars in ${monthRow.name}.`
                      : `${many ? "have" : "has"} no fixed opening date; in ${monthRow.name} ${many ? "they move" : "it moves"} with the snowpack.`}
                  </span>
                </p>
              );
            })}
            <p className="map-page__roadkey-fine">
              <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>Today's status on Conditions</a>
              {" · "}Road lines © OpenStreetMap contributors
            </p>
          </div>
        )}
        {mapReady && unlocked && (
          <div className="map-page__controls">
            <button
              type="button"
              className="map-page__ctrl"
              onClick={resetView}
              title="Reframe the map to every visible pin"
            >Reset view</button>
            <button
              type="button"
              className="map-page__ctrl"
              onClick={locateMe}
              disabled={locating}
              title="Show where you are on the map"
            >{locating ? "Locating…" : "Find me"}</button>
          </div>
        )}
      </div>
      {!unlocked && <MapAccessGate onSubscribed={handleGateSubscribed} />}
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
      {/* A built trip implies nights. This is the one lodging placement on the
          map, and it goes through the shared AvailabilityLink so the
          disclosure and the GA4 payload match every other one on the site. */}
      <p className="map-sidebar__next-line">
        Somewhere to sleep between the days:{" "}
        <a
          href="/stay"
          onClick={(e) => { e.preventDefault(); go("stay"); }}
        >the lodging board</a>, or{" "}
        <window.AvailabilityLink
          destination="Yosemite National Park"
          list="map_sidebar"
          slug="map"
          name="Map sidebar lodging search"
        >check your dates →</window.AvailabilityLink>
        <span className="map-sidebar__next-disclosure"> Affiliate link. <a href="/affiliate" onClick={(e) => { e.preventDefault(); go("affiliate"); }}>Disclosure.</a></span>
      </p>
      <p className="map-sidebar__next-line">
        This trip, offline, at the trailhead: the Field Guide app is $3.99 for eighteen months.{" "}
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
        aria-label={`Trip planner panel, currently ${sheetState}. Tap or swipe up to expand.`}
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

      <MapSetup
        setup={setup}
        monthRow={monthRow}
        onChooseGate={onChooseGate}
        onChooseMonth={onChooseMonth}
        layers={layers}
        onToggleLayer={onToggleLayer}
        go={go}
      />

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
        {roadIssues.map((issue) => (
          <div key={issue.road} className={`map-sidebar__road-warn map-sidebar__road-warn--${issue.status}`} role="note">
            <strong>
              {issue.status === "closed"
                ? `${ROAD_NAMES[issue.road]} is typically closed to cars in ${monthRow.name}.`
                : `${ROAD_NAMES[issue.road]} may not be open yet in ${monthRow.name}.`}
            </strong>{" "}
            {issue.names.length === 1 ? "This stop sits" : `These ${issue.names.length} stops sit`} beyond it:{" "}
            {issue.names.join(", ")}.
          </div>
        ))}
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
            <button
              type="button"
              className="map-sidebar__trip-tool"
              onClick={onOpenInGuide}
            >Open this trip in the Field Guide</button>
            <p className="map-sidebar__offline">
              This map needs a signal. In the park that means the east end of the Valley, and very little anywhere else
              (<a
                href="/articles/cell-service-in-yosemite"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.track) window.track("map_article_click", { slug: "cell-service-in-yosemite", source: "map_offline" });
                  go("a:cell-service-in-yosemite");
                }}
              >where it works</a>). The Field Guide carries the trip offline.
            </p>
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

// ---------------------------------------------------------------------------
// First-visit setup: two answers (entrance, month) and the orientation
// layers. The month's road rows and arrival line come from TRIP_MONTHS; the
// gate hints from ORIENT_GATES. Nothing here is advice of the map's own.
// ---------------------------------------------------------------------------
const ORIENT_LAYERS = [
  { key: "gates", label: "Entrance gates" },
  { key: "gas", label: "Gas" },
  { key: "vc", label: "Visitor centers" },
  { key: "areas", label: "Areas and drive times" },
];

function MapSetup({ setup, monthRow, onChooseGate, onChooseMonth, layers, onToggleLayer, go }) {
  const months = getTripMonths();
  const gate = setup.gate ? ORIENT_GATES.find((g) => g.id === setup.gate) : null;
  const status = (road) => (monthRow ? monthRow[road] : null);
  // A reader who answered both on an earlier visit gets a one-line summary
  // instead of the two pickers, so the trip is not pushed below the fold.
  const [editing, setEditing] = useState(() => !(setup.gate && setup.month));
  const answered = !!(gate && monthRow);
  return (
    <div className="map-sidebar__section map-setup">
      <h3 className="map-sidebar__section-label">First time in Yosemite</h3>
      <p className="map-setup__lede">
        The park's areas are an hour or more apart, and two of its roads close for half the year.
        Tell the map how you are coming in and when.
      </p>

      {answered && !editing && (
        <p className="map-setup__summary">
          <span>{gate.label} entrance, {monthRow.name}.</span>
          <button type="button" className="map-setup__change" onClick={() => setEditing(true)}>Change</button>
        </p>
      )}
      {(editing || !answered) && (
      <>
      <h4 className="map-setup__q">Your entrance</h4>
      <div className="map-setup__gates">
        {ORIENT_GATES.map((g) => {
          const closed = g.road && status(g.road) === "closed";
          return (
            <button
              key={g.id}
              type="button"
              className={`map-setup__gate${closed ? " is-closed" : ""}`}
              aria-pressed={setup.gate === g.id}
              onClick={() => onChooseGate(g.id)}
            >
              <span className="map-setup__gate-name">{g.label}</span>
              <span className="map-setup__gate-sub">{closed ? `Closed in ${monthRow.label}` : g.hwy}</span>
            </button>
          );
        })}
      </div>
      {gate && (
        <p className="map-setup__hint">
          {gate.road && status(gate.road) === "closed"
            ? `Tioga Pass is typically closed in ${monthRow.name}, and it is the only gate on the east side.`
            : gate.hint}
        </p>
      )}

      {months.length > 0 && (
        <>
          <h4 className="map-setup__q">Your month</h4>
          <div className="map-setup__months">
            {months.map((m) => (
              <button
                key={m.key}
                type="button"
                className="map-setup__month"
                aria-pressed={setup.month === m.key}
                aria-label={m.name}
                onClick={() => onChooseMonth(m.key)}
              >{m.label}</button>
            ))}
          </div>
        </>
      )}
      </>
      )}

      {monthRow && (
        <>
          <ul className="map-setup__roads" aria-label={`Roads in ${monthRow.name}, typically`}>
            {["tioga", "glacier"].map((road) => (
              <li key={road} className="map-setup__road">
                <span>{ROAD_NAMES[road]}</span>
                <span className={`map-setup__status map-setup__status--${monthRow[road]}`}>
                  {ROAD_STATUS_TEXT[monthRow[road]]}
                </span>
              </li>
            ))}
            <li className="map-setup__road">
              <span>Valley and Wawona roads</span>
              <span className="map-setup__status map-setup__status--open">Open all year</span>
            </li>
            <li className="map-setup__road">
              <span>Hetch Hetchy Road</span>
              <span className="map-setup__status map-setup__status--open">Daylight hours</span>
            </li>
          </ul>
          {monthRow.arrive && (
            <p className="map-setup__arrive">
              <strong>At the gate in {monthRow.name}:</strong> {monthRow.arrive}
            </p>
          )}
          <p className="map-setup__fine">
            Typical for the month, not today.{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>Today's road status</a>
          </p>
        </>
      )}

      <h4 className="map-setup__q">Also on the map</h4>
      <div className="map-sidebar__filters">
        {ORIENT_LAYERS.map((l) => (
          <button
            key={l.key}
            type="button"
            className={`map-sidebar__filter-chip map-setup__layer map-setup__layer--${l.key}`}
            aria-pressed={!!layers[l.key]}
            onClick={() => onToggleLayer(l.key)}
          >
            <span className="map-setup__layer-mark" aria-hidden="true" />
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
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
// The seasonal-road line an InfoWindow carries when the reader's month closes
// the road a pin sits behind (REGION_ROAD). Empty when no month is set.
function roadNoteFor(p, monthKey) {
  const road = REGION_ROAD[p && p.region];
  const m = road && monthKey ? getTripMonth(monthKey) : null;
  if (!m) return "";
  if (m[road] === "closed") return `${ROAD_NAMES[road]} is typically closed to cars in ${m.name}.`;
  if (m[road] === "unsettled") {
    return `${ROAD_NAMES[road]} has no fixed opening date; in ${m.name} it moves with the snowpack. Check Conditions before you count on it.`;
  }
  return "";
}

// A 12px pump for the gas markers; stroke-only so it takes the marker's colour.
const GAS_ICON_SVG =
  '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2.5 11V1.5h5V11M7.5 5l2 1.5V10M3.5 4h3"/></svg>';

// InfoWindow content for a gate or service marker: a name, an optional
// subline, and the one published sentence behind it.
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
  // Set only when the reader's month closes the road this pin sits behind.
  const road = roadNote
    ? `<p style="margin:8px 0 0;padding:6px 8px;font-size:12px;line-height:1.4;color:#7a2a10;background:#f6ebe5;border-left:3px solid #7a2a10;">${escapeHtml(roadNote)}</p>`
    : "";
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
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// Map signup gate. The whole map is behind the newsletter: this overlay
// covers .map-page (map + sidebar) for a locked visitor, with the live map
// blurred behind it as a teaser (.map-page--locked in styles.css). Not
// dismissable — the map is the thing being traded for the email — but it is
// scoped to .map-page rather than the viewport, so the global header and
// footer stay reachable and the visitor is never trapped on the site. One
// signup unlocks this device permanently (tfg.map.unlocked); the gate is
// bypassable by design and fails open when storage is unavailable. Reuses
// the exit-intent modal's .nlmodal card styling. The signup also satisfies
// the shared "subscribed" flag (via trackNewsletterSubmit), suppressing the
// exit-intent modal elsewhere on the site.
// ---------------------------------------------------------------------------
function MapAccessGate({ onSubscribed }) {
  return (
    // role="dialog" without aria-modal: the global header and footer stay
    // reachable by design (see the comment above), so claiming modality to
    // AT would be a lie. The locked planner behind the blur is made inert
    // by MapView, which is what actually keeps Tab out of it.
    <div className="map-page__gate" role="dialog" aria-label="Subscribe to open the map">
      <div className="map-page__gate-backdrop" />
      <div className="nlmodal__card map-page__gate-card">
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The Trip Planner Map</div>
        <h3>The map opens with an email.</h3>
        <p>Every pin here was placed and written by a resident of the park: quiet vistas, parking turnouts that actually have space, picnic tables worth the drive. Drop your email and the full map, filters, and trip builder open right here, and stay open on this device.</p>
        <form
          className="nlbox__form"
          action="https://buttondown.com/api/emails/embed-subscribe/goehring"
          method="post"
          target="buttondown-target"
          onSubmit={() => {
            if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("map_gate", "map-gate");
            // Defer one tick so the form's native POST into the hidden iframe
            // fires before onSubscribed unmounts this form.
            setTimeout(onSubscribed, 0);
          }}
        >
          <input type="email" name="email" aria-label="Email address" placeholder="you@email.com" required />
          <input type="hidden" name="tag" value="map-gate" />
          <input type="hidden" name="embed" value="1" />
          <button type="submit">Unlock the map →</button>
        </form>
        <p className="map-gate__fine">Signing up also gets you Sunday Field Notes, one short letter a week. No spam, leave anytime.</p>
      </div>
    </div>
  );
}

// The map page stays indexable (edge/seo.js serves crawler prose for /map);
// the interactive map itself sits behind the subscriber gate above
// (MapAccessGate, rendered by MapView whenever the visitor is locked).
// The map fills the first screen under the masthead. The design masthead is
// not sticky and its height depends on the width (its link row wraps under
// the brand on phones), so the page measures it and hands the number to the
// stylesheet as --masthead-h rather than hard-coding one height per breakpoint.
function useMastheadHeight() {
  React.useEffect(() => {
    const el = document.querySelector(".hp-navigation");
    const root = document.documentElement;
    if (!el) return undefined;
    const set = () => root.style.setProperty("--masthead-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    set();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(set) : null;
    if (ro) ro.observe(el); else window.addEventListener("resize", set);
    return () => {
      if (ro) ro.disconnect(); else window.removeEventListener("resize", set);
      root.style.removeProperty("--masthead-h");
    };
  }, []);
}

function MapPage(props) {
  useMastheadHeight();
  return <MapView {...props} />;
}

window.MapPage = MapPage;
