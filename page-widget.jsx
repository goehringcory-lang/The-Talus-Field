/* global React, HpPageHead, HpLetter */

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
    <div className="page hp-widget">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Widget" }]}
        eyebrow="FREE EMBED · FOR YOSEMITE-AREA SITES"
        title="Put the park's conditions on your site."
        intro="A small box with live entrance waits and the three-day Valley forecast, for gateway hotels, rental hosts, and tour operators. One script tag, no account, no cost. Your guests check conditions on your page instead of leaving it."
        aside={
          <div className="hp-widget__preview">
            <p className="hp-eyebrow">WHAT YOUR VISITORS SEE</p>
            {/* Live preview: the real widget, filled by the real script. */}
            <div id="talus-conditions" />
            <p className="hp-terms">
              Live preview. Waits refresh every few minutes from the National Park
              Service feed; the forecast is the National Weather Service Valley
              point forecast. If the box is empty, the data sources are down and the
              widget shows nothing rather than an error.
            </p>
          </div>
        }
      />

      <div className="hp-wrap hp-reading">
        <div className="hp-reading__column">
        <section className="prose">
          <h2>Install it</h2>
          <p>Paste this where you want the box to appear:</p>
        </section>
        <pre className="hp-widget__snippet">
          <code>{WIDGET_SNIPPET}</code>
        </pre>
        <button type="button" className="hp-button" onClick={copySnippet}>
          {copied ? "Copied." : "Copy the snippet"}
        </button>

        <section className="prose hp-widget__more">
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

        <section className="prose hp-widget__more">
          <h2>The other half of this</h2>
          <p>
            The widget is what your visitors see before they arrive. The Field
            Guide is what they carry once they are past the entrance station,
            where service dies: 44 stops with GPS and time budgets, the day
            hikes, the trip planner, and an offline map of the park. Properties
            can buy it in packs and hand a code to every guest, which is the{" "}
            <a href="/partners" onClick={(e) => { e.preventDefault(); go("partners"); }}>group codes</a>{" "}
            page. Buying one has nothing to do with keeping the other; the
            widget stays free either way.
          </p>
        </section>

        </div>
      </div>

      <HpLetter
        eyebrow="SUNDAY FIELD NOTES / FREE"
        title="Run a Yosemite-area business?"
        heading="Run a Yosemite-area business?"
        blurb="Sunday Field Notes carries what changed in the park each week, the same material your guests ask the front desk about. Free."
        location="widget"
        tag="widget"
      />
    </div>
  );
}

window.WidgetPage = WidgetPage;
