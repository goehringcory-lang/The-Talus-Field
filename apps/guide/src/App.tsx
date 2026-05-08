import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth/AuthGate'
import Open from './routes/Open'
import Login from './routes/Login'
import Home from './routes/Home'
import Account from './routes/Account'
import Region from './routes/Region'
import StopDetail from './routes/StopDetail'
import InstallPrompt from './components/InstallPrompt'
import UpdateBanner from './components/UpdateBanner'

export default function App() {
  return (
    <AuthProvider>
      <UpdateBanner />
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
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route path="/trip/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallPrompt />
    </AuthProvider>
  )
}
