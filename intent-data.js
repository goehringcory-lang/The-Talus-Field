// =============================================================================
// INTENT — the reader-intent taxonomy behind the Planning Guide's trip selector
// and the filters on /planning and /articles.
//
// A raw (uncompiled) script like data.js and itineraries-data.js: pure data plus
// the matching/scoring logic, no JSX. The React that renders it lives in
// intent.jsx (/dist/intent.js). Both files load together on the `planning` and
// `articles` routes via PAGE_MODULES in app.jsx; neither is in the eager shell.
//
// Three facets, fixed:
//   stage  — where the reader is in the trip (before booking ... in the park now)
//   who    — who is traveling (first trip, families, non-hikers, accessible, ...)
//   topic  — the logistics question (lodging, camping, permits, transport, ...)
//
// window.ARTICLE_INTENT tags each article by hand. It is a curated mirror of the
// catalog in data.js and will rot silently if an article is added without a tag
// entry, so scripts/check-intent-tags.mjs (wired into `npm --prefix scripts run
// check`) fails the build when a slug is missing, unknown, or carries a tag that
// is not in INTENT_FACETS. Nothing at runtime can catch either.
//
// Rules for tagging:
//   - Tag what the article ANSWERS, not what it mentions. A piece that names a
//     campground in passing is not a camping article.
//   - An empty facet is a legitimate answer. The natural-history essays answer
//     no logistics question, and giving them a topic tag to avoid a blank would
//     put them in front of a reader who asked about permits.
//   - Nothing here may be date-derived or computed from the catalog: this table
//     is curation and has to read the same in January as in July.
// =============================================================================

window.INTENT_FACETS = [
  {
    id: "stage",
    label: "Trip stage",
    question: "Where are you in the trip?",
    options: [
      { id: "before-booking", label: "Before booking", note: "Nothing is paid for yet." },
      { id: "dates-set", label: "Dates are set", note: "The trip is real. Now build it." },
      { id: "week-before", label: "Week before arrival", note: "Packing and last checks." },
      { id: "in-park", label: "In the park now", note: "Useful with the car already parked." },
    ],
  },
  {
    id: "who",
    label: "Traveler type",
    question: "Who is traveling?",
    options: [
      { id: "first-trip", label: "First trip", note: "Never been to Yosemite." },
      { id: "families", label: "Families", note: "Kids in the group." },
      { id: "non-hikers", label: "Non-hikers", note: "The park without a trail." },
      { id: "accessible", label: "Accessible travel", note: "Mobility needs in the group." },
      { id: "dogs", label: "Dogs", note: "A dog is coming." },
      { id: "backpacking", label: "Backpacking", note: "A night out in the wilderness." },
      { id: "photography", label: "Photography", note: "The light is the point." },
    ],
  },
  {
    id: "topic",
    label: "Topic",
    question: "What is the question?",
    options: [
      { id: "lodging", label: "Lodging", note: "Where you sleep, in park or out." },
      { id: "camping", label: "Camping", note: "Campgrounds, food storage, bears." },
      { id: "permits", label: "Permits", note: "Entry, Half Dome, wilderness." },
      { id: "transportation", label: "Transportation", note: "Entrances, roads, shuttles, parking." },
      { id: "food", label: "Food", note: "Groceries, restaurants, what to bring." },
      { id: "trails", label: "Trails", note: "Which hike, and what it actually asks." },
      { id: "conditions", label: "Conditions", note: "Season, weather, crowds, smoke." },
    ],
  },
];

