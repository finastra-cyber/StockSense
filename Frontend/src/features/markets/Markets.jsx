import { useState, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Search, Star } from 'lucide-react'

import { useDocTitle }    from '../../hooks/useDocTitle.js'

import { usePriceTicker } from '../../hooks/usePriceTicker.js'

import { STOCKS, generateOHLCV } from '../../mocks/stocks.js'

import { useWatchlistStore }  from '../../store/watchlistStore.js'

import { formatINR, formatPct } from '../../utils/formatters.js'

import PriceChange  from '../../components/ui/PriceChange.jsx'

import Sparkline    from '../../components/ui/Sparkline.jsx'

import Badge        from '../../components/ui/Badge.jsx'

import EmptyState   from '../../components/ui/EmptyState.jsx'

import Skeleton     from '../../components/ui/Skeleton.jsx'



const SECTORS = ['All', ...Array.from(new Set(STOCKS.map(s => s.sector))).sort()]

const TABS    = ['All', 'Gainers', 'Losers', 'Most Active']



function enrich(stock, prices) {

  const candles = generateOHLCV(stock.basePrice, 30, stock.symbol.charCodeAt(0))

  const prev    = candles[candles.length - 2]?.close ?? stock.basePrice

  const curr    = prices[stock.symbol] ?? candles[candles.length - 1]?.close ?? stock.basePrice

  const change  = curr - prev

  const chgPct  = (change / prev) * 100

  return {

    ...stock, price: +curr.toFixed(2),

    prevClose: +prev.toFixed(2),

    change: +change.toFixed(2), changePct: +chgPct.toFixed(2),

    volume: Math.floor(1_000_000 + (stock.basePrice * 1237) % 9_000_000),

    sparkData: candles.slice(-14),

  }

}



