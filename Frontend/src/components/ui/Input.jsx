import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <input ref={ref} {...props} />
      {error && <div className="field-error">{error}</div>}
      {hint && !error && <div style={{ fontSize: '.72rem', color: 'var(--tx-3)', marginTop: 2 }}>{hint}</div>}
    </div>
  )
})

export default Input
