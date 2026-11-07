import { useEffect, useRef } from 'react'

const ROW_HEIGHT = 1.08
const FIRST_ROW_TOP = 1.28
const STEP_MS = 2400
const HOLD_MS = 1550

const easeInOut = (progress: number) => progress < .5
  ? 4 * progress ** 3
  : 1 - (-2 * progress + 2) ** 3 / 2

export default function BlurredHeroTicker({ words }: { words: string[] }) {
  const trackRef = useRef<HTMLSpanElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const items = words.length > 1
    ? [words[words.length - 1], ...words, ...words.slice(0, 2)]
    : words

  useEffect(() => {
    const track = trackRef.current
    if (!track || !words.length) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 700px)')
    let frame = 0
    let start = 0

    const draw = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      const step = Math.floor(elapsed / STEP_MS) % words.length
      const phase = elapsed % STEP_MS
      const transition = Math.max(0, Math.min(1, (phase - HOLD_MS) / (STEP_MS - HOLD_MS)))
      const position = words.length === 1
        ? 0
        : reducedMotion ? 1 : 1 + step + easeInOut(transition)

      track.style.transform = `translate3d(0, ${FIRST_ROW_TOP - position * ROW_HEIGHT}em, 0)`
      wordRefs.current.forEach((element, index) => {
        if (!element) return
        const distance = Math.abs(index - position)
        const adjacentFade = mobile.matches ? .55 : .78
        const adjacentBlur = mobile.matches ? 2.8 : 3.8
        element.style.opacity = String(Math.max(0, 1 - distance * adjacentFade))
        element.style.filter = `blur(${Math.min(8, distance * adjacentBlur)}px)`
      })

      if (!reducedMotion && words.length > 1) frame = window.requestAnimationFrame(draw)
    }

    frame = window.requestAnimationFrame(draw)
    return () => window.cancelAnimationFrame(frame)
  }, [words])

  return <h1 className="hero-word-ticker" aria-label={words.join('. ') + '.'}>
    <span className="hero-word-window" aria-hidden="true">
      <span className="hero-word-track" ref={trackRef}>
        {items.map((word, index) => <span
          className="hero-word"
          key={`${word}-${index}`}
          ref={element => { wordRefs.current[index] = element }}
        >{word}</span>)}
      </span>
    </span>
  </h1>
}
