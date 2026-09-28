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
//      (ItinDayMap) are drawn from the stops' own coordinates in
//      points.geojson, numbered in drive order to match the list beside them.
//      The lines join the stops straight, in order; they are not the roads,
//      and the captions say so. Nothing on them is typed by hand, so a pin
//      edit moves the map with it. They render nothing until the geojson
//      lands, and the lists stand without them.
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
  [/Tioga Road/i, "Tuolumne Meadows is roughly 55 to 60 miles from the Valley, about an hour and a half each way."],
];
const ITIN_CAT_ICON = { vista: "eye", hike: "walk", eat: "food", picnic: "tree", swim: "drop", camp: "bed" };
const ITIN_REGION_LABEL = { valley: "Yosemite Valley", "glacier-point": "Glacier Point Road", tuolumne: "Tioga Road" };

// Equirectangular projection with the latitude correction, fitted to a box.
function itinProject(points, W, H, pad) {
  const lons = points.map((p) => p.coord[0]);
  const lats = points.map((p) => p.coord[1]);
  const midLat = ((Math.min(...lats) + Math.max(...lats)) / 2) * (Math.PI / 180);
  const k = Math.cos(midLat);
  const minX = Math.min(...lons) * k, maxX = Math.max(...lons) * k;
  const minY = Math.min(...lats), maxY = Math.max(...lats);
  const spanX = Math.max(maxX - minX, 0.004), spanY = Math.max(maxY - minY, 0.004);
  const s = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  const offX = (W - spanX * s) / 2, offY = (H - spanY * s) / 2;
  return (c) => [offX + (c[0] * k - minX) * s, offY + (maxY - c[1]) * s];
}

// One day's stops on its own map, numbered in drive order. Markers that would
// sit on top of each other (El Capitan Meadow and El Capitan Bridge are 150 m
// apart) are nudged apart with a leader line back to the true point.
function ItinDayMap({ stops, label }) {
  const W = 420, H = 260, R = 11;
  const project = itinProject(stops, W, H, 36);
  const clamp = (v, max) => Math.max(R + 3, Math.min(max - R - 3, v));
  const placed = [];
  const marks = stops.map((st, i) => {
    const [x, y] = project(st.coord);
    let mx = x, my = y, tries = 0;
    while (placed.some(([px, py]) => Math.hypot(px - mx, py - my) < R * 2 + 2) && tries < 12) {
      const a = (tries * 137.5 * Math.PI) / 180;
      mx = x + Math.cos(a) * (R * 2.4 + tries * 2);
      my = y + Math.sin(a) * (R * 2.4 + tries * 2);
      tries++;
    }
    mx = clamp(mx, W); my = clamp(my, H);
    placed.push([mx, my]);
    return { i, x, y, mx, my };
  });
  const line = marks.map((m) => `${m.x.toFixed(1)},${m.y.toFixed(1)}`).join(" ");
  return (
    <svg className="itin-map__svg" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`${label}: ${stops.length} stops in drive order, ${stops.map((s, i) => `${i + 1}, ${s.name}`).join("; ")}.`}>
      <rect x="0" y="0" width={W} height={H} className="itin-map__ground" />
      <polyline points={line} className="itin-map__route" />
      {marks.map((m) => (
        <g key={m.i}>
          {(m.mx !== m.x || m.my !== m.y) && <line x1={m.x} y1={m.y} x2={m.mx} y2={m.my} className="itin-map__leader" />}
          <circle cx={m.x} cy={m.y} r="2.5" className="itin-map__true" />
          <circle cx={m.mx} cy={m.my} r={R} className={"itin-map__pin" + (m.i === 0 ? " is-first" : "")} />
          <text x={m.mx} y={m.my + 4} textAnchor="middle" className="itin-map__num">{m.i + 1}</text>
        </g>
      ))}
      <g className="itin-map__north" transform={`translate(${W - 22},24)`}>
        <path d="M0 -12 L5 4 L0 1 L-5 4 Z" />
        <text y="18" textAnchor="middle">N</text>
      </g>
    </svg>
  );
}

