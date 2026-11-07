import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const url = process.argv[2] ?? 'http://127.0.0.1:5187/'
const output = process.argv[3] ?? 'public/og-preview.jpg'
const port = 19387
const profile = await mkdtemp(join(tmpdir(), 'gehan-og-'))
const browser = spawn(chrome, [
  '--headless=new', '--no-first-run', '--disable-gpu',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--window-size=1200,630', 'about:blank',
], { stdio: 'ignore' })

try {
  let page
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      page = tabs.find(tab => tab.type === 'page')
      if (page) break
    } catch { /* Chrome is starting. */ }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  if (!page) throw new Error('Could not connect to Chrome')

  const socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let id = 0
  const pending = new Map()
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (!message.id) return
    const handler = pending.get(message.id)
    if (!handler) return
    pending.delete(message.id)
    message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const nextId = ++id
    pending.set(nextId, { resolve, reject })
    socket.send(JSON.stringify({ id: nextId, method, params }))
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  await new Promise(resolve => setTimeout(resolve, 3100))
  const css = `
    html,body{overflow:hidden!important}
    .page-preloader,.toc-nav,.back-to-top,.splash-cursor{display:none!important}
    .hero.hero-with-portrait{height:630px!important;min-height:630px!important}
    .hero-with-portrait .hero-copy{padding-top:42px!important;padding-bottom:105px!important}
    .hero-with-portrait .hero-copy h1{font-size:78px!important}
    .hero-word-track{transform:translate3d(0,.20em,0)!important}
    .hero-word{opacity:.22!important;filter:blur(5px)!important}
    .hero-word:nth-child(2){opacity:1!important;filter:none!important}
    .hero-with-portrait .hero-intro{margin-top:12px!important}
    .hero-with-portrait .hero-portrait img{filter:none!important;transform:translateX(-35px)!important}
    .hero-bottom-row{bottom:22px!important}
    .hero-bottom-row .hero-socials .contact-icon{width:56px!important;height:56px!important}
    .hero-bottom-row .hero-socials .contact-icon svg{width:26px!important;height:26px!important}
    .hero-grid{opacity:.42!important}
  `
  await send('Runtime.evaluate', { expression: `document.head.insertAdjacentHTML('beforeend', '<style>${css.replaceAll('\n', ' ')}</style>')` })
  await new Promise(resolve => setTimeout(resolve, 350))
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await sharp(Buffer.from(result.data, 'base64')).resize(1200, 630).jpeg({ quality: 90, mozjpeg: true }).toFile(output)
  console.log(output)
  socket.close()
} finally {
  browser.kill()
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
