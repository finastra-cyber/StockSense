import { useState, useEffect } from 'react'

import { useLocation, useNavigate, Link } from 'react-router-dom'

import toast from 'react-hot-toast'

import { useDocTitle }    from '../../hooks/useDocTitle.js'

import { usePriceTicker } from '../../hooks/usePriceTicker.js'

import { useTradeStore }  from '../../store/tradeStore.js'

import { searchStocks, getLivePrice, STOCKS, generateOHLCV } from '../../mocks/stocks.js'

import { getAISignal }    from '../../mocks/aiSignals.js'

import { formatINR, formatDate } from '../../utils/formatters.js'

import PriceChange  from '../../components/ui/PriceChange.jsx'

import Badge        from '../../components/ui/Badge.jsx'

import Sparkline    from '../../components/ui/Sparkline.jsx'

import SegmentedControl from '../../components/ui/SegmentedControl.jsx'

import Modal        from '../../components/ui/Modal.jsx'

import { SIGNAL_COLORS } from '../../utils/constants.js'



export default function Trade() {

  useDocTitle('Paper Trading')

  const location = useLocation()

  const navigate = useNavigate()

  const params   = new URLSearchParams(location.search)



  const { cash, holdings, transactions, buy, sell } = useTradeStore()



  const [side,    setSide]    = useState(params.get('side') ?? 'BUY')

  const [symIn,   setSymIn]   = useState(params.get('symbol') ?? '')

  const [qty,     setQty]     = useState('')

  const [sugg,    setSugg]    = useState([])

  const [confirm, setConfirm] = useState(false)

  const [busy,    setBusy]    = useState(false)



  const sym   = symIn.toUpperCase()

  const stock = STOCKS.find(s => s.symbol === sym)

  const { prices } = usePriceTicker(sym ? [sym] : [])

  const price = (sym ? prices[sym] : null) ?? (stock ? getLivePrice(sym) : null) ?? 0



  const qty_n = parseInt(qty, 10)

  const est   = qty_n > 0 && price > 0 ? qty_n * price : null

  const holding = holdings[sym]

  const signal  = sym ? getAISignal(sym) : null

  const candles = stock ? generateOHLCV(stock.basePrice, 30, stock.basePrice).slice(-30) : []



  function handleSymChange(e) {

    const v = e.target.value

    setSymIn(v)

    setSugg(v.length >= 1 ? searchStocks(v).slice(0, 5) : [])

  }



  function validate() {

    if (!sym || !stock)       return 'Enter a valid stock symbol.'

    if (!qty_n || qty_n <= 0) return 'Enter a valid quantity.'

    if (price <= 0)           return 'Cannot determine live price.'

    if (side === 'BUY' && est > cash) return `Insufficient cash. Need ${formatINR(est)}.`

    if (side === 'SELL' && (!holding || holding.qty < qty_n)) return `You only hold ${holding?.qty ?? 0} share(s) of ${sym}.`

    return null

  }



  async function handleSubmit(e) {

    e.preventDefault()

    const err = validate()

    if (err) { toast.error(err); return }

    setConfirm(true)

  }



  async function confirmOrder() {

    setBusy(true)

    await new Promise(r => setTimeout(r, 600))

    const result = side === 'BUY' ? buy(sym, qty_n, price) : sell(sym, qty_n, price)

    setBusy(false)

    setConfirm(false)

    if (result.success) {

      toast.success(result.message)

      setQty('')

    } else {

      toast.error(result.message)

    }

  }



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Paper Trading</h1>

          <p className="page-header__sub">Practice with ₹10,00,000 virtual funds - no real money at risk</p>

        </div>

        <div style={{

          background: 'var(--up-bg)', border: '1px solid rgba(16,185,129,.25)',

          borderRadius: 'var(--r)', padding: '.5rem .9rem', fontSize: '.75rem', color: 'var(--up)', fontWeight: 600,

        }}>

          Virtual Cash: <span style={{ fontFamily: 'var(--mono)', marginLeft: 4 }}>{formatINR(cash)}</span>

        </div>

      </div>



      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.25rem', alignItems: 'start' }}>



        {/*  Order ticket  */}

        <div className="card">

          <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '1rem' }}>Order Ticket</div>



          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <SegmentedControl

              options={[{ value: 'BUY', label: '^ Buy' }, { value: 'SELL', label: 'v Sell' }]}

              value={side} onChange={setSide}

            />



            {/* Symbol */}

            <div style={{ position: 'relative' }}>

              <div className="field">

                <label htmlFor="sym">Stock Symbol</label>

                <input

                  id="sym" value={symIn} onChange={handleSymChange}

                  placeholder="e.g. RELIANCE, TCS, INFY"

                  style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }}

                />

              </div>

              {sugg.length > 0 && (

                <div style={{

                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,

                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)',

                  overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,.4)',

                }}>

                  {sugg.map(s => (

                    <button key={s.symbol} type="button"

                      onClick={() => { setSymIn(s.symbol); setSugg([]) }}

                      style={{

                        width: '100%', display: 'flex', justifyContent: 'space-between',

                        padding: '.5rem .75rem', border: 'none', background: 'none', cursor: 'pointer',

                        color: 'var(--tx-2)', fontSize: '.82rem', textAlign: 'left', transition: 'background .1s',

                      }}

                      onMouseEnter={e => e.currentTarget.style.background = 'var(--card-hi)'}

                      onMouseLeave={e => e.currentTarget.style.background = 'none'}

                    >

                      <span style={{ fontWeight: 700, color: 'var(--tx)' }}>{s.symbol}</span>

                      <span style={{ color: 'var(--tx-3)', fontSize: '.75rem' }}>{s.name.slice(0, 20)}</span>

                    </button>

                  ))}

                </div>

              )}

            </div>



            {/* Quantity */}

            <div className="field">

              <label htmlFor="qty">Quantity</label>

              <div style={{ display: 'flex', gap: 6 }}>

                <button type="button" className="btn btn--sm"

                  onClick={() => setQty(q => String(Math.max(1, (parseInt(q) || 0) - 1)))}></button>

                <input id="qty" type="number" min="1" value={qty}

                  onChange={e => setQty(e.target.value)} placeholder="0" style={{ textAlign: 'center' }} />

                <button type="button" className="btn btn--sm"

                  onClick={() => setQty(q => String((parseInt(q) || 0) + 1))}>+</button>

              </div>

            </div>



            {/* Order type */}

            <div className="field">

              <label>Order Type</label>

              <div style={{ display: 'flex', gap: 6 }}>

                <div style={{

                  flex: 1, background: 'var(--accent-bg)', border: '1px solid var(--accent-ring)',

                  borderRadius: 'var(--r)', padding: '.55rem .85rem', fontSize: '.82rem',

                  color: '#a5b4fc', fontWeight: 600,

                }}>Market (at live price)</div>

                <div style={{

                  background: 'var(--card-hi)', border: '1px solid var(--border)',

                  borderRadius: 'var(--r)', padding: '.55rem .85rem', fontSize: '.82rem',

                  color: 'var(--tx-3)', opacity: .5,

                }}>Limit (soon)</div>

              </div>

            </div>



            {/* Live price + estimate */}

            {sym && price > 0 && (

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.55rem .85rem' }}>

                  <span style={{ fontSize: '.78rem', color: 'var(--tx-3)' }}>Live price</span>

                  <span style={{ fontFamily: 'var(--mono)', fontSize: '.84rem', color: 'var(--tx)' }}>{formatINR(price)}</span>

                </div>

                {est !== null && (

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.55rem .85rem' }}>

                    <span style={{ fontSize: '.78rem', color: 'var(--tx-3)' }}>Est. {side === 'BUY' ? 'cost' : 'proceeds'}</span>

                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.84rem', fontWeight: 700, color: 'var(--tx)' }}>{formatINR(est)}</span>

                  </div>

                )}

              </div>

            )}



            {/* Availability */}

            <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', textAlign: 'right' }}>

              {side === 'BUY'

                ? <>Available cash: <span style={{ color: 'var(--up)', fontFamily: 'var(--mono)' }}>{formatINR(cash)}</span></>

                : <>Available shares: <span style={{ color: 'var(--tx-2)', fontFamily: 'var(--mono)' }}>{holding?.qty ?? 0} {sym || ''}</span></>}

            </div>



            <button

              type="submit"

              className={`btn btn--block ${side === 'BUY' ? 'btn--up' : 'btn--danger'}`}

            >

              {side === 'BUY' ? '^ Place Buy Order' : 'v Place Sell Order'}

            </button>

          </form>



          <div style={{ marginTop: '1rem', padding: '.65rem', background: 'var(--down-bg)', borderRadius: 'var(--r)', fontSize: '.68rem', color: 'var(--tx-3)', lineHeight: 1.5 }}>

            ! Paper trading only. This platform uses virtual funds and never places real orders. Not investment advice.

          </div>

        </div>



        {/*  Right: stock info + recent orders  */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Live quote */}

          {sym && stock ? (

            <div className="card">

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>

                <div>

                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--tx)' }}>{stock.name}</div>

                  <div style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>{stock.sector} . {stock.exchange}</div>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--tx)' }}>{formatINR(price)}</div>

                  <PriceChange value={stock.changePct ?? 0} size="sm" />

                </div>

              </div>

              <Sparkline data={candles} height={60} />

            </div>

          ) : (

            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--tx-3)' }}>

              Search and select a stock to start trading

            </div>

          )}



          {/* AI signal */}

          {signal && (

            <div className="card" style={{ borderColor: SIGNAL_COLORS[signal.signal]?.border }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem' }}>

                <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--tx)' }}>Today's AI Signal</span>

                <Badge label={signal.signal} preset={signal.signal} size="sm" />

              </div>

              <div style={{ fontSize: '.75rem', color: 'var(--tx-2)', lineHeight: 1.5 }}>{signal.reasoning.slice(0, 100)}...</div>

              <Link to={`/app/stocks/${sym}`} style={{ display: 'block', marginTop: '.65rem', fontSize: '.72rem', color: 'var(--accent)' }}>Full analysis &rarr;</Link>

            </div>

          )}



          {/* Recent orders */}

          <div className="card">

            <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '.85rem' }}>Recent Orders</div>

            {transactions.length === 0 ? (

              <div style={{ color: 'var(--tx-3)', fontSize: '.82rem', textAlign: 'center', padding: '1.5rem' }}>

                No orders yet. Place your first trade!

              </div>

            ) : transactions.slice(0, 6).map(tx => (

              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--border-lo)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                  <Badge label={tx.side} preset={tx.side} size="sm" />

                  <span style={{ fontWeight: 700, color: 'var(--tx)', fontSize: '.85rem' }}>{tx.symbol}</span>

                  <span style={{ color: 'var(--tx-3)', fontSize: '.75rem' }}>{tx.qty} @ {formatINR(tx.price)}</span>

                </div>

                <div style={{ textAlign: 'right' }}>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '.82rem', color: 'var(--tx)' }}>{formatINR(tx.value)}</div>

                  <div style={{ fontSize: '.65rem', color: 'var(--tx-3)' }}>{formatDate(tx.timestamp)}</div>

                </div>

              </div>

            ))}

            {transactions.length > 0 && (

              <Link to="/app/transactions" style={{ display: 'block', marginTop: '.75rem', fontSize: '.75rem', color: 'var(--accent)' }}>

                View all transactions

              </Link>

            )}

          </div>

        </div>

      </div>



      {/* Confirm modal */}

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirm Order" size="sm">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ background: 'var(--card-hi)', borderRadius: 'var(--r)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>

            {[

              ['Action',    <Badge label={side} preset={side} size="sm" />],

              ['Symbol',    <span style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{sym}</span>],

              ['Quantity',  `${qty_n} shares`],

              ['Price',     formatINR(price)],

              ['Total',     <span style={{ fontWeight: 700, fontFamily: 'var(--mono)' }}>{formatINR(est ?? 0)}</span>],

            ].map(([k, v]) => (

              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.84rem' }}>

                <span style={{ color: 'var(--tx-3)' }}>{k}</span>

                <span style={{ color: 'var(--tx)' }}>{v}</span>

              </div>

            ))}

          </div>

          <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', padding: '.5rem', background: 'var(--down-bg)', borderRadius: 'var(--r)', lineHeight: 1.4 }}>

            ! This uses virtual funds only. No real money is involved.

          </div>

          <div style={{ display: 'flex', gap: '.75rem' }}>

            <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => setConfirm(false)} disabled={busy}>Cancel</button>

            <button

              className={`btn ${side === 'BUY' ? 'btn--up' : 'btn--danger'}`}

              style={{ flex: 1 }} onClick={confirmOrder} disabled={busy}

            >

              {busy ? 'Placing...' : `Confirm ${side}`}

            </button>

          </div>

        </div>

      </Modal>

    </div>

  )

}

