import { AnimatePresence, motion } from 'motion/react'
import { MusicNotes } from '@phosphor-icons/react'
import { useMusic } from '../lib/music'

// Botón flotante de música
export default function MusicButton({ visible }) {
  const { toggle, playing, actual, disponible } = useMusic()

  return (
    <AnimatePresence>
      {visible && disponible && (
        <motion.button
          type="button"
          onClick={toggle}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.4, delay: 0.6 }}
          whileTap={{ scale: 0.92 }}
          aria-label={playing ? 'Pausar música' : 'Reproducir música'}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-left shadow-[0_0_0_1px_rgb(29_68_196/0.12),0_14px_30px_-10px_rgb(29_68_196/0.55)]"
        >
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${playing ? 'bg-acento text-white' : 'bg-suave/50 text-acento'}`}>
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
          <span className="min-w-0">
            <span className="block max-w-[150px] truncate text-sm font-semibold text-ink">{actual?.titulo || 'Música'}</span>
            <span className="block max-w-[150px] truncate text-xs text-soft">{playing ? actual?.artista : 'Tocá para escuchar'}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