// Per-article tags. Keyed by the slug in window.ARTICLES.
window.ARTICLE_INTENT = {
  "yosemite-tunnel-trees":                     { stage: ["in-park"], who: [], topic: [] },
  "yosemite-wildlife-viewing-guide":           { stage: ["dates-set", "in-park"], who: ["families", "non-hikers", "photography"], topic: [] },
  "showy-milkweed-yosemite-valley":            { stage: ["in-park"], who: ["non-hikers"], topic: [] },
  "yosemite-connecting-to-traditions":         { stage: ["dates-set", "in-park"], who: ["families", "non-hikers", "accessible"], topic: [] },
  "yosemite-waterfalls-guide":                 { stage: ["before-booking", "dates-set"], who: ["first-trip", "non-hikers", "photography"], topic: ["trails", "conditions"] },
  "yosemite-photography-spots":                { stage: ["dates-set", "in-park"], who: ["photography", "non-hikers"], topic: ["trails"] },
  "horsetail-fall-firefall":                   { stage: ["before-booking", "dates-set"], who: ["photography"], topic: ["conditions"] },
  "yosemite-in-winter":                        { stage: ["before-booking", "dates-set"], who: ["first-trip"], topic: ["conditions", "transportation"] },
  "where-to-stay-in-yosemite":                 { stage: ["before-booking"], who: ["first-trip", "families", "accessible"], topic: ["lodging"] },
  "yosemite-wildflowers-guide":                { stage: ["dates-set"], who: ["photography", "non-hikers"], topic: ["conditions"] },
  "watching-climbers-el-capitan":              { stage: ["in-park"], who: ["families", "non-hikers", "accessible"], topic: [] },
  "getting-to-yosemite":                       { stage: ["before-booking", "dates-set"], who: ["first-trip"], topic: ["transportation"] },
  "yosemite-wilderness-permits-guide":         { stage: ["before-booking", "dates-set"], who: ["backpacking"], topic: ["permits", "trails"] },
  "yosemite-accessibility-guide":              { stage: ["before-booking", "dates-set"], who: ["accessible", "non-hikers", "families"], topic: ["lodging", "transportation", "trails"] },
  "pets-in-yosemite":                          { stage: ["before-booking", "dates-set"], who: ["dogs"], topic: ["lodging", "camping", "trails"] },
  "yosemite-ranger-programs":                  { stage: ["dates-set", "in-park"], who: ["families", "first-trip", "non-hikers"], topic: [] },
  "yosemite-camping-complete-guide":           { stage: ["before-booking"], who: ["families", "dogs"], topic: ["camping", "lodging"] },
  "where-to-propose-in-yosemite":              { stage: ["dates-set", "in-park"], who: ["photography"], topic: [] },
  "yosemite-bears-safety-guide":               { stage: ["week-before", "in-park"], who: ["families", "backpacking"], topic: ["camping", "food"] },
  "yosemite-heat-safety-guide":                { stage: ["week-before", "in-park"], who: ["families", "first-trip"], topic: ["conditions", "trails"] },
  "when-to-visit-yosemite-2026-crowd-forecast":{ stage: ["before-booking"], who: ["first-trip"], topic: ["conditions"] },
  "yosemite-trip-cost-budget-2026":            { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "camping", "food", "transportation"] },
  "yosemite-in-june-2026":                     { stage: ["before-booking", "dates-set"], who: [], topic: ["conditions"] },
  "cathedral-lakes-day-hike":                  { stage: ["dates-set", "in-park"], who: [], topic: ["trails"] },
  "yosemite-needs-a-reservation-system":       { stage: ["before-booking"], who: [], topic: ["conditions"] },
  "memorial-day-skip-the-valley-go-high-2026": { stage: ["dates-set", "week-before"], who: [], topic: ["conditions", "trails"] },
  "where-to-eat-yosemite":                     { stage: ["dates-set", "week-before", "in-park"], who: ["families"], topic: ["food"] },
  "yosemite-in-one-or-two-days":               { stage: ["before-booking", "dates-set"], who: ["first-trip", "non-hikers"], topic: ["trails", "transportation"] },
  "four-mile-up-panorama-down":                { stage: ["dates-set", "in-park"], who: [], topic: ["trails"] },
  "yosemite-with-kids-no-reservations-2026":   { stage: ["before-booking", "dates-set"], who: ["families", "first-trip"], topic: ["lodging", "trails", "food"] },
  "tioga-road-opening-weekend-2026":           { stage: ["dates-set", "week-before"], who: [], topic: ["conditions", "transportation", "trails"] },
  "so-you-want-to-hike-half-dome":             { stage: ["before-booking", "dates-set"], who: ["backpacking"], topic: ["permits", "trails"] },
  "half-dome-permit-lottery-2026":             { stage: ["before-booking"], who: ["backpacking"], topic: ["permits", "trails"] },
  "glacier-point-road-open-2026":              { stage: ["dates-set", "week-before"], who: ["non-hikers", "accessible"], topic: ["conditions", "transportation", "trails"] },
  "mist-trail-the-real-guide":                 { stage: ["dates-set", "in-park"], who: ["first-trip", "families"], topic: ["trails"] },
  "working-in-yosemite":                       { stage: [], who: [], topic: [] },
  "water-ouzels-waterfalls":                   { stage: ["in-park"], who: [], topic: [] },
  "bears-spring-emergence":                    { stage: ["week-before", "in-park"], who: ["families"], topic: ["camping"] },
  "yosemite-glaciers-climate":                 { stage: ["in-park"], who: [], topic: [] },
  "giant-sequoias-fire-adaptation":            { stage: ["in-park"], who: ["families", "non-hikers"], topic: [] },
  "hetch-hetchy-the-other-yosemite-valley":    { stage: ["dates-set", "in-park"], who: ["non-hikers"], topic: ["trails"] },
  "yosemite-stargazing-where-to-look-up":      { stage: ["dates-set", "in-park"], who: ["photography", "non-hikers", "families"], topic: [] },
  "yosemite-for-non-hikers":                   { stage: ["before-booking", "dates-set", "in-park"], who: ["non-hikers", "accessible", "families"], topic: ["trails"] },
  "pack-your-car-for-yosemite":                { stage: ["week-before"], who: ["families", "dogs"], topic: ["food", "camping"] },
  "yosemite-gateway-towns-compared":           { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "transportation", "food"] },
  "yosemite-during-smoke-season":              { stage: ["before-booking", "dates-set", "week-before"], who: [], topic: ["conditions"] },
  "yosemite-without-reservations-2026":        { stage: ["before-booking"], who: ["first-trip"], topic: ["permits", "transportation", "conditions"] },
  "first-time-yosemite-overwhelm":             { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "transportation"] },
};

