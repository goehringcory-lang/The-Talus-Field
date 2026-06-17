function AboutPage({
  go
}) {
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Colophon"), React.createElement("h1", null, "About this journal."), React.createElement("p", {
    className: "page-head__dek"
  }, "A small site, kept by one person, about one park."))), React.createElement("div", {
    className: "wrap wrap--read",
    style: {
      paddingTop: 56
    }
  }, React.createElement(Placeholder, {
    caption: "Cathedral Rocks from the Merced, El Portal",
    image: "img/cathedral-rocks.jpg",
    credit: "Photo: Wikimedia Commons (public domain)",
    tag: "PORTRAIT",
    size: "lg",
    style: {
      aspectRatio: "4 / 5",
      marginBottom: 40
    }
  }), React.createElement("div", {
    className: "prose"
  }, React.createElement("p", {
    className: "dropcap"
  }, "The Talus Field began as a pile of paper. Trip notes, weather entries, copies of permits, lists of what was blooming on which week. The kind of paper that piles up when you live near a place long enough that you stop seeing the postcard and start seeing the year."), React.createElement("p", null, "Eventually it seemed worth typing some of it up. Not all of it, and not in any particular hurry. The internet has plenty of writing about Yosemite. It does not need more. It might, I think, want some of a different shape."), React.createElement("h2", null, "Shape"), React.createElement("p", null, "Entries come out when an entry is ready. There is no schedule. Some are short. Some are several thousand words. Some are trail reports. Some are weather. Some are arguments with myself about what the park does in February. The categories on the site are a rough sort, not a content plan."), React.createElement("p", null, "I keep what is here as accurate as I can. I update entries when conditions change, and I leave a note when I do. If something is wrong, write to me. I would rather hear about it than not."), React.createElement("h2", null, "Reader"), React.createElement("p", null, "The reader I have in mind is someone planning a first trip and feeling slightly buried by the logistics. If you are a fortieth-time visitor looking for trail beta, you may still find something here, but most of the writing is pitched a little earlier than that."), React.createElement("h2", null, "Practice"), React.createElement("p", null, "Recommendations are for things I have used, walked in, slept in, read cover to cover, or worked alongside. Nothing on the site is built from a search-result roundup or a press kit. If a piece of gear is here, I have walked at least fifty miles in it. If a guidebook is here, I have read it cover to cover. If a lodge is here, I have stayed there or know someone who has, and I will tell you which."), React.createElement("h2", null, "Editor"), React.createElement("p", null, "Cory Goehring. Lives in Yosemite National Park. Has worked in and around it for twenty seasons, mostly on foot. Reachable at ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), " and through ", React.createElement("a", {
    href: "/contact",
    onClick: e => {
      e.preventDefault();
      go("contact");
    }
  }, "the contact page"), "."), React.createElement("hr", null), React.createElement("p", {
    style: {
      fontFamily: "var(--sans)",
      fontSize: 13,
      color: "var(--ink-3)",
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      fontWeight: 600
    }
  }, "Set in EB Garamond and Inter. Hosted independently. Not affiliated with the National Park Service.")), React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, React.createElement(NewsletterInline, {
    heading: "Sunday Field Notes",
    blurb: "A short note on Sundays, when there is something to say."
  }))));
}
window.AboutPage = AboutPage;
