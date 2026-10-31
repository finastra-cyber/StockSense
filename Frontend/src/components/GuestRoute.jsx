import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import BrandLoader from './BrandLoader.jsx'

/** Redirects logged-in users away from auth pages */
export default function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <BrandLoader />
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />
  return children
}
