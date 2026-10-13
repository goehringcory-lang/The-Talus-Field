// Markdown → one plain paragraph, for surfaces that show a preview of a body
// instead of rendering it (the swipe deck's cards). Deliberately small: the
// bodies are hand-written prose with links, emphasis, and the occasional
// heading, not arbitrary markdown.

export function plainSummary(markdown: string, maxChars = 260): string {
  const firstProse = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    // Skip headings, list blocks, and blockquotes: a card wants a sentence.
    .find((block) => block.length > 0 && !/^(#{1,6}\s|[-*+]\s|>\s|\d+\.\s)/.test(block))

  if (!firstProse) return ''

  const text = firstProse
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')          // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')       // links → their text
    .replace(/[*_`]/g, '')                          // emphasis / code marks
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxChars) return text
  // Cut on a word boundary, never mid-word.
  const cut = text.slice(0, maxChars)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,;:]$/, '')}…`
}

// "209/372-0200" broke at its hyphen on a phone ("209/372- / 0200"). Swap
// the hyphen inside a printed phone number for a non-breaking one (U+2011)
// at render time; the content files keep plain hyphens, which the fact
// audit's searches match, and tel: links carry their own digits.
export function glueNumbers(text: string): string {
  return text.replace(/\b(\d{3})([/ .-])(\d{3})-(\d{4})\b/g, (_, a: string, sep: string, b: string, c: string) =>
    `${a}${sep === '-' ? '\u2011' : sep}${b}\u2011${c}`,
  )
}
