window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};
window.ARTICLE_BODIES["easy-hikes-yosemite-valley"] = function EasyHikesYosemiteValleyBody() {
  var TOC = [["#ez-compare", "The four, compared"], ["#ez-map", "Where they are"], ["#ez-lower-fall", "Lower Yosemite Fall"], ["#ez-cooks", "Cook's Meadow"], ["#ez-bridalveil", "Bridalveil Fall"], ["#ez-mirror", "Mirror Lake"], ["#ez-days", "A family day"], ["#ez-seasons", "Seasons"], ["#ez-questions", "Questions"]];
  var FAQ = [["What are the easiest hikes in Yosemite Valley?", "The Park Service rates four Valley walks easy or close to it: Bridalveil Fall, 0.5 mile round trip with about 80 feet of climb; Lower Yosemite Fall, a 1-mile loop with about 50 feet; Cook's Meadow, a flat 1-mile loop; and Mirror Lake, 2 miles round trip to the lake with 100 feet, rated easy to moderate."], ["Which Yosemite Valley trails are good for strollers?", "The Park Service allows strollers on the Lower Yosemite Fall loop, on the Cook's Meadow loop, and on the first paved mile of the Mirror Lake trail. Bridalveil Fall's page does not mention strollers; the paved trail has a wheelchair-accessible platform about halfway up, and the grade steepens beyond it."], ["How long does the Lower Yosemite Fall walk take?", "About 30 minutes for the 1-mile loop, by the Park Service's estimate. It starts at Valleywide shuttle stop 6. There is no parking at the trailhead; use the Yosemite Village or Yosemite Falls parking areas."], ["Does Mirror Lake have water in it?", "Only part of the year. The Park Service says Mirror Lake has little water much of the year and is fullest in spring and early summer, when snowmelt fills Tenaya Creek. The Yosemite Guide marks it dry in summer and fall."], ["Can you take the shuttle to Bridalveil Fall?", "No. The Park Service says shuttle service is not available to the Bridalveil Fall area. Drive to the Bridalveil Fall parking area on Wawona Road, which often fills quickly in summer, or park along Southside Drive and walk about 0.75 mile round trip."], ["Is Lower Yosemite Fall dry in fall?", "Often. The Park Service says the fall is often dry from late July or August through October. Bridalveil Fall flows year-round, so it is the surer waterfall walk late in the year."]];
  var WALKS = [["Bridalveil Fall", "#ez-bridalveil", "0.5 mi round trip", 0.5, "20 min", "About 80 ft", "Easy", "Not addressed; paved, steeper past the platform"], ["Lower Yosemite Fall", "#ez-lower-fall", "1 mi loop", 1, "30 min", "About 50 ft", "Easy", "Allowed"], ["Cook's Meadow", "#ez-cooks", "1 mi loop", 1, "30 min", "Flat", "Easy", "Allowed"], ["Mirror Lake, to the lake", "#ez-mirror", "2 mi round trip", 2, "1 hr", "100 ft", "Easy to moderate", "First paved mile only"], ["Mirror Lake, the loop", "#ez-mirror", "5 mi loop (4.5 in the Guide)", 5, "2 to 3 hr", "200 ft", "Easy to moderate", "No, past the paved mile"]];
  var BASICS = [{
    name: "Lower Yosemite Fall",
    start: "Shuttle stop 6",
    park: "Yosemite Village or Yosemite Falls lots",
    loo: "On the western trail, with a family restroom",
    water: "Fountain and bottle filler near the western restrooms"
  }, {
    name: "Cook's Meadow",
    start: "Shuttle stop 5, or cross the road from stop 6",
    park: "Yosemite Village or Yosemite Falls lots; a few spaces at Sentinel Bridge",
    loo: "None on the walk; at the visitor center or Lower Yosemite Fall",
    water: "None listed on the walk"
  }, {
    name: "Bridalveil Fall",
    start: "Bridalveil Fall parking area, Wawona Road. No shuttle",
    park: "Its own lot, which often fills in summer",
    loo: "In the parking area, with a family restroom",
    water: "None listed"
  }, {
    name: "Mirror Lake",
    start: "Shuttle stop 17",
    park: "None at the trailhead; nearest is Curry Village",
    loo: "Vault toilets at about 0.5 mile and at the lake",
    water: "None at the trailhead or on the trail"
  }];
  var MAP_W = 2560,
    MAP_H = 1000;
  var PINS = [{
    n: "1",
    at: [547, 878],
    name: "Bridalveil Fall, its lot on Wawona Road"
  }, {
    n: "2",
    at: [1528, 270],
    name: "Lower Yosemite Fall, shuttle stop 6"
  }, {
    n: "3",
    at: [1672, 268],
    name: "Cook's Meadow, from stop 5 or 6"
  }, {
    n: "4",
    at: [2265, 232],
    name: "Mirror Lake, from shuttle stop 17"
  }, {
    n: "A",
    at: [2090, 590],
    name: "Happy Isles, stop 16, for the Vernal Fall footbridge",
    side: true
  }];
  var pct = (x, y) => ({
    left: x / MAP_W * 100 + "%",
    top: y / MAP_H * 100 + "%"
  });
  var DAYS = [{
    name: "One stop, two walks",
    miles: "2 miles",
    text: "Ride to stop 6. Walk the Lower Yosemite Fall loop, then cross the road into Cook's Meadow and walk its loop. Restrooms and water are on the fall's western trail."
  }, {
    name: "The waterfall morning",
    miles: "1.5 miles",
    text: "Bridalveil Fall first, by car, before its lot fills. Then park at Yosemite Falls or Yosemite Village for the Lower Yosemite Fall loop."
  }, {
    name: "The long one",
    miles: "2 miles",
    text: "Shuttle to stop 17 and walk the paved road to Mirror Lake and back. Strollers and bikes are allowed on the paved mile. Carry all the water you need."
  }];
  var SEASONS = [{
    when: "Spring and early summer",
    name: "Everything is running",
    cls: "is-peak",
    text: "Both falls at full flow and Mirror Lake at its fullest. Expect spray, and at Bridalveil it can stop you short of the end of the trail."
  }, {
    when: "Late July or August to October",
    name: "The dry stretch",
    cls: "is-mid",
    text: "Lower Yosemite Fall is often dry and the Guide marks Mirror Lake dry. Bridalveil Fall flows year-round, so it is the surer waterfall."
  }, {
    when: "Winter",
    name: "Ice on the pavement",
    cls: "is-late",
    text: "Icy patches on the climb to the Lower Yosemite Fall footbridge, very slick conditions at Bridalveil, slippery boardwalk at Cook's Meadow."
  }];
  return React.createElement("div", {
    className: "ez-feature"
  }, React.createElement("div", {
    className: "hp-wrap"
  }, React.createElement("dl", {
    className: "ff-facts"
  }, React.createElement("div", null, React.createElement(EventIcon, {
    name: "walk"
  }), React.createElement("dt", null, "Shortest"), React.createElement("dd", null, "Bridalveil Fall, 0.5 mile round trip")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "drop"
  }), React.createElement("dt", null, "The classic"), React.createElement("dd", null, "Lower Yosemite Fall, a 1-mile loop")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "lake"
  }), React.createElement("dt", null, "Longest"), React.createElement("dd", null, "Mirror Lake, 2 miles to the lake and back")), React.createElement("div", null, React.createElement(EventIcon, {
    name: "route"
  }), React.createElement("dt", null, "Getting there"), React.createElement("dd", null, "Free shuttle, 7 am to 10 pm, all year"))), React.createElement("nav", {
    className: "ff-toc",
    "aria-label": "On this page"
  }, React.createElement("span", null, "On this page"), TOC.map(([href, label]) => React.createElement("a", {
    key: href,
    href: href
  }, label)))), React.createElement("section", {
    className: "hp-wrap hp-section ez-open"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "Four walks on the floor of Yosemite Valley carry the Park Service's easy rating, or close to it, and between them they reach the base of two waterfalls, the middle of the Valley's best-known meadow and a seasonal lake under Half Dome. The shortest is half a mile. The longest is two miles if you turn around at the lake. Three of them start at a free shuttle stop."), React.createElement("p", null, "This page measures them for a family: the distance, the Park Service's time estimate, the climb, what a stroller is allowed to do, where the toilets and the drinking water are, and how to fit two or three into a day without a car. If nobody in your group wants to walk at all, ", React.createElement("a", {
    href: "/articles/yosemite-for-non-hikers"
  }, "Yosemite for non-hikers"), " is the better guide; it builds the day around the roadside views."), React.createElement("p", null, "Distances, times and rules here come from the Park Service's trail pages and the current Yosemite Guide. Trails close for ice, rockfall and repair. Check the park's conditions page on the morning you go.")), React.createElement("aside", {
    className: "ff-short",
    "aria-label": "The short version"
  }, React.createElement("p", {
    className: "ff-short__head"
  }, React.createElement(EventIcon, {
    name: "check"
  }), " The short version"), React.createElement("ul", null, React.createElement("li", null, "Under an hour: Bridalveil Fall, Lower Yosemite Fall or Cook's Meadow."), React.createElement("li", null, "Lower Yosemite Fall and Cook's Meadow share shuttle stop 6. Do both for 2 miles."), React.createElement("li", null, "No shuttle goes to Bridalveil Fall. Drive, early in summer."), React.createElement("li", null, "Mirror Lake has no drinking water and is dry by late summer.")), React.createElement("a", {
    className: "ez-short__link",
    href: "#ez-compare"
  }, "The four, side by side ↓")))), React.createElement("section", {
    className: "ff-band",
    id: "ez-compare",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "THE FOUR, COMPARED"), React.createElement("h2", null, "How far, how long, how much climb"), React.createElement("div", {
    className: "ez-prose ez-lede"
  }, React.createElement("p", null, "The bars are drawn to one scale: the full track is 5 miles, and each tick is a mile. Times are the Park Service's estimates for walking the trail, not for stopping at the bottom of a waterfall with a five-year-old, so add for that. The rating column is the one on the Park Service's ", React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/valleyhikes.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Valley day-hikes table"), ".")), React.createElement("ul", {
    className: "ez-walks"
  }, WALKS.map(([name, href, dist, miles, time, climb, rating, stroller]) => React.createElement("li", {
    key: name
  }, React.createElement("div", {
    className: "ez-walks__name"
  }, React.createElement("strong", null, React.createElement("a", {
    href: href
  }, name)), React.createElement("span", null, dist)), React.createElement("div", {
    className: "ez-walks__bar",
    "aria-hidden": "true"
  }, React.createElement("i", {
    style: {
      width: miles / 5 * 100 + "%"
    }
  })), React.createElement("dl", {
    className: "ez-walks__facts"
  }, React.createElement("div", null, React.createElement("dt", null, "Time"), React.createElement("dd", null, time)), React.createElement("div", null, React.createElement("dt", null, "Climb"), React.createElement("dd", null, climb)), React.createElement("div", null, React.createElement("dt", null, "Rating"), React.createElement("dd", null, rating)), React.createElement("div", null, React.createElement("dt", null, "Stroller"), React.createElement("dd", null, stroller)))))), React.createElement("h3", {
    className: "ez-sub"
  }, "Where each one starts, and what is there"), React.createElement("div", {
    className: "ez-basics",
    role: "region",
    tabIndex: 0,
    "aria-label": "Trailheads, parking, restrooms and water for each walk"
  }, React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
    scope: "col"
  }, "Walk"), React.createElement("th", {
    scope: "col"
  }, "Start"), React.createElement("th", {
    scope: "col"
  }, "Parking"), React.createElement("th", {
    scope: "col"
  }, "Restrooms"), React.createElement("th", {
    scope: "col"
  }, "Water"))), React.createElement("tbody", null, BASICS.map(b => React.createElement("tr", {
    key: b.name
  }, React.createElement("th", {
    scope: "row"
  }, b.name), React.createElement("td", null, b.start), React.createElement("td", null, b.park), React.createElement("td", null, b.loo), React.createElement("td", null, b.water)))))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ez-map",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "WHERE THEY ARE"), React.createElement("h2", null, "Three on the shuttle, one by car"), React.createElement("figure", {
    className: "ez-map"
  }, React.createElement("div", {
    className: "ez-map__scroll",
    role: "region",
    tabIndex: 0,
    "aria-label": "Map of Yosemite Valley. On a phone it scrolls sideways."
  }, React.createElement("div", {
    className: "ez-map__frame"
  }, React.createElement(ResponsiveImage, {
    image: "img/nps-yosemite-valley-map.jpg",
    className: "ez-map__img",
    sizes: "(max-width: 1100px) 980px, 1240px",
    style: {
      aspectRatio: "2560 / 1000"
    },
    alt: "National Park Service map of Yosemite Valley from Tunnel View on the west to Happy Isles on the east. Four walks are numbered: Bridalveil Fall at the west end off Wawona Road, Lower Yosemite Fall and Cook's Meadow in the middle of the Valley near Yosemite Village, and Mirror Lake at the east end below Half Dome. Happy Isles is marked as a side trip."
  }), React.createElement("div", {
    className: "ez-map__layer",
    "aria-hidden": "true"
  }, PINS.map(p => React.createElement("span", {
    key: p.n,
    className: "ez-pin" + (p.side ? " is-side" : ""),
    style: pct(p.at[0], p.at[1])
  }, React.createElement("b", null, p.n)))))), React.createElement("figcaption", null, React.createElement("ol", {
    className: "ez-map__key"
  }, PINS.map(p => React.createElement("li", {
    key: p.n,
    className: p.side ? "is-side" : undefined
  }, React.createElement("b", null, p.n), " ", p.name))), React.createElement("span", {
    className: "ez-map__note"
  }, "Pins are approximate. Swipe the map sideways on a phone. Map: National Park Service (public domain)."))), React.createElement("div", {
    className: "ff-split ez-after-map"
  }, React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, "The free Valley shuttle runs daily, all year, from 7 am to 10 pm, the Guide says. The Park Service's transit page puts the Valleywide buses 12 to 22 minutes apart and the East Valley buses 8 to 12 minutes apart, and the park describes the shuttle as fully accessible. Lower Yosemite Fall is stop 6, Cook's Meadow starts at stop 5 or across the road from stop 6, and Mirror Lake is stop 17. ", React.createElement("a", {
    href: "/articles/yosemite-shuttle-and-yarts"
  }, "The shuttle guide"), " covers the routes in full."), React.createElement("p", null, "Bridalveil Fall is the exception: the Park Service says no shuttle serves it. It sits at the west end of the Valley, beside Wawona Road, and you pass it driving in on Highway 41. For where to leave the car for the other three, ", React.createElement("a", {
    href: "/articles/yosemite-valley-parking-guide"
  }, "the Valley parking guide"), " has the lots and when they fill.")), React.createElement("p", {
    className: "ff-alert ez-alert"
  }, React.createElement(EventIcon, {
    name: "car"
  }), React.createElement("span", null, React.createElement("strong", null, "Park once."), " None of the three shuttle walks has parking at its trailhead. The Guide's advice is to find a space in one of the three hubs, Curry Village, Yosemite Village or Yosemite Falls, keep it, and walk, bike or ride from there.")))), React.createElement("section", {
    className: "ff-band",
    id: "ez-lower-fall",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "1 MILE LOOP · 30 MINUTES · ABOUT 50 FEET"), React.createElement("h2", null, "Lower Yosemite Fall"), React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, "The obvious first walk, and the one the Park Service rates easy: a paved 1-mile loop with about 50 feet of climb to the base of the lower fall, about 30 minutes. It starts at shuttle stop 6. There is no parking at the trailhead; the Yosemite Village and Yosemite Falls lots are the nearest. You can also walk the bike path from the Valley Visitor Center, which adds about half a mile."), React.createElement("p", null, React.createElement("strong", null, "Two legs, not one."), " The east side of the loop, 0.6 mile one way from the shuttle stop, is wheelchair accessible when it is clear of ice and snow, and it crosses several braided streams before the viewing area. The west side is about 0.5 mile one way and mostly accessible, but its last 180 feet climb at a 13.8 percent grade near the viewing area. Halfway along the west side is a bronze relief model of the Yosemite Falls area that children can put their hands on."), React.createElement("p", null, React.createElement("strong", null, "For a family."), " Strollers and leashed pets are allowed; bikes are not, and there are racks nearby. The restrooms are on the western trail only, across from Yosemite Valley Lodge, and include an accessible family restroom. A drinking fountain and a bottle filling station are nearby. There is no other water on the loop."), React.createElement("p", null, React.createElement("strong", null, "The rule that matters."), " Stay on the pavement and behind the barriers. The Park Service says the rocks above the footbridge are slippery even when dry, and scrambling off the trail has caused serious injuries. The ", React.createElement("a", {
    href: "/articles/yosemite-accessibility-guide"
  }, "accessibility guide"), " has more on the east leg for a wheelchair."))), React.createElement("figure", {
    className: "ez-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/lower-yosemite-fall-footbridge.jpg",
    style: {
      aspectRatio: "1600 / 1064"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Lower Yosemite Fall seen from the paved loop trail near the footbridge"
  }), React.createElement("figcaption", null, "Lower Yosemite Fall from the loop. The Park Service says it is often dry from late July or August through October. Photo: James St. John / Wikimedia Commons (CC BY 2.0)")))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ez-cooks",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "1 MILE LOOP · 30 MINUTES · FLAT"), React.createElement("h2", null, "Cook's Meadow"), React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, "The flattest of the four: a 1-mile loop of pavement and boardwalk across the meadow in the middle of the Valley, about 30 minutes, with Yosemite Falls, Half Dome and the Merced River in view. The Park Service starts it at the Valley Visitor Center, shuttle stop 5; from stop 6 you cross the road into the meadow. Parking is at Yosemite Village and Yosemite Falls, and the Sentinel Bridge area has a few spaces and works as a midpoint."), React.createElement("p", null, React.createElement("strong", null, "For a family."), " It is wheelchair accessible when not covered in snow, and strollers, leashed pets and bikes are all allowed; the Park Service asks that everyone stay on the path. There are no restrooms along the walk. Use the ones at the visitor center or at Lower Yosemite Fall before you start."), React.createElement("p", null, React.createElement("strong", null, "What to look for."), " The Guide says to look and listen for birds and other wildlife in early morning and around dusk. Keep food within arm's reach, the Park Service says, and do not feed anything. In wet weather, frost or snow, the boardwalk is slippery."), React.createElement("p", null, "Because it shares stop 6 with Lower Yosemite Fall, this is the second half of the easiest two-walk outing in the park, below."))), React.createElement("figure", {
    className: "ez-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/half-dome-meadow-deer-johannes-andersson.jpg",
    style: {
      aspectRatio: "3 / 4"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Mule deer grazing in a Yosemite Valley meadow below Half Dome"
  }), React.createElement("figcaption", null, "Deer in a Valley meadow below Half Dome. Early morning and dusk are the hours the Guide gives for wildlife on the Cook's Meadow loop. Photo: Johannes Andersson / Unsplash")))), React.createElement("section", {
    className: "ff-band",
    id: "ez-bridalveil",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "0.5 MILE ROUND TRIP · 20 MINUTES · ABOUT 80 FEET"), React.createElement("h2", null, "Bridalveil Fall"), React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, "The shortest of the four: 0.5 mile round trip from the Bridalveil Fall parking area on Wawona Road, about 80 feet of climb, about 20 minutes. The other way in is from roadside parking on Southside Drive, on a paved trail that follows the old carriage road, about 0.75 mile round trip with a gentle incline. The Park Service finished a rehabilitation of the area in fall 2024, aimed at restrooms, parking congestion and an accessible path to the viewing platform."), React.createElement("p", null, React.createElement("strong", null, "No shuttle."), " The Park Service says shuttle service is not available to the Bridalveil Fall area, and the parking area often fills quickly in summer. Come early, or stop on the way into the Valley."), React.createElement("p", null, React.createElement("strong", null, "For a family."), " The restrooms are in the parking area, and they include a family restroom. A wheelchair-accessible viewing platform sits about halfway up from the main lot; past it, the trail is still paved but steeper and not wheelchair accessible. The Park Service's trail page does not address strollers, so plan on pushing one up a grade or leaving it at the platform. Leashed pets are allowed."), React.createElement("p", null, React.createElement("strong", null, "Expect to get wet."), " The fall runs all year, and in spring and early summer the Park Service says the spray can be so strong you cannot easily reach the end of the trail. The rocks above the platform are slippery even when dry; stay behind the barriers. In winter, expect ice."))), React.createElement("div", null, React.createElement("ol", {
    className: "ff-hours ez-sched"
  }, React.createElement("li", {
    className: "is-glow"
  }, React.createElement("span", null, "From the Wawona Road lot"), React.createElement("p", null, "0.5 mile round trip, gentle incline. Restrooms in the lot.")), React.createElement("li", null, React.createElement("span", null, "From Southside Drive"), React.createElement("p", null, "About 0.75 mile round trip, on the old carriage road.")), React.createElement("li", null, React.createElement("span", null, "Halfway up"), React.createElement("p", null, "The wheelchair-accessible viewing platform.")), React.createElement("li", null, React.createElement("span", null, "Past the platform"), React.createElement("p", null, "Paved, steeper, not wheelchair accessible."))), React.createElement("p", {
    className: "ff-alert ez-alert"
  }, React.createElement(EventIcon, {
    name: "no"
  }), React.createElement("span", null, React.createElement("strong", null, "No shuttle to Bridalveil."), " It is the one walk on this page you have to drive to, and its lot often fills in summer.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ez-mirror",
    tabIndex: -1
  }, React.createElement("div", {
    className: "ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "2 MILES ROUND TRIP · 1 HOUR · 100 FEET"), React.createElement("h2", null, "Mirror Lake"), React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, "The longest of the four, and the only one the Park Service rates easy to moderate. From shuttle stop 17 it is 2 miles round trip on a paved road to the lake, about 100 feet of climb, about an hour. The Valleywide and East Valley shuttles both stop there. There is no parking at the trailhead; the nearest is at Curry Village. Vehicles with a valid disability placard may drive the paved road to the front of the lake, the Guide says."), React.createElement("p", null, React.createElement("strong", null, "The loop."), " Past the lake an unpaved trail circles it: 5 miles and 200 feet of climb on the Park Service's trail page, 4.5 miles in the current Guide, either way 2 to 3 hours. The south side is slick in winter and early spring, and the creek crossings that look easy can sweep a hiker into whitewater when the water is high. With small children, the lake is the turnaround."), React.createElement("p", null, React.createElement("strong", null, "For a family."), " Strollers, bikes and leashed pets are allowed on the first paved mile only. You can ride a bike to the end of the pavement and walk from there. Vault toilets are about half a mile in and at the lake, and there are no others. There is no drinking water at the trailhead or on the trail, so fill bottles before you get on the shuttle."), React.createElement("p", null, React.createElement("strong", null, "When there is a lake."), " The Park Service says Mirror Lake has little water much of the year and is fullest in spring and early summer, when snowmelt fills Tenaya Creek. The Guide marks it dry in summer and fall. Late in the year it is a walk to a sandy meadow under Half Dome, which children may like just as well."))), React.createElement("figure", {
    className: "ez-photo"
  }, React.createElement(ResponsiveImage, {
    image: "img/mirror-lake-mount-watkins.jpg",
    style: {
      aspectRatio: "1600 / 1068"
    },
    sizes: "(max-width: 880px) calc(100vw - 40px), 560px",
    alt: "Mount Watkins reflected in the still water of Mirror Lake"
  }), React.createElement("figcaption", null, "Mirror Lake in spring, with Mount Watkins in the water. By late summer the lake is mostly gone. Photo: Mutineer / Wikimedia Commons (CC0)")))), React.createElement("section", {
    className: "ff-band",
    id: "ez-days",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "A FAMILY DAY"), React.createElement("h2", null, "Two or three walks, one parking space"), React.createElement("ol", {
    className: "ez-days"
  }, DAYS.map(d => React.createElement("li", {
    key: d.name
  }, React.createElement("span", null, d.miles), React.createElement("strong", null, d.name), React.createElement("p", null, d.text)))), React.createElement("div", {
    className: "ff-split ez-days__prose"
  }, React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "The easiest pairing."), " Lower Yosemite Fall and Cook's Meadow both work from shuttle stop 6, and the two loops add up to 2 miles. Do the fall first, use the restrooms and the water on its western trail, then cross the road for the meadow, which has neither."), React.createElement("p", null, React.createElement("strong", null, "All four in a day"), " is 4.5 miles of walking if you turn around at Mirror Lake, plus a drive to Bridalveil Fall. It is possible, but with young children two is a full day once you count the shuttle waits and the time spent at the bottom of each fall."), React.createElement("p", null, React.createElement("strong", null, "The Junior Ranger badge."), " The handbook is free at every park visitor center, for ages 4 to 12. To earn the badge, a child completes the activities, attends a ranger-led program and shows the booklet to a ranger at a visitor center. For this edition the Guide lists a ranger Discovery Walk, an easy walk at 10:30 am on Tuesday, Wednesday, Thursday and Saturday from the museum in Yosemite Village (stop 5), and a 15-minute family talk, Yosemite Nature in a Nutshell, at 2 pm daily at the Welcome Center (stop 2). Programs change with each Guide, so check the current one; ", React.createElement("a", {
    href: "/articles/yosemite-ranger-programs"
  }, "the ranger programs guide"), " covers the rest. For a full family itinerary with the food and the bears, see ", React.createElement("a", {
    href: "/articles/yosemite-with-kids-no-reservations-2026"
  }, "Yosemite with kids"), "."), React.createElement("p", null, React.createElement("strong", null, "One step up."), " When the four are not enough, the next walk is the first stretch of the Mist Trail to the Vernal Fall footbridge: 1.6 miles round trip from Happy Isles, shuttle stop 16, with 400 feet of climb and 1 to 1.5 hours by the Park Service's estimate. That is real uphill, eight times the climb of Lower Yosemite Fall. ", React.createElement("a", {
    href: "/articles/mist-trail-the-real-guide"
  }, "The Mist Trail guide"), " has the turnarounds.")), React.createElement("ul", {
    className: "ff-rules ez-pack"
  }, React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "drop",
    size: 26
  }), React.createElement("strong", null, "Fill bottles at the fall."), React.createElement("p", null, "Lower Yosemite Fall's western trail has a fountain and a bottle filler. Mirror Lake has no water at all.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "users",
    size: 26
  }), React.createElement("strong", null, "Use the family restrooms."), React.createElement("p", null, "At the Lower Yosemite Fall trailhead and in the Bridalveil Fall lot.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "no",
    size: 26
  }), React.createElement("strong", null, "Stay off the wet rock."), React.createElement("p", null, "At both falls the rocks above the viewing area are slippery even when dry.")), React.createElement("li", {
    className: "is-exception"
  }, React.createElement(EventIcon, {
    name: "food",
    size: 26
  }), React.createElement("strong", null, "Food within arm's reach."), React.createElement("p", null, "The Park Service's rule on the meadow loop, and everywhere else.")))))), React.createElement("section", {
    className: "hp-wrap hp-section",
    id: "ez-seasons",
    tabIndex: -1
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SEASONS"), React.createElement("h2", null, "The trails are open all year. The water is not."), React.createElement("ol", {
    className: "ez-seasons"
  }, SEASONS.map(s => React.createElement("li", {
    key: s.name,
    className: s.cls
  }, React.createElement("span", null, s.when), React.createElement("strong", null, s.name), React.createElement("p", null, s.text)))), React.createElement("div", {
    className: "ff-split ez-when"
  }, React.createElement("div", {
    className: "ez-prose"
  }, React.createElement("p", null, React.createElement("strong", null, "Spring and early summer."), " Everything is running. The Park Service says to expect to get wet at both falls, and Mirror Lake is at its fullest. ", React.createElement("a", {
    href: "/articles/yosemite-waterfalls-guide"
  }, "The waterfalls guide"), " explains why the flow peaks when it does and how to read the year's snowpack."), React.createElement("p", null, React.createElement("strong", null, "Late summer and fall."), " Lower Yosemite Fall is often dry from late July or August through October, and the Guide marks both it and Mirror Lake dry in summer and fall. The walks are still worth doing for the granite and the shade, but if the waterfall is the point, Bridalveil Fall flows year-round."), React.createElement("p", null, React.createElement("strong", null, "Winter."), " Lower Yosemite Fall and Cook's Meadow are open all year, and Bridalveil Fall is reachable all year. Expect ice on the short climb to the Lower Yosemite Fall footbridge, very slick conditions at Bridalveil, slippery boardwalk at Cook's Meadow and a slick south side on the Mirror Lake loop. ", React.createElement("a", {
    href: "/articles/yosemite-winter-hikes"
  }, "The winter hikes guide"), " covers which other trails stay open and what to put on your shoes.")), React.createElement("div", {
    className: "ez-stay"
  }, React.createElement(LodgingCta, {
    destination: "Yosemite National Park",
    heading: "Sleep close to the shuttle",
    note: "Three of these walks start at a Valley shuttle stop, so a bed in the Valley turns the day into a car-free one. Yosemite Valley Lodge sits across the road from the Lower Yosemite Fall restrooms and books through Yosemite Hospitality, as does Curry Village, the nearest parking to the Mirror Lake trailhead. When the park is full, a search shows what is left within driving distance.",
    list: "article_cta",
    slug: "easy-hikes-yosemite-valley",
    cta: "Search lodging around Yosemite →"
  })))), React.createElement("section", {
    className: "ff-band",
    id: "ez-questions",
    tabIndex: -1
  }, React.createElement("div", {
    className: "hp-wrap hp-section ff-split"
  }, React.createElement("div", null, React.createElement("p", {
    className: "hp-eyebrow"
  }, "QUESTIONS"), React.createElement("h2", null, "Easy Valley hikes, answered"), React.createElement("div", {
    className: "ez-sources"
  }, React.createElement("h3", null, "Sources"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/valleyhikes.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Valley Day Hikes, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/lowerfalltrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lower Yosemite Fall Trail, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/lower-yosemite-fall-trailhead.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lower Yosemite Fall Trailhead, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/cooksmeadowtrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Cook's Meadow Loop, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/bridalveilfalltrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bridalveil Fall Trail, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/places/000/bridalveil-fall.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bridalveil Fall, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/getinvolved/bridalveilea.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Bridalveil Fall Rehabilitation Project, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/mirrorlaketrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mirror Lake Trail, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/vernalnevadatrail.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Vernal and Nevada Fall Trails, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/publictransportation.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Public transportation, NPS Yosemite")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/thingstodo/becomejrranger.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Become a Yosemite Junior Ranger, NPS")), React.createElement("li", null, React.createElement("a", {
    href: "https://www.nps.gov/yose/planyourvisit/guide.htm",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Yosemite Guide, September 23 to November 24, 2026, NPS"))))), React.createElement("div", {
    className: "ff-faq"
  }, FAQ.map(([q, a], i) => React.createElement("details", {
    key: q,
    open: i < 2
  }, React.createElement("summary", null, q), React.createElement("p", null, a)))))), React.createElement("div", {
    className: "hp-wrap ez-end"
  }, React.createElement(AffiliateNote, null)));
};
