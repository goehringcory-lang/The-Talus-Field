/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, AvailabilityLink, HpGuideBand, HpLetter, AffiliateDisclosure, EventIcon, NatureNotesFilm */

// =============================================================================
// ITINERARIES — `/itineraries` route. The curated day plans from
// itineraries-data.js (window.ITINERARIES), with each stop's name, blurb and
// position resolved from points.geojson. Every plan ends in an "Open this
// trip on the map" link built as a real /map?trip= URL: the map page parses
// ?trip= on load, so these anchors navigate fully instead of using the SPA
// go() helper (which drops query strings by design, and is also why they are
// plain anchors and not HomeLinks).
//
// The September 2026 visual pass rebuilt it on /firefall's system (the
// `.hp-event` class, the `.ff-*` layout rules, EventIcon). Two pictures carry
// what the page used to leave to the reader:
//   1. The route maps. The overview (ItinOverview) and each day's map
//      (ItinDayMap) sit on the National Park Service's official map (the
//      owner's rule: never a drawing) and add only pins, numbered in drive
//      order to match the list beside them, and the two seasonal roads. The
//      pins are placed from the stops' own coordinates in points.geojson, so a
//      pin edit moves the map with it; the georeferencing notes are above
//      ITIN_PARK. They render nothing until the geojson lands, and the lists
//      stand without them.
//   2. The month grid (ItinMonths), which plan works in which month. It reads
//      window.TRIP_MONTHS (intent-data.js, loaded with this route in
//      PAGE_MODULES), the site's one month table and the same `tioga` /
//      `glacier` status that caps the trip selector's itinerary on /planning,
//      so the two pages cannot disagree about which day exists in January.
//      It renders nothing if that script did not load.
// =============================================================================

const { useEffect: useEffectIt, useState: useStateIt } = React;

// Which road each plan needs beyond the Valley floor, by TRIP_MONTHS key.
const ITIN_NEEDS = { "1day": [], halfday: [], "2day": ["glacier"], "3day": ["glacier", "tioga"] };
// Day-level notes, restating published drive figures (glacier-point-how-to-visit,
// tuolumne-meadows-in-a-day). Keyed by the day's name prefix in the data.
const ITIN_DAY_NOTES = [
  [/Glacier Point Road/i, "Glacier Point is about 30 miles and an hour from Yosemite Valley."],
  [/Tioga Road/i, "Tuolumne Meadows is roughly 55 to 60 miles from the Valley, about an hour and a half each way. This day only exists once Tioga Road is open, which in some years is not until late June or early July."],
];
const ITIN_CAT_ICON = { vista: "eye", hike: "walk", eat: "food", picnic: "tree", swim: "drop", camp: "bed" };
const ITIN_REGION_LABEL = { valley: "Yosemite Valley", "glacier-point": "Glacier Point Road", tuolumne: "Tioga Road" };

// The base of every map on this page is the National Park Service's official
// Yosemite map (public domain), and the page only draws on top of it: numbered
// pins and the two seasonal roads. Two cuts of it are in the repo. The park cut
// (img/nps-itineraries-map.jpg, 1400 x 780) is img/nps-yosemite-park-map.jpg
// cropped at +100+700; the Valley map is img/nps-yosemite-valley-map.jpg as
// published (2560 x 1000). Neither cut is georeferenced, so each carries an
// affine fit from longitude and latitude to its own pixels, least-squares over
// landmarks whose icons sit at known coordinates (Glacier Point, Washburn
// Point, Taft Point, Sentinel Dome, the Ahwahnee and the Lodge on the Valley
// map; Washburn Point, the dam, May Lake, Pothole and Lembert Domes, Lukens
// Lake, Gaylor Lake, McGurk Meadow and Wawona on the park map). Worst residual
// on the park cut is about 23 px (under a kilometre); on the Valley map about
// 21 px. The two road lines were snapped to the brown road pixels of the map
// itself, in the park cut's pixel space. Redo the fit if either image is swapped.
const ITIN_PARK = {
  image: "img/nps-itineraries-map.jpg", w: 1400, h: 780, ox: 100, oy: 700,
  X: [2094.704440463671, 96.25567209789192, 247530.04319206357],
  Y: [-49.91832268440772, -2750.1330479076214, 99047.14030276223],
};
const ITIN_VALLEY = {
  image: "img/nps-yosemite-valley-map.jpg", w: 2560, h: 1000, ox: 0, oy: 0,
  X: [14276.700726584826, 710.8186467358179, 1682159.7744080413],
  Y: [396.87060490014903, -20040.32805507032, 804187.4599845853],
};
const ITIN_ROAD_TIOGA = "117,494 128,495 149,492 170,485 187,468 204,452 224,439 239,420 249,399 263,379 277,361 295,342 311,327 327,310 341,290 358,274 377,259 395,246 417,239 440,231 450,215 459,217 478,231 502,240 528,242 550,246 568,257 589,273 597,294 601,314 620,328 642,333 665,330 688,327 714,330 739,334 761,334 783,322 809,311 829,298 843,280 857,258 878,241 896,224 908,205 924,185 949,171 973,164 995,168 1020,176 1046,178 1070,174 1092,166 1114,161 1138,158 1165,157 1188,158 1211,159 1236,149 1260,138 1275,118 1281,94 1284,71 1287,49 1291,31 1292,27";
const ITIN_ROAD_GLACIER = "426,715 449,717 470,720 495,722 522,724 544,718 567,702 577,683 580,659 579,634 583,616 592,595 595,579";
const ITIN_SEASONAL = "#b8590f";

