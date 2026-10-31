export default function SegmentedControl({ options, value, onChange, size = 'md' }) {
  const pad = size === 'sm' ? '.3rem .65rem' : '.42rem .9rem'
  const fs  = size === 'sm' ? '.75rem' : '.85rem'

  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--card-hi)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '3px', gap: '2px',
    }}>
      {options.map(opt => {
        const key  = typeof opt === 'object' ? opt.value : opt
        const lbl  = typeof opt === 'object' ? opt.label : opt
        const active = key === value
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: pad, border: 'none', borderRadius: 'calc(var(--r) - 2px)',
              background: active ? 'var(--accent)' : 'transparent',
              color:      active ? '#fff' : 'var(--tx-2)',
              fontSize: fs, fontWeight: 600, cursor: 'pointer',
              transition: 'all .15s', whiteSpace: 'nowrap',
            }}
          >
            {lbl}
          </button>
        )
      })}
    </div>
  )
}
