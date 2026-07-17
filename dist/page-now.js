var BULLETIN_URL = "/bulletin.json?v=2";
function bulletinDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function editionProgress(edition) {
  var start = new Date(edition.start + "T00:00:00");
  var end = new Date(edition.end + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  var day = Math.floor((today - start) / 86400000) + 1;
  var total = Math.floor((end - start) / 86400000) + 1;
  if (day < 1 || day > total) return null;
  return {
    day,
    total
  };
}
function isPastEvent(ev) {
  if (!ev.end) return false;
  var end = new Date(ev.end + "T23:59:59");
  return !Number.isNaN(end.getTime()) && end < new Date();
}
function BulletinChip({
  tone,
  children
}) {
  return React.createElement("span", {
    className: `bulletin-chip bulletin-chip--${tone || "open"}`
  }, children);
}
function BulletinCard({
  title,
  wide,
  children
}) {
  return React.createElement("section", {
    className: wide ? "bulletin-card bulletin-card--wide" : "bulletin-card"
  }, React.createElement("h2", {
    className: "eyebrow eyebrow--moss bulletin-card__head"
  }, title), children);
}
function BulletinPage({
  go
}) {
  var [data, setData] = React.useState(null);
  var [state, setState] = React.useState("loading");
  React.useEffect(() => {
    var cancelled = false;
    fetch(BULLETIN_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`bulletin.json ${r.status}`))).then(json => {
      if (cancelled) return;
      if (json && json.edition) {
        setData(json);
        setState("ready");
      } else {
        setState("error");
      }
    }).catch(err => {
      console.error("BulletinPage: bulletin unavailable", err);
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  var edition = data ? data.edition : null;
  var progress = edition ? editionProgress(edition) : null;
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "The Park Bulletin"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "One page, the whole park"), React.createElement("h1", null, "The Park Bulletin"), React.createElement("p", {
    className: "page-head__dek"
  }, "Everything happening in Yosemite right now, on one scannable page: what changed, what's open, the daily programs, the dated events, and the hours and numbers that matter. Rebuilt for each edition of the park's printed Yosemite Guide."), edition && React.createElement("p", {
    className: "bulletin-edition mono"
  }, React.createElement("span", {
    className: "bulletin-edition__label"
  }, "Covering ", edition.label), progress && React.createElement("span", null, " · day ", progress.day, " of ", progress.total), React.createElement("span", null, " · updated ", React.createElement("time", {
    dateTime: edition.updated
  }, bulletinDate(edition.updated)))))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 36,
      paddingBottom: 64
    }
  }, state === "loading" && React.createElement("p", {
    style: {
      color: "var(--ink-3)",
      fontStyle: "italic"
    }
  }, "Loading the current edition…"), state === "error" && React.createElement("p", {
    style: {
      color: "var(--ink-3)"
    }
  }, "The bulletin didn't load. The live layer still works:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "webcams, entrance waits, and forecasts"), "."), state === "ready" && React.createElement(React.Fragment, null, edition.lede && React.createElement("p", {
    className: "bulletin-lede"
  }, edition.lede), data.alerts && data.alerts.length > 0 && React.createElement("section", {
    className: "bulletin-alerts"
  }, React.createElement("h2", {
    className: "eyebrow eyebrow--moss bulletin-card__head"
  }, "Changed this edition"), React.createElement("ul", null, data.alerts.map((a, i) => React.createElement("li", {
    key: i
  }, a)))), React.createElement(BulletinCard, {
    title: "Roads & areas",
    wide: true
  }, React.createElement("div", {
    className: "bulletin-status"
  }, data.areas.map(area => React.createElement("div", {
    className: "bulletin-status__row",
    key: area.name
  }, React.createElement("div", {
    className: "bulletin-status__name"
  }, React.createElement("strong", null, area.name), React.createElement(BulletinChip, {
    tone: area.tone
  }, area.chip)), React.createElement("p", null, area.note))))), React.createElement("div", {
    className: "bulletin-grid"
  }, React.createElement(BulletinCard, {
    title: "The Valley, by the clock"
  }, React.createElement("table", {
    className: "bulletin-clock"
  }, React.createElement("tbody", null, data.valleyDay.map((p, i) => React.createElement("tr", {
    key: i,
    className: p.fee ? "bulletin-clock__row bulletin-clock__row--fee" : "bulletin-clock__row"
  }, React.createElement("td", {
    className: "bulletin-clock__time mono"
  }, p.time), React.createElement("td", {
    className: "bulletin-clock__what"
  }, React.createElement("span", {
    className: "bulletin-clock__title"
  }, p.title, p.fee ? " ($)" : ""), React.createElement("span", {
    className: "bulletin-clock__meta"
  }, p.days, p.where ? ` · ${p.where}` : "", p.note ? ` · ${p.note}` : "")))))), data.valleyDayNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.valleyDayNote)), React.createElement("div", {
    className: "bulletin-stack"
  }, data.elsewhere.map(sec => React.createElement(BulletinCard, {
    title: sec.area,
    key: sec.area
  }, React.createElement("ul", {
    className: "bulletin-list"
  }, sec.items.map((item, i) => React.createElement("li", {
    key: i
  }, item))))))), React.createElement(BulletinCard, {
    title: "On the calendar this edition",
    wide: true
  }, React.createElement("div", {
    className: "bulletin-events"
  }, data.events.map((ev, i) => React.createElement("div", {
    className: isPastEvent(ev) ? "bulletin-event is-past" : "bulletin-event",
    key: i
  }, React.createElement("span", {
    className: "bulletin-event__date mono"
  }, ev.dates), React.createElement("div", null, React.createElement("span", {
    className: "bulletin-event__title"
  }, ev.title), React.createElement("span", {
    className: "bulletin-event__meta"
  }, ev.where, ev.note ? ` · ${ev.note}` : ""))))), data.eventsNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.eventsNote)), React.createElement("div", {
    className: "bulletin-grid"
  }, React.createElement(BulletinCard, {
    title: "Trails right now"
  }, React.createElement("div", {
    className: "bulletin-status"
  }, data.trails.map(t => React.createElement("div", {
    className: "bulletin-status__row",
    key: t.name
  }, React.createElement("div", {
    className: "bulletin-status__name"
  }, React.createElement("strong", null, t.name), React.createElement(BulletinChip, {
    tone: t.tone
  }, t.chip)), React.createElement("p", null, t.note)))), data.trailsNote && React.createElement("p", {
    className: "bulletin-note"
  }, data.trailsNote)), React.createElement("div", {
    className: "bulletin-stack"
  }, data.hours.map(g => React.createElement(BulletinCard, {
    title: g.group,
    key: g.group
  }, React.createElement("table", {
    className: "bulletin-hours"
  }, React.createElement("tbody", null, g.items.map(it => React.createElement("tr", {
    key: it.name
  }, React.createElement("td", null, it.name, it.note ? React.createElement("span", {
    className: "bulletin-hours__note"
  }, " · ", it.note) : null), React.createElement("td", {
    className: "mono"
  }, it.hours))))))))), React.createElement("div", {
    className: "bulletin-grid"
  }, React.createElement(BulletinCard, {
    title: "Getting around"
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.transit.map(t => React.createElement("p", {
    key: t.name
  }, React.createElement("strong", null, t.name, "."), " ", t.note)))), React.createElement(BulletinCard, {
    title: "Know before you go"
  }, React.createElement("div", {
    className: "bulletin-defs"
  }, data.essentials.map(e => React.createElement("p", {
    key: e.title
  }, React.createElement("strong", null, e.title, "."), " ", e.text))), React.createElement("table", {
    className: "bulletin-hours bulletin-numbers"
  }, React.createElement("tbody", null, data.numbers.map(n => React.createElement("tr", {
    key: n.label
  }, React.createElement("td", null, n.label), React.createElement("td", {
    className: "mono"
  }, n.value))))))), React.createElement("p", {
    className: "bulletin-source"
  }, edition.source, " ", React.createElement("a", {
    href: edition.sourceUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "The full Guide is on nps.gov ↗"))), React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The park live"), React.createElement(WebcamStrip, null), React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "More live sources, one page:", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "webcams, entrance waits, and forecasts →"))), React.createElement(NewsletterInline, {
    location: "now",
    tag: "now",
    heading: "When the next edition drops, hear about it",
    blurb: "The Sunday letter carries what changed on this board, plus whatever else the week earned. Free."
  })));
}
window.BulletinPage = BulletinPage;
