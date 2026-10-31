import { useState, useEffect, useMemo } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'

import {

  TrendingUp, TrendingDown, Briefcase, DollarSign, Activity,

  BarChart2, ArrowRight, Star, Zap, BookOpen, Newspaper,

} from 'lucide-react'

import {

  AreaChart, Area, XAxis, YAxis, Tooltip as RechartTooltip,

  ResponsiveContainer, PieChart, Pie, Cell,

} from 'recharts'

import { useAuth }       from '../../context/AuthContext.jsx'

import { useTradeStore } from '../../store/tradeStore.js'

import { useWatchlistStore } from '../../store/watchlistStore.js'

import { usePriceTicker }   from '../../hooks/usePriceTicker.js'

import { useDocTitle }      from '../../hooks/useDocTitle.js'

import { STOCKS, generateOHLCV } from '../../mocks/stocks.js'

import { getAllSignals }    from '../../mocks/aiSignals.js'

import { getNews }         from '../../mocks/news.js'

import { formatINR, formatINRCompact, formatPct, formatDate, formatRelative, getInitials } from '../../utils/formatters.js'

import { isMarketOpen, SIGNAL_COLORS, SECTOR_COLORS } from '../../utils/constants.js'

import Skeleton, { SkeletonCard } from '../../components/ui/Skeleton.jsx'

import PriceChange from '../../components/ui/PriceChange.jsx'

import Badge from '../../components/ui/Badge.jsx'

import Sparkline from '../../components/ui/Sparkline.jsx'

import EmptyState from '../../components/ui/EmptyState.jsx'



// Onboarding checklist

const CHECKLIST = [

  { id: 'trade',     label: 'Place your first trade',     link: '/app/trade' },

  { id: 'watchlist', label: 'Add 3 stocks to watchlist',  link: '/app/watchlist' },

  { id: 'rsi',       label: 'Read about RSI',             link: '/app/learn' },

]



const QUICK_ACTIONS = [

  { icon: TrendingUp,  label: 'Analyze a stock',  to: '/app/markets',   color: '#6366F1' },

  { icon: Zap,         label: 'Place a trade',    to: '/app/trade',     color: '#10B981' },

  { icon: Briefcase,   label: 'View portfolio',   to: '/app/portfolio', color: '#22D3EE' },

  { icon: BookOpen,    label: 'Learn indicators', to: '/app/learn',     color: '#F59E0B' },

]



// Generate equity curve from transactions + cash

function buildEquityCurve(transactions, startingCash) {
  const now = Date.now()
  let val = startingCash
  let s = startingCash + transactions.length * 137
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: 30 }, (_, i) => {
    val *= (1 + (rand() - 0.47) * 0.012)
    return {
      date: formatDate(now - (29 - i) * 86400000, { month: 'short', day: '2-digit' }),
      value: +val.toFixed(2),
    }
  })
}





