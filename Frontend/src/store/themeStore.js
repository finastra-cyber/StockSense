/**
 * Theme store — dark/light toggle, persisted to localStorage
 * Respects prefers-color-scheme on first visit
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(theme)
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),

      init() {
        applyTheme(get().theme)
      },

      toggle() {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },

      setTheme(t) {
        applyTheme(t)
        set({ theme: t })
      },
    }),
    { name: 'finAstra_theme', version: 1 }
  )
)
