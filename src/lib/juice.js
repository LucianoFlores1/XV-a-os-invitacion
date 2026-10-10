// "Juice": pequeñas respuestas físicas a cada toque (brillos, vibración, sonido suave).

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STAR =
  'M12 0C12.9 7.6 16.4 11.1 24 12 16.4 12.9 12.9 16.4 12 24 11.1 16.4 7.6 12.9 0 12 7.6 11.1 11.1 7.6 12 0Z'
const COLORES = ['#1d44c4', '#4f7cf0', '#9dbcff', '#ffffff', '#c9d8ff']

// Estallido de brillitos en un punto de la pantalla
export function sparkle(x, y, { count = 8, spread = 60, size = 14 } = {}) {
  if (reduce()) return
  for (let i = 0; i < count; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const s = size * (0.5 + Math.random() * 0.8)
    el.setAttribute('viewBox', '0 0 24 24')
    el.setAttribute('width', s)
    el.setAttribute('height', s)
    el.innerHTML = `<path d="${STAR}" fill="${COLORES[i % COLORES.length]}"/>`
    Object.assign(el.style, {
      position: 'fixed',
      left: `${x - s / 2}px`,
      top: `${y - s / 2}px`,
      pointerEvents: 'none',
      zIndex: 70,
      filter: 'drop-shadow(0 1px 2px rgb(29 68 196 / .35))',
    })
    document.body.appendChild(el)
    const ang = (Math.PI * 2 * i) / count + Math.random() * 0.6
    const d = spread * (0.5 + Math.random() * 0.6)
    const dx = Math.cos(ang) * d
    const dy = Math.sin(ang) * d
    el.animate(
      [
        { transform: 'translate(0,0) scale(0.4) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx * 0.8}px, ${dy * 0.8}px) scale(1) rotate(90deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy + 16}px) scale(0.6) rotate(140deg)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 250, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    ).onfinish = () => el.remove()
  }
}

export function sparkleFrom(el, opts) {
  const r = el.getBoundingClientRect()
  sparkle(r.left + r.width / 2, r.top + r.height / 2, opts)
}

export function buzz(ms = 12) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // sin vibración
  }
}

// Sonido "pop/campanita" sintetizado, sin archivos
let ctx
export function chime(nota = 880) {
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)()
    const t = ctx.currentTime
    ;[1, 1.5].forEach((m, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(nota * m, t + i * 0.06)
      g.gain.setValueAtTime(0.0001, t + i * 0.06)
      g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.06 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 0.35)
      o.connect(g).connect(ctx.destination)
      o.start(t + i * 0.06)
      o.stop(t + i * 0.06 + 0.4)
    })
  } catch {
    // sin audio
  }
}
