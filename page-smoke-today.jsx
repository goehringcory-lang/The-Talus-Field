/* global React, HpPageHead, HpHeading, HomeLink, ResponsiveImage, HpGuideBand, HpLetter, EventIcon, hpLongDate */

// =============================================================================
// SMOKE TODAY — `/yosemite-smoke-today` (October 2026).
//
// Built on the road-status pages (page-road-status.jsx), which are built on
// /firefall's layout through the event-page system (`hp-event` and the `.ff-*`
// rules). It reuses the road pages' `.rd-*` boxes (the official-sources box,
// the ledger, the read-next list) and adds only the live reading, in the
// `.sm-*` layer at the end of styles.css.
//
// Five rules hold the page up.
//   1. THE ONE LIVE NUMBER IS AIRNOW'S, AS THE API WORKER READS IT. SmkReading
//      reads /api/air (workers/src/lib/air.ts): the highest-AQI observation
//      AirNow returns for the reporting area nearest Yosemite Valley, within
//      50 miles. Every reading prints its reporting area, pollutant and hour,
//      because the area that answers is not always inside the park. Same
//      staleness policy as the PWA (apps/guide/src/air/staleness.ts): past 3
//      hours the page says the reading is old, past 24 it shows none, because
//      a stale AQI on a smoke day misleads in exactly the direction that
//      matters. A silent feed renders the fallback, never an error.
//   2. Nothing else on the page is live. Under the reading come the official
//      sources (fire.airnow.gov, the park's air quality page, its current
//      conditions page), and the page says plainly they outrank it.
//   3. The fire link is the bulletin's, not this file's. SmkFire reads
//      bulletin.json and shows a one-line link to /now only while the edition
//      carries a headline tile labelled as a fire (today, the Dome Fire). When
//      the edition drops it, the line goes with it. SMOKE_BULLETIN_URL is the
//      third reader check-asset-freshness.mjs holds to the same ?v=.
//   4. The AQI bands and what to do in each are the site's published ones,
//      from the smoke-season article (bodies/yosemite-during-smoke-season.jsx);
//      the smoke geography is that article's and the wildfire article's. Change
//      those bodies and this page changes with them.
//   5. SMK_CHECKED is printed as "Last checked"; it is the sitemap lastmod in
//      gen-seo-artifacts.mjs. The FAQ answers are mirrored in edge/seo.js's
//      "/yosemite-smoke-today" faq (the JSON-LD); change both.
// =============================================================================

const SMK_CHECKED = "October 22, 2026";

const SMK_AIR_URL = ((typeof window !== "undefined" && window.GUIDE_API_BASE) || "https://api.thetalusfieldjournal.com") + "/api/air";
const SMK_REFRESH_MS = 15 * 60 * 1000;
const SMK_WARN_MS = 3 * 60 * 60 * 1000;
const SMK_HIDE_MS = 24 * 60 * 60 * 1000;

// Same versioned bulletin URL as page-now.jsx's BULLETIN_URL and
// page-tioga-opening.jsx's TIOGA_BULLETIN_URL. All three must carry the same
// number; check-asset-freshness.mjs parses this literal and fails the build if
// they disagree, which is why it is written out in full.
const SMOKE_BULLETIN_URL = "/bulletin.json?v=24";

const SMK_FIRE_AIRNOW = "https://fire.airnow.gov/";
const SMK_NPS_AIR = "https://www.nps.gov/yose/learn/nature/aqmonitoring.htm";
const SMK_NPS_CONDITIONS = "https://www.nps.gov/yose/planyourvisit/conditions.htm";

const SMK_SMOKE_ARTICLE = "/articles/yosemite-during-smoke-season";

// The AQI bands as the smoke-season article prints them, with its own advice
// for each. [range, category, what to do].
const SMK_BANDS = [
  ["0 to 50", "Good", "Almost no health concerns for anyone. A normal park day."],
  ["51 to 100", "Moderate", "Generally fine for most visitors; the views may be hazy. People with severe asthma or other respiratory conditions should be cautious."],
  ["101 to 150", "Unhealthy for sensitive groups", "Children, older adults and anyone with respiratory issues should reduce outdoor exertion. Pick shorter, lower-effort walks, and leave the long climbs for another day."],
  ["151 to 200", "Unhealthy", "Reduce outdoor activity and skip the strenuous hikes. Try the high country; if it is smoky too, take the day indoors. Sensitive groups should stay indoors."],
  ["201 to 300", "Very Unhealthy", "Don't hike. Spend time indoors when possible, and seriously consider moving the trip."],
  ["301 and up", "Hazardous", "Don't be outside. This is when you cancel or relocate."],
];

