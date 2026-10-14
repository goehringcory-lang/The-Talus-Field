/* global React, HpPageHead, HpPostcard, NewsletterForm, useRecentLetters */
const { useState, useEffect, useRef } = React;

// API base for the Worker. Override at runtime via window.GUIDE_API_BASE
// (same convention as page-guide.jsx) to point at local dev.
const CONTACT_API_BASE =
  (typeof window !== "undefined" && window.GUIDE_API_BASE) ||
  "https://api.thetalusfieldjournal.com";

// The archive pages (no JavaScript) post their form straight to the Worker,
// which answers with a redirect here: ?joined=1 on the list, ?retry=<reason>
// when this page's own form should take over.
const NL_RETRY_COPY = {
  invalid: "That address did not take. Check it and try again here.",
  rate: "Too many tries from this connection. Try again in an hour.",
  fallback: "Our signup did not answer that time. Try again here.",
};

function formatLetterDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
}

// The last few letters as they went out, so a reader can read one before
// deciding. Renders nothing until the feed answers, and nothing if it fails.
function RecentLetters() {
  const ref = useRef(null);
  const letters = useRecentLetters(ref);
  return (
    <div ref={ref}>
      {letters.length > 0 && (
        <section className="hp-wrap hp-section hp-nlpage__recent" aria-labelledby="nl-recent-h">
          <p className="hp-eyebrow">RECENT LETTERS</p>
          <h2 id="nl-recent-h">Read one before you decide.</h2>
          <ol className="hp-nlpage__letters">
            {letters.map((l) => (
              <li key={l.url}>
                {l.date && <time dateTime={l.date}>{formatLetterDate(l.date)}</time>}
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener"
                  onClick={() => { if (window.track) window.track("newsletter_sample_click", { location: "newsletter_page" }); }}
                >{l.title} ↗</a>
                {l.excerpt && <p>{l.excerpt}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

function NewsletterPage({ go }) {
  const [done, setDone] = useState(null); // null | "api" | "tab"
  const [retry, setRetry] = useState(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("joined") === "1") {
      // Counted here, the one place an archive signup can be seen client-side.
      window.trackNewsletterSubmit("archive_ask", "archive");
      setDone("api");
    } else if (NL_RETRY_COPY[q.get("retry")]) {
      setRetry(q.get("retry"));
    }
    if (q.has("joined") || q.has("retry")) {
      // A reload must not count the signup twice.
      try { window.history.replaceState(window.history.state, "", window.location.pathname); } catch (_e) { /* old browsers keep the query */ }
    }
  }, []);
  return (
    <div className="page hp-nlpage">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: "Newsletter" }]}
        eyebrow="NEWSLETTER"
        title="Sunday Field Notes."
        intro="A letter from inside Yosemite on Sundays: what the park is doing this week and why, from the river gauges to the oaks, set beside what its naturalists wrote down in the same weeks a century ago. Free."
        aside={<HpPostcard />}
      >
        <div className="hp-nlpage__perk">
          <p className="hp-eyebrow">FREE FOR SUBSCRIBERS</p>
          <p>
            Sign up and unlock <a className="hp-inline" href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>the interactive Yosemite map</a>: vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder that saves your route on your device. It opens the moment you subscribe.
          </p>
        </div>

        {done ? (
          <p className="hp-nlpage__done" role="status">
            {window.nlDoneLine(done)} <a href="/map" onClick={(e) => { e.preventDefault(); go("map"); }}>The map is already open to you →</a>
          </p>
        ) : (
          <>
            {retry && <p className="nlbox__note" role="status">{NL_RETRY_COPY[retry]}</p>}
            <label htmlFor="nl-page-email" className="fj-label">Your email address</label>
            <NewsletterForm location="newsletter_page" tag="newsletter-page" inputId="nl-page-email" inputLabel="Your email address" onDone={setDone} />
          </>
        )}
      </HpPageHead>

      <RecentLetters />

      <section className="hp-wrap hp-section hp-nlpage__terms fj-notes">
        <div className="fj-note">
          <span className="fj-note__stamp" aria-hidden="true">Sun.</span>
          <h2>Cadence</h2>
          <p className="hp-sub">Sunday mornings, Pacific time. Most weeks; a week with nothing worth saying gets no letter.</p>
        </div>
        <div className="fj-note">
          <span className="fj-note__stamp" aria-hidden="true">@</span>
          <h2>Mail</h2>
          <p className="hp-sub">Used to send the dispatch. Not shared. Unsubscribe at the bottom of any letter.</p>
        </div>
        <p className="hp-nlpage__privacy">
          <a className="hp-link" href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}>Privacy ↗</a>
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
      if (window.track) window.track("contact_submit", { subject: form.subject || "" });
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
        className="fj-head fj-topo"
        eyebrow="CONTACT"
        title="Send me a note."
        intro="I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking."
        aside={
          <div className="fj-card hp-contact__direct">
            <p className="hp-eyebrow">DIRECT</p>
            <p className="hp-contact__mail">
              <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>
            </p>
            <p className="hp-contact__note">
              I check this once or twice a day. Usually faster on Mondays.
            </p>
          </div>
        }
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
            <form onSubmit={submit} className="fj-letterhead">
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
