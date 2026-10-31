export default function Tabs({ tabs, active, onChange, size = 'md' }) {
  const fs  = size === 'sm' ? '.78rem' : '.875rem'
  const pad = size === 'sm' ? '.4rem .75rem' : '.5rem 1rem'

  return (
    <div role="tablist" style={{
      display: 'flex', gap: '2px',
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto', scrollbarWidth: 'none',
    }}>
      {tabs.map(tab => {
        const key = typeof tab === 'object' ? tab.value : tab
        const lbl = typeof tab === 'object' ? tab.label : tab
        const isActive = key === active
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            style={{
              padding: pad, border: 'none', borderRadius: 'var(--r) var(--r) 0 0',
              background: 'transparent',
              color:      isActive ? 'var(--tx)' : 'var(--tx-3)',
              fontSize: fs, fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'color .15s, border-color .15s',
              marginBottom: -1,
            }}
          >
            {lbl}
          </button>
        )
      })}
    </div>
  )
}
