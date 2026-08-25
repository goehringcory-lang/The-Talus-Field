/* global React, Placeholder, MotifMountains, AffiliateNote, AvailabilityLink, LodgingCta */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Per-town availability links (MONETIZATION-IDEAS.md 3.1): Expedia hotel
// searches through the shared AvailabilityLink, which owns the rel and
// data-aff-* markup. `dest` is plain text; AvailabilityLink encodes it. The
// recommendations above each link do not depend on any program's catalog; if
// the best option in a town has no program, it stays the recommendation,
// linkless.
function townAvailability(town, dest) {
  return (
    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-3)" }}>
      Current rates and availability:{" "}
      <AvailabilityLink
        destination={dest}
        list="article_town"
        slug="yosemite-gateway-towns-compared"
        name={town + " lodging search"}
      >{town} lodging →</AvailabilityLink>
    </p>
  );
}

window.ARTICLE_BODIES["yosemite-gateway-towns-compared"] = function YosemiteGatewayTownsComparedBody() {
  return (
    <>
      <p className="dropcap">
        The decision about which gateway town to base yourself in for a Yosemite trip is more important than most planning guides admit. The five main gateway communities, <strong>El Portal, Mariposa, Oakhurst, Groveland, and Lee Vining</strong>, are not interchangeable. They sit on different sides of the park, vary in distance from the Valley by an hour or more, have different lodging cultures, and serve different kinds of trips. Picking the wrong one will cost you significant time and friction over the course of your visit. Picking the right one will make every day of your trip easier.
      </p>

      <p>
        I've stayed in all of them. I've watched first-time visitors make this decision well, and I've watched them make it badly. Here's what I'd tell you if you asked me which to pick.
      </p>

      <h2 id="sec-0-the-geography-you-actually-need-to-know">The geography you actually need to know</h2>

      <p>
        Yosemite has four entrance stations on the through-road system. They sit at the cardinal points of the park, more or less, and each gateway town is associated with one of them. A fifth, the Hetch Hetchy entrance, is a dead end into one valley and serves no through route.
      </p>

      <ul>
        <li><strong>Arch Rock Entrance</strong> is on Highway 140, on the west side, the most direct route to Yosemite Valley. <strong>El Portal</strong> is the gateway town, with <strong>Mariposa</strong> further west.</li>
        <li><strong>Big Oak Flat Entrance</strong> is on Highway 120, on the northwest side. <strong>Groveland</strong> is the gateway town.</li>
        <li><strong>South Entrance</strong> is on Highway 41, on the southwest side, the route to Wawona and Mariposa Grove. <strong>Oakhurst</strong> is the gateway town.</li>
        <li><strong>Tioga Pass Entrance</strong> is on Highway 120 East, on the east side, only open in summer. <strong>Lee Vining</strong> is the gateway town.</li>
      </ul>

      <p>
        The crucial fact is that <strong>the four routes are not equal in either distance or character</strong>. The Highway 140 route from Mariposa is the lowest-elevation, most reliable, year-round route into the Valley. The Highway 41 route from Oakhurst is longer, climbs and descends more, and brings you in via Wawona. The Highway 120 route from Groveland is also higher elevation and takes you across the Big Oak Flat road. The Tioga Pass route is closed half the year and only practical when you're coming from the east.
      </p>

      <p>
        If your trip is mostly Yosemite Valley, the right answer is almost always Mariposa or El Portal. If your trip includes the Mariposa Grove of giant sequoias and Wawona, Oakhurst becomes more attractive. If you're combining Yosemite with Mono Lake or Death Valley, Lee Vining is a great east-side base.
      </p>

      <p>The whole comparison, in one view:</p>

      <table>
        <thead>
          <tr><th>Town</th><th>Drive to the Valley</th><th>Highway</th><th>Elevation</th><th>Best for</th></tr>
        </thead>
        <tbody>
          <tr><td>El Portal</td><td>25 to 35 min</td><td>140, year-round</td><td>about 1,900 ft</td><td>Sunrise starts, the shortest drive</td></tr>
          <tr><td>Mariposa</td><td>45 to 60 min</td><td>140, year-round</td><td>about 2,000 ft</td><td>Most first-timers, families, winter</td></tr>
          <tr><td>Groveland</td><td>65 to 80 min</td><td>120, chains common in winter</td><td>about 3,100 ft</td><td>Character, Hetch Hetchy, Bay Area route</td></tr>
          <tr><td>Oakhurst</td><td>75 to 90 min</td><td>41, year-round</td><td>about 2,300 ft</td><td>Wawona and the Mariposa Grove</td></tr>
          <tr><td>Lee Vining</td><td>90+ min, summer only</td><td>120 East over Tioga Pass</td><td>about 6,800 ft</td><td>The high country and Mono Lake</td></tr>
        </tbody>
      </table>

      <p>
        The elevation column is not trivia. It is the best single predictor of whether you will be putting chains on in February. El Portal and Mariposa sit low enough that winter storms usually arrive as rain. Groveland is a thousand feet higher and gets chain controls that the Highway 140 towns do not. Lee Vining is at 6,800 feet and its road into the park is shut for roughly half the year.
      </p>

      <p>
        Every drive time on this page, plus the legs the table does not cover
        (Oakhurst to the South Entrance, Groveland to Big Oak Flat, Lee Vining
        to Tuolumne Meadows), is collected on <a href="/distances">the drive
        times page</a> if you want to compare two towns at a glance.
      </p>

      <p>If you want the answer before the detail, it is one of these five:</p>

      <ul>
        <li><strong>Pick El Portal if</strong> the drive is the thing you most want to shorten, you are chasing first light in the Valley, or you are visiting in winter and want the lowest, most reliable road.</li>
        <li><strong>Pick Mariposa if</strong> you want a real town at the end of the day, more than one price point to choose from, and a year-round road. This is the default answer for a first Yosemite trip.</li>
        <li><strong>Pick Groveland if</strong> you are coming from the Bay Area, you want a smaller and cheaper town with more character than Oakhurst, or Hetch Hetchy and the north end of the park are on your list.</li>
        <li><strong>Pick Oakhurst if</strong> the Mariposa Grove and Wawona are the point of the trip, you are driving up from Los Angeles or Fresno, or you want predictable chain lodging and a full-size supermarket.</li>
        <li><strong>Pick Lee Vining if</strong> Tioga Road is open and the high country is the trip. It is not a Valley base and choosing it as one is the single most common mistake on this list.</li>
      </ul>

      <p>Now the towns themselves.</p>

      <h2 id="sec-1-el-portal">El Portal</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 14 miles, 25 to 35 minutes.<br />
        <strong>Entrance served:</strong> Arch Rock, a few miles up the road.<br />
        <strong>Elevation:</strong> about 1,900 feet, the lowest of the five.<br />
        <strong>Highway access:</strong> 140, year-round.<br />
        <strong>Character:</strong> essentially a small park-adjacent settlement.
      </p>

      <p>
        One caveat on every drive time in this article, including that one: Yosemite Valley is about seven miles long. A time quoted to the Valley means the west end, near Bridalveil Fall and Valley View. Curry Village and the trailheads at the east end are another fifteen or twenty minutes past that, plus whatever the parking situation adds. Budget for the end of the Valley you actually want, not for the sign that says you have entered it.
      </p>

      <Placeholder
        caption="Highway 140 following the Merced River canyon toward the Arch Rock entrance, the road every El Portal morning starts on"
        image="img/merced-canyon-road-cory-goehring.jpg"
        credit="Photo: Cory Goehring"
        tag="PLATE I"
        size="lg"
        style={{ aspectRatio: "16 / 10", margin: "32px 0" }}
        motif={<MotifMountains />}
      />

      <p>
        El Portal is the closest gateway town to the Valley by a significant margin. It exists because of Yosemite. It has a handful of lodges (the Yosemite View Lodge, the Cedar Lodge, others) along Highway 140 right next to the Merced River, a 24-hour gas station, a small market, and not much else. The lodging tends to be priced like in-park lodging because the location is so good.
      </p>

      <p>The advantages of El Portal:</p>
      <ul>
        <li>The shortest possible drive to anywhere in Yosemite Valley. You can roll out of bed at 5:30 a.m. and be at Tunnel View by 6:15.</li>
        <li>The drive itself, along the Merced River canyon, is one of the most beautiful approach drives to any national park. The river canyon in spring with high water and wildflowers is its own attraction.</li>
        <li>Year-round road access. Highway 140 is the lowest-elevation entry to the park and is the most reliable in winter.</li>
      </ul>

      <p>The disadvantages:</p>
      <ul>
        <li>Limited dining and shopping. You're going to drive to Mariposa for variety.</li>
        <li>Limited lodging inventory means it books up early and stays expensive in summer.</li>
        <li>The lodges along the river have river noise. This is a feature for some people and a bug for others.</li>
      </ul>

      <p>
        <strong>Services:</strong> the gas station and market in El Portal are the last fuel you will pass on Highway 140 before the entrance station, and they matter more than they look, because there is no gas station anywhere in Yosemite Valley. The in-park pumps are at Crane Flat and Wawona, both well off the Valley floor. Groceries here are convenience-store groceries. Buy the week's food in Mariposa on the way in.
      </p>

      <p>
        <strong>Who should pick El Portal:</strong> anyone whose top priority is being inside the park as much as possible, especially for sunrise photography, peak-period crowd avoidance, or a short trip with lots of Valley-focused itinerary. Also a strong choice for any winter trip where road reliability matters.
      </p>

      <p>
        <strong>Who should not:</strong> anyone who wants a choice of dinner, anyone booking late in summer, and anyone travelling with people who will be back at the room by mid-afternoon. There is very little to do in El Portal that is not the park.
      </p>

      {townAvailability("El Portal", "El Portal, California")}

      <h2 id="sec-2-mariposa">Mariposa</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 45 miles, 45 minutes to an hour.<br />
        <strong>Entrance served:</strong> Arch Rock, via El Portal.<br />
        <strong>Elevation:</strong> about 2,000 feet.<br />
        <strong>Highway access:</strong> 140, year-round.<br />
        <strong>Character:</strong> historic gold-rush town, the regional county seat, the largest gateway by amenities.
      </p>

      <p>
        Mariposa is the most full-service of the western gateway towns. It has a real downtown with restaurants, bars, coffee shops, a couple of bookstores, the Mariposa Museum and History Center (genuinely worth a visit), the historic Mariposa County Courthouse (the oldest continuously operating courthouse west of the Rockies, built in 1854), and a wide range of lodging from chain hotels on the highway to historic bed-and-breakfasts in town. It's also where a lot of <a href="/articles/working-in-yosemite">people who work in the park</a> end up when they age out of in-park staff housing.
      </p>

      <p>The advantages:</p>
      <ul>
        <li>Real food. Real coffee. Multiple grocery stores. A real town.</li>
        <li>A wide range of lodging price points, from budget motel to upscale country inn.</li>
        <li>A historic downtown that's worth an evening on its own merits.</li>
        <li>Year-round access via Highway 140.</li>
        <li>The drive into the park is the same beautiful Merced River canyon route as El Portal, just longer.</li>
      </ul>

      <p>The disadvantages:</p>
      <ul>
        <li>The 45-minute drive each way adds up. Round trip per day is at least 90 minutes of driving you wouldn't be doing if you stayed closer.</li>
        <li>That extra distance means earlier wake-ups for sunrise, and tighter timing on evening returns.</li>
        <li>In summer traffic, the drive can stretch significantly.</li>
      </ul>

      <p>
        <strong>Services:</strong> the most complete of the five. Full-size supermarkets, a pharmacy, hardware, banks, and the last reliable place to fix a problem before you are an hour from anywhere. It is also the only gateway with year-round bus service into the park: YARTS runs the Highway 140 corridor from Merced and Mariposa all year, while the routes from Groveland, Oakhurst, and Lee Vining run only in summer. If there is any chance you would rather not drive the canyon in the dark or in snow, that is a real point in Mariposa's favor and no other town on this list can match it in January.
      </p>

      <p>
        <strong>Who should pick Mariposa:</strong> the largest share of first-time Yosemite visitors. Particularly families, anyone who values having a real town to come back to in the evening, anyone on a budget, and anyone visiting in shoulder seasons or winter when in-park or El Portal lodging is hard to find.
      </p>

      {townAvailability("Mariposa", "Mariposa, California")}

      <h2 id="sec-3-oakhurst">Oakhurst</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 50 miles, 75 to 90 minutes.<br />
        <strong>Distance to the South Entrance:</strong> about 14 miles, 20 to 25 minutes. The Mariposa Grove welcome plaza is immediately inside the gate; Wawona itself is another six miles on.<br />
        <strong>Elevation:</strong> about 2,300 feet.<br />
        <strong>Highway access:</strong> 41, year-round.<br />
        <strong>Character:</strong> a regional commercial town with chain hotels and restaurants.
      </p>

      <Placeholder
        caption="Giant sequoias in the Mariposa Grove, the reason to base on the Highway 41 side"
        image="img/mariposa-grove.jpg"
        credit="Photo: Dietmar Rabich / Wikimedia Commons (CC BY-SA 4.0)"
        tag="PLATE II"
        size="lg"
        style={{ aspectRatio: "16 / 10", margin: "32px 0" }}
        motif={<MotifMountains />}
      />

      <p>
        Oakhurst is the largest of the gateway communities by population and amenities. It has more chain lodging (Best Western, Comfort Inn, etc.) and chain dining than the other gateways combined. It feels like a regular Central California town that happens to be near a national park, rather than a town that exists because of one.
      </p>

      <p>The advantages:</p>
      <ul>
        <li>Fast and easy access to Wawona and the Mariposa Grove of giant sequoias.</li>
        <li>Predictable, chain-hotel lodging at predictable prices.</li>
        <li>A wider range of standard amenities (national pharmacy chains, chain grocery stores) than the other gateways.</li>
        <li>Year-round access via Highway 41.</li>
      </ul>

      <p>The disadvantages:</p>
      <ul>
        <li>The drive to Yosemite Valley is the longest of any gateway town. 75 to 90 minutes each way means three hours of driving on a Valley-focused day. This is significant.</li>
        <li>The town itself has less character than Mariposa or Groveland. If the gateway-town atmosphere is part of your trip, Oakhurst is a step down.</li>
        <li>The Highway 41 route into the park climbs over a ridge and descends into Wawona before reaching the Valley. It's a longer and more winding drive than Highway 140.</li>
      </ul>

      <p>
        <strong>Services:</strong> the deepest bench of ordinary amenities of any gateway. Chain supermarkets, chain pharmacies, urgent care, and the usual big-box conveniences. If someone in the party has a prescription to fill or a forgotten piece of gear to replace, this is the easiest of the five towns to solve it in.
      </p>

      <p>
        <strong>Who should pick Oakhurst:</strong> visitors whose itinerary is heavily focused on the Mariposa Grove and Wawona, and visitors who want predictable chain lodging at standard prices. Also a fine choice for people coming from Los Angeles or the southern Central Valley, since Oakhurst is on the natural drive path.
      </p>

      <p>
        <strong>Who should not:</strong> anyone whose trip is really a Yosemite Valley trip. Three hours a day in the car is the price, and it is a price people underestimate until the third morning.
      </p>

      {townAvailability("Oakhurst", "Oakhurst, California")}

      <p>
        One current note for this side of the park: the Wawona Hotel, the historic in-park option just inside the South Entrance, has been closed since December 2024, and the Park Service has said it stays closed for this visitor season to complete electrical repairs and upgrades. No reopening date has been announced. That removes the in-park alternative on the Highway 41 corridor and puts more pressure on Oakhurst and Fish Camp rooms in summer. Book earlier than you think you need to.
      </p>

      <h2 id="sec-4-groveland">Groveland</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 41 miles, 65 to 80 minutes.<br />
        <strong>Distance to Big Oak Flat Entrance:</strong> about 24 miles, 30 to 40 minutes on a winding road.<br />
        <strong>Elevation:</strong> about 3,100 feet, the highest of the western gateways.<br />
        <strong>Highway access:</strong> 120, with chain controls common in winter.<br />
        <strong>Character:</strong> a small, historic gold-rush town with strong personality.
      </p>

      <p>
        Groveland is the underrated gateway. It has a historic main street with the <strong>Groveland Hotel</strong>, the <strong>Iron Door Saloon</strong> (one of the oldest continuously operating saloons in California), several restaurants and inns, and the kind of small-town character that Mariposa has but at a smaller scale and with a different flavor.
      </p>

      <p>The advantages:</p>
      <ul>
        <li>A genuinely charming historic town that's worth time on its own. The Iron Door is a destination.</li>
        <li>Less crowded than Mariposa or Oakhurst, generally. Easier to get last-minute reservations in shoulder seasons.</li>
        <li>Best position if you're going to spend significant time in Hetch Hetchy, the Tuolumne side of the park, or Tuolumne Meadows when Tioga Road is open.</li>
        <li>Slightly more affordable lodging than El Portal or Mariposa in many seasons.</li>
      </ul>

      <p>The disadvantages:</p>
      <ul>
        <li>The drive into the Valley via Highway 120 climbs over higher elevation, before crossing into the park. In winter, chain controls are common.</li>
        <li>The route to Yosemite Valley from Groveland passes through the <strong>2013 Rim Fire</strong> burn scar, which is recovering but is still visually different from the Highway 140 approach.</li>
        <li>Fewer total lodging options than Mariposa.</li>
      </ul>

      <p>
        <strong>Services:</strong> a market rather than a supermarket, gas, and that is close to the list. Groveland is the last town of any size on Highway 120 before the entrance station; what follows is scattered lodging and not much else, and the nearest in-park pumps are at Crane Flat inside the gate. Fill the tank and the cooler in Groveland, or in Oakdale or Sonora if you are driving in from the Bay Area, before you start climbing.
      </p>

      <p>
        <strong>If Hetch Hetchy is your reason:</strong> know that the road in is open daylight hours only, so it is not somewhere you can arrive at dusk and it is not a sunset destination. Vehicles and trailers over 25 feet are not allowed on it. From November through March the road can close entirely or require chains, which is precisely the season a low-elevation reservoir hike sounds most appealing. Check before you commit a day to it.
      </p>

      <p>
        <strong>Who should pick Groveland:</strong> visitors who want gateway-town character and don't mind a slightly more challenging drive, anyone heading for Hetch Hetchy or the northern part of the park, and visitors who want to base on the route from the Bay Area without going all the way down to Mariposa.
      </p>

      <p>
        <strong>Who should not:</strong> anyone visiting in deep winter without snow-driving experience or chains in the trunk, and anyone who needs a town with real services at nine in the evening.
      </p>

      {townAvailability("Groveland", "Groveland, California")}

      <h2 id="sec-5-lee-vining">Lee Vining</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 75 miles via Tioga Pass, 90 minutes minimum, only when Tioga is open (typically late May or June through October or early November; the Park Service opened it on May 15 in 2026, the earliest in sixteen years, and it is open now).<br />
        <strong>Distance to Tuolumne Meadows:</strong> about 20 miles, 30 minutes.<br />
        <strong>Distance to Mono Lake:</strong> about 5 minutes to the visitor center, 15 to the South Tufa boardwalk.<br />
        <strong>Elevation:</strong> about 6,800 feet, and Tioga Pass above town is just under 10,000.<br />
        <strong>Highway access:</strong> 395 north-south, 120 west into Yosemite (seasonal).<br />
        <strong>Character:</strong> a tiny eastern Sierra town built around tourism to Mono Lake and the high-elevation Yosemite.
      </p>

      <Placeholder
        caption="Tenaya Lake, on the Tioga Road between Lee Vining and the Valley"
        image="img/tenaya-lake.jpg"
        credit="Photo: Michael Hogarth / Wikimedia Commons (public domain)"
        tag="PLATE III"
        size="lg"
        style={{ aspectRatio: "16 / 10", margin: "32px 0" }}
        motif={<MotifMountains />}
      />

      <p>
        Lee Vining is the only east-side gateway. It's not a substitute for the western towns. It's a different kind of trip. From Lee Vining, you can be in Tuolumne Meadows in 30 minutes, but the Valley is over an hour and a half each way. Lodging is limited (the <strong>Yosemite Gateway Motel</strong>, the <strong>El Mono Motel</strong>, a small inn or two), dining is limited but includes the famously-good Whoa Nellie Deli at the Mobil station (genuinely, this is not a joke, it's some of the best food in the eastern Sierra), and the town is tiny.
      </p>

      <p>The advantages:</p>
      <ul>
        <li>Direct access to Tuolumne Meadows and the high country during the Tioga Road season.</li>
        <li>Right next to Mono Lake, which is itself a remarkable place.</li>
        <li>An entirely different landscape, vegetation zone, and atmosphere from the western gateways. Sagebrush, alkali, and the Mono Basin are unlike anything west of the park.</li>
        <li>Far fewer crowds.</li>
        <li>A natural stop on a longer eastern Sierra trip (Mammoth Lakes, Bishop, Death Valley).</li>
      </ul>

      <p>The disadvantages:</p>
      <ul>
        <li>Only accessible via Tioga Pass during the road's open season (typically late May or early June through October or early November). In winter and shoulder seasons there is no crossing: you would drive south around the end of the Sierra and back up the west side, which turns a 90-minute drive into most of a day. The Park Service publishes the detour, and it is the first thing to read if your dates are anywhere near the shoulders.</li>
        <li>Limited lodging and dining inventory means you book early and pay a premium in summer.</li>
        <li>The drive to Yosemite Valley is the longest of any gateway and crosses Tioga Pass at nearly 10,000 feet, which can be punishing in bad weather.</li>
      </ul>

      <p>
        <strong>Services:</strong> thin, and seasonal on top of thin. The Tioga Gas Mart, which is also the Whoa Nellie Deli, runs roughly from late April to late October and is closed the rest of the year, so the town's best-known meal is not available on a winter Mono Lake trip. Groceries are a small market. The nearest full supermarket is in Mammoth Lakes, about 30 miles south. Fuel on Highway 395 is reliable but expensive; fill up in Bishop or Bridgeport if you are passing through either.
      </p>

      <p>
        <strong>Who should pick Lee Vining:</strong> visitors whose primary interest is the high country (Tuolumne, Cathedral Lakes, Mount Dana, the Tioga Road experience), and anyone combining Yosemite with Mono Lake, the eastern Sierra, or southern destinations like Death Valley.
      </p>

      <p>
        <strong>Who should not:</strong> anyone whose itinerary names Yosemite Falls, Half Dome, or Tunnel View. Those are Valley sights, and from here they are a three-hour round trip over a mountain pass on a road that is not open when you are likely to want it.
      </p>

      {townAvailability("Lee Vining", "Lee Vining, California")}

      <h2 id="sec-6-the-decision-matrix-in-plain-english">The decision matrix in plain English</h2>

      <p>Here's how I'd actually advise:</p>

      <p><strong>You want sunrise in the Valley every day.</strong> El Portal.</p>
      <p><strong>You want a balanced trip with comfort and value.</strong> Mariposa.</p>
      <p><strong>Your itinerary is mostly Wawona and the Mariposa Grove.</strong> Oakhurst.</p>
      <p><strong>You want gateway-town character without the Mariposa price.</strong> Groveland.</p>
      <p><strong>You're focused on the high country, or combining with Mono Lake.</strong> Lee Vining.</p>
      <p><strong>You're visiting in winter.</strong> El Portal or Mariposa. The other gateways have road-access challenges.</p>
      <p><strong>You have one day and you want the Valley.</strong> El Portal, and accept the price. The drive you save is a meaningful fraction of the only day you have.</p>
      <p><strong>You would rather not drive at all.</strong> Mariposa or Merced, and take YARTS. It is the only corridor with year-round service.</p>
      <p><strong>You're travelling with a large RV or a trailer.</strong> Mariposa or Oakhurst, on the wider approaches. Rule out Hetch Hetchy Road, which bans anything over 25 feet.</p>
      <p><strong>You're flying into San Francisco.</strong> Groveland or Mariposa is on the way.</p>
      <p><strong>You're flying into Fresno.</strong> Oakhurst or Mariposa is on the way.</p>
      <p><strong>You're flying into Reno or driving from Las Vegas.</strong> Lee Vining is the natural east-side base.</p>

      <h2 id="sec-7-what-each-town-looks-like-in-winter">What each town looks like in winter</h2>

      <p>
        Most gateway comparisons are written for July and quietly stop being true in December. The honest winter version:
      </p>

      <ul>
        <li><strong>El Portal and Mariposa.</strong> Highway 140 stays open, it is the lowest-elevation approach, and storms there more often fall as rain than snow. Year-round YARTS service runs this corridor, so it is the one base where not driving is a real option. This is the winter answer.</li>
        <li><strong>Groveland.</strong> Highway 120 stays open to the park, but you are starting a thousand feet higher and chain controls are routine. Hetch Hetchy Road may be closed or chain-controlled from November through March. Workable, with chains and a plan.</li>
        <li><strong>Oakhurst.</strong> Highway 41 stays open. The town is fine in winter; the two-hour reality of a Valley day is the constraint, not the weather. If your winter trip is Badger Pass or the sequoias in snow, this side works well.</li>
        <li><strong>Lee Vining.</strong> Tioga Road is closed and there is no way into the park from here. The town largely shuts down, the Whoa Nellie Deli with it. Come for a frozen Mono Lake if you want, but do not come for Yosemite.</li>
      </ul>

      <h2 id="sec-8-practical-notes">Practical notes</h2>

      <p>A few things that aren't obvious until you've done the trip.</p>

      <p>
        <strong>Distance affects more than driving time.</strong> The further your gateway is from the Valley, the earlier you have to leave to be in the park before crowds. A 60-minute drive at 5:30 a.m. is easier than a 90-minute drive at 4:30 a.m. for most people. The Park Service is not requiring a season-wide vehicle reservation for 2026, and is managing peak days with traffic monitoring and active parking control in the Valley instead. That is good news for spontaneity and bad news for anyone arriving at ten. Every mile between your room and the entrance station is a mile you have to make up before the lots fill.
      </p>

      <p>
        <strong>Gas.</strong> There is no gas station in Yosemite Valley. The in-park pumps are at Crane Flat, where the fuel is available year-round and you can pay at the pump around the clock with a card, and at Wawona, where the store keeps daytime hours but the pumps also take a card overnight. Outside the park, the El Portal station is the last stop on Highway 140. Arriving in the Valley on a quarter tank is a bad plan in any season and a genuinely bad one in winter, when engines idle in stopped traffic.
      </p>

      <p>
        <strong>Groceries.</strong> Mariposa and Oakhurst have full-size supermarkets. Groveland has a market. El Portal and Lee Vining have convenience-scale markets and nothing more. Whichever town you pick, do the real shop in Mariposa or Oakhurst on the way in, because in-park food is limited, expensive, and keeps shorter hours than you expect. See <a href="/articles/pack-your-car-for-yosemite">how to pack your car for a Yosemite trip</a>.
      </p>

      <p>
        <strong>Cell service.</strong> Patchy in all five gateways and unreliable to nonexistent through most of the park, including long stretches of the approach roads. Download the offline map for the whole region before you leave the gateway town, screenshot your reservation details, and agree on a meeting point with anyone you might get separated from. Do not rely on real-time navigation once you are past the entrance station.
      </p>

      <p>
        <strong>You can arrive without a car, from one town.</strong> YARTS runs the Highway 140 corridor from Merced and Mariposa all year. The routes from Sonora and Groveland on Highway 120, from Oakhurst on Highway 41, and from Mammoth Lakes and Lee Vining on 395 and Tioga Road are summer-only. If a car-free trip is on the table, that narrows the gateway choice to one corridor for most of the year.
      </p>

      <p>
        <strong>Reservations book out fast.</strong> In summer and on holiday weekends, gateway lodging fills six to twelve months in advance. Plan early or be willing to flex on town.
      </p>

      <p>
        <strong>Check current status the week you travel.</strong> Road, chain-control, and closure status changes faster than any lodging comparison. The <a href="/now">Park Bulletin</a> condenses the current edition of park status, roads, hours, and trail conditions onto one page.
      </p>

      <h2 id="sec-9-the-takeaway">The takeaway</h2>

      <p>
        The right gateway town depends on your trip, not on which town has the best reviews. Mariposa is the safest first-timer's choice. El Portal is the strongest if you can get a room. Groveland is the underrated pick for character without the crowd. Oakhurst is for the southern-entrance trip. Lee Vining is the east-side experience that most western visitors never see.
      </p>

      <p>
        Pick based on your trip's center of gravity. If your trip is mostly Yosemite Valley, base in the west. If it's mostly the high country, consider the east. If it's the giant sequoias, go south.
      </p>

      <p>That's the decision. Make it once, well, and the rest of your trip gets easier.</p>

      <p>
        If you are still working out how to approach the park, start with the <a href="/articles/first-time-yosemite-overwhelm">first-timer's guide</a>, read <a href="/articles/yosemite-without-reservations-2026">what changed for 2026</a> before you book, and see <a href="/articles/yosemite-in-one-or-two-days">how to spend one or two days</a> once your base is set.
      </p>

      <LodgingCta
        destination="Mariposa, California"
        heading="Made the call?"
        note="Mariposa is the safest first-timer's pick, so it is the default here, but the town-by-town links above go straight to whichever one you picked. Whatever the town, the inventory is what it is on your dates and no comparison table can tell you that part."
        list="article_cta"
        slug="yosemite-gateway-towns-compared"
        cta="Search Mariposa lodging →"
      />

      <p>
        The in-park options, the five towns above, and Fish Camp all sit on one
        page at <a href="/stay">where to stay</a>, if you would rather scan
        than read.
      </p>

      <AffiliateNote />

      <h3>Sources</h3>
      <ul style={{ fontSize: 14 }}>
        <li><a href="https://www.nps.gov/yose/planyourvisit/tiogaclosed.htm" target="_blank" rel="noopener noreferrer">Driving Directions when the Tioga Road is Closed, NPS</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/tiogaopen.htm" target="_blank" rel="noopener noreferrer">Tioga and Glacier Point Roads Opening &amp; Closing Dates, NPS</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/hours.htm" target="_blank" rel="noopener noreferrer">Operating Hours & Seasons, NPS Yosemite</a></li>
        <li><a href="https://www.nps.gov/yose/learn/news/yosemite-national-park-will-not-require-vehicle-reservations-in-2026.htm" target="_blank" rel="noopener noreferrer">Yosemite National Park will not require vehicle reservations in 2026, NPS</a></li>
        <li><a href="https://www.nps.gov/yose/learn/news/wawona-hotel-to-remain-closed-for-upcoming-visitor-season.htm" target="_blank" rel="noopener noreferrer">Wawona Hotel to Remain Closed for Upcoming Visitor Season, NPS</a></li>
        <li><a href="https://www.nps.gov/places/000/crane-flat-gas-station.htm" target="_blank" rel="noopener noreferrer">Crane Flat Gas Station, NPS</a></li>
        <li><a href="https://www.nps.gov/places/000/wawona-gas-station.htm" target="_blank" rel="noopener noreferrer">Wawona Gas Station, NPS</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/hh.htm" target="_blank" rel="noopener noreferrer">Hetch Hetchy, NPS Yosemite</a></li>
        <li><a href="https://www.yarts.com/" target="_blank" rel="noopener noreferrer">Yosemite Area Regional Transportation System (YARTS)</a></li>
        <li><a href="https://www.visittuolumne.com/big-oak-flat-entrance-yosemite-national-park" target="_blank" rel="noopener noreferrer">Big Oak Flat Entrance, Visit Tuolumne County</a></li>
        <li><a href="https://www.yosemitethisyear.com/maps-directions" target="_blank" rel="noopener noreferrer">Maps and directions, Visit Yosemite Madera County</a></li>
        <li><a href="https://www.yosemite.com/" target="_blank" rel="noopener noreferrer">Visit Mariposa County (regional tourism)</a></li>
      </ul>
    </>
  );
};
