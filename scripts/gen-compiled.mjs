// Precompiles the editorial site's *.jsx (page scripts, components, app, and
// article bodies) to plain browser JS committed under /dist, so index.html can
// load <script src="/dist/*.js"> instead of <script type="text/babel"> plus the
// ~900 KB @babel/standalone transforming ~15 files in the browser. The readable
// .jsx files stay the source of truth; /dist is generated and committed, exactly
// like the SEO mirrors and responsive images.
//
// Presets mirror index.html's data-presets="react,env":
//   - preset-react (classic runtime) -> React.createElement against the UMD global
//   - preset-env with NO targets -> ES5, which downlevels const/let to var. That
//     downlevel is LOAD-BEARING: each file declares top-level `const { useState }
//     = React` etc., and classic <script>s share one lexical script scope, so
//     without var-downleveling the second file throws "already declared". The
//     generator asserts no top-level const/let survives before writing.
//
// Usage:
//   node scripts/gen-compiled.mjs           # write /dist/*.js
//   node scripts/gen-compiled.mjs --check    # exit 1 if any output is stale
//   node scripts/gen-compiled.mjs --smoke    # vm-execute each output, assert it
//                                            #   registers its window global

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const babel = require("@babel/core");
const presetReact = require("@babel/preset-react");
// Only block-scoping is load-bearing: classic <script>s share one lexical scope,
// so top-level const/let must become var to avoid cross-file "already declared".
// We do NOT run full preset-env to ES5, which would transpile async/await to
// regenerator (a global the site does not load) and needlessly bloat output.
const transformBlockScoping = require("@babel/plugin-transform-block-scoping");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DIST_BODIES = path.join(DIST, "bodies");

const CHECK = process.argv.includes("--check");
const SMOKE = process.argv.includes("--smoke");

// The root .jsx files index.html loads, in its load order. Kept explicit (not a
// glob) so a stray .jsx never silently ships. Mirrors index.html.
const PAGE_FILES = [
  "tweaks-panel.jsx",
  "components.jsx",
  "page-home.jsx",
  "page-planning-guide.jsx",
  "page-checklist.jsx",
  "page-about.jsx",
  "page-articles.jsx",
  "page-article.jsx",
  "page-newsletter-contact.jsx",
  "page-legal.jsx",
  "page-kit.jsx",
  "page-films.jsx",
  "page-places.jsx",
  "page-advertise.jsx",
  "page-guide.jsx",
  "page-map.jsx",
  "page-itineraries.jsx",
  "page-conditions.jsx",
  "app.jsx",
];

function compile(src, filename) {
  const { code } = babel.transformSync(src, {
    presets: [[presetReact, { runtime: "classic" }]],
    plugins: [transformBlockScoping],
    filename,
    babelrc: false,
    configFile: false,
    comments: false,
    compact: false,
  });
  return code + "\n";
}

// Cheap guard: no top-level const/let/class should remain after block-scoping.
// (Any leftover lexical binding reintroduces the cross-script "already declared"
// collision the shared <script> scope would throw on.)
function assertNoTopLevelLexical(code, name) {
  const offenders = code
    .split("\n")
    .filter((l) => /^(const|let|class)\s/.test(l));
  if (offenders.length) {
    throw new Error(`${name}: ${offenders.length} top-level const/let/class survived (would collide across scripts): ${offenders.slice(0, 3).map((l) => l.slice(0, 40)).join(" | ")}`);
  }
}

const jobs = [];
for (const f of PAGE_FILES) {
  jobs.push({ src: path.join(ROOT, f), out: path.join(DIST, f.replace(/\.jsx$/, ".js")), name: f });
}
for (const f of fs.readdirSync(path.join(ROOT, "bodies")).filter((f) => f.endsWith(".jsx"))) {
  jobs.push({ src: path.join(ROOT, "bodies", f), out: path.join(DIST_BODIES, f.replace(/\.jsx$/, ".js")), name: "bodies/" + f });
}

let stale = 0, wrote = 0;
const errors = [];

if (!CHECK && !SMOKE) {
  fs.mkdirSync(DIST_BODIES, { recursive: true });
}