// Where the smoke sits, from the smoke-season and wildfire articles.
const SMK_RULES = [
  ["mountain", "The Valley holds it", "Yosemite Valley is a granite trough with its floor at about 4,000 feet. Smoke pours in on the prevailing winds and cold air drains it down off the ridges at night, so the Valley is often the worst air in the park."],
  ["route", "Up is often better, not always", "Above about 7,500 feet, Glacier Point and Tuolumne Meadows are sometimes above the layer that holds the smoke down. During the Dome Fire, the park's forecasts had Tuolumne under the same rating as the Valley on some days."],
  ["clock", "Check again at noon", "During the Dome Fire, the park's smoke forecasts had the lower park worst in the morning and clearing in the afternoon. A smoky dawn is not a verdict on the day."],
  ["cloud", "Wind beats distance", "A distant fire with a direct wind can put smoke in the Valley faster than a near one with the wind blowing the other way. Read the wind in the forecast, not just the fire map."],
  ["walk", "Cancel the long hikes first", "The long, high-effort climbs are where you breathe the most air. The short Valley walks are easy to take on a hazy day and easy to skip."],
  ["users", "Tighter lines for some", "Older adults and anyone with a heart or lung condition: treat 100 as the line, not 150. Be more conservative still with children, who breathe faster. N95 masks reduce the dose; carry a few."],
];

const SMK_READS = [
  [SMK_SMOKE_ARTICLE, "Visiting during smoke season", "The geography of smoke, the decision tree, and the tactics"],
  ["/articles/wildfire-in-yosemite-during-your-trip", "A wildfire during your trip", "The closure list, the bookings, and when to keep, move or cancel"],
  ["/conditions", "Conditions", "Webcams, entrance waits, forecasts"],
  ["/webcams", "Webcams", "See the haze for yourself before you drive"],
  ["/articles/tuolumne-meadows-in-a-day", "Tuolumne Meadows in a day", "The high-country day, while Tioga Road is open"],
  ["/road-status", "Road status", "Every park road, and where to check it"],
];

// Mirrored in edge/seo.js's "/yosemite-smoke-today" faq (the JSON-LD). Change both.
const SMK_FAQ = [
  ["Is there smoke in Yosemite today?", "The reading at the top of this page is AirNow's latest for the reporting area nearest Yosemite Valley, within 50 miles, as this site's API last read it. It names the area and the hour, and it disappears when it is more than a day old. For monitor-by-monitor readings in and near the park, check fire.airnow.gov; for park-specific smoke updates and closures, check the National Park Service's air quality and current conditions pages."],
  ["Where in Yosemite is the air usually cleanest during a fire?", "Often the high country. Yosemite Valley traps smoke, and Glacier Point and Tuolumne Meadows, above about 7,500 feet, are sometimes above it. Not always: during the Dome Fire the park's forecasts had Tuolumne under the same rating as the Valley on some days, so read the day's forecast by area."],
  ["What AQI is too high for a hike in Yosemite?", "At 101 to 150, unhealthy for sensitive groups, pick shorter, lower-effort walks. At 151 to 200, unhealthy, skip strenuous hikes. Above 200, don't hike. Older adults and anyone with a respiratory or heart condition should treat 100 as the line, not 150, and children call for more caution still."],
  ["When is smoke season in Yosemite?", "Fire season runs from roughly July through November, according to the Park Service, and into June in dry years."],
];

// "8 a.m., October 22" from AirNow's park-local "YYYY-MM-DD HH:00".
function smkObservedLabel(observedAt) {
  const m = typeof observedAt === "string" && observedAt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):00$/);
  if (!m) return null;
  const h = Number(m[2]);
  const hour = h === 0 ? "midnight" : h === 12 ? "noon" : `${h % 12} ${h < 12 ? "a.m." : "p.m."}`;
  return `${hour}, ${hpLongDate(m[1]).replace(/, \d{4}$/, "")}`;
}

function smkAge(ms) {
  const min = Math.max(0, Math.round(ms / 60000));
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  return `${h} hour${h === 1 ? "" : "s"} ago`;
}

