import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthChart from "../components/AuthChart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Enter your password.";
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user);
        navigate(from, { replace: true });
      } else {
        setSubmitError(data.message || "Login failed. Check your credentials.");
      }
    } catch (err) {
      setSubmitError(
        "Could not log you in. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
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
          <p>
            "Every position starts as a paper trade before it earns real
            capital."
          </p>
          <span>SIGNAL / EDUCATIONAL, NOT FINANCIAL ADVICE</span>
        </div>
      </div>

      <div className="auth__form-side">
        <div className="auth__form-wrap">
          <Link to="/" className="auth__back">
            ← Back to StockSense
          </Link>
          <h1>Welcome back</h1>
          <p className="auth__sub">
            Log in to pick up your portfolio where you left it.
          </p>

          {submitError && <div className="auth__banner">{submitError}</div>}

          <form onSubmit={handleSubmit} noValidate>
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
              {errors.email && (
                <div className="field-error">{errors.email}</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="field-error">{errors.password}</div>
              )}
            </div>

            <div className="field-row">
              <label className="checkbox">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <Link to="/register" className="link-muted">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="auth__switch">
            New to StockSense?{" "}
            <Link to="/register" className="link-muted">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
