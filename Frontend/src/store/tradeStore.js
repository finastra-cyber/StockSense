/**
 * Paper Trading Store — Zustand
 * Implements Algorithm 2 from the project specification:
 *   BUY:  validate cash >= qty * price → cash -= value, holding += qty
 *   SELL: validate holding >= qty → cash += value, holding -= qty
 *   Records transaction, atomic update
 *   Portfolio value = cash + Σ(holding × current price)
 *
 * GET /api/portfolio
 * POST /api/trade/order
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STARTING_CASH, SIDE } from '../utils/constants.js'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export const useTradeStore = create(
  persist(
    (set, get) => ({
      cash:         STARTING_CASH,
      holdings:     {}, // { [symbol]: { qty, avgPrice } }
      transactions: [], // array of transaction records

      /** Reset to initial state */
      resetAccount() {
        set({
          cash:         STARTING_CASH,
          holdings:     {},
          transactions: [],
        })
      },

      /**
       * Execute a BUY order
       * @param {string} symbol
       * @param {number} qty
       * @param {number} price  — current market price
       * @returns {{ success: boolean, message: string }}
       */
      buy(symbol, qty, price) {
        const { cash, holdings } = get()
        const value = qty * price

        if (qty <= 0)    return { success: false, message: 'Quantity must be positive.' }
        if (price <= 0)  return { success: false, message: 'Price must be positive.' }
        if (cash < value) {
          return {
            success: false,
            message: `Insufficient funds. Need ₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} but have ₹${cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`,
          }
        }

        const existing = holdings[symbol] || { qty: 0, avgPrice: 0 }
        const newQty   = existing.qty + qty
        // Weighted average price
        const newAvg   = (existing.qty * existing.avgPrice + qty * price) / newQty

        const tx = {
          id:        generateId(),
          symbol,
          side:      SIDE.BUY,
          qty,
          price:     +price.toFixed(2),
          value:     +value.toFixed(2),
          timestamp: Date.now(),
        }

        set(state => ({
          cash:     state.cash - value,
          holdings: { ...state.holdings, [symbol]: { qty: newQty, avgPrice: +newAvg.toFixed(4) } },
          transactions: [tx, ...state.transactions],
        }))

        return { success: true, message: `Bought ${qty} share${qty > 1 ? 's' : ''} of ${symbol} at ₹${price.toFixed(2)}` }
      },

      /**
       * Execute a SELL order
       */
      sell(symbol, qty, price) {
        const { holdings } = get()
        const holding = holdings[symbol]

        if (qty <= 0)              return { success: false, message: 'Quantity must be positive.' }
        if (price <= 0)            return { success: false, message: 'Price must be positive.' }
        if (!holding || holding.qty === 0) {
          return { success: false, message: `You don't hold any shares of ${symbol}.` }
        }
        if (holding.qty < qty) {
          return {
            success: false,
            message: `Insufficient shares. You have ${holding.qty} share${holding.qty > 1 ? 's' : ''} of ${symbol}.`,
          }
        }

        const value   = qty * price
        const newQty  = holding.qty - qty

        const tx = {
          id:        generateId(),
          symbol,
          side:      SIDE.SELL,
          qty,
          price:     +price.toFixed(2),
          value:     +value.toFixed(2),
          timestamp: Date.now(),
        }

        set(state => {
          const next = { ...state.holdings }
          if (newQty === 0) delete next[symbol]
          else next[symbol] = { ...next[symbol], qty: newQty }
          return {
            cash:         state.cash + value,
            holdings:     next,
            transactions: [tx, ...state.transactions],
          }
        })

        return { success: true, message: `Sold ${qty} share${qty > 1 ? 's' : ''} of ${symbol} at ₹${price.toFixed(2)}` }
      },

      /** Compute total portfolio value given current prices map { [symbol]: price } */
      getPortfolioValue(prices = {}) {
        const { cash, holdings } = get()
        const invested = Object.entries(holdings).reduce((sum, [sym, h]) => sum + h.qty * h.avgPrice, 0)
        const current  = Object.entries(holdings).reduce((sum, [sym, h]) => {
          const p = prices[sym] ?? h.avgPrice
          return sum + h.qty * p
        }, 0)
        const total = cash + current
        const pnl   = current - invested
        const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0
        return { cash, invested, current, total, pnl, pnlPct }
      },
    }),
    {
      name: 'finAstra_trade',
      version: 1,
    }
  )
)
