import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import AppNew from './AppNew.jsx'
import './index.css'

// Apply saved theme class before first paint (prevents flash)
const _savedTheme = JSON.parse(localStorage.getItem('finAstra_theme') || '{}')?.state?.theme
if (_savedTheme) {
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(_savedTheme)
} else {
  const _sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.classList.add(_sys)
}

// Global toast bridge used by AuthContext 401 handler
window.addEventListener('finAstra:showToast', (e) => {
  const { type, message } = e.detail
  if (type === 'error') toast.error(message)
  else toast(message)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppNew />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--tx)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '.85rem',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#F43F5E', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