export default function Markets() {

  useDocTitle('Markets')

  const navigate = useNavigate()

  const { add, remove, isWatched } = useWatchlistStore()

  const symbols  = STOCKS.map(s => s.symbol)

  const { prices } = usePriceTicker(symbols)



  const [query,  setQuery]  = useState('')

  const [tab,    setTab]    = useState('All')

  const [sector, setSector] = useState('All')

  const [page,   setPage]   = useState(1)

  const PER_PAGE = 10



  const enriched = useMemo(() => STOCKS.map(s => enrich(s, prices)), [prices])



  const filtered = useMemo(() => {

    let list = enriched

    if (query)            list = list.filter(s => s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()))

    if (sector !== 'All') list = list.filter(s => s.sector === sector)

    if (tab === 'Gainers')     list = [...list].sort((a, b) => b.changePct - a.changePct)

    if (tab === 'Losers')      list = [...list].sort((a, b) => a.changePct - b.changePct)

    if (tab === 'Most Active') list = [...list].sort((a, b) => b.volume - a.volume)

    return list

  }, [enriched, query, tab, sector])



  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const pageData   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Markets</h1>

          <p className="page-header__sub">Explore and discover stocks across sectors</p>

        </div>

      </div>



      {/* Controls */}

      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>

        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>

          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-3)' }} aria-hidden="true" />

          <input

            value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}

            placeholder="Search by name or symbol..."

            style={{

              width: '100%', paddingLeft: 30, paddingRight: 10,

              background: 'var(--card-hi)', border: '1px solid var(--border)',

              borderRadius: 'var(--r)', padding: '.48rem .75rem .48rem 30px',

              color: 'var(--tx)', fontSize: '.84rem',

            }}

            aria-label="Search stocks"

          />

        </div>

        {/* Sector chips */}

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>

          {SECTORS.slice(0, 7).map(s => (

            <button key={s} onClick={() => { setSector(s); setPage(1) }}

              style={{

                padding: '.25rem .65rem', border: 'none', borderRadius: 20, fontSize: '.72rem', fontWeight: 600,

                background: sector === s ? 'var(--accent)' : 'var(--card-hi)',

                color: sector === s ? '#fff' : 'var(--tx-2)',

                cursor: 'pointer', transition: 'all .14s',

              }}

            >{s}</button>

          ))}

        </div>

      </div>



      {/* Tabs */}

      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)' }}>

        {TABS.map(t => (

          <button key={t} onClick={() => { setTab(t); setPage(1) }}

            style={{

              padding: '.48rem 1rem', border: 'none', background: 'transparent',

              color: tab === t ? 'var(--tx)' : 'var(--tx-3)',

              fontWeight: tab === t ? 700 : 500, fontSize: '.875rem', cursor: 'pointer',

              borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,

              marginBottom: -1, transition: 'color .15s, border-color .15s',

            }}

          >{t}</button>

        ))}

      </div>



      {/* Table */}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        <div style={{ overflowX: 'auto' }}>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            <thead>

              <tr style={{ borderBottom: '1px solid var(--border)' }}>

                {['Symbol','Name','Price','Change','Volume','Trend','Actions'].map(h => (

                  <th key={h} style={{ padding: '.75rem 1rem', textAlign: h === 'Price' || h === 'Change' || h === 'Volume' ? 'right' : 'left', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>{h}</th>

                ))}

              </tr>

            </thead>

            <tbody>

              {pageData.length === 0 ? (

                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--tx-3)' }}>No stocks found</td></tr>

              ) : pageData.map(s => (

                <tr key={s.symbol}

                  onClick={() => navigate(`/app/stocks/${s.symbol}`)}

                  style={{ borderBottom: '1px solid var(--border-lo)', cursor: 'pointer', transition: 'background .1s' }}

                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.03)'}

                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}

                >

                  <td style={{ padding: '.75rem 1rem' }}>

                    <span style={{ fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--mono)' }}>{s.symbol}</span>

                  </td>

                  <td style={{ padding: '.75rem 0' }}>

                    <div style={{ fontSize: '.82rem', color: 'var(--tx-2)' }}>{s.name.slice(0, 26)}</div>

                    <div style={{ fontSize: '.65rem', color: 'var(--tx-3)' }}>{s.sector}</div>

                  </td>

                  <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx)' }}>

                    {formatINR(s.price)}

                  </td>

                  <td style={{ padding: '.75rem 1rem', textAlign: 'right' }}>

                    <PriceChange value={s.changePct} size="sm" />

                  </td>

                  <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.78rem', color: 'var(--tx-3)' }}>

                    {(s.volume / 1e6).toFixed(1)}M

                  </td>

                  <td style={{ padding: '.75rem 1rem', width: 80 }}>

                    <Sparkline data={s.sparkData} height={32} width={80} />

                  </td>

                  <td style={{ padding: '.75rem 1rem' }} onClick={e => e.stopPropagation()}>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>

                      <button

                        onClick={() => isWatched(s.symbol) ? remove(s.symbol) : add(s.symbol)}

                        aria-label={isWatched(s.symbol) ? `Remove ${s.symbol} from watchlist` : `Add ${s.symbol} to watchlist`}

                        style={{

                          background: 'none', border: 'none', cursor: 'pointer', padding: 4,

                          color: isWatched(s.symbol) ? 'var(--gold)' : 'var(--tx-3)',

                          transition: 'color .15s',

                        }}

                      >

                        <Star size={14} fill={isWatched(s.symbol) ? 'currentColor' : 'none'} />

                      </button>

                      <button

                        className="btn btn--sm btn--primary"

                        onClick={() => navigate(`/app/trade?symbol=${s.symbol}&side=BUY`)}

                        style={{ padding: '.2rem .55rem', fontSize: '.68rem' }}

                      >Trade</button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        {totalPages > 1 && (

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.85rem 1rem', borderTop: '1px solid var(--border-lo)' }}>

            <span style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>

              Showing {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}

            </span>

            <div style={{ display: 'flex', gap: 4 }}>

              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}

                className="btn btn--sm" style={{ padding: '.25rem .6rem' }}>&larr;</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (

                <button key={p} onClick={() => setPage(p)}

                  className={`btn btn--sm ${p === page ? 'btn--primary' : ''}`}

                  style={{ padding: '.25rem .6rem', minWidth: 30 }}

                >{p}</button>

              ))}

              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}

                className="btn btn--sm" style={{ padding: '.25rem .6rem' }}>&rarr;</button>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}

