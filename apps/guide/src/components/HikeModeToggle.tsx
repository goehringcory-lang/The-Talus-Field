// Day hikes or overnight routes: the switch at the top of /hikes and
// /backpacking. Both live under the Plan tab's Hikes; a fifth uppercase tab
// in PlanTabs would run past a 360px screen (see .plan-tabs in components.css).

import { Link } from 'react-router-dom'

export default function HikeModeToggle({ active }: { active: 'day' | 'overnight' }) {
  return (
    <nav className="hike-mode" aria-label="Hike length">
      <Link to="/hikes" className="hike-mode__opt" aria-current={active === 'day' ? 'page' : undefined}>
        Day hikes
      </Link>
      <Link to="/backpacking" className="hike-mode__opt" aria-current={active === 'overnight' ? 'page' : undefined}>
        Backpacking
      </Link>
    </nav>
  )
}
