/* global React, WebcamStrip, EntranceWaits, NewsletterInline, Breadcrumbs */

// =============================================================================
// THIS WEEK IN THE PARK — `/now` route. The between-trips destination: a dated
// weekly dispatch (150-300 words) on what the park is doing right now, over
// the live layer the site already has (webcams, entrance waits), ending in the
// capture unit whose promise this page makes concrete ("this, in your inbox,
// Sunday"). Dispatches live in /now.json, hand-edited weekly; see the
// __comment there for the update workflow. The archive renders below the
// current dispatch so the page accrues history (and freshness signals).
//
// NOW_URL carries its own cache-buster, like POINTS_URL on the map page: bump
// the ?v= when now.json changes, or readers behind the CDN keep last week.
// =============================================================================
const NOW_URL = "/now.json?v=1";

function formatDispatchDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function NowPage({ go }) {
  const [dispatches, setDispatches] = React.useState(null);
  const [state, setState] = React.useState("loading");

  React.useEffect(() => {
    let cancelled = false;
    fetch(NOW_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`now.json ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.dispatches) ? data.dispatches : [];
        setDispatches(list);
        setState(list.length ? "ready" : "empty");
      })
      .catch((err) => {
        console.error("NowPage: dispatches unavailable", err);
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, []);

  const latest = state === "ready" ? dispatches[0] : null;
  const archive = state === "ready" ? dispatches.slice(1) : [];

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "This week" }]} />
          <div className="eyebrow eyebrow--moss">The weekly dispatch</div>
          <h1>This Week in the Park</h1>
          <p className="page-head__dek">
            One short note a week on what Yosemite is actually doing: what's open,
            what's flowing, what's blooming, and what changed. Written from inside
            the park, updated most weekends.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        {state === "loading" && (
          <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Loading this week's dispatch…</p>
        )}
        {(state === "error" || state === "empty") && (
          <p style={{ color: "var(--ink-3)" }}>
            The dispatch didn't load. The live layer below still works, and{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>the conditions page</a>{" "}
            has the webcams and forecasts.
          </p>
        )}
        {latest && (
          <article className="prose">
            <p className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--moss)", marginBottom: 8 }}>
              <time dateTime={latest.iso}>{formatDispatchDate(latest.iso)}</time>
            </p>
            <h2 style={{ marginTop: 0 }}>{latest.title}</h2>
            {latest.body.map((p, i) => <p key={i}>{p}</p>)}
          </article>
        )}

        {/* The live layer: same components the masthead and /conditions use. */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The park right now</div>
          <WebcamStrip />
          <div style={{ marginTop: 16, fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)" }}>
            More live sources, one page:{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>
              webcams, entrance waits, and forecasts →
            </a>
          </div>
        </div>

        <NewsletterInline
          location="now"
          tag="now"
          heading="This, in your inbox, Sunday"
          blurb="The weekly dispatch is the letter. Sunday Field Notes carries it, plus whatever else the week earned. Free."
        />

        {archive.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>Earlier weeks</div>
            {archive.map((d) => (
              <details key={d.iso} style={{ borderTop: "1px solid var(--rule)", padding: "12px 0" }}>
                <summary style={{ cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14 }}>
                  <time dateTime={d.iso}>{formatDispatchDate(d.iso)}</time> · {d.title}
                </summary>
                <div className="prose" style={{ paddingTop: 8 }}>
                  {d.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </details>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

window.NowPage = NowPage;
