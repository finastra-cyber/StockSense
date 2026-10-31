import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

/**
 * Sortable table component
 * @param {Array} columns — [{ key, label, render?, align?, sortable? }]
 * @param {Array} rows    — data objects
 */
export default function Table({ columns, rows, onRowClick, emptyLabel = 'No data', className = '' }) {
  const [sortKey, setSortKey]     = useState(null)
  const [sortDir, setSortDir]     = useState('asc')

  function handleSort(col) {
    if (!col.sortable) return
    if (sortKey === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col.key); setSortDir('asc') }
  }

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey]
        const mul = sortDir === 'asc' ? 1 : -1
        if (typeof va === 'number') return (va - vb) * mul
        return String(va).localeCompare(String(vb)) * mul
      })
    : rows

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className={`d-table ${className}`} style={{ width: '100%', tableLayout: 'auto' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                style={{
                  textAlign: col.align ?? 'left',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none', whiteSpace: 'nowrap',
                }}
                aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc'
                      ? <ChevronUp size={12} aria-hidden="true" />
                      : <ChevronDown size={12} aria-hidden="true" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--tx-3)' }}>
                {emptyLabel}
              </td>
            </tr>
          ) : sorted.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : undefined }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
