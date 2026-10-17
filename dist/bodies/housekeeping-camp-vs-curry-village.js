window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["housekeeping-camp-vs-curry-village"] = function HousekeepingCampVsCurryVillageBody() {
  var TY = "https://www.travelyosemite.com/lodging/";
  var TOC = [["#side-by-side", "Side by side"], ["#housekeeping-camp", "Housekeeping Camp"], ["#curry-village", "Curry Village"], ["#the-seasons", "The seasons"], ["#the-food", "The food"], ["#the-bears", "The bears"], ["#what-it-costs", "What it costs"], ["#who-should-book-which", "Who books which"], ["#housekeeping-vs-curry-questions", "Questions"]];
  var COMPARE = [["What you sleep in", "A three-sided concrete unit, canvas roof, privacy curtain", "A canvas tent cabin, a wood cabin with bath, or a Stoneman motel room"], ["Beds", "A set of twin bunks and a double bed; two cots make six. Bring bedding or rent a bed pack", "Real beds, with linens"], ["Power", "Electric lights and outlets", "Unheated tent: a light, no outlet. Heated tent: one outlet. Cabins and rooms: lights, outlets, heat"], ["Bathroom", "Shared shower house for guests, with soap and towels", "Shared for the tents; private in the cabins with bath and the Stoneman rooms"], ["Cooking", "Your own, over the unit's fire ring; wood fires 5 to 10 p.m.", "None at the unit. Kitchens and a grocery in the compound"], ["Bear locker", "Two at every unit", "One at every tent cabin"], ["Season", "Spring to fall: April 3 to October 12 in 2026", "Year-round; closed November 29 to December 10, 2026"], ["Pets", "Service animals only", "Service animals only"], ["Book at", "travelyosemite.com", "travelyosemite.com"]];
  var PINS = [{
    n: "1",
    at: [451, 255],
    tone: "rust",
    name: "Housekeeping Camp, on the Merced"
  }, {
    n: "2",
    at: [600, 372],
    tone: "rust",
    name: "Curry Village, below Glacier Point"
  }, {
    n: "3",
    at: [385, 145],
    tone: "ink",
    name: "Yosemite Village and the Village Store"
  }];
  var KITCHENS = [["Seven Tents Pavilion", "Breakfast 7 to 10 a.m., dinner 5:30 to 8:30 p.m.", "Homestyle meals, indoor seating."], ["Pizza Deck", "11 a.m. to 10 p.m.; noon to 9 p.m. from October 26", "Pizza, salad and garlic bread, outdoor seating."], ["Coffee Corner", "6 a.m. to 2 p.m.; 6:30 to 11 a.m. from October 26", "Peet's coffee and a light breakfast, early enough for a trail start."], ["Bar 1899", "11:30 a.m. to 10 p.m.; 4 to 9 p.m. from October 25", "Craft beer, cocktails and light entrées, inside and out."], ["Gift & Grocery", "8 a.m. to 8 p.m.", "Gifts and grocery essentials."]];
  var FAQ = [["What is the difference between Housekeeping Camp and Curry Village?", "Housekeeping Camp is 266 three-sided concrete units with canvas roofs on the Merced River, each with a set of twin bunks, a double bed, a covered patio, a fire ring and bear lockers; you bring bedding and cook your own meals. Curry Village is canvas tent cabins, wood cabins with bath and Stoneman motel rooms with made-up beds, shared bathrooms for the tents, and its own kitchens and grocery in the compound. Housekeeping Camp is open spring to fall only; Curry Village runs most of the year."], ["Is Housekeeping Camp open in winter?", "No. It runs spring to fall, and its 2026 season was April 3 to October 12. Its store closed with the camp on October 12, 2026. In winter, Curry Village's heated tent cabins are the nearest equivalent on the Valley floor."], ["Can you cook at Housekeeping Camp?", "Yes. Each unit has a fire ring with a grill grate, and wood fires are allowed from 5 to 10 p.m. The concessioner says its units are the only accommodations in Yosemite where outdoor cooking is permitted. Curry Village has no cooking at the units; you eat at its kitchens or buy food at its grocery."], ["Do you need to bring bedding to Housekeeping Camp?", "Yes, or rent a bed pack: $15 a night for a double (two blankets, two sheets, two pillows) and $9 for a single."], ["What food is there at Curry Village?", "The September 23 to November 24, 2026 Yosemite Guide lists four kitchens and a store: the Seven Tents Pavilion for breakfast and dinner, the Pizza Deck, the Coffee Corner, Bar 1899 and the Gift & Grocery. The Meadow Grill taqueria and Jennie's Ice Cream are summer counters, listed as closed for the season. Hours change through the year; the current Yosemite Guide prints them."], ["Was Curry Village called Half Dome Village?", "Yes, from 2016 to 2019, during the trademark dispute with the park's former concessioner that also renamed the Ahwahnee. It has been Curry Village again since 2019, though some older pages and photos still use the other name."], ["How do you book Housekeeping Camp or Curry Village?", "Both are run by the park concessioner, Yosemite Hospitality, and book through travelyosemite.com. Reservations open 366 days ahead. The first night is charged at booking and refunded if you cancel at least seven days before arrival; Housekeeping Camp keeps a $15 fee on those cancellations."]];
  function CampsMap() {
    return React.createElement("figure", {
      className: "npsmap hk-map"
    }, React.createElement("div", {
      className: "npsmap__frame"
    }, React.createElement("img", {
      src: "/img/nps-valley-dining-map.jpg",
      width: "840",
      height: "500",
      loading: "lazy",
      decoding: "async",
      alt: "National Park Service map of the east end of Yosemite Valley, with Housekeeping Camp marked on the Merced River, Curry Village marked on the south side of the Valley below Glacier Point, and Yosemite Village to the northwest."
    }), React.createElement("svg", {
      viewBox: "0 0 840 500",
      "aria-hidden": "true",
      focusable: "false"
    }, PINS.map(p => React.createElement("g", {
      key: p.n
    }, React.createElement("circle", {
      cx: p.at[0],
      cy: p.at[1],
      r: "16",
      className: "npsmap__pin npsmap__pin--" + p.tone
    }), React.createElement("text", {
      x: p.at[0],
      y: p.at[1] + 5,
      textAnchor: "middle",
      className: "npsmap__num"
    }, p.n))))), React.createElement("figcaption", null, PINS.map(p => React.createElement("span", {
      key: p.n
    }, React.createElement("b", null, p.n), " ", p.name)), React.createElement("span", null, "Map: National Park Service (public domain), cropped.")));
  }
  return React.createElement("div", {
    className: "hk-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Housekeeping Camp"), React.createElement("dd", null, "Spring to fall only")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "bed"
  }), React.createElement("dt", null, "Curry Village"), React.createElement("dd", null, "Open most of the year")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "food"
  }), React.createElement("dt", null, "Cook your own"), React.createElement("dd", null, "Housekeeping Camp only")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Both book"), React.createElement("dd", null, "travelyosemite.com, 366 days out"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section hk-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, React.createElement("strong", null, "Housekeeping Camp"), " and ", React.createElement("strong", null, "Curry Village"), " sit a short way apart on the east end of the Valley floor. Both put canvas over most of their guests and a steel bear locker beside them, both are run by the same concessioner, and both book on the same website. They are not the same kind of night."), React.createElement("p", null, "Housekeeping Camp is a seasonal river camp where you bring your own bedding and cook dinner over your own fire. Curry Village is a village of tent cabins, cabins and motel rooms with made-up beds, a pizza deck, a dining hall and a grocery, open most of the year. Pick by how you want to eat, what month you are coming, and how much of camping you actually want to do.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Cooking your own, with a fire and a river beach: Housekeeping Camp."), React.createElement("li", null, "A made-up bed and someone else's pizza: Curry Village."), React.createElement("li", null, "Mid-October to March: Curry Village. Housekeeping Camp is closed."), React.createElement("li", null, "At either one, everything with a scent goes in the bear locker.")), React.createElement("a", {
    className: "hk-short__link",
    href: "#side-by-side"
  }, "The two side by side ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "side-by-side",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SIDE BY SIDE"), React.createElement("h2", null, "Two canvas roofs, two different trips"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "Both are on the Valley floor's east end, on the free shuttle loop. Housekeeping Camp is on the bank of the ", React.createElement("strong", null, "Merced River"), ", west of Curry Village, at shuttle stop 12. Curry Village sits against the south wall, below Glacier Point, at stops 14 and 19, and the ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "Mist Trail"), " starts one stop on, at Happy Isles. The YARTS bus from Merced stops at Curry Village."), React.createElement("p", null, "Neither is a campground. The Park Service's 13 campgrounds book through Recreation.gov and are a separate system; ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), " covers those. These two are concessioner lodging, which means a roof, a bed and a front desk, and a price that moves with the date."))), React.createElement(CampsMap, null)), React.createElement("div", {
    className: "hk-compare-wrap"
  }, React.createElement("table", {
    className: "hk-compare"
  }, React.createElement("caption", null, "Housekeeping Camp and Curry Village, row by row"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, React.createElement("span", {
    className: "hp-sr-only"
  }, "Feature")), React.createElement("th", {
    scope: "col"
  }, "Housekeeping Camp"), React.createElement("th", {
    scope: "col"
  }, "Curry Village"))), React.createElement("tbody", null, COMPARE.map(([row, hk, cv]) => React.createElement("tr", {
    key: row
  }, React.createElement("th", {
    scope: "row"
  }, row), React.createElement("td", null, hk), React.createElement("td", null, cv)))))), React.createElement("p", {
    className: "ff-note"
  }, "From the concessioner's property pages and the Park Service, read October 17, 2026; season dates are 2026's. The full list of beds inside the park, the Ahwahnee to the High Sierra Camps: ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay in Yosemite"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "housekeeping-camp",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HOUSEKEEPING CAMP"), React.createElement("h2", null, "Half camping, on the river"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "Housekeeping Camp is ", React.createElement("strong", null, "266 units"), ", each a three-sided concrete structure with a canvas roof and a privacy curtain across the open side. Inside there is a set of twin bunks and a double bed, a table, chairs and a mirror, electric lights and outlets. The covered patio has a fire ring with a grill grate, and each unit has two bear lockers of different sizes. A unit sleeps up to six with two cots added."), React.createElement("p", null, "You bring your own bedding, or rent a ", React.createElement("strong", null, "bed pack"), ": $15 a night for a double (two blankets, two sheets, two pillows), $9 for a single. You cook your own meals over the fire ring, and wood fires are allowed from 5 to 10 p.m. The concessioner calls these the only accommodations in Yosemite where outdoor cooking is permitted. The Merced's sandy beaches are at the edge of the camp for the hot afternoons, and the place feels like a family summer camp."), React.createElement("p", null, "It is austere. The walls are concrete, the curtain is a curtain, there is no door to lock, and the neighbors are close. The camp has a laundry room, a guests-only shower house with soap and towels, and a small store with groceries and camp supplies. It suits people who want to half-camp: camping's campfire and cooler, with a bed frame and no tent to pitch."))), React.createElement("div", {
    className: "hk-unit"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ONE UNIT"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Walls"), React.createElement("dd", null, "Concrete on three sides, a curtain on the fourth")), React.createElement("div", null, React.createElement("dt", null, "Roof"), React.createElement("dd", null, "Canvas, over the room and the patio")), React.createElement("div", null, React.createElement("dt", null, "Beds"), React.createElement("dd", null, "Twin bunks and a double bed; up to six with two cots")), React.createElement("div", null, React.createElement("dt", null, "Power"), React.createElement("dd", null, "Electric lights and outlets")), React.createElement("div", null, React.createElement("dt", null, "Outside"), React.createElement("dd", null, "A fire ring with a grill grate and two bear lockers")), React.createElement("div", null, React.createElement("dt", null, "Bedding"), React.createElement("dd", null, "Bring it, or rent a bed pack: $15 double, $9 single")), React.createElement("div", null, React.createElement("dt", null, "Showers"), React.createElement("dd", null, "7 a.m. to 10 p.m., guests only")), React.createElement("div", null, React.createElement("dt", null, "Laundry"), React.createElement("dd", null, "8 a.m. to 10 p.m."))), React.createElement("p", {
    className: "ff-note"
  }, "Shower hours are the concessioner's; laundry hours are the September 23 to November 24, 2026 Yosemite Guide's, which still lists the laundry after the camp's store closed on October 12, 2026.")))), React.createElement("section", {
    className: "ff-band",
    id: "curry-village",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("figure", {
    className: "hk-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/curry-village.jpg",
    style: {
      aspectRatio: "1600 / 1072"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Wooden cabins at Curry Village among pines and granite boulders"
  }), React.createElement("figcaption", null, "Cabins at Curry Village. Photo: US National Park Service / Wikimedia Commons (public domain)")), React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CURRY VILLAGE"), React.createElement("h2", null, "A village of canvas under Glacier Point"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "Curry Village has taken guests at the base of Glacier Point since 1899, when David and Jennie Curry, two former schoolteachers, founded it. Today it is mostly ", React.createElement("strong", null, "canvas tent cabins"), " (canvas walls and roof, real beds, no plumbing), with ", React.createElement("strong", null, "wood cabins"), " that have their own bath and electric heat, and the ", React.createElement("strong", null, "Stoneman"), " rooms, motel rooms with private bathrooms and one to three double beds."), React.createElement("p", null, "The heat question decides the tent. An ", React.createElement("strong", null, "unheated tent"), " has electric light and no outlet, and it is cold in spring and fall. A ", React.createElement("strong", null, "heated tent"), " has one outlet, and the concessioner runs the heat from the Tuesday after Labor Day to the Friday before Memorial Day. The shower house is open around the clock, Wi-Fi is in the guest lounge rather than the tents, and quiet hours run 10 p.m. to 6 a.m., because canvas carries every sound in both directions."), React.createElement("p", null, "Around the tents is the rest of the village: the kitchens, a pool from Memorial Day to Labor Day, a bike stand from spring to fall, the Mountain Shop, and the Yosemite Mountaineering School's guided hikes and climbing classes (the bike stand and the school both closed for 2026 on October 25). In winter there is an outdoor ice rink, which the current Yosemite Guide lists as opening November 13, 2026, if conditions allow.")))), React.createElement("table", {
    className: "hk-rooms"
  }, React.createElement("caption", null, "The four kinds of room at Curry Village"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Room"), React.createElement("th", {
    scope: "col"
  }, "Bath"), React.createElement("th", {
    scope: "col"
  }, "Power and heat"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Unheated tent"), React.createElement("td", null, "Shared"), React.createElement("td", null, "A light, no outlet, no heat")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Heated tent"), React.createElement("td", null, "Shared"), React.createElement("td", null, "One outlet; heat from September to May")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Cabin with bath"), React.createElement("td", null, "Private"), React.createElement("td", null, "Lights, outlets, electric heater")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Stoneman room"), React.createElement("td", null, "Private"), React.createElement("td", null, "Lights, outlets, heat; one to three double beds")))), React.createElement("p", {
    className: "ff-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "The name."), " From 2016 to 2019 the place was called ", React.createElement("strong", null, "Half Dome Village"), ", during the trademark dispute with the park's former concessioner that also renamed the Ahwahnee. It has been Curry Village again since 2019, but some older pages and photo captions still carry the other name. They are the same place. And the village stops where it does for a reason: after rockfalls off Glacier Point on October 7 and 8, 2008, the Park Service permanently closed 233 units under the cliff, about a third of what the village offered visitors. ", React.createElement("a", {
    href: "/articles/yosemite-rockfall"
  }, "The rockfall article"), " tells that story.")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "the-seasons",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE SEASONS"), React.createElement("h2", null, "The calendar decides before you do"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "For half the year there is no choice to make. Housekeeping Camp runs ", React.createElement("strong", null, "spring to fall"), ": its 2026 season was April 3 to October 12. Curry Village runs ", React.createElement("strong", null, "most of the year"), ", with one gap: in 2026 the concessioner lists it as not open from November 29 through December 10."), React.createElement("p", null, "This piece prints only the 2026 dates. Check the concessioner's ", React.createElement("a", {
    href: TY + "housekeeping-camp/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Housekeeping Camp page"), " for the 2027 season before you plan an April trip around it: the opening date is the concessioner's to set, and the Park Service describes the season only as approximately mid-April to early October, conditions permitting.")), React.createElement("ol", {
    className: "hk-seasons"
  }, React.createElement("li", {
    className: "is-hk"
  }, React.createElement("span", null, "Housekeeping Camp"), React.createElement("strong", null, "April 3 to October 12, 2026"), React.createElement("p", null, "Spring to fall. The store closes with the camp.")), React.createElement("li", {
    className: "is-cv"
  }, React.createElement("span", null, "Curry Village"), React.createElement("strong", null, "Most of the year"), React.createElement("p", null, "Not open November 29 to December 10, 2026.")), React.createElement("li", {
    className: "is-heat"
  }, React.createElement("span", null, "Curry's heated tents"), React.createElement("strong", null, "Heat from September to May"), React.createElement("p", null, "The Tuesday after Labor Day to the Friday before Memorial Day.")))), React.createElement("p", {
    className: "ff-note"
  }, "Coming in the cold months? ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "Yosemite in winter"), " has the roads, the chains and what stays open.")), React.createElement("section", {
    className: "ff-band",
    id: "the-food",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE FOOD"), React.createElement("h2", null, "Your own fire, or the pizza deck"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "At ", React.createElement("strong", null, "Housekeeping Camp"), " you are the kitchen. Bring a cooler, a pan and the food for the trip, and cook over the fire ring between 5 and 10 p.m. The camp store sells groceries while the camp is open, and the ", React.createElement("strong", null, "Village Store"), " in Yosemite Village carries the park's largest selection of groceries. The kitchens at Curry Village are an easy walk or a shuttle ride when nobody wants to cook."), React.createElement("p", null, React.createElement("strong", null, "Curry Village"), " is the other way round. There is no cooking at the tents, and the compound's kitchens feed you instead: four on the current Guide's list, and a grocery. The Pizza Deck is the obvious stop after a hike, and the Coffee Corner opens early enough for a trail start, which saves the drive to Yosemite Village for coffee. Hours shrink after the summer, so read them against the date you arrive; the current Guide's are beside this paragraph. The Meadow Grill taqueria and Jennie's Ice Cream are summer counters, and the current edition lists both as closed for the season."))), React.createElement("div", null, React.createElement("h3", {
    className: "hk-kitchens__head"
  }, "Curry Village, by the current Yosemite Guide"), React.createElement("ol", {
    className: "ff-hours hk-kitchens"
  }, KITCHENS.map(([name, hours, note]) => React.createElement("li", {
    key: name
  }, React.createElement("span", null, name), React.createElement("p", null, React.createElement("strong", null, hours), " ", note)))), React.createElement("p", {
    className: "ff-note"
  }, "The September 23 to November 24, 2026 edition. The Park Bulletin carries every hour in the park as it reads today: ", React.createElement("a", {
    href: "/now"
  }, "the Park Bulletin"), "."))), React.createElement("p", {
    className: "ff-note"
  }, "Every kitchen in the park, from the Ahwahnee's dining room to the Tuolumne grill, and where to buy groceries: ", React.createElement("a", {
    href: "/articles/where-to-eat-yosemite"
  }, "where to eat in Yosemite"), "."))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "the-bears",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BEARS"), React.createElement("h2", null, "The locker is not optional at either"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "Canvas is not a barrier a bear respects, and concrete with a curtain is not much better. The Park Service requires every Housekeeping Camp guest and every Curry Village tent-cabin guest to keep all food in the lockers provided, and never to keep food, drinks, toiletries or trash in a tent or tent cabin. To a bear, food includes trash, recycling, toiletries, soap, unwashed dishes and anything else with a scent, and coolers count even when empty. Guests in Curry's hard-sided cabins and Stoneman rooms may keep food inside the room."), React.createElement("p", null, "The car is not the answer. After dark, nothing with a scent stays in a vehicle, trunk included, and by day food, drinks and coolers stay hidden from sight with the windows closed. A violation can bring a fine of up to $5,000. Housekeeping Camp asks more of you here, because you arrive with a cooler and a week of groceries; plan where it all goes before you unload. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " lists what counts as food and why the rule exists."))), React.createElement("ul", {
    className: "ff-rules hk-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "In the locker"), React.createElement("p", null, "All food and drinks, coolers even when empty, trash, recycling, toiletries, soap, unwashed dishes.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Not in the car"), React.createElement("p", null, "Nothing with a scent after dark, and nothing in view by day.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Every time"), React.createElement("p", null, "Close and latch it whenever you leave the unit, even for a few minutes.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "ticket",
    size: 26
  }), React.createElement("strong", null, "Up to $5,000"), React.createElement("p", null, "The fine for a storage violation, with food or a car liable to be impounded."))))), React.createElement("section", {
    className: "ff-band",
    id: "what-it-costs",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHAT IT COSTS"), React.createElement("h2", null, "Priced by the night you search"), React.createElement("div", {
    className: "hk-prose"
  }, React.createElement("p", null, "This piece does not print nightly rates, because the concessioner posts no standing price for either place: the booking page shows the price for the night and room type you search. What it does post: occupancy over two adults costs extra at Curry Village ($17.50 per added person 13 and older in a tent, $14 in a cabin, $9.75 in a Stoneman room, plus tax), Housekeeping Camp's bed packs are $15 and $9 a night, and lodging tax and assessments add about 13.7 percent to the room (a 12 percent occupancy tax, a 1.5 percent tourism district assessment and a 0.2 percent state tourism fee)."), React.createElement("p", null, "Count the whole trip, not the night. A Housekeeping Camp family that cooks its own meals spends very little on food once the cooler is packed. A Curry Village family eats at the kitchens, which is the convenience it is paying for. ", React.createElement("a", {
    href: "/articles/yosemite-trip-cost-budget"
  }, "The trip-cost breakdown"), " runs the full numbers for a week."))), React.createElement("ol", {
    className: "ff-timeline hk-steps"
  }, React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "366 days out"), React.createElement("strong", null, "The date opens"), React.createElement("p", null, "On travelyosemite.com, or by phone at 888/413-8869.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "At booking"), React.createElement("strong", null, "The first night is charged"), React.createElement("p", null, "A deposit of the first night, when you pay by card.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Seven days out"), React.createElement("strong", null, "The last refundable cancellation"), React.createElement("p", null, "Cancel at least seven days before arrival and the deposit comes back, less a $15 fee at Housekeeping Camp.")), React.createElement("li", {
    className: "is-open"
  }, React.createElement("span", null, "Any morning"), React.createElement("strong", null, "Check again"), React.createElement("p", null, "The Park Service says lodging cancellations are common and appear in the morning."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "who-should-book-which",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHO SHOULD BOOK WHICH"), React.createElement("h2", null, "Pick by how you want to eat"), React.createElement("div", {
    className: "hk-choose"
  }, React.createElement("div", {
    className: "hk-choose__col hk-choose__col--hk"
  }, React.createElement("p", {
    className: "hk-choose__head"
  }, React.createElement(EventIcon, {
    name: "food",
    size: 24
  }), " Book Housekeeping Camp if"), React.createElement("ul", null, React.createElement("li", null, "You are a family or a group of up to six who would rather cook than queue."), React.createElement("li", null, "You want a campfire and a river beach, and no tent to pitch."), React.createElement("li", null, "You could not get a campground reservation and want the next thing to it."), React.createElement("li", null, "Your trip falls between early April and mid-October, by 2026's dates."))), React.createElement("div", {
    className: "hk-choose__col"
  }, React.createElement("p", {
    className: "hk-choose__head"
  }, React.createElement(EventIcon, {
    name: "bed",
    size: 24
  }), " Book Curry Village if"), React.createElement("ul", null, React.createElement("li", null, "You want a made-up bed and someone else to make dinner."), React.createElement("li", null, "You are hiking, and the room is a place to sleep between trails."), React.createElement("li", null, "You are coming in late fall or winter: book a heated tent, or a cabin."), React.createElement("li", null, "You want a private bathroom: a cabin with bath or a Stoneman room.")))), React.createElement("div", {
    className: "hk-prose hk-who"
  }, React.createElement("p", null, "Two warnings, one for each. Curry Village is not a quiet hotel at a discount: the canvas is thin and the village is busy, and it works best for families and hikers who treat the tent as a place to sleep. Housekeeping Camp is not a cabin: it is concrete, canvas and a curtain, and it rewards the visitor who arrives packed like a camper. If you are first-time campers, ", React.createElement("a", {
    href: "/articles/camping-in-yosemite-first-time"
  }, "the first-time camping guide"), " is a good test of whether you want the fire ring. Neither place takes pets beyond service animals; ", React.createElement("a", {
    href: "/articles/pets-in-yosemite"
  }, "the pets guide"), " has what does."), React.createElement("p", null, "If both are full, rooms come back. The Park Service's advice is to check the concessioner's site every morning. If nothing turns up, ", React.createElement("a", {
    href: "/stay"
  }, "the lodging page"), " has the gateway towns and their drive times."))), React.createElement("section", {
    className: "ff-band",
    id: "housekeeping-vs-curry-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Housekeeping Camp and Curry Village, answered"), React.createElement("p", {
    className: "ff-lede"
  }, "Getting around once you are parked: ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "the Valley parking guide"), " and ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "the shuttle and YARTS guide"), "."), React.createElement("div", {
    className: "hk-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: TY + "housekeeping-camp/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Housekeeping Camp, Travel Yosemite (Yosemite Hospitality)")), React.createElement("li", null, React.createElement("a", {
    href: TY + "curry-village/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Curry Village, Travel Yosemite (Yosemite Hospitality)")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/plan/policies-information",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Policies and information, Travel Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/upload/Yosemite-Guide-51-8-508V1.pdf",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Guide, September 23 to November 24, 2026, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservehelp.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservations help, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/housekeeping-camp.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Housekeeping Camp, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/curry-village.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Curry Village, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camping, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/bears.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bears and food storage, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/cvrockfall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Curry Village rockfall closures, NPS (2008)")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-140/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 140 route, YARTS"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))));
};