function itinXY(base, coord) {
  return [
    base.X[0] * coord[0] + base.X[1] * coord[1] + base.X[2] - base.ox,
    base.Y[0] * coord[0] + base.Y[1] * coord[1] + base.Y[2] - base.oy,
  ];
}

// The road lines that fall inside a park-cut view box, as dashed highlights.
function ItinRoads({ k, sw }) {
  return (
    <g className="itin-map__roads" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[ITIN_ROAD_TIOGA, ITIN_ROAD_GLACIER].map((pts, i) => (
        <g key={i}>
          <polyline points={pts} stroke="#fff" strokeOpacity="0.85" strokeWidth={sw + 2 * k} />
          <polyline points={pts} stroke={ITIN_SEASONAL} strokeWidth={sw} strokeDasharray={`${sw * 2.2} ${sw * 1.4}`} />
        </g>
      ))}
    </g>
  );
}

// One day's stops on the official map, numbered in drive order. The view box is
// fitted to the stops (and, on the park cut, to the road they sit on), at the
// aspect ratio of the frame. Markers that would sit on top of each other (El
// Capitan Meadow and El Capitan Bridge are 150 m apart) are nudged apart with a
// leader line back to the true point.
function ItinDayMap({ stops, label, valley }) {
  const base = valley ? ITIN_VALLEY : ITIN_PARK;
  const pts = stops.map((st) => itinXY(base, st.coord));
  // The box is fitted to the stops the map actually shows; one that lies past
  // the edge is pinned to the box's edge below rather than stretching the view.
  const inMap = pts.filter(([x, y]) => x >= 0 && y >= 0 && x <= base.w && y <= base.h);
  const fitPts = inMap.length ? inMap : pts;
  const xs = fitPts.map((p) => p[0]), ys = fitPts.map((p) => p[1]);
  const ASPECT = 420 / 260;
  let minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = Math.max(maxX - minX, (maxY - minY) * ASPECT) * 0.14 + 30;
  minX -= pad; maxX += pad; minY -= pad; maxY += pad;
  let vw = maxX - minX, vh = maxY - minY;
  if (vw / vh < ASPECT) { const nw = vh * ASPECT; minX -= (nw - vw) / 2; vw = nw; } else { const nh = vw / ASPECT; minY -= (nh - vh) / 2; vh = nh; }
  // Never wider than the image; slide the box back inside it.
  if (vw > base.w) { vw = base.w; vh = vw / ASPECT; }
  if (vh > base.h) { vh = base.h; vw = vh * ASPECT; }
  minX = Math.max(0, Math.min(base.w - vw, minX));
  minY = Math.max(0, Math.min(base.h - vh, minY));
  const k = vw / 420, R = 11 * k;
  const placed = [];
  const marks = pts.map(([x, y], i) => {
    let mx = x, my = y, tries = 0;
    while (placed.some(([px, py]) => Math.hypot(px - mx, py - my) < R * 2 + 2 * k) && tries < 12) {
      const a = (tries * 137.5 * Math.PI) / 180;
      mx = x + Math.cos(a) * (R * 2.4 + tries * 2 * k);
      my = y + Math.sin(a) * (R * 2.4 + tries * 2 * k);
      tries++;
    }
    if (x < 0 || y < 0 || x > base.w || y > base.h) { mx = minX + R + 3 * k; my = Math.max(0, Math.min(base.h, y)); }
    mx = Math.max(minX + R + 3 * k, Math.min(minX + vw - R - 3 * k, mx));
    my = Math.max(minY + R + 3 * k, Math.min(minY + vh - R - 3 * k, my));
    placed.push([mx, my]);
    // A stop west of the Valley map's edge (Cascade Picnic Area is on the El
    // Portal Road, past Tunnel View) is pinned at the edge and says so.
    return { i, x, y, mx, my, off: x < 0 || y < 0 || x > base.w || y > base.h };
  });
  return (
    <svg className="itin-map__svg" viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`} role="img"
      aria-label={`${label}, on the National Park Service map: ${stops.length} stops in drive order, ${stops.map((s, i) => `${i + 1}, ${s.name}`).join("; ")}.`}>
      <image href={`/${base.image}`} x="0" y="0" width={base.w} height={base.h} preserveAspectRatio="none" />
      {!valley && <ItinRoads k={k} sw={3 * k} />}
      {marks.map((m) => (
        <g key={m.i}>
          {(m.mx !== m.x || m.my !== m.y) && <line x1={m.x} y1={m.y} x2={m.mx} y2={m.my} className="itin-map__leader" style={{ strokeWidth: k }} />}
          {!m.off && <circle cx={m.x} cy={m.y} r={2.5 * k} className="itin-map__true" />}
          <circle cx={m.mx} cy={m.my} r={R} className={"itin-map__pin" + (m.i === 0 ? " is-first" : "")} style={{ strokeWidth: 2 * k }} />
          <text x={m.mx} y={m.my + 4 * k} textAnchor="middle" className="itin-map__num" style={{ fontSize: 11 * k }}>{m.i + 1}</text>
          {m.off && <text x={m.mx - R} y={m.my - R - 5 * k} className="itin-map__off" style={{ fontSize: 10 * k, strokeWidth: 3 * k }}>west, off this map</text>}
        </g>
      ))}
    </svg>
  );
}

// Every stop the plans use, on the park cut: the Valley cluster, Glacier Point
// Road's stops to the south and Tioga Road's to the north-east, with both
// seasonal roads highlighted where the map draws them.
function ItinOverview({ stopsById }) {
  const regions = [
    { key: "valley", ids: window.getItineraryStopIds ? window.getItineraryStopIds("1day") : [] },
    { key: "glacier-point", ids: ((window.ITINERARIES || []).find((i) => i.id === "2day") || { days: [] }).days.slice(1).flatMap((d) => d.stopIds) },
    { key: "tuolumne", ids: ((window.ITINERARIES || []).find((i) => i.id === "3day") || { days: [] }).days.slice(2).flatMap((d) => d.stopIds) },
  ].map((r) => ({ ...r, stops: r.ids.map((id) => stopsById[id]).filter((s) => s && s.coord) }));
  if (regions.flatMap((r) => r.stops).length < 3) return null;
  const k = 1400 / 1000; // sizes below are set for a 1000-unit box
  // Label anchors in the park cut's pixels, chosen on empty map: the Valley's
  // above its cluster, Glacier Point Road's beside the road, Tioga Road's in
  // the open wilderness north of its middle.
  const at = { valley: [790, 585, "start"], "glacier-point": [548, 700, "start"], tuolumne: [900, 150, "middle"] };
  return (
    <svg className="itin-overview__svg" viewBox="0 0 1400 780" role="img"
      aria-label="The stops the plans use, on the National Park Service map of Yosemite: the Yosemite Valley floor in the middle, Glacier Point Road's stops to the south, and Tioga Road's stops running north-east from the Tuolumne Grove to Gaylor Lake near Tioga Pass. Both seasonal roads are highlighted.">
      <image href={`/${ITIN_PARK.image}`} x="0" y="0" width="1400" height="780" />
      <ItinRoads k={k} sw={5 * k} />
      {regions.map((r) => {
        if (!r.stops.length) return null;
        const a = at[r.key];
        return (
          <g key={r.key} className={"itin-overview__region itin-overview__region--" + r.key}>
            {r.stops.map((s, i) => {
              const [x, y] = itinXY(ITIN_PARK, s.coord);
              return <circle key={i} cx={x} cy={y} r={7 * k} className="itin-overview__pt" />;
            })}
            <text x={a[0]} y={a[1]} textAnchor={a[2]} className="itin-overview__label" style={{ fontSize: 38 * k }}>{ITIN_REGION_LABEL[r.key]}</text>
            <text x={a[0]} y={a[1] + 28 * k} textAnchor={a[2]} className="itin-overview__sub" style={{ fontSize: 20 * k }}>{r.stops.length} stops</text>
          </g>
        );
      })}
    </svg>
  );
}

// Which plan works in which month. Every road-dependent day is read from
// TRIP_MONTHS: `closed` drops the plan, `unsettled` marks it "check first".
function ItinMonths({ itineraries }) {
  const months = window.TRIP_MONTHS;
  if (!Array.isArray(months) || months.length !== 12) return null;
  const status = (it, m) => {
    const need = ITIN_NEEDS[it.id] || [];
    const vals = need.map((road) => m[road]);
    if (vals.includes("closed")) return "closed";
    if (vals.includes("unsettled")) return "unsettled";
    return "open";
  };
  const word = { open: "Works", unsettled: "Check the road", closed: "Road closed" };
  return (
    <div className="itin-months" role="region" aria-label="Which plan works in which month" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col"><span className="fj-sr">Plan</span></th>
            {months.map((m) => <th key={m.key} scope="col" title={m.name}>{m.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {itineraries.map((it) => (
            <tr key={it.id}>
              <th scope="row"><a href={`#${it.id}`}>{it.label}</a><small>{it.title}</small></th>
              {months.map((m) => {
                const s = status(it, m);
                return <td key={m.key} className={"is-" + s}><span aria-label={`${m.name}: ${word[s]}`} title={`${m.name}: ${word[s]}`} /></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ItinerariesPage({ go }) {
  // Stop names, blurbs and positions come from the same geojson the map uses.
  // The page renders without it (titles, deks, map links), so a failed fetch
  // degrades to a lighter page rather than an error.
  const [stopsById, setStopsById] = useStateIt(null);

  useEffectIt(() => {
    let cancelled = false;
    fetch(window.POINTS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const byId = {};
        (data.features || []).forEach((f) => {
          byId[f.properties.id] = { ...f.properties, coord: f.geometry && f.geometry.coordinates };
        });
        setStopsById(byId);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const itineraries = window.ITINERARIES || [];
  const ordered = ["halfday", "1day", "2day", "3day"].map((id) => itineraries.find((i) => i.id === id)).filter(Boolean);

  const tripUrl = (it) => {
    const ids = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
    return `/map?trip=${ids.join(",")}`;
  };
  const dayNote = (name) => {
    const hit = ITIN_DAY_NOTES.find(([re]) => re.test(name));
    return hit ? hit[1] : null;
  };
  const uniqueStops = new Set(itineraries.flatMap((it) => it.days.flatMap((d) => d.stopIds))).size;

  return (
    <div className="page hp-tool hp-event hp-itin">
      <div className="ff-cover itin-cover">
        <ResponsiveImage image="img/tunnel-view-valley-spring.jpg" eager className="ff-cover__img"
          alt="Yosemite Valley from Tunnel View in spring: El Capitan, Bridalveil Fall and Half Dome" sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Itineraries" }]}
          eyebrow="ITINERARIES · HALF A DAY TO THREE DAYS"
          title="Yosemite, in day-sized pieces."
          intro="Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day."
          actions={<React.Fragment>
            <HomeLink go={go} location="itineraries_head" className="hp-button" href="#itin-choose">Choose a plan <span>↓</span></HomeLink>
            <HomeLink go={go} location="itineraries_head" className="hp-link" href="#itin-months">Which month works ↓</HomeLink>
          </React.Fragment>}
        >
          <AffiliateDisclosure />
        </HpPageHead>
        <p className="ff-cover__credit">Photo: Kyle D / Wikimedia Commons (public domain)</p>
      </div>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="route" /><dt>The plans</dt><dd>{itineraries.length}, half a day to three days</dd></div>
          <div><EventIcon name="pin" /><dt>The stops</dt><dd>{uniqueStops} curated pins</dd></div>
          <div><EventIcon name="car" /><dt>The order</dt><dd>West to east, as you drive</dd></div>
          <div><EventIcon name="ticket" /><dt>Reservations</dt><dd>None of it needs one</dd></div>
        </dl>
      </div>

      {/* Choose. One card per plan, in length order, each a jump to its section. */}
      <section className="hp-wrap hp-section" id="itin-choose" tabIndex={-1}>
        <HpHeading eyebrow="CHOOSE BY TIME" title="How long do you have?" />
        <ol className="itin-choose">
          {ordered.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} onClick={(e) => {
                const el = document.getElementById(it.id);
                if (!el) return;
                e.preventDefault();
                if (window.track) window.track("cta_click", { location: "itineraries_choose", target: `#${it.id}` });
                el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                el.focus({ preventScroll: true });
              }}>
                <span className="itin-choose__label">{it.label}</span>
                <strong>{it.title}</strong>
                <p>{it.dek}</p>
                <span className="itin-choose__meta">{it.days.reduce((n, d) => n + d.stopIds.length, 0)} stops · {it.days.length} {it.days.length === 1 ? "day" : "days"} ↓</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="ff-band" id="itin-months" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">WHICH MONTH WORKS</p>
            <h2>The roads decide how many days you get</h2>
            <p className="ff-lede">The Valley is open all year, so the half-day and one-day plans work in any month. Day two needs Glacier Point Road and day three needs Tioga Road, and both close for winter. Tioga Road, Highway 120 across the middle of the park, is the one to doubt: it has opened anywhere from late April to early July, and in a heavy snow year it is still closed for much of June. Treat day three as a plan you confirm the week you go. The grid reads the same month table the trip selector uses, so the two cannot disagree.</p>
            <ul className="itin-legend">
              <li className="is-open"><span />Works</li>
              <li className="is-unsettled"><span />A road may not be open yet; check first</li>
              <li className="is-closed"><span />A road the plan needs is closed</li>
            </ul>
            <p className="ff-note">Road status now: <HomeLink go={go} location="itineraries_months" href="/conditions">the conditions board</HomeLink>. How the high road opens: <HomeLink go={go} location="itineraries_months" href="/tioga-opening">the Tioga Road opening</HomeLink>. A plan built around your month and your party: <HomeLink go={go} location="itineraries_months" href="/planning">the trip selector</HomeLink>.</p>
          </div>
          <ItinMonths itineraries={ordered} />
        </div>
      </section>

      <section className="hp-wrap hp-section itin-ground">
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">THE GROUND THEY COVER</p>
            <h2>Three roads, one park</h2>
            <p className="ff-lede">Every plan starts on the Valley floor. The longer ones climb out of it: south and up to the rim on Glacier Point Road, then north-east over the high country on Tioga Road. Each is its own day, because each is its own drive.</p>
            <NatureNotesFilm
              id="one-day-in-yosemite"
              title="One Day in Yosemite"
              youtubeId="7QLVMwyxU_Q"
              location="itineraries_film"
              note="Thirty filmmakers spread across the park on one June day to record the people who visit and work in it. The day you are planning, seen from everywhere at once."
            />
          </div>
          <figure className="itin-overview">
            {stopsById ? <ItinOverview stopsById={stopsById} /> : <div className="itin-overview__wait" />}
            <figcaption className="ff-note">Map: National Park Service (public domain), with the stops plotted from their coordinates. The dashed lines are Tioga Road and Glacier Point Road, the two roads that close for winter and can open late.</figcaption>
          </figure>
        </div>
      </section>

      {ordered.map((it, n) => (
        <section key={it.id} id={it.id} tabIndex={-1} className={"itin-plan" + (n % 2 === 0 ? " ff-band" : "")}>
          <div className="hp-wrap hp-section">
            <div className="itin-plan__head">
              <div>
                <HpHeading eyebrow={(it.label || "").toUpperCase()} title={it.title} />
                <p className="ff-lede">{it.dek}</p>
              </div>
              <p className="itin-plan__season"><EventIcon name={it.id === "1day" || it.id === "halfday" ? "sun" : "snow"} />{it.season}</p>
            </div>

            {it.days.map((day) => {
              // A day an earlier plan already drew (the two- and three-day
              // plans open with the one-day plan's Valley day) is a reference
              // back to it, not a third copy of the same nine stops.
              const first = ordered.slice(0, n).find((o) => o.days.some((d) => d.name.replace(/^Day \d+: /, "") === day.name.replace(/^Day \d+: /, "") && d.stopIds.join() === day.stopIds.join()));
              if (first) {
                const names = day.stopIds.map((id) => (stopsById && stopsById[id] ? stopsById[id].name : id.replace(/-/g, " ")));
                return (
                  <div key={day.name} className="itin-day itin-day--same">
                    <h3>{day.name}</h3>
                    <p className="ff-lede">The same {day.stopIds.length} stops as <a href={`#${first.id}`}>{first.title.toLowerCase()}</a>: {names[0]} to {names[names.length - 1]}.</p>
                  </div>
                );
              }
              const stops = day.stopIds.map((id) => (stopsById && stopsById[id]) || { id, name: id.replace(/-/g, " ") });
              const mapped = stops.filter((s) => s.coord);
              const note = dayNote(day.name);
              return (
                <div key={day.name} className="itin-day">
                  <div className="itin-day__map">
                    <h3>{day.name}</h3>
                    {note && <p className="ff-note itin-day__note"><EventIcon name="car" size={16} />{note}</p>}
                    {mapped.length === stops.length && mapped.length > 1
                      ? <figure><ItinDayMap stops={mapped} label={day.name} valley={mapped.every((s) => s.region === "valley")} /><figcaption className="ff-note itin-map__credit">Map: National Park Service (public domain)</figcaption></figure>
                      : <div className="itin-day__wait" />}
                  </div>
                  <ol className="itin-day__stops">
                    {stops.map((st, i) => (
                      <li key={st.id}>
                        <span className="itin-day__num">{i + 1}</span>
                        <div>
                          <strong>{st.name}{st.category && <EventIcon name={ITIN_CAT_ICON[st.category] || "pin"} size={16} className="itin-day__cat" />}</strong>
                          {st.blurb && <p>{st.blurb}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}

            <a
              className="hp-button itin-plan__open"
              href={tripUrl(it)}
              onClick={() => {
                if (window.track) window.track("itinerary_open_map", { itinerary: it.id });
              }}
            >
              Open this trip on the map →
            </a>
          </div>
        </section>
      ))}

      <section className="hp-wrap hp-section itin-after">
        <div className="ff-split">
          <div>
            <p className="hp-eyebrow">AFTER THE PLAN</p>
            <h2>Starting points, not homework</h2>
            <p className="ff-lede">The <HomeLink go={go} location="itineraries_after" href="/map">full map</HomeLink> has every pin, and the trip builder saves whatever you assemble on your own device. For the reasoning behind the stops, start with <HomeLink go={go} location="itineraries_after" href="/planning">the planning guide</HomeLink>.</p>
          </div>
          {/* Every multi-day plan above implies a night between the days, and
              where that night is spent decides whether day two starts at the
              trailhead or in the entrance line. The filled button is only
              ever an Expedia search, as on /firefall. */}
          <aside className="ff-closing" aria-label="Lodging availability">
            <p className="hp-eyebrow">EVERY PLAN ABOVE NEEDS A NIGHT BETWEEN THE DAYS</p>
            <p>These are built on early starts, which is a lodging decision before it is an itinerary decision: a bed in the Valley or in El Portal buys the first two hours of the day, and Oakhurst costs you them. The full comparison of every in-park and gateway option is one page over.</p>
            <AvailabilityLink destination="Yosemite National Park" list="page_itineraries" slug="itineraries" className="ff-book">See what is available on your dates ↗</AvailabilityLink>
            <p className="ff-note">Availability search on Expedia; we may earn a commission, and the advice is the same either way. <a href="/affiliate">Disclosure.</a> Every option compared: <HomeLink go={go} location="itineraries_stay" href="/stay">where to stay</HomeLink>.</p>
          </aside>
        </div>
      </section>

      {/* The purchase ask: itinerary readers are packing dates into days,
          the exact moment the offline app earns its price. */}
      <HpGuideBand
        go={go}
        location="itineraries"
        title="These plans, offline, in the park."
        intro="The Field Guide app carries the same curated stops with parking and timing notes, offline maps that keep working in the dead zones between them, and a day-by-day planner."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Get the conditions before you go"
        heading="Get the conditions before you go"
        blurb="Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed."
        location="itineraries"
        tag="itineraries"
      />
    </div>
  );
}

window.ItinerariesPage = ItinerariesPage;
