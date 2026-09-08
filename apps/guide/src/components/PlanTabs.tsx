// Segmented sub-nav for the Plan tab's three surfaces. The bottom nav's Plan
// tab already highlights for all of them; this makes the siblings visible.

import { Link } from 'react-router-dom'

type Props = {
  active: 'trip' | 'hikes' | 'programs'
}

export default function PlanTabs({ active }: Props) {
  return (
    <nav className="plan-tabs" aria-label="Plan sections">
      <Link
        to="/trip"
        className="plan-tabs__tab"
        aria-current={active === 'trip' ? 'page' : undefined}
      >
        Trip plan
      </Link>
      <Link
        to="/hikes"
        className="plan-tabs__tab"
        aria-current={active === 'hikes' ? 'page' : undefined}
      >
        Hikes
      </Link>
      <Link
        to="/programs"
        className="plan-tabs__tab"
        aria-current={active === 'programs' ? 'page' : undefined}
      >
        Programs
      </Link>
    </nav>
  )
}
