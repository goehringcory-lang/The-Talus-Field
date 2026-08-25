var CAM_NOTES = [{
  name: "Half Dome",
  from: "Ahwahnee Meadow, looking east",
  shows: "The face of Half Dome above the eastern end of Yosemite Valley. The best of the four for weather: if the dome is in cloud, the Valley is having a day.",
  best: "Late afternoon, when the west light hits the face."
}, {
  name: "Yosemite Falls",
  from: "Yosemite Valley, looking north",
  shows: "Upper Yosemite Fall on the north wall. This is the camera to check before a spring trip and the one that answers the August question, which is whether there is any water at all.",
  best: "Morning, before the wall goes flat."
}, {
  name: "El Capitan",
  from: "Turtleback Dome, looking east into the Valley",
  shows: "El Capitan and the western Valley from above Highway 41. A wide view rather than a close one, and the most useful of the four for judging haze and smoke.",
  best: "Any clear hour; sunset for the light on the nose."
}, {
  name: "Wawona",
  from: "Wawona, the park's south end",
  shows: "Conditions an hour south of the Valley and twenty minutes from the Mariposa Grove, at about 4,000 feet. Worth checking separately in winter, when Wawona and the Valley genuinely differ.",
  best: "Midday in winter, to see whether snow is lying."
}];
function WebcamsPage({
  go
}) {
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "Webcams"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Live views"), React.createElement("h1", null, "Yosemite webcams"), React.createElement("p", {
    className: "page-head__dek"
  }, "The live cameras worth checking before you drive in, what each one actually shows, and how often it refreshes. Four load on this page. The rest are one link away, because the operators would rather you watched them at home."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 40
    }
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement("h2", null, "Live now"), React.createElement("a", {
    href: "https://yosemite.org/webcams/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "All Conservancy cameras →")), React.createElement(WebcamStrip, null)), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 48,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "What each camera shows"), React.createElement("p", null, "All four are still-image cameras rather than video streams. They refresh on the order of minutes rather than seconds, which is why a page reload does not always change the picture and why nothing here is going to show you a bear walking past."), CAM_NOTES.map(c => React.createElement("p", {
    key: c.name
  }, React.createElement("strong", null, c.name, "."), " ", c.from, ". ", c.shows, " Best hour: ", c.best.toLowerCase())), React.createElement("h2", null, "How to actually read them"), React.createElement("p", null, React.createElement("strong", null, "Check two, not one."), " A single camera tells you about one wall. Half Dome plus El Capitan tells you whether the whole Valley is clear, socked in, or hazy, and those are three different days."), React.createElement("p", null, React.createElement("strong", null, "Elevation lies to you."), " The Valley floor sits at 4,000 feet and Tuolumne Meadows at 8,600. A clear Valley camera says nothing about whether it is snowing on", " ", React.createElement("a", {
    href: "/tioga-opening"
  }, "Tioga Road"), ", and in shoulder season it frequently is. Wawona is the useful third check for the south end."), React.createElement("p", null, React.createElement("strong", null, "A dry waterfall is not a broken camera."), " Every August someone concludes the Yosemite Falls cam has failed. It has not; the fall is seasonal and usually gone by late August.", " ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "The flow-by-month table"), " says which falls are running on your dates."), React.createElement("p", null, React.createElement("strong", null, "They are not a conditions report."), " A camera shows one frame of one place. For road status, closures and what the park says about the current week, use", " ", React.createElement("a", {
    href: "/now",
    onClick: e => {
      e.preventDefault();
      go("now");
    }
  }, "the Park Bulletin"), ", and for forecasts and entrance waits use", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "the conditions page"), ".")), React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Entrance waits, live"), React.createElement(EntranceWaits, null)), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 48
    }
  }, React.createElement("h2", null, "The other cameras"), React.createElement("p", null, React.createElement("strong", null, "Yosemite Conservancy"), " runs the four above plus its full set, including views this page does not embed:", " ", React.createElement("a", {
    href: "https://yosemite.org/webcams/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "yosemite.org/webcams"), ". They are the operator, so their page is always the current list."), React.createElement("p", null, React.createElement("strong", null, "The National Park Service"), " keeps its own current conditions page, which is where road status and any camera the park itself runs are published:", " ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "nps.gov current conditions"), "."), React.createElement("p", null, React.createElement("strong", null, "For the high country and the east side"), ", there is no Conservancy camera at Tuolumne Meadows or Tioga Pass, which is the single most requested view the park does not have on this list. Until the road opens, the honest substitutes are the NPS Tioga Road page for plowing status and", " ", React.createElement("a", {
    href: "/tioga-opening"
  }, "the opening page"), " for how the season works."), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "Camera images are served by their operators, not by this site, and a camera that is down hides its own tile above rather than showing a broken image. If one has moved for good, tell me on", " ", React.createElement("a", {
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "the contact page"), " ", "and it gets fixed.")), React.createElement(GuidePromo, {
    go: go,
    location: "webcams",
    title: "No signal past the gate",
    body: "Cameras are for before you leave. Once you are in the park there is no service to load one. The Field Guide app carries offline maps, trailhead parking notes and GPS that works with the phone in airplane mode. One purchase, eighteen months of access.",
    style: {
      marginTop: 56,
      marginBottom: 40
    }
  }), React.createElement(NewsletterInline, {
    location: "webcams",
    tag: "webcams",
    heading: "What the cameras are showing this week",
    blurb: "One short Sunday letter on what the park is doing right now: what is open, what is flowing, and what changed. Free."
  })));
}
window.WebcamsPage = WebcamsPage;
