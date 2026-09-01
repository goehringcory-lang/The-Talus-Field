import { lazy, Suspense, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth/AuthGate'
import { useAuth } from './auth/useAuth'
import Open from './routes/Open'
import Claim from './routes/Claim'
import Login from './routes/Login'
import Home from './routes/Home'
import InstallPrompt from './components/InstallPrompt'
import UpdateBanner from './components/UpdateBanner'
import ScrollToTop from './components/ScrollToTop'

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
const Hikes = lazy(() => import('./routes/Hikes'))
const Dining = lazy(() => import('./routes/Dining'))
const HikeDetail = lazy(() => import('./routes/HikeDetail'))
const Trip = lazy(() => import('./routes/Trip'))
const Today = lazy(() => import('./routes/Today'))
const ThisWeek = lazy(() => import('./routes/ThisWeek'))
const Night = lazy(() => import('./routes/Night'))
const Compass = lazy(() => import('./routes/Compass'))
const Wildlife = lazy(() => import('./routes/Wildlife'))
const Hunts = lazy(() => import('./routes/Hunts'))
const Log = lazy(() => import('./routes/Log'))
const TripPrint = lazy(() => import('./routes/TripPrint'))
const Welcome = lazy(() => import('./routes/Welcome'))
const NotFound = lazy(() => import('./routes/NotFound'))
const Preview = lazy(() => import('./routes/Preview'))
const StopTeaser = lazy(() => import('./routes/StopTeaser'))
const Redeem = lazy(() => import('./routes/Redeem'))

// Navigate drops location.hash, and old /secret-spots#<id> search bookmarks
// rely on it, so the redirect forwards the hash explicitly.
function LegacySecretRedirect() {
  const { hash } = useLocation()
  return <Navigate to={{ pathname: '/secret-guide', hash }} replace />
}

// /stop/:id is the shape buyers share. Signed in it is the normal gated stop
// page; signed out it renders the public teaser (a landing page, not the
// login wall), so a shared link sells instead of bouncing.
function StopGate() {
  const { session } = useAuth()
  return session ? <StopDetail /> : <StopTeaser />
}

// The Suspense fallback. It stands in for a page, so it carries the page's
// focus target: ScrollToTop moves focus to #main after a navigation, and with
// no #main in the fallback the first visit to a lazy route dropped focus on
// body. Claimed only when nothing else owns the id. Router navigations run as
// transitions and never show this over a mounted page, but a non-transition
// re-suspend (StopGate flipping on the session) hides the outgoing page in
// place, and its GatedChrome #main is still in the tree.
function RouteLoading() {
  const [ownsMain] = useState(() => !document.getElementById('main'))
  return (
    <div
      className="app-shell route-loading"
      id={ownsMain ? 'main' : undefined}
      tabIndex={ownsMain ? -1 : undefined}
    >
      <img
        className="route-loading__mark"
        src="/brand/mark-96.png"
        srcSet="/brand/mark-96.png 1x, /brand/mark-192.png 2x"
        alt=""
        width="61"
        height="48"
      />
      <div className="route-loading__lines" role="status">
        <span className="sr-only">Loading</span>
        <div className="skeleton" style={{ width: '60%', height: 14 }} />
        <div className="skeleton" style={{ width: '84%', height: 14 }} />
        <div className="skeleton" style={{ width: '72%', height: 14 }} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <UpdateBanner />
      {/* Visible fallback: on a slow connection a lazy chunk can take seconds,
          and a blank screen reads as broken. */}
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/open" element={<Open />} />
          {/* Instant access straight off the Stripe success redirect. */}
          <Route path="/claim" element={<Claim />} />
          <Route path="/login" element={<Login />} />
          {/* The free sample: public on purpose. Signed-in buyers are
              redirected into the app by the route itself. */}
          <Route path="/preview" element={<Preview />} />
          {/* Newsletter promo-code redemption: public on purpose, the code is
              the gate. The newsletter links here as /redeem?code=… */}
          <Route path="/redeem" element={<Redeem />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          {/* One-time first-run orientation; Open and Home route here until
              tfg.onboarded is set. No GatedChrome: it reads as setup. */}
          <Route
            path="/welcome"
            element={
              <RequireAuth>
                <Welcome />
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
          <Route path="/stop/:stopId" element={<StopGate />} />
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
            path="/hikes"
            element={
              <RequireAuth>
                <Hikes />
              </RequireAuth>
            }
          />
          <Route
            path="/dining"
            element={
              <RequireAuth>
                <Dining />
              </RequireAuth>
            }
          />
          <Route
            path="/hike/:hikeId"
            element={
              <RequireAuth>
                <HikeDetail />
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
          <Route
            path="/today"
            element={
              <RequireAuth>
                <Today />
              </RequireAuth>
            }
          />
          <Route
            path="/this-week"
            element={
              <RequireAuth>
                <ThisWeek />
              </RequireAuth>
            }
          />
          <Route
            path="/night"
            element={
              <RequireAuth>
                <Night />
              </RequireAuth>
            }
          />
          <Route
            path="/compass"
            element={
              <RequireAuth>
                <Compass />
              </RequireAuth>
            }
          />
          <Route
            path="/wildlife"
            element={
              <RequireAuth>
                <Wildlife />
              </RequireAuth>
            }
          />
          <Route
            path="/hunts"
            element={
              <RequireAuth>
                <Hunts />
              </RequireAuth>
            }
          />
          <Route
            path="/log"
            element={
              <RequireAuth>
                <Log />
              </RequireAuth>
            }
          />
          <Route
            path="/trip/print"
            element={
              <RequireAuth>
                <TripPrint />
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
