/* global React, NewsletterInline, Breadcrumbs, GuidePromo, LodgingCta, FEES, calcEntryFees, FEE_MODES */

// =============================================================================
// INTERNATIONAL — `/international` route. The page for the reader arriving
// from abroad (FEATURE-RESEARCH-2026-09.md, feature 5): the 2026 non-resident
// entrance fee and how to pay the least of it, then the things the catalog
// already knows and this reader cannot find in one place.
//
// SOURCING. Every fee figure is window.FEES in fees-data.js, which names its
// NPS sources and its verified date; the page prints both. The calculator is
// window.calcEntryFees, swept over every input combination by
// scripts/check-fee-calculator.mjs. The rest of the page states nothing the
// linked articles do not state; a claim that needs a number links the article
// that carries it rather than repeating it here, so a correction lands once.
//
// English only, on purpose. The site has no other language and this page does
// not pretend to; it is written for an English-reading visitor, which is the
// audience the site can serve honestly.
// =============================================================================

const { useState: useStateI, useMemo: useMemoI } = React;

const MODE_LABELS = { car: "Car or camper van", motorcycle: "Motorcycle", foot: "On foot, bicycle, or the YARTS bus" };

function money(n) {
  return "$" + n.toLocaleString("en-US");
}

function FeeCalculator() {
  const F = window.FEES;
  const [adults, setAdults] = useStateI(2);
  const [children, setChildren] = useStateI(0);
  const [mode, setMode] = useStateI("car");
  const [vehicles, setVehicles] = useStateI(1);
  const [entries, setEntries] = useStateI(1);
  const result = useMemoI(() => window.calcEntryFees({ adults, children, mode, vehicles, entries }), [adults, children, mode, vehicles, entries]);
  const best = result.options.find((o) => o.id === result.best);
  const num = (v, set, lo, hi) => (
    <input type="number" min={lo} max={hi} value={v} onChange={(e) => set(Math.max(lo, Math.min(hi, Number(e.target.value) || lo)))} />
  );

  return (
    <div className="feecalc" role="region" aria-label="Entrance fee calculator">
      <div className="feecalc__form">
        <label><span>People 16 and older</span>{num(adults, setAdults, 1, 12)}</label>
        <label><span>Children under 16</span>{num(children, setChildren, 0, 12)}</label>
        <label>
          <span>How you enter</span>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {window.FEE_MODES.map((m) => <option key={m} value={m}>{MODE_LABELS[m]}</option>)}
          </select>
        </label>
        {mode !== "foot" && (
          <label><span>{mode === "car" ? "Cars" : "Motorcycles"}</span>{num(vehicles, setVehicles, 1, 4)}</label>
        )}
        <label>
          <span>Separate entries in the next 12 months</span>
          {num(entries, setEntries, 1, 6)}
          <small>At Yosemite or any of the other ten surcharge parks. A week in Yosemite is one entry; Yosemite, then a night in Fresno, then Sequoia is two.</small>
        </label>
      </div>
      <div className="feecalc__options">
        {result.options.map((o) => (
          <div key={o.id} className={`feecalc__option${o.id === result.best ? " is-best" : ""}`}>
            <div className="feecalc__option-head">
              <span className="feecalc__option-label">{o.label}</span>
              <span className="feecalc__option-total">{money(o.total)}</span>
            </div>
            <ul>
              {o.lines.map((l, i) => <li key={i}><span>{l.label}</span><span>{money(l.amount)}</span></li>)}
            </ul>
            <p>{o.note}</p>
            {o.id === result.best && result.savings > 0 && <p className="feecalc__saves">Saves {money(result.savings)} against paying at the gate.</p>}
            {o.id === result.best && result.savings === 0 && <p className="feecalc__saves">The cheapest way in for this party{result.options.length > 1 && result.options.every((x) => x.total === o.total) ? "; the options cost the same" : ""}.</p>}
          </div>
        ))}
      </div>
      <p className="feecalc__note">
        Children under {F.perPersonFreeUnder} pay nothing and owe no non-resident fee. Figures from the National Park Service fee pages, verified {F.verified}; the pass rule for passengers follows the park's own wording and the Yosemite Conservancy's 2026 summary, linked below. The gate is card only.
      </p>
    </div>
  );
}

