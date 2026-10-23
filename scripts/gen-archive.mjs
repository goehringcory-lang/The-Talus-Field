// Generates the Yosemite Nature Notes archive at /archive from the markdown in
// /nature-notes. Parsing and text repair live in lib/nature-notes.mjs; this
// file is only concerned with turning parsed issues into pages.
//
// WHY STATIC HTML AND NOT THE SPA
// The catalog is 512 issues and 1.87 million words. Routing it through the
// editorial SPA would mean 512 more entries in window.ARTICLES — a file that
// loads eagerly on every route, including the homepage — plus 512 more
// BODY_VERSIONS cache-busters to keep in sync, and the real articles would be
// buried in their own catalog. So the archive ships as plain files that the
// asset layer serves directly. The Worker is never invoked for them (routing
// is asset-first; see wrangler.jsonc), which is also why every page here
// carries its own complete <head> rather than relying on edge/seo.js.
//
// WHY THE CHROME IS HAND-WRITTEN AND NOT THE REAL Header/Footer
// gen-home-shell.mjs renders the real components for fidelity, and that is
// right for the homepage, where React replaces the markup a moment later.
// Nothing replaces it here: an archive page runs no JavaScript of its own.
// Its only scripts are the JSON-LD and the Stay22 Script (STAY22_SCRIPT below,
// the owner's site-wide install, October 2026), neither of which draws. The
// masthead's menus open from React state (HomeMasthead in components.jsx),
// so rendering them statically would ship labels that do nothing. These
// pages get a flat, link-only masthead instead, built from the same
// styles.css classes so it still reads as the same publication: the design
// masthead (HomeMasthead's six labels without its five JavaScript menus,
// each linked to its landing page, its search box as a plain GET form, and
// no compact bar and no phone Menu sheet) and the site footer's structure
// (Footer in components.jsx, without its date-derived copyright year, which
// would make --check fail every January 1). Both are hand-kept mirrors: when
// HOME_NAV or the Footer columns change, change DESIGN_NAV / siteFooter here.
//
// /styles.css is linked WITHOUT a ?v= on purpose. _headers serves it with
// max-age=300 + stale-while-revalidate, so a stylesheet change reaches readers
// within minutes anyway, and the alternative — baking its version into every
// page — would rewrite all 512 files on every CSS tweak.
// check-cache-busters.sh only inspects index.html, so nothing here is exempted
// from a guard that was covering it.
//
// Usage:
//   node scripts/gen-archive.mjs           # write /archive
//   node scripts/gen-archive.mjs --check   # exit 1 if /archive is stale

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadIssues, groupByDecade, groupByYear } from "./lib/nature-notes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "archive");
const REPORT = path.join(__dirname, "data", "nature-notes-report.md");
const ORIGIN = "https://thetalusfieldjournal.com";

const CHECK = process.argv.includes("--check");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// The bulletin set its headlines in full capitals. That is authentic on the
// page and stays that way in the prose, but a <title> or a meta description in
// block capitals reads as shouting in a search result, so those get title case.
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);
function titleCase(s) {
  const words = String(s).toLowerCase().split(/\s+/);
  return words
    .map((w, i) => {
      if (i > 0 && i < words.length - 1 && SMALL_WORDS.has(w)) return w;
      return w.replace(/^([a-z])/, (m) => m.toUpperCase());
    })
    .join(" ");
}

function truncate(s, n) {
  const t = String(s).replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, t.lastIndexOf(" ", n - 1)).replace(/[,;:.]$/, "") + "…";
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------


// HOME_NAV's six labels (components.jsx), each linked to its group's landing
// page (NAV_GROUPS' `route`): these pages run no JavaScript of their own, so the five
// menus cannot open here and a label goes where the menu's first link would.
// For the same reason there is no phone Menu button: the flat row stays on
// screen at every width (.hp-nav--flat in styles.css), wrapping on phones.
const DESIGN_NAV = [
  ["/planning", "Plan"],
  ["/section/trails", "Hikes & permits"],
  ["/conditions", "Conditions"],
  ["/section/seasonal", "Seasons"],
  ["/map", "Map"],
  ["/articles", "Library"],
];

// The masthead's search box, as a plain GET form (/search reads ?q= when it
// loads), and the Search link that stands in for it below 1000px. No "/"
// hint: the shortcut is JavaScript.
const SEARCH_ICON = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"></circle><line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>`;

function masthead() {
  const nav = DESIGN_NAV.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("");
  const search = `<form class="hp-search" role="search" action="/search" method="get"><label class="hp-search__field">${SEARCH_ICON}<input type="search" name="q" placeholder="Search the journal" aria-label="Search the journal" autocomplete="off" /></label></form>`;
  // The brand box takes the square cut of the mark (favicon-96.png, written by
  // gen-brand-icons.mjs from the same master, 5.7 KB), drawn at the design
  // masthead's 48 px; unversioned, the same trade-off /styles.css makes on
  // these 512 pages.
  return `<div class="hp-design hp-navigation" role="banner">
<a class="skip-link" href="#main">Skip to content</a>
<div class="hp-top">AN INDEPENDENT GUIDE TO YOSEMITE<span>Written here. Taken everywhere.</span></div>
<div class="hp-wrap hp-header">
  <a class="hp-brand" href="/"><img src="/img/favicon-96.png" width="96" height="96" alt="" /><span>The Talus Field<small>YOSEMITE, FROM THE INSIDE.</small></span></a>
  <nav class="hp-nav--flat" aria-label="Main navigation">${nav}</nav>
  ${search}
  <a class="hp-nav__search" href="/search">${SEARCH_ICON.replace(/15/g, "16")}<span>Search</span></a>
  <a class="hp-header__guide" href="/guide">Field Guide</a>
  <a class="hp-button hp-header__subscribe" href="/newsletter">Subscribe</a>
</div>
</div>`;
}

// The breadcrumb trail, in the Breadcrumbs component's markup (.crumbs).
function crumbTrail(crumbs) {
  const items = crumbs
    .map((c, i) =>
      c.href && i < crumbs.length - 1
        ? `<li><a href="${c.href}">${esc(c.label)}</a></li>`
        : `<li><span aria-current="page">${esc(c.label)}</span></li>`
    )
    .join("");
  return `<div class="hp-wrap arc-crumbs"><nav class="crumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav></div>`;
}

// The archive's provenance note, closing every page above the site footer.
const PROVENANCE = `<div class="hp-wrap arc-provenance">
    <p class="arc-footer__note">
      <strong>Yosemite Nature Notes</strong> was published by the National Park Service
      and the Yosemite Natural History Association. The transcriptions here were made
      from the scanned originals; each issue links to the scan it came from. Text of
      United States Government authorship is in the public domain. See
      <a href="/archive/#about">about this archive</a> for provenance and corrections.
    </p>
  </div>`;

