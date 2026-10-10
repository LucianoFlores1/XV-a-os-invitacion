import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { fechaEvento } from '../lib/fecha'

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

function Digito({ valor }) {
  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block"
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Bloque({ n, label }) {
  const txt = String(n).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-[clamp(3rem,11vw,7rem)] leading-none text-ink">
        {[...txt].map((d, i) => (
          <Digito key={i} valor={d} />
        ))}
      </span>
      <span className="mt-2 text-sm text-mist">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const [t, setT] = useState(calcular)
  useEffect(() => {
    const id = setInterval(() => setT(calcular()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="px-4 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="font-script text-5xl text-sky md:text-6xl">{t.fin ? '¡Llegó el día!' : 'Falta muy poco'}</h2>
        {!t.fin && (
          <div className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            <Bloque n={t.dias} label={t.dias === 1 ? 'día' : 'días'} />
            <Bloque n={t.horas} label="horas" />
            <Bloque n={t.minutos} label="minutos" />
            <Bloque n={t.segundos} label="segundos" />
          </div>
        )}
      </motion.div>
    </section>
  )
}
