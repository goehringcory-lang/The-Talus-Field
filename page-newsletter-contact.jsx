/* global React */
const { useState } = React;

// API base for the Worker. Override at runtime via window.GUIDE_API_BASE
// (same convention as page-guide.jsx) to point at local dev.
const CONTACT_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

function NewsletterPage({ go }) {
  const [done, setDone] = useState(false);
  return (
    <div className="page">
      <div className="wrap wrap--narrow" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss">Newsletter</div>
        <h1 style={{ marginTop: 16, marginBottom: 24 }}>Sunday Field Notes.</h1>
        <p style={{ fontSize: 22, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 32, fontFamily: "var(--display)", fontStyle: "italic" }}>
          A short note on Sundays, when there is something to say. Subscribing is free.
        </p>

        <div style={{ border: "1px solid var(--moss)", background: "var(--paper-2)", padding: "20px 24px", marginBottom: 40 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 8 }}>Free for subscribers</div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
            Sign up and unlock <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>the interactive Yosemite map</a>: vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder that saves your route on your device. It opens the moment you subscribe.
          </p>
        </div>

        {done ? (
          <p style={{ borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)", padding: "24px 0", marginBottom: 48, fontFamily: "var(--display)", fontStyle: "italic", fontSize: 22, color: "var(--moss)" }}>
            Thanks. <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>The map is open to you →</a>
          </p>
        ) : (
          <form
            action="https://buttondown.com/api/emails/embed-subscribe/goehring"
            method="post"
            target="buttondown-target"
            onSubmit={() => {
              if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("newsletter_page", "newsletter-page");
              setTimeout(() => setDone(true), 0);
            }}
            style={{ borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)", padding: "24px 0", display: "flex", gap: 16, alignItems: "center", marginBottom: 48 }}
          >
            <input
              type="email"
              name="email"
              aria-label="Email address"
              placeholder="you@email.com"
              required
              style={{ flex: 1, fontFamily: "var(--serif)", fontSize: 22, background: "transparent", border: 0, outline: "none", color: "var(--ink)" }}
            />
            <input type="hidden" name="tag" value="newsletter-page" />
            <input type="hidden" name="embed" value="1" />
            <button className="btn" type="submit">Subscribe →</button>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 64 }}>
          <div>
            <h3 style={{ fontSize: 19, marginBottom: 10, fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 500 }}>Cadence</h3>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6, fontFamily: "var(--serif)", fontSize: 16 }}>
              Sundays, when there is something to say. Some weeks there is not.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 19, marginBottom: 10, fontFamily: "var(--display)", fontStyle: "italic", fontWeight: 500 }}>Mail</h3>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6, fontFamily: "var(--serif)", fontSize: 16 }}>
              Used to send the dispatch. Not shared. Unsubscribe at the bottom of any letter.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--rule)", fontFamily: "var(--sans)", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }} style={{ color: "var(--ink-2)" }}>Privacy →</a>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", message: "", website: "" });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  function update(k, v) { setForm({ ...form, [k]: v }); }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${CONTACT_API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Send failed (${res.status})`);
      }
      window.track("contact_submit", { subject: form.subject || "" });
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not send. Please email directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">Contact</div>
          <h1>Send me a note.</h1>
          <p className="page-head__dek">
            I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "start" }}>
          {done ? (
            <div role="status" style={{ border: "1px solid var(--moss)", padding: 40, background: "var(--paper-2)" }}>
              <div className="eyebrow eyebrow--moss">Sent</div>
              <h2 style={{ fontSize: 26, marginTop: 8, marginBottom: 12 }}>Got it. Thanks.</h2>
              <p style={{ color: "var(--ink-2)" }}>I read every note. I will write back when I can, usually within a few days.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div className="field">
                  <label htmlFor="contact-name">Your name</label>
                  <input id="contact-name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="contact-subject">What's this about</label>
                <select id="contact-subject" value={form.subject} onChange={(e) => update("subject", e.target.value)}>
                  <option value="general">A general note</option>
                  <option value="planning">A trip-planning question</option>
                  <option value="correction">A correction or update to an article</option>
                  <option value="press">Press / interview</option>
                  <option value="other">Something else</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Be as specific as you can."
                />
              </div>
              {/* Honeypot. Hidden from humans; bots fill everything. */}
              <div style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>
              {error && (
                <p style={{ color: "#a02b1f", fontFamily: "var(--sans)", fontSize: 14, marginBottom: 16 }}>
                  {error} You can also email <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a> directly.
                </p>
              )}
              <button className="btn" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send →"}
              </button>
            </form>
          )}

          <aside style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Direct</div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 17, marginBottom: 6 }}>
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 28 }}>
              I check this once or twice a day. Usually faster on Mondays.
            </p>

            <div style={{ borderTop: "1px solid var(--rule)", marginTop: 32, paddingTop: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Heads up</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
                I cannot help with reservation problems on Recreation.gov. I am not the National Park Service. For emergencies in the park, dial 911 or 209-379-1992.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

window.NewsletterPage = NewsletterPage;
window.ContactPage = ContactPage;
