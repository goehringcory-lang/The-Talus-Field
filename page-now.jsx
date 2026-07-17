/* global React, WebcamStrip, NewsletterInline, Breadcrumbs */

// =============================================================================
// THE PARK BULLETIN — `/now` route. One page, the whole park, right now: the
// site's condensation of the current NPS Yosemite Guide edition (published on
// a rotating ~5-week schedule) into a single scannable board. What changed,
// what's open, the free-program clock, the dated events, trails, hours,
// transit, and the numbers that matter. Content lives in /bulletin.json,
// rewritten once per Guide edition; see its __comment for the workflow.
//
// BULLETIN_URL carries its own cache-buster, like POINTS_URL on the map page:
// bump the ?v= when bulletin.json changes, or readers behind the CDN keep the
// last edition. Keep HOME_BULLETIN_URL in page-home.jsx on the same number.
// =============================================================================
const BULLETIN_URL = "/bulletin.json?v=2";

function bulletinDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Day N of M through the edition window; null outside it (or on bad dates).
function editionProgress(edition) {
  const start = new Date(edition.start + "T00:00:00");
  const end = new Date(edition.end + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const day = Math.floor((today - start) / 86400000) + 1;
  const total = Math.floor((end - start) / 86400000) + 1;
  if (day < 1 || day > total) return null;
  return { day, total };
}

function isPastEvent(ev) {
  if (!ev.end) return false;
  const end = new Date(ev.end + "T23:59:59");
  return !Number.isNaN(end.getTime()) && end < new Date();
}

function BulletinChip({ tone, children }) {
  return <span className={`bulletin-chip bulletin-chip--${tone || "open"}`}>{children}</span>;
}

function BulletinCard({ title, wide, children }) {
  return (
    <section className={wide ? "bulletin-card bulletin-card--wide" : "bulletin-card"}>
      <h2 className="eyebrow eyebrow--moss bulletin-card__head">{title}</h2>
      {children}
    </section>
  );
}

function BulletinPage({ go }) {
  const [data, setData] = React.useState(null);
  const [state, setState] = React.useState("loading");

  React.useEffect(() => {
    let cancelled = false;
    fetch(BULLETIN_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))))
      .then((json) => {
        if (cancelled) return;
        if (json && json.edition) {
          setData(json);
          setState("ready");
        } else {
          setState("error");
        }
      })
      .catch((err) => {
        console.error("BulletinPage: bulletin unavailable", err);
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, []);

  const edition = data ? data.edition : null;
  const progress = edition ? editionProgress(edition) : null;

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "The Park Bulletin" }]} />
          <div className="eyebrow eyebrow--moss">One page, the whole park</div>
          <h1>The Park Bulletin</h1>
          <p className="page-head__dek">
            Everything happening in Yosemite right now, on one scannable page:
            what changed, what's open, the daily programs, the dated events, and
            the hours and numbers that matter. Rebuilt for each edition of the
            park's printed Yosemite Guide.
          </p>
          {edition && (
            <p className="bulletin-edition mono">
              <span className="bulletin-edition__label">Covering {edition.label}</span>
              {progress && <span> · day {progress.day} of {progress.total}</span>}
              <span> · updated <time dateTime={edition.updated}>{bulletinDate(edition.updated)}</time></span>
            </p>
          )}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 64 }}>
        {state === "loading" && (
          <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Loading the current edition…</p>
        )}
        {state === "error" && (
          <p style={{ color: "var(--ink-3)" }}>
            The bulletin didn't load. The live layer still works:{" "}
            <a href="/conditions" onClick={(e) => { e.preventDefault(); go("conditions"); }}>webcams, entrance waits, and forecasts</a>.
          </p>
        )}

        {state === "ready" && (
          <React.Fragment>
            {edition.lede && <p className="bulletin-lede">{edition.lede}</p>}

            {/* What changed: the read-this-first band. */}
            {data.alerts && data.alerts.length > 0 && (
              <section className="bulletin-alerts">
                <h2 className="eyebrow eyebrow--moss bulletin-card__head">Changed this edition</h2>
                <ul>
                  {data.alerts.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </section>
            )}

            {/* The status board. */}
            <BulletinCard title="Roads & areas" wide>
              <div className="bulletin-status">
                {data.areas.map((area) => (
                  <div className="bulletin-status__row" key={area.name}>
                    <div className="bulletin-status__name">
                      <strong>{area.name}</strong>
                      <BulletinChip tone={area.tone}>{area.chip}</BulletinChip>
                    </div>
                    <p>{area.note}</p>
                  </div>
                ))}
              </div>
            </BulletinCard>

            <div className="bulletin-grid">
              {/* The free-program clock. */}
              <BulletinCard title="The Valley, by the clock">
                <table className="bulletin-clock">
                  <tbody>
                    {data.valleyDay.map((p, i) => (
                      <tr key={i} className={p.fee ? "bulletin-clock__row bulletin-clock__row--fee" : "bulletin-clock__row"}>
                        <td className="bulletin-clock__time mono">{p.time}</td>
                        <td className="bulletin-clock__what">
                          <span className="bulletin-clock__title">{p.title}{p.fee ? " ($)" : ""}</span>
                          <span className="bulletin-clock__meta">
                            {p.days}{p.where ? ` · ${p.where}` : ""}{p.note ? ` · ${p.note}` : ""}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.valleyDayNote && <p className="bulletin-note">{data.valleyDayNote}</p>}
              </BulletinCard>

              {/* Beyond the Valley, one card per area. */}
              <div className="bulletin-stack">
                {data.elsewhere.map((sec) => (
                  <BulletinCard title={sec.area} key={sec.area}>
                    <ul className="bulletin-list">
                      {sec.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </BulletinCard>
                ))}
              </div>
            </div>

            {/* Dated events, past ones dimmed as the edition ages. */}
            <BulletinCard title="On the calendar this edition" wide>
              <div className="bulletin-events">
                {data.events.map((ev, i) => (
                  <div className={isPastEvent(ev) ? "bulletin-event is-past" : "bulletin-event"} key={i}>
                    <span className="bulletin-event__date mono">{ev.dates}</span>
                    <div>
                      <span className="bulletin-event__title">{ev.title}</span>
                      <span className="bulletin-event__meta">
                        {ev.where}{ev.note ? ` · ${ev.note}` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {data.eventsNote && <p className="bulletin-note">{data.eventsNote}</p>}
            </BulletinCard>

            <div className="bulletin-grid">
              {/* Trails as a status list, not a guidebook. */}
              <BulletinCard title="Trails right now">
                <div className="bulletin-status">
                  {data.trails.map((t) => (
                    <div className="bulletin-status__row" key={t.name}>
                      <div className="bulletin-status__name">
                        <strong>{t.name}</strong>
                        <BulletinChip tone={t.tone}>{t.chip}</BulletinChip>
                      </div>
                      <p>{t.note}</p>
                    </div>
                  ))}
                </div>
                {data.trailsNote && <p className="bulletin-note">{data.trailsNote}</p>}
              </BulletinCard>

              <div className="bulletin-stack">
                {data.hours.map((g) => (
                  <BulletinCard title={g.group} key={g.group}>
                    <table className="bulletin-hours">
                      <tbody>
                        {g.items.map((it) => (
                          <tr key={it.name}>
                            <td>{it.name}{it.note ? <span className="bulletin-hours__note"> · {it.note}</span> : null}</td>
                            <td className="mono">{it.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </BulletinCard>
                ))}
              </div>
            </div>

            <div className="bulletin-grid">
              <BulletinCard title="Getting around">
                <div className="bulletin-defs">
                  {data.transit.map((t) => (
                    <p key={t.name}><strong>{t.name}.</strong> {t.note}</p>
                  ))}
                </div>
              </BulletinCard>

              <BulletinCard title="Know before you go">
                <div className="bulletin-defs">
                  {data.essentials.map((e) => (
                    <p key={e.title}><strong>{e.title}.</strong> {e.text}</p>
                  ))}
                </div>
                <table className="bulletin-hours bulletin-numbers">
                  <tbody>
                    {data.numbers.map((n) => (
                      <tr key={n.label}>
                        <td>{n.label}</td>
                        <td className="mono">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </BulletinCard>
            </div>

            <p className="bulletin-source">
              {edition.source}{" "}
              <a href={edition.sourceUrl} target="_blank" rel="noopener noreferrer">The full Guide is on nps.gov ↗</a>
            </p>
          </React.Fragment>
        )}

        {/* The live layer: same webcams the masthead and /conditions use. */}
        <div style={{ marginTop: 48 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 12 }}>The park live</div>
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
          heading="When the next edition drops, hear about it"
          blurb="The Sunday letter carries what changed on this board, plus whatever else the week earned. Free."
        />
      </div>
    </div>
  );
}

window.BulletinPage = BulletinPage;