// The handful of articles that only apply to part of the year. Everything else
// is month-agnostic and is left out of this table.
//
// This is not a filter facet: a reader never asks for "articles about February".
// It exists because the trip selector knows the month, and a February plan that
// recommends "Yosemite in June" reads as a tool that was not listening. Each
// month's TRIP_MONTHS.read must appear in its own month's window, or the anchor
// this table is protecting would be dropped by it — check-intent-tags.mjs
// enforces exactly that.
window.ARTICLE_MONTHS = {
  "yosemite-in-june-2026": ["jun"],
  "horsetail-fall-firefall": ["feb"],
  "memorial-day-skip-the-valley-go-high-2026": ["may"],
  "tioga-road-opening-weekend-2026": ["may", "jun"],
  "glacier-point-road-open-2026": ["may", "jun"],
  "yosemite-in-winter": ["nov", "dec", "jan", "feb", "mar"],
  "yosemite-heat-safety-guide": ["jun", "jul", "aug", "sep"],
  "yosemite-during-smoke-season": ["jul", "aug", "sep", "oct"],
  "bears-spring-emergence": ["mar", "apr", "may", "jun"],
};

// True when this article is worth putting in front of someone visiting in this
// month. An unknown month (dates not set) constrains nothing: a reader still
// choosing dates is exactly who the seasonal pieces are for.
window.articleFitsMonth = function (slug, monthKey) {
  if (!monthKey || monthKey === "unsure") return true;
  var allowed = window.ARTICLE_MONTHS[slug];
  return !allowed || allowed.indexOf(monthKey) !== -1;
};

// ---------------------------------------------------------------------------
// Lookups and filtering
// ---------------------------------------------------------------------------

window.EMPTY_INTENT = { stage: [], who: [], topic: [] };

// Tags for one slug. Always returns all three keys as arrays, so callers never
// have to guard an untagged article.
window.intentFor = function (slug) {
  var t = window.ARTICLE_INTENT[slug];
  if (!t) return { stage: [], who: [], topic: [] };
  return {
    stage: t.stage || [],
    who: t.who || [],
    topic: t.topic || [],
  };
};

// Selection semantics: OR within a facet, AND across facets. An empty facet in
// the selection places no constraint.
window.matchesIntent = function (article, selection) {
  if (!selection) return true;
  var tags = window.intentFor(article.slug);
  for (var i = 0; i < window.INTENT_FACETS.length; i++) {
    var facet = window.INTENT_FACETS[i].id;
    var picked = selection[facet] || [];
    if (!picked.length) continue;
    var hit = picked.some(function (id) { return tags[facet].indexOf(id) !== -1; });
    if (!hit) return false;
  }
  return true;
};

window.filterArticlesByIntent = function (articles, selection) {
  return (articles || []).filter(function (a) { return window.matchesIntent(a, selection); });
};

window.intentSelectionCount = function (selection) {
  if (!selection) return 0;
  return window.INTENT_FACETS.reduce(function (n, f) {
    return n + ((selection[f.id] || []).length);
  }, 0);
};

