# Design audit: the text pages (September 2026)

Branch `design/text-page-redesigns`. The September 2026 rollout (`DESIGN-ROLLOUT.md`)
moved every page onto the homepage's palette, type and shell. This pass takes
the next step for the pages that are still, in practice, a heading over a
single centred column of prose. They are on-palette but visually flat next to
the homepage, which runs on photo plates, split heads, a dark product band,
ruled lists and tracked eyebrows.

**Out of bounds, by rule:** the Yosemite Nature Notes archive (`/archive/**`,
`nature-notes/`, `archive/archive.css`, `scripts/gen-archive.mjs`) and the
NPS Nature Notes film pages (`/films`, `page-films.jsx`, `videos-data.js`).
The archive links `/styles.css`, so every rule this pass adds is new and
scoped to new classes. No existing selector is edited. The archive is
screenshot-diffed before and after.

**Content rule:** no copy is rewritten. New elements (fact strips, pull
quotes, charts) restate figures and sentences the page already prints. Pull
quotes are `aria-hidden`, so screen readers do not hear them twice.

## The shared kit (components.jsx + styles.css, `fj-` prefix)

The "field journal" layer, built once and used on every page below:

- **`FjLayout`**: the reading column with a sticky, numbered section index
  on the left from 1100px, built at runtime from the column's `h2`s. It adds
  scroll-spy and gives each h2 an id if it lacks one. Under 1100px the index
  becomes an "On this page" disclosure above the text.
- **Numbered sections**: `.fj-numbered` sets a tracked accent numeral
  ("01", "02") over each prose h2 with a CSS counter. It is presentation
  only, so the DOM text is unchanged.
- **`FjFacts`**: a ruled strip of large serif figures with tracked labels,
  in the homepage's utility-row language. It comes in a light and a dark
  (`ink`) tone.
