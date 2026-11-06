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
    let visible = false
    let manualOffset = 0
    let pointer: { id: number; y: number } | null = null

    const draw = (now: number) => {
      if (!start) start = now
      const elapsed = motion.matches ? 0 : now - start
      const radius = Math.min(210, root.clientWidth * .37)
      const travel = Math.min(590, root.clientHeight * .82)
      cards.forEach((card, index) => {
        const phase = ((index / cards.length + elapsed / 44000 + manualOffset) % 1 + 1) % 1
        const angle = phase * Math.PI * 4
        const x = Math.sin(angle) * radius
        const y = (phase - .5) * travel
        const depth = Math.cos(angle)
        const edge = Math.min(1, (1 - Math.abs(phase - .5) * 2) * 5)
        card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),${(depth * 95).toFixed(1)}px) scale(${(.81 + (depth + 1) * .13).toFixed(3)})`
        card.style.opacity = `${Math.max(.18, (.58 + (depth + 1) * .18) * edge).toFixed(3)}`
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
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pointer = { id: event.pointerId, y: event.clientY }
      root.setPointerCapture(event.pointerId)
      root.dataset.dragging = 'true'
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return
      manualOffset += (event.clientY - pointer.y) / Math.max(300, root.clientHeight)
      pointer.y = event.clientY
    }
    const onPointerEnd = (event: PointerEvent) => {
      if (pointer?.id !== event.pointerId) return
      pointer = null
      delete root.dataset.dragging
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      event.preventDefault()
      manualOffset += event.key === 'ArrowDown' ? .035 : -.035
    }
    root.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerup', onPointerEnd)
    root.addEventListener('pointercancel', onPointerEnd)
    root.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerup', onPointerEnd)
      root.removeEventListener('pointercancel', onPointerEnd)
      root.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return <div className="spiral-tech" ref={rootRef} role="list" aria-label="Tools and technologies in a rotating spiral. Drag or use arrow keys to browse." tabIndex={0}>
    {galleryItems.map(({ slug, name }) => <div className="spiral-tech-card" role="listitem" key={slug} title={name}>
      <img src={`/tech-png/${slug}.png`} alt={name} loading="lazy" decoding="async" draggable={false}/>
    </div>)}
  </div>
}
