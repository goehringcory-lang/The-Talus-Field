/* global React */

function LegalShell({ title, eyebrow, updated, children }) {
  return (
    <div className="page">
      <div className="page-head">
        <div className="wrap wrap--narrow">
          <div className="eyebrow eyebrow--moss">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="page-head__dek" style={{ fontSize: 15, fontFamily: "var(--sans)", color: "var(--ink-3)" }}>
            Last updated {updated}.
          </p>
        </div>
      </div>
      <div className="wrap wrap--read" style={{ paddingTop: 48, paddingBottom: 96 }}>
        <div className="prose" style={{ fontSize: 17 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" eyebrow="Legal" updated="July 8, 2026">
      <p>This privacy policy explains what information The Talus Field collects when you visit this website, subscribe to the newsletter, or use the Field Guide app, how that information is used, and the choices you have about it. It is written to comply with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).</p>

      <h2>1. Who we are</h2>
      <p>The Talus Field is an independent publication operated by Cory Goehring, based in El Portal, California. You can reach us at cory@thetalusfieldjournal.com.</p>

      <h2>2. What we collect</h2>
      <p>When you visit the site, we collect anonymized analytics data: pages viewed, referrer, approximate location at the country level, browser and device type. We use this to understand which articles are useful and which are not. We do not collect IP addresses in identifiable form.</p>
      <p>When you subscribe to the newsletter, we collect your email address and the date you subscribed. We do not collect your name unless you provide it.</p>
      <p>When you contact us through the contact form, we collect the name, email, subject, and message you submit.</p>
      <p>When you buy and sign in to the Field Guide app, we collect the email address or username tied to your purchase and a record of that purchase. Payment is processed by Stripe, and we never see or store your card number. Your trip plan itself, the stops and dates you choose, is stored on your own device, not on our servers.</p>

      <h2>3. How we use it</h2>
      <p>Email addresses are used to send the newsletter and only the newsletter. We do not sell, rent, share, or otherwise transfer your email address to any third party. Analytics are used to make the site better. Contact form submissions are used to write you back. Field Guide purchase records are used to confirm your access when you sign in.</p>

      <h2>4. The Field Guide app and calendar sync</h2>
      <p>The Field Guide app can add your trip plan to your personal calendar. Two options exist, and both are off until you turn them on from the app's Account page.</p>
      <p>The Apple Calendar option publishes your trip as a private subscription link that Apple Calendar reads on its own schedule. That link contains only the events in your trip plan.</p>
      <p>If you connect Google Calendar, you grant The Talus Field permission to manage events on your Google Calendar (the <code>calendar.events</code> scope) and to see the email address of the Google account you connect. We use this access for one purpose only: to create, update, and remove the trip events you build in the app, in your primary Google calendar. We do not read your existing calendar events, we do not access any other Google data, and we do not use this access for advertising or for any purpose beyond syncing your trip.</p>
      <p>To keep your trip in sync after you close the app, Google issues a long-lived authorization token, which we store securely on our server and associate with your account. We show you which Google account is connected so you can confirm it is yours.</p>
      <p>You can disconnect Google Calendar at any time from the Account page. Disconnecting removes the trip events we added to your Google calendar, revokes our authorization token, and deletes it from our server. You can also revoke our access directly from your Google account's security settings at <a href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer">myaccount.google.com/connections</a>.</p>
      <p>The Talus Field's use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

      <h2>5. Cookies</h2>
      <p>This site uses a single first-party cookie to remember your reading preferences. It does not use advertising cookies, tracking cookies, or third-party cookies. We do not run advertisements.</p>

      <h2>6. Your rights (GDPR / CCPA)</h2>
      <p>You have the right to access, correct, export, or delete any personal information we hold about you. To exercise any of these rights, email cory@thetalusfieldjournal.com with the subject line "Data request." We respond within 30 days.</p>

      <h2>7. Children</h2>
      <p>This site is not directed at children under 13. We do not knowingly collect information from children.</p>

      <h2>8. Changes</h2>
      <p>If this policy changes in any meaningful way, the change will be announced in the newsletter and the "last updated" date above will change.</p>

      <h2>9. Questions</h2>
      <p>Email cory@thetalusfieldjournal.com.</p>
    </LegalShell>
  );
}

function TermsPage() {
  return (
    <LegalShell title="Terms of Service" eyebrow="Legal" updated="April 1, 2026">
      <p>These terms govern your use of The Talus Field (thetalusfieldjournal.com) and the Field Guide app. By using either, you agree to them. The articles and the interactive trip-planner map on this site are free to browse. The Field Guide app is a paid product; its purchase terms are in section 1.</p>

      <h2>1. The Field Guide purchase</h2>
      <p>The Field Guide is a one-time purchase, not a subscription. Payment is processed by Stripe; we never see or store your card number. A purchase grants access to the Field Guide for 18 months from the purchase date, on any device you sign in to, including all updates published during that window. Access is for you and the people traveling with you, not for redistribution.</p>
      <p>If the guide does not work as described, email cory@thetalusfieldjournal.com within 30 days of purchase and we will refund it in full. After a refund, your access code is deactivated.</p>

      <h2>2. Use of content</h2>
      <p>All articles, photographs, and other content on this site are copyrighted by Cory Goehring unless otherwise noted. You may quote up to 300 words in another work with a clear link back to the original article. You may not republish, syndicate, or train machine learning models on any content without written permission.</p>

      <h2>3. Accuracy</h2>
      <p>I try to keep everything on this site accurate, and I update articles when conditions change. That said, conditions in Yosemite change constantly. Trail closures, road closures, weather, wildlife behavior, and permit rules are all subject to change without notice. Always verify current conditions with the National Park Service before any trip.</p>

      <h2>4. No warranty</h2>
      <p>The site is provided as-is. I make no warranty, express or implied, that any information on the site is accurate, complete, or fit for any particular purpose. You assume all risk for your own choices in the park.</p>

      <h2>5. Limitation of liability</h2>
      <p>To the fullest extent permitted by law, The Talus Field is not liable for any injury, loss, or damage arising from your use of this site or your activities in Yosemite National Park. The mountains are real. Walk carefully.</p>

      <h2>6. Third-party links</h2>
      <p>The site contains links to third-party sites, including affiliate links to lodging and gear vendors. We are not responsible for the content or practices of those sites.</p>

      <h2>7. Governing law</h2>
      <p>These terms are governed by the laws of the State of California.</p>

      <h2>8. Changes</h2>
      <p>If these terms change in any meaningful way, the change will be announced in the newsletter and the "last updated" date above will change.</p>
    </LegalShell>
  );
}

function AffiliatePage() {
  return (
    <LegalShell title="Affiliate Disclosure" eyebrow="Legal" updated="July 20, 2026">
      <p>The Talus Field currently participates in one affiliate program: Patagonia's, run through the Impact network. Applications to lodging and camping programs (Booking.com and Hipcamp) are pending; until they are approved, the lodging and camping links in articles are plain outbound links that earn nothing. When that changes, this page changes the same day.</p>

      <p>What that means in plain language: when an article on this site links to a product, a book, or a piece of lodging, that link may be an affiliate link. If you click through and make a purchase or a booking, I receive a small commission. The price you pay does not change. Whether or not you use the affiliate link, the recommendation in the article is the same.</p>

      <h2>The rule that governs all of it</h2>
      <p>No program's catalog shapes a recommendation. If the best lodge in a town, the best campground on a road, or the best jacket for a season has no affiliate program, it stays the top recommendation, linkless. Availability links sit under recommendations that were already written; they never decide what gets recommended. If you ever catch this site steering you toward a worse option because it pays, write to me, and I will fix it and say so in the newsletter.</p>

      <h2>What I will and will not do</h2>
      <p>I will only recommend things I have actually used, read, eaten, or stayed in. I will not write a "best XYZ" roundup of products I have never touched. If a piece of gear is on this site, I have walked at least fifty miles in it. If a guidebook is on this site, I have read it cover to cover. If a hotel is on this site, I have either stayed there or know someone who has, and I will tell you which.</p>

      <p>I will not accept payment to recommend something. I have turned down sponsorships from at least four gear companies and one regional tourism board. If that ever changes, I will tell you about it on this page and in the newsletter, on the same day.</p>

      <h2>How to identify an affiliate link</h2>
      <p>Every article that contains affiliate links includes a short note at the end of the article saying so, with a link back to this page. Inline affiliate links are marked with a small icon (★) on hover.</p>

      <h2>Directory listings</h2>
      <p>The Directory contains two kinds of entries. Most are personal recommendations: lodgings I have stayed in, guides I have worked with, outfitters I have used. Those entries are unpaid. A small number are paid placements from operators who have applied for a listing and met an editorial standard I would apply to anyone. Paid placements are clearly labeled wherever they appear, and a paid placement does not change the editorial blurb. An operator does not get a more flattering description by paying.</p>

      <p>If a listing ever drops below the standard, it comes off the directory. If you operate a Yosemite-adjacent business and would like to be considered, write to <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>. <a href="/advertise">More on how directory listings work.</a></p>

      <h2>FTC disclosure</h2>
      <p>This disclosure is provided in accordance with the Federal Trade Commission's 16 CFR Part 255, "Guides Concerning the Use of Endorsements and Testimonials in Advertising."</p>

      <h2>Questions</h2>
      <p>Email cory@thetalusfieldjournal.com.</p>
    </LegalShell>
  );
}

window.PrivacyPage = PrivacyPage;
window.TermsPage = TermsPage;
window.AffiliatePage = AffiliatePage;
