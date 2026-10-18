window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["yosemite-tire-chains"] = function YosemiteTireChainsBody() {
  var TOC = [["#tc-levels", "R1, R2, R3"], ["#tc-carry", "The carry rule"], ["#tc-rentals", "Rental cars"], ["#tc-evs", "EVs"], ["#tc-buy", "Buying and fitting"], ["#tc-routes", "Which road"], ["#tc-questions", "Questions"]];
  var FAQ = [["Do you need tire chains in Yosemite?", "Often, from November through March, and less often in October and April. Whenever a chain control is in effect, every vehicle in Yosemite must carry chains, including four-wheel drives and rental cars, even if the control level lets it drive without mounting them. Call 209/372-0200, then 1, then 1, for the current requirement."], ["What do R1, R2 and R3 mean?", "They are the three chain control levels. In the park, R1 exempts vehicles under 6,000 pounds with snow tires on at least two drive wheels and no trailer. R2 exempts four-wheel or all-wheel drive vehicles under 6,500 pounds with snow tires on all four wheels, four-wheel drive engaged and no trailer. R3 means chains on the drive wheels of every vehicle, no exceptions."], ["Does an AWD or 4WD car need chains in Yosemite?", "It must carry them whenever a chain control is in effect. Under R2 an all-wheel or four-wheel drive vehicle can go without mounting them only if it has snow tires on all four wheels and meets the park's weight and towing limits. Under R3 it mounts them like everyone else."], ["Are rental cars exempt from chain controls in Yosemite?", "No. The Park Service says rental cars are not exempt, even with all-season tires. Rental companies may not supply chains or allow them: Enterprise says it does not offer chains and that chains cannot be placed on its rental vehicles unless required by state law. Read your own rental agreement and ask at the counter before you drive up."], ["Do electric cars need chains in Yosemite?", "They follow the same rules as any vehicle, and weight matters. The R1 and R2 exemptions apply only under 6,000 and 6,500 pounds, and the Park Service says many battery-electric trucks and some large electric SUVs exceed those limits, so they need chains even with snow tires."], ["What is the fine for not using chains in Yosemite?", "The Park Service says failing to put on chains when required can bring a citation of up to $5,000. A tow truck sent to bring you chains can cost a few hundred dollars, is not covered by AAA, and can take several hours."], ["Where can I buy tire chains near Yosemite?", "At most auto parts stores and gas stations in the communities around the park. Inside the park the Village Garage in Yosemite Valley and the Wawona gas station carry a limited stock. The Park Service says rentals are rarely available. Buy chains sized to your tires."]];
  var LEVELS = [{
    code: "R1",
    name: "Snow tires OK",
    cls: "is-r1",
    rule: "Chains on, unless the vehicle is under 6,000 lbs, has snow tires on at least two drive wheels, and is not towing.",
    carry: "Exempt vehicles still carry chains."
  }, {
    code: "R2",
    name: "4WD or AWD with snow tires OK",
    cls: "is-r2",
    rule: "Chains on, unless the vehicle is under 6,500 lbs, has snow tires on all four wheels, has four-wheel or all-wheel drive engaged, and is not towing.",
    carry: "Exempt vehicles still carry chains."
  }, {
    code: "R3",
    name: "No exceptions",
    cls: "is-r3",
    rule: "Chains on the drive wheels of every vehicle.",
    carry: "There is no exemption to claim."
  }];
  var GRID = [["R1", "Mount", "Carry", "Carry", "Mount"], ["R2", "Mount", "Mount", "Carry", "Mount"], ["R3", "Mount", "Mount", "Mount", "Mount"]];
  var ROUTES = [["El Portal Road (Highway 140)", "Lower, so chains are required less often", "Also the YARTS winter route; park at a stop outside the park and ride in"], ["Wawona Road (Highway 41)", "Chains required more often", "The way to Wawona, the Mariposa Grove and Badger Pass"], ["Badger Pass Road", "Chains required more often", "The ski area road off Wawona Road"], ["Big Oak Flat Road (Highway 120 west)", "Chains required more often", "The road from Groveland and the Bay Area"], ["Tioga Road (Highway 120 east)", "Usually closed by snow from sometime in November until late May or June", "No crossing of the Sierra this way in winter"]];
  return React.createElement("div", {
    className: "tc-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "calendar"
  }), React.createElement("dt", null, "Chain season"), React.createElement("dd", null, "November through March, sometimes October and April")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("dt", null, "The carry rule"), React.createElement("dd", null, "Every vehicle, whenever control is on")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "clock"
  }), React.createElement("dt", null, "Speed limit"), React.createElement("dd", null, "25 mph in a chain control area")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("dt", null, "Citation"), React.createElement("dd", null, "Up to $5,000"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section tc-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Chains in Yosemite are not a matter of whether your car can handle the snow. They are a matter of what the sign at the checkpoint says and what is in your trunk. The Park Service says chains are often required on roads inside and outside the park from November through March, less often in October and April, and rarely in September or May, and that it is not possible to predict whether you will need them."), React.createElement("p", null, "The rule that catches people is the carrying rule. Whenever chain controls are in effect, every vehicle must have chains in it, four-wheel drives and rental cars included, even when the control level lets that vehicle drive on without mounting them. Inside the park these are federal rules; outside it, on Highways 41, 120 and 140 and the rest of California's mountain roads, they are state law, enforced by the California Highway Patrol."), React.createElement("p", null, "Below: what R1, R2 and R3 mean, which cars each one exempts, what that means for a rental car, an all-wheel drive and an electric vehicle, where to buy chains, and which road into the park needs them least.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "From November through March, carry chains on any trip, whatever you drive."), React.createElement("li", null, "AWD and 4WD are not exempt from carrying them. Rentals are not exempt at all."), React.createElement("li", null, "Heavy EVs can miss the R1 and R2 weight limits and have to chain up."), React.createElement("li", null, "Call 209/372-0200, then 1, then 1, the morning you drive.")), React.createElement("a", {
    className: "tc-short__link",
    href: "#tc-levels"
  }, "The three levels, side by side ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "tc-levels",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "CHAIN CONTROL LEVELS"), React.createElement("h2", null, "R1, R2 and R3, as the park defines them"), React.createElement("ol", {
    className: "tc-levels"
  }, LEVELS.map(l => React.createElement("li", {
    key: l.code,
    className: l.cls
  }, React.createElement("span", {
    className: "tc-levels__code"
  }, l.code), React.createElement("strong", null, l.name), React.createElement("p", null, l.rule), React.createElement("p", {
    className: "tc-levels__carry"
  }, l.carry)))), React.createElement("div", {
    className: "ff-split tc-levels__prose"
  }, React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, "When conditions call for it, signs go up along the road naming the level, and a checkpoint follows. Caltrans says there is usually about a mile between the \"Chains Required\" signs and the checkpoint, which is the distance you have to find a place to pull completely off the road to the right and put chains on."), React.createElement("p", null, React.createElement("strong", null, "R1."), " The Park Service exempts a vehicle under 6,000 pounds with snow tires on at least two drive wheels that is not towing. Everything else mounts chains."), React.createElement("p", null, React.createElement("strong", null, "R2."), " The park exempts a four-wheel or all-wheel drive vehicle under 6,500 pounds, with snow tires on all four wheels, four-wheel drive engaged, and no trailer. Caltrans words its version without a weight figure: chains on all vehicles except four-wheel and all-wheel drive vehicles with snow-tread tires on all four wheels. Inside the park, go by the park's version."), React.createElement("p", null, React.createElement("strong", null, "R3."), " Chains on all vehicles, no exceptions. The park says on the drive wheels."), React.createElement("p", null, React.createElement("strong", null, "What counts as a snow tire."), " The park accepts tires marked M+S, for mud and snow, with at least 6/32 of an inch of tread. Caltrans lists the sidewall markings MS, M/S, M+S or the words MUD AND SNOW. Read your sidewalls and check the tread before you assume either way."), React.createElement("p", null, React.createElement("strong", null, "What counts as a chain."), " The park accepts chains, cables and tire socks. Plastic devices, straps and other emergency alternatives do not meet the requirement.")), React.createElement("div", null, React.createElement("h3", {
    className: "tc-sched__head"
  }, "Who mounts, who only carries"), React.createElement("div", {
    className: "tc-grid-wrap"
  }, React.createElement("table", {
    className: "tc-grid"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Level"), React.createElement("th", {
    scope: "col"
  }, "2WD, no snow tires"), React.createElement("th", {
    scope: "col"
  }, "2WD, snow tires on drive wheels"), React.createElement("th", {
    scope: "col"
  }, "4WD/AWD, snow tires on all four"), React.createElement("th", {
    scope: "col"
  }, "Over the weight limit, or towing"))), React.createElement("tbody", null, GRID.map(([lvl, ...cells]) => React.createElement("tr", {
    key: lvl
  }, React.createElement("th", {
    scope: "row"
  }, lvl), cells.map((c, i) => React.createElement("td", {
    key: i,
    className: c === "Mount" ? "is-mount" : "is-carry"
  }, c))))))), React.createElement("p", {
    className: "ff-note tc-grid__note"
  }, "\"Carry\" means the vehicle may drive on without chains mounted, but must have them on board. The weight limits are the park's: 6,000 lbs for R1, 6,500 lbs for R2. Chains go on the drive wheels."))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tc-carry",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE CARRY RULE, AWD AND 4WD"), React.createElement("h2", null, "All-wheel drive gets you a pass, not an exemption"), React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, "The Park Service puts it plainly: when chain controls are in effect, all vehicles must have chains in their possession, including four-wheel drive and rental vehicles. Caltrans says the same for its roads: four-wheel and all-wheel drive vehicles must carry traction devices in chain control areas. The park adds that its chain requirements are strictly enforced."), React.createElement("p", null, "So an all-wheel drive car with proper snow tires can drive through R2 without stopping to chain up, but only with a set in the car, and it cannot drive through R3 without mounting them. An all-wheel drive car on tires that are not snow tires is a two-wheel drive car for the purpose of R2: it mounts chains."), React.createElement("p", null, React.createElement("strong", null, "Know your drive wheels."), " Caltrans says chains go on the drive wheels and tells drivers to know whether their vehicle is front or rear wheel drive. For an all-wheel drive car, check the owner's manual for where chains go and which kind the maker allows. Caltrans does not recommend brands and points drivers to the vehicle maker's specifications."), React.createElement("p", null, React.createElement("strong", null, "Under chains, slow down."), " The park's speed limit in a chain control area is 25 mph. Caltrans gives 25 or 30 mph for its roads, as posted."))), React.createElement("figure", {
    className: "tc-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/big-oak-flat-road-tunnel.jpg",
    style: {
      aspectRatio: "1600 / 1200"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "A tunnel on Big Oak Flat Road, the Highway 120 approach into Yosemite from the west"
  }), React.createElement("figcaption", null, "Big Oak Flat Road, the Highway 120 approach from the west, is one of the roads the park says needs chains more often than Highway 140. Photo: Famartin / Wikimedia Commons (CC BY-SA 3.0)")))), React.createElement("section", {
    className: "ff-band",
    id: "tc-rentals",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RENTAL CARS"), React.createElement("h2", null, "The checkpoint and the rental contract do not agree"), React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, "The Park Service says rental cars are not exempt from chain requirements, even with all-season tires. The rental company may see it differently. Enterprise's own help page says it \"does not offer snow chains/traction devices,\" and that chains cannot be placed on its rental vehicles \"unless required by state law.\" It also says a four-wheel or all-wheel drive vehicle can be requested at some locations but cannot be guaranteed."), React.createElement("p", null, "We could not read a current chain policy for the other major rental companies on their own sites, so we do not state one here. Policies can differ by company and by location, and the agreement you sign is the one that binds you."), React.createElement("p", null, React.createElement("strong", null, "What to do about it."), " Before a winter trip, read the rental agreement's section on chains and traction devices, and ask at the counter what the location allows. Ask for an all-wheel drive vehicle and look at the tire sidewalls for an M+S mark before you leave the lot. Bring chains that fit the car you were actually given; the park says rental car companies generally do not provide chains, and chain rentals are rarely available."), React.createElement("p", null, "If the contract and the checkpoint cannot both be satisfied, do not drive the chain control. Wait for it to lift, stay on Highway 140, which needs chains least often, or leave the car at a YARTS stop outside the park and ride in. ", React.createElement("a", {
    href: "/articles/getting-to-yosemite"
  }, "The entrances guide"), " lays out each approach."))), React.createElement("div", null, React.createElement("h3", {
    className: "tc-sched__head"
  }, "At the rental counter"), React.createElement("ol", {
    className: "ff-hours tc-sched"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "Ask"), React.createElement("p", null, "Does this location allow chains or other traction devices on this car?")), React.createElement("li", null, React.createElement("span", null, "Ask"), React.createElement("p", null, "Can I have an all-wheel or four-wheel drive vehicle? It is a request, not a guarantee.")), React.createElement("li", null, React.createElement("span", null, "Check"), React.createElement("p", null, "The sidewalls: an M+S mark and at least 6/32 of an inch of tread.")), React.createElement("li", null, React.createElement("span", null, "Check"), React.createElement("p", null, "Which wheels drive, and what chains the owner's manual allows.")), React.createElement("li", null, React.createElement("span", null, "Keep"), React.createElement("p", null, "A copy of the policy you were given, in writing."))), React.createElement("p", {
    className: "ff-alert tc-alert"
  }, React.createElement(EventIcon, {
    name: "alert"
  }), React.createElement("span", null, React.createElement("strong", null, "A rental is never exempt from carrying."), " If chain controls are in effect inside the park, the car must have chains in it, whatever the contract says.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tc-evs",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "ELECTRIC VEHICLES"), React.createElement("h2", null, "The weight limit is the EV rule"), React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, "There is no separate chain rule for electric vehicles. There is a weight limit, and batteries are heavy. The R1 exemption ends at 6,000 pounds and the R2 exemption at 6,500. The Park Service says many battery-electric trucks and some large electric SUVs exceed those limits, so they need chains even with snow tires. Check your vehicle's weight against those figures before the trip, starting with the owner's manual."), React.createElement("p", null, "A lighter EV with snow tires is treated like any other car: under R1 it qualifies if its drive wheels have snow tires, and under R2 if it is all-wheel drive with snow tires on all four. Like any car, it must carry chains."), React.createElement("p", null, React.createElement("strong", null, "Charging."), " The park lists Level 2 charging in Yosemite Valley, at Wawona, in the El Portal administrative area and at Tuolumne Meadows, all on J1772 connectors. Wawona has 24 chargers at 11 kW, next to the store, available around the clock; the Valley has stations at the Ahwahnee, Curry Village, Yosemite Valley Lodge, the Yosemite Falls day-use parking and the Welcome Center. The Tuolumne Meadows chargers sit on Tioga Road, which is usually closed by snow from sometime in November until late May or June. The park's pages list no fast chargers inside the park, so arrive with the charge you need to get back out."))), React.createElement("article", {
    className: "ff-inpark tc-ev"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "EV CHARGING IN THE PARK"), React.createElement("h3", null, "Level 2, J1772"), React.createElement("dl", null, React.createElement("div", null, React.createElement("dt", null, "Yosemite Valley"), React.createElement("dd", null, "The Ahwahnee, Curry Village, Valley Lodge, Yosemite Falls parking, Welcome Center")), React.createElement("div", null, React.createElement("dt", null, "Wawona"), React.createElement("dd", null, "24 chargers, 11 kW, by the store")), React.createElement("div", null, React.createElement("dt", null, "El Portal"), React.createElement("dd", null, "Two chargers by the market and gas station")), React.createElement("div", null, React.createElement("dt", null, "Tuolumne Meadows"), React.createElement("dd", null, "Four chargers; Tioga Road closes in winter"))), React.createElement("p", {
    className: "ff-note"
  }, "The park warns that charging spaces, like all parking, can be hard to get on busy days. Confirm locations on the park's EV charging page.")))), React.createElement("section", {
    className: "ff-band",
    id: "tc-buy",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "BUYING AND FITTING"), React.createElement("h2", null, "Buy them before the mountains, fit them before the storm"), React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Where to buy."), " The Park Service says most auto parts stores and gas stations in the communities near the park sell chains, and that the Village Garage in Yosemite Valley and the Wawona gas station carry a limited stock. Match the chains to your tire size; the size is printed on the sidewall. Rentals are rarely available."), React.createElement("p", null, React.createElement("strong", null, "If you arrive without them."), " The park says you may need a tow truck to bring you chains, which can cost a few hundred dollars, is not covered by AAA, and can take several hours to arrive."), React.createElement("p", null, React.createElement("strong", null, "Chain installers."), " On state highways you may meet people offering to put chains on for a fee. Caltrans says they are independent businesspeople, not Caltrans employees, and that they are not allowed to sell or rent chains. If you hire one, get a receipt and write the installer's badge number on it."), React.createElement("p", null, React.createElement("strong", null, "Practice once."), " Fit the chains in a dry driveway or parking lot before the trip, so the roadside is not the first time. Caltrans suggests carrying a flashlight and chain repair links, and keeping the gas tank full in case a storm turns you around or holds you in traffic. The rest of what belongs in a winter trunk is in ", React.createElement("a", {
    href: "/articles/pack-your-car-for-yosemite"
  }, "the car-packing guide"), "."))), React.createElement("ul", {
    className: "ff-rules tc-rules"
  }, React.createElement("li", null, React.createElement(EventIcon, {
    name: "check",
    size: 26
  }), React.createElement("strong", null, "Chains, cables, socks."), React.createElement("p", null, "The park accepts all three.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Not straps or plastic."), React.createElement("p", null, "Plastic devices, straps and emergency alternatives do not count.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "car",
    size: 26
  }), React.createElement("strong", null, "Pull fully off."), React.createElement("p", null, "Caltrans: wait until you can pull completely off the road to the right.")), React.createElement("li", null, React.createElement(EventIcon, {
    name: "id",
    size: 26
  }), React.createElement("strong", null, "Get a receipt."), React.createElement("p", null, "From any installer, with the badge number written on it.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "tc-routes",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHICH ROAD"), React.createElement("h2", null, "Highway 140 needs chains least often"), React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "tc-prose"
  }, React.createElement("p", null, "The Park Service says the El Portal Road, Highway 140 through the Merced River canyon, is lower in elevation and has chain requirements less often than the other entrance roads. Wawona Road (Highway 41), Big Oak Flat Road (Highway 120 from the west) and Badger Pass Road need chains more often than 140, the roads within Yosemite Valley and the Hetch Hetchy Road. Highway 140 is also the YARTS route that runs in winter, and the park's own suggestion for drivers without chains is to park at a YARTS stop on 140 outside the park and ride the bus in; there is a fare."), React.createElement("p", null, "Less often is not never, and the low road has its own trouble. When it closes, the detours are the higher roads; ", React.createElement("a", {
    href: "/articles/highway-140-closed-yosemite"
  }, "the Highway 140 closure guide"), " covers what has shut it and what that does to a winter trip. Tioga Road is usually closed by snow from sometime in November until late May or June, so there is no winter crossing of the Sierra through the park."), React.createElement("p", null, React.createElement("strong", null, "Check the morning you drive."), " For roads inside the park, call 209/372-0200, then 1, then 1. For state highways outside it, call the Caltrans Highway Information Network at 800/427-7623 or check Caltrans QuickMap, which shows chain controls and closures. The month-by-month picture, including what else closes, is in ", React.createElement("a", {
    href: "/articles/yosemite-in-winter"
  }, "the winter guide"), ", ", React.createElement("a", {
    href: "/articles/yosemite-in-november"
  }, "the November guide"), " and ", React.createElement("a", {
    href: "/articles/yosemite-in-december"
  }, "the December guide"), ".")), React.createElement("figure", {
    className: "tc-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/merced-canyon-road-cory-goehring.jpg",
    style: {
      aspectRatio: "2000 / 972"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "The Merced River canyon below Yosemite Valley, where Highway 140 runs into the park"
  }), React.createElement("figcaption", null, "The Merced River canyon, the Highway 140 approach, which the park says needs chains less often than the other roads in. Photo: Cory Goehring"))), React.createElement("table", {
    className: "tc-routes"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Road"), React.createElement("th", {
    scope: "col"
  }, "Chains"), React.createElement("th", {
    scope: "col"
  }, "Note"))), React.createElement("tbody", null, ROUTES.map(([road, chains, note]) => React.createElement("tr", {
    key: road
  }, React.createElement("th", {
    scope: "row"
  }, road), React.createElement("td", null, chains), React.createElement("td", null, note))))), React.createElement("div", {
    className: "tc-stay"
  }, React.createElement(LodgingCta, {
    destination: "Mariposa, California",
    heading: "Sleep on the low road",
    note: "A winter night in Mariposa puts you on Highway 140, the approach the park says needs chains least often, and on the YARTS route into the Valley. Check what is open for your dates.",
    list: "article_cta",
    slug: "yosemite-tire-chains",
    cta: "Search lodging in Mariposa →"
  }))), React.createElement("section", {
    className: "ff-band",
    id: "tc-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Yosemite tire chains, answered"), React.createElement("div", {
    className: "tc-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/tirechains.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Tire Chain Requirements, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/winterfaq.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Frequently Asked Questions about Visiting in Winter, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/conditions.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Current Conditions, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/ev-charging.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Electric Vehicle Charging, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://dot.ca.gov/travel/winter-driving-tips/chain-controls",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Chain Controls, Caltrans")), React.createElement("li", null, React.createElement("a", {
    href: "https://dot.ca.gov/travel/winter-driving-tips",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Winter Driving Tips, Caltrans")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.enterprise.com/en/help/faqs/rental-car-snow-chains.html",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Rental car snow chains, Enterprise"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap tc-end"
  }, React.createElement(AffiliateNote, null)));
};
