window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-san-francisco-bus"] = function YosemiteSanFranciscoBusBody() {
  var TOC = [["#sfb-the-route", "The route"], ["#sfb-yarts-routes", "The four YARTS routes"], ["#sfb-going-home", "Yosemite to San Francisco"], ["#sfb-fares", "Fares and the entrance fee"], ["#sfb-tours", "Tours instead"], ["#sfb-drive-instead", "When to drive"], ["#sfb-questions", "Questions"]];
  var ROUTES = [{
    key: "140",
    name: "Highway 140",
    from: "From Merced",
    season: "All year",
    year: true,
    stops: "Merced Airport, Merced Transpo and the Merced Amtrak station, then Catheys Valley, Mariposa, Midpines and El Portal, up the Merced River canyon",
    fare: "$22 one way, $44 round trip, adult",
    note: "The route that meets the train. The only one that runs in winter."
  }, {
    key: "41",
    name: "Highway 41",
    from: "From Fresno",
    season: "Summer: May 22 to September 25 in 2026",
    stops: "Fresno, Coarsegold and Oakhurst, then Fish Camp, the Mariposa Grove and Wawona",
    fare: "$20 one way, $40 round trip, adult",
    note: "The south side. Fresno is a Gold Runner station too, but the train from the Bay reaches Merced first."
  }, {
    key: "120w",
    name: "Highway 120 west",
    from: "From Sonora",
    season: "Summer: May 22 to September 30 in 2026",
    stops: "Sonora and Jamestown, Groveland and Buck Meadows, Big Oak Flat and Crane Flat",
    fare: "$22 one way, $44 round trip, adult",
    note: "The shortest road from San Francisco, but no train meets it."
  }, {
    key: "120e",
    name: "Highway 120 east",
    from: "From Mammoth Lakes, on Highway 395",
    season: "Summer: July 1 to September 30 in 2026",
    stops: "Mammoth Lakes, June Lake and Lee Vining, over Tioga Pass to Tuolumne Meadows, White Wolf and Crane Flat",
    fare: "$30 one way, $60 round trip, adult",
    note: "The east side. Useful from San Francisco only on a loop trip."
  }];
  var FAQ = [["Is there a bus from San Francisco to Yosemite?", "Not a direct one on public transit. The scheduled route is three legs: BART to Richmond, or Amtrak's connecting bus from San Francisco to Emeryville; the Amtrak Gold Runner train, long known as the San Joaquins, to Merced; then the YARTS bus up Highway 140 into Yosemite Valley. It runs all year, and Amtrak sells the train and the YARTS bus as one ticket."], ["How long does the bus take from Merced to Yosemite Valley?", "About three to four hours on the YARTS winter timetable, which runs from October 1, 2026 to May 28, 2027, depending on the run. The bus calls at Catheys Valley, Mariposa, Midpines and El Portal on the way up the Merced River canyon and stops at Yosemite Valley Lodge, Yosemite Village and Curry Village."], ["How much is the YARTS bus from Merced to Yosemite?", "YARTS lists $22 one way and $44 round trip for an adult between Merced and Yosemite Valley, and reduced fares of $11 and $22. Children 5 and under ride free, and one child aged 6 to 12 rides free with each paid adult. Online tickets carry a $2.50 fee each way, the posted fares leave out a $1 surcharge per person, and walk-ons ride as space allows."], ["Does YARTS run all year?", "Only the Highway 140 route, from Merced. The Highway 41 route from Fresno, Highway 120 west from Sonora and Highway 120 east from Mammoth Lakes are summer services. YARTS does not run on Thanksgiving, Christmas, New Year's Day or Easter."], ["How do I get from Yosemite to San Francisco by bus?", "The same three legs in reverse: YARTS from the Valley down Highway 140 to the Merced Amtrak station, the Gold Runner train to Richmond or Emeryville, then BART from Richmond or Amtrak's connecting bus from Emeryville into San Francisco. Book it as one Amtrak ticket so the bus and train are planned to connect, and check the current timetable before you choose a bus."], ["Does the bus fare include the Yosemite entrance fee?", "The official sources disagree. YARTS says entrance and non-resident fees are not included in its ticket prices, while Amtrak's Yosemite page says its tickets include admission. Plan to pay: the per-person pass is $20 for seven days, people 15 and under are free, non-US residents 16 and over pay $100 more, and the park does not accept cash."]];
  return React.createElement("div", {
    className: "sfb-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "The way in"), React.createElement("dd", null, "BART, train to Merced, YARTS")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Merced to the Valley"), React.createElement("dd", null, "3 to 4 hours by bus")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "YARTS from Merced"), React.createElement("dd", null, "$22 one way, $44 round trip")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("dt", null, "In winter"), React.createElement("dd", null, "Highway 140 only"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section sfb-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Ask where the bus to San Francisco leaves from and the answer disappoints a little: there is no bus from Yosemite to San Francisco. There is a bus to Merced, a train from Merced to the Bay, and a short hop from the train into the city, and the three together make one of the better ways in and out of this park. Nothing about it is direct, but all of it is scheduled, and none of it involves a parking lot."), React.createElement("p", null, "This is the route as it works now, in both directions: which train, which bus, what the posted fares are, which of the four YARTS routes run in which season, and where the official sources stop agreeing with each other. Where a schedule or price is not posted, I say so rather than guess.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "BART to Richmond, train to Merced, YARTS to the Valley."), React.createElement("li", null, "Buy it as one Amtrak ticket."), React.createElement("li", null, "October to May, only the Merced bus runs."), React.createElement("li", null, "Budget for the entrance fee anyway."))))), React.createElement("section", {
    className: "ff-band",
    id: "sfb-the-route",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE ROUTE"), React.createElement("h2", null, "San Francisco to Yosemite, in three legs"), React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", null, "The train does not reach San Francisco itself, so the trip starts on the east side of the Bay. Amtrak's Central Valley line, the ", React.createElement("strong", null, "Gold Runner"), ", called the San Joaquins until November 2025, stops at the ", React.createElement("strong", null, "Richmond"), " BART station, and Amtrak runs connecting buses between downtown San Francisco and its station at ", React.createElement("strong", null, "Emeryville"), ". Either way you board the same train south to Merced."), React.createElement("p", null, "At the Merced station you change to the ", React.createElement("strong", null, "YARTS"), " bus. YARTS is the Yosemite Area Regional Transportation System, a public transit agency, not a tour company, and Amtrak sells its Merced bus as its own connection, Route 15, which is why the train and the bus can be booked as one ticket rather than two. The bus climbs Highway 140 through Catheys Valley, Mariposa, Midpines and El Portal and sets down at ", React.createElement("strong", null, "Yosemite Valley Lodge"), ", ", React.createElement("strong", null, "Yosemite Village"), " and ", React.createElement("strong", null, "Curry Village"), ", all on the free Valley shuttle."), React.createElement("p", null, "The bus leg alone takes about three to four hours on the winter timetable, depending on the run. Add the train and the ride across the Bay and it is most of a day, so plan the first afternoon in the Valley, not the first morning. Book Yosemite as the destination on Amtrak's site and the itinerary it returns, train and bus together, is the timetable to trust, not this page."))), React.createElement("figure", {
    className: "sfb-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/yarts-bus-bridalveil.jpg",
    style: {
      aspectRatio: "3 / 2"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A YARTS coach on Southside Drive in Yosemite Valley below Bridalveil Fall in winter"
  }), React.createElement("figcaption", null, "The year-round bus, in the Valley in winter. Photo: YARTS"))), React.createElement("ol", {
    className: "ff-timeline sfb-legs"
  }, React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Leg one"), React.createElement("strong", null, "Across the Bay"), React.createElement("p", null, "BART to Richmond, where the Amtrak train stops at the same station, or Amtrak's connecting bus from San Francisco to Emeryville.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Leg two"), React.createElement("strong", null, "Gold Runner to Merced"), React.createElement("p", null, "Amtrak's Central Valley train, south from Richmond or Emeryville to the Merced station.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Leg three"), React.createElement("strong", null, "YARTS up Highway 140"), React.createElement("p", null, "From the Merced Amtrak station, through Mariposa and El Portal, into the Valley. All year but four holidays.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "In the Valley"), React.createElement("strong", null, "The free shuttle"), React.createElement("p", null, "From the bus stop to wherever you are sleeping or walking, 7 a.m. to 10 p.m. No ticket."))), React.createElement("p", {
    className: "ff-note"
  }, "Flying into SFO or Oakland instead of starting in the city: the same route works from the airport, and ", React.createElement("a", {
    href: "/articles/best-airport-for-yosemite"
  }, "the airport guide"), " weighs it against a rental car."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sfb-yarts-routes",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE BUS ROUTES"), React.createElement("h2", null, "Four YARTS routes, one of them all year"), React.createElement("p", {
    className: "ff-lede ff-lede--intro"
  }, "YARTS runs full-size coaches into Yosemite Valley on four corridors. From San Francisco only one is practical without a car, because only one meets the train, but the other three matter if your trip is a loop or starts somewhere else."), React.createElement("div", {
    className: "sfb-routes"
  }, ROUTES.map(r => React.createElement("article", {
    key: r.key,
    className: "sfb-route" + (r.year ? " is-year" : "")
  }, React.createElement("p", {
    className: "sfb-route__season"
  }, r.season), React.createElement("h3", null, r.name), React.createElement("p", {
    className: "sfb-route__from"
  }, r.from), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Calls at"), React.createElement("dd", null, r.stops)), React.createElement("div", null, React.createElement("dt", null, "Fare"), React.createElement("dd", null, r.fare))), React.createElement("p", {
    className: "sfb-route__note"
  }, r.note)))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "The 2026 summer routes have ended."), " Highway 41 finished on September 25, Highway 120 west and Highway 120 east on September 30. Check YARTS for next summer's dates; until those routes run, from San Francisco, the Merced bus is the whole system. Every corridor on the park map, with its stops in order: ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "the shuttle and YARTS guide"), "."))), React.createElement("section", {
    className: "ff-band",
    id: "sfb-going-home",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YOSEMITE TO SAN FRANCISCO"), React.createElement("h2", null, "Going home is the same trip backwards, with less slack"), React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", null, "Out of the park, you board YARTS at one of its three Valley stops, ride down the canyon to the Merced station, take the train north, and get off at Richmond for BART or at Emeryville for the connecting bus into San Francisco. The difference is the clock. On the way in, a late bus costs you an hour of afternoon. On the way out, it can cost you a train, so pick a bus that leaves you a margin at Merced, and buy the through ticket so the two legs are planned to connect."), React.createElement("p", null, "The winter timetable runs from ", React.createElement("strong", null, "October 1, 2026 to May 28, 2027"), ". Its first run leaves Merced at 4 a.m. and reaches Yosemite Valley Lodge at 7:13. I am not printing the rest of the times here because they change with each timetable; read them on the YARTS Highway 140 page the week you travel."))), React.createElement("ul", {
    className: "ff-rules sfb-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Four days with no bus"), React.createElement("p", null, "YARTS does not run on Thanksgiving, Christmas, New Year's Day or Easter: this season, November 26, December 25, January 1 and March 28, 2027.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "ticket",
    size: 26
  }), React.createElement("strong", null, "Walk-ons ride if there is room"), React.createElement("p", null, "Booking is optional and walk-ons ride first come, first served. On a summer weekend, a reservation is cheap insurance.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Bags yes, pets no"), React.createElement("p", null, "YARTS takes backpacks of any size. Bikes ride underneath, disassembled, as space allows, never guaranteed. Only service animals ride.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "If Highway 140 closes"), React.createElement("p", null, "Rockfall and storms close the canyon road some years. Read the closure before you travel: ", React.createElement("a", {
    href: "/articles/highway-140-closed-yosemite"
  }, "Highway 140 closed"), ".")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sfb-fares",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FARES AND THE ENTRANCE FEE"), React.createElement("h2", null, "What the bus costs, and what it may not cover"), React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", null, "The YARTS fare from Merced is posted and simple. The Amtrak fare is not something I can print: Amtrak prices the train by date and by how early you book, so search your own dates on its site. The through ticket to Yosemite includes the YARTS leg."), React.createElement("p", null, "Then the entrance fee, the one question a car-free visitor cannot get a straight answer to. ", React.createElement("strong", null, "YARTS says its fares do not include it"), ": Park Service gate fees and non-resident fees are the rider's to pay, and can be paid on Recreation.gov. ", React.createElement("strong", null, "Amtrak's Yosemite page says its tickets include admission."), " Two official sources, two answers. Budget for the fee, and if you are waved through, treat it as a refund. The pass for anyone arriving by bus is ", React.createElement("strong", null, "$20 per person"), ", good for seven days; people 15 and under are free, and non-US residents 16 and over pay ", React.createElement("strong", null, "$100 more"), " unless they carry an annual or America the Beautiful pass. The park does not take cash, so buy it before you board."))), React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YARTS · HIGHWAY 140 · ALL YEAR"), React.createElement("h3", null, "Merced to Yosemite Valley"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Adult"), React.createElement("dd", null, "$22 one way, $44 round trip")), React.createElement("div", null, React.createElement("dt", null, "Reduced"), React.createElement("dd", null, "$11 one way, $22 round trip")), React.createElement("div", null, React.createElement("dt", null, "Children"), React.createElement("dd", null, "5 and under free; one child 6 to 12 free with each paid adult")), React.createElement("div", null, React.createElement("dt", null, "Fees"), React.createElement("dd", null, "$1 surcharge per person; $2.50 per one-way ticket bought online")), React.createElement("div", null, React.createElement("dt", null, "Entrance pass"), React.createElement("dd", null, "$20 per person, seven days, card only"))), React.createElement("p", {
    className: "ff-note"
  }, "Reduced fares cover children 6 to 17 beyond the one free child, riders 62 and over and veterans with ID, and riders with disabilities. Walk-ons pay on board; the YARTS fares page does not list the payment methods, so check it before you travel. What the whole week costs, the fee worked through for a family and for visitors from abroad: ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget"
  }, "the trip-cost breakdown"), ".")))), React.createElement("section", {
    className: "ff-band",
    id: "sfb-tours",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TOURS INSTEAD"), React.createElement("h2", null, "When someone else should do the driving"), React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", null, "The bus gets you to the Valley floor and stops there. If the trip is a day or two and you want Glacier Point or the giant sequoias too, the park concessioner runs guided tours from ", React.createElement("strong", null, "Yosemite Valley Lodge"), ", which is a YARTS stop, so the two fit together. The year-round one is the two-hour ", React.createElement("strong", null, "Valley Floor Tour"), ". The ", React.createElement("strong", null, "Glacier Point Tour"), " and the eight-hour ", React.createElement("strong", null, "Grand Tour"), ", which adds the Mariposa Grove, run only while Glacier Point Road is open; in 2026 the Grand Tour ran May 9 to October 12, and both ended for the year on October 12. Book ahead at travelyosemite.com, and ask for an accessible vehicle when you book, not when you arrive."), React.createElement("p", null, "Private companies also sell day tours from San Francisco. I do not review them and do not quote their prices. Before you book one, do the arithmetic: the Park Service puts the Bay Area at 195 miles and four to five hours from the park by car, so a day trip is eight or more hours in a seat for a few hours in the park."))), React.createElement("div", {
    className: "sfb-tours"
  }, React.createElement("div", {
    className: "sfb-tour"
  }, React.createElement("p", {
    className: "sfb-tour__season"
  }, "All year, conditions permitting"), React.createElement("h3", null, "Valley Floor Tour"), React.createElement("p", null, "Two hours from Yosemite Valley Lodge, open-air tram from mid-April to mid-October, heated motor coach the rest of the year. $41.25 adult, $28.25 child 2 to 12.")), React.createElement("div", {
    className: "sfb-tour"
  }, React.createElement("p", {
    className: "sfb-tour__season"
  }, "While Glacier Point Road is open"), React.createElement("h3", null, "Glacier Point Tour"), React.createElement("p", null, "Four hours round trip, from 8:30 a.m. and 1:30 p.m. $72.50 adult and $50.50 child round trip; one way, $28.50 and $18.25, which is how hikers walk down. Ended for 2026 on October 12.")), React.createElement("div", {
    className: "sfb-tour"
  }, React.createElement("p", {
    className: "sfb-tour__season"
  }, "May 9 to October 12 in 2026"), React.createElement("h3", null, "Grand Tour"), React.createElement("p", null, "About eight hours, lunch included: the Valley, Glacier Point and the Mariposa Grove. $141 adult, $71 child 2 to 12.")), React.createElement("p", {
    className: "ff-note"
  }, "Fares as the concessioner listed them on October 17, 2026. Every tour, with the departure times and the moonlight one: ", React.createElement("a", {
    href: "/articles/yosemite-for-non-hikers"
  }, "Yosemite for non-hikers"), "."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "sfb-drive-instead",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHEN TO DRIVE INSTEAD"), React.createElement("h2", null, "The bus is a Valley tool"), React.createElement("div", {
    className: "sfb-prose"
  }, React.createElement("p", null, "YARTS serves a corridor, not the park. If the plan is Glacier Point on Tuesday, Tuolumne Meadows on Wednesday and Hetch Hetchy on Thursday, you need a car, and from San Francisco the drive is shorter than the train and bus. It is also cheaper for a group: the entrance fee is $35 a car for seven days if you drive in, against $20 a head on the bus, before the bus fares."), React.createElement("p", null, "For one or two people sleeping in the Valley, the bus wins: no chains to fit in winter, nobody driving four hours and then hiking, and no hunt for a space at eleven in the morning. If you do drive, ", React.createElement("a", {
    href: "/articles/yosemite-day-trip-from-bay-area"
  }, "the day trip from the Bay Area"), " has the roads and the hours, and ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "the parking guide"), " has the hours the lots fill."))), React.createElement("div", {
    className: "sfb-choose"
  }, React.createElement("div", {
    className: "sfb-choose__col"
  }, React.createElement("p", {
    className: "sfb-choose__head"
  }, React.createElement(EventIcon, {
    name: "route",
    size: 24
  }), " Take the train and bus if"), React.createElement("ul", null, React.createElement("li", null, "It is one or two of you, on a Valley trip."), React.createElement("li", null, "You are sleeping in the Valley or on Highway 140."), React.createElement("li", null, "It is winter, and chains are the part you dread."))), React.createElement("div", {
    className: "sfb-choose__col sfb-choose__col--car"
  }, React.createElement("p", {
    className: "sfb-choose__head"
  }, React.createElement(EventIcon, {
    name: "car",
    size: 24
  }), " Drive if"), React.createElement("ul", null, React.createElement("li", null, "There are three or more of you."), React.createElement("li", null, "The trip includes Glacier Point, Tuolumne or Hetch Hetchy."), React.createElement("li", null, "You want to be at a trailhead before the first bus arrives."))))), React.createElement("p", {
    className: "ff-note"
  }, "The rest of the car-free trip, the bike path, the bins and the propane included: ", React.createElement("a", {
    href: "/articles/sustainable-yosemite-car-free-zero-waste"
  }, "Yosemite without a car"), ". Built around the shuttle line: ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "Yosemite in one or two days"), ".")), React.createElement("section", {
    className: "ff-band",
    id: "sfb-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "The bus to Yosemite, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "Every road into the park, and why the phone's route is not to be trusted: ", React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "getting to Yosemite"), "."), React.createElement("div", {
    className: "sfb-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/publictransportation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Public transportation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Entrance fees, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/driving.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Driving distances and times, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/tickets-and-fares/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tickets and fares, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/plan-your-trip/how-to-ride/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "How to ride, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-140/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 140 route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-41/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 41 route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-120/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 120 route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-395-120e/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 395/120E route, YARTS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.amtrak.com/san-joaquins/yosemite-national-park",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite by train, Amtrak")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.amtrak.com/routes/san-joaquins-train",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Gold Runner route, Amtrak")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.amtrak.com/stations/emy",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Emeryville station, Amtrak")), React.createElement("li", null, React.createElement("a", {
    href: "https://media.amtrak.com/2025/11/amtrak-san-joaquins-becomes-gold-runner-marking-a-new-era-for-california-passenger-rail/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "San Joaquins becomes Gold Runner, Amtrak, November 3, 2025")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.bart.gov/stations/rich",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Richmond station, BART")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/guided-bus-tours/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Guided bus tours, Yosemite Hospitality"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
