// =============================================================================
// The field card: the buyer's log rendered as one shareable PNG, drawn on a
// canvas in the Surveyor style. It exists because the log is the guide's best
// word of mouth — a real record of a real trip, with the brand quietly on it —
// and a screenshot of a scrolling page never survives the crop.
//
// Drawn entirely on-device from state the log already computes; nothing is
// fetched and nothing leaves the phone until the reader taps share. The card
// always ships in the granite palette regardless of the reader's scheme: it
// is an artifact for other people's feeds, not a surface on the reader's
// ground, so it carries one deliberate face. Values are hardcoded from
// tokens.css's granite block; if that palette is retuned, retune this.
//
// Counting rules come from the caller (the same numbers /log renders), so the
// card can never disagree with the page it was made from.
// =============================================================================

const W = 1080
const H = 1350
const MARGIN = 84

// tokens.css granite palette, frozen for the artifact.
const C = {
  ground: '#1c1812',
  panel: '#252019',
  edge: '#3a3022',
  ink: '#f0e8d8',
  ink2: '#c8b898',
  ink3: '#a09070',
  gold: '#c09038',
}

const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace'
const SERIF = '"EB Garamond", Georgia, serif'

export type FieldCardStat = { label: string; value: string }

export type FieldCardMeter = { label: string; done: number; total: number }

export type FieldCardData = {
  /** "Jul 14–17, 2026" or null when the reader never set dates. */
  datesLabel: string | null
  /** The four headline readings, in render order. */
  stats: FieldCardStat[]
  /** One row per guide section: visited over total, drawn as a meter. */
  meters: FieldCardMeter[]
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, px: number) {
  // Shipped in every current engine; older ones ignore the assignment and
  // the card renders slightly tighter, which is fine.
  ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`
}

function loadMark(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const done = (ok: boolean) => resolve(ok ? img : null)
    img.onload = () => done(true)
    img.onerror = () => done(false)
    // The mark is precached with the shell, so this resolves offline; a
    // missing image just drops the lockup rather than failing the card.
    img.src = '/brand/mark-192.png'
    window.setTimeout(() => done(img.complete && img.naturalWidth > 0), 3000)
  })
}

async function ensureFonts() {
  if (typeof document === 'undefined' || !document.fonts?.load) return
  try {
    await Promise.allSettled([
      document.fonts.load(`700 148px ${SERIF}`),
      document.fonts.load(`italic 400 42px ${SERIF}`),
      document.fonts.load(`500 64px ${MONO}`),
      document.fonts.load(`400 24px ${MONO}`),
    ])
  } catch {
    /* system fallbacks are declared in every font stack */
  }
}

/** Render the card and hand back a PNG blob, or null when canvas is denied
 * (privacy modes): the caller's copy explains rather than throwing. */
export async function renderFieldCard(data: FieldCardData): Promise<Blob | null> {
  await ensureFonts()
  const mark = await loadMark()

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Ground
  ctx.fillStyle = C.ground
  ctx.fillRect(0, 0, W, H)

  // Masthead rule + line
  ctx.strokeStyle = C.edge
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(MARGIN, MARGIN)
  ctx.lineTo(W - MARGIN, MARGIN)
  ctx.stroke()

  ctx.textBaseline = 'alphabetic'
  setLetterSpacing(ctx, 6)
  ctx.font = `500 26px ${MONO}`
  ctx.fillStyle = C.ink2
  ctx.textAlign = 'left'
  ctx.fillText('THE TALUS FIELD', MARGIN, MARGIN + 52)
  ctx.fillStyle = C.gold
  ctx.textAlign = 'right'
  ctx.fillText('FIELD LOG', W - MARGIN, MARGIN + 52)
  setLetterSpacing(ctx, 0)

  // Title block
  ctx.textAlign = 'left'
  ctx.fillStyle = C.ink
  ctx.font = `700 148px ${SERIF}`
  ctx.fillText('Yosemite', MARGIN, MARGIN + 240)
  ctx.fillStyle = C.ink2
  ctx.font = `italic 400 42px ${SERIF}`
  ctx.fillText(
    data.datesLabel ? `A field record · ${data.datesLabel}` : 'A field record',
    MARGIN,
    MARGIN + 310,
  )

  // Stat panel: 2x2 readout grid with hairline dividers.
  const panelY = MARGIN + 372
  const panelH = 320
  const panelW = W - MARGIN * 2
  ctx.fillStyle = C.panel
  ctx.fillRect(MARGIN, panelY, panelW, panelH)
  ctx.strokeStyle = C.edge
  ctx.lineWidth = 2
  ctx.strokeRect(MARGIN, panelY, panelW, panelH)
  ctx.beginPath()
  ctx.moveTo(MARGIN + panelW / 2, panelY)
  ctx.lineTo(MARGIN + panelW / 2, panelY + panelH)
  ctx.moveTo(MARGIN, panelY + panelH / 2)
  ctx.lineTo(MARGIN + panelW, panelY + panelH / 2)
  ctx.stroke()

  data.stats.slice(0, 4).forEach((stat, i) => {
    const cx = MARGIN + (i % 2) * (panelW / 2) + 44
    const cy = panelY + Math.floor(i / 2) * (panelH / 2)
    setLetterSpacing(ctx, 4)
    ctx.font = `400 22px ${MONO}`
    ctx.fillStyle = C.ink3
    ctx.fillText(stat.label.toUpperCase(), cx, cy + 62)
    setLetterSpacing(ctx, 0)
    ctx.font = `500 64px ${MONO}`
    ctx.fillStyle = i === 0 ? C.gold : C.ink
    ctx.fillText(stat.value, cx, cy + 134)
  })

  // Section meters, the log's own anatomy: one row per guide section. Five
  // rows at 64px sit between the panel and the footer rule with air to spare;
  // a sixth section would need this rhythm re-measured.
  let y = panelY + panelH + 84
  for (const meter of data.meters) {
    setLetterSpacing(ctx, 3)
    ctx.font = `400 22px ${MONO}`
    ctx.fillStyle = C.ink2
    ctx.textAlign = 'left'
    ctx.fillText(meter.label.toUpperCase(), MARGIN, y)
    ctx.fillStyle = C.ink3
    ctx.textAlign = 'right'
    ctx.fillText(`${meter.done} OF ${meter.total}`, W - MARGIN, y)
    setLetterSpacing(ctx, 0)
    ctx.textAlign = 'left'

    // Segment meter, one segment per entry like the log page's .meter.
    const total = Math.max(1, meter.total)
    const gap = 6
    const segW = (panelW - gap * (total - 1)) / total
    const segY = y + 16
    for (let s = 0; s < total; s++) {
      ctx.fillStyle = s < meter.done ? C.gold : C.edge
      ctx.fillRect(MARGIN + s * (segW + gap), segY, segW, 10)
    }
    y += 64
  }

  // Footer: rule, the mark, the address.
  const footY = H - MARGIN - 76
  ctx.strokeStyle = C.edge
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(MARGIN, footY)
  ctx.lineTo(W - MARGIN, footY)
  ctx.stroke()
  if (mark) {
    const markH = 56
    const markW = (mark.naturalWidth / mark.naturalHeight) * markH
    ctx.drawImage(mark, MARGIN, footY + 24, markW, markH)
  }
  setLetterSpacing(ctx, 2)
  ctx.font = `400 24px ${MONO}`
  ctx.fillStyle = C.ink3
  ctx.textAlign = 'right'
  ctx.fillText('guide.thetalusfieldjournal.com', W - MARGIN, footY + 60)
  setLetterSpacing(ctx, 0)

  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    } catch {
      resolve(null)
    }
  })
}
