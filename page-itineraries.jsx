/* global React, NewsletterInline, GuidePromo */

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
    const url = window.POINTS_URL || "/points.geojson";
    fetch(url)
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
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <div className="eyebrow eyebrow--moss">Itineraries</div>
          <h1>Yosemite, in day-sized pieces.</h1>
          <p className="page-head__dek">
            Four plans built from the map's curated pins, ordered the way you would actually drive them. Pick the one that matches your time, open it on the map, and adjust from there. None of this requires a reservation; all of it fits in a normal day.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48 }}>
        {itineraries.map((it) => (
          <section key={it.id} id={it.id} className="itin">
            <div className="eyebrow" style={{ marginBottom: 10 }}>{it.label}</div>
            <h2 className="itin__title">{it.title}</h2>
            <p className="itin__dek">{it.dek}</p>
            <p className="itin__season">{it.season}</p>

            {it.days.map((day) => (
              <div key={day.name} className="itin__day">
                <h3 className="itin__day-name">{day.name}</h3>
                <ol className="itin__stops">
                  {day.stopIds.map((id) => {
                    const stop = stopsById && stopsById[id];
                    return (
                      <li key={id} className="itin__stop">
                        <span className="itin__stop-name">{stop ? stop.name : id.replace(/-/g, " ")}</span>
                        {stop && stop.blurb && <span className="itin__stop-blurb">{stop.blurb}</span>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}

            <a
              className="btn btn--ghost"
              href={tripUrl(it)}
              onClick={() => {
                if (window.track) window.track("itinerary_open_map", { itinerary: it.id });
              }}
            >
              Open this trip on the map →
            </a>
          </section>
        ))}

        <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", maxWidth: 680, margin: "56px 0" }}>
          These plans are starting points, not homework. The{" "}
          <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>full map</a>{" "}
          has every pin, and the trip builder saves whatever you assemble on your own device. For the reasoning behind the stops, start with{" "}
          <a href="/planning" onClick={(e) => { e.preventDefault(); go("planning"); }}>the planning guide</a>.
        </p>

        {/* The purchase ask: itinerary readers are packing dates into days,
            the exact moment the offline app earns its price. */}
        <GuidePromo
          go={go}
          location="itineraries"
          title="These plans, offline, in the park."
          body="The Field Guide app carries the same curated stops with parking and timing notes, offline maps that keep working in the dead zones between them, and a day-by-day planner. One purchase, eighteen months of access."
          style={{ maxWidth: 680, marginBottom: 56 }}
        />

        <div style={{ maxWidth: 680, marginBottom: 96 }}>
          <NewsletterInline
            location="itineraries"
            tag="itineraries"
            heading="Get the conditions before you go"
            blurb="Roads open and close, trails change, and the plans above age with them. One Sunday email carries what changed. Free."
          />
        </div>
      </div>
    </div>
  );
}

window.ItinerariesPage = ItinerariesPage;
