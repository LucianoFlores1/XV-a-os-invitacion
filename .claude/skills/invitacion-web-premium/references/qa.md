# Checklist de entrega

Corré `scripts/verificar.cjs` y `scripts/medir-render.cjs`, mirá las capturas y tildá todo antes de decir que está listo.

## Funciona
- [ ] `npm run build` sin errores.
- [ ] Cero errores de consola en celular y compu.
- [ ] Sin scroll horizontal (`scrollHorizontal: 0`).
- [ ] El sobre se abre, revela la portada y desaparece; el scroll queda habilitado.
- [ ] El mensaje de WhatsApp sale completo y bien escrito (nombre, personas, mensaje) y apunta al número correcto.
- [ ] Botones de Google Maps, calendario y Spotify con los links del cliente.
- [ ] El alias se copia.
- [ ] Secciones opcionales ocultas si falta el dato (música, regalo, hora, salón).

## Se ve como lo aprobado
- [ ] Fondo claro y luminoso, sin colores planos: satén, glitter, damasco/lino, puntilla, perlas, holográfico.
- [ ] Paneles de ancho completo apilados, tonos alternados, nada de tarjetitas flotando para la info.
- [ ] Patrón de títulos display + cursiva; cursivas sin colas cortadas.
- [ ] Contraste AA en botones y textos sobre satén del acento.
- [ ] Ningún placeholder de foto, ningún texto inventado, ninguna frase repetida, ningún em dash.
- [ ] Textos en el registro de la audiencia (voseo, sin palabras de adultos para chicos).

## Se siente bien
- [ ] Brillitos y pop en cada toque; vibración en Android; sonidos en sobre, copiar, confirmar.
- [ ] Entradas con resorte; lluvia de estrellas al abrir; confeti al confirmar.
- [ ] Sin scroll-jacking ni secciones fijadas.
- [ ] `medir-render.cjs` en el orden de RasterTask ~1.000 ms para una página de ~7.000 px (si se dispara, revisá `references/rendimiento.md`).

## Entrega
- [ ] Capturas de celular y compu al usuario.
- [ ] Decir explícitamente qué no se pudo probar (por ejemplo audio real o Spotify real sin red).
- [ ] Recordar: playlist colaborativa, activar GitHub Pages, mp3 propio si quieren el tema completo.
