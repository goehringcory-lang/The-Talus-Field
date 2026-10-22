window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-in-july-and-august"] = function YosemiteInJulyAndAugustBody() {
  var TOC = [["#ja-weather", "Weather"], ["#ja-crowds", "Crowds"], ["#ja-water", "Waterfalls and rivers"], ["#ja-high", "The high country"], ["#ja-smoke", "Smoke and fire"], ["#ja-plan", "Booking"], ["#ja-months", "July or August"], ["#ja-questions", "Questions"]];
  var FAQ = [["How hot is Yosemite in July and August?", "The Park Service's 1991 to 2020 averages put Yosemite Valley, at 4,000 feet, at a high of 89°F and a low of 57°F in both months. Tuolumne Meadows, at 8,600 feet, averages a high of 72°F in July and 70°F in August, with lows near 39°F and 37°F."], ["Is July or August busier in Yosemite?", "July, by a little. The Park Service's monthly averages for 2010 to 2024 are 624,559 visits in July and 607,000 in August, each about 15 percent of the year. Saturdays and holiday weekends are the busiest days, and Valley parking is usually full after 8 am."], ["Do you need a reservation to enter Yosemite in summer?", "Not in 2026: the Park Service said it would not use a timed entrance reservation system that year. It has not announced its plan for summer 2027, so check the park's reservations page before you go. The entrance fee is $35 per vehicle, valid for seven days."], ["Are the waterfalls running in July and August?", "Thinly. The Park Service says peak runoff is usually in May or June, that Yosemite Falls flows roughly November through July, and that some falls are often only a trickle or completely dry by August."], ["Is Tioga Road open in July and August?", "In a normal year, yes. The Park Service says Tioga Road is typically open to vehicles from late May or June until sometime in November. There is no gas in Tuolumne Meadows."], ["Is there smoke in Yosemite in August?", "Often. The Park Service says smoky conditions are most common in August and September, and that bad air can last one to three weeks in a typical year. Check the park's air quality monitors before you go."]];
  var CLIMATE = [["Yosemite Valley", "4,000 ft", "89°F / 57°F", "89°F / 57°F", "0.3 in / 0.2 in"], ["Tuolumne Meadows", "8,600 ft", "72°F / 39°F", "70°F / 37°F", "0.5 in / 0.5 in"]];
  var VISITS = [{
    m: "June",
    v: "526,209",
    pct: "13%",
    w: 84
  }, {
    m: "July",
    v: "624,559",
    pct: "15%",
    w: 100,
    glow: true
  }, {
    m: "August",
    v: "607,000",
    pct: "15%",
    w: 97,
    glow: true
  }, {
    m: "September",
    v: "511,200",
    pct: "13%",
    w: 82
  }];
  var HIGH = [["Tioga Road", "Typically late May or June to sometime in November"], ["Tuolumne Meadows Lodge", "June 5 to September 13 in 2026, conditions permitting"], ["Tuolumne Meadows shuttle", "Typically mid-June to early September"], ["YARTS Highway 120 East", "Daily, July through September, conditions permitting"], ["Tuolumne Meadows Campground", "Roughly July to late September"], ["Gas in Tuolumne Meadows", "None"]];
  var MONTHS = [{
    name: "July",
    cls: "is-july",
    lines: ["The busiest month of the year, on the Park Service's average.", "Yosemite Falls is in its last month on the Park Service's flow calendar.", "The Fourth of July holiday weekend. Fireworks are not allowed in the park.", "Afternoon thunderstorms in the high country."]
  }, {
    name: "August",
    cls: "is-august",
    lines: ["About 17,500 fewer visits than July, on the same average.", "Some falls are only a trickle or dry.", "The start of the park's smokiest two months.", "The same Valley averages: 89°F high, 57°F low."]
  }];
  return React.createElement("div", {
    className: "ja-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("dt", null, "Valley average"), React.createElement("dd", null, "89°F high, 57°F low")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "mountain"
  }), React.createElement("dt", null, "Tuolumne average"), React.createElement("dd", null, "72°F in July, 70°F in August")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("dt", null, "Visits"), React.createElement("dd", null, "The two busiest months, 15% each")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "ticket"
  }), React.createElement("dt", null, "Entrance"), React.createElement("dd", null, "$35 a vehicle, seven days"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ja-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "July and August are when Yosemite is most open and most full. Every road is usually clear of snow, the high country is in season, and the Park Service counts about 15 percent of the year's visits in each month. The Valley floor averages 89°F in the afternoon; Tuolumne Meadows, up Tioga Road at 8,600 feet, averages about 70."), React.createElement("p", null, "The trade is simple to state. The waterfalls are past their peak, the Valley is hot and crowded at midday, and in August the air is often smoky. The high country, the rivers and the early morning are at their best."), React.createElement("p", null, "This is the evergreen guide to both months. The numbers below come from the Park Service and the park's concessioner; where a figure is for 2026 only, it says so. Confirm anything dated before a 2027 trip.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Be through the gate before 8 am. Valley parking is usually full after that."), React.createElement("li", null, "Spend the hot afternoon high, in Tuolumne Meadows, or in the river."), React.createElement("li", null, "Be off summits and ridges by early afternoon. Storms build after noon."), React.createElement("li", null, "Check the air quality, especially in August.")), React.createElement("a", {
    className: "ja-short__link",
    href: "#ja-months"
  }, "July or August, side by side ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "ja-weather",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WEATHER"), React.createElement("h2", null, "Two climates, one road apart"), React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, "The Park Service's ", React.createElement("a", {
    href: "/articles/yosemite-weather-by-month"
  }, "1991 to 2020 averages"), " put Yosemite Valley, at 4,000 feet, at a high of 89°F and a low of 57°F in both July and August, with almost no rain: 0.3 inches in July and 0.2 in August. Tuolumne Meadows, at 8,600 feet, averages 72°F in July and 70°F in August, and drops to the high thirties at night. The park gets 95 percent of its precipitation between October and May."), React.createElement("p", null, "An average is not a ceiling. On the Valley floor the granite holds the heat through the afternoon, and the climbs out of it, the Mist Trail and the Yosemite Falls Trail, are where summer heat puts hikers in the clinic. Our ", React.createElement("a", {
    href: "/articles/yosemite-heat-safety-guide"
  }, "heat safety guide"), " covers which trails run hottest and when to be on them. The Park Service's own minimum is a quart of water every two hours."), React.createElement("p", null, React.createElement("strong", null, "Thunderstorms."), " The Park Service says storms are most common from June through September and most common in the afternoon, and that from July to September the North American monsoon can carry moisture into the Sierra Nevada. Its advice for the backcountry: be above treeline or on the rim in the morning and summit peaks before noon. If you hear thunder, a storm is within 10 miles. There is no safe shelter outside; the only safe places are a substantial building or a hard-topped vehicle. In July 1985 lightning on Half Dome killed two people and injured three."))), React.createElement("div", null, React.createElement("h3", {
    className: "ja-head"
  }, "The Park Service's averages, 1991 to 2020"), React.createElement("table", {
    className: "ja-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Place"), React.createElement("th", {
    scope: "col"
  }, "Elevation"), React.createElement("th", {
    scope: "col"
  }, "July high / low"), React.createElement("th", {
    scope: "col"
  }, "August high / low"), React.createElement("th", {
    scope: "col"
  }, "Rain, Jul / Aug"))), React.createElement("tbody", null, CLIMATE.map(([place, elev, jul, aug, rain]) => React.createElement("tr", {
    key: place
  }, React.createElement("th", {
    scope: "row"
  }, place), React.createElement("td", {
    "data-label": "Elevation"
  }, elev), React.createElement("td", {
    "data-label": "July"
  }, jul), React.createElement("td", {
    "data-label": "August"
  }, aug), React.createElement("td", {
    "data-label": "Rain"
  }, rain))))), React.createElement("p", {
    className: "ff-alert ja-alert"
  }, React.createElement(EventIcon, {
    name: "bolt"
  }), React.createElement("span", null, React.createElement("strong", null, "Off the high points by early afternoon."), " Storms build after noon. If you hear thunder, descend, and wait 30 minutes after the last of it.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ja-crowds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CROWDS"), React.createElement("h2", null, "The two busiest months of the year"), React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, "By the Park Service's monthly averages for 2010 to 2024, July is the busiest month in Yosemite at 624,559 visits, and August is next at 607,000. Each is about 15 percent of the year. Nearly three quarters of the year's visitors come between May and October."), React.createElement("p", null, "The crowd is not spread evenly. The Park Service's traffic page says Saturdays and holiday weekends are the worst, that Valley parking is usually full after 8 am, and that once the lots fill, traffic can back up for miles. Its advice is to arrive early, stay late, and come midweek. Our ", React.createElement("a", {
    href: "/articles/yosemite-crowds-by-month"
  }, "crowds by month"), " guide has the full table and the five places the crowd piles up."), React.createElement("p", null, React.createElement("strong", null, "No entrance reservation in 2026."), " The Park Service said it would not use a timed entrance reservation system in 2026. It has not said what it will do in summer 2027; check its reservations page before you plan around either answer. The entrance fee is $35 per private vehicle, good for seven consecutive days. The park also lists a $100 per-person surcharge for non-US residents 16 and older who do not hold an annual or America the Beautiful pass. The 2026 fee-free days for US citizens and residents included July 3 to 5 and August 25; the 2027 list was not posted when we checked."))), React.createElement("div", null, React.createElement("h3", {
    className: "ja-head"
  }, "Average monthly visits, 2010 to 2024"), React.createElement("ol", {
    className: "ja-visits"
  }, VISITS.map(r => React.createElement("li", {
    key: r.m,
    className: r.glow ? "is-glow" : undefined
  }, React.createElement("span", {
    className: "ja-visits__m"
  }, r.m), React.createElement("span", {
    className: "ja-visits__bar",
    "aria-hidden": "true"
  }, React.createElement("i", {
    style: {
      width: r.w + "%"
    }
  })), React.createElement("span", {
    className: "ja-visits__v"
  }, r.v, " ", React.createElement("em", null, r.pct))))), React.createElement("p", {
    className: "ff-note"
  }, "Source: the Park Service's visitation statistics page. Bars are scaled to July.")))), React.createElement("section", {
    className: "ff-band",
    id: "ja-water",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WATERFALLS AND RIVERS"), React.createElement("h2", null, "Less in the falls, more in the river"), React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The waterfalls."), " The Park Service says peak runoff usually comes in May or June. It lists Yosemite Falls as flowing roughly November through July, and it says some falls are often only a trickle or completely dry by August. Vernal Fall, below the Mist Trail, narrows in mid to late summer and can split into two or three strands. If the falls are the reason for the trip, July is the last month that gives you a fair chance at Yosemite Falls, and ", React.createElement("a", {
    href: "/articles/yosemite-in-june"
  }, "June"), " is the better bet."), React.createElement("p", null, React.createElement("strong", null, "The river."), " The same drop in snowmelt is what makes the Merced swimmable. Our guide to ", React.createElement("a", {
    href: "/articles/swimming-in-the-merced"
  }, "swimming in the Merced"), " puts the usual window at about mid-July into September, and says what matters is the flow on the day you are standing there. The Park Service's warnings hold all summer: the water is extremely cold even on a hot day, even a slow current will take you where you may not want to go, and submerged branches and rock gaps can hold a swimmer under. Swimming is closed at Emerald Pool above Vernal Fall. Obey the signs that say no swimming."))), React.createElement("figure", {
    className: "ja-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/merced-river-swimming-hole-robert-schrader.jpg",
    style: {
      aspectRatio: "3 / 2"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A calm, clear stretch of the Merced River over pale granite under green trees"
  }), React.createElement("figcaption", null, "The Merced in summer, once the snowmelt has dropped. Photo: Robert Schrader / Pexels")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ja-high",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE HIGH COUNTRY"), React.createElement("h2", null, "Go up when the Valley is at its hottest"), React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, "July and August are the high country's months. The Park Service says Tioga Road is typically open to vehicles from late May or June until sometime in November, and Glacier Point Road from sometime in May into November. In 2026 Tioga Road opened on May 15 and Glacier Point Road on May 9. Both dates move with the snowpack."), React.createElement("p", null, "Tuolumne Meadows sits at 8,600 feet, and its average highs run 17 to 19 degrees under the Valley floor's, which is the best argument for driving up on a hot day. Our guide to ", React.createElement("a", {
    href: "/articles/tuolumne-meadows-in-a-day"
  }, "Tuolumne Meadows in a day"), " has the walks, the lakes and the order to do them in. The Park Service's practical notes: there is no gas in Tuolumne Meadows, and along Tioga Road it says to bring your own food and water. The Tuolumne Meadows shuttle runs typically mid-June to early September, between Tioga Pass and Olmsted Point by way of Tenaya Lake. YARTS runs its Highway 120 East bus daily in July through September, conditions permitting, between Yosemite Village and Mammoth Lakes with stops at Crane Flat, White Wolf and Tuolumne Meadows."), React.createElement("p", null, React.createElement("strong", null, "Where to sleep up high."), " Tuolumne Meadows Lodge, 69 canvas tent cabins without electricity, listed a 2026 season of June 5 to September 13, conditions permitting. White Wolf Lodge is listed as closed. Tuolumne Meadows Campground is open roughly July to late September; the Park Service releases half its sites two months ahead and half two weeks ahead."), React.createElement("p", null, React.createElement("strong", null, "Glacier Point."), " Glacier Point Road is open through both months in a normal year. Yosemite Hospitality's Glacier Point Tour leaves the Yosemite Valley Lodge lobby at 8:30 am and 1:30 pm; its 2026 prices were $72.50 round trip and $28.50 one way for adults 13 and over. ", React.createElement("a", {
    href: "/articles/glacier-point-how-to-visit"
  }, "The Glacier Point guide"), " covers parking and when to go."))), React.createElement("div", null, React.createElement("figure", {
    className: "ja-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tuolumne-meadows-lembert-dome.jpg",
    style: {
      aspectRatio: "1600 / 1067"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Lembert Dome above Tuolumne Meadows, with hikers on the granite in the foreground"
  }), React.createElement("figcaption", null, "Lembert Dome, Tuolumne Meadows, at 8,600 feet. Photo: Pacific Southwest Region USFWS / Wikimedia Commons (public domain)")), React.createElement("article", {
    className: "ff-inpark ja-season"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TIOGA ROAD IN SUMMER"), React.createElement("h3", null, "What runs, and when"), React.createElement("dl", null, HIGH.map(([k, v]) => React.createElement("div", {
    key: k
  }, React.createElement("dt", null, k), React.createElement("dd", null, v)))), React.createElement("p", {
    className: "ff-note"
  }, "Seasons vary by year. The park's road line is 209-372-0200 (press 1, then 1)."))))), React.createElement("section", {
    className: "ff-band",
    id: "ja-smoke",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SMOKE AND FIRE"), React.createElement("h2", null, "August is the start of smoke season"), React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, "The Park Service says smoky conditions are most common in August and September, and that bad air can last one to three weeks in a typical year. Wildfire smoke causes the park's worst days for visibility and air quality, and ozone, which most often spikes on hot, stagnant summer days, adds to it. The park posts current readings from its monitors in Yosemite Village and at Turtleback Dome. Our guide to ", React.createElement("a", {
    href: "/articles/yosemite-during-smoke-season"
  }, "Yosemite during smoke season"), " explains where smoke settles and how to plan around it; the short version is that the Valley traps it and the high country is often clearer."), React.createElement("p", null, React.createElement("strong", null, "Campfires."), " From May through September, wood fires in Yosemite Valley and at Hodgdon Meadow are allowed only between 5 pm and 10 pm, and must be completely out by 10. Quiet hours are 10 pm to 6 am. In summer 2026 the park also put fire restrictions in effect below 8,000 feet: no wood or charcoal fires, twig stoves included, outside open designated campgrounds, open picnic areas that allow them and a few other exceptions, and smoking only in an enclosed vehicle, a designated smoking area, those same campgrounds and picnic areas, or while stopped on a bare spot at least three feet across. Restrictions are set each season; check the park's fire restrictions page."), React.createElement("p", null, React.createElement("strong", null, "The Fourth of July."), " The Park Service has said plainly in its holiday releases that no fireworks are allowed in Yosemite, because they disturb wildlife and raise the risk of wildfire."))), React.createElement("figure", {
    className: "ja-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/tunnel-view-ferguson-fire-smoke.jpg",
    style: {
      aspectRatio: "1600 / 1067"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Visitors at a stone-walled overlook on Tunnel View in a haze of wildfire smoke, El Capitan faint in the distance"
  }), React.createElement("figcaption", null, "Tunnel View in wildfire smoke during a past summer fire. Photo: USDA Forest Service Region 5 / Wikimedia Commons (CC BY 2.0)")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ja-plan",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BOOKING"), React.createElement("h2", null, "What to book, and how far ahead"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Lodging in the park"), " opens 366 days ahead, the Park Service says, and for a July or August stay that is when it goes. If you cannot find a room inside, the park's own advice is the gateway towns."), React.createElement("p", null, React.createElement("strong", null, "Campgrounds."), " Upper, Lower and North Pines in the Valley, Wawona and Hodgdon Meadow release sites on Recreation.gov five months ahead, on the 15th of each month, at 7 am Pacific, and the Park Service says they sell out within minutes. Tuolumne Meadows releases half its sites two months ahead and half two weeks ahead. Bridalveil Creek, White Wolf and Yosemite Creek open sometime in July and close in early September; Crane Flat, Tamarack Flat and Porcupine Flat run from July to early October, all on a rolling two-week window."), React.createElement("p", null, React.createElement("strong", null, "Half Dome."), " The cables are typically up from the Friday before Memorial Day to the day after the second Monday in October, so they are up through both months. A permit is required while they are. The preseason lottery runs through March; a smaller daily lottery takes applications two days ahead. Each application costs $10, nonrefundable, and each hiker on a winning permit pays a $10 recreation fee. The details are on our ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "Half Dome lottery"), " page.")), React.createElement("div", {
    className: "ja-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "When the park is full",
    note: "In-park rooms book through Yosemite Hospitality, and the Park Service says reservations open 366 days ahead. When they are gone, a search shows what is left in the gateway towns, within driving distance of the gate you plan to use before 8 am.",
    list: "article_cta",
    slug: "yosemite-in-july-and-august",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "ff-band",
    id: "ja-months",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "JULY OR AUGUST"), React.createElement("h2", null, "If you can choose"), React.createElement("div", {
    className: "ja-months"
  }, MONTHS.map(m => React.createElement("article", {
    key: m.name,
    className: "ja-month " + m.cls
  }, React.createElement("h3", null, m.name), React.createElement("ul", null, m.lines.map(l => React.createElement("li", {
    key: l
  }, l)))))), React.createElement("div", {
    className: "ff-split ja-choose"
  }, React.createElement("div", {
    className: "ja-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Pick July"), " for the last of Yosemite Falls and a slightly lower chance of smoke. Expect the year's biggest crowd, and the Fourth of July weekend at the top of it."), React.createElement("p", null, React.createElement("strong", null, "Pick August"), " for a warm Merced and the high country at full summer. Expect the falls to be thin and the air to be a gamble, and keep a high-country day in hand for a smoky Valley."), React.createElement("p", null, React.createElement("strong", null, "Either way,"), " the day has the same shape: in through the gate before 8 am, the hard hike or the Valley sights in the morning, the afternoon high or in the water, and the Valley again in the evening when the light comes off the walls. The month after this is ", React.createElement("a", {
    href: "/articles/yosemite-in-september-2026"
  }, "September"), ", when the crowd eases after Labor Day.")), React.createElement("ul", {
    className: "ff-rules ja-rules"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Before 8 am."), React.createElement("p", null, "Valley parking is usually full after that.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Carry water."), React.createElement("p", null, "A quart every two hours, the Park Service says.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "bolt",
    size: 26
  }), React.createElement("strong", null, "Summit before noon."), React.createElement("p", null, "Storms are most common in the afternoon.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "cloud",
    size: 26
  }), React.createElement("strong", null, "Check the air."), React.createElement("p", null, "Smoke is most common in August and September.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ja-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite in July and August, answered"), React.createElement("div", {
    className: "ja-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/weather.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weather, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/visitation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Visitation statistics, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/traffic.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Traffic, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees and passes, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tioga.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tioga and Glacier Point roads, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tm.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tuolumne Meadows, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/publictransportation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Public transportation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/waterfalls.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Waterfalls, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/watersafety.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Water safety, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lightning.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lightning safety, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hikingsafety.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hiking safety, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/airquality.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Air quality, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/weddings.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weddings (smoke, road and flood risks), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/firerestrictions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fire restrictions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campregs.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campground regulations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/busy-holiday-weekend-expected-in-yosemite-national-park.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fourth of July release (fireworks), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camping, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/halfdome.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.recreation.gov/permits/234652",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome permits, Recreation.gov")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/tuolumne-meadows-lodge",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tuolumne Meadows Lodge, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/things-to-do/guided-bus-tours",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Guided bus tours, Yosemite Hospitality"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap ja-end"
  }, React.createElement(AffiliateNote, null)));
};
