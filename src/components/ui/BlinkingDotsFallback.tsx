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

export default function BlinkingDotsFallback() {
  return <div className="page-blinking-dots" aria-hidden="true">
    {dots.map((dot, index) => <span
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
      } as CSSProperties}
    />)}
  </div>
}
