import { useEffect, useState } from 'react'

export default function PagePreloader() {
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'done'>('draw')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }

    const revealTimer = window.setTimeout(() => setPhase('reveal'), 1850)
    const doneTimer = window.setTimeout(() => setPhase('done'), 2700)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return <div className={`page-preloader${phase === 'reveal' ? ' is-revealing' : ''}`} role="status" aria-label="Loading Gehan Malshan's portfolio">
    <div className="scribble-loader" aria-hidden="true">
      <svg className="scribble-mark" viewBox="0 0 280 120" fill="none">
        <path id="scribble-path" className="scribble-path" d="M18 77 C34 21 58 20 70 73 C80 111 94 102 104 57 C115 8 141 9 148 62 C154 106 174 108 186 55 C197 10 222 18 226 64 C230 100 244 102 262 50"/>
        <circle className="scribble-dot" r="7">
          <animateMotion dur="1.25s" begin="0.12s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1">
            <mpath href="#scribble-path"/>
          </animateMotion>
        </circle>
      </svg>
      <span className="scribble-spark scribble-spark-a"/>
      <span className="scribble-spark scribble-spark-b"/>
      <span className="scribble-flood"/>
      <span className="scribble-label">GEHAN</span>
    </div>
  </div>
}
