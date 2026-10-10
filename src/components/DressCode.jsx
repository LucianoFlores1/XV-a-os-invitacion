import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BaseballCap, Check, CoatHanger, Dress, HighHeel, Hoodie, Pants, ShirtFolded, SoccerBall, X } from '@phosphor-icons/react'
import { useToast } from '../lib/toast'

const PRENDAS = [
  { id: 'vestido', nombre: 'Vestido', Icono: Dress, pasa: true, nota: 'Impecable.' },
  { id: 'gorra', nombre: 'Gorra', Icono: BaseballCap, pasa: false, nota: 'Hoy queda en casa.' },
  { id: 'camisa', nombre: 'Camisa', Icono: ShirtFolded, pasa: true, nota: 'Perfecta.' },
  { id: 'jogging', nombre: 'Jogging', Icono: Pants, pasa: false, nota: 'Nada de ropa deportiva.' },
  { id: 'saco', nombre: 'Saco o blazer', Icono: CoatHanger, pasa: true, nota: 'Suma puntos.' },
  { id: 'camiseta', nombre: 'Camiseta de fútbol', Icono: SoccerBall, pasa: false, nota: 'Ni la de la Selección.' },
  { id: 'tacos', nombre: 'Tacos o zapatos', Icono: HighHeel, pasa: true, nota: 'Listos para la pista.' },
  { id: 'buzo', nombre: 'Buzo deportivo', Icono: Hoodie, pasa: false, nota: 'Para otro día.' },
]

function Prenda({ p, visto, onTap }) {
  const [shake, setShake] = useState(0)
  return (
    <motion.button
      type="button"
      onClick={() => {
        onTap(p)
        if (!p.pasa) setShake((n) => n + 1)
      }}
      whileTap={{ scale: 0.96 }}
      aria-label={`${p.nombre}: ${visto ? (p.pasa ? 'pasa' : 'no pasa') : '¿pasa o no pasa?'}`}
      className={`relative flex aspect-[4/5] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border p-4 text-center transition-colors duration-300 ${
        visto
          ? p.pasa
            ? 'border-sky/50 bg-sky/15'
            : 'border-white/10 bg-white/[0.03]'
          : 'border-line bg-night-2/60 hover:border-sky/40'
      }`}
    >
      <span key={shake} className={shake ? 'shake' : ''}>
        <p.Icono size={44} weight="light" className={visto && !p.pasa ? 'text-mist/50' : 'text-ink'} />
      </span>
      <span className="text-sm font-medium text-ink">{p.nombre}</span>
      <AnimatePresence mode="wait" initial={false}>
        {visto ? (
          <motion.span
            key="v"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
            className={`flex items-center gap-1.5 text-xs ${p.pasa ? 'text-sky' : 'text-mist'}`}
          >
            {p.pasa ? <Check size={14} weight="bold" /> : <X size={14} weight="bold" />}
            {p.nota}
          </motion.span>
        ) : (
          <motion.span key="q" exit={{ opacity: 0 }} className="text-xs text-mist">
            ¿Pasa o no pasa?
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function DressCode() {
  const [vistos, setVistos] = useState(() => new Set())
  const toast = useToast()

  function tap(p) {
    if (vistos.has(p.id)) return
    const next = new Set(vistos).add(p.id)
    setVistos(next)
    if (next.size === PRENDAS.length) toast('Dress code aprobado. Ya sabés qué ponerte.')
  }

  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-xl"
        >
          <p className="text-xs tracking-[0.35em] text-sky uppercase">Dress code</p>
          <h2 className="mt-3 font-serif text-5xl leading-tight text-ink md:text-6xl">Elegante sport</h2>
          <p className="mt-4 text-lg text-mist">
            No se permite ropa deportiva ni gorras. Tocá cada prenda y descubrí si pasa la puerta.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {PRENDAS.map((p) => (
            <Prenda key={p.id} p={p} visto={vistos.has(p.id)} onTap={tap} />
          ))}
        </div>
        <p className="mt-5 text-sm text-mist" aria-live="polite">
          {vistos.size === 0 ? 'Probá con la gorra.' : `Descubriste ${vistos.size} de ${PRENDAS.length}`}
        </p>
      </div>
    </section>
  )
}
