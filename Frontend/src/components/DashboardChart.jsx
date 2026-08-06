const CANDLES = [
  { o: 300, h: 285, l: 312, c: 292 },
  { o: 292, h: 278, l: 298, c: 283 },
  { o: 283, h: 260, l: 288, c: 265 },
  { o: 265, h: 270, l: 250, c: 268 },
  { o: 268, h: 240, l: 272, c: 245 },
  { o: 245, h: 250, l: 228, c: 248 },
  { o: 248, h: 220, l: 252, c: 224 },
  { o: 224, h: 230, l: 205, c: 228 },
  { o: 228, h: 200, l: 232, c: 204 },
  { o: 204, h: 210, l: 185, c: 208 },
  { o: 208, h: 180, l: 212, c: 184 },
  { o: 184, h: 190, l: 160, c: 188 },
  { o: 188, h: 165, l: 192, c: 168 },
  { o: 168, h: 175, l: 145, c: 172 },
  { o: 172, h: 150, l: 176, c: 154 },
  { o: 154, h: 158, l: 130, c: 156 },
  { o: 156, h: 132, l: 160, c: 136 },
  { o: 136, h: 142, l: 115, c: 140 },
]

function DashboardChart() {
  const width = 640
  const height = 220
  const step = width / CANDLES.length

  return (
    <svg
      className="dashboard-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative candlestick price chart"
    >
      <g stroke="#1e2830" strokeWidth="1">
        <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} />
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} />
        <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} />
      </g>

      {CANDLES.map((c, i) => {
        const x = i * step + step / 2
        const up = c.c < c.o
        const color = up ? '#35d07f' : '#ff6b6b'
        const bodyTop = Math.min(c.o, c.c)
        const bodyBottom = Math.max(c.o, c.c)
        return (
          <g key={i}>
            <line x1={x} y1={c.h} x2={x} y2={c.l} stroke={color} strokeWidth="1.5" />
            <rect
              x={x - step * 0.28}
              y={bodyTop}
              width={step * 0.56}
              height={Math.max(bodyBottom - bodyTop, 2)}
              fill={color}
              rx="1.5"
            />
          </g>
        )
      })}
    </svg>
  )
}

export default DashboardChart
