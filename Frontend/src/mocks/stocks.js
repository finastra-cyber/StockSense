/**
 * Mock stock data for FinAstra
 * ~25 Indian stocks + indices with deterministic OHLCV generation
 */

export const STOCKS = [
  { symbol: 'RELIANCE',   name: 'Reliance Industries Ltd',      sector: 'Energy',       exchange: 'NSE', basePrice: 2946, marketCap: 1993000 },
  { symbol: 'TCS',        name: 'Tata Consultancy Services',    sector: 'IT',            exchange: 'NSE', basePrice: 4012, marketCap: 1452000 },
  { symbol: 'INFY',       name: 'Infosys Ltd',                  sector: 'IT',            exchange: 'NSE', basePrice: 1801, marketCap: 748000  },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank Ltd',                sector: 'Banking',       exchange: 'NSE', basePrice: 1652, marketCap: 1254000 },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd',               sector: 'Banking',       exchange: 'NSE', basePrice: 1244, marketCap: 874000  },
  { symbol: 'SBIN',       name: 'State Bank of India',          sector: 'Banking',       exchange: 'NSE', basePrice: 826,  marketCap: 737000  },
  { symbol: 'ITC',        name: 'ITC Ltd',                      sector: 'FMCG',          exchange: 'NSE', basePrice: 412,  marketCap: 515000  },
  { symbol: 'LT',         name: 'Larsen & Toubro Ltd',          sector: 'Infrastructure',exchange: 'NSE', basePrice: 3678, marketCap: 518000  },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd',            sector: 'Telecom',       exchange: 'NSE', basePrice: 1892, marketCap: 1127000 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd',              sector: 'Auto',          exchange: 'NSE', basePrice: 968,  marketCap: 356000  },
  { symbol: 'WIPRO',      name: 'Wipro Ltd',                    sector: 'IT',            exchange: 'NSE', basePrice: 289,  marketCap: 302000  },
  { symbol: 'AXISBANK',   name: 'Axis Bank Ltd',                sector: 'Banking',       exchange: 'NSE', basePrice: 1144, marketCap: 352000  },
  { symbol: 'KOTAKBANK',  name: 'Kotak Mahindra Bank',          sector: 'Banking',       exchange: 'NSE', basePrice: 1892, marketCap: 376000  },
  { symbol: 'HCLTECH',    name: 'HCL Technologies Ltd',         sector: 'IT',            exchange: 'NSE', basePrice: 1756, marketCap: 477000  },
  { symbol: 'MARUTI',     name: 'Maruti Suzuki India',          sector: 'Auto',          exchange: 'NSE', basePrice: 12834,marketCap: 388000  },
  { symbol: 'SUNPHARMA',  name: 'Sun Pharmaceutical Industries',sector: 'Pharma',        exchange: 'NSE', basePrice: 1782, marketCap: 427000  },
  { symbol: 'DRREDDY',    name: "Dr. Reddy's Laboratories",     sector: 'Pharma',        exchange: 'NSE', basePrice: 6744, marketCap: 112000  },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd',            sector: 'Finance',       exchange: 'NSE', basePrice: 7134, marketCap: 431000  },
  { symbol: 'NESTLEIND',  name: 'Nestlé India Ltd',             sector: 'FMCG',          exchange: 'NSE', basePrice: 2456, marketCap: 236000  },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd',         sector: 'Infrastructure',exchange: 'NSE', basePrice: 11234,marketCap: 324000  },
  { symbol: 'TITAN',      name: 'Titan Company Ltd',            sector: 'FMCG',          exchange: 'NSE', basePrice: 3456, marketCap: 307000  },
  { symbol: 'ADANIENT',   name: 'Adani Enterprises Ltd',        sector: 'Infrastructure',exchange: 'NSE', basePrice: 3102, marketCap: 352000  },
  { symbol: 'ONGC',       name: 'Oil & Natural Gas Corp',       sector: 'Energy',        exchange: 'NSE', basePrice: 274,  marketCap: 344000  },
  { symbol: 'POWERGRID',  name: 'Power Grid Corporation',       sector: 'Energy',        exchange: 'NSE', basePrice: 344,  marketCap: 320000  },
  { symbol: 'NTPC',       name: 'NTPC Ltd',                     sector: 'Energy',        exchange: 'NSE', basePrice: 389,  marketCap: 378000  },
]

export const INDICES = [
  { symbol: 'NIFTY50',   name: 'Nifty 50',       basePrice: 24823, change: +0.82 },
  { symbol: 'SENSEX',    name: 'BSE Sensex',      basePrice: 81741, change: +0.76 },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank',      basePrice: 52342, change: -0.21 },
  { symbol: 'NIFTYMID',  name: 'Nifty Midcap 50', basePrice: 14892, change: +1.14 },
]

/** Seeded pseudo-random number generator (deterministic) */
function seededRand(seed) {
  let s = seed
  return function() {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/**
 * Generate realistic OHLCV candlestick history
 * @param {number} basePrice
 * @param {number} days
 * @param {number} seed
 */
export function generateOHLCV(basePrice, days = 365, seed = 42) {
  const rand = seededRand(seed * basePrice)
  const candles = []
  let price = basePrice * (0.70 + rand() * 0.30) // start ~70-100% of base

  const now = Date.now()
  const dayMs = 86400000

  for (let i = days; i >= 0; i--) {
    const ts = now - i * dayMs
    // Skip weekends
    const d = new Date(ts).getDay()
    if (d === 0 || d === 6) continue

    const drift     = 0.0003 * rand() // slight upward bias
    const volatility = 0.015 + rand() * 0.02
    const change    = (rand() - 0.48) * volatility + drift
    const open      = price
    const closeRaw  = open * (1 + change)
    const high      = Math.max(open, closeRaw) * (1 + rand() * 0.012)
    const low       = Math.min(open, closeRaw) * (1 - rand() * 0.012)
    const close     = closeRaw
    const volume    = Math.floor(1_000_000 + rand() * 9_000_000)

    candles.push({
      time:   Math.floor(ts / 1000), // Unix timestamp (seconds)
      open:   +open.toFixed(2),
      high:   +high.toFixed(2),
      low:    +low.toFixed(2),
      close:  +close.toFixed(2),
      volume,
    })
    price = close
  }
  return candles
}

/** Get stock by symbol */
export function getStock(symbol) {
  return STOCKS.find(s => s.symbol === symbol?.toUpperCase()) || null
}

/** Get live price (deterministic based on current minute — stable for the session) */
export function getLivePrice(symbol) {
  const stock = getStock(symbol)
  if (!stock) return null
  const candles = generateOHLCV(stock.basePrice, 365, stock.symbol.charCodeAt(0))
  return candles[candles.length - 1]?.close ?? stock.basePrice
}

/** Search stocks by symbol or name */
export function searchStocks(query) {
  const q = query.toLowerCase()
  return STOCKS.filter(s =>
    s.symbol.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q)
  ).slice(0, 8)
}
