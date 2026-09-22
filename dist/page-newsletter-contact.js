var {
  useState
} = React;
var CONTACT_API_BASE = typeof window !== "undefined" && window.GUIDE_API_BASE || "https://api.thetalusfieldjournal.com";
function NewsletterPage({
  go
}) {
  var [done, setDone] = useState(false);
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
    intro: "A short note on Sundays, when there is something to say. Subscribing is free.",
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
    className: "hp-nlpage__done"
  }, "Thanks. ", React.createElement("a", {
    href: "/map",
    onClick: e => {
      e.preventDefault();
      go("map");
    }
  }, "The map is open to you →")) : React.createElement("form", {
    className: "nlbox__form",
    action: "https://buttondown.com/api/emails/embed-subscribe/goehring",
    method: "post",
    target: "buttondown-target",
    onSubmit: () => {
      if (window.trackNewsletterSubmit) window.trackNewsletterSubmit("newsletter_page", "newsletter-page");
      setTimeout(() => setDone(true), 0);
    }
  }, React.createElement("input", {
    type: "email",
    name: "email",
    "aria-label": "Email address",
    placeholder: "you@email.com",
    required: true
  }), React.createElement("input", {
    type: "hidden",
    name: "tag",
    value: "newsletter-page"
  }), React.createElement("input", {
    type: "hidden",
    name: "embed",
    value: "1"
  }), React.createElement("button", {
    type: "submit"
  }, "Subscribe →"))), React.createElement("section", {
    className: "hp-wrap hp-section hp-nlpage__terms"
  }, React.createElement("div", null, React.createElement("h3", null, "Cadence"), React.createElement("p", {
    className: "hp-sub"
  }, "Sundays, when there is something to say. Some weeks there is not.")), React.createElement("div", null, React.createElement("h3", null, "Mail"), React.createElement("p", {
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
  }, "Privacy ↗"))));
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
      window.track("contact_submit", {
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
    eyebrow: "CONTACT",
    title: "Send me a note.",
    intro: "I read everything. I answer most things, eventually. If you are asking a trip-planning question, please include your dates and what kind of trip you are imagining; otherwise I will just write back asking."
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
    onSubmit: submit
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
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "DIRECT"), React.createElement("p", {
    className: "hp-contact__mail"
  }, React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com")), React.createElement("p", {
    className: "hp-contact__note"
  }, "I check this once or twice a day. Usually faster on Mondays."), React.createElement("div", {
    className: "hp-contact__heads"
  }, React.createElement("p", {
    className: "hp-eyebrow"
  }, "HEADS UP"), React.createElement("p", {
    className: "hp-contact__note"
  }, "I cannot help with reservation problems on Recreation.gov. I am not the National Park Service. For emergencies in the park, dial 911 or 209-379-1992."))))));
}
window.NewsletterPage = NewsletterPage;
window.ContactPage = ContactPage;
