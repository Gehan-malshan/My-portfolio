import { useEffect, useState } from 'react'
import Signature from './components/ui/signature'

export default function PagePreloader() {
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'done'>('draw')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }

    const revealTimer = window.setTimeout(() => setPhase('reveal'), 2550)
    const doneTimer = window.setTimeout(() => setPhase('done'), 3350)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return <div className={`page-preloader${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label="Loading Gehan Malshan's portfolio">
    <div className="signature-loader">
      <Signature color="#f5f5f5" duration={0.65} stagger={0.13}/>
      <span className="scribble-dot" aria-hidden="true"/>
      <span className="scribble-spark scribble-spark-a" aria-hidden="true"/>
      <span className="scribble-spark scribble-spark-b" aria-hidden="true"/>
      <span className="scribble-flood" aria-hidden="true"/>
      <span className="scribble-label" aria-hidden="true">GEHAN</span>
    </div>
  </div>
}
