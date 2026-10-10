import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight, CalendarPlus, MapPin } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { dia, diaSemana, googleCalendarUrl, mesNombre } from '../lib/fecha'
import { Bow, Sparkle } from './Deco'
import Reveal from './Reveal'

// Tarjeta que se inclina levemente siguiendo el mouse (solo en compu)
function Tilt({ children, className = '' }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 150, damping: 15 })
  const sy = useSpring(ry, { stiffness: 150, damping: 15 })
  return (
    <motion.div
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Info() {
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight text-ink">
            Guardá <span className="font-script font-normal text-cobalt">la fecha</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          <Reveal className="md:row-span-2" rotate={-2}>
            <Tilt className="paper-card relative flex h-full flex-col items-center overflow-hidden p-8 text-center md:p-10">
              <Sparkle className="twinkle absolute top-8 right-8 size-6 text-cobalt/70" />
              <Sparkle className="twinkle absolute bottom-28 left-8 size-4 text-cobalt/50" style={{ '--delay': '-1s' }} />
              <p className="font-display text-2xl font-bold text-soft capitalize">{diaSemana}</p>
              <p className="chrome my-2 font-display text-[clamp(9rem,34vw,13rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">{dia}</p>
              <p className="font-script text-6xl text-cobalt">de {mesNombre}</p>
              {CONFIG.hora && <p className="mt-4 text-lg font-semibold text-ink">{CONFIG.hora} h</p>}
              <a href={googleCalendarUrl()} target="_blank" rel="noreferrer" className="btn btn-soft mt-8 w-full">
                <CalendarPlus size={20} weight="bold" />
                Agendar en el calendario
              </a>
            </Tilt>
          </Reveal>

          <Reveal delay={0.08} rotate={2}>
            <Tilt className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#2f58d6,#1d44c4)] p-8 text-white shadow-[0_30px_60px_-30px_rgb(29_68_196/0.8)] md:p-10">
              <div aria-hidden className="absolute -right-16 -bottom-16 size-64 rounded-full border-[28px] border-white/10" />
              <div aria-hidden className="absolute -right-4 -bottom-4 size-40 rounded-full border-[18px] border-white/10" />
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-cobalt">
                <MapPin size={24} weight="fill" />
              </span>
              <p className="mt-6 font-display text-3xl leading-tight font-bold md:text-4xl">{CONFIG.lugar || 'El lugar de la fiesta'}</p>
              <p className="mt-2 max-w-xs text-white/80">Tocá el botón y Google Maps te lleva directo a la puerta.</p>
              <a
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn relative mt-8 self-start bg-white px-6 py-3.5 text-cobalt shadow-[0_10px_20px_-8px_rgb(5_20_80/0.6)]"
              >
                Cómo llegar
                <ArrowUpRight size={18} weight="bold" />
              </a>
            </Tilt>
          </Reveal>

          <Reveal delay={0.16} rotate={-1}>
            <Tilt className="paper-card relative flex h-full flex-col overflow-hidden p-8 md:p-10">
              <Bow className="absolute -top-2 right-6 w-20 rotate-12" />
              <p className="text-sm font-semibold tracking-[0.2em] text-soft uppercase">Dress code</p>
              <p className="mt-3 font-display text-4xl leading-none font-extrabold tracking-tight text-ink md:text-5xl">Elegante sport</p>
              <p className="mt-4 max-w-xs text-soft">No se permite ropa deportiva ni gorras.</p>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
