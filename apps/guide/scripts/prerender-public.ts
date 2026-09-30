// =============================================================================
// Prerender the public storefront pages into dist/ after the client build, so
// search engines can index them. Run as the last step of `npm run build`:
//
//   jiti scripts/prerender-public.ts
//
// Why: the app is one index.html for every route, and that file says
// `noindex, nofollow`, which is right for the gated app and was wrong for the
// signed-out pages built to be found and shared: /preview and the stop teasers
// (CODE-AUDIT-2026-08 item 8). Each page in src/lib/publicPages.ts becomes its
// own file (dist/preview.html, dist/stop/<id>.html). Cloudflare Pages serves
// /stop/<id> from stop/<id>.html, and every other path falls through to
// index.html by Pages' single-page-app default (there is no 404.html, and no
// _redirects rewrite, which Pages would apply even over a matching file).
//
// Each file is dist/index.html with:
//   - its own title, description, canonical and social tags, and
//     `index, follow` instead of the shell's `noindex, nofollow`;
//   - the page rendered by the real route components (src/prerender/entry.tsx)
//     in a #prerender block ahead of #root, which the app removes when its own
//     render of the page commits (DropPrerender in App.tsx) or at once for a
//     signed-in buyer (main.tsx);
//   - a tfg-prerendered meta, which tells the service worker not to keep the
//     file as the offline app shell (a buyer's offline launch must get the
//     plain shell, not a stranger's landing page).
//
// It also writes dist/sitemap.xml (these pages only) and dist/robots.txt.
// Nothing here reads the clock: no <lastmod>, so a no-op rebuild emits the
// same bytes (see scripts/check-build-determinism.mjs).
// =============================================================================

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { createServer } from 'vite'

type PublicPage = { path: string; title: string; description: string; image?: string }
type Entry = {
  render: (path: string) => string
  publicPages: () => PublicPage[]
  PUBLIC_ORIGIN: string
}

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const SUFFIX = ' · The Talus Field' // src/lib/documentTitle.ts

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Replace exactly one match or fail the build: a silent miss would ship a
 * page that still says noindex, or the shell's title on every stop. */
function replaceOnce(html: string, pattern: RegExp, replacement: string, what: string): string {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'))
  if (!matches || matches.length !== 1) {
    throw new Error(`prerender-public: expected one ${what} in dist/index.html, found ${matches?.length ?? 0}`)
  }
  return html.replace(pattern, replacement)
}

function metaContent(html: string, attr: 'name' | 'property', key: string, value: string): string {
  return replaceOnce(
    html,
    new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`),
    `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`,
    `${attr}="${key}" meta`,
  )
}

function pageHtml(shell: string, page: PublicPage, body: string, origin: string): string {
  const url = origin + page.path
  const title = page.title + SUFFIX
  let html = shell
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeText(title)}</title>`, '<title>')
  // Multi-line in the source (Vite keeps the formatting), so collapse first.
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, (m) => m.replace(/\s+/g, ' '))
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, (m) => m.replace(/\s+/g, ' '))
  html = metaContent(html, 'name', 'robots', 'index, follow, max-image-preview:large')
  html = metaContent(html, 'name', 'description', page.description)
  html = metaContent(html, 'property', 'og:title', title)
  html = metaContent(html, 'property', 'og:description', page.description)
  if (page.image) html = metaContent(html, 'property', 'og:image', origin + page.image)
  html = replaceOnce(
    html,
    /<\/title>/,
    `</title>\n    <link rel="canonical" href="${escapeAttr(url)}" />` +
      `\n    <meta property="og:url" content="${escapeAttr(url)}" />` +
      `\n    <meta name="tfg-prerendered" content="1" />`,
    '</title>',
  )
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="prerender">${body}</div>\n    <div id="root"></div>`,
    '#root',
  )
  return html
}

async function main() {
  const shell = await readFile(join(dist, 'index.html'), 'utf8')
  if (shell.includes('name="tfg-prerendered"')) {
    throw new Error('prerender-public: dist/index.html is already a prerendered page; rebuild first')
  }

  const server = await createServer({
    root,
    mode: 'production',
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  try {
    const entry = (await server.ssrLoadModule('/src/prerender/entry.tsx')) as Entry
    const pages = entry.publicPages()
    const origin = entry.PUBLIC_ORIGIN

    for (const page of pages) {
      const body = entry.render(page.path)
      if (!body.includes('<h1')) {
        throw new Error(`prerender-public: ${page.path} rendered no <h1>; is the route still public?`)
      }
      const out = join(dist, `${page.path.slice(1)}.html`)
      await mkdir(dirname(out), { recursive: true })
      await writeFile(out, pageHtml(shell, page, body, origin))
    }

    const urls = pages
      .map((p) => `  <url><loc>${escapeText(origin + p.path)}</loc></url>`)
      .join('\n')
    await writeFile(
      join(dist, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    )
    // Everything is crawlable: the gated routes keep index.html's noindex,
    // which a crawler can only see if robots.txt lets it fetch the page.
    await writeFile(
      join(dist, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    )
    console.log(`prerender-public: ${pages.length} pages, sitemap.xml, robots.txt`)
  } finally {
    await server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
