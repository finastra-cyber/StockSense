/**
 * Technical indicator computations for FinAstra
 * Pure functions — unit-testable, no side effects
 * All inputs are arrays of OHLCV objects: { time, open, high, low, close, volume }
 */

/** Simple Moving Average */
export function computeSMA(closes, period) {
  const result = []
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) { result.push(null); continue }
    const slice = closes.slice(i - period + 1, i + 1)
    result.push(slice.reduce((s, v) => s + v, 0) / period)
  }
  return result
}

/** Exponential Moving Average */
export function computeEMA(closes, period) {
  const result = []
  const k = 2 / (period + 1)
  let ema = null
  for (let i = 0; i < closes.length; i++) {
    if (ema === null) {
      // Seed with SMA of first `period` values
      if (i < period - 1) { result.push(null); continue }
      ema = closes.slice(0, period).reduce((s, v) => s + v, 0) / period
    } else {
      ema = closes[i] * k + ema * (1 - k)
    }
    result.push(ema)
  }
  return result
}

/**
 * RSI — Wilder's smoothed method
 * Returns array of null or [0..100] values
 */
export function computeRSI(closes, period = 14) {
  const result = Array(closes.length).fill(null)
  if (closes.length < period + 1) return result

  let gains = 0, losses = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff >= 0) gains += diff
    else losses += Math.abs(diff)
  }
  let avgGain = gains / period
  let avgLoss = losses / period

  for (let i = period; i < closes.length; i++) {
    if (i === period) {
      const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss
      result[i] = 100 - 100 / (1 + rs)
      continue
    }
    const diff = closes[i] - closes[i - 1]
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period
    const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss
    result[i] = 100 - 100 / (1 + rs)
  }
  return result
}

/**
 * MACD — MACD line, Signal line (EMA9 of MACD), Histogram
 */
export function computeMACD(closes, fast = 12, slow = 26, signal = 9) {
  const emaFast = computeEMA(closes, fast)
  const emaSlow = computeEMA(closes, slow)
  const macdLine = closes.map((_, i) =>
    emaFast[i] != null && emaSlow[i] != null ? emaFast[i] - emaSlow[i] : null
  )
  // Compute EMA9 of MACD line (skip nulls)
  const macdValues = macdLine.filter(v => v !== null)
  const signalRaw = computeEMA(macdValues, signal)
  // Re-map signal back to original indices
  let sigIdx = 0
  const signalLine = macdLine.map(v => {
    if (v === null) return null
    const s = signalRaw[sigIdx] ?? null
    sigIdx++
    return s
  })
  const histogram = macdLine.map((v, i) =>
    v != null && signalLine[i] != null ? v - signalLine[i] : null
  )
  return { macdLine, signalLine, histogram }
}

/**
 * Compute all indicators from OHLCV array
 * Returns { sma20, sma50, ema12, ema26, rsi, macd }
 */
export function computeAllIndicators(ohlcv) {
  const closes = ohlcv.map(c => c.close)
  const sma20 = computeSMA(closes, 20)
  const sma50 = computeSMA(closes, 50)
  const ema12 = computeEMA(closes, 12)
  const ema26 = computeEMA(closes, 26)
  const rsi   = computeRSI(closes, 14)
  const macd  = computeMACD(closes)
  return { sma20, sma50, ema12, ema26, rsi, macd, closes }
}

/** Get current (latest) indicator values */
export function getLatestIndicators(ohlcv) {
  const ind = computeAllIndicators(ohlcv)
  const last = ind.closes.length - 1
  return {
    sma20: ind.sma20[last],
    sma50: ind.sma50[last],
    ema12: ind.ema12[last],
    ema26: ind.ema26[last],
    rsi:   ind.rsi[last],
    macd:  ind.macd.macdLine[last],
    macdSignal: ind.macd.signalLine[last],
    macdHist:   ind.macd.histogram[last],
  }
}
