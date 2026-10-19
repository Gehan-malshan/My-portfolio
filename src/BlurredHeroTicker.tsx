import { useEffect, useState } from 'react'

export default function BlurredHeroTicker({ words }: { words: string[] }) {
  const [index, setIndex] = useState(1)
  const [resetting, setResetting] = useState(false)
  const items = [words[words.length - 1], ...words, words[0]]

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => setIndex(current => current + 1), 2400)
    return () => window.clearInterval(interval)
  }, [words.length])

  useEffect(() => {
    if (index !== words.length + 1) return
    const timeout = window.setTimeout(() => {
      setResetting(true)
      setIndex(1)
    }, 850)
    return () => window.clearTimeout(timeout)
  }, [index, words.length])

  useEffect(() => {
    if (!resetting) return
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setResetting(false))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [resetting])

  return <h1 className="hero-word-ticker" aria-label={words.join('. ') + '.'}>
    <span className="hero-word-window" aria-hidden="true">
      <span className={`hero-word-track${resetting ? ' is-resetting' : ''}`} style={{ transform: `translateY(${(1 - index) * 0.96}em)` }}>
        {items.map((word, itemIndex) => <span className={`hero-word${itemIndex === index ? ' is-active' : ''}${Math.abs(itemIndex - index) === 1 ? ' is-adjacent' : ''}`} key={`${word}-${itemIndex}`}>{word}</span>)}
      </span>
    </span>
  </h1>
}
