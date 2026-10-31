import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md', className = '' }) {
  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const widths = { sm: 400, md: 520, lg: 720, xl: 900 }

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog" aria-modal="true" aria-labelledby="modal-title"
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'relative', zIndex: 1,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '1.5rem',
              width: '100%', maxWidth: widths[size] ?? widths.md,
              maxHeight: '90vh', overflowY: 'auto',
            }}
            className={className}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              {title && (
                <h2 id="modal-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--tx)' }}>
                  {title}
                </h2>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{
                    marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--tx-3)', padding: '4px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center',
                    transition: 'color .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--tx)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--tx-3)'}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
