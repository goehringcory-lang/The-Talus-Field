// Segmented sub-nav for the Plan tab's two surfaces. The bottom nav's Plan
// tab already highlights for both routes; this makes the sibling visible.

import { Link } from 'react-router-dom'

type Props = {
  active: 'trip' | 'programs'
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
        to="/programs"
        className="plan-tabs__tab"
        aria-current={active === 'programs' ? 'page' : undefined}
      >
        Programs
      </Link>
    </nav>
  )
}
