// Mide cuánto trabaja el navegador al scrollear toda la página en un celular simulado.
// Uso: node medir-render.cjs <url>
// Compará antes/después de un cambio: lo que importa es RasterTask y Paint (ms). Si suben mucho
// al agregar un efecto, ese efecto está repintando en cada cuadro (blend modes, filtros, animar
// background-position, backdrop-filter en elementos fijos...).
let pw
try { pw = require('playwright') } catch { pw = require('/opt/node22/lib/node_modules/playwright') }
const url = process.argv[2] || 'http://localhost:4173/'
;(async () => {
  const b = await pw.chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const p = await ctx.newPage()
  await p.route('https://itunes.apple.com/**', (r) => r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'application/json', body: '{"results":[]}' }))
  await p.route('https://open.spotify.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<body></body>' }))
  await p.goto(url)
  await p.click('button[aria-label="Abrir la invitación"]', { force: true })
  await p.waitForTimeout(3500)
  const cdp = await ctx.newCDPSession(p)
  const ev = []
  cdp.on('Tracing.dataCollected', (d) => ev.push(...d.value))
  const fin = new Promise((r) => cdp.once('Tracing.tracingComplete', r))
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,cc,viz,blink', transferMode: 'ReportEvents' })
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 60) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(16) }
  await cdp.send('Tracing.end')
  await fin
  const suma = {}
  for (const e of ev) if (e.ph === 'X' && e.dur) suma[e.name] = (suma[e.name] || 0) + e.dur / 1000
  const claves = ['RasterTask', 'Paint', 'UpdateLayoutTree', 'Layout', 'FunctionCall', 'Layerize']
  console.log(Object.fromEntries(claves.filter((k) => suma[k]).map((k) => [k + ' (ms)', Math.round(suma[k])])))
  await b.close()
})()
