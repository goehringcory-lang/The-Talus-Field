/* global React, EventIcon, ResponsiveImage, LodgingCta, AffiliateNote */

window.ARTICLE_BODIES = window.ARTICLE_BODIES || {};

// Tire chains in Yosemite (October 2026), built on the Mist Trail feature
// layout: the catalog entry carries a `feature` block (data.js), so
// page-article.jsx draws the full-width photo cover and hands this body the
// page's full width. Every section sits on the design's container
// (`hp-wrap`), alternating paper and the `ff-band` tint, and uses the shared
// `.ff-*` kit; the page-level `tc-*` rules are the `.tc-feature` layer in
// styles.css.
//
// Two rules hold it up.
//   1. Every rule, weight, speed, fine and phone number restates the sources
//      listed at the foot of the page: the Park Service's tire chain and
//      winter FAQ pages, its EV charging pages, Caltrans' chain control and
//      winter driving pages, and Enterprise's own chain FAQ. Where the Park
//      Service and Caltrans word a level differently, the page says so and
//      gives the park's version for the park. No other rental company's
//      policy could be read from its own site, so none is stated. Nothing is
//      added from memory.
//   2. The cards, lists and tables restate sentences in the prose beside
//      them, so the graphics add no fact of their own.
//
// The FAQ printed at the end mirrors the `faq` for this slug in
// seo-data.json, which feeds the FAQPage JSON-LD. Change both.
window.ARTICLE_BODIES["yosemite-tire-chains"] = function YosemiteTireChainsBody() {
  const TOC = [
    ["#tc-levels", "R1, R2, R3"],
    ["#tc-carry", "The carry rule"],
    ["#tc-rentals", "Rental cars"],
    ["#tc-evs", "EVs"],
    ["#tc-buy", "Buying and fitting"],
    ["#tc-routes", "Which road"],
    ["#tc-questions", "Questions"],
  ];

  // seo-data.json `faq`, word for word.
  const FAQ = [
    ["Do you need tire chains in Yosemite?", "Often, from November through March, and less often in October and April. Whenever a chain control is in effect, every vehicle in Yosemite must carry chains, including four-wheel drives and rental cars, even if the control level lets it drive without mounting them. Call 209/372-0200, then 1, then 1, for the current requirement."],
    ["What do R1, R2 and R3 mean?", "They are the three chain control levels. In the park, R1 exempts vehicles under 6,000 pounds with snow tires on at least two drive wheels and no trailer. R2 exempts four-wheel or all-wheel drive vehicles under 6,500 pounds with snow tires on all four wheels, four-wheel drive engaged and no trailer. R3 means chains on the drive wheels of every vehicle, no exceptions."],
    ["Does an AWD or 4WD car need chains in Yosemite?", "It must carry them whenever a chain control is in effect. Under R2 an all-wheel or four-wheel drive vehicle can go without mounting them only if it has snow tires on all four wheels and meets the park's weight and towing limits. Under R3 it mounts them like everyone else."],
    ["Are rental cars exempt from chain controls in Yosemite?", "No. The Park Service says rental cars are not exempt, even with all-season tires. Rental companies may not supply chains or allow them: Enterprise says it does not offer chains and that chains cannot be placed on its rental vehicles unless required by state law. Read your own rental agreement and ask at the counter before you drive up."],
    ["Do electric cars need chains in Yosemite?", "They follow the same rules as any vehicle, and weight matters. The R1 and R2 exemptions apply only under 6,000 and 6,500 pounds, and the Park Service says many battery-electric trucks and some large electric SUVs exceed those limits, so they need chains even with snow tires."],
    ["What is the fine for not using chains in Yosemite?", "The Park Service says failing to put on chains when required can bring a citation of up to $5,000. A tow truck sent to bring you chains can cost a few hundred dollars, is not covered by AAA, and can take several hours."],
    ["Where can I buy tire chains near Yosemite?", "At most auto parts stores and gas stations in the communities around the park. Inside the park the Village Garage in Yosemite Valley and the Wawona gas station carry a limited stock. The Park Service says rentals are rarely available. Buy chains sized to your tires."],
  ];

  // ── The three levels, from "R1, R2 and R3" ────────────────────────────────
  const LEVELS = [
    { code: "R1", name: "Snow tires OK", cls: "is-r1",
      rule: "Chains on, unless the vehicle is under 6,000 lbs, has snow tires on at least two drive wheels, and is not towing.",
      carry: "Exempt vehicles still carry chains." },
    { code: "R2", name: "4WD or AWD with snow tires OK", cls: "is-r2",
      rule: "Chains on, unless the vehicle is under 6,500 lbs, has snow tires on all four wheels, has four-wheel or all-wheel drive engaged, and is not towing.",
      carry: "Exempt vehicles still carry chains." },
    { code: "R3", name: "No exceptions", cls: "is-r3",
      rule: "Chains on the drive wheels of every vehicle.",
      carry: "There is no exemption to claim." },
  ];

  // ── Who mounts what, from the levels and the carry rule ──────────────────
  // Columns: two-wheel drive on all-season tires, two-wheel drive with snow
  // tires on the drive wheels, 4WD/AWD with snow tires on all four, any of
  // them over the weight limit or towing.
  const GRID = [
    ["R1", "Mount", "Carry", "Carry", "Mount"],
    ["R2", "Mount", "Mount", "Carry", "Mount"],
    ["R3", "Mount", "Mount", "Mount", "Mount"],
  ];

  // ── The roads in, from "Which road" ───────────────────────────────────────
  const ROUTES = [
    ["El Portal Road (Highway 140)", "Lower, so chains are required less often", "Also the YARTS winter route; park at a stop outside the park and ride in"],
    ["Wawona Road (Highway 41)", "Chains required more often", "The way to Wawona, the Mariposa Grove and Badger Pass"],
    ["Badger Pass Road", "Chains required more often", "The ski area road off Wawona Road"],
    ["Big Oak Flat Road (Highway 120 west)", "Chains required more often", "The road from Groveland and the Bay Area"],
    ["Tioga Road (Highway 120 east)", "Usually closed by snow from sometime in November until late May or June", "No crossing of the Sierra this way in winter"],
  ];

  return (
    <div className="tc-feature">
      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>Chain season</dt><dd>November through March, sometimes October and April</dd></div>
          <div><EventIcon name="car" /><dt>The carry rule</dt><dd>Every vehicle, whenever control is on</dd></div>
          <div><EventIcon name="clock" /><dt>Speed limit</dt><dd>25 mph in a chain control area</dd></div>
          <div><EventIcon name="alert" /><dt>Citation</dt><dd>Up to $5,000</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {TOC.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      {/* The opening: the rule that matters, and the whole page in four lines. */}
      <section className="hp-wrap hp-section tc-open">
        <div className="ff-split">
          <div className="tc-prose">
            <p className="dropcap">
              Chains in Yosemite are not a matter of whether your car can handle the snow. They are a matter of what the sign at the checkpoint says and what is in your trunk. The Park Service says chains are often required on roads inside and outside the park from November through March, less often in October and April, and rarely in September or May, and that it is not possible to predict whether you will need them.
            </p>

            <p>
              The rule that catches people is the carrying rule. Whenever chain controls are in effect, every vehicle must have chains in it, four-wheel drives and rental cars included, even when the control level lets that vehicle drive on without mounting them. Inside the park these are federal rules; outside it, on Highways 41, 120 and 140 and the rest of California's mountain roads, they are state law, enforced by the California Highway Patrol.
            </p>

            <p>
              Below: what R1, R2 and R3 mean, which cars each one exempts, what that means for a rental car, an all-wheel drive and an electric vehicle, where to buy chains, and which road into the park needs them least.
            </p>
          </div>
          <aside className="ff-short" aria-label="The short version">
            <p className="ff-short__head"><EventIcon name="check" /> The short version</p>
            <ul>
              <li>From November through March, carry chains on any trip, whatever you drive.</li>
              <li>AWD and 4WD are not exempt from carrying them. Rentals are not exempt at all.</li>
              <li>Heavy EVs can miss the R1 and R2 weight limits and have to chain up.</li>
              <li>Call 209/372-0200, then 1, then 1, the morning you drive.</li>
            </ul>
            <a className="tc-short__link" href="#tc-levels">The three levels, side by side ↓</a>
          </aside>
        </div>
      </section>

      <section className="ff-band" id="tc-levels" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <p className="hp-eyebrow">CHAIN CONTROL LEVELS</p>
          <h2>R1, R2 and R3, as the park defines them</h2>
          <ol className="tc-levels">
            {LEVELS.map((l) => (
              <li key={l.code} className={l.cls}>
                <span className="tc-levels__code">{l.code}</span>
                <strong>{l.name}</strong>
                <p>{l.rule}</p>
                <p className="tc-levels__carry">{l.carry}</p>
              </li>
            ))}
          </ol>

          <div className="ff-split tc-levels__prose">
            <div className="tc-prose">
              <p>
                When conditions call for it, signs go up along the road naming the level, and a checkpoint follows. Caltrans says there is usually about a mile between the "Chains Required" signs and the checkpoint, which is the distance you have to find a place to pull completely off the road to the right and put chains on.
              </p>

              <p>
                <strong>R1.</strong> The Park Service exempts a vehicle under 6,000 pounds with snow tires on at least two drive wheels that is not towing. Everything else mounts chains.
              </p>

              <p>
                <strong>R2.</strong> The park exempts a four-wheel or all-wheel drive vehicle under 6,500 pounds, with snow tires on all four wheels, four-wheel drive engaged, and no trailer. Caltrans words its version without a weight figure: chains on all vehicles except four-wheel and all-wheel drive vehicles with snow-tread tires on all four wheels. Inside the park, go by the park's version.
              </p>

              <p>
                <strong>R3.</strong> Chains on all vehicles, no exceptions. The park says on the drive wheels.
              </p>

              <p>
                <strong>What counts as a snow tire.</strong> The park accepts tires marked M+S, for mud and snow, with at least 6/32 of an inch of tread. Caltrans lists the sidewall markings MS, M/S, M+S or the words MUD AND SNOW. Read your sidewalls and check the tread before you assume either way.
              </p>

              <p>
                <strong>What counts as a chain.</strong> The park accepts chains, cables and tire socks. Plastic devices, straps and other emergency alternatives do not meet the requirement.
              </p>
            </div>
            <div>
              <h3 className="tc-sched__head">Who mounts, who only carries</h3>
              <div className="tc-grid-wrap">
                <table className="tc-grid">
                  <thead>
                    <tr>
                      <th scope="col">Level</th>
                      <th scope="col">2WD, no snow tires</th>
                      <th scope="col">2WD, snow tires on drive wheels</th>
                      <th scope="col">4WD/AWD, snow tires on all four</th>
                      <th scope="col">Over the weight limit, or towing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRID.map(([lvl, ...cells]) => (
                      <tr key={lvl}>
                        <th scope="row">{lvl}</th>
                        {cells.map((c, i) => <td key={i} className={c === "Mount" ? "is-mount" : "is-carry"}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ff-note tc-grid__note">"Carry" means the vehicle may drive on without chains mounted, but must have them on board. The weight limits are the park's: 6,000 lbs for R1, 6,500 lbs for R2. Chains go on the drive wheels.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="tc-carry" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE CARRY RULE, AWD AND 4WD</p>
            <h2>All-wheel drive gets you a pass, not an exemption</h2>
            <div className="tc-prose">
              <p>
                The Park Service puts it plainly: when chain controls are in effect, all vehicles must have chains in their possession, including four-wheel drive and rental vehicles. Caltrans says the same for its roads: four-wheel and all-wheel drive vehicles must carry traction devices in chain control areas. The park adds that its chain requirements are strictly enforced.
              </p>

              <p>
                So an all-wheel drive car with proper snow tires can drive through R2 without stopping to chain up, but only with a set in the car, and it cannot drive through R3 without mounting them. An all-wheel drive car on tires that are not snow tires is a two-wheel drive car for the purpose of R2: it mounts chains.
              </p>

              <p>
                <strong>Know your drive wheels.</strong> Caltrans says chains go on the drive wheels and tells drivers to know whether their vehicle is front or rear wheel drive. For an all-wheel drive car, check the owner's manual for where chains go and which kind the maker allows. Caltrans does not recommend brands and points drivers to the vehicle maker's specifications.
              </p>

              <p>
                <strong>Under chains, slow down.</strong> The park's speed limit in a chain control area is 25 mph. Caltrans gives 25 or 30 mph for its roads, as posted.
              </p>
            </div>
          </div>
          <figure className="tc-photo">
            <ResponsiveImage image="img/big-oak-flat-road-tunnel.jpg" style={{ aspectRatio: "1600 / 1200" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="A tunnel on Big Oak Flat Road, the Highway 120 approach into Yosemite from the west" />
            <figcaption>Big Oak Flat Road, the Highway 120 approach from the west, is one of the roads the park says needs chains more often than Highway 140. Photo: Famartin / Wikimedia Commons (CC BY-SA 3.0)</figcaption>
          </figure>
        </div>
      </section>

      <section className="ff-band" id="tc-rentals" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">RENTAL CARS</p>
              <h2>The checkpoint and the rental contract do not agree</h2>
              <div className="tc-prose">
                <p>
                  The Park Service says rental cars are not exempt from chain requirements, even with all-season tires. The rental company may see it differently. Enterprise's own help page says it "does not offer snow chains/traction devices," and that chains cannot be placed on its rental vehicles "unless required by state law." It also says a four-wheel or all-wheel drive vehicle can be requested at some locations but cannot be guaranteed.
                </p>

                <p>
                  We could not read a current chain policy for the other major rental companies on their own sites, so we do not state one here. Policies can differ by company and by location, and the agreement you sign is the one that binds you.
                </p>

                <p>
                  <strong>What to do about it.</strong> Before a winter trip, read the rental agreement's section on chains and traction devices, and ask at the counter what the location allows. Ask for an all-wheel drive vehicle and look at the tire sidewalls for an M+S mark before you leave the lot. Bring chains that fit the car you were actually given; the park says rental car companies generally do not provide chains, and chain rentals are rarely available.
                </p>

                <p>
                  If the contract and the checkpoint cannot both be satisfied, do not drive the chain control. Wait for it to lift, stay on Highway 140, which needs chains least often, or leave the car at a YARTS stop outside the park and ride in. <a href="/articles/getting-to-yosemite">The entrances guide</a> lays out each approach.
                </p>
              </div>
            </div>
            <div>
              <h3 className="tc-sched__head">At the rental counter</h3>
              <ol className="ff-hours tc-sched">
                <li className="is-glow"><span>Ask</span><p>Does this location allow chains or other traction devices on this car?</p></li>
                <li><span>Ask</span><p>Can I have an all-wheel or four-wheel drive vehicle? It is a request, not a guarantee.</p></li>
                <li><span>Check</span><p>The sidewalls: an M+S mark and at least 6/32 of an inch of tread.</p></li>
                <li><span>Check</span><p>Which wheels drive, and what chains the owner's manual allows.</p></li>
                <li><span>Keep</span><p>A copy of the policy you were given, in writing.</p></li>
              </ol>
              <p className="ff-alert tc-alert">
                <EventIcon name="alert" />
                <span>
                  <strong>A rental is never exempt from carrying.</strong> If chain controls are in effect inside the park, the car must have chains in it, whatever the contract says.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="tc-evs" tabIndex={-1}>
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">ELECTRIC VEHICLES</p>
            <h2>The weight limit is the EV rule</h2>
            <div className="tc-prose">
              <p>
                There is no separate chain rule for electric vehicles. There is a weight limit, and batteries are heavy. The R1 exemption ends at 6,000 pounds and the R2 exemption at 6,500. The Park Service says many battery-electric trucks and some large electric SUVs exceed those limits, so they need chains even with snow tires. Check your vehicle's weight against those figures before the trip, starting with the owner's manual.
              </p>

              <p>
                A lighter EV with snow tires is treated like any other car: under R1 it qualifies if its drive wheels have snow tires, and under R2 if it is all-wheel drive with snow tires on all four. Like any car, it must carry chains.
              </p>

              <p>
                <strong>Charging.</strong> The park lists Level 2 charging in Yosemite Valley, at Wawona, in the El Portal administrative area and at Tuolumne Meadows, all on J1772 connectors. Wawona has 24 chargers at 11 kW, next to the store, available around the clock; the Valley has stations at the Ahwahnee, Curry Village, Yosemite Valley Lodge, the Yosemite Falls day-use parking and the Welcome Center. The Tuolumne Meadows chargers sit on Tioga Road, which is usually closed by snow from sometime in November until late May or June. The park's pages list no fast chargers inside the park, so arrive with the charge you need to get back out.
              </p>
            </div>
          </div>
          <article className="ff-inpark tc-ev">
            <p className="hp-eyebrow">EV CHARGING IN THE PARK</p>
            <h3>Level 2, J1772</h3>
            <dl>
              <div><dt>Yosemite Valley</dt><dd>The Ahwahnee, Curry Village, Valley Lodge, Yosemite Falls parking, Welcome Center</dd></div>
              <div><dt>Wawona</dt><dd>24 chargers, 11 kW, by the store</dd></div>
              <div><dt>El Portal</dt><dd>Two chargers by the market and gas station</dd></div>
              <div><dt>Tuolumne Meadows</dt><dd>Four chargers; Tioga Road closes in winter</dd></div>
            </dl>
            <p className="ff-note">The park warns that charging spaces, like all parking, can be hard to get on busy days. Confirm locations on the park's EV charging page.</p>
          </article>
        </div>
      </section>

      <section className="ff-band" id="tc-buy" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <div className="ff-split">
            <div>
              <p className="hp-eyebrow">BUYING AND FITTING</p>
              <h2>Buy them before the mountains, fit them before the storm</h2>
              <div className="tc-prose">
                <p>
                  <strong>Where to buy.</strong> The Park Service says most auto parts stores and gas stations in the communities near the park sell chains, and that the Village Garage in Yosemite Valley and the Wawona gas station carry a limited stock. Match the chains to your tire size; the size is printed on the sidewall. Rentals are rarely available.
                </p>

                <p>
                  <strong>If you arrive without them.</strong> The park says you may need a tow truck to bring you chains, which can cost a few hundred dollars, is not covered by AAA, and can take several hours to arrive.
                </p>

                <p>
                  <strong>Chain installers.</strong> On state highways you may meet people offering to put chains on for a fee. Caltrans says they are independent businesspeople, not Caltrans employees, and that they are not allowed to sell or rent chains. If you hire one, get a receipt and write the installer's badge number on it.
                </p>

                <p>
                  <strong>Practice once.</strong> Fit the chains in a dry driveway or parking lot before the trip, so the roadside is not the first time. Caltrans suggests carrying a flashlight and chain repair links, and keeping the gas tank full in case a storm turns you around or holds you in traffic. The rest of what belongs in a winter trunk is in <a href="/articles/pack-your-car-for-yosemite">the car-packing guide</a>.
                </p>
              </div>
            </div>
            <ul className="ff-rules tc-rules">
              <li>
                <EventIcon name="check" size={26} />
                <strong>Chains, cables, socks.</strong>
                <p>The park accepts all three.</p>
              </li>
              <li>
                <EventIcon name="no" size={26} />
                <strong>Not straps or plastic.</strong>
                <p>Plastic devices, straps and emergency alternatives do not count.</p>
              </li>
              <li>
                <EventIcon name="car" size={26} />
                <strong>Pull fully off.</strong>
                <p>Caltrans: wait until you can pull completely off the road to the right.</p>
              </li>
              <li>
                <EventIcon name="id" size={26} />
                <strong>Get a receipt.</strong>
                <p>From any installer, with the badge number written on it.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="tc-routes" tabIndex={-1}>
        <p className="hp-eyebrow">WHICH ROAD</p>
        <h2>Highway 140 needs chains least often</h2>
        <div className="ff-split">
          <div className="tc-prose">
            <p>
              The Park Service says the El Portal Road, Highway 140 through the Merced River canyon, is lower in elevation and has chain requirements less often than the other entrance roads. Wawona Road (Highway 41), Big Oak Flat Road (Highway 120 from the west) and Badger Pass Road need chains more often than 140, the roads within Yosemite Valley and the Hetch Hetchy Road. Highway 140 is also the YARTS route that runs in winter, and the park's own suggestion for drivers without chains is to park at a YARTS stop on 140 outside the park and ride the bus in; there is a fare.
            </p>

            <p>
              Less often is not never, and the low road has its own trouble. When it closes, the detours are the higher roads; <a href="/articles/highway-140-closed-yosemite">the Highway 140 closure guide</a> covers what has shut it and what that does to a winter trip. Tioga Road is usually closed by snow from sometime in November until late May or June, so there is no winter crossing of the Sierra through the park.
            </p>

            <p>
              <strong>Check the morning you drive.</strong> For roads inside the park, call 209/372-0200, then 1, then 1. For state highways outside it, call the Caltrans Highway Information Network at 800/427-7623 or check Caltrans QuickMap, which shows chain controls and closures. The month-by-month picture, including what else closes, is in <a href="/articles/yosemite-in-winter">the winter guide</a>, <a href="/articles/yosemite-in-november">the November guide</a> and <a href="/articles/yosemite-in-december">the December guide</a>.
            </p>
          </div>
          <figure className="tc-photo">
            <ResponsiveImage image="img/merced-canyon-road-cory-goehring.jpg" style={{ aspectRatio: "2000 / 972" }} sizes="(max-width: 880px) calc(100vw - 40px), 560px"
              alt="The Merced River canyon below Yosemite Valley, where Highway 140 runs into the park" />
            <figcaption>The Merced River canyon, the Highway 140 approach, which the park says needs chains less often than the other roads in. Photo: Cory Goehring</figcaption>
          </figure>
        </div>

        <table className="tc-routes">
          <thead>
            <tr><th scope="col">Road</th><th scope="col">Chains</th><th scope="col">Note</th></tr>
          </thead>
          <tbody>
            {ROUTES.map(([road, chains, note]) => (
              <tr key={road}><th scope="row">{road}</th><td>{chains}</td><td>{note}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="tc-stay">
          {/* Mariposa sits on Highway 140, the road the park says needs chains
              least often, which is the advice this section gives; the in-park
              lodges book through Yosemite Hospitality and are not linked. */}
          <LodgingCta
            destination="Mariposa, California"
            heading="Sleep on the low road"
            note="A winter night in Mariposa puts you on Highway 140, the approach the park says needs chains least often, and on the YARTS route into the Valley. Check what is open for your dates."
            list="article_cta"
            slug="yosemite-tire-chains"
            cta="Search lodging in Mariposa →"
          />
        </div>
      </section>

      <section className="ff-band" id="tc-questions" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite tire chains, answered</h2>
            <div className="tc-sources">
              <h3>Sources</h3>
              <ul>
                <li><a href="https://www.nps.gov/yose/planyourvisit/tirechains.htm" target="_blank" rel="noopener noreferrer">Tire Chain Requirements, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/winterfaq.htm" target="_blank" rel="noopener noreferrer">Frequently Asked Questions about Visiting in Winter, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">Current Conditions, NPS Yosemite</a></li>
                <li><a href="https://www.nps.gov/yose/planyourvisit/ev-charging.htm" target="_blank" rel="noopener noreferrer">Electric Vehicle Charging, NPS Yosemite</a></li>
                <li><a href="https://dot.ca.gov/travel/winter-driving-tips/chain-controls" target="_blank" rel="noopener noreferrer">Chain Controls, Caltrans</a></li>
                <li><a href="https://dot.ca.gov/travel/winter-driving-tips" target="_blank" rel="noopener noreferrer">Winter Driving Tips, Caltrans</a></li>
                <li><a href="https://www.enterprise.com/en/help/faqs/rental-car-snow-chains.html" target="_blank" rel="noopener noreferrer">Rental car snow chains, Enterprise</a></li>
              </ul>
            </div>
          </div>
          <div className="ff-faq">
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="hp-wrap tc-end">
        <AffiliateNote />
      </div>
    </div>
  );
};
