/* global React, ResponsiveImage, WebcamStrip, EntranceWaits, ParkingNow, HomeLink, HpPageHead, HpHeading, HpGuideBand, HpLetter, RecommendedCard, AffiliateDisclosure */

// =============================================================================
// CONDITIONS — `/conditions` route. The bookmarkable "is it worth driving in
// today" page, laid out as a station board: the answer at the top, then every
// reading below it with its source and its age.
//
// Three rules hold the page up.
//
// (1) NOTHING ON THIS PAGE ASSERTS A CONDITION THE SITE HAS NOT READ. The two
//     live feeds are the NPS entrance waits and the NPS parking lots, both
//     mounted through the shared components in their `variant="board"` form
//     and both silent rather than wrong when the feed is. Everything else here
//     is either a standing fact (an elevation, a phone number, which road a
//     gate sits on) or a link to whoever does know. That is why the roads
//     block is a list of sources and not a table of statuses: a hardcoded
//     "Tioga Road: open" is correct for about six months a year and is the
//     exact failure this site exists to prevent.
//
// (2) The readout plate at the top does not fetch anything. It is fed by the
//     `onData` digests the two feed components already produce, so the page
//     shows one reading per feed, not two requests per feed.
//
// (3) The elevation chart is drawn from the elevations, which are facts, not
//     from temperatures, which the editorial site does not carry. The API
//     Worker's /api/weather could fill these cards with live highs and lows,
//     but its four spots are the Field Guide's regions (Valley, Glacier Point,
//     Tuolumne, Hetch Hetchy) and adopting them would drop Wawona from this
//     page. That is an editorial call, not a rendering one.
//
// Every link out is external and measured by the delegated outbound_click
// listener in app.jsx, so there is no tracking markup here.
//
// Since September 2026 the board is built on the homepage's design system
// (the Hp* components in components.jsx): a design page head with the readout as
// its aside, one design section per reading, and the shared Field Guide band
// and letter for the two asks.
// =============================================================================

const { useState, useMemo, useCallback, useRef: useRefC, useLayoutEffect: useLayoutEffectC } = React;

// The three point forecasts, west to east along the park roads, which is the
// order the elevation profile draws them: the two 4,000-foot stations, then
// the high country that is the whole reason this section exists. Notes are the
// page's existing published copy; lat/lon are the NWS point each link opens,
// and the card prints them, so the forecast URL is built from them rather than
// kept as a second copy.
const CONDITIONS_FORECASTS = [
  {
    label: "Wawona",
    elevationFt: 4000,
    note: "The south end of the park, near Mariposa Grove.",
    lat: 37.5341,
    lon: -119.6315,
  },
  {
    label: "Yosemite Valley",
    elevationFt: 4000,
    note: "The floor: most lodging, most trailheads, most of your walking.",
    lat: 37.7456,
    lon: -119.5936,
  },
  {
    label: "Tuolumne Meadows",
    elevationFt: 8600,
    note: "The high country runs 15 to 25 degrees colder than the Valley.",
    lat: 37.8731,
    lon: -119.3503,
  },
];

// Tioga Pass tops the road, and the chart marks it as the ceiling of the
// scale. The figure is the one the site's articles publish.
const CONDITIONS_TIOGA_FT = 9945;

// ── The forecast stations on the park map ──────────────────────────────────
// The National Park Service's own park map (the whole of img/nps-yosemite-
// park-map.jpg, so the overlay shares its 1920 x 1970 pixel space) with the
// three forecast points pinned where their coordinates fall on it. The pixel
// positions come from a linear fit of the map's labelled places (Valley
// Visitor Center, Wawona Visitor Center, Tuolumne Meadows, Tioga Pass
// Entrance; about 0.00047 degrees of longitude and 0.00037 of latitude per
// pixel) and were checked against each place's own label. Heights are on the
// cards below, never drawn: an earlier version of this section drew terrain
// between the stations, and no drawn terrain belongs on the page.
const CONDITIONS_MAP_PINS = [
  { x: 594, y: 1762 },
  { x: 541, y: 1263 },
  { x: 1193, y: 846 },
];
const CONDITIONS_MAP_PASS = { x: 1395, y: 752 };

