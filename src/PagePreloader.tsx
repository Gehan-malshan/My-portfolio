import { useEffect, useState } from 'react'

export default function PagePreloader() {
  const [phase, setPhase] = useState<'cover' | 'reveal' | 'done'>('cover')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }

    const revealTimer = window.setTimeout(() => setPhase('reveal'), 750)
    const doneTimer = window.setTimeout(() => setPhase('done'), 2050)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return <div className={`page-preloader${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label="Loading portfolio">
    {Array.from({ length: 5 }, (_, index) => <span className="page-preloader-panel" key={index} aria-hidden="true" />)}
  </div>
}
