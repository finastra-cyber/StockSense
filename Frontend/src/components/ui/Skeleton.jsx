/**
 * Skeleton loaders — building blocks
 */
export default function Skeleton({ width, height = 14, style, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ display: 'block', width, height, ...style }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ height = 120 }) {
  return <Skeleton height={height} style={{ borderRadius: 'var(--r-md)', width: '100%' }} />
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '.75rem 0', borderBottom: '1px solid var(--border-lo)', alignItems: 'center' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height={12} style={{ flex: i === 0 ? '0 0 80px' : 1 }} />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}
