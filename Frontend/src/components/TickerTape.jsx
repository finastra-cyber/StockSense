// Ticker tape — styles in src/index.css
const SYMBOLS = [
  { sym: "RELIANCE",  price: "2,946.10", delta: "+1.24%", up: true  },
  { sym: "TCS",       price: "4,012.55", delta: "-0.38%", up: false },
  { sym: "INFY",      price: "1,801.90", delta: "+0.62%", up: true  },
  { sym: "HDFCBANK",  price: "1,652.20", delta: "+0.15%", up: true  },
  { sym: "ITC",       price: "412.35",   delta: "-0.92%", up: false },
  { sym: "SBIN",      price: "826.70",   delta: "+2.03%", up: true  },
  { sym: "TATAMOTORS",price: "968.45",   delta: "-1.11%", up: false },
  { sym: "ADANIENT",  price: "3,102.80", delta: "+0.47%", up: true  },
  { sym: "WIPRO",     price: "289.60",   delta: "+0.29%", up: true  },
  { sym: "AXISBANK",  price: "1,144.05", delta: "-0.54%", up: false },
  { sym: "BHARTIARTL",price: "1,892.00", delta: "+1.05%", up: true  },
  { sym: "LT",        price: "3,678.00", delta: "+0.83%", up: true  },
]

export default function TickerTape() {
  const row = [...SYMBOLS, ...SYMBOLS]
  return (
    <div className="ticker" role="presentation" aria-hidden="true">
      <div className="ticker__track">
        {row.map((s, i) => (
          <span className="ticker__item" key={i}>
            <span className="ticker__sym">{s.sym}</span>
            <span className="ticker__price">{s.price}</span>
            <span className={`ticker__delta ${s.up ? "is-up" : "is-down"}`}>
              {s.up ? "▲" : "▼"} {s.delta}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