// Footer in components.jsx, as static links: the masthead's six labels as
// column headings, the Tools line, About and Contact under the about block,
// and the business and legal bar. The section labels follow the masthead's
// sentence case ("Trails and hikes"), as Footer does.
function siteFooter() {
  const li = (href, label) => `<li><a href="${href}">${esc(label)}</a></li>`;
  const list = (rows) => rows.map(([h, l]) => li(h, l)).join("");
  const plan = list([
    ["/start-here", "Start here"], ["/planning", "The Planning Guide"], ["/itineraries", "Itineraries"],
    ["/stay", "Where to stay"], ["/articles/yosemite-camping-complete-guide", "Camping"],
    ["/articles/where-to-eat-yosemite", "Where to eat"], ["/distances", "Drive times"],
    ["/articles/best-airport-for-yosemite", "Flying in"], ["/international", "Visiting from abroad"],
    ["/checklist", "First-week checklist"], ["/kit", "Kit"], ["/consult", "Trip consults"],
  ]);
  const hikes = list([
    ["/half-dome-lottery", "Half Dome lottery"], ["/articles/mist-trail-the-real-guide", "Mist Trail"],
    ["/articles/cathedral-lakes-day-hike", "Cathedral Lakes"], ["/articles/yosemite-falls-trail", "Yosemite Falls Trail"],
    ["/articles/clouds-rest-hike", "Clouds Rest"], ["/section/trails", "All trails and hikes"],
  ]);
  const conditions = list([
    ["/conditions", "Conditions and road alerts"], ["/now", "The Park Bulletin"], ["/webcams", "Webcams"],
    ["/tioga-opening", "Tioga Road opening"],
  ]);
  const seasons = list([
    ["/dates", "Dates that matter"], ["/fall-color", "Fall color"], ["/firefall", "Firefall"],
    ["/moonbow", "Moonbow"], ["/frazil-ice", "Frazil ice"], ["/section/seasonal", "Seasonal guides"],
  ]);
  const map = list([["/map", "The trip map"]]);
  const library = list([
    ["/articles", "All articles"], ["/section/planning", "Planning"], ["/section/trails", "Trails and hikes"],
    ["/section/wildlife", "Wildlife and nature"], ["/section/seasonal", "Seasonal guides"],
    ["/archive/", "Nature Notes archive"], ["/films", "Films"], ["/newsletter", "The Sunday Letter"],
    ["/search", "Search"],
  ]);
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__grid">
      <div class="site-footer__about">
        <div class="site-footer__masthead">The Talus Field</div>
        <div class="site-footer__sub">A field journal of Yosemite</div>
        <p>Notes on a single park, kept slowly. Updated when something is worth saying.</p>
        <a class="site-footer__index" href="/explore">Everything on this site →</a>
        <p class="site-footer__journal"><a href="/about">About</a> · <a href="/contact">Contact</a></p>
      </div>
      <div><h2>Plan</h2><ul>${plan}</ul></div>
      <div><h2>Hikes &amp; permits</h2><ul>${hikes}</ul></div>
      <div><h2>Conditions</h2><ul>${conditions}</ul></div>
      <div><h2>Seasons</h2><ul>${seasons}</ul></div>
      <div><h2>Map</h2><ul>${map}</ul></div>
      <div><h2>Library</h2><ul>${library}</ul></div>
    </div>
    <p class="site-footer__tools"><span>Tools</span><a href="/map">Map</a><a href="/guide">Field Guide</a><a href="/widget">Conditions widget</a></p>
    <div class="site-footer__disclosure">
      Some links on this site are affiliate links. If you book or buy through one, The Talus Field may earn a small commission at no extra cost to you. <a href="/affiliate">Full disclosure here.</a>
    </div>
    <div class="site-footer__legal">
      <div>© The Talus Field. Independent. Not affiliated with the National Park Service.</div>
      <div>
        <a href="/places">Directory</a>
        <a href="/advertise">Advertise</a>
        <a href="/media-kit">Media kit</a>
        <a href="/widget">Conditions widget</a>
        <a href="/partners">Group codes</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/affiliate">Affiliate</a>
      </div>
    </div>
  </div>
</footer>`;
}

const FOOTER = siteFooter();

// ---------------------------------------------------------------------------
// The one ask
// ---------------------------------------------------------------------------
// CODE-AUDIT-2026-08 §5.3: this is the largest indexed surface the site has,
// 512 issue pages and ~1.87M words, and it carried no capture and no product
// CTA of any kind. Four rules hold this block up, and they are what keep it
// from turning a public archive into a funnel:
//
//   1. ONE ask, at the END of the read. It sits after the issue's own footer,
//      never inside or above the transcription. A reader who came for a 1934
//      bear count gets the whole 1934 bear count first.
//   2. NO JavaScript. These pages load none (see the header comment), so the
//      form is a plain POST to Buttondown with target="_blank": the reader
//      keeps their place in the issue and the confirmation opens beside it.
//      There is no GA4 on these pages either, which is exactly why the
//      Buttondown `tag` is distinct per surface (`archive`, `archive-index`,
//      `archive-topics` for the topic hubs and their index).
//      That tag is the only attribution this surface will ever have.
//   3. The guide line states a COUNTED fact, not a claim. The number comes
//      from the guide's own content through the same regex the citation guard
//      uses, so it cannot drift the way a typed number would; if the shape of
//      stops.ts changes and the count comes back zero, the sentence drops the
//      number rather than printing a wrong one.
//   4. Nothing here is dated. This block is baked into 512 files that are
//      regenerated only when the archive itself changes, so a price, a season,
//      or an edition label would go stale in place with nothing to catch it.

// Entries in the Field Guide that quote an issue of Nature Notes. Same pattern
// as check-archive-citations.mjs, which verifies each one resolves to a real
// page here; this only needs the count.
const GUIDE_CITATION = /history:\s*\{[\s\S]*?volume:\s*\d+,\s*number:\s*\d+,\s*issueDate:\s*'[^']+'/g;

function countGuideCitations() {
  const sources = [
    path.join(ROOT, "apps/guide/src/content/stops.ts"),
    path.join(ROOT, "apps/guide/src/content/secret-spots.ts"),
  ];
  let n = 0;
  for (const src of sources) {
    if (!fs.existsSync(src)) continue;
    n += (fs.readFileSync(src, "utf8").match(GUIDE_CITATION) || []).length;
  }
  return n;
}

const GUIDE_CITATIONS = countGuideCitations();

function askBlock(tag) {
  const id = `ask-${tag}`;
  const guideLine = GUIDE_CITATIONS
    ? `${GUIDE_CITATIONS} entries in <a href="/guide">the Field Guide</a> quote an issue from this archive at the place it describes.`
    : `<a href="/guide">The Field Guide</a> quotes these bulletins at the places they describe.`;
  return `<aside class="arc-ask" aria-labelledby="${id}-h">
  <h2 class="arc-ask__h" id="${id}-h">Sunday Field Notes</h2>
  <p class="arc-ask__note">
    The bulletin ran until the 1980s. The habit behind it did not stop: a short note
    from inside the park on Sundays, when there is something to say.
  </p>
  <form class="arc-ask__form" action="https://api.thetalusfieldjournal.com/api/subscribe" method="post">
    <label class="arc-ask__label" for="${id}-email">Email address</label>
    <input id="${id}-email" class="arc-ask__input" type="email" name="email" placeholder="you@email.com" autocomplete="email" required />
    <input type="hidden" name="tag" value="${tag}" />
    <input class="arc-ask__hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button class="arc-ask__button" type="submit">Subscribe</button>
  </form>
  <p class="arc-ask__also">
    ${guideLine} The archive is the reading; the guide is the walking, offline, at the
    trailhead where there is no signal.
  </p>
</aside>`;
}

// The Stay22 Script ("Let Me Allez"), the same block index.html carries, from
// the Stay22 dashboard (owner's call, October 2026): the one script on these
// pages beside the JSON-LD. It loads async and converts supported supplier
// links client-side; its hosts are in the CSP in _headers. The one added param,
// excludes: ['expedia'] (verified in letmeallez.js), keeps it from rewriting
// the site's direct Expedia Travel Creator links (expedia.com and its sister
// domains in Stay22's expedia group: travelocity, orbitz, wotif...). Hotels.com
// and Vrbo are deliberately not excluded: the site has no direct links to them.
// If direct Hotels.com or Vrbo links are ever added through the Expedia
// program, add 'hotelscom' and 'vrbo'. Keep the block equal to index.html's.
const STAY22_SCRIPT = `  <script>
    (function (s, t, a, y, twenty, two) {
      s.Stay22 = s.Stay22 || {};
      s.Stay22.params = { lmaID: '6ad44cfa7692614b773d1576', excludes: ['expedia'] };
      twenty = t.createElement(a);
      two = t.getElementsByTagName(a)[0];
      twenty.async = 1;
      twenty.src = y;
      two.parentNode.insertBefore(twenty, two);
    })(window, document, 'script', 'https://lma.stay22.com/letmeallez.js');
  </script>`;

function page({ title, description, canonical, crumbs, body, jsonLd, noindex, ogType = "website" }) {
  const ld = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
${STAY22_SCRIPT}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${ORIGIN}${canonical}" />
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="48x48" href="/img/favicon-48.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="The Talus Field" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${ORIGIN}${canonical}" />
  <meta property="og:image" content="${ORIGIN}/img/og-default.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preload" href="/fonts/eb-garamond.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/archive/archive.css" />${ld}
</head>
<body class="arc-body">
${masthead()}
<main id="main" tabindex="-1" class="arc-main hp-design">
${crumbTrail(crumbs)}
${body}
${PROVENANCE}
</main>
${FOOTER}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Issue page
// ---------------------------------------------------------------------------

function issueLabel(issue) {
  return `Volume ${issue.volume}, Number ${issue.number}`;
}

// The date line, and an honest note when the date was not printed legibly on
// the cover. Never present an inferred year as if it were read off the page.
function dateLine(issue) {
  if (issue.date.confidence === "stated") {
    return `<time datetime="${issue.iso}">${esc(issue.dateDisplay)}</time>`;
  }
  return `<time datetime="${issue.iso}">${esc(issue.dateDisplay)}</time> <span class="arc-approx" title="No date was legible on this issue's cover. The year is taken from the other issues in the same volume.">(year inferred)</span>`;
}

function issueDescription(issue) {
  const heads = issue.headings.slice(0, 4).map(titleCase);
  if (heads.length) {
    return truncate(
      `Yosemite Nature Notes, ${issue.dateDisplay}. ${heads.join(". ")}.`,
      175
    );
  }
  const firstPara = issue.blocks.find((b) => b.type === "para");
  return truncate(
    `Yosemite Nature Notes, ${issue.dateDisplay} (${issueLabel(issue)}). ${firstPara ? firstPara.text : ""}`,
    175
  );
}

function scanLink(issue) {
  if (!issue.scanPosted) return "Original scan is not posted at yosemite.ca.us";
  return `<a href="${esc(issue.sourceUrl)}" rel="noopener nofollow" target="_blank">Original scan (PDF) ↗</a>`;
}

function scanCredit(issue) {
  if (!issue.scanPosted) {
    return "Transcribed from the printed issue. The original scan is not posted at yosemite.ca.us. Spelling, punctuation, and the original headlines are left as printed.";
  }
  return `Transcribed from <a href="${esc(issue.sourceUrl)}" rel="noopener nofollow" target="_blank">${esc(issue.pdfFilename)}</a>. Spelling, punctuation, and the original headlines are left as printed.`;
}

// The anchor id of every heading block in an issue, by block index (null for
// paragraphs). Ids have to be unique inside one page: the same headline can
// appear twice in an issue ("NOTES AND COMMENT" runs as a standing column).
// The topic hubs deep-link into issues with these same ids, so this is the one
// place they are minted.
function headingAnchors(issue) {
  const used = new Map();
  return issue.blocks.map((block) => {
    if (block.type !== "heading") return null;
    const base = slugify(block.text) || "section";
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

function renderIssue(issue, prev, next) {
  const title = `Yosemite Nature Notes, ${issue.dateDisplay} (Vol. ${issue.volume}, No. ${issue.number})`;
  const description = issueDescription(issue);
  const anchors = headingAnchors(issue);

  // The transcription usually opens with the printed masthead line — "Volume 1
  // July 10, 1922 Number 1 W. B. Lewis, Superintendent." — which duplicates the
  // page's own header and reads like scanner debris in body type. It is kept,
  // because the superintendent and park naturalist of the day are exactly the
  // sort of detail someone comes to an archive for, but set apart as a colophon.
  const isColophon = (block, idx) =>
    idx === 0 &&
    block.type === "para" &&
    block.text.length < 240 &&
    /\bvol(?:ume)?\b/i.test(block.text) &&
    new RegExp(`\\b${issue.year}\\b`).test(block.text);

  const contents = [];
  const parts = [];
  issue.blocks.forEach((block, idx) => {
    if (block.type === "heading") {
      const id = anchors[idx];
      contents.push({ id, text: block.text });
      parts.push(`<h2 id="${id}" class="arc-h2">${esc(block.text)}</h2>`);
    } else if (isColophon(block, idx)) {
      parts.push(`<p class="arc-colophon">${esc(block.text)}</p>`);
    } else {
      parts.push(`<p>${esc(block.text)}</p>`);
    }
  });

  const toc = contents.length
    ? `<nav class="arc-toc" aria-labelledby="arc-toc-h">
  <h2 id="arc-toc-h" class="arc-toc__h">In this issue</h2>
  <ol>${contents.map((c) => `<li><a href="#${c.id}">${esc(titleCase(c.text))}</a></li>`).join("")}</ol>
</nav>`
    : "";

  const pager = `<nav class="arc-pager" aria-label="Issues">
  ${prev ? `<a class="arc-pager__prev" href="${prev.path}"><span>Previous issue</span>${esc(prev.dateDisplay)}</a>` : `<span class="arc-pager__prev arc-pager__none"></span>`}
  ${next ? `<a class="arc-pager__next" href="${next.path}"><span>Next issue</span>${esc(next.dateDisplay)}</a>` : `<span class="arc-pager__next arc-pager__none"></span>`}
</nav>`;

  const body = `<article class="hp-wrap arc-issue">
  <header class="arc-issue__head">
    <p class="arc-eyebrow">Yosemite Nature Notes · ${esc(issueLabel(issue))}</p>
    <h1 class="arc-title">${esc(issue.dateDisplay)}</h1>
    <p class="arc-meta">${dateLine(issue)} · ${issue.wordCount.toLocaleString()} words · ${scanLink(issue)}</p>
  </header>
  ${toc}
  <div class="arc-prose">
${parts.join("\n")}
  </div>
  <footer class="arc-issue__foot">
    <p class="arc-source">${scanCredit(issue)}</p>
    <p><a href="/archive/${issue.year}/">All ${issue.year} issues</a> · <a href="/archive/">The whole archive</a></p>
  </footer>
  ${askBlock("archive")}
  ${pager}
</article>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    issueNumber: issue.number,
    datePublished: issue.iso,
    name: title,
    headline: title,
    description,
    url: `${ORIGIN}${issue.path}`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "PublicationVolume",
      volumeNumber: issue.volume,
      isPartOf: {
        "@type": "Periodical",
        name: "Yosemite Nature Notes",
        issn: undefined,
        publisher: {
          "@type": "Organization",
          name: "Yosemite Natural History Association / National Park Service",
        },
      },
    },
    isAccessibleForFree: true,
  };

  return page({
    title: `${title} | The Talus Field`,
    description,
    canonical: issue.path,
    crumbs: [
      { label: "Archive", href: "/archive/" },
      { label: String(issue.year), href: `/archive/${issue.year}/` },
      { label: `Vol. ${issue.volume}, No. ${issue.number}` },
    ],
    body,
    jsonLd,
    ogType: "article",
  });
}

