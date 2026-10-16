import { useEffect, useRef } from 'react'

// Partículas ambientales en un único canvas fijo: brillitos, destellos difusos y perlitas
// que suben despacio. Al scrollear se desplazan según su profundidad (parallax).
// Los sprites se dibujan una sola vez y se reutilizan para que cada cuadro sea barato.

function sprite(tamano, dibujar) {
  const c = document.createElement('canvas')
  c.width = c.height = tamano
  dibujar(c.getContext('2d'), tamano)
  return c
}

function crearSprites() {
  const estrella = (color) =>
    sprite(48, (x, s) => {
      const m = s / 2
      const g = x.createRadialGradient(m, m, 0, m, m, m)
      g.addColorStop(0, color.replace('A', '0.55'))
      g.addColorStop(1, color.replace('A', '0'))
      x.fillStyle = g
      x.fillRect(0, 0, s, s)
      x.fillStyle = color.replace('A', '1')
      x.beginPath()
      x.moveTo(m, 4)
      x.quadraticCurveTo(m + 2, m - 2, s - 4, m)
      x.quadraticCurveTo(m + 2, m + 2, m, s - 4)
      x.quadraticCurveTo(m - 2, m + 2, 4, m)
      x.quadraticCurveTo(m - 2, m - 2, m, 4)
      x.fill()
    })
  const bokeh = sprite(64, (x, s) => {
    const m = s / 2
    const g = x.createRadialGradient(m, m, 0, m, m, m)
    g.addColorStop(0, 'rgba(255,255,255,0.9)')
    g.addColorStop(0.4, 'rgba(196,214,255,0.45)')
    g.addColorStop(1, 'rgba(196,214,255,0)')
    x.fillStyle = g
    x.fillRect(0, 0, s, s)
  })
  const perla = sprite(32, (x, s) => {
    const m = s / 2
    const g = x.createRadialGradient(m * 0.7, m * 0.6, 1, m, m, m * 0.9)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.5, '#eef2fb')
    g.addColorStop(1, '#a9b6d6')
    x.fillStyle = g
    x.beginPath()
    x.arc(m, m, m * 0.85, 0, Math.PI * 2)
    x.fill()
  })
  return [estrella('rgba(255,255,255,A)'), estrella('rgba(79,124,240,A)'), bokeh, perla]
}

export default function Particulas() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const sprites = crearSprites()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let W = 0
    let H = 0
    let parts = []
    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()

    const nueva = (enCualquierAltura) => {
      const z = 0.35 + Math.random() * 0.65 // profundidad
      const tipo = Math.random()
      const s = tipo < 0.45 ? 0 : tipo < 0.6 ? 1 : tipo < 0.88 ? 2 : 3
      return {
        x: Math.random() * W,
        y: enCualquierAltura ? Math.random() * H : H + 30,
        z,
        s,
        size: (s === 2 ? 26 : s === 3 ? 9 : 16) * z,
        vy: (8 + Math.random() * 14) * z,
        fase: Math.random() * Math.PI * 2,
        giro: (Math.random() - 0.5) * 0.6,
        rot: Math.random() * Math.PI,
        alpha: (s === 2 ? 0.5 : 0.85) * (0.4 + z * 0.6),
      }
    }

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = W < 640 ? 26 : 42
      parts = Array.from({ length: n }, () => nueva(true))
    }

    const frame = (t) => {
      const dt = Math.min(0.05, (t - lastT) / 1000)
      lastT = t
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      ctx.clearRect(0, 0, W, H)
      for (const p of parts) {
        p.y -= p.vy * dt + dy * p.z * 0.35
        p.fase += dt * 1.2
        p.rot += p.giro * dt
        const x = p.x + Math.sin(p.fase) * 12 * p.z
        if (p.y < -40) Object.assign(p, nueva(false))
        if (p.y > H + 60) p.y = -30
        const tw = p.s < 2 ? 0.55 + 0.45 * Math.sin(p.fase * 2.3) : 1
        ctx.globalAlpha = p.alpha * tw
        const img = sprites[p.s]
        if (p.s < 2) {
          ctx.save()
          ctx.translate(x, p.y)
          ctx.rotate(p.rot)
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        } else {
          ctx.drawImage(img, x - p.size / 2, p.y - p.size / 2, p.size, p.size)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const visibilidad = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        lastT = performance.now()
        lastY = window.scrollY
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visibilidad)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibilidad)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
}
