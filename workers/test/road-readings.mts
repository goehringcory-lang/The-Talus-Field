// Road readings from the park's own prose: which road a status word belongs
// to, for both readers (the /api/alerts summary and the nightly change watch).
// The phrasings are the park's (conditions.htm writes every road with its
// highway beside it) or the shapes its alerts take. Run: npm run test:roads
import { deriveRoads } from '../src/lib/alerts'
import type { AlertItemT } from '../src/lib/alerts'
import { deriveRoadReadings } from '../src/lib/roads'

let failures = 0
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) console.log(`ok    ${name}`)
  else { failures++; console.log(`FAIL  ${name}${detail !== undefined ? ` :: ${JSON.stringify(detail)}` : ''}`) }
}

let n = 0
const alert = (title: string, description = ''): AlertItemT => ({
  id: `A${++n}`,
  title,
  description,
  category: 'closure',
  url: null,
})

function watch(alerts: AlertItemT[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [id, reading] of Object.entries(deriveRoadReadings(alerts))) out[id] = reading.state
  return out
}

function summary(alerts: AlertItemT[]): Record<string, string> {
  return Object.fromEntries(deriveRoads(alerts).map((r) => [r.id, r.status]))
}

console.log('\nThe change watch (lib/roads.ts)')

{
  const w = watch([alert('Tioga Road closed for the season', 'Tioga Road (continuation of Highway 120 through the park) is closed for the season.')])
  check('a Tioga notice that names Highway 120 closes Tioga', w.tioga === 'closed', w)
  check('... and leaves Highway 120 alone', w['hwy-120'] === 'unknown', w)
}
{
  const w = watch([alert('Big Oak Flat Road closed', 'Big Oak Flat Road (continuation of Highway 120 from Manteca) is closed between Crane Flat and the Big Oak Flat Entrance after a rockslide.')])
  check('a Big Oak Flat Road closure is a Highway 120 closure', w['hwy-120'] === 'closed', w)
  check('... and says nothing about Tioga', w.tioga === 'unknown', w)
}
{
  const w = watch([alert('Road update', 'Tioga Road is open. Glacier Point Road remains closed.')])
  check('two roads in one alert: Tioga open', w.tioga === 'open', w)
  check('two roads in one alert: Glacier Point closed', w['glacier-point'] === 'closed', w)
}
{
  const w = watch([alert('Road update', 'Glacier Point Road is open; Mariposa Grove Road is closed.')])
  check('a semicolon separates two roads', w['glacier-point'] === 'open' && w['mariposa-grove'] === 'closed', w)
}
{
  const w = watch([alert('Tioga and Glacier Point Roads closed for the season', 'Both roads close with the first significant snow.')])
  check('the shared form names both roads', w.tioga === 'closed' && w['glacier-point'] === 'closed', w)
  const amp = watch([alert('Tioga & Glacier Point Roads open', 'Tioga & Glacier Point Roads are now open.')])
  check('the shared form with an ampersand', amp.tioga === 'open' && amp['glacier-point'] === 'open', amp)
}
{
  const w = watch([alert('Tioga Road update', 'The road is closed for the season. It is expected to reopen in late May or June.')])
  check('"the road" under a title that names one road', w.tioga === 'closed', w)
}
{
  const w = watch([
    alert(
      'Glacier Point Road area closures',
      'The Ostrander Lake Trail and all trails south of it are closed due to the Dome Fire. The closed area extends east of the Wawona Road from Chinquapin to Wawona.',
    ),
  ])
  check('a trail closure near Glacier Point Road is not a road closure', w['glacier-point'] === 'unknown', w)
  check('"the closed area" beside Wawona Road is not a Highway 41 closure', w['hwy-41'] === 'unknown', w)
}
{
  const w = watch([alert('Glacier Point Road closed at Badger Pass', 'Glacier Point Road, which leaves Highway 41 at Chinquapin, is closed beyond Badger Pass for the winter.')])
  check('Glacier Point Road closed', w['glacier-point'] === 'closed', w)
  check('... and Highway 41, named as its address, left alone', w['hwy-41'] === 'unknown', w)
}
{
  const w = watch([alert('Chain controls', 'Chains are required on Highway 41 south of Wawona.')])
  check('chain control on a highway', w['hwy-41'] === 'chains', w)
}
{
  const w = watch([alert('Highway closure', 'Hwy. 120 is closed west of Groveland after a rockslide.')])
  check('"Hwy. 120" stays one sentence', w['hwy-120'] === 'closed', w)
}
{
  const w = watch([alert('Tioga Road is closed for the season', 'The road over Tioga Pass is closed.')])
  check('the flow test fixture still reads Tioga closed', w.tioga === 'closed', w)
  check('... and every other road unknown', Object.entries(w).every(([id, s]) => id === 'tioga' || s === 'unknown'), w)
}
{
  const w = watch([alert('Tioga Road closed', 'Tioga Road is closed for the season. Tioga Road is expected to reopen in late May.')])
  check('closed wins over a reopening sentence', w.tioga === 'closed', w)
}
{
  const w = watch([alert('Tioga Road is now open'), alert('Glacier Point Road', 'Glacier Point Road is closed at the Badger Pass gate.')])
  check('one road per alert, two alerts', w.tioga === 'open' && w['glacier-point'] === 'closed', w)
}
{
  const w = watch([alert('Trail conditions update', 'Expect ice on shaded trails.')])
  check('silence is not a status', Object.values(w).every((s) => s === 'unknown'), w)
}

console.log('\nThe /api/alerts summary (lib/alerts.ts)')

{
  const s = summary([alert('Road update', 'Tioga Road is open. Glacier Point Road remains closed.')])
  check('two roads in one alert', s.tioga === 'open' && s['glacier-point'] === 'closed', s)
}
{
  const s = summary([alert('Glacier Point and Tioga Roads closed for the season')])
  check('the shared form, Glacier Point first', s.tioga === 'closed' && s['glacier-point'] === 'closed', s)
}
{
  const s = summary([alert('Tioga Road closed for the season', 'Tioga Road (continuation of Highway 120 through the park) is closed for the season.')])
  check('the park phrasing closes Tioga', s.tioga === 'closed', s)
}
{
  const s = summary([
    alert(
      'Glacier Point Road area closures',
      'The Ostrander Lake Trail and all trails south of it are closed due to the Dome Fire.',
    ),
  ])
  check('a trail closure is not a road closure', s['glacier-point'] === 'unknown', s)
}
{
  const s = summary([alert('Tioga Road is closed for the season', 'The road over Tioga Pass is closed.')])
  check('the flow test fixture', s.tioga === 'closed' && s['glacier-point'] === 'unknown', s)
}

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
