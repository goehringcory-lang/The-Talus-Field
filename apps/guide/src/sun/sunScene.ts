// =============================================================================
// Where the sun sits in the front page's horizon scene (ParkNowPanel's Light
// block). Pure, like daylight.ts: the caller passes park-local minutes, so the
// scene and the times printed under it are read off the same clock.
//
// The scene is a 358 x 100 viewBox. The horizon is a line at y = 84; sunrise
// is the half-sun at x = 30 and sunset the one at x = 328, and between them
// the sun rides a sine of the day's elapsed fraction: highest at solar noon,
// on the horizon at both ends. Before sunrise and after sunset there is no
// sun above the horizon to draw, which is why `phase` exists: the panel draws
// the two half-suns and the horizon and nothing else.
// =============================================================================

export const SCENE_LEFT = 30
export const SCENE_RIGHT = 328
export const SCENE_HORIZON = 84
/** How far above the horizon the sun climbs at solar noon, in viewBox units. */
export const SCENE_PEAK = 63

export type SunScene =
  | { phase: 'before' | 'after' }
  | { phase: 'day'; fraction: number; x: number; y: number }

export function sunScene(nowMin: number, sunriseMin: number, sunsetMin: number): SunScene {
  if (nowMin < sunriseMin) return { phase: 'before' }
  if (nowMin >= sunsetMin) return { phase: 'after' }
  const fraction = (nowMin - sunriseMin) / (sunsetMin - sunriseMin)
  return {
    phase: 'day',
    fraction,
    x: SCENE_LEFT + (SCENE_RIGHT - SCENE_LEFT) * fraction,
    y: SCENE_HORIZON - SCENE_PEAK * Math.sin(Math.PI * fraction),
  }
}
