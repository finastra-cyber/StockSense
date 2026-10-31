/**
 * Inline sparkline chart using SVG
 */
export default function Sparkline({ data = [], height = 40, width = '100%', color }) {
  if (!data.length) return null
  const vals = data.map(d => (typeof d === 'object' ? d.close ?? d.value ?? d : d))
  const min  = Math.min(...vals)
  const max  = Math.max(...vals)
  const range = max - min || 1
  const W = 100
  const H = height

  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W
    const y = H - ((v - min) / range) * H * 0.9 - H * 0.05
    return `${x},${y}`
  }).join(' ')

  const last = vals[vals.length - 1]
  const first = vals[0]
  const lineColor = color ?? (last >= first ? 'var(--up)' : 'var(--down)')
  const fillId = `spark-fill-${Math.random().toString(36).slice(2)}`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width, height, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={lineColor} stopOpacity=".25" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0"  />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`${points} ${W},${H} 0,${H}`}
        fill={`url(#${fillId})`}
      />
    </svg>
  )
}
