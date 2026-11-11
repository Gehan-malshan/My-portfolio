import type { CSSProperties } from 'react'
import './BlinkingDotsFallback.css'

const columns = 27
const rows = 17
const dots = Array.from({ length: columns * rows }, (_, index) => {
  const column = index % columns
  const row = Math.floor(index / columns)
  const seed = (index * 73 + 19) % 101
  return {
    left: `${((column + 0.5) / columns) * 100}%`,
    top: `${((row + 0.5) / rows) * 100}%`,
    size: `${seed % 7 === 0 ? 3 : 2}px`,
    delay: `${-((index * 17) % 83) / 10}s`,
    duration: `${3.2 + (seed % 38) / 10}s`,
    peak: `${0.14 + (seed % 30) / 100}`,
  }
})

// Stable random positions avoid a visible grid and prevent dots jumping on rerender.
function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

const scatteredDots = Array.from({ length: 290 }, (_, index) => ({
  left: `${3 + random(index * 5 + 1) * 94}%`,
  top: `${3 + random(index * 5 + 2) * 94}%`,
  size: `${random(index * 5 + 3) > .87 ? 3 : 2}px`,
  delay: `${-random(index * 5 + 4) * 14}s`,
  duration: `${10 + random(index * 5 + 5) * 12}s`,
  peak: `${.13 + random(index * 5 + 6) * .2}`,
  driftX: `${(random(index * 5 + 7) - .5) * 26}px`,
  driftY: `${(random(index * 5 + 8) - .5) * 30}px`,
}))

export default function BlinkingDotsFallback({ scattered = false }: { scattered?: boolean }) {
  return <div className={`page-blinking-dots${scattered ? ' page-blinking-dots--scattered' : ''}`} aria-hidden="true">
    {(scattered ? scatteredDots : dots).map((dot, index) => <span
      className="page-blinking-dots__dot"
      key={index}
      style={{
        left: dot.left,
        top: dot.top,
        width: dot.size,
        height: dot.size,
        animationDelay: dot.delay,
        animationDuration: dot.duration,
        '--dot-peak': dot.peak,
        '--dot-drift-x': 'driftX' in dot ? dot.driftX : '0px',
        '--dot-drift-y': 'driftY' in dot ? dot.driftY : '0px',
      } as CSSProperties}
    />)}
  </div>
}
