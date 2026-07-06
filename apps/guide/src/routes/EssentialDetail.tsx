import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ESSENTIALS, getEssentialById } from '../content'
import NotFound from './NotFound'
import GatedChrome from '../components/GatedChrome'
import ChecklistBlock from '../components/ChecklistBlock'
import PrevNextNav from '../components/PrevNextNav'
import BackLink from '../components/ui/BackLink'
import PageHeader from '../components/ui/PageHeader'

export default function EssentialDetail() {
  const params = useParams<{ topicId: string }>()
  const topic = params.topicId ? getEssentialById(params.topicId) : undefined

  if (!topic) {
    return (
      <NotFound
        title="That topic isn't in the essentials."
        backTo="/essentials"
        backLabel="All essentials"
      />
    )
  }

  const index = ESSENTIALS.findIndex((t) => t.id === topic.id)
  const prev = index > 0 ? ESSENTIALS[index - 1] : undefined
  const next = index < ESSENTIALS.length - 1 ? ESSENTIALS[index + 1] : undefined

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <PageHeader eyebrow="Know before you go" title={topic.title} />

        <div className="prose">
          <ReactMarkdown>{topic.body}</ReactMarkdown>
        </div>

        {topic.checklist && <ChecklistBlock items={topic.checklist} />}

        <PrevNextNav
          ariaLabel="Essentials navigation"
          prev={prev ? { to: `/essentials/${prev.id}`, title: prev.title } : undefined}
          next={next ? { to: `/essentials/${next.id}`, title: next.title } : undefined}
        />

        <BackLink to="/essentials" label="All essentials" />
      </main>
    </GatedChrome>
  )
}
