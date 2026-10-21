var RD_CHECKED = "October 21, 2026";
var RD_NPS_CONDITIONS = "https://www.nps.gov/yose/planyourvisit/conditions.htm";
var RD_PHONE = "209-372-0200";
var RD_PHONE_TEL = "tel:+12093720200";
var RD_CALTRANS = "https://roads.dot.ca.gov/";
var RD_QUICKMAP = "https://quickmap.dot.ca.gov/";
var RD_SRC = {
  tioga: ["NPS: Tioga Road", "https://www.nps.gov/yose/planyourvisit/tiogaopen.htm"],
  glacier: ["NPS: Glacier Point", "https://www.nps.gov/yose/planyourvisit/glacierpoint.htm"],
  chains: ["NPS: Tire chain requirements", "https://www.nps.gov/yose/planyourvisit/tirechains.htm"],
  conditions: ["NPS: Current conditions", RD_NPS_CONDITIONS],
  rockfall2017: ["NPS news release, January 2017", "https://www.nps.gov/yose/learn/news/el-portal-road-highway-140-and-big-oak-flat-road-highway-120-closed-due-to-rockfall.htm"],
  only140: ["NPS news release, February 2017", "https://www.nps.gov/yose/learn/news/vehicular-access-to-yosemite-valley-remains-available-only-via-highway-140.htm"],
  ferguson: ["Caltrans District 10: Ferguson project", "https://dot.ca.gov/caltrans-near-me/district-10/district-10-current-projects/ferguson-slide-project"]
};
var ROADS = [{
  route: "is-tioga-road-open",
  name: "Tioga Road",
  short: "Tioga Road",
  title: "Is Tioga Road open?",
  crumb: "Tioga Road",
  eyebrow: "HIGHWAY 120 EAST · CRANE FLAT TO TIOGA PASS · SEASONAL",
  image: "img/tioga-road-above-tenaya-lake.jpg",
  alt: "A car on Tioga Road above Tenaya Lake, with granite domes and a bank of summer cloud over the high country",
  credit: "Photo: U.S. National Archives (public domain)",
  kind: "Seasonal",
  summary: "Closed by snow every winter. The park says it is typically open from late May or June until sometime in November.",
  intro: "Tioga Road is the park's seasonal crossing of the Sierra: closed by snow every winter, cleared by plows every spring. This page does not say whether it is open today. The park does, and its sources are directly below. Under them: how the road usually behaves through the year, from the park's own pages, and what to check before you drive.",
  caltrans: {
    number: "120",
    note: "Highway 120 outside the park, including the drop from Tioga Pass to Lee Vining and US 395."
  },
  facts: [["calendar", "Usual season", "Late May or June to November"], ["mountain", "Tioga Pass", "9,945 feet"], ["fuel", "No gas", "Crane Flat to Lee Vining"], ["car", "Run by", "National Park Service"]],
  pattern: [["Winter", "Closed to vehicles. Tioga Pass is the park's only eastern entrance, so while the road is closed there is no drive across the park to the east side.", "tioga"], ["Around April 15", "Plowing usually begins. The opening date moves with the snowpack, by weeks from one year to the next.", "tioga"], ["Late May or June, typically", "The road opens. The park posts plowing progress through the spring and announces the opening a day or two ahead. In 2026 it opened May 15.", "tioga"], ["September to closing", "Services in Tuolumne Meadows close weeks before the road does. A late-season day up high is drive-yourself and self-supported.", "tioga"], ["November, typically", "The road closes for the season with the first storm that sticks. There is no fixed closing date.", "tioga"]],
  rules: [["fuel", "Fill up at Crane Flat", "The last gas on the west side. There is none at Tuolumne Meadows; the next is Lee Vining, below the pass."], ["signal", "No signal to check with", "Cell service is close to nothing between Crane Flat and Lee Vining. Check the status before you leave the Valley or the gateway town."], ["therm", "Ice at the edges of the season", "Early and late in the year, mornings up high run below freezing and ice forms on the road at dawn and dusk."], ["route", "A closed road has no shortcut", "Through the park there is no other way east. Plan the east side by another pass, or plan the trip without it."]],
  reads: [["/tioga-opening", "The Tioga Road opening", "How the spring opening works, and what is really open in week one"], ["/articles/tioga-road-stop-by-stop", "Tioga Road, stop by stop", "Every turnout from Crane Flat to the pass"], ["/articles/tioga-road-opening-weekend", "The opening-weekend field guide", "Where to go in the first weeks, and where not to"], ["/dates", "Dates that matter", "The road windows beside the permit and campground deadlines"]],
  faq: [["Is Tioga Road open right now?", "This page does not say, on purpose. Check the National Park Service's current conditions page, or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1). Both come from the park; a website that copies them can be out of date by the time you read it."], ["When does Tioga Road usually open and close?", "The Park Service says it is typically open to vehicles from late May or June until sometime in November. Plowing usually begins around April 15, the opening date moves with the snowpack, and the park announces it a day or two ahead. In 2026 it opened May 15."], ["Can I drive across Yosemite to the east side when Tioga Road is closed?", "No. Tioga Pass is the park's only eastern entrance, so while Tioga Road is closed there is no drive across the park to Lee Vining and US 395."]]
}, {
  route: "is-glacier-point-road-open",
  name: "Glacier Point Road",
  short: "Glacier Point Road",
  title: "Is Glacier Point Road open?",
  crumb: "Glacier Point Road",
  eyebrow: "OFF THE WAWONA ROAD · BADGER PASS TO GLACIER POINT · SEASONAL",
  image: "img/clark-range-view-glacier-point-road.jpg",
  alt: "The Clark Range from a viewpoint on Glacier Point Road",
  credit: "Photo: Justin Johnsen / Wikimedia Commons (CC BY-SA 4.0)",
  kind: "Seasonal",
  summary: "Plowed only to Badger Pass in winter. The park says it is open to cars from about late May through October or November.",
  intro: "Glacier Point Road climbs from the Wawona Road to the rim above Yosemite Valley, and for much of the year it ends at Badger Pass. This page does not say whether it is open today. The park does, and its sources are directly below. Under them: how the road usually behaves through the year, from the park's own pages, and what to check before you drive.",
  caltrans: null,
  facts: [["calendar", "Usual season", "About late May through October or November"], ["snow", "Winter", "Plowed to Badger Pass only"], ["no", "Overnight parking", "None from October 15"], ["car", "Run by", "National Park Service"]],
  pattern: [["Winter", "The first five miles are plowed to Badger Pass, the ski area. Beyond it the road is closed to cars, and it is not possible to drive to Glacier Point.", "glacier"], ["Around April 15", "Plowing begins. The park says plainly that it cannot predict the opening date, even in late spring.", "glacier"], ["Usually May", "The road opens once plowing is done, announced a few days ahead, and chains can still be required in the first weeks. The park's standing language is late May through October or November. In 2026 it opened May 9.", "glacier"], ["Mid-May to September", "Between 10 a.m. and 4:30 p.m., when the Glacier Point lot fills, rangers stop cars at the Badger Pass turnoff, and a free shuttle runs from there to Glacier Point and the trailheads along the road.", "glacier"], ["From October 15", "Overnight parking anywhere on the road is prohibited.", "glacier"], ["Usually November", "The road closes to cars after the first significant snowfall, with no reopening promised.", "glacier"]],
  rules: [["snow", "No winter drive to the point", "In winter the road ends at Badger Pass. Glacier Point is a 10.5-mile ski or snowshoe from there, one way."], ["clock", "Before 10 or after 4:30", "In summer, arrive outside the managed hours and you drive through to Glacier Point yourself."], ["alert", "Fire closes it too", "In 2026 the Dome Fire closed the road from September 23 to October 10, in the middle of its season."], ["route", "The drive in is Highway 41", "Glacier Point Road leaves the Wawona Road south of Tunnel View; that highway's chain controls apply on the way."]],
  reads: [["/articles/glacier-point-how-to-visit", "How to visit Glacier Point", "The season, the summer shuttle rule, and the best hours"], ["/articles/glacier-point-road-open-2026", "Glacier Point Road, the first weeks", "What the early season on the road looks like"], ["/articles/sentinel-dome-and-taft-point", "Sentinel Dome and Taft Point", "The two short walks off the road"], ["/articles/badger-pass-ski-area", "Badger Pass", "Where the road ends in winter"]],
  faq: [["Is Glacier Point Road open right now?", "This page does not say, on purpose. Check the National Park Service's current conditions page, or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1). Both come from the park; a website that copies them can be out of date by the time you read it."], ["When does Glacier Point Road usually open and close?", "The Park Service's standing language is that the road is open to cars from approximately late May through October or November. Plowing begins around April 15, most openings fall in May, and the road closes after the first significant snowfall, usually in November. In 2026 it opened May 9."], ["Can you drive to Glacier Point in winter?", "No. In winter the road is plowed only as far as Badger Pass, five miles in, and the rest is closed to cars and groomed for skiing and snowshoeing."]]
}, {
  route: "is-highway-41-open",
  name: "Highway 41 (Wawona Road)",
  short: "Highway 41",
  title: "Is Highway 41 open?",
  crumb: "Highway 41",
  eyebrow: "WAWONA ROAD · SOUTH ENTRANCE · FISH CAMP AND OAKHURST",
  image: "img/tunnel-view-valley-spring.jpg",
  alt: "Yosemite Valley from Tunnel View, at the Valley end of the Wawona Road: El Capitan, Bridalveil Fall and Half Dome",
  credit: "Photo: Kyle D / Wikimedia Commons (public domain)",
  kind: "Winter chain controls",
  summary: "No seasonal closure; in winter the pattern is chain control. The park names it among the roads that need chains more often.",
  intro: "Highway 41 is the southern way in: through the South Entrance, past Wawona and the Mariposa Grove turnoff, and through the Wawona Tunnel to Tunnel View. This page does not say whether it is open today. The park and Caltrans do, and their sources are directly below. Under them: how the road usually behaves through the year, from the park's own pages, and what to check before you drive.",
  caltrans: {
    number: "41",
    note: "Highway 41 outside the park, from Fresno through Oakhurst and Fish Camp to the South Entrance."
  },
  facts: [["calendar", "Season", "No seasonal closure"], ["snow", "Chains", "Required more often than on Highway 140"], ["pin", "Entrance", "South Entrance"], ["car", "Run by", "Caltrans outside, NPS inside"]],
  pattern: [["November through March", "Chains are often required on roads inside and outside the park; less often in October and April, rarely in September or May. The park says it is not possible to predict whether you will need them.", "chains"], ["Whenever a control is up", "Every vehicle must carry chains, four-wheel drives and rental cars included, even when the control level lets it drive without mounting them.", "chains"], ["The Wawona Road in winter", "The park names Wawona Road (Highway 41) among the roads that need chains more often than Highway 140, along with Badger Pass Road and Big Oak Flat Road.", "chains"], ["Any month", "Storms, rockfall, fire and roadwork can close or slow any park road for hours or days. The park lists them on its current conditions page.", "conditions"]],
  rules: [["snow", "Chains in the trunk", "From November through March, carry them on any trip, whatever you drive."], ["route", "Two agencies, two sets of miles", "Caltrans runs Highway 41 up to the South Entrance; the park runs it from there to the Valley. Check both."], ["pin", "The same road serves three places", "Wawona, the Mariposa Grove turnoff and the Glacier Point Road junction all sit on it."], ["alert", "Call before you trust a map", "The recorded line is read out by the people at the gates. A routing app is not."]],
  reads: [["/articles/getting-to-yosemite", "The five entrances, compared", "Which highway fits which trip"], ["/articles/yosemite-tire-chains", "Tire chains in Yosemite", "When they are required, and what counts"], ["/articles/wawona-yosemite-guide", "Wawona", "The south end of the park, on this road"], ["/articles/mariposa-grove-how-to-visit", "The Mariposa Grove", "The sequoias off the South Entrance"]],
  faq: [["Is Highway 41 into Yosemite open right now?", "This page does not say, on purpose. Inside the park, check the National Park Service's current conditions page or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1). Outside the park, check Caltrans at roads.dot.ca.gov and enter 41."], ["Does Highway 41 close for the winter?", "It has no seasonal closure like Tioga Road's or Glacier Point Road's. The winter pattern is chain control: the park names the Wawona Road among the roads that need chains more often, with chain requirements common from November through March."]]
}, {
  route: "is-highway-120-open",
  name: "Highway 120 (Big Oak Flat Road)",
  short: "Highway 120",
  title: "Is Highway 120 open?",
  crumb: "Highway 120",
  eyebrow: "BIG OAK FLAT ROAD · BIG OAK FLAT ENTRANCE · GROVELAND",
  image: "img/big-oak-flat-road-tunnel.jpg",
  alt: "A tunnel on Big Oak Flat Road, the Highway 120 approach into Yosemite from the west",
  credit: "Photo: Famartin / Wikimedia Commons (CC BY-SA 3.0)",
  kind: "Winter chain controls",
  summary: "The west approach has no seasonal closure; chains are required more often. East of Crane Flat, Highway 120 is Tioga Road, which is seasonal.",
  intro: "Highway 120 enters from the west at the Big Oak Flat Entrance, past Groveland, and becomes the Big Oak Flat Road down to the Valley. At Crane Flat the same highway number turns east as Tioga Road, which is a different question with a different answer. This page does not say whether either is open today. The park and Caltrans do, and their sources are directly below.",
  caltrans: {
    number: "120",
    note: "Highway 120 outside the park, from Oakdale and Groveland to the Big Oak Flat Entrance."
  },
  facts: [["calendar", "Big Oak Flat Road", "No seasonal closure"], ["snow", "Chains", "Required more often than on Highway 140"], ["route", "East of Crane Flat", "Tioga Road, seasonal"], ["car", "Run by", "Caltrans outside, NPS inside"]],
  pattern: [["November through March", "Chains are often required on roads inside and outside the park; less often in October and April, rarely in September or May.", "chains"], ["The Big Oak Flat Road in winter", "The park names Big Oak Flat Road (Highway 120 from the west) among the roads that need chains more often than Highway 140.", "chains"], ["East of Crane Flat", "Highway 120 becomes Tioga Road, which the park says is typically open from late May or June until sometime in November.", "tioga"], ["Rockfall", "In January 2017 the park closed both the El Portal Road and the Big Oak Flat Road for rockfall. Closures like that come without a season.", "rockfall2017"]],
  rules: [["snow", "Chains in the trunk", "From November through March, carry them on any trip, whatever you drive."], ["route", "Two roads, one number", "A west-side status for Highway 120 says nothing about Tioga Road. Check the one you will drive."], ["fuel", "Crane Flat is the gas", "The station at the junction, pay at the pump, is the last fuel before Tioga Road. There is none at Tuolumne Meadows."], ["alert", "Call before you trust a map", "The recorded line is read out by the people at the gates. A routing app is not."]],
  reads: [["/articles/getting-to-yosemite", "The five entrances, compared", "Which highway fits which trip"], ["/articles/yosemite-tire-chains", "Tire chains in Yosemite", "When they are required, and what counts"], ["/articles/hetch-hetchy-the-other-yosemite-valley", "Hetch Hetchy", "The other valley, reached from this side"], ["/is-tioga-road-open", "Is Tioga Road open?", "The seasonal half of Highway 120"]],
  faq: [["Is Highway 120 into Yosemite open right now?", "This page does not say, on purpose. Inside the park, check the National Park Service's current conditions page or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1). Outside the park, check Caltrans at roads.dot.ca.gov and enter 120."], ["Is Highway 120 the same as Tioga Road?", "Partly. From the west, Highway 120 is the Big Oak Flat Road, which has no seasonal closure but often needs chains in winter. East of Crane Flat the same highway is Tioga Road, which closes for snow every winter."]]
}, {
  route: "is-highway-140-open",
  name: "Highway 140 (El Portal Road)",
  short: "Highway 140",
  title: "Is Highway 140 open?",
  crumb: "Highway 140",
  eyebrow: "EL PORTAL ROAD · ARCH ROCK ENTRANCE · MARIPOSA AND EL PORTAL",
  image: "img/merced-canyon-road-cory-goehring.jpg",
  alt: "Highway 140 in the Merced River canyon, climbing toward the Arch Rock entrance",
  credit: "Photo: Cory Goehring",
  kind: "Lowest; chains least often",
  summary: "Lower than the other entrance roads, so chains are required less often. It closes for rockslides and fires, without a schedule.",
  intro: "Highway 140 follows the Merced River canyon from Mariposa through El Portal to the Arch Rock Entrance, and from there it is the El Portal Road to the Valley. This page does not say whether it is open today. Caltrans and the park do, and their sources are directly below. Under them: how the road usually behaves, from the agencies' own pages, and what to check before you drive.",
  caltrans: {
    number: "140",
    note: "Highway 140 outside the park, from Merced and Mariposa through the canyon to the Arch Rock Entrance. Closures here do not appear on the park's road table."
  },
  facts: [["calendar", "Season", "No seasonal closure"], ["snow", "Chains", "Required less often than other entrances"], ["alert", "Closures", "Rockslides and fires, no schedule"], ["car", "Run by", "Caltrans outside, NPS inside"]],
  pattern: [["Winter", "The park says the El Portal Road is lower in elevation and has chain requirements less often than the other entrance roads. Less often is not never: when a control is up, every vehicle must carry chains.", "chains"], ["Without a schedule", "The canyon closes for rock and fire. In January 2017 the park closed the El Portal Road and the Big Oak Flat Road for rockfall.", "rockfall2017"], ["When the others close", "In February 2017 the park reported that vehicle access to Yosemite Valley was available only by Highway 140.", "only140"], ["Near El Portal", "Since the 2006 Ferguson slide, traffic has run on a temporary one-lane bypass under a signal. Caltrans's rock shed project is building the permanent fix, with its own planned closures announced in advance.", "ferguson"]],
  rules: [["route", "Caltrans first", "A closure at Briceburg is on Caltrans's list, not the park's. The park's table will truthfully say the El Portal Road is open."], ["clock", "The one-lane signal", "Allow a few minutes of waiting at the signal near El Portal on every trip."], ["snow", "Chains in the trunk anyway", "Less often is not never. Carry them from November through March."], ["pin", "The way around", "When 140 is shut, the detours are Highway 41 from the south and Highway 120 from the north, both long."]],
  reads: [["/articles/highway-140-closed-yosemite", "When Highway 140 is closed", "The detours, the bookings, and where to check"], ["/articles/getting-to-yosemite", "The five entrances, compared", "Which highway fits which trip"], ["/articles/yosemite-shuttle-and-yarts", "The Valley shuttle and YARTS", "The bus that runs this road"], ["/articles/yosemite-gateway-towns-compared", "The gateway towns, compared", "El Portal and Mariposa against the rest"]],
  faq: [["Is Highway 140 into Yosemite open right now?", "This page does not say, on purpose. Outside the park, check Caltrans at roads.dot.ca.gov and enter 140, or QuickMap. Inside the park, check the National Park Service's current conditions page or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1)."], ["Does Highway 140 need chains in winter?", "Less often than the other entrance roads. The park says the El Portal Road is lower in elevation and has chain requirements less often, but whenever a chain control is in effect every vehicle must carry chains, four-wheel drives and rentals included."]]
}];
var ROAD_BY_ROUTE = Object.fromEntries(ROADS.map(r => [r.route, r]));
function RdSource({
  k
}) {
  var s = RD_SRC[k];
  if (!s) return null;
  return React.createElement("a", {
    className: "rd-src",
    href: s[1],
    target: "_blank",
    rel: "noopener noreferrer"
  }, s[0], " ↗");
}
function RdOfficial({
  road
}) {
  var caltrans = road ? road.caltrans : {
    number: null,
    note: "Highways 41, 120 and 140 outside the park: type the route number."
  };
  return React.createElement("section", {
    className: "hp-wrap rd-official",
    id: "road-check",
    tabIndex: -1,
    "aria-labelledby": "rd-official-h"
  }, React.createElement("div", {
    className: "rd-official__head"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, React.createElement(EventIcon, {
    name: "alert",
    size: 16
  }), " CHECK THE OFFICIAL STATUS BEFORE YOU DRIVE"), React.createElement("h2", {
    id: "rd-official-h"
  }, "This page is not a live road report."), React.createElement("p", {
    className: "ff-lede"
  }, "Roads in and around Yosemite open and close on the park's word and Caltrans's, sometimes within the hour, for snow, rock, fire or work. These are the sources that know.")), React.createElement("ul", {
    className: "rd-official__list"
  }, React.createElement("li", null, React.createElement("a", {
    href: RD_NPS_CONDITIONS,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "NPS current conditions ↗"), React.createElement("span", null, "The park's own list of road status, closures and chain controls. The authoritative page for every road inside the park."))), React.createElement("li", null, React.createElement("a", {
    href: RD_PHONE_TEL
  }, React.createElement("strong", null, RD_PHONE), React.createElement("span", null, "The park's 24-hour road and weather line. Press 1, then 1. Call it in winter and spring before trusting any website, this one included."))), caltrans && React.createElement("li", null, React.createElement("a", {
    href: RD_CALTRANS,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("strong", null, "Caltrans road conditions ↗"), React.createElement("span", null, caltrans.number ? `Enter ${caltrans.number}. ` : "", caltrans.note)))), caltrans && React.createElement("p", {
    className: "ff-note rd-official__map"
  }, "Caltrans's live map of closures and chain controls: ", React.createElement("a", {
    href: RD_QUICKMAP,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "QuickMap ↗")), React.createElement("p", {
    className: "rd-checked"
  }, React.createElement("strong", null, "Last checked: ", RD_CHECKED, "."), " That is the date the patterns and links on this page were last reviewed against their sources, not a date on which any road was open or closed."));
}
function RdFaq({
  items,
  title,
  go,
  location
}) {
  return React.createElement("section", {
    className: "ff-band",
    id: "road-faq",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, title), React.createElement("p", {
    className: "ff-lede"
  }, "Every live feed the site reads, the webcams and the entrance waits, is on ", React.createElement(HomeLink, {
    go: go,
    location: location,
    href: "/conditions"
  }, "the conditions board"), ". The week's closures and roadwork from the park's own newspaper are on ", React.createElement(HomeLink, {
    go: go,
    location: location,
    href: "/now"
  }, "the Park Bulletin"), ".")), React.createElement("div", {
    className: "ff-faq"
  }, items.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a))))));
}
function RdLetter({
  road
}) {
  if (road && road.route === "is-tioga-road-open") {
    return React.createElement(HpLetter, {
      eyebrow: "ROAD ALERTS / FREE",
      title: "Email me the day it opens",
      heading: "Email me the day it opens",
      blurb: "One email the day the park announces Tioga Road is open, and one when it closes for the season, sent to the people who asked for it. Sunday Field Notes carries the plowing progress in between.",
      location: "road-status",
      tag: "alert-tioga",
      cta: "Email me ↗",
      terms: "Only when Tioga Road opens or closes. Unsubscribe whenever.",
      stamp: "ROAD ALERTS",
      paper: React.createElement(React.Fragment, null, "Tioga opens.", React.createElement("br", null), "Tioga closes.", React.createElement("br", null), React.createElement("em", null, "You hear once."))
    });
  }
  return React.createElement(HpLetter, {
    eyebrow: "ROAD ALERTS / FREE",
    title: "Email me when a road changes",
    heading: "Email me when a road changes",
    blurb: "One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. Sunday Field Notes carries the rest of the week from inside the park.",
    location: "road-status",
    tag: "alert-roads",
    cta: "Email me ↗",
    terms: "Only when a road changes. Unsubscribe whenever.",
    stamp: "ROAD ALERTS",
    paper: React.createElement(React.Fragment, null, "Roads open.", React.createElement("br", null), "Roads close.", React.createElement("br", null), React.createElement("em", null, "You hear once."))
  });
}
function RoadPage({
  go,
  route
}) {
  var road = ROAD_BY_ROUTE[route];
  if (!road) return null;
  var others = ROADS.filter(r => r.route !== road.route);
  var isTioga = road.route === "is-tioga-road-open";
  var toc = [["#road-check", "Official status"], ["#road-pattern", "The usual year"], ["#road-before", "Before you drive"], ["#road-other", "The other roads"], ["#road-faq", "Questions"]];
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-roads"
  }, React.createElement("div", {
    className: "ff-cover rd-cover"
  }, React.createElement(ResponsiveImage, {
    image: road.image,
    eager: true,
    className: "ff-cover__img",
    alt: road.alt,
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Road status",
      route: "road-status"
    }, {
      label: road.crumb
    }],
    eyebrow: road.eyebrow,
    title: road.title,
    intro: road.intro,
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "road_status_head",
      className: "hp-button",
      href: "#road-check"
    }, "Where to check today ", React.createElement("span", null, "↓")), isTioga ? React.createElement(HomeLink, {
      go: go,
      location: "road_status_head",
      className: "hp-link",
      href: "/tioga-opening"
    }, "How the spring opening works →") : React.createElement(HomeLink, {
      go: go,
      location: "road_status_head",
      className: "hp-link",
      href: "#road-pattern"
    }, "How it usually behaves ↓"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, road.credit)), React.createElement(RdOfficial, {
    road: road
  }), React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, road.facts.map(([icon, dt, dd]) => React.createElement("div", {
    key: dt
  }, React.createElement(EventIcon, {
    name: icon
  }), React.createElement("dt", null, dt), React.createElement("dd", null, dd)))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), toc.map(([href, label]) => React.createElement(HomeLink, {
    key: href,
    go: go,
    location: "road_status_toc",
    href: href
  }, label)))), React.createElement("section", {
    className: "ff-band",
    id: "road-pattern",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE USUAL YEAR, FROM THE PARK'S OWN PAGES",
    title: `How ${road.short} usually behaves`
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "A pattern, not a promise. Each line links the page it was read from; read that page, or call the line above, for this week."), React.createElement("ol", {
    className: "rd-pattern"
  }, road.pattern.map(([when, what, src]) => React.createElement("li", {
    key: when
  }, React.createElement("span", null, when), React.createElement("p", null, what), React.createElement(RdSource, {
    k: src
  })))), isTioga && React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("span", null, React.createElement("strong", null, "The spring opening has its own page."), " Why the date is announced only days ahead, what is open in week one and what is not, and the road west to east: ", React.createElement(HomeLink, {
    go: go,
    location: "road_status_tioga",
    href: "/tioga-opening"
  }, "the Tioga Road opening"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "road-before",
    tabIndex: -1
  }, React.createElement(HpHeading, {
    eyebrow: "BEFORE YOU DRIVE",
    title: "What to know on this road"
  }), React.createElement("ul", {
    className: "ff-rules"
  }, road.rules.map(([icon, head, text]) => React.createElement("li", {
    key: head
  }, React.createElement(EventIcon, {
    name: icon,
    size: 26
  }), React.createElement("strong", null, head), React.createElement("p", null, text)))), React.createElement("div", {
    className: "rd-reads"
  }, React.createElement("h3", null, "Read next"), React.createElement("ul", null, road.reads.map(([href, label, note]) => React.createElement("li", {
    key: href
  }, React.createElement(HomeLink, {
    go: go,
    location: "road_status_reads",
    href: href
  }, React.createElement("strong", null, label), React.createElement("span", null, note))))))), React.createElement("section", {
    className: "ff-band",
    id: "road-other",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "THE OTHER ROADS",
    title: "Is the rest of the park open?"
  }), React.createElement(RdRoadList, {
    go: go,
    roads: others,
    location: "road_status_other"
  }), React.createElement("p", {
    className: "ff-note"
  }, "All five on one page: ", React.createElement(HomeLink, {
    go: go,
    location: "road_status_other",
    href: "/road-status"
  }, "Yosemite road status"), "."))), React.createElement(RdFaq, {
    items: road.faq,
    title: `${road.short} questions, answered`,
    go: go,
    location: "road_status_faq"
  }), React.createElement(HpGuideBand, {
    go: go,
    location: "road-status",
    title: "Past the gate, the signal goes.",
    intro: "Most of the park has no cell service, including the roads on these pages. The Field Guide app carries offline maps, every stop with parking notes, and a trip planner that works without a signal.",
    sample: true
  }), React.createElement(RdLetter, {
    road: road
  }));
}
function RdRoadList({
  go,
  roads,
  location
}) {
  return React.createElement("ul", {
    className: "rd-roads"
  }, roads.map(r => React.createElement("li", {
    key: r.route
  }, React.createElement(HomeLink, {
    go: go,
    location: location,
    href: `/${r.route}`
  }, React.createElement("span", {
    className: "rd-roads__kind"
  }, r.kind), React.createElement("strong", null, r.title), React.createElement("em", null, r.name), React.createElement("span", {
    className: "rd-roads__sum"
  }, r.summary)))));
}
var RD_HUB_FAQ = [["Which Yosemite roads close for the winter?", "Two close for the season: Tioga Road, which the park says is typically open from late May or June until sometime in November, and Glacier Point Road beyond Badger Pass, open to cars from about late May through October or November. The three highways into Yosemite Valley, 41, 120 from the west and 140, have no seasonal closure; their winter pattern is chain control."], ["How do I check whether a Yosemite road is open today?", "Use the National Park Service's current conditions page, or call the park's 24-hour road and weather line, 209-372-0200 (press 1, then 1). For Highways 41, 120 and 140 outside the park, check Caltrans at roads.dot.ca.gov or QuickMap."], ["Which road into Yosemite needs chains least often?", "Highway 140, the El Portal Road. The park says it is lower in elevation and has chain requirements less often than the other entrance roads, and names Wawona Road, Big Oak Flat Road and Badger Pass Road among those that need them more often."]];
function RoadStatusPage({
  go
}) {
  return React.createElement("div", {
    className: "page hp-tool hp-event hp-roads"
  }, React.createElement("div", {
    className: "ff-cover rd-cover"
  }, React.createElement(ResponsiveImage, {
    image: "img/tioga-road-above-tenaya-lake.jpg",
    eager: true,
    className: "ff-cover__img",
    alt: "A car on Tioga Road above Tenaya Lake, with granite domes and a bank of summer cloud over the high country",
    sizes: "100vw"
  }), React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Road status"
    }],
    eyebrow: "FIVE ROADS · TWO SEASONAL · THREE YEAR-ROUND WAYS IN",
    title: "Is it open? Yosemite road status",
    intro: "Five roads decide most Yosemite trips: Tioga Road, Glacier Point Road, and the three highways into the Valley. None of these pages says whether a road is open today, because the park and Caltrans say it first and change it fastest. What each page does: point at the official status, lay out how the road usually behaves through the year from the park's own pages, and say what to check before you drive.",
    actions: React.createElement(React.Fragment, null, React.createElement(HomeLink, {
      go: go,
      location: "road_status_head",
      className: "hp-button",
      href: "#road-check"
    }, "Where to check today ", React.createElement("span", null, "↓")), React.createElement(HomeLink, {
      go: go,
      location: "road_status_head",
      className: "hp-link",
      href: "#road-list"
    }, "Road by road ↓"))
  }), React.createElement("p", {
    className: "ff-cover__credit"
  }, "Photo: U.S. National Archives (public domain)")), React.createElement(RdOfficial, {
    road: null
  }), React.createElement("section", {
    className: "ff-band",
    id: "road-list",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement(HpHeading, {
    eyebrow: "ROAD BY ROAD",
    title: "Two roads close for winter. Three stay in service."
  }), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "Tioga Road and Glacier Point Road close for snow every winter, on the park's schedule. Highways 41, 120 and 140 into the Valley have no seasonal closure, but chain controls, rockslides and fire close or slow them without warning. The spring opening of Tioga Road, in depth: ", React.createElement(HomeLink, {
    go: go,
    location: "road_status_list",
    href: "/tioga-opening"
  }, "the Tioga Road opening"), "."), React.createElement(RdRoadList, {
    go: go,
    roads: ROADS,
    location: "road_status_list"
  }))), React.createElement(RdFaq, {
    items: RD_HUB_FAQ,
    title: "Yosemite road questions, answered",
    go: go,
    location: "road_status_faq"
  }), React.createElement(HpGuideBand, {
    go: go,
    location: "road-status",
    title: "Past the gate, the signal goes.",
    intro: "Most of the park has no cell service, including the roads on these pages. The Field Guide app carries offline maps, every stop with parking notes, and a trip planner that works without a signal.",
    sample: true
  }), React.createElement(RdLetter, {
    road: null
  }));
}
window.RoadStatusPage = RoadStatusPage;
window.RoadPage = RoadPage;
window.ROAD_STATUS_ROUTES = ROADS.map(r => r.route);
