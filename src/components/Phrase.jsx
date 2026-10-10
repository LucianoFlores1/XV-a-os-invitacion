import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { CONFIG } from '../config'

const FRASE =
  'Hay momentos que se esperan toda la vida. Quiero que esta noche, la de mis quince, la vivas conmigo.'

function Palabra({ children, progress, rango }) {
  const opacity = useTransform(progress, rango, [0.14, 1])
  const y = useTransform(progress, rango, [6, 0])
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

// La frase se va iluminando palabra por palabra mientras scrolleás.
export default function Phrase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const palabras = FRASE.split(' ')
  const firma = useTransform(scrollYProgress, [0.82, 0.95], [0, 1])

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex min-h-[100dvh] items-center px-6">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-serif text-[clamp(2rem,5.4vw,3.9rem)] leading-[1.15] text-ink">
              {palabras.map((p, i) => {
                const start = (i / palabras.length) * 0.8
                return (
                  <Palabra key={i} progress={scrollYProgress} rango={[start, start + 0.8 / palabras.length + 0.04]}>
                    {p}
                  </Palabra>
                )
              })}
            </p>
            <motion.p style={{ opacity: firma }} className="mt-8 font-script text-4xl text-sky">
              {CONFIG.nombre}
            </motion.p>
          </div>
          {CONFIG.foto && (
            <motion.img
              src={`${import.meta.env.BASE_URL}${CONFIG.foto}`}
              alt={CONFIG.nombre}
              style={{ opacity: firma }}
              className="aspect-[3/4] w-full max-w-[300px] justify-self-center rounded-t-full border border-line object-cover"
            />
          )}
        </div>
      </div>
    </section>
  )
}
