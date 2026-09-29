// NWS period names are spelled out ("Monday Night"); the front page's forecast
// strip is four narrow columns, so weekdays go to three letters ("Mon night").
// "Tonight", "Today", "This Afternoon" and the rest pass through unchanged.
export function shortPeriodName(name: string): string {
  return name
    .replace(/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/g, (_m, d: string) => d.slice(0, 3))
    .replace(/ Night\b/, ' night')
}
