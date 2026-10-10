import { useMemo } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

function makeStars(n, seed) {
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return Array.from({ length: n }, (_, i) => ({
    i,
    x: rnd() * 100,
    y: rnd() * 100,
    size: rnd() * 1.8 + 0.6,
    o: rnd() * 0.6 + 0.3,
    d: rnd() * 4 + 3,
    delay: -rnd() * 6,
  }))
}

// Fondo fijo: dos capas de estrellas que se mueven a distinta velocidad con el scroll.
export default function Sky() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const far = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%'])
  const near = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.5, 1])
  const capaA = useMemo(() => makeStars(70, 7), [])
  const capaB = useMemo(() => makeStars(28, 31), [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ opacity: glow }}
        className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgb(46_92_190/0.45),transparent_70%),radial-gradient(60%_40%_at_100%_100%,rgb(30_64_150/0.35),transparent_70%)]"
      />
      <motion.div style={{ y: far }} className="absolute inset-x-0 top-0 h-[115%]">
        {capaA.map((s) => (
          <span
            key={s.i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              '--o': s.o,
              '--d': `${s.d}s`,
              '--delay': `${s.delay}s`,
            }}
          />
        ))}
      </motion.div>
      <motion.div style={{ y: near }} className="absolute inset-x-0 top-0 h-[140%]">
        {capaB.map((s) => (
          <span
            key={s.i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size + 1,
              height: s.size + 1,
              '--o': s.o,
              '--d': `${s.d + 2}s`,
              '--delay': `${s.delay}s`,
              boxShadow: '0 0 6px rgb(196 219 255 / 0.7)',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
