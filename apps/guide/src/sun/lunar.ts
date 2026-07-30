// =============================================================================
// Moon phase for arbitrary dates, computed on-device like solar.ts: no API,
// no dependency, works in airplane mode. This is the standard Meeus
// phase-instant series (Astronomical Algorithms ch. 49), the same algorithm
// that produced the verified FULL_MOONS table in content/seasonal.ts, which
// makes that table a built-in correctness oracle: every full-moon instant
// this module computes for July 2026 through December 2028 must match it to
// the minute (checked at authoring time; see the Phase 2 commit).
//
// What the guide needs from the moon is reader copy, not an ephemeris:
// tonight's phase name and percent lit, and the next full and new moons for
// the sky calendar. Illumination is derived from the position in the
// new-to-new cycle, good to a few percent, which is more precision than
// "waxing gibbous, 82% lit" spends. JDE here is dynamical time; the ~70
// second offset from UT is far below the minute we round to.
// =============================================================================

const PACIFIC = 'America/Los_Angeles'
const RAD = Math.PI / 180
const SYNODIC_DAYS = 29.530588861

export type MoonPhaseName =
  | 'new moon'
  | 'waxing crescent'
  | 'first quarter'
  | 'waxing gibbous'
  | 'full moon'
  | 'waning gibbous'
  | 'last quarter'
  | 'waning crescent'

export type PhaseInstant = {
  dateIso: string // park-local calendar date, YYYY-MM-DD
  timeLabel: string // "7:35 a.m.", the FULL_MOONS dialect
  epochMs: number
}

export type MoonInfo = {
  illumination: number // fraction lit in the evening, 0..1
  phaseName: MoonPhaseName
  nextFull: PhaseInstant
  nextNew: PhaseInstant
}

function sinDeg(deg: number): number {
  return Math.sin(deg * RAD)
}

// Meeus ch. 49: JDE of the true new moon (phase = 0) or full moon
// (phase = 0.5) for series index k (k = 0 is the new moon of 2000-01-06).
function truePhaseJde(k: number, phase: 0 | 0.5): number {
  const kk = k + phase
  const T = kk / 1236.85
  let jde =
    2451550.09766 +
    29.530588861 * kk +
    0.00015437 * T * T -
    0.00000015 * T * T * T +
    0.00000000073 * T * T * T * T
  const E = 1 - 0.002516 * T - 0.0000074 * T * T
  const M = 2.5534 + 29.1053567 * kk - 0.0000014 * T * T - 0.00000011 * T * T * T
  const Mp =
    201.5643 +
    385.81693528 * kk +
    0.0107582 * T * T +
    0.00001238 * T * T * T -
    0.000000058 * T * T * T * T
  const F =
    160.7108 +
    390.67050284 * kk -
    0.0016118 * T * T -
    0.00000227 * T * T * T +
    0.000000011 * T * T * T * T
  const Om = 124.7746 - 1.56375588 * kk + 0.0020672 * T * T + 0.00000215 * T * T * T

  // First coefficients differ between new and full; the tail is shared.
  const c = phase === 0
    ? { a: -0.4072, b: 0.17241, c2: 0.01608, d: 0.01039, e: 0.00739, f: -0.00514, g: 0.00208 }
    : { a: -0.40614, b: 0.17302, c2: 0.01614, d: 0.01043, e: 0.00734, f: -0.00515, g: 0.00209 }

  jde +=
    c.a * sinDeg(Mp) +
    c.b * E * sinDeg(M) +
    c.c2 * sinDeg(2 * Mp) +
    c.d * sinDeg(2 * F) +
    c.e * E * sinDeg(Mp - M) +
    c.f * E * sinDeg(Mp + M) +
    c.g * E * E * sinDeg(2 * M) -
    0.00111 * sinDeg(Mp - 2 * F) -
    0.00057 * sinDeg(Mp + 2 * F) +
    0.00056 * E * sinDeg(2 * Mp + M) -
    0.00042 * sinDeg(3 * Mp) +
    0.00042 * E * sinDeg(M + 2 * F) +
    0.00038 * E * sinDeg(M - 2 * F) -
    0.00024 * E * sinDeg(2 * Mp - M) -
    0.00017 * sinDeg(Om) -
    0.00007 * sinDeg(Mp + 2 * M) +
    0.00004 * sinDeg(2 * Mp - 2 * F) +
    0.00004 * sinDeg(3 * M) +
    0.00003 * sinDeg(Mp + M - 2 * F) +
    0.00003 * sinDeg(2 * Mp + 2 * F) -
    0.00003 * sinDeg(Mp + M + 2 * F) +
    0.00003 * sinDeg(Mp - M + 2 * F) -
    0.00002 * sinDeg(Mp - M - 2 * F) -
    0.00002 * sinDeg(3 * Mp + M) +
    0.00002 * sinDeg(4 * Mp)

  // Planetary corrections (the A-series), same for every phase.
  const A = [
    [299.77 + 0.107408 * kk - 0.009173 * T * T, 0.000325],
    [251.88 + 0.016321 * kk, 0.000165],
    [251.83 + 26.651886 * kk, 0.000164],
    [349.42 + 36.412478 * kk, 0.000126],
    [84.66 + 18.206239 * kk, 0.00011],
    [141.74 + 53.303771 * kk, 0.000062],
    [207.14 + 2.453732 * kk, 0.00006],
    [154.84 + 7.30686 * kk, 0.000056],
    [34.52 + 27.261239 * kk, 0.000047],
    [207.19 + 0.121824 * kk, 0.000042],
    [291.34 + 1.844379 * kk, 0.00004],
    [161.72 + 24.198154 * kk, 0.000037],
    [239.56 + 25.513099 * kk, 0.000035],
    [331.55 + 3.592518 * kk, 0.000023],
  ] as const
  for (const [arg, coeff] of A) jde += coeff * sinDeg(arg)

  return jde
}

