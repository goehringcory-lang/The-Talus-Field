window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-in-may"] = function YosemiteInMayBody() {
  var TOC = [["#ym-waterfalls", "Waterfalls"], ["#ym-roads", "The high roads"], ["#ym-weather", "Weather"], ["#ym-crowds", "Crowds and Memorial Day"], ["#ym-halfdome", "Half Dome"], ["#ym-sleep", "Where to sleep"], ["#ym-weeks", "Week by week"], ["#ym-questions", "Questions"]];
  var FAQ = [["Is May a good time to visit Yosemite?", "For waterfalls, yes. The Park Service says the waterfalls are usually at their best in mid to late May, and the Valley averages a high of 71°F and a low of 45°F. The trade is that Tioga Road and Glacier Point Road may still be closed by snow, and Memorial Day weekend is one of the busiest of the year."], ["Is Tioga Road open in May?", "Sometimes. The Park Service says Tioga Road is typically open from late May or June, and that predicting the opening is not possible, even in late spring. In the twelve seasons from 2015 to 2026 it opened in May seven times, in June twice and in July three times. In 2026 it opened May 15."], ["Is Glacier Point Road open in May?", "Usually by sometime in May, but not always. The Park Service gives late May as the approximate opening to cars. In its records it opened in May in 2017, 2019, 2024 and 2025, and on May 9 in 2026; in other years it opened earlier, later, or not at all because of construction."], ["Are the Half Dome cables up in May?", "Usually for the last few days of the month. The Park Service says the cables usually go up the Friday before Memorial Day, subject to conditions, and a permit is required. In 2026 Half Dome opened May 15."], ["What is the weather like in Yosemite in May?", "In Yosemite Valley the 1991 to 2020 May averages are a high of 71°F, a low of 45°F and 1.9 inches of precipitation. Tuolumne Meadows averages a high of 54°F and a low of 27°F. The park says tire chains are sometimes required even in spring."], ["Do you need a reservation to enter Yosemite in May?", "Not in 2026: the Park Service announced it would not use a timed reservation system that year. Check the park's reservations page for any later year before you go. The entrance fee is $35 per private vehicle, good for seven days."]];
  var ROADS = [["2015", "May 4", "March 28"], ["2016", "May 18", "April 19"], ["2017", "June 29", "May 11"], ["2018", "May 21", "April 28"], ["2019", "July 1", "May 10"], ["2020", "June 15", "June 11"], ["2021", "May 27", "April 30"], ["2022", "May 27", "Did not open (road project)"], ["2023", "July 22", "July 15 (construction)"], ["2024", "June 10", "May 14"], ["2025", "May 26", "May 10"], ["2026", "May 15", "May 9"]];
  var WEEKS = [{
    when: "Early May",
    name: "The falls build",
    cls: "is-peak",
    text: "The Valley trails are usually clear of snow by sometime in May. The high roads may or may not be open; most years Tioga is not yet."
  }, {
    when: "Mid to late May",
    name: "Peak water",
    cls: "is-mid",
    text: "The Park Service says the waterfalls are usually at their best in mid to late May. Redbud and dogwood tend to bloom this month."
  }, {
    when: "Memorial Day weekend",
    name: "Summer arrives",
    cls: "is-late",
    text: "The Half Dome cables usually go up the Friday before. Saturdays and holiday weekends are the park's busiest days; the lots are usually full by 8 am."
  }];
  var CAMPS = [["Upper Pines", "Yosemite Valley", "All year"], ["Lower Pines", "Yosemite Valley", "April 21 to October 19"], ["North Pines", "Yosemite Valley", "April 21 to October 26"], ["Camp 4", "Yosemite Valley", "All year"], ["Wawona", "South, on Highway 41", "All year"], ["Hodgdon Meadow", "Big Oak Flat entrance", "All year"], ["Crane Flat", "Big Oak Flat Road", "May 21 to October 12"]];
  return React.createElement("div", {
    className: "ym-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "therm"
  }), React.createElement("dt", null, "The Valley in May"), React.createElement("dd", null, "Average 71°F high, 45°F low")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "Waterfalls"), React.createElement("dd", null, "Usually at their best mid to late May")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "Tioga Road"), React.createElement("dd", null, "Open in May in 7 of the last 12 years")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "dome"
  }), React.createElement("dt", null, "Half Dome cables"), React.createElement("dd", null, "Usually up the Friday before Memorial Day"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ym-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "May is the waterfall month. The Park Service says Yosemite's waterfalls are usually at their best in mid to late May, when the snow above the Valley rim is melting fastest, and the Valley floor is green, mild and mostly clear of snow. It is the month most people picture when they picture Yosemite."), React.createElement("p", null, "It is also a month of two parks. The Valley is open and running at full volume. The high country above it is still coming out of winter: Tioga Road and Glacier Point Road open when the plows finish, and the park says plainly that it cannot predict when that will be, even in late spring. Some years both are open by mid-May. Some years Tioga stays shut into July."), React.createElement("p", null, "And it ends with Memorial Day weekend, when summer arrives all at once. Plan the month around the water, keep the high country as a bonus, and treat the last weekend as a different trip.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Waterfalls: usually at their best in mid to late May."), React.createElement("li", null, "Tioga and Glacier Point roads: open some Mays, not others. Check before you build a day on them."), React.createElement("li", null, "Valley weather: about 71°F by day, 45°F at night. Tuolumne is near freezing at night."), React.createElement("li", null, "Memorial Day weekend: be through the gate before 8 am, or skip the Valley that day.")), React.createElement("a", {
    className: "ym-short__link",
    href: "#ym-roads"
  }, "Every Tioga opening since 2015 ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "ym-waterfalls",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE WATERFALLS"), React.createElement("h2", null, "The month the water peaks"), React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, "The Park Service puts it two ways. Its waterfall page says peak runoff typically happens in May or June; its spring page narrows that to mid to late May. Either way, May is the month to be standing under Yosemite Falls, 2,425 feet from the rim to the Valley floor, which by the park's own description is often a trickle or dry by August. The size of the show depends on the winter: a deep snowpack runs the falls hard into June, a thin one peaks early and fades. ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "The waterfalls guide"), " goes fall by fall."), React.createElement("p", null, React.createElement("strong", null, "The Mist Trail is at its wettest."), " The park warns of \"slippery footing and a tremendous amount of waterfall spray in spring and early summer.\" The Vernal Fall footbridge is 1.6 miles round trip from the trailhead, about an hour to an hour and a half, with 400 feet of climbing; the top of Vernal Fall is 2.4 miles round trip and about three hours, up more than 600 steps. Bring a rain shell for the spray. ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "The Mist Trail guide"), " has every turnaround."), React.createElement("p", null, React.createElement("strong", null, "The river is at its most dangerous."), " The Park Service says creeks and rivers tend to reach peak runoff in May or June, and that swimming at Emerald Pool and the Silver Apron above Vernal Fall is illegal because of the current. Sixteen people died in Yosemite's creeks and rivers between 2002 and 2011, by its count. Stay behind the railings and off the wet rock at the water's edge."), React.createElement("p", null, React.createElement("strong", null, "Beyond the Valley."), " The park calls Hetch Hetchy \"an ideal place for thundering spring waterfalls and wildflower displays.\" Its road is open only from sunrise to sunset, vehicles longer than 25 feet are not allowed, and the lot typically fills at midday on weekends. ", React.createElement("a", {
    href: "/articles/hetch-hetchy-the-other-yosemite-valley"
  }, "The Hetch Hetchy guide"), " covers the walk to the falls. On the Valley floor, the park says redbud and dogwood tend to bloom in May."))), React.createElement("figure", {
    className: "ym-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/vernal-fall-high-water.jpg",
    style: {
      aspectRatio: "2000 / 3000"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 480px",
    alt: "Vernal Fall in high water, white spray filling the granite gorge below it"
  }), React.createElement("figcaption", null, "Vernal Fall in high water. In spring the Mist Trail beside it earns its name. Photo: Brandon Raines / Pexels"))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ym-roads",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "TIOGA ROAD AND GLACIER POINT ROAD"), React.createElement("h2", null, "The high roads open when the snow says so"), React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Tioga Road."), " The Park Service says Tioga Road is typically open to vehicles from late May or June until sometime in November. Plowing begins on or about April 15 and usually takes one to two months, and the park says that predicting the opening \"is not possible, even in late spring.\" Its own record bears that out. In the twelve seasons from 2015 to 2026, Tioga opened in May seven times, in June twice and in July three times, in the big snow years of 2017, 2019 and 2023. In 2026 it opened Friday, May 15, at 8 am, the plan for which is in ", React.createElement("a", {
    href: "/articles/tioga-road-opening-weekend"
  }, "our Tioga Road opening weekend guide"), "."), React.createElement("p", null, React.createElement("strong", null, "Glacier Point Road."), " The park gives the road's season as approximately late May through October or November. In practice it has often opened sooner: in March or April in four of the last twelve years, and in May in five, including May 9 in 2026. In the other three it opened in June, in July after construction, or not at all during a road project. ", React.createElement("a", {
    href: "/articles/glacier-point-road-open-2026"
  }, "Our early-season Glacier Point plan"), " covers what is open at the top in the first weeks, when drinking water may not be on yet."), React.createElement("p", null, React.createElement("strong", null, "Open does not mean summer."), " A road open in May reaches country that is still in winter. Tuolumne Meadows averages a May high of 54°F and a low of 27°F, and the park says most of Yosemite remains snowy through May and into June. In 2026 the park put vault and portable toilets along Tioga Road at the opening, but no drinking water. Plan short walks on the high roads, not the classic high-country hikes."), React.createElement("p", null, "For the current state of both roads, check ", React.createElement("a", {
    href: "/tioga-opening"
  }, "our Tioga opening page"), " and the Park Service's conditions page, the night before you drive up."))), React.createElement("div", null, React.createElement("h3", {
    className: "ym-sched__head"
  }, "Opening day, by year"), React.createElement("table", {
    className: "ym-roads"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Year"), React.createElement("th", {
    scope: "col"
  }, "Tioga Road"), React.createElement("th", {
    scope: "col"
  }, "Glacier Point Road"))), React.createElement("tbody", null, ROADS.map(([year, tioga, gp]) => React.createElement("tr", {
    key: year,
    className: /^May/.test(tioga) ? "is-may" : undefined
  }, React.createElement("th", {
    scope: "row"
  }, year), React.createElement("td", null, tioga), React.createElement("td", null, gp))))), React.createElement("p", {
    className: "ff-note ym-roads__note"
  }, "Park Service historic road data for 2015 to 2025; the park's road updates for 2026. Shaded rows: Tioga open in May. In 2019 Tioga opened June 21 for limited hours and without restriction on July 1.")))), React.createElement("section", {
    className: "ff-band",
    id: "ym-weather",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WEATHER AND WHAT TO BRING"), React.createElement("h2", null, "Warm days, cold nights, and chains in the trunk"), React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, "The Park Service's 1991 to 2020 averages put a May day in Yosemite Valley, at 4,000 feet, at a high of 71°F and a low of 45°F, with 1.9 inches of precipitation for the month. That sits between April (63°F and 38°F, 3.2 inches) and June (81°F and 51°F, half an inch). Tuolumne Meadows, at 8,600 feet, averages 54°F and 27°F in May."), React.createElement("p", null, React.createElement("strong", null, "Pack for both."), " A warm afternoon on the Valley floor and a freezing night in a campground are the same day in May. Bring layers, a rain shell for the falls, and real shoes for wet granite."), React.createElement("p", null, React.createElement("strong", null, "Carry chains."), " The park says tire chains are sometimes required even in spring, and that when they are, you should carry them and know how to use them whatever you drive."), React.createElement("p", null, React.createElement("strong", null, "Ticks."), " The park's advice is to walk down the middle of trails, since ticks wait on plants for a host to pass."))), React.createElement("table", {
    className: "ym-temps"
  }, React.createElement("caption", null, "Monthly averages, 1991 to 2020 (NPS)"), React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Place"), React.createElement("th", {
    scope: "col"
  }, "Month"), React.createElement("th", {
    scope: "col"
  }, "High"), React.createElement("th", {
    scope: "col"
  }, "Low"), React.createElement("th", {
    scope: "col"
  }, "Precip."))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Yosemite Valley"), React.createElement("td", null, "April"), React.createElement("td", null, "63°F"), React.createElement("td", null, "38°F"), React.createElement("td", null, "3.2 in")), React.createElement("tr", {
    className: "is-may"
  }, React.createElement("th", {
    scope: "row"
  }, "Yosemite Valley"), React.createElement("td", null, "May"), React.createElement("td", null, "71°F"), React.createElement("td", null, "45°F"), React.createElement("td", null, "1.9 in")), React.createElement("tr", null, React.createElement("th", {
    scope: "row"
  }, "Yosemite Valley"), React.createElement("td", null, "June"), React.createElement("td", null, "81°F"), React.createElement("td", null, "51°F"), React.createElement("td", null, "0.5 in")), React.createElement("tr", {
    className: "is-may"
  }, React.createElement("th", {
    scope: "row"
  }, "Tuolumne Meadows"), React.createElement("td", null, "May"), React.createElement("td", null, "54°F"), React.createElement("td", null, "27°F"), React.createElement("td", null, "1.7 in")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ym-crowds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CROWDS AND MEMORIAL DAY"), React.createElement("h2", null, "A calm month with a crowded last weekend"), React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Getting in."), " In 2026 the Park Service announced it would not use a timed reservation system, so a car needed only the entrance fee: $35 per private vehicle, good for seven consecutive days, or $20 per person, with those 15 and younger free. Non-US residents 16 and older also pay a $100 nonresident fee, waived with an annual or America the Beautiful pass. The entrance stations do not take cash. Whether a reservation returns for a later May is the park's call each year; check its reservations page before you go."), React.createElement("p", null, React.createElement("strong", null, "Parking."), " The park's traffic page names Saturdays and holiday weekends as particularly busy and advises arriving before 8 am, after which parking is usually full. Its other line is the one to remember: if you find a space, leave the car there, because you will not find another. Text ynptraffic to 333111 for the park's traffic updates."), React.createElement("p", null, React.createElement("strong", null, "Memorial Day weekend."), " The Monday holiday is the month's crowd. If you have that weekend and the high roads are open, our ", React.createElement("a", {
    href: "/articles/memorial-day-skip-the-valley-go-high-2026"
  }, "Memorial Day plan"), " makes the case for spending the busiest hours above the Valley instead of in it."), React.createElement("p", null, React.createElement("strong", null, "Without a car."), " YARTS' summer service starts late in May: in 2026 its Highway 41 route ran from May 22 and its Highway 120 West route from May 22. The Highway 395 route over Tioga Pass started July 1, not when the road opened. In the Mariposa Grove, the 2026 shuttle ran from May 3, 8 am to 7 pm; without it, the grove is a two-mile hike each way. ", React.createElement("a", {
    href: "/articles/mariposa-grove-how-to-visit"
  }, "The Mariposa Grove guide"), " has the rest."))), React.createElement("div", null, React.createElement("h3", {
    className: "ym-sched__head"
  }, "A May Saturday, by the park's clock"), React.createElement("ol", {
    className: "ff-hours ym-sched"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Before 8 am"), React.createElement("p", null, "Through the gate and parked. After this, the park says, parking is usually full.")), React.createElement("li", null, React.createElement("span", null, "Once parked"), React.createElement("p", null, "Stay parked. The park says you will not find another space.")), React.createElement("li", null, React.createElement("span", null, "Midday"), React.createElement("p", null, "Hetch Hetchy's lot typically fills on weekends.")), React.createElement("li", null, React.createElement("span", null, "Any time"), React.createElement("p", null, "Text ynptraffic to 333111 for traffic updates."))), React.createElement("p", {
    className: "ff-alert ym-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "Plan for the weekend, not the month."), " The park names Saturdays and holiday weekends as its busiest days. A Tuesday in early May and the Saturday of Memorial Day weekend are different trips."))))), React.createElement("section", {
    className: "ff-band",
    id: "ym-halfdome",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HALF DOME"), React.createElement("h2", null, "The cables usually go up at the end of the month"), React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, "The Park Service says the Half Dome cables usually go up the Friday before Memorial Day, subject to conditions, and come down the day after the second Monday in October. In 2026 the park opened the hike on May 15, earlier than that. Either way, most of May falls before the cables, and a May trip built around Half Dome is a bet on the last week."), React.createElement("p", null, "A permit is required whenever the cables are up. The preseason lottery runs March 1 to 31; the daily lottery takes applications two days before the hike, from midnight to 4 pm Pacific, with results that night. Each application is $10, and each permit $10 a person, charged only when one is issued. The hike is 14 to 16 miles round trip with 4,800 feet of climbing, 10 to 12 hours for most people. ", React.createElement("a", {
    href: "/articles/so-you-want-to-hike-half-dome"
  }, "Our Half Dome guide"), " makes the case for and against, and ", React.createElement("a", {
    href: "/half-dome-lottery"
  }, "the lottery page"), " has the calendar."), React.createElement("p", null, "If the cables are down or the permit does not come, the waterfalls are the better May day anyway: the top of Nevada Fall is 5.4 miles round trip on the Mist Trail, five to six hours with 2,000 feet of climbing."))), React.createElement("figure", {
    className: "ym-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-permit-trail-sign.jpg",
    style: {
      aspectRatio: "1600 / 1200"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A trail sign on the Half Dome route stating that a permit is required to continue"
  }), React.createElement("figcaption", null, "The permit sign on the Half Dome trail. Photo: Peter Maiwald / Wikimedia Commons (CC0)")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ym-sleep",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE TO SLEEP"), React.createElement("h2", null, "Most of the park's beds are open; the high country's are not"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Campgrounds."), " The Valley's reservable campgrounds release sites five months ahead, on the 15th of each month at 7 am Pacific, and the park says they sell out within minutes. By the park's tentative 2026 dates, the Valley, Wawona and Hodgdon Meadow campgrounds were open through May, and Crane Flat opened May 21. The high-country campgrounds were not: Tuolumne Meadows, White Wolf, Yosemite Creek, Porcupine Flat and Tamarack Flat all opened in late June or July."), React.createElement("p", null, React.createElement("strong", null, "Lodging."), " Yosemite Hospitality's 2026 seasons put Housekeeping Camp open from April 3 and Tuolumne Meadows Lodge from June 5, so the Tuolumne lodge is not a May option. Curry Village's heated tents keep the heat on until the Friday before Memorial Day. The concessioner's lodging list shows White Wolf Lodge and the Wawona Hotel as closed; the Wawona Hotel closed for a Park Service condition assessment. Check the concessioner's own calendar for how far ahead each property books. ", React.createElement("a", {
    href: "/articles/where-to-stay-in-yosemite"
  }, "Where to stay in Yosemite"), " compares every option.")), React.createElement("div", null, React.createElement("h3", {
    className: "ym-sched__head"
  }, "Campgrounds open in May (2026, tentative)"), React.createElement("table", {
    className: "ym-camps"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Campground"), React.createElement("th", {
    scope: "col"
  }, "Where"), React.createElement("th", {
    scope: "col"
  }, "2026 season"))), React.createElement("tbody", null, CAMPS.map(([name, where, season]) => React.createElement("tr", {
    key: name
  }, React.createElement("th", {
    scope: "row"
  }, name), React.createElement("td", null, where), React.createElement("td", null, season))))))), React.createElement("div", {
    className: "ym-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Rooms for a waterfall month",
    note: React.createElement(React.Fragment, null, "May's beds fill around the weekends, Memorial Day above all. Search the in-park rooms first; when they are gone, Mariposa and El Portal on Highway 140 are the low road in. ", React.createElement("a", {
      href: "/articles/yosemite-gateway-towns-compared"
    }, "The gateway towns comparison"), " weighs all five."),
    list: "article_cta",
    slug: "yosemite-in-may",
    cta: "Search May lodging around Yosemite →"
  }))), React.createElement("section", {
    className: "ff-band",
    id: "ym-weeks",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WEEK BY WEEK"), React.createElement("h2", null, "Three Mays in one month"), React.createElement("ol", {
    className: "ym-weeks"
  }, WEEKS.map(w => React.createElement("li", {
    key: w.name,
    className: w.cls
  }, React.createElement("span", null, w.when), React.createElement("strong", null, w.name), React.createElement("p", null, w.text)))), React.createElement("div", {
    className: "ff-split ym-when"
  }, React.createElement("div", {
    className: "ym-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Early May."), " The park says the Valley trails are usually snow-free by sometime in May, and weekdays are the calm side of the month. The high roads are the open question; in most of the last twelve years Tioga was still closed in the first week."), React.createElement("p", null, React.createElement("strong", null, "Mid to late May."), " The water peaks. If you can choose only one week for waterfalls, this is the one the Park Service points to. In a warm, early year, the high roads may open now too."), React.createElement("p", null, React.createElement("strong", null, "Memorial Day weekend."), " The cables usually go up on the Friday, in 2026 YARTS started its Highway 41 and 120 West summer routes that Friday too, and the Valley lots fill early. After it, ", React.createElement("a", {
    href: "/articles/yosemite-in-june"
  }, "June"), " is early summer.")), React.createElement("p", {
    className: "ff-alert ym-alert"
  }, React.createElement(EventIcon, {
    name: "snow"
  }), React.createElement("span", null, React.createElement("strong", null, "Every road date here is a past year's."), " The park says it cannot predict the high roads' opening, even in late spring. Check its conditions page the week you go."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ym-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite in May, answered"), React.createElement("div", {
    className: "ym-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/spring.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Spring, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/weather.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weather, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/waterfalls.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Waterfalls, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Vernal and Nevada Falls, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/watersafety.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Water safety, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tioga.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tioga Road, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/seasonal.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Seasonal roads and historic opening dates, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/glacierpoint.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Glacier Point, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/news/yosemite-national-park-announces-summer-reopenings-full-campground-access-and-early-tioga-road-opening.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Summer reopenings, NPS news release, May 13, 2026")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/halfdome.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hdpermits.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Half Dome permits, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/fees.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Fees and passes, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/reservations.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Reservations, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/traffic.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Traffic, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/camping.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Camping, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/campgrounds.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Campground dates, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mg.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mariposa Grove, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/hetchhetchy.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Hetch Hetchy, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/lodging/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lodging, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.yarts.com/bus_routes/highway-41/",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Highway 41 route, YARTS"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap ym-end"
  }, React.createElement(AffiliateNote, null)));
};
