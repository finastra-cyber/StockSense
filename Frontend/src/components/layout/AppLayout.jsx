import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, BarChart2, Newspaper, Brain, ShoppingCart,
  Briefcase, ArrowLeftRight, Star, BookOpen, Settings, LogOut, ChevronLeft,
  ChevronRight, Menu, X, Zap, Bell, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useThemeStore } from '../../store/themeStore.js'
import { useTradeStore } from '../../store/tradeStore.js'
import { isMarketOpen } from '../../utils/constants.js'
import { formatINRCompact } from '../../utils/formatters.js'
import { getInitials } from '../../utils/formatters.js'
import GlobalSearch from './GlobalSearch.jsx'
import CommandPalette from './CommandPalette.jsx'
import QuickTradeModal from '../trading/QuickTradeModal.jsx'
import './AppLayout.css'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/app/dashboard',    label: 'Dashboard',       icon: LayoutDashboard },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { to: '/app/markets',      label: 'Markets',         icon: TrendingUp },
      { to: '/app/news',         label: 'News & Sentiment',icon: Newspaper },
      { to: '/app/insights',     label: 'AI Insights',     icon: Brain },
    ],
  },
  {
    label: 'Trade',
    items: [
      { to: '/app/trade',        label: 'Paper Trading',   icon: ShoppingCart },
      { to: '/app/portfolio',    label: 'Portfolio',       icon: Briefcase },
      { to: '/app/transactions', label: 'Transactions',    icon: ArrowLeftRight },
      { to: '/app/watchlist',    label: 'Watchlist',       icon: Star },
    ],
  },
  {
    label: 'Learn',
    items: [
      { to: '/app/learn',        label: 'Learn Hub',       icon: BookOpen },
    ],
  },
]

