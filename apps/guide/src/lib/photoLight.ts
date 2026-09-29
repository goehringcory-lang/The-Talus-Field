// Light advice labels and today's clock for a stop's photoTiming, shared by
// the stop card and the Secret Guide's entry page.

import type { SunTimes } from '../sun/solar'
import { formatClock } from '../utils/date'

// Display labels for PhotoTiming.best. Kept out of content/labels.ts: this
// is presentation only, not a fact about the stop.
export const PHOTO_TIMING_LABEL: Record<string, string> = {
  sunrise: 'sunrise',
  'golden-am': 'morning',
  sunset: 'sunset',
  'golden-pm': 'evening',
  night: 'after dark',
}

// Today's clock time for the window the advice names, from the on-device sun
// calculation. The schema forbids a hardcoded time in the advice itself for
// exactly this reason: "sunset" is a fact about the stop, "7:20 p.m." is a
// fact about today, and only the second one can be computed here.
export function lightClock(best: string, t: SunTimes): string | null {
  switch (best) {
    case 'sunrise':
      return formatClock(t.sunriseMin)
    case 'golden-am':
      return `until ${formatClock(t.goldenAmEndMin)}`
    case 'sunset':
      return formatClock(t.sunsetMin)
    case 'golden-pm':
      return `from ${formatClock(t.goldenPmStartMin)}`
    case 'night':
      return `after ${formatClock(t.sunsetMin)}`
    default:
      return null
  }
}
