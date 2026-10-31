/**
 * News & sentiment service
 * GET /api/news?symbol=...
 * GET /api/news/sentiment/summary
 */
import api from './api.js'
import { getNews, getSentimentSummary } from '../mocks/news.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

export async function fetchNews(symbol = null) {
  if (USE_MOCKS) {
    await delay(350)
    return getNews(symbol)
  }
  const res = await api.get('/api/news', { params: symbol ? { symbol } : {} })
  return res.data
}

export async function fetchSentimentSummary(symbol = null) {
  if (USE_MOCKS) {
    await delay(250)
    const articles = getNews(symbol)
    return getSentimentSummary(articles)
  }
  const res = await api.get('/api/news/sentiment/summary', { params: symbol ? { symbol } : {} })
  return res.data
}
