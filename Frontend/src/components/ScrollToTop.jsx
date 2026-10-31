import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
    // Also scroll main content area if it exists
    document.getElementById('main-content')?.scrollTo({ top: 0 })
  }, [pathname])
  return null
}
