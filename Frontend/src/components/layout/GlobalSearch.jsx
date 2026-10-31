import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchStocks } from '../../mocks/stocks.js'
import { formatINR } from '../../utils/formatters.js'
import { getLivePrice } from '../../mocks/stocks.js'

export default function GlobalSearch() {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState([])
  const [open,     setOpen]     = useState(false)
  const [activeIdx,setActive]   = useState(0)
  const navigate                = useNavigate()
  const inputRef                = useRef(null)
  const debounceRef             = useRef(null)

  const search = useCallback((q) => {
    if (!q.trim()) { setResults([]); return }
    const found = searchStocks(q).map(s => ({
      ...s,
      price: getLivePrice(s.symbol) ?? s.basePrice,
    }))
    setResults(found)
    setActive(0)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 180)
  }

  function handleSelect(symbol) {
    setQuery('')
    setResults([])
    setOpen(false)
    navigate(`/app/stocks/${symbol}`)
  }

  function handleKeyDown(e) {
    if (!results.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter')     { e.preventDefault(); handleSelect(results[activeIdx].symbol) }
    if (e.key === 'Escape')    { setOpen(false); inputRef.current?.blur() }
  }

  useEffect(() => {
    function outside(e) {
      if (!e.target.closest('.global-search')) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  return (
    <div className="global-search" role="search">
      <div className="global-search__input-wrap">
        <Search size={14} className="global-search__icon" aria-hidden="true" />
        <input
          ref={inputRef}
          className="global-search__input"
          type="search"
          placeholder="Search stocks... (e.g. TCS, RELIANCE)"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setOpen(true)}
          aria-label="Search stocks"
          aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
          autoComplete="off"
        />
        {query && (
          <button
            className="global-search__clear"
            onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            className="global-search__dropdown"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            role="listbox"
          >
            {results.map((s, i) => (
              <button
                key={s.symbol}
                role="option"
                aria-selected={i === activeIdx}
                className={`global-search__item ${i === activeIdx ? 'global-search__item--active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => handleSelect(s.symbol)}
              >
                <div className="global-search__sym-wrap">
                  <span className="global-search__sym">{s.symbol}</span>
                  <span className="global-search__name">{s.name}</span>
                </div>
                <div className="global-search__meta">
                  <span className="global-search__price">{formatINR(s.price, 2)}</span>
                  <span className="global-search__sector">{s.sector}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .global-search { position: relative; max-width: 360px; width: 100%; }
        .global-search__input-wrap {
          display: flex; align-items: center; gap: 7px;
          background: var(--card-hi); border: 1px solid var(--border);
          border-radius: var(--r); padding: .42rem .75rem;
          transition: border-color .15s, box-shadow .15s;
        }
        .global-search__input-wrap:focus-within {
          border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring);
        }
        .global-search__icon { color: var(--tx-3); flex-shrink: 0; }
        .global-search__input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--tx); font-size: .84rem;
        }
        .global-search__input::placeholder { color: var(--tx-3); }
        .global-search__clear {
          background: none; border: none; color: var(--tx-3);
          cursor: pointer; padding: 2px; display: flex;
        }
        .global-search__dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--r-md); overflow: hidden;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4); z-index: 200;
        }
        .global-search__item {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: .65rem 1rem; border: none; background: transparent;
          color: inherit; cursor: pointer; text-align: left;
          transition: background .1s;
        }
        .global-search__item--active,
        .global-search__item:hover { background: var(--card-hi); }
        .global-search__sym-wrap { display: flex; flex-direction: column; gap: 2px; }
        .global-search__sym  { font-size: .85rem; font-weight: 700; color: var(--tx); }
        .global-search__name { font-size: .72rem; color: var(--tx-3); }
        .global-search__meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .global-search__price  { font-family: var(--mono); font-size: .82rem; color: var(--tx-2); font-weight: 600; }
        .global-search__sector { font-size: .65rem; color: var(--tx-3); }
      `}</style>
    </div>
  )
}
