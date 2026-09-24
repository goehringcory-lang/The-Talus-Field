// The bookmark for anything that is not a stop: a hike or a dining venue.
// Saves ride the same `tfg.favorites` list as stops (so sync carries them with
// no schema change), under a prefix, because some hike ids repeat stop ids
// (taft-point, sentinel-dome, may-lake) and the two must not share a star.

import { useFavorites } from '../lib/favorites'

type SaveKind = 'hike' | 'dining'

export default function SaveButton({ kind, id, title }: { kind: SaveKind; id: string; title: string }) {
  const { toggle, isFavorite } = useFavorites()
  const key = `${kind}:${id}`
  const saved = isFavorite(key)
  return (
    <button
      type="button"
      className="fav-toggle"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      title={saved ? 'Saved' : 'Save'}
      onClick={() => toggle(key)}
    >
      <svg className="fav-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  )
}
