#!/usr/bin/env node
// Edge behaviour guard: redirects, host canonicalization, and the
// crawler-visible related-reading block.
//
// The Worker owns two things no other check could see: the www -> apex 301
// (both hosts are bound as custom domains in wrangler.jsonc, and Search
// Console was reporting three rows for the same article until August 2026) and
// the REDIRECTS table, which is how a retired article slug keeps its ranking
// signal instead of becoming a 404.
//
// Nothing exercised either one. `wrangler dev` is the obvious tool and is not
// always available: in sandboxed CI it cannot fetch its cf metadata and
// reload-loops without ever binding a port. So this drives the real
// edge/seo.js default export in plain node instead.
//
// It works because both paths return before the Worker touches next() or
// HTMLRewriter, neither of which exists outside workerd. For a request that
// must NOT redirect, we assert it reached the stubbed asset fetch, which is
// what proves it fell through the guard into normal handling rather than
// erroring out early.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const APEX = "https://thetalusfieldjournal.com";

const worker = (await import(path.join(ROOT, "edge/seo.js"))).default;

let assetsHit = 0;
const env = {
  ASSETS: {
    fetch() {
      assetsHit++;
      // text/plain short-circuits handleRequest before any HTMLRewriter use.
      return new Response("stub", { status: 200, headers: { "content-type": "text/plain" } });
    },
  },
};

async function call(url) {
  assetsHit = 0;
  const res = await worker.fetch(new Request(url), env);
  return { status: res.status, location: res.headers.get("location"), assetsHit };
}

const failures = [];
const fail = (msg) => failures.push(msg);

// --- www -> apex ------------------------------------------------------------
for (const [reqUrl, want] of [
  [`https://www.thetalusfieldjournal.com/articles/yosemite-in-fall`, `${APEX}/articles/yosemite-in-fall`],
  [`https://www.thetalusfieldjournal.com/planning?utm_source=news`, `${APEX}/planning?utm_source=news`],
  [`https://www.thetalusfieldjournal.com/`, `${APEX}/`],
]) {
  const r = await call(reqUrl);
  if (r.status !== 301 || r.location !== want) {
    fail(`www host not canonicalized: ${reqUrl} -> ${r.status} ${r.location} (expected 301 ${want})`);
  }
}

// Hosts that must be left alone. An exact www match is deliberate: a
// "hostname !== apex" guard would redirect local dev and workers.dev previews
// straight to production.
for (const reqUrl of [
  `${APEX}/articles/yosemite-in-fall`,
  "http://localhost:8788/planning",
  "https://the-talus-field.workers.dev/planning",
]) {
  const r = await call(reqUrl);
  if (r.status === 301) fail(`host wrongly redirected: ${reqUrl} -> ${r.location}`);
  else if (r.assetsHit !== 1) fail(`request never reached normal handling: ${reqUrl} (status ${r.status})`);
}

// --- REDIRECTS table --------------------------------------------------------
// Parsed from source rather than imported: the table is a module-private const,
// and reading it here keeps this check honest about what actually ships.
const src = readFileSync(path.join(ROOT, "edge/seo.js"), "utf8");
const block = src.match(/const REDIRECTS = \{([\s\S]*?)\n\};/);
if (!block) {
  fail("could not locate the REDIRECTS table in edge/seo.js");
}
const entries = block
  ? [...block[1].matchAll(/^\s*"([^"]+)":\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]])
  : [];

for (const [from, to] of entries) {
  const r = await call(`${APEX}${from}`);
  if (r.status !== 301 || r.location !== `${APEX}${to}`) {
    fail(`REDIRECTS ${from} -> ${r.status} ${r.location} (expected 301 ${APEX}${to})`);
  }
  // Query strings must survive: a retired slug arriving with campaign
  // attribution has to keep it on the other side.
  const q = await call(`${APEX}${from}?utm_source=newsletter`);
  if (q.location !== `${APEX}${to}?utm_source=newsletter`) {
    fail(`REDIRECTS ${from} dropped its query string: ${q.location}`);
  }
  // A redirect whose target is itself retired would send crawlers into a chain.
  if (entries.some(([f]) => f === to)) fail(`REDIRECTS ${from} points at ${to}, which is itself redirected`);
}

