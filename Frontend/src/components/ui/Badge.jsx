/**
 * Badge — signal / sentiment / side badges
 */
const PRESETS = {
  BUY:      { bg: 'var(--up-bg)',      color: 'var(--up)',   border: 'rgba(16,185,129,0.25)' },
  HOLD:     { bg: 'var(--gold-bg)',    color: 'var(--gold)', border: 'rgba(245,158,11,0.25)' },
  SELL:     { bg: 'var(--down-bg)',    color: 'var(--down)', border: 'rgba(244,63,94,0.25)'  },
  positive: { bg: 'var(--up-bg)',      color: 'var(--up)',   border: 'rgba(16,185,129,0.25)' },
  neutral:  { bg: 'var(--gold-bg)',    color: 'var(--gold)', border: 'rgba(245,158,11,0.25)' },
  negative: { bg: 'var(--down-bg)',    color: 'var(--down)', border: 'rgba(244,63,94,0.25)'  },
  default:  { bg: 'rgba(255,255,255,0.07)', color: 'var(--tx-2)', border: 'var(--border)' },
}

export default function Badge({ label, preset, size = 'sm', className = '' }) {
  const p = PRESETS[preset] ?? PRESETS[label?.toUpperCase()] ?? PRESETS.default
  const fontSize = size === 'sm' ? '.65rem' : size === 'md' ? '.75rem' : '.85rem'
  const padding  = size === 'sm' ? '.18rem .5rem' : size === 'md' ? '.25rem .65rem' : '.3rem .8rem'

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: p.bg, color: p.color,
        border: `1px solid ${p.border}`,
        borderRadius: '6px', padding,
        fontSize, fontWeight: 700, letterSpacing: '.04em',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--mono)',
      }}
    >
      {label}
    </span>
  )
}
