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
// Nothing replaces it here: an archive page loads no JavaScript at all. The
// site Header's mobile menu is React state (`menuOpen` in components.jsx), so
// rendering it statically would ship a hamburger button that does nothing on
// phones. These pages get a flat, link-only masthead instead, built from the
// same styles.css classes so it still reads as the same publication.
//
// /styles.css is linked WITHOUT a ?v= on purpose. _headers serves it with
// max-age=300 + stale-while-revalidate, so a stylesheet change reaches readers
// within minutes anyway, and the alternative — baking the shared version into
// every page — would rewrite all 512 files on every unrelated CSS tweak.
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

const NAV_LINKS = [
  ["/archive/", "The archive"],
  ["/articles", "Articles"],
  ["/films", "Films"],
  ["/map", "The Map"],
  ["/guide", "Field Guide"],
  ["/about", "About"],
];

function masthead(crumbs) {
  const nav = NAV_LINKS.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join("");
  const trail = crumbs
    .map((c, i) =>
      c.href && i < crumbs.length - 1
        ? `<a href="${c.href}">${esc(c.label)}</a>`
        : `<span aria-current="page">${esc(c.label)}</span>`
    )
    .join('<span class="arc-crumbs__sep" aria-hidden="true">/</span>');

  return `<header class="arc-masthead">
  <div class="wrap arc-masthead__inner">
    <a class="arc-brand" href="/">
      <img class="arc-brand__mark" src="/img/talus-field-mark.png" alt="" width="40" height="40" loading="eager" />
      <span class="arc-brand__text">
        <span class="arc-brand__name">The Talus Field</span>
        <span class="arc-brand__sub">A field journal of Yosemite</span>
      </span>
    </a>
    <nav class="arc-nav" aria-label="Site">${nav}</nav>
  </div>
  <div class="wrap arc-crumbs"><nav aria-label="Breadcrumb">${trail}</nav></div>
</header>`;
}

const FOOTER = `<footer class="arc-footer">
  <div class="wrap">
    <p class="arc-footer__note">
      <strong>Yosemite Nature Notes</strong> was published by the National Park Service
      and the Yosemite Natural History Association. The transcriptions here were made
      from the scanned originals; each issue links to the scan it came from. Text of
      United States Government authorship is in the public domain. See
      <a href="/archive/#about">about this archive</a> for provenance and corrections.
    </p>
    <nav class="arc-footer__nav">
      <a href="/">The Talus Field</a>
      <a href="/archive/">Archive</a>
      <a href="/films">Nature Notes films</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
    </nav>
  </div>
</footer>`;

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
//      Buttondown `tag` is distinct per surface (`archive`, `archive-index`).
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
  <form class="arc-ask__form" action="https://buttondown.com/api/emails/embed-subscribe/goehring" method="post" target="_blank" rel="noopener">
    <label class="arc-ask__label" for="${id}-email">Email address</label>
    <input id="${id}-email" class="arc-ask__input" type="email" name="email" placeholder="you@email.com" autocomplete="email" required />
    <input type="hidden" name="tag" value="${tag}" />
    <input type="hidden" name="embed" value="1" />
    <button class="arc-ask__button" type="submit">Subscribe</button>
  </form>
  <p class="arc-ask__also">
    ${guideLine} The archive is the reading; the guide is the walking, offline, at the
    trailhead where there is no signal.
  </p>
