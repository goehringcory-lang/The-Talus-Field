var {
  useEffect: useEffectIt,
  useState: useStateIt
} = React;
function ItinerariesPage({
  go
}) {
  var [stopsById, setStopsById] = useStateIt(null);
  useEffectIt(() => {
    var cancelled = false;
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
  var tripUrl = it => {
    var ids = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
    return `/map?trip=${ids.join(",")}`;
  };
  return React.createElement("div", {
    className: "page hp-itin"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Itineraries"
    }],
    eyebrow: "ITINERARIES",
    title: "Yosemite, in day-sized pieces.",
    intro: "Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day.",
    aside: React.createElement("nav", {
      className: "hp-list hp-partindex",
      "aria-label": "The four plans"
    }, itineraries.map(it => React.createElement("a", {
      key: it.id,
      className: "hp-row",
      href: `#${it.id}`
    }, React.createElement("div", null, React.createElement("p", {
      className: "hp-eyebrow"
    }, (it.label || "").toUpperCase()), React.createElement("h3", null, it.title), React.createElement("b", null, it.days.length, " ", it.days.length === 1 ? "day" : "days", " ", React.createElement("span", null, "↓"))))))
  }), itineraries.map(it => React.createElement("section", {
    key: it.id,
    id: it.id,
    tabIndex: -1,
    className: "hp-wrap hp-section itin"
  }, React.createElement(HpHeading, {
    eyebrow: (it.label || "").toUpperCase(),
    title: it.title
  }), React.createElement("p", {
    className: "hp-sub"
  }, it.dek), React.createElement("p", {
    className: "itin__season"
  }, it.season), React.createElement("div", {
    className: "itin__days"
  }, it.days.map(day => React.createElement("div", {
    key: day.name,
    className: "itin__day"
  }, React.createElement("h3", {
    className: "itin__day-name"
  }, day.name), React.createElement("ol", {
    className: "itin__stops"
  }, day.stopIds.map(id => {
    var stop = stopsById && stopsById[id];
    return React.createElement("li", {
      key: id,
      className: "itin__stop"
    }, React.createElement("span", null, React.createElement("span", {
      className: "itin__stop-name"
    }, stop ? stop.name : id.replace(/-/g, " ")), stop && stop.blurb && React.createElement("span", {
      className: "itin__stop-blurb"
    }, stop.blurb)));
  }))))), React.createElement("a", {
    className: "hp-button",
    href: tripUrl(it),
    onClick: () => {
      if (window.track) window.track("itinerary_open_map", {
        itinerary: it.id
      });
    }
  }, "Open this trip on the map →"))), React.createElement("section", {
    className: "hp-wrap hp-section itin__after"
  }, React.createElement("p", {
    className: "hp-sub"
  }, "These plans are starting points, not homework. The", " ", React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "full map"), " ", "has every pin, and the trip builder saves whatever you assemble on your own device. For the reasoning behind the stops, start with", " ", React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "the planning guide"), "."), React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Every plan above needs a night between the days",
    note: "These are built on early starts, which is a lodging decision before it is an itinerary decision: a bed in the Valley or in El Portal buys the first two hours of the day, and Oakhurst costs you them. The full comparison of every in-park and gateway option is one page over.",
    list: "page_itineraries",
    slug: "itineraries",
    cta: "See what is available on your dates →"
  })), React.createElement(HpGuideBand, {
    go: go,
    location: "itineraries",
    title: "These plans, offline, in the park.",
    intro: "The Field Guide app carries the same curated stops with parking and timing notes, offline maps that keep working in the dead zones between them, and a day-by-day planner. One purchase, eighteen months of access.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "Get the conditions before you go",
    heading: "Get the conditions before you go",
    blurb: "Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed. Free.",
    location: "itineraries",
    tag: "itineraries"
  }));
}
window.ItinerariesPage = ItinerariesPage;
