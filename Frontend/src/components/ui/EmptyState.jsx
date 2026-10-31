import Button from './Button.jsx'

export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '3rem 1.5rem', gap: '12px',
    }}>
      {icon && (
        <div style={{ fontSize: '2.5rem', opacity: .25, lineHeight: 1 }}>{icon}</div>
      )}
      <p style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--tx-2)', margin: 0 }}>{title}</p>
      {description && (
        <p style={{ fontSize: '.82rem', color: 'var(--tx-3)', maxWidth: '36ch', margin: 0 }}>{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action} style={{ marginTop: '4px' }}>
          {actionLabel ?? 'Get started'}
        </Button>
      )}
    </div>
  )
}
