// =============================================================================
// Honest dead-end page. Stale shared deep links (a renamed stop, an old
// bookmark, a mistyped address) used to bounce silently to the front page;
// telling the reader what happened keeps their trust in the links that work.
// Prop-driven so the catch-all route and the detail pages share one component.
// =============================================================================

import GatedChrome from '../components/GatedChrome'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

type Props = {
  title?: string
  intro?: string
  backTo?: string
  backLabel?: string
}

export default function NotFound({
  title = "That page isn't in the guide.",
  intro = 'The link may be old, or the address mistyped. Everything current is reachable from the regions list or search.',
  backTo = '/',
  backLabel = 'Back to the guide',
}: Props) {
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader eyebrow="Wrong turn" title={title} intro={intro} />
        <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button to={backTo}>{backLabel}</Button>
          <Button variant="ghost" to="/search">
            Search the guide
          </Button>
        </p>
      </main>
    </GatedChrome>
  )
}
