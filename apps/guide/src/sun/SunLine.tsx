// =============================================================================
// One-line sun schedule for a park-local date: sunrise, the golden-hour
// windows, sunset. Computed on-device (sun/solar.ts), so unlike weather it is
// never stale and never absent offline. Shared by /today and WeatherStrip.
// The times are flat-horizon: canyon walls hold the valley floor in shade
// longer, which the surrounding copy should say once, not this line.
// =============================================================================

import { formatClock } from '../utils/date'
import { sunTimes } from './solar'

export default function SunLine({ dateIso }: { dateIso: string }) {
  const times = sunTimes(dateIso)
  if (!times) return null
  return (
    <p className="sun-line">
      <span className="sun-line__muted">Sunrise </span>
      {formatClock(times.sunriseMin)}
      <span className="sun-line__muted"> · golden light until </span>
      {formatClock(times.goldenAmEndMin)}
      <span className="sun-line__muted"> · golden light from </span>
      {formatClock(times.goldenPmStartMin)}
      <span className="sun-line__muted"> · sunset </span>
      {formatClock(times.sunsetMin)}
    </p>
  )
}
