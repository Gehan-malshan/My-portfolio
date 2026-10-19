import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const distance = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const top = window.scrollY || document.documentElement.scrollTop
      setProgress(distance ? Math.min(100, Math.max(0, top / distance * 100)) : 0)
      setVisible(top > 100)
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <button
    className={`back-to-top${visible ? ' is-visible' : ''}`}
    type="button"
    aria-label="Back to top"
    title="Back to top"
    disabled={!visible}
    onClick={scrollToTop}
  >
    <svg className="back-to-top-progress" viewBox="0 0 72 72" aria-hidden="true">
      <circle className="back-to-top-track" cx="36" cy="36" r="32"/>
      <circle className="back-to-top-value" cx="36" cy="36" r="32" pathLength="100" strokeDasharray={`${progress} 100`}/>
    </svg>
    <ArrowUp size={22} strokeWidth={1.8} aria-hidden="true"/>
  </button>
}
