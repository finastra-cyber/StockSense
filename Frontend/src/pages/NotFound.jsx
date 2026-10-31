import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocTitle } from '../hooks/useDocTitle.js'

export default function NotFound() {
  useDocTitle('404 Not Found')
  const { isAuthenticated } = useAuth()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
      padding: '2rem', textAlign: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        fontSize: '5rem', lineHeight: 1,
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        fontWeight: 800,
      }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--tx)' }}>Page not found</h1>
      <p style={{ color: 'var(--tx-2)', maxWidth: '36ch', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={isAuthenticated ? '/app/dashboard' : '/'}
        className="btn btn--primary"
        style={{ padding: '.65rem 1.5rem' }}
      >
        {isAuthenticated ? 'Go to Dashboard' : 'Back to Home'}
      </Link>
    </div>
  )
}
