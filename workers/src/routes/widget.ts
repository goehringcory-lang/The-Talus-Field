import { Hono } from 'hono'
import type { Env } from '../env'
import { getWaits } from '../lib/waits'
import { readWeatherRecord } from '../lib/weather'

// The embeddable conditions widget (MONETIZATION-IDEAS.md 4.2): a free
// entrance-waits + forecast box gateway hotels and tour operators paste into
// their own sites, with a backlink to /conditions. Two surfaces:
//
//   GET /widget/conditions  — the data: current waits + a 3-day Valley
//                             forecast fold. CORS * (it is embedded on
//                             arbitrary origins) with a 5-minute edge cache
//                             as the abuse posture (tile-proxy precedent).
//   GET /widget.js          — served from index.ts at the root level; the
//                             self-contained renderer that consumes this.
//
// Mounted at the ROOT level (app.route('/widget')), not under /api/*, on
// purpose: the /api/* CORS middleware echoes a specific allow-listed origin,
// which would break embeds on every other site. Keep it out of /api/*.

// Same display names the editorial masthead uses; unknown pairs fall back to
// the pair_name with its " Wait Time" suffix stripped.
const WAITS_SHORT_NAMES: Record<string, string> = {
  'South Entrance Wait Time': 'South',
  'Arch Rock Wait Time': 'Arch Rock',
  'Big Oak Flat Wait Time': 'Big Oak Flat',
}

const CORS_ANY = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
} as const

export const widget = new Hono<{ Bindings: Env }>()

widget.get('/conditions', async (c) => {
  const [waits, weather] = await Promise.all([
    getWaits(c.env).catch(() => null),
    readWeatherRecord(c.env).catch(() => null),
  ])

  const waitsOut = (waits?.summary ?? []).map((pair) => {
    const rawName = String(pair.pair_name ?? '')
    const name = WAITS_SHORT_NAMES[rawName] || rawName.replace(/\s*Wait Time$/i, '') || 'Entrance'
    const minutes =
      pair.stale || typeof pair.current_wait_minutes !== 'number'
        ? null
        : Math.round(pair.current_wait_minutes)
    return { name, minutes }
  })

  // Fold the Valley spot's NWS day/night half-periods into up to three
  // calendar days (startTime carries the park-local offset, so the date
  // substring is already park-local).
  const valley = weather?.spots.find((s) => s.id === 'valley')
  const byDate = new Map<string, { day: string; hi: number | null; lo: number | null; short: string | null }>()
  for (const p of valley?.periods ?? []) {
    const date = p.startTime.slice(0, 10)
    let entry = byDate.get(date)
    if (!entry) {
      entry = { day: date, hi: null, lo: null, short: null }
      byDate.set(date, entry)
    }
    if (p.isDaytime) {
      entry.hi = entry.hi === null ? p.tempF : Math.max(entry.hi, p.tempF)
      if (!entry.short) entry.short = p.shortForecast
    } else {
      entry.lo = entry.lo === null ? p.tempF : Math.min(entry.lo, p.tempF)
    }
  }
  const forecast = [...byDate.values()].filter((d) => d.hi !== null).slice(0, 3)

  return c.json(
    {
      updatedAt: waits?.fetchedAt ?? weather?.fetchedAt ?? null,
      waits: waitsOut,
      forecast,
    },
    200,
    CORS_ANY,
  )
})

// The embed script. A dependency-free IIFE: finds (or creates, beside its own
// <script> tag) #talus-conditions, fetches /widget/conditions, and renders an
// inline-styled box with the mandatory backlink. Any error renders NOTHING —
// this runs on other people's websites, and an error box on someone else's
// homepage is how the widget gets removed. Served with a 1-hour cache; the
// data underneath refreshes every 5 minutes regardless.
export function widgetScript(): string {
  return `(function () {
  var API = 'https://api.thetalusfieldjournal.com/widget/conditions';
  var LINK = 'https://thetalusfieldjournal.com/conditions?utm_source=widget';
  var box = document.getElementById('talus-conditions');
  if (!box) {
    var s = document.currentScript;
    if (!s || !s.parentNode) return;
    box = document.createElement('div');
    box.id = 'talus-conditions';
    s.parentNode.insertBefore(box, s);
  }
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  fetch(API).then(function (r) {
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }).then(function (data) {
    var waits = (data && data.waits) || [];
    var days = (data && data.forecast) || [];
    if (!waits.length && !days.length) return;
    var waitsHtml = '';
    if (waits.length) {
      waitsHtml = '<div style="margin:0 0 8px;">' + waits.map(function (w) {
        var v = w.minutes == null ? 'n/a' : (w.minutes + ' min');
        return '<span style="white-space:nowrap;margin-right:12px;">' + esc(w.name) + ' <strong>' + esc(v) + '</strong></span>';
      }).join('') + '</div>';
    }
    var daysHtml = '';
    if (days.length) {
      daysHtml = '<div>' + days.map(function (d) {
        var dt = new Date(d.day + 'T12:00:00');
        var label = isNaN(dt.getTime()) ? d.day : dt.toLocaleDateString('en-US', { weekday: 'short' });
        var lo = d.lo == null ? '' : ('/' + Math.round(d.lo) + '\\u00B0');
        return '<span style="white-space:nowrap;margin-right:12px;">' + esc(label) + ' <strong>' + Math.round(d.hi) + '\\u00B0' + lo + '</strong> ' + esc(d.short || '') + '</span>';
      }).join('') + '</div>';
    }
    box.innerHTML =
      '<div style="font-family:Georgia,serif;font-size:14px;line-height:1.6;color:#14110c;background:#f1ead6;border:1px solid #14110c;padding:14px 16px;max-width:420px;">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#50402e;margin:0 0 8px;">Yosemite right now</div>' +
      waitsHtml + daysHtml +
      '<div style="margin-top:10px;font-size:12px;"><a href="' + LINK + '" style="color:#50402e;" target="_blank" rel="noopener">Entrance waits &amp; webcams: The Talus Field</a></div>' +
      '</div>';
  }).catch(function () { /* render nothing on someone else's site */ });
})();
`
}
