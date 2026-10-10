import { CONFIG } from '../config'
import { Bow, Perlas } from './Deco'
import Reveal from './Reveal'

export default function Mensaje() {
  return (
    <section className="px-5 py-28 md:py-36">
      <Reveal className="relative mx-auto max-w-2xl">
        <Perlas className="absolute -top-1 left-1/2 z-10 w-[92%] -translate-x-1/2" caida={46} />
        <Bow className="absolute -top-12 left-1/2 z-10 w-28 -translate-x-1/2 drop-shadow-[0_10px_12px_rgb(29_68_196/0.3)]" />
        <div className="relative isolate">
        <div aria-hidden className="sombra-suave" />
        <div className="lace paper-tex px-7 pt-20 pb-16 text-center sm:px-14">
          <p className="font-display text-[clamp(1.7rem,5.6vw,2.6rem)] leading-[1.2] font-semibold tracking-tight text-ink">
            Hay momentos que se esperan <span className="text-cobalt">toda la vida.</span> Este es uno de los míos, y quiero
            vivirlo con vos.
          </p>
          <p className="mt-8 font-script text-5xl text-cobalt">{CONFIG.nombre}</p>
        </div>
        </div>
      </Reveal>
    </section>
  )
}
