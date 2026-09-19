#!/usr/bin/env node
// In-body contextual internal links: the one SEO rule the repo states and
// nothing measured.
//
// CLAUDE.md, under the August 2026 SEO pass: "Every new article ships 3 to 5
// in-body contextual links with descriptive anchor text, woven into sentences
// that already made the point, plus a RELATED entry." The RELATED half is
// guarded (check-edge-redirects.mjs asserts every rendered block resolves and
// that the graph reaches every article). The in-body half was not guarded at
// all, and the two are not interchangeable: RELATED renders one rail in a
// fixed position on every article, while a contextual link sits inside the
// sentence that earned it. Search Console counted 1,557 internal links
// reaching 33 pages before that pass, only five of them articles, which is the
// failure this file exists to catch early.
//
// A September 2026 full-site audit found the rule had drifted: two articles
// had no contextual inbound link from anywhere in the catalog (one of them the
// newest piece, which nothing had been woven into yet), and sixteen carried
// fewer than three outbound. Both are quiet failures. An article nothing links
// to is reachable only through the rail and the lists, which is what "66
// articles received no contextual inbound link" looked like the first time.
//
// Severity follows how the failure reads to a crawler:
//   error - an article with ZERO in-body inbound links from any other article.
//   warn  - an article below MIN_OUTBOUND in-body outbound links.
// The warning is deliberately not an error. Weaving a link into prose that
// already makes the point is editorial work that belongs to the evergreen
// refresh routine (see the territory table in ROUTINES.md), and failing the
// build over it would push somebody to bolt a link onto a sentence that does
// not want one, which is the opposite of what the rule is for.
//
// Only links inside bodies/*.jsx count. Links from the standing pages, the
// KEEP_GOING table and the related rail are structural navigation, present on
// every route by construction, and counting them would mean every article
// passes and the check measures nothing.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadDataJs, ROOT } from "./lib/catalog.mjs";

const MIN_OUTBOUND = 3;
const verbose = process.argv.includes("--verbose");

const { articles } = loadDataJs();
const slugs = new Set(articles.map((a) => a.slug));

// Article bodies link to each other as /articles/<slug>. A bare /<slug> is a
// standing route, not an article, so the prefix is what distinguishes them.
const LINK_RE = /\/articles\/([a-z0-9-]+)/g;

const inbound = new Map();
const outbound = new Map();
for (const s of slugs) {
  inbound.set(s, new Set());
  outbound.set(s, new Set());
}

const missingBodies = [];
for (const a of articles) {
  const rel = path.join("bodies", `${a.slug}.jsx`);
  const file = path.join(ROOT, rel);
  if (!existsSync(file)) {
    missingBodies.push(rel);
    continue;
  }
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(LINK_RE)) {
    const target = m[1];
    // A slug that is not in the catalog is a broken internal link, caught by
    // the links module in the system-checks battery; not this file's job.
    if (!slugs.has(target) || target === a.slug) continue;
    outbound.get(a.slug).add(target);
    inbound.get(target).add(a.slug);
  }
}

const errors = [];
const warnings = [];

for (const rel of missingBodies) {
  errors.push(`${rel} is indexed in data.js but has no body file`);
}

const orphans = articles.filter((a) => inbound.get(a.slug).size === 0);
for (const a of orphans) {
  errors.push(
    `${a.slug}: no in-body contextual inbound link from any article ` +
      `(reachable only through the related rail and the lists)`
  );
}

const thin = articles
  .filter((a) => outbound.get(a.slug).size < MIN_OUTBOUND)
  .sort((x, y) => outbound.get(x.slug).size - outbound.get(y.slug).size);
for (const a of thin) {
  warnings.push(
    `${a.slug}: ${outbound.get(a.slug).size} in-body outbound contextual ` +
      `link(s), house rule is ${MIN_OUTBOUND} to 5`
  );
}

if (verbose) {
  const rows = articles
    .map((a) => ({
      slug: a.slug,
      in: inbound.get(a.slug).size,
      out: outbound.get(a.slug).size,
    }))
    .sort((x, y) => x.in - y.in || x.out - y.out);
  console.log("slug".padEnd(46) + "inbound  outbound");
  for (const r of rows) {
    console.log(
      r.slug.padEnd(46) + String(r.in).padStart(7) + String(r.out).padStart(10)
    );
  }
  console.log("");
}

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(
    "\nEvery article needs at least one contextual link from another article's " +
      "body, woven into a sentence that already made the point. Add it in the " +
      "article that would naturally send a reader there, not in a list."
  );
  process.exit(1);
}

const totalLinks = [...outbound.values()].reduce((n, s) => n + s.size, 0);
console.log(
  `check-internal-links: ${totalLinks} in-body contextual links across ` +
    `${articles.length} articles; every article has an inbound link` +
    (warnings.length ? `; ${warnings.length} below ${MIN_OUTBOUND} outbound` : "")
);
