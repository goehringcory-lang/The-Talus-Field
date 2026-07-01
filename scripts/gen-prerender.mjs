// Pre-renders each article body (bodies/<slug>.jsx) to a static HTML fragment
// committed at /prerender/<slug>.html. The edge middleware (functions/_middleware.js)
// injects that fragment into /articles/<slug> so non-JS crawlers (Bing, GPTBot,
// ClaudeBot, social scrapers, and Google's first pass) see real article prose
// instead of a blank <div id="root">. The client SPA still renders into #root
// and app.jsx removes the injected #prerender-prose block on boot, so JS users
// only ever see React's single copy.
//
// Bodies are plain React + HTML and register themselves on
// window.ARTICLE_BODIES[slug]. The only external components any body references
// are Placeholder / MotifMountains|Sun|Trees / ResponsiveImage; those are stubbed
// below with markup faithful enough for crawlers (image alt text + credit).
//
// IMPORTANT: keep the stubs below in sync with components.jsx. `--check` (wired
// into `npm run check`) fails if /prerender is stale relative to bodies/.
//
// Usage:
//   node scripts/gen-prerender.mjs           # write /prerender/*.html
//   node scripts/gen-prerender.mjs --check    # exit 1 if any fragment is stale

import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// @babel/core, the preset, and React ship as CommonJS; load them via require so
// the named/default interop is unambiguous under ESM.
const require = createRequire(import.meta.url);
const babel = require("@babel/core");
const presetReact = require("@babel/preset-react");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BODIES_DIR = path.join(ROOT, "bodies");
const OUT_DIR = path.join(ROOT, "prerender");

const CHECK = process.argv.includes("--check");

// --- Stubs for the handful of components a body may reference. Faithful enough
// for crawlers: an <img> carrying alt text, plus the credit line. Keep aligned
// with Placeholder / ResponsiveImage / Motif* in components.jsx. ---
function ResponsiveImage(props) {
  const src = "/" + String(props.image || "").replace(/^\/+/, "");
  return React.createElement("img", {
    className: props.className,
    src,
    alt: props.alt || "",
  });
}
function Placeholder(props) {
  const kids = [];
  if (props.image) {
    kids.push(React.createElement(ResponsiveImage, {
      key: "img",
      className: "placeholder__img",
      image: props.image,
      alt: props.caption || "",
    }));
  }
  if (props.credit) {
    kids.push(React.createElement("div", { key: "credit", className: "placeholder__credit" }, props.credit));
  }
  return React.createElement(
    "div",
    { className: "placeholder" + (props.image ? " placeholder--photo" : ""), "data-tag": props.tag || "PLATE" },
    kids
  );
}
const MotifMountains = () => null;
const MotifSun = () => null;
const MotifTrees = () => null;

// End-of-body affiliate disclosure. Keep the copy in sync with AffiliateNote
// in components.jsx.
function AffiliateNote() {
  return React.createElement(
    "p",
    { className: "article-aff-note" },
    "Some links in this piece are affiliate links to Patagonia. If you buy through one, The Talus Field may earn a small commission at no extra cost to you. ",
    React.createElement("a", { href: "/affiliate" }, "Full disclosure.")
  );
}

// Bodies with inline affiliate links call window.buildPatagoniaAffiliateLink
// at render time (affiliate.js in the browser). Mirror it here, minus the
// console warning, so those hrefs prerender to the same tracking URLs the SPA
// renders. Keep the base in sync with affiliate.js.
const PATAGONIA_AFFILIATE_BASE = "https://patagonia.pxf.io/c/7338432/1948563/23649";
function buildPatagoniaAffiliateLink(targetUrl) {
  if (!targetUrl) return PATAGONIA_AFFILIATE_BASE;
  return PATAGONIA_AFFILIATE_BASE + "?u=" + encodeURIComponent(targetUrl);
}

function renderBody(slug, src) {
  // Classic runtime so JSX compiles to React.createElement / React.Fragment that
  // resolve against the `React` global we put in the vm sandbox (mirrors the
  // browser, which loads React as a UMD global).
  const { code } = babel.transformSync(src, {
    presets: [[presetReact, { runtime: "classic" }]],
    filename: `${slug}.jsx`,
    babelrc: false,
    configFile: false,
  });

  const sandbox = {
    React,
    window: { ARTICLE_BODIES: {}, buildPatagoniaAffiliateLink },
    console,
    ResponsiveImage,
    Placeholder,
    MotifMountains,
    MotifSun,
    MotifTrees,
    AffiliateNote,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: `${slug}.jsx` });

  const fn = sandbox.window.ARTICLE_BODIES[slug];
  if (typeof fn !== "function") {
    throw new Error(`bodies/${slug}.jsx did not register window.ARTICLE_BODIES["${slug}"]`);
  }
  return renderToStaticMarkup(React.createElement(fn)) + "\n";
}

const slugs = fs
  .readdirSync(BODIES_DIR)
  .filter((f) => f.endsWith(".jsx"))
  .map((f) => f.replace(/\.jsx$/, ""))
  .sort();

let stale = 0;
let wrote = 0;
const errors = [];

if (!CHECK && !fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slug of slugs) {
  let html;
  try {
    html = renderBody(slug, fs.readFileSync(path.join(BODIES_DIR, slug + ".jsx"), "utf8"));
  } catch (e) {
    errors.push(`${slug}: ${e.message}`);
    continue;
  }
  const outPath = path.join(OUT_DIR, slug + ".html");
  const existing = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : null;
  if (existing === html) continue;

  if (CHECK) {
    stale++;
    console.error(`stale: prerender/${slug}.html`);
  } else {
    fs.writeFileSync(outPath, html);
    wrote++;
    console.log(`wrote prerender/${slug}.html`);
  }
}

// Flag orphaned fragments (a body was deleted/renamed) so /prerender stays clean.
if (fs.existsSync(OUT_DIR)) {
  const have = new Set(slugs.map((s) => s + ".html"));
  for (const f of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".html"))) {
    if (!have.has(f)) {
      if (CHECK) { stale++; console.error(`orphan: prerender/${f}`); }
      else { fs.rmSync(path.join(OUT_DIR, f)); console.log(`removed orphan prerender/${f}`); }
    }
  }
}

if (errors.length) {
  console.error("\nprerender errors:\n  " + errors.join("\n  "));
  process.exit(1);
}
if (CHECK) {
  if (stale) {
    console.error(`\n${stale} prerender fragment(s) stale. Run: npm --prefix scripts run prerender`);
    process.exit(1);
  }
  console.log(`All ${slugs.length} prerender fragments up to date.`);
} else {
  console.log(`\nprerender: ${wrote} written, ${slugs.length} total.`);
}
