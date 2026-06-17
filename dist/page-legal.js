function LegalShell({
  title,
  eyebrow,
  updated,
  children
}) {
  return React.createElement("div", {
    className: "page"
  }, React.createElement("div", {
    className: "page-head"
  }, React.createElement("div", {
    className: "wrap wrap--narrow"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, eyebrow), React.createElement("h1", null, title), React.createElement("p", {
    className: "page-head__dek",
    style: {
      fontSize: 15,
      fontFamily: "var(--sans)",
      color: "var(--ink-3)"
    }
  }, "Last updated ", updated, "."))), React.createElement("div", {
    className: "wrap wrap--read",
    style: {
      paddingTop: 48,
      paddingBottom: 96
    }
  }, React.createElement("div", {
    className: "prose",
    style: {
      fontSize: 17
    }
  }, children)));
}
function PrivacyPage() {
  return React.createElement(LegalShell, {
    title: "Privacy Policy",
    eyebrow: "Legal",
    updated: "April 1, 2026"
  }, React.createElement("p", null, "This privacy policy explains what information The Talus Field collects when you visit this website or subscribe to the newsletter, how that information is used, and the choices you have about it. It is written to comply with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA)."), React.createElement("h2", null, "1. Who we are"), React.createElement("p", null, "The Talus Field is an independent publication operated by Cory Goehring, based in El Portal, California. You can reach us at cory@thetalusfieldjournal.com."), React.createElement("h2", null, "2. What we collect"), React.createElement("p", null, "When you visit the site, we collect anonymized analytics data: pages viewed, referrer, approximate location at the country level, browser and device type. We use this to understand which articles are useful and which are not. We do not collect IP addresses in identifiable form."), React.createElement("p", null, "When you subscribe to the newsletter, we collect your email address and the date you subscribed. We do not collect your name unless you provide it."), React.createElement("p", null, "When you contact us through the contact form, we collect the name, email, subject, and message you submit."), React.createElement("h2", null, "3. How we use it"), React.createElement("p", null, "Email addresses are used to send the newsletter and only the newsletter. We do not sell, rent, share, or otherwise transfer your email address to any third party. Analytics are used to make the site better. Contact form submissions are used to write you back."), React.createElement("h2", null, "4. Cookies"), React.createElement("p", null, "This site uses a single first-party cookie to remember your reading preferences. It does not use advertising cookies, tracking cookies, or third-party cookies. We do not run advertisements."), React.createElement("h2", null, "5. Your rights (GDPR / CCPA)"), React.createElement("p", null, "You have the right to access, correct, export, or delete any personal information we hold about you. To exercise any of these rights, email cory@thetalusfieldjournal.com with the subject line \"Data request.\" We respond within 30 days."), React.createElement("h2", null, "6. Children"), React.createElement("p", null, "This site is not directed at children under 13. We do not knowingly collect information from children."), React.createElement("h2", null, "7. Changes"), React.createElement("p", null, "If this policy changes in any meaningful way, the change will be announced in the newsletter and the \"last updated\" date above will change."), React.createElement("h2", null, "8. Questions"), React.createElement("p", null, "Email cory@thetalusfieldjournal.com."));
}
function TermsPage() {
  return React.createElement(LegalShell, {
    title: "Terms of Service",
    eyebrow: "Legal",
    updated: "April 1, 2026"
  }, React.createElement("p", null, "These terms govern your use of The Talus Field (thetalusfieldjournal.com). By using the site, you agree to them. The Field Guide and interactive map are provided free of charge. No purchase is required."), React.createElement("h2", null, "1. Use of content"), React.createElement("p", null, "All articles, photographs, and other content on this site are copyrighted by Cory Goehring unless otherwise noted. You may quote up to 300 words in another work with a clear link back to the original article. You may not republish, syndicate, or train machine learning models on any content without written permission."), React.createElement("h2", null, "2. Accuracy"), React.createElement("p", null, "I try to keep everything on this site accurate, and I update articles when conditions change. That said, conditions in Yosemite change constantly. Trail closures, road closures, weather, wildlife behavior, and permit rules are all subject to change without notice. Always verify current conditions with the National Park Service before any trip."), React.createElement("h2", null, "3. No warranty"), React.createElement("p", null, "The site is provided as-is. I make no warranty, express or implied, that any information on the site is accurate, complete, or fit for any particular purpose. You assume all risk for your own choices in the park."), React.createElement("h2", null, "4. Limitation of liability"), React.createElement("p", null, "To the fullest extent permitted by law, The Talus Field is not liable for any injury, loss, or damage arising from your use of this site or your activities in Yosemite National Park. The mountains are real. Walk carefully."), React.createElement("h2", null, "5. Third-party links"), React.createElement("p", null, "The site contains links to third-party sites, including affiliate links to lodging and gear vendors. We are not responsible for the content or practices of those sites."), React.createElement("h2", null, "6. Governing law"), React.createElement("p", null, "These terms are governed by the laws of the State of California."), React.createElement("h2", null, "7. Changes"), React.createElement("p", null, "If these terms change in any meaningful way, the change will be announced in the newsletter and the \"last updated\" date above will change."));
}
function AffiliatePage() {
  return React.createElement(LegalShell, {
    title: "Affiliate Disclosure",
    eyebrow: "Legal",
    updated: "April 1, 2026"
  }, React.createElement("p", null, "The Talus Field is a participant in several affiliate programs, including Amazon Associates, Bookshop.org, REI's affiliate program, Backcountry's affiliate program, Patagonia's affiliate program, and a small number of guidebook publishers' direct programs."), React.createElement("p", null, "What that means in plain language: when an article on this site links to a product, a book, or a piece of lodging, that link may be an affiliate link. If you click through and make a purchase, I receive a small commission. The price you pay does not change. Whether or not you use the affiliate link, the recommendation in the article is the same."), React.createElement("h2", null, "What I will and will not do"), React.createElement("p", null, "I will only recommend things I have actually used, read, eaten, or stayed in. I will not write a \"best XYZ\" roundup of products I have never touched. If a piece of gear is on this site, I have walked at least fifty miles in it. If a guidebook is on this site, I have read it cover to cover. If a hotel is on this site, I have either stayed there or know someone who has, and I will tell you which."), React.createElement("p", null, "I will not accept payment to recommend something. I have turned down sponsorships from at least four gear companies and one regional tourism board. If that ever changes, I will tell you about it on this page and in the newsletter, on the same day."), React.createElement("h2", null, "How to identify an affiliate link"), React.createElement("p", null, "Every article that contains affiliate links includes a short note at the end of the article saying so, with a link back to this page. Inline affiliate links are marked with a small icon (★) on hover."), React.createElement("h2", null, "Directory listings"), React.createElement("p", null, "The Directory contains two kinds of entries. Most are personal recommendations: lodgings I have stayed in, guides I have worked with, outfitters I have used. Those entries are unpaid. A small number are paid placements from operators who have applied for a listing and met an editorial standard I would apply to anyone. Paid placements are clearly labeled wherever they appear, and a paid placement does not change the editorial blurb. An operator does not get a more flattering description by paying."), React.createElement("p", null, "If a listing ever drops below the standard, it comes off the directory. If you operate a Yosemite-adjacent business and would like to be considered, write to ", React.createElement("a", {
    href: "mailto:cory@thetalusfieldjournal.com"
  }, "cory@thetalusfieldjournal.com"), ". ", React.createElement("a", {
    href: "/advertise"
  }, "More on how directory listings work.")), React.createElement("h2", null, "FTC disclosure"), React.createElement("p", null, "This disclosure is provided in accordance with the Federal Trade Commission's 16 CFR Part 255, \"Guides Concerning the Use of Endorsements and Testimonials in Advertising.\""), React.createElement("h2", null, "Questions"), React.createElement("p", null, "Email cory@thetalusfieldjournal.com."));
}
window.PrivacyPage = PrivacyPage;
window.TermsPage = TermsPage;
window.AffiliatePage = AffiliatePage;
