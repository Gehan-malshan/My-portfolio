import { useEffect, useRef } from 'react'
import GridTrails from './GridTrails'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  width: number
}

type Ripple = { x: number; y: number; radius: number; life: number }

export default function HeroEffects() {
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    const canvas = canvasRef.current
    const hero = grid?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!grid || !canvas || !hero || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const particles: Particle[] = []
    const ripples: Ripple[] = []
    let width = 0
    let height = 0
    let frame = 0
    let lastFrame = 0
    let idleTimer = 0
    let previousPointer: { x: number; y: number } | null = null
    let pointer = { x: -1000, y: -1000 }

    const resize = () => {
      const bounds = hero.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const fadeGrid = () => {
      window.clearTimeout(idleTimer)
      grid.classList.remove('is-active')
      previousPointer = null
    }

    const lightGrid = () => {
      grid.classList.add('is-active')
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(fadeGrid, 650)
    }

    const addInk = (x: number, y: number, dx: number, dy: number, burst: boolean) => {
      const count = burst ? 54 : Math.min(9, Math.max(3, Math.round(Math.hypot(dx, dy) / 5)))
      for (let i = 0; i < count; i++) {
        const angle = burst ? (i / count) * Math.PI * 2 + Math.random() * 0.25 : Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.8
        const speed = burst ? 1.5 + Math.random() * 4.7 : 0.7 + Math.random() * 1.8
        const maxLife = burst ? 900 + Math.random() * 550 : 580 + Math.random() * 550
        particles.push({
          x: x + (Math.random() - 0.5) * (burst ? 9 : 5),
          y: y + (Math.random() - 0.5) * (burst ? 9 : 5),
          vx: Math.cos(angle) * speed + (burst ? 0 : dx * 0.065),
          vy: Math.sin(angle) * speed + (burst ? 0 : dy * 0.065),
          life: maxLife,
          maxLife,
          width: burst ? 1.3 + Math.random() * 3.2 : 1.1 + Math.random() * 2.5,
        })
      }
      if (particles.length > 260) particles.splice(0, particles.length - 260)
    }

    const draw = (now: number) => {
      const delta = Math.min(now - (lastFrame || now), 40)
      const step = delta / 16.67
      lastFrame = now
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'screen'
      ctx.lineCap = 'round'

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.life -= delta
        if (particle.life <= 0) { particles.splice(i, 1); continue }
        const oldX = particle.x
        const oldY = particle.y
        const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
        if (distance < 145 && distance > 1) {
          const swirl = (1 - distance / 145) * 0.045 * step
          particle.vx += -(particle.y - pointer.y) / distance * swirl
          particle.vy += (particle.x - pointer.x) / distance * swirl
        }
        particle.x += particle.vx * step
        particle.y += particle.vy * step
        particle.vx *= Math.pow(0.975, step)
        particle.vy *= Math.pow(0.975, step)
        const alpha = Math.pow(particle.life / particle.maxLife, 1.55) * 0.64
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx.lineWidth = particle.width * (0.45 + particle.life / particle.maxLife)
        ctx.shadowColor = 'rgba(255,255,255,0.8)'
        ctx.shadowBlur = 13
        ctx.beginPath()
        ctx.moveTo(oldX, oldY)
        ctx.lineTo(particle.x, particle.y)
        ctx.stroke()
      }

      ctx.shadowBlur = 0
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        ripple.life -= delta
        if (ripple.life <= 0) { ripples.splice(i, 1); continue }
        ripple.radius += 2.8 * step
        ctx.strokeStyle = `rgba(255,255,255,${(ripple.life / 500) * 0.45})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
      frame = particles.length || ripples.length ? requestAnimationFrame(draw) : 0
    }

    const startDrawing = () => {
      if (!frame) { lastFrame = 0; frame = requestAnimationFrame(draw) }
    }

    const localPoint = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect()
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }

    const onMove = (event: PointerEvent) => {
      if (reducedMotion) return
      if (event.pointerType === 'touch') return
      const point = localPoint(event)
      if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) return
      lightGrid()
      pointer = point
      const dx = previousPointer ? point.x - previousPointer.x : 0
      const dy = previousPointer ? point.y - previousPointer.y : 0
      if (Math.hypot(dx, dy) > 2) {
        addInk(point.x, point.y, dx, dy, false)
        startDrawing()
      }
      previousPointer = point
    }

    const onDown = (event: PointerEvent) => {
      if (reducedMotion) return
      const point = localPoint(event)
      lightGrid()
      pointer = point
      addInk(point.x, point.y, 0, 0, true)
      ripples.push({ x: point.x, y: point.y, radius: 7, life: 500 })
      startDrawing()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(hero)
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerdown', onDown, { passive: true })
    hero.addEventListener('pointerleave', fadeGrid)
    window.addEventListener('blur', fadeGrid)

    return () => {
      window.clearTimeout(idleTimer)
      cancelAnimationFrame(frame)
      observer.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerdown', onDown)
      hero.removeEventListener('pointerleave', fadeGrid)
      window.removeEventListener('blur', fadeGrid)
    }
  }, [])

  return <>
    <div className="hero-grid" ref={gridRef} aria-hidden="true"><GridTrails background="#000000" lineColor="#171717" accent="#ffffff" cellSize={72} lights={0} trailLength={4} glow={70} hover={85}/></div>
    <canvas className="hero-splash" ref={canvasRef} aria-hidden="true" />
  </>
}
