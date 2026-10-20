import { useEffect, useRef } from 'react'
import { spiralTechnologySlugs, technologies } from './technologies'
import './SpiralTechGallery.css'

const galleryItems = spiralTechnologySlugs.map(slug => ({
  slug,
  name: technologies.find(([, icon]) => icon === slug)?.[0] ?? slug,
}))

export default function SpiralTechGallery() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = [...root.querySelectorAll<HTMLElement>('.spiral-tech-card')]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let start = 0
    let pausedAt = 0
    let visible = false

    const draw = (now: number) => {
      if (!start) start = now
      const elapsed = motion.matches ? 0 : (pausedAt || now) - start
      const radius = Math.min(170, root.clientWidth * .31)
      const travel = Math.min(570, root.clientHeight * .78)
      cards.forEach((card, index) => {
        const phase = ((index / cards.length + elapsed / 44000) % 1 + 1) % 1
        const angle = phase * Math.PI * 4
        const x = Math.sin(angle) * radius
        const y = (phase - .5) * travel
        const depth = Math.cos(angle)
        const edge = Math.min(1, (1 - Math.abs(phase - .5) * 2) * 5)
        card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),${(depth * 95).toFixed(1)}px) scale(${(.81 + (depth + 1) * .13).toFixed(3)})`
        card.style.opacity = `${Math.max(.07, (.35 + (depth + 1) * .3) * edge).toFixed(3)}`
        card.style.zIndex = `${Math.round((depth + 1) * 10)}`
      })
      if (visible) frame = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(draw)
    }, { rootMargin: '150px' })
    observer.observe(root)
    const pause = () => { pausedAt = performance.now() }
    const resume = () => { if (pausedAt) start += performance.now() - pausedAt; pausedAt = 0 }
    root.addEventListener('pointerenter', pause)
    root.addEventListener('pointerleave', resume)
    root.addEventListener('focusin', pause)
    root.addEventListener('focusout', resume)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      root.removeEventListener('pointerenter', pause)
      root.removeEventListener('pointerleave', resume)
      root.removeEventListener('focusin', pause)
      root.removeEventListener('focusout', resume)
    }
  }, [])

  return <div className="spiral-tech" ref={rootRef} role="list" aria-label="Tools and technologies in a rotating spiral">
    <div className="spiral-tech-axis" aria-hidden="true"/>
    {galleryItems.map(({ slug, name }) => <div className="spiral-tech-card" role="listitem" tabIndex={0} key={slug} title={name}>
      <img src={`/tech-png/${slug}.png`} alt={name} loading="lazy" decoding="async" draggable={false}/>
      <span>{name}</span>
    </div>)}
    <div className="spiral-tech-caption" aria-hidden="true">A few tools I work with <span>↗</span></div>
  </div>
}
