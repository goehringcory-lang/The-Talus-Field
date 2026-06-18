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

window.buildPatagoniaAffiliateLink = function buildPatagoniaAffiliateLink(targetUrl) {
  if (!targetUrl) return window.PATAGONIA_AFFILIATE_BASE;
  // Affiliate deep links should only ever point at patagonia.com. Warn (but do
  // not block) on anything else so a typo'd destination is easy to spot.
  try {
    if (!/(^|\.)patagonia\.com$/i.test(new URL(targetUrl).hostname)) {
      console.warn("buildPatagoniaAffiliateLink: target is not a patagonia.com URL:", targetUrl);
    }
  } catch (_e) {
    // Not an absolute URL; pass it through untouched.
  }
  return window.PATAGONIA_AFFILIATE_BASE + "?u=" + encodeURIComponent(targetUrl);
};
