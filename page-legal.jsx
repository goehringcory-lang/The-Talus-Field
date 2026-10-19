/* global React, HpPageHead, FjLayout, FjCard */

// /privacy and /terms carry their own section numbers in the headings
// (`numberedHeads`), so the headings take no second numeral and FjLayout lifts
// each number into the index; /affiliate's headings are unnumbered and take
// the kit's numerals. `sections` is the count of h2s each page prints.
function LegalShell({ go, title, eyebrow, updated, sections, numberedHeads = true, children }) {
  return (
    <div className="page hp-legal">
      <HpPageHead
        go={go}
        crumbs={[{ label: "Home", route: "home" }, { label: title }]}
        className="fj-head fj-topo"
        eyebrow={eyebrow.toUpperCase()}
        title={title}
        intro={`Last updated ${updated}.`}
        aside={
          <FjCard
            eyebrow="THE DOCUMENT"
            stamp={<>Revised<br />{updated}</>}
            rows={[
              { label: "Last updated", value: updated },
              { label: "Sections", value: String(sections) },
            ]}
          />
        }
      />
      <FjLayout numbered={!numberedHeads}>
        <div className="prose">
          {children}
        </div>
      </FjLayout>
    </div>
  );
}

function PrivacyPage({ go }) {
  return (
    <LegalShell go={go} title="Privacy Policy" eyebrow="Legal" updated="October 19, 2026" sections={11} numberedHeads>
      <p>This privacy policy explains what information The Talus Field collects when you visit this website, subscribe to the newsletter, or use the Field Guide app, how that information is used, who handles it for us, how long it is kept, and the choices you have about it. It also sets out the rights the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA) give you, and how to use them.</p>

      <h2>1. Who we are</h2>
      <p>The Talus Field is an independent publication operated by Cory Goehring, based in El Portal, California. You can reach us at cory@thetalusfieldjournal.com.</p>

      <h2>2. What we collect</h2>
      <p>When you visit the site, Google Analytics collects usage data on our behalf: pages viewed, referrer, approximate location at the country level, browser and device type. We use this to understand which articles are useful and which are not. We do not collect IP addresses in identifiable form.</p>
      <p>When you subscribe to the newsletter, we collect your email address, the date you subscribed, and a tag naming the form you used. Signups for road alerts and date reminders go on the same list with their own tags. We do not collect your name unless you provide it.</p>
      <p>When you ask us to email you something, a trip from the map, a trip plan, an itinerary, or the packing checklist, we use the address to send it. If that address is not already on the newsletter, sending it also subscribes you, and every letter has a one-click unsubscribe link.</p>
      <p>When you contact us through the contact form, we collect the name, email, subject, and message you submit.</p>
      <p>When you buy and sign in to the Field Guide app, we collect the email address tied to your purchase and a record of that purchase: when you bought, when your access ends, any promo code you redeemed, and whether the purchase was refunded. Payment is processed by Stripe, and we never see or store your card number.</p>
      <p>When you are signed in, the app keeps a copy of your trip plan (the stops, dates, and notes you choose) on our server, so the same plan appears on your phone and your laptop. If you turn on notifications, we store your device's push address, your trip dates, and the reminders you asked for. If you answer the in-app survey, your answers are emailed to us.</p>

      <h2>3. How we use it</h2>
      <p>We do not sell or rent your information, and we do not share your email address with anyone for their own use. The providers in section 4 handle it only to run the service for us.</p>
      <p>Newsletter addresses are used to send the newsletter and the alerts you signed up for. Field Guide email addresses are used to send your sign-in links, to confirm your access, and to remind you before your access ends. The synced trip plan and push address are used to show your plan on each device you sign in to and to send the reminders you asked for. Analytics are used to make the site better. Contact form messages and survey answers are used to write you back and to improve the guide.</p>
      <p>Under the GDPR, the legal basis for each is: your consent for the newsletter and alerts, which you can withdraw by unsubscribing; the performance of our agreement with you for the Field Guide, its sync, its reminders, and anything you asked us to email; and our legitimate interest in understanding how the site is used and in answering the messages you send.</p>

      <h2>4. Who handles it for us</h2>
      <p>A few service providers process information on our behalf, each only for the job listed:</p>
      <ul>
        <li><strong>Cloudflare</strong> hosts the site and the Field Guide, and stores Field Guide purchase records, synced trip plans, and push addresses.</li>
        <li><strong>Stripe</strong> processes Field Guide payments.</li>
        <li><strong>Buttondown</strong> holds the newsletter list and sends the newsletter.</li>
        <li><strong>Resend</strong> sends sign-in links, renewal reminders, the emails you ask the site to send, and contact form and survey messages to our inbox.</li>
        <li><strong>Purelymail</strong> hosts our email inbox, where those messages arrive.</li>
        <li><strong>Google</strong> provides Google Analytics, the maps on the trip planner, and, only if you connect it, Google Calendar (section 6).</li>
        <li>Your browser's push service (run by Apple, Google, or Mozilla, depending on the browser) delivers notifications, if you turn them on.</li>
      </ul>
      <p>The Talus Field is based in the United States, and these providers store and process information there. If you use the site from the European Union or the United Kingdom, your information is transferred to the United States.</p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li><strong>Newsletter address:</strong> until you unsubscribe.</li>
        <li><strong>Field Guide purchase record:</strong> until you ask us to delete it. Stripe keeps its own record of the payment, as payment processors must.</li>
        <li><strong>Synced trip plan:</strong> 400 days after you last change it, or until you ask us to delete it.</li>
        <li><strong>Push address and reminders:</strong> one year after the app last renews them, or until you turn notifications off.</li>
        <li><strong>Google Calendar authorization:</strong> until you disconnect it (section 6).</li>
        <li><strong>Contact form messages and survey answers:</strong> in our inbox as ordinary correspondence, until you ask us to delete them. A survey answer that fails to send is held on our server for at most 30 days until it is delivered.</li>
        <li><strong>Analytics:</strong> Google Analytics keeps event-level data for no more than 14 months.</li>
      </ul>

      <h2>6. The Field Guide app and calendar sync</h2>
      <p>The Field Guide app can add your trip plan to your personal calendar. Two options exist, and both are off until you turn them on from the app's Account page.</p>
      <p>The Apple Calendar option publishes your trip as a private subscription link that Apple Calendar reads on its own schedule. That link contains only the events in your trip plan.</p>
      <p>If you connect Google Calendar, you grant The Talus Field permission to manage events on your Google Calendar (the <code>calendar.events</code> scope) and to see the email address of the Google account you connect. We use this access for one purpose only: to create, update, and remove the trip events you build in the app, in your primary Google calendar. We do not read your existing calendar events, we do not access any other Google data, and we do not use this access for advertising or for any purpose beyond syncing your trip.</p>
      <p>To keep your trip in sync after you close the app, Google issues a long-lived authorization token, which we store securely on our server and associate with your account. We show you which Google account is connected so you can confirm it is yours.</p>
      <p>You can disconnect Google Calendar at any time from the Account page. Disconnecting removes the trip events we added to your Google calendar, revokes our authorization token, and deletes it from our server. You can also revoke our access directly from your Google account's security settings at <a href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer">myaccount.google.com/connections</a>.</p>
      <p>The Talus Field's use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

      <h2>7. Cookies and browser storage</h2>
      <p>The site's own code sets no cookies. It keeps a few things in your browser's local storage so they survive a reload: your saved trip, your packing-list ticks, whether you have subscribed or closed a signup box, and how far you got in an article. That storage stays on your device, and clearing this site's data in your browser removes it. The Field Guide app keeps your sign-in and its working copy of your trip plan the same way.</p>
      <p>Three outside services do set cookies or similar identifiers:</p>
      <ul>
        <li><strong>Google Analytics</strong> runs on every page and sets cookies (named <code>_ga</code>) that tell a returning browser from a new one. It is how the site counts page views and signups. Google describes its handling of that data at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>, and its <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">opt-out browser add-on</a> stops Google Analytics on every site.</li>
        <li><strong>Stay22</strong>'s script runs on every page and turns some lodging links into affiliate links, as the <a href="/affiliate">affiliate disclosure</a> explains. It may set cookies or similar identifiers so that a booking can be credited to this site.</li>
        <li><strong>Affiliate partners</strong> (Expedia through Partnerize, Patagonia through Impact, and Bookshop.org) set cookies on their own sites when you follow a link there, which is how a purchase is credited to this site. Nothing of theirs is set before you click.</li>
      </ul>
      <p>The trip-planner map loads Google Maps, and Field Guide checkout runs on Stripe; each sets its own cookies under its own policy. Videos play from youtube-nocookie.com and load only when you press play. The site runs no ad network and sells no data about its readers.</p>
      <p>You can block or delete any of these cookies in your browser's settings. The articles, the map, and the Field Guide all work without them.</p>

      <h2>8. Your rights (GDPR / CCPA)</h2>
      <p>You have the right to access, correct, export, or delete any personal information we hold about you, and to object to or restrict how we use it. To exercise any of these rights, email cory@thetalusfieldjournal.com with the subject line "Data request." We respond within 30 days. If you are in the European Union or the United Kingdom and are not satisfied with our answer, you can also complain to your local data protection authority.</p>

      <h2>9. Children</h2>
      <p>This site is not directed at children under 13. We do not knowingly collect information from children.</p>

      <h2>10. Changes</h2>
      <p>If this policy changes in any meaningful way, the change will be announced in the newsletter and the "last updated" date above will change.</p>

      <h2>11. Questions</h2>
      <p>Email cory@thetalusfieldjournal.com.</p>
    </LegalShell>
  );
}

