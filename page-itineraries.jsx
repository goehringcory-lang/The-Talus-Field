/* global React, HpPageHead, HpHeading, HpGuideBand, HpLetter, LodgingCta */

// =============================================================================
// ITINERARIES — `/itineraries` route. The curated day plans from
// itineraries-data.js (window.ITINERARIES), rendered as prose with each
// stop's name and blurb resolved from points.geojson. Every plan ends in an
// "Open this trip on the map" link built as a real /map?trip= URL: the map
// page parses ?trip= on load, so these anchors navigate fully instead of
// using the SPA go() helper (which drops query strings by design).
// =============================================================================

const { useEffect: useEffectIt, useState: useStateIt } = React;

function ItinerariesPage({ go }) {
  // Stop names/blurbs come from the same geojson the map uses. The page
  // renders without it (titles, deks, map links), so a failed fetch degrades
  // to a lighter page rather than an error.
  const [stopsById, setStopsById] = useStateIt(null);

  useEffectIt(() => {
    let cancelled = false;
    fetch(window.POINTS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const byId = {};
        (data.features || []).forEach((f) => { byId[f.properties.id] = f.properties; });
        setStopsById(byId);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const itineraries = window.ITINERARIES || [];

  const tripUrl = (it) => {
    const ids = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
    return `/map?trip=${ids.join(",")}`;
  };

  return (
    <div className="page hp-itin">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Itineraries" }]}
        eyebrow="ITINERARIES"
        title="Yosemite, in day-sized pieces."
        intro="Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day."
        aside={
          <nav className="hp-list hp-partindex" aria-label="The four plans">
            {itineraries.map((it) => (
              <a key={it.id} className="hp-row" href={`#${it.id}`}>
                <div>
                  <p className="hp-eyebrow">{(it.label || "").toUpperCase()}</p>
                  <h3>{it.title}</h3>
                  <b>{it.days.length} {it.days.length === 1 ? "day" : "days"} <span>↓</span></b>
                </div>
              </a>
            ))}
          </nav>
        }
      />

      {itineraries.map((it) => (
        <section key={it.id} id={it.id} tabIndex={-1} className="hp-wrap hp-section itin">
          <HpHeading eyebrow={(it.label || "").toUpperCase()} title={it.title} />
          <p className="hp-sub">{it.dek}</p>
          <p className="itin__season">{it.season}</p>

          <div className="itin__days">
            {it.days.map((day) => (
              <div key={day.name} className="itin__day">
                <h3 className="itin__day-name">{day.name}</h3>
                <ol className="itin__stops">
                  {day.stopIds.map((id) => {
                    const stop = stopsById && stopsById[id];
                    return (
                      <li key={id} className="itin__stop">
                        <span>
                          <span className="itin__stop-name">{stop ? stop.name : id.replace(/-/g, " ")}</span>
                          {stop && stop.blurb && <span className="itin__stop-blurb">{stop.blurb}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>

          <a
            className="hp-button"
            href={tripUrl(it)}
            onClick={() => {
              if (window.track) window.track("itinerary_open_map", { itinerary: it.id });
            }}
          >
            Open this trip on the map →
          </a>
        </section>
      ))}

      <section className="hp-wrap hp-section itin__after">
        <p className="hp-sub">
          These plans are starting points, not homework. The{" "}
          <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>full map</a>{" "}
          has every pin, and the trip builder saves whatever you assemble on your own device. For the reasoning behind the stops, start with{" "}
          <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>the planning guide</a>.
        </p>

        {/* Every multi-day plan above implies a night between the days, and
            where that night is spent decides whether day two starts at the
            trailhead or in the entrance line. */}
        <LodgingCta
          destination="Yosemite National Park"
          heading="Every plan above needs a night between the days"
          note="These are built on early starts, which is a lodging decision before it is an itinerary decision: a bed in the Valley or in El Portal buys the first two hours of the day, and Oakhurst costs you them. The full comparison of every in-park and gateway option is one page over."
          list="page_itineraries"
          slug="itineraries"
          cta="See what is available on your dates →"
        />
      </section>

      {/* The purchase ask: itinerary readers are packing dates into days,
          the exact moment the offline app earns its price. */}
      <HpGuideBand
        go={go}
        location="itineraries"
        title="These plans, offline, in the park."
        intro="The Field Guide app carries the same curated stops with parking and timing notes, offline maps that keep working in the dead zones between them, and a day-by-day planner. One purchase, eighteen months of access."
        sample
      />
      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Get the conditions before you go"
        heading="Get the conditions before you go"
        blurb="Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed. Free."
        location="itineraries"
        tag="itineraries"
      />
    </div>
  );
}

window.ItinerariesPage = ItinerariesPage;