const CONDITIONS_ELEV_WIDE_MIN = 900;

function conditionsForecastUrl(f) {
  return `https://forecast.weather.gov/MapClick.php?lat=${f.lat}&lon=${f.lon}`;
}

function conditionsCoords(f) {
  return `${f.lat.toFixed(2)}° N · ${Math.abs(f.lon).toFixed(2)}° W`;
}

function ConditionsElevation() {
  const ref = useRefC(null);
  // A first guess from the window so the first paint is already the right
  // layout; the layout effect replaces it with the measured width before the
  // browser paints.
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1136 : Math.min(1280, Math.max(280, window.innerWidth - 64))
  );

  useLayoutEffectC(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setWidth(w);
    };
    read();
    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const mode = width >= CONDITIONS_ELEV_WIDE_MIN ? "wide" : "compact";
  const riseFt = CONDITIONS_FORECASTS[2].elevationFt - CONDITIONS_FORECASTS[0].elevationFt;
  const summary =
    `The park map with the three forecast points marked: ${CONDITIONS_FORECASTS.map((f, i) => `${i + 1}, ${f.label} at ${f.elevationFt.toLocaleString("en-US")} feet`).join("; ")}. ` +
    `Tioga Pass tops the road at ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} feet.`;

  return (
    <div className={`elev elev--${mode}`} ref={ref}>
      <figure className="npsmap">
        <div className="npsmap__frame">
          <ResponsiveImage image="img/nps-yosemite-park-map.jpg" alt="The National Park Service's official map of Yosemite National Park." sizes="(max-width: 760px) 100vw, 720px" />
          <svg viewBox="0 0 1920 1970" role="img" aria-label={summary}>
            {CONDITIONS_MAP_PINS.map((pt, i) => (
              <g key={CONDITIONS_FORECASTS[i].label}>
                <circle className={`npsmap__pin ${CONDITIONS_FORECASTS[i].elevationFt >= 6000 ? "npsmap__pin--rust" : "npsmap__pin--ink"}`} cx={pt.x} cy={pt.y} r="38" strokeWidth="8" />
                <text className="npsmap__num" x={pt.x} y={pt.y + 16} textAnchor="middle" style={{ fontSize: 44 }}>{i + 1}</text>
              </g>
            ))}
            <path className="npsmap__pin npsmap__pin--ink" d={`M ${CONDITIONS_MAP_PASS.x} ${CONDITIONS_MAP_PASS.y - 40} L ${CONDITIONS_MAP_PASS.x + 40} ${CONDITIONS_MAP_PASS.y + 30} L ${CONDITIONS_MAP_PASS.x - 40} ${CONDITIONS_MAP_PASS.y + 30} Z`} strokeWidth="8" strokeLinejoin="round" />
          </svg>
        </div>
        <figcaption>
          {CONDITIONS_FORECASTS.map((f, i) => (
            <span key={f.label}><b>{i + 1}</b> {f.label}, {f.elevationFt.toLocaleString("en-US")} ft</span>
          ))}
          <span>▲ Tioga Pass, {CONDITIONS_TIOGA_FT.toLocaleString("en-US")} ft, the top of the road. Tuolumne Meadows sits {riseFt.toLocaleString("en-US")} ft above the Wawona and Valley stations. Map: National Park Service (public domain).</span>
        </figcaption>
      </figure>

      <div className="elev__cards">
        {CONDITIONS_FORECASTS.map((f, i) => {
          const hi = f.elevationFt >= 6000;
          return (
            <article key={f.label} className={`fc${hi ? " fc--high" : ""}`}>
              <div className="fc__meta">
                <span className="fc__num">0{i + 1}</span>
                <span className="fc__coords">{conditionsCoords(f)}</span>
              </div>
              <div className="fc__head">
                <h3 className="fc__name">{f.label}</h3>
                <div className="fc__elev">
                  <span className="fc__ft">{f.elevationFt.toLocaleString("en-US")}</span>
                  <span className="fc__unit">ft</span>
                </div>
              </div>
              <p className="fc__note">{f.note}</p>
              <a className="fc__link" href={conditionsForecastUrl(f)} target="_blank" rel="noopener noreferrer">
                Point forecast
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 L9 3 M4.5 3 H9 V7.5" /></svg>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ── The live readout ────────────────────────────────────────────────────────
// One plate, two readings, fed by the digests the feed components hand up.
// Each row appears only once its own feed has answered; when neither has, the
// plate keeps the date and says plainly that it has nothing, because an empty
// dashboard that looks populated is worse than one that admits it is empty.
function ConditionsReadout({ waits, lots }) {
  const today = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    } catch (e) {
      return "";
    }
  }, []);

  const rows = [];
  if (waits && waits.longest) {
    rows.push({
      key: "waits",
      label: "Longest gate wait",
      value: waits.longest.text,
      detail: waits.longest.name,
      tone: waits.longest.tone,
    });
  }
  if (lots && lots.total) {
    rows.push({
      key: "lots",
      label: "Lots open",
      value: `${lots.open} of ${lots.total}`,
      detail: lots.open === 0 ? "All full" : null,
      tone: lots.open === 0 ? "long" : "good",
    });
  }

  return (
    <aside className="readout" aria-label="Live readings">
      <div className="readout__top">
        <span className="eyebrow readout__eyebrow">Live readings</span>
        <span className="readout__pulse"><span className="readout__dot" aria-hidden="true" />Now</span>
      </div>
      {today && <div className="readout__date">{today}</div>}
      {rows.length ? (
        <ul className="readout__list">
          {rows.map((row) => (
            <li key={row.key} className="readout__row">
              <span className="readout__label">
                {row.label}
                {row.detail && <span className="readout__detail">{row.detail}</span>}
              </span>
              <span className={`readout__value readout__value--${row.tone}`}>{row.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="readout__quiet">No live numbers from the park right now. Everything below still links straight to the park's own pages.</p>
      )}
      <p className="readout__foot">National Park Service. Both readings refresh every five minutes.</p>
    </aside>
  );
}

// What the season calls for, under the forecasts. Keyed to the park's month
// in America/Los_Angeles (the same rule as /stay's season note), never to a
// reading: the page asserts no condition it has not read (rule 1 in the
// CLAUDE.md bullet), and what a month calls for is a standing fact. Every line
// restates advice the site already publishes (the kit, /firefall, the winter,
// Tioga, Clouds Rest, Mist Trail and October pieces); an item Patagonia does
// not carry stays linkless rather than pointing at something else.
const COND_SEASON_KIT = [
  {
    id: "winter", months: [12, 1, 2, 3], label: "Winter",
    items: [
      { id: "traction", what: "Traction cleats for your boots", why: "They prevent the most common winter injury in the park, a fall on a paved path." },
      { id: "chains", what: "Chains in the trunk", why: "When chain control is posted, every vehicle must carry them, four-wheel drives and rentals included." },
      { id: "insulated-jacket", what: "An insulated jacket", why: "Synthetic fill keeps working if the snow is wet.", q: "insulated jacket" },
      { id: "warm-hat", what: "A warm hat", why: "The cheapest fix for a cold evening.", q: "beanie" },
    ],
  },
  {
    id: "spring", months: [4, 5], label: "Spring",
    items: [
      { id: "rain-shell", what: "A rain jacket", why: "In May and June it keeps you warm on the Mist Trail, where the spray is heaviest.", q: "rain jacket" },
      { id: "puffy", what: "A puffy for the high roads", why: "When Tioga opens, temperatures swing 30 to 40 degrees between dawn and afternoon.", q: "insulated jacket" },
      { id: "boots", what: "Waterproof boots", why: "High trails stay wet, muddy, or partly snow-covered into early summer." },
    ],
  },
  {
    id: "summer", months: [6, 7, 8, 9], label: "Summer",
    items: [
      { id: "sun-hat", what: "A wide-brim sun hat", why: "Granite reflects. A baseball cap is not enough above 7,000 feet.", q: "sun hat" },
      { id: "sun-shirt", what: "A long-sleeve sun shirt", why: "Light color, hood if you can find it. Wear it even in heat.", q: "sun hoody" },
      { id: "rain-shell", what: "A packable rain shell", why: "Afternoon thunderstorms are common in the summer high country.", q: "rain jacket" },
      { id: "water", what: "Water, more than you think", why: "Two liters a person is a floor at elevation. The Four Mile and Yosemite Falls trails have none." },
    ],
  },
  {
    id: "autumn", months: [10, 11], label: "Autumn",
    items: [
      { id: "fleece", what: "A warm layer", why: "High points run 15 to 20 degrees cooler than the Valley floor, and windier.", q: "fleece" },
      { id: "headlamp", what: "A headlamp", why: "The days shorten fast; a hike that finished at dusk in September finishes in the dark." },
      { id: "chains", what: "Chains, from late October", why: "Storms are possible from late October, and chain control means every vehicle carries them." },
    ],
  },
];

function condParkMonth() {
  try {
    return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", month: "numeric" }).format(new Date()));
  } catch (_e) {
    return new Date().getMonth() + 1;
  }
}

function CondSeasonKit() {
  const month = condParkMonth();
  const season = COND_SEASON_KIT.find((x) => x.months.indexOf(month) !== -1) || COND_SEASON_KIT[2];
  return (
    <div className="cond-kit">
      <RecommendedCard
        heading={"What " + season.label.toLowerCase() + " calls for"}
        note="Dress for the highest point of your day, not the Valley floor."
        items={season.items}
        list="conditions_season_kit"
        slug={season.id}
      />
    </div>
  );
}

function ConditionsPage({ go }) {
  const [waits, setWaits] = useState(null);
  const [lots, setLots] = useState(null);
  // Stable identities: the feed components hold these in a ref and call them
  // from an effect, so a new function every render would be harmless but
  // pointless churn.
  const onWaits = useCallback((digest) => setWaits(digest), []);
  const onLots = useCallback((digest) => setLots(digest), []);

  return (
    <div className="page hp-design hp-conditions">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Conditions" }]}
        eyebrow="CONDITIONS / LIVE FROM THE PARK"
        title={<>The park,<br /><em>right now.</em></>}
        intro="Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before. Roads and crowds change faster than your plans do."
        actions={<>
          <HomeLink go={go} location="conditions_hero" className="hp-button" href="#cond-waits">Entrance waits &nbsp; ↓</HomeLink>
          <HomeLink go={go} location="conditions_hero" className="hp-link" href="#cond-roads">Roads and closures ↓</HomeLink>
        </>}
        aside={<ConditionsReadout waits={waits} lots={lots} />}
      >
        <AffiliateDisclosure>
          The seasonal gear list under the forecasts has Patagonia affiliate links. If you buy through one, The Talus Field may earn a commission at no extra cost to you.
        </AffiliateDisclosure>
      </HpPageHead>

      {/* Entrance waits. The board variant of the shared component: one
          column block per gate, with the wait set large enough to read at
          arm's length. Three gates, because three is what the NPS feed
          publishes. */}
      <section className="hp-wrap hp-section cond-section" id="cond-waits" tabIndex={-1}>
        <HpHeading go={go} location="conditions" eyebrow="01 / AT THE GATES" title="Entrance waits" link={{ href: "/planning", label: "Why the mornings matter ↗" }} />
        <p className="hp-sub">
          Live wait estimates from the National Park Service, refreshed every few minutes. Summer mornings the arch at Highway 140 backs up first; by ten, all of them do. If the numbers below are already climbing at eight, you wanted to be inside an hour ago.
        </p>
        <EntranceWaits variant="board" onData={onWaits} />
      </section>

      {/* Webcams. The strongest argument on the page is a picture of the
          weather, so the board variant runs them two up instead of four. */}
      <section className="hp-wrap hp-section cond-section">
        <HpHeading go={go} location="conditions" eyebrow="02 / SEE IT FOR YOURSELF" title="Webcams" link={{ href: "/webcams", label: "All cameras, and how to read them ↗" }} />
        <WebcamStrip variant="board" />
      </section>

      {/* Forecasts. The elevation chart is the point: two stations share the
          valley floor and one sits nearly a mile above them, which is the
          whole reason a single forecast for "Yosemite" is useless. */}
      <section className="hp-wrap hp-section cond-section">
        <HpHeading go={go} location="conditions" eyebrow="03 / THREE ELEVATIONS" title="Forecasts" link={{ href: "https://www.weather.gov/hnx/", label: "National Weather Service ↗" }} />
        <p className="hp-sub">
          The park spans 9,000 feet of elevation, so one forecast is never enough. These are National Weather Service point forecasts for the three places most trips actually go.
        </p>

        <ConditionsElevation />
        <CondSeasonKit />
      </section>

      {/* Parking and the sources for everything this page cannot read. */}
      <div className="hp-wrap hp-section cond-section cond-split">
        <section>
          <HpHeading eyebrow="04 / THE VALLEY LOTS" title="Parking lots" />
          <p className="hp-sub">
            With no entry reservation in 2026, the Valley's lots are what ration a summer day: on the first busy Saturday of the season all Valley parking was full before noon. Be through the gate before 8 a.m. or after 4 p.m. on a summer weekend. Live lot status from the National Park Service appears here when the park publishes it.
          </p>
          <ParkingNow variant="board" onData={onLots} />
        </section>

        <section id="cond-roads" tabIndex={-1}>
          <HpHeading eyebrow="05 / SOURCES, NOT GUESSES" title="Roads and closures" />
          <p className="hp-sub">
            Road status changes faster than any page can promise. For whether a gate is open right now, check these three.
          </p>
          <ul className="conditions__list">
            <li className="conditions__row">
              <a href="/now" onClick={(e) => { e.preventDefault(); go("now"); }}>The Park Bulletin</a>
              <span>Our own board: road and area status, alerts, and the free-program clock, rewritten each time the park publishes a new Yosemite Guide.</span>
            </li>
            <li className="conditions__row">
              <a href="https://www.nps.gov/yose/planyourvisit/conditions.htm" target="_blank" rel="noopener noreferrer">NPS current conditions ↗</a>
              <span>Road status, chain controls, trail closures, and campground status. The authoritative page.</span>
            </li>
            <li className="conditions__row">
              <a href="https://www.nps.gov/yose/planyourvisit/guide.htm" target="_blank" rel="noopener noreferrer">The Yosemite Guide ↗</a>
              <span>The park's own seasonal newspaper: shuttle maps, program schedules, hours.</span>
            </li>
          </ul>
          <p className="cond-note">
            For how conditions shape a plan, the{" "}
            <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>planning guide</a>{" "}
            covers the seasonal calendar, and the{" "}
            <a href="/itineraries" onClick={(e) => { e.preventDefault(); go("itineraries"); }}>itineraries</a>{" "}
            adjust to what is open.
          </p>
        </section>
      </div>

      {/* The recorded line. It outranks every website in winter and spring,
          including this one, so it gets the weight that says so. */}
      <div className="hp-wrap cond-dial">
        <a className="dialplate" href="tel:+12093720200">
          <span className="dialplate__copy">
            <span className="hp-eyebrow">When the web is wrong</span>
            <span className="dialplate__say">
              In winter and spring, call the recorded road line before trusting any website, including this one. It is read out by the people standing at the gates.
            </span>
          </span>
          <span className="dialplate__num">
            <span className="dialplate__digits">209-372-0200</span>
            <span className="dialplate__label">NPS recorded road line</span>
          </span>
        </a>
      </div>

      {/* The two asks, made once each, in the homepage's order: the paid
          thing first, the free one second. The honest angle for the guide is
          that this page, like most of the internet, stops working past the
          entrance station. */}
      <HpGuideBand
        go={go}
        location="conditions"
        title="Past the entrance, this page stops loading."
        intro="Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, every stop with parking and timing notes, and a trip planner that works from the trailhead."
        sample
      />
      {/* id: the masthead's Park now panel links here ("Get road alerts"). */}
      <HpLetter
        id="road-alerts"
        eyebrow="ROAD ALERTS / FREE"
        title="Email me when a road changes"
        heading="Email me when a road changes"
        blurb="One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. Sunday Field Notes carries the rest of the week from inside the park."
        location="conditions"
        tag="alert-roads"
        cta="Email me ↗"
        terms="Only when a road changes. Unsubscribe whenever."
        stamp="ROAD ALERTS"
        paper={<>Roads open.<br />Roads close.<br /><em>You hear once.</em></>}
      />
    </div>
  );
}

window.ConditionsPage = ConditionsPage;
