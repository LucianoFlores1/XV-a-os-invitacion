import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { CONFIG } from '../config'
import { fechaLarga } from '../lib/fecha'
import { Bow, Perlas, Sparkle } from './Deco'

const spring = { type: 'spring', duration: 0.9, bounce: 0.35 }

// Decoración flotante. "p" es cuánto se mueve con el dedo o el mouse (profundidad).
const DECO = [
  { tipo: 'bow', x: '8%', y: '16%', w: 70, r: -18, p: 26 },
  { tipo: 'bow', x: '80%', y: '70%', w: 86, r: 14, p: 34 },
  { tipo: 'star', x: '84%', y: '14%', w: 26, p: 18 },
  { tipo: 'star', x: '14%', y: '74%', w: 20, p: 14 },
  { tipo: 'star', x: '70%', y: '30%', w: 12, p: 10 },
  { tipo: 'star', x: '24%', y: '40%', w: 10, p: 8 },
  { tipo: 'star', x: '58%', y: '86%', w: 16, p: 20 },
]

function Flotante({ d, mx, my, abierto, i }) {
  const x = useTransform(mx, (v) => v * d.p)
  const y = useTransform(my, (v) => v * d.p)
  return (
    <motion.div style={{ left: d.x, top: d.y, x, y }} className="pointer-events-none absolute">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={abierto ? { opacity: 1, scale: 1 } : {}}
        transition={{ ...spring, delay: 0.5 + i * 0.07 }}
      >
        {d.tipo === 'bow' ? (
          <Bow className="float drop-shadow-[0_10px_14px_rgb(29_68_196/0.25)]" style={{ width: d.w, '--r': `${d.r}deg`, '--d': '6s', '--delay': `${-i}s` }} />
        ) : (
          <Sparkle className="twinkle text-cobalt/80" style={{ width: d.w, height: d.w, '--d': `${2.2 + i * 0.3}s`, '--delay': `${-i * 0.5}s` }} />
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ abierto }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 14 })
  const my = useSpring(rawY, { stiffness: 60, damping: 14 })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const xvY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '30%'])
  const xvRot = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -6])

  useEffect(() => {
    if (reduce) return
    const move = (e) => {
      rawX.set(e.clientX / innerWidth - 0.5)
      rawY.set(e.clientY / innerHeight - 0.5)
    }
    const tilt = (e) => {
      if (e.gamma == null) return
      rawX.set(Math.max(-0.5, Math.min(0.5, e.gamma / 60)))
      rawY.set(Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60)))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('deviceorientation', tilt)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('deviceorientation', tilt)
    }
  }, [reduce, rawX, rawY])

  const aparece = (delay) => ({
    initial: { opacity: 0, y: 30, scale: 0.96 },
    animate: abierto ? { opacity: 1, y: 0, scale: 1 } : {},
    transition: { ...spring, delay },
  })

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pt-14 pb-20">
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -30 }}
        animate={abierto ? { opacity: 1, y: 0 } : {}}
        transition={{ type: 'spring', duration: 1.2, bounce: 0.45, delay: 0.3 }}
        className="pointer-events-none absolute inset-x-0 -top-4 flex justify-center"
      >
        <Perlas className="w-[60vw] max-w-lg shrink-0" caida={56} n={14} k={1.7} />
        <Perlas className="w-[60vw] max-w-lg shrink-0" caida={56} n={14} k={1.7} />
      </motion.div>
      {DECO.map((d, i) => (
        <Flotante key={i} d={d} i={i} mx={mx} my={my} abierto={abierto} />
      ))}

      <div className="relative flex w-full max-w-3xl flex-col items-center text-center">

        <div className="relative flex w-full items-center justify-center">
          <motion.span
            aria-hidden
            style={{ y: xvY, rotate: xvRot }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={abierto ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', duration: 1.1, bounce: 0.4, delay: 0.15 }}
            className="holo-text font-display text-[clamp(12rem,58vw,22rem)] leading-none font-extrabold tracking-[-0.06em] select-none"
          >
            XV
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40, rotate: -6, scale: 0.9 }}
            animate={abierto ? { opacity: 1, y: 0, rotate: -4, scale: 1 } : {}}
            transition={{ type: 'spring', duration: 1, bounce: 0.45, delay: 0.45 }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 pb-2 font-script text-[clamp(4.2rem,20vw,9.5rem)] whitespace-nowrap leading-[1.1] text-cobalt drop-shadow-[0_4px_0_rgb(255_255_255)]"
          >
            {CONFIG.nombre}
          </motion.h1>
        </div>

        <motion.p {...aparece(0.75)} className="max-w-sm text-lg leading-snug text-balance text-soft md:text-xl">
          Te invito a celebrar la noche más linda de mis 15.
        </motion.p>

        <motion.p {...aparece(0.85)} className="mt-5 font-display text-2xl font-bold text-ink md:text-3xl">
          {fechaLarga}
          {CONFIG.hora && ` · ${CONFIG.hora} h`}
        </motion.p>

        <motion.div {...aparece(1)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#confirmar" className="btn btn-primary text-base">
            Confirmar asistencia
          </a>
          <a href="#musica" className="btn btn-soft text-base">
            Poné tu tema
          </a>
        </motion.div>
      </div>
    </section>
  )
}
