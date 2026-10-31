/**
 * Watchlist store — Zustand + localStorage persist
 * GET /api/watchlist
 * POST /api/watchlist/:symbol
 * DELETE /api/watchlist/:symbol
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStock } from '../mocks/stocks.js'
import toast from 'react-hot-toast'

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ symbol, addedAt }]

      add(symbol) {
        const s = symbol.toUpperCase()
        const { items } = get()
        if (items.find(i => i.symbol === s)) {
          toast('Already in watchlist', { icon: '⭐' })
          return false
        }
        const stock = getStock(s)
        if (!stock) {
          toast.error(`Symbol "${s}" not found`)
          return false
        }
        set(state => ({ items: [...state.items, { symbol: s, addedAt: Date.now() }] }))
        toast.success(`${s} added to watchlist`)
        return true
      },

      remove(symbol) {
        const s = symbol.toUpperCase()
        set(state => ({ items: state.items.filter(i => i.symbol !== s) }))
        toast(`${s} removed from watchlist`, { icon: '🗑️' })
      },

      isWatched(symbol) {
        return get().items.some(i => i.symbol === symbol.toUpperCase())
      },
    }),
    { name: 'finAstra_watchlist', version: 1 }
  )
)
