import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthChart from '../components/AuthChart.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' }

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((err) => ({ ...err, [name]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) {
      next.name = 'Enter your full name.'
    }
    if (!form.email.trim()) {
      next.email = 'Enter your email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.password) {
      next.password = 'Choose a password.'
    } else if (form.password.length < 8) {
      next.password = 'Use at least 8 characters.'
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
    }
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      // TODO: replace with a call to the FastAPI /auth/register endpoint.
      await new Promise((res) => setTimeout(res, 600))
      login({ name: form.name, email: form.email })
      navigate('/dashboard', { replace: true })
    } catch {
      setSubmitError('Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <AuthChart />
        <Link to="/" className="auth__brand">
          StockSense<span className="dot">.</span>
        </Link>
        <div className="auth__quote">
          <p>"₹1,00,000 in virtual capital. Zero real risk. Every lesson still counts."</p>
          <span>SIGNAL / EDUCATIONAL, NOT FINANCIAL ADVICE</span>
        </div>
      </div>

      <div className="auth__form-side">
        <div className="auth__form-wrap">
          <Link to="/" className="auth__back">
            ← Back to StockSense
          </Link>
          <h1>Create your account</h1>
          <p className="auth__sub">Get a virtual portfolio and start reading the market today.</p>

          {submitError && <div className="auth__banner">{submitError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Investor"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="field-error">{errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth__switch">
            Already have an account? <Link to="/login" className="link-muted">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
