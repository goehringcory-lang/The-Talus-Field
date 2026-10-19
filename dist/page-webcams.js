var CAM_NOTES = [{
  name: "Half Dome",
  from: "Ahwahnee Meadow, looking east",
  shows: "The face of Half Dome above the eastern end of Yosemite Valley. The best of the five for weather: if the dome is in cloud, the Valley is having a day.",
  best: "Late afternoon, when the west light hits the face."
}, {
  name: "Yosemite Falls",
  from: "Yosemite Valley, looking north",
  shows: "Upper Yosemite Fall on the north wall. This is the camera to check before a spring trip and the one that answers the August question, which is whether there is any water at all.",
  best: "Morning, before the wall goes flat."
}, {
  name: "El Capitan",
  from: "Turtleback Dome, looking east into the Valley",
  shows: "El Capitan and the western Valley from above Highway 41. A wide view rather than a close one, and the most useful of the five for judging haze and smoke.",
  best: "Any clear hour; sunset for the light on the nose."
}, {
  name: "Wawona",
  from: "Wawona, the park's south end",
  shows: "Conditions an hour south of the Valley and about thirty minutes from the Mariposa Grove, at about 4,000 feet. Worth checking separately in winter, when Wawona and the Valley genuinely differ.",
  best: "Midday in winter, to see whether snow is lying."
}, {
  name: "High Sierra",
  from: "Near Sentinel Dome at about 8,000 feet, looking east",
  shows: "Half Dome from above, with Clouds Rest behind it and Tenaya Peak and Cathedral Peak of the Tuolumne high country on the skyline. The only one of the five that shows the high country at all, and the one to check for snow on the peaks above Tioga Road.",
  best: "Early morning, before the haze builds over the Valley."
}];
var WC_FAQ = [["Are there live webcams in Yosemite?", "Yes. The Yosemite Conservancy runs the public cameras, five of which are embedded here: Half Dome from Ahwahnee Meadow, Upper Yosemite Fall, El Capitan from Turtleback Dome, Wawona, and the High Sierra camera near Sentinel Dome. They are still-image cameras that refresh on the order of minutes rather than video streams, so a reload will not always change the picture."], ["Is there a webcam at Tuolumne Meadows or Tioga Pass?", "Not outside summer. The Yosemite Conservancy's High Sierra camera, near Sentinel Dome at about 8,000 feet, shows Cathedral Peak and Tenaya Peak of the Tuolumne high country from a distance. Yosemite Hospitality runs a summer-only camera at the Tuolumne Meadows Store, roughly June through September, linked from the NPS webcams page. For the high country the substitutes are the NPS Tioga Road page for plowing and opening status in spring, and the park's current conditions page once the road is open."], ["Why does the Yosemite Falls webcam show no waterfall?", "Because there is no waterfall. Yosemite Falls is fed by snowmelt from a shallow basin above the rim and is usually dry by late August, staying dry until the first storms of November. The camera is working; the fall is seasonal."], ["Which Yosemite webcam is best for checking the weather?", "Half Dome, for the Valley: if the dome is in cloud, the Valley is having a day. Check El Capitan beside it, which is wide enough to show haze and smoke. Neither says anything about the high country, because the Valley floor sits at 4,000 feet and Tuolumne Meadows at 8,600; for snow on the peaks above Tioga Road, use the High Sierra camera."], ["How often do the Yosemite webcams update?", "They are still images, not video, and they refresh on the order of minutes rather than seconds. A page reload will not always change the picture, and nothing on them will show you a bear walking past."], ["Can I see Tioga Road on a webcam?", "Not the road itself from the park's cameras. Caltrans QuickMap carries highway cameras along SR-120 and US-395 near Lee Vining, including Conway Summit, which is the east-side check. Whether Tioga Road is open is on the NPS current conditions page, and how the season works is on the Tioga opening page."]];
function WebcamsPage({
  go
}) {
  var toc = [["#cams-live", "Live now"], ["#cams-high", "High country"], ["#cams-each", "What each shows"], ["#cams-read", "How to read them"], ["#cams-more", "Other cameras"], ["#cams-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-webcams"
  }, React.createElement("div", {
    className: "ff-cover wc-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-valley-cumulus.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "Half Dome framed between El Capitan and the Valley wall under a bank of summer cloud",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Webcams"
    }],
    eyebrow: "LIVE VIEWS · HALF DOME · YOSEMITE FALLS · EL CAPITAN",
    title: "Yosemite webcams",
    intro: "The live cameras worth checking before you drive in, what each one actually shows, and how often it refreshes. Five load on this page. The rest are one link away, because the operators would rather you watched them at home.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "webcams_head",
      className: "hp-button",
      href: "#cams-live"
    }, "See the cameras ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "webcams_head",
      className: "hp-link",
      href: "#cams-read"
    }, "How to read them ↓"))
  }, React.createElement(AffiliateDisclosure, null)), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: elijahjcobb / Pexels")), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "camera"
  }), React.createElement("dt", null, "The cameras"), React.createElement("dd", null, "Five, on this page")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "The refresh"), React.createElement("dd", null, "Minutes, not seconds")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "eye"
  }), React.createElement("dt", null, "The format"), React.createElement("dd", null, "Still images")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "The operator"), React.createElement("dd", null, "Yosemite Conservancy"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "webcams_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section hp-webcams__live",
    id: "cams-live",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    go: go,
    location: "webcams",
    eyebrow: "FOUR CAMERAS",
    title: "Live now",
    link: {
      href: "https://yosemite.org/webcams/",
      label: "All Conservancy cameras ↗"
    }
  }), React.createElement(WebcamStrip, null)), React.createElement("section", {
    className: "ff-band",
    id: "cams-high",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HIGH COUNTRY"), React.createElement("h2", null, "Tuolumne & Tioga"), React.createElement("p", {
    className: "ff-lede"
  }, "The Conservancy's High Sierra camera sits near Sentinel Dome at about 8,000 feet and looks east. Half Dome fills the foreground, Clouds Rest rises behind it, and Tenaya Peak and Cathedral Peak mark the Tuolumne high country on the skyline. It is the one working camera that shows the high country, from a distance."), React.createElement("p", {
    className: "ff-lede"
  }, "There is no live camera at Tuolumne Meadows or Tioga Pass itself outside summer. Yosemite Hospitality's ", React.createElement("a", {
    href: "https://www.travelyosemite.com/plan/webcams/tuolumne-meadows-with-fairview-dome",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tuolumne Meadows Store camera"), ", looking at Fairview Dome, runs roughly June through September; its picture has not updated since October 2025 and the ", React.createElement("a", {
    href: "https://www.nps.gov/media/webcam/view.htm?id=81B46511-1DD8-B71B-0BF4530A57767712",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS listing"), " marks it inactive."), React.createElement("p", {
    className: "ff-note"
  }, "For the road itself, Caltrans ", React.createElement("a", {
    href: "https://quickmap.dot.ca.gov/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "QuickMap"), " carries highway cameras along SR-120 and US-395 near Lee Vining, including Conway Summit, which is the east-side check. Whether the road is open is on the ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "NPS current conditions page"), ", and how the season works is on ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_high",
    href: "/tioga-opening"
  }, "the Tioga opening page"), ".")), React.createElement("div", {
    className: "wc-high"
  }, React.createElement(WebcamStrip, {
    only: ["High Sierra"]
  }), React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement("a", {
    href: "https://yosemite.org/webcams/high-sierra/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "High Sierra camera ↗")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "cams-each",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "WHAT EACH CAMERA SHOWS",
    title: "Five views, five jobs"
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "All five are still images rather than video streams. They refresh on the order of minutes rather than seconds, which is why a page reload does not always change the picture and why nothing here is going to show you a bear walking past."), React.createElement("ul", {
    className: "wc-cams"
  }, CAM_NOTES.map(c => React.createElement("li", {
    key: c.name
  }, React.createElement("h3", null, c.name, " webcam"), React.createElement("p", {
    className: "wc-cams__from"
  }, React.createElement(EventIcon, {
    name: "pin",
    size: 16
  }), c.from), React.createElement("p", null, c.shows), React.createElement("p", {
    className: "wc-cams__best"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 16
  }), React.createElement("span", null, React.createElement("b", null, "Best hour"), " ", c.best)))))), React.createElement("section", {
    className: "ff-band",
    id: "cams-read",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "HOW TO READ THEM",
    title: "Four rules for a camera"
  }), React.createElement("ol", {
    className: "ff-checks wc-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "eye"
  }), React.createElement("strong", null, "Check two, not one"), React.createElement("p", null, "A single camera tells you about one wall. Half Dome plus El Capitan tells you whether the whole Valley is clear, socked in, or hazy, and those are three different days. For a climber, ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/articles/watching-climbers-el-capitan"
  }, "stand in El Capitan Meadow with binoculars"), ".")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("strong", null, "Elevation lies to you"), React.createElement("p", null, "The Valley floor sits at 4,000 feet and Tuolumne Meadows at 8,600. A clear Valley camera says nothing about whether it is snowing on ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/tioga-opening"
  }, "Tioga Road"), ", and in shoulder season it frequently is. Wawona is the useful third check.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("strong", null, "A dry waterfall is not a broken camera"), React.createElement("p", null, "Every August someone concludes the Yosemite Falls cam has failed. The fall is seasonal and usually gone by late August. ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/articles/yosemite-waterfalls-guide"
  }, "The flow-by-month table"), " says which falls are running on your dates.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("strong", null, "They are not a conditions report"), React.createElement("p", null, "A camera shows one frame of one place. For road status and closures use ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/now"
  }, "the Park Bulletin"), "; for forecasts and entrance waits, ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/conditions"
  }, "the conditions page"), "; for the drive in, ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_read",
    href: "/distances"
  }, "the drive-time table"), "."))))), React.createElement("div", {
    className: "hp-wrap hp-section hp-reading"
  }, React.createElement("div", {
    className: "hp-reading__column"
  }, React.createElement(LodgingCta, {
    destination: "El Portal, California",
    heading: "If the cameras say go",
    note: React.createElement(React.Fragment, null, "A clear Valley on two cameras is a reason to go soon, and the bed is the hard part at short notice. El Portal is the closest town, 25 to 35 minutes from the Valley on Highway 140, the low road that takes rain on the days the others take snow. In shoulder season,", " ", React.createElement(AvailabilityLink, {
      destination: "Groveland, California",
      list: "page_webcams",
      slug: "groveland",
      name: "Groveland lodging search"
    }, "Groveland"), " ", "is the easier last-minute booking, 65 to 80 minutes out on Highway 120."),
    list: "page_webcams",
    slug: "el-portal",
    cta: "Search El Portal lodging →"
  }), React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ENTRANCE WAITS, LIVE"), React.createElement(EntranceWaits, null)))), React.createElement("section", {
    className: "ff-band",
    id: "cams-more",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE OTHER CAMERAS",
    title: "Sources to keep open"
  }), React.createElement("div", {
    className: "ff-sources wc-sources"
  }, React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/webcams/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "Yosemite Conservancy webcams ↗"), React.createElement("span", null, "The operator of the five above, with its full set including views this page does not embed. Always the current list."))), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS current conditions ↗"), React.createElement("span", null, "Road status, closures, and any camera the park itself runs."))), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/photosmultimedia/webcams.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS webcams page ↗"), React.createElement("span", null, "Lists the park's others, including Yosemite Hospitality's summer-only Tuolumne Meadows Store camera.")))), React.createElement("p", {
    className: "ff-note"
  }, "Until Tioga Road opens, the honest substitutes for a high-country camera are the NPS Tioga Road page for plowing status and ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_more",
    href: "/tioga-opening"
  }, "the opening page"), " for how the season works. Camera images are served by their operators, not by this site, and a camera that is down hides its own tile above rather than showing a broken image. If one has moved for good, tell me on ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_more",
    href: "/contact"
  }, "the contact page"), " and it gets fixed.")))), React.createElement("section", {
    className: "hp-wrap hp-section ff-split",
    id: "cams-faq",
    tabIndex: -1
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite webcam questions, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "The rest of the morning-of check: ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_faq",
    href: "/conditions"
  }, "entrance waits, parking and forecasts"), ", the ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_faq",
    href: "/now"
  }, "Park Bulletin"), " for roads and closures, and ", React.createElement(HomeLink, {
    go: go,
    location: "webcams_faq",
    href: "/dates"
  }, "the dates that decide a trip"), ".")), React.createElement("div", {
    className: "ff-faq"
  }, WC_FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))), React.createElement(HpGuideBand, {
    go: go,
    location: "webcams",
    title: "No signal past the gate",
    intro: "Cameras are for before you leave. Once you are in the park there is no service to load one. The Field Guide app carries offline maps, trailhead parking notes and GPS that works with the phone in airplane mode.",
    sample: true
  }), React.createElement(HpLetter, {
    eyebrow: "SUNDAY FIELD NOTES / FREE",
    title: "What the cameras are showing this week",
    heading: "What the cameras are showing this week",
    blurb: "What the park is doing right now: what is open, what is flowing, and what changed.",
    location: "webcams",
    tag: "webcams"
  }));
}
window.WebcamsPage = WebcamsPage;
