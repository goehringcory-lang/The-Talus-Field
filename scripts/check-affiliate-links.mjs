#!/usr/bin/env node
// Affiliate links: the markup and disclosure rules in CLAUDE.md (the
// "Affiliate links: where they go, how they are marked, how they are
// disclosed" bullet), checked wherever a script can see them.
//
// Before this existed the rules lived in component comments and a reviewer's
// memory. Every anchor was right when it shipped, but the only thing keeping
// the next hand-written one right was copying a neighbour, and the disclosure
// convention ("a short note at the end of the article") put the only notice
// after every link it disclosed.
//
// Errors (the build fails):
//   1. An <a data-aff-network> in any root page, component or body without
//      target="_blank" and rel="sponsored noopener", or without data-aff-list.
//   2. An <a> whose href is minted by an affiliate builder (or names a tracking
//      host) but carries no data-aff-network, so GA4 never sees the click.
//   3. A body with affiliate markup whose window.ARTICLES entry lacks
//      `aff: true` (no disclosure under the byline), or the reverse, or a
//      flagged body without <AffiliateNote /> at the end.
//   4. A standing page with affiliate markup and no AffiliateDisclosure,
//      unless PAGE_EXEMPT below says where its top-of-page notice lives.
//   5. affiliate.js and the gen-prerender.mjs mirror disagree on an ID, so
//      the prerendered fragment would carry a different tracking link than
//      the SPA renders ("mirror any ID change", CLAUDE.md).
//   6. A kit item whose aff is neither the dormant "#" nor a Patagonia link.
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverseMod from "@babel/traverse";
import { ROOT, loadDataJs } from "./lib/catalog.mjs";

const traverse = traverseMod.default || traverseMod;
const REL = "sponsored noopener";
const AFF_HREF_RE = /buildAffiliateLink|buildPatagoniaAffiliateLink|pxf\.io|prf\.hn|search\.href|\.aff\b|EXPEDIA_BANNER|\bb\.href/;
const BODY_AFF_RE = /<LodgingCta\b|<AvailabilityLink\b|<AffLink\b|<RecommendedCard\b|data-aff-network/;

// Standing pages whose top-of-page notice is not the shared component, and
// where it is instead. Keep the reason honest: the check trusts this table.
const PAGE_EXEMPT = {
  "page-stay.jsx": "own disclosure beside the head search panel, the first link on the page",
  "page-kit.jsx": "own disclosure paragraph in the intro, above every list",
  "page-map.jsx": "one link, in the sidebar, with its disclosure in the same line",
  "page-article.jsx": "per-article AffiliateDisclosure driven by the aff flag",
  "page-planning-guide.jsx": "own disclosure line in the hero, above the first link, plus a second under the lodging step",
};

const errors = [];
const rel = (f) => path.relative(ROOT, f);

function attrValue(attr) {
  if (!attr || !attr.value) return null;
  if (attr.value.type === "StringLiteral") return attr.value.value;
  if (attr.value.type === "JSXExpressionContainer") {
    const e = attr.value.expression;
    if (e.type === "StringLiteral") return e.value;
    return { expr: true };
  }
  return null;
}

function checkJsx(file) {
  const src = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parse(src, { sourceType: "script", plugins: ["jsx"] });
  } catch (e) {
    errors.push(`${rel(file)}: does not parse (${e.message})`);
    return src;
  }
  traverse(ast, {
    JSXOpeningElement(p) {
      const n = p.node;
      if (n.name.type !== "JSXIdentifier" || n.name.name !== "a") return;
      const attrs = {};
      for (const a of n.attributes) if (a.type === "JSXAttribute") attrs[a.name.name] = a;
      const line = n.loc.start.line;
      const where = `${rel(file)}:${line}`;
      const hrefSrc = attrs.href ? src.slice(attrs.href.start, attrs.href.end) : "";
      if (attrs["data-aff-network"]) {
        if (attrValue(attrs.target) !== "_blank") errors.push(`${where}: affiliate link without target="_blank"`);
        if (attrValue(attrs.rel) !== REL) errors.push(`${where}: affiliate link rel must be "${REL}"`);
        if (!attrs["data-aff-list"]) errors.push(`${where}: affiliate link without data-aff-list (GA4 placement)`);
      } else if (AFF_HREF_RE.test(hrefSrc)) {
        errors.push(`${where}: href is an affiliate link but the anchor has no data-aff-network`);
      }
    },
  });
  return src;
}

