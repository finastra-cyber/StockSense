export default function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'default' : 'pointer', userSelect: 'none' }}>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); !disabled && onChange(!checked) } }}
        tabIndex={0}
        style={{
          position: 'relative', display: 'inline-block',
          width: 40, height: 22, borderRadius: 11,
          background: checked ? 'var(--accent)' : 'var(--border)',
          transition: 'background .2s',
          flexShrink: 0,
          opacity: disabled ? .5 : 1,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </span>
      {label && <span style={{ fontSize: '.85rem', color: 'var(--tx-2)' }}>{label}</span>}
    </label>
  )
}
