var NOW_URL = "/now.json?v=1";
function formatDispatchDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function NowPage({
  go
}) {
  var [dispatches, setDispatches] = React.useState(null);
  var [state, setState] = React.useState("loading");
  React.useEffect(() => {
    var cancelled = false;
    fetch(NOW_URL).then(r => r.ok ? r.json() : Promise.reject(new Error(`now.json ${r.status}`))).then(data => {
      if (cancelled) return;
      var list = Array.isArray(data.dispatches) ? data.dispatches : [];
      setDispatches(list);
      setState(list.length ? "ready" : "empty");
    }).catch(err => {
      console.error("NowPage: dispatches unavailable", err);
      if (!cancelled) setState("error");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  var latest = state === "ready" ? dispatches[0] : null;
  var archive = state === "ready" ? dispatches.slice(1) : [];
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement(Breadcrumbs, {
    go: go,
    trail: [{
      label: "Home",
      route: "home"
    }, {
      label: "This week"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "The weekly dispatch"), React.createElement("h1", null, "This Week in the Park"), React.createElement("p", {
    className: "page-head__dek"
  }, "One short note a week on what Yosemite is actually doing: what's open, what's flowing, what's blooming, and what changed. Written from inside the park, updated most weekends."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, state === "loading" && React.createElement("p", {
    style: {
      color: "var(--ink-3)",
      fontStyle: "italic"
    }
  }, "Loading this week's dispatch…"), (state === "error" || state === "empty") && React.createElement("p", {
    style: {
      color: "var(--ink-3)"
    }
  }, "The dispatch didn't load. The live layer below still works, and", " ", React.createElement("a", {
    href: "/conditions",
    onClick: e => {
      e.preventDefault();
      go("conditions");
    }
  }, "the conditions page"), " ", "has the webcams and forecasts."), latest && React.createElement("article", {
    className: "prose"
  }, React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--moss)",
      marginBottom: 8
    }
  }, React.createElement("time", {
    dateTime: latest.iso
  }, formatDispatchDate(latest.iso))), React.createElement("h2", {
    style: {
      marginTop: 0
    }
  }, latest.title), latest.body.map((p, i) => React.createElement("p", {
    key: i
  }, p))), React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "The park right now"), React.createElement(WebcamStrip, null), React.createElement("div", {
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
    heading: "This, in your inbox, Sunday",
    blurb: "The weekly dispatch is the letter. Sunday Field Notes carries it, plus whatever else the week earned. Free."
  }), archive.length > 0 && React.createElement("section", {
    style: {
      marginTop: 48
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 12
    }
  }, "Earlier weeks"), archive.map(d => React.createElement("details", {
    key: d.iso,
    style: {
      borderTop: "1px solid var(--rule)",
      padding: "12px 0"
    }
  }, React.createElement("summary", {
    style: {
      cursor: "pointer",
      fontFamily: "var(--sans)",
      fontSize: 14
    }
  }, React.createElement("time", {
    dateTime: d.iso
  }, formatDispatchDate(d.iso)), " · ", d.title), React.createElement("div", {
    className: "prose",
    style: {
      paddingTop: 8
    }
  }, d.body.map((p, i) => React.createElement("p", {
    key: i
  }, p))))))));
}
window.NowPage = NowPage;
