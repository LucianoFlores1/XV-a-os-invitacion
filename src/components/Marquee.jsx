import { CONFIG } from '../config'
import { dia, mes } from '../lib/fecha'
import { Sparkle } from './Deco'

// Cinta azul inclinada que cruza la página
export default function Marquee() {
  const fecha = `${String(dia).padStart(2, '0')}.${String(mes).padStart(2, '0')}`
  const items = ['Mis XV', CONFIG.nombre, fecha, 'Noche azul', 'Mis XV', CONFIG.nombre, fecha, 'Noche azul']
  const fila = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={`px-6 ${i % 4 === 1 ? 'font-script text-4xl normal-case' : 'font-display text-2xl font-extrabold tracking-tight uppercase'}`}>{t}</span>
          <Sparkle className="size-5 text-baby" />
        </span>
      ))}
    </div>
  )
  return (
    <div aria-hidden className="relative z-10 -my-4 -rotate-3 overflow-hidden bg-[linear-gradient(180deg,#2c55d8,#1d44c4)] py-4 text-white shadow-[0_18px_40px_-16px_rgb(29_68_196/0.7)]">
      <div className="marquee flex w-max">
        {fila}
        {fila}
      </div>
    </div>
  )
}
