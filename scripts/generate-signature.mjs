import { readFileSync, writeFileSync } from 'node:fs'
import opentype from 'opentype.js'

const fontBytes = readFileSync(new URL('../public/fonts/Allura-Regular.ttf', import.meta.url))
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength))
const text = 'Gehan'
const fontSize = 120
const baseline = fontSize * 1.25
let x = fontSize * 0.12
let previous = null
const paths = []

for (const character of text) {
  const glyph = font.charToGlyph(character)
  if (previous) x += font.getKerningValue(previous, glyph) * fontSize / font.unitsPerEm
  paths.push(glyph.getPath(x, baseline, fontSize).toPathData(3))
  x += (glyph.advanceWidth ?? font.unitsPerEm) * fontSize / font.unitsPerEm
  previous = glyph
}

const width = x + fontSize * 0.12
writeFileSync(new URL('../src/data/gehan-signature.ts', import.meta.url),
  `// Generated from Allura-Regular.ttf with scripts/generate-signature.mjs.\nexport const gehanSignature = ${JSON.stringify({ paths, width, height: fontSize * 1.9 }, null, 2)} as const\n`)
