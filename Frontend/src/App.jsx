import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import BrandLoader from './components/BrandLoader.jsx'
import { useThemeStore } from './store/themeStore.js'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

const Dashboard    = lazy(() => import('./features/dashboard/Dashboard.jsx'))
const Markets      = lazy(() => import('./features/markets/Markets.jsx'))
const StockDetail  = lazy(() => import('./features/stocks/StockDetail.jsx'))
const Trade        = lazy(() => import('./features/trade/Trade.jsx'))
const Portfolio    = lazy(() => import('./features/portfolio/Portfolio.jsx'))
const Transactions = lazy(() => import('./features/transactions/Transactions.jsx'))
const Watchlist    = lazy(() => import('./features/watchlist/Watchlist.jsx'))
const News         = lazy(() => import('./features/news/News.jsx'))
const Insights     = lazy(() => import('./features/insights/Insights.jsx'))
const Learn        = lazy(() => import('./features/learn/Learn.jsx'))
const Settings     = lazy(() => import('./features/settings/Settings.jsx'))

const FB = <BrandLoader />

export default function App() {
  const { init } = useThemeStore()
  useEffect(() => { init() }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup"        element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/register"      element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard"      element={<Suspense fallback={FB}><Dashboard /></Suspense>} />
          <Route path="markets"        element={<Suspense fallback={FB}><Markets /></Suspense>} />
          <Route path="stocks/:symbol" element={<Suspense fallback={FB}><StockDetail /></Suspense>} />
          <Route path="trade"          element={<Suspense fallback={FB}><Trade /></Suspense>} />
          <Route path="portfolio"      element={<Suspense fallback={FB}><Portfolio /></Suspense>} />
          <Route path="transactions"   element={<Suspense fallback={FB}><Transactions /></Suspense>} />
          <Route path="watchlist"      element={<Suspense fallback={FB}><Watchlist /></Suspense>} />
          <Route path="news"           element={<Suspense fallback={FB}><News /></Suspense>} />
          <Route path="insights"       element={<Suspense fallback={FB}><Insights /></Suspense>} />
          <Route path="learn"          element={<Suspense fallback={FB}><Learn /></Suspense>} />
          <Route path="settings"       element={<Suspense fallback={FB}><Settings /></Suspense>} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </>
  )
}