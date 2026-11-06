import { useEffect, useState } from 'react'
import Signature from './components/ui/signature'

const openedOnLandingPage = window.location.pathname === '/'
let hasEnteredLandingPage = false

export default function PagePreloader() {
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'done'>(() =>
    openedOnLandingPage && !hasEnteredLandingPage ? 'draw' : 'done',
  )

  useEffect(() => {
    hasEnteredLandingPage = true
    if (phase === 'done') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }

    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1650)
    const doneTimer = window.setTimeout(() => setPhase('done'), 2500)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return <div className={`page-preloader${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label="Loading Gehan Malshan's portfolio">
    <div className="signature-loader">
      <Signature color="#f5f5f5" duration={0.65} stagger={0.13}/>
    </div>
  </div>
}
