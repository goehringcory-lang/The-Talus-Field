import { isIOS } from '../utils/platform'

type Props = {
  coord: [number, number] | undefined
  label: string
  // 'chip' is the inline meta-row pill; 'spec' is the same link as one cell of
  // the full read's spec strip; 'plate' is the same link set over the foot of
  // a deck card's photo, the way the full read's plate prints its position.
  // All share the URL logic below, which is the part that must not be
  // duplicated.
  variant?: 'chip' | 'spec' | 'plate'
}

export default function MapsLink({ coord, label, variant = 'chip' }: Props) {
  if (!coord) return null
  const [lng, lat] = coord
  // View-a-pin link. iOS devices get the maps:// scheme (iPadOS Safari
  // reports as Mac, which isIOS() accounts for); everyone else gets Google
  // Maps. Turn-by-turn directions live on the map page via kinds.ts.
  const preferAppleMaps = isIOS()
  const url = preferAppleMaps
    ? `maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
    : `https://maps.google.com/?q=${lat},${lng}`
  // target="_blank" only for the web URL: it would otherwise navigate the
  // installed PWA window away to Google Maps. The maps:// scheme launches the
  // app directly and a _blank there can strand an empty Safari tab.
  if (variant === 'spec') {
    return (
      <a
        className="spec"
        href={url}
        target={preferAppleMaps ? undefined : '_blank'}
        rel="noreferrer"
      >
        <span className="spec__label">GPS</span>
        <span className="spec__value">
          {lat.toFixed(4)} N
          <br />
          {Math.abs(lng).toFixed(4)} W →
        </span>
      </a>
    )
  }

  if (variant === 'plate') {
    return (
      <a
        className="deck-card__pin"
        href={url}
        target={preferAppleMaps ? undefined : '_blank'}
        rel="noreferrer"
        aria-label={`Open ${label} in Maps, ${lat.toFixed(4)} north, ${Math.abs(lng).toFixed(4)} west`}
      >
        {lat.toFixed(4)} N · {Math.abs(lng).toFixed(4)} W →
      </a>
    )
  }

  return (
    <a
      className="chip chip--gps"
      href={url}
      target={preferAppleMaps ? undefined : '_blank'}
      rel="noreferrer"
    >
      {lat.toFixed(5)}, {lng.toFixed(5)} →
    </a>
  )
}