// Faceted counts: for each option, how many articles would match if that option
// were the only choice in its own facet, with every OTHER facet's selection
// still applied. This is what lets a chip dim to zero honestly instead of
// promising results it cannot deliver.
window.intentCounts = function (articles, selection) {
  var out = {};
  window.INTENT_FACETS.forEach(function (facet) {
    var others = {};
    window.INTENT_FACETS.forEach(function (f) {
      if (f.id !== facet.id) others[f.id] = (selection && selection[f.id]) || [];
    });
    var pool = window.filterArticlesByIntent(articles, others);
    out[facet.id] = {};
    facet.options.forEach(function (opt) {
      out[facet.id][opt.id] = pool.filter(function (a) {
        return window.intentFor(a.slug)[facet.id].indexOf(opt.id) !== -1;
      }).length;
    });
  });
  return out;
};

// Loosen a selection until it actually returns entries.
//
// The trip selector derives tags from five answers at once, and the filter bar
// ANDs across facets, so the honest intersection of "backpacking" + "conditions"
// + "before booking" is frequently empty. An empty result would be a correct
// answer to a question the reader did not ask: they asked for the entries that
// fit their trip, not for the entries that carry every tag their trip implies.
// So drop the weakest constraint first (topic, the question, which the reader
// chose least directly), then stage, then keep the traveler alone.
//
// TARGET is deliberately above the five reads the plan already lists: relaxing
// to a set no larger than the plan itself would hand the reader a button that
// shows them nothing new. CEILING is the other end of the same honesty: half
// the archive is not a narrowing, so a candidate that loose is skipped rather
// than presented as "the entries that fit your trip". Stage alone is not on the
// ladder at all — dropping the traveler and keeping only "before booking" throws
// away the reader's strongest signal to buy a bigger number.
window.relaxIntent = function (intent) {
  var TARGET = 6;
  var CEILING = Math.max(TARGET, Math.floor((window.ARTICLES || []).length / 2));
  var candidates = [
    { stage: intent.stage, who: intent.who, topic: intent.topic },
    { stage: intent.stage, who: intent.who, topic: [] },
    { stage: [], who: intent.who, topic: intent.topic },
    { stage: [], who: intent.who, topic: [] },
    { stage: [], who: [], topic: intent.topic },
  ];
  var fallback = null;
  for (var i = 0; i < candidates.length; i++) {
    var n = window.filterArticlesByIntent(window.ARTICLES, candidates[i]).length;
    if (n >= TARGET && n <= CEILING) return candidates[i];
    if (n > 0 && !fallback) fallback = candidates[i];
  }
  return fallback || { stage: [], who: [], topic: [] };
};

// Human-readable list of what is currently selected, for the results line.
window.intentSummary = function (selection) {
  var parts = [];
  window.INTENT_FACETS.forEach(function (facet) {
    (selection[facet.id] || []).forEach(function (id) {
      var opt = facet.options.find(function (o) { return o.id === id; });
      if (opt) parts.push(opt.label);
    });
  });
  return parts;
};

// ---------------------------------------------------------------------------
// The five-question trip selector
// ---------------------------------------------------------------------------

