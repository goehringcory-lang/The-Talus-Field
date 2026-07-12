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
