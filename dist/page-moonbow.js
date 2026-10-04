function mbFullMoonMs(k) {
  var T = k / 1236.85,
    r = Math.PI / 180,
    s = Math.sin;
  var M = (2.5534 + 29.1053567 * k - 0.0000014 * T * T) * r;
  var Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T) * r;
  var F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T) * r;
  var Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T) * r;
  var E = 1 - 0.002516 * T;
  var jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.40614 * s(Mp) + 0.17302 * E * s(M) + 0.01614 * s(2 * Mp) + 0.01043 * s(2 * F) + 0.00734 * E * s(Mp - M) - 0.00514 * E * s(Mp + M) + 0.00209 * E * E * s(2 * M) - 0.00111 * s(Mp - 2 * F) - 0.00057 * s(Mp + 2 * F) + 0.00056 * E * s(2 * Mp + M) - 0.00042 * s(3 * Mp) + 0.00042 * E * s(M + 2 * F) + 0.00038 * E * s(M - 2 * F) - 0.00024 * E * s(2 * Mp - M) - 0.00017 * s(Om);
  return (jde - 2440587.5) * 86400000 - 69000;
}
function mbSeason(now) {
  var pt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
  var parts = ms => {
    var o = {};
    pt.formatToParts(new Date(ms)).forEach(p => {
      o[p.type] = Number(p.value);
    });
    return o;
  };
  var today = parts(now);
  var year = today.month >= 7 ? today.year + 1 : today.year;
  var k0 = Math.floor((year - 2000) * 12.3685) - 1;
  var out = [];
  for (var k = k0; k < k0 + 8; k++) {
    var ms = mbFullMoonMs(k + 0.5);
    var d = parts(ms);
    if (d.year !== year || d.month < 4 || d.month > 6) continue;
    if (ms + 3 * 86400000 < now) continue;
    out.push(ms);
  }
  return {
    year,
    moons: out
  };
}
var MB_DAY = 86400000;
function mbFmt(ms, opts) {
  return new Intl.DateTimeFormat("en-US", Object.assign({
    timeZone: "America/Los_Angeles"
  }, opts)).format(new Date(ms));
}
function MbNights() {
  var [now] = React.useState(() => Date.now());
  var {
    year,
    moons
  } = mbSeason(now);
  if (!moons.length) return null;
  return React.createElement("div", {
    className: "mb-nights"
  }, React.createElement("p", {
    className: "mb-nights__head"
  }, React.createElement(EventIcon, {
    name: "calendar"
  }), " The full moons, spring ", year), React.createElement("ol", null, moons.map(ms => React.createElement("li", {
    key: ms
  }, React.createElement("span", null, mbFmt(ms, {
    month: "long"
  })), React.createElement("strong", null, mbFmt(ms, {
    month: "long",
    day: "numeric"
  })), React.createElement("p", null, "Best nights about ", mbFmt(ms - 2 * MB_DAY, {
    month: "short",
    day: "numeric"
  }), " to ", mbFmt(ms + 2 * MB_DAY, {
    month: "short",
    day: "numeric"
  }))))), React.createElement("p", {
    className: "ff-note"
  }, "Full-moon dates computed for Pacific time. Whether a night delivers depends on the water and the sky; nightly times by vantage point are published each spring at ", React.createElement("a", {
    href: "https://www.yosemitemoonbow.com/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "yosemitemoonbow.com ↗"), "."));
}
function MbGeoPanel({
  x,
  cy,
  title,
  note,
  visible
}) {
  var cx = x + 150,
    hz = 150,
    r = 112;
  var id = `mb-clip-${x}`;
  return React.createElement("g", null, React.createElement("clipPath", {
    id: id
  }, React.createElement("rect", {
    x: x,
    y: "0",
    width: "300",
    height: hz
  })), React.createElement("rect", {
    x: cx - 34,
    y: "26",
    width: "68",
    height: hz - 26,
    className: "mb-geo__fall"
  }), React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    className: "mb-geo__ghost"
  }), visible && React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    className: "mb-geo__bow",
    clipPath: `url(#${id})`
  }), React.createElement("line", {
    x1: x + 10,
    y1: hz,
    x2: x + 290,
    y2: hz,
    className: "mb-geo__ground"
  }), React.createElement("path", {
    d: `M${cx - 6} ${cy - 6} l12 12 M${cx + 6} ${cy - 6} l-12 12`,
    className: "mb-geo__mark"
  }), React.createElement("text", {
    x: cx + 12,
    y: cy + 4,
    className: "mb-geo__label"
  }, "Opposite the moon"), React.createElement("text", {
    x: x + 10,
    y: "18",
    className: "mb-geo__title"
  }, title), React.createElement("text", {
    x: x + 10,
    y: hz + 24,
    className: "mb-geo__label"
  }, note));
}
function MbGeometry() {
  return React.createElement("svg", {
    className: "mb-geo",
    viewBox: "0 0 620 300",
    role: "img",
    "aria-label": "Two views toward the waterfall with the moon behind you. Left: the moon is low, the point opposite it sits just below the horizon, and the top of the moonbow's circle stands in the spray. Right: the moon is above 42 degrees, the point opposite it is far below the horizon, and the whole circle is underground, so there is no bow."
  }, React.createElement(MbGeoPanel, {
    x: 0,
    cy: 190,
    title: "Moon low behind you",
    note: "The bow stands in the spray",
    visible: true
  }), React.createElement(MbGeoPanel, {
    x: 320,
    cy: 290,
    title: "Moon above 42°",
    note: "The bow is below the ground",
    visible: false
  }));
}
var MB_PINS = [{
  n: 1,
  at: [440, 188],
  pin: [505, 150],
  label: "The footbridge at the base of Lower Yosemite Fall: the classic moonbow, and the crowd"
}, {
  n: 2,
  at: [515, 290],
  label: "Cook's Meadow: Upper Yosemite Fall's bow, with room to spread out"
}, {
  n: 3,
  at: [468, 272],
  label: "Lower Yosemite Fall trailhead, restrooms and shuttle stop"
}, {
  n: 4,
  at: [428, 48],
  pin: [380, 66],
  label: "Upper Yosemite Fall"
}];
function MbFallsMap() {
  return React.createElement("div", {
    className: "npsmap__frame"
  }, React.createElement("img", {
    src: "/img/nps-yosemite-falls-creek-map.jpg",
    width: "960",
    height: "560",
    loading: "lazy",
    decoding: "async",
    alt: "National Park Service map of the Yosemite Falls area: Upper and Lower Yosemite Fall, Yosemite Creek, the Lower Yosemite Fall Trail, Yosemite Village, Yosemite Valley Lodge and Sentinel Bridge."
  }), React.createElement("svg", {
    viewBox: "0 0 960 560",
    role: "img",
    "aria-label": "Markers on the map: " + MB_PINS.map(p => `${p.n}, ${p.label}`).join("; ") + "."
  }, MB_PINS.map(p => {
    var [x, y] = p.pin || p.at;
    return React.createElement("g", {
      key: p.n
    }, p.pin && React.createElement("path", {
      d: `M${p.at[0]} ${p.at[1]} L ${x} ${y}`,
      className: "npsmap__lead"
    }), React.createElement("circle", {
      cx: x,
      cy: y,
      r: "15",
      className: "npsmap__pin " + (p.n === 1 ? "npsmap__pin--rust" : "npsmap__pin--ink")
    }), React.createElement("text", {
      x: x,
      y: y + 5,
      textAnchor: "middle",
      className: "npsmap__num"
    }, p.n));
  })));
}
var MB_GEAR = [{
  id: "rain-shell",
  what: "A rain shell",
  why: "In a big water year the spray at the footbridge soaks everyone standing on it.",
  q: "torrentshell",
  label: "Torrentshell"
}, {
  id: "insulated-jacket",
  what: "A warm layer",
  why: "You stand still for an hour at night at 4,000 feet, damp.",
  q: "nano puff",
  label: "Nano Puff"
}, {
  id: "warm-hat",
  what: "A warm hat",
  why: "The cheapest fix for a cold, wet wait.",
  q: "beanie",
  label: "Beanies"
}];
var MB_KIT = ["A red headlamp, or a white one you keep pointed at the ground", "A tripod, if you want the color the eye cannot see", "A lens cloth, and a plastic bag for the camera between frames", "Shoes with grip: the bridge and the rocks are wet", "Your own ride back: the Valley shuttle stops at 10 p.m."];
var MB_ARCHIVE = [["1870s", "“A wild bath in lunar bows”", "John Muir crept behind Upper Yosemite Fall on a moonlit night, was battered by the falling column, and ran home toward morning “better, not worse for my wild bath in lunar bows.” Nature Notes reprinted the passage from The Yosemite in 1941.", "/archive/1941/vol-20-no-8/"], ["1934", "The bow that did not come", "On June 28 a naturalist-led party of two hundred climbed the Yosemite Falls Trail at midnight. “The expected lunar rainbow at the base of the upper Yosemite Fall did not materialize.” The spray made up for it.", "/archive/1934/vol-13-no-10/"], ["1937", "Only when the moon is full", "Helen Sharsmith on the conditions: only when the moon is full or nearly so is there light enough, and only when the falls are in flood does the bow show in full. Her season: May, June, or even July.", "/archive/1937/vol-16-no-6/"], ["1938", "The lunar bow in Yosemite Fall", "Ranger-naturalist H. E. Perry at the base of the Lower Fall: a band that looks white, then, as you keep watching, shows its spectrum colors, fading when the mist thins and returning with it.", "/archive/1938/vol-17-no-10/"], ["2007", "Six conditions", "A Texas State University team publishes the requirements in Sky & Telescope: clear sky, abundant mist, a dark sky, bright moonlight, moonlight not blocked by the cliffs, and the right geometry. Prediction tables follow.", "https://digital.library.txst.edu/handle/10877/3191"]];
var MB_TOWNS = [{
  id: "el-portal",
  name: "El Portal",
  dest: "El Portal, California",
  drive: "25 to 35 min",
  road: "Highway 140",
  note: "The closest beds outside the park, which matters when the bow is still on after the last shuttle."
}, {
  id: "mariposa",
  name: "Midpines and Mariposa",
  dest: "Mariposa, California",
  drive: "45 to 60 min",
  road: "Highway 140",
  note: "The deepest inventory, and an hour's drive home in the dark."
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  drive: "65 to 80 min",
  road: "Highway 120",
  note: "Further, with a mountain road after midnight. Pick it for the rest of the trip, not the moonbow."
}];
var MB_FAQ = [["When can you see a moonbow in Yosemite?", "On clear nights around the full moon, from about April into June, while Yosemite Falls is running high. The park says generally April and May; in a big snow year the falls carry the season into June. The usable window is the full moon and about two nights either side."], ["Where do you see the moonbow in Yosemite?", "Most often at Lower Yosemite Fall, from the footbridge at its base, a short walk on the paved loop from the Lower Yosemite Fall trailhead. Upper Yosemite Fall makes its own bow, seen from Cook's Meadow. In some years it forms at Glacier Point, once the road is open."], ["What time does the moonbow appear?", "It depends on the night, the fall and where you stand. The bow forms when the moon is low enough, below about 42 degrees, behind you, and it comes about 50 minutes later each night, as the moon rises later. Nightly times by vantage point are published each spring at yosemitemoonbow.com."], ["Can you see the colors with the naked eye?", "Mostly not. To the eye a moonbow is a silver or grey arc, because moonlight is too faint for the eye's color vision; keep watching and some people see faint color. A camera on a tripod records the full spectrum."], ["Is it crowded?", "At Lower Yosemite Fall on a clear full-moon weekend, yes: photographers, tripods and a lot of people on one bridge. Cook's Meadow has more room. Weeknights and the earlier full moons are quieter."], ["Do I need a flashlight?", "To walk in and out, a headlamp, ideally with a red mode. At the bridge, turn it off or point it at the ground, and turn off your camera's flash. The light ruins the view and the long exposures around you."], ["Will I get wet?", "In a big water year, very. The spray at the base of Lower Yosemite Fall soaks the bridge. Bring a rain shell and protect the camera."], ["How do I get back to my car?", "The Valley shuttle runs until about 10 p.m., often before the bow is done. Park at the Yosemite Falls lot or stay within walking distance, and carry a headlamp for the walk out."]];
function MbBook({
  town,
  list,
  children
}) {
  return React.createElement(AvailabilityLink, {
    destination: town.dest,
    list: list,
    slug: town.id,
    className: "ff-book"
  }, children || "See spring availability ↗");
}
function MoonbowPage({
  go
}) {
  var [elPortal] = MB_TOWNS;
  var toc = [["#moonbow-when", "When"], ["#moonbow-how", "How it works"], ["#moonbow-where", "Where to stand"], ["#moonbow-tonight", "Is it on tonight?"], ["#moonbow-night", "The night"], ["#moonbow-stay", "Where to stay"], ["#moonbow-archive", "From the archive"], ["#moonbow-faq", "Questions"]];
  var gearHref = q => {
    var u = `https://www.patagonia.com/search/?q=${q.replace(/ /g, "+")}`;
    return window.buildAffiliateLink ? window.buildAffiliateLink("patagonia", u) : u;
  };
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-moonbow"
  }, React.createElement("div", {
    className: "ff-cover mb-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/moonbow-lower-yosemite-fall-inaglory.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "A moonbow arcing through the spray of Lower Yosemite Fall under a starry night sky",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Moonbow"
    }],
    eyebrow: "LOWER YOSEMITE FALL · FULL MOONS · APRIL TO JUNE",
    title: "The Yosemite Moonbow",
    intro: "On clear spring nights around the full moon, the spray of Yosemite Falls can hold a rainbow made of moonlight. To the eye it is a pale silver arch; to a camera it is every color. It needs high water, a clear sky, and a moon low behind you. This page covers the nights, the geometry, where to stand, and how to behave on a crowded bridge in the dark.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "moonbow_head",
      className: "hp-button",
      href: "#moonbow-when"
    }, "The next full moons ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "moonbow_head",
      className: "hp-link",
      href: "#moonbow-where"
    }, "Where to stand ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Brocken Inaglory / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "The season"), React.createElement("dd", null, "April into June, high water")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "eye"
  }), React.createElement("dt", null, "The nights"), React.createElement("dd", null, "Full moon, two either side")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "The spot"), React.createElement("dd", null, "Lower Yosemite Fall footbridge")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "cloud"
  }), React.createElement("dt", null, "The catch"), React.createElement("dd", null, "Clear sky, and a low moon"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "moonbow_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "moonbow-when",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN"), React.createElement("h2", null, "Five nights a month, three months a year"), React.createElement("p", {
    className: "ff-lede"
  }, "The park's own line: when waterfall flow is especially high, generally in April and May, the full moon on the waterfall mist can make a moonbow, and whether it shows depends on the water, the sky and the angle of the moon. The usable nights are the full moon and about two on either side, while there is still enough moonlight to make a bow."), React.createElement("p", {
    className: "ff-lede"
  }, "The early full moons, in April and early May, are the surest and the least crowded. June works in a big snow year, when the falls are still roaring. In a dry year the season can end with May.")), React.createElement(MbNights, null)), React.createElement("ol", {
    className: "ff-timeline"
  }, React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "April"), React.createElement("strong", null, "The falls build"), React.createElement("p", null, "Snowmelt brings Yosemite Falls up. The first full moon of good water often has the bridge nearly to itself.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Late April to May"), React.createElement("strong", null, "The heart of it"), React.createElement("p", null, "The most water and the most reliable bows. From late May the crowds build.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "June"), React.createElement("strong", null, "A big year only"), React.createElement("p", null, "Worth it while the fall is still going strong. The nights are short and the bow comes late.")), React.createElement("li", {
    className: "is-gone"
  }, React.createElement("span", null, "July on"), React.createElement("strong", null, "Over"), React.createElement("p", null, "Yosemite Falls dwindles through summer and is often a trickle or dry by August.")))), React.createElement("section", {
    className: "ff-band",
    id: "moonbow-how",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOW IT WORKS"), React.createElement("h2", null, "A rainbow, by moonlight, with the same rules"), React.createElement("p", {
    className: "ff-lede"
  }, "A moonbow is a rainbow lit by the moon instead of the sun. The light enters the spray, bends and reflects inside the drops, and comes back to you as an arc 42 degrees around the point directly opposite the moon. Your shadow points at the center of it."), React.createElement("p", {
    className: "ff-lede"
  }, "That geometry decides the hour. The moon has to be behind you and low: the higher it climbs, the lower the bow sits, and once the moon is above 42 degrees the bow drops below the ground. It needs a bright moon, because moonlight is far fainter than sunlight, which is also why the eye sees it as silver."), React.createElement(MbGeometry, null)), React.createElement("div", null, React.createElement("dl", {
    className: "ff-when"
  }, React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, "High flow, heavy spray"), React.createElement("p", null, "The bow lives in the mist. No mist, no bow.")), React.createElement("div", null, React.createElement("dt", null, "Moon"), React.createElement("dd", null, "Full or nearly full"), React.createElement("p", null, "About two nights either side of full.")), React.createElement("div", null, React.createElement("dt", null, "Height"), React.createElement("dd", null, "Below about 42°"), React.createElement("p", null, "And not hidden behind the Valley's walls.")), React.createElement("div", null, React.createElement("dt", null, "Sky"), React.createElement("dd", null, "Clear and dark"), React.createElement("p", null, "A cloud over the moon switches it off.")), React.createElement("div", null, React.createElement("dt", null, "Timing"), React.createElement("dd", null, "About 50 min later each night"), React.createElement("p", null, "The moon rises later every evening."))), React.createElement(NatureNotesFilm, {
    id: "moonbows",
    title: "Moonbows",
    youtubeId: "W6KMnPzZ0Eo",
    episode: 15,
    note: "The park's own film on the full-moon nights at the base of Yosemite Falls.",
    location: "moonbow"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "moonbow-where",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO STAND",
    title: "The footbridge, or the meadow"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Most people see their first moonbow from the footbridge at the base of Lower Yosemite Fall, a short walk up the paved loop from the trailhead. Upper Yosemite Fall throws its own bow higher on the wall, and Cook's Meadow is the place to watch it, with room for a tripod and a view of both falls."), React.createElement("figure", {
    className: "npsmap"
  }, React.createElement(MbFallsMap, null), React.createElement("figcaption", null, MB_PINS.map(p => React.createElement("span", {
    key: p.n
  }, React.createElement("b", null, p.n), " ", p.label)), React.createElement("span", null, "The trail loop is about a mile, paved, and its east side is wheelchair accessible. Map: National Park Service (public domain), cropped."))), React.createElement("ul", {
    className: "ff-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "pin",
    size: 26
  }), React.createElement("strong", null, "Lower Yosemite Fall"), React.createElement("p", null, "The classic: close, loud, wet, and the bow often right in front of you. On a clear full-moon weekend, also the crowd.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "eye",
    size: 26
  }), React.createElement("strong", null, "Cook's Meadow"), React.createElement("p", null, "For Upper Yosemite Fall's bow. Further away and quieter, with the whole wall in view. Stay on the boardwalk and the paths.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "mountain",
    size: 26
  }), React.createElement("strong", null, "Glacier Point"), React.createElement("p", null, "Some years, once the road opens, a brief window of about a quarter hour a night. A long dark drive for it.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Other falls"), React.createElement("p", null, "The park says moonbows can form on many of its waterfalls. Yosemite Falls is the one with a paved path, a parking lot and a view from below.")))), React.createElement("section", {
    className: "ff-band",
    id: "moonbow-tonight",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IS IT ON TONIGHT?"), React.createElement("h2", null, "Water in the morning, sky in the evening"), React.createElement("p", {
    className: "ff-lede"
  }, "The moon's date is fixed. The other two conditions are not. Check the falls in daylight on the Yosemite Falls camera: a full white column means spray. Check the sky in the afternoon: high cloud over the moon at the wrong hour is the usual way a night fails.")), React.createElement("dl", {
    className: "ff-conditions"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop",
    size: 24
  }), React.createElement("dt", null, "Water"), React.createElement("dd", null, "Changes by the week")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "cloud",
    size: 24
  }), React.createElement("dt", null, "Cloud"), React.createElement("dd", null, "Changes by the hour")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 24
  }), React.createElement("dt", null, "The moon"), React.createElement("dd", null, "Fixed: the dates")))), React.createElement(WebcamStrip, {
    variant: "board",
    only: ["Yosemite Falls", "Half Dome"]
  }), React.createElement("div", {
    className: "ff-camreads"
  }, React.createElement("p", null, React.createElement("strong", null, "Yosemite Falls: your water check."), " In daylight, a thick white column with spray billowing at the base is moonbow water. A thin ribbon is a weak bow or none."), React.createElement("p", null, React.createElement("strong", null, "Half Dome: your sky check."), " Clear blue in the late afternoon is a good start. A lid of cloud over the Valley means stay in, and try the next night.")), React.createElement("div", {
    className: "ff-clouds"
  }, React.createElement("h3", null, "What makes the night"), React.createElement("ul", null, React.createElement("li", {
    className: "is-good"
  }, React.createElement("span", null, "Good"), React.createElement("strong", null, "Clear sky, big water"), React.createElement("p", null, "Everything lines up. Get there early on a weekend; the bridge fills.")), React.createElement("li", {
    className: "is-maybe"
  }, React.createElement("span", null, "Maybe"), React.createElement("strong", null, "Thin, moving cloud"), React.createElement("p", null, "The bow comes and goes as cloud crosses the moon. Wait it out.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "No show"), React.createElement("strong", null, "Overcast"), React.createElement("p", null, "No moonlight, no bow, however full the moon or the fall.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "No show"), React.createElement("strong", null, "A trickle of water"), React.createElement("p", null, "Late in a dry year the spray is too thin to hold an arc.")))), React.createElement("p", {
    className: "ff-note"
  }, "Live feeds on one page: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_tonight",
    href: "/conditions"
  }, "the conditions board"), ". How much water the falls are carrying this year: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_tonight",
    href: "/articles/yosemite-waterfalls-guide"
  }, "the waterfalls guide"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "moonbow-night",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE NIGHT"), React.createElement("h2", null, "Keep it dark, and keep it dry"), React.createElement("p", {
    className: "ff-lede"
  }, "A moonbow night is a few hundred people in the dark on a wet bridge, half of them running long exposures. The etiquette is simple and it is not park policy, just what makes the night work: no flash, no white light pointed at the fall, and no walking through somebody's tripod legs."), React.createElement("figure", {
    className: "ff-photo mb-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/moonbow-lower-yosemite-fall-wakabayashi.jpg",
    alt: "A long exposure of Lower Yosemite Fall by moonlight, with a moonbow across the spray at its base",
    sizes: "(max-width: 760px) calc(100vw - 40px), 520px"
  }), React.createElement("figcaption", null, "The camera sees the colors; the eye sees silver. Photo: Ted Wakabayashi / Wikimedia Commons (public domain)"))), React.createElement("div", null, React.createElement("ul", {
    className: "ff-rules mb-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No flash, no white light"), React.createElement("p", null, "Use a red headlamp, or point a white one at the ground. One flashlight on the spray ruins every exposure on the bridge.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "It is wet"), React.createElement("p", null, "In a big year the spray drenches people and cameras. The bridge and rocks are slick.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "The shuttle stops at 10"), React.createElement("p", null, "The Valley shuttle runs from 7 a.m. to 10 p.m. Park at Yosemite Falls, or stay within walking distance.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "camera",
    size: 26
  }), React.createElement("strong", null, "Take one, then watch"), React.createElement("p", null, "Hart has shot it at 30 seconds, f/4, ISO 800; Frye at 20 seconds, f/4, ISO 6400. A tripod is the whole trick."))))), React.createElement("div", {
    className: "ff-kit"
  }, React.createElement("div", {
    className: "ff-gear"
  }, React.createElement("div", {
    className: "ff-gear__head"
  }, React.createElement("h3", null, "For the spray"), React.createElement("p", null, "Picks from Patagonia")), React.createElement("ul", null, MB_GEAR.map(g => React.createElement("li", {
    key: g.id
  }, React.createElement("div", null, React.createElement("strong", null, g.what), React.createElement("p", null, g.why)), React.createElement("a", {
    className: "ff-gear__link",
    href: gearHref(g.q),
    target: "_blank",
    rel: "sponsored noopener",
    "data-aff-network": "patagonia",
    "data-aff-list": "moonbow_gear",
    "data-aff-item-slug": g.id,
    "data-aff-name": g.what
  }, g.label, " ↗")))), React.createElement("p", {
    className: "ff-note"
  }, "Patagonia links are affiliate links; we may earn a commission. Any shell and warm layer do the same job. ", React.createElement("a", {
    href: "/affiliate"
  }, "Our affiliate policy."))), React.createElement("div", {
    className: "ff-else"
  }, React.createElement("h3", null, "Everything else"), React.createElement("ul", null, MB_KIT.map(k => React.createElement("li", {
    key: k
  }, React.createElement(EventIcon, {
    name: "check",
    size: 18
  }), k)))))), React.createElement("section", {
    className: "ff-band",
    id: "moonbow-stay",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO STAY",
    title: "Sleep close enough to walk home"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The bow often outlasts the last shuttle, and the drive out of the Valley at midnight is long and dark. Yosemite Valley Lodge sits across the road from the Lower Yosemite Fall trailhead, which is the best-placed bed for a moonbow night; it books through the park concessioner about a year ahead."), React.createElement("div", {
    className: "ff-towns"
  }, MB_TOWNS.map(t => React.createElement("div", {
    className: "ff-town",
    key: t.id
  }, React.createElement("div", {
    className: "ff-town__name"
  }, React.createElement("h3", null, t.name), React.createElement("p", null, React.createElement("strong", null, t.drive), " to the Valley · ", t.road)), React.createElement("div", {
    className: "ff-town__note"
  }, React.createElement("p", null, t.note)), React.createElement(MbBook, {
    town: t,
    list: "moonbow_town"
  }))), React.createElement("p", {
    className: "ff-note"
  }, "The filled buttons search availability on Expedia; we may earn a commission. No link is to a specific property. ", React.createElement("a", {
    href: "/affiliate"
  }, "How we handle affiliate links."), " In-park rooms: ", React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Travel Yosemite ↗"), ". Every option compared: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_stay",
    href: "/stay"
  }, "where to stay"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "moonbow-archive",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "FROM THE NATURE NOTES ARCHIVE",
    title: "A century of full-moon nights"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The park's naturalists were writing up the lunar bow long before anyone published a timetable. Their conditions are the same ones on this page."), React.createElement("ol", {
    className: "ff-history"
  }, MB_ARCHIVE.map(([year, title, text, href]) => React.createElement("li", {
    key: year
  }, React.createElement("span", null, year), React.createElement("strong", null, title), React.createElement("p", null, text, " ", React.createElement("a", {
    href: href,
    ...(href.startsWith("http") ? {
      target: "_blank",
      rel: "noopener noreferrer"
    } : {})
  }, href.startsWith("http") ? "The paper ↗" : "Read the issue")))))), React.createElement("section", {
    className: "ff-band",
    id: "moonbow-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Moonbow questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The rest of the spring, by day: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_faq",
    href: "/articles/yosemite-waterfalls-guide"
  }, "the waterfalls guide"), ". The night sky when the moon is not full: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_faq",
    href: "/articles/yosemite-stargazing-where-to-look-up"
  }, "stargazing in Yosemite"), ". Cold spring mornings at the same creek: ", React.createElement(HomeLink, {
    go: go,
    location: "moonbow_faq",
    href: "/frazil-ice"
  }, "frazil ice"), "."), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PLANNING A FULL-MOON TRIP?"), React.createElement("h3", null, "Search El Portal first"), React.createElement("p", null, "The closest beds outside the park, 25 to 35 minutes from the Yosemite Falls lot on the road that stays open all year."), React.createElement(MbBook, {
    town: elPortal,
    list: "page_moonbow"
  }, "Search El Portal lodging ↗"))), React.createElement("div", {
    className: "ff-faq"
  }, MB_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "moonbow",
    title: "Making a spring trip of it?",
    intro: "The Field Guide app carries the Valley's spring stops, the waterfall walks with parking notes, offline maps for a park with no signal, and a day-by-day planner around the full-moon nights.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Spring, watched from inside the park",
    heading: "Spring, watched from inside the park",
    blurb: "Sunday Field Notes follows the water each spring: how high the falls are running, what the full moon will find, and what the park's naturalists saw in the same weeks a century ago.",
    location: "moonbow",
    tag: "moonbow"
  }));
}
window.MoonbowPage = MoonbowPage;
