// The word on an entrance's reading. Colour is never the only carrier of a
// wait's weight: the figure sits beside "Short", "Moderate" or "Long", and the
// long ones are the ones drawn in the alert colour. The long line is the one
// the front page has always used for that (30 minutes).

export const LONG_WAIT_MIN = 30
const SHORT_WAIT_MIN = 5

export type WaitWord = 'Short' | 'Moderate' | 'Long'

export function waitWord(minutes: number): WaitWord {
  if (minutes >= LONG_WAIT_MIN) return 'Long'
  if (minutes <= SHORT_WAIT_MIN) return 'Short'
  return 'Moderate'
}

// Highway each gate sits on, from the name the NPS feed gives it. A gate the
// table does not know prints no highway rather than a guess.
const GATE_HIGHWAY: [RegExp, string][] = [
  [/arch rock/i, 'Hwy 140'],
  [/south/i, 'Hwy 41'],
  [/big oak/i, 'Hwy 120'],
  [/tioga/i, 'Hwy 120 East'],
  [/hetch/i, 'Evergreen Rd'],
]

export function gateHighway(name: string): string | null {
  for (const [re, hwy] of GATE_HIGHWAY) if (re.test(name)) return hwy
  return null
}

/** "South Entrance" reads as "South" under a column of three. */
export function gateName(name: string): string {
  return name.replace(/\s+entrance(\s+station)?$/i, '').trim() || name
}
