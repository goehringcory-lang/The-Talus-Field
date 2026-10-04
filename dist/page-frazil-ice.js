var FZ_PINS = [{
  n: 1,
  at: [440, 188],
  pin: [505, 150],
  label: "Yosemite Creek just below Lower Yosemite Fall: where frazil ice is most famously seen"
}, {
  n: 2,
  at: [452, 276],
  pin: [405, 300],
  label: "Yosemite Creek at Northside Drive: where the April 1953 flow crossed the road"
}, {
  n: 3,
  at: [468, 272],
  pin: [520, 250],
  label: "Lower Yosemite Fall trailhead and shuttle stop: watch from the paved loop"
}, {
  n: 4,
  at: [428, 48],
  pin: [380, 66],
  label: "Upper Yosemite Fall: the ice cone at its base, and the source of the mist"
}];
function FzCreekMap() {
  return React.createElement("div", {
    className: "npsmap__frame"
  }, React.createElement("img", {
    src: "/img/nps-yosemite-falls-creek-map.jpg",
    width: "960",
    height: "560",
    loading: "lazy",
    decoding: "async",
    alt: "National Park Service map of the Yosemite Falls area: Upper and Lower Yosemite Fall, Yosemite Creek running south past the Lower Yosemite Fall Trail to Yosemite Valley Lodge, Yosemite Village and Sentinel Bridge."
  }), React.createElement("svg", {
    viewBox: "0 0 960 560",
    role: "img",
    "aria-label": "Markers on the map: " + FZ_PINS.map(p => `${p.n}, ${p.label}`).join("; ") + "."
  }, FZ_PINS.map(p => {
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
var FZ_RECORD = [["1932", "The first photographs", "Ralph H. Anderson photographs frazil ice at the base of Lower Yosemite Fall on April 21. The park's photo archive still holds the prints.", "https://npgallery.nps.gov/AssetDetail/b70a2c29395c49b8b3db8ff59cd7e056", "The photograph ↗"], ["1953", "The creek leaves its bed", "April 10, after a warm spell and three nights in the twenties. By noon the jammed ice had lifted Yosemite Creek out of its channel and sent it across the highway toward the lodge cottages. A footbridge was lifted off its foundations; crews used a dragline, a fire pump and, by one account, explosives. A worker who tried to cross on snowshoes sank in and was pulled out; a deer was found drowned.", "/archive/1954/vol-33-no-4/", "Read the issue"], ["1954", "A bridge disappears", "In March the ice engulfed the footbridge near Lower Yosemite Fall so completely that no part of it showed. The park naturalist logged the temperatures: the forties while the falls rose, then 20 degrees on the day the flow peaked.", "/archive/1954/vol-33-no-4/", "Read the issue"], ["1961", "More than 20 feet deep", "Nature Notes reports the ice along Yosemite Creek has at times stood more than 20 feet deep, that trails must be reopened with snow equipment, and that the banks can hold it for weeks.", "http://www.yosemite.ca.us/library/yosemite_nature_notes/40/40-2.pdf", "The issue ↗"], ["2009 to 2010", "The film", "Producer Steven M. Bumgardner counts about seven events on Yosemite Creek in 2009, mostly in April, and 20 or 30 in 2010, in April, May and even early June, and makes Yosemite Nature Notes episode 9.", "https://www.nps.gov/yose/planyourvisit/frazilice.htm", "The NPS page ↗"], ["2017 and 2023", "Closed trails", "In early 2017 the slush flooded the Lower Yosemite Fall Trail and it closed, as reported by the San Francisco Chronicle. In January 2023 rangers posted video of ice over the bridge and trail and closed the area until it melted.", "https://www.advnture.com/news/video-shows-dangerous-lava-like-frazil-ice-at-yosemite-national-park", "The report ↗"]];
var FZ_FAQ = [["What is frazil ice?", "Slush made from waterfall mist. On cold mornings when a creek is running high, mist from the fall freezes into tiny ice crystals that float down the creek, so the channel seems to be full of slush rather than water. In Yosemite it can pile up, dam the creek, and move like slow lava."], ["When can you see frazil ice in Yosemite?", "Most often in spring, especially April, and sometimes in March and May. It can happen in fall or winter too, whenever the waterfalls carry a lot of water and the Valley drops below freezing overnight. It is weather-driven and hard to predict more than a day ahead."], ["What time of day does frazil ice happen?", "In the morning, usually before 9 a.m., after a night below freezing. As the sun warms the Valley, the flow eases."], ["Where is the best place to see frazil ice?", "Yosemite Creek just below Lower Yosemite Fall, from the paved Lower Yosemite Fall loop and its bridges. The park also lists Ribbon Creek and Sentinel Creek."], ["Is frazil ice dangerous?", "Yes. It looks like snow you could walk on, but it is slush over moving water, and people and animals can sink in and be trapped beneath it. It can dam a creek and send the water somewhere new without warning. Watch from the trail, and stay off the ice and the banks."], ["Is frazil ice the same as the ice cone?", "No. The ice cone is the mound of frozen spray and fallen ice that builds at the base of Upper Yosemite Fall in winter, sometimes more than 300 feet tall, usually melted by mid-April. Frazil ice forms in the creek below the Lower Fall."], ["How do I know if frazil ice is happening?", "Watch for the setup: a warm spell that swells Yosemite Falls, then a clear night that drops well below freezing. Check the Yosemite Falls camera for a big white column, and the forecast low for the Valley floor. Then be at the creek early."], ["Is there a video of Yosemite frazil ice?", "Yes. The National Park Service's Yosemite Nature Notes episode 9, Frazil Ice, filmed the flows on Yosemite Creek. It is embedded on this page."]];
function FrazilIcePage({
  go
}) {
  var toc = [["#frazil-film", "The film"], ["#frazil-what", "What it is"], ["#frazil-when", "When"], ["#frazil-where", "Where to watch"], ["#frazil-safety", "Stay off it"], ["#frazil-record", "The record"], ["#frazil-faq", "Questions"]];
  var elPortal = {
    id: "el-portal",
    dest: "El Portal, California"
  };
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-frazil-ice"
  }, React.createElement("div", {
    className: "ff-cover fz-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/frazil-ice-yosemite-creek-nps.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Frazil ice choking Yosemite Creek: white slush filling the channel between banks of piled ice",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Frazil ice"
    }],
    eyebrow: "YOSEMITE CREEK · COLD SPRING MORNINGS · BEFORE 9 A.M.",
    title: "Frazil Ice in Yosemite",
    intro: "On some spring mornings Yosemite Creek runs white. The mist from the falls has frozen in the night into crystals, the crystals have packed into slush, and the slush is moving down the channel like wet concrete, piling up, damming, and spilling over its banks. This page covers what it is, when the conditions line up, where to watch it, and why you never step on it.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "frazil_head",
      className: "hp-button",
      href: "#frazil-film"
    }, "Watch the film ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "frazil_head",
      className: "hp-link",
      href: "#frazil-when"
    }, "When it happens ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: National Park Service (public domain)")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "The season"), React.createElement("dd", null, "Spring, mostly April")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "The hour"), React.createElement("dd", null, "Morning, before 9 a.m.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "The place"), React.createElement("dd", null, "Yosemite Creek, below the Lower Fall")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("dt", null, "The rule"), React.createElement("dd", null, "Never walk on it"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "frazil_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section fz-film",
    id: "frazil-film",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE FILM"), React.createElement("h2", null, "Watch the creek move"), React.createElement("p", {
    className: "ff-lede"
  }, "The National Park Service filmed the flows on Yosemite Creek for Yosemite Nature Notes, and the footage does what no still can: the slush slides, stalls, builds a dam, and breaks through. The producer counted about seven events while making it in one spring and twenty or thirty the next."), React.createElement("p", {
    className: "ff-lede"
  }, "Seven and a half minutes, and the easiest way to see frazil ice without standing beside a freezing creek at dawn.")), React.createElement(NatureNotesFilm, {
    id: "frazil-ice",
    title: "Frazil Ice",
    youtubeId: "9V9p4mFEYXc",
    episode: 9,
    note: "Slush from the falls moving down Yosemite Creek on cold spring mornings, filmed by the park.",
    location: "frazil_ice",
    className: "fz-film__nn"
  }))), React.createElement("section", {
    className: "ff-band",
    id: "frazil-what",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT IT IS"), React.createElement("h2", null, "Waterfall mist, frozen, then poured"), React.createElement("p", {
    className: "ff-lede"
  }, "The park's definition: on some mornings, when the creeks are running relatively high but the temperature is below freezing, a creek may seem to be full of slush rather than water. That is frazil ice. It forms when waterfall mist freezes, then floats down the creek."), React.createElement("p", {
    className: "ff-lede"
  }, "The word comes from the French for cinders. The crystals start as thin flat discs, grow to about a tenth of an inch across, and stick to anything just below freezing: a rock, a bridge pier, each other. In the churning water below a big fall the whole creek can turn to a spongy mass that dams itself, rises, and breaks out somewhere new."), React.createElement("p", {
    className: "ff-note"
  }, "The mechanism and the measurements are from Yosemite Nature Notes, 1954 and 1961; the definition is the National Park Service's.")), React.createElement("ol", {
    className: "ff-hours fz-steps"
  }, React.createElement("li", null, React.createElement("span", null, "The day before"), React.createElement("p", null, "A warm spell melts snow fast and Yosemite Falls swells.")), React.createElement("li", null, React.createElement("span", null, "The night"), React.createElement("p", null, "A clear sky, and the temperature drops sharply below freezing.")), React.createElement("li", null, React.createElement("span", null, "In the fall"), React.createElement("p", null, "Spray freezes into crystals as it descends.")), React.createElement("li", null, React.createElement("span", null, "In the creek"), React.createElement("p", null, "The churning water below the Lower Fall drives the crystals under and through; they grip the rocks and each other.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Dawn to 9 a.m."), React.createElement("p", null, "Slush packs the channel, dams, spills, and moves downstream like slow lava.")), React.createElement("li", null, React.createElement("span", null, "Mid-morning"), React.createElement("p", null, "The sun warms the Valley and the flow eases. The banks can hold the ice for days."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "frazil-when",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split ff-split--end"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN"), React.createElement("h2", null, "A spring morning after a warm spell"), React.createElement("p", {
    className: "ff-lede"
  }, "The park says frazil ice can come in fall, winter or spring, whenever the falls carry relatively high flow and the Valley drops below freezing overnight. It comes most often in spring, especially April, sometimes in March and May. It cannot be booked: it is weather, a day or two of warning at best.")), React.createElement("dl", {
    className: "ff-conditions"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop",
    size: 24
  }), React.createElement("dt", null, "High water"), React.createElement("dd", null, "A warm spell first")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm",
    size: 24
  }), React.createElement("dt", null, "A hard night"), React.createElement("dd", null, "Well below freezing")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock",
    size: 24
  }), React.createElement("dt", null, "Early"), React.createElement("dd", null, "Before 9 a.m.")))), React.createElement("ol", {
    className: "ff-timeline"
  }, React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "Winter"), React.createElement("strong", null, "Possible"), React.createElement("p", null, "When storms or a thaw bring the falls up and the nights stay cold. Two of the recent reported events came in January and February.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "March"), React.createElement("strong", null, "Sometimes"), React.createElement("p", null, "The falls are building, the nights still freeze.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "April"), React.createElement("strong", null, "Most often"), React.createElement("p", null, "Big water from the melt and frosty clear nights: the classic month.")), React.createElement("li", {
    className: "is-tight"
  }, React.createElement("span", null, "May and early June"), React.createElement("strong", null, "In a big year"), React.createElement("p", null, "Only with high flow and a late cold snap."))), React.createElement(WebcamStrip, {
    variant: "board",
    only: ["Yosemite Falls", "Half Dome"]
  }), React.createElement("ol", {
    className: "ff-checks"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("strong", null, "Days before: the falls"), React.createElement("p", null, "A warm spell after snow, and the Yosemite Falls camera showing a thick white column.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("strong", null, "The evening: the low"), React.createElement("p", null, "A clear night forecast well below freezing on the Valley floor. The 1953 flow followed nights of 24, 23 and 27 degrees.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("strong", null, "Dawn: be there"), React.createElement("p", null, "The flow is usually done by 9 a.m. Park at Yosemite Falls and walk the paved loop.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "eye"
  }), React.createElement("strong", null, "On arrival: look, from the path"), React.createElement("p", null, "A white, slow-moving creek, ice heaped on the banks, the bridges rimmed in slush."))), React.createElement("div", {
    className: "ff-sources"
  }, React.createElement("h3", null, "Sources to keep open"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/frazilice.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS: Frazil ice ↗"), React.createElement("span", null, "The park's own page on it"))), React.createElement("li", null, React.createElement("a", {
    href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NWS point forecast, Yosemite Valley ↗"), React.createElement("span", null, "The overnight low is the number that matters"))), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS current conditions ↗"), React.createElement("span", null, "Trail and road closures, including Lower Yosemite Fall")))), React.createElement("p", {
    className: "ff-note"
  }, "Every live feed on one page: ", React.createElement(HomeLink, {
    go: go,
    location: "frazil_when",
    href: "/conditions"
  }, "the conditions board"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "frazil-where",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "WHERE TO WATCH",
    title: "Yosemite Creek, from the paved loop"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The park's most famous place for it is Yosemite Creek just below Lower Yosemite Fall, where the Lower Yosemite Fall loop crosses and follows the creek. It also forms on Ribbon Creek and Sentinel Creek, and in principle below any Valley waterfall with enough water on a hard morning."), React.createElement("figure", {
    className: "npsmap"
  }, React.createElement(FzCreekMap, null), React.createElement("figcaption", null, FZ_PINS.map(p => React.createElement("span", {
    key: p.n
  }, React.createElement("b", null, p.n), " ", p.label)), React.createElement("span", null, "Map: National Park Service (public domain), cropped."))), React.createElement("div", {
    className: "ff-split fz-cone"
  }, React.createElement("div", null, React.createElement("h3", null, "Not the ice cone"), React.createElement("p", {
    className: "ff-lede"
  }, "The ice cone is a different thing a little higher up. Through the winter, frozen spray and ice falling from the rim build a mound at the base of Upper Yosemite Fall, sometimes more than 300 feet tall, usually melted by mid-April. When the creek below runs white in spring, people have long said the cone has \"gone out.\" The park's naturalists corrected that in 1954: the slush is frazil ice, made fresh in the creek.")), React.createElement("p", {
    className: "ff-note"
  }, "Look for the cone from the Valley floor below Upper Yosemite Fall in winter and early spring. A 1937 park survey, worked against a photograph from John Muir's day, put that cone at 322 feet. Sources: the NPS Yosemite Falls page; Yosemite Nature Notes, 1954 and 1961.")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "frazil-safety",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "STAY OFF IT",
    title: "It looks like snow. It is slush over moving water."
  }), React.createElement("ul", {
    className: "ff-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "It will not hold you"), React.createElement("p", null, "Rangers: it is not a solid surface, and falling in and becoming trapped beneath it is a serious hazard. In 1953 a worker on snowshoes sank in and had to be pulled out.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "The creek can move"), React.createElement("p", null, "Packed ice dams the channel and the water breaks out somewhere new, suddenly. In 1953 it crossed the road and ran toward the lodge.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "Trails and bridges close"), React.createElement("p", null, "When ice covers the bridge and trail, the park closes the area until it melts and is checked. Obey the closures.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "eye",
    size: 26
  }), React.createElement("strong", null, "Watch from the path"), React.createElement("p", null, "The paved loop and its bridges, when open, give the view. Keep children and dogs well back from the banks."))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "Icy pavement."), " The same mornings that make frazil ice glaze the trail and the bridges. Wear shoes with grip, and carry traction if you have it. Check ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "current conditions"), " before you go."))), React.createElement("section", {
    className: "ff-band",
    id: "frazil-record",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE RECORD",
    title: "Ninety years of white mornings"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "The park's naturalists have photographed, measured and fought frazil ice since the 1930s. The biggest flows rearranged the creek; most just turn it white for a morning."), React.createElement("ol", {
    className: "ff-history"
  }, FZ_RECORD.map(([year, title, text, href, linkLabel]) => React.createElement("li", {
    key: year
  }, React.createElement("span", null, year), React.createElement("strong", null, title), React.createElement("p", null, text, " ", React.createElement("a", {
    href: href,
    ...(href.startsWith("http") ? {
      target: "_blank",
      rel: "noopener noreferrer"
    } : {})
  }, linkLabel))))))), React.createElement("section", {
    className: "hp-wrap hp-section ff-split",
    id: "frazil-faq",
    tabIndex: -1
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Frazil ice questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The rest of early spring: ", React.createElement(HomeLink, {
    go: go,
    location: "frazil_faq",
    href: "/articles/yosemite-in-march"
  }, "Yosemite in March"), " and ", React.createElement(HomeLink, {
    go: go,
    location: "frazil_faq",
    href: "/articles/yosemite-in-winter"
  }, "Yosemite in winter"), ". The falls through the year: ", React.createElement(HomeLink, {
    go: go,
    location: "frazil_faq",
    href: "/articles/yosemite-waterfalls-guide"
  }, "the waterfalls guide"), ". The same creek on full-moon nights: ", React.createElement(HomeLink, {
    go: go,
    location: "frazil_faq",
    href: "/moonbow"
  }, "the moonbow"), "."), React.createElement("div", {
    className: "ff-closing"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BE THERE BY DAWN"), React.createElement("h3", null, "Sleep close to the creek"), React.createElement("p", null, "The flow is usually over by 9 a.m. Yosemite Valley Lodge is beside the trailhead; outside the park, El Portal is 25 to 35 minutes away on the road that stays open all winter."), React.createElement(AvailabilityLink, {
    destination: elPortal.dest,
    list: "page_frazil_ice",
    slug: elPortal.id,
    className: "ff-book"
  }, "Search El Portal lodging ↗"), React.createElement("p", {
    className: "ff-disclosure fz-disclosure"
  }, "Availability search on Expedia; we may earn a commission. ", React.createElement("a", {
    href: "/affiliate"
  }, "Disclosure.")))), React.createElement("div", {
    className: "ff-faq"
  }, FZ_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))), React.createElement(HpGuideBand, {
    go: go,
    location: "frazil_ice",
    title: "Out early on a cold spring morning?",
    intro: "The Field Guide app carries the Valley's spring stops and waterfall walks with parking notes, and offline maps that work at the creek, where the signal does not.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Spring, watched from inside the park",
    heading: "Spring, watched from inside the park",
    blurb: "Sunday Field Notes follows the water each spring: the falls, the cold mornings that turn the creek white, and what the park's naturalists recorded in the same weeks a century ago.",
    location: "frazil_ice",
    tag: "frazil-ice"
  }));
}
window.FrazilIcePage = FrazilIcePage;
