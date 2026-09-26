// =============================================================================
// Guard: every count the editorial site prints about the Field Guide matches
// the guide's own content.
//
// The sales copy is hand-written: HP_GUIDE_POINTS in components.jsx (the band
// on every page that mounts HpGuideBand), /guide, /partners, /widget, the
// crawler prose in edge/seo.js, and the meta descriptions in app.jsx all print
// "44 stops", "57 day hikes", "the 50-entry Secret Guide" as literal text.
// Nothing tied those numbers to the content, so a depth pass that added a
// stop left every one of them wrong, and the only signal was a reader who
// counted. September 2026: the /partners crawler prose still said "37-entry
// Secret Guide" thirteen entries after the guide passed it.
//
// So this imports the app's own content (the same modules the app renders
// from, not a regex over them), derives the counts, and scans the editorial
// files for each phrasing the copy uses. A match whose number disagrees is an
// error naming file, line and the right number. A phrasing that matches
// nothing anywhere is also an error, so a copy rewrite cannot quietly retire
// the guard by rewording around it.
//
// Two exemptions, both deliberate. Screenshot `alt:` lines describe the image
// as it was captured (a region card showing "21 stops, 15 hikes"), which is a
// fact about the picture, not a claim about the product. Region-level counts
// are not checked, because no copy outside those alts prints one.
//
// Run: npm --prefix apps/guide run check:sales-counts
//      (wired into `npm --prefix scripts run check`)
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stops, HIKES, SECRET_SPOTS, getSecretGuideEntries } from '../src/content'
import { WILDLIFE } from '../src/content/wildlife'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const hidden = stops.filter((s) => s.collection === 'hidden').length
const COUNTS = {
  core: stops.length - hidden,
  stops: stops.length,
  hikes: HIKES.length,
  secret: getSecretGuideEntries().length,
  total: stops.length - hidden + getSecretGuideEntries().length,
  wildlife: WILDLIFE.length,
  coord: stops.filter((s) => s.coord).length,
  budget: stops.filter((s) => s.timeBudgetMin != null).length,
}
// The merged list is secret spots plus hidden stops; if that ever stops being
// true the "total" arithmetic above is wrong too.
if (COUNTS.secret !== SECRET_SPOTS.length + hidden) {
  console.error(`check-sales-counts: Secret Guide is ${COUNTS.secret}, expected ${SECRET_SPOTS.length} secret spots + ${hidden} hidden stops`)
  process.exit(1)
}

const FILES = [
  'components.jsx',
  'page-guide.jsx',
  'page-partners.jsx',
  'page-widget.jsx',
  'page-start-here.jsx',
  'app.jsx',
  'edge/seo.js',
  'index.html',
  'llms.txt',
]

type Key = keyof typeof COUNTS
type Rule = { name: string; re: RegExp; expect: (m: RegExpMatchArray, line: string) => Key[] }

// Each rule's first capture group is the number. `expect` may return more
// than one acceptable count where the phrasing is shared ("94 entries" is the
// whole guide, "50 entries" the Secret Guide's own folio).
const RULES: Rule[] = [
  { name: 'N stops', re: /\b(\d+) stops\b/g, expect: () => ['core'] },
  { name: 'N of (the) N stops', re: /\b\d+ of (?:the )?(\d+) stops\b/g, expect: () => ['stops'] },
  { name: 'coordinate on N of N', re: /coordinate on (\d+) of/g, expect: () => ['coord'] },
  { name: 'Time budgets on N of N', re: /Time budgets on (\d+) of/g, expect: () => ['budget'] },
  { name: 'N (in-park) (day) hikes', re: /\b(\d+) (?:in-park )?(?:day )?hikes\b/g, expect: () => ['hikes'] },
  { name: 'N-entry Secret Guide', re: /\b(\d+)-entry Secret Guide/g, expect: () => ['secret'] },
  { name: 'N Secret Guide entries', re: /\b(\d+) Secret Guide entries/g, expect: () => ['secret'] },
  { name: 'N secret entries', re: /\b(\d+) secret entries/g, expect: () => ['secret'] },
  {
    name: 'N entries',
    re: /\b(\d+) entries\b/g,
    expect: (_m, line) => (/Quick ID/.test(line) ? ['wildlife'] : ['total', 'secret']),
  },
]

const errors: string[] = []
const hits = new Map<string, number>()

for (const rel of FILES) {
  const file = path.join(ROOT, rel)
  if (!fs.existsSync(file)) {
    errors.push(`${rel}: file not found (update FILES in check-sales-counts.ts)`)
    continue
  }
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (/^\s*alt:/.test(line)) return
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.re)) {
        // "65 of the 66 stops" also matches the plain "N stops" rule; the
        // specific rule owns it.
        if (rule.name === 'N stops' && /\bof (?:the )?$/.test(line.slice(0, m.index))) continue
        hits.set(rule.name, (hits.get(rule.name) ?? 0) + 1)
        const n = Number(m[1])
        const ok = rule.expect(m, line)
        if (!ok.some((k) => COUNTS[k] === n)) {
          const want = ok.map((k) => `${COUNTS[k]} (${k})`).join(' or ')
          errors.push(`${rel}:${i + 1}: "${m[0]}" should be ${want}`)
        }
      }
    }
  })
}

for (const rule of RULES) {
  if (!hits.get(rule.name)) errors.push(`rule "${rule.name}" matched nothing; the copy was reworded, so update RULES`)
}

if (errors.length) {
  console.error('check-sales-counts: the editorial copy disagrees with the Field Guide\'s content\n')
  for (const e of errors) console.error('  ' + e)
  console.error(`\nguide counts: ${JSON.stringify(COUNTS)}`)
  process.exit(1)
}

const total = [...hits.values()].reduce((a, b) => a + b, 0)
console.log(`check-sales-counts: ${total} printed counts match the guide (${COUNTS.core} stops, ${COUNTS.hikes} hikes, ${COUNTS.secret} Secret Guide, ${COUNTS.total} entries)`)
