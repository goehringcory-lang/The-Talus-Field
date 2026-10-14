var {
  useState,
  useEffect,
  useRef
} = React;
var CONTACT_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
var NL_RETRY_COPY = {
  invalid: "That address did not take. Check it and try again here.",
  rate: "Too many tries from this connection. Try again in an hour.",
  fallback: "Our signup did not answer that time. Try again here."
};
function formatLetterDate(iso) {
  if (!iso) return "";
  var d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles"
  });
}
function RecentLetters() {
  var ref = useRef(null);
  var letters = useRecentLetters(ref);
  return React.createElement("div", {
    ref: ref
  }, letters.length > 0 && React.createElement("section", {
    className: "hp-wrap hp-section hp-nlpage__recent",
    "aria-labelledby": "nl-recent-h"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "RECENT LETTERS"), React.createElement("h2", {
    id: "nl-recent-h"
  }, "Read one before you decide."), React.createElement("ol", {
    className: "hp-nlpage__letters"
  }, letters.map(l => React.createElement("li", {
    key: l.url
  }, l.date && React.createElement("time", {
    dateTime: l.date
  }, formatLetterDate(l.date)), React.createElement("a", {
    href: l.url,
    target: "_blank",
    rel: "noopener",
    onClick: () => {
      if (window.track) window.track("newsletter_sample_click", {
        location: "newsletter_page"
      });
    }
  }, l.title, " ↗"), l.excerpt && React.createElement("p", null, l.excerpt))))));
}
function NewsletterPage({
  go
}) {
  var [done, setDone] = useState(null);
  var [retry, setRetry] = useState(null);
  useEffect(() => {
    var q = new URLSearchParams(window.location.search);
    if (q.get("joined") === "1") {
      window.trackNewsletterSubmit("archive_ask", "archive");
      setDone("api");
    } else if (NL_RETRY_COPY[q.get("retry")]) {
      setRetry(q.get("retry"));
    }
    if (q.has("joined") || q.has("retry")) {
      try {
        window.history.replaceState(window.history.state, "", window.location.pathname);
      } catch (_e) {}
    }
  }, []);
  return React.createElement("div", {
    className: "page hp-nlpage"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Newsletter"
    }],
    eyebrow: "NEWSLETTER",
    title: "Sunday Field Notes.",
    intro: "A letter from inside Yosemite on Sundays: what the park is doing this week and why, from the river gauges to the oaks, set beside what its naturalists wrote down in the same weeks a century ago. Free.",
    aside: React.createElement(HpPostcard, null)
  }, React.createElement("div", {
    className: "hp-nlpage__perk"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "FREE FOR SUBSCRIBERS"), React.createElement("p", null, "Sign up and unlock ", React.createElement("a", {
    className: "hp-inline",
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "the interactive Yosemite map"), ": vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder that saves your route on your device. It opens the moment you subscribe.")), done ? React.createElement("p", {
    className: "hp-nlpage__done",
    role: "status"
  }, window.nlDoneLine(done), " ", React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "The map is already open to you →")) : React.createElement(React.Fragment, null, retry && React.createElement("p", {
    className: "nlbox__note",
    role: "status"
  }, NL_RETRY_COPY[retry]), React.createElement("label", {
    htmlFor: "nl-page-email",
    className: "fj-label"
  }, "Your email address"), React.createElement(NewsletterForm, {
    location: "newsletter_page",
    tag: "newsletter-page",
    inputId: "nl-page-email",
    inputLabel: "Your email address",
    onDone: setDone
  }))), React.createElement(RecentLetters, null), React.createElement("section", {
    className: "hp-wrap hp-section hp-nlpage__terms fj-notes"
  }, React.createElement("div", {
    className: "fj-note"
  }, React.createElement("span", {
    className: "fj-note__stamp",
    "aria-hidden": "true"
  }, "Sun."), React.createElement("h2", null, "Cadence"), React.createElement("p", {
    className: "hp-sub"
  }, "Sunday mornings, Pacific time. Most weeks; a week with nothing worth saying gets no letter.")), React.createElement("div", {
    className: "fj-note"
  }, React.createElement("span", {
    className: "fj-note__stamp",
    "aria-hidden": "true"
  }, "@"), React.createElement("h2", null, "Mail"), React.createElement("p", {
    className: "hp-sub"
  }, "Used to send the dispatch. Not shared. Unsubscribe at the bottom of any letter.")), React.createElement("p", {
    className: "hp-nlpage__privacy"
  }, React.createElement("a", {
    className: "hp-link",
    href: "/privacy",
    onClick: e => {
      e.preventDefault();
      go("privacy");
    }
  }, "Privacy\xA0↗"))));
}
function ContactPage({
  go
}) {
  var [form, setForm] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
    website: ""
  });
  var [done, setDone] = useState(false);
  var [sending, setSending] = useState(false);
  var [error, setError] = useState(null);
  function update(k, v) {
    setForm({
      ...form,
      [k]: v
    });
  }
  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      var res = await fetch(`${CONTACT_API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        var data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Send failed (${res.status})`);
      }
      if (window.track) window.track("contact_submit", {
        subject: form.subject || ""
      });
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not send. Please email directly.");
    } finally {
      setSending(false);
    }
  }
  return React.createElement("div", {
    className: "page hp-contact"
  }, React.createElement(HpPageHead, {
    go: go,
    crumbs: [{
      label: "Home",
      route: "home"
    }, {
      label: "Contact"
    }],
    className: "fj-head fj-topo",
    eyebrow: "CONTACT",
    title: "Send me a note.",
    intro: "I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking.",
    aside: React.createElement("div", {
      className: "fj-card hp-contact__direct"
    }, React.createElement("p", {
      className: "hp-eyebrow"
    }, "DIRECT"), React.createElement("p", {
      className: "hp-contact__mail"
    }, React.createElement("a", {
      href: "mailto:cory@thetalusfieldjournal.com"
    }, "cory@thetalusfieldjournal.com")), React.createElement("p", {
      className: "hp-contact__note"
    }, "I check this once or twice a day. Usually faster on Mondays."))
  }), React.createElement("section", {
    className: "hp-wrap hp-section"
  }, React.createElement("div", {
    className: "hp-contact__grid"
  }, done ? React.createElement("div", {
    role: "status",
    className: "hp-contact__sent"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "SENT"), React.createElement("h2", null, "Got it. Thanks."), React.createElement("p", null, "I read every note. I will write back when I can, usually within a few days.")) : React.createElement("form", {
    onSubmit: submit,
    className: "fj-letterhead"
  }, React.createElement("div", {
    className: "hp-contact__pair"
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "contact-name"
  }, "Your name"), React.createElement("input", {
    id: "contact-name",
    type: "text",
    required: true,
    value: form.name,
    onChange: e => update("name", e.target.value)
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "contact-email"
  }, "Email"), React.createElement("input", {
    id: "contact-email",
    type: "email",
    required: true,
    value: form.email,
    onChange: e => update("email", e.target.value)
  }))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "contact-subject"
  }, "What's this about"), React.createElement("select", {
    id: "contact-subject",
    value: form.subject,
    onChange: e => update("subject", e.target.value)
  }, React.createElement("option", {
    value: "general"
  }, "A general note"), React.createElement("option", {
    value: "planning"
  }, "A trip-planning question"), React.createElement("option", {
    value: "correction"
  }, "A correction or update to an article"), React.createElement("option", {
    value: "press"
  }, "Press / interview"), React.createElement("option", {
    value: "other"
  }, "Something else"))), React.createElement("div", {
    className: "field"
  }, React.createElement("label", {
    htmlFor: "contact-message"
  }, "Message"), React.createElement("textarea", {
    id: "contact-message",
    required: true,
    value: form.message,
    onChange: e => update("message", e.target.value),
    placeholder: "Be as specific as you can."
  })), React.createElement("div", {
    style: {
      position: "absolute",
      left: "-10000px",
      width: 1,
      height: 1,
      overflow: "hidden"
    },
    "aria-hidden": "true"
  }, React.createElement("label", {
    htmlFor: "contact-website"
  }, "Website"), React.createElement("input", {
    id: "contact-website",
    type: "text",
    tabIndex: -1,
    autoComplete: "off",
    value: form.website,
    onChange: e => update("website", e.target.value)
  })), error && React.createElement("p", {
    className: "hp-contact__error"
  }, error, " You can also email ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " directly."), React.createElement("button", {
    className: "btn",
    type: "submit",
    disabled: sending
  }, sending ? "Sending…" : "Send →")), React.createElement("aside", {
    className: "hp-contact__aside"
  }, React.createElement("div", {
    className: "hp-contact__heads"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HEADS UP"), React.createElement("p", {
    className: "hp-contact__note"
  }, "I cannot help with reservation problems on Recreation.gov. I am not the National Park Service. For emergencies in the park, dial 911 or 209-379-1992."))))));
}
window.NewsletterPage = NewsletterPage;
window.ContactPage = ContactPage;
