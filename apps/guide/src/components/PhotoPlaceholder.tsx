/**
 * PhotoPlaceholder — shown when a stop has no photo wired up yet.
 *
 * Most field-guide stops don't have dedicated photography yet. Rather than
 * leaving a broken <img> or a blank gap, render a tasteful tile that signals
 * "intentionally pending." Voice matches the editorial site: dry, minimal, no
 * exclamation marks. Aspect ratio (4:3) matches a real stop photo so it
 * doesn't shift the layout when a real photo lands later.
 */
type Props = {
  className?: string
}

export default function PhotoPlaceholder({ className }: Props) {
  return (
    <div
      className={`stop-card__photo stop-card__photo--placeholder${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Photo coming"
      style={{
        aspectRatio: '4 / 3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'repeating-linear-gradient(135deg, var(--paper-2, #ece6da) 0 12px, var(--paper-3, #e2dccf) 12px 24px)',
        color: 'var(--ink-3, #6f6a5d)',
        fontFamily: 'var(--sans)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <span aria-hidden="true">Photo coming</span>
    </div>
  )
}
