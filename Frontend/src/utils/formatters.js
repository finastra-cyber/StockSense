/**
 * Formatting utilities for FinAstra
 * All currency in INR with Indian number formatting
 */

/** Format as INR currency — ₹1,00,000.00 */
export function formatINR(value, decimals = 2) {
  const n = Number(value)
  if (isNaN(n)) return '₹—'
  return '₹' + n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Format as compact INR — ₹1.2L, ₹4.5Cr */
export function formatINRCompact(value) {
  const n = Number(value)
  if (isNaN(n)) return '₹—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`
  return `${sign}₹${abs.toFixed(2)}`
}

/** Format percent — +1.24% or −0.38% */
export function formatPct(value, decimals = 2, showSign = true) {
  const n = Number(value)
  if (isNaN(n)) return '—'
  const sign = showSign && n > 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}%`
}

/** Format large number compactly — 1.2M, 4.5B */
export function formatCompact(value) {
  const n = Number(value)
  if (isNaN(n)) return '—'
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

/** Format a number with Indian comma separation */
export function formatIndian(value, decimals = 2) {
  const n = Number(value)
  if (isNaN(n)) return '—'
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Format timestamp to readable date */
export function formatDate(ts, opts = {}) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', ...opts,
  })
}

/** Format timestamp to date + time */
export function formatDateTime(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/** Format relative time — "2 hours ago", "just now" */
export function formatRelative(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

/** Get initials from name */
export function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || '??'
}