// ---------------------------------------------------------------------------
// Year index
// ---------------------------------------------------------------------------

function renderYear(year, issues, prevYear, nextYear) {
  const title = `Yosemite Nature Notes, ${year} | The Talus Field`;
  const description = truncate(
    `Every surviving ${year} issue of Yosemite Nature Notes, the National Park Service's Yosemite bulletin: ${issues.length} issue${issues.length === 1 ? "" : "s"}, transcribed in full and free to read.`,
    175
  );

  const rows = issues
    .map((i) => {
      const heads = i.headings.slice(0, 3).map((h) => titleCase(h));
      return `<li class="arc-list__item">
  <a class="arc-list__link" href="${i.path}">
    <span class="arc-list__date">${esc(i.dateDisplay)}</span>
    <span class="arc-list__vol">Vol. ${i.volume}, No. ${i.number}</span>
  </a>
  ${heads.length ? `<p class="arc-list__heads">${esc(heads.join(" · "))}</p>` : ""}
</li>`;
    })
    .join("\n");

  const pager = `<nav class="arc-pager" aria-label="Years">
  ${prevYear ? `<a class="arc-pager__prev" href="/archive/${prevYear}/"><span>Earlier</span>${prevYear}</a>` : `<span class="arc-pager__prev arc-pager__none"></span>`}
  ${nextYear ? `<a class="arc-pager__next" href="/archive/${nextYear}/"><span>Later</span>${nextYear}</a>` : `<span class="arc-pager__next arc-pager__none"></span>`}
</nav>`;

  const body = `<div class="hp-wrap arc-year">
  <header class="arc-year__head">
    <p class="arc-eyebrow">The Nature Notes archive</p>
    <h1 class="arc-title">${year}</h1>
    <p class="arc-lede">${issues.length} issue${issues.length === 1 ? "" : "s"} of Yosemite Nature Notes, transcribed in full from the original scans.</p>
  </header>
  <ol class="arc-list">
${rows}
  </ol>
  ${pager}
  <p class="arc-back"><a href="/archive/">← Every year, 1922 onward</a></p>
</div>`;

  return page({
    title,
    description,
    canonical: `/archive/${year}/`,
    crumbs: [{ label: "Archive", href: "/archive/" }, { label: String(year) }],
    body,
  });
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

function renderLanding(issues, decades, topics) {
  const years = groupByYear(issues);
  const first = issues[0];
  const last = issues[issues.length - 1];
  const words = issues.reduce((n, i) => n + i.wordCount, 0);

  const decadeBlocks = decades
    .map((d) => {
      const inDecade = years.filter((y) => Math.floor(y.year / 10) * 10 === d.decade);
      const links = inDecade
        .map(
          (y) =>
            `<a class="arc-yearchip" href="/archive/${y.year}/">${y.year}<span>${y.issues.length}</span></a>`
        )
        .join("");
      return `<section class="arc-decade">
  <h3 class="arc-decade__h">${d.decade}s <span class="arc-decade__count">${d.issues.length} issues</span></h3>
  <div class="arc-yearchips">${links}</div>
</section>`;
    })
    .join("\n");

  const body = `<div class="hp-wrap arc-landing">
  <header class="arc-landing__head">
    <figure class="arc-masthead">
      <img src="/img/nature-notes-masthead-1925.png" width="856" height="335" fetchpriority="high"
        alt="The bulletin's 1925 masthead: the words Yosemite Nature Notes in a banner across a pen drawing of a wind-bent pine on a granite ridge." />
      <figcaption>The bulletin's masthead, 1925.</figcaption>
    </figure>
    <p class="arc-eyebrow">A public archive</p>
    <h1 class="arc-title">Yosemite Nature Notes, 1922 onward</h1>
    <p class="arc-lede">
      For more than sixty years the naturalists of Yosemite National Park wrote down what
      they saw. Bears at the pits, the first Steller's jay of the season, a glacier measured,
      a meadow burned, the firefall lit and the firefall stopped. They mailed it out as a
      bulletin called <em>Yosemite Nature Notes</em>. This is that run, ${issues.length} issues of it,
      transcribed from the original scans and free to read.
    </p>
    <dl class="arc-stats">
      <div><dt>Issues</dt><dd>${issues.length}</dd></div>
      <div><dt>Years</dt><dd>${first.year}–${last.year}</dd></div>
      <div><dt>Words</dt><dd>${(Math.round(words / 1000) * 1000).toLocaleString()}</dd></div>
    </dl>
  </header>

  <section class="arc-browse">
    <h2 class="arc-h2">Browse by decade</h2>
${decadeBlocks}
  </section>

  <section class="arc-bytopic">
    <h2 class="arc-h2">Browse by topic</h2>
    <p class="arc-bytopic__note">Short passages on one subject, quoted as printed from ${TOPIC_YEARS[0]} to ${TOPIC_YEARS[1]}, each linked to the issue it came from.</p>
    <div class="arc-yearchips">${topics
      .map((t) => `<a class="arc-yearchip" href="${t.path}">${esc(t.name)}<span>${t.quotes.length}</span></a>`)
      .join("")}</div>
    <p class="arc-back"><a href="/archive/topics/">Every topic →</a></p>
  </section>

  <section class="arc-about" id="about">
    <h2 class="arc-h2">About this archive</h2>
    <p>
      <em>Yosemite Nature Notes</em> began on July 10, 1922 as a mimeographed sheet from the
      park naturalist's office, and ran, monthly for most of its life, into the 1980s. It was
      published by the National Park Service together with the Yosemite Natural History
      Association, the organisation that became today's Yosemite Conservancy. The writing is
      first-hand and often very plain: a ranger noting what was on the trail that week.
    </p>
    <p>
      The scans these transcriptions were made from are hosted by
      <a href="https://www.yosemite.ca.us/library/yosemite_nature_notes/" rel="noopener nofollow" target="_blank">yosemite.ca.us</a>,
      and every issue page links back to the exact PDF it came from. Text was extracted from the
      originals rather than retyped, then re-flowed into paragraphs; headlines are reproduced in
      the capitals the bulletin printed them in. Spelling and punctuation are left as published,
      including terms and attitudes of their period that the Park Service would not use today.
    </p>
    <p>
      Dates come off each issue's own masthead. Where a cover carried no legible date, the year is
      taken from the rest of that volume and the page says so rather than presenting a guess as a
      fact. Works of United States Government authorship are in the public domain; later issues were
      published by the Natural History Association, and any rights holder who wants an issue removed
      or corrected should <a href="/contact">get in touch</a> and it will be.
    </p>
    <p>
      Found an error in a transcription? <a href="/contact">Tell us which issue</a> and it gets fixed.
    </p>
  </section>

  <section class="arc-seealso">
    <h2 class="arc-h2">Also worth your time</h2>
    <p>
      The Park Service revived the name for a series of short films, also called
      <em>Yosemite Nature Notes</em>, and they are very good. They are collected on
      <a href="/films">the films page</a>. For what is happening in the park this week rather
      than in 1934, there is <a href="/now">The Park Bulletin</a>.
    </p>
  </section>

  ${askBlock("archive-index")}
</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Yosemite Nature Notes Archive",
    url: `${ORIGIN}/archive/`,
    description: `All ${issues.length} issues of Yosemite Nature Notes, ${first.year}-${last.year}, transcribed in full.`,
    inLanguage: "en-US",
    about: { "@type": "Place", name: "Yosemite National Park" },
    isPartOf: { "@id": `${ORIGIN}/#publisher` },
  };

  return page({
    title: `The Yosemite Nature Notes Archive, ${first.year}–${last.year} | The Talus Field`,
    description: truncate(
      `All ${issues.length} issues of Yosemite Nature Notes, the National Park Service's Yosemite bulletin, ${first.year} to ${last.year}. Transcribed in full from the original scans and free to read.`,
      175
    ),
    canonical: "/archive/",
    crumbs: [{ label: "Archive" }],
    body,
    jsonLd,
  });
}

