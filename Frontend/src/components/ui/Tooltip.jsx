import { useState } from 'react'

export default function Tooltip({ children, content, placement = 'top' }) {
  const [visible, setVisible] = useState(false)

  const pos = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top:    '100%', left: '50%', transform: 'translateX(-50%)', marginTop:    6 },
    left:   { right:  '100%', top:  '50%', transform: 'translateY(-50%)', marginRight:  6 },
    right:  { left:   '100%', top:  '50%', transform: 'translateY(-50%)', marginLeft:   6 },
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', ...pos[placement],
            background: '#1a2540', color: 'var(--tx)',
            border: '1px solid var(--border)', borderRadius: 'var(--r)',
            padding: '.4rem .65rem', fontSize: '.73rem', whiteSpace: 'nowrap',
            zIndex: 200, pointerEvents: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
