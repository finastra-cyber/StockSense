import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import DashboardChart from '../components/DashboardChart.jsx'
import './Dashboard.css'

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'charts', label: 'Charts' },
  { id: 'trade', label: 'Paper trading' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'news', label: 'News & AI insights' },
  { id: 'watchlist', label: 'Watchlist' },
]

const TRENDING = [
  { sym: 'RELI', name: 'Reliance Industries', price: '2,946.10', delta: '+1.24%', up: true },
  { sym: 'TCS', name: 'Tata Consultancy', price: '4,012.55', delta: '-0.38%', up: false },
  { sym: 'INFY', name: 'Infosys', price: '1,801.90', delta: '+0.62%', up: true },
  { sym: 'SBIN', name: 'State Bank of India', price: '826.70', delta: '+2.03%', up: true },
  { sym: 'ADANI', name: 'Adani Enterprises', price: '3,102.80', delta: '+0.47%', up: true },
]

const INDICATORS = [
  { key: 'SMA', label: 'SMA (50)', value: '2,881.40' },
  { key: 'EMA', label: 'EMA (21)', value: '2,918.75' },
  { key: 'RSI', label: 'RSI (14)', value: '61.2' },
  { key: 'MACD', label: 'MACD', value: '+8.4', up: true },
]

const HOLDINGS = [
  { sym: 'RELI', qty: 12, avg: '2,810.00', ltp: '2,946.10', pnl: '+1,633.20', up: true },
  { sym: 'INFY', qty: 25, avg: '1,845.20', ltp: '1,801.90', pnl: '-1,082.50', up: false },
  { sym: 'TCS', qty: 6, avg: '3,950.00', ltp: '4,012.55', pnl: '+375.30', up: true },
]

const NEWS = [
  {
    headline: 'Reliance Q1 profit beats estimates on retail, telecom growth',
    source: 'Reuters · 2h ago',
    sentiment: 'Positive',
    score: 78,
    verdict: 'BUY',
  },
  {
    headline: 'IT sector outlook cautious amid weak US client spending',
    source: 'Mint · 5h ago',
    sentiment: 'Negative',
    score: 34,
    verdict: 'HOLD',
  },
  {
    headline: 'SBI raises deposit rates ahead of festive credit demand',
    source: 'Business Standard · 1d ago',
    sentiment: 'Positive',
    score: 66,
    verdict: 'BUY',
  },
]