// What each month DECIDES, which is a different job from the homepage's month
// planner (page-home.jsx MONTHS), which describes what each month is like. The
// road states below drive which itinerary the selector is allowed to hand back:
// recommending the three-day plan in January would send a reader up two roads
// that are closed. Sources are the same published pieces the notes link to;
// "unsettled" means the date moves with the snowpack and no fixed claim is made.
window.TRIP_MONTHS = [
  { key: "jan", label: "Jan", name: "January",   tioga: "closed",    glacier: "closed",    read: "yosemite-in-winter",
    note: "Deep winter. The Valley is open and mostly empty, the waterfalls run low, and chains ride in the car." },
  { key: "feb", label: "Feb", name: "February",  tioga: "closed",    glacier: "closed",    read: "horsetail-fall-firefall",
    note: "Firefall month. For about two weeks Horsetail Fall can glow at sunset; the rest of the park is honest winter." },
  { key: "mar", label: "Mar", name: "March",     tioga: "closed",    glacier: "closed",    read: "yosemite-in-winter",
    note: "Late winter, first runoff. Storms still land, the falls start to wake, and the crowds have not arrived." },
  { key: "apr", label: "Apr", name: "April",     tioga: "closed",    glacier: "closed",    read: "yosemite-waterfalls-guide",
    note: "The Valley greens up and the waterfalls build by the week. Tioga Road is still closed most years." },
  { key: "may", label: "May", name: "May",       tioga: "unsettled", glacier: "unsettled", read: "yosemite-waterfalls-guide",
    note: "Peak waterfall month, and the last calmer weeks before summer. The high roads usually begin to open." },
  { key: "jun", label: "Jun", name: "June",      tioga: "open",      glacier: "open",      read: "yosemite-in-june-2026",
    note: "Early summer. Strong falls at the start of the month, the high country opening, school-break crowds building." },
  { key: "jul", label: "Jul", name: "July",      tioga: "open",      glacier: "open",      read: "yosemite-heat-safety-guide",
    note: "Full summer. Every road is typically open, the Valley runs hot and busy, and the big falls thin." },
  { key: "aug", label: "Aug", name: "August",    tioga: "open",      glacier: "open",      read: "yosemite-during-smoke-season",
    note: "High summer. Hot in the Valley, the falls at a trickle, and the darkest skies of the year." },
  { key: "sep", label: "Sep", name: "September", tioga: "open",      glacier: "open",      read: "when-to-visit-yosemite-2026-crowd-forecast",
    note: "The exhale. Crowds ease after Labor Day, the weather usually holds, and the falls are at their lowest." },
  { key: "oct", label: "Oct", name: "October",   tioga: "open",      glacier: "open",      read: "yosemite-photography-spots",
    note: "Fall. Cooler days, color along the Merced, quieter trails, and the first real storms possible late." },
  { key: "nov", label: "Nov", name: "November",  tioga: "closed",    glacier: "unsettled", read: "yosemite-in-winter",
    note: "The shoulder. Short days, empty trails, the first lasting snow most years, and the high roads closing." },
  { key: "dec", label: "Dec", name: "December",  tioga: "closed",    glacier: "closed",    read: "yosemite-in-winter",
    note: "Early winter. Snow when storms land, holiday crowds around the lodges midmonth on, and chains as a rule." },
];

window.tripMonth = function (key) {
  return window.TRIP_MONTHS.find(function (m) { return m.key === key; }) || null;
};

// The five questions. `multi` questions accept more than one answer; every
// question has an honest "not decided yet" option, because a reader who has to
// invent an answer gets a plan built on the invention.
window.TRIP_QUESTIONS = [
  {
    id: "when",
    label: "When are you visiting?",
    hint: "Pick the month. It decides which roads are open, which is most of the plan.",
    multi: false,
    options: window.TRIP_MONTHS.map(function (m) { return { id: m.key, label: m.label, note: m.name }; })
      .concat([{ id: "unsure", label: "Not sure", note: "Still choosing dates" }]),
  },
  {
    id: "days",
    label: "How many days?",
    hint: "Days in the park, not counting the drive.",
    multi: false,
    options: [
      { id: "half", label: "Half a day" },
      { id: "1", label: "One day" },
      { id: "2", label: "Two days" },
      { id: "3", label: "Three days" },
      { id: "4plus", label: "Four or more" },
    ],
  },
  {
    id: "stay",
    label: "Where are you staying?",
    hint: "In-park beds and gateway rooms book on completely different clocks.",
    multi: false,
    // `sum` is the phrasing the read-back sentence uses; the chip label has to
    // be short and the sentence has to be a sentence.
    options: [
      { id: "lodge", label: "A hotel or cabin in the park", sum: "in a hotel or cabin in the park" },
      { id: "camp", label: "Camping", sum: "camping" },
      { id: "gateway", label: "A gateway town", sum: "based in a gateway town" },
      { id: "daytrip", label: "Day trip, not staying", sum: "as a day trip" },
      { id: "undecided", label: "Not booked yet", sum: "with nothing booked yet" },
    ],
  },
  {
    id: "party",
    label: "Who is traveling?",
    hint: "Pick every one that applies.",
    multi: true,
    options: [
      { id: "first-trip", label: "First trip", sum: "on a first trip" },
      { id: "families", label: "Families", sum: "with kids" },
      { id: "non-hikers", label: "Non-hikers", sum: "with non-hikers" },
      { id: "accessible", label: "Accessible travel", sum: "with access needs" },
      { id: "dogs", label: "Dogs", sum: "with a dog" },
      { id: "backpacking", label: "Backpacking", sum: "with a night in the wilderness" },
      { id: "photography", label: "Photography", sum: "with a camera" },
      { id: "just-us", label: "Just adults, no constraints", sum: "" },
    ],
  },
  {
    id: "focus",
    label: "What matters most?",
    hint: "One thing. A trip built around everything is built around nothing.",
    multi: false,
    options: [
      { id: "waterfalls", label: "Waterfalls" },
      { id: "views", label: "Big views, not big hikes" },
      { id: "hike", label: "One serious hike" },
      { id: "photos", label: "Photography" },
      { id: "crowds", label: "Avoiding the crowds" },
      { id: "budget", label: "Keeping it cheap" },
      { id: "wildlife", label: "Wildlife and natural history" },
    ],
  },
];