export default function AppLayout() {
  const { user, logout }            = useAuth()
  const { theme, toggle: toggleTheme } = useThemeStore()
  const cash                        = useTradeStore(s => s.cash)
  const navigate                    = useNavigate()
  const location                    = useLocation()

  const [collapsed,  setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen]  = useState(false)
  const [cmdOpen,    setCmdOpen]     = useState(false)
  const [qtOpen,     setQtOpen]      = useState(false)
  const [notifOpen,  setNotifOpen]   = useState(false)
  const [dismissed,  setDismissed]   = useState(() => localStorage.getItem('fin_edu_dismissed') === '1')

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Ctrl/Cmd+K for command palette
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const name     = user?.username || user?.name || 'Trader'
  const marketOn = isMarketOpen()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function dismissEdu() {
    localStorage.setItem('fin_edu_dismissed', '1')
    setDismissed(true)
  }

  const SidebarContent = useCallback(({ mobile = false }) => (
    <div className={`sidebar__inner ${mobile ? 'sidebar__inner--mobile' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand-wrap">
        <Link to="/app/dashboard" className="sidebar__brand">
          <span className="sidebar__brand-icon"></span>
          {(!collapsed || mobile) && (
            <span>Fin<span style={{ color: 'var(--accent)' }}>Astra</span></span>
          )}
        </Link>
        {!mobile && (
          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
        {mobile && (
          <button className="sidebar__close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="sidebar__nav" aria-label="App navigation">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="sidebar__group">
            {(!collapsed || mobile) && (
              <span className="sidebar__group-label">{group.label}</span>
            )}
            {group.items.map(item => {
              const Icon    = item.icon
              const active  = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                  title={collapsed && !mobile ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && <span className="sidebar__link-indicator" aria-hidden="true" />}
                  <Icon size={16} aria-hidden="true" />
                  {(!collapsed || mobile) && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar__bottom">
        <Link
          to="/app/settings"
          className={`sidebar__link ${location.pathname === '/app/settings' ? 'sidebar__link--active' : ''}`}
          title={collapsed && !mobile ? 'Settings' : undefined}
        >
          <Settings size={16} aria-hidden="true" />
          {(!collapsed || mobile) && <span>Settings</span>}
        </Link>

        {(!collapsed || mobile) && (
          <div className="sidebar__user-card">
            <div className="sidebar__avatar">{getInitials(name)}</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{name.split(' ')[0]}</span>
              <span className="sidebar__user-email">{user?.email ?? 'paper trader'}</span>
            </div>
            <button
              className="sidebar__logout-btn"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  ), [collapsed, location.pathname, name, user])

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>

      {/*  Desktop Sidebar  */}
      <aside className="sidebar" aria-label="Sidebar navigation">
        <SidebarContent />
      </aside>

      {/*  Mobile Drawer Backdrop  */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/*  Mobile Drawer  */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="sidebar sidebar--mobile"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            aria-label="Mobile navigation"
          >
            <SidebarContent mobile />
          </motion.aside>
        )}
      </AnimatePresence>

      {/*  Main column  */}
      <div className="app-main">

        {/*  Top Navbar  */}
        <header className="topnav">
          <div className="topnav__left">
            <button
              className="topnav__hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <GlobalSearch />
          </div>

          <div className="topnav__right">
            {/* Market status */}
            <div className={`topnav__market-badge ${marketOn ? 'topnav__market-badge--open' : 'topnav__market-badge--closed'}`}>
              <span className="topnav__market-dot" />
              {marketOn ? 'Market Open' : 'Market Closed'}
            </div>

            {/* Virtual cash */}
            <Link to="/app/portfolio" className="topnav__cash-chip" title="View portfolio">
              <span className="topnav__cash-label">Cash</span>
              <span className="topnav__cash-value">{formatINRCompact(cash)}</span>
            </Link>

            {/* Notifications */}
            <div className="topnav__notif-wrap">
              <button
                className="topnav__icon-btn"
                onClick={() => setNotifOpen(o => !o)}
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="topnav__notif-dot" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    className="notif-dropdown"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="notif-dropdown__head">Notifications</div>
                    {[
                      { icon: '', text: 'RELIANCE BUY signal updated - 82% confidence', time: '2m ago' },
                      { icon: '', text: 'New article: TCS wins $1.5B BSNL deal', time: '1h ago' },
                      { icon: '', text: 'SBIN crossed above SMA50', time: '3h ago' },
                    ].map((n, i) => (
                      <div key={i} className="notif-item">
                        <span>{n.icon}</span>
                        <div>
                          <div className="notif-item__text">{n.text}</div>
                          <div className="notif-item__time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              className="topnav__icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title="Toggle theme"
            >
              {theme === 'dark'
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>

            {/* User avatar */}
            <Link to="/app/settings" className="topnav__avatar" aria-label="Go to settings">
              {getInitials(name)}
            </Link>
          </div>
        </header>

        {/*  Educational banner  */}
        {!dismissed && (
          <div className="edu-banner">
            <AlertCircle size={14} aria-hidden="true" />
            <span>
              FinAstra is an <strong>educational tool</strong>. All signals are illustrative.
              This is <strong>not investment advice</strong>. No real orders are placed.
            </span>
            <button className="edu-banner__close" onClick={dismissEdu} aria-label="Dismiss banner">
              <X size={13} />
            </button>
          </div>
        )}

        {/*  Page content  */}
        <main className="app-page" id="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              style={{ height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/*  Mobile bottom tab bar  */}
        <nav className="bottom-tabs" aria-label="Bottom navigation">
          {[
            { to: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
            { to: '/app/markets',   icon: TrendingUp,      label: 'Markets' },
            { to: '/app/trade',     icon: ShoppingCart,    label: 'Trade' },
            { to: '/app/portfolio', icon: Briefcase,       label: 'Portfolio' },
            { to: '/app/settings',  icon: Settings,        label: 'More' },
          ].map(tab => {
            const Icon   = tab.icon
            const active = location.pathname === tab.to
            return (
              <Link
                key={tab.to} to={tab.to}
                className={`bottom-tab ${active ? 'bottom-tab--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/*  Floating Quick Trade button  */}
      <button
        className="quick-trade-fab"
        onClick={() => setQtOpen(true)}
        aria-label="Quick trade"
        title="Quick trade"
      >
        <Zap size={18} />
      </button>

      {/*  Command Palette  */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {/*  Quick Trade Modal  */}
      <QuickTradeModal open={qtOpen} onClose={() => setQtOpen(false)} />
    </div>
  )
}
