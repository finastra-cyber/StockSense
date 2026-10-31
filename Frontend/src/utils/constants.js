/** App-wide constants */

export const SIDE = { BUY: 'BUY', SELL: 'SELL' }

export const SIGNAL = { BUY: 'BUY', HOLD: 'HOLD', SELL: 'SELL' }

export const SENTIMENT = { POSITIVE: 'positive', NEUTRAL: 'neutral', NEGATIVE: 'negative' }

export const STARTING_CASH = 1_000_000 // ₹10,00,000

export const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

export const MARKET_OPEN_HOUR  = 9
export const MARKET_OPEN_MIN   = 15
export const MARKET_CLOSE_HOUR = 15
export const MARKET_CLOSE_MIN  = 30

/** Check if market is open (IST, weekdays 9:15-15:30) */
export function isMarketOpen() {
  const now = new Date()
  // Convert to IST (UTC+5:30)
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay()
  if (day === 0 || day === 6) return false // Sat/Sun
  const h = ist.getHours(), m = ist.getMinutes()
  const mins = h * 60 + m
  const open  = MARKET_OPEN_HOUR  * 60 + MARKET_OPEN_MIN
  const close = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MIN
  return mins >= open && mins <= close
}

export const SIGNAL_COLORS = {
  BUY:  { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  HOLD: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  SELL: { color: '#F43F5E', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)'  },
}

export const SECTOR_COLORS = {
  'IT':           '#6366F1',
  'Banking':      '#22D3EE',
  'Energy':       '#F59E0B',
  'Auto':         '#10B981',
  'Pharma':       '#8B5CF6',
  'FMCG':         '#F43F5E',
  'Metal':        '#94A3B8',
  'Telecom':      '#34D399',
  'Infrastructure':'#FB923C',
  'Finance':      '#60A5FA',
}
