/**
 * PriceChange chip — shows +1.24% ▲ or -0.38% ▼
 */
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function PriceChange({ value, showIcon = true, size = 'sm' }) {
  const n = Number(value)
  const up      = n > 0
  const down    = n < 0
  const neutral = n === 0 || isNaN(n)

  const color  = neutral ? 'var(--tx-3)' : up ? 'var(--up)' : 'var(--down)'
  const bg     = neutral ? 'rgba(255,255,255,0.06)' : up ? 'var(--up-bg)' : 'var(--down-bg)'
  const border = neutral ? 'var(--border)' : up ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'
  const fontSize = size === 'sm' ? '.72rem' : size === 'md' ? '.82rem' : '.9rem'
  const iconSize = size === 'sm' ? 11 : 13

  const Icon = neutral ? Minus : up ? TrendingUp : TrendingDown
  const sign = up ? '+' : ''
  const text = isNaN(n) ? '—' : `${sign}${n.toFixed(2)}%`

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      background: bg, color, border: `1px solid ${border}`,
      borderRadius: '6px', padding: '.18rem .45rem',
      fontSize, fontWeight: 600, fontFamily: 'var(--mono)',
      whiteSpace: 'nowrap',
    }}>
      {showIcon && <Icon size={iconSize} strokeWidth={2.5} aria-hidden="true" />}
      {text}
    </span>
  )
}
