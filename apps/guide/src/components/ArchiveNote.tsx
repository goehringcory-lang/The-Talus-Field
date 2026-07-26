import type { ArchiveNoteT } from '../content'
import { archiveIssueLabel, archiveIssueUrl } from '../content'

// One sourced note from the Yosemite Nature Notes archive, rendered under the
// stop body. It is deliberately quiet: this is context, not instruction, and
// nothing in it should compete with the part of the page that tells a reader
// where to park. The citation is a link out to the editorial site's archive,
// which does not work offline — the note itself is bundled, so the fact
// survives; only the source needs the network.
export default function ArchiveNote({ note }: { note: ArchiveNoteT }) {
  return (
    <aside className="archive-note">
      <span className="archive-note__label">From the archive</span>
      <p className="archive-note__body">{note.note}</p>
      <p className="archive-note__cite">
        <a href={archiveIssueUrl(note)} target="_blank" rel="noopener noreferrer">
          Yosemite Nature Notes, {archiveIssueLabel(note)} ↗
        </a>
      </p>
    </aside>
  )
}
