/**
 * AI recommendation service
 * GET /api/ai/recommendation/:symbol
 * GET /api/ai/recommendations (all tracked)
 */
import api from './api.js'
import { getAISignal, getAllSignals } from '../mocks/aiSignals.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

export async function fetchRecommendation(symbol) {
  if (USE_MOCKS) {
    await delay(400)
    return getAISignal(symbol)
  }
  const res = await api.get(`/api/ai/recommendation/${symbol}`)
  return res.data
}

export async function fetchAllRecommendations() {
  if (USE_MOCKS) {
    await delay(500)
    return getAllSignals()
  }
  const res = await api.get('/api/ai/recommendations')
  return res.data
}
