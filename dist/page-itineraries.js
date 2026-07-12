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
    var url = window.POINTS_URL || "/points.geojson";
    fetch(url).then(r => r.ok ? r.json() : null).then(data => {
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
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Itineraries"), React.createElement("h1", null, "Yosemite, in day-sized pieces."), React.createElement("p", {
    className: "page-head__dek"
  }, "Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 48
    }
  }, itineraries.map(it => React.createElement("section", {
    key: it.id,
    id: it.id,
    className: "itin"
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, it.label), React.createElement("h2", {
    className: "itin__title"
  }, it.title), React.createElement("p", {
    className: "itin__dek"
  }, it.dek), React.createElement("p", {
    className: "itin__season"
  }, it.season), it.days.map(day => React.createElement("div", {
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
    }, React.createElement("span", {
      className: "itin__stop-name"
    }, stop ? stop.name : id.replace(/-/g, " ")), stop && stop.blurb && React.createElement("span", {
      className: "itin__stop-blurb"
    }, stop.blurb));
  })))), React.createElement("a", {
    className: "btn btn--ghost",
    href: tripUrl(it),
    onClick: () => {
      if (window.track) window.track("itinerary_open_map", {
        itinerary: it.id
      });
    }
  }, "Open this trip on the map →"))), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--ink-2)",
      maxWidth: 680,
      margin: "56px 0"
    }
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
  }, "the planning guide"), "."), React.createElement("div", {
    style: {
      maxWidth: 680,
      marginBottom: 96
    }
  }, React.createElement(NewsletterInline, {
    location: "itineraries",
    tag: "itineraries",
    heading: "Get the conditions before you go",
    blurb: "Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed. Free."
  }))));
}
window.ItinerariesPage = ItinerariesPage;
