import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Cake, Champagne, Confetti, Crown, DiscoBall, Flame, ForkKnife, Heart, Sparkle } from '@phosphor-icons/react'
import { CONFIG } from '../config'

const ICONOS = { Cake, Champagne, Confetti, Crown, DiscoBall, Flame, ForkKnife, Heart, Sparkle }

// Scroll vertical que mueve la noche de forma horizontal, momento por momento.
export default function Night() {
  const wrap = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const medir = () => {
      if (!track.current) return
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    if (!track.current) return
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(track.current)
    window.addEventListener('resize', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const x = useSpring(xRaw, { stiffness: 220, damping: 40, mass: 0.6 })
  const barra = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduce) {
    return (
      <section className="px-4 py-24">
        <h2 className="mx-auto max-w-5xl font-serif text-4xl text-ink">Así va a ser la noche</h2>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
          {CONFIG.momentos.map((m) => (
            <Momento key={m.titulo} m={m} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={wrap} style={{ height: `calc(100dvh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-5xl px-4">
          <h2 className="font-serif text-4xl text-ink md:text-5xl">
            Así va a ser <em>la noche</em>
          </h2>
          <div className="mt-5 h-px w-full max-w-xs overflow-hidden bg-line">
            <motion.div style={{ scaleX: barra }} className="h-full origin-left bg-sky" />
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-4 pr-[10vw] pl-[max(1rem,calc((100vw-64rem)/2+1rem))]">
          {CONFIG.momentos.map((m, i) => (
            <Momento key={m.titulo} m={m} alto={i % 2 === 1} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Momento({ m, alto }) {
  const Icono = ICONOS[m.icono] || Sparkle
  return (
    <article
      className={`card flex w-[min(72vw,300px)] shrink-0 flex-col justify-between p-7 ${alto ? 'translate-y-8' : ''}`}
      style={{ minHeight: 280 }}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-sky/15 text-sky">
        <Icono size={28} weight="light" />
      </span>
      <div>
        <h3 className="font-serif text-3xl text-ink">{m.titulo}</h3>
        <p className="mt-2 text-mist">{m.texto}</p>
      </div>
    </article>
  )
}
