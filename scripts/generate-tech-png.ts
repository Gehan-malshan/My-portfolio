// Regenerate the local, transparent technology PNGs with `bun run icons`.
// Artwork comes from Devicon (MIT); existing brand SVGs are used where Devicon
// does not offer that mark. Keeping the output local avoids runtime CDN requests.
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { technologies } from '../src/technologies'

type DeviconEntry = { name: string; versions: { svg: string[] } }

const folder = fileURLToPath(new URL('../public/tech-png/', import.meta.url))
const existing = fileURLToPath(new URL('../public/tech/', import.meta.url))
const deviconName: Record<string, string> = {
  amazonaws: 'amazonwebservices',
  mui: 'materialui',
  nextdotjs: 'nextjs',
  nodedotjs: 'nodejs',
  azure: 'azure',
}

const response = await fetch('https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.json')
if (!response.ok) throw new Error(`Could not load Devicon catalog: ${response.status}`)
const catalog = new Map(((await response.json()) as DeviconEntry[]).map(icon => [icon.name, icon]))
await mkdir(folder, { recursive: true })

for (const [name, slug] of technologies) {
  const iconName = deviconName[slug] ?? slug
  const variants = catalog.get(iconName)?.versions.svg ?? []
  const variant = ['original', 'original-wordmark', 'plain', 'plain-wordmark'].find(item => variants.includes(item))
  let source: Buffer | undefined
  let origin = 'local brand mark'
  if (variant) {
    const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-${variant}.svg`
    const iconResponse = await fetch(url)
    if (iconResponse.ok) {
      source = Buffer.from(await iconResponse.arrayBuffer())
      origin = `Devicon ${iconName}-${variant}`
    }
  }
  source ??= await readFile(`${existing}${slug}.svg`)
  await sharp(source, { density: 240 })
    .resize(144, 144, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${folder}${slug}.png`)
  process.stdout.write(`${name}: ${origin}\n`)
}
