/**
 * usePriceTicker — simulates live price updates with small random movements
 * Pauses when tab is hidden (Page Visibility API)
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { getLivePrice } from '../mocks/stocks.js'

const TICK_INTERVAL = 3000 // ms
const MAX_MOVE_PCT  = 0.003 // max 0.3% move per tick

/** Seeded random for deterministic initial prices */
function nextPrice(prev, symbol) {
  const move = (Math.random() - 0.498) * MAX_MOVE_PCT // slight upward bias
  return +(prev * (1 + move)).toFixed(2)
}

/**
 * @param {string[]} symbols  — list of symbols to tick
 * @returns {{ prices: Record<string, number>, flash: Record<string, 'up'|'down'|null> }}
 */
export function usePriceTicker(symbols = []) {
  const [prices, setPrices] = useState(() => {
    const init = {}
    symbols.forEach(s => { init[s] = getLivePrice(s) ?? 0 })
    return init
  })
  const [flash, setFlash] = useState({})
  const pausedRef = useRef(false)

  // Pause on hidden tab
  useEffect(() => {
    function onVisChange() { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', onVisChange)
    return () => document.removeEventListener('visibilitychange', onVisChange)
  }, [])

  // Tick
  useEffect(() => {
    if (!symbols.length) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setPrices(prev => {
        const next = { ...prev }
        const newFlash = {}
        symbols.forEach(s => {
          const p = nextPrice(prev[s] || getLivePrice(s) || 100, s)
          newFlash[s] = p > prev[s] ? 'up' : p < prev[s] ? 'down' : null
          next[s] = p
        })
        setFlash(newFlash)
        return next
      })
    }, TICK_INTERVAL)
    return () => clearInterval(id)
  }, [symbols.join(',')])

  // Clear flash after animation
  useEffect(() => {
    if (Object.keys(flash).length) {
      const t = setTimeout(() => setFlash({}), 700)
      return () => clearTimeout(t)
    }
  }, [flash])

  return { prices, flash }
}
