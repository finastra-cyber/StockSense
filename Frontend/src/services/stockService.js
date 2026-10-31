/**
 * Stock detail service
 * GET /api/stocks/:symbol
 * GET /api/stocks/:symbol/history?tf=1D|1W|1M|3M|1Y|ALL
 */
import api from './api.js'
import { getStock, generateOHLCV } from '../mocks/stocks.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

const TF_DAYS = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 730 }

export async function fetchStockDetail(symbol) {
  if (USE_MOCKS) {
    await delay(300)
    const stock = getStock(symbol)
    if (!stock) throw new Error(`Symbol "${symbol}" not found`)
    const candles = generateOHLCV(stock.basePrice, 5, stock.symbol.charCodeAt(0))
    const latest  = candles[candles.length - 1]
    const prev    = candles[candles.length - 2]
    const change    = latest.close - prev.close
    const changePct = (change / prev.close) * 100
    return {
      ...stock,
      price:     +latest.close.toFixed(2),
      prevClose: +prev.close.toFixed(2),
      open:      +latest.open.toFixed(2),
      high:      +latest.high.toFixed(2),
      low:       +latest.low.toFixed(2),
      volume:    latest.volume,
      change:    +change.toFixed(2),
      changePct: +changePct.toFixed(2),
      week52High: +(stock.basePrice * 1.35).toFixed(2),
      week52Low:  +(stock.basePrice * 0.72).toFixed(2),
    }
  }
  const res = await api.get(`/api/stocks/${symbol}`)
  return res.data
}

export async function fetchStockHistory(symbol, timeframe = '1M') {
  if (USE_MOCKS) {
    await delay(400)
    const stock = getStock(symbol)
    if (!stock) throw new Error(`Symbol "${symbol}" not found`)
    const days = TF_DAYS[timeframe] ?? 30
    const allCandles = generateOHLCV(stock.basePrice, 730, stock.symbol.charCodeAt(0) + 1)
    return allCandles.slice(-days)
  }
  const res = await api.get(`/api/stocks/${symbol}/history`, { params: { tf: timeframe } })
  return res.data
}
