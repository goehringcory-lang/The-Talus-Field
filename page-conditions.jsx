/* global React, WebcamStrip, EntranceWaits, ParkingNow, HomeLink, HpPageHead, HpHeading, HpGuideBand, HpLetter */

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

// ── The elevation profile ───────────────────────────────────────────────────
// A transect along the park roads, Wawona to Tioga Pass. Only four heights on
// it are data (the three stations and the pass), and those sit to scale; the
// terrain between them is drawn, and the caption says so, because rule (1)
// covers pictures too. The line between stations follows the real shape of
// the drive (the climb over Chinquapin, the drop to the Valley floor, Crane
// Flat at about 6,200 feet, then the long rise to Tuolumne) without claiming
// any height the page does not print.
//
// Two layouts, each authored at a base width and stretched horizontally only,
// so text, strokes and the hatch stay at their drawn pixel size at any width:
// `wide` puts each station over its card's column, `compact` sits above a
// stacked card list. Every station's x in a layout is a point on its path, so
// changing a station means changing both.
const CONDITIONS_ELEV_LAYOUTS = {
  wide: {
    width: 1136,
    top: -28,
    base: 300,
    pxPerFt: 0.035,
    start: [64, 246],
    // Cubic segments, each [c1, c2, end]; segments from `highFrom` on are the
    // high country and are drawn over in the accent.
    path: [
      [[110, 242], [150, 232], [181, 230]],
      [[230, 227], [280, 162], [330, 160]],
      [[390, 158], [480, 228], [568, 230]],
      [[620, 231], [640, 170], [680, 154]],
      [[740, 130], [800, 86], [860, 80]],
      [[900, 76], [930, 71], [955, 69]],
      [[1010, 64], [1060, 30], [1090, 22]],
      [[1110, 18], [1125, 24], [1136, 30]],
    ],
    highFrom: 5,
    stationX: [181, 568, 955],
    passX: 1090,
    grid: [
      { ft: 10000, label: "10,000 ft" },
      { ft: 8000, label: "8,000 ft" },
      { ft: 6000, label: "6,000 ft" },
      { ft: 4000, label: "4,000 ft" },
      { ft: 2000, label: "2,000 ft" },
    ],
    tag: { w: 88, h: 22, top: [150, 150, 26], text: (i, f) => `0${i + 1} · ${f.elevationFt.toLocaleString("en-US")}` },
    pinR: 6,
    tri: 6,
    passLabel: `Tioga Pass ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} ft`,
    passLabelDx: -14,
    passLabelY: -8,
    bracketX: 905,
    note: { side: "left", w: 174, h: 54, y: 168, big: 196, small: [214], smallText: ["15 to 25 degrees colder"] },
  },
  compact: {
    width: 358,
    top: -14,
    base: 170,
    pxPerFt: 0.02,
    start: [22, 136],
    path: [
      [[36, 134], [46, 131], [56, 130]],
      [[74, 128], [90, 92], [104, 91]],
      [[124, 90], [142, 129], [158, 130]],
      [[172, 131], [180, 100], [192, 92]],
      [[214, 78], [240, 50], [258, 46]],
      [[268, 43], [275, 40], [282, 38]],
      [[300, 34], [320, 16], [334, 11]],
      [[342, 9], [350, 12], [358, 15]],
    ],
    highFrom: 5,
    stationX: [56, 158, 282],
    passX: 334,
    grid: [
      { ft: 10000, label: "" },
      { ft: 8000, label: "8k" },
      { ft: 6000, label: "6k" },
      { ft: 4000, label: "4k" },
      { ft: 2000, label: "2k ft" },
    ],
    tag: { w: 24, h: 16, top: [70, 70, 7], text: (i) => `0${i + 1}` },
    pinR: 4.5,
    tri: 5,
    passLabel: `Tioga Pass ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")}`,
    passLabelDx: -10,
    passLabelY: 0,
    bracketX: 246,
    note: { side: "right", w: 80, h: 50, y: 72, big: 91, small: [104, 115], smallText: ["15 to 25°", "colder"] },
  },
};

