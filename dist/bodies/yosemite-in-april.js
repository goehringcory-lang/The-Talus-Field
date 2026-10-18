window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-in-april"] = function YosemiteInAprilBody() {
  var TOC = [["#ya-weather", "Weather"], ["#ya-roads", "Roads"], ["#ya-waterfalls", "Waterfalls"], ["#ya-trails", "Trails"], ["#ya-grove", "Mariposa Grove"], ["#ya-hetch", "Hetch Hetchy"], ["#ya-crowds", "Crowds and fees"], ["#ya-sleep", "Camping and lodging"], ["#ya-plan", "The plan"], ["#ya-questions", "Questions"]];
  var FAQ = [["Is April a good time to visit Yosemite?", "For waterfalls and the Valley, yes. The Park Service says Yosemite Falls has roaring runoff from April through June, and April averaged about 251,000 visits from 2010 to 2024, about 40 percent of July. The trade is the high country: Tioga Road is almost always closed in April, and Glacier Point Road usually is."], ["What is the weather like in Yosemite in April?", "The Park Service's 1991 to 2020 averages for Yosemite Valley are a high of 63°F and a low of 38°F, with 3.2 inches of precipitation. Tuolumne Meadows averages a high of 45°F and a low of 22°F. Snow and chain controls are less common than in winter but still possible."], ["Is Tioga Road open in April?", "Almost never. The Park Service begins clearing Tioga Road on or about April 15, and the work usually takes one to two months. In the park's record back to 1980, the road opened in April once, on April 29, 1988."], ["Is Glacier Point Road open in April?", "Sometimes. From 2011 to 2025 it opened in April or earlier in six years, most recently April 30, 2021. The Park Service's 2004 to 2023 median opening date is May 15."], ["Is the Mist Trail open in April?", "Usually. The lower Mist Trail along Vernal Fall closes in winter for falling ice and rock, and it reopened by April 30 in each of the last seven years: April 13 in 2025, April 14 in 2024 and April 30 in 2023. Expect heavy spray and slippery steps."], ["Do you need a reservation to enter Yosemite in April?", "Not in 2026: the Park Service said the park would not use a timed reservation system that year. Check the park's reservations page for 2027 before you go. The vehicle entrance fee is $35 for seven days."]];
  var ROADS = [{
    name: "Tioga Road",
    state: "Closed",
    cls: "is-closed",
    text: "Clearing begins on or about April 15 and usually takes one to two months. One April opening since 1980: April 29, 1988."
  }, {
    name: "Glacier Point Road",
    state: "Usually closed",
    cls: "is-maybe",
    text: "Opened in April or earlier in six of the fifteen years from 2011 to 2025. Median opening, 2004 to 2023: May 15."
  }, {
    name: "Mariposa Grove Road",
    state: "Closed to cars",
    cls: "is-maybe",
    text: "Closed to cars until at least April 1; open about mid-April to placard holders only. The shuttle starts no earlier than April 15."
  }, {
    name: "Valley roads and the highways in",
    state: "Open",
    cls: "is-open",
    text: "Not on the park's seasonal-closure list. Chain controls are less common than in winter but still possible."
  }, {
    name: "Hetch Hetchy Road",
    state: "Open by day",
    cls: "is-open",
    text: "Sunrise to sunset. No vehicles or trailers over 25 feet long or 8 feet wide."
  }];
  var GPR = [["2012", "April 20"], ["2014", "April 14"], ["2015", "March 28"], ["2016", "April 19"], ["2018", "April 28"], ["2021", "April 30"]];
  var FALLS = [{
    name: "Yosemite Falls",
    text: "Roaring runoff April through June, by the Park Service's account.",
    glow: true
  }, {
    name: "Sentinel Fall and Ribbon Fall",
    text: "Run roughly March through June, peaking in May."
  }, {
    name: "Horsetail Fall",
    text: "Runs roughly December through April. April is its last month."
  }, {
    name: "Bridalveil, Vernal and Nevada falls",
    text: "Bridalveil and Nevada run all year; all three build toward the melt."
  }, {
    name: "The peak",
    text: "Peak runoff typically comes in May or June.",
    glow: true
  }];
  var MIST = [["2019", "April 12"], ["2020", "April 21"], ["2021", "March 28"], ["2022", "March 19"], ["2023", "April 30"], ["2024", "April 14"], ["2025", "April 13"]];
  var CAMPS = [["Upper Pines", "All year", "Reservation, five months ahead on the 15th", "$36"], ["Lower Pines", "April 21 (2026)", "Reservation, five months ahead on the 15th", "$36"], ["North Pines", "April 21 (2026)", "Lottery, or five months ahead on the 15th", "$36"], ["Camp 4", "All year", "Reservation one week ahead, April 15 to November 29", "$10 a person"], ["Hodgdon Meadow", "All year", "Reservation from April 15", "$36"], ["Wawona", "All year", "Reservation, five months ahead on the 15th", "$36"]];
  return React.createElement("div", {
    className: "ya-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("dt", null, "Valley average"), React.createElement("dd", null, "63°F high, 38°F low")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "Waterfalls"), React.createElement("dd", null, "Yosemite Falls roaring, peak still ahead")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("dt", null, "Tioga Road"), React.createElement("dd", null, "Closed; plowing starts about April 15")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "users"
  }), React.createElement("dt", null, "Crowds"), React.createElement("dd", null, "About 40 percent of July"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ya-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "April is the month Yosemite Valley turns back on. The Park Service describes Yosemite Falls as roaring from April through June, the lower Mist Trail has reopened by mid-April in most recent years, Lower and North Pines campgrounds opened on April 21 in 2026, and the dogwoods start to flower along the Merced. The crowds have not caught up yet: April averaged about 251,000 visits from 2010 to 2024, against about 625,000 in July."), React.createElement("p", null, "The other half of the park is still winter. Tioga Road is closed, as it is in almost every April on record, and Glacier Point Road is closed in most of them. Tuolumne Meadows averages a high of 45 degrees. An April trip is a Valley trip with a few low-elevation side trips, and that is not a small thing: it is the Valley with its waterfalls running and its parking lots not yet full by breakfast."), React.createElement("p", null, "Where ", React.createElement("a", {
    href: "/articles/yosemite-in-march"
  }, "March"), " is a coin flip between winter and spring, April usually lands on spring, with a storm or two left in it. Here is what is open, what is not, and what the record says about the roads that decide the rest.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Come for the Valley and the waterfalls. The falls are strong; their peak is usually May or June."), React.createElement("li", null, "Tioga Road is closed. Glacier Point Road usually is."), React.createElement("li", null, "The Mist Trail has reopened by mid-April in most recent years. It will be wet."), React.createElement("li", null, "Carry chains. April controls are less common, not impossible."), React.createElement("li", null, "No entry reservation in 2026; check the rules for 2027.")), React.createElement("a", {
    className: "ya-short__link",
    href: "#ya-roads"
  }, "What is open, road by road ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "ya-weather",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WEATHER"), React.createElement("h2", null, "Spring in the Valley, winter on top"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The Park Service's 1991 to 2020 averages put April in Yosemite Valley, at about 4,000 feet, at a high of 63 and a low of 38, with 3.2 inches of precipitation. Tuolumne Meadows, at 8,600 feet, averages a high of 45 and a low of 22. The Park Service's general rule is that most of the park is under snow from about November through May, and April sits inside that window everywhere above the Valley."), React.createElement("p", null, "An April day in the Valley can run from a cold morning to a T-shirt afternoon, and a late storm is still possible. Pack layers and a rain shell, and plan the trip so that a wet day costs you a hike, not the whole visit."), React.createElement("p", null, React.createElement("strong", null, "Chains."), " The Park Service says chain requirements are most likely from November through March, less common in October and April, and can occur as late as May. When controls are posted, every vehicle in the control area must carry chains or cables, four-wheel drives and rentals included. The road and weather line is 209/372-0200, then 1, then 1. Which highway to take in a storm is covered in ", React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "the entrances guide"), "."))), React.createElement("div", null, React.createElement("h3", {
    className: "ya-sub"
  }, "April averages, 1991 to 2020"), React.createElement("table", {
    className: "ya-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Place"), React.createElement("th", {
    scope: "col"
  }, "High"), React.createElement("th", {
    scope: "col"
  }, "Low"), React.createElement("th", {
    scope: "col"
  }, "Precipitation"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Yosemite Valley, 4,000 ft"), React.createElement("td", null, "63°F"), React.createElement("td", null, "38°F"), React.createElement("td", null, "3.2 in")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Tuolumne Meadows, 8,600 ft"), React.createElement("td", null, "45°F"), React.createElement("td", null, "22°F"), React.createElement("td", null, "2.0 in")))), React.createElement("p", {
    className: "ff-note ya-tablenote"
  }, "Source: National Park Service, Weather and Climate."), React.createElement("p", {
    className: "ff-alert ya-alert"
  }, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("span", null, React.createElement("strong", null, "Chains ride in the car."), " Controls are less common in April than in winter, but when they are posted, every vehicle must carry chains, including four-wheel drives and rentals.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ya-roads",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ROADS"), React.createElement("h2", null, "What is open, and what the record says"), React.createElement("ul", {
    className: "ya-roads"
  }, ROADS.map(r => React.createElement("li", {
    key: r.name,
    className: r.cls
  }, React.createElement("span", null, r.state), React.createElement("strong", null, r.name), React.createElement("p", null, r.text)))), React.createElement("div", {
    className: "ff-split ya-roads__prose"
  }, React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Tioga Road is closed."), " The Park Service begins clearing it on or about April 15, the work usually takes one to two months, and the park says plainly that predicting the opening is not possible, even in late spring, because April and May weather changes the plowing. Its own record, kept since 1980, shows one April opening: April 29, 1988. The 2004 to 2023 median is May 23. In 2026 the road opened May 15, which the park called the earliest in 16 years; ", React.createElement("a", {
    href: "/articles/tioga-road-opening-weekend"
  }, "the Tioga opening guide"), " covers how that day goes."), React.createElement("p", null, React.createElement("strong", null, "Glacier Point Road is usually closed, but not always."), " In the park's dataset, it opened in April or earlier in six of the fifteen years from 2011 to 2025, and in May or later in the rest (in 2022 it did not open, for a rehabilitation project). The 2004 to 2023 median opening is May 15. If it opens during your trip, ", React.createElement("a", {
    href: "/articles/glacier-point-how-to-visit"
  }, "the Glacier Point guide"), " is the next thing to read; if it does not, the view from Tunnel View and the Valley floor is still open to you."), React.createElement("p", null, React.createElement("strong", null, "The rest is open, weather permitting."), " The park's seasonal road record tracks three roads: Tioga, Glacier Point and Mariposa Grove. The Valley roads and the highways in from Oakhurst, Mariposa and Groveland are not among them, though a storm or a chain control can still slow them. Hetch Hetchy's road is open by daylight. Mariposa Grove's road gets its own section, below.")), React.createElement("div", null, React.createElement("h3", {
    className: "ya-sub"
  }, "Glacier Point Road, the early years"), React.createElement("ol", {
    className: "ff-hours ya-early"
  }, GPR.map(([y, d]) => React.createElement("li", {
    key: y
  }, React.createElement("span", null, y), React.createElement("p", null, "Opened ", d, ".")))), React.createElement("p", {
    className: "ff-note"
  }, "The six openings in April or earlier from 2011 to 2025, from the Park Service's historical road dataset. Median opening, 2004 to 2023: May 15.")))), React.createElement("section", {
    className: "ff-band",
    id: "ya-waterfalls",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WATERFALLS"), React.createElement("h2", null, "Strong now, peaking soon"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "April is when the waterfalls stop being a winter curiosity. The Park Service says the best time to see them is spring, when most of the snowmelt happens, that Yosemite Falls has \"roaring runoff April through June,\" and that peak runoff typically comes in May or June. Sentinel Fall and Ribbon Fall, which most of the year are stains on the rock, run roughly March through June. Horsetail Fall, the firefall's waterfall, runs roughly December through April, so April is its last month. Month-by-month flow for every fall is in ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "the waterfalls guide"), "."), React.createElement("p", null, "The easiest close look is Lower Yosemite Fall. The Park Service gives the eastern side of the loop as 0.6 mile one-way from the Yosemite Falls shuttle stop to the viewing area, and the western side as 0.5 mile."), React.createElement("p", null, React.createElement("strong", null, "Two things April does better than any other month."), " On cold mornings, the Park Service says, frazil ice, a slush of ice crystals that flows and piles in the creek, most often forms in spring, \"especially April,\" usually before 9 am, and most famously in Yosemite Creek just below Lower Yosemite Fall. ", React.createElement("a", {
    href: "/frazil-ice"
  }, "Our frazil ice page"), " covers what to look for. And on clear nights around the full moon, the moonlight on the spray at Lower Yosemite Fall can throw a moonbow, which the park says is most likely in April and May, when the flow is high. ", React.createElement("a", {
    href: "/moonbow"
  }, "The moonbow page"), " has the nights and where to stand."))), React.createElement("div", null, React.createElement("h3", {
    className: "ya-sub"
  }, "The falls in April"), React.createElement("ol", {
    className: "ff-hours ya-falls"
  }, FALLS.map(f => React.createElement("li", {
    key: f.name,
    className: f.glow ? "is-glow" : undefined
  }, React.createElement("span", null, f.name), React.createElement("p", null, f.text)))), React.createElement("figure", {
    className: "ya-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/frazil-ice-yosemite-creek-nps.jpg",
    style: {
      aspectRatio: "1280 / 720"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Frazil ice filling Yosemite Creek, white slush piled between the banks"
  }), React.createElement("figcaption", null, "Frazil ice in Yosemite Creek, the spring phenomenon the park says is most common in April. Photo: National Park Service (public domain)")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ya-flowers",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ya-single"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FLOWERS"), React.createElement("h2", null, "Dogwood in the Valley, poppies down the canyon"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The Valley's own bloom is a tree. Yosemite Conservancy says the Pacific dogwood \"usually blooms in April and May, lining the Merced River with splashes of white and green.\" The white parts are bracts rather than petals."), React.createElement("p", null, "Below the park, the foothill bloom is in its last weeks. Mariposa County's tourism office puts the Hite Cove Trail, which starts at Savages Trading Post on Highway 140 about seven miles west of the El Portal entrance, at its best from roughly March through May. Its first three-quarters of a mile cross private land, parking is on the road shoulder, there is no cell service, and the county warns about ticks and snakes; the trail closes in summer for fire danger. The elevation-by-elevation calendar, and where else to look, is in ", React.createElement("a", {
    href: "/articles/yosemite-wildflowers-guide"
  }, "the wildflowers guide"), "."))))), React.createElement("section", {
    className: "ff-band",
    id: "ya-trails",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TRAILS"), React.createElement("h2", null, "The Mist Trail reopens, and lives up to its name"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The lower Mist Trail along Vernal Fall closes in winter because of falling ice and rock. In the Park Service's dataset it reopened between March 19 and April 30 in each of the last seven years, and in mid-April in the last two: April 14 in 2024 and April 13 in 2025. The park's round-trip figures: 1.6 miles and about an hour to an hour and a half to the Vernal Fall footbridge, with 400 feet of climbing; 2.4 miles and about three hours to the top of Vernal Fall, with 1,000 feet; 5.4 miles and five to six hours to the top of Nevada Fall, with 2,000 feet."), React.createElement("p", null, "The park also says to \"prepare for slippery footing and a tremendous amount of waterfall spray in spring and early summer,\" and that swimming near Emerald Pool and the Silver Apron is illegal and dangerous. In April that means a rain shell and boots with grip, and staying out of the water. Two related openings come later: the Ice Cut section of the John Muir Trail, the park's alternate route between the Valley and the falls, opened anywhere from April 11 (2022) to June 13 (2024) in the last five years, and the Half Dome cables normally go up the Friday before Memorial Day. ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "The Mist Trail guide"), " has the turnaround points and the safety talk."), React.createElement("p", null, React.createElement("strong", null, "Four Mile Trail"), ", the climb from the Valley floor toward Glacier Point, usually opens later. From 2016 to 2025 it opened in April three times (2016, 2018 and 2022) and in May or June in the other seven years. Check the park's trail conditions before planning on it."), React.createElement("p", null, React.createElement("strong", null, "Half Dome homework."), " The preseason permit lottery takes applications March 1 to 31, and the Park Service emails results in mid-April. It costs $10 to apply and $10 a person if you win. ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "The lottery page"), " covers the daily lottery that follows."))), React.createElement("div", null, React.createElement("figure", {
    className: "ya-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/vernal-fall-high-water.jpg",
    style: {
      aspectRatio: "2000 / 3000"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Vernal Fall at high water, white spray pouring over the granite lip into the canyon"
  }), React.createElement("figcaption", null, "Vernal Fall at high water, the season the steps beside it run wet. Photo: Brandon Raines / Pexels")), React.createElement("h3", {
    className: "ya-sub ya-sub--gap"
  }, "When the lower Mist Trail reopened"), React.createElement("ol", {
    className: "ff-hours ya-early"
  }, MIST.map(([y, d]) => React.createElement("li", {
    key: y
  }, React.createElement("span", null, y), React.createElement("p", null, d, ".")))), React.createElement("p", {
    className: "ff-note"
  }, "From the Park Service's historical trail dataset. In 2020 the trail opened in January, closed March 17, and reopened April 21."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ya-grove",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "MARIPOSA GROVE"), React.createElement("h2", null, "The sequoias are open; the road may not be"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The Park Service says Mariposa Grove Road is closed to cars from late November until at least April 1, and from about mid-April through November it is open only to vehicles with a disability placard. Everyone else parks at the Welcome Plaza, which has about 300 spaces and can fill by late morning, and either rides the shuttle or walks. The shuttle starts no earlier than April 15, \"possibly later\": in 2026 its posted season began May 3. With no shuttle, it is a two-mile walk each way on the Washburn Trail or the closed road."), React.createElement("p", null, "In the park's dataset, the road opened between April 15 and June 11 in each year from 2019 to 2025: April 15 in 2019, April 19 in 2022, and May 25, May 24 and May 10 in 2023, 2024 and 2025. So plan an April grove visit as a walk, and treat a shuttle as a bonus. Once in the grove, the Grizzly Giant Loop is two miles from the trailhead, about 1.5 to 2 hours. ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "The Mariposa Grove guide"), " covers the rest."))), React.createElement("article", {
    className: "ff-inpark ya-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "MARIPOSA GROVE IN APRIL"), React.createElement("h3", null, "Plan to walk"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Road to cars"), React.createElement("dd", null, "Closed until at least April 1; then placard holders only")), React.createElement("div", null, React.createElement("dt", null, "Shuttle"), React.createElement("dd", null, "No earlier than April 15; began May 3 in 2026")), React.createElement("div", null, React.createElement("dt", null, "Without it"), React.createElement("dd", null, "Two miles each way from the Welcome Plaza")), React.createElement("div", null, React.createElement("dt", null, "Parking"), React.createElement("dd", null, "About 300 spaces; can fill by late morning")), React.createElement("div", null, React.createElement("dt", null, "Grizzly Giant Loop"), React.createElement("dd", null, "2 miles, 1.5 to 2 hours")))))), React.createElement("section", {
    className: "ff-band",
    id: "ya-hetch",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HETCH HETCHY"), React.createElement("h2", null, "The other valley, at its best"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The Park Service calls Hetch Hetchy \"an ideal place for thundering spring waterfalls and wildflower displays.\" The Wapama Falls trail crosses O'Shaughnessy Dam, passes through the tunnel and runs 5 miles round trip with 507 feet of gain and loss, with views of both Tueeulala and Wapama falls. Watch for rattlesnakes, black bears and poison oak."), React.createElement("p", null, "The road is open from sunrise to sunset only, and vehicles or trailers over 25 feet long or 8 feet wide are not allowed on it. It is 38 miles from Yosemite Valley, about an hour and 15 minutes. The park warns that the lots can fill from mid-morning to late afternoon, mainly on weekends from spring through fall. ", React.createElement("a", {
    href: "/articles/hetch-hetchy-the-other-yosemite-valley"
  }, "Our Hetch Hetchy guide"), " has the full day."))), React.createElement("div", null, React.createElement("figure", {
    className: "ya-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/hetch-hetchy-reservoir-kolana-rock.jpg",
    style: {
      aspectRatio: "1600 / 1067"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Hetch Hetchy Reservoir below Kolana Rock, granite walls rising from the water"
  }), React.createElement("figcaption", null, "Hetch Hetchy Reservoir and Kolana Rock. Photo: King of Hearts / Wikimedia Commons (CC BY-SA 3.0)")), React.createElement("ul", {
    className: "ff-rules ya-hetch"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Daylight only."), React.createElement("p", null, "The road is open sunrise to sunset.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "25 feet and under."), React.createElement("p", null, "No vehicles or trailers over 25 feet long or 8 feet wide.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "walk",
    size: 26
  }), React.createElement("strong", null, "Wapama Falls."), React.createElement("p", null, "5 miles round trip, 507 feet of gain and loss.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "alert",
    size: 26
  }), React.createElement("strong", null, "Snakes and oak."), React.createElement("p", null, "Rattlesnakes, black bears and poison oak on the trail.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ya-crowds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CROWDS AND FEES"), React.createElement("h2", null, "Busy weekends, light weekdays"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, "The Park Service's 2010 to 2024 monthly averages put April at 250,943 visits, against 160,225 in March, 372,595 in May and 624,559 in July. April is the month the climb toward summer begins, and the park's traffic guidance starts with it: from April through September, and on spring and fall weekends, the park advises arriving before 8 am, after which Valley parking is usually full, and names Saturdays and holiday weekends as the worst. Texting ", React.createElement("strong", null, "ynptraffic"), " to ", React.createElement("strong", null, "333111"), " gets the park's traffic alerts. The full monthly picture is in ", React.createElement("a", {
    href: "/articles/yosemite-crowds-by-month"
  }, "crowds by month"), ", and ", React.createElement("a", {
    href: "/articles/when-to-visit-yosemite"
  }, "when to visit"), " weighs April against the rest of the year."), React.createElement("p", null, React.createElement("strong", null, "No reservation, in 2026."), " The Park Service said Yosemite would not use a timed reservation system in 2026. Whether that holds for April 2027 is the park's call; check its reservations page before you go."), React.createElement("p", null, React.createElement("strong", null, "Fees."), " The vehicle entrance fee is $35 for seven days, $30 for a motorcycle and $20 a person on foot or bicycle, with people 15 and under free. An annual Yosemite pass is $70. Non-US residents 16 and older pay a $100 fee on top of the entrance fee unless they hold an annual or America the Beautiful pass. The park's 2026 fee-free days included none in April, so do not plan around one; check the 2027 list when it is published."), React.createElement("p", null, React.createElement("strong", null, "Easter."), " In years when Easter falls in April, the chapel in the Valley holds its Easter services; ", React.createElement("a", {
    href: "/articles/worship-in-yosemite"
  }, "our worship guide"), " has the schedule. Easter 2027 falls on March 28, so next April has no Easter weekend."))), React.createElement("div", null, React.createElement("h3", {
    className: "ya-sub"
  }, "Average visits, 2010 to 2024"), React.createElement("ul", {
    className: "ya-bars",
    "aria-label": "Average monthly visits, 2010 to 2024: March 160,225; April 250,943; May 372,595; July 624,559"
  }, React.createElement("li", null, React.createElement("span", null, "March"), React.createElement("b", {
    style: {
      width: "25.7%"
    }
  }), React.createElement("em", null, "160,225")), React.createElement("li", {
    className: "is-now"
  }, React.createElement("span", null, "April"), React.createElement("b", {
    style: {
      width: "40.2%"
    }
  }), React.createElement("em", null, "250,943")), React.createElement("li", null, React.createElement("span", null, "May"), React.createElement("b", {
    style: {
      width: "59.7%"
    }
  }), React.createElement("em", null, "372,595")), React.createElement("li", null, React.createElement("span", null, "July"), React.createElement("b", {
    style: {
      width: "100%"
    }
  }), React.createElement("em", null, "624,559"))), React.createElement("p", {
    className: "ff-note"
  }, "Source: National Park Service, Yosemite visitation statistics."), React.createElement("article", {
    className: "ff-inpark ya-card"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ENTRANCE"), React.createElement("h3", null, "What it costs"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Private vehicle"), React.createElement("dd", null, "$35, seven days")), React.createElement("div", null, React.createElement("dt", null, "Motorcycle"), React.createElement("dd", null, "$30, seven days")), React.createElement("div", null, React.createElement("dt", null, "On foot or bicycle"), React.createElement("dd", null, "$20 a person, 15 and under free")), React.createElement("div", null, React.createElement("dt", null, "Non-US residents"), React.createElement("dd", null, "$100 more, age 16 and up, unless passholders")), React.createElement("div", null, React.createElement("dt", null, "Reservation"), React.createElement("dd", null, "None in 2026"))))))), React.createElement("section", {
    className: "ff-band",
    id: "ya-sleep",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CAMPING AND LODGING"), React.createElement("h2", null, "The Valley fills back in"), React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Camping."), " Upper Pines, Camp 4, Hodgdon Meadow and Wawona are open all year. In 2026 the park's tentative dates opened Lower Pines and North Pines on April 21; Crane Flat waited until May 21. Most front-country sites book through Recreation.gov five months ahead on the 15th of the month, and Camp 4 goes by reservation one week ahead from April 15 to November 29. Sites are $36 a night; Camp 4 is $10 a person. Those were the 2026 dates; check the park's campground table for 2027. Night temperatures are the reason to read ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), " before booking."), React.createElement("p", null, React.createElement("strong", null, "Lodging."), " The Ahwahnee and Yosemite Valley Lodge are open all year. Curry Village and Housekeeping Camp are seasonal; Housekeeping Camp's 2026 season ran April 3 to October 12. The Wawona Hotel is closed while the Park Service assesses its condition, with no reopening date announced. The Park Service says in-park reservations open 366 days ahead. ", React.createElement("a", {
    href: "/articles/housekeeping-camp-vs-curry-village"
  }, "Housekeeping Camp vs Curry Village"), " compares the two canvas camps; ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "where to stay"), " covers the rest."), React.createElement("p", null, React.createElement("strong", null, "Bears are awake."), " The Park Service says that after bears leave their winter dens they feed largely on meadow grasses until berries ripen. Food storage rules apply at every campsite and parking lot, and the park asks drivers to keep to the speed limit, with signs posted where bears have been hit. ", React.createElement("a", {
    href: "/articles/yosemite-bears-safety-guide"
  }, "The bear guide"), " covers storage."))), React.createElement("div", null, React.createElement("h3", {
    className: "ya-sub"
  }, "Campgrounds in April, 2026 season"), React.createElement("table", {
    className: "ya-table ya-camps"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Campground"), React.createElement("th", {
    scope: "col"
  }, "Open"), React.createElement("th", {
    scope: "col"
  }, "Booking"), React.createElement("th", {
    scope: "col"
  }, "Fee"))), React.createElement("tbody", null, CAMPS.map(([name, open, book, fee]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row"
  }, name), React.createElement("td", null, open), React.createElement("td", null, book), React.createElement("td", null, fee))))), React.createElement("p", {
    className: "ff-note ya-tablenote"
  }, "Source: National Park Service campground table, tentative 2026 dates. Confirm for 2027."))), React.createElement("div", {
    className: "ya-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "April rooms, before summer prices",
    note: React.createElement(React.Fragment, null, "In-park rooms open 366 days ahead and book through the concessioner, not a search. Outside the park, the gateway towns are the fallback when the Valley is full, and an April weekend can fill it. ", React.createElement("a", {
      href: "/articles/yosemite-gateway-towns-compared"
    }, "The gateway towns comparison"), " weighs all five."),
    list: "article_cta",
    slug: "yosemite-in-april",
    cta: "Search April lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ya-plan",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE PLAN"), React.createElement("h2", null, "How to build an April trip"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ya-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Make it a Valley trip."), " Base in or near the Valley, give it two or three nights, and keep one day loose for the weather. Lower Yosemite Fall and the Valley loop are the first morning; a cold, clear morning is the one to be at the creek below the fall early."), React.createElement("p", null, React.createElement("strong", null, "Add one big walk."), " If the Mist Trail has reopened, the Vernal Fall footbridge is the short version and the top of Vernal Fall the long one. Bring a rain shell either way."), React.createElement("p", null, React.createElement("strong", null, "Add one side trip."), " Hetch Hetchy for spring waterfalls without the Valley's crowd, Mariposa Grove as a walk-in, or the Hite Cove bloom on the drive in on Highway 140."), React.createElement("p", null, React.createElement("strong", null, "Come midweek if you can."), " The park names Saturdays and holiday weekends as the busiest days, and its arrive-before-8-am advice starts in April."), React.createElement("p", null, React.createElement("strong", null, "Check the morning you drive."), " Road and chain status, the Mist Trail and the Mariposa Grove shuttle all change through the month. ", React.createElement("a", {
    href: "/conditions"
  }, "The conditions page"), " collects the park's live feeds, and the park's line is 209/372-0200.")), React.createElement("ul", {
    className: "ff-rules ya-plan"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Waterfalls first."), React.createElement("p", null, "Yosemite Falls is roaring. Its peak is usually May or June.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "walk",
    size: 26
  }), React.createElement("strong", null, "One big walk."), React.createElement("p", null, "The Mist Trail, if it has reopened. Expect spray.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "route",
    size: 26
  }), React.createElement("strong", null, "One side trip."), React.createElement("p", null, "Hetch Hetchy, Mariposa Grove on foot, or Hite Cove.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "snow",
    size: 26
  }), React.createElement("strong", null, "Chains in the trunk."), React.createElement("p", null, "Less common in April. Not gone."))))), React.createElement("section", {
    className: "ff-band",
    id: "ya-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite in April, answered"), React.createElement("div", {
    className: "ya-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/weather.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weather and Climate, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/seasonal.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Seasonal Opening and Closing Dates (road, trail and campground datasets), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tiogaopen.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tioga and Glacier Point Roads, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Summer reopenings and early Tioga Road opening, NPS news release, May 13, 2026")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tirechains.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tire Chain Requirements, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/waterfalls.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Waterfalls, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/yosemite-falls.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Falls, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/frazilice.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Frazil Ice, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Vernal and Nevada Falls (Mist Trail), NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome Permits, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mg.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hh.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hetch Hetchy, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/visitation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Visitation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/traffic.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Traffic and Parking, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees and Passes, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campgrounds.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campgrounds, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lodging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/nature/bears.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bears, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/housekeeping-camp",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Housekeeping Camp, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://yosemite.org/wallpaper/dogwood",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Dogwood, Yosemite Conservancy")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yosemite.com/what-to-do/hite-cove",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hite Cove, Mariposa County Tourism Bureau"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap ya-end"
  }, React.createElement(AffiliateNote, null)));
};
