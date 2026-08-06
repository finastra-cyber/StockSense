import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import TickerTape from './components/TickerTape.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  // Auth pages and the dashboard render their own header/nav, so the
  // marketing top bar + ticker only show on public pages.
  const hideMarketingChrome =
    pathname === '/login' || pathname === '/register' || pathname === '/dashboard'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {!hideMarketingChrome && <TickerTape />}

      {!hideMarketingChrome && (
        <header className="topbar">
          <Link to="/" className="topbar__brand">
            StockSense<span className="dot">.</span>
            <span className="topbar__tag">PAPER TRADING</span>
          </Link>
          <nav className="topbar__nav">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn">
                  Dashboard
                </Link>
                <button type="button" className="btn btn--primary" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn">
                  Log in
                </Link>
                <Link to="/register" className="btn btn--primary">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
