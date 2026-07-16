var WIDGET_SNIPPET = ['<div id="talus-conditions"></div>', '<script src="https://api.thetalusfieldjournal.com/widget.js" async></script>'].join("\n");
function WidgetPage({
  go
}) {
  var [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    var s = document.createElement("script");
    s.src = "https://api.thetalusfieldjournal.com/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  var copySnippet = async () => {
    if (window.track) window.track("widget_copy_snippet", {
      location: "widget"
    });
    try {
      await navigator.clipboard.writeText(WIDGET_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_e) {}
  };
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
      label: "Widget"
    }]
  }), React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Free embed · for Yosemite-area sites"), React.createElement("h1", null, "Put the park's conditions on your site."), React.createElement("p", {
    className: "page-head__dek"
  }, "A small box with live entrance waits and the three-day Valley forecast, for gateway hotels, rental hosts, and tour operators. One script tag, no account, no cost. Your guests check conditions on your page instead of leaving it."))), React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 40,
      paddingBottom: 64
    }
  }, React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "What your visitors see")), React.createElement("div", {
    id: "talus-conditions",
    style: {
      margin: "16px 0 8px"
    }
  }), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 12,
      color: "var(--ink-3)",
      margin: "0 0 32px"
    }
  }, "Live preview. Waits refresh every few minutes from the National Park Service feed; the forecast is the National Weather Service Valley point forecast. If the box is empty, the data sources are down and the widget shows nothing rather than an error."), React.createElement("section", {
    className: "prose"
  }, React.createElement("h2", null, "Install it"), React.createElement("p", null, "Paste this where you want the box to appear:")), React.createElement("pre", {
    style: {
      background: "var(--paper-2)",
      border: "1px solid var(--ink)",
      padding: 16,
      fontSize: 13,
      overflowX: "auto",
      margin: "12px 0 10px"
    }
  }, React.createElement("code", null, WIDGET_SNIPPET)), React.createElement("button", {
    type: "button",
    className: "btn",
    onClick: copySnippet,
    style: {
      border: 0,
      font: "inherit",
      cursor: "pointer"
    }
  }, copied ? "Copied." : "Copy the snippet"), React.createElement("section", {
    className: "prose",
    style: {
      marginTop: 40
    }
  }, React.createElement("h2", null, "The terms, plainly"), React.createElement("p", null, "Free, indefinitely. The box carries one small credit line linking to this site's conditions page; that line stays. The styling is self-contained and will not fight your stylesheet. If the widget ever misbehaves on your site, email", " ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " ", "and it gets fixed or you delete one line and it is gone.")), React.createElement(NewsletterInline, {
    location: "widget",
    tag: "widget",
    heading: "Run a Yosemite-area business?",
    blurb: "Sunday Field Notes carries what changed in the park each week, the same material your guests ask the front desk about. Free."
  })));
}
window.WidgetPage = WidgetPage;
