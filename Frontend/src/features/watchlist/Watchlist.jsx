import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Star, X, TrendingUp, Search } from 'lucide-react'
import { useDocTitle }       from '../../hooks/useDocTitle.js'
import { usePriceTicker }    from '../../hooks/usePriceTicker.js'
import { useWatchlistStore } from '../../store/watchlistStore.js'
import { STOCKS, getLivePrice, generateOHLCV, searchStocks } from '../../mocks/stocks.js'
import { getAISignal }       from '../../mocks/aiSignals.js'
import { formatINR, formatRelative } from '../../utils/formatters.js'
import PriceChange   from '../../components/ui/PriceChange.jsx'
import Badge         from '../../components/ui/Badge.jsx'
import Sparkline     from '../../components/ui/Sparkline.jsx'
import EmptyState    from '../../components/ui/EmptyState.jsx'

const POPULAR = ['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK','SBIN','LT','BHARTIARTL']

export default function Watchlist() {
  useDocTitle('Watchlist')
  const navigate = useNavigate()
  const { items, add, remove } = useWatchlistStore()
  const [query,  setQuery]  = useState('')
  const [sugg,   setSugg]   = useState([])
  const [adding, setAdding] = useState(false)

  const symbols = items.map(i => i.symbol)
  const { prices } = usePriceTicker(symbols)

  function handleSearch(e) {
    const v = e.target.value
    setQuery(v)
    setSugg(v.length >= 1 ? searchStocks(v).filter(s => !items.find(i => i.symbol === s.symbol)).slice(0, 5) : [])
  }

  function handleAdd(sym) {
    add(sym)
    setQuery('')
    setSugg([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Watchlist</h1>
          <p className="page-header__sub">Track stocks you're interested in</p>
        </div>
        <span style={{ fontSize: '.78rem', color: 'var(--tx-3)' }}>{items.length} stocks</span>
      </div>

      {/* Search/Add */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.48rem .75rem' }}>
          <Search size={14} style={{ color: 'var(--tx-3)', flexShrink: 0 }} aria-hidden="true" />
          <input
            value={query} onChange={handleSearch}
            placeholder="Add a stock to watchlist..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--tx)', fontSize: '.85rem' }}
            aria-label="Search and add stock to watchlist"
          />
        </div>
        {sugg.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
            overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,.4)', marginTop: 4,
          }}>
            {sugg.map(s => (
              <button key={s.symbol} type="button"
                onClick={() => handleAdd(s.symbol)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', padding: '.55rem .85rem',
                  border: 'none', background: 'none', cursor: 'pointer', color: 'var(--tx-2)', fontSize: '.82rem', textAlign: 'left', transition: 'background .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--card-hi)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--tx)', marginRight: 8 }}>{s.symbol}</span>
                  <span style={{ color: 'var(--tx-3)', fontSize: '.75rem' }}>{s.sector}</span>
                </div>
                <span style={{ color: 'var(--tx-3)', fontSize: '.75rem' }}>{s.name.slice(0, 20)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular suggestions when empty */}
      {items.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <EmptyState
            icon={<Star size={28} />}
            title="Your watchlist is empty"
            description="Add stocks to track their prices and AI signals."
          />
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '.78rem', color: 'var(--tx-3)', marginBottom: '.65rem' }}>Popular stocks to get started:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {POPULAR.map(sym => (
                <button key={sym} onClick={() => add(sym)}
                  style={{ padding: '.3rem .75rem', border: '1px solid var(--border)', borderRadius: 20, background: 'var(--card-hi)', color: 'var(--tx-2)', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all .14s', fontFamily: 'var(--mono)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--tx-2)' }}
                >+ {sym}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Watchlist grid */}
      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {items.map(item => {
            const stock  = STOCKS.find(s => s.symbol === item.symbol)
            const candles = stock ? generateOHLCV(stock.basePrice, 14, stock.basePrice) : []
            const price   = prices[item.symbol] ?? candles[candles.length - 1]?.close ?? 0
            const prev    = candles[candles.length - 2]?.close ?? price
            const chgPct  = prev > 0 ? ((price - prev) / prev) * 100 : 0
            const signal  = getAISignal(item.symbol)

            return (
              <div key={item.symbol} className="card card--hover" style={{ position: 'relative' }}>
                <button
                  onClick={() => remove(item.symbol)}
                  aria-label={`Remove ${item.symbol} from watchlist`}
                  style={{
                    position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--tx-3)', padding: 4, borderRadius: 6, display: 'flex', transition: 'color .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--down)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--tx-3)'}
                >
                  <X size={13} />
                </button>

                <Link to={`/app/stocks/${item.symbol}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--tx)', fontFamily: 'var(--mono)' }}>{item.symbol}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--tx-3)' }}>{stock?.name?.slice(0, 22)}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--tx)', fontSize: '.9rem' }}>{formatINR(price)}</div>
                      <PriceChange value={chgPct} size="sm" />
                    </div>
                  </div>

                  <Sparkline data={candles} height={40} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.75rem' }}>
                    <Badge label={signal.signal} preset={signal.signal} size="sm" />
                    <span style={{ fontSize: '.65rem', color: 'var(--tx-3)', fontFamily: 'var(--mono)' }}>
                      {Math.round(signal.confidence * 100)}% confidence
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => navigate(`/app/trade?symbol=${item.symbol}&side=BUY`)}
                  className="btn btn--sm btn--primary"
                  style={{ width: '100%', marginTop: '.75rem', fontSize: '.75rem' }}
                >Trade</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
