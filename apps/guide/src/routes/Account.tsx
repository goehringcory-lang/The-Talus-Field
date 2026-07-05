import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import GatedChrome from '../components/GatedChrome'
import DownloadManager from '../components/DownloadManager'
import { MAP_ATTRIBUTION } from '../map/style'
import '../styles/app.css'

export default function Account() {
  const { session, signOut } = useAuth()
  return (
    <GatedChrome>
      <main className="wrap wrap--narrow page">
        <div className="eyebrow eyebrow--moss page__kicker">
          The Field Guide
        </div>
        <h1 className="page__title">Account</h1>

        <div className="card card--spaced">
          <div className="eyebrow card__eyebrow">Signed in as</div>
          <div className="account-identity">{session?.username}</div>
        </div>

        <div className="card card--spaced">
          <DownloadManager />
        </div>

        <p>
          Questions? Email{' '}
          <a href="mailto:cory@thetalusfieldjournal.com">cory@thetalusfieldjournal.com</a>.
        </p>

        <div className="account-actions">
          <Link to="/" className="btn btn--ghost">← Back to guide</Link>
          <button className="btn btn--ghost" onClick={signOut} type="button">
            Sign out
          </button>
        </div>

        <p className="build-note">
          2026 Edition · Build {import.meta.env.VITE_BUILD_DATE}
          <br />
          Map tiles: {MAP_ATTRIBUTION}
        </p>
      </main>
    </GatedChrome>
  )
}
