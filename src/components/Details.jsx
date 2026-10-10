import { motion } from 'motion/react'
import { ArrowUpRight, CalendarPlus, MapPin } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { anio, dia, fechaLarga, googleCalendarUrl, mes, mesNombre } from '../lib/fecha'
import { useToast } from '../lib/toast'

const ease = [0.23, 1, 0.32, 1]
const iniciales = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function Calendario() {
  const primero = new Date(anio, mes - 1, 1)
  const offset = (primero.getDay() + 6) % 7 // semana arranca el lunes
  const total = new Date(anio, mes, 0).getDate()
  const celdas = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  return (
    <div>
      <p className="font-serif text-3xl text-ink capitalize">
        {mesNombre} <span className="text-mist">{anio}</span>
      </p>
      <div className="mt-5 grid grid-cols-7 gap-y-2 text-center text-sm">
        {iniciales.map((d, i) => (
          <span key={i} className="pb-1 text-xs text-mist">
            {d}
          </span>
        ))}
        {celdas.map((n, i) =>
          n === dia ? (
            <span key={i} className="relative flex aspect-square items-center justify-center font-semibold text-night">
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', duration: 0.6, bounce: 0.35, delay: 0.3 }}
                className="absolute inset-[6%] rounded-full bg-sky"
              />
              <span className="relative">{n}</span>
            </span>
          ) : (
            <span key={i} className={`flex aspect-square items-center justify-center ${n ? 'text-ink/70' : ''}`}>
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  )
}

export default function Details() {
  const toast = useToast()
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-4xl text-ink md:text-5xl">
          Cuándo y <em>dónde</em>
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="card p-6 md:col-span-2 md:p-8"
          >
            <Calendario />
            <a
              href={googleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={() => toast('¡Agendado! No te lo pierdas.')}
              className="btn btn-ghost mt-8 w-full"
            >
              <CalendarPlus size={20} />
              Agendar en el calendario
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="card relative flex flex-col justify-between overflow-hidden p-6 md:col-span-3 md:p-10"
          >
            <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(156_195_255/0.28),transparent_70%)]" />
            <div className="relative">
              <span className="flex size-12 items-center justify-center rounded-full bg-sky/15 text-sky">
                <MapPin size={24} weight="fill" />
              </span>
              <p className="mt-6 text-sm text-mist">{fechaLarga}{CONFIG.hora && ` · ${CONFIG.hora} h`}</p>
              <p className="mt-2 font-serif text-4xl leading-tight text-ink md:text-5xl">
                {CONFIG.lugar || 'Te espero acá'}
              </p>
              <p className="mt-3 max-w-sm text-mist">Tocá el botón y Google Maps te lleva directo a la puerta.</p>
            </div>
            <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary relative mt-10 self-start">
              Cómo llegar
              <ArrowUpRight size={18} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
