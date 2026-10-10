// Panel de ancho completo con puntas superiores redondeadas que se superpone al anterior,
// como hojas apiladas. Cada uno tiene su textura: papel, satén azul, satén celeste u holográfico.

const TONOS = {
  papel: 'paper-tex text-ink',
  cobalto: 'satin-cobalt glitter text-white',
  celeste: 'satin-claro glitter-azul text-ink',
  holo: 'holo-bg text-ink',
}

export default function Panel({ tono = 'papel', id, className = '', children }) {
  return (
    <section
      id={id}
      className={`panel relative -mt-10 scroll-mt-0 overflow-hidden rounded-t-[36px] px-5 pt-24 pb-28 md:-mt-14 md:rounded-t-[64px] md:pt-32 md:pb-36 ${TONOS[tono]} ${className}`}
    >
      {children}
    </section>
  )
}