// --- the build-info route ---------------------------------------------------
// /.well-known/talus-build.json is what the nightly deploy-parity check reads
// to learn which catalog the live Worker bundle holds. It has to answer from
// the Worker (never the asset layer), carry every slug in articles.json, and
// tolerate a missing version binding, and the constant the nightly log uses
// (lib/deploy-parity.mjs, which must not import this module) has to match.
{
  const seoExports = await import(path.join(ROOT, "edge/seo.js"));
  const lib = await import("./lib/deploy-parity.mjs");
  if (seoExports.BUILD_INFO_PATH !== lib.BUILD_INFO_PATH) {
    fail(`BUILD_INFO_PATH differs: edge/seo.js ${seoExports.BUILD_INFO_PATH} vs lib/deploy-parity.mjs ${lib.BUILD_INFO_PATH}`);
  }
  const catalog = JSON.parse(readFileSync(path.join(ROOT, "articles.json"), "utf8"));
  const bulletin = JSON.parse(readFileSync(path.join(ROOT, "bulletin.json"), "utf8"));
  const buildUrl = `${APEX}${lib.BUILD_INFO_PATH}`;

  assetsHit = 0;
  const res = await worker.fetch(new Request(buildUrl), env);
  const ct = res.headers.get("content-type") || "";
  if (res.status !== 200) fail(`build-info route answered ${res.status}, expected 200`);
  if (!ct.includes("application/json")) fail(`build-info route content-type ${ct}, expected application/json`);
  if (assetsHit !== 0) fail("build-info route fell through to the asset layer");
  if (!/noindex/.test(res.headers.get("x-robots-tag") || "")) fail("build-info route is missing X-Robots-Tag: noindex");
  if (res.headers.get("cache-control") !== "no-store") fail("build-info route must be cache-control: no-store");
  let body = null;
  try {
    body = await res.json();
  } catch {
    fail("build-info route body is not JSON");
  }
  if (body) {
    const want = catalog.map((a) => a.slug);
    if (JSON.stringify(body.slugs) !== JSON.stringify(want)) fail("build-info slugs differ from articles.json");
    if (body.articles !== catalog.length) fail(`build-info articles ${body.articles}, expected ${catalog.length}`);
    if (body.newest !== lib.newestSlug(catalog)) fail(`build-info newest ${body.newest}, expected ${lib.newestSlug(catalog)}`);
    if (body.bulletinUpdated !== (bulletin.edition?.updated ?? null)) fail(`build-info bulletinUpdated ${body.bulletinUpdated}`);
    if (body.version !== null) fail("build-info reported a version with no binding in env");
  }

  const stamped = await worker.fetch(new Request(buildUrl), {
    ...env,
    CF_VERSION_METADATA: { id: "v-test", tag: "", timestamp: "2026-01-01T00:00:00Z" },
  });
  const v = (await stamped.json()).version;
  if (!v || v.id !== "v-test" || v.timestamp !== "2026-01-01T00:00:00Z") {
    fail(`build-info did not surface the version binding: ${JSON.stringify(v)}`);
  }

  const www = await call(`https://www.thetalusfieldjournal.com${lib.BUILD_INFO_PATH}`);
  if (www.status !== 301 || www.location !== buildUrl) fail(`build-info on www not canonicalized: ${www.status} ${www.location}`);
}

// --- crawler-visible related reading ----------------------------------------
// The Worker appends this block to every article's injected prose, and it is
// the only place those curated links exist for a crawler that runs no
// JavaScript. A slug that stops resolving here is a dead link in the
// crawler-visible HTML, which nothing else would notice: the link checker reads
// files, and this markup is generated at request time.
const { relatedBlock } = await import(path.join(ROOT, "edge/seo.js"));
const articles = JSON.parse(readFileSync(path.join(ROOT, "articles.json"), "utf8"));
const known = new Set(articles.map((a) => a.slug));

let blocksWithLinks = 0;
let totalLinks = 0;
for (const a of articles) {
  const html = relatedBlock(a.slug);
  if (!html) {
    fail(`no related block rendered for "${a.slug}"`);
    continue;
  }
  const hrefs = [...html.matchAll(/href="\/articles\/([^"]+)"/g)].map((m) => m[1]);
  if (hrefs.length < 4) fail(`related block for "${a.slug}" carries only ${hrefs.length} link(s)`);
  for (const h of hrefs) {
    if (!known.has(h)) fail(`related block for "${a.slug}" links to "${h}", which is not in articles.json`);
    if (h === a.slug) fail(`related block for "${a.slug}" links to itself`);
  }
  blocksWithLinks++;
  totalLinks += hrefs.length;
}

// The point of the whole exercise: the internal link graph should reach the
// catalog, not funnel onto a handful of pieces.
const reached = new Set();
for (const a of articles) {
  for (const m of relatedBlock(a.slug).matchAll(/href="\/articles\/([^"]+)"/g)) reached.add(m[1]);
}
if (reached.size < articles.length) {
  const orphans = articles.map((a) => a.slug).filter((s) => !reached.has(s));
  fail(`${orphans.length} article(s) receive no related link at all: ${orphans.join(", ")}`);
}

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`);
  process.exit(1);
}
console.log(
  `check-edge-redirects: www canonicalization holds, 3 non-www host(s) untouched, ` +
    `${entries.length} REDIRECTS entr${entries.length === 1 ? "y" : "ies"} resolve, ` +
    `the build-info route answers from the Worker, ` +
    `${totalLinks} related links across ${blocksWithLinks} article(s) reaching all ${reached.size} of them.`
);
