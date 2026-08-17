import { BUILD_DATE } from '../lib/buildInfo'

export default function UpdatedStamp() {
  return (
    <div className="updated-stamp">
      Last updated {BUILD_DATE} · 2026 Edition
    </div>
  )
}
