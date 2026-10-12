import { Link } from 'react-router-dom'
import { BUILD_DATE, EDITION_LABEL } from '../lib/buildInfo'
import { formatLongDate } from '../utils/date'

export default function UpdatedStamp() {
  return (
    <div className="updated-stamp">
      Last updated {formatLongDate(BUILD_DATE)} · {EDITION_LABEL} · <Link to="/account#changes">What changed →</Link>
    </div>
  )
}
