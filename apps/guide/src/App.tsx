import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth/AuthGate'
import Open from './routes/Open'
import Login from './routes/Login'
import Home from './routes/Home'
import InstallPrompt from './components/InstallPrompt'
import UpdateBanner from './components/UpdateBanner'

// Heavy routes lazy-loaded so /login doesn't download Map / Google Maps glue.
const Map = lazy(() => import('./routes/Map'))
const Account = lazy(() => import('./routes/Account'))
const Region = lazy(() => import('./routes/Region'))
const StopDetail = lazy(() => import('./routes/StopDetail'))
const Essentials = lazy(() => import('./routes/Essentials'))
const EssentialDetail = lazy(() => import('./routes/EssentialDetail'))
const SecretGuide = lazy(() => import('./routes/SecretGuide'))
const Search = lazy(() => import('./routes/Search'))
const Programs = lazy(() => import('./routes/Programs'))
const Trip = lazy(() => import('./routes/Trip'))
const NotFound = lazy(() => import('./routes/NotFound'))

// Navigate drops location.hash, and old /secret-spots#<id> search bookmarks
// rely on it, so the redirect forwards the hash explicitly.
function LegacySecretRedirect() {
  const { hash } = useLocation()
  return <Navigate to={{ pathname: '/secret-guide', hash }} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <UpdateBanner />
      {/* Visible fallback: on a slow connection a lazy chunk can take seconds,
          and a blank screen reads as broken. */}
      <Suspense
        fallback={
          <div className="app-shell route-loading" aria-label="Loading">
            <img
              className="route-loading__mark"
              src="/brand/mark-96.png"
              srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
              alt=""
              width="61"
              height="48"
            />
            <div className="route-loading__lines">
              <div className="skeleton" style={{ width: '60%', height: 14 }} />
              <div className="skeleton" style={{ width: '84%', height: 14 }} />
              <div className="skeleton" style={{ width: '72%', height: 14 }} />
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/open" element={<Open />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/region/:regionId"
            element={
              <RequireAuth>
                <Region />
              </RequireAuth>
            }
          />
          <Route
            path="/stop/:stopId"
            element={
              <RequireAuth>
                <StopDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/essentials"
            element={
              <RequireAuth>
                <Essentials />
              </RequireAuth>
            }
          />
          <Route
            path="/essentials/:topicId"
            element={
              <RequireAuth>
                <EssentialDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/secret-guide"
            element={
              <RequireAuth>
                <SecretGuide />
              </RequireAuth>
            }
          />
          {/* Retired section URLs from before the Secret Guide merge. */}
          <Route path="/secret-spots" element={<LegacySecretRedirect />} />
          <Route path="/hidden-areas" element={<Navigate to="/secret-guide" replace />} />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />
          <Route
            path="/programs"
            element={
              <RequireAuth>
                <Programs />
              </RequireAuth>
            }
          />
          <Route
            path="/map"
            element={
              <RequireAuth>
                <Map />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path="/trip"
            element={
              <RequireAuth>
                <Trip />
              </RequireAuth>
            }
          />
          {/* Old trip-based-model URLs (/trip/1day etc.) land on the planner. */}
          <Route path="/trip/*" element={<Navigate to="/trip" replace />} />
          <Route
            path="*"
            element={
              <RequireAuth>
                <NotFound />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
      <InstallPrompt />
    </AuthProvider>
  )
}
