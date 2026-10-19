import { useEffect, useRef, useState, type CSSProperties } from 'react'

export default function ScrollMorph() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)))
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    update()
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const eased = progress * progress * (3 - 2 * progress)
  const circleStyle = {
    '--morph-size': `${129 + eased * 75}vmax`,
    '--morph-y': `${230 - eased * 180}%`,
  } as CSSProperties

  return <section className="scroll-morph" ref={sectionRef} aria-hidden="true">
    <div className="scroll-morph-sticky">
      <div className="scroll-morph-circle" style={circleStyle}/>
    </div>
  </section>
}
