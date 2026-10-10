import { motion } from 'motion/react'
import { ArrowUpRight, BaseballCap, CalendarPlus, Check, CoatHanger, Dress, HighHeel, MapPin, SneakerMove, X } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { dia, diaSemana, googleCalendarUrl, mesNombre } from '../lib/fecha'
import { blip } from '../lib/juice'
import { Bow, Sparkle } from './Deco'
import Panel from './Panel'
import Reveal from './Reveal'

// ---------- Fecha ----------
export function Fecha() {
  return (
    <Panel tono="celeste">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <Reveal className="text-center md:text-left">
          <h2 className="font-display text-[clamp(2.8rem,10vw,5rem)] leading-[0.95] font-extrabold tracking-tight text-ink">
            Guardá <span className="font-script font-normal whitespace-nowrap text-cobalt">la fecha</span>
          </h2>
          <p className="mt-5 text-lg text-soft">
            Te espero el <strong className="font-semibold text-ink">{diaSemana} {dia} de {mesNombre}</strong>
            {CONFIG.hora && ` a las ${CONFIG.hora} h`}. Agendalo así no te lo perdés.
          </p>
          <a href={googleCalendarUrl()} target="_blank" rel="noreferrer" className="btn btn-primary mt-8 text-base">
            <CalendarPlus size={20} weight="bold" />
            Agendar en el calendario
          </a>
        </Reveal>
        <Reveal delay={0.1} className="relative flex flex-col items-center text-center">
          <Sparkle className="twinkle absolute top-6 right-[14%] size-7 text-cobalt/70" />
          <Sparkle className="twinkle absolute bottom-16 left-[12%] size-5 text-cobalt/50" style={{ '--delay': '-1s' }} />
          <p className="font-display text-2xl font-bold text-soft capitalize">{diaSemana}</p>
          <p className="holo-text font-display text-[clamp(10rem,40vw,16rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">{dia}</p>
          <p className="font-script text-6xl text-cobalt">de {mesNombre}</p>
        </Reveal>
      </div>
    </Panel>
  )
}

// ---------- Lugar ----------
export function Lugar() {
  return (
    <Panel tono="papel" className="text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="relative flex size-28 items-center justify-center">
          <span aria-hidden className="pulso absolute inset-0 rounded-full bg-cobalt/20" />
          <span aria-hidden className="pulso absolute inset-0 rounded-full bg-cobalt/20" style={{ animationDelay: '-1.2s' }} />
          <span className="satin-cobalt relative flex size-20 items-center justify-center rounded-full text-white shadow-[0_14px_30px_-10px_rgb(29_68_196/0.7)]">
            <MapPin size={38} weight="fill" />
          </span>
        </div>
        <h2 className="mt-8 font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight text-ink">
          ¿Dónde <span className="font-script font-normal text-cobalt">es?</span>
        </h2>
        <p className="mt-4 font-display text-2xl font-bold text-ink">{CONFIG.lugar || 'El lugar de la fiesta'}</p>
        <p className="mt-2 max-w-sm text-lg text-balance text-soft">Tocá el botón y Google Maps te lleva directo a la puerta.</p>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary mt-8 text-base">
          Cómo llegar
          <ArrowUpRight size={18} weight="bold" />
        </a>
      </Reveal>
    </Panel>
  )
}

// ---------- Dress code ----------
const PRENDAS = [
  { Icono: Dress, label: 'Vestido', ok: true },
  { Icono: CoatHanger, label: 'Camisa', ok: true },
  { Icono: HighHeel, label: 'Zapatos', ok: true },
  { Icono: SneakerMove, label: 'Deportivo', ok: false },
  { Icono: BaseballCap, label: 'Gorras', ok: false },
]

function Prenda({ p, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', duration: 0.6, bounce: 0.45, delay: 0.15 + i * 0.07 }}
      whileTap={{ scale: 0.9, rotate: p.ok ? -6 : 6 }}
      onTap={() => blip(p.ok)}
      className="flex cursor-pointer flex-col items-center gap-2.5 text-center"
    >
      <span
        className={`relative flex size-14 items-center justify-center rounded-2xl sm:size-20 ${
          p.ok ? 'bg-white text-cobalt shadow-[0_10px_24px_-10px_rgb(5_20_80/0.7)]' : 'bg-white/15 text-white/70 ring-1 ring-white/25'
        }`}
      >
        <p.Icono className="size-8 sm:size-10" weight={p.ok ? 'duotone' : 'regular'} />
        {!p.ok && <span aria-hidden className="absolute h-[2px] w-11 rotate-[-35deg] rounded-full bg-[#ff7a96] sm:w-14" />}
        <span
          className={`absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full text-white ring-2 sm:size-7 ${
            p.ok ? 'bg-cobalt ring-white' : 'bg-[#d6416a] ring-white/90'
          }`}
        >
          {p.ok ? <Check size={13} weight="bold" /> : <X size={13} weight="bold" />}
        </span>
      </span>
      <span className={`text-xs font-semibold sm:text-sm ${p.ok ? 'text-white' : 'text-white/70'}`}>{p.label}</span>
    </motion.li>
  )
}

export function DressCode() {
  return (
    <Panel tono="cobalto" className="text-center">
      <div aria-hidden className="damasco-blanco" />
      <Reveal className="relative mx-auto max-w-3xl">
        <Bow className="mx-auto w-24 [filter:drop-shadow(0_0_1.5px_white)_drop-shadow(0_8px_10px_rgb(5_15_70/0.4))]" />
        <p className="mt-6 text-sm font-semibold tracking-[0.3em] text-baby uppercase">Dress code</p>
        <h2 className="mt-2 font-display text-[clamp(3rem,12vw,6rem)] leading-[0.95] font-extrabold tracking-tight">Elegante sport</h2>
        <p className="mt-4 text-lg text-white/85">No se permite ropa deportiva ni gorras.</p>
        <ul className="mx-auto mt-10 grid max-w-xl grid-cols-5 gap-2 sm:gap-4" aria-label="Qué sí y qué no">
          {PRENDAS.map((p, i) => (
            <Prenda key={p.label} p={p} i={i} />
          ))}
        </ul>
      </Reveal>
    </Panel>
  )
}