// 1 + 2: every JSX source the browser runs.
const jsxFiles = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith(".jsx")).map((f) => path.join(ROOT, f)),
  ...fs.readdirSync(path.join(ROOT, "bodies")).filter((f) => f.endsWith(".jsx")).map((f) => path.join(ROOT, "bodies", f)),
];
const sources = new Map();
for (const f of jsxFiles) sources.set(f, checkJsx(f));

// The prerender mirror builds anchors with React.createElement; hold it to the
// same rel by text.
const prerender = fs.readFileSync(path.join(ROOT, "scripts/gen-prerender.mjs"), "utf8");
for (const m of prerender.matchAll(/rel:\s*"([^"]*sponsored[^"]*)"/g)) {
  if (m[1] !== REL) errors.push(`scripts/gen-prerender.mjs: affiliate rel "${m[1]}" should be "${REL}"`);
}

// 3: body markup and the catalog flag agree.
const { articles, kit } = loadDataJs();
const bySlug = new Map(articles.map((a) => [a.slug, a]));
let flagged = 0;
for (const [file, src] of sources) {
  if (path.basename(path.dirname(file)) !== "bodies") continue;
  const slug = path.basename(file, ".jsx");
  const art = bySlug.get(slug);
  if (!art) continue;
  const hasAff = BODY_AFF_RE.test(src);
  if (hasAff && !art.aff) errors.push(`bodies/${slug}.jsx carries affiliate links but its window.ARTICLES entry has no \`aff: true\`, so no disclosure renders above the first link`);
  if (!hasAff && art.aff) errors.push(`${slug}: \`aff: true\` in window.ARTICLES but the body carries no affiliate markup`);
  if (hasAff && !/<AffiliateNote\s*\/>/.test(src)) errors.push(`bodies/${slug}.jsx carries affiliate links but no <AffiliateNote /> at the end`);
  if (art.aff) flagged++;
}

// 4: standing pages disclose at the top.
for (const [file, src] of sources) {
  const base = path.basename(file);
  if (!/^page-.*\.jsx$/.test(base) || PAGE_EXEMPT[base]) continue;
  const code = src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  if (BODY_AFF_RE.test(code) && !/<AffiliateDisclosure\b/.test(code)) {
    errors.push(`${base} carries affiliate links but no <AffiliateDisclosure /> in its page head (or add it to PAGE_EXEMPT with where its notice lives)`);
  }
}

// 5: affiliate.js and the prerender mirror carry the same IDs.
const affJs = fs.readFileSync(path.join(ROOT, "affiliate.js"), "utf8");
for (const k of ["PATAGONIA_AFFILIATE_BASE", "EXPEDIA_CAMREF", "BOOKING_AFFILIATE_AID", "STAY22_AFFILIATE_ID", "HIPCAMP_AFFILIATE_BASE"]) {
  const a = affJs.match(new RegExp(`window\\.${k}\\s*=\\s*"([^"]*)"`));
  const b = prerender.match(new RegExp(`const ${k}\\s*=\\s*"([^"]*)"`));
  if (!a || !b) errors.push(`${k}: not found in ${!a ? "affiliate.js" : "scripts/gen-prerender.mjs"}`);
  else if (a[1] !== b[1]) errors.push(`${k}: affiliate.js has "${a[1]}" but gen-prerender.mjs has "${b[1]}"`);
}

// 6: kit items are dormant or Patagonia.
let kitLinks = 0;
for (const list of (kit && kit.lists) || []) {
  for (const it of list.allItems || []) {
    if (!it.aff || it.aff === "#") continue;
    kitLinks++;
    if (!/^https:\/\/patagonia\.pxf\.io\/c\/\d+\/\d+\/\d+\?u=https%3A%2F%2Fwww\.patagonia\.com%2F/.test(it.aff)) {
      errors.push(`kit item ${it.id}: aff is neither "#" nor a Patagonia tracking link: ${it.aff}`);
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} affiliate-link problem(s). The rules are the affiliate bullet in CLAUDE.md.`);
  process.exit(1);
}
console.log(`check-affiliate-links: ${jsxFiles.length} sources, ${flagged} flagged articles, ${kitLinks} kit links; markup and disclosures consistent`);