const WATCHLIST = [
  { sym: 'HDFCB', name: 'HDFC Bank', price: '1,652.20', delta: '+0.15%', up: true },
  { sym: 'ITC', name: 'ITC Ltd', price: '412.35', delta: '-0.92%', up: false },
  { sym: 'WIPRO', name: 'Wipro', price: '289.60', delta: '+0.29%', up: true },
  { sym: 'AXISB', name: 'Axis Bank', price: '1,144.05', delta: '-0.54%', up: false },
]

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Dashboard() {
  const { user, logout } = useAuth()
  const [orderSide, setOrderSide] = useState('buy')
  const [symbol, setSymbol] = useState('RELI')
  const [qty, setQty] = useState(10)

  const displayName = user?.name || 'Trader'

  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__brand">
          StockSense<span className="dot">.</span>
        </div>
        <nav className="dash__nav">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="dash__nav-link">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="dash__balance">
          <span>Virtual balance</span>
          <strong>₹8,42,610.50</strong>
        </div>
      </aside>

      <div className="dash__main">
        <header className="dash__topbar">
          <div>
            <span className="dash__eyebrow">Educational signal · not financial advice</span>
            <h1>Welcome back, {displayName.split(' ')[0]}</h1>
          </div>
          <div className="dash__user">
            <span className="dash__avatar">{initials(displayName)}</span>
            <button type="button" className="btn" onClick={logout}>
              Log out
            </button>
          </div>
        </header>

        <section id="overview" className="panel panel--wide">
          <div className="panel__head">
            <h2>Market overview · Trending stocks</h2>
            <span className="panel__meta">Illustrative data</span>
          </div>
          <div className="trending">
            {TRENDING.map((s) => (
              <div className="trending__item" key={s.sym}>
                <div>
                  <span className="trending__sym">{s.sym}</span>
                  <span className="trending__name">{s.name}</span>
                </div>
                <div className="trending__right">
                  <span className="trending__price">₹{s.price}</span>
                  <span className={s.up ? 'is-up' : 'is-down'}>
                    {s.up ? '▲' : '▼'} {s.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="charts" className="panel panel--wide">
          <div className="panel__head">
            <h2>Charts &amp; indicators</h2>
            <span className="panel__meta">RELI · 1D</span>
          </div>
          <div className="chart-panel">
            <DashboardChart />
            <div className="chart-panel__indicators">
              {INDICATORS.map((i) => (
                <div className="indicator-chip" key={i.key}>
                  <span>{i.label}</span>
                  <strong className={i.up ? 'is-up' : ''}>{i.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="panel-row">
          <section id="trade" className="panel">
            <div className="panel__head">
              <h2>Paper trading</h2>
              <span className="panel__meta">Virtual funds</span>
            </div>
            <form
              className="trade-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="trade-form__toggle">
                <button
                  type="button"
                  className={orderSide === 'buy' ? 'is-active is-buy' : ''}
                  onClick={() => setOrderSide('buy')}
                >
                  Buy
                </button>
                <button
                  type="button"
                  className={orderSide === 'sell' ? 'is-active is-sell' : ''}
                  onClick={() => setOrderSide('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="field">
                <label htmlFor="symbol">Symbol</label>
                <input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="field">
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className={`btn btn--block ${orderSide === 'buy' ? 'btn--primary' : 'btn--danger'}`}
              >
                Place {orderSide === 'buy' ? 'buy' : 'sell'} order (paper)
              </button>
            </form>
          </section>

          <section id="portfolio" className="panel panel--grow">
            <div className="panel__head">
              <h2>Portfolio · Holdings</h2>
              <span className="panel__meta is-up">+₹926.00 today</span>
            </div>
            <table className="holdings">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg. price</th>
                  <th>LTP</th>
                  <th>P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {HOLDINGS.map((h) => (
                  <tr key={h.sym}>
                    <td className="holdings__sym">{h.sym}</td>
                    <td>{h.qty}</td>
                    <td>₹{h.avg}</td>
                    <td>₹{h.ltp}</td>
                    <td className={h.up ? 'is-up' : 'is-down'}>₹{h.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="panel-row">
          <section id="news" className="panel panel--grow">
            <div className="panel__head">
              <h2>News &amp; AI insights</h2>
              <span className="panel__meta">FinBERT sentiment</span>
            </div>
            <ul className="news-list">
              {NEWS.map((n) => (
                <li className="news-item" key={n.headline}>
                  <div className="news-item__top">
                    <span
                      className={`sentiment-tag ${
                        n.sentiment === 'Positive' ? 'is-up' : 'is-down'
                      }`}
                    >
                      {n.sentiment} · {n.score}
                    </span>
                    <span className={`verdict-tag verdict-tag--${n.verdict.toLowerCase()}`}>
                      {n.verdict}
                    </span>
                  </div>
                  <p>{n.headline}</p>
                  <span className="news-item__source">{n.source}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="watchlist" className="panel">
            <div className="panel__head">
              <h2>Watchlist</h2>
              <span className="panel__meta">4 tracked</span>
            </div>
            <ul className="watchlist">
              {WATCHLIST.map((w) => (
                <li key={w.sym}>
                  <div>
                    <span className="watchlist__sym">★ {w.sym}</span>
                    <span className="watchlist__name">{w.name}</span>
                  </div>
                  <div className="watchlist__right">
                    <span>₹{w.price}</span>
                    <span className={w.up ? 'is-up' : 'is-down'}>{w.delta}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
