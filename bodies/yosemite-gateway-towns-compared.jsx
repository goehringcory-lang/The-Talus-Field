/* global React, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Per-town availability links (MONETIZATION-IDEAS.md 3.1): plain Booking.com
// searches today, tracking links the day the affiliate ID lands in
// affiliate.js. The recommendations above each link do not depend on any
// program's catalog; if the best option in a town has no program, it stays
// the recommendation, linkless.
function townAvailability(town, ss) {
  return (
    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink-3)" }}>
      Current rates and availability:{" "}
      <a
        className="aff-link"
        href={window.buildAffiliateLink("booking", "https://www.booking.com/searchresults.html?ss=" + ss)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-aff-network="booking"
        data-aff-list="article"
        data-aff-item-slug="yosemite-gateway-towns-compared"
        data-aff-name={town + " lodging search"}
      >{town} lodging →</a>
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

      <h2>The geography you actually need to know</h2>

      <p>
        Yosemite has four entrance stations on the road system. They sit at the cardinal points of the park, more or less, and each gateway town is associated with one of them.
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
          <tr><th>Town</th><th>Drive to the Valley</th><th>Highway</th><th>Best for</th></tr>
        </thead>
        <tbody>
          <tr><td>El Portal</td><td>25 to 30 min</td><td>140, year-round</td><td>Sunrise starts, the shortest drive</td></tr>
          <tr><td>Mariposa</td><td>45 to 60 min</td><td>140, year-round</td><td>Most first-timers, families, winter</td></tr>
          <tr><td>Groveland</td><td>60 to 75 min</td><td>120, chains common in winter</td><td>Character, Hetch Hetchy, Bay Area route</td></tr>
          <tr><td>Oakhurst</td><td>75 to 90 min</td><td>41, year-round</td><td>Wawona and the Mariposa Grove</td></tr>
          <tr><td>Lee Vining</td><td>90+ min, summer only</td><td>120 East over Tioga Pass</td><td>The high country and Mono Lake</td></tr>
        </tbody>
      </table>

      <p>Now the towns themselves.</p>

      <h2>El Portal</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 14 miles, 25 to 30 minutes.<br />
        <strong>Highway access:</strong> 140, year-round.<br />
        <strong>Character:</strong> essentially a small park-adjacent settlement.
      </p>

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
        <strong>Who should pick El Portal:</strong> anyone whose top priority is being inside the park as much as possible, especially for sunrise photography, peak-period crowd avoidance, or a short trip with lots of Valley-focused itinerary. Also a strong choice for any winter trip where road reliability matters.
      </p>

      {townAvailability("El Portal", "El+Portal%2C+California")}

      <h2>Mariposa</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 45 miles, 45 minutes to an hour.<br />
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
        <strong>Who should pick Mariposa:</strong> the largest share of first-time Yosemite visitors. Particularly families, anyone who values having a real town to come back to in the evening, anyone on a budget, and anyone visiting in shoulder seasons or winter when in-park or El Portal lodging is hard to find.
      </p>

      {townAvailability("Mariposa", "Mariposa%2C+California")}

      <h2>Oakhurst</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 50 miles, 75 to 90 minutes.<br />
        <strong>Distance to Wawona/Mariposa Grove:</strong> about 16 miles, 20 minutes.<br />
        <strong>Highway access:</strong> 41, year-round.<br />
        <strong>Character:</strong> a regional commercial town with chain hotels and restaurants.
      </p>

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
        <strong>Who should pick Oakhurst:</strong> visitors whose itinerary is heavily focused on the Mariposa Grove and Wawona, and visitors who want predictable chain lodging at standard prices. Also a fine choice for people coming from Los Angeles or the southern Central Valley, since Oakhurst is on the natural drive path.
      </p>

      {townAvailability("Oakhurst", "Oakhurst%2C+California")}

      <p>
        One 2026 note for this side of the park: the Wawona Hotel, the historic in-park option just inside the South Entrance, has been closed since December 2024 and remains closed for renovation this season. That removes the in-park alternative on the Highway 41 corridor and puts more pressure on Oakhurst rooms in summer. Book earlier than you think you need to.
      </p>

      <h2>Groveland</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 50 miles, 60 to 75 minutes.<br />
        <strong>Distance to Big Oak Flat Entrance:</strong> about 25 miles, 30 minutes.<br />
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
        <strong>Who should pick Groveland:</strong> visitors who want gateway-town character and don't mind a slightly more challenging drive, anyone heading for Hetch Hetchy or the northern part of the park, and visitors who want to base on the route from the Bay Area without going all the way down to Mariposa.
      </p>

      {townAvailability("Groveland", "Groveland%2C+California")}

      <h2>Lee Vining</h2>

      <p>
        <strong>Distance to Yosemite Valley:</strong> about 75 miles via Tioga Pass, 90 minutes minimum, only when Tioga is open (typically late May or June through October or early November; in 2026 it opened May 15, unusually early, and is open now).<br />
        <strong>Distance to Tuolumne Meadows:</strong> about 20 miles, 30 minutes.<br />
        <strong>Distance to Mono Lake:</strong> about 5 minutes to the visitor center, 15 to the South Tufa boardwalk.<br />
        <strong>Highway access:</strong> 395 north-south, 120 west into Yosemite (seasonal).<br />
        <strong>Character:</strong> a tiny eastern Sierra town built around tourism to Mono Lake and the high-elevation Yosemite.
      </p>

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
        <li>Only accessible via Tioga Pass during the road's open season (typically late May or early June through October or early November). In winter and shoulder seasons, you'd have to drive south to Mojave and around the south end of the Sierra, a roughly six-hour detour.</li>
        <li>Limited lodging and dining inventory means you book early and pay a premium in summer.</li>
        <li>The drive to Yosemite Valley is the longest of any gateway and crosses Tioga Pass at nearly 10,000 feet, which can be punishing in bad weather.</li>
      </ul>

      <p>
        <strong>Who should pick Lee Vining:</strong> visitors whose primary interest is the high country (Tuolumne, Cathedral Lakes, Mount Dana, the Tioga Road experience), and anyone combining Yosemite with Mono Lake, the eastern Sierra, or southern destinations like Death Valley.
      </p>

      {townAvailability("Lee Vining", "Lee+Vining%2C+California")}

      <h2>The decision matrix in plain English</h2>

      <p>Here's how I'd actually advise:</p>

      <p><strong>You want sunrise in the Valley every day.</strong> El Portal.</p>
      <p><strong>You want a balanced trip with comfort and value.</strong> Mariposa.</p>
      <p><strong>Your itinerary is mostly Wawona and the Mariposa Grove.</strong> Oakhurst.</p>
      <p><strong>You want gateway-town character without the Mariposa price.</strong> Groveland.</p>
      <p><strong>You're focused on the high country, or combining with Mono Lake.</strong> Lee Vining.</p>
      <p><strong>You're visiting in winter.</strong> El Portal or Mariposa. The other gateways have road-access challenges.</p>
      <p><strong>You're flying into San Francisco.</strong> Groveland or Mariposa is on the way.</p>
      <p><strong>You're flying into Fresno.</strong> Oakhurst or Mariposa is on the way.</p>
      <p><strong>You're flying into Reno or driving from Las Vegas.</strong> Lee Vining is the natural east-side base.</p>

      <h2>Practical notes</h2>

      <p>A few things that aren't obvious until you've done the trip.</p>

      <p>
        <strong>Distance affects more than driving time.</strong> The further your gateway is from the Valley, the earlier you have to leave to be in the park before crowds. A 60-minute drive at 5:30 a.m. is easier than a 90-minute drive at 4:30 a.m. for most people. Calculate this honestly when choosing.
      </p>

      <p>
        <strong>Gas and groceries.</strong> Mariposa and Oakhurst have full grocery stores. Groveland has a smaller one. El Portal has a market, not a real grocery. Lee Vining is similar. Plan accordingly. Stock the cooler and the car kit at the larger town before you head in. See <a href="/articles/pack-your-car-for-yosemite">how to pack your car for a Yosemite trip</a>.
      </p>

      <p>
        <strong>Cell service.</strong> Patchy in all gateways and almost nonexistent inside the park. Don't rely on real-time Google Maps once you're past the entrance station.
      </p>

      <p>
        <strong>Reservations book out fast.</strong> In summer and on holiday weekends, gateway lodging fills six to twelve months in advance. Plan early or be willing to flex on town.
      </p>

      <p>
        <strong>Check current status the week you travel.</strong> Road, chain-control, and closure status changes faster than any lodging comparison. The <a href="/now">Park Bulletin</a> condenses the current edition of park status, roads, hours, and trail conditions onto one page.
      </p>

      <h2>The takeaway</h2>

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

      <AffiliateNote />

      <h3>Sources</h3>
      <ul style={{ fontSize: 14 }}>
        <li><a href="https://www.nps.gov/yose/planyourvisit/tiogaclosed.htm" target="_blank" rel="noopener noreferrer">Driving Directions when the Tioga Road is Closed, NPS</a></li>
        <li><a href="https://www.nps.gov/yose/planyourvisit/hours.htm" target="_blank" rel="noopener noreferrer">Operating Hours & Seasons, NPS Yosemite</a></li>
        <li><a href="https://www.yosemite.com/" target="_blank" rel="noopener noreferrer">Visit Mariposa County (regional tourism)</a></li>
      </ul>
    </>
  );
};