// Answer -> (intent tags, anchor articles). Anchors are the pieces that answer
// the question directly and outrank tag overlap in the scoring below; tags are
// what widen the list past them and what the "see everything that matches"
// hand-off pours into the filters.
var TRIP_RULES = {
  days: {
    half:  { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "1":   { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "2":   { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "3":   { intent: { stage: ["dates-set"], topic: ["trails"] }, anchors: [] },
    "4plus": { intent: { stage: ["dates-set"], topic: ["trails"] }, anchors: [] },
  },
  stay: {
    lodge:     { intent: { stage: ["before-booking"], topic: ["lodging"] }, anchors: ["where-to-stay-in-yosemite"] },
    camp:      { intent: { stage: ["before-booking"], topic: ["camping"] }, anchors: ["yosemite-camping-complete-guide"] },
    gateway:   { intent: { stage: ["before-booking"], topic: ["lodging"] }, anchors: ["yosemite-gateway-towns-compared"] },
    daytrip:   { intent: { topic: ["transportation"] }, anchors: ["getting-to-yosemite"] },
    undecided: { intent: { stage: ["before-booking"], topic: ["lodging"] }, anchors: ["first-time-yosemite-overwhelm", "where-to-stay-in-yosemite"] },
  },
  party: {
    "first-trip":  { intent: { who: ["first-trip"] }, anchors: ["first-time-yosemite-overwhelm"] },
    families:      { intent: { who: ["families"] }, anchors: ["yosemite-with-kids-no-reservations-2026"] },
    "non-hikers":  { intent: { who: ["non-hikers"] }, anchors: ["yosemite-for-non-hikers"] },
    accessible:    { intent: { who: ["accessible"] }, anchors: ["yosemite-accessibility-guide"] },
    dogs:          { intent: { who: ["dogs"] }, anchors: ["pets-in-yosemite"] },
    backpacking:   { intent: { who: ["backpacking"] }, anchors: ["yosemite-wilderness-permits-guide"] },
    photography:   { intent: { who: ["photography"] }, anchors: ["yosemite-photography-spots"] },
    "just-us":     { intent: {}, anchors: [] },
  },
  focus: {
    waterfalls: { intent: { topic: ["trails", "conditions"] }, anchors: ["yosemite-waterfalls-guide"] },
    views:      { intent: { who: ["non-hikers"] }, anchors: ["yosemite-for-non-hikers"] },
    hike:       { intent: { topic: ["trails"] }, anchors: ["four-mile-up-panorama-down", "so-you-want-to-hike-half-dome"] },
    photos:     { intent: { who: ["photography"] }, anchors: ["yosemite-photography-spots"] },
    crowds:     { intent: { topic: ["conditions"] }, anchors: ["when-to-visit-yosemite-2026-crowd-forecast"] },
    budget:     { intent: { topic: ["lodging", "food"] }, anchors: ["yosemite-trip-cost-budget-2026"] },
    wildlife:   { intent: {}, anchors: ["yosemite-wildlife-viewing-guide"] },
  },
};

function intentPush(list, value) {
  if (value && list.indexOf(value) === -1) list.push(value);
}

function intentApplyRule(acc, rule) {
  if (!rule) return;
  ["stage", "who", "topic"].forEach(function (facet) {
    ((rule.intent && rule.intent[facet]) || []).forEach(function (id) { intentPush(acc.intent[facet], id); });
  });
  (rule.anchors || []).forEach(function (slug) { intentPush(acc.anchors, slug); });
}

// Which curated itinerary a trip of this length can actually run in this month.
// Day two of the two-day plan is Glacier Point Road and day three of the
// three-day plan is Tioga Road, so a winter answer gets capped and TOLD it was
// capped rather than handed a plan over closed roads.
window.itineraryForTrip = function (days, monthKey) {
  var wanted = days === "half" ? "halfday"
    : days === "1" ? "1day"
    : days === "2" ? "2day"
    : "3day";
  var month = window.tripMonth(monthKey);
  var order = ["halfday", "1day", "2day", "3day"];
  var cap = "3day";
  var note = "";

  if (month) {
    if (month.glacier === "closed") {
      cap = "1day";
      note = "Glacier Point Road and Tioga Road are normally closed in " + month.name + ", so this is a Valley trip. More days means more Valley, not more roads.";
    } else if (month.tioga === "closed") {
      cap = "2day";
      note = "Tioga Road is normally closed in " + month.name + ". The Valley and Glacier Point Road carry the trip.";
    } else if (month.tioga === "unsettled" || month.glacier === "unsettled") {
      note = "The high roads open and close on dates that move with the snowpack. Check the road status before you count on day two or three.";
    }
  } else {
    note = "Without a month this assumes every road is open. Tioga Road and Glacier Point Road are closed for a good part of the year, and that changes the plan more than anything else you choose.";
  }

  var id = order.indexOf(wanted) > order.indexOf(cap) ? cap : wanted;
  var capped = id !== wanted;
  if (days === "4plus" && id === "3day") {
    note = (note ? note + " " : "") + "A fourth day is yours to build: open this on the map and add to it.";
  }
  return { id: id, capped: capped, note: note };
};

// Which paid product this plan actually calls for. The Field Guide is the
// default because it is the in-park half of everything above; the consult is
// for plans with real constraints, which is exactly what /consult says it is
// for. Never both as primary.
function intentProductForTrip(answers) {
  var party = answers.party || [];
  // A short trip or a trip built around spending less is never a case for the
  // more expensive product, whatever else the answers say. Recommending a paid
  // consult to someone who just told you the priority is keeping it cheap is
  // the kind of upsell this site does not do.
  if (answers.days === "half" || answers.days === "1" || answers.focus === "budget") {
    return intentGuideProduct();
  }
  var longTrip = answers.days === "4plus";
  var accessible = party.indexOf("accessible") !== -1;
  var unbookedPeak = answers.stay === "undecided" &&
    ["jun", "jul", "aug", "sep", "unsure"].indexOf(answers.when) !== -1;

  if (longTrip || accessible || unbookedPeak) {
    return {
      key: "consult",
      route: "consult",
      title: "A trip consult",
      body: accessible
        ? "Access questions are the ones where a wrong turnout costs the whole day, and the answers are specific to your group. A consult is thirty minutes with a naturalist who lives here, or the same session as a written plan."
        : longTrip
          ? "Four days is long enough that the order of the days matters more than any single choice in it. A consult turns dates, group, and constraints into a plan built for the week you are actually coming."
          : "Unbooked dates in the busy months are the case where a plan is worth paying for: what is left, what to take, and what to give up. Thirty minutes by call, or the same session written out.",
      cta: "See what a consult covers",
      secondary: { route: "guide", label: "The Field Guide app carries the plan into the park →" },
    };
  }
  return intentGuideProduct();
}

function intentGuideProduct() {
  return {
    key: "guide",
    route: "guide",
    title: "The Field Guide app",
    body: "The reading above is the planning. The Field Guide is the trip: stops with parking and timing notes, offline maps, a day-by-day planner, and the secret guide. It works with no signal, which is most of the park.",
    cta: "See what is in the Field Guide",
    secondary: { route: "checklist", label: "Free: the first-week planning checklist →" },
  };
}

// Build the plan. Deterministic: same answers in, same plan out.
window.buildTripPlan = function (answers) {
  if (!answers) return null;
  var acc = { intent: { stage: [], who: [], topic: [] }, anchors: [] };
  var month = window.tripMonth(answers.when);

  if (month) {
    intentPush(acc.anchors, month.read);
    intentPush(acc.intent.topic, "conditions");
  } else if (answers.when === "unsure") {
    intentPush(acc.anchors, "when-to-visit-yosemite-2026-crowd-forecast");
    intentPush(acc.intent.stage, "before-booking");
    intentPush(acc.intent.topic, "conditions");
  }

  intentApplyRule(acc, TRIP_RULES.days[answers.days]);
  intentApplyRule(acc, TRIP_RULES.stay[answers.stay]);
  (answers.party || []).forEach(function (id) { intentApplyRule(acc, TRIP_RULES.party[id]); });
  intentApplyRule(acc, TRIP_RULES.focus[answers.focus]);

  // Score: an anchor is worth more than any amount of tag overlap, so the piece
  // that answers the question directly cannot be crowded out by a piece that
  // merely shares three tags. Ties break on catalog order (newest first).
  //
  // The one subtraction: a `who` tag the reader did NOT pick counts against the
  // article, because a piece carrying three traveler types and matching one is
  // written mostly for somebody else. Without it, breadth wins the residual
  // slots and the widest-tagged articles turn up on every plan, which is the
  // archive problem this tool exists to end. Anchors sit far enough above the
  // tag range that no penalty can drop one out of the list.
  var scored = (window.ARTICLES || []).map(function (a, i) {
    var tags = window.intentFor(a.slug);
    var score = acc.anchors.indexOf(a.slug) !== -1 ? 100 - acc.anchors.indexOf(a.slug) : 0;
    ["stage", "who", "topic"].forEach(function (facet) {
      acc.intent[facet].forEach(function (id) {
        if (tags[facet].indexOf(id) !== -1) score += facet === "topic" ? 2 : 1;
      });
    });
    if (acc.intent.who.length) {
      score -= tags.who.filter(function (id) { return acc.intent.who.indexOf(id) === -1; }).length;
    }
    return { article: a, score: score, order: i };
  }).filter(function (s) {
    return s.score > 0 && window.articleFitsMonth(s.article.slug, answers.when);
  });

  scored.sort(function (x, y) { return y.score - x.score || x.order - y.order; });
  var reads = scored.slice(0, 5).map(function (s) { return s.article; });

  var itinerary = window.itineraryForTrip(answers.days, answers.when);

  // Condition notes: only what the month or the answers actually determine.
  var notes = [];
  if (month) notes.push(month.name + ". " + month.note);
  if (itinerary.note) notes.push(itinerary.note);
  if (answers.stay === "undecided") {
    notes.push("Nothing is booked, which makes lodging the deadline. In-park beds open 366 days ahead and gateway rooms fill months out for summer dates; everything else in a Yosemite plan flexes.");
  }
  if (["jul", "aug"].indexOf(answers.when) !== -1) {
    notes.push("July and August are the most crowded months in the park. Early starts are the whole strategy.");
  }

  // Lodging hand-off: only when the answers say the bed is not settled. A
  // reader who chose in-park lodging, camping, or a day trip has no use for a
  // hotel search, and putting one in front of them anyway is the kind of
  // placement the /affiliate guardrail exists to prevent. The destination is
  // always the park-area search, never a property: the selector never asks
  // which town, and /stay carries the town-by-town comparison. Rendered by
  // intent.jsx through the shared LodgingCta, aff_list "trip_selector".
  var lodging = null;
  if (answers.stay === "undecided") {
    lodging = {
      destination: "Yosemite National Park",
      heading: "The deadline in this plan",
      note: "Before the reading list, the bed. One availability search around the park shows what your dates still hold, and the answer decides which of the articles above matter.",
      cta: "Search lodging around Yosemite →",
    };
  } else if (answers.stay === "gateway") {
    lodging = {
      destination: "Yosemite National Park",
      heading: "The room still to book",
      note: "The gateway towns are not interchangeable: the wrong one costs an hour each way, every day. The comparison below the search covers all five.",
      cta: "Search lodging around Yosemite →",
    };
  }

  return {
    summary: window.tripSummary(answers),
    notes: notes,
    intent: window.relaxIntent(acc.intent),
    reads: reads,
    itinerary: itinerary,
    lodging: lodging,
    product: intentProductForTrip(answers),
  };
};

// One-sentence read-back of the answers, so the reader can see what the plan
// was built from before trusting it.
window.tripSummary = function (answers) {
  var q = function (id) { return window.TRIP_QUESTIONS.find(function (x) { return x.id === id; }); };
  var phrase = function (id, value) {
    var opt = q(id).options.find(function (o) { return o.id === value; });
    if (!opt) return "";
    return (opt.sum === undefined ? opt.label.toLowerCase() : opt.sum);
  };
  var month = window.tripMonth(answers.when);
  var days = phrase("days", answers.days);
  var when = month ? " in " + month.name : answers.when === "unsure" ? ", dates not set" : "";
  var stay = answers.stay ? ", " + phrase("stay", answers.stay) : "";
  var party = (answers.party || []).map(function (p) { return phrase("party", p); })
    .filter(Boolean);
  var who = party.length ? ", " + party.join(" and ") : "";
  var focus = answers.focus ? ", built around " + phrase("focus", answers.focus) : "";
  return (days.charAt(0).toUpperCase() + days.slice(1)) + when + stay + who + focus + ".";
};

// True once every question has an answer. The plan is not shown before this:
// a plan built from two answers is a guess wearing a plan's clothes.
window.tripAnswersComplete = function (answers) {
  if (!answers) return false;
  return window.TRIP_QUESTIONS.every(function (q) {
    var v = answers[q.id];
    return q.multi ? Array.isArray(v) && v.length > 0 : Boolean(v);
  });
};
