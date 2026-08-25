#!/usr/bin/env node
// The homepage title lives in five places and must be identical in all of them.
//
// `/` matches index.html on the asset layer and never invokes the Worker, so
// what a homepage visitor and a crawler receive is index.html's own <head>,
// while the Worker's known["/"] entry and app.jsx's client table describe the
// same page for SPA navigation back to it. Nothing reconciled the three: the
// equality was a comment in wrangler.jsonc ("harmless — the homepage's static
// <head> already equals what the Worker would write") and an assumption
// everywhere else. A drift would be invisible, and would show up in Search
// Console weeks later as two different titles for one URL.
//
// Also checks the og:title and twitter:title copies inside index.html, because
// a social card that disagrees with the page title is the same bug in a
// smaller font.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const read = (rel) => readFileSync(path.join(ROOT, rel), "utf8");

const problems = [];

// The declared source of truth: the HOME_TITLE const, which both JS surfaces
// must define identically.
const constOf = (rel) => {
  const m = read(rel).match(/^const HOME_TITLE = "([^"]+)";/m);
  if (!m) {
    problems.push(`${rel} does not define a top-level HOME_TITLE const`);
    return null;
  }
  return m[1];
};

const appTitle = constOf("app.jsx");
const edgeTitle = constOf("edge/seo.js");

if (appTitle && edgeTitle && appTitle !== edgeTitle) {
  problems.push(`HOME_TITLE differs: app.jsx has "${appTitle}", edge/seo.js has "${edgeTitle}"`);
}

const expected = appTitle || edgeTitle;

if (expected) {
  const html = read("index.html");
  const sites = [
    ["<title>", /<title>([^<]*)<\/title>/],
    ["og:title", /<meta property="og:title" content="([^"]*)"/],
    ["twitter:title", /<meta name="twitter:title" content="([^"]*)"/],
  ];
  for (const [label, re] of sites) {
    const m = html.match(re);
    if (!m) problems.push(`index.html has no ${label}`);
    else if (m[1] !== expected) {
      problems.push(`index.html ${label} is "${m[1]}", expected "${expected}"`);
    }
  }

  // Both known tables must actually use the const rather than reconstructing
  // the string, which is how they drifted apart in the first place.
  for (const rel of ["app.jsx", "edge/seo.js"]) {
    if (!/title: HOME_TITLE,/.test(read(rel))) {
      problems.push(`${rel} defines HOME_TITLE but its home route entry does not use it`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  console.error(
    "The homepage title must be identical in index.html (title, og:title, twitter:title), " +
      "app.jsx and edge/seo.js. `/` is served off the asset layer and never runs the Worker."
  );
  process.exit(1);
}

console.log(`check-home-title: all 5 copies agree — "${expected}"`);
