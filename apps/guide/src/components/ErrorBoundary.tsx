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
import Button from './ui/Button'
import PageHeader from './ui/PageHeader'

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
        <main className="wrap wrap--narrow page">
          <PageHeader
            eyebrow="The Field Guide"
            title="Something went wrong."
            intro="The guide hit an unexpected error. Reloading usually clears it, and everything you downloaded is still on this device."
          />
          <Button onClick={() => window.location.reload()}>Reload the guide</Button>
        </main>
      </div>
    )
  }
}
