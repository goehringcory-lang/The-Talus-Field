// Patagonia affiliate-link builder for the editorial site (Impact / impact.com).
// The Talus Field is an approved Patagonia affiliate; PATAGONIA_AFFILIATE_BASE
// below is our approved tracking link. A deep link to a specific Patagonia page
// is built by appending the destination as the URL-encoded ?u= parameter.
//
// Loaded in index.html before data.js (see storage.js for the same plain-JS,
// window-global pattern) so it is also available in the browser console for
// minting new links by hand:
//
//   buildPatagoniaAffiliateLink("https://www.patagonia.com/search/?q=nano+puff")
//     => "https://patagonia.pxf.io/c/7338432/1948563/23649?u=https%3A%2F%2F..."
//   buildPatagoniaAffiliateLink()  // no target => bare tracking link (home page)
//
// The ?u= value is URL-encoded. Impact decodes it on redirect; encoding is
// required once a destination carries its own query string (our search URLs do).
window.PATAGONIA_AFFILIATE_BASE = "https://patagonia.pxf.io/c/7338432/1948563/23649";

// Lodging and camping networks (MONETIZATION-IDEAS.md 3.1). Each const below
// is pasted from the network's dashboard once that application is approved.
// While a const is empty, buildAffiliateLink returns the destination
// unchanged, so every link ships today as a plain outbound link and upgrades
// to a tracking link the day the ID lands. Same fail-soft pattern as the
// payment-link consts in page-consult.jsx: the markup, the disclosure, and
// the GA4 affiliate_click events are all live from day one.
//
// Expedia Group Travel Creator Program (runs on Partnerize). LIVE: this is
// the approved camref from the creator dashboard, and it is the network the
// lodging links in article markup use. Camrefs are public by design (they
// ride in every outbound link), not a secret. Links wrap as
// https://prf.hn/click/camref:<id>/destination:<encoded url>.
window.EXPEDIA_CAMREF = "1110lKspj";
// Booking.com Partner Hub affiliate ID (the `aid` URL parameter appended to
// any booking.com URL). Registered but unused by article markup while the
// application is pending; the lodging links run on `expedia` above.
window.BOOKING_AFFILIATE_AID = "";
// Stay22 Allez affiliate ID (the `aid` parameter), from the Stay22 dashboard.
// LIVE since October 2026. Allez `roam` links send the reader to whichever
// booking site Stay22 picks for them (dev.stay22.com/docs/allez). The site
// uses the address form, through stay22SearchUrl below: a town search, never
// a property, with a `campaign` per placement. The registry's `build` still
// wraps an arbitrary lodging URL as `&link=`. Plain links only: the Stay22
// site-wide script (Let Me Allez / LinkSwap) would rewrite the live Expedia,
// Patagonia and Bookshop links, and the CSP in _headers allows no
// third-party scripts.
window.STAY22_AFFILIATE_ID = "thetalusfield";
// Hipcamp (private-land camping) tracking-link prefix from the affiliate
// dashboard; the destination is appended as an encoded ?u= parameter,
// Impact-style. Adjust build() below if the approved program uses a
// different template.
window.HIPCAMP_AFFILIATE_BASE = "";

// REI Co-op (AvantLink). Application 1667769 submitted October 16, 2026;
// pending network approval, then REI's own program approval. When both are
// through, open AvantLink's link builder for REI, make a link to
// https://www.rei.com/, and paste the whole link here. Everything from
// "&url=" on is dropped and rebuilt per destination, so pasting the full
// link is fine. While this is empty the kit's "Shop REI" buttons do not
// render at all (page-kit.jsx), so no untracked link ever ships marked
// sponsored, and /affiliate keeps listing four programs.
window.REI_AFFILIATE_BASE = "";

// Bookshop.org. The owner's affiliate list of recommended field guides and
// natural-history books ("Yosemite Field Guides: A Naturalist's Bookshelf").
// A list on an affiliate account credits that account for what is bought
// from it, so the list URL is the tracking link and nothing is appended.
// Every bookshelf link on the site (the Read menu, /kit, the Wildlife and
// Nature articles) reads this one const through BookshelfCard / the registry
// entry below. Per-title links would need the account's own affiliate ID
// from the Bookshop dashboard; none is guessed here.
window.BOOKSHOP_LIST_URL = "https://bookshop.org/lists/yosemite-field-guides-a-naturalist-s-bookshelf";

// Expedia Travel Creator licensed banner creative. Paste `img` (the
// Expedia-hosted banner image URL) and `href` (the camref click URL) from the
// banner builder at creator.expediagroup.com/products/banners; pick an
// evergreen creative with no printed rate or year (the /stay rules apply to
// the pixels Expedia serves, and we cannot edit them). While either field is
// empty, ExpediaBanner (components.jsx) renders nothing. Plain <img> + <a>
// only: the CSP in _headers deliberately allows no third-party scripts or
// iframes, and img-src already permits the hosted image. The component is not
// in the gen-prerender.mjs sandbox; using it inside an article body would
// mean mirroring it there first.
window.EXPEDIA_BANNER = {
  img: "",
  href: "",
  alt: "Search Yosemite-area lodging on Expedia",
  width: 728,
  height: 90,
};