// ---------------------------------------------------------------------------
// Topic hubs
// ---------------------------------------------------------------------------
// /archive/topics/<slug>/ gathers one subject (black bears, the Big Trees,
// Tuolumne Meadows...) out of the run: short passages quoted from the issues,
// each linked to the section of the issue it sits in, then the bulletin's own
// headlines on that subject, each linked the same way. /archive/topics/ lists
// them. The curation lives in scripts/data/nature-notes-topics.json; read its
// _comment before adding a hub.
//
// Three rules hold the hubs up, and they are why a hub carries no prose of
// its own about its subject:
//   1. QUOTES ONLY, VERBATIM. Every passage is a contiguous run of one
//      paragraph of the named issue, exactly as this generator prints it on
//      the issue page. resolveTopic() refuses to build a hub whose quote it
//      cannot find, and check-archive-citations.mjs re-reads the published
//      issue page for every quote, so a transcription fix that changes a
//      quoted passage fails the build instead of leaving a misquote up.
//   2. NOTHING THE ISSUES DO NOT SAY. The page's own copy is templated and
//      restricted to what the generator can count: how many passages, how
//      many issues, which years, which headlines. No summary of what the
//      naturalists "found", no dates or figures typed by hand.
//   3. THE ISSUE IS THE SOURCE. Each quote and headline links to its issue
//      page at the heading it ran under (headingAnchors(), the ids the issue
//      page itself uses), and carries the issue's printed date, with the
//      archive's "(year inferred)" marker where the cover gave none.
//
// The hubs are archive pages, not SPA routes: same shell, same one ask (tag
// `archive-topics`), same sitemap. Like every archive page they never invoke
// the Worker, so edge/seo.js has nothing to say about them.

