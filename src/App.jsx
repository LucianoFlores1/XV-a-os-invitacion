import { useState } from 'react'
import { motion } from 'motion/react'
import { CONFIG } from './config'
import { dia, mes, anio } from './lib/fecha'
import { MusicProvider, useMusic } from './lib/music'
import { ToastProvider } from './lib/toast'
import Sky from './components/Sky'
import Intro from './components/Intro'
import Hero from './components/Hero'
import Phrase from './components/Phrase'
import Countdown from './components/Countdown'
import Details from './components/Details'
import DressCode from './components/DressCode'
import Night from './components/Night'
import Rocola from './components/Rocola'
import Rsvp from './components/Rsvp'
import MusicButton from './components/MusicButton'

function Pagina() {
  const [abierto, setAbierto] = useState(false)
  const { start } = useMusic()

  return (
    <>
      <Sky />
      <Intro
        onOpen={() => {
          start()
          setAbierto(true)
        }}
      />
      <MusicButton visible={abierto} />
      <main>
        <Hero abierto={abierto} />
        <Phrase />
        <Countdown />
        <Details />
        <DressCode />
        <Night />
        <Rocola />
        <Rsvp />
      </main>
      <footer className="px-4 pt-10 pb-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="font-serif text-2xl text-mist italic"
        >
          Gracias por ser parte de este sueño.
        </motion.p>
        <p className="mt-3 font-script text-6xl text-ink">{CONFIG.nombre}</p>
        <p className="mt-4 text-sm tracking-[0.2em] text-mist">
          {String(dia).padStart(2, '0')}.{String(mes).padStart(2, '0')}.{anio}
        </p>
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
