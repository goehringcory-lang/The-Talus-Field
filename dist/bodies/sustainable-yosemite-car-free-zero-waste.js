window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["sustainable-yosemite-car-free-zero-waste"] = function SustainableYosemiteBody() {
  var TOC = [["#why-the-car", "Why the car"], ["#train-and-bus", "Train and bus"], ["#entrance-fee", "The entrance fee"], ["#in-the-park", "Getting around"], ["#by-bike", "By bike"], ["#zero-waste", "Zero waste"], ["#propane-and-fire", "Propane and fire"], ["#if-you-drive", "If you drive"], ["#the-kit", "The kit"], ["#sustainable-yosemite-questions", "Questions"]];
  var FAQ = [["Can you get to Yosemite without a car?", "Yes. Take Amtrak's Gold Runner to Merced and transfer to the YARTS bus on Highway 140, which runs year-round to Yosemite Valley and connects with the trains at the Merced Amtrak station. In summer YARTS also runs from Fresno, Sonora and Mammoth Lakes. Inside the Valley the shuttle is free, and there are about 12 miles of paved bike paths."], ["How much is the YARTS bus from Merced to Yosemite Valley?", "YARTS lists $22 one way and $44 round trip for an adult between Merced and Yosemite Valley, with reduced fares of $11 and $22. Children 5 and under ride free, and one child aged 6 to 12 rides free with each paid adult. Booking online adds a small fee."], ["Does the YARTS fare include the Yosemite entrance fee?", "The sources disagree. YARTS says gate and non-resident fees are not included in its ticket prices and can be paid to the Park Service on Recreation.gov, while Amtrak's Yosemite page says its tickets include admission. Plan to pay: the per-person pass is $20 for seven days, people 15 and under are free, and the park does not accept cash."], ["Is there a bike share in Yosemite?", "Yes. The Yosemite Conservancy and the Park Service run a free Bike Share in Yosemite Valley with 50 bikes, usually available between June and October. You unlock a bike with the LINKA GO app, rides last up to two hours, and you must start and end at a Bike Share hub. For longer rides, the concessioner rents bikes at Yosemite Valley Lodge, Curry Village and Yosemite Village."], ["Does Yosemite recycle?", "Yes. At Park Service sites recycling is mixed, so everything recyclable goes in one bin unless it is labeled otherwise. Styrofoam, bubble wrap, plastic bags and unlabeled plastic are not recyclable there. Treat trash and recycling like food: keep it in your food locker or use a bear-proof bin."], ["Can I recycle propane canisters in Yosemite?", "Empty canisters go to the park's recycling areas, and around 24,000 are collected each year. A better answer is a refillable canister: the Village Store, Curry Village Gift Shop, Mountain Shop, Wawona Store and El Portal Market sell them, and you can exchange an empty for a full one at a lower price."], ["Are there EV chargers in Yosemite?", "Yes. The park lists chargers in Yosemite Valley, Wawona, El Portal and Tuolumne Meadows, all with J1772 connectors. In the Valley they include Curry Village, Yosemite Falls parking, Yosemite Valley Lodge and The Ahwahnee."]];
  var PINS = [{
    n: "1",
    x: 176,
    y: 272,
    name: "Yosemite Valley Lodge",
    what: "YARTS stop, bike rental, EV chargers"
  }, {
    n: "2",
    x: 385,
    y: 145,
    name: "Yosemite Village",
    what: "YARTS stop, bike rental, Bike Share, refillable propane"
  }, {
    n: "3",
    x: 600,
    y: 372,
    name: "Curry Village",
    what: "YARTS stop, bike rental, refillable propane, EV chargers"
  }];
  function CarFreeValleyMap() {
    return React.createElement("figure", {
      className: "npsmap sv-map"
    }, React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-valley-dining-map.jpg",
      width: "840",
      height: "500",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of the east end of Yosemite Valley with three places marked: Yosemite Valley Lodge to the west below Yosemite Falls, Yosemite Village beside the visitor center, and Curry Village on the south side. YARTS stops and bike rentals are at all three."
    }), React.createElement("svg", {
      viewBox: "0 0 840 500",
      "aria-hidden": "true",
      focusable: "false"
    }, PINS.map(p => React.createElement("g", {
      key: p.n
    }, React.createElement("circle", {
      className: "npsmap__pin npsmap__pin--rust",
      cx: p.x,
      cy: p.y,
      r: "15"
    }), React.createElement("text", {
      className: "npsmap__num",
      x: p.x,
      y: p.y + 6,
      textAnchor: "middle"
    }, p.n))))), React.createElement("figcaption", null, PINS.map(p => React.createElement("span", {
      key: p.n
    }, React.createElement("b", {
      className: "sv-map__num"
    }, p.n), " ", p.name, ": ", p.what)), React.createElement("span", null, "Map: National Park Service (public domain), cropped.")));
  }
  var STATS = [["Over 60%", "of the park's carbon footprint is individual vehicles"], ["80 million", "miles driven by visitors inside Yosemite every year"], ["3,200 tons", "of trash thrown away in the park every year"], ["Almost 50 miles", "each way, by truck, to the Mariposa County Landfill"]];
  return React.createElement("div", {
    className: "sv-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "The way in"), React.createElement("dd", null, "Amtrak to Merced, then YARTS")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "The bus fare"), React.createElement("dd", null, "$22 each way from Merced")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "In the Valley"), React.createElement("dd", null, "A free shuttle, 7 a.m. to 10 p.m.")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "check"
  }), React.createElement("dt", null, "The bins"), React.createElement("dd", null, "One bin for all recycling"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section sv-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "The greenest thing most visitors can do in Yosemite is the one they rarely consider: ", React.createElement("strong", null, "leave the car at home"), ". Not because a single car matters much on its own, but because the Park Service's own accounting says private vehicles are the largest part of the park's carbon footprint, and the trash a visit leaves behind travels by truck to a landfill outside the park. Both have workable answers, and none of them requires giving anything up."), React.createElement("p", null, "There is a train to Merced and a public bus from the station to the Valley floor. Inside the Valley there is a free shuttle, twelve miles of paved bike path and a free bike share. The bins take recycling, the stores sell refillable propane, and the water bottle you already own is the most useful piece of zero-waste kit you can carry."), React.createElement("p", null, "This is the whole plan: how to get in without driving, how to get around once you are here, what goes in which bin, and what to do if you have to drive anyway.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Ride Amtrak to Merced and YARTS to the Valley. It runs all year."), React.createElement("li", null, "Buy your entrance pass before you board. The park takes no cash."), React.createElement("li", null, "Use the free shuttle and the bike paths, not a car."), React.createElement("li", null, "Carry a bottle, containers and a bag for your own trash."), React.createElement("li", null, "Buy a refillable propane canister instead of a disposable one.")), React.createElement("a", {
    className: "sv-short__link",
    href: "#train-and-bus"
  }, "The train and bus, step by step")))), React.createElement("section", {
    className: "ff-band",
    id: "why-the-car",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHY THE CAR"), React.createElement("h2", null, "The footprint is the drive, and the trash"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "The Park Service is plain about where the park's emissions come from. Visitors collectively drive ", React.createElement("strong", null, "over 80 million miles inside Yosemite"), " every year, and individual vehicles account for ", React.createElement("strong", null, "over 60 percent of the park's carbon footprint"), ". They also bring the noise, the congestion and the long lines at the entrance stations that make a summer Saturday in the Valley feel like a commute."), React.createElement("p", null, "The second number is trash. People throw away ", React.createElement("strong", null, "over 3,200 tons"), " of it in Yosemite every year, and every pound leaves the park by truck: almost 50 miles to the Mariposa County Landfill from the Valley, about 90 from Tuolumne Meadows. The Yosemite Conservancy puts the scale another way: in 2019, trash from Yosemite was nearly a quarter of the solid waste that reached the county landfill. The park recycles almost 980 tons a year, and the recycling program is older than most visitors, started in 1975 with aluminum, glass and paper."), React.createElement("p", null, "Neither problem is solved by a visitor feeling bad about it. Both are solved, a little, by the visitor who arrives on a bus and leaves with less in the bin."))), React.createElement("div", {
    className: "sv-stats"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE PARK'S OWN FIGURES"), React.createElement("dl", null, STATS.map(([n, label]) => React.createElement("div", {
    key: n
  }, React.createElement("dt", null, n), React.createElement("dd", null, label)))), React.createElement("p", {
    className: "ff-note"
  }, "Figures from the Park Service's climate response page. The landfill trip is about 90 miles from Tuolumne Meadows."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "train-and-bus",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "GETTING THERE"), React.createElement("h2", null, "Amtrak to Merced, YARTS to the Valley"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "The car-free route into Yosemite starts on a train. Amtrak's ", React.createElement("strong", null, "Gold Runner"), ", the Central Valley line long known as the San Joaquins, stops at the Merced station. There you transfer to the Amtrak connection bus, which Amtrak lists as Route 15 and which is run by ", React.createElement("strong", null, "YARTS"), ", the Yosemite Area Regional Transportation System. It goes straight to Yosemite Valley. Mariposa County's visitor bureau notes that you can book the whole trip at once, train and bus together, rather than buying two tickets."), React.createElement("p", null, "You can also ride YARTS on its own. The ", React.createElement("strong", null, "Highway 140"), " route is the only one that runs all year. It picks up at Merced Airport, Merced Transpo and the Merced Amtrak station, then climbs through Mariposa, Midpines and El Portal along the Merced River canyon. In the Valley it stops at Yosemite Valley Lodge, Yosemite Village and Curry Village. The winter timetable, which began October 1, 2026 and runs to May 28, 2027, makes the Merced to Valley trip in about three hours. There is no service on Thanksgiving, Christmas, New Year's Day or Easter."), React.createElement("p", null, "In summer three more routes run: Highway 41 from Fresno through Oakhurst and Fish Camp, Highway 120 west from Sonora through Groveland, and Highway 120 east from Mammoth Lakes, June Lake and Lee Vining over Tioga Pass. The ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "full guide to the shuttle and YARTS"), " covers every corridor, and the ", React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "guide to getting to Yosemite"), " weighs the bus against the drive from each direction."))), React.createElement("figure", {
    className: "sv-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/yarts-bus-merced-amtrak.jpg",
    style: {
      aspectRatio: "1600 / 794"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Passengers with bicycles and bags boarding a green YARTS coach at the Merced Amtrak station"
  }), React.createElement("figcaption", null, "Amtrak connection passengers boarding a YARTS coach at the Merced station. Photo: RickyCourtney / Wikimedia Commons (CC BY-SA 3.0)"))), React.createElement("div", {
    className: "sv-ride"
  }, React.createElement("article", {
    className: "ff-inpark"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "YARTS · HIGHWAY 140 · ALL YEAR"), React.createElement("h3", null, "Merced to Yosemite Valley"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Adult"), React.createElement("dd", null, "$22 one way, $44 round trip")), React.createElement("div", null, React.createElement("dt", null, "Reduced"), React.createElement("dd", null, "$11 one way, $22 round trip")), React.createElement("div", null, React.createElement("dt", null, "Children"), React.createElement("dd", null, "5 and under free; one child 6 to 12 free with each paid adult")), React.createElement("div", null, React.createElement("dt", null, "Pay"), React.createElement("dd", null, "Online, or on board by card or exact cash")), React.createElement("div", null, React.createElement("dt", null, "Booking"), React.createElement("dd", null, "Optional. Walk-ons ride first come, first served"))), React.createElement("p", {
    className: "ff-note"
  }, "Reduced fares cover ages 6 to 17, riders 62 and over, veterans and riders with disabilities. Booking online adds a small fee. Fares from the ", React.createElement("a", {
    href: "https://www.yarts.com/tickets-and-fares/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "YARTS fares page"), ".")), React.createElement("ul", {
    className: "ff-rules sv-rules"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Bags are welcome."), React.createElement("p", null, "YARTS takes backpacks of any size. Pack light anyway: the park says luggage storage is not available in Yosemite.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "Bikes go underneath."), React.createElement("p", null, "In the storage bays under the bus, as space allows, first come, first served, and disassembled. Not in the cabin, and never guaranteed.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No pets."), React.createElement("p", null, "Only service animals ride YARTS, and pets are not allowed on the Mariposa Grove shuttle either."))))), React.createElement("section", {
    className: "ff-band",
    id: "entrance-fee",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE ENTRANCE FEE"), React.createElement("h2", null, "Two official sources, two answers"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "Whether the bus fare covers park admission is the one question a car-free visitor cannot get a straight answer to. ", React.createElement("strong", null, "YARTS says it does not"), ": its rider page says Park Service gate fees and non-resident fees are not included in YARTS ticket prices and can be paid to the Park Service through Recreation.gov. YARTS also says it does not require the fees as a condition of booking or boarding. ", React.createElement("strong", null, "Amtrak's Yosemite page says the opposite"), ", that its tickets to Yosemite include the bus ride and admission to the park."), React.createElement("p", null, "The safe plan is to pay. The per-person entrance pass, for anyone arriving on foot, by bicycle, on a horse or in a non-commercial bus or van, is ", React.createElement("strong", null, "$20"), " and is good for seven consecutive days. People 15 and under are free. Non-US residents 16 and over pay an ", React.createElement("strong", null, "additional $100"), " per person unless they hold an annual or America the Beautiful pass, which settles the question for everyone who carries one. Buy the pass before you board, because ", React.createElement("strong", null, "the park does not accept cash"), "."), React.createElement("p", null, "One thing you do not need: a reservation. Yosemite is not using a timed entry reservation system in 2026."))), React.createElement("div", {
    className: "sv-fee"
  }, React.createElement("div", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("p", null, React.createElement("strong", null, "Budget the fee."), " YARTS tells its riders the entrance fee is theirs to pay. If you are waved through on an Amtrak ticket, treat it as a refund.")), React.createElement("dl", {
    className: "sv-fee__table"
  }, React.createElement("div", null, React.createElement("dt", null, "Per person, 16 and over"), React.createElement("dd", null, "$20 for seven days")), React.createElement("div", null, React.createElement("dt", null, "15 and under"), React.createElement("dd", null, "Free")), React.createElement("div", null, React.createElement("dt", null, "Non-US residents, 16 and over"), React.createElement("dd", null, "$100 more, per person")), React.createElement("div", null, React.createElement("dt", null, "Annual or America the Beautiful pass"), React.createElement("dd", null, "Covers it")), React.createElement("div", null, React.createElement("dt", null, "Cash"), React.createElement("dd", null, "Not accepted"))), React.createElement("p", {
    className: "ff-note"
  }, "The trip-cost guide works through the fee for a family and for overseas visitors: ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget"
  }, "what a Yosemite trip costs"), ".")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "in-the-park",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "GETTING AROUND"), React.createElement("h2", null, "The free shuttle, and the buses beyond the Valley"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "Once you are on the Valley floor, the ", React.createElement("strong", null, "Yosemite Valley shuttle is free"), ": no ticket, no pass. Two routes run from 7 a.m. to 10 p.m. The ", React.createElement("strong", null, "Valleywide"), " route stops at the lodges, food service, campgrounds and trailheads, and the Park Service says a bus arrives every 12 to 22 minutes. The ", React.createElement("strong", null, "East Valley"), " route covers the campgrounds and trailheads at the east end, every 8 to 12 minutes. That is the bus for Happy Isles, the Mist Trail and the Pines campgrounds. Since YARTS sets down at the lodge, the village and Curry Village, all of them on the shuttle line, you can arrive by bus and never need anything else."), React.createElement("p", null, "Beyond the Valley the choices narrow. The ", React.createElement("strong", null, "Mariposa Grove shuttle"), " is free and runs from the Welcome Plaza near the South Entrance about every 15 minutes in season, which this year ends November 30 at the latest. In winter a free shuttle runs between the Valley and Badger Pass whenever the ski area is open, typically mid-December through March. The hikers' bus to Tuolumne Meadows and the Glacier Point tour are fee-based and summer only. For a trip that stays in the Valley, the free shuttle and a bike cover almost everything; the ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "Valley parking guide"), " explains why a driver ends up doing the same thing after parking once."))), React.createElement(CarFreeValleyMap, null))), React.createElement("section", {
    className: "ff-band",
    id: "by-bike",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BY BIKE"), React.createElement("h2", null, "Twelve miles of path, and fifty free bikes"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "The Valley floor is flat, and the Park Service counts ", React.createElement("strong", null, "over 12 miles of paved bike paths"), " on it, with a 15 mph speed limit. A bike reaches the meadows, the bridges and the trailheads faster than the shuttle on a busy afternoon, and it parks anywhere."), React.createElement("p", null, "The ", React.createElement("strong", null, "Yosemite Bike Share"), " is free. The Yosemite Conservancy and the Park Service launched it in 2018, and the Conservancy has since tripled the fleet. There are ", React.createElement("strong", null, "50 bikes"), ", usually available between June and October, with dates that vary each year. Download the LINKA GO app, create an account, and scan the QR code on the bike to unlock it. Rides last up to ", React.createElement("strong", null, "two hours"), ", and you must start and end at a designated Bike Share hub; look for the blue bikes in the Yosemite Village area."), React.createElement("p", null, "For a longer ride or a child's bike, the concessioner rents bikes at ", React.createElement("strong", null, "Yosemite Valley Lodge, Curry Village and Yosemite Village"), ", roughly from early April to late October as conditions allow. A standard bike is $48 for a full day and $36.50 for a half day, and bikes with a child trailer are available."))), React.createElement("figure", {
    className: "sv-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/yosemite-valley-bike-path.jpg",
    style: {
      aspectRatio: "1600 / 1200"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A paved bike path running beside the road across the Yosemite Valley floor, with granite cliffs on the left and Half Dome in the distance"
  }), React.createElement("figcaption", null, "A Valley bike path in October. Photo: Vulturesong / Wikimedia Commons (CC0)"))), React.createElement("ul", {
    className: "ff-rules sv-rules sv-rules--four"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "Helmets under 18."), React.createElement("p", null, "Required by law for riders under 18. A rental comes with one.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "bolt",
    size: 26
  }), React.createElement("strong", null, "E-bikes are allowed."), React.createElement("p", null, "With fully operable pedals and a motor under 750 watts, wherever a bicycle may go.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No riding off the pavement."), React.createElement("p", null, "No off-trail riding and no mountain biking. Bikes stay on paved paths and roads.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "Scooters stay on paths."), React.createElement("p", null, "Electric scooters are allowed on the bike paths but not on park roads."))), React.createElement("p", {
    className: "ff-note"
  }, "In the Mariposa Grove, bikes are allowed only on the grove road between the Welcome Plaza and the Grizzly Giant, when the road is open. Rules from the Park Service's biking page; Bike Share details from the Conservancy."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "zero-waste",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ZERO WASTE"), React.createElement("h2", null, "What goes in which bin"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "The first rule is the oldest one: bring less packaging into the park. Carry a refillable water bottle, decant snacks into reusable containers at home, and pack a bag for your own trash. Water bottle ", React.createElement("strong", null, "refill stations"), " were among the first projects of the park's zero-landfill work, and there is one at The Depot, the Conservancy bookstore at the Mariposa Grove Welcome Plaza."), React.createElement("p", null, "At Park Service sites (campgrounds, visitor centers, the museum, bus stops and day-use picnic areas) ", React.createElement("strong", null, "recycling is mixed"), ": everything recyclable goes in one bin unless it is labeled otherwise. Some things never belong there. ", React.createElement("strong", null, "Styrofoam, bubble wrap, plastic bags and unlabeled plastic"), " are not recyclable in the park's system. At the hotels and restaurants, bins are separated, and food scraps go in the organic waste cans. Organics matter here: a 2015 waste audit found 684.8 tons of organic material going to the landfill every year, 32 percent of the park's landfill waste."), React.createElement("p", null, "In Yosemite, trash is also a bear problem. The Park Service's rule is to ", React.createElement("strong", null, "treat trash and recycling like food"), ": keep it in your food locker or put it in a bear-proof bin, never on the picnic table. Improper food storage can bring a fine of up to $5,000, and the ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "bear safety guide"), " explains why a bear that learns a bin is an easy meal rarely unlearns it. Backpackers carry all food, trash and toiletries in a bear-resistant container and pack every bit of it out, the rule the ", React.createElement("a", {
    href: "/articles/yosemite-wilderness-permits-guide"
  }, "wilderness permits guide"), " covers in full."), React.createElement("p", null, "The concessioner has done part of the work already. Yosemite Hospitality says it replaced single-use plastic bottles with glass or aluminum across its stores and restaurants in December 2023 and moved its grab-and-go food to compostable packaging. A refillable bottle still beats all of it."))), React.createElement("figure", {
    className: "sv-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/bear-resistant-recycling-upper-pines.jpg",
    style: {
      aspectRatio: "1600 / 1200"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A green bear-resistant recycling container beside a brown trash container in Upper Pines Campground"
  }), React.createElement("figcaption", null, "A bear-resistant recycling bin in Upper Pines Campground. Photo: Mx. Granger / Wikimedia Commons (CC0)"))), React.createElement("div", {
    className: "sv-bins"
  }, React.createElement("div", {
    className: "sv-bin sv-bin--yes"
  }, React.createElement("p", {
    className: "sv-bin__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The recycling bin"), React.createElement("p", null, "Some plastics, paper, cardboard, glass and metals. At Park Service sites, all in one bin.")), React.createElement("div", {
    className: "sv-bin sv-bin--food"
  }, React.createElement("p", {
    className: "sv-bin__head"
  }, React.createElement(EventIcon, {
    name: "food"
  }), " The organics can"), React.createElement("p", null, "Food scraps, where the hotels and restaurants provide one.")), React.createElement("div", {
    className: "sv-bin sv-bin--no"
  }, React.createElement("p", {
    className: "sv-bin__head"
  }, React.createElement(EventIcon, {
    name: "no"
  }), " Never in recycling"), React.createElement("p", null, "Styrofoam, bubble wrap, plastic bags, unlabeled plastic.")), React.createElement("div", {
    className: "sv-bin sv-bin--bear"
  }, React.createElement("p", {
    className: "sv-bin__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " Never left out"), React.createElement("p", null, "Trash and recycling go in the food locker or a bear-proof bin.")))), React.createElement("section", {
    className: "ff-band",
    id: "propane-and-fire",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("figure", {
    className: "sv-photo sv-photo--tall"
  }, React.createElement(ResponsiveImage, {
    image: "img/propane-canister-recycling-yosemite.jpg",
    style: {
      aspectRatio: "1600 / 2133"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 420px",
    alt: "A green collection bin for empty propane canisters on a concrete pad among the pines of a Yosemite Valley campground"
  }), React.createElement("figcaption", null, "A propane canister recycling bin in a Valley campground. Photo: Mx. Granger / Wikimedia Commons (CC0)")), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "PROPANE AND FIRE"), React.createElement("h2", null, "Refill the canister, buy the firewood here"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "The one-pound green propane cylinder is the campground's signature piece of waste. Around ", React.createElement("strong", null, "24,000 used cylinders"), " are collected in the park's recycling areas every year, the Conservancy says, and an unknown number go in the trash. If you use one, put the empty in a canister recycling bin, never the trash."), React.createElement("p", null, "Better, skip the disposable. Refillable canisters from Little Kamper are sold at ", React.createElement("strong", null, "the Village Store, the Curry Village Gift Shop, the Mountain Shop, the Wawona Store and the El Portal Market"), ", and an empty can be exchanged for a full one at a lower price. It is the single easiest swap in this whole guide for anyone cooking at a campsite."), React.createElement("p", null, "Firewood has a rule of its own. The park asks you not to bring firewood from more than ", React.createElement("strong", null, "50 miles away"), ", because it carries forest pests, and you can buy it at the stores near most campgrounds. Outside the Valley, below 9,600 feet, you may gather dead and down wood under six inches across, but not pine cones, needles or sequoia wood. The ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "camping guide"), " covers the rest of campground life, and the ", React.createElement("a", {
    href: "/articles/yosemite-fire-restrictions-explained"
  }, "fire restrictions guide"), " covers when fires are allowed at all."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "if-you-drive",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "IF YOU DRIVE"), React.createElement("h2", null, "Park once, fill the seats, plug in"), React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "A car is still the right tool for some trips: a family of four, where per-person bus fares add up against one vehicle pass; a dawn start before the first bus arrives; a trip that spreads from Glacier Point to Tuolumne. If you drive, drive less inside the park. Park once in the Valley and use the shuttle and the bike paths, fill every seat, and stay inside the park or close to it rather than commuting from a distant town each day."), React.createElement("p", null, "An electric car has more options than most drivers expect. The Park Service lists ", React.createElement("strong", null, "chargers in Yosemite Valley, Wawona, El Portal and Tuolumne Meadows"), ", all with J1772 connectors and all level 2. Among the Valley's chargers are 20 at Curry Village, 10 at the Yosemite Falls parking area, 8 at Yosemite Valley Lodge and 6 at The Ahwahnee; the Wawona Store has 24 and the El Portal Market 2. A level 2 charger is slow, so plug in where you plan to spend the day. The Conservancy is working with the Park Service on more chargers in the Valley and Wawona."))), React.createElement("dl", {
    className: "sv-chargers"
  }, React.createElement("div", null, React.createElement("dt", null, "Wawona Store"), React.createElement("dd", null, "24")), React.createElement("div", null, React.createElement("dt", null, "Curry Village"), React.createElement("dd", null, "20")), React.createElement("div", null, React.createElement("dt", null, "Yosemite Falls parking"), React.createElement("dd", null, "10")), React.createElement("div", null, React.createElement("dt", null, "Yosemite Valley Lodge"), React.createElement("dd", null, "8")), React.createElement("div", null, React.createElement("dt", null, "The Ahwahnee"), React.createElement("dd", null, "6")), React.createElement("div", null, React.createElement("dt", null, "El Portal Market"), React.createElement("dd", null, "2")), React.createElement("p", {
    className: "ff-note"
  }, "Level 2 chargers by location, from the Park Service's EV charging pages. Tuolumne Meadows also has chargers; the park had not published the count.")))), React.createElement("section", {
    className: "ff-band",
    id: "the-kit",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE KIT"), React.createElement("h2", null, "Six things that keep a trip out of the bin"), React.createElement("ul", {
    className: "ff-rules sv-rules sv-rules--three"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "A water bottle."), React.createElement("p", null, "Fill it at a refill station. The stores sell drinks in glass and aluminum now; a bottle you own beats both.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "food",
    size: 26
  }), React.createElement("strong", null, "Containers and a cutlery set."), React.createElement("p", null, "Decant snacks at home and carry a fork, so the takeout counter costs nothing but food.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "check",
    size: 26
  }), React.createElement("strong", null, "A bag for your own trash."), React.createElement("p", null, "On the trail, everything you carry in, you carry out. At camp, it lives in the food locker.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "fuel",
    size: 26
  }), React.createElement("strong", null, "A refillable propane canister."), React.createElement("p", null, "Sold at the Village Store, Curry Village, the Mountain Shop, Wawona and El Portal, and an empty trades for a full one at a lower price.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "ticket",
    size: 26
  }), React.createElement("strong", null, "Your entrance pass, on your phone."), React.createElement("p", null, "Bought on Recreation.gov before you board, because the gate takes no cash.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "A light pack."), React.createElement("p", null, "The bus takes any size of backpack, and the park has no luggage storage. Pack for the shuttle, not the trunk."))), React.createElement("p", {
    className: "ff-note"
  }, "The ", React.createElement("a", {
    href: "/kit"
  }, "packing checklists"), " cover the rest of the gear for each season."))), React.createElement("section", {
    className: "hp-wrap hp-section sv-close"
  }, React.createElement("div", {
    className: "sv-prose"
  }, React.createElement("p", null, "None of this is a sacrifice. The bus from Merced spares you the drive and the hunt for a parking space. On a busy afternoon a bike often beats the car across the Valley. The work behind the scenes, the bins and the compost and the zero-landfill effort that began in 2015 and that the Park Service, the concessioner and the Conservancy now run together, only works if visitors put things in the right place. That part is yours. For a first trip built around the shuttle line, start with the ", React.createElement("a", {
    href: "/articles/yosemite-in-one-or-two-days"
  }, "one or two day plan"), " and leave the car at the station."))), React.createElement("section", {
    className: "ff-band",
    id: "sustainable-yosemite-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Car-free and zero-waste Yosemite, answered"), React.createElement("div", {
    className: "sv-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/publictransportation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Public transportation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Entrance fees, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/biking.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Biking, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/getinvolved/zlf.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Recycling and zero landfill, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/ccparkresponse.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The park's climate response, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/bears.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bears and food storage, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campregs.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campground regulations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mg.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/ev-charging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "EV charging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
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
    href: "https://www.amtrak.com/san-joaquins/yosemite-national-park",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite by train, Amtrak")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/impact/sustainability/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Sustainability, Yosemite Conservancy")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/yosemite-bike-share/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Bike Share, Yosemite Conservancy")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/biking/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bike rentals, Yosemite Hospitality"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
