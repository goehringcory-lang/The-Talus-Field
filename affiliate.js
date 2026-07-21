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
// Booking.com Partner Hub affiliate ID (the `aid` URL parameter appended to
// any booking.com URL).
window.BOOKING_AFFILIATE_AID = "";
// Stay22 Allez ID. The build below wraps any lodging URL in an Allez redirect;
// verify the exact link template against the Stay22 dashboard's link builder
// before filling this in, then switch individual links from data-aff-network
// "booking" to "stay22" where Stay22 pays better. Until then this entry is
// registered but unused by article markup.
window.STAY22_AFFILIATE_ID = "";
// Hipcamp (private-land camping) tracking-link prefix from the affiliate
// dashboard; the destination is appended as an encoded ?u= parameter,
// Impact-style. Adjust build() below if the approved program uses a
// different template.
window.HIPCAMP_AFFILIATE_BASE = "";

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
  hipcamp: {
    hostRe: /(^|\.)hipcamp\.com$/i,
    build: (targetUrl) => {
      const url = targetUrl || "https://www.hipcamp.com/";
      if (!window.HIPCAMP_AFFILIATE_BASE) return url;
      return window.HIPCAMP_AFFILIATE_BASE + "?u=" + encodeURIComponent(url);
    },
  },
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