// JDE is dynamical time (TT); civil time lags it by delta-T, ~69 seconds
// across this almanac's 2026-2028 span. Without this the whole series runs
// one to two minutes late against the verified FULL_MOONS table.
const DELTA_T_MS = 69_000

function jdeToEpochMs(jde: number): number {
  return (jde - 2440587.5) * 86_400_000 - DELTA_T_MS
}

function newMoonMs(k: number): number {
  return jdeToEpochMs(truePhaseJde(k, 0))
}

function fullMoonMs(k: number): number {
  return jdeToEpochMs(truePhaseJde(k, 0.5))
}

function pacificParts(epochMs: number): { dateIso: string; timeLabel: string } {
  const dateIso = new Intl.DateTimeFormat('en-CA', {
    timeZone: PACIFIC,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(epochMs)
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: PACIFIC,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(epochMs)
  // "7:35 PM" -> "7:35 p.m.", the FULL_MOONS dialect.
  const timeLabel = time
    .replace(' ', ' ')
    .replace(/ (AM|PM)$/, (m) => (m.trim() === 'AM' ? ' a.m.' : ' p.m.'))
  return { dateIso, timeLabel }
}

function instantOf(epochMs: number): PhaseInstant {
  return { ...pacificParts(epochMs), epochMs }
}

// Series index of the new moon at or before the given time.
function kBefore(epochMs: number): number {
  // Mean-cycle guess, then correct against the true instants; the true new
  // moon can land up to ~0.6 days off the mean, so walk until bracketed.
  let k = Math.floor((epochMs - jdeToEpochMs(2451550.09766)) / (SYNODIC_DAYS * 86_400_000))
  while (newMoonMs(k + 1) <= epochMs) k++
  while (newMoonMs(k) > epochMs) k--
  return k
}

// How long the moon "looks" full or new to a reader: about a day either
// side of the true instant. Named from proximity to the true instants, not
// from the cycle fraction, because orbital eccentricity puts the true full
// moon up to ten hours off the middle of the new-to-new interval and a
// fraction-based name calls the full moon's own evening "waning gibbous".
const NEAR_PHASE_MS = 0.9 * 86_400_000

function phaseNameOf(
  eveningMs: number,
  prevNew: number,
  nextNew: number,
  fullThisCycle: number,
  illumination: number,
): MoonPhaseName {
  const nearestNew = eveningMs - prevNew < nextNew - eveningMs ? prevNew : nextNew
  if (Math.abs(eveningMs - nearestNew) < NEAR_PHASE_MS) return 'new moon'
  if (Math.abs(eveningMs - fullThisCycle) < NEAR_PHASE_MS) return 'full moon'
  const waxing = eveningMs < fullThisCycle
  if (illumination < 0.4) return waxing ? 'waxing crescent' : 'waning crescent'
  if (illumination <= 0.6) return waxing ? 'first quarter' : 'last quarter'
  return waxing ? 'waxing gibbous' : 'waning gibbous'
}

/**
 * The moon on the evening of `dateIso` (park-local), for stargazing copy.
 * The anchor is 21:00 park-local, computed with a fixed 7.5-hour offset
 * rather than a timezone lookup: a half-hour of DST slop moves illumination
 * by well under a percent.
 */
export function moonInfo(dateIso: string): MoonInfo {
  const eveningMs = Date.parse(`${dateIso}T00:00:00Z`) + (21 + 7.5) * 3_600_000
  const k = kBefore(eveningMs)
  const prevNew = newMoonMs(k)
  const nextNew = newMoonMs(k + 1)
  const t = (eveningMs - prevNew) / (nextNew - prevNew)

  const fullThisCycle = fullMoonMs(k)
  const nextFullMs = fullThisCycle > eveningMs ? fullThisCycle : fullMoonMs(k + 1)
  const illumination = (1 - Math.cos(2 * Math.PI * t)) / 2

  return {
    illumination,
    phaseName: phaseNameOf(eveningMs, prevNew, nextNew, fullThisCycle, illumination),
    nextFull: instantOf(nextFullMs),
    nextNew: instantOf(nextNew),
  }
}

/**
 * Full moons between two park-local dates inclusive, for the sky calendar.
 */
export function fullMoonsInRange(startIso: string, endIso: string): PhaseInstant[] {
  const startMs = Date.parse(`${startIso}T00:00:00Z`) - 12 * 3_600_000
  const endMs = Date.parse(`${endIso}T00:00:00Z`) + 36 * 3_600_000
  const out: PhaseInstant[] = []
  for (let k = kBefore(startMs) - 1; ; k++) {
    const ms = fullMoonMs(k)
    if (ms > endMs) break
    if (ms < startMs) continue
    const instant = instantOf(ms)
    if (instant.dateIso >= startIso && instant.dateIso <= endIso) out.push(instant)
  }
  return out
}
