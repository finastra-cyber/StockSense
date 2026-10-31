/**
 * Mock AI recommendation signals (BUY / HOLD / SELL)
 * Simulates output of the ML model combining technicals + FinBERT sentiment
 */

export const AI_SIGNALS = {
  RELIANCE:   { signal: 'BUY',  confidence: 0.82, buy: 0.82, hold: 0.13, sell: 0.05, reasoning: 'RSI at 61 (bullish zone), MACD positive crossover, positive news sentiment. SMA50 acting as support.' },
  TCS:        { signal: 'BUY',  confidence: 0.75, buy: 0.75, hold: 0.18, sell: 0.07, reasoning: 'Strong EMA trend, mega deal win boosts positive sentiment. Price above both SMA20 and SMA50.' },
  INFY:       { signal: 'SELL', confidence: 0.68, buy: 0.14, hold: 0.18, sell: 0.68, reasoning: 'Guidance cut triggers negative sentiment. RSI turning down from 55. Price broke below EMA26.' },
  HDFCBANK:   { signal: 'HOLD', confidence: 0.61, buy: 0.22, hold: 0.61, sell: 0.17, reasoning: 'Neutral sentiment on moderated loan growth. RSI at 48, neither overbought nor oversold. Awaiting clarity.' },
  ICICIBANK:  { signal: 'BUY',  confidence: 0.71, buy: 0.71, hold: 0.21, sell: 0.08, reasoning: 'Strong MACD momentum, price above SMA50. Positive news flow from retail banking performance.' },
  SBIN:       { signal: 'BUY',  confidence: 0.74, buy: 0.74, hold: 0.19, sell: 0.07, reasoning: 'Capital raise news is positive. RSI at 58, room to run. EMA12 crossed above EMA26.' },
  ITC:        { signal: 'HOLD', confidence: 0.57, buy: 0.24, hold: 0.57, sell: 0.19, reasoning: 'Mixed signals — cigarette volume dip but FMCG resilience. RSI neutral at 46.' },
  LT:         { signal: 'BUY',  confidence: 0.86, buy: 0.86, hold: 0.11, sell: 0.03, reasoning: 'Massive order book addition. Strong positive sentiment. RSI at 64, SMA trend strongly up.' },
  BHARTIARTL: { signal: 'BUY',  confidence: 0.79, buy: 0.79, hold: 0.15, sell: 0.06, reasoning: 'Infrastructure investment positive for long-term. MACD histogram expanding bullishly.' },
  TATAMOTORS: { signal: 'BUY',  confidence: 0.77, buy: 0.77, hold: 0.16, sell: 0.07, reasoning: 'EV sales surge drives positive sentiment. Price recovering above SMA20 after dip.' },
  WIPRO:      { signal: 'HOLD', confidence: 0.53, buy: 0.26, hold: 0.53, sell: 0.21, reasoning: 'AI hiring positive but revenue growth still muted. RSI at 50 — neutral zone.' },
  AXISBANK:   { signal: 'SELL', confidence: 0.66, buy: 0.12, hold: 0.22, sell: 0.66, reasoning: 'Rising NPA ratio is concerning. Negative sentiment dominates. Price below SMA50.' },
  KOTAKBANK:  { signal: 'HOLD', confidence: 0.58, buy: 0.25, hold: 0.58, sell: 0.17, reasoning: 'Stable fundamentals but premium valuation limits upside. MACD flat.' },
  HCLTECH:    { signal: 'BUY',  confidence: 0.69, buy: 0.69, hold: 0.23, sell: 0.08, reasoning: 'Hiring expansion and delivery center growth signal. Positive outlook confirmed by MACD crossover.' },
  MARUTI:     { signal: 'BUY',  confidence: 0.73, buy: 0.73, hold: 0.20, sell: 0.07, reasoning: 'Market share dominance confirmed. RSI at 59, EMA trend intact. Positive volume data.' },
  SUNPHARMA:  { signal: 'BUY',  confidence: 0.81, buy: 0.81, hold: 0.14, sell: 0.05, reasoning: 'US specialty pharma growth strong. Positive sentiment from revenue beat. RSI at 62.' },
  DRREDDY:    { signal: 'HOLD', confidence: 0.54, buy: 0.22, hold: 0.54, sell: 0.24, reasoning: 'Mixed US generic pipeline news. RSI neutral, MACD signal line crossing.' },
  BAJFINANCE: { signal: 'BUY',  confidence: 0.78, buy: 0.78, hold: 0.16, sell: 0.06, reasoning: 'RBI restriction lift is strongly positive. EMA crossover confirmed. Volume surge on news day.' },
  NESTLEIND:  { signal: 'HOLD', confidence: 0.60, buy: 0.23, hold: 0.60, sell: 0.17, reasoning: 'Defensive FMCG stock. Neutral news flow. RSI at 52, no strong directional bias.' },
  ULTRACEMCO: { signal: 'HOLD', confidence: 0.55, buy: 0.28, hold: 0.55, sell: 0.17, reasoning: 'Infrastructure demand positive long-term but near-term margin pressure from energy costs.' },
  TITAN:      { signal: 'BUY',  confidence: 0.70, buy: 0.70, hold: 0.22, sell: 0.08, reasoning: 'Festive season demand strong. RSI at 57, SMA20 acting as support. Positive sentiment.' },
  ADANIENT:   { signal: 'HOLD', confidence: 0.51, buy: 0.27, hold: 0.51, sell: 0.22, reasoning: 'Volatility remains elevated. Mixed sentiment. RSI at 49, consolidating after big moves.' },
  ONGC:       { signal: 'SELL', confidence: 0.63, buy: 0.15, hold: 0.22, sell: 0.63, reasoning: 'Production decline is a structural concern. Negative sentiment from output miss. Price below SMA50.' },
  POWERGRID:  { signal: 'HOLD', confidence: 0.58, buy: 0.26, hold: 0.58, sell: 0.16, reasoning: 'Steady regulated utility. No significant catalyst. RSI at 51, flat MACD.' },
  NTPC:       { signal: 'BUY',  confidence: 0.66, buy: 0.66, hold: 0.25, sell: 0.09, reasoning: 'Renewable capacity addition positive. EMA12 crossing EMA26. Government policy tailwinds.' },
}

/** Get AI signal for a symbol */
export function getAISignal(symbol) {
  return AI_SIGNALS[symbol?.toUpperCase()] || {
    signal: 'HOLD', confidence: 0.50,
    buy: 0.33, hold: 0.34, sell: 0.33,
    reasoning: 'Insufficient data to generate a confident signal for this symbol.',
  }
}

/** Get all signals as array */
export function getAllSignals() {
  return Object.entries(AI_SIGNALS).map(([symbol, sig]) => ({ symbol, ...sig }))
}
