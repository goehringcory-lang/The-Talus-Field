// =============================================================================
// Server render of the public storefront pages, for scripts/prerender-public.ts.
// Never imported by the app: the script loads it through Vite's SSR loader
// after the client build, renders each page in publicPages() with the real
// route components, and writes the markup into a copy of dist/index.html.
//
// Signed out by construction (a null session), because these files are what a
// crawler or a first-time visitor receives. Effects do not run on the server,
// so the price is the storefront fallback, which is the same number the client
// shows until /api/inventory answers.
// =============================================================================

/* eslint-disable react-refresh/only-export-components -- a server-only entry,
   never hot-reloaded, so the fast-refresh export rule does not apply. */

import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../auth/useAuth'
import type { AuthContextValue } from '../auth/useAuth'
import Preview from '../routes/Preview'
import StopTeaser from '../routes/StopTeaser'

export { publicPages, PUBLIC_ORIGIN } from '../lib/publicPages'

const signedOut: AuthContextValue = {
  session: null,
  signIn: () => {},
  signOut: () => {},
}

export function render(path: string): string {
  return renderToString(
    <AuthContext.Provider value={signedOut}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/preview" element={<Preview />} />
          <Route path="/stop/:stopId" element={<StopTeaser />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}
