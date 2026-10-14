// =============================================================================
// LETTERS — the most recent Sunday Field Notes, read from Buttondown's public
// RSS feed, so every signup unit on the editorial site can show a reader the
// letter they are signing up for instead of describing it.
//
// The feed is public (the archive at buttondown.com/goehring/archive is), so
// no key is involved. Parsed with plain string matching: the feed is
// Buttondown's own, flat RSS 2.0, and a Worker has no XML DOM.
//
// Only links into the newsletter's own archive survive the parse, so nothing
// in the feed can put an arbitrary URL on the site. Never an error: a dead
// feed serves the last good copy, and with none, an empty list the page
// renders as nothing.
// =============================================================================

import { z } from 'zod'
import type { Env } from '../env'

const FEED_URL = 'https://buttondown.com/goehring/rss'
const ARCHIVE_PREFIX = 'https://buttondown.com/goehring/archive/'
const MAX_LETTERS = 5
const EXCERPT_MAX = 220

export const Letter = z.object({
  title: z.string(),
  url: z.string(),
  date: z.string().nullable(), // ISO, from the item's pubDate
  excerpt: z.string(),
})
export type LetterT = z.infer<typeof Letter>

export const LettersRecord = z.object({
  fetchedAt: z.string(),
  letters: z.array(Letter),
})
export type LettersRecordT = z.infer<typeof LettersRecord>

// ── KV layout (GUIDE_PROGRAMS: the "guide data cache, safe to lose" bucket) ──
// letters:v1 → LettersRecordT
const LETTERS_KEY = 'letters:v1'
const FRESH_MS = 60 * 60 * 1000

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m
    }
    return ENTITIES[code.toLowerCase()] ?? m
  })
}

function unwrap(s: string): string {
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(s)
  return cdata ? cdata[1] : s
}

function tagText(item: string, tag: string): string {
  const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`).exec(item)
  return m ? unwrap(m[1]) : ''
}

// The description is entity-escaped HTML. Decode once to get the markup, drop
// the tags, decode again for the text's own entities, then cut at a word.
export function excerptFrom(descriptionHtml: string): string {
  const markup = decodeEntities(descriptionHtml)
  // Block tags end a run of text; inline ones (a link, an italic species
  // name) sit inside a sentence and must not leave a space behind.
  const stripped = markup
    .replace(/<\/?(p|br|div|li|ul|ol|h[1-6]|blockquote|figure|figcaption|img|hr)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
  const text = decodeEntities(stripped).replace(/\s+/g, ' ').trim()
  if (text.length <= EXCERPT_MAX) return text
  const cut = text.slice(0, EXCERPT_MAX)
  const space = cut.lastIndexOf(' ')
  return `${(space > 120 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`
}

export function parseLetters(xml: string): LetterT[] {
  const out: LetterT[] = []
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = m[1]
    const title = decodeEntities(tagText(item, 'title')).replace(/\s+/g, ' ').trim()
    const url = decodeEntities(tagText(item, 'link')).trim()
    if (!title || !url.startsWith(ARCHIVE_PREFIX)) continue
    const when = Date.parse(tagText(item, 'pubDate').trim())
    out.push({
      title,
      url,
      date: Number.isFinite(when) ? new Date(when).toISOString() : null,
      excerpt: excerptFrom(tagText(item, 'description')),
    })
    if (out.length >= MAX_LETTERS) break
  }
  return out
}

async function readRecord(env: Env): Promise<LettersRecordT | null> {
  const raw = await env.GUIDE_PROGRAMS.get(LETTERS_KEY)
  if (!raw) return null
  try {
    const parsed = LettersRecord.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function refreshLetters(env: Env): Promise<LettersRecordT | null> {
  const res = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'TheTalusField/1.0 (thetalusfieldjournal.com)', Accept: 'application/rss+xml, application/xml' },
  })
  if (!res.ok) throw new Error(`letters feed ${res.status}`)
  const letters = parseLetters(await res.text())
  // An empty parse of a 200 is a format change, not "no letters": keep the
  // last good copy rather than blanking every signup unit on the site.
  if (letters.length === 0) throw new Error('letters feed parsed to nothing')
  const record: LettersRecordT = { fetchedAt: new Date().toISOString(), letters }
  await env.GUIDE_PROGRAMS.put(LETTERS_KEY, JSON.stringify(record))
  return record
}

export async function getLetters(env: Env): Promise<LettersRecordT | null> {
  const cached = await readRecord(env)
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < FRESH_MS) return cached
  try {
    return await refreshLetters(env)
  } catch (err) {
    console.error('getLetters: refresh failed, serving stale', err)
    return cached
  }
}