- **`FjPull`**: a pull quote, set in serif italic with a rust rule.
- **`FjRidge`**: an illustrated divider, an inline SVG ridgeline (Half
  Dome's profile) drawn in the rule colour.
- **`.fj-topo`**: a contour-line texture for page heads without a photo, an
  inline SVG data URI of a few KB.
- **`FjCard`**: the "field card", a ruled index card for a head's aside,
  with a stamp-like eyebrow and rows of label and value.

## Pages, in traffic order

Already on the full homepage design and not flagged: `/` (the source of
truth), `/planning`, `/conditions`, `/guide` (PR #413), `/start-here`, `/stay`,
`/firefall` (#459), `/now`, `/map`. Listing and index pages built from cards
(`/articles`, `/section/*`, `/search`, `/explore`, `/itineraries`,
`/webcams`, `/places`) and `/kit` (a tabbed product list) are not text
pages and are not flagged.

| # | Page | What is wrong visually | Concept | Status |
|---|---|---|---|---|
| 1 | `/half-dome-lottery` | 8,700px of prose in one 680px column, and the one data table is a single dense row. The head has no image. It is the heaviest page on the site. | "The permit ledger": a split head with the Half Dome photo and a field card of the season's key facts, the numbered section index, the odds drawn as bars (preseason and daily, weekday and weekend), the two lotteries as side-by-side cards, a pull quote, and a ridge divider before the fine print. | done |
| 2 | `/tioga-opening` | A long prose column, and the opening-date table has two rows. No image. | "The snow line": a Tuolumne photo head and a field card, a year strip showing where the 2026 opening and the long-term average fall between May and June, the section index, and the four self-sufficiency rules as a numbered card grid. | done |
| 3 | `/international` | A long column. The fee table is dense. No image. | "Passport stamp": a Tunnel View head with a card of the fees and a round postmark, the eight differences as a card grid, the fee table fitted to a phone, and the index. (The price ladder was dropped: the calculator already draws that comparison.) | done |
| 4 | `/distances` | The drive table is the only visual, and it is plain. No image. | "Road log": drive times from each town drawn as bars on one scale, a winding-road head with a field card, and the index. | done |
| 5 | `/dates` | The fixed-windows table is long and flat. The head has no image. | "The year at a glance": a twelve-month strip plotting each fixed window as a band, a topo head, and the index. | todo |
| 6 | `/checklist` | Seven lists with small eyebrows. It reads as one long form. | "Clipboard": a numbered index rail, list sections on ruled field-card panels, and a print-friendly layout that is unchanged in print. | todo |
| 7 | `/about` | Flat prose under a good head. The five sections look identical. | "Colophon": numbered sections, a pull quote on the name, an editor card with the facts (twenty seasons, El Portal), and a ridge divider. | todo |
| 8 | `/consult` | Prose after a strong head. "How it works" is a plain list. | "Three steps": the steps as a numbered timeline, "what it is" and "what it is not" as a two-column contrast, and a pull quote. | todo |
| 9 | `/partners` | 6,800px of prose. Pricing sits in a boxed card mid-page. No image. | "Front desk": a lodge photo head, a facts strip (44 stops, 57 hikes, 18 months), "how it works" as a step timeline, what guests get as a two-column ruled list, the index, and the FAQ as disclosures. | todo |
| 10 | `/advertise` | Small text on a large empty head. The reasoning section is a paragraph wall. | "Listing card": a topo head with a card, the index, and a pull quote. | todo |
| 11 | `/widget` | The preview card is empty when the API is down, so the head looks broken. | "Embed": a topo head, a mock preview drawn in markup as the no-data state, and the install steps numbered. | todo |
| 12 | `/newsletter` | A big empty band under two thin columns ("Cadence", "Mail"). | "Postmark": the two notes as stamped field cards and a contour band. | todo |
| 13 | `/contact` | A form and an aside with a lot of dead space. The head has no image. | "Letterhead": a topo head and the aside as a ruled card. | todo |
| 14 | `/privacy`, `/terms`, `/affiliate` | A long numbered legal column with no navigation. | "Legal ledger": a sticky numbered index (they are the pages that most need it) and a last-updated field card. | todo |

## Progress log

- Worktree `../talus-redesign` from `origin/main` (404e1a27). Baseline
  screenshots of every route and of the archive were taken before any edit.
- **/half-dome-lottery** done. The reviewer caught: aside links reading as
  plain text; the head card covering the photo at 768 (now stacked under
  1100px); index numerals failing contrast at 70% opacity; the index focus
  ring clipped by its scroll box; an empty grid cell growing the active index
  row; double rules at the TOC and after the numbered list; a dead right
  margin (the column now sits closer to centre and the page hangs two margin
  pulls); a lone ridge that read as an accident (now two, at act breaks);
  serif lead phrases set inline with sans text; small caption type; no scroll
  cue on the phone table (now an edge fade); and an all-caps eyebrow in the
  source. The archive pixel-diffed at 0 changed pixels.
- **/tioga-opening** done. The reviewer caught: the strip's "June 1" label
  sitting off its date (now placed at 51.67%); 8px strip labels (now 10px);
  strip labels that would overprint as years are added (alternating tick
  heights, edge labels hang inward); card numerals inside a numbered section
  reading as a second sequence (card grids now carry none, site-wide); a
  side pull quote landing before its setup under 1280px (side pulls now show
  only where they hang in the margin); the live status chip invisible to
  heading navigation (now an h3 labelling its section); a wrapping card
  label and a squeezed plate caption.
- **/international** done. The reviewer caught: the postmark stamp pushing
  the page 1px wide at 768 and 1024 and covering the photo credit (it now
  sits inside the card's corner); stamp text breaking mid-line; card labels
  wrapping while values had room (rows now share one column grid); a margin
  pull that read as a repeat on phones; a fee table fade that never cleared
  (the three-column table now fits a phone outright); card numerals on an
  unordered list; the calculator note cramped under its results; a cramped
  split head at 768 (heads now stack below 1100px).
- **/distances** done. The reviewer caught: a gridline cutting through a
  chart label; the Lee Vining bar reading as "90 to 120" (it now fades out,
  labelled before the bar); phone labels running past the track (late bars
  label on their left); a pull quote repeating the bold lead beside it;
  colons left on the card titles; units wrapping in the table; tick labels
  off their gridlines; 8px chart text; and the tablet head card stretched
  full width (now a 520px card overlapping the photo, caption beside it).
