import { Link } from 'react-router-dom'
import { ESSENTIAL_SECTIONS, ESSENTIALS, ESSENTIALS_META } from '../content'
import GatedChrome from '../components/GatedChrome'

export default function Essentials() {
  // ESSENTIALS is order-sorted and orders are blocked by section, so grouping
  // preserves the global reading order that prev/next walks on the detail page.
  const sections = ESSENTIAL_SECTIONS.map((s) => ({
    ...s,
    topics: ESSENTIALS.filter((t) => t.section === s.id),
  })).filter((s) => s.topics.length > 0)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>{ESSENTIALS_META.title}</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{ESSENTIALS_META.teaser}</p>

        {sections.map((section) => (
          <section key={section.id} aria-label={section.title} style={{ marginBottom: 36 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{section.title}</div>
            <div style={{ display: 'grid', gap: 0 }}>
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

        <p style={{ marginTop: 56 }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Back to the guide
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
