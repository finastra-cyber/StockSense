import { forwardRef } from 'react'

const VARIANTS = {
  primary: 'btn btn--primary',
  ghost:   'btn btn--ghost',
  danger:  'btn btn--danger',
  up:      'btn btn--up',
  outline: 'btn',
}
const SIZES = {
  sm: 'btn--sm',
  md: '',
  lg: 'btn--lg',
}

const Button = forwardRef(function Button(
  { children, variant = 'outline', size = 'md', block, className = '', loading, ...props },
  ref
) {
  const cls = [
    VARIANTS[variant] ?? 'btn',
    SIZES[size],
    block ? 'btn--block' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button ref={ref} className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <span style={{ opacity: .6 }}>Loading…</span> : children}
    </button>
  )
})

export default Button
