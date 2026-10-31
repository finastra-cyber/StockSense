import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Newspaper, Brain, ShoppingCart,
  Briefcase, ArrowLeftRight, Star, BookOpen, Settings, LogOut,
  Sun, Moon, Search,
} from 'lucide-react'
import { searchStocks } from '../../mocks/stocks.js'

const PAGES = [
  { label: 'Dashboard',        to: '/app/dashboard',    icon: LayoutDashboard },
  { label: 'Markets',          to: '/app/markets',      icon: TrendingUp },
  { label: 'Paper Trading',    to: '/app/trade',        icon: ShoppingCart },
  { label: 'Portfolio',        to: '/app/portfolio',    icon: Briefcase },
  { label: 'Transactions',     to: '/app/transactions', icon: ArrowLeftRight },
  { label: 'Watchlist',        to: '/app/watchlist',    icon: Star },
  { label: 'News & Sentiment', to: '/app/news',         icon: Newspaper },
  { label: 'AI Insights',      to: '/app/insights',     icon: Brain },
  { label: 'Learn Hub',        to: '/app/learn',        icon: BookOpen },
  { label: 'Settings',         to: '/app/settings',     icon: Settings },
]

export default function CommandPalette({ open, onClose, toggleTheme, onLogout }) {
  const [query,  setQuery]  = useState('')
  const [active, setActive] = useState(0)
  const navigate            = useNavigate()
  const inputRef            = useRef(null)

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const stockResults = query.length >= 1
    ? searchStocks(query).map(s => ({ label: `${s.symbol}  ${s.name}`, to: `/app/stocks/${s.symbol}`, icon: TrendingUp, stock: true }))
    : []

  const pageResults = PAGES.filter(p => p.label.toLowerCase().includes(query.toLowerCase()))

  const actions = query === '' || 'theme'.includes(query.toLowerCase()) ? [
    { label: 'Toggle theme', icon: Sun, action: () => { toggleTheme(); onClose() } },
    { label: 'Log out',      icon: LogOut, action: () => { onLogout(); onClose() } },
  ] : []

  const allItems = [...stockResults, ...pageResults, ...actions]

  useEffect(() => { setActive(0) }, [query])

  function handleKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, allItems.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && allItems[active]) {
      const item = allItems[active]
      if (item.action) { item.action() }
      else { navigate(item.to); onClose() }
    }
    if (e.key === 'Escape') onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}
          role="dialog" aria-modal="true" aria-label="Command palette"
        >
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'relative', zIndex: 1, width: '100%', maxWidth: 560,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Search input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '.9rem 1rem', borderBottom: '1px solid var(--border-lo)' }}>
              <Search size={16} style={{ color: 'var(--tx-3)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search pages, stocks, or actions..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--tx)', fontSize: '.95rem',
                }}
              />
              <kbd style={{ fontSize: '.65rem', color: 'var(--tx-3)', background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {allItems.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--tx-3)', fontSize: '.84rem' }}>
                  No results for "{query}"
                </div>
              ) : (
                <>
                  {stockResults.length > 0 && (
                    <div style={{ padding: '.4rem 0' }}>
                      <div style={{ padding: '.3rem 1rem .1rem', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>Stocks</div>
                      {stockResults.map((item, i) => (
                        <CmdItem key={i} item={item} active={i === active} onSelect={() => { navigate(item.to); onClose() }} />
                      ))}
                    </div>
                  )}
                  {pageResults.length > 0 && (
                    <div style={{ padding: '.4rem 0' }}>
                      <div style={{ padding: '.3rem 1rem .1rem', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>Pages</div>
                      {pageResults.map((item, i) => {
                        const idx = stockResults.length + i
                        return <CmdItem key={i} item={item} active={idx === active} onSelect={() => { navigate(item.to); onClose() }} />
                      })}
                    </div>
                  )}
                  {actions.length > 0 && (
                    <div style={{ padding: '.4rem 0', borderTop: '1px solid var(--border-lo)' }}>
                      <div style={{ padding: '.3rem 1rem .1rem', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--tx-3)' }}>Actions</div>
                      {actions.map((item, i) => {
                        const idx = stockResults.length + pageResults.length + i
                        return <CmdItem key={i} item={item} active={idx === active} onSelect={item.action} />
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function CmdItem({ item, active, onSelect }) {
  const Icon = item.icon
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '.6rem 1rem', border: 'none', cursor: 'pointer',
        background: active ? 'var(--accent-bg)' : 'transparent',
        color: active ? '#a5b4fc' : 'var(--tx-2)',
        fontSize: '.875rem', textAlign: 'left',
        transition: 'background .1s, color .1s',
      }}
    >
      {Icon && <Icon size={15} style={{ flexShrink: 0, color: active ? 'var(--accent)' : 'var(--tx-3)' }} aria-hidden="true" />}
      {item.label}
    </button>
  )
}