// Every stop the plans use, one map: the Valley cluster, Glacier Point Road
// to the south and Tioga Road to the north-east, each joined in drive order.
function ItinOverview({ stopsById }) {
  const regions = [
    { key: "valley", ids: window.getItineraryStopIds ? window.getItineraryStopIds("1day") : [] },
    { key: "glacier-point", ids: ((window.ITINERARIES || []).find((i) => i.id === "2day") || { days: [] }).days.slice(1).flatMap((d) => d.stopIds) },
    { key: "tuolumne", ids: ((window.ITINERARIES || []).find((i) => i.id === "3day") || { days: [] }).days.slice(2).flatMap((d) => d.stopIds) },
  ].map((r) => ({ ...r, stops: r.ids.map((id) => stopsById[id]).filter((s) => s && s.coord) }));
  const all = regions.flatMap((r) => r.stops);
  if (all.length < 3) return null;
  const W = 1000, H = 540;
  const project = itinProject(all, W, H, 140);
  return (
    <svg className="itin-overview__svg" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label="Overview map of the stops the plans use: the Yosemite Valley floor in the middle, Glacier Point Road's stops to the south, and Tioga Road's stops running north-east from the Tuolumne Grove to Gaylor Lake near Tioga Pass. Lines join the stops in drive order and are not the roads.">
      <rect x="0" y="0" width={W} height={H} className="itin-map__ground" />
      {regions.map((r) => {
        if (!r.stops.length) return null;
        const pts = r.stops.map((s) => project(s.coord));
        const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
        // Label positions by region: the Valley's to the right of its
        // cluster, Glacier Point Road's below its southernmost stop, Tioga
        // Road's above the middle of its line, where nothing else is drawn.
        // Sizes are in viewBox units and the map is drawn about half size,
        // so the type is set large.
        const mid = pts[Math.floor(pts.length / 2)];
        const at = {
          valley: [Math.max(...xs) + 26, (Math.min(...ys) + Math.max(...ys)) / 2 + 4, "start"],
          "glacier-point": [(Math.min(...xs) + Math.max(...xs)) / 2, Math.max(...ys) + 48, "middle"],
          tuolumne: [mid[0], mid[1] - 52, "middle"],
        }[r.key];
        const ends = r.key === "tuolumne" ? [[0, "end", -12], [r.stops.length - 1, "start", 12]] : [];
        return (
          <g key={r.key} className={"itin-overview__region itin-overview__region--" + r.key}>
            <polyline points={pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")} className="itin-overview__route" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="9" className="itin-overview__pt" />)}
            <text x={at[0]} y={at[1]} textAnchor={at[2]} className="itin-overview__label">{ITIN_REGION_LABEL[r.key]}</text>
            <text x={at[0]} y={at[1] + 28} textAnchor={at[2]} className="itin-overview__sub">{r.stops.length} stops</text>
            {ends.map(([i, anchor, dx]) => (
              <text key={i} x={pts[i][0] + dx * 1.6} y={pts[i][1] + 8} textAnchor={anchor} className="itin-overview__end">{r.stops[i].name.replace(/ Trailhead$/, "")}</text>
            ))}
          </g>
        );
      })}
      <g className="itin-map__north" transform="translate(40,44)">
        <path d="M0 -16 L7 6 L0 2 L-7 6 Z" />
        <text y="24" textAnchor="middle">N</text>
      </g>
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
            <p className="ff-lede">The Valley is open all year, so the half-day and one-day plans work in any month. Day two needs Glacier Point Road and day three needs Tioga Road, and both close for winter. The grid reads the same month table the trip selector uses, so the two cannot disagree.</p>
            <ul className="itin-legend">
              <li className="is-open"><span />Works</li>
              <li className="is-unsettled"><span />The road usually opens this month; check first</li>
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
            <figcaption className="ff-note">Drawn from the stops' own coordinates on the map. Lines join the stops in drive order; they are not the roads.</figcaption>
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
                      ? <figure><ItinDayMap stops={mapped} label={day.name} /></figure>
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
