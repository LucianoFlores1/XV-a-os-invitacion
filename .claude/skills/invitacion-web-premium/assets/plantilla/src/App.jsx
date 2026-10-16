import { useEffect, useState } from 'react'
import { CONFIG } from './config'
import { anio, dia, mes } from './lib/fecha'
import { pop, sparkle } from './lib/juice'
import { MusicProvider, useMusic } from './lib/music'
import { ToastProvider } from './lib/toast'
import Intro from './components/Intro'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Mensaje from './components/Mensaje'
import Countdown from './components/Countdown'
import { DressCode, Fecha, Lugar } from './components/Info'
import Musica from './components/Musica'
import Regalo from './components/Regalo'
import Particulas from './components/Particulas'
import Rsvp from './components/Rsvp'
import MusicButton from './components/MusicButton'
import Reveal from './components/Reveal'
import Panel from './components/Panel'
import { Bow, Perlas } from './components/Deco'

// Cada toque en la página deja unos brillitos y suena un pop en los botones
function useTapSparkles(activo) {
  useEffect(() => {
    if (!activo) return
    const fn = (e) => {
      if (e.target.closest('input, textarea, iframe')) return
      sparkle(e.clientX, e.clientY, { count: 6, spread: 34, size: 11 })
      // pop suave en botones y links (los que tienen sonido propio lo saltean)
      if (e.target.closest('button, a') && !e.target.closest('[data-sonido]')) pop()
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
      {abierto && <Particulas />}
      <MusicButton visible={abierto} />
      <main>
        <Hero abierto={abierto} />
        <Marquee />
        <Mensaje />
        <Countdown />
        <Fecha />
        <Lugar />
        <DressCode />
        {CONFIG.spotifyPlaylistUrl && <Musica />}
        {CONFIG.alias && <Regalo />}
        <Rsvp />
      </main>
      <Panel tono="papel" className="pb-36 text-center">
        <Perlas className="absolute -top-1 left-1/2 w-[min(110%,760px)] -translate-x-1/2" caida={50} n={24} k={1.2} />
        <Reveal className="pt-8">
          <Bow className="mx-auto w-24" />
          <p className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">{CONFIG.textos.despedida}</p>
          <p className="mt-8 text-lg font-medium text-soft italic">{CONFIG.textos.firma}</p>
          <p className="pb-2 font-script text-[clamp(4.5rem,18vw,7rem)] leading-[1.15] text-acento">{CONFIG.nombre}</p>
          <p className="mt-3 text-sm font-semibold tracking-[0.25em] text-soft">
            {String(dia).padStart(2, '0')} . {String(mes).padStart(2, '0')} . {anio}
          </p>
        </Reveal>
      </Panel>
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
