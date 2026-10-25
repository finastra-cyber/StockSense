function AuthChart() {
  return (
    <svg
      className="auth__chart"
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35d07f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#35d07f" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g stroke="#1e2830" strokeWidth="1">
        <line x1="0" y1="120" x2="400" y2="120" />
        <line x1="0" y1="220" x2="400" y2="220" />
        <line x1="0" y1="320" x2="400" y2="320" />
        <line x1="0" y1="420" x2="400" y2="420" />
      </g>

      <path
        d="M0,420 L20,410 L40,395 L60,400 L80,370 L100,380 L120,340 L140,350
           L160,300 L180,310 L200,260 L220,275 L240,230 L260,245 L280,190
           L300,205 L320,160 L340,175 L360,120 L380,140 L400,95"
        fill="none"
        stroke="#35d07f"
        strokeWidth="2"
      />

      <path
        d="M0,420 L20,410 L40,395 L60,400 L80,370 L100,380 L120,340 L140,350
           L160,300 L180,310 L200,260 L220,275 L240,230 L260,245 L280,190
           L300,205 L320,160 L340,175 L360,120 L380,140 L400,95
           L400,520 L0,520 Z"
        fill="url(#fade)"
        stroke="none"
      />
    </svg>
  )
}

export default AuthChart