const TOPIC_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "nature-notes-topics.json"), "utf8"));
const TOPIC_YEARS = TOPIC_DATA.years;

// A headline as the hub prints it: the masthead line the extractor sometimes
// glued to the first headline ("VOL. XXI NOVEMBER, 1942 NO. 11 LITTLE CHANGE
// IN YOSEMITE'S GLACIERS") is dropped, as is stray punctuation in front. The
// link still goes to the full headline's anchor on the issue page.
function cleanHeadline(text) {
  return String(text)
    .replace(/^[^A-Za-z0-9"]+/, "")
    .replace(/^VOL\.?\s+[IVXLC]+\.?\s+[A-Z]+,?\s+\d{4},?\s+NO\.?\s*\d+\s+/, "")
    .replace(/^NO\.?\s*\d+\s+/, "")
    .trim();
}

// Headlines past this length are photo captions and cover blurbs the
// extractor read as headings, not headlines.
const MAX_HEADLINE = 90;

function resolveTopic(topic, issues) {
  const bySlug = new Map(issues.map((i) => [i.slug, i]));
  const order = new Map(issues.map((i, idx) => [i.slug, idx]));
  const inRange = (issue) => issue.year >= TOPIC_YEARS[0] && issue.year <= TOPIC_YEARS[1];
  // The anchor of the nearest heading above the quoted paragraph, so the link
  // lands on the passage. Its text is not printed as the quote's headline: the
  // extractor turned some column fragments into headings ("ADVANCES SHOWN"),
  // and a caption naming one would mislabel the passage.
  const anchorAbove = (issue, blockIdx, anchors) => {
    for (let k = blockIdx; k >= 0; k--) {
      if (issue.blocks[k].type === "heading") return anchors[k];
    }
    return null;
  };

  const seen = new Set();
  const quotes = topic.quotes.map((q) => {
    const issue = bySlug.get(q.issue);
    if (!issue) throw new Error(`nature-notes-topics.json ${topic.slug}: no issue ${q.issue}`);
    if (!inRange(issue)) {
      throw new Error(`nature-notes-topics.json ${topic.slug}: ${q.issue} (${issue.year}) is outside ${TOPIC_YEARS.join("-")}`);
    }
    if (seen.has(q.issue)) throw new Error(`nature-notes-topics.json ${topic.slug}: ${q.issue} is quoted twice`);
    seen.add(q.issue);
    const text = String(q.text).trim();
    const idx = issue.blocks.findIndex((b) => b.type === "para" && b.text.includes(text));
    if (idx === -1) {
      throw new Error(
        `nature-notes-topics.json ${topic.slug}: quote not found verbatim in a paragraph of ${q.issue}: "${truncate(text, 80)}"`
      );
    }
    return { issue, text, anchor: anchorAbove(issue, idx, headingAnchors(issue)) };
  });
  quotes.sort((a, b) => order.get(a.issue.slug) - order.get(b.issue.slug));

  const re = new RegExp(topic.headlines);
  const exclude = new Set(topic.exclude || []);
  const headlines = [];
  for (const issue of issues) {
    if (!inRange(issue)) continue;
    const anchors = headingAnchors(issue);
    const shown = new Set();
    issue.blocks.forEach((b, idx) => {
      if (b.type !== "heading") return;
      const text = cleanHeadline(b.text);
      if (!text || text.length > MAX_HEADLINE || !re.test(text) || exclude.has(text) || shown.has(text)) return;
      shown.add(text);
      headlines.push({ issue, text, anchor: anchors[idx] });
    });
  }

  const years = [...quotes.map((q) => q.issue.year), ...headlines.map((h) => h.issue.year)];
  const quoteYears = quotes.map((q) => q.issue.year);
  return {
    ...topic,
    path: `/archive/topics/${topic.slug}/`,
    quotes,
    headlines,
    span: [Math.min(...years), Math.max(...years)],
    quoteSpan: [Math.min(...quoteYears), Math.max(...quoteYears)],
  };
}

const yearSpan = ([a, b]) => (a === b ? String(a) : `${a}–${b}`);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// The issue's printed date, honest about the covers that gave none.
function issueDateText(issue) {
  return issue.date.confidence === "stated" ? issue.dateDisplay : `${issue.dateDisplay} (year inferred)`;
}

const anchored = (issue, anchor) => (anchor ? `${issue.path}#${anchor}` : issue.path);

function renderTopic(topic, allTopics) {
  const title = `${topic.title}, ${yearSpan(topic.span)}`;
  const issueCount = new Set(topic.quotes.map((q) => q.issue.slug)).size;
  const description = truncate(
    `${plural(topic.quotes.length, "passage", "passages")} on ${topic.name.toLowerCase()} quoted as printed in Yosemite Nature Notes, ${yearSpan(topic.quoteSpan)}, each linked to its issue, and ${plural(topic.headlines.length, "headline", "headlines")} the bulletin ran on ${topic.headlineNoun}.`,
    175
  );

  const quotes = topic.quotes
    .map(
      (q) => `<li class="arc-quote">
  <blockquote cite="${ORIGIN}${anchored(q.issue, q.anchor)}"><p>${esc(q.text)}</p></blockquote>
  <p class="arc-quote__src"><a href="${anchored(q.issue, q.anchor)}">${esc(issueDateText(q.issue))}</a> · Vol. ${q.issue.volume}, No. ${q.issue.number}</p>
</li>`
    )
    .join("\n");

  const headlines = topic.headlines.length
    ? `<ol class="arc-heads">
${topic.headlines
  .map(
    (h) =>
      `<li><a href="${anchored(h.issue, h.anchor)}"><span class="arc-heads__date">${esc(issueDateText(h.issue))}</span><span class="arc-heads__h">${esc(titleCase(h.text))}</span></a></li>`
  )
  .join("\n")}
  </ol>`
    : `<p class="arc-lede">No headline in these years matched.</p>`;

  const reads = (topic.reads || [])
    .map(
      ([href, label, note]) =>
        `<li><a href="${esc(href)}"><span class="arc-reads__label">${esc(label)}</span><span class="arc-reads__note">${esc(note)}</span></a></li>`
    )
    .join("\n");
  const others = allTopics
    .filter((t) => t.slug !== topic.slug)
    .map((t) => `<a class="arc-yearchip" href="${t.path}">${esc(t.name)}<span>${t.quotes.length}</span></a>`)
    .join("");

  const body = `<div class="hp-wrap arc-topic">
  <header class="arc-topic__head">
    <p class="arc-eyebrow">The Nature Notes archive · Topics</p>
    <h1 class="arc-title">${esc(title)}</h1>
    <p class="arc-lede">
      Every passage below is quoted from <em>Yosemite Nature Notes</em> as it was printed,
      spelling and punctuation included, and links to the place in the issue it came from.
      Under them are the bulletin's own headlines on ${esc(topic.headlineNoun)} from
      ${TOPIC_YEARS[0]} to ${TOPIC_YEARS[1]}, each linked the same way.
    </p>
  </header>
  <dl class="arc-facts">
    <div><dt>Passages</dt><dd>${topic.quotes.length}</dd></div>
    <div><dt>Issues quoted</dt><dd>${issueCount}</dd></div>
    <div><dt>Quoted from</dt><dd>${yearSpan(topic.quoteSpan)}</dd></div>
    <div><dt>Headlines</dt><dd>${topic.headlines.length}</dd></div>
  </dl>
  <nav class="arc-jump" aria-label="On this page">
    <a href="#passages">In the bulletin's words</a>
    <a href="#headlines">The headlines</a>
    <a href="#read-on">Read on</a>
  </nav>

  <section class="arc-topic__sec" aria-labelledby="passages">
    <h2 class="arc-h2" id="passages">In the bulletin's words</h2>
    <ol class="arc-quotes">
${quotes}
    </ol>
  </section>

  <section class="arc-topic__sec" aria-labelledby="headlines">
    <h2 class="arc-h2" id="headlines">The headlines, ${TOPIC_YEARS[0]}–${TOPIC_YEARS[1]}</h2>
    ${headlines}
  </section>

  <section class="arc-topic__sec" aria-labelledby="read-on">
    <h2 class="arc-h2" id="read-on">Read on</h2>
    ${reads ? `<ul class="arc-reads">\n${reads}\n    </ul>` : ""}
    <h3 class="arc-topic__h3">More from the archive by topic</h3>
    <div class="arc-yearchips">${others}</div>
    <p class="arc-back"><a href="/archive/topics/">Every topic</a> · <a href="/archive/">The whole archive</a></p>
  </section>

  ${askBlock("archive-topics")}
</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${ORIGIN}${topic.path}`,
    description,
    inLanguage: "en-US",
    isPartOf: { "@type": "CollectionPage", name: "The Yosemite Nature Notes Archive", url: `${ORIGIN}/archive/` },
    hasPart: topic.quotes.map((q) => ({
      "@type": "PublicationIssue",
      name: `Yosemite Nature Notes, ${q.issue.dateDisplay} (Vol. ${q.issue.volume}, No. ${q.issue.number})`,
      url: `${ORIGIN}${q.issue.path}`,
      datePublished: q.issue.iso,
    })),
  };

  return page({
    title: `${title} | The Talus Field`,
    description,
    canonical: topic.path,
    crumbs: [
      { label: "Archive", href: "/archive/" },
      { label: "Topics", href: "/archive/topics/" },
      { label: topic.name },
    ],
    body,
    jsonLd,
  });
}

function renderTopicsIndex(topics) {
  const cards = topics
    .map((t) => {
      const lead = t.quotes[0];
      return `<li class="arc-topiccard">
  <h2 class="arc-topiccard__h"><a href="${t.path}">${esc(t.name)}</a></h2>
  <p class="arc-topiccard__meta">${plural(t.quotes.length, "passage", "passages")} · ${plural(t.headlines.length, "headline", "headlines")} · ${yearSpan(t.span)}</p>
  <blockquote class="arc-topiccard__q" cite="${ORIGIN}${anchored(lead.issue, lead.anchor)}"><p>${esc(lead.text)}</p></blockquote>
  <p class="arc-quote__src"><a href="${anchored(lead.issue, lead.anchor)}">${esc(issueDateText(lead.issue))}</a> · Vol. ${lead.issue.volume}, No. ${lead.issue.number}</p>
</li>`;
    })
    .join("\n");

  const passages = topics.reduce((n, t) => n + t.quotes.length, 0);
  const title = `Topics in Yosemite Nature Notes, ${TOPIC_YEARS[0]}–${TOPIC_YEARS[1]}`;
  const description = truncate(
    `${topics.map((t) => t.name).join(", ")}: ${passages} passages quoted as printed in Yosemite Nature Notes, ${TOPIC_YEARS[0]} to ${TOPIC_YEARS[1]}, each linked to the issue it came from.`,
    175
  );

  const body = `<div class="hp-wrap arc-topic">
  <header class="arc-topic__head">
    <p class="arc-eyebrow">The Nature Notes archive</p>
    <h1 class="arc-title">${esc(title)}</h1>
    <p class="arc-lede">
      ${topics.length} subjects from the bulletin's own pages: short passages quoted as printed,
      each linked to the issue it came from, and the headlines it ran on each subject. For
      everything else, <a href="/archive/">browse the whole run by year</a>.
    </p>
  </header>
  <ol class="arc-topiccards">
${cards}
  </ol>
  ${askBlock("archive-topics")}
</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${ORIGIN}/archive/topics/`,
    description,
    inLanguage: "en-US",
    isPartOf: { "@type": "CollectionPage", name: "The Yosemite Nature Notes Archive", url: `${ORIGIN}/archive/` },
    hasPart: topics.map((t) => ({ "@type": "CollectionPage", name: t.title, url: `${ORIGIN}${t.path}` })),
  };

  return page({
    title: `${title} | The Talus Field`,
    description,
    canonical: "/archive/topics/",
    crumbs: [{ label: "Archive", href: "/archive/" }, { label: "Topics" }],
    body,
    jsonLd,
  });
}

