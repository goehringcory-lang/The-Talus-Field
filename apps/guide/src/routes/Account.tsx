import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import GatedChrome from '../components/GatedChrome'

export default function Account() {
  const { session, signOut } = useAuth()
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 24 }}>Account</h1>

        <div className="card" style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Signed in as</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{session?.username}</div>
        </div>

        <p>
          Questions? Email{' '}
          <a href="mailto:Goehring.cory@gmail.com">Goehring.cory@gmail.com</a>.
        </p>

        <div style={{ marginTop: 36, display: 'flex', gap: 12 }}>
          <Link to="/" className="btn btn--ghost">← Back to guide</Link>
          <button className="btn btn--ghost" onClick={signOut} type="button">
            Sign out
          </button>
        </div>
      </main>
    </GatedChrome>
  )
}
