import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { buzz, chime, sparkleFrom } from '../lib/juice'
import { Bow, Sparkle } from './Deco'
import Panel from './Panel'
import Reveal from './Reveal'

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    // respaldo para navegadores sin permiso de portapapeles
    const t = document.createElement('textarea')
    t.value = texto
    t.setAttribute('readonly', '')
    t.style.position = 'fixed'
    t.style.opacity = '0'
    document.body.appendChild(t)
    t.select()
    const ok = document.execCommand('copy')
    t.remove()
    return ok
  }
}

// Tarjeta tipo caja de regalo: tapa de satén con moño y el alias para copiar
export default function Regalo() {
  const [copiado, setCopiado] = useState(false)
  const boton = useRef(null)
  const timer = useRef()

  async function onCopiar() {
    const ok = await copiar(CONFIG.alias)
    if (!ok) return
    buzz(15)
    chime(1319)
    sparkleFrom(boton.current, { count: 12, spread: 80 })
    setCopiado(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopiado(false), 2200)
  }

  return (
    <Panel tono="holo">
      <Reveal className="relative mx-auto max-w-xl" rotate={-1.5}>
        <div className="overflow-hidden rounded-[30px] shadow-[0_40px_70px_-35px_rgb(29_68_196/0.6)]">
          {/* tapa */}
          <div className="satin-cobalt glitter relative h-24 sm:h-28">
            <div aria-hidden className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-[linear-gradient(90deg,#c7d7ff,#ffffff_45%,#dbe6ff_60%,#aac0f5)] shadow-[0_0_0_1px_rgb(255_255_255/0.4)]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-black/15" />
          </div>
          {/* cuerpo */}
          <div className="paper-tex relative px-6 pt-14 pb-12 text-center sm:px-12">
            <div aria-hidden className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-[linear-gradient(90deg,rgb(199_215_255/0.5),rgb(255_255_255/0.7)_45%,rgb(219_230_255/0.5)_60%,rgb(170_192_245/0.5))]" />
            <div className="relative">
              <p className="font-script text-[clamp(2.8rem,10vw,3.8rem)] leading-[1.1] text-cobalt">Tu presencia es mi mayor regalo</p>
              <p className="mx-auto mt-5 max-w-sm text-lg text-balance text-soft">
                Si pensás en un obsequio, te dejo mi alias:
              </p>
              <motion.button
                ref={boton}
                type="button"
                onClick={onCopiar}
                data-sonido
                whileTap={{ scale: 0.95 }}
                aria-label={`Copiar alias ${CONFIG.alias}`}
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-6 shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.25),0_12px_24px_-12px_rgb(29_68_196/0.6)]"
              >
                <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{CONFIG.alias}</span>
                <span className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white transition-colors duration-200 ${copiado ? 'bg-cobalt-deep' : 'bg-cobalt'}`}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copiado ? 'ok' : 'copy'}
                      initial={{ opacity: 0, y: 6, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.8 }}
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.4 }}
                      className="flex items-center gap-1.5"
                    >
                      {copiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                      {copiado ? '¡Copiado!' : 'Copiar'}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
        <Bow className="absolute top-8 left-1/2 z-10 w-36 -translate-x-1/2 drop-shadow-[0_10px_12px_rgb(10_30_100/0.4)] sm:top-11" />
        <Sparkle className="twinkle absolute -top-3 right-6 size-6 text-cobalt/70" />
        <Sparkle className="twinkle absolute bottom-10 -left-2 size-5 text-cobalt/60" style={{ '--delay': '-1s' }} />
      </Reveal>
    </Panel>
  )
}
