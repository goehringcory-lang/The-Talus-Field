import { isIOS } from '../utils/platform'

type Props = {
  coord: [number, number] | undefined
  label: string
}

export default function MapsLink({ coord, label }: Props) {
  if (!coord) return null
  const [lng, lat] = coord
  // View-a-pin link. iOS devices get the maps:// scheme (iPadOS Safari
  // reports as Mac, which isIOS() accounts for); everyone else gets Google
  // Maps. Turn-by-turn directions live on the map page via kinds.ts.
  const preferAppleMaps = isIOS()
  const url = preferAppleMaps
    ? `maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
    : `https://maps.google.com/?q=${lat},${lng}`
  return (
    <a className="chip chip--gps" href={url} rel="noopener">
      {lat.toFixed(5)}, {lng.toFixed(5)} →
    </a>
  )
}
