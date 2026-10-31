import { useState, useMemo } from 'react'

import { useDocTitle }   from '../../hooks/useDocTitle.js'

import { useTradeStore } from '../../store/tradeStore.js'

import { formatINR, formatDateTime, formatDate } from '../../utils/formatters.js'

import Badge       from '../../components/ui/Badge.jsx'

import EmptyState  from '../../components/ui/EmptyState.jsx'

import PriceChange from '../../components/ui/PriceChange.jsx'



export default function Transactions() {

  useDocTitle('Transactions')

  const { transactions } = useTradeStore()

  const [sideFilter, setSideFilter] = useState('ALL')

  const [symFilter,  setSymFilter]  = useState('')

  const [page,       setPage]       = useState(1)

  const PER_PAGE = 15



  const filtered = useMemo(() => {

    let list = transactions

    if (sideFilter !== 'ALL') list = list.filter(t => t.side === sideFilter)

    if (symFilter)            list = list.filter(t => t.symbol.toLowerCase().includes(symFilter.toLowerCase()))

    return list

  }, [transactions, sideFilter, symFilter])



  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const pageData   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)



  const totalBuys  = transactions.filter(t => t.side === 'BUY').length

  const totalSells = transactions.filter(t => t.side === 'SELL').length

  const totalVal   = transactions.reduce((s, t) => s + (t.side === 'SELL' ? t.value : -t.value), 0)



  function exportCSV() {

    const rows = [['ID','Symbol','Side','Qty','Price','Value','Date']]

    transactions.forEach(t => rows.push([t.id, t.symbol, t.side, t.qty, t.price, t.value, formatDateTime(t.timestamp)]))

    const csv = rows.map(r => r.join(',')).join('\n')

    const a = document.createElement('a')

    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)

    a.download = 'finastra_transactions.csv'

    a.click()

  }



  return (

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div className="page-header">

        <div>

          <h1 className="page-header__title">Transactions</h1>

          <p className="page-header__sub">Your complete paper trading history</p>

        </div>

        <button className="btn btn--sm" onClick={exportCSV} disabled={!transactions.length}>Export CSV</button>

      </div>



      {/* Summary chips */}

      <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap' }}>

        {[

          { label: 'Total Trades', value: transactions.length },

          { label: 'Buys',  value: totalBuys,  color: 'var(--up)' },

          { label: 'Sells', value: totalSells, color: 'var(--down)' },

          { label: 'Net Cash Flow', value: formatINR(totalVal), color: totalVal >= 0 ? 'var(--up)' : 'var(--down)' },

        ].map(c => (

          <div key={c.label} style={{

            background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 20,

            padding: '.3rem .85rem', fontSize: '.78rem', display: 'flex', gap: 6, alignItems: 'center',

          }}>

            <span style={{ color: 'var(--tx-3)' }}>{c.label}:</span>

            <span style={{ fontWeight: 700, color: c.color ?? 'var(--tx)', fontFamily: 'var(--mono)' }}>{c.value}</span>

          </div>

        ))}

      </div>



      {/* Filters */}

      <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', alignItems: 'center' }}>

        <div style={{ display: 'flex', gap: 4 }}>

          {['ALL','BUY','SELL'].map(f => (

            <button key={f} onClick={() => { setSideFilter(f); setPage(1) }}

              style={{

                padding: '.28rem .7rem', border: 'none', borderRadius: 20, fontSize: '.75rem', fontWeight: 600,

                background: sideFilter === f ? (f === 'BUY' ? 'var(--up-bg)' : f === 'SELL' ? 'var(--down-bg)' : 'var(--accent-bg)') : 'var(--card-hi)',

                color: sideFilter === f ? (f === 'BUY' ? 'var(--up)' : f === 'SELL' ? 'var(--down)' : 'var(--accent)') : 'var(--tx-3)',

                cursor: 'pointer',

              }}

            >{f}</button>

          ))}

        </div>

        <input

          value={symFilter} onChange={e => { setSymFilter(e.target.value); setPage(1) }}

          placeholder="Filter by symbol..."

          style={{ background: 'var(--card-hi)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '.38rem .75rem', color: 'var(--tx)', fontSize: '.82rem', width: 180 }}

        />

      </div>



      {/* Table */}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

        {filtered.length === 0 ? (

          <EmptyState icon="" title="No transactions" description="Your trade history will appear here after you place orders." />

        ) : (

          <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>

              <thead>

                <tr style={{ borderBottom: '1px solid var(--border)' }}>

                  {['Type','Symbol','Qty','Price','Total','Date & Time'].map(h => (

                    <th key={h} style={{ padding: '.75rem 1rem', textAlign: h === 'Type' || h === 'Symbol' ? 'left' : 'right', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--tx-3)', whiteSpace: 'nowrap' }}>{h}</th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {pageData.map(tx => (

                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-lo)' }}>

                    <td style={{ padding: '.75rem 1rem' }}><Badge label={tx.side} preset={tx.side} size="sm" /></td>

                    <td style={{ padding: '.75rem 1rem', fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--mono)' }}>{tx.symbol}</td>

                    <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--tx-2)' }}>{tx.qty}</td>

                    <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--tx-2)' }}>{formatINR(tx.price)}</td>

                    <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--tx)' }}>{formatINR(tx.value)}</td>

                    <td style={{ padding: '.75rem 1rem', textAlign: 'right', fontSize: '.72rem', color: 'var(--tx-3)' }}>{formatDateTime(tx.timestamp)}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {totalPages > 1 && (

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.85rem 1rem', borderTop: '1px solid var(--border-lo)' }}>

            <span style={{ fontSize: '.75rem', color: 'var(--tx-3)' }}>Showing {(page-1)*PER_PAGE+1}-{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>

            <div style={{ display: 'flex', gap: 4 }}>

              <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1} className="btn btn--sm">&larr;</button>

              <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages} className="btn btn--sm">&rarr;</button>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}

