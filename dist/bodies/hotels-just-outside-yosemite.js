window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["hotels-just-outside-yosemite"] = function HotelsJustOutsideYosemiteBody() {
  var TOC = [["#hj-compare", "Side by side"], ["#hj-rush-creek", "Rush Creek"], ["#hj-tenaya", "Tenaya"], ["#hj-evergreen", "Evergreen"], ["#hj-yosemite-view", "Yosemite View"], ["#hj-drive", "Drive times"], ["#hj-seasons", "Seasons"], ["#hj-choose", "Which to book"], ["#hj-questions", "Questions"]];
  var FAQ = [["What is the best hotel just outside Yosemite?", "It depends on the gate. For Yosemite Valley with the shortest drive, Yosemite View Lodge in El Portal, about 30 minutes from the Valley by the Park Service's count for El Portal. From the Bay Area on Highway 120, Rush Creek Lodge, half a mile from the Big Oak Flat entrance. For the Mariposa Grove and Wawona, Tenaya at Yosemite in Fish Camp. For Hetch Hetchy or a dog, Evergreen Lodge."], ["Which hotel is closest to Yosemite Valley?", "Of these four, Yosemite View Lodge in El Portal on Highway 140, about 2 miles from the Arch Rock entrance. The Park Service lists El Portal at 14 miles and 30 minutes from Yosemite Valley."], ["How far is Rush Creek Lodge from Yosemite Valley?", "The lodge says 30 minutes on average. The Park Service's table puts the Big Oak Flat entrance station, half a mile from the lodge, at 25 miles and 45 minutes from the Valley. Plan on the Park Service figure."], ["How far is Tenaya at Yosemite from the park entrance?", "About two miles from the South Entrance on Highway 41, in Fish Camp. The Park Service lists Fish Camp at 39 miles and 1 hour 15 minutes from Yosemite Valley, so it suits the Mariposa Grove and Wawona better than a Valley-only trip."], ["Is Evergreen Lodge open in winter?", "Mostly. The lodge describes a temporary six-week closure in January, reopening on Presidents Day weekend. Confirm dates with the lodge. Its sister property, Rush Creek Lodge, is open year-round."], ["Which hotels near Yosemite allow dogs?", "Evergreen Lodge takes dogs in its Deluxe and Two Bedroom Family Cabins, up to two, for $85 a night with prior approval. Tenaya at Yosemite and Yosemite View Lodge are listed as pet friendly, without published terms we could read, so ask first. Rush Creek Lodge allows only registered service animals."]];
  var LODGES = [{
    id: "#hj-yosemite-view",
    name: "Yosemite View Lodge",
    place: "El Portal, Highway 140",
    gate: "Arch Rock, about 2 miles",
    valley: "El Portal: 14 mi, 30 min (NPS)",
    season: "Year-round road; YARTS stop all year",
    pets: "Listed as pet friendly; confirm terms",
    cls: "is-valley"
  }, {
    id: "#hj-rush-creek",
    name: "Rush Creek Lodge",
    place: "Highway 120, east of Groveland",
    gate: "Big Oak Flat, half a mile",
    valley: "Lodge: 30 min. Entrance station: 25 mi, 45 min (NPS)",
    season: "Open year-round, per its sister lodge",
    pets: "Service animals only",
    cls: "is-valley"
  }, {
    id: "#hj-evergreen",
    name: "Evergreen Lodge",
    place: "Evergreen Road, off Highway 120",
    gate: "Hetch Hetchy, 1 mile; Big Oak Flat, 7 miles",
    valley: "Lodge: 40 min",
    season: "Closed about six weeks in January",
    pets: "Dogs in two cabin types, $85 a night",
    cls: "is-north"
  }, {
    id: "#hj-tenaya",
    name: "Tenaya at Yosemite",
    place: "Fish Camp, Highway 41",
    gate: "South Entrance, about 2 miles",
    valley: "Fish Camp: 39 mi, 1 hr 15 min (NPS)",
    season: "Ice rink November to March; outdoor pools in warm months",
    pets: "Listed as pet friendly; confirm terms",
    cls: "is-south"
  }];
  var DRIVES = [["El Portal", "14 mi", "30 min", "Yosemite View Lodge"], ["Big Oak Flat Entrance Station", "25 mi", "45 min", "Rush Creek, half a mile outside it"], ["South Entrance", "35 mi", "1 hr", "Tenaya, about two miles outside it"], ["Fish Camp", "39 mi", "1 hr 15 min", "Tenaya"], ["Mariposa Grove", "37 mi", "1 hr 15 min", "Tenaya's neighbor"], ["Hetch Hetchy parking", "38 mi", "1 hr 15 min", "Evergreen's neighbor"]];
  var SEASONS = [{
    when: "Winter",
    name: "Chains in the trunk",
    cls: "is-peak",
    text: "The Park Service expects chain controls from November through March and requires every vehicle to carry chains, four-wheel drive included. Evergreen closes for about six weeks in January."
  }, {
    when: "Spring and fall",
    name: "The shoulder",
    cls: "is-mid",
    text: "Chain controls are less common in October and April. YARTS's summer runs to Rush Creek and Tenaya are over; the Highway 140 bus to Yosemite View Lodge keeps running."
  }, {
    when: "Summer",
    name: "Every door open",
    cls: "is-late",
    text: "YARTS stops at Rush Creek and Tenaya as well as Yosemite View Lodge. The outdoor pools are open, and Tioga Road puts Tuolumne Meadows in reach of the Highway 120 lodges."
  }];
  return React.createElement("div", {
    className: "hj-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("dt", null, "Shortest Valley drive"), React.createElement("dd", null, "El Portal, 30 min by the NPS table")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "pin"
  }), React.createElement("dt", null, "Closest to a gate"), React.createElement("dd", null, "Rush Creek, half a mile")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("dt", null, "Winter"), React.createElement("dd", null, "Carry chains; Evergreen shuts in January")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("dt", null, "No dogs"), React.createElement("dd", null, "Rush Creek, service animals only"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section hj-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Four large lodges sit at Yosemite's edge, each just outside a different gate. Rush Creek Lodge is half a mile from the Big Oak Flat entrance on Highway 120. Evergreen Lodge is a mile from the Hetch Hetchy entrance, down a side road off the same highway. Tenaya at Yosemite is about two miles from the South Entrance on Highway 41. Yosemite View Lodge is about two miles from the Arch Rock entrance on Highway 140."), React.createElement("p", null, "They are not interchangeable, because the gate decides the trip. Which one is best depends on what you came to see, the month, and whether a dog is coming. The drive to Yosemite Valley runs from half an hour to well over an hour among them, and only one is on a bus line all year."), React.createElement("p", null, "The distances and times below come from the Park Service's own driving table and from each lodge's published figures. Where they disagree, we print both. We list no prices, because rates here change by the night; check them yourself, and confirm anything seasonal with the lodge before you book.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Shortest drive to the Valley, and a bus all year: Yosemite View Lodge."), React.createElement("li", null, "Coming from the Bay Area on Highway 120: Rush Creek Lodge."), React.createElement("li", null, "Mariposa Grove, Wawona, a resort with a kids' pool: Tenaya."), React.createElement("li", null, "Hetch Hetchy, cabins, or a dog: Evergreen Lodge.")), React.createElement("a", {
    className: "hj-short__link",
    href: "#hj-compare"
  }, "All four side by side ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "hj-compare",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SIDE BY SIDE"), React.createElement("h2", null, "Four lodges, four gates"), React.createElement("div", {
    className: "hj-lodges"
  }, LODGES.map(l => React.createElement("article", {
    key: l.name,
    className: "hj-lodge " + l.cls
  }, React.createElement("p", {
    className: "hj-lodge__place"
  }, l.place), React.createElement("h3", null, React.createElement("a", {
    href: l.id
  }, l.name)), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Gate"), React.createElement("dd", null, l.gate)), React.createElement("div", null, React.createElement("dt", null, "To the Valley"), React.createElement("dd", null, l.valley)), React.createElement("div", null, React.createElement("dt", null, "Season"), React.createElement("dd", null, l.season)), React.createElement("div", null, React.createElement("dt", null, "Pets"), React.createElement("dd", null, l.pets)))))), React.createElement("div", {
    className: "ff-split hj-compare__prose"
  }, React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Location is most of the difference."), " Rush Creek and Evergreen are sister properties on the Highway 120 side, the approach from the Bay Area and Sacramento. Tenaya is on the Highway 41 side, the approach from Fresno and Los Angeles. Yosemite View Lodge is in El Portal, on the Highway 140 approach from Merced and Mariposa, in the Merced River canyon below the park."), React.createElement("p", null, "If you have not settled which side of the park to sleep on, ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns compared"), " sets the five towns and their roads against each other, and ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay in Yosemite"), " covers the beds inside the park, which are the first thing to try.")), React.createElement("p", {
    className: "ff-alert hj-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "The drive times are the Park Service's, not ours."), " Its table measures from Yosemite Valley to a town or an entrance station, not to a lodge's door, and assumes no traffic. As of October 18, 2026, the park was also warning of 15-minute weekday delays on Big Oak Flat Road."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hj-rush-creek",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HIGHWAY 120 · BIG OAK FLAT"), React.createElement("h2", null, "Rush Creek Lodge: half a mile from the gate"), React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, "Rush Creek Lodge sits half a mile from the park's Highway 120 west entrance, the Big Oak Flat entrance, and 22.5 miles east of Groveland. Its address is 34001 Highway 120, Groveland. The lodge puts the Bay Area at three to three and a half hours away."), React.createElement("p", null, React.createElement("strong", null, "The drive in."), " The lodge says you reach Yosemite Valley in 30 minutes on average. The Park Service's table puts the Big Oak Flat entrance station at 25 miles and 45 minutes from the Valley, and the lodge is half a mile outside it, so plan on the Park Service's number. The lodge lists Tuolumne Grove's trailhead at 15 minutes, Hetch Hetchy at 25 minutes in its drive-time table, and Tuolumne Meadows at an hour, the last only while Tioga Road is open. Driving east, the nearest gas is at Crane Flat, which the lodge puts 9.5 miles inside the park."), React.createElement("p", null, React.createElement("strong", null, "What is there."), " 143 lodge rooms, suites and two-bedroom hillside villas on a 20-acre wooded hillside. A heated outdoor pool and hot tubs, a full-service spa, a restaurant, a tavern and a general store. The lodge runs daily activities for kids and adults and guided Yosemite outings."), React.createElement("p", null, React.createElement("strong", null, "The rule to know."), " No pets. Only registered service animals are allowed, anywhere on the property or in vehicles, and the lodge charges a $250 fee for violations. Its reason is the setting: the woods are unfenced, and pets and bears, deer and squirrels do not mix."), React.createElement("p", null, React.createElement("strong", null, "Without a car."), " The lodge is a stop on the YARTS Highway 120 route, which ran from May 22 through September 30 in 2026. Outside that window the lodge itself says you will need a car."), React.createElement("p", null, "For the other rooms on this stretch of Highway 120, ", React.createElement(AvailabilityLink, {
    destination: "Groveland, California",
    list: "article_inline",
    slug: "hotels-just-outside-yosemite",
    name: "Groveland availability search"
  }, "search Groveland availability"), "; the town is the lodge's mailing address and the last real town before the gate."))), React.createElement("div", null, React.createElement("figure", {
    className: "hj-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/groveland-main-street-highway-120.jpg",
    style: {
      aspectRatio: "1600 / 1067"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Main Street in Groveland, which is Highway 120, lined with historic storefronts"
  }), React.createElement("figcaption", null, "Main Street, Groveland, which is Highway 120. Rush Creek is 22.5 miles further east. Photo: Almonroth / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("article", {
    className: "ff-inpark hj-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RUSH CREEK LODGE"), React.createElement("h3", null, "At a glance"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Gate"), React.createElement("dd", null, "Big Oak Flat, half a mile")), React.createElement("div", null, React.createElement("dt", null, "To the Valley"), React.createElement("dd", null, "30 min by the lodge; 45 min from the entrance station by the NPS")), React.createElement("div", null, React.createElement("dt", null, "Rooms"), React.createElement("dd", null, "143 rooms, suites and villas")), React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, "Heated outdoor pool, hot tubs")), React.createElement("div", null, React.createElement("dt", null, "Pets"), React.createElement("dd", null, "Registered service animals only")), React.createElement("div", null, React.createElement("dt", null, "Bus"), React.createElement("dd", null, "YARTS Highway 120, summer"))))))), React.createElement("section", {
    className: "ff-band",
    id: "hj-tenaya",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HIGHWAY 41 · SOUTH ENTRANCE"), React.createElement("h2", null, "Tenaya at Yosemite: the resort at the south gate"), React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, "Tenaya at Yosemite, which many listings still call Tenaya Lodge, is in Fish Camp on Highway 41, about two miles from the park's South Entrance and, in the county tourism bureau's words, \"only minutes\" from the Mariposa Grove of Giant Sequoias. It has the longest amenity list of the four, and it is the farthest of them from Yosemite Valley."), React.createElement("p", null, React.createElement("strong", null, "The drive in."), " The Park Service lists Fish Camp at 39 miles and 1 hour 15 minutes from Yosemite Valley, and the South Entrance at 35 miles and an hour. That is a long morning commute for a Valley-only trip and a short one for the sequoias: the grove and Wawona are on this side of the park, and the ", React.createElement("a", {
    href: "/articles/wawona-yosemite-guide"
  }, "Wawona guide"), " covers what is open at the park's south end now that the Wawona Hotel is closed."), React.createElement("p", null, React.createElement("strong", null, "What is there."), " Lodge rooms and suites, cottages, and two-bedroom Explorer Cabins. A 59-foot heated indoor pool with hot tubs, and in warmer months three outdoor pools with private cabanas and a zero-entry splash pool. The Ascent Spa and fitness center has steam rooms and saunas, with treatments at extra charge. The restaurants and bars listed are Jackalope's Bar & Grill, Timberloft Pizzeria, Embers, Parkside Deli and the poolside Bearfoot Bar."), React.createElement("p", null, React.createElement("strong", null, "The extras."), " An ice rink, open seasonally from November to March. Complimentary mountain bikes, snowshoes and sledding gear. A game room, a climbing wall, archery, bocce and gold panning, a guided nature hike and evening telescopes. EV charging, laundry and room service."), React.createElement("p", null, React.createElement("strong", null, "Pets and the bus."), " The tourism bureau's listing marks it pet friendly but gives no fee or limits, so ask before you book. Tenaya Lodge is a stop on the YARTS Highway 41 route, which ran from May 22 through September 25 in 2026."), React.createElement("p", null, "If Tenaya is full, ", React.createElement(AvailabilityLink, {
    destination: "Fish Camp, California",
    list: "article_inline",
    slug: "hotels-just-outside-yosemite",
    name: "Fish Camp availability search"
  }, "search Fish Camp availability"), " for the smaller inns at the same gate."))), React.createElement("div", null, React.createElement("article", {
    className: "ff-inpark hj-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TENAYA AT YOSEMITE"), React.createElement("h3", null, "At a glance"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Gate"), React.createElement("dd", null, "South Entrance, about 2 miles")), React.createElement("div", null, React.createElement("dt", null, "To the Valley"), React.createElement("dd", null, "Fish Camp: 39 mi, 1 hr 15 min (NPS)")), React.createElement("div", null, React.createElement("dt", null, "Rooms"), React.createElement("dd", null, "Lodge rooms, cottages, Explorer Cabins")), React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, "Heated indoor pool; three outdoor pools in warm months")), React.createElement("div", null, React.createElement("dt", null, "Winter"), React.createElement("dd", null, "Ice rink, November to March")), React.createElement("div", null, React.createElement("dt", null, "Pets"), React.createElement("dd", null, "Listed as pet friendly; ask for terms")), React.createElement("div", null, React.createElement("dt", null, "Bus"), React.createElement("dd", null, "YARTS Highway 41, summer")))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hj-evergreen",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERGREEN ROAD · HETCH HETCHY"), React.createElement("h2", null, "Evergreen Lodge: the cabins by Hetch Hetchy"), React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, "Evergreen Lodge is at 33160 Evergreen Road, a side road off Highway 120. The lodge says it sits a mile from Yosemite's western border and from the Hetch Hetchy entrance, and seven miles from the Big Oak Flat entrance. It was built nearly a century ago, by its own account, as housing for the workers building the Hetch Hetchy Railroad, and it has 89 cabins."), React.createElement("p", null, React.createElement("strong", null, "The drive in."), " The lodge's drive-time table lists Hetch Hetchy Reservoir at 15 minutes, the Merced Grove trailhead at 20, the Tuolumne Grove trailhead at 25, Yosemite Valley at 40, Tuolumne Meadows at 75 and the Mariposa Grove at 90. Measure the Valley figure against the Park Service's: 45 minutes from the Big Oak Flat entrance station alone, before the seven miles back to it."), React.createElement("p", null, React.createElement("strong", null, "Why it is here."), " Hetch Hetchy. The road to the reservoir is open sunrise to sunset, the Park Service says, and closes when it is snowing or snow is forecast overnight, so a sunrise start from a mile away is the advantage no other bed has. ", React.createElement("a", {
    href: "/articles/hetch-hetchy-the-other-yosemite-valley"
  }, "Our Hetch Hetchy guide"), " covers the hike to the falls and why the valley stays empty."), React.createElement("p", null, React.createElement("strong", null, "What is there."), " Cabins, including Deluxe and Two Bedroom Family cabins, and glamping. A swimming pool, a restaurant, a tavern and a general store, guided Yosemite excursions, daily activities, and massage in a cabana. The lodge says Birch Lake and the Middle Fork of the Tuolumne River are within a 20-minute walk."), React.createElement("p", null, React.createElement("strong", null, "Dogs."), " The lodge's pet page allows up to two dogs in the Deluxe and Two Bedroom Family cabins, on a \"Doggie Daily\" rate that adds $85 a night, with prior approval, and approval at booking for any dog over 90 pounds. Dogs can be on your deck with you, leashed at the Tavern's outdoor tables, and leashed on most of the property. Pet rules have changed here before, so confirm when you book."), React.createElement("p", null, React.createElement("strong", null, "The closure."), " The lodge describes a temporary six-week closure in January, reopening on Presidents Day weekend. Check the dates for your year."))), React.createElement("div", null, React.createElement("figure", {
    className: "hj-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/hetch-hetchy-reservoir-kolana-rock.jpg",
    style: {
      aspectRatio: "1600 / 1067"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Kolana Rock rising above the blue water of Hetch Hetchy Reservoir, seen from the trail beyond the dam"
  }), React.createElement("figcaption", null, "Kolana Rock above Hetch Hetchy Reservoir. Evergreen lists the reservoir 15 minutes away. Photo: King of Hearts / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("article", {
    className: "ff-inpark hj-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EVERGREEN LODGE"), React.createElement("h3", null, "At a glance"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Gate"), React.createElement("dd", null, "Hetch Hetchy, 1 mile; Big Oak Flat, 7 miles")), React.createElement("div", null, React.createElement("dt", null, "To the Valley"), React.createElement("dd", null, "40 min by the lodge")), React.createElement("div", null, React.createElement("dt", null, "Rooms"), React.createElement("dd", null, "89 cabins, plus glamping")), React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, "Swimming pool")), React.createElement("div", null, React.createElement("dt", null, "Pets"), React.createElement("dd", null, "Up to two dogs, two cabin types, $85 a night")), React.createElement("div", null, React.createElement("dt", null, "Closed"), React.createElement("dd", null, "About six weeks in January"))))))), React.createElement("section", {
    className: "ff-band",
    id: "hj-yosemite-view",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HIGHWAY 140 · ARCH ROCK"), React.createElement("h2", null, "Yosemite View Lodge: the shortest drive to the Valley"), React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, "Yosemite View Lodge is at 11136 Highway 140 in El Portal, beside the Merced River, about two miles from the Arch Rock entrance. Of the four it is the nearest to Yosemite Valley: the Park Service lists El Portal at 14 miles and 30 minutes from the Valley."), React.createElement("p", null, React.createElement("strong", null, "The bus."), " It is the only one of the four on a bus route all year. YARTS runs Highway 140 year-round, on a summer schedule through September 30 and a winter schedule from October 1, 2026, to May 28, 2027, and Yosemite View Lodge is one of its El Portal stops. On the winter timetable the first inbound bus leaves the lodge at 6:37 am and reaches Yosemite Valley Lodge at 7:13. Service is suspended on Thanksgiving, Christmas, New Year's Day and Easter Sunday. ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "The YARTS guide"), " covers fares and the rest of the route."), React.createElement("p", null, React.createElement("strong", null, "What is there."), " The county tourism bureau's listing counts four pools and seven spas, kitchenettes in nearly every room, the River Restaurant and Lounge, Parkside Pizza, a convenience store and EV charging. The lodge's own room list runs from standard queens and kings to river-view rooms, spa-tub rooms, family apartments and three-bedroom suites, with accessible rooms in several types."), React.createElement("p", null, React.createElement("strong", null, "Pets."), " The bureau's listing marks it pet friendly with no details, and we could not find a published fee or limit on the lodge's own site. Call before you bring a dog."), React.createElement("p", null, React.createElement("strong", null, "The road."), " Highway 140 is the lowest approach into the Valley, and it also closes without a schedule, for rockslides and fires in the canyon. ", React.createElement("a", {
    href: "/articles/highway-140-closed-yosemite"
  }, "When Highway 140 closes"), " covers which side of the barricade El Portal has tended to end up on."), React.createElement("p", null, "When it is full, ", React.createElement(AvailabilityLink, {
    destination: "El Portal, California",
    list: "article_inline",
    slug: "hotels-just-outside-yosemite",
    name: "El Portal availability search"
  }, "search El Portal availability"), " for the other lodges on the same stretch of river."))), React.createElement("div", null, React.createElement("figure", {
    className: "hj-photo hj-photo--tall"
  }, React.createElement(ResponsiveImage, {
    image: "img/merced-canyon-road-cory-goehring.jpg",
    style: {
      aspectRatio: "2000 / 972"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Highway 140 following the Merced River through its canyon toward the Arch Rock entrance"
  }), React.createElement("figcaption", null, "Highway 140 in the Merced River canyon, the road every El Portal morning starts on. Photo: Cory Goehring")), React.createElement("article", {
    className: "ff-inpark hj-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE VIEW LODGE"), React.createElement("h3", null, "At a glance"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Gate"), React.createElement("dd", null, "Arch Rock, about 2 miles")), React.createElement("div", null, React.createElement("dt", null, "To the Valley"), React.createElement("dd", null, "El Portal: 14 mi, 30 min (NPS)")), React.createElement("div", null, React.createElement("dt", null, "Rooms"), React.createElement("dd", null, "Kitchenettes in nearly every room")), React.createElement("div", null, React.createElement("dt", null, "Water"), React.createElement("dd", null, "Four pools, seven spas")), React.createElement("div", null, React.createElement("dt", null, "Pets"), React.createElement("dd", null, "Listed as pet friendly; call first")), React.createElement("div", null, React.createElement("dt", null, "Bus"), React.createElement("dd", null, "YARTS Highway 140, all year")))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hj-drive",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "DRIVE TIMES"), React.createElement("h2", null, "How far each one is from the Valley"), React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, "The Park Service publishes one table of driving times from Yosemite Valley, and it is the fairest yardstick for all four, because it measures the same way every time. It measures to a town or an entrance station, not to a lodge, and assumes the road is clear."), React.createElement("p", null, "Read it against the lodges' own claims. Rush Creek says 30 minutes to the Valley and Evergreen says 40; the Park Service's figure for the Big Oak Flat entrance station both lodges use is 45. For Tenaya, the Fish Camp line is the one to use. For Yosemite View Lodge, El Portal's 30 minutes is close, since the lodge is about two miles from Arch Rock."), React.createElement("p", null, "Then add the season. The park's conditions page on October 18, 2026, was warning of 15-minute delays on weekdays on Big Oak Flat Road, the stretch Rush Creek and Evergreen guests drive. In winter, add chain controls; in summer, add the line at the entrance station."))), React.createElement("div", null, React.createElement("h3", {
    className: "hj-table__head"
  }, "From Yosemite Valley, by the Park Service"), React.createElement("table", {
    className: "hj-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "To"), React.createElement("th", {
    scope: "col"
  }, "Miles"), React.createElement("th", {
    scope: "col"
  }, "Time"), React.createElement("th", {
    scope: "col"
  }, "Nearest of the four"))), React.createElement("tbody", null, DRIVES.map(([to, mi, t, near]) => React.createElement("tr", {
    key: to
  }, React.createElement("th", {
    scope: "row"
  }, to), React.createElement("td", null, mi), React.createElement("td", null, t), React.createElement("td", null, near)))))))), React.createElement("section", {
    className: "ff-band",
    id: "hj-seasons",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SEASONS"), React.createElement("h2", null, "What changes with the calendar"), React.createElement("ol", {
    className: "hj-seasons"
  }, SEASONS.map(s => React.createElement("li", {
    key: s.name,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split hj-when"
  }, React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Winter."), " The Park Service expects chain requirements from November through March, less often in October and April, and occasionally as early as September or as late as May. Every vehicle must carry chains when they are in force, including four-wheel drives and rental cars. Yosemite Valley and Wawona stay reachable by car all year, so each of these gates has a winter road to the Valley. Rush Creek notes that its stretch of Highway 120 is plowed after snowfalls and that chains are periodically required."), React.createElement("p", null, React.createElement("strong", null, "The lodges."), " Evergreen closes for about six weeks in January. Rush Creek is open year-round, as its sister lodge's site puts it. Tenaya's listing runs its ice rink from November to March and bills the indoor pool as a year-round retreat. We found no published closure for Yosemite View Lodge, and YARTS serves it all winter."), React.createElement("p", null, React.createElement("strong", null, "Tioga Road."), " The Park Service says Tioga Road usually closes sometime in November. Until it does, Rush Creek and Evergreen are the closest of the four to Tuolumne Meadows; after, that hour's drive is gone. ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "Yosemite in winter"), " covers what the park is like once the high roads shut.")), React.createElement("ul", {
    className: "ff-rules hj-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Carry chains, November to March."), React.createElement("p", null, "Every vehicle, four-wheel drive included, when controls are in force.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "calendar",
    size: 26
  }), React.createElement("strong", null, "Evergreen shuts in January."), React.createElement("p", null, "About six weeks, reopening Presidents Day weekend.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Hetch Hetchy keeps daylight hours."), React.createElement("p", null, "Sunrise to sunset, and closed when it snows.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "Two of the buses are summer-only."), React.createElement("p", null, "The Highway 120 and 41 routes. Highway 140 runs all year.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "hj-choose",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHICH TO BOOK"), React.createElement("h2", null, "Pick the gate, then the lodge"), React.createElement("ul", {
    className: "ff-rules hj-choose"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "dome",
    size: 26
  }), React.createElement("strong", null, "A Valley trip, early starts, no car."), React.createElement("p", null, "Yosemite View Lodge. The shortest drive of the four and the only one on a bus all year.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Driving from the Bay Area."), React.createElement("p", null, "Rush Creek Lodge. Half a mile from the gate, open all year, and three hours or so from home by its count.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "tree",
    size: 26
  }), React.createElement("strong", null, "Sequoias, Wawona, children."), React.createElement("p", null, "Tenaya at Yosemite. Minutes from the Mariposa Grove, with the indoor pool and the most to do on site.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "lake",
    size: 26
  }), React.createElement("strong", null, "Hetch Hetchy, a cabin, a dog."), React.createElement("p", null, "Evergreen Lodge. A mile from the Hetch Hetchy gate, and the only one of the four that publishes its dog terms. Not in January."))), React.createElement("div", {
    className: "ff-split hj-choose__prose"
  }, React.createElement("div", {
    className: "hj-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Try the park first."), " Every one of these lodges is a second choice to a bed inside the park, for a Valley trip. The Park Service says in-park reservations open 366 days ahead; ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay in Yosemite"), " ranks the in-park options and explains how they sell out and come back."), React.createElement("p", null, React.createElement("strong", null, "Then match the gate to the plan."), " A lodge outside the wrong entrance turns a 30-minute morning into an hour and a quarter. Two nights at the south gate and two on Highway 120 can be a better trip than four at either."), React.createElement("p", null, React.createElement("strong", null, "Confirm the perishable things."), " Pet rules, the January closure, pool seasons and the bus calendar are the details that change between years. The lodges' own pages and the YARTS route pages are the place to check them.")), React.createElement("div", {
    className: "hj-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "When all four are full",
    note: "If Rush Creek, Evergreen, Tenaya and Yosemite View Lodge are all full for your dates, a search around the park shows what is left at every gate at once: El Portal and Mariposa on Highway 140, Groveland on 120, Fish Camp and Oakhurst on 41.",
    list: "article_cta",
    slug: "hotels-just-outside-yosemite",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "ff-band",
    id: "hj-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Hotels just outside Yosemite, answered"), React.createElement("div", {
    className: "hj-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/driving.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Driving, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Current conditions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/winter.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Winter, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tirechains.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tire chains, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.rushcreeklodge.com/plan/rush-creek-location/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Location, Rush Creek Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.rushcreeklodge.com/stay/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Rooms, Rush Creek Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.rushcreeklodge.com/plan/pet-policy/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Pet policy, Rush Creek Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.evergreenlodge.com/plan/evergreen-location/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Location, Evergreen Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.evergreenlodge.com/stay/pets/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Pets, Evergreen Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://evergreenlodge.com/blog/california-meetings-events-a-little-history-a-lot-of-nature",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "History and the January closure, Evergreen Lodge")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemite.com/places-to-stay/hotels-and-motels/tenaya-lodge-at-yosemite/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tenaya Lodge at Yosemite, Yosemite Mariposa County Tourism Bureau")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemite.com/places-to-stay/hotels-and-motels/yosemite-view-lodge/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite View Lodge, Yosemite Mariposa County Tourism Bureau")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-140/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 140 route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-120/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 120 route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-41/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 41 route, YARTS"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap hj-end"
  }, React.createElement(AffiliateNote, null)));
};