// Below this container width the wide layout's labels start to crowd the
// line (the +4,600 plate reaches the Crane Flat climb), so it hands over to
// the compact one, which is drawn for a phone and only ever gets wider. The
// station flags sit at a fixed height (`tag.top`, one per station) above the
// humps either side of each pin, with a stem down to it, so a narrower
// container cannot push the line up into them. Both were swept from 280px to
// 1280px against the sampled curve when this was drawn; re-sweep if the path,
// a flag or the plate moves.
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
  const L = CONDITIONS_ELEV_LAYOUTS[mode];
  const s = width / L.width;
  const X = (x) => +(x * s).toFixed(1);
  const Y = (ft) => +(L.base - (ft - 2000) * L.pxPerFt).toFixed(1);
  const pt = ([x, y]) => `${X(x)} ${y}`;
  const segs = (from) => L.path.slice(from).map((seg) => `C ${seg.map(pt).join(", ")}`).join(" ");
  const line = `M ${pt(L.start)} ${segs(0)}`;
  const high = `M ${pt(L.path[L.highFrom - 1][2])} ${segs(L.highFrom)}`;
  const [lowF, , highF] = CONDITIONS_FORECASTS;
  const floorY = Y(lowF.elevationFt);
  const highY = Y(highF.elevationFt);
  const riseFt = highF.elevationFt - lowF.elevationFt;
  const bx = X(L.bracketX);
  const n = L.note;
  const noteX = n.side === "left" ? bx - 13 - n.w : bx + 7;
  const noteTextX = n.side === "left" ? bx - 15 : bx + 12;
  const noteAnchor = n.side === "left" ? "end" : "start";
  const passX = X(L.passX);
  const passY = Y(CONDITIONS_TIOGA_FT);
  const height = L.base - L.top;

  const summary =
    `Elevation profile along the park roads: ${CONDITIONS_FORECASTS.map((f) => `${f.label} at ${f.elevationFt.toLocaleString("en-US")} feet`).join(", ")}. ` +
    `Tuolumne Meadows sits ${riseFt.toLocaleString("en-US")} feet above the Valley, and Tioga Pass tops the road at ${CONDITIONS_TIOGA_FT.toLocaleString("en-US")} feet.`;

  return (
    <div className={`elev elev--${mode}`} ref={ref}>
      <div className="elev__caption">
        <span className="elev__title">{mode === "wide" ? "Elevation along the park roads, Wawona to Tioga Pass" : "Elevation, Wawona to Tioga Pass"}</span>
        <span className="elev__scale">Station heights to scale. Terrain between them is schematic.</span>
      </div>

      <svg
        className="elev__svg"
        viewBox={`0 ${L.top} ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={summary}
      >
        <defs>
          <pattern id="cond-elev-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line className="elev__hatch" x1="0" y1="0" x2="0" y2="6" />
          </pattern>
        </defs>

        {L.grid.map((g) => (
          <g key={g.ft}>
            {g.ft !== 2000 && <line className="elev__gridline" x1="0" y1={Y(g.ft)} x2={width} y2={Y(g.ft)} />}
            {g.label && <text className="elev__gridlabel" x="0" y={Y(g.ft) - 6}>{g.label}</text>}
          </g>
        ))}

        <path className="elev__fill" d={`${line} L ${width} ${L.base} L ${X(L.start[0])} ${L.base} Z`} />
        <line className="elev__datum" x1={X(L.start[0])} y1={floorY} x2={width} y2={floorY} />
        <path className="elev__line" d={line} />
        <path className="elev__line elev__line--high" d={high} />
        <line className="elev__baseline" x1="0" y1={L.base} x2={width} y2={L.base} />

        {CONDITIONS_FORECASTS.map((f, i) => (
          <line key={f.label} className="elev__drop" x1={X(L.stationX[i])} y1={Y(f.elevationFt)} x2={X(L.stationX[i])} y2={L.base} />
        ))}

        <g className="elev__dim">
          <line x1={bx} y1={highY} x2={bx} y2={floorY} />
          <line x1={bx - 8} y1={highY} x2={bx + 8} y2={highY} />
          <line x1={bx - 8} y1={floorY} x2={bx + 8} y2={floorY} />
        </g>
        <rect className="elev__plate" x={noteX} y={n.y} width={n.w} height={n.h} />
        <text className="elev__rise" x={noteTextX} y={n.big} textAnchor={noteAnchor}>+{riseFt.toLocaleString("en-US")} ft</text>
        {n.smallText.map((t, i) => (
          <text key={t} className="elev__risenote" x={noteTextX} y={n.small[i]} textAnchor={noteAnchor}>{t}</text>
        ))}

        <path className="elev__pass" d={`M ${passX} ${passY - L.tri} L ${passX + L.tri} ${passY + L.tri * 0.7} L ${passX - L.tri} ${passY + L.tri * 0.7} Z`} />
        <text className="elev__passlabel" x={passX + L.passLabelDx} y={L.passLabelY} textAnchor="end">{L.passLabel}</text>

        {CONDITIONS_FORECASTS.map((f, i) => {
          const x = X(L.stationX[i]);
          const y = Y(f.elevationFt);
          const hi = f.elevationFt >= 6000;
          return (
            <g key={f.label} className={`elev__station${hi ? " elev__station--high" : ""}`}>
              <line className="elev__stem" x1={x} y1={L.tag.top[i] + L.tag.h} x2={x} y2={y - L.pinR} />
              <rect className="elev__tag" x={x - L.tag.w / 2} y={L.tag.top[i]} width={L.tag.w} height={L.tag.h} rx={L.tag.h / 2} />
              <text className="elev__tagtext" x={x} y={L.tag.top[i] + L.tag.h / 2 + 3.5} textAnchor="middle">{L.tag.text(i, f)}</text>
              <circle className="elev__pin" cx={x} cy={y} r={L.pinR} />
            </g>
          );
        })}
      </svg>

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
        <p className="readout__quiet">The park's live feeds are quiet right now. Everything below still links straight to the source.</p>
      )}
      <p className="readout__foot">National Park Service. Both readings refresh every five minutes.</p>
    </aside>
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
        intro="Live webcams, entrance waits, and the forecasts that matter, on one page. Check it the morning you drive in, not the week before: Yosemite changes faster than a booking window."
        actions={<>
          <HomeLink go={go} location="conditions_hero" className="hp-button" href="#cond-waits">Entrance waits &nbsp; ↓</HomeLink>
          <HomeLink go={go} location="conditions_hero" className="hp-link" href="#cond-roads">Roads and closures ↓</HomeLink>
        </>}
        aside={<ConditionsReadout waits={waits} lots={lots} />}
      />

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
            Road status changes faster than any page can promise, this one included, so nothing here claims to know whether a gate is open. These three do.
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
        intro="Most of the park has no signal. The Field Guide app is built for exactly that: offline maps, 50-plus stops with parking and timing notes, and a trip planner that works from the trailhead."
        sample
      />
      <HpLetter
        eyebrow="ROAD ALERTS / FREE"
        title="Email me when a road changes"
        heading="Email me when a road changes"
        blurb="One email when Tioga Road, Glacier Point Road, or a highway into the park opens or closes, sent to the people who asked for it. The Sunday note carries the rest of the week from inside the park. Free."
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
