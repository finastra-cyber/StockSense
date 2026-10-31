/** Full-screen branded loader shown while auth state restores */
export default function BrandLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.25rem', zIndex: 999,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', color: '#fff',
        animation: 'brandPulse 1.4s ease-in-out infinite',
      }}>
        ◈
      </div>
      <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-.025em', color: 'var(--tx)' }}>
        Fin<span style={{ color: '#6366F1' }}>Astra</span>
      </span>
      <style>{`
        @keyframes brandPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.08); opacity: .8; }
        }
      `}</style>
    </div>
  )
}
