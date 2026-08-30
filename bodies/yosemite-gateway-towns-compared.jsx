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

// One shared table for the map and the picker, keyed by the hand-authored
// section ids. Those ids earn SERP deep links (see CLAUDE.md on section
// anchors), so anything that jumps to a section goes through here rather
// than minting its own copy of an anchor string.
const GATEWAY_TOWNS = {
  "el-portal": { name: "El Portal", href: "#sec-1-el-portal", dest: "El Portal, California" },
  "mariposa": { name: "Mariposa", href: "#sec-2-mariposa", dest: "Mariposa, California" },
  "oakhurst": { name: "Oakhurst", href: "#sec-3-oakhurst", dest: "Oakhurst, California" },
  "groveland": { name: "Groveland", href: "#sec-4-groveland", dest: "Groveland, California" },
  "lee-vining": { name: "Lee Vining", href: "#sec-5-lee-vining", dest: "Lee Vining, California" },
};

// Compact spec grid at the top of each town section. Plain dl markup so the
// facts read the same to a crawler as the old bold-line paragraphs did.
function TownFacts({ rows }) {
  return (
    <dl className="town-facts">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// The gateway map. A deliberately simple outline of the park with the five
// towns, the entrances they serve, and the roads between, projected from real
// coordinates (460 px per degree of longitude, 581 per degree of latitude, so
// distances are roughly honest). Towns are plain <a href="#sec-..."> links to
// their sections: native in-page anchors, so the map is fully clickable in the
// prerendered fragment with no JavaScript at all. All colour comes from CSS
// classes (styles.css, .gwmap*) reading the palette variables, same rule as
// the bulletin icons.
// ---------------------------------------------------------------------------
const MAP_ROADS = [
  // Highway 140: Merced stub, Mariposa, Midpines, El Portal, Arch Rock, Valley.
  { d: "M138 478 C152 462 164 450 175 436 C200 398 232 356 258 329 C268 325 276 323 284 322 C306 317 330 305 346 288" },
  // Highway 120 west + Big Oak Flat Road: Bay Area stub, Groveland, entrance, Crane Flat, down to the Valley.
  { d: "M18 238 C30 236 40 234 52 233 C95 231 130 260 160 252 C185 246 200 250 217 256 C228 264 240 274 250 282 C275 295 305 297 335 292" },
  // Highway 41: Fresno stub, Oakhurst, Fish Camp, South Entrance, Wawona, Valley.
  { d: "M320 560 L320 530 C322 502 326 470 328 448 C328 440 328 432 328 426 C325 419 320 413 317 407 C312 385 320 365 325 350 C332 328 336 310 341 293" },
  // Tioga Road (120 East): Crane Flat, Tuolumne Meadows, Tioga Pass, Lee Vining. Closed in winter.
  { d: "M250 282 C300 258 360 240 400 228 C425 220 445 216 457 213 C475 207 490 200 500 192 C520 180 545 170 564 164", seasonal: true },
  // US 395 through Lee Vining.
  { d: "M585 60 C578 95 570 130 564 164 C558 205 552 250 548 295" },
  // Hetch Hetchy Road, drawn thin: a dead-end spur, not a through route.
  { d: "M217 256 C225 225 240 195 256 171", minor: true },
];

const MAP_TOWN_POINTS = [
  { key: "el-portal", x: 258, y: 329, lx: 247, ly: 352, anchor: "end" },
  { key: "mariposa", x: 175, y: 436, lx: 175, ly: 456, anchor: "middle" },
  { key: "oakhurst", x: 320, y: 530, lx: 332, ly: 535, anchor: "start" },
  { key: "groveland", x: 52, y: 233, lx: 52, ly: 214, anchor: "middle" },
  { key: "lee-vining", x: 564, y: 164, lx: 564, ly: 146, anchor: "middle" },
];

const MAP_ENTRANCES = [
  { name: "Arch Rock", x: 284, y: 322, lx: 294, ly: 337, anchor: "start" },
  { name: "Big Oak Flat", x: 217, y: 256, lx: 209, ly: 250, anchor: "end" },
  { name: "South", x: 328, y: 426, lx: 321, ly: 442, anchor: "end" },
  { name: "Tioga Pass", x: 500, y: 192, lx: 507, ly: 184, anchor: "start" },
];

const MAP_POIS = [
  { name: "Yosemite Valley", x: 346, y: 288, lx: 358, ly: 293, anchor: "start", big: true },
  { name: "Tuolumne Meadows", x: 457, y: 213, lx: 457, ly: 200, anchor: "middle" },
  { name: "Wawona", x: 317, y: 407, lx: 308, ly: 404, anchor: "end" },
  { name: "Mariposa Grove", x: 345, y: 422, lx: 354, ly: 419, anchor: "start" },
  { name: "Hetch Hetchy", x: 256, y: 171, lx: 264, ly: 167, anchor: "start" },
];

const MAP_ROAD_LABELS = [
  { t: "140", x: 212, y: 391 },
  { t: "120", x: 120, y: 250 },
  { t: "41", x: 325, y: 489 },
  { t: "395", x: 552, y: 262 },
];

const MAP_HINTS = [
  { t: "to Merced", x: 126, y: 494, anchor: "middle" },
  { t: "to the Bay Area", x: 22, y: 256, anchor: "start" },
  { t: "to Fresno", x: 320, y: 574, anchor: "middle" },
  { t: "to Reno", x: 585, y: 48, anchor: "middle" },
  { t: "to Mammoth", x: 548, y: 310, anchor: "middle" },
];

function GatewayMap() {
  return (
    <figure className="gwmap">
      <div className="gwmap__scroll">
        <svg className="gwmap__svg" viewBox="0 0 640 584" xmlns="http://www.w3.org/2000/svg">
          {/* Park outline, simplified from the real boundary. */}
          <path
            className="gwmap__park"
            d="M212 303 L208 169 L274 82 L366 29 L458 70 L500 151 L500 192 L518 279 L490 372 L426 425 L329 436 L297 407 L288 355 L272 326 Z"
          />
          <text className="gwmap__parkname" x="366" y="106" textAnchor="middle">YOSEMITE</text>
          <text className="gwmap__parkname" x="366" y="122" textAnchor="middle">NATIONAL PARK</text>

          {MAP_ROADS.map((r, i) => (
            <path
              key={i}
              className={
                "gwmap__road" +
                (r.seasonal ? " gwmap__road--seasonal" : "") +
                (r.minor ? " gwmap__road--minor" : "")
              }
              d={r.d}
            />
          ))}
          <text className="gwmap__roadname" x="385" y="218" textAnchor="middle">Tioga Road</text>

          <ellipse className="gwmap__lake" cx="612" cy="132" rx="24" ry="19" />
          <text className="gwmap__hint" x="612" y="164" textAnchor="middle">Mono Lake</text>

          {MAP_ROAD_LABELS.map((l) => (
            <text key={l.t + l.x} className="gwmap__roadnum" x={l.x} y={l.y} textAnchor="middle">{l.t}</text>
          ))}
          {MAP_HINTS.map((l) => (
            <text key={l.t} className="gwmap__hint" x={l.x} y={l.y} textAnchor={l.anchor}>{l.t}</text>
          ))}

          {MAP_POIS.map((p) => (
            <g key={p.name}>
              <circle className={"gwmap__poi" + (p.big ? " gwmap__poi--big" : "")} cx={p.x} cy={p.y} r={p.big ? 4.5 : 3.5} />
              <text className={"gwmap__poilbl" + (p.big ? " gwmap__poilbl--big" : "")} x={p.lx} y={p.ly} textAnchor={p.anchor}>{p.name}</text>
            </g>
          ))}

          {MAP_ENTRANCES.map((e) => (
            <g key={e.name}>
              <rect className="gwmap__entr" x={e.x - 4} y={e.y - 4} width="8" height="8" />
              <text className="gwmap__entrlbl" x={e.lx} y={e.ly} textAnchor={e.anchor}>{e.name}</text>
            </g>
          ))}

          {MAP_TOWN_POINTS.map((t) => {
            const town = GATEWAY_TOWNS[t.key];
            return (
              <a key={t.key} href={town.href} className="gwmap__town" aria-label={town.name + ", jump to its section"}>
                <title>{"Jump to the " + town.name + " section"}</title>
                <circle className="gwmap__townhit" cx={t.x} cy={t.y} r="15" />
                <circle className="gwmap__towndot" cx={t.x} cy={t.y} r="5.5" />
                <text className="gwmap__townlbl" x={t.lx} y={t.ly} textAnchor={t.anchor}>{town.name}</text>
              </a>
            );
          })}

          {/* North arrow and legend. */}
          <g className="gwmap__compass">
            <line x1="28" y1="66" x2="28" y2="46" />
            <path d="M23 50 L28 38 L33 50 Z" />
          </g>
          <g className="gwmap__legend">
            <circle className="gwmap__towndot" cx="22" cy="514" r="5" />
            <text x="34" y="518">Gateway town, tap to jump</text>
            <rect className="gwmap__entr" x="18" y="530" width="8" height="8" />
            <text x="34" y="538">Park entrance</text>
            <line className="gwmap__road gwmap__road--seasonal" x1="16" y1="554" x2="30" y2="554" />
            <text x="34" y="558">Closed in winter</text>
          </g>
        </svg>
      </div>
      <figcaption>
        The five gateways, the entrances they serve, and the roads that decide everything. Distances are roughly to scale. Tap a town to jump to its section.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// The decision aid. Three answers in, one town out, deterministic: the same
// answers always produce the same town, and the logic is the article's own
// advice, not a scoring model. Renders its unanswered state in the prerendered
// fragment (no browser APIs at first render, same rule as the home shell).
// ---------------------------------------------------------------------------
const PICK_TRIP = [
  { key: "valley", label: "Yosemite Valley" },
  { key: "sequoias", label: "Sequoias and Wawona" },
  { key: "high", label: "The high country" },
  { key: "hetch", label: "Hetch Hetchy and the north" },
];
const PICK_WHEN = [
  { key: "summer", label: "June to October" },
  { key: "winter", label: "November to May" },
];
const PICK_PRIORITY = [
  { key: "close", label: "Shortest drive" },
  { key: "town", label: "A real town" },
  { key: "character", label: "Character" },
  { key: "chain", label: "Chain predictability" },
];

function pickTown(trip, when, priority) {
  if (trip === "high") {
    if (when === "winter") {
      return {
        key: "mariposa",
        why: "Tioga Road is closed from roughly November into late May, so there is no winter high-country base. If the trip moves to the Valley instead, Highway 140 is the reliable winter road and Mariposa is the best all-round base on it.",
      };
    }
    return {
      key: "lee-vining",
      why: "Tuolumne Meadows is 30 minutes up Tioga Road and Mono Lake is next door. This is a high-country base, not a Valley base: the Valley is 90 minutes each way over a near-10,000-foot pass.",
      note: priority === "chain"
        ? "One expectation to manage: the motels here are small, independent, and booked early. There are no chains."
        : null,
    };
  }
  if (trip === "sequoias") {
    return {
      key: "oakhurst",
      why: "The South Entrance is 20 to 25 minutes up Highway 41, the Mariposa Grove is immediately inside the gate, and Oakhurst has the deepest bench of rooms and services of any gateway.",
      note: when === "winter"
        ? "Highway 41 stays open in winter, and this side is the base for Badger Pass and sequoias in snow."
        : priority === "character"
          ? "Character is the one thing Oakhurst does not stock. Fish Camp, at the park line, trades services for setting."
          : null,
    };
  }
  if (trip === "hetch") {
    return {
      key: "groveland",
      why: "Groveland is the only gateway that makes Hetch Hetchy convenient, and it is the natural base for the north end of the park on the Bay Area route.",
      note: when === "winter"
        ? "Carry chains: controls are routine on Highway 120 in winter, and Hetch Hetchy Road itself can close. Check before committing a day."
        : null,
    };
  }
  if (priority === "close") {
    return {
      key: "el-portal",
      why: "The Valley is 25 to 35 minutes away and nothing else comes close." + (when === "winter" ? " Highway 140 is also the lowest and most reliable winter road." : " Roll out of bed at 5:30 and be at Tunnel View by 6:15."),
      note: "The trade: rooms price like in-park lodging and sell out early. If nothing is left, Mariposa is the fallback on the same road.",
    };
  }
  if (priority === "character") {
    if (when === "winter") {
      return {
        key: "mariposa",
        why: "In winter the answer narrows to Highway 140, and Mariposa's gold-rush downtown carries the character brief while keeping the low, reliable road.",
      };
    }
    return {
      key: "groveland",
      why: "A genuine historic main street, the Iron Door Saloon, and usually a lower bill than Mariposa. The price is a longer, higher drive: 65 to 80 minutes to the Valley.",
    };
  }
  if (priority === "chain") {
    return {
      key: "mariposa",
      why: "Mariposa's highway strip has the chain hotels without Oakhurst's 75 to 90 minute Valley commute. Oakhurst has more of them, but three hours of driving a day is what booking there costs a Valley trip.",
    };
  }
  return {
    key: "mariposa",
    why: "A real downtown, several price points, full supermarkets, and the year-round Highway 140 approach at 45 to 60 minutes. The default answer for a first Yosemite trip." + (when === "winter" ? " It is also the only gateway with year-round YARTS bus service into the park." : ""),
  };
}

function PickerRow({ label, options, value, onPick }) {
  return (
    <div className="town-picker__q">
      <span className="town-picker__qlabel">{label}</span>
      <span className="town-picker__chips" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            className="town-picker__chip"
            aria-pressed={value === o.key}
            onClick={() => onPick(value === o.key ? null : o.key)}
          >{o.label}</button>
        ))}
      </span>
    </div>
  );
}

function TownPicker() {
  const [trip, setTrip] = React.useState(null);
  const [when, setWhen] = React.useState(null);
  const [priority, setPriority] = React.useState(null);
  const rec = trip && when && priority ? pickTown(trip, when, priority) : null;
  const town = rec ? GATEWAY_TOWNS[rec.key] : null;
  return (
    <aside className="town-picker" aria-label="Gateway town decision aid">
      <p className="town-picker__head">Which town fits your trip?</p>
      <PickerRow label="The trip is mostly" options={PICK_TRIP} value={trip} onPick={setTrip} />
      <PickerRow label="The season" options={PICK_WHEN} value={when} onPick={setWhen} />
      <PickerRow label="What matters most" options={PICK_PRIORITY} value={priority} onPick={setPriority} />
      {rec ? (
        <div className="town-picker__result">
          <p className="town-picker__answer">Base in <strong>{town.name}</strong>.</p>
          <p className="town-picker__why">{rec.note ? rec.why + " " + rec.note : rec.why}</p>
          <p className="town-picker__links">
            <a href={town.href}>Read the {town.name} section ↓</a>
            <AvailabilityLink
              destination={town.dest}
              list="article_picker"
              slug="yosemite-gateway-towns-compared"
              name={town.name + " lodging search"}
            >Check {town.name} rates →</AvailabilityLink>
          </p>
        </div>
      ) : (
        <p className="town-picker__hint">
          Answer all three and the pick appears here. It follows the same reasoning as the article, it just gets there faster.
        </p>
      )}
    </aside>
  );
}

window.ARTICLE_BODIES["yosemite-gateway-towns-compared"] = function YosemiteGatewayTownsComparedBody() {
  return (
    <>
      <p className="dropcap">
        The decision about which gateway town to base yourself in is more important than most planning guides admit. The five main gateway communities, <strong>El Portal, Mariposa, Oakhurst, Groveland, and Lee Vining</strong>, are not interchangeable. They sit on different sides of the park, vary in distance from the Valley by an hour or more, have different lodging cultures, and serve different kinds of trips. Picking the wrong one costs you real time and friction every day of your visit. Picking the right one makes every day easier.
      </p>

      <p>
        I've stayed in all of them. I've watched first-time visitors make this decision well, and I've watched them make it badly. Here's what I'd tell you if you asked me which to pick.
      </p>

      <h2 id="sec-0-the-geography-you-actually-need-to-know">The geography you actually need to know</h2>

      <p>
        Yosemite has four entrance stations on the through-road system, one at each rough cardinal point, and each gateway town is associated with one of them. A fifth, the Hetch Hetchy entrance, is a dead end into one valley and serves no through route.
      </p>

      <ul>
        <li><strong>Arch Rock Entrance</strong>, Highway 140 from the west: the most direct route to Yosemite Valley. <strong>El Portal</strong> is at the gate, <strong>Mariposa</strong> further down the road.</li>
        <li><strong>Big Oak Flat Entrance</strong>, Highway 120 from the northwest: <strong>Groveland</strong>.</li>
        <li><strong>South Entrance</strong>, Highway 41 from the south: the route to Wawona and the Mariposa Grove. <strong>Oakhurst</strong>.</li>
        <li><strong>Tioga Pass Entrance</strong>, Highway 120 East from the east, open only in summer: <strong>Lee Vining</strong>.</li>
      </ul>

      <GatewayMap />

      <p>
        The map is the argument: the four routes are not equal. Highway 140 is the lowest, most reliable, year-round road into the Valley. Highway 41 climbs and descends more and arrives via Wawona. Highway 120 from Groveland runs higher still, and Tioga Pass is shut for roughly half the year. The whole comparison, in one view:
      </p>

      <div className="table-scroll">
        <table className="compare-table">
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
      </div>

      <p>
        The elevation column is not trivia. It is the best single predictor of whether you will be putting chains on in February: El Portal and Mariposa sit low enough that winter storms usually arrive as rain, Groveland is a thousand feet higher and gets chain controls the Highway 140 towns do not, and Lee Vining's road into the park is shut half the year.
      </p>

      <p>
        One caveat on every drive time on this page: Yosemite Valley is about seven miles long, and a time quoted to the Valley means its west end, near Bridalveil Fall. Curry Village and the east-end trailheads are another fifteen or twenty minutes past that, plus parking. Budget for the end of the Valley you actually want. The legs the table does not cover (Oakhurst to the South Entrance, Groveland to Big Oak Flat, Lee Vining to Tuolumne Meadows) are collected on <a href="/distances">the drive times page</a>.
      </p>

      <p>If you want the answer before the detail, it is one of these five:</p>

      <ul>
        <li><strong>El Portal</strong> if the drive is the thing to shorten: first light in the Valley, or a winter trip on the lowest, most reliable road.</li>
        <li><strong>Mariposa</strong> if you want a real town at the end of the day, more than one price point, and a year-round road. The default answer for a first trip.</li>
        <li><strong>Groveland</strong> if you are coming from the Bay Area, want a smaller and cheaper town with more character than Oakhurst, or Hetch Hetchy is on the list.</li>
        <li><strong>Oakhurst</strong> if the Mariposa Grove and Wawona are the point, you are driving up from Los Angeles or Fresno, or you want predictable chain lodging and a full-size supermarket.</li>
        <li><strong>Lee Vining</strong> if Tioga Road is open and the high country is the trip. It is not a Valley base, and choosing it as one is the single most common mistake on this list.</li>
      </ul>

      <TownPicker />

      <p>Now the towns themselves.</p>

      <h2 id="sec-1-el-portal">El Portal</h2>

      <TownFacts rows={[
        ["Valley drive", "about 14 miles, 25 to 35 minutes"],
        ["Entrance", "Arch Rock, a few miles up the road"],
        ["Road", "Highway 140, open year-round"],
        ["Elevation", "about 1,900 feet, the lowest of the five"],
        ["The town", "a small park-adjacent settlement: riverside lodges, a market, a 24-hour gas station"],
      ]} />

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
        El Portal is the closest gateway to the Valley by a significant margin, and it exists because of Yosemite: a handful of lodges (the Yosemite View Lodge, the Cedar Lodge) along the Merced River, the gas station, a small market, and not much else. The lodging is priced like in-park lodging because the location is that good.
      </p>

      <p>Why people pick it:</p>
      <ul>
        <li>The shortest possible drive to anywhere in the Valley. Roll out of bed at 5:30 a.m. and be at Tunnel View by 6:15.</li>
        <li>The approach itself, up the Merced River canyon, is one of the most beautiful drives to any national park, and in spring the high water and wildflowers are their own attraction.</li>
        <li>Highway 140 is the lowest-elevation entry to the park and the most reliable in winter.</li>
      </ul>

      <p>Why they regret it:</p>
      <ul>
        <li>Dining and shopping are minimal. You will drive to Mariposa for variety.</li>
        <li>Tiny inventory: it books up early and stays expensive all summer.</li>
        <li>The riverside lodges have river noise. A feature for some people, a bug for others.</li>
      </ul>

      <p>
        <strong>Services:</strong> the gas station and market matter more than they look, because there is no gas station anywhere in Yosemite Valley; the in-park pumps are at Crane Flat and Wawona, both well off the Valley floor. Groceries here are convenience-store groceries, so buy the week's food in Mariposa on the way in.
      </p>

      <p>
        <strong>Pick El Portal</strong> if being inside the park as much as possible is the top priority: sunrise photography, peak-period crowd avoidance, a short Valley-focused trip, or any winter trip where road reliability matters. <strong>Skip it</strong> if you want a choice of dinner, are booking late in summer, or are travelling with people who will be back at the room by mid-afternoon. There is very little to do in El Portal that is not the park.
      </p>

      {townAvailability("El Portal", "El Portal, California")}

      <h2 id="sec-2-mariposa">Mariposa</h2>

      <TownFacts rows={[
        ["Valley drive", "about 45 miles, 45 minutes to an hour"],
        ["Entrance", "Arch Rock, via El Portal"],
        ["Road", "Highway 140, open year-round"],
        ["Elevation", "about 2,000 feet"],
        ["The town", "historic gold-rush county seat, the most full-service of the five"],
      ]} />

      <p>
        Mariposa is the most complete of the western gateways: a real downtown with restaurants, bars, coffee, a couple of bookstores, the Mariposa Museum and History Center (genuinely worth a visit), the 1854 Mariposa County Courthouse (the oldest continuously operating courthouse west of the Rockies), and lodging from chain hotels on the highway to historic bed-and-breakfasts in town. It's also where a lot of <a href="/articles/working-in-yosemite">people who work in the park</a> end up when they age out of in-park staff housing.
      </p>

      <p>Why people pick it:</p>
      <ul>
        <li>Real food, real coffee, multiple grocery stores, a real town.</li>
        <li>The widest range of price points of any gateway, budget motel to upscale country inn.</li>
        <li>Year-round access on the same beautiful Merced canyon route as El Portal, just longer.</li>
      </ul>

      <p>Why they regret it:</p>
      <ul>
        <li>At least 90 minutes of round-trip driving per day, which means earlier wake-ups for sunrise and tighter evening returns.</li>
        <li>In summer traffic the drive can stretch well past the hour.</li>
      </ul>

      <p>
        <strong>Services:</strong> the deepest of the five. Full-size supermarkets, a pharmacy, hardware, banks, and the last reliable place to fix a problem before you are an hour from anywhere. It is also the only gateway with year-round bus service into the park: YARTS runs the Highway 140 corridor from Merced and Mariposa all year, while the routes from the other towns run only in summer. If there is any chance you would rather not drive the canyon in the dark or in snow, no other town on this list can match that in January. Halfway to El Portal, the hamlet of Midpines splits the difference with a few camps and lodges (the Yosemite Bug among them) and no town attached.
      </p>

      <p>
        <strong>Pick Mariposa</strong> if you are most first-time visitors: families, anyone who values a real town in the evening, anyone on a budget, and anyone visiting in shoulder season or winter when El Portal and in-park rooms are gone.
      </p>

      {townAvailability("Mariposa", "Mariposa, California")}

      <h2 id="sec-3-oakhurst">Oakhurst</h2>

      <TownFacts rows={[
        ["Valley drive", "about 50 miles, 75 to 90 minutes"],
        ["South Entrance", "about 14 miles, 20 to 25 minutes; the Mariposa Grove is immediately inside the gate, Wawona six miles on"],
        ["Road", "Highway 41, open year-round"],
        ["Elevation", "about 2,300 feet"],
        ["The town", "a regional commercial hub: chain hotels, chain dining, big-box services"],
      ]} />

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
        Oakhurst is the largest gateway by population and amenities, with more chain lodging and chain dining than the other four combined. It feels like a regular Central California town that happens to be near a national park rather than a town that exists because of one.
      </p>

      <p>Why people pick it:</p>
      <ul>
        <li>Fast access to Wawona and the Mariposa Grove of giant sequoias.</li>
        <li>Predictable chain rooms at predictable prices, bookable late.</li>
        <li>The widest range of standard amenities of any gateway: chain supermarkets, national pharmacies, urgent care. The easiest of the five towns to fill a prescription or replace forgotten gear in.</li>
      </ul>

      <p>Why they regret it:</p>
      <ul>
        <li>The longest Valley drive of any gateway. 75 to 90 minutes each way means three hours of driving on a Valley-focused day, and people underestimate it until the third morning.</li>
        <li>Less character than Mariposa or Groveland, if the gateway-town atmosphere is part of your trip.</li>
        <li>Highway 41 climbs over a ridge and descends into Wawona before reaching the Valley: longer and more winding than 140.</li>
      </ul>

      <p>
        <strong>The closer option on this corridor:</strong> Fish Camp, twelve miles up the road at the park line, puts you four minutes from the South Entrance. It is the Tenaya resort complex and a few small inns at resort prices, trading Oakhurst's services for the setting.
      </p>

      <p>
        <strong>Pick Oakhurst</strong> if the itinerary centers on the Mariposa Grove and Wawona, if you want chain predictability, or if you are driving up from Los Angeles or Fresno, since it sits on the natural path. <strong>Skip it</strong> if the trip is really a Yosemite Valley trip. Three hours a day in the car is the price.
      </p>

      {townAvailability("Oakhurst", "Oakhurst, California")}

      <p>
        One current note for this side of the park: the Wawona Hotel, the historic in-park option just inside the South Entrance, has been closed since December 2024, and the Park Service has said it stays closed for this visitor season to complete electrical repairs and upgrades. No reopening date has been announced. That removes the in-park alternative on the Highway 41 corridor and puts more pressure on Oakhurst and Fish Camp rooms in summer. Book earlier than you think you need to.
      </p>

      <h2 id="sec-4-groveland">Groveland</h2>

      <TownFacts rows={[
        ["Valley drive", "about 41 miles, 65 to 80 minutes"],
        ["Entrance", "Big Oak Flat, about 24 miles, 30 to 40 winding minutes"],
        ["Road", "Highway 120, chain controls common in winter"],
        ["Elevation", "about 3,100 feet, the highest of the western gateways"],
        ["The town", "a small historic gold-rush main street with strong personality"],
      ]} />

      <p>
        Groveland is the underrated gateway: a historic main street with the <strong>Groveland Hotel</strong>, the <strong>Iron Door Saloon</strong> (one of the oldest continuously operating saloons in California), and the kind of small-town character Mariposa has, at a smaller scale and with a different flavor.
      </p>

      <p>Why people pick it:</p>
      <ul>
        <li>A genuinely charming town that's worth time on its own. The Iron Door is a destination.</li>
        <li>Less crowded and often cheaper than Mariposa or El Portal, with easier last-minute rooms in shoulder seasons.</li>
        <li>The best position for Hetch Hetchy, the Tuolumne side of the park, and Tuolumne Meadows when Tioga Road is open.</li>
      </ul>

      <p>Why they regret it:</p>
      <ul>
        <li>The drive to the Valley starts a thousand feet higher than the 140 towns, and chain controls are common in winter.</li>
        <li>The route passes through the 2013 Rim Fire burn scar, recovering but still visually different from the Highway 140 approach.</li>
        <li>Fewer total lodging options than Mariposa, and a town that closes early.</li>
      </ul>

      <p>
        <strong>Services:</strong> a market rather than a supermarket, gas, and that is close to the list. Groveland is the last town of any size on Highway 120 before the entrance; the nearest in-park pumps are at Crane Flat. Fill the tank and the cooler here, or in Oakdale or Sonora on the way in from the Bay Area, before you start climbing.
      </p>

      <p>
        <strong>If Hetch Hetchy is your reason:</strong> the road in is open daylight hours only, so it is not a sunset destination, and vehicles over 25 feet are not allowed on it. From November through March it can close entirely or require chains, which is precisely the season a low-elevation reservoir hike sounds most appealing. Check before you commit a day.
      </p>

      <p>
        <strong>Pick Groveland</strong> for gateway-town character, for Hetch Hetchy and the northern park, or as the natural base on the route from the Bay Area. <strong>Skip it</strong> for a deep-winter trip without snow-driving experience or chains in the trunk, or if you need real services at nine in the evening.
      </p>

      {townAvailability("Groveland", "Groveland, California")}

      <h2 id="sec-5-lee-vining">Lee Vining</h2>

      <TownFacts rows={[
        ["Valley drive", "about 75 miles over Tioga Pass, 90 minutes minimum, summer only"],
        ["Tuolumne Meadows", "about 20 miles, 30 minutes"],
        ["Mono Lake", "5 minutes to the visitor center, 15 to South Tufa"],
        ["Road", "Highway 120 East over Tioga Pass, seasonal; US 395 year-round"],
        ["Elevation", "about 6,800 feet, and the pass above town just under 10,000"],
        ["The town", "a tiny eastern Sierra outpost between Mono Lake and the pass"],
      ]} />

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
        Lee Vining is the only east-side gateway, and it is not a substitute for the western towns. It is a different kind of trip. Tuolumne Meadows is 30 minutes away when Tioga Road is open (typically late May or June through October or early November; the Park Service opened it on May 15 in 2026, the earliest in sixteen years, and it is open now), while the Valley is over an hour and a half each way. Lodging is a few small motels (the <strong>Yosemite Gateway Motel</strong>, the <strong>El Mono Motel</strong>, an inn or two). Dining is thin but includes the famously good Whoa Nellie Deli at the Mobil station, which is genuinely some of the best food in the eastern Sierra.
      </p>

      <p>Why people pick it:</p>
      <ul>
        <li>Direct access to Tuolumne Meadows and the high country in season, with far fewer crowds.</li>
        <li>Mono Lake next door, and an entirely different landscape: sagebrush, alkali, the Mono Basin, unlike anything west of the park.</li>
        <li>A natural stop on a longer eastern Sierra trip (Mammoth Lakes, Bishop, Death Valley).</li>
      </ul>

      <p>Why they regret it:</p>
      <ul>
        <li>When Tioga Pass is closed there is no crossing at all: the drive around the south end of the Sierra turns 90 minutes into most of a day. The Park Service publishes the detour, and it is the first thing to read if your dates are anywhere near the shoulders.</li>
        <li>Limited rooms and food, so you book early and pay a summer premium.</li>
        <li>The Valley run crosses a near-10,000-foot pass, punishing in bad weather.</li>
      </ul>

      <p>
        <strong>Services:</strong> thin, and seasonal on top of thin. The Tioga Gas Mart, which is also the Whoa Nellie Deli, runs roughly late April to late October, so the town's best-known meal is not available on a winter Mono Lake trip. Groceries are a small market; the nearest full supermarket is in Mammoth Lakes, about 30 miles south. Fuel on 395 is reliable but expensive, so fill up in Bishop or Bridgeport if you pass through either.
      </p>

      <p>
        <strong>Pick Lee Vining</strong> if the high country is the trip (Tuolumne, Cathedral Lakes, Mount Dana, the Tioga Road itself), or if you are combining Yosemite with Mono Lake and the eastern Sierra. <strong>Skip it</strong> if your itinerary names Yosemite Falls, Half Dome, or Tunnel View. Those are Valley sights, three hours round trip from here over a pass that is not open when you are likely to want it.
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
        <strong>Distance affects more than driving time.</strong> The further your gateway, the earlier you leave to beat the crowds: a 60-minute drive at 5:30 a.m. is easier than a 90-minute drive at 4:30. The Park Service is not requiring a season-wide vehicle reservation for 2026 and is managing peak days with traffic monitoring and active parking control in the Valley instead, which is good news for spontaneity and bad news for anyone arriving at ten. Every mile between your room and the entrance station is a mile you make up before the lots fill.
      </p>

      <p>
        <strong>Gas.</strong> There is no gas station in Yosemite Valley. The in-park pumps are at Crane Flat, year-round with pay-at-the-pump around the clock, and at Wawona, where the store keeps daytime hours but the pumps also take a card overnight. Outside the park, the El Portal station is the last stop on Highway 140. Arriving in the Valley on a quarter tank is a bad plan in any season and a genuinely bad one in winter, when engines idle in stopped traffic.
      </p>

      <p>
        <strong>Groceries.</strong> Mariposa and Oakhurst have full-size supermarkets. Groveland has a market. El Portal and Lee Vining have convenience-scale markets and nothing more. Whichever town you pick, do the real shop in Mariposa or Oakhurst on the way in, because in-park food is limited, expensive, and keeps shorter hours than you expect. See <a href="/articles/pack-your-car-for-yosemite">how to pack your car for a Yosemite trip</a>.
      </p>

      <p>
        <strong>Cell service.</strong> Patchy in all five gateways and unreliable to nonexistent through most of the park, including long stretches of the approach roads. Download the offline map for the whole region before you leave the gateway town, screenshot your reservation details, and agree on a meeting point with anyone you might get separated from. Do not rely on real-time navigation past the entrance station.
      </p>

      <p>
        <strong>You can arrive without a car, from one town.</strong> YARTS runs the Highway 140 corridor from Merced and Mariposa all year. The routes from Sonora and Groveland on 120, from Oakhurst on 41, and from Mammoth Lakes and Lee Vining on 395 are summer-only. A car-free trip narrows the gateway choice to one corridor for most of the year.
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
        Pick based on your trip's center of gravity. If your trip is mostly Yosemite Valley, base in the west. If it's mostly the high country, consider the east. If it's the giant sequoias, go south. That's the decision. Make it once, well, and the rest of your trip gets easier.
      </p>

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
