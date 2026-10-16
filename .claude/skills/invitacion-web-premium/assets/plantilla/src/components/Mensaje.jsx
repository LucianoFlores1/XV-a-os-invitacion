import { CONFIG } from '../config'
import { Bow, Perlas } from './Deco'
import Panel from './Panel'
import Reveal from './Reveal'

export default function Mensaje() {
  return (
    <Panel tono="papel" className="text-center">
      <Perlas className="absolute -top-1 left-1/2 w-[min(110%,760px)] -translate-x-1/2" caida={60} n={26} k={1.3} />
      <Reveal className="relative mx-auto max-w-3xl pt-6">
        <Bow className="mx-auto w-28 drop-shadow-[0_10px_12px_rgb(29_68_196/0.3)]" />
        <p className="mt-8 font-display text-[clamp(2rem,6.6vw,3.6rem)] leading-[1.12] font-semibold tracking-tight text-balance text-ink">
          {CONFIG.textos.mensaje.antes}
          <span className="text-acento">{CONFIG.textos.mensaje.destacado}</span>
          {CONFIG.textos.mensaje.despues}
        </p>
        <p className="mt-10 pb-2 font-script text-6xl leading-[1.15] text-acento">{CONFIG.nombre}</p>
      </Reveal>
    </Panel>
  )
}
