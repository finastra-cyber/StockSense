import { AlertTriangle } from 'lucide-react'
import Button from './Button.jsx'

export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '2.5rem 1.5rem', gap: '10px',
    }}>
      <AlertTriangle size={28} style={{ color: 'var(--down)', opacity: .7 }} />
      <p style={{ fontSize: '.88rem', color: 'var(--tx-2)', margin: 0 }}>
        {message ?? 'Something went wrong'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
      )}
    </div>
  )
}