// ---------------------------------------------------------------------------
// Stylesheet
// ---------------------------------------------------------------------------
// Own file rather than an addition to styles.css: nothing else on the site
// uses these classes, and keeping them here means an archive tweak never
// changes styles.css and repaints the whole SPA's cache.

const ARCHIVE_CSS = `/* Generated by scripts/gen-archive.mjs — edit that file, not this one. */
/* The archive in the site's design system: the chrome is styles.css's own
   (.hp-design masthead, .crumbs, .site-footer); these rules are the archive's
   pages drawn in the same type, rules and cards. */

.arc-body { background: var(--paper); color: var(--ink); margin: 0; }
.arc-main { padding-bottom: 24px; }
.arc-crumbs { padding-top: 28px; }
.arc-crumbs .crumbs { margin-bottom: 0; }

/* Shared type ------------------------------------------------------------- */
.arc-eyebrow { font: 600 9px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); margin: 0 0 17px; }
.arc-title { font: 400 64px/1.02 var(--serif); letter-spacing: -1.4px; margin: 0 0 20px; }
.arc-lede { font-size: 14px; line-height: 1.85; color: var(--hp-muted); max-width: 560px; }
.arc-h2 { font: 400 38px/1.05 var(--serif); letter-spacing: -1px; margin: 56px 0 18px; }
.arc-back { font-size: 11px; font-weight: 600; margin-top: 40px; }
.arc-back a { border-bottom: 1px solid #a7afa4; padding-bottom: 4px; }
.arc-main a { color: inherit; }

/* Landing ----------------------------------------------------------------- */
.arc-landing, .arc-year, .arc-issue { padding-top: 40px; }
.arc-landing__head, .arc-year__head { border-bottom: 1px solid var(--hp-rule); padding-bottom: 40px; }
/* The 1925 masthead, re-inked in --ink on a transparent ground (made from the
   scan's luminance), so it sits on the paper rather than in a white box. */
.arc-masthead { margin: 0 0 36px; max-width: 720px; }
.arc-masthead img { display: block; width: 100%; height: auto; }
.arc-masthead figcaption { margin-top: 10px; font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-muted); }
.arc-stats { display: flex; gap: 40px; flex-wrap: wrap; margin: 28px 0 0; padding: 18px 0; border-block: 1px solid var(--hp-rule); }
.arc-stats div { display: flex; flex-direction: column; }
.arc-stats dt { font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); }
.arc-stats dd { margin: 6px 0 0; font: 400 30px/1 var(--serif); }
.arc-decade { margin: 28px 0; }
.arc-decade__h { font: 400 26px/1.1 var(--serif); letter-spacing: -.5px; margin: 0 0 12px; display: flex; align-items: baseline; gap: 12px; }
.arc-decade__count { font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-muted); }
.arc-yearchips { display: flex; flex-wrap: wrap; gap: 8px; }
.arc-yearchip {
  display: inline-flex; align-items: baseline; gap: 6px; min-height: 40px; align-items: center;
  font: 500 13px var(--sans); color: var(--ink-2);
  border: 1px solid var(--rule-soft); border-radius: 3px; padding: 0 14px;
}
.arc-yearchip:hover { color: var(--hp-accent); border-color: var(--hp-accent); }
.arc-yearchip span { font-size: 10px; color: var(--hp-muted); }
.arc-about p, .arc-seealso p { max-width: 680px; font-size: 13px; line-height: 1.85; color: var(--hp-muted); }
.arc-about a, .arc-seealso a, .arc-lede a, .arc-meta a, .arc-source a { color: var(--hp-ink); border-bottom: 1px solid #a7afa4; }

/* Year index -------------------------------------------------------------- */
.arc-list { list-style: none; margin: 32px 0 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 48px; }
.arc-list__item { border-top: 1px solid var(--hp-rule); padding: 20px 0 22px; }
.arc-list__link { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; color: var(--hp-ink); }
.arc-list__date { font: 400 26px/1.12 var(--serif); letter-spacing: -.5px; }
.arc-list__link:hover .arc-list__date { color: var(--hp-accent); }
.arc-list__vol { font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); }
.arc-list__heads { margin: 8px 0 0; font-size: 12px; color: var(--hp-muted); line-height: 1.7; }

/* Topic hubs: /firefall's fact row and jump list, in archive type ---------- */
.arc-topic { padding-top: 40px; }
.arc-topic__head { border-bottom: 1px solid var(--hp-rule); padding-bottom: 32px; }
.arc-facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; border-bottom: 1px solid var(--hp-rule); }
.arc-facts > div { padding: 20px 24px 20px 0; }
.arc-facts > div + div { padding-left: 24px; border-left: 1px solid var(--hp-rule); }
.arc-facts dt { font: 600 9px var(--sans); letter-spacing: 1.6px; text-transform: uppercase; color: var(--hp-muted); }
.arc-facts dd { margin: 6px 0 0; font: 400 26px/1.1 var(--serif); color: var(--hp-ink); }
.arc-jump { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 16px 0; border-bottom: 1px solid var(--hp-rule); font: 600 11px var(--sans); }
.arc-jump a { border-bottom: 1px solid #a7afa4; padding-bottom: 3px; }
.arc-jump a:hover { color: var(--hp-accent); border-color: var(--hp-accent); }
.arc-quotes, .arc-heads, .arc-reads, .arc-topiccards { list-style: none; margin: 0; padding: 0; max-width: 680px; }
.arc-quote { border-top: 1px solid var(--hp-rule); padding: 24px 0; }
.arc-quote blockquote, .arc-topiccard__q { margin: 0; padding-left: 18px; border-left: 2px solid var(--hp-accent); }
.arc-quote blockquote p, .arc-topiccard__q p { margin: 0; font: 400 21px/1.45 var(--serif); color: var(--hp-ink); }
.arc-quote__src { margin: 10px 0 0 20px; font-size: 11px; color: var(--hp-muted); }
.arc-quote__src a { color: var(--hp-ink); border-bottom: 1px solid #a7afa4; }
.arc-heads li { border-top: 1px solid var(--hp-rule); }
.arc-heads a { display: flex; gap: 16px; align-items: baseline; flex-wrap: wrap; padding: 12px 0; }
.arc-heads a:hover .arc-heads__h { color: var(--hp-accent); }
.arc-heads__date { flex: 0 0 150px; font: 600 9px var(--sans); letter-spacing: 1.4px; text-transform: uppercase; color: var(--hp-accent); }
.arc-heads__h { flex: 1; min-width: 0; font: 400 18px/1.3 var(--serif); }
.arc-reads li { border-top: 1px solid var(--hp-rule); }
.arc-reads a { display: flex; flex-direction: column; padding: 14px 0; }
.arc-reads__label { font: 400 21px/1.2 var(--serif); }
.arc-reads a:hover .arc-reads__label { color: var(--hp-accent); }
.arc-reads__note { font-size: 12px; color: var(--hp-muted); margin-top: 4px; }
.arc-topic__h3 { font: 600 9px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); margin: 36px 0 12px; }
.arc-topiccards { margin-top: 32px; max-width: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 48px; }
.arc-topiccard { border-top: 1px solid var(--hp-rule); padding: 24px 0 28px; }
.arc-topiccard__h { font: 400 32px/1.05 var(--serif); letter-spacing: -.6px; margin: 0 0 6px; }
.arc-topiccard__h a:hover { color: var(--hp-accent); }
.arc-topiccard__meta { font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-muted); margin: 0 0 16px; }
.arc-topiccard__q p { font-size: 18px; }
.arc-bytopic__note { max-width: 680px; font-size: 13px; line-height: 1.85; color: var(--hp-muted); }

/* Issue ------------------------------------------------------------------- */
.arc-issue__head { border-bottom: 1px solid var(--hp-rule); padding-bottom: 32px; }
.arc-meta { font-size: 11px; color: var(--hp-muted); margin: 6px 0 0; }
.arc-approx { border-bottom: 1px dotted var(--hp-muted); cursor: help; }
.arc-toc { max-width: 680px; margin: 36px 0; padding: 18px 22px; background: var(--hp-card); border: 1px solid var(--hp-rule); border-radius: 3px; }
.arc-toc__h { font: 600 9px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); margin: 0 0 12px; }
.arc-toc ol { margin: 0; padding-left: 1.1em; columns: 2; column-gap: 32px; }
.arc-toc li { margin: 4px 0; font-size: 13px; break-inside: avoid; }
.arc-toc li::marker { color: var(--hp-accent); }
.arc-prose { max-width: 680px; font: 17px/1.75 var(--sans); color: var(--hp-ink); }
.arc-prose p { margin: 0 0 1.2em; }
.arc-colophon { font-size: 12px; line-height: 1.7; color: var(--hp-muted); border-left: 2px solid var(--hp-accent); padding: 2px 0 2px 16px; margin-bottom: 28px; }
.arc-prose .arc-h2 {
  font: 400 30px/1.12 var(--serif); letter-spacing: -.6px; color: var(--hp-ink);
  margin: 48px 0 16px; padding-top: 36px; border-top: 1px solid var(--hp-rule);
}
.arc-issue__foot { max-width: 680px; margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--hp-rule); font-size: 11px; color: var(--hp-muted); }
.arc-source { margin: 0 0 8px; }

/* Pager ------------------------------------------------------------------- */
.arc-pager { max-width: 680px; display: flex; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--hp-ink); }
.arc-pager a { display: flex; flex-direction: column; color: var(--hp-ink); font: 400 21px/1.2 var(--serif); }
.arc-pager a span { font: 600 8px var(--sans); letter-spacing: 1.7px; text-transform: uppercase; color: var(--hp-accent); margin-bottom: 6px; }
.arc-pager__next { text-align: right; }
.arc-pager a:hover { color: var(--hp-accent); }
.arc-pager__none { visibility: hidden; }

/* The one ask: the design's letter card and form --------------------------- */
/* The form posts to the API Worker, which subscribes through Buttondown's API
   and redirects back to /newsletter. These pages run no JavaScript of their own, and
   Buttondown's own embed form now puts a Turnstile check in front of every
   signup. The honeypot field stays out of sight and out of the tab order. */
.arc-ask__hp { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
.arc-ask { max-width: 680px; margin: 48px 0 0; padding: 30px 32px; background: var(--hp-card); border: 1px solid var(--hp-rule); border-radius: 3px; }
.arc-ask__h { font: 400 32px/1.04 var(--serif); letter-spacing: -.8px; margin: 0 0 12px; }
.arc-ask__note { font-size: 13px; line-height: 1.85; color: var(--hp-muted); margin: 0 0 20px; }
.arc-ask__label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.arc-ask__form { display: flex; gap: 8px; }
.arc-ask__input { flex: 1; min-width: 0; padding: 13px; background: var(--hp-card); border: 1px solid #b8c0b3; border-radius: 3px; color: var(--hp-ink); font: 12px var(--sans); }
.arc-ask__input:focus-visible { outline: 3px solid var(--hp-accent); outline-offset: 2px; }
.arc-ask__button { padding: 15px 17px; background: var(--hp-accent); border: 0; border-radius: 3px; color: var(--hp-on-accent); font: 600 12px var(--sans); white-space: nowrap; cursor: pointer; }
.arc-ask__button:hover { background: var(--hp-accent-deep); }
.arc-ask__also { font-size: 11px; line-height: 1.7; color: var(--hp-muted); margin: 16px 0 0; }
.arc-ask__also a { color: var(--hp-ink); border-bottom: 1px solid #a7afa4; }

/* Provenance -------------------------------------------------------------- */
.arc-provenance { padding-top: 56px; }
.arc-footer__note { max-width: 680px; font-size: 11px; line-height: 1.7; color: var(--hp-muted); margin: 0; }
.arc-footer__note a { color: var(--hp-ink); border-bottom: 1px solid #a7afa4; }

@media (max-width: 760px) {
  .arc-title { font-size: 44px; letter-spacing: -1px; }
  .arc-h2 { font-size: 32px; }
  .arc-list { grid-template-columns: 1fr; }
  .arc-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .arc-facts > div:nth-child(3) { padding-left: 0; border-left: 0; }
  .arc-facts > div:nth-child(n + 3) { border-top: 1px solid var(--hp-rule); }
  .arc-topiccards { grid-template-columns: 1fr; }
  .arc-heads__date { flex-basis: 100%; }
  .arc-quote blockquote p { font-size: 19px; }
  .arc-toc ol { columns: 1; }
  .arc-prose { font-size: 16px; }
  .arc-ask { padding: 24px 22px; }
  .arc-ask__input { font-size: 16px; }
}
`;

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------
// The archive gets its own sitemap, referenced from robots.txt, rather than
// being merged into gen-seo-artifacts.mjs. 573 more <url> entries would swamp
// the editorial sitemap, and keeping the two generators independent means an
// archive rebuild never has to re-derive the article catalog.

