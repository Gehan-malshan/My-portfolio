import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import './LogoLoop.css'

// A small local adaptation of the React Bits Logo Loop interaction.
// https://www.reactbits.dev/animations/logo-loop

type LogoItem = { src: string; alt: string; title?: string }

type LogoLoopProps = {
  logos: readonly LogoItem[]
  ariaLabel: string
  className?: string
  speed?: number
  direction?: 'left' | 'right'
  logoHeight?: number
  gap?: number
  fadeOut?: boolean
  muted?: number
  labels?: 'none' | 'hover'
  scaleOnHover?: boolean
}

const wrap = (value: number, length: number) => length ? ((value % length) + length) % length : 0

export default function LogoLoop({
  logos,
  ariaLabel,
  className = '',
  speed = 80,
  direction = 'left',
  logoHeight = 48,
  gap = 42,
  fadeOut = true,
  muted = 0.5,
  labels = 'hover',
  scaleOnHover = true,
}: LogoLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef<HTMLUListElement>(null)
  const offsetRef = useRef(0)
  const periodRef = useRef(0)
  const pointerRef = useRef<{ id: number; x: number } | null>(null)
  const slotWidth = logoHeight + 16
  const style = {
    '--logo-loop-height': `${logoHeight}px`,
    '--logo-loop-slot': `${slotWidth}px`,
    '--logo-loop-gap': `${gap}px`,
    '--logo-loop-opacity': `${1 - Math.min(1, Math.max(0, muted)) * 0.2}`,
  } as CSSProperties

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const sequence = sequenceRef.current
    if (!root || !track || !sequence) return

    const render = () => {
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
    }
    const measure = () => {
      periodRef.current = sequence.getBoundingClientRect().width
      offsetRef.current = wrap(offsetRef.current, periodRef.current)
      render()
    }
    const move = (distance: number) => {
      offsetRef.current = wrap(offsetRef.current + distance, periodRef.current)
      render()
    }
    const onWheel = (event: WheelEvent) => {
      const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY
      if (!distance || !periodRef.current) return
      event.preventDefault()
      move(distance)
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(sequence)
    root.addEventListener('wheel', onWheel, { passive: false })

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId = 0
    let previousTime = 0
    const animate = (time: number) => {
      if (previousTime && !reducedMotion.matches && periodRef.current) {
        const elapsed = Math.min(time - previousTime, 64) / 1000
        move((direction === 'left' ? 1 : -1) * speed * elapsed)
      }
      previousTime = time
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      root.removeEventListener('wheel', onWheel)
    }
  }, [direction, speed])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    pointerRef.current = { id: event.pointerId, x: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = 'true'
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current
    if (!pointer || pointer.id !== event.pointerId || !periodRef.current) return
    offsetRef.current = wrap(offsetRef.current - (event.clientX - pointer.x), periodRef.current)
    pointer.x = event.clientX
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
  }
  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current?.id !== event.pointerId) return
    pointerRef.current = null
    delete event.currentTarget.dataset.dragging
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const distance = (slotWidth + gap) * (event.key === 'ArrowRight' ? 1 : -1)
    offsetRef.current = wrap(offsetRef.current + distance, periodRef.current)
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
  }

  return <div
    ref={rootRef}
    className={`logo-loop${fadeOut ? ' logo-loop-fade' : ''}${muted > 0 ? ' logo-loop-muted' : ''}${scaleOnHover ? ' logo-loop-scale' : ''} ${className}`}
    style={style}
    role="region"
    aria-label={ariaLabel}
    tabIndex={0}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerEnd}
    onPointerCancel={onPointerEnd}
    onKeyDown={onKeyDown}
  >
    <div className="logo-loop-track" ref={trackRef}>
      {[0, 1].map(copy => <ul className="logo-loop-sequence" ref={copy === 0 ? sequenceRef : undefined} key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {logos.map(({ src, alt, title }) => <li className="logo-loop-item" key={src} title={title ?? alt}>
          <img src={src} alt={copy === 0 ? alt : ''} loading="lazy" decoding="async" draggable={false}/>
          {labels === 'hover' && <span className="logo-loop-tip" aria-hidden="true">{title ?? alt}</span>}
        </li>)}
      </ul>)}
    </div>
  </div>
}
