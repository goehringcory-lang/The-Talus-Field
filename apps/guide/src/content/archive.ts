// =============================================================================
// Links into the Nature Notes archive.
//
// The archive is 512 issues of the National Park Service's "Yosemite Nature
// Notes" bulletin, 1922 onward, transcribed and published as static pages on
// the editorial site. It does NOT live in this app: the pages are real files
// on thetalusfieldjournal.com, so these links leave the PWA and will not open
// offline. That is a deliberate trade. The note itself is bundled and always
// readable; only the source, which is a citation and not the content, needs
// the network.
//
// URL shape is set by scripts/gen-archive.mjs and must match it exactly:
//   /archive/<year>/vol-<volume>-no-<number>/
// The year comes off the end of `issueDate` — the schema requires it to be
// there — so the label a reader sees and the page they land on are built from
// the same string and cannot disagree.
// =============================================================================

import type { ArchiveNoteT } from './schema'

export const ARCHIVE_ORIGIN = 'https://thetalusfieldjournal.com'

export const ARCHIVE_INDEX_URL = `${ARCHIVE_ORIGIN}/archive/`

export function archiveIssueUrl(ref: ArchiveNoteT): string {
  const year = ref.issueDate.slice(-4)
  return `${ARCHIVE_ORIGIN}/archive/${year}/vol-${ref.volume}-no-${ref.number}/`
}

// "Volume 22, Number 10 · October 1943"
export function archiveIssueLabel(ref: ArchiveNoteT): string {
  return `Volume ${ref.volume}, Number ${ref.number} · ${ref.issueDate}`
}
