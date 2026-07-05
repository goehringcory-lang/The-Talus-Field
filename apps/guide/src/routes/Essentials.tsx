import { Link } from 'react-router-dom'
import { ESSENTIAL_SECTIONS, ESSENTIALS, ESSENTIALS_META } from '../content'
import GatedChrome from '../components/GatedChrome'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'

export default function Essentials() {
  // ESSENTIALS is order-sorted and orders are blocked by section, so grouping
  // preserves the global reading order that prev/next walks on the detail page.
  const sections = ESSENTIAL_SECTIONS.map((s) => ({
    ...s,
    topics: ESSENTIALS.filter((t) => t.section === s.id),
  })).filter((s) => s.topics.length > 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader
          eyebrow="Know before you go"
          title={ESSENTIALS_META.title}
          intro={ESSENTIALS_META.teaser}
        />

        {sections.map((section) => (
          <section key={section.id} aria-label={section.title} style={{ marginBottom: 36 }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>{section.title}</span>
            <div>
              {section.topics.map((topic, i) => (
                <div key={topic.id}>
                  <Link to={`/essentials/${topic.id}`} className="essential-row">
                    <h2 className="essential-row__title">{topic.title}</h2>
                    <p className="essential-row__teaser">{topic.teaser}</p>
                    <span className="essential-row__cta">Read →</span>
                  </Link>
                  {i < section.topics.length - 1 && <hr className="stop-divider" style={{ margin: '0' }} />}
                </div>
              ))}
            </div>
          </section>
        ))}

        <BackLink to="/" label="Back to the guide" />
      </main>
    </GatedChrome>
  )
}