// The live reading. Renders the fallback until /api/air answers with a fresh
// number, and whenever it cannot.
function SmkReading() {
  const [data, setData] = React.useState(null);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(SMK_AIR_URL)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
        .then((body) => { if (!cancelled && body) setData(body); })
        .catch(() => {});
      setTick((t) => t + 1);
    };
    load();
    const timer = setInterval(load, SMK_REFRESH_MS);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  const fetched = data && data.fetchedAt ? Date.parse(data.fetchedAt) : NaN;
  const ageMs = isFinite(fetched) ? Date.now() - fetched : Infinity;
  const live = data && typeof data.aqi === "number" && ageMs <= SMK_HIDE_MS;

  if (!live) {
    return (
      <div className="sm-reading sm-reading--none" aria-live="polite">
        <p className="sm-reading__label">The latest reading</p>
        <p className="sm-reading__empty">No current reading from AirNow on this page right now.</p>
        <p className="sm-reading__meta">Use the sources below; they are the ones that know.</p>
      </div>
    );
  }

  const observed = smkObservedLabel(data.observedAt);
  return (
    <div className="sm-reading" aria-live="polite">
      <p className="sm-reading__label">The latest reading</p>
      <p className="sm-reading__value">
        <span className="sm-reading__aqi">AQI {data.aqi}</span>
        {data.category && <span className="sm-reading__cat">{data.category}</span>}
      </p>
      <p className="sm-reading__meta">
        {[
          data.reportingArea ? `AirNow, ${data.reportingArea} reporting area` : "AirNow",
          data.pollutant ? `worst pollutant ${data.pollutant}` : null,
          observed ? `observed ${observed}` : null,
        ].filter(Boolean).join(" · ")}
        {ageMs > SMK_WARN_MS && <strong> · This reading is {smkAge(ageMs)}; check the sources below for a newer one.</strong>}
      </p>
    </div>
  );
}

