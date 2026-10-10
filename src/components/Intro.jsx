import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { animate, AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { fechaLarga } from '../lib/fecha'
import { buzz, chime, sparkleFrom } from '../lib/juice'
import { Bow, Sparkle } from './Deco'

const ease = [0.23, 1, 0.32, 1]
const easeInOut = [0.77, 0, 0.175, 1]

const BRILLOS = [
  { x: '12%', y: '18%', s: 18, d: 2.4 },
  { x: '82%', y: '14%', s: 12, d: 3.1 },
  { x: '88%', y: '62%', s: 20, d: 2.8 },
  { x: '8%', y: '70%', s: 14, d: 3.4 },
  { x: '30%', y: '86%', s: 10, d: 2.2 },
  { x: '68%', y: '88%', s: 16, d: 2.9 },
  { x: '50%', y: '9%', s: 9, d: 3.6 },
]

// Sobre de entrada. Al tocarlo: brillos, se abre la solapa, sale la tarjeta
// y el papel se expande en círculo desde la tarjeta hasta revelar la invitación.
export default function Intro({ onOpen }) {
  const [fase, setFase] = useState('cerrado') // cerrado | abriendo | revelando
  const [visible, setVisible] = useState(true)
  const [solapaAtras, setSolapaAtras] = useState(false)
  const reduce = useReducedMotion()
  const sello = useRef(null)
  const tarjeta = useRef(null)

  const r = useMotionValue(0)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const mask = useMotionTemplate`radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, #000 calc(${r}px + 2px))`

  useEffect(() => {
    document.body.classList.toggle('locked', visible)
    return () => document.body.classList.remove('locked')
  }, [visible])

  function abrir() {
    if (fase !== 'cerrado') return
    buzz(18)
    chime(988)
    if (sello.current) sparkleFrom(sello.current, { count: 14, spread: 110, size: 18 })
    setFase('abriendo')
    if (reduce) {
      onOpen()
      setTimeout(() => setVisible(false), 150)
      return
    }
    setTimeout(() => setSolapaAtras(true), 280)
    setTimeout(() => {
      const b = tarjeta.current.getBoundingClientRect()
      const x = b.left + b.width / 2
      const y = b.top + b.height / 2
      cx.set(x)
      cy.set(y)
      const max = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20
      setFase('revelando')
      onOpen()
      animate(r, max, { duration: 0.95, ease: easeInOut }).then(() => setVisible(false))
      // lluvia de estrellitas cuando se abre la página
      setTimeout(() => {
        const base = { spread: 70, startVelocity: 38, gravity: 0.7, ticks: 260, scalar: 1.1, shapes: ['star'], colors: ['#1d44c4', '#4f7cf0', '#9dbcff', '#ffffff'], disableForReducedMotion: true }
        confetti({ ...base, particleCount: 45, angle: 60, origin: { x: 0, y: 0.6 } })
        confetti({ ...base, particleCount: 45, angle: 120, origin: { x: 1, y: 0.6 } })
      }, 450)
    }, 1150)
  }

  const abierto = fase !== 'cerrado'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={fase === 'revelando' ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
          className="satin-cobalt glitter fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-hidden px-6"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_45%,rgb(120_160_255/0.35),transparent_70%)]" />
          {BRILLOS.map((b, i) => (
            <Sparkle
              key={i}
              className="twinkle absolute text-white"
              style={{ left: b.x, top: b.y, width: b.s, height: b.s, '--d': `${b.d}s`, '--delay': `${-i * 0.4}s` }}
            />
          ))}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: abierto ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative font-script text-5xl text-white"
          >
            Tenés una invitación
          </motion.p>

          <motion.button
            type="button"
            onClick={abrir}
            aria-label="Abrir la invitación"
            initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -4 }}
            animate={
              abierto
                ? { opacity: 1, y: 40, scale: 1, rotate: 0 }
                : { opacity: 1, y: [0, -8, 0], scale: 1, rotate: [-2, 2, -2] }
            }
            transition={
              abierto
                ? { type: 'spring', duration: 0.6, bounce: 0.35 }
                : { opacity: { duration: 0.6 }, scale: { type: 'spring', duration: 0.8, bounce: 0.4 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' } }
            }
            whileTap={{ scale: 0.94 }}
            className="relative aspect-[3/2] w-[min(84vw,380px)] [perspective:1200px]"
          >
            {/* tarjeta interior */}
            <motion.div
              ref={tarjeta}
              animate={abierto ? { y: '-58%' } : { y: '0%' }}
              transition={{ type: 'spring', duration: 0.8, bounce: 0.25, delay: abierto ? 0.4 : 0 }}
              className="paper-tex absolute inset-x-[6%] top-[6%] bottom-[8%] flex flex-col items-center justify-center rounded-xl text-cobalt shadow-[0_10px_30px_-10px_rgb(10_30_100/0.5)]"
            >
              <span className="text-[10px] font-semibold tracking-[0.4em] text-cobalt/70 uppercase">Mis XV</span>
              <span className="font-script text-5xl leading-tight">{CONFIG.nombre}</span>
            </motion.div>

            {/* cuerpo del sobre */}
            <div className="lino absolute inset-0 overflow-hidden rounded-2xl shadow-[0_40px_80px_-20px_rgb(5_15_70/0.7)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_top_right,#e3ecff_50%,transparent_50%),linear-gradient(to_top_left,#dbe6ff_50%,transparent_50%)] bg-[length:50%_100%] bg-[position:left_bottom,right_bottom] bg-no-repeat" />
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.8)]" />
            </div>

            {/* solapa */}
            <motion.div
              animate={{ rotateX: abierto ? 180 : 0 }}
              transition={{ duration: 0.55, ease: easeInOut }}
              style={{ transformOrigin: 'top', clipPath: 'polygon(0 0, 100% 0, 50% 64%)', zIndex: solapaAtras ? -1 : 2 }}
              className="paper-tex absolute inset-x-0 top-0 h-full rounded-t-2xl shadow-[0_2px_0_rgb(29_68_196/0.08)]"
            />

            {/* moño */}
            <motion.span
              ref={sello}
              animate={abierto ? { opacity: 0, scale: 0.6, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="absolute left-1/2 top-[60%] z-10 w-28 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_8px_10px_rgb(10_30_100/0.35)]"
            >
              <Bow className="w-full" />
            </motion.span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: abierto ? 0 : 1 }}
            transition={{ duration: 0.4, delay: abierto ? 0 : 0.6 }}
            className="relative flex flex-col items-center gap-1.5 text-center text-white"
          >
            <span className="text-base font-medium">Tocá el sobre para abrirla</span>
            <span className="text-sm text-white/75">{fechaLarga} · subí el volumen</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
