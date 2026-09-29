// The glyph a forecast period gets on the front page. NWS `shortForecast` is
// free text ("Chance Showers And Thunderstorms"), so this reads it by keyword,
// most severe first, and falls back to the sun rather than to a blank: the
// words beside the glyph carry the exact forecast, the glyph is only the
// glance. A clear night is the moon, which is what `isDaytime` is for.

export type ConditionKind = 'sunny' | 'clear-night' | 'partly' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog'

export function conditionKind(shortForecast: string, isDaytime: boolean): ConditionKind {
  const t = shortForecast.toLowerCase()
  if (/thunder/.test(t)) return 'storm'
  if (/snow|flurr|sleet|blizzard|wintry|freezing/.test(t)) return 'snow'
  if (/rain|shower|drizzle/.test(t)) return 'rain'
  if (/fog|haze|smoke|dust/.test(t)) return 'fog'
  if (/mostly cloudy|cloudy|overcast/.test(t) && !/partly/.test(t)) return 'cloudy'
  if (/partly|mostly sunny|mostly clear|increasing clouds/.test(t)) return 'partly'
  return isDaytime ? 'sunny' : 'clear-night'
}
