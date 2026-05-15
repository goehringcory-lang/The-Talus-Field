import { directionsUrl } from '../map/googleMaps'

type Props = {
  coord: [number, number] | undefined
  label: string
  mode?: 'view' | 'directions'
}

const isAppleMaps =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS Safari reports as Mac; treat touch-Macs as iOS for the maps:// scheme.
    (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1))

export default function MapsLink({ coord, label, mode = 'view' }: Props) {
  if (!coord) return null
  const [lng, lat] = coord
  // Directions mode always sends to Google Maps (which on phones with the
  // app + offline Yosemite area will route fully offline). Apple Maps lacks
  // that offline data, so we deliberately skip the maps:// branch here.
  const url =
    mode === 'directions'
      ? directionsUrl(coord)
      : isAppleMaps
        ? `maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
        : `https://maps.google.com/?q=${lat},${lng}`
  return (
    <a className="gps-chip" href={url} rel="noopener">
      {lat.toFixed(5)}, {lng.toFixed(5)} →
    </a>
  )
}
