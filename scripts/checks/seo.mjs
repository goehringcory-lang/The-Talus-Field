// Per-page SEO completeness + og:image resolution + Article JSON-LD validation.
//
// Validates the committed articles.json — the exact catalog functions/_middleware.js
// reads to inject per-page <title>, meta description, canonical, OG/Twitter tags,
// and the Article/FAQ/Trail JSON-LD. A single article shipping without a
// description (or with a dup title, or a missing og:image) quietly underperforms
// forever, so these are errors; length-band and image-size issues are warnings.

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { ROOT, slugify } from "../lib/catalog.mjs";

import { makeCheck } from "../lib/report.mjs";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
// Google typically renders ~120-160 chars of a meta description. The middleware
// uses seoDek || dek; flag anything likely to truncate or look thin.
const DESC_MIN = 70;
const DESC_MAX = 160;

function resolveImagePath(art) {
  const fromOg = art.ogImage && art.ogImage.url;
  const candidate = fromOg || (art.image && `img/responsive/${slugify(path.basename(art.image))}-1600.jpg`);
  if (candidate && existsSync(path.join(ROOT, candidate))) return candidate;
  if (art.image && existsSync(path.join(ROOT, art.image.replace(/^\/+/, "")))) {
    return art.image.replace(/^\/+/, "");
  }
  return null;
}

export default async function checkSeo() {
  const check = makeCheck("Per-page SEO, og:image & JSON-LD");
  const articles = JSON.parse(readFileSync(path.join(ROOT, "articles.json"), "utf8"));

  const titles = new Map();
  for (const a of articles) {
    const id = a.slug || "(no slug)";

    // Title: present + unique.
    if (!a.title || !a.title.trim()) check.error(`${id}: missing title`);
    else {
      const prev = titles.get(a.title);
      if (prev) check.error(`${id}: duplicate title shared with ${prev}`);
      else titles.set(a.title, id);
    }

    // Meta description (seoDek || dek).
    const desc = a.seoDek || a.dek;
    if (!desc || !desc.trim()) {
      check.error(`${id}: missing meta description (no seoDek/dek)`);
    } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      check.warn(`${id}: description length ${desc.length} outside ${DESC_MIN}-${DESC_MAX}`);
    }

    // Canonical derivability.
    if (!a.slug) check.error(`${id}: missing slug — cannot build canonical URL`);

    // og:image resolves to a real file with usable dimensions.
    const img = resolveImagePath(a);
    if (!img) {
      check.error(`${id}: og:image does not resolve to an on-disk file`);
    } else if (a.ogImage) {
      if (!a.ogImage.width || !a.ogImage.height) check.warn(`${id}: og:image missing width/height`);
      else if (a.ogImage.width < 1200) check.warn(`${id}: og:image width ${a.ogImage.width}px is small for a social card`);
      else if (a.ogImage.height > a.ogImage.width) check.warn(`${id}: og:image is portrait (${a.ogImage.width}x${a.ogImage.height}); scrapers crop these badly — run npm run images for a landscape og card`);
    } else {
      check.warn(`${id}: no ogImage variant; falling back to source image ${img}`);
    }

    // Article JSON-LD required fields (mirrors middleware jsonLd shape).
    if (!ISO.test(a.isoDate || "")) check.error(`${id}: datePublished (isoDate) not ISO yyyy-mm-dd: "${a.isoDate}"`);
    const mod = a.isoModified || a.isoDate;
    if (mod && !ISO.test(mod)) check.error(`${id}: dateModified (isoModified) not ISO: "${a.isoModified}"`);

    // FAQ / Trail LD shape (only when present).
    if (a.faq) {
      if (!Array.isArray(a.faq) || a.faq.some((p) => !p || !p.q || !p.a)) {
        check.error(`${id}: faq present but malformed (each entry needs q + a)`);
      }
    }
    if (a.trail && !a.trail.name && !a.trail.distance) {
      check.warn(`${id}: trail present but has neither name nor distance`);
    }

    // Enrichment gap: keywords power the Article schema "keywords" field.
    if (!Array.isArray(a.keywords) || !a.keywords.length) {
      check.warn(`${id}: no keywords in seo-data.json (Article schema keywords omitted)`);
    }
  }

  check.info(`${articles.length} articles audited; ${titles.size} unique titles`);
  return check.result();
}
