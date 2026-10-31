/**
 * Market service
 * GET /api/markets/indices
 * GET /api/markets/stocks
 * GET /api/markets/search?q=...
 */
import api from './api.js'
import { STOCKS, INDICES, generateOHLCV, searchStocks } from '../mocks/stocks.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

/** Enrich stock with current price info */
function enrichStock(stock) {
  const candles = generateOHLCV(stock.basePrice, 2, stock.symbol.charCodeAt(0))
  const prev  = candles[candles.length - 2]?.close ?? stock.basePrice
  const curr  = candles[candles.length - 1]?.close ?? stock.basePrice
  const change    = curr - prev
  const changePct = (change / prev) * 100
  return {
    ...stock,
    price:     +curr.toFixed(2),
    prevClose: +prev.toFixed(2),
    change:    +change.toFixed(2),
    changePct: +changePct.toFixed(2),
    volume:    Math.floor(1_000_000 + (stock.basePrice * 1237) % 9_000_000),
    week52High: +(stock.basePrice * 1.35).toFixed(2),
    week52Low:  +(stock.basePrice * 0.72).toFixed(2),
  }
}

export async function fetchIndices() {
  if (USE_MOCKS) {
    await delay(300)
    return INDICES.map(idx => {
      const price = idx.basePrice
      const change = price * idx.change / 100
      return { ...idx, price: +price.toFixed(2), change: +change.toFixed(2), changePct: idx.change }
    })
  }
  const res = await api.get('/api/markets/indices')
  return res.data
}

export async function fetchStocks() {
  if (USE_MOCKS) {
    await delay(500)
    return STOCKS.map(enrichStock)
  }
  const res = await api.get('/api/markets/stocks')
  return res.data
}

export async function fetchSearch(query) {
  if (USE_MOCKS) {
    await delay(200)
    return searchStocks(query).map(enrichStock)
  }
  const res = await api.get('/api/markets/search', { params: { q: query } })
  return res.data
}
