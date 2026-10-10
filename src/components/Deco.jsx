// Formas decorativas simples: moño de satén y brillito de cuatro puntas.

export function Bow({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 84" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="bow-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fa2ff" />
          <stop offset="0.55" stopColor="#2f58d6" />
          <stop offset="1" stopColor="#1a3aa8" />
        </linearGradient>
        <linearGradient id="bow-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".7" />
          <stop offset=".5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M56 44 L38 82 L48 76 L56 84 L62 46Z" fill="url(#bow-a)" />
      <path d="M64 44 L82 82 L72 76 L64 84 L58 46Z" fill="url(#bow-a)" />
      <path d="M60 40C42 8 6 6 8 32 10 54 40 54 60 40Z" fill="url(#bow-a)" />
      <path d="M60 40C78 8 114 6 112 32 110 54 80 54 60 40Z" fill="url(#bow-a)" />
      <path d="M57 38C42 16 16 14 15 30 15 22 40 22 57 38Z" fill="url(#bow-b)" />
      <path d="M63 38C78 16 104 14 105 30 105 22 80 22 63 38Z" fill="url(#bow-b)" />
      <ellipse cx="60" cy="41" rx="9" ry="10" fill="url(#bow-a)" />
      <ellipse cx="58" cy="37" rx="4" ry="3" fill="#fff" opacity=".55" />
    </svg>
  )
}

export function Sparkle({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path
        d="M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Guirnalda de perlas colgando en curva
export function Perlas({ className = '', n = 23, caida = 34, k = 1 }) {
  const W = 420
  const perlas = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const x = 10 + t * (W - 20)
    const y = 10 + caida * 4 * t * (1 - t)
    const r = (6.2 + Math.sin(t * Math.PI) * 1.6) * k
    return { x, y, r }
  })
  return (
    <svg viewBox={`0 0 ${W} ${caida + 20 + 10 * k}`} className={className} aria-hidden>
      <defs>
        <radialGradient id="perla" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#eef2fb" />
          <stop offset="0.8" stopColor="#c3cde6" />
          <stop offset="1" stopColor="#9eacd0" />
        </radialGradient>
      </defs>
      <path
        d={`M10 10 Q ${W / 2} ${10 + caida * 2} ${W - 10} 10`}
        fill="none"
        stroke="#b9c6e6"
        strokeWidth="1"
      />
      {perlas.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y + 1.5} r={p.r} fill="rgb(29 68 196 / .16)" />
          <circle cx={p.x} cy={p.y} r={p.r} fill="url(#perla)" />
          <ellipse cx={p.x - p.r * 0.3} cy={p.y - p.r * 0.35} rx={p.r * 0.3} ry={p.r * 0.2} fill="#fff" opacity=".9" />
        </g>
      ))}
    </svg>
  )
}