// Network registry. One entry per approved affiliate program: `hostRe` guards
// deep-link destinations (warn, not block, so a typo'd URL is easy to spot),
// `build` turns a destination into a tracking link. Joining a new network
// later (Amazon, Avantlink, a publisher's direct program) is one entry here
// plus the /affiliate disclosure update; markup keeps using the same
// data-aff-network attribute, and the delegated GA4 listener in app.jsx needs
// no change.
window.AFFILIATES = {
  patagonia: {
    hostRe: /(^|\.)patagonia\.com$/i,
    build: (targetUrl) =>
      targetUrl
        ? window.PATAGONIA_AFFILIATE_BASE + "?u=" + encodeURIComponent(targetUrl)
        : window.PATAGONIA_AFFILIATE_BASE,
  },
  expedia: {
    hostRe: /(^|\.)expedia\.com$/i,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.expedia.com/";
      if (!window.EXPEDIA_CAMREF) return url;
      return (
        "https://prf.hn/click/camref:" +
        encodeURIComponent(window.EXPEDIA_CAMREF) +
        "/destination:" +
        encodeURIComponent(url)
      );
    },
  },
  booking: {
    hostRe: /(^|\.)booking\.com$/i,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.booking.com/";
      if (!window.BOOKING_AFFILIATE_AID) return url;
      return (
        url +
        (url.indexOf("?") === -1 ? "?" : "&") +
        "aid=" +
        encodeURIComponent(window.BOOKING_AFFILIATE_AID)
      );
    },
  },
  stay22: {
    // Destination may be any lodging site (Stay22 wraps arbitrary URLs), so
    // no host guard here.
    hostRe: /./,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.booking.com/";
      if (!window.STAY22_AFFILIATE_ID) return url;
      return (
        "https://www.stay22.com/allez/roam?aid=" +
        encodeURIComponent(window.STAY22_AFFILIATE_ID) +
        "&link=" +
        encodeURIComponent(url)
      );
    },
  },
  bookshop: {
    // No target means the bookshelf list itself, which is the only Bookshop
    // destination the site links today.
    hostRe: /(^|\.)bookshop\.org$/i,
    build: (targetUrl) => targetUrl || window.BOOKSHOP_LIST_URL,
  },
  rei: {
    hostRe: /(^|\.)rei\.com$/i,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.rei.com/";
      const base = (window.REI_AFFILIATE_BASE || "").replace(/&url=.*$/, "");
      if (!base) return url;
      return base + "&url=" + encodeURIComponent(url);
    },
  },
  hipcamp: {
    hostRe: /(^|\.)hipcamp\.com$/i,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.hipcamp.com/";
      if (!window.HIPCAMP_AFFILIATE_BASE) return url;
      return window.HIPCAMP_AFFILIATE_BASE + "?u=" + encodeURIComponent(url);
    },
  },
};

// A Stay22 Allez search of a place ("Mariposa, California"), tagged with the
// placement as `campaign` so the Stay22 dashboard splits clicks the way GA4's
// aff_list does. Fails soft like every builder here: with an empty ID it
// returns a plain Booking.com search of the same place.
window.stay22SearchUrl = function stay22SearchUrl(place, campaign) {
  if (!window.STAY22_AFFILIATE_ID) {
    return "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(place);
  }
  return (
    "https://www.stay22.com/allez/roam?aid=" +
    encodeURIComponent(window.STAY22_AFFILIATE_ID) +
    "&address=" +
    encodeURIComponent(place) +
    (campaign ? "&campaign=" + encodeURIComponent(campaign) : "")
  );
};

window.buildAffiliateLink = function buildAffiliateLink(network, targetUrl) {
  const entry = window.AFFILIATES[network];
  if (!entry) {
    console.warn("buildAffiliateLink: unknown network:", network);
    return targetUrl || "#";
  }
  if (targetUrl) {
    try {
      if (!entry.hostRe.test(new URL(targetUrl).hostname)) {
        console.warn(`buildAffiliateLink(${network}): unexpected destination host:`, targetUrl);
      }
    } catch (_e) {
      // Not an absolute URL; pass it through untouched.
    }
  }
  return entry.build(targetUrl);
};

// Back-compat alias: data.js and the existing article bodies call this.
window.buildPatagoniaAffiliateLink = function buildPatagoniaAffiliateLink(targetUrl) {
  return window.buildAffiliateLink("patagonia", targetUrl);
};

// TODO(affiliate): programs the site recommends things from but has not
// joined. Each is a gap a live page already shows, not a wish list; none has
// an ID, and none gets one here until it is pasted from the network's own
// dashboard (CLAUDE.md, affiliate rules: never invent an ID). Joining one is
// a registry entry above, a line on /affiliate, and flipping the dormant
// items that name it. Ranked by likely revenue in the September 2026 PR.
//   - REI (AvantLink): applied October 2026, registered above as `rei`
//     with an empty REI_AFFILIATE_BASE. The kit's hardgoods are mapped in
//     window.KIT_REI (data.js) and light up when the base is pasted. Still
//     linkless after that: the article bodies (traction, canisters,
//     headlamps), a follow-up once the program is live.
//   - Booking.com / Hipcamp: already registered above with empty IDs; the
//     applications are pending (MONETIZATION-IDEAS.md 3.1). Stay22 is
//     joined (October 2026) and carries the secondary "compare all booking
//     sites" links on /stay's town table and on /itineraries. Still open:
//     whether an article placement earns a Stay22 link beside its Expedia one.
//   - GetYourGuide or Viator: the guided Valley tours and Glacier Point
//     tour the trip planning pages mention, booked through the concessioner
//     today.
//   - Bookshop.org is joined (the bookshelf list above). Still open: the
//     Nature Notes archive pages, whose one-ask rule needs an owner decision
//     before a second link goes under a transcription.
//   - Amazon Associates: binoculars and camera gear for the wildlife,
//     birding and photography pieces, where Patagonia carries nothing.
