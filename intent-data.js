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
//     put them in front of a reader who asked about permits. A blank is not a
//     hole in the catalog either: "Why giant sequoias thrive where other trees
//     burn" tells you what to look at in the Mariposa Grove, not which trail to
//     walk, where to park, or how long it takes, so its `topic` stays empty. The
//     thing missing there is a grove logistics article, not a `trails` tag on an
//     essay about bark. Fix the catalog, never the tag.
//   - An article with no tag in ANY facet is unreachable by every filter, which
//     is a different thing from an empty facet. If that is deliberate, declare
//     it in window.INTENT_NO_TAGS below with the reason.
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
  // The three arrival-logistics pieces carry an empty `who` on purpose. Parking,
  // the buses, and what is still available today are questions every traveler
  // type asks in the same words, so tagging them with a subset would both cost
  // them a point per unpicked tag and, worse, trip the "written for somebody
  // else" exclusion for the traveler types left off the list.
  // The three destination-day guides. Unlike the arrival-logistics trio above,
  // these do carry a `who`: each is written against a specific reader the
  // catalog was not serving. The grove and the meadows are the two places in
  // this park a non-hiker gets the full experience on a paved or flat walk, and
  // the river afternoon is the one Valley day that is built for small children.
  // Leaving `who` empty here would keep them out of exactly the filters they
  // were commissioned to answer.
  "mariposa-grove-how-to-visit":               { stage: ["dates-set", "week-before", "in-park"], who: ["families", "non-hikers", "accessible"], topic: ["transportation", "trails"] },
  "tuolumne-meadows-in-a-day":                 { stage: ["before-booking", "dates-set", "week-before", "in-park"], who: ["families", "non-hikers", "photography"], topic: ["transportation", "trails", "conditions"] },
  "swimming-in-the-merced":                    { stage: ["dates-set", "week-before", "in-park"], who: ["families", "non-hikers"], topic: ["conditions"] },

  // The August 2026 gap-filling trio. Each was commissioned against an
  // intersection the catalog answered thinly or not at all, so the tags below
  // are the point of the articles rather than an afterthought:
  //
  //   first-trip x camping had exactly one entry, the thirteen-campground
  //   reference, which is the wrong shape for somebody who has never slept in a
  //   campground and does not yet know what one is. The orientation piece is
  //   tagged `first-trip` for that reason. It also carries `families` because
  //   the content that is not about the reservation is about managing a group:
  //   the six-person and two-vehicle caps, a headlamp per person, and the oak
  //   limbs over the patch of dirt where a carrier would go.
  //
  //   backpacking x conditions had none at all. The permits guide answers the
  //   system; nothing answered the snow, the ford, or the week the mosquitoes
  //   reach the meadow. `conditions` is the tag the piece exists for.
  //
  //   The day-trip piece carries an EMPTY `who` deliberately, on the same
  //   principle as the arrival-logistics trio above: how long the drive really
  //   takes and when the Valley lots fill is a question every traveler type asks
  //   in identical words, and naming a subset would trip the written-for-
  //   somebody-else exclusion for everyone left off. It is also a second anchor
  //   on TRIP_RULES.stay.daytrip, which until now pointed only at the entrances
  //   piece.
  "camping-in-yosemite-first-time":            { stage: ["before-booking", "dates-set", "week-before"], who: ["first-trip", "families"], topic: ["camping"] },
  "first-yosemite-backpacking-trip":           { stage: ["dates-set", "week-before"], who: ["backpacking"], topic: ["conditions", "trails", "permits"] },
  "yosemite-day-trip-from-bay-area":           { stage: ["before-booking", "dates-set", "week-before"], who: [], topic: ["transportation", "conditions"] },

  // The August 2026 selector-gap pair. A sweep of all 18,200 trip-selector
  // combinations found the two largest structural holes, and each of these was
  // commissioned against one of them:
  //
  //   days=3 and days=4plus carried NO anchor at all (the days ladder stopped at
  //   "yosemite-in-one-or-two-days"), so 40% of every plan built had no piece
  //   answering "how do I structure this trip". The three-to-five-days piece is
  //   that anchor now. Its `who` is EMPTY deliberately, on the arrival-logistics
  //   principle above: how to order three days is a question every traveler type
  //   asks in identical words, and naming a subset would trip the written-for-
  //   somebody-else exclusion for everyone left off.
  //
  //   focus=hike anchors on Four Mile/Panorama (windowed May-Nov) and Half Dome
  //   (May-Oct), so from December through April BOTH anchors were dropped by the
  //   seasonal filter and a winter "one serious hike" plan was padded with
  //   whatever tag overlap remained (a March hike-focused plan was reading
  //   "Bringing a Dog to Yosemite"). The winter-hikes piece is windowed Nov-Apr
  //   in ARTICLE_MONTHS and rides third in that anchor list, so it surfaces
  //   exactly when the other two leave. Empty `who` like the other trail
  //   pieces; `conditions` is earned, ice and closures being half the article.
  "yosemite-in-three-to-five-days":            { stage: ["before-booking", "dates-set"], who: [], topic: ["trails", "transportation"] },
  "yosemite-winter-hikes":                     { stage: ["dates-set", "in-park"], who: [], topic: ["trails", "conditions"] },
  "yosemite-valley-parking-guide":             { stage: ["dates-set", "week-before", "in-park"], who: [], topic: ["transportation"] },
  "yosemite-shuttle-and-yarts":                { stage: ["before-booking", "dates-set", "week-before", "in-park"], who: [], topic: ["transportation"] },
  "yosemite-walk-up-and-day-of-permits":       { stage: ["dates-set", "week-before", "in-park"], who: [], topic: ["permits", "camping"] },
  "yosemite-in-fall":                          { stage: ["before-booking", "dates-set"], who: ["first-trip", "photography"], topic: ["conditions", "transportation"] },
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
  "is-bear-spray-allowed-in-yosemite":          { stage: ["dates-set", "in-park"], who: [], topic: ["conditions"] },
  "yosemite-bears-safety-guide":               { stage: ["week-before", "in-park"], who: ["families", "backpacking"], topic: ["camping", "food"] },
  "yosemite-heat-safety-guide":                { stage: ["week-before", "in-park"], who: ["families", "first-trip"], topic: ["conditions", "trails"] },
  "when-to-visit-yosemite-2026-crowd-forecast":{ stage: ["before-booking"], who: ["first-trip"], topic: ["conditions"] },
  "yosemite-trip-cost-budget-2026":            { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "camping", "food", "transportation"] },
  "yosemite-in-september-2026":                 { stage: ["before-booking", "dates-set"], who: [], topic: ["conditions"] },
  "yosemite-in-june-2026":                     { stage: ["before-booking", "dates-set"], who: [], topic: ["conditions"] },
  // Month guide like the June piece: an empty `who` on purpose, because "what is
  // March like" is a question every traveler type asks in the same words.
  // `transportation` is earned, not decorative: chains, the 140 approach, and
  // the closed-road inventory are half the article.
  "yosemite-in-march":                         { stage: ["before-booking", "dates-set"], who: [], topic: ["conditions", "transportation"] },
  "cathedral-lakes-day-hike":                  { stage: ["dates-set", "in-park"], who: [], topic: ["trails"] },
  "yosemite-needs-a-reservation-system":       { stage: ["before-booking"], who: [], topic: ["conditions"] },
  "memorial-day-skip-the-valley-go-high-2026": { stage: ["dates-set", "week-before"], who: [], topic: ["conditions", "trails"] },
  "where-to-eat-yosemite":                     { stage: ["dates-set", "week-before", "in-park"], who: ["families"], topic: ["food"] },
  "yosemite-in-one-or-two-days":               { stage: ["before-booking", "dates-set"], who: ["first-trip", "non-hikers"], topic: ["trails", "transportation"] },
  "four-mile-up-panorama-down":                { stage: ["dates-set", "in-park"], who: [], topic: ["trails"] },
  "yosemite-with-kids-no-reservations-2026":   { stage: ["before-booking", "dates-set"], who: ["families", "first-trip"], topic: ["lodging", "trails", "food"] },
  "tioga-road-opening-weekend-2026":           { stage: ["dates-set", "week-before"], who: [], topic: ["conditions", "transportation", "trails"] },
  "so-you-want-to-hike-half-dome":             { stage: ["before-booking", "dates-set"], who: ["backpacking"], topic: ["permits", "trails"] },
  "glacier-point-road-open-2026":              { stage: ["dates-set", "week-before"], who: ["non-hikers", "accessible"], topic: ["conditions", "transportation", "trails"] },
  "mist-trail-the-real-guide":                 { stage: ["dates-set", "in-park"], who: ["first-trip", "families"], topic: ["trails"] },
  "working-in-yosemite":                       { stage: [], who: [], topic: [] },
  "water-ouzels-waterfalls":                   { stage: ["in-park"], who: [], topic: [] },
  "bears-spring-emergence":                    { stage: ["week-before", "in-park"], who: ["families"], topic: ["camping"] },
  "what-is-a-talus-field":                      { stage: ["in-park"], who: [], topic: [] },
  "yosemite-glaciers-climate":                 { stage: ["in-park"], who: [], topic: [] },
  "giant-sequoias-fire-adaptation":            { stage: ["in-park"], who: ["families", "non-hikers"], topic: [] },
  "hetch-hetchy-the-other-yosemite-valley":    { stage: ["dates-set", "in-park"], who: ["non-hikers"], topic: ["trails"] },
  "yosemite-stargazing-where-to-look-up":      { stage: ["dates-set", "in-park"], who: ["photography", "non-hikers", "families"], topic: [] },
  "yosemite-for-non-hikers":                   { stage: ["before-booking", "dates-set", "in-park"], who: ["non-hikers", "accessible", "families"], topic: ["trails"] },
  "pack-your-car-for-yosemite":                { stage: ["week-before"], who: ["families", "dogs"], topic: ["food", "camping"] },
  "yosemite-gateway-towns-compared":           { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "transportation", "food"] },
  "yosemite-during-smoke-season":              { stage: ["before-booking", "dates-set", "week-before"], who: [], topic: ["conditions"] },
  // Whether you can build a fire, not whether the air is smoky: a different
  // question from the smoke-season piece above, answered for every traveler
  // type the same way, so `who` stays empty on the same principle.
  "yosemite-fire-restrictions-explained":      { stage: ["week-before", "in-park"], who: [], topic: ["camping", "conditions"] },
  "yosemite-without-reservations-2026":        { stage: ["before-booking"], who: ["first-trip"], topic: ["permits", "transportation", "conditions"] },
  "first-time-yosemite-overwhelm":             { stage: ["before-booking"], who: ["first-trip", "families"], topic: ["lodging", "transportation"] },
};