</aside>`;
}

function page({ title, description, canonical, crumbs, body, jsonLd, noindex, ogType = "website" }) {
  const ld = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en" data-palette="golden" data-density="airy">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
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
${masthead(crumbs)}
<main class="arc-main">
${body}
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

function renderIssue(issue, prev, next) {
  const title = `Yosemite Nature Notes, ${issue.dateDisplay} (Vol. ${issue.volume}, No. ${issue.number})`;
  const description = issueDescription(issue);

  // Anchor ids have to be unique inside one page: the same headline can appear
  // twice in an issue ("NOTES AND COMMENT" runs as a standing column).
  const used = new Map();
  const anchorFor = (text) => {
    const base = slugify(text) || "section";
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

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
      const id = anchorFor(block.text);
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

  const body = `<article class="wrap arc-issue">
  <header class="arc-issue__head">
    <p class="arc-eyebrow">Yosemite Nature Notes · ${esc(issueLabel(issue))}</p>
    <h1 class="arc-title">${esc(issue.dateDisplay)}</h1>
    <p class="arc-meta">${dateLine(issue)} · ${issue.wordCount.toLocaleString()} words · <a href="${esc(issue.sourceUrl)}" rel="noopener nofollow" target="_blank">Original scan (PDF) ↗</a></p>
  </header>
  ${toc}
  <div class="arc-prose">
${parts.join("\n")}
  </div>
  <footer class="arc-issue__foot">
    <p class="arc-source">Transcribed from <a href="${esc(issue.sourceUrl)}" rel="noopener nofollow" target="_blank">${esc(issue.pdfFilename)}</a>. Spelling, punctuation, and the original headlines are left as printed.</p>
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
    title: `${title} — The Talus Field`,
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
  const title = `Yosemite Nature Notes, ${year} — The Talus Field`;
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

  const body = `<div class="wrap arc-year">
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

function renderLanding(issues, decades) {
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

  const body = `<div class="wrap arc-landing">
  <header class="arc-landing__head">
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
    title: `The Yosemite Nature Notes Archive, ${first.year}–${last.year} — The Talus Field`,
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
// Stylesheet
// ---------------------------------------------------------------------------
// Own file rather than an addition to styles.css: nothing else on the site
// uses these classes, and keeping them here means an archive tweak never
// forces the shared ?v= bump that repaints the whole SPA's cache.

