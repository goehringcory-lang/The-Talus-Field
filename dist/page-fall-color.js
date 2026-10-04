var FC_LADDER = [{
  cls: "is-gone",
  when: "Late September into October",
  where: "The high country",
  what: "Aspens along the Tioga Road near the Tuolumne Grove trailhead and the Yosemite Creek picnic area, past Summit Meadow on Glacier Point Road, and the grouseberry and whortleberry of Tuolumne going orange and red at ground level."
}, {
  cls: "is-tight",
  when: "Early to mid October",
  where: "The middle elevations",
  what: "Dogwoods at 5,000 to 6,000 feet on Highways 41 and 120 and in the Tuolumne Grove turn reds the Valley rarely shows, and turn first. Wawona's black oaks and dogwoods follow."
}, {
  cls: "is-open",
  when: "Mid October to early November",
  where: "Yosemite Valley",
  what: "Bigleaf maples and black oaks are showy from about mid-October; the Valley's color usually builds through late October and holds until the first heavy storm or hard frost."
}, {
  cls: "is-open",
  when: "Late October to mid November",
  where: "El Portal and the Merced canyon",
  what: "Willows, cottonwoods and poison oak along the river on Highway 140, the last band of the season below the park."
}];
var FC_TREES = [{
  name: "Bigleaf maple",
  color: "Bright yellow",
  swatch: "#e2b42b",
  where: "Lines the creeks and the river along the Valley's south wall, from below Bridalveil Creek past Sentinel Creek to Happy Isles."
}, {
  name: "California black oak",
  color: "Orange-brown to golden yellow",
  swatch: "#c5822b",
  where: "The Valley meadows and Wawona, standing in the open where the light reaches them."
}, {
  name: "Pacific dogwood",
  color: "Reds, pinks and yellow",
  swatch: "#b8402a",
  where: "Under the conifers in the Valley and Wawona, and brightest at middle elevations."
}, {
  name: "Black and Fremont cottonwood",
  color: "Brilliant yellow",
  swatch: "#e8c843",
  where: "Along the Merced in the Valley and down the canyon at El Portal."
}, {
  name: "Quaking aspen",
  color: "Yellow",
  swatch: "#f0d24a",
  where: "Roadside stands on the Tioga Road and Glacier Point Road, the first to turn."
}, {
  name: "Poison oak",
  color: "Red to purple",
  swatch: "#7c2a3a",
  where: "Low-elevation slopes and the El Portal riverbank. Admire it from the trail."
}];
var FC_PINS = [{
  n: 1,
  at: [550, 883],
  pin: [506, 947],
  label: "Bridalveil Creek: where the south-wall maples begin"
}, {
  n: 2,
  at: [1011, 653],
  label: "El Capitan Meadow: the black oaks"
}, {
  n: 3,
  at: [1395, 522],
  pin: [1472, 563],
  label: "Sentinel Creek and Sentinel Beach: maples along the south wall"
}, {
  n: 4,
  at: [1564, 381],
  pin: [1623, 432],
  label: "Yosemite Valley Chapel: the red sugar maple"
}, {
  n: 5,
  at: [1536, 301],
  label: "Cook's Meadow: the early-turning elm, Yosemite Falls behind"
}, {
  n: 6,
  at: [2083, 580],
  label: "Happy Isles: the east end of the maple strip"
}];
var FC_ELSEWHERE = [["Wawona", "Black oaks and dogwoods, as in the Valley, on the road to the Mariposa Grove."], ["Glacier Point Road", "Deer brush goes yellow, and aspens stand past Summit Meadow and along the old road from Badger Pass to Bridalveil Creek Campground."], ["Tioga Road", "Aspen stands near the Tuolumne Grove trailhead and the Yosemite Creek picnic area. The road closes for the winter, usually sometime in November."], ["Tuolumne Meadows", "Low color: grouseberry and whortleberry in oranges and reds across the meadow edges."], ["El Portal", "Willows, cottonwoods and poison oak along the Merced, at the bottom of the season."]];
var FC_SOURCES = [["NPS fall color", "The park's own species list, places and timing", "https://www.nps.gov/yose/learn/nature/fall-color.htm"], ["NPS current conditions", "Road status, closures and smoke", "https://www.nps.gov/yose/planyourvisit/conditions.htm"], ["NPS winter roads", "When Tioga and Glacier Point roads close, and chain rules", "https://www.nps.gov/yose/planyourvisit/wroads.htm"], ["NWS point forecast, Yosemite Valley", "Overnight lows: a hard freeze ends the season", "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"], ["Caltrans QuickMap", "Chain controls on Highways 140, 41 and 120", "https://quickmap.dot.ca.gov/"], ["Michael Frye's blog", "A Valley photographer's running notes on the color", "https://www.michaelfrye.com/"]];
var FC_ARCHIVE = [["1929", "The elms go first", "At the end of September the first spangles of autumn color showed in the exotic elms along the village street, while the native trees held their green. The elm in Cook's Meadow still turns ahead of everything around it.", "/archive/1929/vol-8-no-11/"], ["1935", "Frost does not paint the leaves", "Junior Park Naturalist C. A. Wagner on the common belief: frost does not cause or enhance the color, it kills the leaves and so prevents it. His test still works: trees in warm, sunny places color brighter than trees in cool shade.", "/archive/1935/vol-14-no-11/"], ["1942", "Glorious in reds", "The Happy Isles nature walk: the dogwood, at its best with white blossoms in early spring, “is glorious in reds during the season of fall coloring.”", "/archive/1942/vol-21-no-1/"], ["1951", "“Nothing but rocks”", "Shirley Sargent was warned that fall was a terrible time to come: the falls dry, the river low. She arrived on October 19 to dogwood crimson-bright along the Merced, yellowing azaleas, oaks and maples, ferns like uncured tobacco leaves, and a Valley with almost no one in it.", "/archive/1951/vol-30-no-11/"]];
var FC_TOWNS = [{
  id: "el-portal",
  name: "El Portal",
  dest: "El Portal, California",
  drive: "25 to 35 min",
  road: "Highway 140",
  note: "The closest beds outside the boundary, on the river where the season ends: willows and cottonwoods below the lodges."
}, {
  id: "mariposa",
  name: "Midpines and Mariposa",
  dest: "Mariposa, California",
  drive: "45 to 60 min",
  road: "Highway 140",
  note: "The deepest inventory on the road that stays open all winter, so a late-season storm does not strand the trip."
}, {
  id: "groveland",
  name: "Groveland",
  dest: "Groveland, California",
  drive: "65 to 80 min",
  road: "Highway 120",
  note: "The approach through Crane Flat and the Big Oak Flat Road, where the middle-elevation dogwoods turn first."
}, {
  id: "oakhurst",
  name: "Fish Camp and Oakhurst",
  dest: "Oakhurst, California",
  drive: "75 to 90 min",
  road: "Highway 41",
  note: "The Wawona Road: dogwoods on the climb and Wawona's oaks on the way in."
}];
var FC_FAQ = [["When is peak fall color in Yosemite?", "In Yosemite Valley, usually late October into early November. The park's maples and black oaks are showy from about mid-October, and the Valley's color holds until the first heavy winter storm or hard frost, which in some years is early December. The high country turns weeks earlier."], ["Is Yosemite good for fall colors?", "In places. The park says it is not known for spectacular fall color, because most of its trees are evergreen. What it has is concentrated: maples along the south wall, black oaks in the meadows, dogwoods under the conifers, aspens up high. Against grey granite it reads brighter than the acreage suggests."], ["Where are the best fall colors in Yosemite Valley?", "The bigleaf maples along the south wall from below Bridalveil Creek past Sentinel Creek to Happy Isles, the black oaks in El Capitan Meadow, the sugar maple beside the Yosemite Valley Chapel, and the elm in Cook's Meadow, which turns first."], ["When do the aspens turn on Tioga Road?", "Late September through October, earliest of anything in the park. Look near the Tuolumne Grove trailhead and the Yosemite Creek picnic area. The road closes for the winter, usually sometime in November."], ["Are the waterfalls running in the fall?", "Barely. Yosemite Falls is often a trickle or dry from late summer until the autumn storms; Vernal, Nevada and Bridalveil run all year but slow to a trickle. A big early storm can bring them back for a few days."], ["What ends the fall color?", "A hard frost or the first heavy storm. Frost kills the leaves before they finish turning, and a windy storm strips what has turned. Clear, dry, cool days with nights above freezing make the best color."], ["Is October a good month to visit Yosemite?", "Yes, for the color, the light and the cooler walking weather, with the falls low and the high roads on borrowed time. From October 15 there is no overnight parking along the Tioga or Glacier Point roads."], ["Is the red tree by the Yosemite Chapel native?", "No. It is a sugar maple, planted, and the brightest red in the Valley. The native maple here is the bigleaf, which turns yellow."]];
function FcValleyMap() {
  return React.createElement("div", {
    className: "npsmap__frame"
  }, React.createElement("img", {
    src: "/img/nps-yosemite-valley-map.jpg",
    width: "2560",
    height: "1000",
    loading: "lazy",
    decoding: "async",
    alt: "National Park Service map of Yosemite Valley from Valley View and Bridalveil Fall in the west to Happy Isles and Mirror Lake in the east."
  }), React.createElement("svg", {
    viewBox: "0 0 2560 1000",
    role: "img",
    "aria-label": "Fall color markers on the map: " + FC_PINS.map(p => `${p.n}, ${p.label}`).join("; ") + "."
  }, FC_PINS.map(p => {
    var [x, y] = p.pin || p.at;
    return React.createElement("g", {
      key: p.n
    }, p.pin && React.createElement("path", {
      d: `M${p.at[0]} ${p.at[1]} L ${x} ${y}`,
      className: "npsmap__lead"
    }), React.createElement("circle", {
      cx: x,
      cy: y,
      r: "26",
      className: "npsmap__pin npsmap__pin--rust"
    }), React.createElement("text", {
      x: x,
      y: y + 8,
      textAnchor: "middle",
      className: "npsmap__num fcol-num"
    }, p.n));
  })));
}
function FcBook({
  town,
  list,
  children
}) {
  return React.createElement(AvailabilityLink, {
    destination: town.dest,
    list: list,
    slug: town.id,
    className: "ff-book"
  }, children || "See autumn availability ↗");
}
function FallColorPage({
  go
}) {
  var mariposa = FC_TOWNS[1];
  var toc = [["#fall-color-when", "When it turns"], ["#fall-color-trees", "The trees"], ["#fall-color-where", "Where to look"], ["#fall-color-week", "Is it on this week?"], ["#fall-color-season", "What else autumn brings"], ["#fall-color-stay", "Where to stay"], ["#fall-color-archive", "From the archive"], ["#fall-color-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-fall-color"
  }, React.createElement("div", {
    className: "ff-cover fcol-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/yosemite-valley-black-oaks-autumn.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Black oaks gone gold and orange in a Yosemite Valley meadow beneath a granite wall",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Fall color"
    }],
    eyebrow: "MAPLES · BLACK OAKS · DOGWOODS · ASPENS · EVERY AUTUMN",
    title: "Yosemite Fall Color",
    intro: "Most of Yosemite is evergreen, so autumn here is not a hillside on fire. It is gold along the creeks, oaks going orange in the meadows, a red dogwood under a pine, and all of it against grey granite. This page covers when each band turns, where the park's own naturalists look, and what ends it.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "fall_color_head",
      className: "hp-button",
      href: "#fall-color-when"
    }, "When it turns ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "fall_color_head",
      className: "hp-link",
      href: "#fall-color-where"
    }, "Where to look ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: Bernard Spragg / Wikimedia Commons (CC0)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "The Valley"), React.createElement("dd", null, "Late October to early November")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("dt", null, "Up high"), React.createElement("dd", null, "Weeks earlier, from late September")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "The waterfalls"), React.createElement("dd", null, "Low or dry")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("dt", null, "The end"), React.createElement("dd", null, "The first hard frost or big storm"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "fall_color_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "fall-color-when",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN IT TURNS"), React.createElement("h2", null, "Read the elevation, not the calendar"), React.createElement("p", {
    className: "ff-lede"
  }, "Color starts at the top of the park and walks down it. The aspens along the Tioga Road go first, in late September. The dogwoods at middle elevations follow. The Valley floor, at 4,000 feet, comes last of the park proper, and the canyon at El Portal after that."), React.createElement("p", {
    className: "ff-lede"
  }, "The park puts the Valley's maples and black oaks at their showiest from about mid-October, with color usually arriving in late October and lingering until the first heavy winter storm or hard frost. A trip in the last week of October or the first of November catches the most of it in a typical year.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "For the Valley, aim at late October."), React.createElement("li", null, "For aspens, go early, before Tioga Road closes."), React.createElement("li", null, "Watch the overnight lows: a hard freeze ends it."), React.createElement("li", null, "Come for color and light, not waterfalls.")), React.createElement(FcBook, {
    town: mariposa,
    list: "fall_color_town"
  }, "Check Highway 140 availability ↗"), React.createElement("p", {
    className: "ff-disclosure"
  }, "Availability search on Expedia. We may earn a commission if you book, at no cost to you. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure.")))), React.createElement("ol", {
    className: "ff-timeline fcol-ladder"
  }, FC_LADDER.map(r => React.createElement("li", {
    key: r.where,
    className: r.cls
  }, React.createElement("span", null, r.when), React.createElement("strong", null, r.where), React.createElement("p", null, r.what)))), React.createElement("p", {
    className: "ff-note"
  }, "The middle-elevation dogwoods turning ahead of the Valley is a photographer's observation (Michael Frye); the El Portal window is the Mariposa County tourism bureau's. Everything else on this ladder is the National Park Service's own description.")), React.createElement("section", {
    className: "ff-band",
    id: "fall-color-trees",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE TREES",
    title: "Six that turn, among a forest that does not"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Ponderosa pine, incense cedar and Douglas fir keep the Valley green all winter. The color is in the broadleaf trees between them, and each has its own shade. Learn these six and the Valley reads like a key."), React.createElement("ul", {
    className: "fcol-trees"
  }, FC_TREES.map(t => React.createElement("li", {
    key: t.name
  }, React.createElement("i", {
    className: "fcol-swatch",
    style: {
      background: t.swatch
    },
    "aria-hidden": "true"
  }), React.createElement("strong", null, t.name), React.createElement("span", null, t.color), React.createElement("p", null, t.where)))), React.createElement("div", {
    className: "ff-split fcol-why"
  }, React.createElement("div", null, React.createElement("h3", null, "Why the leaves turn"), React.createElement("p", {
    className: "ff-lede"
  }, "As the days shorten and the nights cool, the trees stop making chlorophyll, and the yellows that were in the leaf all summer show through. The reds are made new: sunny days and cool nights trap sugars in the leaf, and the leaf turns them into anthocyanin. That is why a dogwood in the sun goes redder than one in the shade, and why the best autumns are clear, dry and cool without freezing.")), React.createElement(NatureNotesFilm, {
    id: "fall-moments",
    title: "Fall Moments",
    youtubeId: "UzA-M8ASGqk",
    note: "The park's own short on autumn in Yosemite: color, light, and the quiet that comes with them.",
    location: "fall_color"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "fall-color-where",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO LOOK",
    title: "The Valley, stop by stop"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The park names one long band of color: the bigleaf maples along the riparian strip of the south wall, from below Bridalveil Creek past Sentinel Creek to Happy Isles. Southside Drive runs along most of it. Add the meadows and two planted trees, and a slow loop of the Valley floor takes in all of it."), React.createElement("figure", {
    className: "npsmap"
  }, React.createElement(FcValleyMap, null), React.createElement("figcaption", null, FC_PINS.map(p => React.createElement("span", {
    key: p.n
  }, React.createElement("b", null, p.n), " ", p.label)), React.createElement("span", null, "The Cook's Meadow elm and the El Capitan Meadow oaks come from published color reports; the rest are the park's own. Map: National Park Service (public domain)."))), React.createElement("div", {
    className: "fcol-else"
  }, React.createElement("h3", null, "Outside the Valley"), React.createElement("ul", null, FC_ELSEWHERE.map(([place, text]) => React.createElement("li", {
    key: place
  }, React.createElement(EventIcon, {
    name: "tree",
    size: 20
  }), React.createElement("div", null, React.createElement("strong", null, place), React.createElement("p", null, text))))))), React.createElement("section", {
    className: "ff-band",
    id: "fall-color-week",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IS IT ON THIS WEEK?"), React.createElement("h2", null, "Watch the meadow, and the overnight low"), React.createElement("p", {
    className: "ff-lede"
  }, "No gauge measures color, and the park does not publish a weekly report. Two things you can check from anywhere: the Half Dome camera, which looks across Ahwahnee Meadow and its oaks, and the forecast low for the Valley floor.")), React.createElement("dl", {
    className: "ff-conditions"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "sun",
    size: 24
  }), React.createElement("dt", null, "Clear days"), React.createElement("dd", null, "Build the reds")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm",
    size: 24
  }), React.createElement("dt", null, "Cool nights"), React.createElement("dd", null, "Above freezing")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "cloud",
    size: 24
  }), React.createElement("dt", null, "A big storm"), React.createElement("dd", null, "Strips the trees")))), React.createElement(WebcamStrip, {
    variant: "board",
    only: ["Half Dome", "Yosemite Falls"]
  }), React.createElement("div", {
    className: "ff-camreads"
  }, React.createElement("p", null, React.createElement("strong", null, "Half Dome, from Ahwahnee Meadow: your color check."), " The foreground is meadow and black oak. Green crowns mean it is early; gold and rust mean it is on; bare branches mean the storm came first."), React.createElement("p", null, React.createElement("strong", null, "Yosemite Falls: your water check."), " In most autumns the fall is a dark stripe or a thread. A white plume means a storm has been through, which is good for the falls and often the end for the leaves.")), React.createElement("div", {
    className: "ff-clouds"
  }, React.createElement("h3", null, "What makes a good autumn, and what ends one"), React.createElement("ul", null, React.createElement("li", {
    className: "is-good"
  }, React.createElement("span", null, "Good"), React.createElement("strong", null, "Clear, dry, cool"), React.createElement("p", null, "Sunny days and cold nights above freezing are the recipe for the reds.")), React.createElement("li", {
    className: "is-maybe"
  }, React.createElement("span", null, "Slow"), React.createElement("strong", null, "A warm spell"), React.createElement("p", null, "Color stalls and the season runs late. The trees hold their green into November.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "Over"), React.createElement("strong", null, "A hard frost"), React.createElement("p", null, "A freeze kills the leaf before it finishes turning. It browns and drops.")), React.createElement("li", {
    className: "is-no"
  }, React.createElement("span", null, "Over"), React.createElement("strong", null, "The first big storm"), React.createElement("p", null, "Wind and rain strip what has turned. The falls come back; the color goes.")))), React.createElement("div", {
    className: "ff-sources"
  }, React.createElement("h3", null, "Sources to keep open"), React.createElement("ul", null, FC_SOURCES.map(([t, d, h]) => React.createElement("li", {
    key: h
  }, React.createElement("a", {
    href: h,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, t, " ↗"), React.createElement("span", null, d))))), React.createElement("p", {
    className: "ff-note"
  }, "Every live feed on one page: ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_week",
    href: "/conditions"
  }, "the conditions board"), ". The cameras and how to read them: ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_week",
    href: "/webcams"
  }, "the webcams"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "fall-color-season",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHAT ELSE AUTUMN BRINGS",
    title: "Color, low water, and roads on borrowed time"
  }), React.createElement("ul", {
    className: "ff-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "The waterfalls are low"), React.createElement("p", null, "Yosemite Falls is often a trickle or dry from late summer until the autumn storms. Vernal, Nevada and Bridalveil run all year, slowed to a trickle. ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_season",
    href: "/articles/yosemite-waterfalls-guide"
  }, "The waterfalls guide"), " has the year.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "The high roads close"), React.createElement("p", null, "Tioga Road and Glacier Point Road close for snow, usually sometime in November. From October 15 there is no overnight parking along either. ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_season",
    href: "/tioga-opening"
  }, "How Tioga opens again"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Chains in the car"), React.createElement("p", null, "All park roads are subject to chain control from late fall. Carry chains after the first storm, and keep a full tank: there is no gas in Yosemite Valley.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Room to walk"), React.createElement("p", null, "The summer crowd is gone, and the Valley Loop and the meadow boardwalks are easy going. ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_season",
    href: "/articles/yosemite-in-fall"
  }, "The fall guide"), " covers the rest of the season."))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "Smoke is part of autumn now."), " Prescribed burns and wildfire can close roads or haze the Valley for days in October. Check the park's ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "current conditions"), " before you drive, and see ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_season",
    href: "/articles/yosemite-during-smoke-season"
  }, "the smoke-season guide"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "fall-color-stay",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO STAY",
    title: "Pick the road by the color it passes"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "In autumn each gateway road climbs through a different band of the season, so the drive in is part of the trip. Inside the park, the Valley's lodging books through the concessioner about a year ahead."), React.createElement("div", {
    className: "ff-towns fcol-towns"
  }, FC_TOWNS.map(t => React.createElement("div", {
    className: "ff-town",
    key: t.id
  }, React.createElement("div", {
    className: "ff-town__name"
  }, React.createElement("h3", null, t.name), React.createElement("p", null, React.createElement("strong", null, t.drive), " to the Valley · ", t.road)), React.createElement("div", {
    className: "ff-town__note"
  }, React.createElement("p", null, t.note)), React.createElement(FcBook, {
    town: t,
    list: "fall_color_town"
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
    location: "fall_color_stay",
    href: "/stay"
  }, "where to stay"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "fall-color-archive",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "FROM THE NATURE NOTES ARCHIVE",
    title: "The park's naturalists, watching the same trees"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The park's naturalists wrote about the autumn color for decades in Yosemite Nature Notes. The trees they named are the ones that still turn."), React.createElement("ol", {
    className: "ff-history"
  }, FC_ARCHIVE.map(([year, title, text, href]) => React.createElement("li", {
    key: year
  }, React.createElement("span", null, year), React.createElement("strong", null, title), React.createElement("p", null, text, " ", React.createElement("a", {
    href: href
  }, "Read the issue")))))), React.createElement("section", {
    className: "ff-band",
    id: "fall-color-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Fall color questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The whole season, beyond the leaves: ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_faq",
    href: "/articles/yosemite-in-fall"
  }, "Yosemite in fall"), ". Where to stand with a camera: ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_faq",
    href: "/articles/yosemite-photography-spots"
  }, "the photography guide"), ". Telling the trees apart: ", React.createElement(HomeLink, {
    go: go,
    location: "fall_color_faq",
    href: "/articles/yosemite-trees-identification-guide"
  }, "the tree guide"), "."), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PLANNING THE TRIP?"), React.createElement("h3", null, "Search the Highway 140 corridor"), React.createElement("p", null, "El Portal, Midpines and Mariposa sit on the road that stays open all winter, so a November storm does not end the trip."), React.createElement(FcBook, {
    town: mariposa,
    list: "page_fall_color"
  }, "Search Highway 140 lodging ↗"))), React.createElement("div", {
    className: "ff-faq"
  }, FC_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement(HpGuideBand, {
    go: go,
    location: "fall_color",
    title: "Taking the autumn trip?",
    intro: "The Field Guide app carries the Valley stops with parking notes, offline maps for a park with no signal, and a day-by-day planner, so the slow loop of the meadows fits around everything else.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "The season, watched from inside the park",
    heading: "The season, watched from inside the park",
    blurb: "Sunday Field Notes follows the color down the mountain each autumn: what has turned, what the frost took, and what the park's naturalists wrote about the same weeks a century ago.",
    location: "fall_color",
    tag: "fall-color"
  }));
}
window.FallColorPage = FallColorPage;