// The articles that carry NO tag in any facet on purpose, and why.
//
// An article with an empty table entry is invisible to every filter, which reads
// to a visitor as "the site has nothing on that". That is why check-intent-tags
// warns on one. But the warning only works if it means something: a standing
// warning that is always there is a warning nobody reads, and the next article
// added without tags disappears into it. So a deliberate blank is declared here
// with its reason, the check treats a declared blank as intentional, and an
// undeclared one still warns. A stale entry (an article here that later grew
// tags, or that left the catalog) is an error, so this cannot rot quietly.
//
// This is only for an article with no tag ANYWHERE. An empty single facet needs
// no declaration; it is the normal case for the natural-history essays.
window.INTENT_NO_TAGS = {
  "working-in-yosemite":
    "Written for someone weighing a season of work here, not for someone planning a trip: " +
    "the questions it answers are about the job, the tent cabin and the hour's drive to a " +
    "grocery store. No trip stage, traveler or logistics question fits it, and inventing one " +
    "would put it in front of a reader who asked about permits.",
};

// The articles that only apply to part of the year. Everything else is
// month-agnostic and is left out of this table.
//
// This is not a filter facet: a reader never asks for "articles about February".
// It exists because the trip selector knows the month, and a February plan that
// recommends "Yosemite in June" reads as a tool that was not listening. Each
// month's TRIP_MONTHS.read must appear in its own month's window, or the anchor
// this table is protecting would be dropped by it — check-intent-tags.mjs
// enforces exactly that.
//
// The month is the reader's VISIT month, never the month they are reading in.
// The Half Dome lottery pieces are the clearest case: the preseason lottery runs
// in March, but a March visitor cannot hike the cables, so those entries are
// windowed to the cable season and not to the application season.
//
// Two kinds of entry, and both need a source:
//
//   Road-dependent — the article is about something you reach over Tioga Road or
//   Glacier Point Road. The window is every month TRIP_MONTHS does not mark that
//   road `closed`, so an `unsettled` month is still shown (the reader needs to
//   know the thing exists and might be reachable; TRIP_MONTHS' own note says the
//   date moves with the snowpack).
//
//   Season-dependent — a bloom, a run of programs, a cable season. The window
//   comes from the article's own published body, the same rule seo-data.json
//   follows. Do not widen or narrow one from memory: if the body does not state
//   a window, the entry does not belong in this table.
window.ARTICLE_MONTHS = {
  // Seasonal essays and month guides.
  "yosemite-in-fall": ["sep", "oct", "nov"],
  "yosemite-in-september-2026": ["sep"],
  "yosemite-in-june-2026": ["jun"],
  "yosemite-in-march": ["mar"],
  "horsetail-fall-firefall": ["feb"],
  "memorial-day-skip-the-valley-go-high-2026": ["may"],
  "tioga-road-opening-weekend-2026": ["may", "jun"],
  "glacier-point-road-open-2026": ["may", "jun"],
  "yosemite-in-winter": ["nov", "dec", "jan", "feb", "mar"],
  "yosemite-heat-safety-guide": ["jun", "jul", "aug", "sep"],
  "yosemite-during-smoke-season": ["jul", "aug", "sep", "oct"],
  "yosemite-fire-restrictions-explained": ["jul", "aug", "sep", "oct"],
  "bears-spring-emergence": ["mar", "apr", "may", "jun"],

  // "The swimming season runs from about mid-July into September, and in June
  // the answer is almost always not yet." June is inside the window on purpose:
  // a June visitor is exactly the reader this piece is written to stop, and the
  // article's whole first section is addressed to them.
  "swimming-in-the-merced": ["jun", "jul", "aug", "sep"],

  // Road-dependent. Tioga Road is `closed` Nov-Apr in TRIP_MONTHS; Glacier Point
  // Road is `closed` Dec-Apr.
  // Tuolumne Meadows is reachable only over Tioga Road: "Tioga Road opened on
  // May 15 this year, unusually early, and it is open now."
  "tuolumne-meadows-in-a-day": ["may", "jun", "jul", "aug", "sep", "oct"],
  // "Tioga Road has to be open, which means you're working with a window that
  // runs roughly late May or early June through October or early November."
  "cathedral-lakes-day-hike": ["may", "jun", "jul", "aug", "sep", "oct"],
  // The loop only closes when Glacier Point Road is open: "When the road is
  // closed, you can still hike the Four Mile Trail to Glacier Point and back. It
  // becomes an out-and-back instead of a loop."
  "four-mile-up-panorama-down": ["may", "jun", "jul", "aug", "sep", "oct", "nov"],

  // Season-dependent, each window quoted from the article's own body.
  // "The cables typically go up the Friday before Memorial Day and come down the
  // day after Columbus Day." Both Half Dome pieces are about the cable season.
  "so-you-want-to-hike-half-dome": ["may", "jun", "jul", "aug", "sep", "oct"],
  // "Between mid-April and late June, the granite staircase below Vernal Fall is
  // a waterfall itself", through "Late season (August through October)".
  "mist-trail-the-real-guide": ["apr", "may", "jun", "jul", "aug", "sep", "oct"],
  // "There is a bloom happening somewhere in or near the park from March through
  // August", plus the body's own "February to April: the foothills" section.
  "yosemite-wildflowers-guide": ["feb", "mar", "apr", "may", "jun", "jul", "aug"],
  // "The bloom runs from roughly late June through July on the Valley floor."
  "showy-milkweed-yosemite-valley": ["jun", "jul"],
  // The Connecting to Traditions schedule runs July 17 through October 15.
  "yosemite-connecting-to-traditions": ["jul", "aug", "sep", "oct"],
  // "The reliable spectating windows are roughly April through early June and
  // September through October." Midsummer bakes and winter is hazardous.
  "watching-climbers-el-capitan": ["apr", "may", "jun", "sep", "oct"],
  // "The season this article describes runs from the first lasting snow,
  // usually late November, into April". April is inside the window on purpose:
  // the body's own closing section says the floor turns spring from below while
  // the Mist Trail stair and the high trails shed their closures, and an April
  // visitor still needs the closed list. The Four Mile Trail's "gated into May"
  // is the outlier the body names, not the window.
  "yosemite-winter-hikes": ["nov", "dec", "jan", "feb", "mar", "apr"],
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

window.EMPTY_INTENT = { stage: [], who: [], topic: [], month: "" };

// A selection may carry a `month` alongside the three facets. It is NOT a facet
// (there are no month chips, and a reader never asks for "articles about
// February"); it is the trip selector's `when` answer riding along with the
// selection it hands off, so the seasonal exclusion that already governs the
// five reads governs the rest of the list too.
//
// Without this the hand-off leaked: buildTripPlan dropped out-of-season entries
// from `reads`, but "Show all 18 entries that fit this trip" ran the derived
// intent through the unfiltered catalog, so a July trip was offered "Yosemite in
// Winter", "Yosemite in Fall" and the Glacier Point opening-weekend piece under
// a heading promising entries that fit July.
window.intentMonthOf = function (selection) {
  var key = selection && selection.month;
  if (!key || key === "unsure") return "";
  return window.tripMonth(key) ? key : "";
};

window.intentMonthLabel = function (key) {
  var m = window.tripMonth(key);
  return m ? m.name : "";
};

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
// the selection places no constraint. A `month` is ANDed on top of all three:
// an entry the season rules out does not fit the trip, whatever its tags say.
window.matchesIntent = function (article, selection) {
  if (!selection) return true;
  var month = window.intentMonthOf(selection);
  if (month && !window.articleFitsMonth(article.slug, month)) return false;
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

// How many constraints are live. The month counts as one, because it narrows the
// list exactly as a chip does and the reader has to be able to see that it is on
// before they can decide to take it off.
window.intentSelectionCount = function (selection) {
  if (!selection) return 0;
  return window.INTENT_FACETS.reduce(function (n, f) {
    return n + ((selection[f.id] || []).length);
  }, window.intentMonthOf(selection) ? 1 : 0);
};

// Faceted counts: for each option, how many articles would match if that option
// were the only choice in its own facet, with every OTHER facet's selection
// still applied. This is what lets a chip dim to zero honestly instead of
// promising results it cannot deliver.
//
// The month stays applied in every pool. It is not one of the facets being held
// out: a chip that counted out-of-season entries would promise a number the
// results grid then refuses to show.
window.intentCounts = function (articles, selection) {
  var out = {};
  window.INTENT_FACETS.forEach(function (facet) {
    var others = { month: (selection && selection.month) || "" };
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
//
// The month is NOT on the ladder either, and for a stronger reason: every rung
// carries it. It is the one answer the reader gave that the park itself enforces,
// so relaxing it would trade a correct list for a bigger one. Both counts are
// taken against the in-season pool, so TARGET and CEILING measure the archive the
// reader can actually use in that month rather than the whole catalog.
window.relaxIntent = function (intent, monthKey) {
  var month = window.intentMonthOf({ month: monthKey });
  var pool = (window.ARTICLES || []).filter(function (a) {
    return !month || window.articleFitsMonth(a.slug, month);
  });
  var TARGET = 6;
  var CEILING = Math.max(TARGET, Math.floor(pool.length / 2));
  var candidates = [
    { stage: intent.stage, who: intent.who, topic: intent.topic, month: month },
    { stage: intent.stage, who: intent.who, topic: [], month: month },
    { stage: [], who: intent.who, topic: intent.topic, month: month },
    { stage: [], who: intent.who, topic: [], month: month },
    { stage: [], who: [], topic: intent.topic, month: month },
  ];
  var fallback = null;
  for (var i = 0; i < candidates.length; i++) {
    var n = window.filterArticlesByIntent(pool, candidates[i]).length;
    if (n >= TARGET && n <= CEILING) return candidates[i];
    // The fallback honors CEILING too: a rung matching more than half the
    // in-season archive must not be presented as "the entries that fit your
    // trip" just because no rung landed in the band. If nothing fits under
    // the ceiling, the all-empty return below shows the whole in-season list
    // as what it is, a browse, not a match.
    if (n > 0 && n <= CEILING && !fallback) fallback = candidates[i];
  }
  return fallback || { stage: [], who: [], topic: [], month: month };
};

// Human-readable list of what is currently selected, for the results line.
window.intentSummary = function (selection) {
  var parts = [];
  var month = window.intentMonthOf(selection);
  if (month) parts.push(window.intentMonthLabel(month));
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

// What each month DECIDES. (The homepage's month planner, whose MONTHS table
// described what each month is *like*, was retired in the August 2026
// redesign — this is now the editorial site's only month table.) The
// road states below drive which itinerary the selector is allowed to hand back:
// recommending the three-day plan in January would send a reader up two roads
// that are closed. Sources are the same published pieces the notes link to;
// "unsettled" means the date moves with the snowpack and no fixed claim is made.
window.TRIP_MONTHS = [
  { key: "jan", label: "Jan", name: "January",   tioga: "closed",    glacier: "closed",    read: "yosemite-in-winter",
    note: "Deep winter. The Valley is open and mostly empty, the waterfalls run low, and chains ride in the car." },
  { key: "feb", label: "Feb", name: "February",  tioga: "closed",    glacier: "closed",    read: "horsetail-fall-firefall",
    note: "Firefall month. For about two weeks Horsetail Fall can glow at sunset; the rest of the park is honest winter." },
  { key: "mar", label: "Mar", name: "March",     tioga: "closed",    glacier: "closed",    read: "yosemite-in-march",
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
  { key: "sep", label: "Sep", name: "September", tioga: "open",      glacier: "open",      read: "yosemite-in-september-2026",
    note: "The exhale. Crowds ease after Labor Day, the weather usually holds, and the falls are at their lowest." },
  { key: "oct", label: "Oct", name: "October",   tioga: "open",      glacier: "open",      read: "yosemite-in-fall",
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
  // Every days answer now has an anchor. The short lengths anchor the one-or-
  // two-day piece; three and four-plus anchored NOTHING until August 2026, which
  // meant 40% of all selector combinations produced a plan with no piece that
  // answered the length the reader chose. The three-to-five-days piece is
  // month-agnostic on purpose (its winter section compresses the plan honestly),
  // so this anchor survives the seasonal filter in every month.
  days: {
    half:  { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "1":   { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "2":   { intent: { stage: ["dates-set"] }, anchors: ["yosemite-in-one-or-two-days"] },
    "3":   { intent: { stage: ["dates-set"], topic: ["trails"] }, anchors: ["yosemite-in-three-to-five-days"] },
    "4plus": { intent: { stage: ["dates-set"], topic: ["trails"] }, anchors: ["yosemite-in-three-to-five-days"] },
  },
  stay: {
    lodge:     { intent: { stage: ["before-booking"], topic: ["lodging"] }, anchors: ["where-to-stay-in-yosemite"] },
    camp:      { intent: { stage: ["before-booking"], topic: ["camping"] }, anchors: ["yosemite-camping-complete-guide"] },
    gateway:   { intent: { stage: ["before-booking"], topic: ["lodging"] }, anchors: ["yosemite-gateway-towns-compared"] },
    // Two anchors. The entrances piece stays first because it answers the day
    // trip from any direction; the Bay Area piece is second because that is
    // where most day-trippers start and it is the only one that does the
    // daylight arithmetic against the drive.
    daytrip:   { intent: { topic: ["transportation"] }, anchors: ["getting-to-yosemite", "yosemite-day-trip-from-bay-area"] },
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
    // Three anchors, and the third is seasonal relief rather than a ranking
    // change: Four Mile/Panorama is windowed May-Nov and Half Dome May-Oct, so
    // from December through April the month filter dropped both and a winter
    // "one serious hike" plan had no anchor at all. The winter-hikes piece is
    // windowed Nov-Apr, so in the summer months the same filter removes it and
    // the original pair rides exactly as before; in winter it is the answer.
    hike:       { intent: { topic: ["trails"] }, anchors: ["four-mile-up-panorama-down", "so-you-want-to-hike-half-dome", "yosemite-winter-hikes"] },
    photos:     { intent: { who: ["photography"] }, anchors: ["yosemite-photography-spots"] },
    crowds:     { intent: { topic: ["conditions"] }, anchors: ["when-to-visit-yosemite-2026-crowd-forecast"] },
    budget:     { intent: { topic: ["lodging", "food"] }, anchors: ["yosemite-trip-cost-budget-2026"] },
    // The one focus answer whose articles carry no `topic` tag: the pieces that
    // answer "wildlife and natural history" are the natural-history essays, and
    // an empty topic facet is exactly what marks them (see the tagging rules at
    // the top of this file). So no topic tag can reach them, and this rule used
    // to contribute nothing at all: a wildlife trip's read list was built from
    // the other four answers, and the reader's stated priority moved one anchor
    // and nothing else. `stage: in-park` is the facet those essays DO carry, and
    // it is the honest reading of the answer besides: wildlife and natural
    // history are what the reader plans to do once the car is parked.
    // Two anchors, like `hike`: bears are the wildlife question in Yosemite and
    // the food-storage rules are the ones visitors break. Dropping it to one
    // anchor was tried and the freed slot went to a tag-scored piece written for
    // a different traveler (the accessibility guide, on a family trip with no
    // access needs), which is the failure the `who` subtraction exists to stop.
    wildlife:   { intent: { stage: ["in-park"] }, anchors: ["yosemite-wildlife-viewing-guide", "yosemite-bears-safety-guide"] },
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
    if (s.score <= 0) return false;
    if (!window.articleFitsMonth(s.article.slug, answers.when)) return false;
    // Written for somebody else. The subtraction above handles the article that
    // matches one traveler type of three; this handles the one that matches none
    // of them, which is a different thing entirely. "Bringing a Dog to Yosemite"
    // carries lodging, camping and trails, three of the heaviest topic tags, so
    // it could out-score a general piece by six and lose only one for the dog —
    // and land in the plan of a backpacker who never mentioned a dog. A tag the
    // reader did not pick is a preference; a `who` set that misses the reader
    // entirely is the wrong article.
    //
    // An untagged `who` is not a miss: the natural-history essays are written for
    // everyone, and reading a blank as "written for somebody else" would drop
    // exactly the pieces that carry no assumption about the reader.
    //
    // Anchors are exempt, on the same principle that puts them above the tag
    // range: the piece that directly answers a question the reader asked stays
    // even when it was written with another traveler in mind.
    if (acc.anchors.indexOf(s.article.slug) !== -1) return true;
    if (!acc.intent.who.length) return true;
    var who = window.intentFor(s.article.slug).who;
    if (!who.length) return true;
    return who.some(function (id) { return acc.intent.who.indexOf(id) !== -1; });
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
    // The month rides along with the derived intent, so the "show all N entries
    // that fit this trip" hand-off applies the same seasonal exclusion the five
    // reads above it already got.
    intent: window.relaxIntent(acc.intent, answers.when),
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