// When the archive pages themselves last changed. <lastmod> means "when this
// URL's content last changed", not "when the source document was published",
// and the two are 70 to 100 years apart here. Publishing the 1922-1954 issue
// dates as lastmod told Google that 512 URLs had not been touched since the
// Coolidge administration, which is about the strongest "do not bother
// recrawling this" signal a sitemap can carry; 139 of these pages were sitting
// in "Crawled - currently not indexed" when the August 2026 audit ran.
//
// Bump this when a rebuild actually changes what these pages say: a
// transcription pass over nature-notes/, a change to the page template or the
// ask block, a parser fix in lib/nature-notes.mjs. Do NOT make it derive from
// the clock or from git: --check regenerates every file and byte-compares it
// against disk, so a date that moves on its own would fail the build every day
// after the last run, and shallow CI clones have no history to read.
//
// The issue's own 1922-1954 date is not lost. It is the visible dateline on
// each page and the datePublished of its PublicationIssue JSON-LD, which is
// where a publication date belongs.
const ARCHIVE_CONTENT_UPDATED = "2026-10-22";

function renderSitemap(issues, years, topics) {
  // No changefreq and no priority: Google has ignored both for years, and they
  // were 1,000+ lines of bytes carrying no signal.
  const urls = [
    { loc: "/archive/" },
    { loc: "/archive/topics/" },
    ...topics.map((t) => ({ loc: t.path })),
    ...years.map((y) => ({ loc: `/archive/${y.year}/` })),
    ...issues.map((i) => ({ loc: i.path })),
  ];
  const body = urls
    .map(({ loc }) =>
      [
        "  <url>",
        `    <loc>${ORIGIN}${loc}</loc>`,
        `    <lastmod>${ARCHIVE_CONTENT_UPDATED}</lastmod>`,
        "  </url>",
      ].join("\n")
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function renderReport(issues, topics) {
  const inferred = issues.filter((i) => i.date.confidence === "inferred");
  const byPrecision = issues.reduce((a, i) => {
    a[i.date.precision] = (a[i.date.precision] || 0) + 1;
    return a;
  }, {});
  const words = issues.reduce((n, i) => n + i.wordCount, 0);
  const shortest = [...issues].sort((a, b) => a.wordCount - b.wordCount).slice(0, 5);

  return `# Nature Notes archive: build report

Generated by \`scripts/gen-archive.mjs\`. Regenerate with
\`npm --prefix scripts run archive\`; do not hand-edit.

- Issues: **${issues.length}**
- Span: **${issues[0].year}–${issues[issues.length - 1].year}**
- Words transcribed: **${words.toLocaleString()}**
- Pages emitted: ${issues.length} issues + ${groupByYear(issues).length} year indexes + 1 landing + ${topics.length} topic hubs + 1 topics index

## Topic hubs

${topics.map((t) => `- \`${t.path}\`: ${t.quotes.length} quotes, ${t.headlines.length} headlines, ${yearSpan(t.span)}`).join("\n")}

## Date confidence

Dates are read from each issue's own masthead (page one only). See the header
comment in \`scripts/lib/nature-notes.mjs\` for why the search is restricted and
why position beats specificity.

| Precision | Issues |
|---|---|
${Object.entries(byPrecision)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join("\n")}

**${inferred.length} issues carry an inferred year** — no date was legible on the
cover, so the year comes from the median of the rest of that volume. These render
with a visible "(year inferred)" marker rather than presenting a guess as a fact.

${inferred.map((i) => `- \`${i.file}\` → ${i.year}`).join("\n")}

