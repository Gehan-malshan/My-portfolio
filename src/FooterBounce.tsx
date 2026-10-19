import { useEffect, useRef } from 'react'

const WIDTH = 1600
const HEIGHT = 150

function footerPath(depth: number) {
  const y = Math.max(-10, depth)
  return `M0 0 C320 0 350 ${y} 800 ${y} S1280 0 1600 0 V${HEIGHT} H0 Z`
}

export default function FooterBounce() {
  const hostRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const lineRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const path = pathRef.current
    if (!host || !path) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let depth = 0
    let speed = 0
    let lastScrollY = window.scrollY
    let lastScrollAt = performance.now()
    let scrollVelocity = 0

    const render = () => {
      path.setAttribute('d', footerPath(depth))
      lineRef.current?.setAttribute('d', `M0 0 C320 0 350 ${Math.max(-10, depth)} 800 ${Math.max(-10, depth)} S1280 0 1600 0`)
    }

    const animate = () => {
      const spring = -depth * 0.045
      speed = (speed + spring) * 0.86
      depth += speed
      render()

      if (Math.abs(depth) > 0.08 || Math.abs(speed) > 0.08) {
        frame = requestAnimationFrame(animate)
      } else {
        depth = 0
        speed = 0
        render()
        frame = 0
      }
    }

    const bounce = () => {
      if (reducedMotion) {
        depth = 0
        render()
        return
      }
      cancelAnimationFrame(frame)
      const force = Math.min(120, 58 + Math.abs(scrollVelocity) * 0.018)
      depth = force
      speed = -Math.min(7, Math.abs(scrollVelocity) * 0.001)
      render()
      frame = requestAnimationFrame(animate)
    }

    const onScroll = () => {
      const now = performance.now()
      const elapsed = Math.max(16, now - lastScrollAt)
      scrollVelocity = ((window.scrollY - lastScrollY) / elapsed) * 1000
      lastScrollY = window.scrollY
      lastScrollAt = now
    }

    let wasVisible = false
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !wasVisible) bounce()
      wasVisible = entry.isIntersecting
    }, { threshold: 0 })

    window.addEventListener('scroll', onScroll, { passive: true })
    observer.observe(host)
    render()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="footer-bounce" ref={hostRef} aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="footer-bounce-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#303030" />
            <stop offset="0.2" stopColor="#171717" />
            <stop offset="1" stopColor="#050505" />
          </linearGradient>
        </defs>
        <path ref={pathRef} fill="url(#footer-bounce-gradient)" />
        <path ref={lineRef} className="footer-bounce-line" fill="none" stroke="#545454" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}
