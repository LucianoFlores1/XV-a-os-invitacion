import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CONFIG } from '../config'
import { fechaLarga } from '../lib/fecha'

const ease = [0.23, 1, 0.32, 1]

// Sobre de entrada: al tocarlo se abre la solapa, sube la tarjeta y arranca la música.
export default function Intro({ onOpen }) {
  const [abriendo, setAbriendo] = useState(false)
  const [visible, setVisible] = useState(true)
  const [solapaAtras, setSolapaAtras] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    document.body.classList.toggle('locked', visible)
    return () => document.body.classList.remove('locked')
  }, [visible])

  function abrir() {
    if (abriendo) return
    setAbriendo(true)
    onOpen()
    setTimeout(() => setSolapaAtras(true), 300)
    setTimeout(() => setVisible(false), reduce ? 50 : 1500)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-night px-6"
        >
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_45%,rgb(46_92_190/0.5),transparent_75%)]" />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: abriendo ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative font-serif text-2xl italic text-mist"
          >
            Tenés una invitación
          </motion.p>

          <motion.button
            type="button"
            onClick={abrir}
            aria-label="Abrir la invitación"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            whileTap={{ scale: 0.97 }}
            className="relative aspect-[3/2] w-[min(84vw,380px)] [perspective:1200px]"
          >
            {/* tarjeta interior */}
            <motion.div
              animate={abriendo ? { y: '-46%' } : { y: '0%' }}
              transition={{ duration: 0.8, ease, delay: abriendo ? 0.45 : 0 }}
              className="absolute inset-x-[6%] top-[8%] bottom-[6%] flex flex-col items-center justify-center rounded-xl bg-[linear-gradient(180deg,#f3f6fd,#dbe5f7)] text-deep"
            >
              <span className="font-script text-4xl leading-tight">{CONFIG.nombre}</span>
              <span className="text-xs tracking-[0.3em] uppercase">Mis XV</span>
            </motion.div>

            {/* cuerpo del sobre */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#1a3a85,#0f2357)] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_top_right,#16337a_50%,transparent_50%),linear-gradient(to_top_left,#16337a_50%,transparent_50%)] bg-[length:50%_100%] bg-[position:left_bottom,right_bottom] bg-no-repeat" />
            </div>

            {/* solapa */}
            <motion.div
              animate={{ rotateX: abriendo ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
              style={{ transformOrigin: 'top', clipPath: 'polygon(0 0, 100% 0, 50% 62%)', zIndex: solapaAtras ? -1 : 2 }}
              className="absolute inset-x-0 top-0 h-full rounded-t-2xl bg-[linear-gradient(180deg,#24479a,#1a3a85)]"
            />

            {/* sello */}
            <motion.span
              animate={abriendo ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease }}
              className="absolute left-1/2 top-[58%] z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#dbe7ff,#9cc3ff_55%,#6f9be6)] font-script text-2xl text-deep shadow-[0_6px_18px_rgb(0_0_0/0.45),inset_0_-3px_6px_rgb(18_42_99/0.35)]"
            >
              {CONFIG.iniciales}
            </motion.span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: abriendo ? 0 : 1 }}
            transition={{ duration: 0.5, delay: abriendo ? 0 : 0.5 }}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            <span className="text-sm text-mist">Tocá el sobre para abrirla</span>
            <span className="text-xs text-mist/70">{fechaLarga} · con música</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