## Scan links

Each issue links to \`{volume}/{volume}-{number}.pdf\` on yosemite.ca.us. A path
that misread 11 as \`ll\`, \`XI\`, or \`II\` is rewritten before the page is written.
${issues.filter((i) => !i.scanPosted).map((i) => `- \`${i.file}\` (${i.dateDisplay}): the canonical PDF is not on yosemite.ca.us. The page says so and does not link a different file.`).join("\n")}

## Shortest issues

Thin pages are worth knowing about; none of these are empty, but they are the
first place to look if a transcription failed.

${shortest.map((i) => `- \`${i.file}\` (${i.dateDisplay}) — ${i.wordCount.toLocaleString()} words`).join("\n")}
`;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

function collectFiles() {
  const issues = loadIssues();
  const decades = groupByDecade(issues);
  const years = groupByYear(issues);
  const files = new Map();
  const topics = TOPIC_DATA.topics.map((t) => resolveTopic(t, issues));

  files.set("archive.css", ARCHIVE_CSS);
  files.set("index.html", renderLanding(issues, decades, topics));
  files.set("sitemap.xml", renderSitemap(issues, years, topics));
  files.set("topics/index.html", renderTopicsIndex(topics));
  for (const t of topics) files.set(`topics/${t.slug}/index.html`, renderTopic(t, topics));

  years.forEach(({ year, issues: list }, idx) => {
    const prev = years[idx - 1] ? years[idx - 1].year : null;
    const next = years[idx + 1] ? years[idx + 1].year : null;
    files.set(`${year}/index.html`, renderYear(year, list, prev, next));
  });

  issues.forEach((issue, idx) => {
    files.set(
      `${issue.year}/${issue.slug}/index.html`,
      renderIssue(issue, issues[idx - 1] || null, issues[idx + 1] || null)
    );
  });

  return { issues, topics, files };
}

const { issues, topics, files } = collectFiles();

if (CHECK) {
  const stale = [];
  for (const [rel, content] of files) {
    const abs = path.join(OUT_DIR, rel);
    if (!fs.existsSync(abs) || fs.readFileSync(abs, "utf8") !== content) stale.push(rel);
  }
  // An orphan is a page for an issue that no longer exists in /nature-notes.
  const expected = new Set([...files.keys()].map((f) => path.join(OUT_DIR, f)));
  const orphans = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (!expected.has(abs)) orphans.push(path.relative(OUT_DIR, abs));
    }
  };
  walk(OUT_DIR);

  if (stale.length || orphans.length) {
    console.error("gen-archive: /archive is stale relative to /nature-notes.");
    if (stale.length) console.error(`  ${stale.length} file(s) differ, first few: ${stale.slice(0, 5).join(", ")}`);
    if (orphans.length) console.error(`  ${orphans.length} orphan file(s), first few: ${orphans.slice(0, 5).join(", ")}`);
    console.error("  Run: npm --prefix scripts run archive");
    process.exit(1);
  }
  console.log(`gen-archive: /archive is up to date (${files.size} files, ${issues.length} issues).`);
} else {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  for (const [rel, content] of files) {
    const abs = path.join(OUT_DIR, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, renderReport(issues, topics));
  console.log(
    `gen-archive: wrote ${files.size} files to /archive ` +
      `(${issues.length} issues, ${issues[0].year}–${issues[issues.length - 1].year}).`
  );
  console.log(`gen-archive: report at scripts/data/nature-notes-report.md`);
}
