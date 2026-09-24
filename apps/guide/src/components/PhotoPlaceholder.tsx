/**
 * PhotoPlaceholder — shown when a stop has no photo wired up yet.
 *
 * Most field-guide stops don't have dedicated photography yet. Rather than
 * leaving a broken <img> or a blank gap, render a photogravure-hatched tile
 * that signals "intentionally pending." Voice matches the editorial site:
 * dry, minimal, no exclamation marks. Aspect ratio (4:3) matches a real stop
 * photo so it doesn't shift the layout when a real photo lands later.
 */
type Props = {
  className?: string
  // 'offline': the entry has a photo, but this phone has no copy and no
  // signal to fetch one. Saying "Photo coming" there told a buyer in
  // airplane mode that paid content did not exist.
  variant?: 'pending' | 'offline'
}

export default function PhotoPlaceholder({ className, variant = 'pending' }: Props) {
  const label =
    variant === 'offline' ? 'Photo not downloaded to this phone. Account, Offline downloads' : 'Photo coming'
  return (
    <div
      className={`photo-placeholder${variant === 'offline' ? ' photo-placeholder--offline' : ''}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true">
        {variant === 'offline' ? (
          <>
            Not downloaded to this phone
            <br />
            Account › Offline
          </>
        ) : (
          'Photo coming'
        )}
      </span>
    </div>
  )
}
