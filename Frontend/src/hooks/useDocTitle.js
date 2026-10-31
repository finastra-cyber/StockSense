import { useEffect } from 'react'

export function useDocTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · FinAstra` : 'FinAstra — AI Stock Analysis & Paper Trading'
    return () => { document.title = 'FinAstra — AI Stock Analysis & Paper Trading' }
  }, [title])
}
