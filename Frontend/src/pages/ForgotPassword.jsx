import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthChart from '../components/AuthChart.jsx'
import { useDocTitle } from '../hooks/useDocTitle.js'
import './Auth.css'

export default function ForgotPassword() {
  useDocTitle('Forgot Password')
  const [email,    setEmail]    = useState('')
  const [error,    setError]    = useState('')
  const [sent,     setSent]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000)) // mock
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <AuthChart />
        <Link to="/" className="auth__brand">
          Fin<span className="accent">Astra</span><span style={{ color: 'var(--up)' }}>.</span>
        </Link>
        <div className="auth__quote">
          <p>"Every master was once a beginner who decided to learn."</p>
          <span>EDUCATIONAL USE ONLY · NOT FINANCIAL ADVICE</span>
        </div>
      </div>
      <div className="auth__form-side">
        <div className="auth__form-wrap">
          <Link to="/login" className="auth__back">← Back to login</Link>
          {sent ? (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
              <h1>Check your inbox</h1>
              <p className="auth__sub">
                If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn btn--primary btn--block" style={{ marginTop: '1.5rem' }}>
                Back to login
              </Link>
            </>
          ) : (
            <>
              <h1>Forgot password?</h1>
              <p className="auth__sub">Enter your email and we'll send you a reset link.</p>
              {error && <div className="auth__banner" style={{ marginBottom: '1rem' }}>{error}</div>}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email" type="email" autoComplete="email"
                    placeholder="you@example.com"
                    value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <div className="auth__switch">
                <Link to="/login" className="link-muted">Back to login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
