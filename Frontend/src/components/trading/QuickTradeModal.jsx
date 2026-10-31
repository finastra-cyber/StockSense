import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal.jsx'
import SegmentedControl from '../ui/SegmentedControl.jsx'
import { useTradeStore } from '../../store/tradeStore.js'
import { getLivePrice, searchStocks } from '../../mocks/stocks.js'
import { formatINR } from '../../utils/formatters.js'

export default function QuickTradeModal({ open, onClose }) {
  const { buy, sell, cash } = useTradeStore()
  const navigate = useNavigate()
  const [side,   setSide]   = useState('BUY')
  const [symIn,  setSymIn]  = useState('')
  const [qty,    setQty]    = useState('')
  const [busy,   setBusy]   = useState(false)
  const [suggestions, setSugg] = useState([])

  const sym   = symIn.toUpperCase()
  const price = getLivePrice(sym) ?? 0
  const est   = qty && price ? +qty * price : null

  function handleSymChange(e) {
    const v = e.target.value
    setSymIn(v)
    setSugg(v.length >= 1 ? searchStocks(v).slice(0, 4) : [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const q = parseInt(qty, 10)
    if (!sym || !q || q <= 0) { toast.error('Enter a valid symbol and quantity'); return }
    if (!price) { toast.error(`Symbol "${sym}" not found`); return }
    setBusy(true)
    await new Promise(r => setTimeout(r, 500))
    const result = side === 'BUY' ? buy(sym, q, price) : sell(sym, q, price)
    setBusy(false)
    if (result.success) {
      toast.success(result.message)
      onClose()
      setSymIn(''); setQty('')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Quick Trade" size="sm">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SegmentedControl
          options={[{ value: 'BUY', label: ' Buy' }, { value: 'SELL', label: ' Sell' }]}
          value={side} onChange={setSide}
        />

        <div style={{ position: 'relative' }}>
          <div className="field">
            <label>Symbol</label>
            <input
              value={symIn} onChange={handleSymChange} placeholder="e.g. RELIANCE"
              style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }}
              autoFocus
            />
          </div>
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
              boxShadow: '0 8px 24px rgba(0,0,0,.4)', overflow: 'hidden',
            }}>
              {suggestions.map(s => (
                <button key={s.symbol} type="button"
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '.5rem .75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-2)', fontSize: '.82rem', transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--card-hi)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  onClick={() => { setSymIn(s.symbol); setSugg([]) }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--tx)' }}>{s.symbol}</span>
                  <span style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label>Quantity</label>
          <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="10" />
        </div>

        {sym && price > 0 && (
          <div style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.65rem .9rem', display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
            <span style={{ color: 'var(--tx-3)' }}>Live price</span>
            <span style={{ fontFamily: 'var(--mono)', color: 'var(--tx)' }}>{formatINR(price)}</span>
          </div>
        )}

        {est !== null && (
          <div style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.65rem .9rem', display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
            <span style={{ color: 'var(--tx-3)' }}>Estimated {side === 'BUY' ? 'cost' : 'proceeds'}</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--tx)' }}>{formatINR(est)}</span>
          </div>
        )}

        <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', textAlign: 'right' }}>
          Available cash: <span style={{ color: 'var(--up)', fontFamily: 'var(--mono)' }}>{formatINR(cash)}</span>
        </div>

        <div style={{ display: 'flex', gap: '.75rem' }}>
          <button type="button" className="btn btn--ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button type="submit" className={`btn ${side === 'BUY' ? 'btn--up' : 'btn--danger'}`} style={{ flex: 1 }} disabled={busy}>
            {busy ? 'Placing...' : `${side === 'BUY' ? 'Buy' : 'Sell'}`}
          </button>
        </div>

        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { onClose(); navigate('/app/trade') }} style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>
          Open full order ticket
        </button>
      </form>
    </Modal>
  )
}
