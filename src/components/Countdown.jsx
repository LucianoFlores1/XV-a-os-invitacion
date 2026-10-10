import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { fechaEvento } from '../lib/fecha'
import { Sparkle } from './Deco'
import Reveal from './Reveal'

function calcular() {
  const diff = Math.max(0, fechaEvento.getTime() - Date.now())
  return {
    fin: diff === 0,
    dias: Math.floor(diff / 86400000),
    horas: Math.floor(diff / 3600000) % 24,
    minutos: Math.floor(diff / 60000) % 60,
    segundos: Math.floor(diff / 1000) % 60,
  }
}

function Tile({ n, label, i }) {
  return (
    <Reveal delay={0.1 + i * 0.07} y={30} className="flex flex-col items-center">
      <div className="relative flex aspect-square w-full max-w-[150px] items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#ffffff,#e6eeff)] shadow-[inset_0_-4px_0_rgb(29_68_196/0.15),0_14px_30px_-12px_rgb(5_20_80/0.55)]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={n}
            initial={{ y: '-60%', opacity: 0, scale: 0.8 }}
            animate={{ y: '0%', opacity: 1, scale: 1 }}
            exit={{ y: '60%', opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.45 }}
            className="font-display text-[clamp(2.6rem,11vw,4.8rem)] leading-none font-extrabold tracking-tight text-cobalt tabular-nums"
          >
            {String(n).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span aria-hidden className="absolute inset-x-3 top-2 h-1/3 rounded-full bg-gradient-to-b from-white/90 to-transparent" />
      </div>
      <span className="mt-3 text-sm font-semibold tracking-wide text-white/85 uppercase">{label}</span>
    </Reveal>
  )
}

export default function Countdown() {
  const [t, setT] = useState(calcular)
  useEffect(() => {
    const id = setInterval(() => setT(calcular()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="px-3 py-10 sm:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-[radial-gradient(90%_80%_at_50%_0%,#4673ec_0%,#1d44c4_55%,#1a3aa8_100%)] px-5 py-16 text-center shadow-[0_40px_80px_-40px_rgb(29_68_196/0.8)] sm:px-10 md:py-20">
        {[
          ['8%', '14%', 18],
          ['90%', '20%', 12],
          ['85%', '80%', 20],
          ['6%', '84%', 14],
        ].map(([x, y, s], i) => (
          <Sparkle key={i} className="twinkle absolute text-white/80" style={{ left: x, top: y, width: s, height: s, '--delay': `${-i * 0.6}s` }} />
        ))}
        <Reveal>
          <h2 className="pb-2 font-script text-[clamp(3.2rem,12vw,5.5rem)] leading-[1.1] text-white">
            {t.fin ? '¡Llegó el día!' : 'Falta muy poquito'}
          </h2>
        </Reveal>
        {!t.fin && (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-2.5 sm:gap-5">
            <Tile i={0} n={t.dias} label={t.dias === 1 ? 'día' : 'días'} />
            <Tile i={1} n={t.horas} label="horas" />
            <Tile i={2} n={t.minutos} label="min" />
            <Tile i={3} n={t.segundos} label="seg" />
          </div>
        )}
      </div>
    </section>
  )
}