// One line to the Park Bulletin while its edition carries a fire headline.
// Renders nothing otherwise, and nothing once the edition has ended.
function SmkFire({ go }) {
  const [fire, setFire] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(SMOKE_BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((data) => {
        if (cancelled || !data) return;
        const ed = data.edition || {};
        if (ed.end) {
          const end = new Date(ed.end + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (!Number.isNaN(end.getTime()) && today > end) return;
        }
        const tiles = Array.isArray(data.headlines) ? data.headlines : [];
        const tile = tiles.find((h) => /\bfire\b/i.test(h.label || ""));
        if (tile) setFire(tile);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!fire) return null;
  return (
    <p className="ff-alert sm-fire">
      <EventIcon name="alert" />
      <span><strong>{fire.label}{fire.status ? `: ${fire.status}.` : "."}</strong> The closures and the park's latest word are in <HomeLink go={go} location="smoke_today_fire" href="/now">the Park Bulletin</HomeLink>.</span>
    </p>
  );
}

function SmokeTodayPage({ go }) {
  const toc = [
    ["#smoke-now", "The latest reading"],
    ["#smoke-scale", "What the number means"],
    ["#smoke-where", "Where the smoke sits"],
    ["#smoke-faq", "Questions"],
  ];

  return (
    <div className="page hp-tool hp-event hp-smoke">
      <div className="ff-cover rd-cover">
        <ResponsiveImage image="img/tunnel-view-ferguson-fire-smoke.jpg" eager className="ff-cover__img"
          alt="Visitors at a stone-walled overlook on Tunnel View in a haze of wildfire smoke, El Capitan faint in the distance" sizes="100vw" />
        <HpPageHead
          go={go}
          crumbs={[{ label: "Home", route: "home" }, { label: "Conditions", route: "conditions" }, { label: "Smoke today" }]}
          eyebrow="AIR QUALITY · AIRNOW · YOSEMITE VALLEY AND AROUND"
          title="Is there smoke in Yosemite today?"
          intro="The latest air-quality reading near Yosemite Valley, from AirNow, with the place and hour it came from. Under it: the official sources that outrank it, what each band of the AQI means for a day in the park, and where in the park the smoke tends to sit."
          actions={<React.Fragment>
            <HomeLink go={go} location="smoke_today_head" className="hp-button" href="#smoke-now">The latest reading <span>↓</span></HomeLink>
            <HomeLink go={go} location="smoke_today_head" className="hp-link" href="#smoke-scale">What the number means ↓</HomeLink>
          </React.Fragment>}
        />
        <p className="ff-cover__credit">Tunnel View in Ferguson Fire smoke, July 2018. Photo: USDA Forest Service Region 5 / Wikimedia Commons (CC BY 2.0)</p>
      </div>

      <section className="hp-wrap rd-official sm-now" id="smoke-now" tabIndex={-1} aria-labelledby="sm-now-h">
        <div className="rd-official__head">
          <p className="hp-eyebrow"><EventIcon name="cloud" size={16} /> AIR QUALITY NEAR YOSEMITE VALLEY</p>
          <h2 id="sm-now-h">One number, and where it came from.</h2>
          <p className="ff-lede">The highest pollutant reading AirNow reports for the area nearest Yosemite Valley, within 50 miles. The area that answers is not always inside the park, and smoke varies from one part of the park to the next, so the sources under it come first when they disagree.</p>
        </div>
        <SmkReading />
        <SmkFire go={go} />
        <ul className="rd-official__list">
          <li>
            <a href={SMK_FIRE_AIRNOW} target="_blank" rel="noopener noreferrer">
              <strong>AirNow Fire and Smoke Map ↗</strong>
              <span>The EPA's official map: AQI readings monitor by monitor in and near the park, updated several times a day.</span>
            </a>
          </li>
          <li>
            <a href={SMK_NPS_AIR} target="_blank" rel="noopener noreferrer">
              <strong>NPS air quality and smoke ↗</strong>
              <span>The park's own air quality and smoke monitoring page. Worth a look the morning of any big hike in smoke season.</span>
            </a>
          </li>
          <li>
            <a href={SMK_NPS_CONDITIONS} target="_blank" rel="noopener noreferrer">
              <strong>NPS current conditions ↗</strong>
              <span>Smoke events alongside the road and trail closures. Read it within 24 hours of a trip in fire season.</span>
            </a>
          </li>
        </ul>
        <p className="rd-checked"><strong>Last checked: {SMK_CHECKED}.</strong> That is the date the guidance and links on this page were last reviewed, not the date of the reading, which carries its own hour.</p>
      </section>

      <div className="hp-wrap">
        <dl className="ff-facts">
          <div><EventIcon name="calendar" /><dt>Fire season</dt><dd>Roughly July through November</dd></div>
          <div><EventIcon name="mountain" /><dt>Valley floor</dt><dd>About 4,000 feet, where smoke settles</dd></div>
          <div><EventIcon name="route" /><dt>Often cleaner</dt><dd>Above about 7,500 feet</dd></div>
          <div><EventIcon name="eye" /><dt>Reading from</dt><dd>AirNow (EPA)</dd></div>
        </dl>
        <nav className="ff-toc" aria-label="On this page">
          <span>On this page</span>
          {toc.map(([href, label]) => (
            <HomeLink key={href} go={go} location="smoke_today_toc" href={href}>{label}</HomeLink>
          ))}
        </nav>
      </div>

      <section className="ff-band" id="smoke-scale" tabIndex={-1}>
        <div className="hp-wrap hp-section">
          <HpHeading eyebrow="THE AIR QUALITY INDEX" title="What the number means for a day in the park" />
          <p className="ff-lede ff-lede--intro">The bands are the AQI's own; what to do in each is this site's advice, the same as <HomeLink go={go} location="smoke_today_scale" href={SMK_SMOKE_ARTICLE}>the smoke-season guide</HomeLink>. Children, older adults and anyone with a respiratory or heart condition need tighter lines, under "Where the smoke sits" below.</p>
          <ol className="rd-pattern sm-bands">
            {SMK_BANDS.map(([range, cat, what]) => (
              <li key={range}>
                <span>{range}</span>
                <p>{what}</p>
                <strong className="sm-bands__cat">{cat}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-wrap hp-section" id="smoke-where" tabIndex={-1}>
        <HpHeading eyebrow="WHERE THE SMOKE SITS" title="The same day, different air" />
        <ul className="ff-rules">
          {SMK_RULES.map(([icon, head, text]) => (
            <li key={head}><EventIcon name={icon} size={26} /><strong>{head}</strong><p>{text}</p></li>
          ))}
        </ul>
        <div className="rd-reads">
          <h3>Read next</h3>
          <ul>
            {SMK_READS.map(([href, label, note]) => (
              <li key={href}>
                <HomeLink go={go} location="smoke_today_reads" href={href}><strong>{label}</strong><span>{note}</span></HomeLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ff-band" id="smoke-faq" tabIndex={-1}>
        <div className="hp-wrap hp-section ff-split">
          <div>
            <p className="hp-eyebrow">QUESTIONS</p>
            <h2>Yosemite smoke questions, answered</h2>
            <p className="ff-lede">Smoke and closures are separate problems: a fire's closure list is on <HomeLink go={go} location="smoke_today_faq" href="/now">the Park Bulletin</HomeLink>, and what a closed road does to a trip is on <HomeLink go={go} location="smoke_today_faq" href="/road-status">the road-status page</HomeLink>.</p>
          </div>
          <div className="ff-faq">
            {SMK_FAQ.map(([q, a], i) => (
              <details key={q} open={i < 2}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HpGuideBand
        go={go}
        location="smoke-today"
        title="Past the gate, the signal goes."
        intro="Most of the park has no cell service, so check the air in the last town. The Field Guide app carries offline maps, every stop with parking notes, and a trip planner that works without a signal."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="The park this week, from inside it"
        heading="The park this week, from inside it"
        blurb="What the park is doing right now: what is open, what is flowing, and what changed."
        location="smoke-today"
        tag="smoke-today"
      />
    </div>
  );
}

window.SmokeTodayPage = SmokeTodayPage;
