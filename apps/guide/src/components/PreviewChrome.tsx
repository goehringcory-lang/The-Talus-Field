import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from './ui/Button'
import { GUIDE_BUY_URL, useGuidePrice } from '../lib/storefront'

type Props = {
  children: ReactNode
}

// Chrome for the signed-out surfaces (/preview, stop teasers): the gated
// masthead minus the app's quick links, and a fixed buy bar standing where
// the bottom tab bar stands for buyers. Everything it links to works without
// a session.
export default function PreviewChrome({ children }: Props) {
  const price = useGuidePrice()
  const { pathname, search, hash } = useLocation()
  // Deep links (a shared stop) should survive the sign-in round trip; the
  // sample page itself shouldn't, or buyers would land back on the sales
  // pitch after signing in.
  const from = pathname.startsWith('/stop/') ? pathname + search + hash : undefined
  return (
    <div className="app-shell">
      <header className="gated-chrome">
        <Link to="/preview" className="masthead-brand" aria-label="The Field Guide, free sample">
          <img
            className="masthead-brand__mark"
            src="/brand/mark-96.png"
            srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
            alt=""
            width="61"
            height="48"
          />
          <span className="masthead-brand__text">
            <span className="masthead-brand__title">The Talus Field</span>
            <span className="masthead-brand__sub">Field Guide · Free sample</span>
          </span>
        </Link>
        <nav className="gated-chrome__links" aria-label="Quick links">
          <Link
            to="/login"
            state={from ? { from } : undefined}
            className="gated-chrome__link"
          >
            Sign in →
          </Link>
        </nav>
      </header>
      <div className="preview-offset">{children}</div>
      <div className="preview-bar">
        <div className="preview-bar__copy">
          <span className="preview-bar__price">{price}</span>
          <span className="preview-bar__note">One payment · 18 months · Offline</span>
        </div>
        <Button href={GUIDE_BUY_URL} external>
          Get the guide →
        </Button>
      </div>
    </div>
  )
}
