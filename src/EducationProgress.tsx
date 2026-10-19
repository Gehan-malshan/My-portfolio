import { useEffect, useRef } from 'react'

type EducationItem = {
  period: string
  title: string
  institution: string
  description: string
}

function EducationStep({ item, index }: { item: EducationItem; index: number }) {
  const cardRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const progressBar = progressRef.current
    if (!card || !progressBar) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const update = () => {
      frame = 0
      if (reducedMotion) {
        progressBar.style.transform = 'translateY(0)'
        card.style.opacity = '1'
        card.style.transform = 'none'
        return
      }

      const bounds = card.getBoundingClientRect()
      const start = window.innerHeight * 0.9
      const end = window.innerHeight * 0.24
      const progress = Math.min(1, Math.max(0, (start - bounds.top) / (start - end)))
      const eased = 1 - Math.pow(1 - progress, 3)
      progressBar.style.transform = `translateY(${(eased - 1) * 101}%)`
      card.style.opacity = String(0.55 + eased * 0.45)
      card.style.transform = `translate3d(0, ${(1 - eased) * 26}px, 0)`
    }

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <article className="education-step-card" ref={cardRef}>
      <span className="education-step-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="education-progress-rail" aria-hidden="true"><i ref={progressRef} /></span>
      <div className="education-step-content">
        <div className="education-step-meta">
          <span>{item.institution}</span>
          <time>{item.period}</time>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  )
}

export default function EducationProgress({ items }: { items: EducationItem[] }) {
  return <div className="education-steps">{items.map((item, index) => <EducationStep item={item} index={index} key={`${item.title}-${index}`}/>)}</div>
}