export default function Dashboard() {

  useDocTitle('Dashboard')

  const navigate = useNavigate()

  const { user } = useAuth()

  const { cash, holdings, transactions, getPortfolioValue } = useTradeStore()

  const { items: watchlistItems } = useWatchlistStore()

  const [loading, setLoading] = useState(true)

  const [rangeTab, setRangeTab] = useState('1M')

  const [checklist, setChecklist] = useState(() => {

    try { return JSON.parse(localStorage.getItem('fin_checklist') || '{}') } catch { return {} }

  })



  const symbols = STOCKS.slice(0, 15).map(s => s.symbol)

  const { prices } = usePriceTicker(symbols)



  useEffect(() => { setTimeout(() => setLoading(false), 600) }, [])



  const name    = user?.username || user?.name || 'Trader'

  const hour    = new Date().getHours()

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const marketOn = isMarketOpen()



  // Portfolio value

  const portfolioVal = getPortfolioValue(prices)

  const holdingsList = Object.entries(holdings).map(([sym, h]) => ({

    symbol: sym, qty: h.qty, avgPrice: h.avgPrice,

    price:    prices[sym] ?? h.avgPrice,

    value:    (prices[sym] ?? h.avgPrice) * h.qty,

    pnl:      ((prices[sym] ?? h.avgPrice) - h.avgPrice) * h.qty,

    pnlPct:   ((prices[sym] ?? h.avgPrice) / h.avgPrice - 1) * 100,

    stock:    STOCKS.find(s => s.symbol === sym),

  }))



  // Gainers / Losers from STOCKS

  const movers = STOCKS.slice(0, 10).map(s => {

    const candles = generateOHLCV(s.basePrice, 2, s.symbol.charCodeAt(0))

    const prev = candles[candles.length - 2]?.close ?? s.basePrice

    const curr = prices[s.symbol] ?? candles[candles.length - 1]?.close ?? s.basePrice

    return { ...s, price: curr, changePct: ((curr - prev) / prev) * 100 }

  }).sort((a, b) => b.changePct - a.changePct)

  const gainers = movers.slice(0, 4)

  const losers  = [...movers].sort((a, b) => a.changePct - b.changePct).slice(0, 4)

  const [moverTab, setMoverTab] = useState('gainers')



  // AI signals

  const aiSignals = getAllSignals().slice(0, 4)



  // News

  const news = getNews().slice(0, 4)



  // Equity curve

  const equityCurve = useMemo(() => buildEquityCurve(transactions, 1_000_000), [transactions.length])



  // Allocation pie

  const sectorMap = {}

  holdingsList.forEach(h => {

    const sector = h.stock?.sector ?? 'Other'

    sectorMap[sector] = (sectorMap[sector] ?? 0) + h.value

  })

  const pieData = Object.entries(sectorMap).map(([name, value]) => ({ name, value: +value.toFixed(2) }))



  function tickChecklist(id) {

    const next = { ...checklist, [id]: true }

    setChecklist(next)

    localStorage.setItem('fin_checklist', JSON.stringify(next))

  }

  const checkDone = CHECKLIST.filter(c => checklist[c.id]).length

  const checkAllDone = checkDone === CHECKLIST.length



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>



      {/* -- Header -- */}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        <div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.02em' }}>

            {greeting}, {name.split(' ')[0]} 

          </h1>

          <p style={{ fontSize: '.82rem', color: 'var(--tx-3)', marginTop: 3 }}>

            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}

            { ' - ' }

            <span style={{ color: marketOn ? 'var(--up)' : 'var(--tx-3)' }}>

              {marketOn ? 'Market Open' : 'Market Closed'}

            </span>

          </p>

        </div>

      </div>



      {/* -- KPI Row -- */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>

        {[

          {

            label: 'Portfolio Value', icon: <Briefcase size={14} />,

            value: formatINR(portfolioVal.total),

            sub: <PriceChange value={portfolioVal.pnlPct} />,

            accent: 'linear-gradient(90deg,#6366F1,transparent)',

          },

          {

            label: 'Virtual Cash', icon: <DollarSign size={14} />,

            value: formatINR(cash),

            sub: `${formatINRCompact(portfolioVal.total - portfolioVal.cash)} invested`,

            accent: 'linear-gradient(90deg,#22D3EE,transparent)',

          },

          {

            label: 'Total P&L', icon: <TrendingUp size={14} />,

            value: <span style={{ color: portfolioVal.pnl >= 0 ? 'var(--up)' : 'var(--down)' }}>{formatINR(portfolioVal.pnl)}</span>,

            sub: <PriceChange value={portfolioVal.pnlPct} />,

            accent: `linear-gradient(90deg,${portfolioVal.pnl >= 0 ? '#10B981' : '#F43F5E'},transparent)`,

          },

          {

            label: 'Open Positions', icon: <BarChart2 size={14} />,

            value: holdingsList.length,

            sub: `${transactions.length} total trades`,

            accent: 'linear-gradient(90deg,#F59E0B,transparent)',

          },

        ].map((kpi, i) => (

          <motion.div

            key={kpi.label}

            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}

            transition={{ delay: i * 0.06, duration: 0.3 }}

            className="kpi-card"

          >

            <div className="kpi-card__accent" style={{ background: kpi.accent }} />

            <div className="kpi-card__head">

              <span className="kpi-card__icon">{kpi.icon}</span>

              <span className="kpi-card__label">{kpi.label}</span>

            </div>

            <div className="kpi-card__value">

              {loading ? <Skeleton height={26} style={{ width: '70%' }} /> : kpi.value}

            </div>

            <div className="kpi-card__sub">

              {loading ? <Skeleton height={11} style={{ width: '50%' }} /> : kpi.sub}

            </div>

          </motion.div>

        ))}

      </div>



      {/* -- Equity chart + Market overview -- */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>

        {/* Equity curve */}

        <div className="card">

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>

            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)' }}>Portfolio Performance</span>

            <div style={{ display: 'flex', gap: 4 }}>

              {['1W','1M','3M','1Y','ALL'].map(r => (

                <button key={r}

                  onClick={() => setRangeTab(r)}

                  style={{

                    padding: '.22rem .55rem', border: 'none', borderRadius: 6,

                    background: rangeTab === r ? 'var(--accent-bg)' : 'transparent',

                    color: rangeTab === r ? 'var(--accent)' : 'var(--tx-3)',

                    fontSize: '.72rem', fontWeight: 600, cursor: 'pointer',

                  }}

                >{r}</button>

              ))}

            </div>

          </div>

          {loading ? <SkeletonCard height={180} /> : (

            <ResponsiveContainer width="100%" height={180}>

              <AreaChart data={equityCurve} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>

                <defs>

                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">

                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.25} />

                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}    />

                  </linearGradient>

                </defs>

                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--tx-3)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />

                <YAxis hide />

                <RechartTooltip

                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}

                  formatter={v => [formatINR(v), 'Portfolio']}

                  labelStyle={{ color: 'var(--tx-3)' }}

                />

                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#eqGrad)" dot={false} />

              </AreaChart>

            </ResponsiveContainer>

          )}

        </div>



        {/* Market overview */}

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

          <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>Market Overview</span>

          {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height={44} style={{ borderRadius: 8 }} />) : (

            [

              { sym: 'NIFTY 50',    price: 24823, chg: +0.82 },

              { sym: 'SENSEX',      price: 81741, chg: +0.76 },

              { sym: 'BANK NIFTY',  price: 52342, chg: -0.21 },

              { sym: 'NIFTY MID',   price: 14892, chg: +1.14 },

            ].map(idx => (

              <div key={idx.sym} style={{

                display: 'flex', justifyContent: 'space-between', alignItems: 'center',

                background: 'var(--card-hi)', border: '1px solid var(--border)',

                borderRadius: 8, padding: '.55rem .75rem',

              }}>

                <div>

                  <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--tx)' }}>{idx.sym}</div>

                  <div style={{ fontSize: '.68rem', color: 'var(--tx-3)', fontFamily: 'var(--mono)' }}>{idx.price.toLocaleString('en-IN')}</div>

                </div>

                <PriceChange value={idx.chg} size="sm" />

              </div>

            ))

          )}

        </div>

      </div>



      {/* -- Top movers + Holdings -- */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Movers */}

        <div className="card">

          <div style={{ display: 'flex', gap: 4, marginBottom: '1rem' }}>

            {['gainers','losers'].map(t => (

              <button key={t}

                onClick={() => setMoverTab(t)}

                style={{

                  padding: '.3rem .75rem', border: 'none', borderRadius: 20,

                  background: moverTab === t ? (t === 'gainers' ? 'var(--up-bg)' : 'var(--down-bg)') : 'transparent',

                  color: moverTab === t ? (t === 'gainers' ? 'var(--up)' : 'var(--down)') : 'var(--tx-3)',

                  fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',

                }}

              >{t === 'gainers' ? '^ Gainers' : 'v Losers'}</button>

            ))}

          </div>

          {loading ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{Array(4).fill(0).map((_, i) => <Skeleton key={i} height={40} style={{ borderRadius: 8 }} />)}</div> : (

            (moverTab === 'gainers' ? gainers : losers).map(s => (

              <Link key={s.symbol} to={`/app/stocks/${s.symbol}`}

                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.55rem 0', borderBottom: '1px solid var(--border-lo)', textDecoration: 'none' }}

              >

                <div>

                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--tx)' }}>{s.symbol}</div>

                  <div style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{s.name.slice(0, 22)}</div>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '.82rem', color: 'var(--tx)' }}>{formatINR(s.price, 2)}</div>

                  <PriceChange value={s.changePct} size="sm" />

                </div>

              </Link>

            ))

          )}

        </div>



        {/* Holdings snapshot */}

        <div className="card">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)' }}>Holdings</span>

            <Link to="/app/portfolio" style={{ fontSize: '.75rem', color: 'var(--accent)' }}>View all</Link>

          </div>

          {holdingsList.length === 0 ? (

            <EmptyState icon={<Briefcase size={28} />} title="No holdings yet" description="Place a buy order to start building your portfolio." action={() => navigate('/app/trade')} actionLabel="Start trading" />

          ) : (

            holdingsList.slice(0, 5).map(h => (

              <Link key={h.symbol} to={`/app/stocks/${h.symbol}`}

                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.55rem 0', borderBottom: '1px solid var(--border-lo)', textDecoration: 'none' }}

              >

                <div>

                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--tx)' }}>{h.symbol}</div>

                  <div style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{h.qty} shares @ {formatINR(h.avgPrice)}</div>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '.82rem', color: 'var(--tx)' }}>{formatINR(h.value)}</div>

                  <PriceChange value={h.pnlPct} size="sm" />

                </div>

              </Link>

            ))

          )}

        </div>

      </div>



      {/* -- AI Signals -- */}

      <div className="card">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

          <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)' }}>- AI Signals Today</span>

          <Link to="/app/insights" style={{ fontSize: '.75rem', color: 'var(--accent)' }}>See all</Link>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>

          {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} height={100} />) : (

            aiSignals.map(sig => (

              <Link key={sig.symbol} to={`/app/stocks/${sig.symbol}`}

                style={{

                  background: 'var(--card-hi)', border: '1px solid var(--border)',

                  borderRadius: 'var(--r-md)', padding: '1rem', textDecoration: 'none',

                  display: 'flex', flexDirection: 'column', gap: 8,

                  transition: 'border-color .15s', cursor: 'pointer',

                }}

                onMouseEnter={e => e.currentTarget.style.borderColor = SIGNAL_COLORS[sig.signal].border}

                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}

              >

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                  <span style={{ fontWeight: 700, color: 'var(--tx)', fontSize: '.88rem' }}>{sig.symbol}</span>

                  <Badge label={sig.signal} preset={sig.signal} size="sm" />

                </div>

                <div style={{ fontSize: '.7rem', color: 'var(--tx-3)', lineHeight: 1.4 }}>

                  {sig.reasoning.slice(0, 60)}...

                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                  <div style={{

                    flex: 1, height: 4, borderRadius: 2, background: 'var(--border)',

                    overflow: 'hidden',

                  }}>

                    <div style={{

                      height: '100%', borderRadius: 2,

                      width: `${sig.confidence * 100}%`,

                      background: SIGNAL_COLORS[sig.signal].color,

                    }} />

                  </div>

                  <span style={{ fontSize: '.65rem', color: 'var(--tx-3)', fontFamily: 'var(--mono)' }}>

                    {Math.round(sig.confidence * 100)}%

                  </span>

                </div>

              </Link>

            ))

          )}

        </div>

      </div>



      {/* -- News + Quick Actions -- */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem' }}>

        {/* News */}

        <div className="card">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)' }}>Latest News</span>

            <Link to="/app/news" style={{ fontSize: '.75rem', color: 'var(--accent)' }}>View all</Link>

          </div>

          {news.map(n => (

            <div key={n.id} style={{ display: 'flex', gap: 10, padding: '.65rem 0', borderBottom: '1px solid var(--border-lo)', alignItems: 'flex-start' }}>

              <Badge label={n.label} preset={n.label} size="sm" />

              <div>

                <div style={{ fontSize: '.82rem', color: 'var(--tx)', lineHeight: 1.4, marginBottom: 3 }}>{n.headline}</div>

                <div style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{n.source} . {formatRelative(n.publishedAt)}</div>

              </div>

            </div>

          ))}

        </div>



        {/* Quick actions */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="card" style={{ padding: '1rem' }}>

            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '.75rem' }}>Quick Actions</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>

              {QUICK_ACTIONS.map(a => {

                const Icon = a.icon

                return (

                  <Link key={a.to} to={a.to}

                    style={{

                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,

                      background: 'var(--card-hi)', border: '1px solid var(--border)',

                      borderRadius: 'var(--r)', padding: '.75rem .5rem', textDecoration: 'none',

                      transition: 'border-color .15s',

                    }}

                    onMouseEnter={e => e.currentTarget.style.borderColor = a.color + '44'}

                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}

                  >

                    <Icon size={18} style={{ color: a.color }} aria-hidden="true" />

                    <span style={{ fontSize: '.68rem', color: 'var(--tx-2)', textAlign: 'center', fontWeight: 600 }}>{a.label}</span>

                  </Link>

                )

              })}

            </div>

          </div>



          {/* Onboarding checklist */}

          {!checkAllDone && (

            <div className="card" style={{ padding: '1rem' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>

                <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)' }}>Getting Started</span>

                <span style={{ fontSize: '.68rem', color: 'var(--tx-3)' }}>{checkDone}/{CHECKLIST.length}</span>

              </div>

              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '.75rem', overflow: 'hidden' }}>

                <div style={{ height: '100%', borderRadius: 2, background: 'var(--accent)', width: `${(checkDone / CHECKLIST.length) * 100}%`, transition: 'width .3s' }} />

              </div>

              {CHECKLIST.map(c => (

                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.35rem 0', borderBottom: '1px solid var(--border-lo)' }}>

                  <button

                    onClick={() => tickChecklist(c.id)}

                    style={{

                      width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checklist[c.id] ? 'var(--accent)' : 'var(--border)'}`,

                      background: checklist[c.id] ? 'var(--accent)' : 'transparent',

                      color: '#fff', fontSize: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center',

                      cursor: 'pointer', flexShrink: 0,

                    }}

                    aria-label={`Mark "${c.label}" as done`}

                  >{checklist[c.id] ? '"' : ''}</button>

                  <Link to={c.link} style={{ fontSize: '.78rem', color: checklist[c.id] ? 'var(--tx-3)' : 'var(--tx-2)', textDecoration: checklist[c.id] ? 'line-through' : 'none' }}>

                    {c.label}

                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  )

}





