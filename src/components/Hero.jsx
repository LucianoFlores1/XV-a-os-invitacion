import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Sparkle } from '@phosphor-icons/react'
import { CONFIG, deseos } from '../config'
import { fechaLarga } from '../lib/fecha'
import { useToast } from '../lib/toast'

const ease = [0.23, 1, 0.32, 1]

function Letras({ texto, delay = 0, abierto }) {
  return (
    <span aria-label={texto} className="inline-block">
      {[...texto].map((c, i) => (
        <motion.span
          aria-hidden
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={abierto ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease, delay: delay + i * 0.05 }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ abierto }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const toast = useToast()
  const [estrellas, setEstrellas] = useState([])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.82])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])

  function pedirDeseo() {
    const id = Date.now()
    const top = 10 + Math.random() * 30
    setEstrellas((e) => [...e, { id, top }])
    setTimeout(() => setEstrellas((e) => e.filter((s) => s.id !== id)), 1400)
    toast(deseos[Math.floor(Math.random() * deseos.length)])
  }

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pt-16 pb-24">
      <AnimatePresence>
        {estrellas.map((s) => (
          <motion.span
            key={s.id}
            aria-hidden
            initial={{ x: '-20vw', y: 0, opacity: 0 }}
            animate={{ x: '120vw', y: '30vh', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, ease: 'easeIn' }}
            style={{ top: `${s.top}%` }}
            className="pointer-events-none absolute left-0 h-[2px] w-32 rotate-[14deg] rounded-full bg-[linear-gradient(90deg,transparent,#dbe7ff)] shadow-[0_0_12px_#9cc3ff]"
          />
        ))}
      </AnimatePresence>

      <motion.div style={{ scale, opacity, y }} className="relative flex max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={abierto ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="text-xs tracking-[0.35em] text-sky uppercase"
        >
          Mis XV años
        </motion.p>

        <h1 className="mt-4 pb-2 font-script text-[clamp(4.2rem,17vw,10rem)] leading-[1.1] text-ink">
          <Letras texto={CONFIG.nombre} delay={0.25} abierto={abierto} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={abierto ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 1 }}
          className="mt-4 max-w-md font-serif text-2xl leading-snug text-mist italic md:text-3xl"
        >
          Te invito a celebrar conmigo una noche soñada.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={abierto ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 1.2 }}
          className="mt-6 text-lg font-medium tracking-wide text-ink"
        >
          {fechaLarga}
          {CONFIG.hora && ` · ${CONFIG.hora} h`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={abierto ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 1.4 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href="#confirmar" className="btn btn-primary">
            Confirmar asistencia
          </a>
          <button type="button" onClick={pedirDeseo} className="btn btn-ghost">
            <Sparkle size={18} weight="fill" className="text-sky" />
            Pedí un deseo
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
