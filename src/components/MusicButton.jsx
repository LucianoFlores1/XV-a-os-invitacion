import { AnimatePresence, motion, useScroll } from 'motion/react'
import { MusicNotes } from '@phosphor-icons/react'
import { useMusic } from '../lib/music'

// Botón flotante de música + barra de progreso del scroll.
export default function MusicButton({ visible }) {
  const { toggle, playing, actual, disponible } = useMusic()
  const { scrollYProgress } = useScroll()

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-30 h-[2px] origin-left bg-sky/80" />
      <AnimatePresence>
        {visible && disponible && (
          <motion.button
            type="button"
            onClick={toggle}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            whileTap={{ scale: 0.95 }}
            aria-label={playing ? 'Pausar música' : 'Reproducir música'}
            className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-line bg-night-2/85 py-2 pr-4 pl-2 text-left shadow-[0_12px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md"
          >
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${playing ? 'bg-sky text-night' : 'bg-white/5 text-sky'}`}>
              {playing ? (
                <span className="eq flex h-[14px] items-end gap-[3px]">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <MusicNotes size={20} weight="fill" />
              )}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-[180px] truncate text-sm text-ink">{actual?.titulo || 'Música'}</span>
              <span className="block max-w-[180px] truncate text-xs text-mist">{playing ? actual?.artista : 'Tocá para escuchar'}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