const compiled = {};
for (const job of jobs) {
  let code;
  try {
    code = compile(fs.readFileSync(job.src, "utf8"), job.name);
    assertNoTopLevelLexical(code, job.name);
  } catch (e) {
    errors.push(`${job.name}: ${e.message}`);
    continue;
  }
  compiled[job.name] = code;

  if (SMOKE) continue;
  const existing = fs.existsSync(job.out) ? fs.readFileSync(job.out, "utf8") : null;
  if (existing === code) continue;
  if (CHECK) { stale++; console.error(`stale: dist/${path.relative(DIST, job.out)}`); }
  else { fs.writeFileSync(job.out, code); wrote++; console.log(`wrote dist/${path.relative(DIST, job.out)}`); }
}

if (errors.length) {
  console.error("\ncompile errors:\n  " + errors.join("\n  "));
  process.exit(1);
}

// --smoke: execute every compiled page file in ONE shared vm context (mirroring
// the browser's shared global) with a stubbed React/window/document, and assert
// each registers the window globals app.jsx's boot check requires. This catches
// a top-level throw or a missing registration without a browser.
if (SMOKE) {
  const noop = () => {};
  const fakeReact = new Proxy({
    useState: (v) => [typeof v === "function" ? v() : v, noop],
    useEffect: noop, useMemo: (fn) => fn(), useRef: () => ({ current: null }),
    useCallback: (fn) => fn, useContext: () => ({}), useReducer: (r, s) => [s, noop],
    createElement: () => ({}), Fragment: "Fragment",
    createContext: () => ({ Provider: noop, Consumer: noop }),
  }, { get: (t, p) => (p in t ? t[p] : noop) });

  const el = () => ({ style: {}, classList: { add: noop, remove: noop, contains: () => false },
    setAttribute: noop, appendChild: noop, addEventListener: noop, removeEventListener: noop,
    querySelector: () => null, querySelectorAll: () => [], remove: noop, getElementById: () => null });
  const sandbox = {
    React: fakeReact, ReactDOM: { createRoot: () => ({ render: noop }) },
    window: {}, document: Object.assign(el(), {
      getElementById: () => null, createElement: () => el(), querySelector: () => null,
      querySelectorAll: () => [], addEventListener: noop, body: el(), head: el(),
      documentElement: el(), title: "",
    }),
    navigator: { userAgent: "node" }, location: { pathname: "/", hash: "", href: "https://x/" },
    history: { pushState: noop, replaceState: noop }, console,
    setTimeout: noop, clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
    requestAnimationFrame: noop, cancelAnimationFrame: noop, fetch: () => Promise.resolve({ ok: false }),
    IntersectionObserver: class { observe(){} disconnect(){} }, matchMedia: () => ({ matches: false, addListener: noop }),
    localStorage: { getItem: () => null, setItem: noop }, Date,
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  // Minimal data globals the page scripts read at module load.
  sandbox.window.ARTICLES = []; sandbox.window.CATEGORIES = []; sandbox.window.START_HERE = [];
  sandbox.window.SITE = { issue: "", authorName: "", authorBio: "" };
  sandbox.window.safeStorage = { get: () => null, set: () => false, getJSON: () => null, setJSON: () => false };
  sandbox.window.byCategory = () => []; sandbox.window.findArticle = () => null;
  sandbox.window.findCategory = () => ({ label: "", slug: "" }); sandbox.window.NATURE_NOTES = [];
  vm.createContext(sandbox);

  const REQUIRED = ["Header", "Footer", "HomePage", "ArticlePage", "MapPage", "NewsletterPage"];
  for (const f of PAGE_FILES) {
    if (!compiled[f]) continue;
    try { vm.runInContext(compiled[f], sandbox, { filename: f }); }
    catch (e) { errors.push(`${f} (runtime): ${e.message}`); }
  }
  const missing = REQUIRED.filter((n) => typeof sandbox.window[n] !== "function");
  if (missing.length) errors.push("globals not registered after load: " + missing.join(", "));
  if (errors.length) { console.error("\nsmoke errors:\n  " + errors.join("\n  ")); process.exit(1); }
  console.log(`smoke: all ${PAGE_FILES.length} page scripts executed and registered their globals.`);
  process.exit(0);
}

if (CHECK) {
  if (stale) { console.error(`\n${stale} dist file(s) stale. Run: npm --prefix scripts run compile`); process.exit(1); }
  console.log(`All ${jobs.length} dist files up to date.`);
} else {
  console.log(`\ncompile: ${wrote} written, ${jobs.length} total.`);
}
