var CONDITIONS_FORECASTS = [{
  label: "Yosemite Valley",
  note: "4,000 ft. The floor: most lodging, most trailheads, most of your walking.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.7456&lon=-119.5936"
}, {
  label: "Tuolumne Meadows",
  note: "8,600 ft. The high country runs 15 to 25 degrees colder than the Valley.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.8731&lon=-119.3503"
}, {
  label: "Wawona",
  note: "4,000 ft. The south end of the park, near Mariposa Grove.",
  href: "https://forecast.weather.gov/MapClick.php?lat=37.5341&lon=-119.6315"
}];
function ConditionsPage({
  go
}) {
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Conditions"), React.createElement("h1", null, "The park, right now."), React.createElement("p", {
    className: "page-head__dek"
  }, "Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 48
    }
  }, React.createElement("section", {
    style: {
      marginBottom: 64
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Webcams"), React.createElement("a", {
    href: "https://yosemite.org/webcams/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "All cameras →")), React.createElement(WebcamStrip, null)), React.createElement("section", {
    style: {
      marginBottom: 64,
      maxWidth: 680
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Entrance waits")), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--ink-1)",
      marginBottom: 16
    }
  }, "Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago."), React.createElement("div", {
    className: "conditions__waits"
  }, React.createElement(EntranceWaits, null))), React.createElement("section", {
    style: {
      marginBottom: 64,
      maxWidth: 680
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Forecasts")), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--ink-1)",
      marginBottom: 20
    }
  }, "The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go."), React.createElement("ul", {
    className: "conditions__list"
  }, CONDITIONS_FORECASTS.map(f => React.createElement("li", {
    key: f.label,
    className: "conditions__row"
  }, React.createElement("a", {
    href: f.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, f.label, " ↗"), React.createElement("span", null, f.note))))), React.createElement("section", {
    style: {
      marginBottom: 64,
      maxWidth: 680
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Roads and closures")), React.createElement("ul", {
    className: "conditions__list"
  }, React.createElement("li", {
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
    style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      lineHeight: 1.6,
      color: "var(--ink-2)",
      marginTop: 20
    }
  }, "In winter and spring, call the recorded road line at 209-372-0200 before trusting any website, including this one. For how conditions shape a plan, the", " ", React.createElement("a", {
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
  }, "itineraries"), " ", "adjust to what is open.")), React.createElement(GuidePromo, {
    go: go,
    location: "conditions",
    title: "Past the entrance, this page stops loading.",
    body: "Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead.",
    style: {
      maxWidth: 680,
      marginBottom: 56
    }
  }), React.createElement("div", {
    style: {
      maxWidth: 680,
      marginBottom: 96
    }
  }, React.createElement(NewsletterInline, {
    location: "conditions",
    tag: "conditions",
    heading: "Conditions change weekly",
    blurb: "The Sunday note carries what matters: what opened, what closed, what the week ahead looks like from inside the park. Free."
  }))));
}
window.ConditionsPage = ConditionsPage;
