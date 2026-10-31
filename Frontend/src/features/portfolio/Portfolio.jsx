import { useMemo } from 'react'

import { Link } from 'react-router-dom'

import { PieChart, Pie, Cell, Tooltip as RechartTooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'

import { useDocTitle }    from '../../hooks/useDocTitle.js'

import { usePriceTicker } from '../../hooks/usePriceTicker.js'

import { useTradeStore }  from '../../store/tradeStore.js'

import { STOCKS, generateOHLCV } from '../../mocks/stocks.js'

import { formatINR, formatINRCompact, formatPct, formatDate } from '../../utils/formatters.js'

import { SECTOR_COLORS, STARTING_CASH }  from '../../utils/constants.js'

import PriceChange  from '../../components/ui/PriceChange.jsx'

import EmptyState   from '../../components/ui/EmptyState.jsx'

import Tooltip      from '../../components/ui/Tooltip.jsx'



function buildEquityCurve(transactions) {
  const now = Date.now()
  let val = STARTING_CASH
  let s = STARTING_CASH + transactions.length * 137
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  return Array.from({ length: 60 }, (_, i) => {
    val *= (1 + (rand() - 0.47) * 0.01)
    return {
      date: formatDate(now - (59 - i) * 86400000, { month: 'short', day: '2-digit' }),
      value: +val.toFixed(2),
    }
  })
}





export default function Portfolio() {

  useDocTitle('Portfolio')

  const { cash, holdings, transactions, getPortfolioValue } = useTradeStore()

  const symbols = Object.keys(holdings)

  const { prices } = usePriceTicker(symbols)



  const holdingsList = Object.entries(holdings).map(([sym, h]) => {

    const price  = prices[sym] ?? h.avgPrice

    const value  = price * h.qty

    const pnl    = (price - h.avgPrice) * h.qty

    const pnlPct = ((price / h.avgPrice) - 1) * 100

    const stock  = STOCKS.find(s => s.symbol === sym)

    return { symbol: sym, ...h, price, value, pnl, pnlPct, sector: stock?.sector ?? 'Other' }

  })



  const portfolioVal = getPortfolioValue(prices)

  const invested     = holdingsList.reduce((s, h) => s + h.qty * h.avgPrice, 0)

  const totalVal     = cash + holdingsList.reduce((s, h) => s + h.value, 0)



  // Sector allocation

  const sectorMap = {}

  holdingsList.forEach(h => {

    sectorMap[h.sector] = (sectorMap[h.sector] ?? 0) + h.value

  })

  const pieData = Object.entries(sectorMap).map(([name, value]) => ({ name, value: +value.toFixed(2) }))



  // Equity curve

  const equityCurve = useMemo(() => buildEquityCurve(transactions), [transactions.length])



  // Performance metrics (simplified from project formulas)

  const returns = equityCurve.map((d, i) => i === 0 ? 0 : (d.value - equityCurve[i-1].value) / equityCurve[i-1].value)

  const meanReturn = returns.reduce((s, r) => s + r, 0) / returns.length

  const stdDev = Math.sqrt(returns.reduce((s, r) => s + Math.pow(r - meanReturn, 2), 0) / returns.length)

  const sharpe = stdDev > 0 ? ((meanReturn * 252) / (stdDev * Math.sqrt(252))).toFixed(2) : '-'

  const peak = equityCurve.reduce((m, d) => Math.max(m, d.value), 0)

  const maxDD = ((peak - Math.min(...equityCurve.map(d => d.value))) / peak * 100).toFixed(2)



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Portfolio</h1>

          <p className="page-header__sub">Your virtual holdings and performance metrics</p>

        </div>

      </div>



      {/* KPIs */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>

        {[

          { label: 'Total Value',   value: formatINR(totalVal),             accent: '#6366F1' },

          { label: 'Invested',      value: formatINR(invested),             accent: '#22D3EE' },

          { label: 'Total P&L',     value: <span style={{ color: portfolioVal.pnl >= 0 ? 'var(--up)' : 'var(--down)' }}>{formatINR(portfolioVal.pnl)}</span>, accent: portfolioVal.pnl >= 0 ? '#10B981' : '#F43F5E' },

          { label: 'Cash',          value: formatINR(cash),                 accent: '#F59E0B' },

        ].map(kpi => (

          <div key={kpi.label} className="kpi-card">

            <div className="kpi-card__accent" style={{ background: `linear-gradient(90deg,${kpi.accent},transparent)` }} />

            <div className="kpi-card__label">{kpi.label}</div>

            <div className="kpi-card__value">{kpi.value}</div>

          </div>

        ))}

      </div>



      {/* Equity curve + Allocation pie */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem' }}>

        <div className="card">

          <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Equity Curve</div>

          <ResponsiveContainer width="100%" height={200}>

            <AreaChart data={equityCurve}>

              <defs>

                <linearGradient id="eqG2" x1="0" y1="0" x2="0" y2="1">

                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.22} />

                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}    />

                </linearGradient>

              </defs>

              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--tx-3)' }} tickLine={false} axisLine={false} interval={9} />

              <YAxis hide />

              <RechartTooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={v => [formatINR(v), 'Value']} />

              <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#eqG2)" dot={false} />

            </AreaChart>

          </ResponsiveContainer>

        </div>



        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>

          <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)' }}>Allocation</div>

          {pieData.length === 0 ? (

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx-3)', fontSize: '.82rem' }}>No holdings</div>

          ) : (

            <>

              <ResponsiveContainer width="100%" height={140}>

                <PieChart>

                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">

                    {pieData.map((entry, i) => (

                      <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] ?? '#6366F1'} />

                    ))}

                  </Pie>

                  <RechartTooltip formatter={v => [formatINR(v)]} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />

                </PieChart>

              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {pieData.map(d => (

                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem' }}>

                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>

                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: SECTOR_COLORS[d.name] ?? '#6366F1', display: 'inline-block' }} />

                      <span style={{ color: 'var(--tx-2)' }}>{d.name}</span>

                    </span>

                    <span style={{ color: 'var(--tx-3)', fontFamily: 'var(--mono)' }}>{formatINRCompact(d.value)}</span>

                  </div>

                ))}

              </div>

            </>

          )}

        </div>

      </div>



      {/* Performance metrics */}

      <div className="card">

        <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Performance Metrics</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>

          {[

            { label: 'Total Return', value: formatPct(portfolioVal.pnlPct), tooltip: 'Percentage change from starting capital of  10,00,000', color: portfolioVal.pnlPct >= 0 ? 'var(--up)' : 'var(--down)' },

            { label: 'Sharpe Ratio', value: sharpe, tooltip: 'Annualised return / annualised volatility. Higher is better. Computed from the equity curve.', color: 'var(--tx)' },

            { label: 'Max Drawdown', value: `-${maxDD}%`, tooltip: 'Largest peak-to-trough decline in the equity curve.', color: 'var(--down)' },

            { label: 'Total Trades', value: transactions.length, tooltip: 'Number of executed paper trades.', color: 'var(--tx)' },

          ].map(m => (

            <div key={m.label} style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.85rem' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>

                <span style={{ fontSize: '.62rem', color: 'var(--tx-3)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{m.label}</span>

                <Tooltip content={m.tooltip}>

                  <span style={{ fontSize: '.6rem', background: 'var(--border)', borderRadius: '50%', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', color: 'var(--tx-3)' }}>?</span>

                </Tooltip>

              </div>

              <div style={{ fontFamily: 'var(--mono)', fontSize: '1.15rem', fontWeight: 700, color: m.color }}>{m.value}</div>

            </div>

          ))}

        </div>

      </div>



      {/* Holdings table */}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>

          <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--tx)' }}>Holdings</span>

        </div>

        {holdingsList.length === 0 ? (

          <EmptyState icon="" title="No open positions" description="Head to Paper Trading to place your first order." action={() => window.location.href = '/app/trade'} actionLabel="Start trading" />

        ) : (

          <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>

              <thead>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>

                  {['Symbol','Qty','Avg Buy','LTP','Value','P&L','Weight','Action'].map(h => (

                    <th key={h} style={{ padding: '.75rem 1rem', textAlign: h === 'Symbol' || h === 'Action' ? 'left' : 'right', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>{h}</th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {holdingsList.map(h => {

                  const weight = totalVal > 0 ? (h.value / totalVal) * 100 : 0

                  return (

                    <tr key={h.symbol} style={{ borderBottom: '1px solid var(--border-lo)' }}>

                      <td style={{ padding: '.75rem 1rem' }}>

                        <Link to={`/app/stocks/${h.symbol}`} style={{ fontWeight: 700, color: 'var(--tx)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>{h.symbol}</Link>

                        <div style={{ fontSize: '.65rem', color: 'var(--tx-3)' }}>{h.sector}</div>

                      </td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx-2)' }}>{h.qty}</td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx-2)' }}>{formatINR(h.avgPrice)}</td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx)' }}>{formatINR(h.price)}</td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx)' }}>{formatINR(h.value)}</td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right' }}>

                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.82rem', color: h.pnl >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>{formatINR(h.pnl)}</div>

                        <PriceChange value={h.pnlPct} size="sm" />

                      </td>

                      <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontSize: '.78rem', fontFamily: 'var(--mono)', color: 'var(--tx-3)' }}>

                        {weight.toFixed(1)}%

                      </td>

                      <td style={{ padding: '.75rem 1rem' }}>

                        <Link to={`/app/trade?symbol=${h.symbol}&side=SELL`} className="btn btn--sm btn--danger" style={{ padding: '.22rem .55rem', fontSize: '.68rem' }}>Sell</Link>

                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  )

}



