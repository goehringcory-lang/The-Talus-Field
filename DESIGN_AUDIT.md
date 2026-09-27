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
| 5 | `/dates` | The fixed-windows table is long and flat. The head has no image. | "The year at a glance": a twelve-month strip plotting each fixed window as a band, a topo head, and the index. | done |
| 6 | `/checklist` | Seven lists with small eyebrows. It reads as one long form. | "Clipboard": a numbered index rail, list sections on ruled field-card panels, and a print-friendly layout that is unchanged in print. | done |
| 7 | `/about` | Flat prose under a good head. The five sections look identical. | "Colophon": numbered sections, a pull quote on the name, an editor card with the facts (twenty seasons, El Portal), and a ridge divider. | done |
| 8 | `/consult` | Prose after a strong head. "How it works" is a plain list. | "Three steps": the steps as a numbered timeline, "what it is" and "what it is not" as a two-column contrast, and a pull quote. | done |
| 9 | `/partners` | 6,800px of prose. Pricing sits in a boxed card mid-page. No image. | "Front desk": a lodge photo head, a facts strip (44 stops, 57 hikes, 18 months), "how it works" as a step timeline, what guests get as a two-column ruled list, the index, and the FAQ as a question-and-answer list with real headings (disclosures would have hidden the answers). | done |
| 10 | `/advertise` | Small text on a large empty head. The reasoning section is a paragraph wall. | "Listing card": a contour head with a card and a postmark, and the reasoning set beside a ledger of what it compares. | done |
| 11 | `/widget` | The preview card is empty when the API is down, so the head looks broken. | "Embed": a contour head, the preview's empty state drawn as an outline (no invented numbers), the snippet as a dark code card, and the index. | done |
| 12 | `/newsletter` | A big empty band under two thin columns ("Cadence", "Mail"). | "Postmark": the two notes as stamped field cards and a contour band. | done |
| 13 | `/contact` | A form and an aside with a lot of dead space. The head has no image. | "Letterhead": a topo head and the aside as a ruled card. | done |
| 14 | `/privacy`, `/terms`, `/affiliate` | A long numbered legal column with no navigation. | "Legal ledger": a sticky section index (they are the pages that most need it) and a last-updated field card. | done |

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
- **/dates** done. The reviewer caught: the resolved trip table crushed to a
  95px column on phones (both tables now stack into rows under 600px); the
  topo head's card floating at the top of the column (centred now); stamp
  text too small to read; the topo texture running behind the h1 when the
  head stacks (it moves under the card); tiny month labels and no January
  edge on the year strip; a single-day window drawn as a stray sliver (now a
  dot); an empty calendar column header (now a screen-reader label); and a
  pre-existing double period after "4 p.m." and "7 a.m." in the rules list.
- **/checklist** done. The reviewer caught: ticked boxes printing empty
  (browsers drop backgrounds in print; the tick now prints black); the
  "printable page" printing to five pages with half-blank sheets (now three,
  no forced breaks, tighter print rows, head card and essay list off paper);
  a card row repeating the print tip beside it; the index numbering 01 to 07
  against sheets labelled I to VII (the index now takes roman marks); and a
  completed sheet too quiet to notice.
- **/about** done. The reviewer caught: the ridge crowding the heading after
  it (kit-wide fix); pulls quoting the sentence beside them; no new visual
  under 1280px (a figure strip now opens the page); a sign-off that read as a
  pull quote; and 9px colophon type.
- **/consult** done. The reviewer caught: cramped, misaligned steps; a step
  split mid-sentence; the page ending with no way to book (the head's button
  now repeats under the steps); the same three facts printed five times (the
  strip leads with the naturalist instead of the price); tablet alignment of
  the strip.
- **/privacy, /terms, /affiliate** done. The reviewer caught: the stacked
  card pushed right at tablet widths; no breadcrumbs (the legal routes were
  rendered without `go`; app.jsx now passes it); the update date twice in the
  phone head (the card is off on phones); "Sections" printed three times; a
  stamp that carried no fact (it now reads the revision date); and
  /affiliate's unnumbered headings getting the numbered pages' plain index
  (it now takes the kit's numerals).
- **/partners, /advertise, /widget, /newsletter, /contact** done. The
  reviewer caught: a 24px horizontal scroll on /newsletter at 768 and 1024
  (the contour band's bleed), and the live widget's own forecast line
  overflowing /widget once the API answered (now contained); the Copy
  button's rust focus ring invisible on the dark code card (gold now); the
  snippet clipped on phones with no keyboard scroll (it wraps, and is a
  focusable region); an orphan tick in a two-column list; 9px fine print; the
  pricing card's body weaker than the prose around it; Q and A questions
  invisible to heading navigation (now h3s); the /advertise argument quieter
  than its own summary; the preview card off-kit and its heading lost; the
  newsletter form with no visible label and an h1-to-h3 jump; a hard-cut
  contour band; small letterhead labels, a 50px gap between stacked fields,
  and a textarea whose top line clipped on phones.
- **Final cross-page review.** No regressions: /, /planning, /conditions,
  /guide, /firefall, /start-here, /stay, /articles and an article diffed at 0
  changed bytes against origin/main (bar lazy-image timing noise), and the
  archive and /films at 0. It caught: the live widget still widening the
  /widget head at 390 once the API answered, and clipping its forecast mid-word
  (the head column can no longer grow, and the embed wraps); the /contact
  address spilling out of its card near 768 (it wraps, and now sits in a head
  card, which also fills the one empty head); head-card rows stacking on phones
  for plain heads but not photo heads (one behaviour now); four charts on four
  paddings and type scales, only one titled, and rust meaning measured data in
  one and "typical" in the others (one frame, one scale, a title each, ink for
  measured data); /consult the one head off-system (now a contour head with a
  head card that stacks under 1100px); two index numbering styles on the legal
  pages (numbered headings now lend their number to the index); an 88px head
  foot on heads with nothing overlapping; two title sizes on card grids; and
  ISO dates in stamps beside long-form ones.

All flagged pages done.
