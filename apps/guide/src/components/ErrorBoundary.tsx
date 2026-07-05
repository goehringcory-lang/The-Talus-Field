/**
 * ErrorBoundary — last line of defense against a white screen.
 *
 * A render-time throw anywhere below (a bad content edit, a corrupt cached
 * chunk after a deploy, a browser quirk) would otherwise blank the whole app
 * with no way out. Class component because error boundaries have no hook
 * equivalent. Reload is the only recovery offered: it re-fetches the shell,
 * which also heals the stale-chunk-after-deploy case.
 */
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="app-shell">
        <main className="wrap wrap--narrow" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
            The Field Guide
          </div>
          <h1 style={{ marginBottom: 18 }}>Something went wrong.</h1>
          <p style={{ color: 'var(--ink-2)', marginBottom: 28 }}>
            The guide hit an unexpected error. Reloading usually clears it, and
            everything you downloaded is still on this device.
          </p>
          <button className="btn" type="button" onClick={() => window.location.reload()}>
            Reload the guide
          </button>
        </main>
      </div>
    )
  }
}
