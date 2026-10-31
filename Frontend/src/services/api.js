/**
 * Configured axios instance for FinAstra
 * Handles auth headers, 401 auto-logout, and base URL from env
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Dispatch custom event so AuthContext can react
      window.dispatchEvent(new CustomEvent('finAstra:401'))
    }
    return Promise.reject(err)
  }
)

export default api