function TermsPage({ go }) {
  return (
    <LegalShell go={go} title="Terms of Service" eyebrow="Legal" updated="October 19, 2026" sections={8} numberedHeads>
      <p>These terms govern your use of The Talus Field (thetalusfieldjournal.com) and the Field Guide app. By using either, you agree to them. The articles and the interactive trip-planner map on this site are free to browse. The Field Guide app is a paid product; its purchase terms are in section 1.</p>

      <h2>1. The Field Guide purchase</h2>
      <p>The Field Guide is a one-time purchase, not a subscription. Payment is processed by Stripe; we never see or store your card number. A purchase grants access to the Field Guide for 18 months from the purchase date, on any device you sign in to, including all updates published during that window. Access is for you and the people traveling with you, not for redistribution.</p>
      <p>If you are not satisfied with the guide for any reason, email cory@thetalusfieldjournal.com within 30 days of purchase and we will refund it in full. After a refund, your access code is deactivated.</p>

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

function AffiliatePage({ go }) {
  return (
    <LegalShell go={go} title="Affiliate Disclosure" eyebrow="Legal" updated="October 18, 2026" sections={6} numberedHeads={false}>
      <p>The Talus Field currently participates in four affiliate programs: Patagonia's, run through the Impact network; the Expedia Group Travel Creator Program, run through Partnerize, which powers the lodging availability searches on the site; Stay22's, whose links compare the booking sites for a town and send you to whichever one it finds, and which sit as a second, text-only link beside an Expedia search in <a href="/stay">the lodging board</a>'s town table and on <a href="/itineraries">the itineraries page</a>; and Bookshop.org's, which carries the list of field guides and natural-history books I recommend. The site also runs Stay22's script, which routes some lodging links (not the Expedia ones) through Stay22 and can add Stay22 links to hotel and town names in article text; a booking through one of those earns a commission the same way. The book list is linked from the top of every page, as "Books" and in the Read menu, from <a href="/kit">the kit</a>, and at the end of the Wildlife and Nature articles. Those links appear in the planning articles, on <a href="/stay">the lodging board</a>, and on the trip-planning pages that end in a decision about where to sleep. The lodging board may also carry one Expedia-supplied banner image, labeled "Advertisement" where it appears; it works on the same commission terms as the text links and has no influence on what this site recommends. An application to a camping program (Hipcamp) is pending; until it is approved, camping links are plain outbound links that earn nothing. When the list changes, this page changes the same day.</p>

      <p>What that means in plain language: when an article on this site links to a product, a book, or a piece of lodging, that link may be an affiliate link. If you click through and make a purchase or a booking, I receive a small commission. The price you pay does not change. Whether or not you use the affiliate link, the recommendation in the article is the same.</p>

      <h2>The rule that governs all of it</h2>
      <p>No program's catalog shapes a recommendation. If the best lodge in a town, the best campground on a road, or the best jacket for a season has no affiliate program, it stays the top recommendation, linkless. Availability links sit under recommendations that were already written; they never decide what gets recommended. If you ever catch this site steering you toward a worse option because it pays, write to me, and I will fix it and say so in the newsletter.</p>

      <p>Three consequences of that rule, visible on the site right now. Every lodge, tent cabin, and camp inside the park books through the concessioner at travelyosemite.com, so those entries on <a href="/stay">the lodging board</a> send you there and earn nothing; where one of them also carries a line for the reader who finds the park sold out, that line is an availability search of the nearest gateway town and says so. The Wawona Hotel is closed for renovation, so its entry carries no booking link at all rather than a link to something else. And the availability links search a town or an area rather than a named property, because their job is to tell you what is left on your dates, not to sell you a particular room.</p>

      <h2>What I will and will not do</h2>
      <p>I will only recommend things I have actually used, read, eaten, or stayed in. I will not write a "best XYZ" roundup of products I have never touched. If a piece of gear is on this site, I have walked at least fifty miles in it. If a guidebook is on this site, I have read it cover to cover. If a hotel is on this site, I have either stayed there or know someone who has, and I will tell you which.</p>

      <p>I will not accept payment to recommend something. I have turned down sponsorships from at least four gear companies and one regional tourism board. If that ever changes, I will tell you about it on this page and in the newsletter, on the same day.</p>

      <h2>How to identify an affiliate link</h2>
      <p>Every page that contains affiliate links says so near the top, under the byline or the page heading, before the first link. Articles repeat the note at the end, and every boxed lodging or gear recommendation carries its own line, each linking back to this page. Inline affiliate links are marked with a small icon (★) on hover.</p>

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
