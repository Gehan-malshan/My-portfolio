import { useEffect, useRef } from 'react'

type EducationItem = {
  period: string
  title: string
  institution: string
  description: string
}

function EducationStep({ item, index }: { item: EducationItem; index: number }) {
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      card.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) card.classList.add('is-visible')
    }, { threshold: 0.28 })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <article className="education-step-card" ref={cardRef}>
      <span className="education-step-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="education-progress-rail" aria-hidden="true"><i /></span>
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
