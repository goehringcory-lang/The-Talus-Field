import { Link } from 'react-router-dom'
import { BUILD_DATE, EDITION_LABEL } from '../lib/buildInfo'

export default function UpdatedStamp() {
  return (
    <div className="updated-stamp">
      Last updated {BUILD_DATE} · {EDITION_LABEL} · <Link to="/account#changes">What changed →</Link>
    </div>
  )
}
