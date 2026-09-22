/* global React, HpPageHead, HpPostcard */
const { useState } = React;

// API base for the Worker. Override at runtime via window.GUIDE_API_BASE
// (same convention as page-guide.jsx) to point at local dev.
const CONTACT_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

function NewsletterPage({ go }) {
  const [done, setDone] = useState(false);
  return (
    <div className="page hp-nlpage">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Newsletter" }]}
        eyebrow="NEWSLETTER"
        title="Sunday Field Notes."
        intro="A short note on Sundays, when there is something to say. Subscribing is free."
        aside={<HpPostcard />}
      >
        <div className="hp-nlpage__perk">
          <p className="hp-eyebrow">FREE FOR SUBSCRIBERS</p>
          <p>
            Sign up and unlock <a className="hp-inline" href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>the interactive Yosemite map</a>: vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder that saves your route on your device. It opens the moment you subscribe.
          </p>
        </div>

        {done ? (
          <p className="hp-nlpage__done">
            Thanks. <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>The map is open to you →</a>
          </p>
        ) : (
          <form
            className="nlbox__form"
            action="https://buttondown.com/api/emails/embed-subscribe/goehring"
            method="post"
            target="buttondown-target"
            onSubmit={() => {
              if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("newsletter_page", "newsletter-page");
              setTimeout(() => setDone(true), 0);
            }}
          >
            <input
              type="email"
              name="email"
              aria-label="Email address"
              placeholder="you@email.com"
              required
            />
            <input type="hidden" name="tag" value="newsletter-page" />
            <input type="hidden" name="embed" value="1" />
            <button type="submit">Subscribe →</button>
          </form>
        )}
      </HpPageHead>

      <section className="hp-wrap hp-section hp-nlpage__terms">
        <div>
          <h3>Cadence</h3>
          <p className="hp-sub">Sundays, when there is something to say. Some weeks there is not.</p>
        </div>
        <div>
          <h3>Mail</h3>
          <p className="hp-sub">Used to send the dispatch. Not shared. Unsubscribe at the bottom of any letter.</p>
        </div>
        <p className="hp-nlpage__privacy">
          <a className="hp-link" href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy ↗</a>
        </p>
      </section>
    </div>
  );
}

function ContactPage({ go }) {
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
    <div className="page hp-contact">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Contact" }]}
        eyebrow="CONTACT"
        title="Send me a note."
        intro="I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking."
      />

      <section className="hp-wrap hp-section">
        <div className="hp-contact__grid">
          {done ? (
            <div role="status" className="hp-contact__sent">
              <p className="hp-eyebrow">SENT</p>
              <h2>Got it. Thanks.</h2>
              <p>I read every note. I will write back when I can, usually within a few days.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="hp-contact__pair">
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
                <p className="hp-contact__error">
                  {error} You can also email <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a> directly.
                </p>
              )}
              <button className="btn" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send →"}
              </button>
            </form>
          )}

          <aside className="hp-contact__aside">
            <p className="hp-eyebrow">DIRECT</p>
            <p className="hp-contact__mail">
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>
            </p>
            <p className="hp-contact__note">
              I check this once or twice a day. Usually faster on Mondays.
            </p>

            <div className="hp-contact__heads">
              <p className="hp-eyebrow">HEADS UP</p>
              <p className="hp-contact__note">
                I cannot help with reservation problems on Recreation.gov. I am not the National Park Service. For emergencies in the park, dial 911 or 209-379-1992.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

window.NewsletterPage = NewsletterPage;
window.ContactPage = ContactPage;
