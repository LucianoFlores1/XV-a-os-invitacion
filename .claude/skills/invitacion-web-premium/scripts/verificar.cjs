// Verificación visual y funcional de la invitación.
// Uso: node verificar.cjs <url> <carpeta-salida>      (ej: node verificar.cjs http://localhost:4173/ ./capturas)
// - Simula iTunes y Spotify (en sandboxes sin red no responden).
// - Abre el sobre, recorre la página en celular (390x844) y compu (1440x900) y guarda capturas.
// - Prueba la confirmación: completa el formulario y muestra el mensaje de WhatsApp que se arma.
// - Lista errores de consola y si hay scroll horizontal.
const fs = require('fs')
const path = require('path')
let pw
try { pw = require('playwright') } catch { pw = require('/opt/node22/lib/node_modules/playwright') }

const [url = 'http://localhost:4173/', out = './capturas'] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const AUDIO = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

async function preparar(p) {
  await p.route('https://itunes.apple.com/**', (r) =>
    r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: JSON.stringify({ results: [{ trackId: 1, trackName: 'Tema de prueba', artistName: 'Artista', artworkUrl100: '', previewUrl: AUDIO }] }) }),
  )
  await p.route('https://open.spotify.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<body style="margin:0;background:#334"></body>' }))
  await p.addInitScript(() => { window.open = (u) => { window.__abierto = u; return null } })
}

;(async () => {
  const b = await pw.chromium.launch()
  for (const [nombre, vp] of [['celular', { width: 390, height: 844 }], ['compu', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp })
    const p = await ctx.newPage()
    const errores = []
    p.on('pageerror', (e) => errores.push(e.message))
    p.on('console', (m) => m.type() === 'error' && errores.push(m.text()))
    await preparar(p)
    await p.goto(url)
    await p.waitForTimeout(1200)
    await p.screenshot({ path: path.join(out, `${nombre}-00-sobre.png`) })
    await p.click('button[aria-label="Abrir la invitación"]', { force: true })
    for (const [k, t] of [['01-abriendo', 600], ['02-revelando', 900], ['03-portada', 2200]]) {
      await p.waitForTimeout(t)
      await p.screenshot({ path: path.join(out, `${nombre}-${k}.png`) })
    }
    const H = await p.evaluate(() => document.documentElement.scrollHeight)
    let i = 10
    for (let y = Math.round(vp.height * 0.85); y < H; y += Math.round(vp.height * 0.85)) {
      await p.evaluate((y) => window.scrollTo(0, y), y)
      await p.waitForTimeout(1000)
      await p.screenshot({ path: path.join(out, `${nombre}-${i++}.png`) })
    }
    const scrollX = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    let mensaje = null
    if (nombre === 'celular' && (await p.locator('#nombre').count())) {
      await p.locator('#nombre').scrollIntoViewIfNeeded()
      await p.fill('#nombre', 'Invitada de Prueba')
      await p.click('button[type="submit"]')
      await p.waitForTimeout(500)
      const u = await p.evaluate(() => window.__abierto)
      mensaje = u ? decodeURIComponent(u.split('text=')[1] || '') : 'NO SE ABRIÓ WHATSAPP'
    }
    console.log(JSON.stringify({ vista: nombre, alto: H, capturas: i - 10 + 4, scrollHorizontal: scrollX, errores, mensajeWhatsApp: mensaje }, null, 2))
    await ctx.close()
  }
  await b.close()
})()
