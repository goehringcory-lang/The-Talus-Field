import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ESSENTIALS, getEssentialById } from '../content'
import GatedChrome from '../components/GatedChrome'
import ChecklistBlock from '../components/ChecklistBlock'

export default function EssentialDetail() {
  const params = useParams<{ topicId: string }>()
  const topic = params.topicId ? getEssentialById(params.topicId) : undefined

  if (!topic) return <Navigate to="/essentials" replace />

  const index = ESSENTIALS.findIndex((t) => t.id === topic.id)
  const prev = index > 0 ? ESSENTIALS[index - 1] : undefined
  const next = index < ESSENTIALS.length - 1 ? ESSENTIALS[index + 1] : undefined

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          Know before you go
        </div>
        <h1 style={{ marginBottom: 24 }}>{topic.title}</h1>

        <div className="prose">
          <ReactMarkdown>{topic.body}</ReactMarkdown>
        </div>

        {topic.checklist && <ChecklistBlock items={topic.checklist} />}

        <nav
          className="stop-prevnext"
          aria-label="Essentials navigation"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 24,
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--rule)',
          }}
        >
          <div style={{ flex: 1 }}>
            {prev && (
              <Link to={`/essentials/${prev.id}`} style={{ display: 'block' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>← Previous</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{prev.title}</div>
              </Link>
            )}
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            {next && (
              <Link to={`/essentials/${next.id}`} style={{ display: 'block' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Next →</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{next.title}</div>
              </Link>
            )}
          </div>
        </nav>

        <p style={{ marginTop: 40 }}>
          <Link
            to="/essentials"
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← All essentials
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
