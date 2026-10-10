import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { CONFIG } from '../config'
import { dia, mes } from '../lib/fecha'
import { Sparkle } from './Deco'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

// Cinta de satén azul inclinada, con puntilla. Se acelera con la velocidad del scroll.
export default function Marquee() {
  const reduce = useReducedMotion()
  const fecha = `${String(dia).padStart(2, '0')}.${String(mes).padStart(2, '0')}`
  const items = ['Mis XV', CONFIG.nombre, fecha, 'Noche azul', 'Mis XV', CONFIG.nombre, fecha, 'Noche azul']

  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const d = Math.min(delta, 50) / 1000
    base.set(base.get() - 2.2 * d * (1 + Math.abs(factor.get())))
  })

  const fila = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={`px-6 ${i % 4 === 1 ? 'font-script text-4xl normal-case' : 'font-display text-2xl font-extrabold tracking-tight uppercase'}`}>{t}</span>
          <Sparkle className="size-5 text-baby" />
        </span>
      ))}
    </div>
  )
  return (
    <div aria-hidden className="satin-cobalt glitter puntilla-arriba puntilla-abajo relative z-10 my-8 -rotate-3 py-4 text-white shadow-[0_18px_40px_-16px_rgb(29_68_196/0.7)]">
      <div className="overflow-hidden">
        <motion.div style={{ x }} className="flex w-max will-change-transform [text-shadow:0_2px_0_rgb(10_25_90/0.35)]">
          {fila}
          {fila}
        </motion.div>
      </div>
    </div>
  )
}
