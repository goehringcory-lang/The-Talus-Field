var {
  useEffect: useEffectStart,
  useState: useStateStart
} = React;
var START_LOCATION = "start-here";
var START_FACTS = [{
  label: "Reservation",
  value: "None needed in 2026"
}, {
  label: "Entrance",
  value: "$35 per car, 7 days"
}, {
  label: "Days",
  value: "Two is the honest minimum"
}, {
  label: "Best window",
  value: "Late May to June, then September and October"
}, {
  label: "Arrive",
  value: "Through the gate before 8 a.m."
}];
var START_NPS_MAP = {
  image: "img/nps-yosemite-park-map.jpg",
  alt: "The official National Park Service map of Yosemite National Park, with Yosemite Valley, Glacier Point, the Mariposa Grove and Tuolumne Meadows marked 1 to 4",
  credit: "Map: National Park Service (public domain), restoration by National Park Maps. Numbered pins added.",
  source: "https://www.nps.gov/yose/planyourvisit/maps.htm"
};
var START_PLACES = [{
  id: "place-valley",
  n: "1",
  name: "Yosemite Valley",
  pin: [28.4, 63.2],
  drive: "Start here",
  season: "Open all year",
  image: "img/yosemite-falls-spring-blossoms-cory-goehring.jpg",
  alt: "Upper Yosemite Fall framed by spring blossoms from the Valley floor",
  credit: "Cory Goehring",
  line: "The canyon floor. You stand at the bottom and look up.",
  dos: ["Tunnel View at first light, then Bridalveil Fall", "The Lower Yosemite Fall loop and Cook's Meadow before the lots fill at mid-morning", "A slow hour on a rock by the Merced", "Back to Valley View or Tunnel View for last light"],
  facts: [["Getting in", "Arch Rock on Hwy 140, the all-weather route"], ["Best hour", "Through the gate before 8 a.m., or after 4 p.m."], ["Waterfalls", "Peak in May, mostly dry by August"], ["Closest accommodations", "El Portal, 25 to 35 minutes. Mariposa, 45 to 60."]],
  link: {
    href: "/articles/yosemite-in-one-or-two-days",
    label: "One day in Yosemite: the Valley sequence"
  }
}, {
  id: "place-glacier-point",
  n: "2",
  name: "Glacier Point",
  pin: [37.1, 65.0],
  drive: "About an hour from the Valley",
  season: "Glacier Point Road closes for winter",
  image: "img/half-dome-sunset-glacier-point-joshua-earle.jpg",
  alt: "Half Dome at sunset from Glacier Point",
  credit: "Joshua Earle / Unsplash",
  line: "The same canyon from the top edge, at eye level with Half Dome.",
  dos: ["Washburn Point first, for Vernal and Nevada Falls stacked in their staircase", "Glacier Point itself: a 0.3-mile paved walk to the 7,200-foot overlook", "Sentinel Dome and Taft Point from one trailhead, about 2.2 miles round trip each", "Late afternoon puts the light on Half Dome rather than behind it"],
  facts: [["From the Valley", "About 30 miles, an hour each way"], ["Season", "Most openings fall in May; closes after the first big snow"], ["Parking", "The lot fills by mid-morning in summer"], ["In winter", "Skis or snowshoes from Badger Pass only"]],
  link: {
    href: "/articles/glacier-point-how-to-visit",
    label: "Glacier Point: how to visit"
  }
}, {
  id: "place-mariposa-grove",
  n: "3",
  name: "Mariposa Grove",
  pin: [31.1, 94.5],
  drive: "About an hour from the Valley",
  season: "Open all year; the grove road closes to cars in winter",
  image: "img/mariposa-grove-grizzly-giant-nieves.jpg",
  alt: "The Grizzly Giant in the Mariposa Grove",
  credit: "Nieves / Pexels",
  line: "Giant sequoias that have been growing since before the Roman Empire.",
  dos: ["Park at the Welcome Plaza by the South Entrance; the free shuttle covers the last two miles", "The Grizzly Giant Loop, about two miles among the oldest trees", "Take the first shuttle of the morning or the last hour before it stops, never noon", "In winter, walk the closed grove road two quiet miles up"],
  facts: [["From the Valley", "About an hour each way"], ["Shuttle", "Free, no ticket, about every 15 minutes"], ["Pair it with", "The Wawona Meadow Loop, a flat 3.5 miles"], ["Closest accommodations", "Oakhurst: right for the grove, wrong for the Valley"]],
  link: {
    href: "/articles/mariposa-grove-how-to-visit",
    label: "Mariposa Grove: how to visit"
  }
}, {
  id: "place-tuolumne",
  n: "4",
  name: "Tuolumne Meadows",
  pin: [61.2, 44.1],
  drive: "About 1.5 hours, closer to 2 in July",
  season: "Tioga Road closes for winter",
  image: "img/tuolumne-meadows-lembert-dome.jpg",
  alt: "Tuolumne Meadows with Lembert Dome behind",
  credit: "Pacific Southwest Region USFWS / Wikimedia Commons (public domain)",
  line: "The high country: open granite and meadow at 8,600 feet, and half the crowd.",
  dos: ["Olmsted Point for the back of Half Dome, then the shore of Tenaya Lake", "Pothole Dome, a mile round trip at the meadow's west end", "Soda Springs and Parsons Memorial Lodge, a flat mile and a half", "Lembert Dome, 2.8 miles and 850 feet, for the earned view"],
  facts: [["From the Valley", "55 to 60 miles, 1.5 hours each way, closer to 2 in July"], ["Season", "Tioga Road opens late May or June, closes with the first serious snow"], ["Weather", "Off the open granite before the afternoon thunderheads"], ["Give it", "Its own day. It deserves more than a drive-through."]],
  link: {
    href: "/articles/tuolumne-meadows-in-a-day",
    label: "Tuolumne Meadows in a day"
  }
}];
var START_PLAN_IDS = [{
  id: "1day",
  guide: {
    href: "/articles/yosemite-in-one-or-two-days",
    label: "The one-and-two-day guide"
  }
}, {
  id: "2day",
  guide: {
    href: "/articles/yosemite-in-one-or-two-days",
    label: "The one-and-two-day guide"
  }
}, {
  id: "3day",
  guide: {
    href: "/articles/yosemite-in-three-to-five-days",
    label: "The three-to-five-day guide"
  }
}];
var START_ANSWERS = [{
  q: "Do I need a reservation?",
  lines: ["No. There is no entry reservation in 2026, on any date.", "$35 per car for seven days. Visitors who are not U.S. residents add $100 each, age 16 and up."],
  link: {
    href: "/articles/yosemite-without-reservations-2026",
    label: "The 2026 reservation guide"
  }
}, {
  q: "When should I go?",
  lines: ["Late May through June, for the waterfalls and every road open.", "September and October: thinner crowds, low gold light, dry falls."],
  link: {
    href: "/articles/when-to-visit-yosemite-2026-crowd-forecast",
    label: "The crowd forecast"
  }
}, {
  q: "How many days?",
  lines: ["Two full days is the honest minimum.", "Three sees the park's range, from the canyon floor to alpine meadow."],
  link: {
    href: "/articles/yosemite-in-three-to-five-days",
    label: "The three-to-five-day guide"
  }
}, {
  q: "Where should I stay?",
  lines: ["In the park if you can: beds open 366 days ahead.", "Otherwise Mariposa, the safest first-timer's town, 45 to 60 minutes out."],
  link: {
    href: "/articles/yosemite-gateway-towns-compared",
    label: "The gateway towns compared"
  }
}, {
  q: "Which entrance?",
  lines: ["Five gates, nothing alike. Pick by month and by your first stop.", "Arch Rock on Hwy 140 is the all-weather way into the Valley."],
  link: {
    href: "/articles/getting-to-yosemite",
    label: "Getting to Yosemite"
  }
}, {
  q: "What about permits?",
  lines: ["Every day hike is permit-free, with one exception: Half Dome.", "Glacier Point, the grove and the waterfalls are not ticketed."],
  link: {
    href: "/articles/yosemite-walk-up-and-day-of-permits",
    label: "Walk-up and day-of permits"
  }
}];
var START_MISTAKES = [{
  title: "Arriving at ten",
  text: "Valley lots fill by late morning, and by 8 a.m. on summer weekends."
}, {
  title: "Trusting the phone",
  text: "Service is mostly gone past the gates. Download offline maps in town."
}, {
  title: "A quarter tank",
  text: "No gas in the Valley. The pumps are at Crane Flat and Wawona."
}, {
  title: "Food in the car",
  text: "Bears open cars. Daylight only, out of sight, never overnight."
}, {
  title: "Doing too much",
  text: "Three things well beats seven from the driver's seat."
}];
var START_THEN = [{
  href: "/articles/yosemite-in-three-to-five-days",
  label: "Three to five days"
}, {
  href: "/articles/when-to-visit-yosemite-2026-crowd-forecast",
  label: "The crowd forecast"
}, {
  href: "/articles/yosemite-valley-parking-guide",
  label: "The Valley parking guide"
}, {
  href: "/articles/camping-in-yosemite-first-time",
  label: "First-time camping"
}];
var startStopName = (id, byId) => byId && byId[id] && byId[id].name || id.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());
function StartPlacesMap({
  go
}) {
  return React.createElement("div", {
    className: "start-map"
  }, React.createElement("figure", {
    className: "start-map__figure"
  }, React.createElement("div", {
    className: "start-map__frame"
  }, React.createElement(ResponsiveImage, {
    image: START_NPS_MAP.image,
    alt: START_NPS_MAP.alt,
    sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 55vw, 700px"
  }), START_PLACES.map(p => React.createElement("a", {
    key: p.id,
    className: "start-map__pin",
    href: `#${p.id}`,
    style: {
      left: `${p.pin[0]}%`,
      top: `${p.pin[1]}%`
    },
    "aria-label": `${p.n}. ${p.name}`,
    onClick: e => {
      var el = document.getElementById(p.id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  }, p.n))), React.createElement("figcaption", null, START_NPS_MAP.credit)), React.createElement("div", {
    className: "start-map__key"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE OFFICIAL PARK MAP"), React.createElement("ol", null, START_PLACES.map(p => React.createElement("li", {
    key: p.id
  }, React.createElement("span", {
    className: "start-num",
    "aria-hidden": "true"
  }, p.n), React.createElement("span", null, React.createElement("strong", null, p.name), React.createElement("b", null, p.drive), React.createElement("small", null, p.season))))), React.createElement("p", {
    className: "start-map__note"
  }, "The red notes on the map mark where Tioga Road and Glacier Point Road close for winter. What is open this week is on", " ", React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    href: "/now"
  }, "the Park Bulletin"), "."), React.createElement("div", {
    className: "start-map__links"
  }, React.createElement("a", {
    className: "hp-link",
    href: START_NPS_MAP.source,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The full-size map at nps.gov ↗"), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: "/map"
  }, "Build your own route on the trip map ↗"))));
}
function StartPlace({
  place,
  flip,
  go
}) {
  return React.createElement("section", {
    className: `start-place${flip ? " start-place--flip" : ""}`,
    id: place.id,
    "aria-labelledby": `${place.id}-h`,
    tabIndex: -1
  }, React.createElement("figure", {
    className: "start-place__photo"
  }, React.createElement(ResponsiveImage, {
    image: place.image,
    alt: place.alt,
    sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 620px"
  }), React.createElement("figcaption", null, "Photo: ", place.credit)), React.createElement("div", {
    className: "start-place__body"
  }, React.createElement("p", {
    className: "start-place__meta"
  }, React.createElement("span", {
    className: "start-num",
    "aria-hidden": "true"
  }, place.n), React.createElement("span", {
    className: "start-chip"
  }, place.season)), React.createElement("h3", {
    id: `${place.id}-h`
  }, place.name), React.createElement("p", {
    className: "start-place__line"
  }, place.line), React.createElement("p", {
    className: "hp-eyebrow start-place__label"
  }, "WHAT TO DO, IN ORDER"), React.createElement("ul", {
    className: "start-bullets"
  }, place.dos.map(d => React.createElement("li", {
    key: d
  }, d))), React.createElement("dl", {
    className: "start-place__facts"
  }, place.facts.map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("dt", null, k), React.createElement("dd", null, v)))), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: place.link.href
  }, place.link.label, " ↗")));
}
function StartPlan({
  plan,
  guide,
  earlier,
  byId,
  go
}) {
  var ids = window.getItineraryStopIds ? window.getItineraryStopIds(plan.id) : [];
  return React.createElement("article", {
    className: "start-plan"
  }, React.createElement("p", {
    className: "start-plan__len"
  }, plan.label), React.createElement("h3", null, plan.title), React.createElement("p", {
    className: "start-plan__dek"
  }, plan.dek), React.createElement("div", {
    className: "start-plan__days"
  }, plan.days.map(day => {
    var key = day.stopIds.join(",");
    var label = day.name.replace(/,\s.*$/, "");
    if (earlier.has(key)) {
      return React.createElement("p", {
        key: day.name,
        className: "start-plan__repeat"
      }, React.createElement("span", null, label), React.createElement("em", null, "as in the plan before"));
    }
    return React.createElement("div", {
      key: day.name,
      className: "start-plan__day"
    }, React.createElement("p", {
      className: "start-plan__dayname"
    }, day.name), React.createElement("ol", null, day.stopIds.map(id => React.createElement("li", {
      key: id
    }, startStopName(id, byId)))));
  })), React.createElement("p", {
    className: "start-plan__season"
  }, React.createElement("strong", null, "Season."), " ", plan.season), React.createElement("a", {
    className: "hp-button start-plan__map",
    href: `/map?trip=${ids.join(",")}`,
    onClick: () => {
      if (window.track) window.track("cta_click", {
        location: START_LOCATION,
        target: "/map",
        plan: plan.id
      });
    }
  }, "Open this plan on the trip map ", React.createElement("span", null, "↗")), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: guide.href
  }, guide.label, " ↗"));
}
function StartHerePage({
  go
}) {
  var [stopsById, setStopsById] = useStateStart(null);
  useEffectStart(() => {
    var cancelled = false;
    if (!window.POINTS_URL) return undefined;
    fetch(window.POINTS_URL).then(r => r.ok ? r.json() : null).then(data => {
      if (cancelled || !data) return;
      var byId = {};
      (data.features || []).forEach(f => {
        byId[f.properties.id] = f.properties;
      });
      setStopsById(byId);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  var itineraries = window.ITINERARIES || [];
  var plans = START_PLAN_IDS.map(p => ({
    ...p,
    plan: itineraries.find(it => it.id === p.id)
  })).filter(p => p.plan);
  var halfDay = itineraries.find(it => it.id === "halfday");
  var articles = (window.START_HERE || []).map(slug => (window.ARTICLES || []).find(a => a.slug === slug)).filter(Boolean);
  var hero = {
    image: "img/tunnel-view-valley-spring.jpg",
    alt: "Yosemite Valley from Tunnel View in spring",
    credit: "Kyle D / Wikimedia Commons (public domain)"
  };
  return React.createElement("div", {
    className: "page hp-start"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Start here"
    }],
    eyebrow: "FOR FIRST-TIME VISITORS",
    title: "Planning your first trip to Yosemite? Start here.",
    intro: "The four places worth the drive, a plan for one, two or three days, and the answers every first-timer needs, from a naturalist who has worked in this park for close to two decades. Five minutes here, then go deep only where your trip needs it.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: START_LOCATION,
      className: "hp-button",
      href: "#places"
    }, "See the four places ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: START_LOCATION,
      className: "hp-link",
      href: "#itineraries"
    }, "Pick an itinerary ↓")),
    aside: React.createElement("figure", {
      className: "start-hero"
    }, React.createElement(ResponsiveImage, {
      image: hero.image,
      alt: hero.alt,
      eager: true,
      sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 660px"
    }), React.createElement("figcaption", null, React.createElement("span", null, "Tunnel View, the first stop of a first morning"), React.createElement("span", null, hero.credit)))
  }), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "start-facts",
    "aria-label": "The short answers"
  }, START_FACTS.map(f => React.createElement("div", {
    key: f.label
  }, React.createElement("dt", null, f.label), React.createElement("dd", null, f.value)))), React.createElement("nav", {
    className: "start-jump",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    href: "#places"
  }, "01 The four places"), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    href: "#itineraries"
  }, "02 One, two or three days"), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    href: "#reading"
  }, "03 Read these first"), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    href: "#answers"
  }, "04 Quick answers"))), React.createElement("section", {
    className: "hp-wrap start-section",
    id: "places",
    tabIndex: -1,
    "aria-labelledby": "places-h"
  }, React.createElement(HpHeading, {
    id: "places-h",
    eyebrow: "01 / THE FOUR PLACES",
    title: "Four places that earned their fame"
  }), React.createElement("p", {
    className: "start-lede"
  }, "Yosemite is four parks wearing one name. The Valley is a canyon you look up from; the rim looks down into it; the high country is open granite at 8,600 feet; the sequoias stand in the far south. They are an hour or more apart, in directions that point away from each other, so give each one its own day."), React.createElement(StartPlacesMap, {
    go: go
  }), React.createElement("div", {
    className: "start-places"
  }, START_PLACES.map((p, i) => React.createElement(StartPlace, {
    key: p.id,
    place: p,
    flip: i % 2 === 1,
    go: go
  })))), plans.length > 0 && React.createElement("section", {
    className: "start-band",
    id: "itineraries",
    tabIndex: -1,
    "aria-labelledby": "itineraries-h"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement(HpHeading, {
    id: "itineraries-h",
    eyebrow: "02 / ITINERARIES",
    title: "One, two or three days"
  }), React.createElement("p", {
    className: "start-lede"
  }, "Each plan is the site's own, in drive order, west to east along each road, so it loads onto the trip map as a route you can actually run. Every longer plan starts with the shorter one."), React.createElement("div", {
    className: "start-plans"
  }, plans.map((p, i) => {
    var earlier = new Set();
    plans.slice(0, i).forEach(prev => prev.plan.days.forEach(d => earlier.add(d.stopIds.join(","))));
    return React.createElement(StartPlan, {
      key: p.id,
      plan: p.plan,
      guide: p.guide,
      earlier: earlier,
      byId: stopsById,
      go: go
    });
  })), React.createElement("div", {
    className: "start-halfday"
  }, halfDay && React.createElement("p", null, React.createElement("strong", null, "Arriving late?"), " ", halfDay.dek), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: "/itineraries"
  }, "Every plan, the half day included ↗")))), articles.length > 0 && React.createElement("section", {
    className: "hp-wrap start-section",
    id: "reading",
    tabIndex: -1,
    "aria-labelledby": "reading-h"
  }, React.createElement(HpHeading, {
    id: "reading-h",
    eyebrow: "03 / START HERE READING",
    title: "Read these four first"
  }), React.createElement("p", {
    className: "start-lede"
  }, "The long answers behind this page, in the order most first-timers need them."), React.createElement("div", {
    className: "hp-journal-grid start-reads"
  }, articles.map(a => React.createElement(HpArticleCard, {
    key: a.slug,
    article: a,
    go: go,
    location: START_LOCATION
  }))), React.createElement("nav", {
    className: "start-then",
    "aria-label": "Further reading"
  }, React.createElement("span", null, "Then"), START_THEN.map(l => React.createElement(HomeLink, {
    key: l.href,
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: l.href
  }, l.label, " ↗")))), React.createElement("section", {
    className: "hp-wrap start-section",
    id: "answers",
    tabIndex: -1,
    "aria-labelledby": "answers-h"
  }, React.createElement(HpHeading, {
    id: "answers-h",
    eyebrow: "04 / QUICK ANSWERS",
    title: "The six questions everyone asks"
  }), React.createElement("div", {
    className: "start-answers"
  }, START_ANSWERS.map(a => React.createElement("div", {
    key: a.q,
    className: "start-answer"
  }, React.createElement("h3", null, a.q), React.createElement("ul", {
    className: "start-bullets"
  }, a.lines.map(l => React.createElement("li", {
    key: l
  }, l))), React.createElement(HomeLink, {
    go: go,
    location: START_LOCATION,
    className: "hp-link",
    href: a.link.href
  }, a.link.label, " ↗")))), React.createElement("div", {
    className: "start-mistakes"
  }, React.createElement("h3", null, "Five mistakes that spoil first trips"), React.createElement("ol", null, START_MISTAKES.map((m, i) => React.createElement("li", {
    key: m.title
  }, React.createElement("span", {
    "aria-hidden": "true"
  }, i + 1), React.createElement("strong", null, m.title), React.createElement("p", null, m.text))))), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "The first decision with a deadline",
    note: "Where you sleep decides what your mornings look like. In-park beds open 366 days ahead and the closest gateway rooms go next; the later you book, the longer your drive.",
    list: "page_start_here",
    slug: "start-here",
    cta: "See what is available on your dates →"
  })), React.createElement(HpGuideBand, {
    go: go,
    location: START_LOCATION,
    title: "The first trip is the one that needs a guide",
    intro: "The Field Guide app carries 57 hikes with parking and timing notes, offline maps for a park with no cell service, and the local tactics for every major region. One purchase, eighteen months of access.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "The Sunday Letter",
    heading: "The Sunday Letter",
    blurb: "What is open, what is booking out, and what the week looked like from inside the park. One letter a week while you plan. Free.",
    location: START_LOCATION,
    tag: "start-here"
  }));
}
window.StartHerePage = StartHerePage;
