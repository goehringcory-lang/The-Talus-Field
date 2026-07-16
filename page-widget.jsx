/* global React, NewsletterInline, Breadcrumbs */

// =============================================================================
// CONDITIONS WIDGET — `/widget` route (MONETIZATION-IDEAS.md 4.2). The pitch
// page for the free embeddable "Yosemite right now" box: live entrance waits
// plus a three-day Valley forecast, rendered by one script tag, with a
// backlink to /conditions. Free for gateway hotels, rental hosts, and tour
// operators; every embed is a standing backlink from an exactly-relevant
// domain, and the follow-up conversation ("want the Field Guide for your
// guests too?") is the B2B door-opener.
//
// The widget itself is served by the API Worker (GET /widget.js, data at
// /widget/conditions, CORS *). The live preview below loads the real script,
// which is why api.thetalusfieldjournal.com is allow-listed in script-src in
// _headers — the one CSP change the widget needed.
// =============================================================================

const WIDGET_SNIPPET = [
  '<div id="talus-conditions"></div>',
  '<script src="https://api.thetalusfieldjournal.com/widget.js" async></script>',
].join("\n");

function WidgetPage({ go }) {
  const [copied, setCopied] = React.useState(false);

  // The live preview: the real embed, exactly as a hotel's page would run it.
  // The script finds #talus-conditions (rendered below) and fills it in.
  React.useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://api.thetalusfieldjournal.com/widget.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
  }, []);

  const copySnippet = async () => {
    if (window.track) window.track("widget_copy_snippet", { location: "widget" });
    try {
      await navigator.clipboard.writeText(WIDGET_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_e) {
      // Clipboard denied: the snippet is visible and selectable below.
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <Breadcrumbs go={go} trail={[{ label: "Home", route: "home" }, { label: "Widget" }]} />
          <div className="eyebrow eyebrow--moss">Free embed · for Yosemite-area sites</div>
          <h1>Put the park's conditions on your site.</h1>
          <p className="page-head__dek">
            A small box with live entrance waits and the three-day Valley forecast,
            for gateway hotels, rental hosts, and tour operators. One script tag,
            no account, no cost. Your guests check conditions on your page instead
            of leaving it.
          </p>
        </div>
      </div>

      <div className="wrap wrap--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section className="prose">
          <h2>What your visitors see</h2>
        </section>
        {/* Live preview: the real widget, filled by the real script. */}
        <div id="talus-conditions" style={{ margin: "16px 0 8px" }} />
        <p style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ink-3)", margin: "0 0 32px" }}>
          Live preview. Waits refresh every few minutes from the National Park
          Service feed; the forecast is the National Weather Service Valley
          point forecast. If the box is empty, the data sources are down and the
          widget shows nothing rather than an error.
        </p>

        <section className="prose">
          <h2>Install it</h2>
          <p>Paste this where you want the box to appear:</p>
        </section>
        <pre style={{ background: "var(--paper-2)", border: "1px solid var(--ink)", padding: 16, fontSize: 13, overflowX: "auto", margin: "12px 0 10px" }}>
          <code>{WIDGET_SNIPPET}</code>
        </pre>
        <button type="button" className="btn" onClick={copySnippet} style={{ border: 0, font: "inherit", cursor: "pointer" }}>
          {copied ? "Copied." : "Copy the snippet"}
        </button>

        <section className="prose" style={{ marginTop: 40 }}>
          <h2>The terms, plainly</h2>
          <p>
            Free, indefinitely. The box carries one small credit line linking to
            this site's conditions page; that line stays. The styling is
            self-contained and will not fight your stylesheet. If the widget ever
            misbehaves on your site, email{" "}
            <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>{" "}
            and it gets fixed or you delete one line and it is gone.
          </p>
        </section>

        <NewsletterInline
          location="widget"
          tag="widget"
          heading="Run a Yosemite-area business?"
          blurb="Sunday Field Notes carries what changed in the park each week, the same material your guests ask the front desk about. Free."
        />
      </div>
    </div>
  );
}

window.WidgetPage = WidgetPage;
