import { useEffect, useState } from 'react'
import Signature from './components/ui/signature'

export default function PagePreloader() {
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'done'>('draw')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }

    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1900)
    const doneTimer = window.setTimeout(() => setPhase('done'), 2700)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return <div className={`page-preloader${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label="Loading Gehan Malshan's portfolio">
    <div className="signature-loader">
      <Signature color="#f5f5f5"/>
    </div>
  </div>
}
