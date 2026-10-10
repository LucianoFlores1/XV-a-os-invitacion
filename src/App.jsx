import { useEffect, useState } from 'react'
import { CONFIG } from './config'
import { anio, dia, mes } from './lib/fecha'
import { sparkle } from './lib/juice'
import { MusicProvider, useMusic } from './lib/music'
import { ToastProvider } from './lib/toast'
import Intro from './components/Intro'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Mensaje from './components/Mensaje'
import Countdown from './components/Countdown'
import Info from './components/Info'
import Musica from './components/Musica'
import Rsvp from './components/Rsvp'
import MusicButton from './components/MusicButton'
import Reveal from './components/Reveal'
import { Bow, Perlas } from './components/Deco'

// Cada toque en la página deja unos brillitos
function useTapSparkles(activo) {
  useEffect(() => {
    if (!activo) return
    const fn = (e) => {
      if (e.target.closest('input, textarea, iframe')) return
      sparkle(e.clientX, e.clientY, { count: 6, spread: 34, size: 11 })
    }
    window.addEventListener('pointerdown', fn)
    return () => window.removeEventListener('pointerdown', fn)
  }, [activo])
}

function Pagina() {
  const [abierto, setAbierto] = useState(false)
  const { start } = useMusic()
  useTapSparkles(abierto)

  return (
    <>
      <div className="page-bg" aria-hidden />
      <Intro
        onOpen={() => {
          start()
          setAbierto(true)
        }}
      />
      <MusicButton visible={abierto} />
      <main>
        <Hero abierto={abierto} />
        <Marquee />
        <Mensaje />
        <Countdown />
        <Info />
        <Musica />
        <Rsvp />
      </main>
      <footer className="px-4 pt-6 pb-32 text-center">
        <Reveal>
          <Perlas className="mx-auto mb-6 w-full max-w-sm" caida={22} />
          <Bow className="mx-auto w-20" />
          <p className="mt-4 font-display text-2xl font-bold text-ink">¡Te espero!</p>
          <p className="mt-1 font-script text-7xl text-cobalt">{CONFIG.nombre}</p>
          <p className="mt-3 text-sm font-semibold tracking-[0.25em] text-soft">
            {String(dia).padStart(2, '0')} . {String(mes).padStart(2, '0')} . {anio}
          </p>
        </Reveal>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <MusicProvider>
        <Pagina />
      </MusicProvider>
    </ToastProvider>
  )
}
