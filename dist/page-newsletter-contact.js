var {
  useState
} = React;
var CONTACT_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
function NewsletterPage({
  go
}) {
  var [done, setDone] = useState(false);
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "wrap wrap--narrow",
    style: {
      paddingTop: 96,
      paddingBottom: 96
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Newsletter"), React.createElement("h1", {
    style: {
      marginTop: 16,
      marginBottom: 24
    }
  }, "Sunday Field Notes."), React.createElement("p", {
    style: {
      fontSize: 22,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 32,
      fontFamily: "var(--display)",
      fontStyle: "italic"
    }
  }, "A short note on Sundays, when there is something to say. Subscribing is free."), React.createElement("div", {
    style: {
      border: "1px solid var(--moss)",
      background: "var(--paper-2)",
      padding: "20px 24px",
      marginBottom: 40
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss",
    style: {
      marginBottom: 8
    }
  }, "Free for subscribers"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      lineHeight: 1.6,
      color: "var(--ink)",
      margin: 0
    }
  }, "Sign up and unlock ", React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "the interactive Yosemite map"), ": vistas, trailheads, parking turnouts, picnic spots, and places to eat, with a trip builder that saves your route on your device. It opens the moment you subscribe.")), done ? React.createElement("p", {
    style: {
      borderTop: "1px solid var(--ink)",
      borderBottom: "1px solid var(--ink)",
      padding: "24px 0",
      marginBottom: 48,
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontSize: 22,
      color: "var(--moss)"
    }
  }, "Thanks. ", React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "The map is open to you →")) : React.createElement("form", {
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("newsletter_page", "newsletter-page");
      setTimeout(() => setDone(true), 0);
    },
    style: {
      borderTop: "1px solid var(--ink)",
      borderBottom: "1px solid var(--ink)",
      padding: "24px 0",
      display: "flex",
      gap: 16,
      alignItems: "center",
      marginBottom: 48
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    "aria-label": "Email address",
    placeholder: "you@email.com",
    required: true,
    style: {
      flex: 1,
      fontFamily: "var(--serif)",
      fontSize: 22,
      background: "transparent",
      border: 0,
      outline: "none",
      color: "var(--ink)"
    }
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "newsletter-page"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    className: "btn",
    type: "submit"
  }, "Subscribe →")), React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 40,
      marginTop: 64
    }
  }, React.createElement("div", null, React.createElement("h3", {
    style: {
      fontSize: 19,
      marginBottom: 10,
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontWeight: 500
    }
  }, "Cadence"), React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      lineHeight: 1.6,
      fontFamily: "var(--serif)",
      fontSize: 16
    }
  }, "Sundays, when there is something to say. Some weeks there is not.")), React.createElement("div", null, React.createElement("h3", {
    style: {
      fontSize: 19,
      marginBottom: 10,
      fontFamily: "var(--display)",
      fontStyle: "italic",
      fontWeight: 500
    }
  }, "Mail"), React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      lineHeight: 1.6,
      fontFamily: "var(--serif)",
      fontSize: 16
    }
  }, "Used to send the dispatch. Not shared. Unsubscribe at the bottom of any letter."))), React.createElement("div", {
    style: {
      marginTop: 64,
      paddingTop: 32,
      borderTop: "1px solid var(--rule)",
      fontFamily: "var(--sans)",
      fontSize: 11,
      color: "var(--ink-3)",
      lineHeight: 1.6,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      fontWeight: 600
    }
  }, React.createElement("a", {
    href: "/privacy",
    onClick: e => {
      e.preventDefault();
      go("privacy");
    },
    style: {
      color: "var(--ink-2)"
    }
  }, "Privacy →"))));
}
function ContactPage() {
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
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not send. Please email directly.");
    } finally {
      setSending(false);
    }
  }
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Contact"), React.createElement("h1", null, "Send me a note."), React.createElement("p", {
    className: "page-head__dek"
  }, "I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking."))), React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 56,
      paddingBottom: 96
    }
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 64,
      alignItems: "start"
    }
  }, done ? React.createElement("div", {
    role: "status",
    style: {
      border: "1px solid var(--moss)",
      padding: 40,
      background: "var(--paper-2)"
    }
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Sent"), React.createElement("h2", {
    style: {
      fontSize: 26,
      marginTop: 8,
      marginBottom: 12
    }
  }, "Got it. Thanks."), React.createElement("p", {
    style: {
      color: "var(--ink-2)"
    }
  }, "I read every note. I will write back when I can, usually within a few days.")) : React.createElement("form", {
    onSubmit: submit
  }, React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24
    }
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
    style: {
      color: "#a02b1f",
      fontFamily: "var(--sans)",
      fontSize: 14,
      marginBottom: 16
    }
  }, error, " You can also email ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " directly."), React.createElement("button", {
    className: "btn",
    type: "submit",
    disabled: sending
  }, sending ? "Sending…" : "Send →")), React.createElement("aside", {
    style: {
      borderLeft: "1px solid var(--rule)",
      paddingLeft: 32
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Direct"), React.createElement("p", {
    style: {
      fontFamily: "var(--serif)",
      fontSize: 17,
      marginBottom: 6
    }
  }, React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com")), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.55,
      marginBottom: 28
    }
  }, "I check this once or twice a day. Usually faster on Mondays."), React.createElement("div", {
    style: {
      borderTop: "1px solid var(--rule)",
      marginTop: 32,
      paddingTop: 24
    }
  }, React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Heads up"), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.6
    }
  }, "I cannot help with reservation problems on Recreation.gov. I am not the National Park Service. For emergencies in the park, dial 911 or 209-379-1992."))))));
}
window.NewsletterPage = NewsletterPage;
window.ContactPage = ContactPage;