function InternationalPage({ go }) {
  const F = window.FEES;
  const goA = (e, slug) => { e.preventDefault(); go(`a:${slug}`); };
  const goR = (e, r) => { e.preventDefault(); go(r); };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Visiting from abroad" }]} />
          <div className="eyebrow eyebrow--moss">International visitors</div>
          <h1>Yosemite for visitors from outside the United States</h1>
          <p className="page-head__dek">
            Since January 1, 2026, a visitor who does not live in the United
            States pays more to enter Yosemite, and the rules are easy to get
            wrong. What the fee is, the cheapest way to pay it, and the handful
            of things about this park that surprise people who have driven in
            other countries.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>The 2026 non-resident fee</h2>
          <p>
            Every visitor pays the entrance fee: {money(F.vehicle)} per car for
            seven days, {money(F.motorcycle)} per motorcycle, {money(F.perPerson)} per
            person on foot, by bicycle or by bus, children under {F.perPersonFreeUnder} free.
            On top of that, since January 1, 2026, a visitor who is not a US
            citizen or resident pays a non-resident fee of {money(F.surcharge)} per
            person aged {F.surchargeAgeFrom} and older, unless that person is
            covered by an annual pass. It applies at eleven parks: {F.surchargeParks.slice(0, -1).join(", ")} and {F.surchargeParks.slice(-1)[0]}.
            The fee-free days the park publishes each year are now for US
            residents only; a non-resident pays the full amount on those days too.
          </p>
          <table>
            <thead>
              <tr><th>What</th><th>Price</th><th>Who it covers</th></tr>
            </thead>
            <tbody>
              <tr><td>Entrance, private vehicle</td><td>{money(F.vehicle)}</td><td>The car and everyone in it, seven days</td></tr>
              <tr><td>Entrance, motorcycle</td><td>{money(F.motorcycle)}</td><td>Seven days</td></tr>
              <tr><td>Entrance, per person</td><td>{money(F.perPerson)}</td><td>On foot, bicycle or bus; under {F.perPersonFreeUnder} free</td></tr>
              <tr><td>Non-resident fee</td><td>{money(F.surcharge)} per person</td><td>Age {F.surchargeAgeFrom} and older, each entry, unless holding a pass</td></tr>
              <tr><td>Non-resident annual pass</td><td>{money(F.nonResidentAnnual)}</td><td>The holder's vehicle and its occupants, twelve months, every federal fee site; no non-resident fee</td></tr>
              <tr><td>Annual pass, US residents</td><td>{money(F.residentAnnual)}</td><td>Residents only</td></tr>
              <tr><td>Yosemite annual pass</td><td>{money(F.yosemiteAnnual)}</td><td>US citizens and residents only</td></tr>
            </tbody>
          </table>
          <p className="dates__hint">
            Sources: <a href={F.sources.yosemite} target="_blank" rel="noopener noreferrer">Yosemite fees and passes, NPS ↗</a>,{" "}
            <a href={F.sources.passes} target="_blank" rel="noopener noreferrer">America the Beautiful passes, NPS ↗</a>,{" "}
            <a href={F.sources.conservancy} target="_blank" rel="noopener noreferrer">Know before you go 2026, Yosemite Conservancy ↗</a>. Verified {F.verified}.
          </p>

          <h2>The cheapest way in</h2>
          <p>
            The arithmetic turns on one comparison: the non-resident fee is
            charged per person and per entry, and the non-resident annual pass
            is charged once per car. One adult in one car for one week pays
            {" "}{money(F.vehicle + F.surcharge)} at the gate and should. Three adults in
            the same car pay {money(F.vehicle + 3 * F.surcharge)} at the gate
            and {money(F.nonResidentAnnual)} with a pass. Anyone touring two of
            the eleven parks should buy the pass before the first gate.
          </p>
          <FeeCalculator />
          <p>
            Buy the pass online at Recreation.gov before you fly, or at the
            entrance station; a digital pass shown on a phone is accepted. Passes
            and entrance fees are card only at every Yosemite gate, no cash.
            The car's driver should hold the pass, and every adult in the car
            should have identification, since residency is what the surcharge
            turns on.
          </p>

          <h2>What else is different here</h2>
          <ul>
            <li>
              <strong>No reservation is needed to enter in 2026.</strong> You
              pay at the gate and drive in. What rations a summer day now is
              parking, which is solved by being through the entrance before
              8 a.m. or after 4 p.m. The full picture is in{" "}
              <a href="/articles/yosemite-without-reservations-2026" onClick={(e) => goA(e, "yosemite-without-reservations-2026")}>the no-reservations strategy</a>.
            </li>
            <li>
              <strong>The park is the size of a small country and most of it has no
              mobile signal.</strong> Download maps before the gate. The drive
              from the Valley to Tuolumne Meadows is an hour and a half; Glacier
              Point is an hour;{" "}
              <a href="/distances" onClick={(e) => goR(e, "distances")}>the drive-time table</a> has the rest.
            </li>
            <li>
              <strong>Two of the three mountain roads close for half the year.</strong>{" "}
              Tioga Road and Glacier Point Road are shut by snow from roughly
              November to late May, and the dates move every year. Plan a winter
              or spring trip around the Valley, and check{" "}
              <a href="/tioga-opening" onClick={(e) => goR(e, "tioga-opening")}>the Tioga Road page</a> before counting on the high country.
            </li>
            <li>
              <strong>Chains are the law, including in a rental car.</strong> From
              autumn to spring, every vehicle must carry tire chains when chain
              controls are posted, and rental agreements often forbid fitting
              them. Read the winter section of{" "}
              <a href="/articles/getting-to-yosemite" onClick={(e) => goA(e, "getting-to-yosemite")}>getting to Yosemite</a> before you book a car.
            </li>
            <li>
              <strong>You can do this without a car.</strong> Amtrak to Merced
              and the YARTS bus into the Valley run year-round, and a free
              shuttle covers the Valley floor.{" "}
              <a href="/articles/yosemite-shuttle-and-yarts" onClick={(e) => goA(e, "yosemite-shuttle-and-yarts")}>The shuttle and YARTS guide</a> explains the timetable, and whether the fare covers the entrance fee, which two official sources disagree on.
            </li>
            <li>
              <strong>Beds inside the park sell out a year ahead.</strong> The
              gateway towns are the realistic base for a trip planned months out
              rather than a year out;{" "}
              <a href="/stay" onClick={(e) => goR(e, "stay")}>where to stay</a> compares them by road corridor.
            </li>
            <li>
              <strong>Bears are real and the rules carry fines.</strong> No food
              or anything scented left in a car overnight, anywhere in the park.{" "}
              <a href="/articles/yosemite-bears-safety-guide" onClick={(e) => goA(e, "yosemite-bears-safety-guide")}>The bears guide</a> covers what that means in practice.
            </li>
            <li>
              <strong>Half Dome needs a permit won by lottery, and it fills.</strong>{" "}
              Everything else on the trail network needs nothing.{" "}
              <a href="/dates" onClick={(e) => goR(e, "dates")}>The dates page</a> has the lottery windows measured against your trip.
            </li>
          </ul>

          <h2>What a week costs, all in</h2>
          <p>
            The entrance fee is the smallest line. Lodging, fuel, food and the
            drive from the airport are the budget, and{" "}
            <a href="/articles/yosemite-trip-cost-budget-2026" onClick={(e) => goA(e, "yosemite-trip-cost-budget-2026")}>the trip-cost breakdown</a>{" "}
            prices a week three ways. A first visit with a few days to spend
            follows{" "}
            <a href="/articles/yosemite-in-three-to-five-days" onClick={(e) => goA(e, "yosemite-in-three-to-five-days")}>the three-to-five-day plan</a>,
            and the questions every first-time visitor asks are answered on{" "}
            <a href="/start-here" onClick={(e) => goR(e, "start-here")}>Start here</a>.
          </p>
        </section>

        <LodgingCta
          destination="Yosemite National Park"
          heading="Book the bed before the flight"
          note="In-park rooms open a year ahead and gateway rooms fill months out for summer. One availability search around the park shows what your dates still hold."
          list="page_international"
          slug="international"
          cta="Search lodging around Yosemite →"
        />

        <GuidePromo
          go={go}
          location="international"
          title="The park, offline, in your pocket"
          body="No roaming plan reaches most of Yosemite. The Field Guide app downloads the maps, the parking notes and the day planner to your phone before the gate, in plain English. One purchase, eighteen months of access."
          style={{ marginTop: 56, marginBottom: 40 }}
        />

        <NewsletterInline
          location="international"
          tag="international"
          heading="What changed since you read this"
          blurb="Fees, road openings and the park's rules move between the day you book and the day you land. One short letter on Sundays, from inside the park. Free."
        />
      </div>
    </div>
  );
}

window.InternationalPage = InternationalPage;
