import { useEffect, useRef } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export default function HeroScrollIntro() {
  const hostRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const name = nameRef.current
    const hero = host?.closest<HTMLElement>('.hero')
    const stage = host?.closest<HTMLElement>('.hero-scroll-stage')
    if (!host || !name || !hero || !stage) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const update = () => {
      frame = 0
      const range = Math.max(1, stage.offsetHeight - window.innerHeight)
      const progress = reducedMotion ? 1 : clamp(-stage.getBoundingClientRect().top / range)
      const reveal = clamp((progress - 0.16) / 0.62)
      const eased = 1 - Math.pow(1 - progress, 3)
      const compactScale = window.innerWidth < 700 ? 0.23 : 0.18
      const scale = 1 - eased * (1 - compactScale)
      const travel = window.innerWidth < 700 ? -window.innerHeight * 0.23 : -64

      name.style.transform = `translate3d(0, ${travel * eased}px, 0) scale(${scale})`
      host.style.setProperty('--intro-shade', String(1 - reveal))
      host.style.setProperty('--intro-cue-opacity', String(1 - clamp(progress / 0.24)))
      host.style.setProperty('--intro-name-opacity', String(1 - clamp((progress - 0.7) / 0.22)))
      host.style.setProperty('--intro-brand-opacity', String(clamp((progress - 0.62) / 0.28)))
      hero.style.setProperty('--hero-reveal', String(reveal))
      hero.style.setProperty('--hero-reveal-y', `${(1 - reveal) * 34}px`)
      hero.style.setProperty('--hero-grid-opacity', String(0.34 * reveal))
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
      hero.style.removeProperty('--hero-reveal')
      hero.style.removeProperty('--hero-reveal-y')
      hero.style.removeProperty('--hero-grid-opacity')
    }
  }, [])

  return (
    <div className="hero-scroll-intro" ref={hostRef} aria-hidden="true">
      <div className="hero-scroll-shade" />
      <div className="hero-scroll-name" ref={nameRef}><span>GEHAN</span> <span>MALSHAN</span></div>
      <div className="hero-scroll-brand">GEHAN MALSHAN</div>
      <div className="hero-scroll-cue"><i /> Scroll to enter</div>
    </div>
  )
}
