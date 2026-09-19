var {
  useState,
  useMemo,
  useCallback
} = React;
var CONDITIONS_FORECASTS = [{
  label: "Yosemite Valley",
  elevationFt: 4000,
  note: "The floor: most lodging, most trailheads, most of your walking.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"
}, {
  label: "Wawona",
  elevationFt: 4000,
  note: "The south end of the park, near Mariposa Grove.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315"
}, {
  label: "Tuolumne Meadows",
  elevationFt: 8600,
  note: "The high country runs 15 to 25 degrees colder than the Valley.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503"
}];
var ELEVATION_CEILING_FT = 10000;
function ConditionsReadout({
  waits,
  lots
}) {
  var today = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    } catch (e) {
      return "";
    }
  }, []);
  var rows = [];
  if (waits && waits.longest) {
    rows.push({
      key: "waits",
      label: "Longest gate wait",
      value: waits.longest.text,
      detail: waits.longest.name,
      tone: waits.longest.tone
    });
  }
  if (lots && lots.total) {
    rows.push({
      key: "lots",
      label: "Lots open",
      value: `${lots.open} of ${lots.total}`,
      detail: lots.open === 0 ? "All full" : null,
      tone: lots.open === 0 ? "long" : "good"
    });
  }
  return React.createElement("aside", {
    className: "readout",
    "aria-label": "Live readings"
  }, React.createElement("div", {
    className: "readout__top"
  }, React.createElement("span", {
    className: "eyebrow readout__eyebrow"
  }, "Live readings"), React.createElement("span", {
    className: "readout__pulse"
  }, React.createElement("span", {
    className: "readout__dot",
    "aria-hidden": "true"
  }), "Now")), today && React.createElement("div", {
    className: "readout__date"
  }, today), rows.length ? React.createElement("ul", {
    className: "readout__list"
  }, rows.map(row => React.createElement("li", {
    key: row.key,
    className: "readout__row"
  }, React.createElement("span", {
    className: "readout__label"
  }, row.label, row.detail && React.createElement("span", {
    className: "readout__detail"
  }, row.detail)), React.createElement("span", {
    className: `readout__value readout__value--${row.tone}`
  }, row.value)))) : React.createElement("p", {
    className: "readout__quiet"
  }, "The park's live feeds are quiet right now. Everything below still links straight to the source."), React.createElement("p", {
    className: "readout__foot"
  }, "National Park Service. Both readings refresh every five minutes."));
}
function ConditionsPage({
  go
}) {
  var [waits, setWaits] = useState(null);
  var [lots, setLots] = useState(null);
  var onWaits = useCallback(digest => setWaits(digest), []);
  var onLots = useCallback(digest => setLots(digest), []);
  return React.createElement("div", {
    className: "page page--conditions"
  }, React.createElement("div", {
    className: "page-head page-head--split"
  }, React.createElement("div", {
    className: "wrap cond-head"
  }, React.createElement("div", {
    className: "cond-head__lede"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Conditions"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Conditions"), React.createElement("h1", null, "The park, right now."), React.createElement("p", {
    className: "page-head__dek"
  }, "Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window.")), React.createElement(ConditionsReadout, {
    waits: waits,
    lots: lots
  }))), React.createElement("div", {
    className: "wrap cond-body"
  }, React.createElement("section", {
    className: "cond-section"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Entrance waits"), React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "Why the mornings matter →")), React.createElement("p", {
    className: "cond-lede"
  }, "Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago."), React.createElement(EntranceWaits, {
    variant: "board",
    onData: onWaits
  })), React.createElement("section", {
    className: "cond-section"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Webcams"), React.createElement("a", {
    href: "/webcams",
    onClick: e => {
      e.preventDefault();
      go("webcams");
    }
  }, "All cameras, and how to read them →")), React.createElement(WebcamStrip, {
    variant: "board"
  })), React.createElement("section", {
    className: "cond-section"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Forecasts"), React.createElement("a", {
    href: "https://www.weather.gov/hnx/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "National Weather Service ↗")), React.createElement("p", {
    className: "cond-lede"
  }, "The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go."), React.createElement("div", {
    className: "elev"
  }, React.createElement("div", {
    className: "elev__plot",
    "aria-hidden": "true"
  }, React.createElement("span", {
    className: "elev__grid",
    style: {
      bottom: "20%"
    }
  }, React.createElement("i", null, "2,000 ft")), React.createElement("span", {
    className: "elev__grid",
    style: {
      bottom: "40%"
    }
  }, React.createElement("i", null, "4,000 ft")), React.createElement("span", {
    className: "elev__grid",
    style: {
      bottom: "60%"
    }
  }, React.createElement("i", null, "6,000 ft")), React.createElement("span", {
    className: "elev__grid",
    style: {
      bottom: "80%"
    }
  }, React.createElement("i", null, "8,000 ft")), React.createElement("div", {
    className: "elev__bars"
  }, CONDITIONS_FORECASTS.map(f => React.createElement("div", {
    key: f.label,
    className: "elev__col"
  }, React.createElement("div", {
    className: `elev__bar${f.elevationFt >= 6000 ? " elev__bar--high" : ""}`,
    style: {
      height: `${f.elevationFt / ELEVATION_CEILING_FT * 100}%`
    }
  }, React.createElement("span", {
    className: "elev__ft"
  }, f.elevationFt.toLocaleString(), " ft")))))), React.createElement("div", {
    className: "elev__cards"
  }, CONDITIONS_FORECASTS.map(f => React.createElement("div", {
    key: f.label,
    className: "fc"
  }, React.createElement("div", {
    className: `fc__name${f.elevationFt >= 6000 ? " fc__name--high" : ""}`
  }, f.label), React.createElement("p", {
    className: "fc__note"
  }, f.note), React.createElement("a", {
    className: "fc__link",
    href: f.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Point forecast ↗")))))), React.createElement("div", {
    className: "cond-split"
  }, React.createElement("section", null, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Parking lots")), React.createElement("p", {
    className: "cond-lede"
  }, "With no entry reservation in 2026, the Valley's lots are what ration a summer day: on the first busy Saturday of the season all Valley parking was full before noon. Be through the gate before 8 a.m. or after 4 p.m. on a summer weekend. Live lot status from the National Park Service appears here when the park publishes it."), React.createElement(ParkingNow, {
    variant: "board",
    onData: onLots
  })), React.createElement("section", null, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Roads and closures")), React.createElement("p", {
    className: "cond-lede"
  }, "Road status changes faster than any page can promise, this one included, so nothing here claims to know whether a gate is open. These three do."), React.createElement("ul", {
    className: "conditions__list"
  }, React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "The Park Bulletin"), React.createElement("span", null, "Our own board: road and area status, alerts, and the free-program clock, rewritten each time the park publishes a new Yosemite Guide.")), React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS current conditions ↗"), React.createElement("span", null, "Road status, chain controls, trail closures, and campground status. The authoritative page.")), React.createElement("li", {
    className: "conditions__row"
  }, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The Yosemite Guide ↗"), React.createElement("span", null, "The park's own seasonal newspaper: shuttle maps, program schedules, hours."))), React.createElement("p", {
    className: "cond-note"
  }, "For how conditions shape a plan, the", " ", React.createElement("a", {
    href: "/planning",
    onClick: e => {
      e.preventDefault();
      go("planning");
    }
  }, "planning guide"), " ", "covers the seasonal calendar, and the", " ", React.createElement("a", {
    href: "/itineraries",
    onClick: e => {
      e.preventDefault();
      go("itineraries");
    }
  }, "itineraries"), " ", "adjust to what is open."))), React.createElement("a", {
    className: "dialplate",
    href: "tel:+12093720200"
  }, React.createElement("span", {
    className: "dialplate__copy"
  }, React.createElement("span", {
    className: "eyebrow eyebrow--moss"
  }, "When the web is wrong"), React.createElement("span", {
    className: "dialplate__say"
  }, "In winter and spring, call the recorded road line before trusting any website, including this one. It is read out by the people standing at the gates.")), React.createElement("span", {
    className: "dialplate__num"
  }, React.createElement("span", {
    className: "dialplate__digits"
  }, "209-372-0200"), React.createElement("span", {
    className: "dialplate__label"
  }, "NPS recorded road line"))), React.createElement("div", {
    className: "cond-asks"
  }, React.createElement(GuidePromo, {
    go: go,
    location: "conditions",
    title: "Past the entrance, this page stops loading.",
    body: "Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead."
  }), React.createElement(NewsletterInline, {
    location: "conditions",
    tag: "alert-roads",
    heading: "Email me when a road changes",
    blurb: "One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. The Sunday note carries the rest of the week from inside the park. Free."
  }))));
}
window.ConditionsPage = ConditionsPage;
