import './TickerTape.css'

// Illustrative symbols only — this is a static UI flourish, not live data.
const SYMBOLS = [
  { sym: 'RELI', price: '2,946.10', delta: '+1.24%', up: true },
  { sym: 'TCS', price: '4,012.55', delta: '-0.38%', up: false },
  { sym: 'INFY', price: '1,801.90', delta: '+0.62%', up: true },
  { sym: 'HDFCB', price: '1,652.20', delta: '+0.15%', up: true },
  { sym: 'ITC', price: '412.35', delta: '-0.92%', up: false },
  { sym: 'SBIN', price: '826.70', delta: '+2.03%', up: true },
  { sym: 'TATAM', price: '968.45', delta: '-1.11%', up: false },
  { sym: 'ADANI', price: '3,102.80', delta: '+0.47%', up: true },
  { sym: 'WIPRO', price: '289.60', delta: '+0.29%', up: true },
  { sym: 'AXISB', price: '1,144.05', delta: '-0.54%', up: false },
]

function TickerTape() {
  const row = [...SYMBOLS, ...SYMBOLS]
  return (
    <div className="ticker" role="presentation" aria-hidden="true">
      <div className="ticker__track">
        {row.map((s, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__sym">{s.sym}</span>
            <span className="ticker__price">{s.price}</span>
            <span className={`ticker__delta ${s.up ? 'is-up' : 'is-down'}`}>
              {s.up ? '▲' : '▼'} {s.delta}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default TickerTape
