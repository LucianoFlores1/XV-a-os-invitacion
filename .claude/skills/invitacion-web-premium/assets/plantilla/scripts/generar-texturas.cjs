// Genera las texturas raster de /src/texturas renderizando scripts/texturas.html en Chromium.
// Uso: node scripts/generar-texturas.cjs   (requiere Playwright instalado)
const path = require('path')
let pw
try { pw = require('playwright') } catch { pw = require('/opt/node22/lib/node_modules/playwright') }

const out = path.join(__dirname, '..', 'src', 'texturas')
;(async () => {
  const b = await pw.chromium.launch()
  const p = await b.newPage({ viewport: { width: 1400, height: 2000 } })
  await p.goto('file://' + path.join(__dirname, 'texturas.html'))
  await p.waitForTimeout(500)
  await p.waitForFunction(() => document.readyState === 'complete')
  // [id, tipo, margen a recortar en px]
  const items = [
    ['saten-claro', 'jpeg', 0],
    ['saten-acento', 'jpeg', 0],
    ['glitter', 'png', 0],
    ['glitter-acento', 'png', 0],
    ['holo', 'jpeg', 0],
  ]
  for (const [id, type, m] of items) {
    const box = await p.locator('#' + id).boundingBox()
    const opts = {
      path: path.join(out, `${id}.${type === 'jpeg' ? 'jpg' : 'png'}`),
      type,
      omitBackground: type === 'png',
      clip: { x: box.x + m, y: box.y + m, width: box.width - m * 2, height: box.height - m * 2 },
      fullPage: true,
    }
    if (type === 'jpeg') opts.quality = 74
    await p.screenshot(opts)
  }
  await b.close()
  console.log('listo')
})()
