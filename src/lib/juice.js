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

// ---------- Sonidos sintetizados (sin archivos) ----------
// Se silencian cuando la persona pausa la música.
let ctx
let mudo = false
export function setMudo(v) {
  mudo = v
}
function audio() {
  if (mudo) return null
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tono(c, { f, t = 0, dur = 0.3, vol = 0.12, tipo = 'sine', f2 }) {
  const o = c.createOscillator()
  const g = c.createGain()
  const t0 = c.currentTime + t
  o.type = tipo
  o.frequency.setValueAtTime(f, t0)
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur * 0.8)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

// campanita de dos notas
export function chime(nota = 880) {
  const c = audio()
  if (!c) return
  tono(c, { f: nota, dur: 0.4 })
  tono(c, { f: nota * 1.5, t: 0.06, dur: 0.45, vol: 0.09 })
}

// pop corto para botones (con leve variación de tono para que no suene repetido)
export function pop() {
  const c = audio()
  if (!c) return
  const f = 520 + Math.random() * 120
  tono(c, { f, f2: f * 1.9, dur: 0.09, vol: 0.09, tipo: 'triangle' })
}

// blip que sube o baja (contador de personas, sí/no)
export function blip(sube = true) {
  const c = audio()
  if (!c) return
  tono(c, { f: sube ? 660 : 520, f2: sube ? 990 : 390, dur: 0.12, vol: 0.08, tipo: 'triangle' })
}

// arpegio con brillo (confirmar, abrir la invitación)
export function arpegio() {
  const c = audio()
  if (!c) return
  ;[784, 988, 1175, 1568, 1976].forEach((f, i) => tono(c, { f, t: i * 0.07, dur: 0.5, vol: 0.08 }))
}

// whoosh de aire (se abre el sobre)
export function whoosh() {
  const c = audio()
  if (!c) return
  const dur = 0.7
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 1.2
  bp.frequency.setValueAtTime(400, c.currentTime)
  bp.frequency.exponentialRampToValueAtTime(3200, c.currentTime + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.12)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  src.connect(bp).connect(g).connect(c.destination)
  src.start()
}