const ARCHIVE_CSS = `/* Generated by scripts/gen-archive.mjs — edit that file, not this one. */

.arc-body { background: var(--paper); color: var(--ink); font-family: var(--serif); }
.arc-main { padding-bottom: 4rem; }

/* Masthead ---------------------------------------------------------------- */
.arc-masthead { border-bottom: 2px solid var(--rule); background: var(--paper); }
.arc-masthead__inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1.5rem; flex-wrap: wrap; padding-top: 1rem; padding-bottom: 1rem;
}
.arc-brand { display: flex; align-items: center; gap: .6rem; text-decoration: none; color: inherit; }
.arc-brand__mark { width: 40px; height: 40px; }
.arc-brand__text { display: flex; flex-direction: column; line-height: 1.1; }
.arc-brand__name { font-family: var(--display); font-size: 1.35rem; font-weight: 600; letter-spacing: .01em; }
.arc-brand__sub { font-family: var(--sans); font-size: .7rem; color: var(--ink-3); letter-spacing: .06em; text-transform: uppercase; }
.arc-nav { display: flex; flex-wrap: wrap; gap: 1.1rem; font-family: var(--sans); font-size: .82rem; }
.arc-nav a { color: var(--ink-2); text-decoration: none; border-bottom: 1px solid transparent; padding-bottom: 2px; }
.arc-nav a:hover { color: var(--moss); border-bottom-color: var(--moss); }
.arc-crumbs { font-family: var(--sans); font-size: .75rem; color: var(--ink-3); padding-bottom: .7rem; }
.arc-crumbs a { color: var(--ink-3); }
.arc-crumbs__sep { margin: 0 .45rem; opacity: .5; }

/* Shared type ------------------------------------------------------------- */
.arc-eyebrow {
  font-family: var(--sans); font-size: .72rem; letter-spacing: .1em;
  text-transform: uppercase; color: var(--moss); margin: 0 0 .5rem;
}
.arc-title { font-family: var(--display); font-size: clamp(2rem, 5vw, 3rem); line-height: 1.08; margin: 0 0 .6rem; }
.arc-lede { font-size: 1.12rem; line-height: 1.6; color: var(--ink-2); max-width: var(--measure); }
.arc-h2 { font-family: var(--display); font-size: 1.5rem; margin: 2.4rem 0 .8rem; }
.arc-back { font-family: var(--sans); font-size: .85rem; margin-top: 2.5rem; }

/* Landing ----------------------------------------------------------------- */
.arc-landing { padding-top: 2.5rem; }
.arc-stats { display: flex; gap: 2.5rem; flex-wrap: wrap; margin: 1.8rem 0 0; padding: 1rem 0; border-top: 1px solid var(--rule-soft); border-bottom: 1px solid var(--rule-soft); }
.arc-stats div { display: flex; flex-direction: column; }
.arc-stats dt { font-family: var(--sans); font-size: .7rem; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-3); }
.arc-stats dd { margin: .15rem 0 0; font-family: var(--display); font-size: 1.6rem; }
.arc-decade { margin: 1.6rem 0; }
.arc-decade__h { font-family: var(--display); font-size: 1.2rem; margin: 0 0 .6rem; display: flex; align-items: baseline; gap: .7rem; }
.arc-decade__count { font-family: var(--sans); font-size: .72rem; color: var(--ink-3); text-transform: uppercase; letter-spacing: .07em; }
.arc-yearchips { display: flex; flex-wrap: wrap; gap: .45rem; }
.arc-yearchip {
  display: inline-flex; align-items: baseline; gap: .35rem;
  font-family: var(--sans); font-size: .85rem; text-decoration: none;
  color: var(--ink); background: var(--paper-2);
  border: 1px solid var(--rule-soft); border-radius: 2px; padding: .32rem .6rem;
}
.arc-yearchip:hover { background: var(--paper-3); border-color: var(--rule); }
.arc-yearchip span { font-size: .68rem; color: var(--ink-3); }
.arc-about p, .arc-seealso p { max-width: var(--measure); line-height: 1.65; color: var(--ink-2); }

/* Year index -------------------------------------------------------------- */
.arc-year { padding-top: 2.5rem; }
.arc-list { list-style: none; margin: 2rem 0 0; padding: 0; }
.arc-list__item { border-top: 1px solid var(--rule-soft); padding: .9rem 0; }
.arc-list__item:last-child { border-bottom: 1px solid var(--rule-soft); }
.arc-list__link { display: flex; align-items: baseline; gap: .9rem; flex-wrap: wrap; text-decoration: none; color: var(--ink); }
.arc-list__date { font-family: var(--display); font-size: 1.25rem; }
.arc-list__link:hover .arc-list__date { color: var(--moss); }
.arc-list__vol { font-family: var(--sans); font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3); }
.arc-list__heads { margin: .3rem 0 0; font-size: .95rem; color: var(--ink-3); line-height: 1.5; max-width: var(--measure); }

/* Issue ------------------------------------------------------------------- */
.arc-issue { padding-top: 2.5rem; }
.arc-issue__head { border-bottom: 2px solid var(--rule); padding-bottom: 1.2rem; }
.arc-meta { font-family: var(--sans); font-size: .82rem; color: var(--ink-3); margin: .4rem 0 0; }
.arc-approx { border-bottom: 1px dotted var(--ink-3); cursor: help; }
.arc-toc { margin: 2rem 0; padding: 1.1rem 1.3rem; background: var(--paper-2); border: 1px solid var(--rule-soft); }
.arc-toc__h { font-family: var(--sans); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 .6rem; }
.arc-toc ol { margin: 0; padding-left: 1.1rem; columns: 2; column-gap: 2rem; }
.arc-toc li { margin: .22rem 0; font-size: .92rem; break-inside: avoid; }
.arc-toc a { color: var(--ink-2); }
@media (max-width: 640px) { .arc-toc ol { columns: 1; } }
.arc-prose { max-width: var(--measure); font-size: 1.08rem; line-height: 1.72; }
.arc-prose p { margin: 0 0 1.05rem; }
.arc-colophon {
  font-family: var(--sans); font-size: .82rem; line-height: 1.55; color: var(--ink-3);
  border-left: 2px solid var(--rule-soft); padding: .1rem 0 .1rem .8rem; margin-bottom: 1.6rem;
}
.arc-prose .arc-h2 {
  font-family: var(--sans); font-size: .95rem; font-weight: 600;
  letter-spacing: .04em; line-height: 1.35; color: var(--ink);
  margin: 2.2rem 0 .7rem; padding-top: .9rem; border-top: 1px solid var(--rule-soft);
}
.arc-issue__foot { margin-top: 3rem; padding-top: 1.2rem; border-top: 1px solid var(--rule-soft); font-family: var(--sans); font-size: .82rem; color: var(--ink-3); }
.arc-source { margin: 0 0 .6rem; }

/* Pager ------------------------------------------------------------------- */
.arc-pager { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2.5rem; padding-top: 1.2rem; border-top: 1px solid var(--rule-soft); font-family: var(--sans); }
.arc-pager a { display: flex; flex-direction: column; text-decoration: none; color: var(--ink); font-size: 1rem; }
.arc-pager a span { font-size: .68rem; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-3); margin-bottom: .15rem; }
.arc-pager__next { text-align: right; }
.arc-pager a:hover { color: var(--moss); }
.arc-pager__none { visibility: hidden; }

/* The one ask -------------------------------------------------------------- */
.arc-ask {
  border-top: 2px solid var(--rule); max-width: var(--measure);
  margin: 3rem 0 0; padding: 1.5rem 0 0;
}
.arc-ask__h { font-family: var(--display); font-size: 1.3rem; font-style: italic; margin: 0 0 .4rem; }
.arc-ask__note { font-size: 1rem; line-height: 1.6; color: var(--ink-2); margin: 0 0 1.1rem; }
.arc-ask__label {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}
.arc-ask__form { display: flex; gap: .6rem; align-items: baseline; border-bottom: 1px solid var(--ink); }
.arc-ask__input {
  flex: 1; min-width: 0; background: transparent; border: 0; color: inherit;
  font-family: var(--serif); font-size: 1.05rem; padding: .5rem 0;
}
.arc-ask__input:focus-visible { outline: 2px solid var(--moss); outline-offset: 2px; }
.arc-ask__button {
  background: transparent; border: 0; cursor: pointer; color: var(--ink);
  font-family: var(--sans); font-size: .7rem; font-weight: 700;
  letter-spacing: .18em; text-transform: uppercase; padding: .5rem 0;
}
.arc-ask__button:hover { color: var(--moss); }
.arc-ask__also { font-family: var(--sans); font-size: .82rem; line-height: 1.6; color: var(--ink-3); margin: 1.1rem 0 0; }

/* Footer ------------------------------------------------------------------ */
.arc-footer { border-top: 2px solid var(--rule); background: var(--paper-2); padding: 2rem 0 3rem; }
.arc-footer__note { max-width: var(--measure); font-size: .88rem; line-height: 1.6; color: var(--ink-3); margin: 0 0 1rem; }
.arc-footer__nav { display: flex; flex-wrap: wrap; gap: 1.1rem; font-family: var(--sans); font-size: .8rem; }
.arc-footer__nav a { color: var(--ink-2); }
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
const ARCHIVE_CONTENT_UPDATED = "2026-08-25";

function renderSitemap(issues, years) {
  // No changefreq and no priority: Google has ignored both for years, and they
  // were 1,000+ lines of bytes carrying no signal.
  const urls = [
    { loc: "/archive/" },
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

function renderReport(issues) {
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
- Pages emitted: ${issues.length} issues + ${groupByYear(issues).length} year indexes + 1 landing

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

  files.set("archive.css", ARCHIVE_CSS);
  files.set("index.html", renderLanding(issues, decades));
  files.set("sitemap.xml", renderSitemap(issues, years));

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

  return { issues, files };
}

const { issues, files } = collectFiles();

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
  fs.writeFileSync(REPORT, renderReport(issues));
  console.log(
    `gen-archive: wrote ${files.size} files to /archive ` +
      `(${issues.length} issues, ${issues[0].year}–${issues[issues.length - 1].year}).`
  );
  console.log(`gen-archive: report at scripts/data/nature-notes-report.md`);
}
