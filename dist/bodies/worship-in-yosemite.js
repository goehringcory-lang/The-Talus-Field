window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["worship-in-yosemite"] = function WorshipInYosemiteBody() {
  var TOC = [["#wy-chapel", "The chapel"], ["#wy-campgrounds", "Campgrounds"], ["#wy-congregations", "Other congregations"], ["#wy-easter", "Easter and holidays"], ["#wy-seasons", "Seasons"], ["#wy-weddings", "Weddings"], ["#wy-etiquette", "Etiquette"], ["#wy-questions", "Questions"]];
  var FAQ = [["Are there church services in Yosemite?", "Yes. Yosemite Community Church, a nondenominational congregation, meets at the Yosemite Valley Chapel every Sunday: 9:15 am all year, plus 11 am from Memorial Day to Labor Day. Confirm times with the chapel at 209-372-4831 or in the current Yosemite Guide."], ["Is there an Easter sunrise service in Yosemite?", "Yes. The chapel lists an Easter sunrise service at 7 am at Lower Pines Campground in Yosemite Valley, weather permitting, then Easter services at 9:15 and 11 am. There is no Easter sunrise service at Glacier Point: Glacier Point Road is normally closed by snow from November through late May or June."], ["Is there a Catholic Mass in Yosemite?", "Directory listings show Our Lady of the Snows, a mission of Our Lady of the Sierra Parish in Oakhurst, with Sunday Mass at 10 am, served by visiting priests. The listings disagree on where it meets, so confirm the time and place with the parish in Oakhurst before you go."], ["Can you get married in Yosemite?", "Yes, with a National Park Service special use permit, which is required for any wedding or commitment ceremony anywhere in the park. The application fee is $150 and nonrefundable. Apply up to one year ahead and more than 21 days before the date. The permit does not reserve a site."], ["How do you book a wedding at the Yosemite Valley Chapel?", "The Yosemite Community Church secretary schedules every ceremony in the chapel, at 209-372-4831. An outside officiant is allowed. You still need the Park Service's special use permit."], ["Are there church services at Yosemite campgrounds?", "The chapel lists Sunday services at 9 am in summer at Lower Pines, Wawona, White Wolf and Tuolumne campgrounds. Confirm with the chapel before you go."]];
  var CONGS = [{
    name: "Yosemite Community Church",
    where: "Yosemite Valley Chapel, Yosemite Valley",
    when: "Sunday 9:15 am all year; 11 am also in summer",
    who: "Nondenominational",
    status: "Listed by the church",
    cls: "is-verified"
  }, {
    name: "Summer campground services",
    where: "Lower Pines, Wawona, White Wolf and Tuolumne campgrounds",
    when: "Sunday 9 am, summer",
    who: "Listed by the chapel",
    status: "Confirm with the chapel",
    cls: "is-confirm"
  }, {
    name: "Our Lady of the Snows",
    where: "Yosemite Valley; listings disagree on the building",
    when: "Sunday Mass 10 am, per listings",
    who: "Catholic, a mission of Our Lady of the Sierra Parish, Oakhurst",
    status: "Confirm with the parish",
    cls: "is-confirm"
  }, {
    name: "Yosemite Ward",
    where: "49967 Rd 427, Oakhurst, outside the park",
    when: "Sunday 10 am",
    who: "The Church of Jesus Christ of Latter-day Saints",
    status: "Listed by the church",
    cls: "is-verified"
  }];
  var EASTER = [{
    day: "Maundy Thursday",
    time: "7 pm",
    where: "The chapel"
  }, {
    day: "Good Friday",
    time: "12:15 pm and 7 pm",
    where: "The chapel"
  }, {
    day: "Easter sunrise",
    time: "7 am",
    where: "Lower Pines Campground, weather permitting",
    glow: true
  }, {
    day: "Easter Day",
    time: "9:15 am and 11 am",
    where: "The chapel"
  }];
  var SEASONS = [{
    when: "Memorial Day to Labor Day",
    name: "Summer",
    cls: "is-peak",
    text: "Two Sunday services at the chapel, 9:15 and 11 am, and the summer campground services at 9 am."
  }, {
    when: "Labor Day to Memorial Day",
    name: "The rest of the year",
    cls: "is-mid",
    text: "One Sunday service at the chapel, 9:15 am, with Children's Church and nursery."
  }, {
    when: "Holidays",
    name: "Special services",
    cls: "is-late",
    text: "Easter week, Marriage Renewal Sunday in May, Thanksgiving, Christmas Eve and New Year's Watch Night."
  }];
  var PLACES = [["Yosemite Valley Chapel", "Old Village, Yosemite Valley", "Sunday services, Bible study, holiday services, chapel weddings"], ["Lower Pines Campground", "Yosemite Valley", "Easter sunrise service; summer Sunday campground service"], ["Wawona, White Wolf and Tuolumne campgrounds", "Outside the Valley", "Summer Sunday campground services"], ["The Ahwahnee", "Yosemite Valley", "Weddings and receptions through Yosemite Hospitality"], ["Oakhurst", "Outside the park", "The Latter-day Saints ward; the Catholic parish that runs the Valley mission"]];
  return React.createElement("div", {
    className: "wy-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "The chapel"), React.createElement("dd", null, "Built 1879, the Valley's oldest structure")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Sunday"), React.createElement("dd", null, "9:15 am all year, 11 am in summer")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "sun"
  }), React.createElement("dt", null, "Easter sunrise"), React.createElement("dd", null, "7 am, Lower Pines Campground")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "id"
  }), React.createElement("dt", null, "Weddings"), React.createElement("dd", null, "NPS permit, $150 application"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section wy-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "The Yosemite Valley Chapel, built in 1879, is the oldest structure in Yosemite Valley. It is home to Yosemite Community Church, a nondenominational congregation that holds a service every Sunday morning, all year. In summer the church also lists Sunday services at four campgrounds."), React.createElement("p", null, "Beyond the chapel, a Catholic mission in the Valley appears in directory listings, and the nearest Latter-day Saints ward meets outside the park in Oakhurst. We could not verify regularly scheduled services for any other faith inside the park."), React.createElement("p", null, "Times below come from each congregation's own page or, where marked, from secondary listings. They change. Confirm with the source before you plan a morning around one.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Sunday at the chapel: 9:15 am all year, 11 am too from Memorial Day to Labor Day."), React.createElement("li", null, "Easter sunrise: 7 am at Lower Pines Campground, weather permitting."), React.createElement("li", null, "There is no Easter sunrise service at Glacier Point."), React.createElement("li", null, "Any wedding anywhere in the park needs an NPS permit.")), React.createElement("a", {
    className: "wy-short__link",
    href: "#wy-easter"
  }, "Easter week, service by service ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "wy-chapel",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CHAPEL"), React.createElement("h2", null, "Sunday at the Yosemite Valley Chapel"), React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, "Yosemite Community Church is nondenominational, and its website puts the policy in one line: \"Everyone and all denominations are welcome.\" The pastor is Brent Moore. The church office is at 209-372-4831."), React.createElement("p", null, React.createElement("strong", null, "Sunday services."), " From Memorial Day to Labor Day there are two, at 9:15 and 11 am. The rest of the year there is one, at 9:15 am. The 9:15 service offers Children's Church and a nursery. Services are livestreamed on the chapel's Facebook page and on Zoom, for anyone who cannot get to the Valley."), React.createElement("p", null, React.createElement("strong", null, "During the week."), " A Bible study meets Thursdays at 7 pm; the church says to contact the chapel for the location. The Park Service notes that Alcoholics Anonymous meetings are held at the chapel regularly."), React.createElement("p", null, "The Park Service says the chapel operates year-round, with services every Sunday morning and on some holidays, and points visitors to the chapel's website or the current Yosemite Guide for times. That is the right order of trust: the church's page first, the printed guide second, and this article third."))), React.createElement("div", null, React.createElement("h3", {
    className: "wy-sched__head"
  }, "The chapel's week"), React.createElement("ol", {
    className: "ff-hours wy-sched"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Sunday, summer"), React.createElement("p", null, "9:15 am and 11 am. Memorial Day to Labor Day.")), React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Sunday, the rest of the year"), React.createElement("p", null, "9:15 am.")), React.createElement("li", null, React.createElement("span", null, "Sunday, 9:15 am"), React.createElement("p", null, "Children's Church and nursery.")), React.createElement("li", null, React.createElement("span", null, "Thursday"), React.createElement("p", null, "Bible study, 7 pm. Ask the chapel where.")), React.createElement("li", null, React.createElement("span", null, "Anywhere"), React.createElement("p", null, "Livestream on Facebook and Zoom."))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wy-history",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE BUILDING"), React.createElement("h2", null, "The oldest structure in the Valley"), React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, "The chapel went up in the summer of 1879, paid for by the California State Sunday School Association, which had applied in 1878 to build an \"undenominational\" chapel. San Francisco architect Charles Geddes designed it, and Samuel Thomson is believed to have been the contractor. It is New England in style and seats 250. Its first services were purportedly held on June 7, 1879."), React.createElement("p", null, "It did not start where it stands. The chapel was built near the present Four Mile Trailhead and moved in 1901 to its current site in the Old Village. The Park Service acquired it in 1927. In 1965 its foundation was raised three feet against flooding, and the 1997 flood damaged it anyway; it was restored. In 1973 it became the first structure in the park listed on the National Register of Historic Places."), React.createElement("p", null, "There were plans for something bigger. In 1926 a larger church was proposed near the Ahwahnee; it was downgraded to an outdoor \"Church Bowl.\" During the Second World War, when the Navy ran a hospital in the Ahwahnee, the hotel had two improvised chapels, one of them in the bar."))), React.createElement("ol", {
    className: "wy-timeline"
  }, React.createElement("li", null, React.createElement("span", null, "1878"), React.createElement("p", null, "Application for an \"undenominational\" chapel.")), React.createElement("li", null, React.createElement("span", null, "1879"), React.createElement("p", null, "Built near today's Four Mile Trailhead. First services purportedly June 7.")), React.createElement("li", null, React.createElement("span", null, "1901"), React.createElement("p", null, "Moved to its present site in the Old Village.")), React.createElement("li", null, React.createElement("span", null, "1926"), React.createElement("p", null, "A larger church near the Ahwahnee becomes an outdoor \"Church Bowl.\"")), React.createElement("li", null, React.createElement("span", null, "1927"), React.createElement("p", null, "The Park Service acquires the chapel.")), React.createElement("li", null, React.createElement("span", null, "1965"), React.createElement("p", null, "Foundation raised three feet against flooding.")), React.createElement("li", null, React.createElement("span", null, "1973"), React.createElement("p", null, "The first structure in the park on the National Register.")), React.createElement("li", null, React.createElement("span", null, "1997"), React.createElement("p", null, "Damaged in the flood, then restored."))))), React.createElement("section", {
    className: "ff-band",
    id: "wy-campgrounds",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CAMPGROUNDS AND OUTDOOR SERVICES"), React.createElement("h2", null, "Sunday at 9, under the trees"), React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, "In summer the chapel lists Sunday services at 9 am at four campgrounds: Lower Pines in the Valley, Wawona, White Wolf and Tuolumne. A separate directory listing labels these as services of A Christian Ministry in the National Parks, running Memorial Day to Labor Day. We could confirm the times only from the chapel's listing, so call the chapel before you count on one."), React.createElement("p", null, "Lower Pines is also where the chapel holds its Easter sunrise service. If you are camping, ", React.createElement("a", {
    href: "/articles/yosemite-camping-complete-guide"
  }, "the camping guide"), " covers how the Valley campgrounds book, and the ", React.createElement("a", {
    href: "/articles/wawona-yosemite-guide"
  }, "Wawona guide"), " covers what else is at the park's south end."))), React.createElement("figure", {
    className: "wy-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/upper-pines-campground.jpg",
    style: {
      aspectRatio: "1600 / 900"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The forest at Upper Pines Campground on the Yosemite Valley floor, tall trees over open ground"
  }), React.createElement("figcaption", null, "Upper Pines Campground on the Valley floor. The services the chapel lists meet at Lower Pines, Wawona, White Wolf and Tuolumne. Photo: Andrew Burnham / Wikimedia Commons (CC BY-SA 3.0)")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wy-congregations",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "OTHER CONGREGATIONS"), React.createElement("h2", null, "Who else meets, and how sure we are"), React.createElement("div", {
    className: "wy-congs"
  }, CONGS.map(c => React.createElement("article", {
    key: c.name,
    className: "wy-cong " + c.cls
  }, React.createElement("p", {
    className: "wy-cong__status"
  }, c.status), React.createElement("h3", null, c.name), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Who"), React.createElement("dd", null, c.who)), React.createElement("div", null, React.createElement("dt", null, "Where"), React.createElement("dd", null, c.where)), React.createElement("div", null, React.createElement("dt", null, "When"), React.createElement("dd", null, c.when)))))), React.createElement("div", {
    className: "ff-split wy-congs__prose"
  }, React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Catholic."), " Directory listings show Our Lady of the Snows, a Catholic mission in Yosemite Valley, as a mission of Our Lady of the Sierra Parish in Oakhurst, in the Diocese of Fresno. They show Sunday Mass at 10 am year-round, said by visiting priests, and one secondary listing shows a summer Saturday Mass at 6 pm at Lower Pines. The listings disagree about where in the Valley the Sunday Mass meets. Confirm the time and the place with Our Lady of the Sierra Parish in Oakhurst before you go."), React.createElement("p", null, React.createElement("strong", null, "Latter-day Saints."), " The Yosemite Ward meets in Oakhurst, at 49967 Rd 427, on Sundays at 10 am. That is outside the park. The church's page lists an hour of sacrament meeting and an hour of gospel study, says no RSVP is required, and describes the dress as \"Sunday best, but you can also come as you are.\" We found no Latter-day Saints unit inside the park."), React.createElement("p", null, React.createElement("strong", null, "Everyone else."), " We could not verify regularly scheduled services for any other faith inside the park. If your tradition is not listed here, ask your own congregation about communities outside the park before you go; ", React.createElement("a", {
    href: "/articles/yosemite-gateway-towns-compared"
  }, "the gateway towns compared"), " lays out where each town sits.")), React.createElement("p", {
    className: "ff-alert wy-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "The Catholic schedule is the least certain thing on this page."), " It rests on directory listings, not the parish's own page, and those listings conflict on the location. Call Our Lady of the Sierra Parish in Oakhurst first.")))), React.createElement("section", {
    className: "ff-band",
    id: "wy-easter",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EASTER AND THE HOLIDAYS"), React.createElement("h2", null, "Easter sunrise is at Lower Pines, not Glacier Point"), React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, "The Easter sunrise service in Yosemite that we could verify is the chapel's: 7 am at Lower Pines Campground in Yosemite Valley, weather permitting. The chapel's Easter Day services follow at 9:15 and 11 am."), React.createElement("p", null, "There is no Easter sunrise service at Glacier Point. The Park Service says Glacier Point Road is normally closed by snow from sometime in November through late May or June, so in a normal year the road is shut at Easter, and no source we checked lists a service there. ", React.createElement("a", {
    href: "/articles/glacier-point-how-to-visit"
  }, "The Glacier Point guide"), " covers when and how you can get up there."), React.createElement("p", null, "The rest of Holy Week at the chapel: Maundy Thursday at 7 pm, and Good Friday at 12:15 pm and 7 pm."), React.createElement("p", null, React.createElement("strong", null, "The rest of the year's special services."), " Marriage Renewal Sunday falls on the first Sunday in May, at 9:15 and 11 am. Thanksgiving Day has a 10 am service, which pairs with ", React.createElement("a", {
    href: "/articles/thanksgiving-in-yosemite"
  }, "a Thanksgiving trip"), ". Christmas Eve runs 4 to 5 pm, and the New Year's Watch Night service, with communion, starts at 10 pm."))), React.createElement("div", null, React.createElement("h3", {
    className: "wy-sched__head"
  }, "Holy Week, by the chapel's calendar"), React.createElement("ol", {
    className: "ff-hours wy-sched"
  }, EASTER.map(e => React.createElement("li", {
    key: e.day,
    className: e.glow ? "is-glow" : undefined
  }, React.createElement("span", null, e.day), React.createElement("p", null, e.time, ". ", e.where, ".")))), React.createElement("p", {
    className: "ff-alert wy-alert"
  }, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("span", null, React.createElement("strong", null, "No Glacier Point sunrise service."), " Glacier Point Road is normally closed by snow from sometime in November through late May or June. The Easter sunrise service is in the Valley, at Lower Pines.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wy-seasons",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SEASONS"), React.createElement("h2", null, "What changes with the calendar"), React.createElement("ol", {
    className: "wy-seasons"
  }, SEASONS.map(s => React.createElement("li", {
    key: s.name,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split wy-when"
  }, React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Summer (Memorial Day to Labor Day)."), " The chapel holds two Sunday services, at 9:15 and 11 am, and lists its campground services at 9 am. This is the fullest schedule of the year."), React.createElement("p", null, React.createElement("strong", null, "The rest of the year."), " One Sunday service at the chapel, at 9:15 am, with Children's Church and nursery. The campground services are a summer listing."), React.createElement("p", null, React.createElement("strong", null, "Holidays."), " Easter week, Marriage Renewal Sunday on the first Sunday in May, Thanksgiving Day, Christmas Eve and New Year's Watch Night each have their own service times, listed in the section above.")), React.createElement("div", null, React.createElement("h3", {
    className: "wy-sched__head"
  }, "Where services happen"), React.createElement("table", {
    className: "wy-places"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Place"), React.createElement("th", {
    scope: "col"
  }, "Where"), React.createElement("th", {
    scope: "col"
  }, "What"))), React.createElement("tbody", null, PLACES.map(([place, where, what]) => React.createElement("tr", {
    key: place
  }, React.createElement("th", {
    scope: "row"
  }, place), React.createElement("td", null, where), React.createElement("td", null, what)))))))), React.createElement("section", {
    className: "ff-band",
    id: "wy-weddings",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WEDDINGS AND CEREMONIES"), React.createElement("h2", null, "Every ceremony needs a permit"), React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, "Any wedding or commitment ceremony anywhere in Yosemite needs a special use permit from the Park Service. The application fee is $150 and nonrefundable. Outdoor events of 30 to 50 or more people also pay $50 an hour for an event monitor; that charge does not apply inside Yosemite Hospitality's facilities. Apply up to a year ahead and more than 21 days before the date, by mailing the original application with a check or money order, not cash, to Special Park Uses, PO Box 700, El Portal, CA 95318. The Special Park Uses office is at 209-379-1434."), React.createElement("p", null, "The permit does not reserve a site or keep other visitors away, and it covers up to two hours. No permits are issued for holidays or holiday weekends. The Park Service advises avoiding busy sites and going early, late or on a weekday. Entrance fees are not waived for guests."), React.createElement("p", null, React.createElement("strong", null, "At the chapel."), " The Yosemite Community Church secretary schedules every ceremony in the chapel, at 209-372-4831. An outside officiant is allowed."), React.createElement("p", null, React.createElement("strong", null, "At the Ahwahnee."), " Yosemite Hospitality runs weddings at its venues; the Ahwahnee takes up to 120 guests across several room and patio arrangements. It books 14 months ahead. Food and drink must be bought on site, minimums apply, and there is a customary 20 percent service charge. Quiet hours are 9 pm throughout Yosemite Valley; at the Ahwahnee, dancing is allowed only in the Winter Club Room, and there is no amplified music outdoors. Its own FAQ says you will still need the Park Service's ceremony permit."), React.createElement("p", null, React.createElement("strong", null, "What can go wrong."), " The Park Service lists smoke, most common in August and September, road closures, and spring floods, often in May. Engaged first? ", React.createElement("a", {
    href: "/articles/where-to-propose-in-yosemite"
  }, "The proposal guide"), " covers the question before this one."))), React.createElement("div", null, React.createElement("figure", {
    className: "wy-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/ahwahnee-hotel.jpg",
    style: {
      aspectRatio: "1600 / 1200"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The Ahwahnee in winter, its stone and timber front below the Valley's north wall"
  }), React.createElement("figcaption", null, "The Ahwahnee, which takes weddings of up to 120 guests. Photo: Chris Dunstan / Wikimedia Commons (public domain)")), React.createElement("article", {
    className: "ff-inpark wy-permit"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE PERMIT"), React.createElement("h3", null, "Special Park Uses"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Application fee"), React.createElement("dd", null, "$150, nonrefundable")), React.createElement("div", null, React.createElement("dt", null, "Event monitor"), React.createElement("dd", null, "$50 an hour, larger outdoor events")), React.createElement("div", null, React.createElement("dt", null, "When to apply"), React.createElement("dd", null, "Up to a year ahead, more than 21 days before")), React.createElement("div", null, React.createElement("dt", null, "Length"), React.createElement("dd", null, "Up to two hours")), React.createElement("div", null, React.createElement("dt", null, "Phone"), React.createElement("dd", null, "209-379-1434"))), React.createElement("p", {
    className: "ff-note"
  }, "Check or money order with the original application, mailed to Special Park Uses, PO Box 700, El Portal, CA 95318.")))), React.createElement("ul", {
    className: "ff-rules wy-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No releases, no decorations."), React.createElement("p", null, "No rice, birdseed, butterflies or balloons; no arches, signs, chairs or tables. Handheld bouquets are fine, and picnic table decorations in picnic areas.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No amplified sound."), React.createElement("p", null, "No amplified music or PA. The noise limit is 60 decibels at 50 feet. No drones.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "tree",
    size: 26
  }), React.createElement("strong", null, "Not at the sequoias."), React.createElement("p", null, "No ceremonies around the bases of sequoias. Meadows and riparian areas are restricted.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "No receptions in picnic areas."), React.createElement("p", null, "No formal receptions in picnic or day-use areas. No horse carriages or hot air balloons."))), React.createElement("div", {
    className: "wy-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Rooms for the guests",
    note: "Book in-park rooms through Yosemite Hospitality, which says its lodging opens a year and a day ahead. For a wedding or a holiday weekend that is the first place to look. When the park is full, a search shows what is left within driving distance.",
    list: "article_cta",
    slug: "worship-in-yosemite",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "wy-etiquette",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ETIQUETTE"), React.createElement("h2", null, "Visiting a service, or passing a ceremony"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "wy-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Confirm before you go."), " Every schedule here can change, the Easter sunrise service is weather permitting, and the campground and Catholic times rest on listings. Call the congregation, or check the current Yosemite Guide."), React.createElement("p", null, React.createElement("strong", null, "Come as a guest."), " The chapel welcomes everyone and all denominations, and the Oakhurst ward asks no RSVP. If you bring children to the chapel, the 9:15 service has Children's Church and a nursery."), React.createElement("p", null, React.createElement("strong", null, "Keep a backup."), " If weather cancels the sunrise service at Lower Pines, the chapel's 9:15 and 11 am Easter services still stand. If you cannot get to the Valley at all, the chapel livestreams on Facebook and Zoom."), React.createElement("p", null, React.createElement("strong", null, "Mind the hour."), " Yosemite Hospitality lists quiet hours of 9 pm throughout Yosemite Valley."), React.createElement("p", null, React.createElement("strong", null, "At someone else's wedding."), " A ceremony permit does not reserve a viewpoint or exclude other visitors, so you are not obliged to leave. Giving a couple room for a few minutes costs nothing. If you are a guest, leave the rice, birdseed and balloons at home; the park bans them.")), React.createElement("ul", {
    className: "ff-rules wy-manners"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "clock",
    size: 26
  }), React.createElement("strong", null, "Call ahead."), React.createElement("p", null, "The chapel is at 209-372-4831.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "All are welcome."), React.createElement("p", null, "The chapel is nondenominational and says so.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "cloud",
    size: 26
  }), React.createElement("strong", null, "Weather permitting."), React.createElement("p", null, "The sunrise service can be called off. The chapel services stand.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "eye",
    size: 26
  }), React.createElement("strong", null, "Give a couple room."), React.createElement("p", null, "Their permit does not close the spot. Courtesy does the rest."))))), React.createElement("section", {
    className: "ff-band",
    id: "wy-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Worship in Yosemite, answered"), React.createElement("div", {
    className: "wy-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "http://www.yosemitevalleychapel.org/services.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Services, Yosemite Valley Chapel")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/learn/historyculture/chapel.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Valley Chapel history, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/yosemite-chapel.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Chapel, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/weddings.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weddings, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.travelyosemite.com/group-travel/weddings",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Weddings, Yosemite Hospitality")), React.createElement("li", null, React.createElement("a", {
    href: "https://local.churchofjesuschrist.org/en/units/us/ca/yosemite-ward",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Ward, The Church of Jesus Christ of Latter-day Saints"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap wy-end"
  }, React.createElement(AffiliateNote, null)));
};
