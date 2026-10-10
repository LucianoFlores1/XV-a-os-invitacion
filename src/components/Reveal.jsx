import { motion, useReducedMotion } from 'motion/react'

// Entrada con resorte cuando el bloque aparece en pantalla (una sola vez).
export default function Reveal({ children, delay = 0, y = 40, rotate = 0, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, scale: 0.96, rotate }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', duration: 0.9, bounce: 0.3, delay }}
      className={className}
    >
      {children}
    </M>
  )
}
